import { useState, useRef, useEffect } from 'react';
import {
    MessageCircle,
    X,
    Send,
    Bot,
    User,
    Minimize2,
    Maximize2,
    Phone,
    Mail,
    Zap
} from 'lucide-react';

const ChatbotWidget = () => {
    const [chatOpen, setChatOpen] = useState(false);
    const [chatMessages, setChatMessages] = useState([]);
    const [chatInput, setChatInput] = useState('');
    const [chatTyping, setChatTyping] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    // Tooltip state management
    const [showTooltip, setShowTooltip] = useState(false);
    const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
    const [shouldPulse, setShouldPulse] = useState(true);
    const [tooltipShownOnLoad, setTooltipShownOnLoad] = useState(false);
    const [tooltipShownOnScroll, setTooltipShownOnScroll] = useState(false);
    const messagesEndRef = useRef(null);

    // Add tooltip timeout refs
    const tooltipTimeoutRef = useRef(null);

    // Initialize chatbot to always start blue
    useEffect(() => {
        setHasUnreadMessages(false);
    }, []);

    // Initialize welcome message when chat opens
    useEffect(() => {
        if (chatOpen && chatMessages.length === 0) {
            const welcomeMessage = {
                sender: 'bot',
                text: '🏠 **Welcome to Scottsdale Handyman Solutions!**\n\nI\'m your AI assistant ready to help with:\n• 🔧 Service information & pricing\n• 📅 Scheduling appointments\n• 🚨 Emergency support\n• 📍 Service area questions\n• 💰 Free quotes & estimates\n\n**What can I help you with today?**',
                timestamp: new Date(),
                isWelcome: true,
                showSuggestions: true
            };
            setChatMessages([welcomeMessage]);
        }
    }, [chatOpen, chatMessages.length]);

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

    // Quick actions for new users
    const quickActions = [
        {
            icon: '⚡',
            text: 'Emergency Service',
            action: () => handleSendMessage('I need emergency handyman service')
        },
        {
            icon: '💰',
            text: 'Get Quote',
            action: () => handleSendMessage('I would like to get a quote')
        },
        {
            icon: '🔧',
            text: 'Common Repairs',
            action: () => handleSendMessage('What are common home repairs?')
        },
        {
            icon: '📞',
            text: 'Contact Info',
            action: () => handleSendMessage('What are your contact details?')
        }
    ];

    // Generate bot responses
    const getBotResponse = (message) => {
        const lowerMessage = message.toLowerCase();

        // Enhanced emergency detection
        if (lowerMessage.includes('emergency') || lowerMessage.includes('urgent') || lowerMessage.includes('broke') || 
            lowerMessage.includes('flooding') || lowerMessage.includes('leak') || lowerMessage.includes('electrical fire') ||
            lowerMessage.includes('no power') || lowerMessage.includes('burst pipe') || lowerMessage.includes('gas leak')) {
            return '🚨 **EMERGENCY RESPONSE ACTIVATED** 🚨\n\n📞 **CALL NOW: (480) 255-5887**\n\nFor immediate emergencies:\n• Electrical fires: Call 911 first!\n• Gas leaks: Evacuate & call gas company\n• Major flooding: Shut off main water valve\n• No power: Check circuit breaker first\n\n⚡ Our emergency team responds within 1 hour, 24/7. We\'re dispatching help now!\n\nStay safe and call us immediately at (480) 255-5887';
        }

        // Enhanced pricing and quotes with specific service detection
        if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('quote') || lowerMessage.includes('estimate') || lowerMessage.includes('much')) {
            if (lowerMessage.includes('electrical') || lowerMessage.includes('outlet') || lowerMessage.includes('wiring')) {
                return '💡 **Electrical Service Pricing:**\n\n• Outlet installation: $75-$150\n• Light fixture install: $100-$200\n• Circuit breaker replacement: $150-$300\n• Fan installation: $125-$250\n• Panel upgrade: $1,200-$2,500\n\n📋 **Free detailed estimate includes:**\n✓ Complete electrical inspection\n✓ Code compliance check\n✓ 1-year warranty\n\n🎯 **Get Your FREE Quote:** Call (480) 255-5887 or click "Get Quote" button!';
            }
            if (lowerMessage.includes('plumbing') || lowerMessage.includes('pipe') || lowerMessage.includes('drain') || lowerMessage.includes('toilet')) {
                return '� **Plumbing Service Pricing:**\n\n• Drain cleaning: $100-$200\n• Toilet repair/replace: $150-$400\n• Faucet installation: $125-$250\n• Pipe repair: $200-$500\n• Water heater service: $300-$800\n\n📋 **Free estimate includes:**\n✓ Complete plumbing inspection\n✓ Water pressure test\n✓ Parts & labor warranty\n\n🎯 **Get Your FREE Quote:** Call (480) 255-5887!';
            }
            return '💰 **Transparent Pricing - No Hidden Fees!**\n\n**Popular Services:**\n• Basic repairs: $75-$150/hour\n• Installation work: $100-$300\n• Emergency calls: $125 service fee\n• Multi-service discount: 15% off\n\n📋 **Every estimate includes:**\n✓ Detailed scope of work\n✓ Material costs breakdown\n✓ Timeline expectations\n✓ 100% satisfaction guarantee\n\n🎯 **Get Your FREE Quote:** Call (480) 255-5887 or use our smart quote form!';
        }

        // Enhanced service detection with more specific responses
        if (lowerMessage.includes('service') || lowerMessage.includes('repair') || lowerMessage.includes('fix')) {
            if (lowerMessage.includes('electrical')) {
                return '⚡ **Expert Electrical Services:**\n\n🔧 **Residential:**\n• Outlet & switch installation\n• Ceiling fan installation\n• Light fixtures & chandeliers\n• Circuit breaker repairs\n• Panel upgrades & rewiring\n• GFCI installation\n\n🏢 **Commercial:**\n• Office lighting upgrades\n• Electrical troubleshooting\n• Code compliance updates\n\n✅ **Licensed & Insured** | ⚡ **24/7 Emergency** | 🛡️ **1-Year Warranty**\n\nReady to get started? Call (480) 255-5887!';
            }
            if (lowerMessage.includes('plumbing')) {
                return '🔧 **Professional Plumbing Services:**\n\n💧 **Repairs & Maintenance:**\n• Drain cleaning & unclogging\n• Pipe leak repairs\n• Toilet repairs & replacement\n• Faucet & fixture installation\n• Water heater service\n• Garbage disposal repair\n\n🚿 **Bathroom & Kitchen:**\n• Sink installations\n• Shower repairs\n• Dishwasher connections\n\n✅ **Licensed Plumber** | 💧 **24/7 Emergency** | 🛡️ **Parts & Labor Warranty**\n\nNeed plumbing help? Call (480) 255-5887!';
            }
            return '🏠 **Complete Handyman Services:**\n\n🔧 **Popular Services:**\n• ⚡ Electrical repairs & installations\n• 🔧 Plumbing fixes & maintenance\n• 🎨 Interior/exterior painting\n• 🔨 Drywall repair & installation\n• 🏠 Flooring installation & repair\n• ❄️ HVAC maintenance\n• 🛠️ General home repairs\n• 🚨 24/7 Emergency services\n\n**Why Choose Us:**\n✅ Licensed & Insured\n✅ 1-Year Warranty\n✅ Free Estimates\n✅ Same-Day Service Available\n\nWhat specific service do you need? Call (480) 255-5887!';
        }

        // Enhanced area coverage with more specific locations
        if (lowerMessage.includes('area') || lowerMessage.includes('location') || lowerMessage.includes('scottsdale') || 
            lowerMessage.includes('serve') || lowerMessage.includes('coverage')) {
            return '📍 **Scottsdale & Greater Phoenix Service Area:**\n\n🏠 **Primary Service Areas:**\n• Scottsdale (all zip codes)\n• Paradise Valley\n• Fountain Hills\n• Cave Creek\n• Carefree\n\n🌆 **Extended Coverage:**\n• Tempe • Mesa • Chandler\n• Glendale • Peoria • Ahwatukee\n• North Phoenix • Arcadia\n\n⏱️ **Response Times:**\n• Scottsdale: 30-60 minutes\n• Extended areas: 1-2 hours\n• Emergency: Always within 1 hour\n\n📞 Serving your area! Call (480) 255-5887';
        }

        // Enhanced contact with multiple options
        if (lowerMessage.includes('contact') || lowerMessage.includes('phone') || lowerMessage.includes('call') || lowerMessage.includes('reach')) {
            return '📞 **Contact Scottsdale Handyman Solutions:**\n\n**Primary Contact:**\n• 📱 Phone: (480) 255-5887\n• 📧 Email: help.scottsdalehandyman@gmail.com\n• 💬 Text: (480) 255-5887\n\n**Business Hours:**\n• Mon-Sat: 7:00 AM - 6:00 PM\n• Sunday: Emergency calls only\n• 🚨 24/7 Emergency Response\n\n**Quick Actions:**\n🎯 Get instant quote\n📅 Schedule service\n💬 Continue chatting here\n\nPrefer to call? (480) 255-5887 - We\'re standing by!';
        }

        // Enhanced scheduling with specific time options
        if (lowerMessage.includes('time') || lowerMessage.includes('schedule') || lowerMessage.includes('when') || 
            lowerMessage.includes('appointment') || lowerMessage.includes('available')) {
            return '📅 **Flexible Scheduling Options:**\n\n**Same-Day Service:**\n• Morning slots: 8:00 AM - 12:00 PM\n• Afternoon slots: 1:00 PM - 5:00 PM\n• Evening slots: 5:00 PM - 8:00 PM\n\n**Scheduling Options:**\n• 📱 Call: (480) 255-5887\n• 💬 Text your preferred time\n• 🌐 Online booking form\n• 💬 Continue here in chat\n\n⚡ **Priority Service:**\n• Emergency: Within 1 hour\n• Urgent: Within 4 hours\n• Standard: Next business day\n• Weekend: Available Sat-Sun\n\nWhen works best for you?';
        }

        // Enhanced greeting with service options
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey') || 
            lowerMessage.includes('good morning') || lowerMessage.includes('good afternoon')) {
            return '👋 **Welcome to Scottsdale Handyman Solutions!**\n\n🏠 I\'m your AI assistant, ready to help with:\n\n🔧 **Quick Help:**\n• Get service pricing\n• Schedule appointments\n• Emergency support\n• Service area info\n\n🎯 **Popular Services:**\n• Electrical repairs\n• Plumbing fixes\n• Painting projects\n• Home repairs\n\n**What can I help you with today?**\n💬 Ask me anything or call (480) 255-5887!';
        }

        // Enhanced thank you with call-to-action
        if (lowerMessage.includes('thank') || lowerMessage.includes('thanks') || lowerMessage.includes('appreciate')) {
            return '😊 **You\'re very welcome!**\n\n🌟 **Ready to get started?**\n• 📞 Call us: (480) 255-5887\n• 📱 Text us your project details\n• 🎯 Click "Get Quote" for instant estimate\n• 💬 Keep chatting here for more help\n\n**Remember:**\n✅ Free estimates always\n✅ Licensed & insured\n✅ 1-year warranty\n✅ 24/7 emergency service\n\n**Anything else I can help with?**';
        }

        // Enhanced warranty and guarantee information
        if (lowerMessage.includes('warranty') || lowerMessage.includes('guarantee') || lowerMessage.includes('insurance') || lowerMessage.includes('licensed')) {
            return '🛡️ **Your Peace of Mind Guarantee:**\n\n**Warranties:**\n• 1-year warranty on all work\n• Manufacturer warranties on parts\n• Extended warranties available\n\n**Insurance & Licensing:**\n✅ Fully licensed handyman\n✅ General liability insurance\n✅ Bonded & insured\n✅ Workers compensation coverage\n\n**100% Satisfaction Guarantee:**\n• Work isn\'t right? We\'ll fix it free\n• Transparent pricing - no surprises\n• Professional, courteous service\n\nQuestions about our guarantees? Call (480) 255-5887!';
        }

        // Enhanced default response with quick actions
        return '🏠 **I\'m here to help with your home projects!**\n\n💬 **Ask me about:**\n• Service pricing & quotes\n• Scheduling appointments\n• Our service areas\n• Emergency services\n• Specific repairs\n\n🎯 **Quick Actions:**\n• 📞 Call: (480) 255-5887\n• 🎯 Get instant quote\n• 📅 Schedule service\n• 🚨 Emergency help\n\n**What would you like to know?** I\'m here to help make your project easy!';
    };

    const handleSendMessage = (message = chatInput) => {
        if (!message.trim()) return;

        // Add user message
        const userMessage = {
            sender: 'user',
            text: message.trim(),
            timestamp: new Date()
        };

        setChatMessages(prev => [...prev, userMessage]);
        setChatInput('');
        setChatTyping(true);

        // Generate bot response after a delay
        setTimeout(() => {
            const botResponse = {
                sender: 'bot',
                text: getBotResponse(message.trim()),
                timestamp: new Date()
            };

            setChatMessages(prev => [...prev, botResponse]);
            setChatTyping(false);
        }, 1000 + Math.random() * 1000);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (!chatInput.trim()) return;
        handleSendMessage();
    };

    // Enhanced tooltip management with auto-hide
    const handleTooltipEnter = () => {
        if (tooltipTimeoutRef.current) {
            clearTimeout(tooltipTimeoutRef.current);
        }
        setShowTooltip(true);
        setShouldPulse(false);
    };

    const handleTooltipLeave = () => {
        tooltipTimeoutRef.current = setTimeout(() => {
            setShowTooltip(false);
            setShouldPulse(true);
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

    // Show tooltip on page load (only when no unread messages)
    useEffect(() => {
        if (!chatOpen && !tooltipShownOnLoad && !hasUnreadMessages) {
            const timer = setTimeout(() => {
                setShowTooltip(true);
                setTooltipShownOnLoad(true);
                // Auto-hide after 4 seconds
                setTimeout(() => {
                    setShowTooltip(false);
                }, 4000);
            }, 2000); // Show 2 seconds after page load

            return () => clearTimeout(timer);
        }
    }, [chatOpen, tooltipShownOnLoad, hasUnreadMessages]);

    // Show tooltip on scroll (only when no unread messages)
    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            const windowHeight = window.innerHeight;
            
            // Show tooltip when user scrolls past 50% of viewport height (only if no unread messages)
            if (scrollPosition > windowHeight * 0.5 && !tooltipShownOnScroll && !showTooltip && !chatOpen && !hasUnreadMessages) {
                setShowTooltip(true);
                setTooltipShownOnScroll(true);
                // Auto-hide after 3 seconds
                setTimeout(() => {
                    setShowTooltip(false);
                }, 3000);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [showTooltip, tooltipShownOnScroll, chatOpen, hasUnreadMessages]);

    // Track unread messages - only for proactive messages sent while chat is closed
    useEffect(() => {
        if (chatOpen) {
            // Clear unread status when chat is open
            setHasUnreadMessages(false);
            setShouldPulse(false);
        }
        // Note: We don't set unread messages when closing chat after normal conversation
        // Only proactive/push messages should trigger unread state
    }, [chatOpen]);

    return (
        <>
            {/* Chat Button */}
            {!chatOpen && (
                <>
                    {/* Tooltip - only show when no unread messages */}
                    {showTooltip && !hasUnreadMessages && (
                        <div
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
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                ...(window.innerWidth <= 640 && {
                                    right: '16px',
                                    left: '16px',
                                    maxWidth: 'none',
                                    minWidth: 'auto',
                                    bottom: '88px'
                                })
                            }}
                            onMouseEnter={handleTooltipEnter}
                            onMouseLeave={handleTooltipLeave}
                        >
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                marginBottom: '10px',
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
                                <span>💬 Hi! I'm here to help with handyman needs</span>
                            </div>

                            <div style={{
                                fontSize: '11px',
                                color: '#d1d5db',
                                marginBottom: '12px',
                                lineHeight: '1.3'
                            }}>
                                Get instant help or quick action below:
                            </div>

                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '6px'
                            }}>
                                <button
                                    onClick={() => window.open('tel:+14802555887', '_self')}
                                    style={{
                                        backgroundColor: '#ff4444',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        padding: '8px 10px',
                                        fontSize: '10px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '4px',
                                        minHeight: '32px'
                                    }}
                                >
                                    <Phone size={12} />
                                    <span>Emergency</span>
                                </button>

                                <button
                                    onClick={() => setChatOpen(true)}
                                    style={{
                                        backgroundColor: '#059669',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        padding: '8px 10px',
                                        fontSize: '10px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '4px',
                                        minHeight: '32px'
                                    }}
                                >
                                    <Zap size={12} />
                                    <span>Free Quote</span>
                                </button>
                            </div>

                            {/* Arrow */}
                            <div style={{
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
                            }} />
                        </div>
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
                        }}
                        onMouseOut={(e) => {
                            e.target.style.transform = 'scale(1) translateY(0)';
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
                <div style={{
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
                }}>
                    {/* Header */}
                    <div style={{
                        background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                        color: 'white',
                        padding: isMinimized ? '10px 20px' : '16px 20px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderRadius: isMinimized ? '16px' : '16px 16px 0 0',
                        minHeight: isMinimized ? '40px' : 'auto'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                                width: isMinimized ? '32px' : '40px',
                                height: isMinimized ? '32px' : '40px',
                                borderRadius: '50%',
                                backgroundColor: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '2px solid #3b82f6',
                                boxShadow: '0 2px 8px rgba(59, 130, 246, 0.2)'
                            }}>
                                <Bot size={isMinimized ? 16 : 20} style={{ color: '#3b82f6' }} />
                            </div>
                            <div>
                                <div style={{ 
                                    fontWeight: '600', 
                                    fontSize: isMinimized ? '14px' : '16px' 
                                }}>The Scottsdale Handyman</div>
                                {!isMinimized && (
                                    <div style={{ fontSize: '12px', opacity: 0.9, color: '#FFD700' }}>
                                        {chatTyping ? 'Typing...' : 'Online • Ready to Help'}
                                    </div>
                                )}
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
                            {/* Messages */}
                            <div style={{
                                flex: 1,
                                overflowY: 'auto',
                                padding: '20px',
                                background: '#f8fafc',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '16px',
                                minHeight: '400px',
                                maxHeight: window.innerWidth <= 768 ? 'calc(100vh - 220px)' : '400px'
                            }}>
                                {/* Quick Actions */}
                                {chatMessages.length <= 1 && (
                                    <div style={{ marginBottom: '16px' }}>
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: '1fr 1fr',
                                            gap: '8px'
                                        }}>
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
                                            <div style={{
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
                                            }}>
                                                <Bot size={16} color="#3b82f6" />
                                            </div>
                                        )}

                                        <div style={{
                                            maxWidth: '75%',
                                            padding: '12px 16px',
                                            borderRadius: msg.sender === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                                            background: msg.sender === 'user'
                                                ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
                                                : 'white',
                                            color: msg.sender === 'user' ? 'white' : '#374151',
                                            fontSize: '14px',
                                            lineHeight: '1.5',
                                            whiteSpace: 'pre-wrap',
                                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                            border: msg.sender === 'bot' ? '1px solid #e5e7eb' : 'none'
                                        }}>
                                            {msg.text}
                                            {msg.isWelcome && (
                                                <>
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
                                                            onClick={() => handleSendMessage('I would like to get a quote')}
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
                                                    
                                                    {/* Suggested Questions */}
                                                    <div style={{
                                                        marginTop: '12px',
                                                        paddingTop: '8px',
                                                        borderTop: '1px dashed #e5e7eb'
                                                    }}>
                                                        <div style={{
                                                            fontSize: '11px',
                                                            color: '#6b7280',
                                                            marginBottom: '8px',
                                                            textAlign: 'center'
                                                        }}>
                                                            ⚡ Quick Questions:
                                                        </div>
                                                        <div style={{
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            gap: '6px'
                                                        }}>
                                                            <button
                                                                onClick={() => handleSendMessage('What electrical services do you offer?')}
                                                                style={{
                                                                    background: 'transparent',
                                                                    color: '#3b82f6',
                                                                    border: '1px solid #e5e7eb',
                                                                    borderRadius: '4px',
                                                                    padding: '6px 8px',
                                                                    fontSize: '11px',
                                                                    cursor: 'pointer',
                                                                    textAlign: 'left',
                                                                    transition: 'all 0.2s ease'
                                                                }}
                                                                onMouseOver={(e) => {
                                                                    e.target.style.background = '#f8fafc';
                                                                    e.target.style.borderColor = '#3b82f6';
                                                                }}
                                                                onMouseOut={(e) => {
                                                                    e.target.style.background = 'transparent';
                                                                    e.target.style.borderColor = '#e5e7eb';
                                                                }}
                                                            >
                                                                ⚡ What electrical services do you offer?
                                                            </button>
                                                            <button
                                                                onClick={() => handleSendMessage('Do you provide plumbing services?')}
                                                                style={{
                                                                    background: 'transparent',
                                                                    color: '#3b82f6',
                                                                    border: '1px solid #e5e7eb',
                                                                    borderRadius: '4px',
                                                                    padding: '6px 8px',
                                                                    fontSize: '11px',
                                                                    cursor: 'pointer',
                                                                    textAlign: 'left',
                                                                    transition: 'all 0.2s ease'
                                                                }}
                                                                onMouseOver={(e) => {
                                                                    e.target.style.background = '#f8fafc';
                                                                    e.target.style.borderColor = '#3b82f6';
                                                                }}
                                                                onMouseOut={(e) => {
                                                                    e.target.style.background = 'transparent';
                                                                    e.target.style.borderColor = '#e5e7eb';
                                                                }}
                                                            >
                                                                🔧 Do you provide plumbing services?
                                                            </button>
                                                            <button
                                                                onClick={() => handleSendMessage('What areas do you serve?')}
                                                                style={{
                                                                    background: 'transparent',
                                                                    color: '#3b82f6',
                                                                    border: '1px solid #e5e7eb',
                                                                    borderRadius: '4px',
                                                                    padding: '6px 8px',
                                                                    fontSize: '11px',
                                                                    cursor: 'pointer',
                                                                    textAlign: 'left',
                                                                    transition: 'all 0.2s ease'
                                                                }}
                                                                onMouseOver={(e) => {
                                                                    e.target.style.background = '#f8fafc';
                                                                    e.target.style.borderColor = '#3b82f6';
                                                                }}
                                                                onMouseOut={(e) => {
                                                                    e.target.style.background = 'transparent';
                                                                    e.target.style.borderColor = '#e5e7eb';
                                                                }}
                                                            >
                                                                📍 What areas do you serve?
                                                            </button>
                                                            <button
                                                                onClick={() => handleSendMessage('How much do your services cost?')}
                                                                style={{
                                                                    background: 'transparent',
                                                                    color: '#3b82f6',
                                                                    border: '1px solid #e5e7eb',
                                                                    borderRadius: '4px',
                                                                    padding: '6px 8px',
                                                                    fontSize: '11px',
                                                                    cursor: 'pointer',
                                                                    textAlign: 'left',
                                                                    transition: 'all 0.2s ease'
                                                                }}
                                                                onMouseOver={(e) => {
                                                                    e.target.style.background = '#f8fafc';
                                                                    e.target.style.borderColor = '#3b82f6';
                                                                }}
                                                                onMouseOut={(e) => {
                                                                    e.target.style.background = 'transparent';
                                                                    e.target.style.borderColor = '#e5e7eb';
                                                                }}
                                                            >
                                                                💰 How much do your services cost?
                                                            </button>
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                        {msg.sender === 'user' && (
                                            <div style={{
                                                width: '32px',
                                                height: '32px',
                                                borderRadius: '50%',
                                                background: '#6b7280',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                flexShrink: 0
                                            }}>
                                                <User size={16} color="white" />
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {/* Typing Indicator */}
                                {chatTyping && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '50%',
                                            background: 'white',
                                            border: '2px solid #3b82f6',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: '0 2px 8px rgba(59, 130, 246, 0.2)'
                                        }}>
                                            <Bot size={16} color="#3b82f6" />
                                        </div>
                                        <div style={{
                                            background: 'white',
                                            padding: '12px 16px',
                                            borderRadius: '16px 16px 16px 4px',
                                            border: '1px solid #e5e7eb',
                                            display: 'flex',
                                            gap: '4px'
                                        }}>
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
                            <div style={{
                                padding: '16px 20px',
                                borderTop: '1px solid #e5e7eb',
                                background: 'white',
                                borderRadius: '0 0 16px 16px'
                            }}>
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
                                                ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
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

                                {/* Quick Action Buttons */}
                                <div style={{
                                    display: 'flex',
                                    gap: '8px',
                                    marginTop: '12px',
                                    flexWrap: 'wrap'
                                }}>
                                    <button
                                        onClick={() => handleSendMessage('I need emergency service')}
                                        style={{
                                            padding: '6px 12px',
                                            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '20px',
                                            fontSize: '12px',
                                            fontWeight: '500',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px'
                                        }}
                                        onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                                        onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                                    >
                                        🚨 Emergency
                                    </button>
                                    <button
                                        onClick={() => handleSendMessage('I need a quote')}
                                        style={{
                                            padding: '6px 12px',
                                            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '20px',
                                            fontSize: '12px',
                                            fontWeight: '500',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease'
                                        }}
                                        onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                                        onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                                    >
                                        💰 Get Quote
                                    </button>
                                    <button
                                        onClick={() => handleSendMessage('I want to schedule service')}
                                        style={{
                                            padding: '6px 12px',
                                            background: 'linear-gradient(135deg, #10b981, #059669)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '20px',
                                            fontSize: '12px',
                                            fontWeight: '500',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease'
                                        }}
                                        onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                                        onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                                    >
                                        📅 Schedule
                                    </button>
                                </div>

                                <div style={{
                                    textAlign: 'center',
                                    fontSize: '11px',
                                    color: '#9ca3af',
                                    marginTop: '12px'
                                }}>
                                    Available 24/7 • (480) 255-5887
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
