from django.db.models import Q
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from contratos.models import Contrato

from .models import Conversacion
from .serializers import ConversacionDetailSerializer, ConversacionListSerializer


class ConversacionListView(generics.ListAPIView):
    serializer_class = ConversacionListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Conversacion.objects.filter(
            Q(contrato__cliente=self.request.user) |
            Q(contrato__freelancer=self.request.user)
        ).select_related(
            'contrato', 'contrato__cliente', 'contrato__cliente__perfil',
            'contrato__freelancer', 'contrato__freelancer__perfil',
            'contrato__propuesta__publicacion',
        ).prefetch_related('mensajes').order_by('-created_at')


class ConversacionDetailView(generics.RetrieveAPIView):
    serializer_class = ConversacionDetailSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Conversacion.objects.filter(
            Q(contrato__cliente=self.request.user) |
            Q(contrato__freelancer=self.request.user)
        ).select_related(
            'contrato', 'contrato__cliente', 'contrato__cliente__perfil',
            'contrato__freelancer', 'contrato__freelancer__perfil',
            'contrato__propuesta__publicacion',
        ).prefetch_related('mensajes__emisor__perfil')


class ObtenerConversacion(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, contrato_id):
        try:
            contrato = Contrato.objects.get(pk=contrato_id)
        except Contrato.DoesNotExist:
            return Response({'detail': 'Contrato no encontrado.'}, status=status.HTTP_404_NOT_FOUND)

        if request.user not in (contrato.cliente, contrato.freelancer):
            return Response({'detail': 'No tienes acceso a este contrato.'}, status=status.HTTP_403_FORBIDDEN)

        conversacion, _ = Conversacion.objects.get_or_create(contrato=contrato)
        serializer = ConversacionDetailSerializer(conversacion, context={'request': request})
        return Response(serializer.data)
