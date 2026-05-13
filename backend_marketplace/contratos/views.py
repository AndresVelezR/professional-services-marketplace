from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Propuesta
from .services import (
    actualizar_contrato,
    crear_propuesta,
    get_mis_contratos,
    get_mis_propuestas_enviadas,
    get_mis_propuestas_recibidas,
    get_propuestas_de_publicacion,
    obtener_propuesta,
    obtener_publicacion,
    responder_propuesta,
    validar_acceso_a_propuesta,
    verificar_acceso_a_propuestas,
)
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
        return get_propuestas_de_publicacion(self.kwargs['publicacion_id'])

    def list(self, request, *args, **kwargs):
        verificar_acceso_a_propuestas(self.kwargs['publicacion_id'], request.user)
        return super().list(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        publicacion = obtener_publicacion(self.kwargs['publicacion_id'])
        propuesta = crear_propuesta(publicacion, request.user, serializer.validated_data)
        response_serializer = PropuestaListSerializer(propuesta)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)


class PropuestaDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        return obtener_propuesta(pk)

    def get(self, request, pk):
        try:
            propuesta = self.get_object(pk)
        except Propuesta.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        validar_acceso_a_propuesta(propuesta, request.user)

        serializer = PropuestaListSerializer(propuesta)
        return Response(serializer.data)

    def put(self, request, pk):
        try:
            propuesta = self.get_object(pk)
        except Propuesta.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        nuevo_estado = request.data.get('estado')
        propuesta = responder_propuesta(propuesta, request.user, nuevo_estado)

        serializer = PropuestaListSerializer(propuesta)
        return Response(serializer.data)


class MisPropuestasEnviadas(generics.ListAPIView):
    serializer_class = PropuestaListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return get_mis_propuestas_enviadas(self.request.user)


class MisPropuestasRecibidas(generics.ListAPIView):
    serializer_class = PropuestaListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return get_mis_propuestas_recibidas(self.request.user)


class MisContratosList(generics.ListAPIView):
    serializer_class = ContratoListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return get_mis_contratos(self.request.user)


class ContratoDetailView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return ContratoDetailSerializer
        return ContratoListSerializer

    def get_queryset(self):
        return get_mis_contratos(self.request.user)

    def update(self, request, *args, **kwargs):
        contrato = self.get_object()
        contrato = actualizar_contrato(contrato, request.user, request.data.get('estado'))
        serializer = ContratoDetailSerializer(contrato, context={'request': request})
        return Response(serializer.data)
