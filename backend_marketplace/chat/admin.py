from django.contrib import admin

from .models import Conversacion, Mensaje


@admin.register(Conversacion)
class ConversacionAdmin(admin.ModelAdmin):
    list_display = ['id', 'contrato', 'created_at']
    raw_id_fields = ['contrato']


@admin.register(Mensaje)
class MensajeAdmin(admin.ModelAdmin):
    list_display = ['emisor', 'conversacion', 'contenido', 'leido', 'created_at']
    list_filter = ['leido', 'created_at']
    search_fields = ['emisor__email', 'contenido']
    raw_id_fields = ['conversacion', 'emisor']
