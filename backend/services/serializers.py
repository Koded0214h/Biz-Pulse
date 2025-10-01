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
        fields = ['id', 'title', 'data_source_name']
# ----------------------------------------------


class MetricCreateSerializer(serializers.ModelSerializer):
    """
    Serializer optimized for metric creation via the internal bulk API (Glue Job).
    """
    # Explicitly define data_source_id as the Glue job provides the ID, not the object.
    data_source_id = serializers.IntegerField()
    
    class Meta:
        model = Metric
        # Only include fields required for metric creation
        fields = ['data_source_id', 'name', 'value', 'timestamp']


class MetricViewSetSerializer(serializers.ModelSerializer):
    """
    Main Serializer for Metric (Used for READ operations).
    Displays the title of the related Insight for context.
    """
    # The Metric model's reverse relation to Insight is named 'insights'
    # This uses a Source field to safely access the title of the related Insight(s)
    # Note: Accessing insights.first is safer than a direct foreign key on Metric
    insight_title = serializers.CharField(source='insights.first.text', read_only=True)

    class Meta:
        model = Metric
        # FIXED: Removed 'insight' from the fields list, as it does not exist on the Metric model.
        # Used 'name' instead of 'key'
        fields = ['id', 'insight_title', 'name', 'value', 'timestamp']
        read_only_fields = ['timestamp']
        # The 'insights' relation is now accessed via the insight_title custom field.


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