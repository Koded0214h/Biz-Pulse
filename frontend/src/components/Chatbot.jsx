// components/Chatbot.jsx
import React, { useState, useRef, useEffect } from 'react';

const Chatbot = ({ isOpen, onClose, initialMessage }) => {
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

  // When initialMessage changes, send it automatically
  useEffect(() => {
    if (initialMessage && initialMessage.trim()) {
      sendInitialMessage(initialMessage);
    }
  }, [initialMessage]);

  const sendInitialMessage = async (message) => {
    setInputMessage('');
    setMessages(prev => [...prev, { type: 'user', content: message }]);
    setLoading(true);

    try {
      console.log('🔍 Sending initial message to Amazon Q:', message);
      
      const response = await askQuestionDirect(message);
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

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-20 right-6 w-96 h-96 bg-white border border-gray-300 rounded-lg shadow-xl z-50 flex flex-col">
      {/* Chat header */}
      <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
        <h3 className="font-semibold">BizPulse AI Assistant</h3>
        <button onClick={onClose} className="text-white hover:text-gray-200">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Messages container */}
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-3 ${message.type === 'user' ? 'text-right' : 'text-left'}`}
          >
            <div
              className={`inline-block px-4 py-2 rounded-lg max-w-xs ${
                message.type === 'user'
                  ? 'bg-blue-500 text-white'
                  : message.error
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {message.content}
              {message.sources && message.sources.length > 0 && (
                <div className="text-xs mt-1 text-blue-600">
                  Sources: {message.sources.length}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="text-left mb-3">
            <div className="inline-block px-4 py-2 rounded-lg bg-gray-100 text-gray-800">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                <span>Thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-gray-300 p-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask about your business data..."
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !inputMessage.trim()}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
