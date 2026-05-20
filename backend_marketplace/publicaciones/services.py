from decimal import Decimal, InvalidOperation

from django.db import transaction
from rest_framework.exceptions import ValidationError

from .models import ImagenPublicacion, Publicacion


def parse_precio(valor, campo):
    try:
        return Decimal(valor)
    except (InvalidOperation, TypeError):
        raise ValidationError({campo: 'Debe ser un número válido.'})


def aplicar_filtros_publicaciones(queryset, query_params):
    q = query_params.get('q')
    if q:
        queryset = queryset.filter(titulo__icontains=q)

    categoria = query_params.get('categoria')
    if categoria:
        queryset = queryset.filter(categoria=categoria)

    precio_min = query_params.get('precio_min')
    if precio_min:
        queryset = queryset.filter(precio__gte=parse_precio(precio_min, 'precio_min'))

    precio_max = query_params.get('precio_max')
    if precio_max:
        queryset = queryset.filter(precio__lte=parse_precio(precio_max, 'precio_max'))

    ordering = query_params.get('ordering')
    if ordering in ('precio', '-precio', '-created_at', 'created_at'):
        queryset = queryset.order_by(ordering)

    return queryset


@transaction.atomic
def crear_publicacion(validated_data, creador):
    imagenes = validated_data.pop('imagenes', [])
    validated_data['creador'] = creador
    publicacion = Publicacion.objects.create(**validated_data)

    for indice, imagen in enumerate(imagenes[:3]):
        ImagenPublicacion.objects.create(
            publicacion=publicacion,
            imagen=imagen,
            orden=indice,
        )

    return publicacion


@transaction.atomic
def cerrar_publicacion(publicacion):
    publicacion.estado = Publicacion.Estado.CERRADO
    publicacion.save(update_fields=['estado'])
    return publicacion