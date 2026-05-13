from rest_framework import serializers

from publicaciones.serializers import CreadorResumenSerializer

from .models import Contrato, Propuesta


class PropuestaCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Propuesta
        fields = ['id', 'mensaje', 'precio_propuesto', 'fecha_limite']
        read_only_fields = ['id']


class PropuestaListSerializer(serializers.ModelSerializer):
    cliente = CreadorResumenSerializer()
    publicacion_titulo = serializers.CharField(source='publicacion.titulo', read_only=True)
    publicacion_id = serializers.UUIDField(source='publicacion.id', read_only=True)

    class Meta:
        model = Propuesta
        fields = [
            'id', 'publicacion_id', 'publicacion_titulo', 'cliente',
            'mensaje', 'precio_propuesto', 'fecha_limite', 'estado', 'created_at',
        ]


class UsuarioContratoSerializer(serializers.Serializer):
    nombre_completo = serializers.CharField(source='perfil.nombre_completo')
    email = serializers.EmailField()
    iniciales = serializers.SerializerMethodField()

    def get_iniciales(self, obj):
        f = obj.first_name[:1] if obj.first_name else ''
        l = obj.last_name[:1] if obj.last_name else ''
        return f'{f}{l}'.upper()


class ContratoListSerializer(serializers.ModelSerializer):
    cliente = UsuarioContratoSerializer()
    freelancer = UsuarioContratoSerializer()
    publicacion_titulo = serializers.CharField(
        source='propuesta.publicacion.titulo', read_only=True
    )

    class Meta:
        model = Contrato
        fields = [
            'id', 'cliente', 'freelancer', 'publicacion_titulo',
            'precio', 'fecha_inicio', 'fecha_fin', 'estado', 'created_at',
        ]


class ContratoDetailSerializer(ContratoListSerializer):
    propuesta = PropuestaListSerializer()
    is_client = serializers.SerializerMethodField()
    is_freelancer = serializers.SerializerMethodField()

    class Meta(ContratoListSerializer.Meta):
        fields = ContratoListSerializer.Meta.fields + ['propuesta', 'is_client', 'is_freelancer']

    def get_is_client(self, obj):
        request = self.context.get('request')
        if request and request.user and request.user.is_authenticated:
            return obj.cliente_id == request.user.pk
        return False

    def get_is_freelancer(self, obj):
        request = self.context.get('request')
        if request and request.user and request.user.is_authenticated:
            return obj.freelancer_id == request.user.pk
        return False
