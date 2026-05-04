from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Conversacion
from .services import get_conversacion_usuario, get_conversaciones_usuario, obtener_o_crear_conversacion
from .serializers import ConversacionDetailSerializer, ConversacionListSerializer


class ConversacionListView(generics.ListAPIView):
    serializer_class = ConversacionListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return get_conversaciones_usuario(self.request.user)


class ConversacionDetailView(generics.RetrieveAPIView):
    serializer_class = ConversacionDetailSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return get_conversacion_usuario(self.request.user)


class ObtenerConversacion(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, contrato_id):
        conversacion = obtener_o_crear_conversacion(contrato_id, request.user)
        serializer = ConversacionDetailSerializer(conversacion, context={'request': request})
        return Response(serializer.data)
