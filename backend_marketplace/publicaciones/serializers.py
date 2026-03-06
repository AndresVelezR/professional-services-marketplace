from rest_framework import serializers

from .models import Publicacion


class CreadorResumenSerializer(serializers.Serializer):
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


class PublicacionListSerializer(serializers.ModelSerializer):
    creador = CreadorResumenSerializer(read_only=True)

    class Meta:
        model = Publicacion
        fields = [
            'id', 'titulo', 'categoria', 'precio', 'imagen_url',
            'tiempo_entrega', 'creador', 'created_at',
        ]


class PublicacionDetailSerializer(serializers.ModelSerializer):
    creador = CreadorDetalleSerializer(read_only=True)

    class Meta:
        model = Publicacion
        fields = [
            'id', 'titulo', 'descripcion', 'categoria', 'precio',
            'tiempo_entrega', 'incluye', 'imagen_url', 'estado',
            'creador', 'created_at', 'updated_at',
        ]


class PublicacionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Publicacion
        fields = [
            'titulo', 'descripcion', 'categoria', 'precio',
            'tiempo_entrega', 'incluye', 'imagen_url', 'estado',
        ]

    def create(self, validated_data):
        validated_data['creador'] = self.context['request'].user
        return super().create(validated_data)
