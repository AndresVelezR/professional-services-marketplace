from django.urls import path

from .views import ConversacionDetailView, ConversacionListView, ObtenerConversacion

urlpatterns = [
    path('conversaciones/', ConversacionListView.as_view(), name='conversacion-list'),
    path('conversaciones/<uuid:pk>/', ConversacionDetailView.as_view(), name='conversacion-detail'),
    path('conversaciones/contrato/<uuid:contrato_id>/', ObtenerConversacion.as_view(), name='conversacion-obtener'),
]
