import random
import datetime

# --- LLM PLACEHOLDER FUNCTION ---
def generate_narrative_insight(metric_data_list):
    """
    Simulates calling an LLM (like Bedrock) to analyze metrics and generate an insight.
    
    In production, this would use boto3 to call Bedrock's API, passing a detailed prompt.
    """
    
    # 1. Simple Rule-Based Analysis (Hackathon Substitute)
    last_metric = metric_data_list[-1]
    
    if last_metric.name == "Daily_Sales" and last_metric.value < 1000:
        text = (f"Critical Anomaly: Daily Sales on {last_metric.timestamp.date()} dropped significantly to ${last_metric.value}. "
                "This requires immediate attention. The anomaly is likely due to low inventory or a payment gateway issue.")
        recommendations = {
            "severity": "CRITICAL",
            "actions": ["Check payment gateway status.", "Verify current stock levels for top-selling items.", "Launch a promotional campaign to recover lost sales."]
        }
    else:
        text = (f"Business is stable. The latest metric {last_metric.name} had a value of {last_metric.value} "
                "on {last_metric.timestamp.date()}. Trends are nominal.")
        recommendations = {
            "severity": "LOW",
            "actions": ["Continue monitoring key metrics.", "Run standard end-of-day reports."]
        }
        
    return text, recommendations


# --- ALERTING FUNCTION (SNS PLACEHOLDER) ---
def trigger_sns_alert(alert_instance):
    """
    Simulates sending an alert via AWS SNS or a notification service.
    
    In production, this would use boto3.client('sns').publish(...)
    """
    if alert_instance.type == 'EMAIL':
        print(f"--- FAKE SNS: Sending EMAIL Alert to {alert_instance.recipient} ---")
        print(f"ALERT: {alert_instance.insight.title} (Severity: {alert_instance.insight.recommendations.get('severity')})")
        # Set sent to True in the production flow after a successful API call
        alert_instance.sent = True
        alert_instance.save()
        return True
    return False