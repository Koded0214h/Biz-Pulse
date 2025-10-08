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

from .models import Metric, Insight, Alert, ForecastPrediction
from .serializers import (
    MetricViewSetSerializer,
    InsightViewSetSerializer,
    AlertViewSetSerializer,
    ForecastPredictionSerializer
)
from .amazon_q_service import AmazonQService

# Create your views here.

class UploadDataView(APIView):
    def post(self, request, *args, **kwargs):
        file_obj = request.FILES.get("file")
        job_id = request.data.get("job_id", "1")
        
        if not file_obj:
            return Response({"error": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Validate file type
        if not file_obj.name.endswith('.csv'):
            return Response({"error": "Only CSV files are supported"}, status=status.HTTP_400_BAD_REQUEST)
        
        file_path = f"raw-data/{file_obj.name}"

        # Use the actual bucket name from environment variables
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
        
        return Response({
            "message": "File uploaded successfully!",
            "file_path": file_path,
            "file_url": file_url,
            "job_id": job_id
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
            q_service = AmazonQService()
            # ⚠️ No user_id parameter needed for anonymous access
            result = q_service.ask_question(question=question)
            
            return Response(result)
            
        except Exception as e:
            return Response({
                "error": "Failed to process your question",
                "details": str(e)
            }, status=500)
            
            
class SalesDataView(APIView):
    """Serve sales data for line charts"""
    permission_classes = [AllowAny]
    
    def get(self, request, *args, **kwargs):
        try:
            # Get data from S3 or database
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
        # Example: Read from S3 CSV files
        s3 = boto3.client('s3')
        
        # Get all sales CSV files
        response = s3.list_objects_v2(
            Bucket='bizpulse-data-lake',
            Prefix='raw-data/'
        )
        
        all_data = []
        for obj in response.get('Contents', []):
            if obj['Key'].endswith('.csv'):
                file_obj = s3.get_object(Bucket='bizpulse-data-lake', Key=obj['Key'])
                df = pd.read_csv(io.BytesIO(file_obj['Body'].read()))
                
                # Filter for sales data
                sales_df = df[df['metric_name'] == 'Daily_Sales']
                all_data.append(sales_df)
        
        if all_data:
            combined_df = pd.concat(all_data)
            return {
                'dates': combined_df['timestamp'].tolist(),
                'values': combined_df['value'].tolist()
            }
        else:
            # Return sample data if no real data
            return {
                'dates': ['2025-01-01', '2025-01-02', '2025-01-03'],
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
        # Calculate from your data
        s3 = boto3.client('s3')
        
        # This would aggregate data from all CSV files
        # For now, return sample data
        return {
            'total_sales': 4570.75,
            'avg_conversion': 0.025,
            'sales_growth': 8.2,  # percentage
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
        # Read from S3 CSV files and aggregate by product
        s3 = boto3.client('s3')

        response = s3.list_objects_v2(
            Bucket='bizpulse-data-lake',
            Prefix='raw-data/'
        )

        all_data = []
        for obj in response.get('Contents', []):
            if obj['Key'].endswith('.csv'):
                file_obj = s3.get_object(Bucket='bizpulse-data-lake', Key=obj['Key'])
                df = pd.read_csv(io.BytesIO(file_obj['Body'].read()))

                # Filter for sales data with product info
                if 'product' in df.columns:
                    sales_df = df[df['metric_name'] == 'Daily_Sales']
                    all_data.append(sales_df)

        if all_data:
            combined_df = pd.concat(all_data)

            # Group by product and calculate total revenue
            product_revenue = combined_df.groupby('product')['value'].sum().sort_values(ascending=False)

            # Calculate growth (simplified - comparing first half vs second half of year)
            product_growth = {}
            for product in product_revenue.index:
                product_data = combined_df[combined_df['product'] == product]
                product_data = product_data.sort_values('timestamp')

                mid_point = len(product_data) // 2
                first_half = product_data.iloc[:mid_point]['value'].sum()
                second_half = product_data.iloc[mid_point:]['value'].sum()

                if first_half > 0:
                    growth = ((second_half - first_half) / first_half) * 100
                else:
                    growth = 0
                product_growth[product] = growth

            # Get top 5 products
            top_products = product_revenue.head(5)

            return {
                "labels": top_products.index.tolist(),
                "datasets": [{
                    "label": "Revenue",
                    "data": top_products.values.tolist(),
                    "backgroundColor": '#3B82F6',
                    "borderRadius": 6,
                }],
                "products": [
                    {
                        "name": product,
                        "revenue": int(revenue),
                        "growth": round(product_growth.get(product, 0), 1)
                    }
                    for product, revenue in top_products.items()
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
