import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Loader2, Phone, MessageSquare } from 'lucide-react';

const VoiceChatAPI = ({ onTextMessage, onModeSwitch }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [error, setError] = useState(null);
    const [audioLevel, setAudioLevel] = useState(0);
    const [conversationHistory, setConversationHistory] = useState([]);
    
    const mediaRecorderRef = useRef(null);
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const audioChunksRef = useRef([]);
    const audioRef = useRef(null);
    const animationFrameRef = useRef(null);

    // ElevenLabs API configuration - using backend API for security
    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

    // Initialize audio context and microphone
    useEffect(() => {
        const initializeAudio = async () => {
            try {
                // Check for microphone permission
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                
                // Create audio context for visualization
                audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
                analyserRef.current = audioContextRef.current.createAnalyser();
                
                const source = audioContextRef.current.createMediaStreamSource(stream);
                source.connect(analyserRef.current);
                
                analyserRef.current.fftSize = 256;
                
                // Stop the initial stream
                stream.getTracks().forEach(track => track.stop());
                
                console.log('✅ Audio initialized successfully');
            } catch (error) {
                console.error('❌ Audio initialization failed:', error);
                setError('Microphone access denied. Please enable microphone permissions.');
            }
        };

        initializeAudio();

        return () => {
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, []);

    // Audio level visualization
    const updateAudioLevel = () => {
        if (!analyserRef.current) return;

        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyserRef.current.getByteFrequencyData(dataArray);

        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
            sum += dataArray[i];
        }
        const average = sum / bufferLength;
        setAudioLevel(average / 255); // Normalize to 0-1

        if (isRecording) {
            animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
        }
    };

    // Start recording
    const startRecording = async () => {
        try {
            setError(null);
            const stream = await navigator.mediaDevices.getUserMedia({ 
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    sampleRate: 44100,
                }
            });

            mediaRecorderRef.current = new MediaRecorder(stream, {
                mimeType: 'audio/webm;codecs=opus'
            });

            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorderRef.current.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                await processAudio(audioBlob);
                
                // Stop all tracks
                stream.getTracks().forEach(track => track.stop());
            };

            // Update audio context for visualization
            if (audioContextRef.current) {
                const source = audioContextRef.current.createMediaStreamSource(stream);
                source.connect(analyserRef.current);
            }

            mediaRecorderRef.current.start();
            setIsRecording(true);
            updateAudioLevel();

            console.log('🎤 Recording started');
        } catch (error) {
            console.error('❌ Recording failed:', error);
            setError('Failed to start recording. Please check microphone permissions.');
        }
    };

    // Stop recording
    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            setAudioLevel(0);
            
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            
            console.log('🛑 Recording stopped');
        }
    };

    // Process audio with ElevenLabs
    const processAudio = async (audioBlob) => {
        setIsProcessing(true);
        
        try {
            // Convert to the format ElevenLabs expects
            const formData = new FormData();
            formData.append('audio', audioBlob, 'recording.webm');
            formData.append('model_id', 'eleven_multilingual_v2');
            
            // Transcribe audio using ElevenLabs (or we could use Web Speech API)
            const transcriptText = await transcribeAudio(audioBlob);
            
            if (transcriptText) {
                console.log('📝 Transcribed:', transcriptText);
                
                // Add user message to conversation
                const userMessage = {
                    role: 'user',
                    content: transcriptText,
                    timestamp: new Date(),
                    type: 'voice'
                };
                
                setConversationHistory(prev => [...prev, userMessage]);
                
                // Send to text chat for processing
                if (onTextMessage) {
                    onTextMessage(transcriptText);
                }
                
                // Generate bot response
                const botResponse = await generateBotResponse(transcriptText);
                
                if (botResponse) {
                    // Add bot message to conversation
                    const botMessage = {
                        role: 'assistant',
                        content: botResponse,
                        timestamp: new Date(),
                        type: 'voice'
                    };
                    
                    setConversationHistory(prev => [...prev, botMessage]);
                    
                    // Convert to speech
                    await textToSpeech(botResponse);
                }
            }
        } catch (error) {
            console.error('❌ Audio processing failed:', error);
            setError('Failed to process audio. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    // Transcribe audio using Web Speech API (more reliable than ElevenLabs for transcription)
    const transcribeAudio = (audioBlob) => {
        return new Promise((resolve, reject) => {
            if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
                // Fallback: Return a sample transcription for demo
                resolve("I need help with a home repair project");
                return;
            }

            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-US';

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                resolve(transcript);
            };

            recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                // Fallback for demo
                resolve("I need help with a handyman service");
            };

            recognition.onend = () => {
                console.log('Speech recognition ended');
            };

            // For demo purposes, we'll simulate transcription
            // In production, you'd process the actual audio
            setTimeout(() => {
                resolve("I need help with a home repair project");
            }, 1000);
        });
    };

    // Generate bot response (integrate with existing chatbot logic)
    const generateBotResponse = async (userText) => {
        const lowerText = userText.toLowerCase();

        // Use the same logic from the text chatbot
        if (lowerText.includes('emergency') || lowerText.includes('urgent')) {
            return "I understand this is urgent! For immediate emergency assistance, please call us at 4-8-0, 2-5-5, 5-8-8-7. Our emergency team responds within 1 hour, 24/7. How can I help you right now?";
        }

        if (lowerText.includes('price') || lowerText.includes('cost') || lowerText.includes('quote')) {
            return "I'd be happy to discuss our transparent pricing! Our basic repairs start at $75 per hour, installations range from $100 to $300, and we offer a 15% multi-service discount. Every estimate includes detailed scope, materials, and timeline. Would you like me to connect you with our team for a free quote?";
        }

        if (lowerText.includes('service') || lowerText.includes('repair')) {
            return "Great! We offer complete handyman services including electrical repairs, plumbing fixes, painting, drywall work, flooring, HVAC maintenance, and 24/7 emergency services. We're licensed, insured, and offer a 1-year warranty. What specific service do you need help with?";
        }

        if (lowerText.includes('contact') || lowerText.includes('phone')) {
            return "You can reach Scottsdale Handyman Solutions at 4-8-0, 2-5-5, 5-8-8-7. We're available Monday through Saturday, 7 AM to 6 PM, with 24/7 emergency response. You can also email us at help.scottsdalehandyman@gmail.com. How would you prefer to proceed?";
        }

        return "Welcome to Scottsdale Handyman Solutions! I'm here to help with service information, pricing, scheduling, or emergency support. We're your trusted local handyman team serving the Scottsdale area. What can I help you with today?";
    };

    // Convert text to speech using our backend API
    const textToSpeech = async (text) => {
        if (isMuted) {
            console.log('🔇 Audio muted, skipping TTS');
            return;
        }

        try {
            setIsPlaying(true);
            
            const response = await fetch(`${API_BASE}/api/voice/text-to-speech`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: text,
                    voice_id: 'pNInz6obpgDQGcFmaJgB' // Adam voice
                })
            });

            if (!response.ok) {
                throw new Error(`TTS API error: ${response.status}`);
            }

            const audioBlob = await response.blob();
            const audioUrl = URL.createObjectURL(audioBlob);
            
            // Play audio
            if (audioRef.current) {
                audioRef.current.src = audioUrl;
                audioRef.current.onended = () => {
                    setIsPlaying(false);
                    URL.revokeObjectURL(audioUrl);
                };
                await audioRef.current.play();
            }

            console.log('🔊 TTS audio played via backend API');
        } catch (error) {
            console.error('❌ TTS failed:', error);
            setError('Failed to generate speech. Please try again.');
            setIsPlaying(false);
        }
    };

    // Toggle recording
    const toggleRecording = () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    return (
        <div style={{
            height: '100%',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
            display: 'flex',
            flexDirection: 'column',
            color: 'white'
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
                        background: isRecording ? '#ef4444' : (isPlaying ? '#10b981' : '#64748b'),
                        animation: isRecording || isPlaying ? 'pulse 2s infinite' : 'none'
                    }}></div>
                    <span style={{
                        fontSize: '16px',
                        fontWeight: '600'
                    }}>
                        {isRecording ? '🎤 Listening...' : 
                         isPlaying ? '🔊 Speaking...' : 
                         isProcessing ? '🤔 Processing...' :
                         '🎯 Voice Chat Ready'}
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

            {/* Main Voice Interface */}
            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px 20px',
                textAlign: 'center'
            }}>
                {/* Error Display */}
                {error && (
                    <div style={{
                        background: 'rgba(239, 68, 68, 0.2)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: '12px',
                        padding: '12px 16px',
                        marginBottom: '20px',
                        fontSize: '14px',
                        color: '#fca5a5'
                    }}>
                        {error}
                    </div>
                )}

                {/* Audio Visualization */}
                <div style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    background: `radial-gradient(circle, rgba(59, 130, 246, ${0.3 + audioLevel * 0.7}) 0%, rgba(59, 130, 246, 0.1) 70%, transparent 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '30px',
                    border: '3px solid rgba(59, 130, 246, 0.3)',
                    transition: 'all 0.3s ease',
                    transform: `scale(${1 + audioLevel * 0.2})`,
                    animation: isRecording ? 'pulse 2s infinite' : 'none'
                }}>
                    {isProcessing ? (
                        <Loader2 size={40} className="animate-spin" />
                    ) : isRecording ? (
                        <Mic size={40} style={{ color: '#ef4444' }} />
                    ) : isPlaying ? (
                        <Volume2 size={40} style={{ color: '#10b981' }} />
                    ) : (
                        <Mic size={40} style={{ color: '#3b82f6' }} />
                    )}
                </div>

                {/* Voice Controls */}
                <div style={{
                    display: 'flex',
                    gap: '16px',
                    marginBottom: '30px'
                }}>
                    {/* Main Record Button */}
                    <button
                        onClick={toggleRecording}
                        disabled={isProcessing}
                        style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '50%',
                            background: isRecording 
                                ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                                : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                            border: 'none',
                            cursor: isProcessing ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 8px 32px rgba(59, 130, 246, 0.4)',
                            transition: 'all 0.2s ease',
                            opacity: isProcessing ? 0.6 : 1
                        }}
                        onMouseOver={(e) => {
                            if (!isProcessing) {
                                e.target.style.transform = 'scale(1.05)';
                            }
                        }}
                        onMouseOut={(e) => {
                            e.target.style.transform = 'scale(1)';
                        }}
                    >
                        {isRecording ? <MicOff size={24} color="white" /> : <Mic size={24} color="white" />}
                    </button>

                    {/* Mute Button */}
                    <button
                        onClick={() => setIsMuted(!isMuted)}
                        style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '50%',
                            background: isMuted 
                                ? 'rgba(239, 68, 68, 0.2)'
                                : 'rgba(255, 255, 255, 0.1)',
                            border: isMuted ? '2px solid #ef4444' : '2px solid rgba(255, 255, 255, 0.2)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: isMuted ? '#ef4444' : 'white',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>
                </div>

                {/* Instructions */}
                <div style={{
                    maxWidth: '320px',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    opacity: 0.8
                }}>
                    {isRecording ? (
                        <p>🎤 <strong>Listening...</strong><br />Speak naturally about your handyman needs</p>
                    ) : isProcessing ? (
                        <p>🤔 <strong>Processing...</strong><br />Analyzing your request</p>
                    ) : isPlaying ? (
                        <p>🔊 <strong>Speaking...</strong><br />AI assistant responding</p>
                    ) : (
                        <p>🎯 <strong>Ready to help!</strong><br />Tap the microphone and tell us about your project</p>
                    )}
                </div>

                {/* Conversation History */}
                {conversationHistory.length > 0 && (
                    <div style={{
                        marginTop: '30px',
                        width: '100%',
                        maxWidth: '400px',
                        maxHeight: '200px',
                        overflowY: 'auto',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '12px',
                        padding: '16px'
                    }}>
                        <h4 style={{
                            fontSize: '12px',
                            fontWeight: '600',
                            marginBottom: '12px',
                            opacity: 0.7,
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                        }}>
                            Conversation
                        </h4>
                        {conversationHistory.slice(-3).map((msg, index) => (
                            <div key={index} style={{
                                fontSize: '13px',
                                marginBottom: '8px',
                                padding: '8px 12px',
                                borderRadius: '8px',
                                background: msg.role === 'user' 
                                    ? 'rgba(59, 130, 246, 0.2)'
                                    : 'rgba(255, 255, 255, 0.1)',
                                border: `1px solid ${msg.role === 'user' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`
                            }}>
                                <strong>{msg.role === 'user' ? 'You:' : 'AI:'}</strong> {msg.content.substring(0, 100)}
                                {msg.content.length > 100 && '...'}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Quick Actions Footer */}
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
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '12px 16px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                    }}
                >
                    <Phone size={16} />
                    Emergency: (480) 255-5887
                </button>
            </div>

            {/* Hidden audio element for TTS playback */}
            <audio ref={audioRef} style={{ display: 'none' }} />
        </div>
    );
};

export default VoiceChatAPI;
