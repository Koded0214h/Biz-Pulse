from django.db import models
from django.conf import settings

# Create your models here.
class DataSource(models.Model):
    # Link source to a user/org
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name="data_sources"
    )
    
    # General info
    name = models.CharField(max_length=255)  # e.g. "POS Sales Nigeria", "Google Reviews"
    description = models.TextField(blank=True, null=True)
    
    # Source type
    SOURCE_TYPES = [
        ("POS", "Point of Sale"),
        ("REVIEWS", "Customer Reviews"),
        ("SOCIAL", "Social Media"),
        ("CUSTOM", "Custom Upload"),
    ]
    source_type = models.CharField(max_length=50, choices=SOURCE_TYPES)

    # AWS-related ingestion setup
    s3_bucket = models.CharField(max_length=255, blank=True, null=True)   # Target bucket
    s3_prefix = models.CharField(max_length=255, blank=True, null=True)   # Folder/path in bucket
    appflow_connector = models.CharField(max_length=255, blank=True, null=True)  
    api_gateway_url = models.URLField(blank=True, null=True)  # If it’s API-based
    
    # Metadata
    schema = models.JSONField(blank=True, null=True)   # store structure of ingested data
    config = models.JSONField(blank=True, null=True)   # dynamic connector configs
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.get_source_type_display()})"
    
class IngestionJob(models.Model):
    data_source = models.ForeignKey("DataSource", on_delete=models.CASCADE, related_name="ingestion_jobs")
    status_choices = [
        ("PENDING", "Pending"),
        ("RUNNING", "Running"),
        ("SUCCESS", "Success"),
        ("FAILED", "Failed"),
    ]
    status = models.CharField(max_length=20, choices=status_choices, default="PENDING")
    started_at = models.DateTimeField(auto_now_add=True)
    finished_at = models.DateTimeField(blank=True, null=True)
    records_processed = models.IntegerField(default=0)
    error_message = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.data_source.name} ingestion at {self.started_at} ({self.status})"
