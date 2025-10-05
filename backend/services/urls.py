from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UploadDataView, MetricViewSet, 
    InsightViewSet, AlertViewSet, 
    ForecastPredictionViewSet, NaturalLanguageQueryView
)


router = DefaultRouter()
router.register(r'metrics', MetricViewSet, basename='metrics')
router.register(r'insights', InsightViewSet, basename='insights')
router.register(r'alerts', AlertViewSet, basename='alerts')
router.register(r'forecasts', ForecastPredictionViewSet, basename='forecasts')

urlpatterns = [
    path('', include(router.urls)),
    path("upload/", UploadDataView.as_view(), name="upload-data"),
    path('q/ask/', NaturalLanguageQueryView.as_view(), name='natural-language-query'),
]
