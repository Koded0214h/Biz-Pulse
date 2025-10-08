from django.shortcuts import render
import pandas as pd
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from django.core.files.storage import default_storage
import boto3
import os
import io
from django.db.models import Sum, Avg, Count
from django.utils import timezone
from datetime import timedelta
from django.db.models.functions import TruncMonth

from .models import Metric, Insight, Alert, ForecastPrediction
from .serializers import (
    MetricViewSetSerializer,
    InsightViewSetSerializer,
    AlertViewSetSerializer,
    ForecastPredictionSerializer
)
from .amazon_q_service import AmazonQService
from services.models import IngestionJob

# Create your views here.

class UploadDataView(APIView):
    def post(self, request, *args, **kwargs):
        try:
            file_obj = request.FILES.get("file")
            job_id = request.data.get("job_id", "1")
            
            print(f"DEBUG: Starting upload - File: {file_obj.name if file_obj else 'None'}, Job ID: {job_id}")
            
            if not file_obj:
                return Response({"error": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST)
            
            # ✅ CREATE OR GET INGESTION JOB BEFORE UPLOADING TO S3
            try:
                print(f"DEBUG: Attempting to get_or_create IngestionJob with id={job_id}")
                job, created = IngestionJob.objects.get_or_create(
                    id=job_id,
                    defaults={
                        'status': 'UPLOADED',
                        'log_details': f'File {file_obj.name} uploaded successfully'
                    }
                )
                if not created:
                    # Update existing job
                    job.status = 'UPLOADED'
                    job.log_details = f'File {file_obj.name} re-uploaded'
                    job.save()
                    
                print(f"DEBUG: IngestionJob {job_id} ensured to exist. Created: {created}")
            except Exception as e:
                print(f"ERROR: Failed to create IngestionJob: {str(e)}")
                import traceback
                print(f"TRACEBACK: {traceback.format_exc()}")
                return Response({"error": f"Failed to create job record: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            file_path = f"raw-data/{file_obj.name}"
            bucket_name = os.getenv("AWS_STORAGE_BUCKET_NAME")
            
            print(f"DEBUG: Bucket name from env: {bucket_name}")
            
            if not bucket_name:
                return Response({"error": "S3 bucket not configured"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            s3 = boto3.client('s3')
            try:
                print(f"DEBUG: Uploading to S3 - Bucket: {bucket_name}, Key: {file_path}")
                s3.upload_fileobj(
                    file_obj,
                    bucket_name,
                    file_path,
                    ExtraArgs={
                        'Metadata': {
                            'django-job-id': str(job_id)
                        }
                    }
                )
                print("DEBUG: S3 upload successful")
            except Exception as e:
                print(f"ERROR: S3 upload failed: {str(e)}")
                return Response({"error": f"S3 upload failed: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            file_url = f"https://{bucket_name}.s3.amazonaws.com/{file_path}"
            
            print("DEBUG: Upload completed successfully")
            
            return Response({
                "message": "File uploaded successfully!",
                "file_path": file_path,
                "file_url": file_url,
                "job_id": job_id,
                "job_status": job.status
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            print(f"UNEXPECTED ERROR in UploadDataView: {str(e)}")
            import traceback
            print(f"FULL TRACEBACK: {traceback.format_exc()}")
            return Response({"error": f"Internal server error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class MetricViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Provides read-only access to Metric data.
    """
    queryset = Metric.objects.all().order_by('-timestamp')
    serializer_class = MetricViewSetSerializer
    permission_classes = [IsAuthenticated]

class InsightViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Provides read-only access to Insight data.
    """
    queryset = Insight.objects.all().order_by('-created_at')
    serializer_class = InsightViewSetSerializer
    permission_classes = [IsAuthenticated]

class AlertViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Provides read-only access to Alert data.
    """
    queryset = Alert.objects.all().order_by('-timestamp')
    serializer_class = AlertViewSetSerializer
    permission_classes = [IsAuthenticated]
    
    
class ForecastPredictionViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Provides read-only access to structured Forecast Prediction data.
    """
    queryset = ForecastPrediction.objects.all().order_by('-prediction_time')
    serializer_class = ForecastPredictionSerializer
    permission_classes = [IsAuthenticated]

    # Optional: Filter by data source for convenience
    def get_queryset(self):
        queryset = super().get_queryset()
        data_source_id = self.request.query_params.get('data_source_id')
        if data_source_id is not None:
            queryset = queryset.filter(data_source_id=data_source_id)
        return queryset
    

# services/views.py
class NaturalLanguageQueryView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request, *args, **kwargs):
        question = request.data.get('question')
        
        if not question:
            return Response({"error": "Question is required"}, status=400)
        
        try:
            q_service = AmazonQService()
            # ⚠️ No user_id parameter needed for anonymous access
            result = q_service.ask_question(question=question)
            
            return Response(result)
            
        except Exception as e:
            return Response({
                "error": "Failed to process your question",
                "details": str(e)
            }, status=500)
            
            
class SalesSummaryView(APIView):
    """Serve sales summary metrics for sales deep dive page"""
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        try:
            summary = self.calculate_sales_summary()
            return Response(summary)
        except Exception as e:
            return Response({"error": str(e)}, status=500)

    def calculate_sales_summary(self):
        try:
            total_revenue_agg = Metric.objects.filter(name='Daily_Sales').aggregate(total=Sum('value'))
            total_revenue = total_revenue_agg['total'] or 0

            avg_order_value_agg = Metric.objects.filter(name='Average_Order_Value').aggregate(avg=Avg('value'))
            avg_order_value = avg_order_value_agg['avg'] or 0

            conversion_rate_agg = Metric.objects.filter(name='Conversion_Rate').aggregate(avg=Avg('value'))
            conversion_rate = conversion_rate_agg['avg'] or 0

            # Calculate growth for total revenue (last 30 days vs previous 30 days)
            from django.utils.timezone import now
            from datetime import timedelta

            today = now().date()
            last_30_days = today - timedelta(days=30)
            prev_30_days = today - timedelta(days=60)

            recent_revenue = Metric.objects.filter(
                name='Daily_Sales',
                timestamp__gte=last_30_days
            ).aggregate(total=Sum('value'))['total'] or 0

            prev_revenue = Metric.objects.filter(
                name='Daily_Sales',
                timestamp__gte=prev_30_days,
                timestamp__lt=last_30_days
            ).aggregate(total=Sum('value'))['total'] or 0

            if prev_revenue > 0:
                revenue_growth = ((recent_revenue - prev_revenue) / prev_revenue) * 100
            else:
                revenue_growth = 0

            return {
                "total_revenue": total_revenue,
                "avg_order_value": avg_order_value,
                "conversion_rate": conversion_rate,
                "revenue_growth": round(revenue_growth, 1)
            }
        except Exception as e:
            return {
                "total_revenue": 4820193,
                "avg_order_value": 245.5,
                "conversion_rate": 3.4,
                "revenue_growth": 12.5
            }


class SalesDataView(APIView):
    """Serve sales data for line charts"""
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        try:
            # Get data from database
            sales_data = self.get_sales_data()

            return Response({
                "labels": sales_data['dates'],
                "datasets": [{
                    "label": "Daily Sales",
                    "data": sales_data['values'],
                    "borderColor": 'rgb(75, 192, 192)',
                    "backgroundColor": 'rgba(75, 192, 192, 0.2)',
                }]
            })

        except Exception as e:
            return Response({"error": str(e)}, status=500)

    def get_sales_data(self):
        # Get sales data from database
        try:
            sales_metrics = Metric.objects.filter(name='Daily_Sales').order_by('timestamp')
            if sales_metrics.exists():
                dates = [m.timestamp.strftime('%Y-%m') for m in sales_metrics]
                values = [m.value for m in sales_metrics]
                return {
                    'dates': dates,
                    'values': values
                }
            else:
                # Return sample data if no real data
                return {
                    'dates': ['2025-01', '2025-02', '2025-03'],
                    'values': [1500, 1620, 1450]
                }
        except Exception as e:
            # Fallback to sample data
            return {
                'dates': ['2025-01', '2025-02', '2025-03'],
                'values': [1500, 1620, 1450]
            }

class MetricsSummaryView(APIView):
    """Serve summary metrics for dashboard cards"""
    permission_classes = [AllowAny]
    
    def get(self, request, *args, **kwargs):
        try:
            summary = self.calculate_metrics_summary()
            
            return Response({
                "total_sales": summary['total_sales'],
                "average_conversion": summary['avg_conversion'],
                "sales_growth": summary['sales_growth'],
                "active_metrics": summary['active_metrics']
            })
            
        except Exception as e:
            return Response({"error": str(e)}, status=500)
    
    def calculate_metrics_summary(self):
        # Calculate from database
        try:
            # Total sales from Daily_Sales metrics
            total_sales_agg = Metric.objects.filter(name='Daily_Sales').aggregate(total=Sum('value'))
            total_sales = total_sales_agg['total'] or 0

            # Average conversion rate (assuming there's a Conversion_Rate metric)
            avg_conversion_agg = Metric.objects.filter(name='Conversion_Rate').aggregate(avg=Avg('value'))
            avg_conversion = avg_conversion_agg['avg'] or 0.025

            # Sales growth: compare recent vs older data
            sales_metrics = Metric.objects.filter(name='Daily_Sales').order_by('-timestamp')
            if sales_metrics.count() >= 10:
                recent = list(sales_metrics[:5])
                older = list(sales_metrics[5:10])
                recent_sum = sum(m.value for m in recent)
                older_sum = sum(m.value for m in older)
                sales_growth = ((recent_sum - older_sum) / older_sum * 100) if older_sum > 0 else 0
            else:
                sales_growth = 8.2  # fallback

            # Active metrics count
            active_metrics = Metric.objects.values('name').distinct().count()

            return {
                'total_sales': total_sales,
                'avg_conversion': avg_conversion,
                'sales_growth': sales_growth,
                'active_metrics': active_metrics
            }
        except Exception as e:
            # Fallback to sample data if database query fails
            return {
                'total_sales': 4570.75,
                'avg_conversion': 0.025,
                'sales_growth': 8.2,
                'active_metrics': 3
            }

class InventoryTrendsView(APIView):
    """Serve inventory data for bar charts"""
    permission_classes = [AllowAny]
    
    def get(self, request, *args, **kwargs):
        # Sample inventory data structure
        inventory_data = {
            "labels": ["Product A", "Product B", "Product C", "Product D"],
            "datasets": [{
                "label": "Current Stock",
                "data": [120, 150, 80, 200],
                "backgroundColor": [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 205, 86, 0.8)',
                    'rgba(75, 192, 192, 0.8)'
                ]
            }]
        }
        return Response(inventory_data)

class CustomerMetricsView(APIView):
    """Serve customer data for pie charts"""
    permission_classes = [AllowAny]
    
    def get(self, request, *args, **kwargs):
        # Sample customer segmentation
        customer_data = {
            "labels": ["New Customers", "Returning Customers", "VIP Customers"],
            "datasets": [{
                "data": [45, 30, 25],
                "backgroundColor": [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 205, 86, 0.8)'
                ]
            }]
        }
        return Response(customer_data)
    
class EnhancedSalesDataView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request, *args, **kwargs):
        # Get timeframe from query params
        timeframe = request.GET.get('timeframe', 'weekly')  # daily, weekly, monthly
        
        try:
            sales_data = self.get_processed_sales_data(timeframe)
            
            return Response({
                "timeframe": timeframe,
                "chart_type": "line",
                "data": sales_data
            })
            
        except Exception as e:
            return Response({"error": str(e)}, status=500)
    
    def get_processed_sales_data(self, timeframe):
        s3 = boto3.client('s3')
        
        # Aggregate data based on timeframe
        all_sales = []
        
        response = s3.list_objects_v2(Bucket='bizpulse-data-lake', Prefix='raw-data/')
        
        for obj in response.get('Contents', []):
            if obj['Key'].endswith('.csv'):
                file_obj = s3.get_object(Bucket='bizpulse-data-lake', Key=obj['Key'])
                df = pd.read_csv(io.BytesIO(file_obj['Body'].read()))
                
                # Process sales data
                sales_df = df[df['metric_name'] == 'Daily_Sales']
                sales_df['timestamp'] = pd.to_datetime(sales_df['timestamp'])
                
                # Group by timeframe
                if timeframe == 'daily':
                    grouped = sales_df.groupby(sales_df['timestamp'].dt.date)['value'].sum()
                elif timeframe == 'weekly':
                    grouped = sales_df.groupby(sales_df['timestamp'].dt.isocalendar().week)['value'].sum()
                elif timeframe == 'monthly':
                    grouped = sales_df.groupby(sales_df['timestamp'].dt.to_period('M'))['value'].sum()
                
                all_sales.append(grouped)
        
        # Combine and format for charts
        if all_sales:
            # Your data processing logic here
            pass
        
        # Fallback to sample data
        return {
            "labels": ["Week 1", "Week 2", "Week 3", "Week 4"],
            "datasets": [{
                "label": "Sales Revenue",
                "data": [4500, 5200, 4800, 6100],
                "borderColor": 'rgb(59, 130, 246)',
                "backgroundColor": 'rgba(59, 130, 246, 0.1)',
            }]
        }

class TopProductsView(APIView):
    """Serve top products data for bar charts"""
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        try:
            top_products = self.get_top_products()
            return Response(top_products)
        except Exception as e:
            return Response({"error": str(e)}, status=500)

    def get_top_products(self):
        # Get top products from database
        try:
            from django.db.models import Sum, F

            # Get metrics with product metadata
            sales_with_products = Metric.objects.filter(
                name='Daily_Sales',
                metadata__product__isnull=False
            ).annotate(product=F('metadata__product'))

            if sales_with_products.exists():
                # Group by product and sum values
                product_revenue = {}
                product_data = {}
                for metric in sales_with_products:
                    product = metric.metadata['product']
                    if product not in product_revenue:
                        product_revenue[product] = 0
                        product_data[product] = []
                    product_revenue[product] += metric.value
                    product_data[product].append((metric.timestamp, metric.value))

                # Sort by revenue
                sorted_products = sorted(product_revenue.items(), key=lambda x: x[1], reverse=True)[:5]

                # Calculate growth for each product
                product_growth = {}
                for product, _ in sorted_products:
                    data = sorted(product_data[product], key=lambda x: x[0])
                    if len(data) >= 2:
                        mid_point = len(data) // 2
                        first_half = sum(v for _, v in data[:mid_point])
                        second_half = sum(v for _, v in data[mid_point:])
                        if first_half > 0:
                            growth = ((second_half - first_half) / first_half) * 100
                        else:
                            growth = 0
                    else:
                        growth = 0
                    product_growth[product] = growth

                labels = [p[0] for p in sorted_products]
                data_values = [p[1] for p in sorted_products]

                return {
                    "labels": labels,
                    "datasets": [{
                        "label": "Revenue",
                        "data": data_values,
                        "backgroundColor": '#3B82F6',
                        "borderRadius": 6,
                    }],
                    "products": [
                        {
                            "name": product,
                            "revenue": int(revenue),
                            "growth": round(product_growth.get(product, 0), 1)
                        }
                        for product, revenue in sorted_products
                    ]
                }
            else:
                # Fallback to sample data if no real data
                return {
                    "labels": ["Product Alpha", "Product Bravo", "Product Charlie", "Product Delta", "Product Echo"],
                    "datasets": [{
                        "label": "Revenue",
                        "data": [1250000, 980000, 765000, 543000, 432000],
                        "backgroundColor": '#3B82F6',
                        "borderRadius": 6,
                    }],
                    "products": [
                        {"name": "Product Alpha", "revenue": 1250000, "growth": 15.2},
                        {"name": "Product Bravo", "revenue": 980000, "growth": 8.7},
                        {"name": "Product Charlie", "revenue": 765000, "growth": 22.1},
                        {"name": "Product Delta", "revenue": 543000, "growth": -3.4},
                        {"name": "Product Echo", "revenue": 432000, "growth": 12.8},
                    ]
                }
        except Exception as e:
            # Fallback to sample data
            return {
                "labels": ["Product Alpha", "Product Bravo", "Product Charlie", "Product Delta", "Product Echo"],
                "datasets": [{
                    "label": "Revenue",
                    "data": [1250000, 980000, 765000, 543000, 432000],
                    "backgroundColor": '#3B82F6',
                    "borderRadius": 6,
                }],
                "products": [
                    {"name": "Product Alpha", "revenue": 1250000, "growth": 15.2},
                    {"name": "Product Bravo", "revenue": 980000, "growth": 8.7},
                    {"name": "Product Charlie", "revenue": 765000, "growth": 22.1},
                    {"name": "Product Delta", "revenue": 543000, "growth": -3.4},
                    {"name": "Product Echo", "revenue": 432000, "growth": 12.8},
                ]
            }
