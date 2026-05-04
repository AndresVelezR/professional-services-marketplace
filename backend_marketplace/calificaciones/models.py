import uuid
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from contratos.models import Contrato
from usuarios.models import Usuario


class Calificacion(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    contrato = models.ForeignKey(
        Contrato,
        on_delete=models.CASCADE,
        related_name='calificaciones'
    )
    calificador = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE,
        related_name='calificaciones_dadas'
    )
    calificado = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE,
        related_name='calificaciones_recibidas'
    )

    # Criterios
    calidad = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    comunicacion = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    puntualidad = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    comentario = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Calificacion'
        verbose_name_plural = 'Calificaciones'
        ordering = ['-created_at']
        # Cada usuario solo puede calificar una vez por contrato
        unique_together = ('contrato', 'calificador')

    def promedio(self):
        return round((self.calidad + self.comunicacion + self.puntualidad) / 3, 1)

    def __str__(self):
        return f'{self.calificador.email} → {self.calificado.email} ({self.promedio()}⭐)'