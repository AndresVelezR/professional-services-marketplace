import uuid

from django.db import models

from usuarios.models import Usuario


class PublicacionManager(models.Manager):
    def activas(self):
        return self.filter(estado='publicado')

    def por_categoria(self, categoria):
        return self.activas().filter(categoria=categoria)


class Publicacion(models.Model):
    class Estado(models.TextChoices):
        BORRADOR = 'borrador', 'Borrador'
        PUBLICADO = 'publicado', 'Publicado'
        CERRADO = 'cerrado', 'Cerrado'

    class Categoria(models.TextChoices):
        DISENO = 'diseno', 'Diseño Gráfico'
        DESARROLLO = 'desarrollo', 'Desarrollo Web'
        MARKETING = 'marketing', 'Marketing Digital'
        REDACCION = 'redaccion', 'Redacción'
        VIDEO = 'video', 'Video y Animación'
        OTRO = 'otro', 'Otro'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    titulo = models.CharField(max_length=200)
    descripcion = models.TextField()
    categoria = models.CharField(max_length=20, choices=Categoria.choices)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    tiempo_entrega = models.CharField(max_length=50)
    incluye = models.JSONField(default=list, blank=True)
    imagen_url = models.URLField(blank=True)
    estado = models.CharField(
        max_length=20,
        choices=Estado.choices,
        default=Estado.BORRADOR,
    )
    creador = models.ForeignKey(
        Usuario, on_delete=models.CASCADE, related_name='publicaciones'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = PublicacionManager()

    class Meta:
        verbose_name = 'Publicación'
        verbose_name_plural = 'Publicaciones'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['estado', '-created_at']),
            models.Index(fields=['categoria']),
        ]

    def __str__(self):
        return self.titulo
