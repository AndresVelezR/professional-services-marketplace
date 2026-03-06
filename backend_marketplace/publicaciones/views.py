from rest_framework import generics, permissions, status
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

from .models import Publicacion
from .serializers import (
    PublicacionCreateSerializer,
    PublicacionDetailSerializer,
    PublicacionListSerializer,
)


class PublicacionPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100


class EsCreadorOSoloLectura(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.creador == request.user


class PublicacionListCreateView(generics.ListCreateAPIView):
    pagination_class = PublicacionPagination

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return PublicacionCreateSerializer
        return PublicacionListSerializer

    def get_queryset(self):
        qs = Publicacion.objects.activas().select_related('creador__perfil')

        q = self.request.query_params.get('q')
        if q:
            qs = qs.filter(titulo__icontains=q)

        categoria = self.request.query_params.get('categoria')
        if categoria:
            qs = qs.filter(categoria=categoria)

        precio_min = self.request.query_params.get('precio_min')
        if precio_min:
            qs = qs.filter(precio__gte=precio_min)

        precio_max = self.request.query_params.get('precio_max')
        if precio_max:
            qs = qs.filter(precio__lte=precio_max)

        ordering = self.request.query_params.get('ordering')
        if ordering in ('precio', '-precio', '-created_at', 'created_at'):
            qs = qs.order_by(ordering)

        return qs


class PublicacionDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Publicacion.objects.select_related('creador__perfil')
    lookup_field = 'id'

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated(), EsCreadorOSoloLectura()]

    def get_serializer_class(self):
        if self.request.method in ('PUT', 'PATCH'):
            return PublicacionCreateSerializer
        return PublicacionDetailSerializer

    def destroy(self, request, *args, **kwargs):
        publicacion = self.get_object()
        publicacion.estado = 'cerrado'
        publicacion.save()
        return Response(status=status.HTTP_204_NO_CONTENT)
