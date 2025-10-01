# services/serializers.py
from rest_framework import serializers
from .models import Metric, Insight, Alert
# Import DataSource from core for cross-app relation
from core.models import DataSource

# --- Nested Serializers for Read Operations ---

class MetricReadSerializer(serializers.ModelSerializer):
    """Used for nested representation of Metrics within InsightSerializer."""
    class Meta:
        model = Metric
        # CORRECTED: Changed 'key' to 'name' to match the Metric model
        fields = ['id', 'name', 'value', 'timestamp'] # Exclude the insight FK to prevent circular nesting

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

    def get_metrics(self, obj):
        return MetricReadSerializer(obj.metrics.all(), many=True).data

    class Meta:
        model = Insight
        fields = ['id', 'title', 'summary', 'data_source', 'data_source_name', 'created_at', 'metrics']
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