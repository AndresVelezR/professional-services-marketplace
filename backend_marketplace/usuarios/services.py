from django.db import transaction

from .models import Perfil, Usuario


@transaction.atomic
def crear_usuario_con_perfil(validated_data):
    perfil_data = {
        'telefono': validated_data.pop('telefono', ''),
        'bio': validated_data.pop('bio', ''),
        'url_portafolio': validated_data.pop('url_portafolio', ''),
        'tipo_usuario': validated_data.pop('tipo_usuario'),
    }
    usuario = Usuario.objects.create_user(**validated_data)
    Perfil.objects.create(usuario=usuario, **perfil_data)
    return usuario


@transaction.atomic
def actualizar_perfil(perfil, validated_data):
    usuario_data = validated_data.pop('usuario', {})
    habilidades = validated_data.pop('habilidades', None)

    if usuario_data:
        for attr, value in usuario_data.items():
            setattr(perfil.usuario, attr, value)
        perfil.usuario.save()

    for attr, value in validated_data.items():
        setattr(perfil, attr, value)
    perfil.save()

    if habilidades is not None:
        perfil.habilidades.set(habilidades)

    return perfil


@transaction.atomic
def crear_experiencia(perfil, validated_data):
    return perfil.experiencias.create(**validated_data)