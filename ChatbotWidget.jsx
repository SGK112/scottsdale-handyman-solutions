import React, { useRef, useEffect } from 'react';

// Clean Chatbot Component with Dynamic Animations
const ChatbotWidget = ({ 
  chatOpen, 
  setChatOpen, 
  chatMessages, 
  setChatMessages, 
  chatInput, 
  setChatInput, 
  chatTyping, 
  setChatTyping, 
  chatContext, 
  setChatContext, 
  handleChatSubmit, 
  generateChatResponse, 
  openLeadForm,
  logChatConversation,
  handleQuickReply
}) => {
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages are added
  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest'
      });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, chatTyping]);

  return (
    <div style={{ 
      position: 'fixed', 
      bottom: '24px', 
      right: '24px', 
      zIndex: 99999,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {!chatOpen ? (
        <div style={{ 
          position: 'relative', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'flex-end', 
          gap: '8px',
          transform: chatOpen ? 'scale(0)' : 'scale(1)',
          transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
        }}>
          {/* Helpful Links - Compact Version */}
          <div style={{ 
            display: 'flex', 
            gap: '6px', 
            opacity: 0,
            animation: 'fadeIn 0.8s ease 0.5s forwards'
          }}>
            <button
              onClick={() => window.location.href = 'tel:+14802555887'}
              style={{
                background: '#ef4444',
                border: 'none',
                borderRadius: '20px',
                padding: '6px 10px',
                color: 'white',
                fontSize: '11px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)',
                transition: 'all 0.2s ease',
                fontFamily: 'inherit'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
              title="Emergency Call"
            >
              🚨 Emergency
            </button>
            
            <button
              onClick={() => openLeadForm('quote')}
              style={{
                background: '#10b981',
                border: 'none',
                borderRadius: '20px',
                padding: '6px 10px',
                color: 'white',
                fontSize: '11px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
                transition: 'all 0.2s ease',
                fontFamily: 'inherit'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
              title="Get Free Quote"
            >
              📋 Quote
            </button>
          </div>

          {/* Chat Label */}
          <div style={{
            background: 'rgba(37, 99, 235, 0.95)',
            color: 'white',
            padding: '6px 12px',
            borderRadius: '16px',
            fontSize: '12px',
            fontWeight: '500',
            whiteSpace: 'nowrap',
            boxShadow: '0 2px 12px rgba(37, 99, 235, 0.3)',
            fontFamily: 'inherit',
            opacity: 0,
            animation: 'slideInRight 0.6s ease 0.2s forwards'
          }}>
            💬 Need Help? Chat with AI!
          </div>

          {/* Main Chat Button */}
          <button
            onClick={() => setChatOpen(true)}
            style={{
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              border: 'none',
              borderRadius: '16px',
              width: '56px',
              height: '56px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 25px rgba(37, 99, 235, 0.3)',
              transition: 'all 0.3s ease',
              color: 'white',
              fontFamily: 'inherit',
              opacity: 0,
              animation: 'bounceIn 0.6s ease forwards'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.1)'
              e.target.style.boxShadow = '0 12px 35px rgba(37, 99, 235, 0.4)'
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)'
              e.target.style.boxShadow = '0 8px 25px rgba(37, 99, 235, 0.3)'
            }}
            title="Chat with our AI Assistant"
          >
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect x="4" y="4" width="20" height="16" rx="4" fill="currentColor" />
              <path d="M16 20 L20 28 L12 22 L16 20 Z" fill="currentColor" />
              <circle cx="9" cy="12" r="2" fill="rgba(255,255,255,0.9)" />
              <circle cx="15" cy="12" r="2" fill="rgba(255,255,255,0.9)" />
              <circle cx="21" cy="12" r="2" fill="rgba(255,255,255,0.9)" />
            </svg>
          </button>
        </div>
      ) : (
        <div style={{ 
          position: 'relative',
          transform: chatOpen ? 'scale(1)' : 'scale(0)',
          transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
          opacity: chatOpen ? 1 : 0
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            width: '380px',
            height: '500px',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
            overflow: 'hidden',
            border: '1px solid rgba(0,0,0,0.1)'
          }}>
            
            {/* Enhanced Chat Header */}
            <div style={{
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              color: 'white',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.9 1 3 1.9 3 3V21C3 22.1 3.9 23 5 23H19C20.1 23 21 22.1 21 21V9M19 21H5V3H13V9H19Z"/>
                  </svg>
                </div>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '16px' }}>AI Assistant</div>
                  <div style={{ fontSize: '12px', opacity: 0.9 }}>
                    {chatTyping ? 'Typing...' : 'Online • Ready to help'}
                  </div>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  onClick={() => {
                    setChatMessages([{
                      id: 1,
                      type: 'bot',
                      message: 'Hi! I\'m your AI handyman assistant. I can help you with service information, pricing, scheduling, and emergency support. What can I help you with today?',
                      timestamp: new Date()
                    }])
                    setChatContext({
                      lastService: null,
                      userLocation: null,
                      conversationStage: 'greeting'
                    })
                  }}
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: 'none',
                    color: 'white',
                    borderRadius: '6px',
                    width: '28px',
                    height: '28px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px'
                  }}
                  title="Reset conversation"
                >
                  🔄
                </button>
                
                <button
                  onClick={() => {
                    logChatConversation && logChatConversation('chat_closed');
                    setChatOpen(false);
                  }}
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: 'none',
                    color: 'white',
                    borderRadius: '6px',
                    width: '28px',
                    height: '28px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px'
                  }}
                  title="Close chat"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Chat Messages Area */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              overflowX: 'hidden',
              padding: '16px',
              background: '#f8fafc',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              scrollBehavior: 'smooth',
              maxHeight: 'calc(500px - 140px)' // Account for header and input areas
            }}>
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start',
                    alignItems: 'flex-end',
                    gap: '8px'
                  }}
                >
                  {msg.type === 'bot' && (
                    <div style={{
                      width: '28px',
                      height: '28px',
                      background: '#2563eb',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      color: 'white',
                      fontSize: '12px'
                    }}>
                      🤖
                    </div>
                  )}
                  
                  <div style={{
                    maxWidth: '320px',
                    padding: '10px 14px',
                    borderRadius: msg.type === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    background: msg.type === 'user' ? '#2563eb' : 'white',
                    color: msg.type === 'user' ? 'white' : '#374151',
                    fontSize: '14px',
                    lineHeight: '1.4',
                    boxShadow: msg.type === 'user' ? 'none' : '0 2px 8px rgba(0,0,0,0.1)',
                    border: msg.type === 'bot' ? '1px solid #e5e7eb' : 'none',
                    whiteSpace: 'pre-line',
                    wordWrap: 'break-word',
                    overflowWrap: 'break-word',
                    wordBreak: 'break-word'
                  }}>
                    {msg.message}
                    
                    {/* Enhanced Action Buttons */}
                    {msg.type === 'bot' && msg.actionButtons && msg.actionButtons.length > 0 && (
                      <div style={{
                        display: 'flex',
                        gap: '6px',
                        marginTop: '10px',
                        flexWrap: 'wrap'
                      }}>
                        {msg.actionButtons.map((button, index) => (
                          <button
                            key={index}
                            onClick={button.action}
                            title={button.description}
                            style={{
                              background: index === 0 ? '#2563eb' : (index === 1 ? '#10b981' : '#6366f1'),
                              color: 'white',
                              border: 'none',
                              borderRadius: '12px',
                              padding: '4px 10px',
                              fontSize: '11px',
                              cursor: 'pointer',
                              fontFamily: 'inherit',
                              fontWeight: '500',
                              transition: 'all 0.2s ease',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.transform = 'translateY(-1px)'
                              e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)'
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.transform = 'translateY(0)'
                              e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)'
                            }}
                          >
                            {button.text}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Legacy Action Buttons for backwards compatibility */}
                    {msg.type === 'bot' && !msg.actionButtons && (msg.message.includes('call us at') || msg.message.includes('Free Quote')) && (
                      <div style={{
                        display: 'flex',
                        gap: '4px',
                        marginTop: '8px',
                        flexWrap: 'wrap'
                      }}>
                        {msg.message.includes('call us at') && (
                          <button
                            onClick={() => window.location.href = 'tel:+14802555887'}
                            style={{
                              background: '#ef4444',
                              color: 'white',
                              border: 'none',
                              borderRadius: '12px',
                              padding: '3px 8px',
                              fontSize: '10px',
                              cursor: 'pointer',
                              fontFamily: 'inherit'
                            }}
                          >
                            📞 Call
                          </button>
                        )}
                        
                        {msg.message.includes('Free Quote') && (
                          <button
                            onClick={() => openLeadForm('quote')}
                            style={{
                              background: '#10b981',
                              color: 'white',
                              border: 'none',
                              borderRadius: '12px',
                              padding: '3px 8px',
                              fontSize: '10px',
                              cursor: 'pointer',
                              fontFamily: 'inherit'
                            }}
                          >
                            📋 Quote
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {msg.type === 'user' && (
                    <div style={{
                      width: '28px',
                      height: '28px',
                      background: '#6b7280',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      color: 'white',
                      fontSize: '12px'
                    }}>
                      👤
                    </div>
                  )}
                </div>
              ))}

              {/* Typing Indicator */}
              {chatTyping && (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'flex-end', 
                  gap: '8px',
                  animation: 'fadeIn 0.3s ease'
                }}>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    background: '#2563eb',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '12px'
                  }}>
                    🤖
                  </div>
                  
                  <div style={{
                    background: 'white',
                    padding: '10px 14px',
                    borderRadius: '18px 18px 18px 4px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    border: '1px solid #e5e7eb',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <span style={{ fontSize: '11px', color: '#6b7280' }}>AI thinking</span>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {[0, 1, 2].map(i => (
                        <div key={i} style={{
                          width: '4px',
                          height: '4px',
                          background: '#2563eb',
                          borderRadius: '50%',
                          animation: `bounce 1.4s infinite ease-in-out ${i * 0.2}s`
                        }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Invisible element for auto-scrolling */}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input Area */}
            <div style={{
              padding: '12px 16px',
              background: 'white',
              borderTop: '1px solid #e5e7eb',
              borderBottomLeftRadius: '16px',
              borderBottomRightRadius: '16px'
            }}>
              {/* Quick Actions Footer */}
              <div style={{
                display: 'flex',
                gap: '6px',
                marginBottom: '10px',
                justifyContent: 'center'
              }}>
                {[
                  { text: '⚡ Emergency', msg: 'I have an emergency repair needed', color: '#ef4444' },
                  { text: '💰 Quote', msg: 'I need a free quote for my project', color: '#10b981' },
                  { text: '🔧 Services', msg: 'What services do you offer?', color: '#3b82f6' },
                  { text: '📞 Contact', msg: 'How can I contact you?', color: '#8b5cf6' }
                ].map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      const userMessage = {
                        id: Date.now(),
                        type: 'user',
                        message: suggestion.msg,
                        timestamp: new Date()
                      }
                      setChatMessages(prev => [...prev, userMessage])
                      setChatInput('')
                      setChatTyping(true)
                      
                      setTimeout(() => {
                        const botResponse = {
                          id: Date.now() + 1,
                          type: 'bot',
                          message: generateChatResponse(suggestion.msg, chatContext),
                          timestamp: new Date()
                        }
                        setChatMessages(prev => [...prev, botResponse])
                        setChatTyping(false)
                      }, 1200)
                    }}
                    style={{
                      background: 'white',
                      border: `1px solid ${suggestion.color}30`,
                      borderRadius: '16px',
                      padding: '4px 8px',
                      fontSize: '10px',
                      color: suggestion.color,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      fontWeight: '500',
                      transition: 'all 0.2s ease',
                      whiteSpace: 'nowrap',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = suggestion.color
                      e.target.style.color = 'white'
                      e.target.style.transform = 'translateY(-1px)'
                      e.target.style.boxShadow = `0 2px 6px ${suggestion.color}40`
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'white'
                      e.target.style.color = suggestion.color
                      e.target.style.transform = 'translateY(0)'
                      e.target.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)'
                    }}
                  >
                    {suggestion.text}
                  </button>
                ))}
              </div>

              {/* Powered by REMODELY */}
              <div style={{
                fontSize: '10px',
                color: '#9ca3af',
                textAlign: 'center',
                marginBottom: '8px',
                fontWeight: '500'
              }}>
                Powered by <span style={{ 
                  color: '#ef4444', 
                  fontWeight: '600',
                  textDecoration: 'none' 
                }}>REMODELY</span>
              </div>
              
              <form onSubmit={handleChatSubmit} style={{ margin: 0 }}>
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  alignItems: 'center'
                }}>
                  <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleChatSubmit(e)
                    }
                  }}
                  placeholder="Type your message..."
                  autoComplete="off"
                  autoFocus
                  style={{
                    flex: 1,
                    border: '2px solid #e5e7eb',
                    borderRadius: '20px',
                    padding: '10px 16px',
                    fontSize: '14px',
                    outline: 'none',
                    background: 'white',
                    transition: 'border-color 0.2s ease',
                    fontFamily: 'inherit'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#2563eb'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb'
                  }}
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim()}
                  style={{
                    background: chatInput.trim() ? '#2563eb' : '#e5e7eb',
                    border: 'none',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    cursor: chatInput.trim() ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: chatInput.trim() ? 'white' : '#9ca3af',
                    transition: 'all 0.2s ease',
                    fontSize: '16px'
                  }}
                >
                  ➤
                </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatbotWidget;
