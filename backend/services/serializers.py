from rest_framework import serializers
from .models import Metric, Insight, Alert
# Import DataSource from core for cross-app relation
from core.models import DataSource

# --- Nested Serializers for Read Operations ---

class MetricReadSerializer(serializers.ModelSerializer):
    """Used for nested representation of Metrics within InsightSerializer."""
    class Meta:
        model = Metric
        fields = ['id', 'name', 'value', 'timestamp'] 

class InsightSummarySerializer(serializers.ModelSerializer):
    """Used for nested representation of related Insights within AlertSerializer."""
    data_source_name = serializers.CharField(source='data_source.name', read_only=True)

    class Meta:
        model = Insight
        fields = ['id', 'title', 'summary', 'data_source_name']
# ----------------------------------------------


class MetricCreateSerializer(serializers.ModelSerializer):
    """
    Serializer optimized for metric creation via the internal bulk API (Glue Job).
    """
    # Explicitly define data_source_id as the Glue job provides the ID, not the object.
    data_source_id = serializers.PrimaryKeyRelatedField(queryset=DataSource.objects.all(), source='data_source')

    class Meta:
        model = Metric
        # Only include fields required for metric creation
        fields = ['data_source_id', 'name', 'value', 'timestamp']


# --- NEW: Anomaly Ingest Serializer ---
class AnomalyIngestSerializer(serializers.Serializer):
    """Serializer for receiving anomaly data from a simulated Lookout service."""
    
    # The ID of the DataSource where the anomaly occurred
    data_source_id = serializers.IntegerField() 
    
    # A brief description of the anomaly event
    anomaly_title = serializers.CharField(max_length=255)
    
    # The metric (e.g., 'Daily Sales') that was flagged
    metric_name = serializers.CharField(max_length=255)
    
    # The timestamp of the anomaly
    timestamp = serializers.DateTimeField()
    
    # The severity score (e.g., 0.95 for 95% confidence)
    severity_score = serializers.FloatField(required=False, default=0.0)
# ---------------------------------------


class MetricViewSetSerializer(serializers.ModelSerializer):
    """
    Main Serializer for Metric (Used for READ operations).
    Displays the summary of the related Insight for context.
    """
    insight_summary = serializers.CharField(source='insight.summary', read_only=True)

    class Meta:
        model = Metric
        fields = ['id', 'insight_summary', 'name', 'value', 'timestamp']
        read_only_fields = ['timestamp']


class InsightViewSetSerializer(serializers.ModelSerializer):
    """
    Main Serializer for Insight.
    Includes nested metrics and the name of the data source.
    """
    data_source_name = serializers.CharField(source='data_source.name', read_only=True)
    metrics = serializers.SerializerMethodField()
    
    # --- ADDED 'source' FIELD ---
    source = serializers.CharField(read_only=True) 

    def get_metrics(self, obj):
        return MetricReadSerializer(obj.metrics.all(), many=True).data

    class Meta:
        model = Insight
        # ADDED 'source' to fields
        fields = ['id', 'title', 'summary', 'source', 'data_source', 'data_source_name', 'created_at', 'metrics']
        read_only_fields = ['data_source', 'created_at', 'metrics']


class AlertViewSetSerializer(serializers.ModelSerializer):
    """
    Main Serializer for Alert.
    Includes a summary of the related Insight for context.
    """
    insight = InsightSummarySerializer(read_only=True)

    class Meta:
        model = Alert
        fields = ['id', 'insight', 'severity', 'status', 'details_json', 'created_at', 'acknowledged_at']
        read_only_fields = ['insight', 'created_at', 'acknowledged_at']
        
class PredictionDataSerializer(serializers.Serializer):
    date = serializers.DateField()
    value = serializers.FloatField()

class ForecastIngestSerializer(serializers.Serializer):
    data_source_id = serializers.IntegerField() 
    metric_name = serializers.CharField(max_length=255)
    prediction_time = serializers.DateTimeField()
    prediction_data = PredictionDataSerializer(many=True) 