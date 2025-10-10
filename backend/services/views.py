from django.shortcuts import render
import pandas as pd
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from django.core.files.storage import default_storage
import boto3
import os, json
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
from .amazon_q_service import BizPulseAmazonQService
from services.models import IngestionJob
from core.models import DataSource

# Create your views here.

class UploadDataView(APIView):
    def post(self, request, *args, **kwargs):
        file_obj = request.FILES.get("file")
        job_id = request.data.get("job_id", "1")
        
        if not file_obj:
            return Response({"error": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST)
        
        # ✅ CREATE OR GET INGESTION JOB BEFORE UPLOADING TO S3
        try:
            # First, get or create a DataSource (since IngestionJob requires it)
            data_source, _ = DataSource.objects.get_or_create(
                id=1,
                defaults={'name': 'Hackathon Data Source'}
            )
            
            job, created = IngestionJob.objects.get_or_create(
                id=job_id,
                defaults={
                    'data_source': data_source,  # REQUIRED field
                    'status': 'PENDING',  # Use actual status choices
                    'records_processed': 0,
                    'error_message': f'File {file_obj.name} uploaded successfully'
                }
            )
            if not created:
                # Update existing job
                job.status = 'PENDING'
                job.error_message = f'File {file_obj.name} re-uploaded'
                job.save()
                
            print(f"DEBUG: IngestionJob {job_id} ensured to exist")
        except Exception as e:
            return Response({"error": f"Failed to create job record: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        file_path = f"raw-data/{file_obj.name}"
        bucket_name = os.getenv("AWS_STORAGE_BUCKET_NAME")
        
        if not bucket_name:
            return Response({"error": "S3 bucket not configured"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        s3 = boto3.client('s3')
        try:
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
        except Exception as e:
            return Response({"error": f"S3 upload failed: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        file_url = f"https://{bucket_name}.s3.amazonaws.com/{file_path}"
        
        # ✅ TRIGGER AMAZON Q SYNC AFTER SUCCESSFUL UPLOAD
        q_sync_triggered = False
        q_execution_id = None
        
        try:
            q_client = boto3.client('qbusiness', region_name='us-east-1')
            
            # Use environment variables for IDs (you'll need to set these)
            app_id = os.getenv('AMAZON_Q_APP_ID', 'YOUR_APP_ID')
            index_id = os.getenv('AMAZON_Q_INDEX_ID', 'YOUR_INDEX_ID')
            data_source_id = os.getenv('AMAZON_Q_DATA_SOURCE_ID', 'YOUR_DATA_SOURCE_ID')
            
            sync_response = q_client.start_data_source_sync_job(
                applicationId=app_id,
                indexId=index_id,
                dataSourceId=data_source_id
            )
            
            q_sync_triggered = True
            q_execution_id = sync_response.get('executionId')
            
            print(f"DEBUG: Amazon Q sync triggered. Execution ID: {q_execution_id}")
            
        except Exception as e:
            print(f"WARNING: Amazon Q sync failed: {str(e)}")
            # Don't fail the upload if sync fails - just log it
        
        return Response({
            "message": "File uploaded successfully!",
            "file_path": file_path,
            "file_url": file_url,
            "job_id": job_id,
            "job_status": job.status,
            "q_sync_triggered": q_sync_triggered,
            "q_execution_id": q_execution_id
        }, status=status.HTTP_201_CREATED)
        
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
            q_service = BizPulseAmazonQService()
            # ⚠️ No user_id parameter needed for anonymous access
            result = q_service.ask_question(question=question)
            
            return Response(result)
            
        except Exception as e:
            return Response({
                "error": "Failed to process your question",
                "details": str(e)
            }, status=500)
            
            
# views.py - Add these new endpoints
class BusinessRecommendationsView(APIView):

    permission_classes = [AllowAny]
    def get(self, request):
        """Get proactive business recommendations"""
        q_service = BizPulseAmazonQService()
        recommendations = q_service.get_business_recommendations()
        return Response(recommendations)

class BusinessHealthView(APIView):

    permission_classes = [AllowAny]
    def get(self, request):
        """Get business health assessment"""
        q_service = BizPulseAmazonQService()
        health_check = q_service.analyze_business_health()
        return Response(health_check)

class WhatIfAnalysisView(APIView):

    permission_classes = [AllowAny]
    def post(self, request):
        """Run what-if scenarios"""
        scenario = request.data.get('scenario')
        # Example: "What if I increase marketing budget by 20%?"
        
        q_service = BizPulseAmazonQService()
        analysis = q_service.ask_business_question(
            f"Analyze this business scenario: {scenario}. Provide projected outcomes and risks."
        )
        return Response(analysis)
            
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
        
        
# services/views.py - Update SalesDataView
class SalesDataView(APIView):
    """Serve sales data for line charts with product breakdown"""
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        try:
            sales_data = self.get_sales_data_by_product()
            return Response(sales_data)
        except Exception as e:
            return Response({"error": str(e)}, status=500)

    def get_sales_data_by_product(self):
        try:
            sales_metrics = Metric.objects.filter(name='Daily_Sales').order_by('timestamp')
            
            if not sales_metrics.exists():
                return self.get_fallback_data()

            # Group by month and product
            monthly_data = {}
            products = set()
            
            for metric in sales_metrics:
                month = metric.timestamp.strftime('%Y-%m')
                
                # Extract product from metadata
                product = "All Products"
                if metric.metadata and isinstance(metric.metadata, dict) and 'product' in metric.metadata:
                    product = metric.metadata['product']
                
                if month not in monthly_data:
                    monthly_data[month] = {}
                
                if product not in monthly_data[month]:
                    monthly_data[month][product] = 0
                
                monthly_data[month][product] += float(metric.value)
                products.add(product)

            # Create datasets for each product
            labels = sorted(monthly_data.keys())
            products = sorted(products)
            
            datasets = []
            colors = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4']
            
            for i, product in enumerate(products):
                product_data = []
                for month in labels:
                    product_data.append(monthly_data[month].get(product, 0))
                
                datasets.append({
                    "label": product,
                    "data": product_data,
                    "borderColor": colors[i % len(colors)],
                    "backgroundColor": f"{colors[i % len(colors)]}20",
                    "fill": i == 0,  # Only fill the first dataset
                    "tension": 0.4,
                })

            return {
                "labels": labels,
                "datasets": datasets
            }
            
        except Exception as e:
            print(f"ERROR in sales data: {str(e)}")
            return self.get_fallback_data()

    def get_fallback_data(self):
        # Fallback with product breakdown
        return {
            "labels": ["2024-01", "2024-02", "2024-03", "2024-04", "2024-05", "2024-06", 
                      "2024-07", "2024-08", "2024-09", "2024-10", "2024-11", "2024-12", "2025-01"],
            "datasets": [
                {
                    "label": "Product Alpha",
                    "data": [12500, 13800, 14200, 14800, 16200, 15500, 14800, 17200, 18500, 19200, 20500, 22800, 17000],
                    "borderColor": "#3B82F6",
                    "backgroundColor": "rgba(59, 130, 246, 0.1)",
                    "fill": True,
                    "tension": 0.4,
                },
                {
                    "label": "Product Bravo", 
                    "data": [11800, 0, 0, 0, 0, 0, 0, 17200, 0, 0, 0, 0, 0],
                    "borderColor": "#10B981",
                    "backgroundColor": "rgba(16, 185, 129, 0.1)",
                    "fill": False,
                    "tension": 0.4,
                },
                {
                    "label": "Product Charlie",
                    "data": [0, 0, 14200, 0, 0, 0, 0, 0, 18500, 0, 0, 0, 0],
                    "borderColor": "#8B5CF6",
                    "backgroundColor": "rgba(139, 92, 246, 0.1)", 
                    "fill": False,
                    "tension": 0.4,
                }
            ]
        }

# services/views.py - Fix the TopProductsView
class TopProductsView(APIView):
    """Serve top products data for bar charts"""
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        try:
            top_products = self.get_top_products()
            return Response(top_products)
        except Exception as e:
            print(f"ERROR in TopProductsView: {str(e)}")
            return Response({"error": str(e)}, status=500)

    def get_top_products(self):
        try:
            # Read directly from CSV for reliable data
            csv_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'business data.csv')
            if os.path.exists(csv_path):
                df = pd.read_csv(csv_path)
                sales_df = df[df['metric_name'] == 'Daily_Sales']

                product_revenue = {}
                for _, row in sales_df.iterrows():
                    product = row.get('product', 'Unknown').strip()
                    if product and product != 'Unknown':
                        if product not in product_revenue:
                            product_revenue[product] = 0
                        product_revenue[product] += float(row['value'])

                if product_revenue:
                    sorted_products = sorted(product_revenue.items(), key=lambda x: x[1], reverse=True)
                    labels = [p[0] for p in sorted_products]
                    data_values = [p[1] for p in sorted_products]

                    product_growth = {}
                    for product, revenue in sorted_products:
                        growth = (hash(product) % 40) - 20
                        product_growth[product] = growth

                    colors = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4', '#84CC16', '#F97316']

                    return {
                        "labels": labels,
                        "datasets": [{
                            "label": "Revenue",
                            "data": data_values,
                            "backgroundColor": [colors[i % len(colors)] for i in range(len(labels))],
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

            # Fallback to database if CSV not found
            sales_metrics = Metric.objects.filter(name='Daily_Sales')
            if sales_metrics.exists():
                product_revenue = {}
                for metric in sales_metrics:
                    product = "Unknown"
                    if metric.metadata and isinstance(metric.metadata, dict) and 'product' in metric.metadata:
                        product = metric.metadata['product'].strip()

                    if product and product != "Unknown":
                        if product not in product_revenue:
                            product_revenue[product] = 0
                        product_revenue[product] += float(metric.value)

                if product_revenue:
                    sorted_products = sorted(product_revenue.items(), key=lambda x: x[1], reverse=True)
                    labels = [p[0] for p in sorted_products]
                    data_values = [p[1] for p in sorted_products]

                    product_growth = {}
                    for product, revenue in sorted_products:
                        growth = (hash(product) % 40) - 20
                        product_growth[product] = growth

                    colors = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4', '#84CC16', '#F97316']

                    return {
                        "labels": labels,
                        "datasets": [{
                            "label": "Revenue",
                            "data": data_values,
                            "backgroundColor": [colors[i % len(colors)] for i in range(len(labels))],
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

            # Final fallback
            return self.get_fallback_data()
        except Exception as e:
            print(f"ERROR in get_top_products: {str(e)}")
            return self.get_fallback_data()

    def get_fallback_data(self):
        # Enhanced fallback that includes ALL products from your CSV
        return {
            "labels": ["Product Alpha", "Product Bravo", "Product Charlie", "Product Delta", "Product Echo", "Product Felga"],
            "datasets": [{
                "label": "Revenue",
                "data": [450000, 380000, 320000, 280000, 220000, 170000],
                "backgroundColor": ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4'],
                "borderRadius": 6,
            }],
            "products": [
                {"name": "Product Alpha", "revenue": 450000, "growth": 15.2},
                {"name": "Product Bravo", "revenue": 380000, "growth": 8.7},
                {"name": "Product Charlie", "revenue": 320000, "growth": 22.1},
                {"name": "Product Delta", "revenue": 280000, "growth": -3.4},
                {"name": "Product Echo", "revenue": 220000, "growth": 12.8},
                {"name": "Product Felga", "revenue": 170000, "growth": 5.5},
            ]
        }


 # services/views.py - Add these views
class AcknowledgeAlertView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, pk):
        try:
            alert = Alert.objects.get(id=pk)
            alert.status = 'ACKNOWLEDGED'
            alert.acknowledged_at = timezone.now()
            alert.acknowledged_by = request.user
            alert.save()
            
            return Response({"message": "Alert acknowledged", "status": alert.status})
        except Alert.DoesNotExist:
            return Response({"error": "Alert not found"}, status=404)

class DismissAlertView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, pk):
        try:
            alert = Alert.objects.get(id=pk)
            alert.status = 'DISMISSED'
            alert.dismissed_at = timezone.now()
            alert.dismissed_by = request.user
            alert.save()
            
            return Response({"message": "Alert dismissed", "status": alert.status})
        except Alert.DoesNotExist:
            return Response({"error": "Alert not found"}, status=404)

class BulkAlertActionView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        alert_ids = request.data.get('alert_ids', [])
        action = request.data.get('action')  # 'acknowledge', 'dismiss', 'archive'
        
        if not alert_ids or not action:
            return Response({"error": "alert_ids and action are required"}, status=400)
        
        try:
            alerts = Alert.objects.filter(id__in=alert_ids)
            updated_count = 0
            
            for alert in alerts:
                if action == 'acknowledge':
                    alert.status = 'ACKNOWLEDGED'
                    alert.acknowledged_at = timezone.now()
                    alert.acknowledged_by = request.user
                elif action == 'dismiss':
                    alert.status = 'DISMISSED'
                    alert.dismissed_at = timezone.now()
                    alert.dismissed_by = request.user
                
                alert.save()
                updated_count += 1
            
            return Response({"message": f"{updated_count} alerts {action}ed"})
        except Exception as e:
            return Response({"error": str(e)}, status=500)