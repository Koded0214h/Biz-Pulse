# test_amazon_q_products.py
import requests
import json

def test_product_questions():
    base_url = "https://biz-pulse-backend.onrender.com/api/v1/services/q/ask/"
    
    product_questions = [
        "What products do I have in my inventory?",
        "List all the products in my business data",
        "What are the different products mentioned in the sales data?",
        "Show me all product names from the CSV files",
        "What items or products are available in the business metrics?"
    ]
    
    print("🔍 TESTING PRODUCT-RELATED QUESTIONS")
    print("=" * 60)
    
    for question in product_questions:
        print(f"\n💼 Question: '{question}'")
        print("-" * 50)
        
        response = requests.post(base_url, json={"question": question})
        
        if response.status_code == 200:
            data = response.json()
            answer = data.get('answer', 'No answer')
            print(f"🤖 Answer: {answer}")
            
            if data.get('sources'):
                print(f"📚 Sources: {len(data['sources'])} documents")
        else:
            print(f"❌ Error: {response.status_code}")

if __name__ == "__main__":
    test_product_questions()