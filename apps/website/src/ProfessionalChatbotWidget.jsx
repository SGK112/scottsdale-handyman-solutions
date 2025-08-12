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
    Zap,
    Mic,
    MessageSquare,
    Settings
} from 'lucide-react';
import VoiceChatAPI from './VoiceChatAPI';

const ProfessionalChatbotWidget = () => {
    const [chatOpen, setChatOpen] = useState(false);
    const [chatMode, setChatMode] = useState('choice'); // 'choice', 'text', 'voice'
    const [chatMessages, setChatMessages] = useState([]);
    const [chatInput, setChatInput] = useState('');
    const [chatTyping, setChatTyping] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    
    // ElevenLabs states
    const [elevenlabsLoaded, setElevenlabsLoaded] = useState(false);
    
    // Professional UI states
    const [showTooltip, setShowTooltip] = useState(false);
    const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
    const [shouldPulse, setShouldPulse] = useState(true);
    const [httpsWarning, setHttpsWarning] = useState(false);
    
    // Check HTTPS requirement for voice chat
    useEffect(() => {
        if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
            setHttpsWarning(true);
            console.warn('⚠️ Voice chat requires HTTPS in production');
        }
    }, []);
    
    // Smart form states
    const [showQuickForm, setShowQuickForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        service: '',
        urgency: 'standard',
        description: ''
    });
    
    const messagesEndRef = useRef(null);
    const tooltipTimeoutRef = useRef(null);

    // Load and initialize ElevenLabs ConvAI widget
    useEffect(() => {
        let attempts = 0;
        const maxAttempts = 20; // 10 seconds total
        
        const initializeElevenLabs = () => {
            attempts++;
            
            // Debug what's available
            console.log(`🔍 ElevenLabs check attempt ${attempts}:`, {
                windowElevenLabs: !!window.ElevenLabs,
                windowConvAI: !!(window.ElevenLabs && window.ElevenLabs.ConvAI),
                customElementDefined: !!window.customElements?.get('elevenlabs-convai'),
                scriptPresent: !!document.querySelector('script[src*="elevenlabs"]')
            });
            
            // Check multiple ways the ElevenLabs widget might be available
            const isElevenLabsReady = (
                (window.ElevenLabs && window.ElevenLabs.ConvAI) ||
                window.customElements?.get('elevenlabs-convai') ||
                document.querySelector('elevenlabs-convai')
            );
            
            if (isElevenLabsReady) {
                setElevenlabsLoaded(true);
                console.log('✅ ElevenLabs ConvAI loaded successfully');
                return;
            }
            
            // Continue trying if we haven't exceeded max attempts
            if (attempts < maxAttempts) {
                setTimeout(initializeElevenLabs, 500);
            } else {
                console.warn('⚠️ ElevenLabs ConvAI failed to load after 10 seconds');
                // Set as loaded anyway to show the widget
                setElevenlabsLoaded(true);
            }
        };

        // Start checking after a short delay
        setTimeout(initializeElevenLabs, 100);
    }, []);

    // Chat mode handlers
    const handleModeSelection = (mode) => {
        setChatMode(mode);
        
        if (mode === 'text') {
            // Initialize text chat with welcome message
            const welcomeMessage = {
                sender: 'bot',
                text: '🏠 **Welcome to Scottsdale Handyman Solutions!**\n\nI\'m your professional AI assistant ready to help with:\n• 🔧 Service information & pricing\n• 📅 Scheduling appointments\n• 🚨 Emergency support\n• 📍 Service area questions\n• 💰 Free quotes & estimates\n\n**How can I assist you today?**',
                timestamp: new Date(),
                isWelcome: true
            };
            setChatMessages([welcomeMessage]);
        }
    };

    // Auto-scroll to bottom when new messages are added
    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'end'
            });
        }, 100);
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatMessages, chatTyping]);

    // Generate bot responses
    const getBotResponse = (message) => {
        const lowerMessage = message.toLowerCase();

        // Emergency detection
        if (lowerMessage.includes('emergency') || lowerMessage.includes('urgent')) {
            return '🚨 **EMERGENCY RESPONSE ACTIVATED**\n\n📞 **CALL NOW: (480) 255-5887**\n\nFor immediate emergencies:\n• Electrical fires: Call 911 first!\n• Gas leaks: Evacuate & call gas company\n• Major flooding: Shut off main water valve\n\n⚡ Our emergency team responds within 1 hour, 24/7!';
        }

        // Pricing information
        if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('quote')) {
            return '💰 **Transparent Pricing - No Hidden Fees!**\n\n**Popular Services:**\n• Basic repairs: $75-$150/hour\n• Installation work: $100-$300\n• Emergency calls: $125 service fee\n• Multi-service discount: 15% off\n\n📋 **Every estimate includes:**\n✓ Detailed scope of work\n✓ Material costs breakdown\n✓ Timeline expectations\n✓ 100% satisfaction guarantee\n\n🎯 **Get Your FREE Quote:** Call (480) 255-5887!';
        }

        // Service information
        if (lowerMessage.includes('service') || lowerMessage.includes('repair')) {
            return '🏠 **Complete Handyman Services:**\n\n🔧 **Popular Services:**\n• ⚡ Electrical repairs & installations\n• 🔧 Plumbing fixes & maintenance\n• 🎨 Interior/exterior painting\n• 🔨 Drywall repair & installation\n• 🏠 Flooring installation & repair\n• ❄️ HVAC maintenance\n• 🛠️ General home repairs\n• 🚨 24/7 Emergency services\n\n**Why Choose Us:**\n✅ Licensed & Insured\n✅ 1-Year Warranty\n✅ Free Estimates\n✅ Same-Day Service Available\n\nCall (480) 255-5887!';
        }

        // Contact information
        if (lowerMessage.includes('contact') || lowerMessage.includes('phone')) {
            return '📞 **Contact Scottsdale Handyman Solutions:**\n\n**Primary Contact:**\n• 📱 Phone: (480) 255-5887\n• 📧 Email: help.scottsdalehandyman@gmail.com\n\n**Business Hours:**\n• Mon-Sat: 7:00 AM - 6:00 PM\n• Sunday: Emergency calls only\n• 🚨 24/7 Emergency Response\n\nReady to help! Call (480) 255-5887';
        }

        // Default response
        return '🏠 **I\'m here to help with your home projects!**\n\n💬 **Ask me about:**\n• Service pricing & quotes\n• Scheduling appointments\n• Our service areas\n• Emergency services\n• Specific repairs\n\n🎯 **Quick Actions:**\n• 📞 Call: (480) 255-5887\n• 🎯 Get instant quote\n• 📅 Schedule service\n• 🚨 Emergency help\n\n**What would you like to know?**';
    };

    // Enhanced message handler
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

        // Generate bot response
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

    // Smart form handler
    const handleQuickFormSubmit = (e) => {
        e.preventDefault();
        
        const formMessage = `📋 **Service Request Submitted**\n\n**Name:** ${formData.name}\n**Phone:** ${formData.phone}\n**Service:** ${formData.service}\n**Urgency:** ${formData.urgency}\n**Details:** ${formData.description}`;
        
        const userMessage = {
            sender: 'user',
            text: formMessage,
            timestamp: new Date(),
            isForm: true
        };
        
        setChatMessages(prev => [...prev, userMessage]);
        setShowQuickForm(false);
        
        setTimeout(() => {
            let response = '✅ **Service Request Received!**\n\n';
            
            if (formData.urgency === 'emergency') {
                response += '🚨 **EMERGENCY RESPONSE ACTIVATED**\n\nOur emergency team is being dispatched! Call (480) 255-5887 NOW.\n\n';
            } else if (formData.urgency === 'urgent') {
                response += '⚡ **Priority Service Request**\n\nWe\'ll contact you within 1 hour for same-day service.\n\n';
            } else {
                response += '📅 **Standard Service Request**\n\nWe\'ll contact you within 4 hours to schedule.\n\n';
            }
            
            response += `**Next Steps:**\n• Expect our call at ${formData.phone}\n• Free estimate provided\n• Licensed & insured service\n• 1-year warranty included\n\n**Questions?** Call (480) 255-5887`;
            
            const botResponse = {
                sender: 'bot',
                text: response,
                timestamp: new Date()
            };
            
            setChatMessages(prev => [...prev, botResponse]);
        }, 1000);
        
        setFormData({
            name: '',
            phone: '',
            service: '',
            urgency: 'standard',
            description: ''
        });
    };

    // Professional mode selection component
    const renderModeSelection = () => (
        <div style={{
            padding: '32px 24px',
            textAlign: 'center',
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
        }}>
            <div style={{ marginBottom: '24px' }}>
                <h3 style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#1e293b',
                    marginBottom: '8px'
                }}>
                    Welcome to Scottsdale Handyman Solutions
                </h3>
                <p style={{
                    fontSize: '14px',
                    color: '#64748b',
                    lineHeight: '1.5'
                }}>
                    Choose how you'd like to get assistance today
                </p>
            </div>

            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
            }}>
                {/* Voice Chat Option */}
                <button
                    onClick={() => handleModeSelection('voice')}
                    style={{
                        background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '16px 20px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                    }}
                >
                    <Mic size={16} />
                    <div style={{ textAlign: 'left' }}>
                        <div style={{ fontWeight: 'bold' }}>Voice Chat</div>
                        <div style={{ fontSize: '12px', opacity: 0.9 }}>
                            Speak naturally with our AI assistant
                        </div>
                    </div>
                </button>

                {/* Text Chat Option */}
                <button
                    onClick={() => handleModeSelection('text')}
                    style={{
                        background: 'white',
                        color: '#1e293b',
                        border: '2px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '16px 20px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                    }}
                >
                    <MessageSquare size={16} />
                    <div style={{ textAlign: 'left' }}>
                        <div style={{ fontWeight: 'bold' }}>Text Chat</div>
                        <div style={{ fontSize: '12px', opacity: 0.7 }}>
                            Type your questions and get instant answers
                        </div>
                    </div>
                </button>

                {/* Quick Actions */}
                <div style={{
                    marginTop: '16px',
                    paddingTop: '16px',
                    borderTop: '1px solid #e2e8f0'
                }}>
                    <p style={{
                        fontSize: '12px',
                        color: '#64748b',
                        marginBottom: '12px'
                    }}>
                        Need immediate help?
                    </p>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                            onClick={() => window.location.href = 'tel:+14802555887'}
                            style={{
                                flex: 1,
                                background: '#10b981',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '8px 12px',
                                fontSize: '12px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '4px'
                            }}
                        >
                            <Phone size={12} />
                            Call Now
                        </button>
                        <button
                            onClick={() => {
                                setShowQuickForm(true);
                                setChatMode('text');
                            }}
                            style={{
                                flex: 1,
                                background: '#f59e0b',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '8px 12px',
                                fontSize: '12px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '4px'
                            }}
                        >
                            <Zap size={12} />
                            Quick Form
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    // Render ElevenLabs voice widget
    const renderVoiceWidget = () => (
        <VoiceChatAPI 
            onTextMessage={(message) => {
                // When voice chat generates text, add it to our text chat
                const userMessage = {
                    sender: 'user',
                    text: message,
                    timestamp: new Date(),
                    isVoice: true
                };
                setChatMessages(prev => [...prev, userMessage]);
                
                // Generate and add bot response
                setTimeout(() => {
                    const botResponse = {
                        sender: 'bot',
                        text: getBotResponse(message),
                        timestamp: new Date()
                    };
                    setChatMessages(prev => [...prev, botResponse]);
                }, 1000);
            }}
            onModeSwitch={() => setChatMode('choice')}
        />
    );

    // Tooltip management
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
        }, 500);
    };

    // Initialize chatbot to show tooltip after delay
    useEffect(() => {
        const timer = setTimeout(() => {
            if (!chatOpen && !hasUnreadMessages) {
                setShowTooltip(true);
                setShouldPulse(false);
            }
        }, 3000);

        return () => clearTimeout(timer);
    }, [chatOpen, hasUnreadMessages]);

    return (
        <>
            {/* Chat Button */}
            {!chatOpen && (
                <>
                    {/* Tooltip */}
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
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                ...(window.innerWidth <= 640 && {
                                    right: '16px',
                                    left: '16px',
                                    maxWidth: 'none',
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
                                marginBottom: '10px'
                            }}>
                                <div style={{
                                    backgroundColor: 'white',
                                    borderRadius: '50%',
                                    padding: '4px',
                                    display: 'flex'
                                }}>
                                    <Bot size={14} style={{ color: '#3b82f6' }} />
                                </div>
                                <span>Professional AI Assistant</span>
                            </div>
                            <div style={{
                                fontSize: '12px',
                                opacity: 0.9,
                                lineHeight: '1.4'
                            }}>
                                ✨ <strong>NEW:</strong> Voice & Text Chat Available<br />
                                Get instant quotes, schedule service, or emergency help!
                            </div>
                        </div>
                    )}

                    {/* Chat Button */}
                    <button
                        onClick={() => setChatOpen(true)}
                        style={{
                            position: 'fixed',
                            bottom: '24px',
                            right: '24px',
                            width: '64px',
                            height: '64px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 8px 32px rgba(59, 130, 246, 0.4)',
                            zIndex: 99999,
                            transition: 'all 0.3s ease',
                            animation: shouldPulse ? 'pulse 2s infinite' : 'none'
                        }}
                        onMouseOver={(e) => {
                            e.target.style.transform = 'scale(1.05) translateY(-2px)';
                        }}
                        onMouseOut={(e) => {
                            e.target.style.transform = 'scale(1) translateY(0)';
                        }}
                    >
                        <MessageCircle size={28} color="white" />
                        {/* Professional "NEW" badge */}
                        <div style={{
                            position: 'absolute',
                            top: '-8px',
                            right: '-8px',
                            background: 'linear-gradient(135deg, #10b981, #059669)',
                            color: 'white',
                            fontSize: '8px',
                            fontWeight: 'bold',
                            padding: '2px 4px',
                            borderRadius: '6px',
                            border: '1px solid white',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                            animation: 'pulse 2s infinite'
                        }}>
                            ✨ PRO
                        </div>
                    </button>
                </>
            )}

            {/* Professional Chat Window */}
            {chatOpen && (
                <div style={{
                    position: 'fixed',
                    bottom: '24px',
                    right: '24px',
                    width: window.innerWidth <= 768 ? 'calc(100vw - 32px)' : '420px',
                    height: window.innerWidth <= 768 ? 'calc(100vh - 100px)' : isMinimized ? '60px' : '640px',
                    maxHeight: '85vh',
                    background: 'white',
                    borderRadius: '20px',
                    boxShadow: '0 25px 80px rgba(0, 0, 0, 0.2)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    zIndex: 99999,
                    animation: 'slideUp 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                    border: '1px solid #e2e8f0',
                    ...(window.innerWidth <= 768 && {
                        left: '16px',
                        right: '16px',
                        width: 'calc(100vw - 32px)',
                        height: 'calc(100vh - 100px)'
                    })
                }}>
                    {/* Professional Header */}
                    <div style={{
                        background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                        color: 'white',
                        padding: isMinimized ? '12px 20px' : '20px 20px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderRadius: isMinimized ? '20px' : '20px 20px 0 0',
                        minHeight: isMinimized ? '44px' : 'auto'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                                width: isMinimized ? '32px' : '44px',
                                height: isMinimized ? '32px' : '44px',
                                borderRadius: '12px',
                                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                            }}>
                                <Bot size={isMinimized ? 16 : 20} style={{ color: 'white' }} />
                            </div>
                            <div>
                                <h4 style={{
                                    margin: 0,
                                    fontSize: isMinimized ? '14px' : '16px',
                                    fontWeight: '700',
                                    lineHeight: '1.2'
                                }}>
                                    Scottsdale Handyman Solutions
                                </h4>
                                {!isMinimized && (
                                    <p style={{
                                        margin: 0,
                                        fontSize: '13px',
                                        opacity: 0.9,
                                        fontWeight: '500'
                                    }}>
                                        {chatMode === 'voice' ? '🎤 Voice Chat Active' : 
                                         chatMode === 'text' ? '💬 Text Chat Active' : 
                                         '🏠 Professional AI Assistant'}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {!isMinimized && chatMode !== 'choice' && (
                                <button
                                    onClick={() => setChatMode('choice')}
                                    style={{
                                        background: 'rgba(255,255,255,0.15)',
                                        border: 'none',
                                        borderRadius: '8px',
                                        padding: '6px 10px',
                                        color: 'white',
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        transition: 'background 0.2s ease',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px'
                                    }}
                                >
                                    <Settings size={12} />
                                    Switch
                                </button>
                            )}
                            <button
                                onClick={() => setIsMinimized(!isMinimized)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'white',
                                    cursor: 'pointer',
                                    padding: '6px',
                                    borderRadius: '6px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    transition: 'background 0.2s ease'
                                }}
                            >
                                {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                            </button>
                            <button
                                onClick={() => setChatOpen(false)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'white',
                                    cursor: 'pointer',
                                    padding: '6px',
                                    borderRadius: '6px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    transition: 'background 0.2s ease'
                                }}
                            >
                                <X size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Content Area */}
                    {!isMinimized && (
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                            {chatMode === 'choice' && renderModeSelection()}
                            {chatMode === 'voice' && renderVoiceWidget()}
                            {chatMode === 'text' && (
                                <>
                                    {/* Text Chat Messages */}
                                    <div style={{
                                        flex: 1,
                                        overflowY: 'auto',
                                        padding: '20px',
                                        background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)'
                                    }}>
                                        {chatMessages.map((message, index) => (
                                            <div
                                                key={index}
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                                                    marginBottom: '16px',
                                                    animation: 'messageSlide 0.3s ease-out'
                                                }}
                                            >
                                                <div style={{ maxWidth: '85%' }}>
                                                    <div style={{
                                                        background: message.sender === 'user' 
                                                            ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
                                                            : 'white',
                                                        color: message.sender === 'user' ? 'white' : '#1e293b',
                                                        padding: '12px 16px',
                                                        borderRadius: message.sender === 'user' 
                                                            ? '18px 18px 6px 18px'
                                                            : '18px 18px 18px 6px',
                                                        fontSize: '14px',
                                                        lineHeight: '1.5',
                                                        boxShadow: message.sender === 'user'
                                                            ? '0 4px 12px rgba(59, 130, 246, 0.3)'
                                                            : '0 2px 8px rgba(0, 0, 0, 0.1)',
                                                        border: message.sender === 'bot' ? '1px solid #e2e8f0' : 'none',
                                                        whiteSpace: 'pre-wrap',
                                                        wordBreak: 'break-word'
                                                    }}>
                                                        {message.text}
                                                    </div>
                                                    <div style={{
                                                        fontSize: '11px',
                                                        color: '#64748b',
                                                        marginTop: '4px',
                                                        textAlign: message.sender === 'user' ? 'right' : 'left',
                                                        paddingLeft: message.sender === 'bot' ? '16px' : '0',
                                                        paddingRight: message.sender === 'user' ? '16px' : '0'
                                                    }}>
                                                        {message.timestamp.toLocaleTimeString([], { 
                                                            hour: '2-digit', 
                                                            minute: '2-digit' 
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        
                                        {chatTyping && (
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'flex-start',
                                                marginBottom: '16px'
                                            }}>
                                                <div style={{
                                                    background: 'white',
                                                    padding: '12px 16px',
                                                    borderRadius: '18px 18px 18px 6px',
                                                    border: '1px solid #e2e8f0',
                                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                                                }}>
                                                    <div style={{
                                                        display: 'flex',
                                                        gap: '4px',
                                                        alignItems: 'center'
                                                    }}>
                                                        <div style={{
                                                            width: '6px',
                                                            height: '6px',
                                                            borderRadius: '50%',
                                                            background: '#64748b',
                                                            animation: 'typing 1.4s infinite ease-in-out'
                                                        }}></div>
                                                        <div style={{
                                                            width: '6px',
                                                            height: '6px',
                                                            borderRadius: '50%',
                                                            background: '#64748b',
                                                            animation: 'typing 1.4s infinite ease-in-out 0.2s'
                                                        }}></div>
                                                        <div style={{
                                                            width: '6px',
                                                            height: '6px',
                                                            borderRadius: '50%',
                                                            background: '#64748b',
                                                            animation: 'typing 1.4s infinite ease-in-out 0.4s'
                                                        }}></div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        
                                        <div ref={messagesEndRef} />
                                    </div>

                                    {/* Text Input */}
                                    <div style={{
                                        padding: '16px 20px',
                                        background: 'white',
                                        borderTop: '1px solid #e2e8f0'
                                    }}>
                                        <form onSubmit={handleFormSubmit} style={{ display: 'flex', gap: '8px' }}>
                                            <input
                                                type="text"
                                                value={chatInput}
                                                onChange={(e) => setChatInput(e.target.value)}
                                                placeholder="Type your message..."
                                                style={{
                                                    flex: 1,
                                                    padding: '12px 16px',
                                                    border: '2px solid #e2e8f0',
                                                    borderRadius: '12px',
                                                    fontSize: '14px',
                                                    outline: 'none',
                                                    transition: 'border-color 0.2s ease',
                                                    background: '#f8fafc'
                                                }}
                                                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                                            />
                                            <button
                                                type="submit"
                                                disabled={!chatInput.trim()}
                                                style={{
                                                    background: chatInput.trim() 
                                                        ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
                                                        : '#e2e8f0',
                                                    color: chatInput.trim() ? 'white' : '#9ca3af',
                                                    border: 'none',
                                                    borderRadius: '12px',
                                                    padding: '12px',
                                                    cursor: chatInput.trim() ? 'pointer' : 'not-allowed',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    transition: 'all 0.2s ease',
                                                    minWidth: '44px'
                                                }}
                                            >
                                                <Send size={16} />
                                            </button>
                                        </form>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Quick Form Modal */}
            {showQuickForm && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 100000,
                    padding: '20px'
                }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '16px',
                        padding: '24px',
                        width: '100%',
                        maxWidth: '400px',
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
                    }}>
                        <h3 style={{
                            margin: '0 0 16px 0',
                            fontSize: '18px',
                            fontWeight: 'bold',
                            color: '#1e293b'
                        }}>
                            Quick Service Request
                        </h3>
                        <form onSubmit={handleQuickFormSubmit}>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{
                                    display: 'block',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    color: '#374151',
                                    marginBottom: '6px'
                                }}>
                                    Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    style={{
                                        width: '100%',
                                        padding: '10px 12px',
                                        border: '2px solid #e2e8f0',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        outline: 'none'
                                    }}
                                />
                            </div>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{
                                    display: 'block',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    color: '#374151',
                                    marginBottom: '6px'
                                }}>
                                    Phone *
                                </label>
                                <input
                                    type="tel"
                                    required
                                    value={formData.phone}
                                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                    style={{
                                        width: '100%',
                                        padding: '10px 12px',
                                        border: '2px solid #e2e8f0',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        outline: 'none'
                                    }}
                                />
                            </div>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{
                                    display: 'block',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    color: '#374151',
                                    marginBottom: '6px'
                                }}>
                                    Service Type *
                                </label>
                                <select
                                    required
                                    value={formData.service}
                                    onChange={(e) => setFormData(prev => ({ ...prev, service: e.target.value }))}
                                    style={{
                                        width: '100%',
                                        padding: '10px 12px',
                                        border: '2px solid #e2e8f0',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        outline: 'none'
                                    }}
                                >
                                    <option value="">Select a service</option>
                                    <option value="Electrical Repair">Electrical Repair</option>
                                    <option value="Plumbing Repair">Plumbing Repair</option>
                                    <option value="General Handyman">General Handyman</option>
                                    <option value="Emergency Repair">Emergency Repair</option>
                                    <option value="Home Maintenance">Home Maintenance</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{
                                    display: 'block',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    color: '#374151',
                                    marginBottom: '6px'
                                }}>
                                    Urgency Level
                                </label>
                                <select
                                    value={formData.urgency}
                                    onChange={(e) => setFormData(prev => ({ ...prev, urgency: e.target.value }))}
                                    style={{
                                        width: '100%',
                                        padding: '10px 12px',
                                        border: '2px solid #e2e8f0',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        outline: 'none'
                                    }}
                                >
                                    <option value="standard">Standard (next business day)</option>
                                    <option value="urgent">Urgent (same day)</option>
                                    <option value="emergency">Emergency (immediate)</option>
                                </select>
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{
                                    display: 'block',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    color: '#374151',
                                    marginBottom: '6px'
                                }}>
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="Describe your service need..."
                                    rows={3}
                                    style={{
                                        width: '100%',
                                        padding: '10px 12px',
                                        border: '2px solid #e2e8f0',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        outline: 'none',
                                        resize: 'vertical'
                                    }}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button
                                    type="button"
                                    onClick={() => setShowQuickForm(false)}
                                    style={{
                                        flex: 1,
                                        padding: '12px',
                                        border: '2px solid #e2e8f0',
                                        borderRadius: '8px',
                                        background: 'white',
                                        color: '#64748b',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    style={{
                                        flex: 1,
                                        padding: '12px',
                                        border: 'none',
                                        borderRadius: '8px',
                                        background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                                        color: 'white',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Submit Request
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProfessionalChatbotWidget;
