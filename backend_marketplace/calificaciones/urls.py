from django.urls import path
from .views import (
    CrearCalificacionView,
    CalificacionesUsuarioView,
    MisCalificacionesView
)

urlpatterns = [
    path('', CrearCalificacionView.as_view()),
    path('usuario/<uuid:usuario_id>/', CalificacionesUsuarioView.as_view()),
    path('mis-calificaciones/', MisCalificacionesView.as_view()),
]