from decimal import Decimal, InvalidOperation

from rest_framework import generics, permissions, status
from rest_framework.pagination import PageNumberPagination
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.response import Response

from .models import Publicacion
from .services import aplicar_filtros_publicaciones, cerrar_publicacion, crear_publicacion
from .serializers import (
    MisPublicacionesSerializer,
    PublicacionCreateSerializer,
    PublicacionDetailSerializer,
    PublicacionListSerializer,
    PublicacionUpdateSerializer,
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
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    pagination_class = PublicacionPagination

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return PublicacionCreateSerializer
        return PublicacionListSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        publicacion = crear_publicacion(serializer.validated_data, request.user)
        response_serializer = PublicacionCreateSerializer(publicacion)
        headers = self.get_success_headers(response_serializer.data)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def get_queryset(self):
        qs = Publicacion.objects.activas().select_related('creador__perfil').prefetch_related('imagenes')
        return aplicar_filtros_publicaciones(qs, self.request.query_params)


class MisPublicacionesView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = MisPublicacionesSerializer
    pagination_class = PublicacionPagination

    def get_queryset(self):
        return (
            Publicacion.objects
            .filter(creador=self.request.user)
            .select_related('creador__perfil')
            .prefetch_related('imagenes')
            .order_by('-created_at')
        )


class PublicacionDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Publicacion.objects.select_related('creador__perfil').prefetch_related('imagenes')
    lookup_field = 'id'

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated(), EsCreadorOSoloLectura()]

    def get_serializer_class(self):
        if self.request.method == 'PATCH':
            return PublicacionUpdateSerializer
        if self.request.method == 'PUT':
            return PublicacionCreateSerializer
        return PublicacionDetailSerializer

    def partial_update(self, request, *args, **kwargs):
        publicacion = self.get_object()
        serializer = PublicacionUpdateSerializer(publicacion, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            PublicacionDetailSerializer(publicacion, context={'request': request}).data
        )

    def destroy(self, request, *args, **kwargs):
        publicacion = self.get_object()
        cerrar_publicacion(publicacion)
        return Response(status=status.HTTP_204_NO_CONTENT)
