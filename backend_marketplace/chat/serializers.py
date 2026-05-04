from rest_framework import serializers

from .models import Conversacion, Mensaje


class EmisorSerializer(serializers.Serializer):
    nombre_completo = serializers.CharField(source='perfil.nombre_completo')
    iniciales = serializers.SerializerMethodField()

    def get_iniciales(self, obj):
        f = obj.first_name[:1] if obj.first_name else ''
        l = obj.last_name[:1] if obj.last_name else ''
        return f'{f}{l}'.upper()


class MensajeSerializer(serializers.ModelSerializer):
    emisor = EmisorSerializer(read_only=True)

    class Meta:
        model = Mensaje
        fields = ['id', 'contenido', 'emisor', 'leido', 'created_at']


class ConversacionListSerializer(serializers.ModelSerializer):
    publicacion_titulo = serializers.CharField(
        source='contrato.propuesta.publicacion.titulo', read_only=True
    )
    contrato_id = serializers.UUIDField(source='contrato.id', read_only=True)
    cliente = EmisorSerializer(source='contrato.cliente', read_only=True)
    freelancer = EmisorSerializer(source='contrato.freelancer', read_only=True)
    ultimo_mensaje = serializers.SerializerMethodField()
    mensajes_no_leidos = serializers.SerializerMethodField()

    class Meta:
        model = Conversacion
        fields = [
            'id', 'contrato_id', 'publicacion_titulo',
            'cliente', 'freelancer',
            'ultimo_mensaje', 'mensajes_no_leidos', 'created_at',
        ]

    def get_ultimo_mensaje(self, obj):
        msg = obj.mensajes.last()
        if msg:
            return MensajeSerializer(msg).data
        return None

    def get_mensajes_no_leidos(self, obj):
        request = self.context.get('request')
        if not request:
            return 0
        return obj.mensajes.filter(leido=False).exclude(emisor=request.user).count()


class ConversacionDetailSerializer(ConversacionListSerializer):
    mensajes = MensajeSerializer(many=True, read_only=True)

    class Meta(ConversacionListSerializer.Meta):
        fields = ConversacionListSerializer.Meta.fields + ['mensajes']
