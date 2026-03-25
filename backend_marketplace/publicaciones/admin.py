from django.contrib import admin

from .models import ImagenPublicacion, Publicacion


class ImagenPublicacionInline(admin.TabularInline):
    model = ImagenPublicacion
    extra = 0
    max_num = 3
    fields = ('imagen', 'orden')


@admin.register(Publicacion)
class PublicacionAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'categoria', 'precio', 'estado', 'creador', 'created_at')
    list_filter = ('estado', 'categoria')
    search_fields = ('titulo', 'descripcion', 'creador__email')
    raw_id_fields = ('creador',)
    readonly_fields = ('created_at', 'updated_at')
    inlines = (ImagenPublicacionInline,)
    list_per_page = 25

    fieldsets = (
        (None, {'fields': ('titulo', 'descripcion', 'categoria')}),
        ('Detalles', {'fields': ('precio', 'tiempo_entrega', 'incluye', 'imagen_url')}),
        ('Estado', {'fields': ('estado', 'creador')}),
        ('Fechas', {'fields': ('created_at', 'updated_at')}),
    )


@admin.register(ImagenPublicacion)
class ImagenPublicacionAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'publicacion', 'orden', 'created_at')
    list_filter = ('created_at',)
    raw_id_fields = ('publicacion',)
