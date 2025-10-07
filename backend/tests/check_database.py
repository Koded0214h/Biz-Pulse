# check_database.py
import requests
import os
from dotenv import load_dotenv

load_dotenv()

def check_metrics():
    # Use your internal API key
    headers = {
        'X-Internal-API-Key': 'raheemah-is-the-best'
    }
    
    # Check recent metrics
    response = requests.get(
        'https://biz-pulse-backend.onrender.com/api/v1/services/metrics/',
        headers=headers
    )
    
    if response.status_code == 200:
        metrics = response.json()
        print(f"📊 Found {len(metrics)} metrics in database")
        
        # Check for product data
        products = set()
        for metric in metrics:
            if metric.get('metadata') and 'product' in metric['metadata']:
                products.add(metric['metadata']['product'])
        
        if products:
            print(f"🎯 Products in database: {list(products)}")
        else:
            print("❌ No product data found in metrics")
    else:
        print(f"❌ Failed to fetch metrics: {response.status_code}")

if __name__ == "__main__":
    check_metrics()