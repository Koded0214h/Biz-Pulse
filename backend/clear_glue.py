import boto3
import os

# Set credentials directly in script (not recommended for production)
os.environ['AWS_ACCESS_KEY_ID'] = 'AKIA3TD2SHY3U7R25X3Q'
os.environ['AWS_SECRET_ACCESS_KEY'] = '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'
os.environ['AWS_DEFAULT_REGION'] = 'us-east-1'

# Initialize Glue client
glue = boto3.client('glue', region_name='us-east-1')
job_name = 'BizPulse-ETL-Job'

try:
    response = glue.reset_job_bookmark(JobName=job_name)
    print(f"Successfully reset bookmark for job: {job_name}")
    print(f"Response: {response}")
except Exception as e:
    print(f"Error: {e}")