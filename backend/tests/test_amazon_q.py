# test_amazon_q_detailed.py
import requests
import json

def test_detailed():
    base_url = "https://biz-pulse-backend.onrender.com/api/v1/services/q/ask/"
    
    questions = [
        "What data do you have?",
        "Show me sales data",
        "What is in the CSV files?"
    ]
    
    for question in questions:
        print(f"\n{'='*60}")
        print(f"🔍 Question: {question}")
        print(f"{'='*60}")
        
        response = requests.post(base_url, json={"question": question})
        
        if response.status_code == 200:
            data = response.json()
            print(f"📊 Answer: {data.get('answer')}")
            print(f"🔧 Error: {data.get('error', 'None')}")
            print(f"💬 Conversation ID: {data.get('conversation_id', 'None')}")
            
            sources = data.get('sources', [])
            print(f"📚 Sources: {len(sources)}")
            for i, source in enumerate(sources):
                print(f"   {i+1}. {source.get('title', 'No title')}")
                print(f"      URL: {source.get('url', 'No URL')}")
        else:
            print(f"❌ HTTP Error: {response.status_code}")
            print(f"Response: {response.text}")

if __name__ == "__main__":
    test_detailed()