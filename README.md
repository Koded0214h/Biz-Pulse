# Biz-Pulse
BizPulse is an AI-powered business intelligence co-pilot for SMBs.   It turns raw sales, feedback, and market data into clear narrative insights, anomaly alerts, and action-oriented recommendations — helping small businesses make faster, smarter, data-driven decisions.

## AWS Integration Architecture

BizPulse leverages multiple AWS services to provide a comprehensive AI-powered business intelligence platform. Here's how AWS is integrated throughout the application:

### 1. **Amazon S3 - Data Lake Storage**
- **Primary Use**: Centralized data storage for all business data files
- **Implementation**:
  - Configured as the default file storage backend in Django settings
  - Stores uploaded CSV, Excel, and JSON files in organized folder structures (`raw-uploads/`)
  - Environment variables: `AWS_STORAGE_BUCKET_NAME`, `AWS_S3_REGION_NAME`
  - Custom domain setup: `https://{bucket-name}.s3.amazonaws.com/`
- **Features**:
  - File metadata storage (job IDs, timestamps)
  - Direct integration with Django's file handling system
  - CORS-enabled for frontend access

### 2. **AWS Glue - ETL Processing**
- **Primary Use**: Serverless data processing and transformation
- **Implementation**:
  - Custom utility functions in `core/aws_utils.py` for job orchestration
  - Asynchronous job execution with status polling
  - Integration with S3 for input/output data
- **Features**:
  - Automated data cleansing and transformation
  - Real-time job status monitoring
  - Error handling and retry mechanisms

### 3. **Amazon Bedrock - AI-Powered Insights**
- **Primary Use**: Natural language processing for business intelligence
- **Implementation**:
  - Uses Anthropic Claude 3 Haiku model via Bedrock Runtime API
  - Located in `services/analysis.py`
  - Processes structured business metrics to generate narrative insights
- **Features**:
  - Automated insight generation from KPI data
  - JSON-structured output with titles, summaries, and recommendations
  - Context-aware analysis based on data source metadata
  - Integration with Django ORM for insight storage

### 4. **Amazon Q Business - Natural Language Queries**
- **Primary Use**: Conversational AI for business questions
- **Implementation**:
  - Anonymous access application in `services/amazon_q_service.py`
  - Environment variables: `AMAZON_Q_APP_ID`, `AMAZON_Q_REGION`
  - REST API endpoint for natural language queries
- **Features**:
  - Source attribution for answers
  - Conversation context tracking
  - Error handling for failed queries

### 5. **Amazon Forecast - Predictive Analytics**
- **Primary Use**: Time series forecasting for business metrics
- **Implementation**:
  - Internal API endpoints in `internal_api/views.py`
  - Test framework in `testForecast.py`
  - Stores predictions in structured database models
- **Features**:
  - Automated forecast generation
  - Integration with insight system for narrative summaries
  - Historical data analysis for trend prediction

### 6. **Amazon Lookout for Metrics - Anomaly Detection**
- **Primary Use**: Real-time anomaly detection in business metrics
- **Implementation**:
  - Internal API endpoints for anomaly ingestion
  - Test framework in `anomalyTest.py`
  - Severity scoring and automated alerting
- **Features**:
  - Real-time monitoring of KPI deviations
  - Automated insight generation for detected anomalies
  - Integration with alerting system

## AWS Configuration

### Environment Variables Required:
```bash
# S3 Configuration
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_STORAGE_BUCKET_NAME=bizpulse-data-lake
AWS_S3_REGION_NAME=us-east-1

# Amazon Q Business
AMAZON_Q_APP_ID=your_app_id
AMAZON_Q_REGION=us-east-1

# Bedrock
AWS_REGION_NAME=us-east-1

# Database (optional)
DATABASE_URL=your_database_url
```

### Django Settings Integration:
- **Storage Backend**: S3Boto3Storage configured for all file operations
- **CORS**: Enabled for cross-origin requests from frontend
- **Authentication**: JWT-based authentication with AWS-integrated services

## Data Flow Architecture

1. **Data Ingestion**: Files uploaded via frontend → S3 storage → Glue processing
2. **AI Analysis**: Processed data → Bedrock for insights → Database storage
3. **Query Processing**: Natural language queries → Amazon Q → Response with sources
4. **Predictive Analytics**: Historical data → Forecast models → Prediction storage
5. **Anomaly Detection**: Real-time metrics → Lookout for Metrics → Alert generation

## Benefits of AWS Integration

- **Scalability**: Serverless architecture handles variable workloads
- **Cost Efficiency**: Pay-per-use model for AI and storage services
- **Security**: Enterprise-grade security with AWS IAM and encryption
- **Reliability**: Multi-AZ deployment and automatic failover
- **Innovation**: Access to cutting-edge AI models and analytics tools

This comprehensive AWS integration enables BizPulse to deliver enterprise-grade business intelligence capabilities to small and medium businesses at a fraction of the traditional cost.

## Backend Architecture

The backend is built with **Django REST Framework** and deployed on **Render**, providing a robust API-first architecture for the business intelligence platform.

### Key Technologies:
- **Django 4.2** - Web framework with REST API capabilities
- **Django REST Framework** - API development toolkit
- **PostgreSQL** - Primary database for user data, insights, and analytics
- **JWT Authentication** - Secure token-based authentication
- **AWS Integration** - Multiple AWS services for AI and data processing

### Deployment:
- **Platform**: Render (render.com)
- **Database**: PostgreSQL hosted on Render
- **Environment**: Production-ready with automatic scaling
- **API Documentation**: OpenAPI/Swagger integration via DRF Spectacular

### Core Components:
- **User Management**: Registration, authentication, and profile management
- **Data Services**: File upload, processing, and analytics APIs
- **AI Integration**: Amazon Bedrock, Q Business, and predictive analytics
- **Internal APIs**: Forecast and anomaly detection endpoints

## Frontend Architecture

The frontend is a modern **React** application deployed on **Vercel**, providing an intuitive user interface for business intelligence dashboards and data management.

### Key Technologies:
- **React 18** - Component-based UI framework
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API communication
- **JWT Authentication** - Secure frontend authentication flow

### Deployment:
- **Platform**: Vercel (vercel.com)
- **Build Process**: Automated deployments from Git
- **Environment**: Global CDN with edge computing
- **Domain**: Custom domain support

### Core Features:
- **Dashboard**: Real-time business metrics and insights
- **Data Connections**: File upload and integration management
- **Sales Analytics**: Interactive charts and deep-dive analysis
- **User Authentication**: Login/register with JWT token management
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## Technology Stack Summary

| Component | Technology | Deployment | Purpose |
|-----------|------------|------------|---------|
| **Backend** | Django REST Framework | Render | API services, AI integration |
| **Frontend** | React + Vite | Vercel | User interface, dashboards |
| **Database** | PostgreSQL | Render | Data persistence |
| **File Storage** | Amazon S3 | AWS | Data lake, file uploads |
| **AI/ML** | Amazon Bedrock, Q Business | AWS | Insights, natural language |
| **ETL** | AWS Glue | AWS | Data processing |
| **Analytics** | Amazon Forecast, Lookout | AWS | Predictions, anomaly detection |
