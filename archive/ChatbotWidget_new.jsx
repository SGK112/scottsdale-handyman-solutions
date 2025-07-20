import { useState, useRef, useEffect } from 'react';
import {
    MessageCircle,
    X,
    Send,
    Bot,
    User,
    Minimize2,
    Maximize2,
    RotateCcw,
    Zap,
    Phone,
    Mail
} from 'lucide-react';

const ChatbotWidget = ({ openLeadForm }) => {
    const [chatOpen, setChatOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [chatMessages, setChatMessages] = useState([
        {
            sender: 'bot',
            text: '👋 Hi! I\'m your Handyman Assistant. I\'m here to help you with any home repair questions or to connect you with our expert team.\n\nHow can I help you today?',
            timestamp: new Date(),
            isWelcome: true
        }
    ]);
    const [chatInput, setChatInput] = useState('');
    const [chatTyping, setChatTyping] = useState(false);
    const messagesEndRef = useRef(null);

    // Quick actions for new users
    const quickActions = [
        {
            icon: '⚡',
            text: 'Emergency Service',
            action: () => {
                setChatInput('I need emergency handyman service');
                handleSendMessage('I need emergency handyman service');
            }
        },
        {
            icon: '💰',
            text: 'Get Quote',
            action: () => {
                openLeadForm && openLeadForm('quote');
            }
        },
        {
            icon: '🔧',
            text: 'Common Repairs',
            action: () => {
                setChatInput('What are common home repairs?');
                handleSendMessage('What are common home repairs?');
            }
        },
        {
            icon: '📞',
            text: 'Contact Info',
            action: () => {
                setChatInput('What are your contact details?');
                handleSendMessage('What are your contact details?');
            }
        }
    ];

    // Auto-scroll to bottom
    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatMessages, chatTyping]);

    const handleSendMessage = (message = chatInput) => {
        if (!message.trim()) return;

        const userMessage = {
            sender: 'user',
            text: message.trim(),
            timestamp: new Date()
        };

        setChatMessages(prev => [...prev, userMessage]);
        setChatInput('');
        setChatTyping(true);

        // Simulate bot response
        setTimeout(() => {
            const botResponse = getBotResponse(message.trim());
            setChatMessages(prev => [...prev, {
                sender: 'bot',
                text: botResponse,
                timestamp: new Date()
            }]);
            setChatTyping(false);
        }, 1000 + Math.random() * 1000);
    };

    const getBotResponse = (message) => {
        const lowerMessage = message.toLowerCase();

        if (lowerMessage.includes('emergency') || lowerMessage.includes('urgent')) {
            return '🚨 For emergency services, please call us immediately at (480) 255-5887. We offer 24/7 emergency handyman services throughout Scottsdale and surrounding areas.\n\nOur emergency team can handle:\n• Plumbing emergencies\n• Electrical issues\n• Broken doors/windows\n• Water damage repairs\n• And more!';
        }

        if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('quote')) {
            return '💰 Our transparent pricing:\n• General Handyman: $75/hour\n• Electrical Work: $125/hour\n• Plumbing: $95/hour\n• Painting: $200/room\n• Drywall Repair: $85/hour\n• HVAC Service: $125/hour\n\nWould you like a detailed quote for your specific project? I can connect you with our team for a free estimate!';
        }

        if (lowerMessage.includes('service') || lowerMessage.includes('repair') || lowerMessage.includes('fix')) {
            return '🔧 We offer comprehensive handyman services:\n\n• Electrical repairs & installations\n• Plumbing fixes & maintenance\n• Interior/exterior painting\n• Drywall repair & installation\n• Flooring installation & repair\n• HVAC maintenance\n• General home repairs\n• Emergency services 24/7\n\nWhat specific service do you need help with?';
        }

        if (lowerMessage.includes('area') || lowerMessage.includes('location') || lowerMessage.includes('scottsdale')) {
            return '📍 We proudly serve Scottsdale and surrounding areas including:\n\n• Scottsdale\n• Paradise Valley\n• Fountain Hills\n• Cave Creek\n• Tempe\n• Mesa\n• Chandler\n• Glendale\n• Ahwatukee\n\nWe typically respond within 2-4 hours for regular service calls!';
        }

        if (lowerMessage.includes('contact') || lowerMessage.includes('phone') || lowerMessage.includes('call')) {
            return '📞 Contact Scottsdale Handyman Solutions:\n\n• Phone: (480) 255-5887\n• Email: info@scottsdalehandyman.com\n• Available: 24/7 for emergencies\n• Regular Hours: Mon-Sat 7AM-7PM\n\nWould you like me to help you schedule a service call or get a quote?';
        }

        if (lowerMessage.includes('time') || lowerMessage.includes('schedule') || lowerMessage.includes('when')) {
            return '⏰ We offer flexible scheduling:\n\n• Same-day service available\n• Evening appointments\n• Weekend service\n• Emergency 24/7 response\n\nTypical response times:\n• Emergency: Within 1 hour\n• Urgent: Within 4 hours\n• Regular: Next business day\n\nWhen would work best for you?';
        }

        if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
            return '😊 You\'re very welcome! Is there anything else I can help you with today? \n\nRemember, we\'re available 24/7 for emergencies at (480) 255-5887, and I can connect you with our team anytime for quotes or scheduling!';
        }

        // Default response
        return '🏠 I\'m here to help with all your handyman needs! I can assist with:\n\n• Service information & pricing\n• Scheduling appointments\n• Emergency services\n• Service area questions\n• Getting quotes\n\nWhat would you like to know more about? Or would you prefer to speak directly with our team?';
    };

    const handleChatSubmit = (e) => {
        e.preventDefault();
        handleSendMessage();
    };

    return (
        <>
            {/* Chat Button */}
            {!chatOpen && (
                <button
                    onClick={() => setChatOpen(true)}
                    style={{
                        position: 'fixed',
                        bottom: '24px',
                        right: '24px',
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '24px',
                        boxShadow: '0 8px 32px rgba(37, 99, 235, 0.3)',
                        transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                        zIndex: 99999,
                        animation: 'pulse 2s infinite'
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.transform = 'scale(1.1)';
                        e.target.style.boxShadow = '0 12px 40px rgba(37, 99, 235, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.transform = 'scale(1)';
                        e.target.style.boxShadow = '0 8px 32px rgba(37, 99, 235, 0.3)';
                    }}
                >
                    <MessageCircle size={28} />
                </button>
            )}

            {/* Chat Window */}
            {chatOpen && (
                <div
                    style={{
                        position: 'fixed',
                        bottom: '24px',
                        right: '24px',
                        width: window.innerWidth <= 768 ? 'calc(100vw - 32px)' : '400px',
                        height: window.innerWidth <= 768 ? 'calc(100vh - 100px)' : isMinimized ? '60px' : '600px',
                        maxHeight: '80vh',
                        background: 'white',
                        borderRadius: '16px',
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        zIndex: 99999,
                        animation: 'slideUp 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                        border: '1px solid #e5e7eb',
                        ...(window.innerWidth <= 768 && {
                            left: '16px',
                            right: '16px',
                            width: 'calc(100vw - 32px)',
                            height: 'calc(100vh - 100px)'
                        })
                    }}
                >
                    {/* Chat Header */}
                    <div
                        style={{
                            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                            color: 'white',
                            padding: '16px 20px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderRadius: '16px 16px 0 0'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    background: 'rgba(255, 255, 255, 0.2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <Bot size={20} />
                            </div>
                            <div>
                                <div style={{ fontWeight: '600', fontSize: '16px' }}>Handyman Assistant</div>
                                <div style={{ fontSize: '12px', opacity: 0.9, color: '#FFD700' }}>
                                    {chatTyping ? 'Typing...' : 'Online • Ready to Help'}
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <button
                                onClick={() => setIsMinimized(!isMinimized)}
                                style={{
                                    background: 'rgba(255, 255, 255, 0.2)',
                                    border: 'none',
                                    borderRadius: '6px',
                                    width: '32px',
                                    height: '32px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    color: 'white'
                                }}
                            >
                                {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                            </button>
                            <button
                                onClick={() => setChatOpen(false)}
                                style={{
                                    background: 'rgba(255, 255, 255, 0.2)',
                                    border: 'none',
                                    borderRadius: '6px',
                                    width: '32px',
                                    height: '32px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    color: 'white'
                                }}
                            >
                                <X size={16} />
                            </button>
                        </div>
                    </div>

                    {!isMinimized && (
                        <>
                            {/* Messages Container */}
                            <div
                                style={{
                                    flex: 1,
                                    overflowY: 'auto',
                                    padding: '20px',
                                    background: '#f8fafc',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '16px'
                                }}
                            >
                                {/* Quick Actions (show when no messages) */}
                                {chatMessages.length <= 1 && (
                                    <div style={{ marginBottom: '16px' }}>
                                        <div style={{
                                            fontSize: '14px',
                                            color: '#64748b',
                                            marginBottom: '12px',
                                            textAlign: 'center'
                                        }}>
                                            Quick Actions
                                        </div>
                                        <div
                                            style={{
                                                display: 'grid',
                                                gridTemplateColumns: '1fr 1fr',
                                                gap: '8px'
                                            }}
                                        >
                                            {quickActions.map((action, index) => (
                                                <button
                                                    key={index}
                                                    onClick={action.action}
                                                    style={{
                                                        background: 'white',
                                                        border: '1px solid #e2e8f0',
                                                        borderRadius: '12px',
                                                        padding: '12px 8px',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s ease',
                                                        fontSize: '12px',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'center',
                                                        gap: '4px',
                                                        color: '#374151'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.target.style.borderColor = '#2563eb';
                                                        e.target.style.transform = 'translateY(-2px)';
                                                        e.target.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.15)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.target.style.borderColor = '#e2e8f0';
                                                        e.target.style.transform = 'translateY(0)';
                                                        e.target.style.boxShadow = 'none';
                                                    }}
                                                >
                                                    <span style={{ fontSize: '16px' }}>{action.icon}</span>
                                                    <span>{action.text}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Chat Messages */}
                                {chatMessages.map((msg, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            display: 'flex',
                                            justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                            alignItems: 'flex-end',
                                            gap: '8px',
                                            animation: `messageSlide 0.3s ease ${index * 0.1}s both`
                                        }}
                                    >
                                        {msg.sender === 'bot' && (
                                            <div
                                                style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    borderRadius: '50%',
                                                    background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    flexShrink: 0
                                                }}
                                            >
                                                <Bot size={16} color="white" />
                                            </div>
                                        )}

                                        <div
                                            style={{
                                                maxWidth: '75%',
                                                padding: '12px 16px',
                                                borderRadius: msg.sender === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                                                background: msg.sender === 'user'
                                                    ? 'linear-gradient(135deg, #2563eb, #1d4ed8)'
                                                    : 'white',
                                                color: msg.sender === 'user' ? 'white' : '#374151',
                                                fontSize: '14px',
                                                lineHeight: '1.5',
                                                whiteSpace: 'pre-wrap',
                                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                                border: msg.sender === 'bot' ? '1px solid #e5e7eb' : 'none'
                                            }}
                                        >
                                            {msg.text}
                                            {msg.isWelcome && (
                                                <div style={{
                                                    marginTop: '12px',
                                                    paddingTop: '12px',
                                                    borderTop: '1px solid #e5e7eb',
                                                    display: 'flex',
                                                    gap: '8px',
                                                    justifyContent: 'center'
                                                }}>
                                                    <button
                                                        onClick={() => window.location.href = 'tel:+14802555887'}
                                                        style={{
                                                            background: '#ef4444',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '6px',
                                                            padding: '6px 12px',
                                                            fontSize: '12px',
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '4px'
                                                        }}
                                                    >
                                                        <Phone size={12} />
                                                        Emergency
                                                    </button>
                                                    <button
                                                        onClick={() => openLeadForm && openLeadForm('chat')}
                                                        style={{
                                                            background: '#10b981',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '6px',
                                                            padding: '6px 12px',
                                                            fontSize: '12px',
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '4px'
                                                        }}
                                                    >
                                                        <Mail size={12} />
                                                        Get Quote
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {msg.sender === 'user' && (
                                            <div
                                                style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    borderRadius: '50%',
                                                    background: '#6b7280',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    flexShrink: 0
                                                }}
                                            >
                                                <User size={16} color="white" />
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {/* Typing Indicator */}
                                {chatTyping && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div
                                            style={{
                                                width: '32px',
                                                height: '32px',
                                                borderRadius: '50%',
                                                background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <Bot size={16} color="white" />
                                        </div>
                                        <div
                                            style={{
                                                background: 'white',
                                                padding: '12px 16px',
                                                borderRadius: '16px 16px 16px 4px',
                                                border: '1px solid #e5e7eb',
                                                display: 'flex',
                                                gap: '4px'
                                            }}
                                        >
                                            <div style={{
                                                width: '8px',
                                                height: '8px',
                                                borderRadius: '50%',
                                                background: '#94a3b8',
                                                animation: 'typing 1.4s infinite ease-in-out'
                                            }} />
                                            <div style={{
                                                width: '8px',
                                                height: '8px',
                                                borderRadius: '50%',
                                                background: '#94a3b8',
                                                animation: 'typing 1.4s infinite ease-in-out 0.2s'
                                            }} />
                                            <div style={{
                                                width: '8px',
                                                height: '8px',
                                                borderRadius: '50%',
                                                background: '#94a3b8',
                                                animation: 'typing 1.4s infinite ease-in-out 0.4s'
                                            }} />
                                        </div>
                                    </div>
                                )}

                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area */}
                            <div
                                style={{
                                    padding: '16px 20px',
                                    borderTop: '1px solid #e5e7eb',
                                    background: 'white',
                                    borderRadius: '0 0 16px 16px'
                                }}
                            >
                                <form
                                    onSubmit={handleChatSubmit}
                                    style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}
                                >
                                    <div style={{ flex: 1, position: 'relative' }}>
                                        <textarea
                                            value={chatInput}
                                            onChange={(e) => setChatInput(e.target.value)}
                                            placeholder="Type your message..."
                                            disabled={chatTyping}
                                            style={{
                                                width: '100%',
                                                minHeight: '44px',
                                                maxHeight: '120px',
                                                padding: '12px 16px',
                                                border: '1px solid #d1d5db',
                                                borderRadius: '12px',
                                                fontSize: '14px',
                                                resize: 'none',
                                                outline: 'none',
                                                fontFamily: 'inherit',
                                                transition: 'border-color 0.2s ease'
                                            }}
                                            onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                                            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    handleChatSubmit(e);
                                                }
                                            }}
                                            rows={1}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={!chatInput.trim() || chatTyping}
                                        style={{
                                            width: '44px',
                                            height: '44px',
                                            borderRadius: '12px',
                                            background: chatInput.trim() && !chatTyping
                                                ? 'linear-gradient(135deg, #2563eb, #1d4ed8)'
                                                : '#d1d5db',
                                            border: 'none',
                                            cursor: chatInput.trim() && !chatTyping ? 'pointer' : 'not-allowed',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        <Send size={18} color="white" />
                                    </button>
                                </form>

                                {/* Footer */}
                                <div style={{
                                    textAlign: 'center',
                                    fontSize: '11px',
                                    color: '#9ca3af',
                                    marginTop: '12px'
                                }}>
                                    Powered by Scottsdale Handyman Solutions • Available 24/7
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* CSS Animations */}
            <style>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        
        @keyframes slideUp {
          from {
            transform: translateY(100px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        @keyframes messageSlide {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes typing {
          0%, 60%, 100% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-10px);
          }
        }
      `}</style>
        </>
    );
};

export default ChatbotWidget;
