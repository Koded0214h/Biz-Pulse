# debug_pipeline.py
import requests

def debug_pipeline():
    print("🔧 DEBUGGING BIZPULSE PIPELINE")
    print("=" * 50)
    
    # Test Amazon Q
    print("\n1. Testing Amazon Q...")
    response = requests.post(
        'https://biz-pulse-backend.onrender.com/api/v1/services/q/ask/',
        json={"question": "What data sources do you have access to?"}
    )
    
    if response.status_code == 200:
        data = response.json()
        print(f"   Amazon Q Status: ✅ Working")
        print(f"   Answer: {data.get('answer', 'No answer')[:100]}...")
    else:
        print(f"   Amazon Q Status: ❌ Failed ({response.status_code})")
    
    # Test if new data is accessible
    print("\n2. Testing data access...")
    response = requests.post(
        'https://biz-pulse-backend.onrender.com/api/v1/services/q/ask/',
        json={"question": "What is the most recent data you have?"}
    )
    
    if response.status_code == 200:
        data = response.json()
        print(f"   Recent Data: {data.get('answer', 'No answer')[:100]}...")

if __name__ == "__main__":
    debug_pipeline()