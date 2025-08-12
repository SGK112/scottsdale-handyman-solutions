import { useState, useRef, useEffect } from 'react';
import { Phone, MessageSquare, Mic, X, Bot, Settings, PhoneCall } from 'lucide-react';

const PhoneVoiceChat = ({ chatHistory, onModeSwitch, onClose }) => {
    const [isCallActive, setIsCallActive] = useState(false);
    const [contextSent, setContextSent] = useState(false);
    const [showInstructions, setShowInstructions] = useState(true);
    
    // Your AI agent phone number
    const AI_AGENT_NUMBER = "+16028337194";
    
    // Format chat history for context
    const formatChatContext = () => {
        if (!chatHistory || chatHistory.length === 0) {
            return "New customer inquiry - no previous chat history.";
        }
        
        const recentMessages = chatHistory.slice(-5); // Last 5 messages for context
        let context = "Previous chat context:\n\n";
        
        recentMessages.forEach((msg, index) => {
            const role = msg.sender === 'user' ? 'Customer' : 'AI Assistant';
            context += `${role}: ${msg.text}\n`;
        });
        
        context += "\nCustomer is now requesting voice assistance. Please continue helping them with their handyman needs.";
        return context;
    };
    
    // Send context to AI agent (could be via SMS, email, or API)
    const sendContextToAgent = async () => {
        try {
            const context = formatChatContext();
            
            // Send context via your backend API
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/voice/send-context`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phone_number: AI_AGENT_NUMBER,
                    context: context,
                    timestamp: new Date().toISOString()
                })
            });
            
            if (response.ok) {
                setContextSent(true);
                console.log('✅ Context sent to AI agent');
            } else {
                console.warn('⚠️ Context sending failed, proceeding with call');
            }
        } catch (error) {
            console.warn('⚠️ Context sending failed:', error);
            // Proceed with call anyway
        }
    };
    
    // Initiate phone call
    const initiateCall = async () => {
        try {
            // Send context first
            await sendContextToAgent();
            
            // Small delay to ensure context is received
            setTimeout(() => {
                // Use tel: protocol to initiate call
                window.location.href = `tel:${AI_AGENT_NUMBER}`;
                setIsCallActive(true);
                setShowInstructions(false);
                
                // Track call initiation
                console.log(`📞 Initiating call to AI agent: ${AI_AGENT_NUMBER}`);
            }, 1000);
            
        } catch (error) {
            console.error('❌ Failed to initiate call:', error);
            // Fallback: direct call without context
            window.location.href = `tel:${AI_AGENT_NUMBER}`;
            setIsCallActive(true);
        }
    };
    
    // Handle call end (when user returns to app)
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible' && isCallActive) {
                // User returned to app, assume call ended
                setTimeout(() => {
                    setIsCallActive(false);
                    setShowInstructions(true);
                }, 2000);
            }
        };
        
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [isCallActive]);
    
    return (
        <div style={{
            height: '100%',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #065f46 100%)',
            display: 'flex',
            flexDirection: 'column',
            color: 'white',
            position: 'relative'
        }}>
            {/* Header */}
            <div style={{
                padding: '20px',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                }}>
                    <div style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        background: isCallActive ? '#10b981' : '#3b82f6',
                        animation: isCallActive ? 'pulse 2s infinite' : 'none'
                    }}></div>
                    <span style={{
                        fontSize: '16px',
                        fontWeight: '600'
                    }}>
                        {isCallActive ? '📞 Voice Call Active' : '🎯 Voice Assistant Ready'}
                    </span>
                </div>
                <button
                    onClick={onModeSwitch}
                    style={{
                        background: 'rgba(255,255,255,0.1)',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '6px 12px',
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                    }}
                >
                    <MessageSquare size={14} />
                    Text Chat
                </button>
            </div>

            {/* Main Content */}
            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px 20px',
                textAlign: 'center'
            }}>
                {showInstructions && !isCallActive ? (
                    <>
                        {/* Instructions */}
                        <div style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '16px',
                            padding: '24px',
                            marginBottom: '30px',
                            maxWidth: '400px',
                            border: '1px solid rgba(255, 255, 255, 0.1)'
                        }}>
                            <h3 style={{
                                fontSize: '18px',
                                fontWeight: 'bold',
                                marginBottom: '16px',
                                color: '#10b981'
                            }}>
                                🎤 Voice Assistant Call
                            </h3>
                            <p style={{
                                fontSize: '14px',
                                lineHeight: '1.6',
                                opacity: 0.9,
                                marginBottom: '16px'
                            }}>
                                Connect directly with our AI-powered voice assistant for immediate help with your handyman needs.
                            </p>
                            <div style={{
                                fontSize: '13px',
                                opacity: 0.8,
                                textAlign: 'left',
                                lineHeight: '1.5'
                            }}>
                                <p><strong>✅ What happens:</strong></p>
                                <ul style={{ paddingLeft: '20px', margin: '8px 0' }}>
                                    <li>Your chat history is sent as context</li>
                                    <li>Direct call to our AI agent</li>
                                    <li>Speak naturally about your project</li>
                                    <li>Get instant quotes and scheduling</li>
                                </ul>
                            </div>
                        </div>

                        {/* Call Button */}
                        <button
                            onClick={initiateCall}
                            style={{
                                width: '120px',
                                height: '120px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #10b981, #065f46)',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 12px 40px rgba(16, 185, 129, 0.4)',
                                transition: 'all 0.3s ease',
                                marginBottom: '24px',
                                animation: 'pulse 2s infinite'
                            }}
                            onMouseOver={(e) => {
                                e.target.style.transform = 'scale(1.05)';
                                e.target.style.boxShadow = '0 16px 50px rgba(16, 185, 129, 0.6)';
                            }}
                            onMouseOut={(e) => {
                                e.target.style.transform = 'scale(1)';
                                e.target.style.boxShadow = '0 12px 40px rgba(16, 185, 129, 0.4)';
                            }}
                        >
                            <PhoneCall size={48} color="white" />
                        </button>

                        <div style={{
                            fontSize: '16px',
                            fontWeight: '600',
                            marginBottom: '8px'
                        }}>
                            Tap to Call AI Agent
                        </div>
                        <div style={{
                            fontSize: '13px',
                            opacity: 0.7,
                            marginBottom: '20px'
                        }}>
                            {AI_AGENT_NUMBER}
                        </div>

                        {/* Chat Context Preview */}
                        {chatHistory && chatHistory.length > 0 && (
                            <div style={{
                                background: 'rgba(59, 130, 246, 0.1)',
                                border: '1px solid rgba(59, 130, 246, 0.2)',
                                borderRadius: '12px',
                                padding: '16px',
                                maxWidth: '400px',
                                marginTop: '20px'
                            }}>
                                <h4 style={{
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    marginBottom: '8px',
                                    opacity: 0.8,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}>
                                    📋 Context to Share
                                </h4>
                                <div style={{
                                    fontSize: '12px',
                                    opacity: 0.7,
                                    lineHeight: '1.4'
                                }}>
                                    Your recent chat messages will be shared with the AI agent for personalized assistance.
                                    <br />
                                    <strong>Last {Math.min(chatHistory.length, 5)} messages included</strong>
                                </div>
                            </div>
                        )}
                    </>
                ) : isCallActive ? (
                    <>
                        {/* Call Active State */}
                        <div style={{
                            background: 'rgba(16, 185, 129, 0.2)',
                            borderRadius: '20px',
                            padding: '40px',
                            border: '2px solid rgba(16, 185, 129, 0.3)',
                            animation: 'pulse 2s infinite'
                        }}>
                            <PhoneCall size={64} color="#10b981" style={{ marginBottom: '20px' }} />
                            
                            <h3 style={{
                                fontSize: '20px',
                                fontWeight: 'bold',
                                marginBottom: '12px',
                                color: '#10b981'
                            }}>
                                🔊 Call Connected
                            </h3>
                            
                            <p style={{
                                fontSize: '14px',
                                opacity: 0.9,
                                lineHeight: '1.5',
                                marginBottom: '20px'
                            }}>
                                You're now connected with our AI voice assistant.
                                {contextSent && <><br />✅ Your chat context has been shared.</>}
                            </p>
                            
                            <div style={{
                                fontSize: '13px',
                                opacity: 0.7,
                                background: 'rgba(0,0,0,0.3)',
                                padding: '12px',
                                borderRadius: '8px',
                                lineHeight: '1.4'
                            }}>
                                💡 <strong>Tip:</strong> Speak naturally about your handyman needs. 
                                The AI has your chat history and can provide immediate quotes and scheduling.
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                setIsCallActive(false);
                                setShowInstructions(true);
                            }}
                            style={{
                                marginTop: '30px',
                                background: 'rgba(239, 68, 68, 0.2)',
                                border: '2px solid rgba(239, 68, 68, 0.3)',
                                borderRadius: '12px',
                                padding: '12px 24px',
                                color: '#fca5a5',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            <X size={16} />
                            End Call Session
                        </button>
                    </>
                ) : (
                    <>
                        {/* Post-call state */}
                        <div style={{
                            textAlign: 'center',
                            opacity: 0.8
                        }}>
                            <Bot size={48} style={{ marginBottom: '16px', opacity: 0.6 }} />
                            <p style={{ fontSize: '14px' }}>Call session ended</p>
                            <button
                                onClick={() => setShowInstructions(true)}
                                style={{
                                    marginTop: '16px',
                                    background: 'rgba(59, 130, 246, 0.2)',
                                    border: '1px solid rgba(59, 130, 246, 0.3)',
                                    borderRadius: '8px',
                                    padding: '8px 16px',
                                    color: 'white',
                                    fontSize: '12px',
                                    cursor: 'pointer'
                                }}
                            >
                                Call Again
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* Footer */}
            <div style={{
                padding: '20px',
                borderTop: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                gap: '12px'
            }}>
                <button
                    onClick={() => window.location.href = 'tel:+14802555887'}
                    style={{
                        flex: 1,
                        background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '12px 16px',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                    }}
                >
                    <Phone size={14} />
                    Emergency: (480) 255-5887
                </button>
            </div>
        </div>
    );
};

export default PhoneVoiceChat;
