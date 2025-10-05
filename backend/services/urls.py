from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UploadDataView, MetricViewSet, 
    InsightViewSet, AlertViewSet, 
    ForecastPredictionViewSet, NaturalLanguageQueryView
)

from . import views

router = DefaultRouter()
router.register(r'metrics', MetricViewSet, basename='metrics')
router.register(r'insights', InsightViewSet, basename='insights')
router.register(r'alerts', AlertViewSet, basename='alerts')
router.register(r'forecasts', ForecastPredictionViewSet, basename='forecasts')

urlpatterns = [
    path('', include(router.urls)),
    path("upload/", UploadDataView.as_view(), name="upload-data"),
    path('q/ask/', NaturalLanguageQueryView.as_view(), name='natural-language-query'),
    
    path('charts/sales/', views.SalesDataView.as_view(), name='sales-chart'),
    path('charts/summary/', views.MetricsSummaryView.as_view(), name='metrics-summary'),
    path('charts/inventory/', views.InventoryTrendsView.as_view(), name='inventory-chart'),
    path('charts/customers/', views.CustomerMetricsView.as_view(), name='customer-chart'),
]
