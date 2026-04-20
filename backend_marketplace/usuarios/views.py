from rest_framework import generics, status
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Experiencia, Habilidad
from .serializers import (
    ExperienciaSerializer,
    HabilidadSerializer,
    PerfilSerializer,
    RegistroSerializer,
)


class RegistroView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegistroSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {'mensaje': 'Usuario creado exitosamente.'},
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PerfilView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get(self, request):
        serializer = PerfilSerializer(
            request.user.perfil, context={'request': request}
        )
        return Response(serializer.data)

    def patch(self, request):
        serializer = PerfilSerializer(
            request.user.perfil,
            data=request.data,
            partial=True,
            context={'request': request},
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class HabilidadListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    queryset = Habilidad.objects.all()
    serializer_class = HabilidadSerializer


class ExperienciaListCreateView(generics.ListCreateAPIView):
    serializer_class = ExperienciaSerializer

    def get_queryset(self):
        return self.request.user.perfil.experiencias.all()

    def perform_create(self, serializer):
        serializer.save(perfil=self.request.user.perfil)


class ExperienciaDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ExperienciaSerializer

    def get_queryset(self):
        return Experiencia.objects.filter(perfil=self.request.user.perfil)
