import requests
import json

def test_amazon_q():
    base_url = "https://biz-pulse-backend.onrender.com/api/v1/q/ask/"
    
    test_questions = [
        "What were my total sales last month?",
        "Show me inventory trends",
        "What do customers say about my products?",
        "Are there any sales anomalies?"
    ]
    
    for question in test_questions:
        print(f"\n🔍 Testing: {question}")
        
        response = requests.post(base_url, json={"question": question})
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Answer: {data.get('answer', 'No answer')[:100]}...")
        else:
            print(f"❌ Error: {response.status_code} - {response.text}")

if __name__ == "__main__":
    test_amazon_q()