import uuid

from django.db import models

from contratos.models import Contrato
from usuarios.models import Usuario


class Conversacion(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    contrato = models.OneToOneField(
        Contrato, on_delete=models.CASCADE, related_name='conversacion'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Conversación'
        verbose_name_plural = 'Conversaciones'

    def __str__(self):
        return f'Conversación contrato {self.contrato_id}'


class Mensaje(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    conversacion = models.ForeignKey(
        Conversacion, on_delete=models.CASCADE, related_name='mensajes'
    )
    emisor = models.ForeignKey(
        Usuario, on_delete=models.CASCADE, related_name='mensajes_enviados'
    )
    contenido = models.TextField()
    leido = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']
        verbose_name = 'Mensaje'
        verbose_name_plural = 'Mensajes'

    def __str__(self):
        return f'{self.emisor.email}: {self.contenido[:40]}'
