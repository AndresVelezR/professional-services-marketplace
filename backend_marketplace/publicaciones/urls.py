from django.urls import path

from .views import PublicacionDetailView, PublicacionListCreateView

urlpatterns = [
    path('', PublicacionListCreateView.as_view(), name='publicacion-list-create'),
    path('<uuid:id>/', PublicacionDetailView.as_view(), name='publicacion-detail'),
]
