import React, { useState, useRef, useEffect } from 'react';
import Layout from '../components/Layout';

const AIPage = () => {
  const [messages, setMessages] = useState(() => {
    // Load saved messages from localStorage if available
    const saved = localStorage.getItem('chatbotMessages');
    return saved ? JSON.parse(saved) : [];
  });
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('chatbotMessages', JSON.stringify(messages));
  }, [messages]);

  // Direct API call without authentication headers
  const askQuestionDirect = async (question) => {
    try {
      const response = await fetch('https://biz-pulse-backend.onrender.com/api/v1/services/q/ask/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // No Authorization header
        },
        body: JSON.stringify({ question })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Direct API call failed:', error);
      throw error;
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
    setLoading(true);

    try {
      console.log('🔍 Sending question to Amazon Q:', userMessage);

      // Use direct API call without auth headers
      const response = await askQuestionDirect(userMessage);
      console.log('✅ Amazon Q response:', response);

      if (response.answer) {
        setMessages(prev => [...prev, {
          type: 'assistant',
          content: response.answer,
          sources: response.sources
        }]);
      } else {
        setMessages(prev => [...prev, {
          type: 'assistant',
          content: 'Sorry, I could not process your question.',
          error: true
        }]);
      }
    } catch (error) {
      console.error('❌ Amazon Q error:', error);
      setMessages(prev => [...prev, {
        type: 'assistant',
        content: `Error: ${error.message}`,
        error: true
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout activePage="ai">
      <div className="flex flex-col h-screen">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-800">AI Assistant</h1>
          <p className="text-gray-600 text-sm">
            Ask questions about your business data, get insights, and receive AI-powered recommendations.
          </p>
        </div>

        {/* Chat Container */}
        <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
          {/* Messages */}
          <div className="flex-1 p-6 overflow-y-auto">
            {messages.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M8 12h8M12 8v8" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-600 mb-2">Welcome to BizPulse AI</h3>
                <p className="text-gray-500">Start a conversation by asking a question about your business data.</p>
              </div>
            )}

            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-6 ${message.type === 'user' ? 'flex justify-end' : 'flex justify-start'}`}
              >
                <div
                  className={`max-w-lg px-4 py-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : message.error
                      ? 'bg-red-50 text-red-800 border border-red-200'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {message.content}
                  {message.sources && message.sources.length > 0 && (
                    <div className="text-xs mt-2 text-blue-600">
                      Sources: {message.sources.length}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start mb-6">
                <div className="bg-gray-100 px-4 py-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                    <span className="text-gray-600">Thinking...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 p-6 bg-white">
            <div className="flex space-x-4">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Ask about your business data..."
                className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                disabled={loading}
              />
              <button
                onClick={sendMessage}
                disabled={loading || !inputMessage.trim()}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AIPage;
