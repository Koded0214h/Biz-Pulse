from rest_framework import serializers
from .models import Metric, Insight, Alert
# Import DataSource from core for cross-app relation
from core.models import DataSource

# --- Nested Serializers for Read Operations ---

class MetricReadSerializer(serializers.ModelSerializer):
    """Used for nested representation of Metrics within InsightSerializer."""
    class Meta:
        model = Metric
        fields = ['id', 'key', 'value', 'timestamp'] # Exclude the insight FK to prevent circular nesting

class InsightSummarySerializer(serializers.ModelSerializer):
    """Used for nested representation of related Insights within AlertSerializer."""
    # To avoid deep nesting, we only provide key fields
    data_source_name = serializers.CharField(source='data_source.name', read_only=True)

    class Meta:
        model = Insight
        fields = ['id', 'title', 'data_source_name']
# ----------------------------------------------


class MetricViewSetSerializer(serializers.ModelSerializer):
    """
    Main Serializer for Metric.
    Displays the title of the related Insight for context.
    """
    insight_title = serializers.CharField(source='insight.title', read_only=True)

    class Meta:
        model = Metric
        fields = ['id', 'insight', 'insight_title', 'key', 'value', 'timestamp']
        read_only_fields = ['insight', 'timestamp']


class InsightViewSetSerializer(serializers.ModelSerializer):
    """
    Main Serializer for Insight.
    Includes nested metrics and the name of the data source.
    """
    data_source_name = serializers.CharField(source='data_source.name', read_only=True)
    # Assuming related_name='metrics' on the Metric model pointing to Insight
    metrics = MetricReadSerializer(many=True, read_only=True)

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