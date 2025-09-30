from django.db import models

from core.models import DataSource, IngestionJob

# Create your models here.

class Metric(models.Model):
    data_source = models.ForeignKey(DataSource, on_delete=models.CASCADE, related_name="metrics")
    name = models.CharField(max_length=255)   # e.g., "Daily Sales", "Customer Sentiment Score"
    value = models.FloatField()
    timestamp = models.DateTimeField()
    ingestion_job = models.ForeignKey(IngestionJob, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"{self.name} = {self.value} @ {self.timestamp}"

class Insight(models.Model):
    metric = models.ForeignKey("Metric", on_delete=models.CASCADE, related_name="insights")
    text = models.TextField()   # LLM narrative explaining the metric
    recommendations = models.JSONField(blank=True, null=True)   # actionable steps
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Insight for {self.metric.name} @ {self.created_at}"

class Alert(models.Model):
    insight = models.ForeignKey("Insight", on_delete=models.CASCADE, related_name="alerts")
    ALERT_TYPES = [
        ("EMAIL", "Email"),
        ("SMS", "SMS"),
        ("PUSH", "Push Notification"),
    ]
    type = models.CharField(max_length=20, choices=ALERT_TYPES)
    sent = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add=True)
    recipient = models.CharField(max_length=255, blank=True, null=True)  # email or phone

    def __str__(self):
        return f"{self.type} alert for {self.insight.metric.name} sent={self.sent}"
