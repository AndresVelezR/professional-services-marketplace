from django.db import transaction
from django.db.models import Q
from rest_framework.exceptions import NotFound, PermissionDenied, ValidationError

from chat.models import Conversacion
from publicaciones.models import Publicacion

from .models import Contrato, Propuesta


def get_propuestas_de_publicacion(publicacion_id):
    return Propuesta.objects.filter(
        publicacion_id=publicacion_id
    ).select_related('cliente', 'cliente__perfil')


def verificar_acceso_a_propuestas(publicacion_id, usuario):
    try:
        publicacion = Publicacion.objects.get(pk=publicacion_id)
    except Publicacion.DoesNotExist as exc:
        raise ValidationError({'detail': 'Publicación no encontrada.'}) from exc

    if publicacion.creador != usuario:
        raise PermissionDenied('Solo el creador puede ver las propuestas.')

    return publicacion


def obtener_publicacion(publicacion_id):
    try:
        return Publicacion.objects.get(pk=publicacion_id)
    except Publicacion.DoesNotExist as exc:
        raise NotFound('Publicación no encontrada.') from exc


@transaction.atomic
def crear_propuesta(publicacion, cliente, validated_data):
    if publicacion.estado != Publicacion.Estado.PUBLICADO:
        raise ValidationError({'detail': 'La publicación no está activa.'})

    if publicacion.creador == cliente:
        raise ValidationError({'detail': 'No puedes postularte a tu propia publicación.'})

    if Propuesta.objects.filter(
        publicacion=publicacion,
        cliente=cliente,
        estado=Propuesta.Estado.PENDIENTE,
    ).exists():
        raise ValidationError({
            'detail': 'Ya tienes una propuesta pendiente para esta publicación.',
        })

    return Propuesta.objects.create(
        publicacion=publicacion,
        cliente=cliente,
        **validated_data,
    )


def obtener_propuesta(pk):
    return Propuesta.objects.select_related(
        'publicacion', 'publicacion__creador', 'cliente', 'cliente__perfil'
    ).get(pk=pk)


def validar_acceso_a_propuesta(propuesta, usuario):
    if usuario not in (propuesta.cliente, propuesta.publicacion.creador):
        raise PermissionDenied()


@transaction.atomic
def responder_propuesta(propuesta, usuario, nuevo_estado):
    if propuesta.publicacion.creador != usuario:
        raise PermissionDenied('Solo el creador de la publicación puede responder.')

    if propuesta.estado != Propuesta.Estado.PENDIENTE:
        raise ValidationError({'detail': 'Esta propuesta ya fue respondida.'})

    if nuevo_estado not in (Propuesta.Estado.ACEPTADA, Propuesta.Estado.RECHAZADA):
        raise ValidationError({'detail': 'Estado inválido. Use "aceptada" o "rechazada".'})

    propuesta.estado = nuevo_estado
    propuesta.save(update_fields=['estado'])

    if nuevo_estado == Propuesta.Estado.ACEPTADA:
        contrato = Contrato.objects.create(
            propuesta=propuesta,
            cliente=propuesta.cliente,
            freelancer=propuesta.publicacion.creador,
            precio=propuesta.precio_propuesto,
        )
        Conversacion.objects.create(contrato=contrato)
        Propuesta.objects.filter(
            publicacion=propuesta.publicacion,
            estado=Propuesta.Estado.PENDIENTE,
        ).exclude(pk=propuesta.pk).update(estado=Propuesta.Estado.RECHAZADA)

    return propuesta


def get_mis_propuestas_enviadas(usuario):
    return Propuesta.objects.filter(
        cliente=usuario,
    ).select_related('cliente', 'cliente__perfil', 'publicacion').order_by('-created_at')


def get_mis_propuestas_recibidas(usuario):
    return Propuesta.objects.filter(
        publicacion__creador=usuario,
        estado=Propuesta.Estado.PENDIENTE,
    ).select_related('cliente', 'cliente__perfil', 'publicacion')


def get_mis_contratos(usuario):
    return Contrato.objects.filter(
        Q(cliente=usuario) | Q(freelancer=usuario)
    ).select_related(
        'cliente', 'cliente__perfil',
        'freelancer', 'freelancer__perfil',
        'propuesta__publicacion',
    )


def get_contrato_usuario(pk, usuario):
    return Contrato.objects.filter(
        Q(cliente=usuario) | Q(freelancer=usuario)
    ).select_related(
        'cliente', 'cliente__perfil',
        'freelancer', 'freelancer__perfil',
        'propuesta', 'propuesta__publicacion',
        'propuesta__cliente', 'propuesta__cliente__perfil',
    ).get(pk=pk)


@transaction.atomic
def actualizar_contrato(contrato, nuevo_estado):
    if nuevo_estado not in (Contrato.Estado.COMPLETADO, Contrato.Estado.CANCELADO):
        raise ValidationError({'detail': 'Estado inválido. Use "completado" o "cancelado".'})

    if contrato.estado != Contrato.Estado.ACTIVO:
        raise ValidationError({'detail': 'Este contrato ya fue finalizado.'})

    contrato.estado = nuevo_estado
    contrato.save(update_fields=['estado'])
    return contrato