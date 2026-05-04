from django.urls import path

from .views import SummarizeServiceView

urlpatterns = [
    path(
        'summarize-service/',
        SummarizeServiceView.as_view(),
        name='summarize-service',
    ),
]
