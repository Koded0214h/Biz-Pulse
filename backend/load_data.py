import os
import django
import pandas as pd
from datetime import datetime

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from core.models import DataSource, IngestionJob
from services.models import Metric
from django.db import transaction

def load_business_data():
    # Read CSV
    df = pd.read_csv('business data.csv')

    # Create or get DataSource
    data_source, created = DataSource.objects.get_or_create(
        id=1,
        defaults={'name': 'Business Data Source'}
    )

    # Create IngestionJob
    job = IngestionJob.objects.create(
        data_source=data_source,
        status='PROCESSING'
    )

    metrics_to_create = []

    for _, row in df.iterrows():
        # Convert timestamp like '2024-01' to datetime (assume first day of month)
        timestamp_str = str(row['timestamp'])
        if len(timestamp_str) == 7:  # YYYY-MM
            timestamp = datetime.strptime(timestamp_str + '-01', '%Y-%m-%d')
        else:
            timestamp = datetime.strptime(timestamp_str, '%Y-%m-%d')

        metadata = {}
        if pd.notna(row.get('product')):
            metadata['product'] = row['product']

        metric = Metric(
            data_source=data_source,
            ingestion_job=job,
            name=row['metric_name'],
            value=float(row['value']),
            timestamp=timestamp,
            metadata=metadata if metadata else None
        )
        metrics_to_create.append(metric)

    # Bulk create
    with transaction.atomic():
        Metric.objects.bulk_create(metrics_to_create)
        job.status = 'COMPLETED'
        job.save()

    print(f"Loaded {len(metrics_to_create)} metrics from CSV")

if __name__ == '__main__':
    load_business_data()
