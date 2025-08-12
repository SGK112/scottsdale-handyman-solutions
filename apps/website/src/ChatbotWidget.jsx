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
    MicOff,
    Volume2,
    VolumeX,
    Headphones,
    MessageSquare,
    Settings
} from 'lucide-react';

const ChatbotWidget = () => {
    const [chatOpen, setChatOpen] = useState(false);
    const [chatMode, setChatMode] = useState('choice'); // 'choice', 'text', 'voice'
    const [chatMessages, setChatMessages] = useState([]);
    const [chatInput, setChatInput] = useState('');
    const [chatTyping, setChatTyping] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    
    // ElevenLabs states
    const [elevenlabsLoaded, setElevenlabsLoaded] = useState(false);
    const [elevenlabsWidget, setElevenlabsWidget] = useState(null);
    
    // Professional UI states
    const [showTooltip, setShowTooltip] = useState(false);
    const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
    const [shouldPulse, setShouldPulse] = useState(true);
    
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
        const initializeElevenLabs = () => {
            if (window.ElevenLabs && window.ElevenLabs.ConvAI) {
                setElevenlabsLoaded(true);
                console.log('✅ ElevenLabs ConvAI loaded successfully');
            } else {
                // Wait for script to load
                setTimeout(initializeElevenLabs, 500);
            }
        };

        initializeElevenLabs();
    }, []);

    // Initialize ElevenLabs widget when voice mode is selected
    const initializeVoiceWidget = () => {
        if (!elevenlabsLoaded || !window.ElevenLabs?.ConvAI) {
            console.error('ElevenLabs ConvAI not available');
            return;
        }

        try {
            // Create ElevenLabs widget container
            const widgetContainer = document.createElement('div');
            widgetContainer.id = 'elevenlabs-convai-widget';
            widgetContainer.innerHTML = `
                <elevenlabs-convai agent-id="agent_7301k246v5fyebkbsqvzw3d7nkqw"></elevenlabs-convai>
            `;
            
            // Insert the widget
            const chatContainer = document.querySelector('.elevenlabs-widget-container');
            if (chatContainer) {
                chatContainer.appendChild(widgetContainer);
            }
            
            setElevenlabsWidget(widgetContainer);
        } catch (error) {
            console.error('Error initializing ElevenLabs widget:', error);
        }
    };

    // Chat mode handlers
    const handleModeSelection = (mode) => {
        setChatMode(mode);
        
        if (mode === 'voice') {
            initializeVoiceWidget();
        } else if (mode === 'text') {
            // Initialize text chat with welcome message
            const welcomeMessage = {
                sender: 'bot',
                text: '🏠 **Welcome to Scottsdale Handyman Solutions!**\n\nI\'m your professional AI assistant ready to help with:\n• 🔧 Service information & pricing\n• 📅 Scheduling appointments\n• 🚨 Emergency support\n• 📍 Service area questions\n• 💰 Free quotes & estimates\n\n**How can I assist you today?**',
                timestamp: new Date(),
                isWelcome: true,
                showSuggestions: true
            };
            setChatMessages([welcomeMessage]);
        }
    };

    // Initialize chatbot to always start blue
    useEffect(() => {
        setHasUnreadMessages(false);
    }, []);

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
            <div style={{
                marginBottom: '24px'
            }}>
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
                    disabled={!elevenlabsLoaded}
                    style={{
                        background: elevenlabsLoaded 
                            ? 'linear-gradient(135deg, #4f46e5, #7c3aed)'
                            : 'linear-gradient(135deg, #9ca3af, #6b7280)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '16px 20px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: elevenlabsLoaded ? 'pointer' : 'not-allowed',
                        transition: 'all 0.2s ease',
                        boxShadow: elevenlabsLoaded 
                            ? '0 4px 12px rgba(79, 70, 229, 0.3)'
                            : '0 2px 6px rgba(0,0,0,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        opacity: elevenlabsLoaded ? 1 : 0.6
                    }}
                    onMouseOver={(e) => {
                        if (elevenlabsLoaded) e.target.style.transform = 'translateY(-2px)';
                    }}
                    onMouseOut={(e) => {
                        if (elevenlabsLoaded) e.target.style.transform = 'translateY(0)';
                    }}
                >
                    <Mic size={16} />
                    <div style={{ textAlign: 'left' }}>
                        <div style={{ fontWeight: 'bold' }}>Voice Chat</div>
                        <div style={{ fontSize: '12px', opacity: 0.9 }}>
                            Speak naturally with our AI assistant
                        </div>
                    </div>
                    {!elevenlabsLoaded && (
                        <div style={{
                            marginLeft: 'auto',
                            width: '16px',
                            height: '16px',
                            border: '2px solid rgba(255,255,255,0.3)',
                            borderTop: '2px solid white',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite'
                        }} />
                    )}
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
                    onMouseOver={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.borderColor = '#4f46e5';
                    }}
                    onMouseOut={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.borderColor = '#e2e8f0';
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
                    <div style={{
                        display: 'flex',
                        gap: '8px'
                    }}>
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
        <div style={{
            height: '100%',
            background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
            display: 'flex',
            flexDirection: 'column'
        }}>
            {/* Voice widget header */}
            <div style={{
                padding: '16px 20px',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#10b981',
                        animation: 'pulse 2s infinite'
                    }}></div>
                    <span style={{
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: '600'
                    }}>
                        Voice Chat Active
                    </span>
                </div>
                <button
                    onClick={() => setChatMode('choice')}
                    style={{
                        background: 'rgba(255,255,255,0.1)',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '4px 8px',
                        color: 'white',
                        fontSize: '12px',
                        cursor: 'pointer'
                    }}
                >
                    Switch Mode
                </button>
            </div>

            {/* ElevenLabs widget container */}
            <div 
                className="elevenlabs-widget-container"
                style={{
                    flex: 1,
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                {elevenlabsLoaded ? (
                    <div style={{ width: '100%', height: '100%' }}>
                        <elevenlabs-convai 
                            agent-id="agent_7301k246v5fyebkbsqvzw3d7nkqw"
                            style={{
                                width: '100%',
                                height: '100%',
                                border: 'none',
                                borderRadius: '8px'
                            }}
                        ></elevenlabs-convai>
                    </div>
                ) : (
                    <div style={{
                        textAlign: 'center',
                        color: 'white'
                    }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            border: '3px solid rgba(255,255,255,0.3)',
                            borderTop: '3px solid white',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                            margin: '0 auto 16px'
                        }}></div>
                        <p style={{ fontSize: '14px' }}>Loading voice chat...</p>
                    </div>
                )}
            </div>

            {/* Quick actions footer */}
            <div style={{
                padding: '16px 20px',
                borderTop: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                gap: '8px'
            }}>
                <button
                    onClick={() => window.location.href = 'tel:+14802555887'}
                    style={{
                        flex: 1,
                        background: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
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
                    Call (480) 255-5887
                </button>
            </div>
        </div>
    );

    // Smart form handler
    const handleQuickFormSubmit = (e) => {
        e.preventDefault();
        
        const formMessage = `� **Service Request Submitted**\n\n**Name:** ${formData.name}\n**Phone:** ${formData.phone}\n**Service:** ${formData.service}\n**Urgency:** ${formData.urgency}\n**Details:** ${formData.description}`;
        
        const userMessage = {
            sender: 'user',
            text: formMessage,
            timestamp: new Date(),
            isForm: true
        };
        
        setChatMessages(prev => [...prev, userMessage]);
        setShowQuickForm(false);
        
        // Generate intelligent response
        setTimeout(() => {
            let response = '✅ **Service Request Received!**\n\n';
            
            if (formData.urgency === 'emergency') {
                response += '🚨 **EMERGENCY RESPONSE ACTIVATED**\n\nOur emergency team is being dispatched! Call (480) 255-5887 NOW for immediate assistance.\n\n';
            } else if (formData.urgency === 'urgent') {
                response += '⚡ **Priority Service Request**\n\nWe\'ll contact you within 1 hour for same-day service.\n\n';
            } else {
                response += '📅 **Standard Service Request**\n\nWe\'ll contact you within 4 hours to schedule your appointment.\n\n';
            }
            
            response += `**Next Steps:**\n• Expect our call at ${formData.phone}\n• Free estimate provided\n• Licensed & insured service\n• 1-year warranty included\n\n**Questions?** Call (480) 255-5887`;
            
            const botResponse = {
                sender: 'bot',
                text: response,
                timestamp: new Date()
            };
            
            setChatMessages(prev => [...prev, botResponse]);
        }, 1000);
        
        // Reset form
        setFormData({
            name: '',
            phone: '',
            service: '',
            urgency: 'standard',
            description: ''
        });
    };

    // Initialize welcome message when chat opens
    useEffect(() => {
        if (chatOpen && chatMessages.length === 0) {
            const welcomeMessage = {
                sender: 'bot',
                text: '🏠 **Welcome to Scottsdale Handyman Solutions! [UPGRADED]**\n\n✨ **NEW FEATURES ACTIVATED:**\n• 🎤 Advanced Voice Chat with ElevenLabs AI\n• 🧠 Smart Context Awareness\n• 🚨 Enhanced Emergency Response\n• 📋 Intelligent Form Pre-filling\n\nI\'m your AI assistant ready to help with:\n• 🔧 Service information & pricing\n• 📅 Scheduling appointments\n• 🚨 Emergency support\n• 📍 Service area questions\n• 💰 Free quotes & estimates\n\n**What can I help you with today?**',
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

    // Enhanced message handler with context awareness
    const handleSendMessage = (message = chatInput) => {
        if (!message.trim()) return;

        // Add to conversation context
        setConversationContext(prev => [...prev, {
            type: 'user_message',
            content: message.trim(),
            timestamp: new Date()
        }]);

        // Add user message
        const userMessage = {
            sender: 'user',
            text: message.trim(),
            timestamp: new Date()
        };

        setChatMessages(prev => [...prev, userMessage]);
        setChatInput('');
        setChatTyping(true);

        // Generate contextually aware bot response
        setTimeout(() => {
            const botResponseText = getBotResponse(message.trim());
            
            // Add conversation context to response
            setConversationContext(prev => [...prev, {
                type: 'bot_response',
                content: botResponseText,
                timestamp: new Date()
            }]);
            
            const botResponse = {
                sender: 'bot',
                text: botResponseText,
                timestamp: new Date(),
                hasContext: conversationContext.length > 0
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
                        {/* Upgrade indicator badge */}
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
                            ✨ NEW
                        </div>
                        {hasUnreadMessages && (
                            <div style={{
                                position: 'absolute',
                                top: '-4px',
                                right: '20px',
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
                                        transition: 'background 0.2s ease'
                                    }}
                                    onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.25)'}
                                    onMouseOut={(e) => e.target.style.background = 'rgba(255,255,255,0.15)'}
                                >
                                    <Settings size={12} style={{ marginRight: '4px' }} />
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
                                onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.15)'}
                                onMouseOut={(e) => e.target.style.background = 'none'}
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
                                onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.15)'}
                                onMouseOut={(e) => e.target.style.background = 'none'}
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
                                                <div style={{
                                                    maxWidth: '85%',
                                                    minWidth: '60px'
                                                }}>
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
                            {/* Mobile CTA Buttons */}
                            <div style={{
                                display: window.innerWidth <= 768 ? 'grid' : 'none',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '8px',
                                padding: '16px 20px 0 20px'
                            }}>
                                {mobileCTAButtons.map((btn, index) => (
                                    <button
                                        key={index}
                                        onClick={btn.disabled ? null : btn.action}
                                        disabled={btn.disabled}
                                        style={{
                                            background: btn.disabled 
                                                ? 'linear-gradient(135deg, #9ca3af, #6b7280)' 
                                                : `linear-gradient(135deg, ${btn.color}, ${btn.color}dd)`,
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '12px',
                                            padding: '12px 8px',
                                            fontSize: '12px',
                                            fontWeight: '600',
                                            cursor: btn.disabled ? 'not-allowed' : 'pointer',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            gap: '4px',
                                            transition: 'all 0.2s ease',
                                            boxShadow: btn.disabled 
                                                ? '0 1px 3px rgba(0,0,0,0.1)' 
                                                : '0 2px 8px rgba(0,0,0,0.1)',
                                            position: 'relative',
                                            opacity: btn.disabled ? 0.6 : 1,
                                            animation: btn.pulse ? 'pulse 2s infinite' : 'none'
                                        }}
                                        onTouchStart={(e) => {
                                            if (!btn.disabled) e.target.style.transform = 'scale(0.95)';
                                        }}
                                        onTouchEnd={(e) => {
                                            if (!btn.disabled) e.target.style.transform = 'scale(1)';
                                        }}
                                    >
                                        {btn.loading && (
                                            <div style={{
                                                position: 'absolute',
                                                top: '50%',
                                                left: '50%',
                                                transform: 'translate(-50%, -50%)',
                                                width: '16px',
                                                height: '16px',
                                                border: '2px solid rgba(255,255,255,0.3)',
                                                borderTop: '2px solid white',
                                                borderRadius: '50%',
                                                animation: 'spin 1s linear infinite'
                                            }} />
                                        )}
                                        <span style={{ 
                                            fontSize: '16px',
                                            opacity: btn.loading ? 0.3 : 1
                                        }}>{btn.icon}</span>
                                        <span style={{ 
                                            opacity: btn.loading ? 0.3 : 1,
                                            position: 'relative'
                                        }}>
                                            {btn.text}
                                            {btn.badge && (
                                                <span style={{
                                                    position: 'absolute',
                                                    top: '-8px',
                                                    right: '-12px',
                                                    background: '#10b981',
                                                    color: 'white',
                                                    fontSize: '8px',
                                                    padding: '2px 4px',
                                                    borderRadius: '6px',
                                                    fontWeight: 'bold'
                                                }}>
                                                    {btn.badge}
                                                </span>
                                            )}
                                        </span>
                                        {btn.text === 'Voice Chat' && voiceModeActive && (
                                            <div style={{
                                                width: '4px',
                                                height: '4px',
                                                borderRadius: '50%',
                                                background: '#ffffff',
                                                animation: 'pulse 1s infinite'
                                            }} />
                                        )}
                                    </button>
                                ))}
                            </div>

                            {/* ElevenLabs ConvAI Widget Container */}
                            {voiceModeActive && (
                                <div style={{
                                    background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                                    borderRadius: '16px',
                                    padding: '16px',
                                    margin: '16px 20px 0 20px',
                                    textAlign: 'center',
                                    color: 'white'
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px',
                                        marginBottom: '12px'
                                    }}>
                                        <Headphones size={20} />
                                        <span style={{ fontWeight: '600' }}>AI Voice Assistant Active</span>
                                        {isListening && <Mic size={16} style={{ animation: 'pulse 1s infinite' }} />}
                                    </div>
                                    
                                    {/* ElevenLabs Widget */}
                                    <elevenlabs-convai 
                                        agent-id="agent_7301k246v5fyebkbsqvzw3d7nkqw"
                                        style={{
                                            width: '100%',
                                            minHeight: '200px',
                                            borderRadius: '12px',
                                            background: 'rgba(255,255,255,0.1)',
                                            border: '1px solid rgba(255,255,255,0.2)'
                                        }}
                                    />
                                    
                                    <div style={{
                                        display: 'flex',
                                        gap: '8px',
                                        marginTop: '12px',
                                        justifyContent: 'center'
                                    }}>
                                        <button
                                            onClick={() => setVoiceEnabled(!voiceEnabled)}
                                            style={{
                                                background: 'rgba(255,255,255,0.2)',
                                                border: 'none',
                                                borderRadius: '8px',
                                                padding: '8px 12px',
                                                color: 'white',
                                                cursor: 'pointer',
                                                fontSize: '12px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px'
                                            }}
                                        >
                                            {voiceEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
                                            {voiceEnabled ? 'Mute' : 'Unmute'}
                                        </button>
                                        <button
                                            onClick={() => setVoiceModeActive(false)}
                                            style={{
                                                background: 'rgba(255,255,255,0.2)',
                                                border: 'none',
                                                borderRadius: '8px',
                                                padding: '8px 12px',
                                                color: 'white',
                                                cursor: 'pointer',
                                                fontSize: '12px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px'
                                            }}
                                        >
                                            <MessageCircle size={14} />
                                            Text Chat
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Smart Quick Form */}
                            {showQuickForm && (
                                <div style={{
                                    background: 'white',
                                    border: '2px solid #3b82f6',
                                    borderRadius: '16px',
                                    padding: '16px',
                                    margin: '16px 20px 0 20px',
                                    boxShadow: '0 8px 24px rgba(59, 130, 246, 0.15)'
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: '12px'
                                    }}>
                                        <h3 style={{
                                            margin: 0,
                                            color: '#1f2937',
                                            fontSize: '16px',
                                            fontWeight: '600'
                                        }}>📋 Quick Service Request</h3>
                                        <button
                                            onClick={() => setShowQuickForm(false)}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                                padding: '4px',
                                                borderRadius: '4px'
                                            }}
                                        >
                                            <X size={16} color="#6b7280" />
                                        </button>
                                    </div>

                                    <form onSubmit={handleQuickFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                            <input
                                                type="text"
                                                placeholder="Your Name *"
                                                value={formData.name}
                                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                                required
                                                style={{
                                                    padding: '10px 12px',
                                                    border: '1px solid #d1d5db',
                                                    borderRadius: '8px',
                                                    fontSize: '14px',
                                                    outline: 'none'
                                                }}
                                            />
                                            <input
                                                type="tel"
                                                placeholder="Phone Number *"
                                                value={formData.phone}
                                                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                                required
                                                style={{
                                                    padding: '10px 12px',
                                                    border: '1px solid #d1d5db',
                                                    borderRadius: '8px',
                                                    fontSize: '14px',
                                                    outline: 'none'
                                                }}
                                            />
                                        </div>

                                        <select
                                            value={formData.service}
                                            onChange={(e) => setFormData(prev => ({ ...prev, service: e.target.value }))}
                                            required
                                            style={{
                                                padding: '10px 12px',
                                                border: '1px solid #d1d5db',
                                                borderRadius: '8px',
                                                fontSize: '14px',
                                                outline: 'none',
                                                backgroundColor: 'white'
                                            }}
                                        >
                                            <option value="">Select Service Type *</option>
                                            <option value="Electrical">Electrical Work</option>
                                            <option value="Plumbing">Plumbing Repair</option>
                                            <option value="Painting">Painting Project</option>
                                            <option value="Drywall">Drywall Repair</option>
                                            <option value="Flooring">Flooring Installation</option>
                                            <option value="HVAC">HVAC Service</option>
                                            <option value="General">General Repair</option>
                                            <option value="Emergency">Emergency Service</option>
                                        </select>

                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                                            {['standard', 'urgent', 'emergency'].map(urgency => (
                                                <label
                                                    key={urgency}
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '6px',
                                                        padding: '8px',
                                                        borderRadius: '8px',
                                                        border: formData.urgency === urgency ? '2px solid #3b82f6' : '1px solid #d1d5db',
                                                        background: formData.urgency === urgency ? '#eff6ff' : 'white',
                                                        cursor: 'pointer',
                                                        fontSize: '12px'
                                                    }}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="urgency"
                                                        value={urgency}
                                                        checked={formData.urgency === urgency}
                                                        onChange={(e) => setFormData(prev => ({ ...prev, urgency: e.target.value }))}
                                                        style={{ margin: 0 }}
                                                    />
                                                    <span style={{ textTransform: 'capitalize' }}>
                                                        {urgency === 'emergency' ? '🚨' : urgency === 'urgent' ? '⚡' : '📅'} {urgency}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>

                                        <textarea
                                            placeholder="Describe your project (optional)"
                                            value={formData.description}
                                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                            rows={3}
                                            style={{
                                                padding: '10px 12px',
                                                border: '1px solid #d1d5db',
                                                borderRadius: '8px',
                                                fontSize: '14px',
                                                outline: 'none',
                                                resize: 'vertical',
                                                minHeight: '60px',
                                                fontFamily: 'inherit'
                                            }}
                                        />

                                        <button
                                            type="submit"
                                            style={{
                                                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '8px',
                                                padding: '12px 16px',
                                                fontSize: '14px',
                                                fontWeight: '600',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease'
                                            }}
                                        >
                                            🚀 Submit Request
                                        </button>
                                    </form>

                                    <div style={{
                                        fontSize: '11px',
                                        color: '#6b7280',
                                        textAlign: 'center',
                                        marginTop: '8px'
                                    }}>
                                        🔒 Your information is secure and will only be used to contact you about your service request.
                                    </div>
                                </div>
                            )}

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
