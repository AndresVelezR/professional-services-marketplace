from django.urls import path

from .views import MisPublicacionesView, PublicacionDetailView, PublicacionListCreateView

urlpatterns = [
    path('', PublicacionListCreateView.as_view(), name='publicacion-list-create'),
    path('mias/', MisPublicacionesView.as_view(), name='publicacion-mias'),
    path('<uuid:id>/', PublicacionDetailView.as_view(), name='publicacion-detail'),
]
