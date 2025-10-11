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
    path("upload/", views.UploadDataView.as_view(), name="upload-data"),
    path('q/ask/', views.NaturalLanguageQueryView.as_view(), name='natural-language-query'),

    # Alert actions (placed before router to avoid conflict with retrieve)
    path('alerts/<int:pk>/acknowledge/', views.AcknowledgeAlertView.as_view(), name='acknowledge-alert'),
    path('alerts/<int:pk>/dismiss/', views.DismissAlertView.as_view(), name='dismiss-alert'),
    path('alerts/bulk-action/', views.BulkAlertActionView.as_view(), name='bulk-alert-action'),

    path('', include(router.urls)),

    # Charts endpoints
    path('charts/sales-summary/', views.SalesSummaryView.as_view(), name='sales-summary'),
    path('charts/sales/', views.SalesDataView.as_view(), name='sales-chart'),
    path('charts/summary/', views.MetricsSummaryView.as_view(), name='metrics-summary'),
    path('charts/inventory/', views.InventoryTrendsView.as_view(), name='inventory-chart'),
    path('charts/customers/', views.CustomerMetricsView.as_view(), name='customer-chart'),
    path('charts/enhanced-sales/', views.EnhancedSalesDataView.as_view(), name='enhanced-sales-chart'),
    path('charts/top-products/', views.TopProductsView.as_view(), name='top-products-chart'),

    # NEW: Business AI endpoints - FIXED PATHS
    path('q/recommendations/', views.BusinessRecommendationsView.as_view(), name='business-recommendations'),
    path('q/health/', views.BusinessHealthView.as_view(), name='business-health'),
    path('q/what-if/', views.WhatIfAnalysisView.as_view(), name='what-if-analysis'),

    # Alerts & Insights endpoints
    path('alerts/', views.AlertViewSet.as_view({'get': 'list'}), name='alerts-list'),
    path('insights/', views.InsightViewSet.as_view({'get': 'list'}), name='insights-list'),
    path('forecasts/', views.ForecastPredictionViewSet.as_view({'get': 'list'}), name='forecasts-list'),
]
