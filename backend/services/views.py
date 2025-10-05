from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.core.files.storage import default_storage
import boto3

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
        job_id = request.data.get("job_id", "1")  # Get job_id from request
        
        if not file_obj:
            return Response({"error": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST)
        
        file_path = f"raw-uploads/{file_obj.name}"

        # Save to S3 with metadata using boto3 directly
        s3 = boto3.client('s3')
        s3.upload_fileobj(
            file_obj,
            'your-bucket-name',  # Make sure this matches your actual bucket
            file_path,
            ExtraArgs={
                'Metadata': {
                    'django-job-id': str(job_id)  # Ensure it's a string
                }
            }
        )

        file_url = f"https://your-bucket-name.s3.amazonaws.com/{file_path}"
        
        return Response({
            "message": "File uploaded successfully!",
            "file_path": file_path,
            "file_url": file_url,
            "job_id": job_id
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