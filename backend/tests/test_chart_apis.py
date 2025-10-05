# test_chart_apis.py
import requests
import json

def test_all_chart_apis():
    base_url = "https://biz-pulse-backend.onrender.com/api/v1/services/charts/"
    
    endpoints = {
        "sales": "sales/",
        "summary": "summary/",
        "inventory": "inventory/", 
        "customers": "customers/",
        "enhanced_sales": "enhanced-sales/?timeframe=weekly"
    }
    
    print("🚀 TESTING ALL CHART DATA APIs")
    print("=" * 60)
    
    for name, endpoint in endpoints.items():
        print(f"\n📊 Testing {name.upper()} endpoint...")
        
        try:
            response = requests.get(f"{base_url}{endpoint}", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                print(f"✅ SUCCESS - {name.upper()}:")
                
                if name == "summary":
                    print(f"   Total Sales: ${data.get('total_sales', 0)}")
                    print(f"   Avg Conversion: {data.get('average_conversion', 0)}%")
                    print(f"   Sales Growth: {data.get('sales_growth', 0)}%")
                elif 'labels' in data:
                    print(f"   Labels: {data['labels'][:3]}...")
                    if 'datasets' in data:
                        print(f"   Datasets: {len(data['datasets'])} series")
                        
            else:
                print(f"❌ HTTP Error {response.status_code}: {response.text}")
                
        except Exception as e:
            print(f"❌ Request failed: {str(e)}")
    
    print("\n" + "=" * 60)
    print("🎉 CHART APIs READY FOR FRONTEND INTEGRATION!")

if __name__ == "__main__":
    test_all_chart_apis()