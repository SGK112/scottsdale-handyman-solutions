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
    const [isMinimized, setIsMinimized] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);
    const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
    const [shouldPulse, setShouldPulse] = useState(true);
    const messagesEndRef = useRef(null);

    // Add tooltip timeout ref for better hover control
    const tooltipTimeoutRef = useRef(null);
    const autoTooltipTimeoutRef = useRef(null);

    // Initialize chatbot to always start blue
    useEffect(() => {
        setHasUnreadMessages(false);
    }, []);

    // Quick actions for new users
    const quickActions = [
        {
            icon: '⚡',
            text: 'Emergency Service',
            action: () => {
                const message = 'I need emergency handyman service';
                if (handleQuickReply) {
                    handleQuickReply(message);
                } else {
                    handleSendMessage(message);
                }
            }
        },
        {
            icon: '💰',
            text: 'Get Quote',
            action: () => {
                if (openLeadForm) {
                    openLeadForm('quote');
                } else if (handleQuickReply) {
                    handleQuickReply('I would like to get a quote');
                } else {
                    handleSendMessage('I would like to get a quote');
                }
            }
        },
        {
            icon: '🔧',
            text: 'Common Repairs',
            action: () => {
                const message = 'What are common home repairs?';
                if (handleQuickReply) {
                    handleQuickReply(message);
                } else {
                    handleSendMessage(message);
                }
            }
        },
        {
            icon: '📞',
            text: 'Contact Info',
            action: () => {
                const message = 'What are your contact details?';
                if (handleQuickReply) {
                    handleQuickReply(message);
                } else {
                    handleSendMessage(message);
                }
            }
        }
    ];

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

    // Enhanced tooltip management with auto-hide
    const handleTooltipEnter = () => {
        if (tooltipTimeoutRef.current) {
            clearTimeout(tooltipTimeoutRef.current);
        }
        setShowTooltip(true);
        setShouldPulse(false); // Stop pulsing when tooltip is shown
    };

    const handleTooltipLeave = () => {
        tooltipTimeoutRef.current = setTimeout(() => {
            setShowTooltip(false);
            setShouldPulse(true); // Resume pulsing when tooltip is hidden
        }, 200);
    };

    // Hide tooltip when clicking anywhere on the page
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showTooltip) {
                setShowTooltip(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [showTooltip]);

    // Auto-show tooltip periodically with auto-hide
    useEffect(() => {
        if (!chatOpen) {
            const showPeriodicTooltip = () => {
                if (!showTooltip) {
                    setShowTooltip(true);
                    // Auto-hide after 2 seconds
                    setTimeout(() => {
                        setShowTooltip(false);
                    }, 2000);
                }
            };

            // Show tooltip after 10 seconds initially
            autoTooltipTimeoutRef.current = setTimeout(showPeriodicTooltip, 10000);

            // Then show every 45 seconds
            const interval = setInterval(() => {
                if (!showTooltip && !chatOpen) {
                    showPeriodicTooltip();
                }
            }, 45000);

            // Add proactive message after 2 minutes of inactivity
            const proactiveTimeout = setTimeout(() => {
                if (!chatOpen && chatMessages.length <= 1) {
                    // Add a gentle reminder message
                    setChatMessages && setChatMessages(prev => [...prev, {
                        sender: 'bot',
                        text: '👋 Still here to help! I\'m available 24/7 for any handyman questions or if you need emergency service. Just click the chat button when you\'re ready!',
                        timestamp: new Date(),
                        isProactive: true
                    }]);
                    // Don't set hasUnreadMessages to true for proactive messages
                }
            }, 120000); // 2 minutes

            return () => {
                if (autoTooltipTimeoutRef.current) {
                    clearTimeout(autoTooltipTimeoutRef.current);
                }
                clearTimeout(proactiveTimeout);
                clearInterval(interval);
            };
        }
    }, [chatOpen, showTooltip, chatMessages, setChatMessages]);

    // Handle keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Ctrl/Cmd + K to open/close chat
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setChatOpen(!chatOpen);
            }

            // Escape to close chat
            if (e.key === 'Escape' && chatOpen) {
                setChatOpen(false);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [chatOpen, setChatOpen]);

    // Track unread messages when chat is closed
    useEffect(() => {
        if (!chatOpen && chatMessages.length > 0) {
            const lastMessage = chatMessages[chatMessages.length - 1];
            // Only set unread for actual bot responses, not proactive messages
            if (lastMessage.sender === 'bot' && !lastMessage.isProactive) {
                setHasUnreadMessages(true);
                setShouldPulse(true);
            }
        } else if (chatOpen) {
            setHasUnreadMessages(false);
            setShouldPulse(false);
        }
    }, [chatMessages, chatOpen]);

    // Auto-scroll effect
    useEffect(() => {
        scrollToBottom();
    }, [chatMessages, chatTyping]);

    // Welcome message effect - ensure there's a welcome message when chat opens
    useEffect(() => {
        if (chatOpen && chatMessages.length === 0) {
            // Add initial welcome message if none exists
            const welcomeMessage = {
                sender: 'bot',
                text: '🏠 Hi! I\'m your AI handyman assistant. I can help you with service information, pricing, scheduling, and emergency support. What can I help you with today?',
                timestamp: new Date(),
                isWelcome: true
            };
            setChatMessages([welcomeMessage]);
        }
    }, [chatOpen, chatMessages.length, setChatMessages]);

    const handleSendMessage = (message = chatInput) => {
        if (!message.trim()) return;

        console.log('📤 ChatbotWidget handleSendMessage called with:', message);
        console.log('🔍 handleChatSubmit prop available:', !!handleChatSubmit);

        // Clear the input field immediately
        setChatInput('');

        // Use the handleChatSubmit function from props if available
        if (handleChatSubmit) {
            console.log('✅ Using App handleChatSubmit');
            handleChatSubmit(message.trim());
        } else {
            console.log('⚠️ Using fallback logic');
            // Fallback logic if handleChatSubmit is not provided
            const userMessage = {
                sender: 'user',
                text: message.trim(),
                timestamp: new Date()
            };

            setChatMessages(prev => [...prev, userMessage]);
            setChatTyping(true);

            // Simulate bot response
            setTimeout(() => {
                try {
                    console.log('🤖 ChatbotWidget: Attempting to generate response...');
                    let botResponse;
                    if (generateChatResponse) {
                        console.log('🎯 Using App generateChatResponse');
                        botResponse = generateChatResponse(message.trim());
                        console.log('✅ App response:', botResponse);
                    } else {
                        console.log('🔄 Using fallback getBotResponse');
                        botResponse = getBotResponse(message.trim());
                        console.log('✅ Fallback response:', botResponse);
                    }

                    // Ensure we have a valid response
                    if (!botResponse || typeof botResponse !== 'string') {
                        console.warn('⚠️ Invalid response, using fallback');
                        botResponse = "I apologize, but I'm having trouble processing your request right now. Could you please rephrase your question or contact us directly at (480) 255-5887?";
                    }

                    setChatMessages(prev => [...prev, {
                        sender: 'bot',
                        text: botResponse,
                        timestamp: new Date()
                    }]);
                } catch (error) {
                    console.error('❌ Error generating response:', error);
                    setChatMessages(prev => [...prev, {
                        sender: 'bot',
                        text: "I apologize, but I'm experiencing technical difficulties. Please contact us directly at (480) 255-5887 for immediate assistance.",
                        timestamp: new Date()
                    }]);
                }
                setChatTyping(false);
            }, 1000 + Math.random() * 1000);
        }
    };

    const getBotResponse = (message) => {
        const lowerMessage = message.toLowerCase();

        if (lowerMessage.includes('emergency') || lowerMessage.includes('urgent')) {
            return '🚨 For emergency services, please call us immediately at (480) 255-5887. We offer 24/7 emergency handyman services throughout Scottsdale and surrounding areas.\n\nOur emergency team can handle:\n• Plumbing emergencies\n• Electrical issues\n• Broken doors/windows\n• Water damage repairs\n• And more!';
        }

        if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('quote') || lowerMessage.includes('much')) {
            return '💰 Our transparent pricing:\n• General Handyman: $85/hour\n• Electrical Work: $125/hour\n• Plumbing: $95/hour\n• Painting: $200-400/room\n• Drywall Repair: $85/hour\n• HVAC Service: $125/hour\n\nWould you like a detailed quote for your specific project? I can connect you with our team for a free estimate!';
        }

        if (lowerMessage.includes('service') || lowerMessage.includes('repair') || lowerMessage.includes('fix')) {
            return '🔧 We offer comprehensive handyman services:\n\n• Electrical repairs & installations\n• Plumbing fixes & maintenance\n• Interior/exterior painting\n• Drywall repair & installation\n• Flooring installation & repair\n• HVAC maintenance\n• General home repairs\n• Emergency services 24/7\n\nWhat specific service do you need help with?';
        }

        if (lowerMessage.includes('area') || lowerMessage.includes('location') || lowerMessage.includes('scottsdale')) {
            return '📍 We proudly serve Scottsdale and surrounding areas including:\n\n• Scottsdale\n• Paradise Valley\n• Fountain Hills\n• Cave Creek\n• Tempe\n• Mesa\n• Chandler\n• Glendale\n• Ahwatukee\n\nWe typically respond within 2-4 hours for regular service calls!';
        }

        if (lowerMessage.includes('contact') || lowerMessage.includes('phone') || lowerMessage.includes('call')) {
            return '📞 Contact Scottsdale Handyman Solutions:\n\n• Phone: (480) 255-5887\n• Email: help.scottsdalehandyman@gmail.com\n• Available: 24/7 for emergencies\n• Regular Hours: Mon-Sat 7AM-6PM\n\nWould you like me to help you schedule a service call or get a quote?';
        }

        if (lowerMessage.includes('time') || lowerMessage.includes('schedule') || lowerMessage.includes('when')) {
            return '⏰ We offer flexible scheduling:\n\n• Same-day service available\n• Evening appointments\n• Weekend service\n• Emergency 24/7 response\n\nTypical response times:\n• Emergency: Within 1 hour\n• Urgent: Within 4 hours\n• Regular: Next business day\n\nWhen would work best for you?';
        }

        if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
            return '👋 Hello! Great to meet you! I\'m here to help with all your handyman needs. What project are you working on or what needs fixing today?';
        }

        if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
            return '😊 You\'re very welcome! Is there anything else I can help you with today? \n\nRemember, we\'re available 24/7 for emergencies at (480) 255-5887, and I can connect you with our team anytime for quotes or scheduling!';
        }

        // Default response
        return '🏠 I\'m here to help with all your handyman needs! I can assist with:\n\n• Service information & pricing\n• Scheduling appointments\n• Emergency services\n• Service area questions\n• Getting quotes\n\nWhat would you like to know more about? Or would you prefer to speak directly with our team?';
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (!chatInput.trim()) return;
        const message = chatInput.trim();
        handleSendMessage(message);
    };

    return (
        <>
            {/* Chat Button */}
            {!chatOpen && (
                <>
                    {/* Tooltip and Quick Actions - Enhanced Version */}
                    {showTooltip && (
                        <>
                            {/* Main Tooltip */}
                            <div
                                className="chatbot-tooltip-container"
                                onMouseEnter={handleTooltipEnter}
                                onMouseLeave={handleTooltipLeave}
                                style={{
                                    position: 'fixed',
                                    bottom: '100px',
                                    right: '24px',
                                    background: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
                                    color: 'white',
                                    padding: '14px 16px',
                                    borderRadius: '14px',
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)',
                                    zIndex: 99998,
                                    animation: 'slideInUp 0.3s ease-out',
                                    maxWidth: '280px',
                                    minWidth: '240px',
                                    width: 'auto',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    // Mobile responsive styles handled by window.innerWidth check
                                    ...(window.innerWidth <= 640 && {
                                        right: '16px',
                                        left: '16px',
                                        maxWidth: 'none',
                                        minWidth: 'auto',
                                        bottom: '88px'
                                    })
                                }}
                            >
                                <div className="chatbot-text-wrap" style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    marginBottom: '10px',
                                    flexWrap: 'nowrap',
                                    lineHeight: '1.3'
                                }}>
                                    <div style={{
                                        backgroundColor: 'white',
                                        borderRadius: '50%',
                                        padding: '4px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        border: '2px solid #3b82f6',
                                        boxShadow: '0 2px 8px rgba(59, 130, 246, 0.2)',
                                        flexShrink: 0
                                    }}>
                                        <Bot size={16} style={{ color: '#3b82f6' }} />
                                    </div>
                                    <span style={{
                                        wordBreak: 'break-word',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        flex: 1,
                                        whiteSpace: 'normal'
                                    }}>
                                        💬 Hi! I'm here to help with handyman needs
                                    </span>
                                </div>

                                <div className="chatbot-text-wrap" style={{
                                    fontSize: '11px',
                                    color: '#d1d5db',
                                    marginBottom: '12px',
                                    lineHeight: '1.3',
                                    wordBreak: 'break-word',
                                    whiteSpace: 'normal'
                                }}>
                                    Get instant help or quick action below:
                                </div>

                                {/* Quick Actions Grid */}
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: '6px',
                                    marginTop: '6px'
                                }}>
                                    <button
                                        onClick={() => openLeadForm && openLeadForm('emergency')}
                                        style={{
                                            background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '8px',
                                            padding: '8px 10px',
                                            fontSize: '10px',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '4px',
                                            boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)',
                                            minHeight: '32px',
                                            textOverflow: 'ellipsis',
                                            overflow: 'hidden',
                                            wordBreak: 'keep-all'
                                        }}
                                        onMouseEnter={(e) => {
                                            handleTooltipEnter();
                                            e.target.style.transform = 'scale(1.02)';
                                            e.target.style.boxShadow = '0 6px 16px rgba(220, 38, 38, 0.4)';
                                        }}
                                        onMouseLeave={(e) => {
                                            handleTooltipLeave();
                                            e.target.style.transform = 'scale(1)';
                                            e.target.style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.3)';
                                        }}
                                    >
                                        <Phone size={12} />
                                        <span>Emergency</span>
                                    </button>

                                    <button
                                        onClick={() => openLeadForm && openLeadForm('quote')}
                                        style={{
                                            background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '8px',
                                            padding: '8px 10px',
                                            fontSize: '10px',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '4px',
                                            boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)',
                                            minHeight: '32px',
                                            textOverflow: 'ellipsis',
                                            overflow: 'hidden',
                                            wordBreak: 'keep-all'
                                        }}
                                        onMouseEnter={(e) => {
                                            handleTooltipEnter();
                                            e.target.style.transform = 'scale(1.02)';
                                            e.target.style.boxShadow = '0 6px 16px rgba(5, 150, 105, 0.4)';
                                        }}
                                        onMouseLeave={(e) => {
                                            handleTooltipLeave();
                                            e.target.style.transform = 'scale(1)';
                                            e.target.style.boxShadow = '0 4px 12px rgba(5, 150, 105, 0.3)';
                                        }}
                                    >
                                        <Zap size={12} />
                                        <span>Free Quote</span>
                                    </button>
                                </div>

                                {/* Tooltip Arrow */}
                                <div
                                    style={{
                                        position: 'absolute',
                                        bottom: '-8px',
                                        right: '28px',
                                        width: '16px',
                                        height: '16px',
                                        background: 'linear-gradient(135deg, #374151 0%, #1f2937 100%)',
                                        transform: 'rotate(45deg)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        borderTop: 'none',
                                        borderLeft: 'none'
                                    }}
                                />
                            </div>
                        </>
                    )}

                    <button
                        onClick={() => setChatOpen(true)}
                        onMouseEnter={handleTooltipEnter}
                        onMouseLeave={handleTooltipLeave}
                        style={{
                            position: 'fixed',
                            bottom: '24px',
                            right: '24px',
                            width: '64px',
                            height: '64px',
                            borderRadius: '16px',
                            background: hasUnreadMessages
                                ? 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)'
                                : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                            border: hasUnreadMessages ? '3px solid #fbbf24' : 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '24px',
                            boxShadow: hasUnreadMessages
                                ? '0 8px 32px rgba(220, 38, 38, 0.6), 0 0 20px rgba(251, 191, 36, 0.3)'
                                : '0 8px 32px rgba(59, 130, 246, 0.4)',
                            transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                            zIndex: 99999,
                            animation: shouldPulse
                                ? hasUnreadMessages ? 'urgentPulse 1.5s infinite' : 'gentlePulse 3s infinite'
                                : 'none'
                        }}
                        onMouseOver={(e) => {
                            e.target.style.transform = 'scale(1.05) translateY(-2px)';
                            e.target.style.boxShadow = hasUnreadMessages
                                ? '0 12px 40px rgba(220, 38, 38, 0.7), 0 0 25px rgba(251, 191, 36, 0.4)'
                                : '0 12px 40px rgba(59, 130, 246, 0.5)';
                        }}
                        onMouseOut={(e) => {
                            e.target.style.transform = 'scale(1) translateY(0)';
                            e.target.style.boxShadow = hasUnreadMessages
                                ? '0 8px 32px rgba(220, 38, 38, 0.6), 0 0 20px rgba(251, 191, 36, 0.3)'
                                : '0 8px 32px rgba(59, 130, 246, 0.4)';
                        }}
                    >
                        <MessageCircle size={28} />
                        {hasUnreadMessages && (
                            <div style={{
                                position: 'absolute',
                                top: '-4px',
                                right: '-4px',
                                width: '18px',
                                height: '18px',
                                borderRadius: '50%',
                                background: '#fbbf24',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '10px',
                                fontWeight: 'bold',
                                color: '#000',
                                animation: 'bounce 1s infinite'
                            }}>
                                !
                            </div>
                        )}
                    </button>
                </>
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
                            background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)', // Match button color
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
                                    backgroundColor: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '2px solid #3b82f6',
                                    boxShadow: '0 2px 8px rgba(59, 130, 246, 0.2)'
                                }}
                            >
                                <Bot size={20} style={{ color: '#3b82f6' }} />
                            </div>
                            <div>
                                <div style={{ fontWeight: '600', fontSize: '16px' }}>The Scottsdale Handyman</div>
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
                                className="chatbot-messages"
                                style={{
                                    flex: 1,
                                    overflowY: 'auto',
                                    padding: '20px',
                                    background: '#f8fafc',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '16px',
                                    minHeight: '400px', // Ensure minimum height for proper content display
                                    maxHeight: window.innerWidth <= 768 ? 'calc(100vh - 220px)' : '400px'
                                }}
                            >
                                {/* Quick Actions (show when no messages) */}
                                {chatMessages.length <= 1 && (
                                    <div style={{ marginBottom: '16px' }}>
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
                                                    background: 'white',
                                                    border: '2px solid #3b82f6',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    flexShrink: 0,
                                                    boxShadow: '0 2px 8px rgba(59, 130, 246, 0.2)'
                                                }}
                                            >
                                                <Bot size={16} color="#3b82f6" />
                                            </div>
                                        )}

                                        <div
                                            style={{
                                                maxWidth: '75%',
                                                padding: '12px 16px',
                                                borderRadius: msg.sender === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                                                background: msg.sender === 'user'
                                                    ? 'linear-gradient(135deg, #dc2626, #b91c1c)'
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
                                                        onClick={() => openLeadForm && openLeadForm('quote')}
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
                                                background: 'white',
                                                border: '2px solid #3b82f6',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                boxShadow: '0 2px 8px rgba(59, 130, 246, 0.2)'
                                            }}
                                        >
                                            <Bot size={16} color="#3b82f6" />
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
                                    onSubmit={handleFormSubmit}
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
                                                    handleFormSubmit(e);
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
                                                ? 'linear-gradient(135deg, #dc2626, #b91c1c)'
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
                                    Powered by <span style={{ color: '#dc2626', fontWeight: '600' }}>REMODELY</span> • Available 24/7
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
        
        @keyframes gentlePulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.02); opacity: 0.9; }
        }
        
        @keyframes urgentPulse {
          0%, 100% { transform: scale(1); }
          25% { transform: scale(1.05); }
          50% { transform: scale(1.08); }
          75% { transform: scale(1.05); }
        }
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-5px); }
          60% { transform: translateY(-3px); }
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
        
        @keyframes slideInUp {
          from {
            transform: translateY(20px);
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

        /* Responsive styles for mobile */
        @media (max-width: 768px) {
          .chatbot-tooltip-container {
            right: 16px !important;
            left: 16px !important;
            max-width: none !important;
            min-width: auto !important;
            bottom: 88px !important;
          }
        }

        /* Smooth scrolling for message container */
        .chatbot-messages::-webkit-scrollbar {
          width: 6px;
        }
        
        .chatbot-messages::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }
        
        .chatbot-messages::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 3px;
        }
        
        .chatbot-messages::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
      `}</style>
        </>
    );
};

export default ChatbotWidget;
