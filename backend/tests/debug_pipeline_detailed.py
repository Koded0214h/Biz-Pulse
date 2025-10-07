# debug_pipeline_detailed.py
import requests
import json

def debug_full_pipeline():
    print("🔧 FULL PIPELINE DEBUG")
    print("=" * 60)
    
    # 1. Test upload endpoint
    print("\n1. Testing Upload Endpoint...")
    try:
        # Simple test without file upload
        response = requests.get('https://biz-pulse-backend.onrender.com/api/v1/services/upload/')
        print(f"   Upload endpoint status: {response.status_code}")
    except Exception as e:
        print(f"   Upload endpoint error: {e}")
    
    # 2. Test if Glue job would be triggered
    print("\n2. Testing S3 Lambda Integration...")
    print("   (This requires actual file upload to S3)")
    
    # 3. Check recent activity
    print("\n3. Checking Recent Activity...")
    headers = {'X-Internal-API-Key': 'raheemah-is-the-best'}
    
    try:
        # Check ingestion jobs
        response = requests.get(
            'https://biz-pulse-backend.onrender.com/api/v1/services/ingestion-jobs/',
            headers=headers
        )
        if response.status_code == 200:
            jobs = response.json()
            print(f"   Recent ingestion jobs: {len(jobs)}")
            for job in jobs[:3]:
                print(f"     - Job {job.get('id')}: {job.get('status')}")
        else:
            print(f"   Cannot fetch jobs: {response.status_code}")
            
    except Exception as e:
        print(f"   Error checking jobs: {e}")

if __name__ == "__main__":
    debug_full_pipeline()