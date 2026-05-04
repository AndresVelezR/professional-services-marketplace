from rest_framework import serializers
from .models import Calificacion
from contratos.models import Contrato


class CalificacionSerializer(serializers.ModelSerializer):
    promedio = serializers.SerializerMethodField()
    calificador_nombre = serializers.CharField(
        source='calificador.get_full_name', read_only=True
    )

    class Meta:
        model = Calificacion
        fields = [
            'id', 'contrato', 'calificador_nombre',
            'calidad', 'comunicacion', 'puntualidad',
            'promedio', 'comentario', 'created_at'
        ]
        read_only_fields = ['calificador', 'calificado', 'created_at']

    def get_promedio(self, obj):
        return obj.promedio()

    def validate(self, data):
        request = self.context['request']
        contrato = data['contrato']
        usuario = request.user

        # Solo contratos completados
        if contrato.estado != Contrato.Estado.COMPLETADO:
            raise serializers.ValidationError(
                "Solo puedes calificar contratos completados."
            )

        # Solo cliente o freelancer del contrato
        if usuario not in [contrato.cliente, contrato.freelancer]:
            raise serializers.ValidationError(
                "No eres parte de este contrato."
            )

        # No calificar dos veces
        if Calificacion.objects.filter(
            contrato=contrato,
            calificador=usuario
        ).exists():
            raise serializers.ValidationError(
                "Ya calificaste este contrato."
            )

        return data

    def create(self, validated_data):
        request = self.context['request']
        contrato = validated_data['contrato']
        calificador = request.user

        # Si eres cliente calificas al freelancer y viceversa
        calificado = (
            contrato.freelancer
            if calificador == contrato.cliente
            else contrato.cliente
        )

        return Calificacion.objects.create(
            calificador=calificador,
            calificado=calificado,
            **validated_data
        )