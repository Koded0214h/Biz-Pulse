from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import DataSource, IngestionJob
from .serializers import DataSourceSerializer, IngestionJobSerializer

class DataSourceViewSet(viewsets.ModelViewSet):
    """
    Allows full CRUD operations for Data Sources (ModelViewSet).
    Users can register and manage new data sources.
    """
    queryset = DataSource.objects.all().order_by('-created_at')
    serializer_class = DataSourceSerializer
    permission_classes = [IsAuthenticated]

    # Optional: Filter queryset to only show active data sources if needed
    # def get_queryset(self):
    #     return DataSource.objects.filter(is_active=True)

class IngestionJobViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Provides read-only access to Ingestion Job history (ReadOnlyModelViewSet).
    Jobs are created by the backend, users only monitor their status.
    """
    queryset = IngestionJob.objects.all().order_by('-start_time')
    serializer_class = IngestionJobSerializer
    permission_classes = [IsAuthenticated]