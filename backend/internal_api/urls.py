# internal_api/urls.py
from django.urls import path
from .views import BulkMetricCreateView

urlpatterns = [
    path('metrics/bulk-create/', BulkMetricCreateView.as_view(), name='bulk-metric-create'),
]