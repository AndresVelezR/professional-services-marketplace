from django.db import transaction
from django.db.models import Q
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from publicaciones.models import Publicacion

from .models import Contrato, Propuesta
from .serializers import (
    ContratoDetailSerializer,
    ContratoListSerializer,
    PropuestaCreateSerializer,
    PropuestaListSerializer,
)


class PropuestaListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return PropuestaCreateSerializer
        return PropuestaListSerializer

    def get_queryset(self):
        publicacion_id = self.kwargs['publicacion_id']
        return Propuesta.objects.filter(
            publicacion_id=publicacion_id
        ).select_related('cliente', 'cliente__perfil')

    def list(self, request, *args, **kwargs):
        publicacion_id = self.kwargs['publicacion_id']
        try:
            publicacion = Publicacion.objects.get(pk=publicacion_id)
        except Publicacion.DoesNotExist:
            return Response(
                {'detail': 'Publicación no encontrada.'},
                status=status.HTTP_404_NOT_FOUND,
            )
        if publicacion.creador != request.user:
            return Response(
                {'detail': 'Solo el creador puede ver las propuestas.'},
                status=status.HTTP_403_FORBIDDEN,
            )
        return super().list(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        publicacion_id = self.kwargs['publicacion_id']
        try:
            publicacion = Publicacion.objects.get(pk=publicacion_id)
        except Publicacion.DoesNotExist:
            return Response(
                {'detail': 'Publicación no encontrada.'},
                status=status.HTTP_404_NOT_FOUND,
            )

        if publicacion.estado != 'publicado':
            return Response(
                {'detail': 'La publicación no está activa.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if publicacion.creador == request.user:
            return Response(
                {'detail': 'No puedes postularte a tu propia publicación.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if Propuesta.objects.filter(
            publicacion=publicacion,
            cliente=request.user,
            estado=Propuesta.Estado.PENDIENTE,
        ).exists():
            return Response(
                {'detail': 'Ya tienes una propuesta pendiente para esta publicación.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(publicacion=publicacion, cliente=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class PropuestaDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        return Propuesta.objects.select_related(
            'publicacion', 'publicacion__creador', 'cliente', 'cliente__perfil'
        ).get(pk=pk)

    def get(self, request, pk):
        try:
            propuesta = self.get_object(pk)
        except Propuesta.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        if request.user not in (propuesta.cliente, propuesta.publicacion.creador):
            return Response(status=status.HTTP_403_FORBIDDEN)

        serializer = PropuestaListSerializer(propuesta)
        return Response(serializer.data)

    @transaction.atomic
    def put(self, request, pk):
        try:
            propuesta = self.get_object(pk)
        except Propuesta.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        if propuesta.publicacion.creador != request.user:
            return Response(
                {'detail': 'Solo el creador de la publicación puede responder.'},
                status=status.HTTP_403_FORBIDDEN,
            )

        if propuesta.estado != Propuesta.Estado.PENDIENTE:
            return Response(
                {'detail': 'Esta propuesta ya fue respondida.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        nuevo_estado = request.data.get('estado')
        if nuevo_estado not in (Propuesta.Estado.ACEPTADA, Propuesta.Estado.RECHAZADA):
            return Response(
                {'detail': 'Estado inválido. Use "aceptada" o "rechazada".'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        propuesta.estado = nuevo_estado
        propuesta.save()

        if nuevo_estado == Propuesta.Estado.ACEPTADA:
            Contrato.objects.create(
                propuesta=propuesta,
                cliente=propuesta.cliente,
                freelancer=propuesta.publicacion.creador,
                precio=propuesta.precio_propuesto,
            )
            Propuesta.objects.filter(
                publicacion=propuesta.publicacion,
                estado=Propuesta.Estado.PENDIENTE,
            ).exclude(pk=propuesta.pk).update(estado=Propuesta.Estado.RECHAZADA)

        serializer = PropuestaListSerializer(propuesta)
        return Response(serializer.data)


class MisPropuestasEnviadas(generics.ListAPIView):
    serializer_class = PropuestaListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Propuesta.objects.filter(
            cliente=self.request.user,
        ).select_related('cliente', 'cliente__perfil', 'publicacion').order_by('-created_at')


class MisPropuestasRecibidas(generics.ListAPIView):
    serializer_class = PropuestaListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Propuesta.objects.filter(
            publicacion__creador=self.request.user,
            estado=Propuesta.Estado.PENDIENTE,
        ).select_related('cliente', 'cliente__perfil', 'publicacion')


class MisContratosList(generics.ListAPIView):
    serializer_class = ContratoListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Contrato.objects.filter(
            Q(cliente=self.request.user) | Q(freelancer=self.request.user)
        ).select_related(
            'cliente', 'cliente__perfil',
            'freelancer', 'freelancer__perfil',
            'propuesta__publicacion',
        )


class ContratoDetailView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return ContratoDetailSerializer
        return ContratoListSerializer

    def get_queryset(self):
        return Contrato.objects.filter(
            Q(cliente=self.request.user) | Q(freelancer=self.request.user)
        ).select_related(
            'cliente', 'cliente__perfil',
            'freelancer', 'freelancer__perfil',
            'propuesta', 'propuesta__publicacion',
            'propuesta__cliente', 'propuesta__cliente__perfil',
        )

    def update(self, request, *args, **kwargs):
        contrato = self.get_object()
        nuevo_estado = request.data.get('estado')

        if nuevo_estado not in (Contrato.Estado.COMPLETADO, Contrato.Estado.CANCELADO):
            return Response(
                {'detail': 'Estado inválido. Use "completado" o "cancelado".'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if contrato.estado != Contrato.Estado.ACTIVO:
            return Response(
                {'detail': 'Este contrato ya fue finalizado.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        contrato.estado = nuevo_estado
        contrato.save()
        serializer = ContratoDetailSerializer(contrato)
        return Response(serializer.data)
