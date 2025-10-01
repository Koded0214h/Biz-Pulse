from rest_framework import serializers
# Assuming your model location is core.models
from .models import DataSource, IngestionJob
# Import models from the other app for cross-app relations
from services.models import Insight

# --- Nested Serializers for Read Operations ---

class InsightSummarySerializer(serializers.ModelSerializer):
    """Used to provide a summary of related Insights within DataSourceSerializer."""
    class Meta:
        model = Insight
        fields = ['id', 'title', 'created_at']

# ----------------------------------------------

class DataSourceSerializer(serializers.ModelSerializer):
    """
    Serializer for the DataSource model.
    It includes a nested summary of related Insights (read-only).
    """
    # Assuming the related_name on Insight model back to DataSource is 'insights'
    insights = InsightSummarySerializer(many=True, read_only=True)

    class Meta:
        model = DataSource
        fields = ['id', 'name', 'source_type', 'config_json', 'is_active', 'created_at', 'insights']
        read_only_fields = ['created_at'] # User should not set creation time

class IngestionJobSerializer(serializers.ModelSerializer):
    """
    Serializer for the IngestionJob model.
    Displays the name of the related DataSource for context.
    """
    # Use source='data_source.name' to display the name instead of just the ID for reading
    data_source_name = serializers.CharField(source='data_source.name', read_only=True)

    class Meta:
        model = IngestionJob
        fields = ['id', 'data_source', 'data_source_name', 'status', 'start_time', 'end_time', 'log_details']
        # The 'data_source' field remains PrimaryKeyRelatedField for lookups
        read_only_fields = ['status', 'start_time', 'end_time', 'log_details']