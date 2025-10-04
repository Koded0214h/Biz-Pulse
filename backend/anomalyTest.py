import os
import django 
import datetime
import json
import sys

# --- CRITICAL FIX: Setup Django Environment ---
# NOTE: Ensure 'backend.settings' is the correct path to your settings file.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings') 
django.setup() 
# ----------------------------------------------

from internal_api.views import AnomalyIngestView
from rest_framework.test import APIRequestFactory
from services.models import Insight
from core.models import DataSource 

# --- 0. PASTE YOUR TOKEN HERE ---
# Retrieve your JWT access token and paste it here.
MY_INTERNAL_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzU5Mzg2NjQ5LCJpYXQiOjE3NTkzODYzNDksImp0aSI6IjQxODg1NzNlZGIwMzQ4M2I5YTM2Y2Q1NzJiMGZjNjUxIiwidXNlcl9pZCI6IjEifQ.YonQQNapvlSOB5qxpHMuoN0LtuDjmR_hnqQlRW-3rmY'
# --------------------------------

TEST_ANOMALY_DATA = {
    "data_source_id": 1, 
    "anomaly_title": "Critical spike in Daily Sales (Lookout)",
    "metric_name": "Daily Sales",
    "timestamp": datetime.datetime.now().isoformat(),
    "severity_score": 0.98
}

print("--- SIMULATING ANOMALY INGESTION ---")

try:
    # Ensure the placeholder data source exists before testing the view logic
    ds, created = DataSource.objects.get_or_create(
        id=1, 
        defaults={'name': 'Hackathon Placeholder Source'}
    )
    if created:
        print("INFO: Created placeholder DataSource ID=1.")

    
    # -----------------------------------------------------------
    # CRITICAL FIX: Add the Authorization Header with 'Bearer' for JWT
    # -----------------------------------------------------------
    HEADERS = {
        # Format is 'Bearer <JWT>'
        'HTTP_AUTHORIZATION': f'Bearer {MY_INTERNAL_TOKEN}' 
    }

    factory = APIRequestFactory()
    
    # The HEADEERS are passed using the **kwargs syntax
    request = factory.post(
        '/api/v1/internal/anomalies/ingest/', 
        TEST_ANOMALY_DATA, 
        format='json',
        **HEADERS # <--- This injects 'HTTP_AUTHORIZATION' into the request
    )

    # Get the view and execute the request
    view = AnomalyIngestView.as_view()
    response = view(request)
    response.render() 

    print(f"API Response Status: {response.status_code}")
    print(f"API Response Body: {response.content.decode()}")

except Exception as e:
    print(f"TEST FAILED due to uncaught exception: {e}")
    sys.exit()

print("\n--- DATABASE VERIFICATION ---")
try:
    latest_anomaly_insight = Insight.objects.filter(source='LOOKOUT').latest('created_at')

    print("✅ SUCCESS: Found new Insight with LOOKOUT source.")
    print(f"ID: {latest_anomaly_insight.id}")
    print(f"Source: {latest_anomaly_insight.source}")
    print(f"Title: {latest_anomaly_insight.title}")
    print(f"Summary starts with: {latest_anomaly_insight.summary[:80]}...")
    
except Insight.DoesNotExist:
    print("❌ FAILURE: No Insight found with source='LOOKOUT'. Check view logic and ensure your token is valid.")