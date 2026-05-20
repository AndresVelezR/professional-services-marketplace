from rest_framework import serializers

from calificaciones.models import Calificacion

from .models import ImagenPublicacion, Publicacion


class CreadorResumenSerializer(serializers.Serializer):
    id = serializers.UUIDField()
    nombre_completo = serializers.CharField(source='perfil.nombre_completo')
    iniciales = serializers.SerializerMethodField()

    def get_iniciales(self, obj):
        f = obj.first_name[:1] if obj.first_name else ''
        l = obj.last_name[:1] if obj.last_name else ''
        return f'{f}{l}'.upper()


class CreadorDetalleSerializer(CreadorResumenSerializer):
    email = serializers.EmailField()
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    bio = serializers.CharField(source='perfil.bio')
    tipo_usuario = serializers.CharField(source='perfil.tipo_usuario')


class ImagenPublicacionSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()

    class Meta:
        model = ImagenPublicacion
        fields = ['id', 'url', 'orden']

    def get_url(self, obj):
        request = self.context.get('request')
        if request and obj.imagen:
            return request.build_absolute_uri(obj.imagen.url)
        return ''


class PublicacionListSerializer(serializers.ModelSerializer):
    creador = CreadorResumenSerializer(read_only=True)
    imagenes = ImagenPublicacionSerializer(many=True, read_only=True)
    rating_promedio = serializers.SerializerMethodField()
    rating_total = serializers.SerializerMethodField()

    class Meta:
        model = Publicacion
        fields = [
            'id', 'titulo', 'categoria', 'precio',
            'tiempo_entrega', 'creador', 'imagenes', 'created_at',
            'rating_promedio', 'rating_total',
        ]

    def _calificaciones(self, obj):
        return Calificacion.objects.filter(contrato__propuesta__publicacion=obj)

    def get_rating_promedio(self, obj):
        qs = self._calificaciones(obj)
        if not qs.exists():
            return None
        total = sum(c.promedio() for c in qs)
        return round(total / qs.count(), 1)

    def get_rating_total(self, obj):
        return self._calificaciones(obj).count()


class MisPublicacionesSerializer(serializers.ModelSerializer):
    creador = CreadorResumenSerializer(read_only=True)
    imagenes = ImagenPublicacionSerializer(many=True, read_only=True)

    class Meta:
        model = Publicacion
        fields = [
            'id', 'titulo', 'categoria', 'precio',
            'tiempo_entrega', 'estado', 'creador', 'imagenes', 'created_at',
        ]


class PublicacionDetailSerializer(serializers.ModelSerializer):
    creador = CreadorDetalleSerializer(read_only=True)
    imagenes = ImagenPublicacionSerializer(many=True, read_only=True)
    is_owner = serializers.SerializerMethodField()
    rating_promedio = serializers.SerializerMethodField()
    rating_total = serializers.SerializerMethodField()

    class Meta:
        model = Publicacion
        fields = [
            'id', 'titulo', 'descripcion', 'categoria', 'precio',
            'tiempo_entrega', 'incluye', 'estado',
            'creador', 'imagenes', 'created_at', 'updated_at', 'is_owner',
            'rating_promedio', 'rating_total',
        ]

    def get_is_owner(self, obj):
        request = self.context.get('request')
        if request and request.user and request.user.is_authenticated:
            return obj.creador_id == request.user.pk
        return False

    def _calificaciones(self, obj):
        return Calificacion.objects.filter(contrato__propuesta__publicacion=obj)

    def get_rating_promedio(self, obj):
        qs = self._calificaciones(obj)
        if not qs.exists():
            return None
        total = sum(c.promedio() for c in qs)
        return round(total / qs.count(), 1)

    def get_rating_total(self, obj):
        return self._calificaciones(obj).count()


class PublicacionUpdateSerializer(serializers.ModelSerializer):
    incluye = serializers.ListField(
        child=serializers.CharField(),
        required=False,
    )

    class Meta:
        model = Publicacion
        fields = [
            'titulo', 'descripcion', 'categoria', 'precio',
            'tiempo_entrega', 'incluye',
        ]


class PublicacionCreateSerializer(serializers.ModelSerializer):
    imagenes = serializers.ListField(
        child=serializers.ImageField(),
        max_length=3,
        required=False,
        write_only=True,
    )
    incluye = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        default=list,
    )

    class Meta:
        model = Publicacion
        fields = [
            'id', 'titulo', 'descripcion', 'categoria', 'precio',
            'tiempo_entrega', 'incluye', 'estado',
            'imagenes',
        ]
        read_only_fields = ['id']

    def create(self, validated_data):
        imagenes = validated_data.pop('imagenes', [])
        validated_data['creador'] = self.context['request'].user
        publicacion = super().create(validated_data)

        for i, img in enumerate(imagenes[:3]):
            ImagenPublicacion.objects.create(
                publicacion=publicacion,
                imagen=img,
                orden=i,
            )

        return publicacion
