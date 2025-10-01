import os
import json
import time
import boto3  # You MUST have boto3 installed via requirements.txt
from django.db import transaction
from django.db.models import Avg, Max
from services.models import IngestionJob, Insight, Metric

# --- Setup Boto3 Client ---
# Boto3 automatically uses the environment variables (AWS_ACCESS_KEY_ID, etc.)
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
    except IngestionJob.DoesNotExist:
        return

    # 2. Get data for the prompt
    metrics = Metric.objects.filter(ingestion_job=job).order_by('timestamp')
    if not metrics.exists():
        job.status = 'FAILED'; job.log_details = "Analysis failed: No metrics found."; job.save()
        return
        
    data_source = metrics.first().data_source
    summary_stats = metrics.aggregate(
        avg_value=Avg('value'),
        max_value=Max('value')
    )
    
    # Format a prompt using the data (e.g., using summary stats and sample data)
    prompt_data = {
        "data_source_name": data_source.name,
        "max_value": f"{summary_stats['max_value']:.2f}",
        "avg_value": f"{summary_stats['avg_value']:.2f}",
        "sample_metrics": [
            {'name': m.name, 'value': m.value, 'timestamp': str(m.timestamp)} 
            for m in metrics[:5]
        ]
    }

    # 3. Construct the prompt for the LLM
    prompt = f"""
    Analyze the following key performance metrics for the {prompt_data['data_source_name']} data source:
    Maximum Value: {prompt_data['max_value']}
    Average Value: {prompt_data['avg_value']}
    
    Sample Data Points: {prompt_data['sample_metrics']}

    Based on this data, provide a two-sentence narrative business insight and a short recommendation.
    Format your response STRICTLY as a JSON object with keys: "title", "summary", and "recommendation".
    """

    # 4. Call Bedrock API
    try:
        bedrock_client = get_bedrock_client()
        
        # Using Anthropic Claude 3 Haiku for cost-efficiency and fast response
        model_id = 'anthropic.claude-3-haiku-20240307-v1:0' 
        
        body = json.dumps({
            "prompt": f"\n\nHuman: {prompt}\n\nAssistant:",
            "max_tokens_to_sample": 1024,
            "temperature": 0.5,
        })

        response = bedrock_client.invoke_model(
            modelId=model_id,
            contentType='application/json',
            accept='application/json',
            body=body
        )
        
        # Parse the streaming response (for real-time, but here we read it all)
        response_body = response.get('body').read().decode('utf-8')
        response_json = json.loads(response_body)
        
        # Extract the text and attempt to parse the JSON output from the LLM
        insight_text = response_json.get('completion', '').strip()
        
        # Clean the insight text (Claude often wraps the JSON in markdown)
        if insight_text.startswith("```json"):
            insight_text = insight_text.replace("```json", "").replace("```", "").strip()
        
        llm_output = json.loads(insight_text)

    except Exception as e:
        # If Bedrock fails, mark the job as failed and log the error
        job.status = 'FAILED'; job.log_details = f"Bedrock API call failed: {e}"; job.save()
        return

    # 5. Save the resulting Insight (Database Transaction)
    with transaction.atomic():
        insight = Insight.objects.create(
            title=llm_output.get('title', "Bedrock Analysis Error"),
            summary=llm_output.get('summary', "Could not parse analysis summary."),
            # Assuming you have a recommendations field or similar
            recommendations=llm_output.get('recommendation', "No recommendation provided."), 
            data_source=data_source
        )

        metrics.update(insight=insight)
        
        job.status = 'COMPLETED'
        job.log_details = f"Analysis complete via Bedrock. Insight ID {insight.id} created."
        job.save()