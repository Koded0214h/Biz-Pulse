# core/aws_utils.py
import boto3
import time

def trigger_glue_job(job_name, payload=None):
    glue = boto3.client('glue')
    response = glue.start_job_run(
        JobName=job_name,
        Arguments=payload or {}
    )
    job_run_id = response['JobRunId']

    # Poll until completion
    while True:
        job = glue.get_job_run(JobName=job_name, RunId=job_run_id)
        status = job['JobRun']['JobRunState']
        print("Glue job status:", status)
        if status in ['SUCCEEDED', 'FAILED', 'STOPPED']:
            return status
        time.sleep(5)
