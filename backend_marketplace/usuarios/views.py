from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from rest_framework import generics, status
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from infrastructure.emails.email_service import EmailService

from .models import Experiencia, Habilidad
from .services import actualizar_perfil, crear_experiencia, crear_usuario_con_perfil
from .serializers import (
    ExperienciaSerializer,
    HabilidadSerializer,
    PerfilSerializer,
    RegistroSerializer,
)


class ValidarPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        password = request.data.get('password', '')
        try:
            validate_password(password)
        except ValidationError as e:
            return Response({'errors': e.messages}, status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_204_NO_CONTENT)


class RegistroView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegistroSerializer(data=request.data)
        if serializer.is_valid():
            crear_usuario_con_perfil(serializer.validated_data, EmailService())
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
            perfil = actualizar_perfil(request.user.perfil, serializer.validated_data)
            response_serializer = PerfilSerializer(
                perfil,
                context={'request': request},
            )
            return Response(response_serializer.data)
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
        serializer.instance = crear_experiencia(
            self.request.user.perfil,
            serializer.validated_data,
        )


class ExperienciaDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ExperienciaSerializer

    def get_queryset(self):
        return Experiencia.objects.filter(perfil=self.request.user.perfil)
