from django.urls import path

from .views import PublicServicesFeedView, SummarizeServiceView

urlpatterns = [
    path(
        'public-services-feed/',
        PublicServicesFeedView.as_view(),
        name='public-services-feed',
    ),
    path(
        'summarize-service/',
        SummarizeServiceView.as_view(),
        name='summarize-service',
    ),
]
