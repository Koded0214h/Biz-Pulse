from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import DataSourceViewSet, IngestionJobViewSet

router = DefaultRouter()
router.register(r'data-sources', DataSourceViewSet, basename='data-sources')
router.register(r'ingestion-jobs', IngestionJobViewSet, basename='ingestion-jobs')

urlpatterns = [
    path('', include(router.urls)),
]