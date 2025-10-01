import os
import django 
import datetime
import sys


# --- Setup Django Environment ---
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings') # Adjust 'backend.settings' if necessary
django.setup() 
# --------------------------------

from internal_api.views import ForecastIngestView
from services.models import Insight, ForecastPrediction
from core.models import DataSource 
from rest_framework.test import APIRequestFactory

# --- 0. PASTE YOUR TOKEN HERE ---
MY_INTERNAL_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzU5MzUwMDExLCJpYXQiOjE3NTkzNDk3MTQsImp0aSI6IjEwOWE3OThmZTk2MjRkYTBhMWQ0MTJhMTQ4MzkxODM5IiwidXNlcl9pZCI6IjIifQ.CtF7KDfu3uaTntHkhKTLKs0mUV5gMr0INBLXkGrcfH0'
# --------------------------------

# --- 1. Simulation Data ---
TEST_FORECAST_DATA = {
    "data_source_id": 1, 
    "metric_name": "Weekly Inventory Needs",
    # Prediction starts tomorrow
    "prediction_time": (datetime.datetime.now() + datetime.timedelta(days=1)).isoformat(),
    "prediction_data": [
        {"date": (datetime.date.today() + datetime.timedelta(days=1)).isoformat(), "value": 550.0},
        {"date": (datetime.date.today() + datetime.timedelta(days=2)).isoformat(), "value": 610.5},
        {"date": (datetime.date.today() + datetime.timedelta(days=3)).isoformat(), "value": 690.0}, # Rising trend
        {"date": (datetime.date.today() + datetime.timedelta(days=4)).isoformat(), "value": 730.25},
    ]
}

def run_test():
    print("--- SIMULATING FORECAST INGESTION ---")
    
    try:
        # Ensure the placeholder data source exists
        DataSource.objects.get_or_create(id=1, defaults={'name': 'Hackathon Placeholder Source'})
        
        # Setup headers with the Bearer token
        HEADERS = {'HTTP_AUTHORIZATION': f'Bearer {MY_INTERNAL_TOKEN}'}
        
        factory = APIRequestFactory()
        request = factory.post(
            '/api/v1/internal/forecasts/ingest/', 
            TEST_FORECAST_DATA, 
            format='json',
            **HEADERS
        )

        view = ForecastIngestView.as_view()
        response = view(request)
        response.render() 

        print(f"API Response Status: {response.status_code}")
        print(f"API Response Body: {response.content.decode()}")

    except Exception as e:
        print(f"TEST FAILED during view execution: {e}")
        sys.exit(1)

    # --- 3. Database Verification ---
    print("\n--- DATABASE VERIFICATION ---")
    try:
        latest_forecast = ForecastPrediction.objects.latest('created_at')
        latest_insight = Insight.objects.filter(source='FORECAST').latest('created_at')

        print("✅ SUCCESS: Found new ForecastPrediction record.")
        print(f"Prediction Metric: {latest_forecast.metric_name}")
        print(f"Prediction Count: {len(latest_forecast.prediction_data)}")
        
        print("\n✅ SUCCESS: Found new Insight (Narrative Summary).")
        print(f"Insight Title: {latest_insight.title}")
        print(f"Insight Source: {latest_insight.source}")
        
    except (ForecastPrediction.DoesNotExist, Insight.DoesNotExist):
        print("❌ FAILURE: ForecastPrediction or FORECAST Insight not found.")
    except Exception as e:
        print(f"❌ FAILURE during DB query: {e}")

if __name__ == "__main__":
    run_test()