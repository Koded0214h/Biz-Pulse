from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction

# Core Models: Required for the Hackathon Bypass and Job lookup
from core.models import DataSource, IngestionJob 

# Services App Dependencies
from services.models import Metric
from services.serializers import MetricCreateSerializer
from services.analysis import start_bedrock_analysis # <--- NEW IMPORT: Phase C trigger
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

        # ------------------------------------------------------------------
        # HACKATHON BYPASS: Ensure DataSource ID=1 exists
        # ------------------------------------------------------------------
        try:
            DataSource.objects.get_or_create(
                id=1, 
                defaults={'name': 'Hackathon Placeholder Source'}
            )
        except Exception as e:
            # Safely continue execution
            pass

        # 1. Validate data structure
        serializer = MetricCreateSerializer(data=metrics_data, many=True)
        if not serializer.is_valid():
            job.status = 'FAILED'; job.log_details = f"Metrics data validation failed: {serializer.errors}"; job.save()
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # 2. Bulk Create Metrics and Update Job Status
        with transaction.atomic():
            metrics_to_create = [
                Metric(
                    ingestion_job=job,
                    # FINAL FIX: Use data_source_id to assign the integer ID
                    data_source_id=metric_data['data_source_id'], 
                    name=metric_data['name'],
                    value=metric_data['value'],
                    timestamp=metric_data['timestamp']
                )
                for metric_data in serializer.validated_data
            ]
            Metric.objects.bulk_create(metrics_to_create)
            
            # Transition status to the next phase
            job.status = 'METRICS_CREATED'; 
            job.save()

        # 3. PHASE C TRIGGER: Initiate Bedrock Analysis (Simulated)
        start_bedrock_analysis(job_id)

        return Response(
            {"message": f"{len(metrics_to_create)} metrics created. Bedrock analysis triggered."}, 
            status=status.HTTP_201_CREATED
        )