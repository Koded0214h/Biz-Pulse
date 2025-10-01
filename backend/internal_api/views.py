from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
import sys 

# Core Models: Required for the Hackathon Bypass and Job lookup
from core.models import DataSource, IngestionJob 

# Services App Dependencies
from services.models import Metric, Insight # <--- Added Insight import
from services.serializers import MetricCreateSerializer, AnomalyIngestSerializer # <--- Added AnomalyIngestSerializer
from services.analysis import start_bedrock_analysis 
from .permissions import IsInternalService


class BulkMetricCreateView(APIView):
    # ... (Your existing BulkMetricCreateView code goes here, it remains unchanged) ...

    permission_classes = [IsInternalService]

    def post(self, request, *args, **kwargs):
        data = request.data
        job_id = data.get('job_id')
        metrics_data = data.get('metrics', [])

        print(f"DEBUG LOG: Received request for Job ID: {job_id}")
        sys.stdout.flush()

        if not job_id or not metrics_data:
            return Response({"error": "Missing job_id or metrics list."}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            job = IngestionJob.objects.get(id=job_id)
            print(f"DEBUG LOG: Found Ingestion Job: {job_id}. Status: {job.status}")
            sys.stdout.flush()
        except IngestionJob.DoesNotExist:
            print(f"ERROR LOG: IngestionJob ID {job_id} not found.")
            sys.stdout.flush()
            return Response({"error": f"IngestionJob ID {job_id} not found."}, status=status.HTTP_404_NOT_FOUND)

        # ------------------------------------------------------------------
        # HACKATHON BYPASS: Ensure DataSource ID=1 exists
        # ------------------------------------------------------------------
        try:
            # This is safe because the ETL script hardcodes data_source_id=1
            ds, _ = DataSource.objects.get_or_create(
                id=1, 
                defaults={'name': 'Hackathon Placeholder Source'}
            )
            data_source_id = ds.id
        except Exception as e:
            print(f"WARNING LOG: DataSource get_or_create failed (non-critical): {e}")
            sys.stdout.flush()
            # If the bypass fails, we must rely on the ID from the payload (if present)
            data_source_id = metrics_data[0].get('data_source_id') if metrics_data else None

        # 1. Validate data structure
        serializer = MetricCreateSerializer(data=metrics_data, many=True)
        if not serializer.is_valid():
            job.status = 'FAILED'; job.log_details = f"Metrics data validation failed: {serializer.errors}"; job.save()
            print("ERROR LOG: Metrics serializer failed validation.")
            sys.stdout.flush()
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        # --- CRITICAL FIX: INJECT data_source_id BACK INTO VALIDATED DATA ---
        if not data_source_id:
            data_source_id = metrics_data[0].get('data_source_id', 1)

        for metric_data in serializer.validated_data:
            metric_data['data_source_id'] = data_source_id
            
        print("DEBUG LOG: Metrics data validated and data_source_id injected.")
        sys.stdout.flush()
        # ---------------------------------------------------------------------

        # 2. Bulk Create Metrics and Update Job Status
        try:
            with transaction.atomic():
                metrics_to_create = [
                    Metric(
                        ingestion_job=job,
                        data_source_id=metric_data['data_source_id'], # <-- Now this key exists
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
            
            print(f"DEBUG LOG: Successfully created {len(metrics_to_create)} metrics.")
            sys.stdout.flush()

        except Exception as e:
            # Critical database error during bulk_create (e.g., constraint violation)
            job.status = 'FAILED'; job.log_details = f"Database error during bulk_create: {e}"; job.save()
            print(f"CRITICAL ERROR LOG: Database transaction failed! Error: {e}")
            sys.stdout.flush()
            raise 

        # 3. PHASE C TRIGGER: Initiate Bedrock Analysis (Simulated)
        print("DEBUG LOG: Starting Bedrock analysis trigger...")
        sys.stdout.flush()
        
        try:
            start_bedrock_analysis(job_id)
            print("DEBUG LOG: Bedrock analysis triggered successfully.")
            sys.stdout.flush()
        except Exception as e:
            job.status = 'FAILED'; job.log_details = f"start_bedrock_analysis raised an uncaught error: {e}"; job.save()
            print(f"CRITICAL ERROR LOG: start_bedrock_analysis FAILED! Error: {e}")
            sys.stdout.flush()
            raise 

        return Response(
            {"message": f"{len(metrics_to_create)} metrics created. Bedrock analysis triggered."}, 
            status=status.HTTP_201_CREATED
        )


# --- NEW: Anomaly Ingest View for Lookout for Metrics ---
class AnomalyIngestView(APIView):
    # permission_classes = [IsInternalService]

    def post(self, request, *args, **kwargs):
        serializer = AnomalyIngestSerializer(data=request.data)
        
        if not serializer.is_valid():
            print("ERROR LOG: Anomaly data failed validation.")
            sys.stdout.flush()
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        
        print(f"DEBUG LOG: Received anomaly for DS ID: {data['data_source_id']}")
        sys.stdout.flush()

        # 1. Look up the DataSource
        try:
            data_source = DataSource.objects.get(id=data['data_source_id'])
        except DataSource.DoesNotExist:
            print(f"ERROR LOG: DataSource ID {data['data_source_id']} not found.")
            sys.stdout.flush()
            return Response({"error": "DataSource not found."}, status=status.HTTP_404_NOT_FOUND)

        # 2. Create the Insight record with LOOKOUT source
        try:
            # Construct a detailed summary/recommendation for the Insight
            summary = (
                f"A **Critical Anomaly** was detected in the '{data['metric_name']}' metric "
                f"at {data['timestamp'].strftime('%Y-%m-%d %H:%M')} with a severity score "
                f"of {data.get('severity_score', 0.0) * 100:.1f}%. This suggests "
                f"a highly unusual event requiring immediate investigation."
            )
            recommendations = {
                "investigation": "Immediately check raw metric data around this timestamp.",
                "analysis": "Compare trend with previous weeks/months to confirm root cause."
            }

            with transaction.atomic():
                Insight.objects.create(
                    data_source=data_source,
                    source='LOOKOUT', # Set the source correctly
                    title=data['anomaly_title'],
                    summary=summary,
                    recommendations=recommendations # Stored as JSON
                )
                
            print("DEBUG LOG: Anomaly Insight created successfully.")
            sys.stdout.flush()

        except Exception as e:
            print(f"CRITICAL ERROR LOG: Anomaly Insight save failed. Error: {e}")
            sys.stdout.flush()
            return Response({"error": "Database error saving anomaly insight."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({"message": "Anomaly Insight created."}, status=status.HTTP_201_CREATED)