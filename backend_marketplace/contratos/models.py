import uuid

from django.db import models

from publicaciones.models import Publicacion
from usuarios.models import Usuario


class Propuesta(models.Model):
    class Estado(models.TextChoices):
        PENDIENTE = 'pendiente', 'Pendiente'
        ACEPTADA = 'aceptada', 'Aceptada'
        RECHAZADA = 'rechazada', 'Rechazada'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    publicacion = models.ForeignKey(
        Publicacion, on_delete=models.CASCADE, related_name='propuestas'
    )
    cliente = models.ForeignKey(
        Usuario, on_delete=models.CASCADE, related_name='propuestas_enviadas'
    )
    mensaje = models.TextField()
    precio_propuesto = models.DecimalField(max_digits=10, decimal_places=2)
    fecha_limite = models.DateField(null=True, blank=True)
    estado = models.CharField(
        max_length=20,
        choices=Estado.choices,
        default=Estado.PENDIENTE,
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Propuesta'
        verbose_name_plural = 'Propuestas'
        ordering = ['-created_at']

    def __str__(self):
        return f'Propuesta de {self.cliente.email} para {self.publicacion.titulo}'


class Contrato(models.Model):
    class Estado(models.TextChoices):
        ACTIVO = 'activo', 'Activo'
        COMPLETADO = 'completado', 'Completado'
        CANCELADO = 'cancelado', 'Cancelado'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    propuesta = models.OneToOneField(
        Propuesta, on_delete=models.CASCADE, related_name='contrato'
    )
    cliente = models.ForeignKey(
        Usuario, on_delete=models.CASCADE, related_name='contratos_como_cliente'
    )
    freelancer = models.ForeignKey(
        Usuario, on_delete=models.CASCADE, related_name='contratos_como_freelancer'
    )
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    fecha_inicio = models.DateField(auto_now_add=True)
    fecha_fin = models.DateField(null=True, blank=True)
    estado = models.CharField(
        max_length=20,
        choices=Estado.choices,
        default=Estado.ACTIVO,
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Contrato'
        verbose_name_plural = 'Contratos'
        ordering = ['-created_at']

    def __str__(self):
        return f'Contrato {self.cliente.email} - {self.freelancer.email}'
