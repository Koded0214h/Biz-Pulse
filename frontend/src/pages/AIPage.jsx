import React, { useState, useRef, useEffect } from 'react';
import Layout from '../components/Layout';

const AIPage = () => {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('chatbotMessages');
    return saved ? JSON.parse(saved) : [];
  });
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeScenario, setActiveScenario] = useState(null);
  const messagesEndRef = useRef(null);

  // Enhanced quick questions with scenarios
  const quickQuestions = [
    {
      title: "Sales Performance",
      question: "What are my top performing products and sales trends?",
      icon: "📈",
      type: "standard"
    },
    {
      title: "Business Health", 
      question: "get_business_health",
      icon: "❤️",
      type: "scenario",
      endpoint: "/api/v1/services/q/health/"
    },
    {
      title: "Growth Opportunities",
      question: "What are my biggest growth opportunities right now?",
      icon: "🚀",
      type: "standard"
    },
    {
      title: "Smart Recommendations",
      question: "get_recommendations", 
      icon: "💡",
      type: "scenario",
      endpoint: "/api/v1/services/q/recommendations/"
    },
    {
      title: "Revenue Forecast",
      question: "Predict next quarter revenue and sales projections",
      icon: "🔮",
      type: "standard"
    },
    {
      title: "What-If Analysis",
      question: "what_if_scenario",
      icon: "🎯",
      type: "scenario",
      endpoint: "/api/v1/services/q/what-if/",
      inputRequired: true
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('chatbotMessages', JSON.stringify(messages));
  }, [messages]);

  // Enhanced API call function
  const callAmazonQAPI = async (endpoint, data = null) => {
    try {
      const url = `https://biz-pulse-backend.onrender.com${endpoint}`;
      const options = {
        method: data ? 'POST' : 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (data) {
        options.body = JSON.stringify(data);
      }

      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API call failed:', error);
      throw error;
    }
  };

  const sendMessage = async (messageText = null, scenarioData = null) => {
    const userMessage = messageText || inputMessage.trim();
    if (!userMessage) return;

    if (!messageText) {
      setInputMessage('');
    }

    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
    setLoading(true);

    try {
      let response;

      if (scenarioData) {
        // Handle special scenario endpoints
        console.log('🔍 Calling scenario endpoint:', scenarioData.endpoint);
        response = await callAmazonQAPI(scenarioData.endpoint, scenarioData.payload);
      } else {
        // Standard Q&A
        console.log('🔍 Sending question to Amazon Q:', userMessage);
        response = await callAmazonQAPI('/api/v1/services/q/ask/', { question: userMessage });
      }

      console.log('✅ API response:', response);

      if (response.answer || response.recommendations) {
        setMessages(prev => [...prev, {
          type: 'assistant',
          content: response.answer || this.formatScenarioResponse(response),
          sources: response.sources,
          scenario: !!scenarioData
        }]);
      } else {
        setMessages(prev => [...prev, {
          type: 'assistant',
          content: 'Sorry, I could not process your request.',
          error: true
        }]);
      }
    } catch (error) {
      console.error('❌ API error:', error);
      setMessages(prev => [...prev, {
        type: 'assistant',
        content: `Error: ${error.message}`,
        error: true
      }]);
    } finally {
      setLoading(false);
      setActiveScenario(null);
    }
  };

  // Format scenario responses nicely
  const formatScenarioResponse = (response) => {
    if (response.recommendations) {
      return `📊 Business Recommendations:\n\n${response.recommendations}`;
    }
    if (response.health_score) {
      return `❤️ Business Health Score: ${response.health_score}/100\n\n${response.analysis}`;
    }
    return JSON.stringify(response, null, 2);
  };

  const handleQuickQuestion = (item) => {
    if (item.type === 'scenario') {
      if (item.inputRequired) {
        // Show input for what-if scenarios
        setActiveScenario(item);
        setInputMessage(''); // Clear input for new scenario
      } else {
        // Direct API call for health and recommendations
        sendMessage(item.title, {
          endpoint: item.endpoint,
          payload: item.inputRequired ? { scenario: item.question } : null
        });
      }
    } else {
      // Standard question
      sendMessage(item.question);
    }
  };

  const handleWhatIfSubmit = () => {
    if (!inputMessage.trim()) return;
    
    sendMessage(`What if: ${inputMessage}`, {
      endpoint: '/api/v1/services/q/what-if/',
      payload: { scenario: inputMessage }
    });
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem('chatbotMessages');
    setActiveScenario(null);
  };

  return (
    <Layout activePage="ai">
      <div className="flex flex-col h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">BizPulse AI</h1>
              <p className="text-gray-600 text-sm">
                Your intelligent business assistant
              </p>
            </div>
            <button
              onClick={clearChat}
              className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            >
              New Chat
            </button>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
          {/* Messages */}
          <div className="flex-1 p-6 overflow-y-auto">
            {messages.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-6">
                  <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">How can I help you today?</h3>
                <p className="text-gray-500 mb-8">Ask anything about your business performance and insights</p>
                
                {/* Enhanced Quick Questions Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
                  {quickQuestions.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickQuestion(item)}
                      disabled={loading}
                      className={`border rounded-xl p-4 text-left transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group ${
                        item.type === 'scenario' 
                          ? 'bg-blue-50 border-blue-200 hover:border-blue-400 hover:shadow-md' 
                          : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-md'
                      }`}
                    >
                      <div className="text-2xl mb-2">{item.icon}</div>
                      <h4 className="font-medium text-gray-800 text-sm mb-1 group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-gray-500 text-xs leading-tight">
                        {item.type === 'scenario' ? 'Advanced Analysis' : item.question}
                      </p>
                      {item.type === 'scenario' && (
                        <div className="mt-2">
                          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            AI Analysis
                          </span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-6 ${message.type === 'user' ? 'flex justify-end' : 'flex justify-start'}`}
              >
                <div
                  className={`max-w-2xl px-4 py-3 rounded-2xl ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white rounded-br-md'
                      : message.error
                      ? 'bg-red-50 text-red-800 border border-red-200'
                      : message.scenario
                      ? 'bg-green-50 border border-green-200 shadow-sm rounded-bl-md'
                      : 'bg-white border border-gray-200 shadow-sm rounded-bl-md'
                  }`}
                >
                  {message.scenario && (
                    <div className="flex items-center mb-2">
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mr-2">
                        AI Analysis
                      </span>
                    </div>
                  )}
                  <div className="whitespace-pre-wrap">{message.content}</div>
                  {message.sources && message.sources.length > 0 && (
                    <div className="text-xs mt-2 text-blue-600 flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                      </svg>
                      {message.sources.length} data sources
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start mb-6">
                <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
                  <div className="flex items-center space-x-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                    <span className="text-gray-600 text-sm">
                      {activeScenario ? 'Running advanced analysis...' : 'Analyzing your business data...'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-6 bg-white">
            {/* What-If Scenario Prompt */}
            {activeScenario?.inputRequired && (
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center mb-2">
                  <span className="text-blue-600 text-lg mr-2">{activeScenario.icon}</span>
                  <h4 className="font-medium text-blue-800">{activeScenario.title}</h4>
                </div>
                <p className="text-blue-700 text-sm mb-3">Describe your scenario (e.g., "What if I increase marketing budget by 20%?")</p>
              </div>
            )}

            {/* Quick Questions */}
            {(messages.length === 0 || messages.length <= 2) && !activeScenario?.inputRequired && (
              <div className="mb-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-2xl mx-auto">
                  {quickQuestions.slice(0, 6).map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickQuestion(item)}
                      disabled={loading}
                      className={`border rounded-lg p-3 text-left transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group ${
                        item.type === 'scenario' 
                          ? 'bg-blue-50 border-blue-200 hover:border-blue-400' 
                          : 'bg-gray-50 border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        <span className="text-lg flex-shrink-0">{item.icon}</span>
                        <span className="text-xs font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
                          {item.title}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Box */}
            <div className="flex space-x-4 max-w-2xl mx-auto">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      activeScenario?.inputRequired ? handleWhatIfSubmit() : sendMessage();
                    }
                  }}
                  placeholder={
                    activeScenario?.inputRequired 
                      ? "Describe your scenario (e.g., increase marketing budget by 20%)..."
                      : "Ask about your business data..."
                  }
                  className="w-full border border-gray-300 rounded-full px-6 py-4 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all pr-24"
                  disabled={loading}
                />
                <button
                  onClick={activeScenario?.inputRequired ? handleWhatIfSubmit : () => sendMessage()}
                  disabled={loading || !inputMessage.trim()}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                >
                  {activeScenario?.inputRequired ? 'Analyze' : 'Send'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AIPage;