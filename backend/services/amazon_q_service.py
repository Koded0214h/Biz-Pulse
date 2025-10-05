# services/amazon_q_service.py
import boto3
import os

class AmazonQService:
    def __init__(self):
        self.app_id = os.getenv('AMAZON_Q_APP_ID')
        self.region = os.getenv('AMAZON_Q_REGION', 'us-east-1')
        
        if not self.app_id:
            raise ValueError("AMAZON_Q_APP_ID environment variable is not set")
            
        self.client = boto3.client('qbusiness', region_name=self.region)
    
    def ask_question(self, question):
        """
        For anonymous access applications, don't pass user_id
        """
        try:
            response = self.client.chat_sync(
                applicationId=self.app_id,
                # ⚠️ No user_id parameter for anonymous access!
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
                "answer": f"Error: {str(e)}"
            }