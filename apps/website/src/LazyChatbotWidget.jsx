import { lazy, Suspense } from 'react'

// Lazy load the ChatbotWidget for better performance
const ChatbotWidget = lazy(() => import('./ChatbotWidget.jsx'))

// Loading component for the chatbot
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
    </div>
)

// Lazy Chatbot Component Wrapper
const LazyChatbotWidget = ({ isVisible, ...props }) => {
    if (!isVisible) return null

    return (
        <Suspense fallback={<ChatbotLoading />}>
            <ChatbotWidget {...props} />
        </Suspense>
    )
}

export default LazyChatbotWidget
