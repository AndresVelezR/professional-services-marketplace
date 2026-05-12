import re

from rest_framework import serializers

from publicaciones.models import Publicacion

from .services import build_public_service_detail_url


SHORT_DESCRIPTION_MAX_LENGTH = 180
EMAIL_PATTERN = re.compile(r'[\w.+-]+@[\w-]+(?:\.[\w-]+)+')


class PublicServiceFeedSerializer(serializers.ModelSerializer):
    title = serializers.CharField(source='titulo')
    category = serializers.CharField(source='categoria')
    price = serializers.DecimalField(
        source='precio',
        max_digits=10,
        decimal_places=2,
    )
    creator_name = serializers.SerializerMethodField()
    short_description = serializers.SerializerMethodField()
    detail_url = serializers.SerializerMethodField()

    class Meta:
        model = Publicacion
        fields = [
            'id',
            'title',
            'category',
            'price',
            'creator_name',
            'short_description',
            'detail_url',
            'created_at',
        ]

    def get_creator_name(self, obj):
        perfil = getattr(obj.creador, 'perfil', None)
        if perfil and perfil.nombre_completo:
            return perfil.nombre_completo

        full_name = obj.creador.get_full_name().strip()
        if full_name:
            return full_name

        return 'Marketplace creator'

    def get_short_description(self, obj):
        cleaned = re.sub(r'\s+', ' ', obj.descripcion).strip()
        cleaned = EMAIL_PATTERN.sub('[contact hidden]', cleaned)

        if len(cleaned) <= SHORT_DESCRIPTION_MAX_LENGTH:
            return cleaned

        return f'{cleaned[: SHORT_DESCRIPTION_MAX_LENGTH - 3].rstrip()}...'

    def get_detail_url(self, obj):
        return build_public_service_detail_url(obj.id)
