from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Avg
from .models import Calificacion
from .serializers import CalificacionSerializer


class CrearCalificacionView(generics.CreateAPIView):
    serializer_class = CalificacionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_context(self):
        return {'request': self.request}


class CalificacionesUsuarioView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, usuario_id):
        calificaciones = Calificacion.objects.filter(
            calificado_id=usuario_id
        )

        stats = calificaciones.aggregate(
            avg_calidad=Avg('calidad'),
            avg_comunicacion=Avg('comunicacion'),
            avg_puntualidad=Avg('puntualidad'),
        )

        serializer = CalificacionSerializer(calificaciones, many=True)

        return Response({
            'total': calificaciones.count(),
            'promedios': {
                'calidad': round(stats['avg_calidad'] or 0, 1),
                'comunicacion': round(stats['avg_comunicacion'] or 0, 1),
                'puntualidad': round(stats['avg_puntualidad'] or 0, 1),
                'general': round(
                    ((stats['avg_calidad'] or 0) +
                     (stats['avg_comunicacion'] or 0) +
                     (stats['avg_puntualidad'] or 0)) / 3, 1
                ),
            },
            'calificaciones': serializer.data
        })


class MisCalificacionesView(generics.ListAPIView):
    serializer_class = CalificacionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Calificacion.objects.filter(
            calificado=self.request.user
        )