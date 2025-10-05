# services/amazon_q_service.py
import boto3
import os
import logging

logger = logging.getLogger(__name__)

class AmazonQService:
    def __init__(self):
        self.app_id = os.getenv('AMAZON_Q_APP_ID')
        self.region = os.getenv('AMAZON_Q_REGION', 'us-east-1')
        
        if not self.app_id:
            logger.error("AMAZON_Q_APP_ID environment variable not set")
            
        try:
            self.client = boto3.client('qbusiness', region_name=self.region)
            logger.info(f"Amazon Q client initialized for app: {self.app_id}")
        except Exception as e:
            logger.error(f"Failed to initialize Amazon Q client: {e}")
            raise
    
    def ask_question(self, question, user_id="business-user"):
        """
        Send question to Amazon Q and get response
        """
        if not self.app_id:
            return {
                "error": "Amazon Q not configured",
                "question": question,
                "answer": "Amazon Q application ID is not configured. Please check environment variables."
            }
        
        try:
            logger.info(f"Sending question to Amazon Q: {question}")
            
            response = self.client.chat_sync(
                applicationId=self.app_id,
                userId=user_id,
                userMessage=question
            )
            
            logger.info(f"Amazon Q response received: {len(response.get('systemMessage', ''))} characters")
            
            return {
                "question": question,
                "answer": response.get('systemMessage', ''),
                "sources": response.get('sourceAttributions', []),
                "conversation_id": response.get('conversationId')
            }
            
        except Exception as e:
            logger.error(f"Amazon Q error: {str(e)}")
            return {
                "error": str(e),
                "question": question,
                "answer": "I apologize, but I'm having trouble accessing the business data right now. Please ensure data sources are configured and synced."
            }