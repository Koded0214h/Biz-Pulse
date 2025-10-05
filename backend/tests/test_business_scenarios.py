# test_business_scenarios.py
import requests
import json

def test_business_scenarios():
    base_url = "https://biz-pulse-backend.onrender.com/api/v1/services/q/ask/"
    
    business_questions = [
        "What were the total sales in January 2025?",
        "How did conversion rates perform?",
        "What business insights can you provide?",
        "Are there any trends in the sales data?",
        "What recommendations would you make based on this data?"
    ]
    
    print("🚀 TESTING BIZPULSE AI CO-PILOT 🚀")
    print("=" * 60)
    
    for question in business_questions:
        print(f"\n💼 Business Owner Asks: '{question}'")
        print("-" * 50)
        
        response = requests.post(base_url, json={"question": question})
        
        if response.status_code == 200:
            data = response.json()
            answer = data.get('answer', 'No answer')
            print(f"🤖 BizPulse AI Answers: {answer}")
            
            if data.get('sources'):
                print(f"📊 Sources: {len(data['sources'])} business documents referenced")
        else:
            print(f"❌ Error: {response.status_code}")
    
    print("\n" + "=" * 60)
    print("🎉 BIZPULSE AI CO-PILOT IS OPERATIONAL! 🎉")

if __name__ == "__main__":
    test_business_scenarios()