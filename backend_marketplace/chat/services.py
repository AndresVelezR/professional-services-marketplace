from django.db.models import Q
from rest_framework.exceptions import PermissionDenied, ValidationError

from contratos.models import Contrato

from .models import Conversacion


def get_conversaciones_usuario(usuario):
    return Conversacion.objects.filter(
        Q(contrato__cliente=usuario) |
        Q(contrato__freelancer=usuario)
    ).select_related(
        'contrato', 'contrato__cliente', 'contrato__cliente__perfil',
        'contrato__freelancer', 'contrato__freelancer__perfil',
        'contrato__propuesta__publicacion',
    ).prefetch_related('mensajes').order_by('-created_at')


def get_conversacion_usuario(usuario):
    return Conversacion.objects.filter(
        Q(contrato__cliente=usuario) |
        Q(contrato__freelancer=usuario)
    ).select_related(
        'contrato', 'contrato__cliente', 'contrato__cliente__perfil',
        'contrato__freelancer', 'contrato__freelancer__perfil',
        'contrato__propuesta__publicacion',
    ).prefetch_related('mensajes__emisor__perfil')


def obtener_o_crear_conversacion(contrato_id, usuario):
    try:
        contrato = Contrato.objects.get(pk=contrato_id)
    except Contrato.DoesNotExist as exc:
        raise ValidationError({'detail': 'Contrato no encontrado.'}) from exc

    if usuario not in (contrato.cliente, contrato.freelancer):
        raise PermissionDenied('No tienes acceso a este contrato.')

    conversacion, _ = Conversacion.objects.get_or_create(contrato=contrato)
    return conversacion