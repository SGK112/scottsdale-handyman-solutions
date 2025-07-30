import React, { lazy, Suspense } from 'react'

// Loading component with professional styling
const LoadingSpinner = ({ message = "Loading..." }) => (
    <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        minHeight: '200px'
    }}>
        <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid #f3f4f6',
            borderTop: '3px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginBottom: '1rem'
        }}></div>
        <div style={{
            color: '#6b7280',
            fontSize: '14px',
            fontWeight: '500'
        }}>
            {message}
        </div>
        <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
    </div>
)

// Lazy load heavy components
export const PaymentSection = lazy(() =>
    import('./components/PaymentSection').catch(() => ({
        default: () => <div>Payment section temporarily unavailable</div>
    }))
)

export const BlogSection = lazy(() =>
    import('./components/BlogSection').catch(() => ({
        default: () => <div>Blog section loading...</div>
    }))
)

export const AdminPanel = lazy(() =>
    import('./components/AdminPanel').catch(() => ({
        default: () => <div>Admin panel loading...</div>
    }))
)

// Higher-order component for lazy loading with error boundaries
export const withLazyLoading = (Component, loadingMessage) => {
    return React.forwardRef((props, ref) => (
        <Suspense fallback={<LoadingSpinner message={loadingMessage} />}>
            <Component {...props} ref={ref} />
        </Suspense>
    ))
}

// Error boundary for lazy-loaded components
export class LazyLoadErrorBoundary extends React.Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError(error) {
        return { hasError: true }
    }

    componentDidCatch(error, errorInfo) {
        console.error('Lazy load error:', error, errorInfo)
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    padding: '2rem',
                    textAlign: 'center',
                    color: '#ef4444',
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: '8px',
                    margin: '1rem 0'
                }}>
                    <h3>Something went wrong</h3>
                    <p>This section is temporarily unavailable. Please refresh the page.</p>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            padding: '0.5rem 1rem',
                            background: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            marginTop: '1rem'
                        }}
                    >
                        Refresh Page
                    </button>
                </div>
            )
        }

        return this.props.children
    }
}
