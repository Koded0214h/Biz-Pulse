# services/views.py

import csv
import io
from django.db import transaction
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
# Import all necessary models, including Alert for the final step
from .models import Metric, Insight, Alert 
from core.models import DataSource, IngestionJob # Assuming IngestionJob is in core

# Import your AI service functions
from .ai_service import generate_narrative_insight, trigger_sns_alert 


class UploadDataView(APIView):
    """
    Handles CSV file upload, performs basic ETL, generates AI Insights, and triggers Alerts.
    
    NOTE: This implementation is synchronous and simplified for a hackathon.
    In production, this should dispatch an asynchronous task (Celery/AWS Lambda)
    after file upload for non-blocking processing.
    """
    permission_classes = [IsAuthenticated] 

    def post(self, request, *args, **kwargs):
        file_obj = request.FILES.get("file")
        data_source_id = request.data.get("data_source_id") # Expecting a DataSource ID in the request

        if not file_obj:
            return Response({"error": "No file uploaded."}, status=status.HTTP_400_BAD_REQUEST)
        if not data_source_id:
            return Response({"error": "Missing data_source_id."}, status=status.HTTP_400_BAD_REQUEST)

        job = None # Initialize job outside try/except for cleanup
        
        try:
            # 1. Validate DataSource and Create IngestionJob
            data_source = DataSource.objects.get(pk=data_source_id)
            job = IngestionJob.objects.create(data_source=data_source, status='PROCESSING')

            # Use io.StringIO to read the file content as text
            file_data = file_obj.read().decode('utf-8')
            csv_data = csv.reader(io.StringIO(file_data))
            header = next(csv_data)
            
            # --- Simple Hackathon ETL Logic (Metric Creation) ---
            with transaction.atomic():
                metrics_to_create = []
                # Assuming the CSV has columns: timestamp, metric_name, value
                TIMESTAMP_COL, NAME_COL, VALUE_COL = header.index('timestamp'), header.index('metric_name'), header.index('value')

                for row in csv_data:
                    # 2. Clean/Validate Data
                    try:
                        timestamp = row[TIMESTAMP_COL]
                        name = row[NAME_COL]
                        value = float(row[VALUE_COL])
                    except (ValueError, IndexError):
                        job.status = 'FAILED'; job.log_details = f"Data cleanup/validation failed on row: {row}"; job.save()
                        return Response({"error": f"Data cleanup/validation failed on row: {row}"}, 
                                        status=status.HTTP_400_BAD_REQUEST)

                    # 3. Create Metric instance
                    metric = Metric(
                        data_source=data_source, 
                        name=name, 
                        value=value, 
                        timestamp=timestamp, 
                        ingestion_job=job
                    )
                    metrics_to_create.append(metric)

                Metric.objects.bulk_create(metrics_to_create)

                # --- AI INTEGRATION: Insight & Alert Generation ---
                
                # 4. Generate Insight (LLM Substitute for Bedrock)
                
                # Pass all metrics from this job to the AI service for analysis
                insights_text, recommendations_data = generate_narrative_insight(metrics_to_create)
                
                # Use the last metric for the ForeignKey link (or a more relevant one if logic dictated)
                last_metric = metrics_to_create[-1]
                
                insight = Insight.objects.create(
                    metric=last_metric, 
                    text=insights_text,
                    recommendations=recommendations_data
                )

                # 5. Trigger Alert Logic (SNS Substitute)
                alert_triggered = False
                severity = recommendations_data.get('severity', 'LOW')
                
                if severity == 'CRITICAL':
                    alert = Alert.objects.create(
                        insight=insight,
                        type="EMAIL",
                        recipient="admin@bizpulse.co" 
                    )
                    
                    # Call the SNS placeholder function (this will print to console and set alert.sent=True)
                    alert_triggered = trigger_sns_alert(alert)
                    
            # 6. Finalize Job Status
            job.status = 'COMPLETED'; job.save()
            
            return Response({
                "message": "AI Processing complete. Metrics, Insights, and Alerts generated.",
                "job_id": job.id,
                "insight_id": insight.id,
                "alert_triggered": alert_triggered
            }, status=status.HTTP_201_CREATED)

        except DataSource.DoesNotExist:
            return Response({"error": f"DataSource with ID {data_source_id} not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            # Handle general errors and set job status to FAILED
            if job:
                job.status = 'FAILED'; job.log_details = str(e); job.save()
            return Response({"error": f"An error occurred during processing: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)