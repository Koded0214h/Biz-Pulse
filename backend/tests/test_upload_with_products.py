# test_upload_with_products.py
import requests
import json

def test_upload_with_products():
    print("🚀 Testing CSV upload with product data...")
    
    # Your CSV content with products
    csv_content = """timestamp,metric_name,value,product
2024-01,Daily_Sales,12500.75,Product Alpha
2024-02,Daily_Sales,11800.25,Product Bravo
2024-03,Daily_Sales,14200.50,Product Charlie
2024-04,Daily_Sales,13800.80,Product Alpha
2024-05,Daily_Sales,16200.25,Product Delta"""
    
    # Create a test file
    files = {
        'file': ('test_products.csv', csv_content, 'text/csv')
    }
    
    data = {
        'job_id': '1'
    }
    
    try:
        response = requests.post(
            'https://biz-pulse-backend.onrender.com/api/v1/services/upload/',
            files=files,
            data=data
        )
        
        print(f"📤 Upload Response: {response.status_code}")
        if response.status_code == 201:
            result = response.json()
            print(f"✅ Upload Successful: {result}")
            
            # Wait a bit for processing
            print("⏳ Waiting for processing...")
            import time
            time.sleep(10)
            
            # Test Amazon Q with new data
            test_amazon_q()
        else:
            print(f"❌ Upload Failed: {response.text}")
            
    except Exception as e:
        print(f"❌ Upload Error: {e}")

def test_amazon_q():
    print("\n🤖 Testing Amazon Q with new data...")
    
    questions = [
        "What products were in the most recent upload?",
        "List all products from the latest CSV file",
        "What products do I have?"
    ]
    
    for question in questions:
        response = requests.post(
            'https://biz-pulse-backend.onrender.com/api/v1/services/q/ask/',
            json={"question": question}
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"💬 Q: {question}")
            print(f"💡 A: {data.get('answer', 'No answer')}")
            print("---")

if __name__ == "__main__":
    test_upload_with_products()