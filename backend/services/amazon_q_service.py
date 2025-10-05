import boto3
import os
from django.conf import settings

class AmazonQService:
    def __init__(self):
        self.app_id = os.getenv('AMAZON_Q_APP_ID')
        self.region = os.getenv('AMAZON_Q_REGION', 'us-east-1')
        self.client = boto3.client('qbusiness', region_name=self.region)
    
    def ask_question(self, question, user_id="business-user"):
        try:
            response = self.client.chat_sync(
                applicationId=self.app_id,
                userId=user_id,
                userMessage=question
            )
            
            return {
                "question": question,
                "answer": response.get('systemMessage', ''),
                "sources": response.get('sourceAttributions', []),
                "conversation_id": response.get('conversationId')
            }
            
        except Exception as e:
            return {
                "error": str(e),
                "question": question,
                "answer": "I apologize, but I'm having trouble accessing business data right now."
            }