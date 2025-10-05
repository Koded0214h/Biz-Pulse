import requests
import json

def test_amazon_q():
    base_url = "https://biz-pulse-backend.onrender.com/api/v1/services/q/ask/"
    
        # Test basic connectivity first
    print("🔧 Testing Amazon Q Configuration...")
    print(f"AMAZON_Q_APP_ID: {'✅ Set' if os.getenv('AMAZON_Q_APP_ID') else '❌ Missing'}")
    print(f"AWS_REGION: {os.getenv('AWS_REGION', 'Not set')}")
    
    test_questions = [
        "What data sources are available?",
        "Tell me about the business data you have access to",
        "What were my total sales last month?",
        "Show me inventory trends"
    ]
    
    for question in test_questions:
        print(f"\n{'='*60}")
        print(f"🔍 Testing: {question}")
        print(f"{'='*60}")
        
        try:
            response = requests.post(
                base_url, 
                json={"question": question},
                timeout=30
            )
            
            print(f"📡 Status Code: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Success: {data.get('answer', 'No answer')}")
                
                if data.get('sources'):
                    print(f"📚 Sources: {len(data['sources'])} found")
                    for source in data['sources']:
                        print(f"   - {source.get('title', 'Unknown')}")
                
                if data.get('error'):
                    print(f"❌ Error: {data['error']}")
                    
            else:
                print(f"❌ HTTP Error: {response.status_code}")
                print(f"Response: {response.text}")
                
        except Exception as e:
            print(f"🚨 Request Failed: {str(e)}")

if __name__ == "__main__":
    test_amazon_q()