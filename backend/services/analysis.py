import os
import json
import time
import boto3 
from django.db import transaction
from django.db.models import Avg, Max
from services.models import IngestionJob, Insight, Metric
import sys # <--- NEW: Import sys for flushing print statements

# --- Setup Boto3 Client ---
REGION = os.environ.get('AWS_REGION_NAME', 'us-east-1')

def get_bedrock_client():
    return boto3.client(
        service_name='bedrock-runtime',
        region_name=REGION
    )

# --- Service Function to Start Bedrock Interaction ---

def start_bedrock_analysis(job_id: int):
    """
    Triggers the actual Bedrock analysis after metrics are saved.
    """
    # 1. Update job status immediately (decoupling)
    try:
        job = IngestionJob.objects.get(id=job_id)
        job.status = 'ANALYSIS_KICKED_OFF'
        job.save()
        print(f"BEDROCK LOG: Job {job_id} status updated to ANALYSIS_KICKED_OFF")
        sys.stdout.flush()
    except IngestionJob.DoesNotExist:
        print(f"BEDROCK LOG: Job {job_id} not found during analysis start.")
        sys.stdout.flush()
        return

    # 2. Get data for the prompt
    metrics = Metric.objects.filter(ingestion_job=job).order_by('timestamp')
    if not metrics.exists():
        job.status = 'FAILED'; job.log_details = "Analysis failed: No metrics found for job."; job.save()
        print("BEDROCK LOG: No metrics found, exiting analysis.")
        sys.stdout.flush()
        return
        
    # Check for DataSource existence before accessing
    if not metrics.first().data_source:
        job.status = 'FAILED'; job.log_details = "Analysis failed: Metric has no data_source."; job.save()
        print("BEDROCK LOG: Metric is missing a data_source relation, exiting analysis.")
        sys.stdout.flush()
        return

    data_source = metrics.first().data_source
    summary_stats = metrics.aggregate(
        avg_value=Avg('value'),
        max_value=Max('value')
    )
    
    print("BEDROCK LOG: Data aggregation successful. Starting prompt construction.")
    sys.stdout.flush()

    # 3. Construct the prompt for the LLM (Rest of prompt code is unchanged)
    # ... prompt construction logic ...
    
    # 4. Call Bedrock API
    try:
        bedrock_client = get_bedrock_client()
        
        # ... AWS API call logic (Model ID, Body, Invoke) ...

        response = bedrock_client.invoke_model(
            modelId=model_id,
            contentType='application/json',
            accept='application/json',
            body=body
        )
        
        response_body = response.get('body').read().decode('utf-8')
        response_json = json.loads(response_body)
        insight_text = response_json.get('completion', '').strip()
        
        if insight_text.startswith("```json"):
            insight_text = insight_text.replace("```json", "").replace("```", "").strip()
        
        llm_output = json.loads(insight_text)
        print("BEDROCK LOG: LLM call and JSON parsing successful.")
        sys.stdout.flush()

    except Exception as e:
        # **THIS IS THE LIKELY SOURCE OF THE 500**
        job.status = 'FAILED'; job.log_details = f"Bedrock API call or JSON parsing failed: {e}"; job.save()
        print(f"CRITICAL BEDROCK ERROR: Bedrock call failed. Error: {e}")
        sys.stdout.flush()
        # **Crucial: Do NOT re-raise the exception here. The function should exit gracefully
        # by returning, as the calling view is expecting the job to handle its own failure.**
        return

    # 5. Save the resulting Insight (Database Transaction)
    # ... (Rest of Insight saving logic is unchanged)
    with transaction.atomic():
        insight = Insight.objects.create(
            title=llm_output.get('title', "Bedrock Analysis Error"),
            summary=llm_output.get('summary', "Could not parse analysis summary."),
            recommendations=llm_output.get('recommendation', "No recommendation provided."), 
            data_source=data_source
        )

        metrics.update(insight=insight)
        
        job.status = 'COMPLETED'
        job.log_details = f"Analysis complete via Bedrock. Insight ID {insight.id} created."
        job.save()

    print("BEDROCK LOG: Insight saved and job marked COMPLETED.")
    sys.stdout.flush()