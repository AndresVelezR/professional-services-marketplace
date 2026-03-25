from django.urls import path

from .views import (
    ContratoDetailView,
    MisContratosList,
    PropuestaDetailView,
    PropuestaListCreateView,
)

urlpatterns = [
    path('propuestas/publicacion/<uuid:publicacion_id>/', PropuestaListCreateView.as_view(), name='propuesta-list-create'),
    path('propuestas/<uuid:pk>/', PropuestaDetailView.as_view(), name='propuesta-detail'),
    path('contratos/', MisContratosList.as_view(), name='contrato-list'),
    path('contratos/<uuid:pk>/', ContratoDetailView.as_view(), name='contrato-detail'),
]
