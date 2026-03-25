from django.contrib import admin

from .models import Contrato, Propuesta


@admin.register(Propuesta)
class PropuestaAdmin(admin.ModelAdmin):
    list_display = ['cliente', 'publicacion', 'precio_propuesto', 'estado', 'created_at']
    list_filter = ['estado', 'created_at']
    search_fields = ['cliente__email', 'publicacion__titulo']
    raw_id_fields = ['publicacion', 'cliente']


@admin.register(Contrato)
class ContratoAdmin(admin.ModelAdmin):
    list_display = ['cliente', 'freelancer', 'precio', 'estado', 'fecha_inicio', 'created_at']
    list_filter = ['estado', 'fecha_inicio']
    search_fields = ['cliente__email', 'freelancer__email']
    raw_id_fields = ['propuesta', 'cliente', 'freelancer']
