import { lazy, Suspense, Component } from 'react'

// Lazy load the enhanced ChatbotWidget for optimal performance
const ChatbotWidget = lazy(() => import('./ChatbotWidget.jsx'))

// Enhanced loading component with better UX
const ChatbotLoading = () => (
    <div style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        width: '60px',
        height: '60px',
        background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 20px rgba(79, 70, 229, 0.3)',
        cursor: 'pointer',
        zIndex: 1000,
        animation: 'pulse 2s infinite'
    }}>
        <div style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.3)',
            animation: 'pulse 1.5s infinite'
        }}></div>
        {/* Loading indicator */}
        <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            border: '2px solid transparent',
            borderTop: '2px solid rgba(255,255,255,0.6)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
        }}></div>
    </div>
)

// Enhanced Lazy Chatbot Component Wrapper with error boundary
const LazyChatbotWidget = ({ isVisible, onError, ...props }) => {
    if (!isVisible) return null

    const handleError = (error) => {
        console.error('Chatbot loading error:', error);
        if (onError) onError(error);
        return (
            <div style={{
                position: 'fixed',
                bottom: '2rem',
                right: '2rem',
                background: '#ef4444',
                color: 'white',
                padding: '12px 16px',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                fontSize: '14px',
                zIndex: 1000
            }}>
                ⚠️ Chat temporarily unavailable
            </div>
        );
    }

    return (
        <Suspense fallback={<ChatbotLoading />}>
            <ErrorBoundary fallback={handleError}>
                <ChatbotWidget {...props} />
            </ErrorBoundary>
        </Suspense>
    )
}

// Simple error boundary component
class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ChatbotWidget Error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback(new Error('ChatbotWidget failed to load'));
        }

        return this.props.children;
    }
}

export default LazyChatbotWidget
