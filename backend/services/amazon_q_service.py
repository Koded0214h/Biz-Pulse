# services/amazon_q_service.py
import boto3
import os
import json

class BizPulseAmazonQService:
    def __init__(self):
        self.app_id = os.getenv('AMAZON_Q_APP_ID')
        self.region = os.getenv('AMAZON_Q_REGION', 'us-east-1')
        
        if not self.app_id:
            raise ValueError("AMAZON_Q_APP_ID environment variable is not set")
            
        self.client = boto3.client('qbusiness', region_name=self.region)
    
    def ask_question(self, question):
        """
        For anonymous access applications, don't pass user_id
        This method is called by NaturalLanguageQueryView
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
    
    def ask_business_question(self, question, business_context=None):
        """Enhanced Q&A with business context"""
        try:
            # Add business context to question for better answers
            enhanced_question = self._enhance_question(question, business_context)
            
            response = self.client.chat_sync(
                applicationId=self.app_id,
                userMessage=enhanced_question
            )
            
            return self._format_business_response(response, question)
            
        except Exception as e:
            return self._create_error_response(question, str(e))
    
    def get_business_recommendations(self):
        """Proactive business recommendations"""
        prompt = """
        Based on the business data available, provide 3 specific, actionable recommendations 
        to improve performance. Focus on:
        1. Revenue optimization
        2. Cost reduction  
        3. Customer growth
        Format as JSON with title, description, and expected impact.
        """
        
        return self.ask_business_question(prompt)
    
    def analyze_business_health(self):
        """Generate business health assessment"""
        prompt = """
        Analyze the business data and provide a health assessment covering:
        - Financial performance
        - Growth trends
        - Potential risks
        - Key opportunities
        Rate each category 1-10 and provide overall score.
        """
        
        return self.ask_business_question(prompt)
    
    def _enhance_question(self, question, context):
        """Add business context to improve answers"""
        base_context = "You are a business analyst. Provide specific, data-driven advice. "
        
        if context:
            base_context += f"Business context: {context}. "
            
        return base_context + f"Question: {question}"
    
    def _format_business_response(self, response, original_question):
        """Format response for business context"""
        return {
            "question": original_question,
            "answer": response.get('systemMessage', ''),
            "sources": response.get('sourceAttributations', []),
            "conversation_id": response.get('conversationId'),
            "type": "business_insight",
            "timestamp": "now"
        }
    
    def _create_error_response(self, question, error):
        return {
            "error": error,
            "question": question,
            "answer": f"I apologize, but I'm having trouble accessing the business data right now. Please try again later.",
            "type": "error"
        }