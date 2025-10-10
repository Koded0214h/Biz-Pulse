from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UploadDataView, MetricViewSet, 
    InsightViewSet, AlertViewSet, 
    ForecastPredictionViewSet, NaturalLanguageQueryView,
    SalesSummaryView
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
    
    path('charts/sales-summary/', SalesSummaryView.as_view(), name='sales-summary'),
    path('charts/sales/', views.SalesDataView.as_view(), name='sales-chart'),
    path('charts/summary/', views.MetricsSummaryView.as_view(), name='metrics-summary'),
    path('charts/inventory/', views.InventoryTrendsView.as_view(), name='inventory-chart'),
    path('charts/customers/', views.CustomerMetricsView.as_view(), name='customer-chart'),
    path('charts/enhanced-sales/', views.EnhancedSalesDataView.as_view(), name='enhanced-sales-chart'),
    path('charts/top-products/', views.TopProductsView.as_view(), name='top-products-chart'),
    
    path('business/recommendations/', views.BusinessRecommendationsView.as_view(), name='business recommendation'),
    path('business/health/', views.BusinessHealthView.as_view(), name='business health'),
    path('business/what-if/', views.WhatIfAnalysisView.as_view(), name='business what id'),
]
