# internal_api/views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction

# Import the correct models
from services.models import Metric, IngestionJob 
# Import the new serializer specifically for creation
from services.serializers import MetricCreateSerializer # <--- CHANGED
from .permissions import IsInternalService

class BulkMetricCreateView(APIView):
    permission_classes = [IsInternalService]

    def post(self, request, *args, **kwargs):
        data = request.data
        job_id = data.get('job_id')
        metrics_data = data.get('metrics', [])

        if not job_id or not metrics_data:
            return Response({"error": "Missing job_id or metrics list."}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            job = IngestionJob.objects.get(id=job_id)
        except IngestionJob.DoesNotExist:
            return Response({"error": f"IngestionJob ID {job_id} not found."}, status=status.HTTP_404_NOT_FOUND)

        # 1. Validate data structure (using the correct serializer)
        # Use MetricCreateSerializer for writing/validating metric data
        serializer = MetricCreateSerializer(data=metrics_data, many=True)
        if not serializer.is_valid():
            # Use serializer.errors for detailed validation failures
            job.status = 'FAILED'; job.log_details = f"Metrics data validation failed: {serializer.errors}"; job.save()
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # 2. Bulk Create Metrics and Update Job Status
        with transaction.atomic():
            # Use validated_data for safe creation
            metrics_to_create = [
                Metric(
                    ingestion_job=job,
                    data_source=metric_data['data_source'],
                    name=metric_data['name'],
                    value=metric_data['value'],
                    timestamp=metric_data['timestamp']
                )
                for metric_data in serializer.validated_data # <--- USE VALIDATED DATA
            ]
            Metric.objects.bulk_create(metrics_to_create)
            
            # Transition status to the next phase
            job.status = 'METRICS_CREATED'; 
            job.save()

        return Response({"message": f"{len(metrics_to_create)} metrics created. Ready for AI analysis."}, status=status.HTTP_201_CREATED)