from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.core.files.storage import default_storage

from .models import Metric, Insight, Alert, ForecastPrediction
from .serializers import (
    MetricViewSetSerializer,
    InsightViewSetSerializer,
    AlertViewSetSerializer,
    ForecastPredictionSerializer
)

# Create your views here.

class UploadDataView(APIView):
    def post(self, request, *args, **kwargs):
        file_obj = request.FILES.get("file")
        if not file_obj:
            return Response({"error": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Save directly to S3
        file_name = default_storage.save(file_obj.name, file_obj)
        file_url = default_storage.url(file_name)

        return Response({
            "message": "File uploaded successfully!",
            "file_name": file_name,
            "file_url": file_url
        }, status=status.HTTP_201_CREATED)
        
        
class MetricViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Provides read-only access to Metric data.
    """
    queryset = Metric.objects.all().order_by('-timestamp')
    serializer_class = MetricViewSetSerializer
    permission_classes = [IsAuthenticated]

class InsightViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Provides read-only access to Insight data.
    """
    queryset = Insight.objects.all().order_by('-created_at')
    serializer_class = InsightViewSetSerializer
    permission_classes = [IsAuthenticated]

class AlertViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Provides read-only access to Alert data.
    """
    queryset = Alert.objects.all().order_by('-timestamp')
    serializer_class = AlertViewSetSerializer
    permission_classes = [IsAuthenticated]
    
    
class ForecastPredictionViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Provides read-only access to structured Forecast Prediction data.
    """
    queryset = ForecastPrediction.objects.all().order_by('-prediction_time')
    serializer_class = ForecastPredictionSerializer
    permission_classes = [IsAuthenticated]

    # Optional: Filter by data source for convenience
    def get_queryset(self):
        queryset = super().get_queryset()
        data_source_id = self.request.query_params.get('data_source_id')
        if data_source_id is not None:
            queryset = queryset.filter(data_source_id=data_source_id)
        return queryset