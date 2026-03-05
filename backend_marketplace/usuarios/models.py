import uuid

from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models


class UsuarioManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('El email es obligatorio')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)


class Usuario(AbstractUser):
    username = None
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = UsuarioManager()

    class Meta:
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'

    def __str__(self):
        return self.email


class Perfil(models.Model):
    class TipoUsuario(models.TextChoices):
        FREELANCER = 'freelancer', 'Freelancer'
        CLIENTE = 'cliente', 'Cliente'
        AMBOS = 'ambos', 'Ambos'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    usuario = models.OneToOneField(
        Usuario, on_delete=models.CASCADE, related_name='perfil'
    )
    telefono = models.CharField(max_length=20, blank=True)
    bio = models.TextField(blank=True)
    url_portafolio = models.URLField(blank=True)
    tipo_usuario = models.CharField(
        max_length=20,
        choices=TipoUsuario.choices,
        default=TipoUsuario.CLIENTE,
    )

    class Meta:
        verbose_name = 'Perfil'
        verbose_name_plural = 'Perfiles'

    @property
    def nombre_completo(self):
        return f'{self.usuario.first_name} {self.usuario.last_name}'.strip()

    def __str__(self):
        return f'{self.nombre_completo} ({self.tipo_usuario})'

    def actualizar_perfil(self, **datos):
        for campo, valor in datos.items():
            setattr(self, campo, valor)
        self.save()
