# internal_api/urls.py
from django.urls import path
from .views import BulkMetricCreateView, AnomalyIngestView, ForecastIngestView

urlpatterns = [
    path('metrics/bulk-create/', BulkMetricCreateView.as_view(), name='bulk-metric-create'),
    path('anomalies/ingest/', AnomalyIngestView.as_view(), name='anomaly-ingest'),
    
    path('forecasts/ingest/', ForecastIngestView.as_view(), name='forecast-ingest'),
]