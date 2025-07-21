import React, { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import ChatbotWidget from './ChatbotWidget'
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Star,
  Shield,
  Award,
  Users,
  CheckCircle,
  Check,
  Wrench,
  Home,
  Zap,
  Droplets,
  Thermometer,
  Smartphone,
  Calendar,
  PhoneCall,
  MessageSquare,
  Menu,
  X,
  CreditCard,
  ArrowLeft,
  DollarSign,
  FileText,
  User,
  Building,
  BookOpen,
  TrendingUp,
  Target,
  Heart,
  Briefcase,
  GraduationCap,
  Coffee,
  ChevronRight,
  ExternalLink,
  Search,
  Filter,
  Eye,
  EyeOff,
  Share2,
  Settings,
  Edit3,
  Save,
  Trash2,
  Plus,
  Upload,
  LogOut,
  Lock,
  Database,
  Image,
  Type,
  Layers,
  Edit2,
  Send,
  MessageCircle,
  Bot,
  Minimize2,
  RotateCcw,
  Download,
  Square,
  Grid3X3,
  Wind,
  Settings2,
  AlertTriangle
} from 'lucide-react'

// Add CSS animations for success page and blog enhancements
const styles = `
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-10px);
    }
    60% {
      transform: translateY(-5px);
    }
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes pulse {
    0% { 
      box-shadow: 0 20px 40px rgba(255, 68, 68, 0.4);
      transform: scale(1);
    }
    50% { 
      box-shadow: 0 25px 50px rgba(255, 68, 68, 0.6);
      transform: scale(1.02);
    }
    100% { 
      box-shadow: 0 20px 40px rgba(255, 68, 68, 0.4);
      transform: scale(1);
    }
  }
  
  @keyframes flash {
    0% { opacity: 1; }
    50% { opacity: 0.7; }
    100% { opacity: 1; }
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-20px);
    }
  }

  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes bounceIn {
    0% {
      opacity: 0;
      transform: scale(0.3);
    }
    50% {
      transform: scale(1.05);
    }
    70% {
      transform: scale(0.9);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes bounce {
    0%, 80%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-3px);
    }
  }

  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
  
  @keyframes chatbotGlow {
    0%, 100% {
      box-shadow: 0 12px 50px rgba(79, 70, 229, 0.25), 0 6px 20px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.1);
    }
    50% {
      box-shadow: 0 15px 60px rgba(79, 70, 229, 0.35), 0 8px 25px rgba(124, 58, 237, 0.15), inset 0 1px 0 rgba(255,255,255,0.15);
    }
  }

  @keyframes uploadProgress {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(0);
    }
  }

  .drag-active {
    border-color: var(--primary-500) !important;
    background: var(--primary-50) !important;
    transform: scale(1.02);
  }

  .file-preview-hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
  }
`

// Inject styles into document head
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style')
  styleSheet.textContent = styles
  document.head.appendChild(styleSheet)
}

// Admin Login Component
const AdminLogin = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Authenticate against backend with environment variables
      const response = await fetch('/api/admin-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      })

      const result = await response.json()

      if (result.success) {
        localStorage.setItem('adminToken', result.token)
        onLogin(result.token)
      } else {
        setError(result.error || 'Invalid username or password')
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 50%, #dee2e6 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        overflow: 'hidden',
        width: '100%',
        maxWidth: '400px'
      }}>
        <div style={{ padding: '3rem 2rem 2rem', textAlign: 'center' }}>
          <div style={{
            width: '80px',
            height: '80px',
            backgroundColor: 'rgba(102, 126, 234, 0.1)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 2rem'
          }}>
            <Lock size={32} color="#667eea" />
          </div>

          <h1 style={{
            fontSize: '1.75rem',
            fontWeight: '700',
            color: '#1f2937',
            marginBottom: '0.5rem'
          }}>
            Admin Access
          </h1>
          <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
            Sign in to manage your website content
          </p>

          <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Username
              </label>
              <div style={{ position: 'relative' }}>
                <User size={20} style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af'
                }} />
                <input
                  type="text"
                  value={credentials.username}
                  onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="Enter username"
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem 0.75rem 0.75rem 3rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{
                display: 'block',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={20} style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af'
                }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter password"
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem 3rem 0.75rem 3rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    boxSizing: 'border-box'
                  }}
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowPassword(prev => !prev);
                  }}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#9ca3af',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {error && (
              <div style={{
                padding: '0.75rem',
                backgroundColor: '#fef2f2',
                color: '#dc2626',
                borderRadius: '8px',
                marginBottom: '1.5rem',
                fontSize: '0.9rem',
                border: '1px solid #fecaca'
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.875rem',
                background: loading ? '#9ca3af' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        <div style={{
          padding: '1.5rem 2rem',
          backgroundColor: '#f8fafc',
          borderTop: '1px solid #e5e7eb',
          textAlign: 'center'
        }}>
          <p style={{
            fontSize: '0.8rem',
            color: '#6b7280',
            margin: 0
          }}>
            Default: admin / handyman2024!
          </p>
        </div>
      </div>
    </div>
  )
}

// Simple Admin Panel Component
const SimpleAdminPanel = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard')

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Sidebar */}
      <div style={{
        width: '250px',
        backgroundColor: '#1f2937',
        color: 'white',
        padding: '2rem 0'
      }}>
        <div style={{ padding: '0 1.5rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Admin Panel</h2>
        </div>

        <nav>
          {[
            { id: 'dashboard', label: 'Dashboard', icon: FileText },
            { id: 'forms', label: 'Form Submissions', icon: Users },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map(item => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1.5rem',
                  backgroundColor: activeTab === item.id ? '#374151' : 'transparent',
                  color: 'white',
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  fontSize: '0.95rem',
                  transition: 'background-color 0.2s'
                }}
              >
                <Icon size={18} />
                {item.label}
              </button>
            )
          })}
        </nav>

        <div style={{ position: 'absolute', bottom: '2rem', left: '1.5rem', right: '1.5rem' }}>
          <button
            onClick={onLogout}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              fontSize: '0.95rem'
            }}
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '2rem' }}>
        {activeTab === 'dashboard' && (
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#1f2937', marginBottom: '2rem' }}>
              Admin Dashboard
            </h1>
            <div style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '12px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
            }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>
                Welcome to Admin Panel
              </h2>
              <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                This is a simplified admin interface. The full admin panel with blog management
                and GitHub integration will be available once you complete the backend setup.
              </p>
              <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f0f9ff', borderRadius: '8px', border: '1px solid #0ea5e9' }}>
                <h3 style={{ color: '#0ea5e9', fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                  Next Steps:
                </h3>
                <ul style={{ color: '#0369a1', margin: 0, paddingLeft: '1.5rem' }}>
                  <li>Set up your GitHub token in .env file</li>
                  <li>Start the backend server with: npm run backend:dev</li>
                  <li>Full blog management and form handling will be available</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'forms' && (
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#1f2937', marginBottom: '2rem' }}>
              Form Submissions
            </h1>
            <div style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '12px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
            }}>
              <p style={{ color: '#6b7280' }}>
                Form submissions will appear here once the backend is connected.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#1f2937', marginBottom: '2rem' }}>
              Settings
            </h1>
            <div style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '12px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
            }}>
              <p style={{ color: '#6b7280' }}>
                Settings panel coming soon...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState('home')
  const [selectedBlogPost, setSelectedBlogPost] = useState(null)

  // Admin System State
  const [isAdmin, setIsAdmin] = useState(false)
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false)
  const [showAdminLogin, setShowAdminLogin] = useState(false)
  const [adminToken, setAdminToken] = useState(null)
  const [adminSection, setAdminSection] = useState('dashboard')

  // Check for existing admin session on app load
  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (token) {
      setIsAdminLoggedIn(true)
      setAdminToken(token)
    }

    // Check for admin access via URL parameter
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('admin') === 'true') {
      setShowAdminLogin(true)
    }
  }, [])

  const handleAdminLogin = (token) => {
    console.log('Admin login successful, setting state...', { token, isAdminLoggedIn })
    setIsAdminLoggedIn(true)
    setAdminToken(token)
    setShowAdminLogin(false)
    console.log('Admin login state updated')
  }

  const handleAdminLogout = () => {
    localStorage.removeItem('adminToken')
    setIsAdminLoggedIn(false)
    setAdminToken(null)
    setCurrentPage('home')
  }

  // File Upload State (for drag-drop in regular forms)
  const [isDragging, setIsDragging] = useState(false)
  const [filePreview, setFilePreview] = useState(null)

  // Success page state
  const [showSuccessPage, setShowSuccessPage] = useState(false)
  const [submittedFormData, setSubmittedFormData] = useState(null)

  // Test input state for debugging
  const [testInput, setTestInput] = useState('')

  // Smart Lead Forms State
  const [leadFormModal, setLeadFormModal] = useState(null) // 'quote', 'emergency', 'consultation', 'general'

  // Emergency popup state
  const [showEmergencyPopup, setShowEmergencyPopup] = useState(false)

  // Admin password visibility state
  const [showPassword, setShowPassword] = useState(false)

  // Stripe configuration
  const [stripePromise, setStripePromise] = useState(null)
  const [stripeConfig, setStripeConfig] = useState(null)

  // Payment processing state
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [paymentError, setPaymentError] = useState(null)

  // Package checkout state - now universal for all services
  const [selectedService, setSelectedService] = useState(null)

  // Service types and packages configuration
  const servicePackages = {
    // Smart Home Solutions
    'smart-home': {
      category: 'Smart Home Solutions',
      packages: [
        {
          id: 'smart-starter',
          name: 'Starter Package',
          price: 1299,
          description: 'Perfect introduction to smart home living with essential automation',
          features: [
            'Smart thermostat installation',
            '4 smart light switches',
            'Smart doorbell with video',
            'Basic automation setup',
            'Mobile app configuration',
            '1 year support included'
          ]
        },
        {
          id: 'smart-complete',
          name: 'Complete Package',
          price: 2799,
          description: 'Comprehensive smart home solution for enhanced living',
          features: [
            'Everything in Starter Package',
            'Smart security cameras (4)',
            'Smart door locks (2 doors)',
            'Motion sensor lighting',
            'Voice control setup',
            'Smart water leak detectors',
            'Professional monitoring setup'
          ]
        },
        {
          id: 'smart-premium',
          name: 'Premium Package',
          price: 4999,
          description: 'Ultimate smart home experience with luxury automation',
          features: [
            'Everything in Complete Package',
            'Whole home automation',
            'Smart garage door opener',
            'Automated window treatments',
            'Smart irrigation system',
            'Energy monitoring system',
            '24/7 concierge support'
          ]
        }
      ]
    },

    // Maintenance Plans
    'maintenance': {
      category: 'Maintenance Plans',
      packages: [
        {
          id: 'maintenance-basic',
          name: 'Basic Plan',
          price: 149,
          recurring: true,
          description: 'Essential monthly maintenance to keep your home running smoothly',
          features: [
            'Monthly 2-hour maintenance visit',
            'HVAC filter replacement',
            'Smoke detector testing',
            'Basic plumbing inspection',
            '10% discount on repairs',
            'Priority scheduling'
          ]
        },
        {
          id: 'maintenance-premium',
          name: 'Premium Plan',
          price: 249,
          recurring: true,
          description: 'Enhanced maintenance with quarterly deep inspections',
          features: [
            'Monthly 3-hour maintenance visit',
            'Quarterly deep maintenance',
            'Smart home monitoring setup',
            '15% discount on repairs',
            'Free emergency consultations',
            '24/7 support hotline'
          ]
        },
        {
          id: 'maintenance-elite',
          name: 'Elite Plan',
          price: 399,
          recurring: true,
          description: 'Premium care with unlimited minor repairs included',
          features: [
            'Bi-weekly maintenance visits',
            'Unlimited minor repairs (under 30 min)',
            '20% discount on major services',
            'Smart home automation management',
            '24/7 emergency response',
            'Dedicated account manager'
          ]
        }
      ]
    },

    // Home Repairs
    'home-repairs': {
      category: 'Home Repairs',
      packages: [
        {
          id: 'repair-basic',
          name: 'Basic Repair Service',
          price: 125,
          description: 'Quick fixes and minor repairs for common household issues',
          features: [
            '2-hour service window',
            'Basic tools and materials',
            'Minor electrical repairs',
            'Plumbing quick fixes',
            'Drywall patching',
            '30-day warranty'
          ]
        },
        {
          id: 'repair-comprehensive',
          name: 'Comprehensive Repair',
          price: 285,
          description: 'Thorough diagnosis and repair for complex issues',
          features: [
            '4-hour service window',
            'Professional diagnosis',
            'Quality materials included',
            'Electrical troubleshooting',
            'Plumbing repairs',
            '90-day warranty'
          ]
        },
        {
          id: 'repair-emergency',
          name: 'Emergency Repair',
          price: 225,
          description: '24/7 emergency service for urgent repairs that cannot wait',
          features: [
            'Same-day response',
            '1-4 hour arrival time',
            'Emergency materials stock',
            'After-hours availability',
            'Weekend and holiday service',
            'Immediate safety assessment'
          ]
        }
      ]
    },

    // Home Improvements
    'home-improvements': {
      category: 'Home Improvements',
      packages: [
        {
          id: 'improvement-consultation',
          name: 'Improvement Consultation',
          price: 125,
          description: 'Professional consultation for your home improvement project',
          features: [
            '1-hour detailed consultation',
            'Project scope assessment',
            'Material recommendations',
            'Timeline planning',
            'Budget estimation',
            'Written project proposal'
          ]
        },
        {
          id: 'improvement-basic',
          name: 'Basic Improvement Package',
          price: 785,
          description: 'Essential improvements to enhance your home\'s functionality',
          features: [
            'Cabinet hardware upgrade',
            'Fixture replacement (2 rooms)',
            'Paint touch-ups',
            'Basic carpentry work',
            'Minor electrical updates',
            '6-month warranty'
          ]
        },
        {
          id: 'improvement-premium',
          name: 'Premium Improvement Package',
          price: 1585,
          description: 'Comprehensive improvements to transform your living space',
          features: [
            'Room renovation planning',
            'Custom carpentry work',
            'Electrical system upgrades',
            'Plumbing improvements',
            'Flooring installation',
            '1-year warranty'
          ]
        }
      ]
    },

    // Emergency Services
    'emergency': {
      category: 'Emergency Services',
      packages: [
        {
          id: 'emergency-standard',
          name: 'Standard Emergency',
          price: 225,
          description: '2-4 hour response for urgent repairs and safety issues',
          features: [
            '2-4 hour response time',
            'Basic emergency repairs',
            'Temporary solutions',
            'Safety assessment',
            'Follow-up scheduling',
            '30-day warranty'
          ]
        },
        {
          id: 'emergency-priority',
          name: 'Priority Emergency',
          price: 325,
          description: 'Rapid 1-2 hour response with comprehensive service',
          features: [
            '1-2 hour response time',
            'Comprehensive emergency service',
            'Permanent solutions when possible',
            'Parts inventory access',
            'Priority follow-up',
            '60-day warranty'
          ]
        },
        {
          id: 'emergency-vip',
          name: 'VIP Emergency',
          price: 425,
          description: 'Immediate response with full-service emergency team',
          features: [
            '30-60 minute response time',
            'Full-service emergency response',
            'On-site parts and materials',
            'Immediate permanent solutions',
            '24/7 support line',
            '90-day warranty'
          ]
        }
      ]
    },

    // Seasonal Services
    'seasonal': {
      category: 'Seasonal Services',
      packages: [
        {
          id: 'seasonal-spring',
          name: 'Spring Preparation Package',
          price: 385,
          description: 'Comprehensive spring preparation for Arizona weather',
          features: [
            'HVAC system inspection',
            'Outdoor faucet checks',
            'Gutter cleaning',
            'Exterior caulking inspection',
            'Pool equipment check',
            'Landscaping preparation'
          ]
        },
        {
          id: 'seasonal-summer',
          name: 'Summer Readiness Package',
          price: 285,
          description: 'Beat the heat with professional summer preparation',
          features: [
            'Air conditioning tune-up',
            'Ceiling fan inspection',
            'Outdoor lighting check',
            'Patio maintenance',
            'Window screen repair',
            'Cooling system optimization'
          ]
        },
        {
          id: 'seasonal-fall',
          name: 'Fall Maintenance Package',
          price: 325,
          description: 'Prepare for cooler weather and monsoon season',
          features: [
            'Heating system inspection',
            'Weatherstripping replacement',
            'Roof and gutter maintenance',
            'Outdoor furniture winterization',
            'Fireplace safety check',
            'Storm preparation'
          ]
        },
        {
          id: 'seasonal-winter',
          name: 'Winter Protection Package',
          price: 225,
          description: 'Protect your home during Arizona\'s mild winter weather',
          features: [
            'Pipe insulation and freeze protection',
            'Weather seal inspection',
            'Emergency heating backup',
            'Outdoor equipment winterization',
            'Holiday lighting installation',
            'Cold weather preparation'
          ]
        }
      ]
    }
  }

  // Chatbot state
  const [chatOpen, setChatOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'bot',
      text: '🏠 Hi! I\'m your AI handyman assistant. I can help you with service information, pricing, scheduling, and emergency support. What can I help you with today?',
      timestamp: new Date(),
      isWelcome: true
    }
  ])
  const [chatInput, setChatInput] = useState('')
  const [chatTyping, setChatTyping] = useState(false)
  const [chatContext, setChatContext] = useState({
    lastService: null,
    userLocation: null,
    conversationStage: 'greeting'
  })
  const [chatSessionId] = useState(() => `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)

  // Lead collection state
  const [leadData, setLeadData] = useState({
    customerName: '',
    phoneNumber: '',
    address: '',
    scopeOfWork: '',
    notes: '',
    collectingLead: false,
    currentField: null
  })

  // Simple form state (no longer needed for complex form)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })

  // Payment form state
  const [paymentData, setPaymentData] = useState({
    customerName: '',
    email: '',
    phone: '',
    invoiceNumber: '',
    amount: '',
    description: '',
    paymentMethod: 'card'
  })

  // Work with us form state
  const [workFormData, setWorkFormData] = useState({
    name: '',
    email: '',
    phone: '',
    experience: '',
    position: '',
    skills: '',
    availability: '',
    resume: null
  })

  // Phone number formatting function
  const formatPhoneNumber = (value) => {
    // Remove all non-numeric characters
    const phoneNumber = value.replace(/\D/g, '')

    // Format the phone number
    if (phoneNumber.length < 4) {
      return phoneNumber
    } else if (phoneNumber.length < 7) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`
    } else {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`
    }
  }

  // Handle phone input formatting
  const handlePhoneInput = (e) => {
    const formatted = formatPhoneNumber(e.target.value)
    e.target.value = formatted
  }

  // Advanced Chatbot NLP System with Comprehensive Knowledge Base
  const handymanKnowledgeBase = {
    // Residential Interior Terms
    interiorTerms: {
      electrical: [
        'outlet', 'switch', 'dimmer', 'gfci', 'circuit breaker', 'fuse box', 'electrical panel',
        'junction box', 'wire nut', 'conduit', 'romex', 'voltage', 'amperage', 'ground fault',
        'chandelier', 'pendant light', 'recessed lighting', 'track lighting', 'under cabinet lighting',
        'ceiling fan', 'bathroom fan', 'range hood', 'doorbell', 'intercom', 'security system',
        'smoke detector', 'carbon monoxide detector', 'surge protector', 'usb outlet', 'smart switch'
      ],
      plumbing: [
        'faucet', 'sink', 'toilet', 'shower', 'bathtub', 'drain', 'pipe', 'valve', 'trap',
        'water heater', 'tankless', 'garbage disposal', 'dishwasher hookup', 'ice maker line',
        'shut off valve', 'supply line', 'drain line', 'vent stack', 'p-trap', 'wax ring',
        'flapper', 'fill valve', 'float', 'chain', 'handle', 'seat', 'gasket', 'o-ring',
        'leak', 'drip', 'clog', 'blockage', 'backup', 'overflow', 'water pressure', 'flow rate'
      ],
      hvac: [
        'air conditioner', 'heater', 'furnace', 'heat pump', 'thermostat', 'ductwork', 'vents',
        'air filter', 'return air', 'supply air', 'damper', 'zone control', 'programmable thermostat',
        'smart thermostat', 'humidity control', 'air quality', 'ventilation', 'exhaust fan',
        'attic fan', 'whole house fan', 'swamp cooler', 'evaporative cooler', 'mini split'
      ],
      flooring: [
        'hardwood', 'laminate', 'vinyl', 'lvp', 'tile', 'carpet', 'area rug', 'baseboards',
        'quarter round', 'shoe molding', 'transition strips', 'underlayment', 'subfloor',
        'ceramic tile', 'porcelain tile', 'natural stone', 'marble', 'granite', 'travertine',
        'grout', 'grout lines', 'caulk', 'sealant', 'floor stain', 'polyurethane', 'refinishing'
      ],
      walls: [
        'drywall', 'sheetrock', 'plaster', 'paint', 'primer', 'texture', 'knockdown', 'orange peel',
        'smooth finish', 'wallpaper', 'wall covering', 'chair rail', 'crown molding', 'baseboard',
        'wainscoting', 'paneling', 'accent wall', 'feature wall', 'nail holes', 'screw holes',
        'cracks', 'dents', 'dings', 'patch', 'spackle', 'joint compound', 'mesh tape', 'paper tape'
      ],
      doors: [
        'entry door', 'interior door', 'exterior door', 'front door', 'back door', 'patio door',
        'sliding door', 'bi-fold door', 'pocket door', 'barn door', 'french door', 'storm door',
        'screen door', 'door frame', 'door jamb', 'threshold', 'weather stripping', 'door sweep',
        'hinges', 'door knob', 'handle', 'deadbolt', 'lock', 'strike plate', 'door closer'
      ],
      windows: [
        'window', 'window frame', 'sash', 'sill', 'trim', 'casing', 'mullion', 'muntin',
        'double hung', 'single hung', 'casement', 'awning', 'sliding window', 'bay window',
        'picture window', 'skylight', 'window screen', 'storm window', 'window balance',
        'weatherstripping', 'glazing', 'putty', 'caulk', 'flashing', 'window well'
      ],
      kitchen: [
        'countertop', 'counter top', 'kitchen counter', 'granite', 'quartz', 'marble', 'butcher block',
        'laminate counter', 'cabinet', 'kitchen cabinet', 'vanity', 'island', 'peninsula',
        'backsplash', 'tile backsplash', 'subway tile', 'mosaic', 'under cabinet lighting',
        'cabinet hardware', 'pulls', 'knobs', 'hinges', 'soft close', 'lazy susan',
        'pantry', 'spice rack', 'crown molding', 'valance', 'toe kick', 'filler strip'
      ],
      appliances: [
        'dishwasher', 'garbage disposal', 'range hood', 'microwave', 'oven', 'cooktop',
        'refrigerator', 'ice maker', 'water line', 'gas line', 'appliance installation',
        'appliance hookup', 'washing machine', 'dryer', 'washer dryer hookup', 'laundry room'
      ]
    },

    // Residential Exterior Terms  
    exteriorTerms: {
      roofing: [
        'shingles', 'tiles', 'metal roofing', 'flat roof', 'pitched roof', 'gutter', 'downspout',
        'fascia', 'soffit', 'rake board', 'ridge vent', 'attic vent', 'flashing', 'drip edge',
        'underlayment', 'decking', 'rafters', 'trusses', 'chimney', 'skylight', 'solar panels'
      ],
      siding: [
        'vinyl siding', 'wood siding', 'fiber cement', 'stucco', 'brick', 'stone', 'metal siding',
        'board and batten', 'lap siding', 'shake siding', 'trim', 'corner boards', 'j-channel',
        'starter strip', 'house wrap', 'flashing', 'caulk', 'paint', 'stain', 'sealant'
      ],
      outdoor: [
        'deck', 'patio', 'pergola', 'gazebo', 'fence', 'gate', 'retaining wall', 'walkway',
        'driveway', 'concrete', 'pavers', 'flagstone', 'gravel', 'mulch', 'landscaping',
        'irrigation', 'sprinkler system', 'outdoor lighting', 'security lighting', 'motion sensor'
      ]
    },

    // Commercial Terms
    commercialTerms: {
      office: [
        'cubicle', 'partition', 'conference room', 'break room', 'reception area', 'waiting room',
        'office space', 'commercial kitchen', 'restroom', 'ada compliance', 'fire exit',
        'emergency lighting', 'security system', 'access control', 'card reader', 'keypad'
      ],
      retail: [
        'storefront', 'display window', 'shopping center', 'retail space', 'cash wrap',
        'dressing room', 'stockroom', 'loading dock', 'signage', 'awning', 'canopy',
        'pos system', 'security camera', 'theft protection', 'inventory system'
      ],
      industrial: [
        'warehouse', 'loading bay', 'conveyor system', 'industrial lighting', 'high bay lights',
        'concrete floor', 'epoxy coating', 'drainage system', 'ventilation system',
        'fire suppression', 'emergency shower', 'eye wash station', 'safety equipment'
      ]
    },

    // Service Categories from Website
    services: {
      electrical: {
        keywords: ['electrical', 'electric', 'power', 'wire', 'wiring', 'outlet', 'switch', 'breaker', 'panel', 'light', 'lighting', 'fixture', 'fan', 'ceiling fan', 'chandelier', 'dimmer', 'gfci', 'surge', 'voltage', 'amp', 'circuit'],
        response: "I can help with electrical work! We handle outlet installation, light fixture replacement, ceiling fan installation, switch and dimmer upgrades, GFCI installations, circuit repairs, electrical panel upgrades, and safety inspections. All electrical work is performed by licensed electricians with proper permits.",
        followUp: "What specific electrical issue are you dealing with? Is this for indoor or outdoor work? Do you need this urgently or can we schedule it for later this week?"
      },
      plumbing: {
        keywords: ['plumbing', 'plumber', 'water', 'pipe', 'pipes', 'leak', 'leaking', 'faucet', 'sink', 'toilet', 'shower', 'drain', 'clog', 'blockage', 'water heater', 'disposal', 'valve', 'pressure', 'flow'],
        response: "Plumbing problems solved! We handle leak repairs, faucet installation and repair, toilet repairs and installation, drain cleaning, pipe repairs, water heater maintenance, garbage disposal installation, and fixture upgrades. Emergency plumbing service available 24/7.",
        followUp: "Is this a leak, drainage issue, or installation? If it's an emergency with water damage risk, please call (480) 255-5887 immediately for our emergency service!"
      },
      painting: {
        keywords: ['paint', 'painting', 'painter', 'color', 'wall', 'walls', 'ceiling', 'trim', 'primer', 'finish', 'texture', 'stain', 'varnish', 'exterior', 'interior', 'touch up', 'refresh'],
        response: "Transform your space with professional painting! We offer interior and exterior painting, wall texture repair, trim painting, ceiling painting, staining, and specialty finishes. We use premium paints designed for Arizona's climate and provide color consultation.",
        followUp: "Are you thinking interior, exterior, or both? How many rooms or what's the approximate square footage? Any specific color ideas in mind?"
      },
      drywall: {
        keywords: ['drywall', 'sheetrock', 'wall repair', 'hole', 'holes', 'crack', 'cracks', 'patch', 'patching', 'texture', 'mud', 'tape', 'joint compound', 'nail holes', 'ding', 'dent'],
        response: "Drywall and wall repairs are our specialty! We handle small nail holes, large wall damage, crack repairs, texture matching, water damage repairs, and complete drywall installation. Perfect prep work for painting included.",
        followUp: "What size repair are we looking at - small nail holes, larger damage, or new installation? Do you need texture matching for the existing wall?"
      },
      flooring: {
        keywords: ['floor', 'flooring', 'tile', 'hardwood', 'laminate', 'vinyl', 'carpet', 'lvp', 'installation', 'repair', 'refinish', 'grout', 'baseboard', 'molding', 'transition'],
        response: "Beautiful flooring transforms any space! We install and repair tile, hardwood, laminate, luxury vinyl plank (LVP), and handle all the prep work, underlayment, trim, and finishing touches. From bathrooms to entire homes.",
        followUp: "What type of flooring are you considering? What's the approximate square footage? Is this a full installation or repair work?"
      },
      hvac: {
        keywords: ['hvac', 'air conditioning', 'ac', 'heater', 'heating', 'cooling', 'thermostat', 'filter', 'vent', 'vents', 'ductwork', 'furnace', 'unit', 'temperature', 'airflow'],
        response: "HVAC maintenance and minor repairs keep you comfortable year-round! We handle thermostat installation, air filter replacement, vent cleaning, minor ductwork repairs, and maintenance. For major HVAC work, we partner with licensed HVAC contractors.",
        followUp: "Is your system not cooling/heating properly, or are you looking for maintenance? Any specific issues with airflow or temperature control?"
      },
      general: {
        keywords: ['handyman', 'repair', 'fix', 'install', 'installation', 'assembly', 'furniture', 'shelf', 'shelves', 'door', 'window', 'fence', 'deck', 'maintenance', 'odd jobs', 'honey do'],
        response: "General handyman services - we do it all! Furniture assembly, shelf installation, door and window repairs, fence repairs, deck maintenance, cabinet installation, closet organization, garage storage, and all those 'honey-do' list items.",
        followUp: "What specific project do you have in mind? I can give you a better idea of timeline and cost based on the details."
      },
      emergency: {
        keywords: ['emergency', 'urgent', 'asap', 'immediate', 'now', 'today', 'flooding', 'burst pipe', 'no power', 'sparking', 'gas smell', 'water damage'],
        response: "🚨 EMERGENCY SERVICE AVAILABLE 24/7! For immediate urgent repairs call (480) 255-5887 right now. We provide emergency response for plumbing leaks, electrical hazards, security issues, and other urgent situations that can't wait.",
        followUp: "Is this a current emergency requiring immediate attention? If so, please call (480) 255-5887 now. If it's for future reference, I can explain what qualifies for emergency service."
      }
    },

    // Common problem descriptions
    problemDescriptions: {
      electrical: [
        'outlet not working', 'lights flickering', 'breaker tripping', 'no power', 'sparking',
        'light switch not working', 'ceiling fan wobbling', 'dimmer buzzing', 'burnt smell',
        'shock from outlet', 'electrical panel buzzing'
      ],
      plumbing: [
        'toilet running', 'faucet dripping', 'low water pressure', 'drain slow', 'toilet clogged',
        'garbage disposal not working', 'water heater not heating', 'pipe leak', 'flooding',
        'sewer smell', 'no hot water', 'toilet loose'
      ],
      general: [
        'door sticking', 'window won\'t open', 'squeaky hinges', 'loose handle', 'cabinet door sagging',
        'shelf falling', 'hole in wall', 'crack in ceiling', 'paint peeling', 'tile loose'
      ]
    }
  };

  // Chatbot Action Links System
  const chatbotLinks = {
    quoteRequest: {
      text: "🔗 Get Free Quote",
      action: () => {
        // Trigger lead collection instead of page navigation
        setLeadData(prev => ({
          ...prev,
          collectingLead: true,
          currentField: 'customerName'
        }));

        // Add a message to the chat to start lead collection
        const leadMessage = {
          text: "Great! I'd love to help you get a free quote. To connect you with our team, I'll need to collect some basic information.\n\nFirst, what's your name?",
          sender: 'bot',
          timestamp: new Date().toISOString(),
          id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        };

        setChatMessages(prev => [...prev, leadMessage]);
      },
      description: "Request a detailed free estimate for your project"
    },
    emergencyService: {
      text: "🚨 Emergency Service",
      action: () => window.open('tel:+14802555887', '_self'),
      description: "Call (480) 255-5887 for immediate emergency assistance"
    },
    contactUs: {
      text: "📞 Contact Us",
      action: () => {
        setCurrentPage('home');
        setTimeout(() => {
          const contactSection = document.getElementById('contact');
          if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      },
      description: "Go to our contact form and information"
    },
    viewServices: {
      text: "🔧 View All Services",
      action: () => setCurrentPage('services'),
      description: "Browse our complete list of handyman services"
    },
    workWithUs: {
      text: "💼 Work With Us",
      action: () => setCurrentPage('work-with-us'),
      description: "Join our team of professional handymen"
    },
    aboutUs: {
      text: "ℹ️ About Us",
      action: () => setCurrentPage('about'),
      description: "Learn more about The Scottsdale Handyman"
    },
    scheduleService: {
      text: "📅 Schedule Service",
      action: () => {
        // Trigger lead collection for scheduling
        setLeadData(prev => ({
          ...prev,
          collectingLead: true,
          currentField: 'customerName'
        }));

        // Add a message to the chat to start lead collection
        const leadMessage = {
          text: "Perfect! I'll help you schedule a service appointment. To get started, I'll need to collect some information.\n\nFirst, what's your name?",
          sender: 'bot',
          timestamp: new Date().toISOString(),
          id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        };

        setChatMessages(prev => [...prev, leadMessage]);
      },
      description: "Book an appointment for non-emergency services"
    },
    emailUs: {
      text: "✉️ Email Us",
      action: () => {
        const email = 'help.scottsdalehandyman@gmail.com';
        const subject = 'Service Inquiry from Website Chat';

        // Try to copy to clipboard first
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(email).then(() => {
            const userChoice = confirm(`📧 Email copied to clipboard: ${email}\n\nClick OK to open your email app, or Cancel to just use the copied email address.`);
            if (userChoice) {
              window.open(`mailto:${email}?subject=${encodeURIComponent(subject)}`, '_self');
            }
          }).catch(() => {
            // If clipboard fails, just open mailto
            window.open(`mailto:${email}?subject=${encodeURIComponent(subject)}`, '_self');
          });
        } else {
          // Fallback for older browsers
          window.open(`mailto:${email}?subject=${encodeURIComponent(subject)}`, '_self');
        }
      },
      description: "Send us an email at help.scottsdalehandyman@gmail.com"
    }
  };

  // Quick Reply Carousel Options
  const quickReplies = {
    greeting: [
      { text: "⚡ Electrical Issues", action: "electrical problems" },
      { text: "🔧 Plumbing Help", action: "plumbing repair" },
      { text: "🎨 Painting Project", action: "painting service" },
      { text: "🔨 General Repairs", action: "handyman repairs" },
      { text: "💰 Get Pricing", action: "pricing information" },
      { text: "📅 Schedule Now", action: "schedule appointment" }
    ],
    electrical: [
      { text: "💡 Lights/Fixtures", action: "light fixture installation" },
      { text: "🔌 Outlets/Switches", action: "outlet installation" },
      { text: "🌀 Ceiling Fans", action: "ceiling fan installation" },
      { text: "⚡ Circuit Issues", action: "electrical circuit repair" },
      { text: "🚨 Emergency", action: "electrical emergency" }
    ],
    plumbing: [
      { text: "🚿 Faucet/Shower", action: "faucet repair" },
      { text: "🚽 Toilet Issues", action: "toilet repair" },
      { text: "💧 Leaks", action: "pipe leak repair" },
      { text: "🗑️ Disposal", action: "garbage disposal" },
      { text: "🚨 Emergency", action: "plumbing emergency" }
    ],
    painting: [
      { text: "🏠 Interior", action: "interior painting" },
      { text: "🏡 Exterior", action: "exterior painting" },
      { text: "🖌️ Touch-ups", action: "paint touch up" },
      { text: "🎨 Full Room", action: "room painting" },
      { text: "📏 Get Quote", action: "painting quote" }
    ],
    general: [
      { text: "🚪 Doors/Windows", action: "door repair" },
      { text: "📦 Assembly", action: "furniture assembly" },
      { text: "📚 Shelving", action: "shelf installation" },
      { text: "🔧 Maintenance", action: "home maintenance" },
      { text: "❓ Other", action: "other repairs" }
    ],
    pricing: [
      { text: "⚡ Electrical Rates", action: "electrical pricing" },
      { text: "🔧 Plumbing Rates", action: "plumbing pricing" },
      { text: "🎨 Painting Rates", action: "painting pricing" },
      { text: "📋 Free Estimate", action: "free estimate" },
      { text: "⏰ Hourly Rates", action: "hourly pricing" }
    ],
    followup: [
      { text: "💰 How Much?", action: "pricing information" },
      { text: "📅 When Available?", action: "schedule appointment" },
      { text: "📞 Call Me", action: "contact phone" },
      { text: "📋 Get Quote", action: "free estimate" },
      { text: "🚨 Emergency?", action: "emergency service" }
    ]
  };

  // Handle quick reply selection
  const handleQuickReply = (replyText) => {
    console.log('🎯 App handleQuickReply called with:', replyText);

    if (!replyText || typeof replyText !== 'string') {
      console.warn('⚠️ Invalid replyText in handleQuickReply');
      return;
    }

    const userMessage = {
      sender: 'user',
      text: replyText,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatTyping(true);

    // Process the quick reply as a regular message
    setTimeout(() => {
      try {
        const responseText = generateChatResponse(replyText, chatContext);
        const botResponse = {
          sender: 'bot',
          text: responseText || "I apologize, but I'm having trouble processing your request. Could you please try again or contact us at (480) 255-5887?",
          timestamp: new Date()
        };

        setChatMessages(prev => [...prev, botResponse]);
      } catch (error) {
        console.error('❌ Error in handleQuickReply:', error);
        const errorResponse = {
          sender: 'bot',
          text: "I apologize, but I'm experiencing technical difficulties. Please contact us directly at (480) 255-5887 for immediate assistance.",
          timestamp: new Date()
        };
        setChatMessages(prev => [...prev, errorResponse]);
      } finally {
        setChatTyping(false);
      }
    }, 800);
  };

  // Generate action buttons for chatbot responses
  const generateActionButtons = (linkKeys) => {
    if (!linkKeys || linkKeys.length === 0) return null;

    return linkKeys.map(key => {
      const link = chatbotLinks[key];
      if (!link) return null;

      return {
        text: link.text,
        action: link.action,
        description: link.description
      };
    }).filter(Boolean);
  };

  // Log chat conversation to email
  const logChatConversation = async (trigger = 'conversation_end') => {
    try {
      // Only log if there are meaningful messages (more than just the greeting)
      if (chatMessages.length <= 1) return;

      const response = await fetch('/api/chatbot-log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationId: chatSessionId,
          messages: chatMessages,
          trigger: trigger,
          userInfo: {
            timestamp: new Date().toISOString(),
            lastService: chatContext.lastService,
            conversationStage: chatContext.conversationStage
          }
        })
      });

      if (!response.ok) {
        console.warn('Failed to log chat conversation');
      }
    } catch (error) {
      console.warn('Error logging chat conversation:', error);
    }
  };

  // Grok AI Fallback Integration
  const getGrokResponse = async (userMessage, conversationHistory, context) => {
    try {
      console.log('🤖 Calling Grok API for:', userMessage);

      // Prepare context for Grok
      const systemPrompt = `You are a helpful AI assistant for Scottsdale Handyman Solutions, a professional handyman service in Scottsdale, Arizona. 

BUSINESS DETAILS:
- Phone: (480) 255-5887
- Email: help.scottsdalehandyman@gmail.com
- Service Area: Scottsdale, Paradise Valley, Fountain Hills, North Phoenix/Tempe
- Hours: Mon-Sat 7AM-6PM, 24/7 emergency
- Services: Electrical, plumbing, repairs, installations, painting, drywall, HVAC service, pool equipment, desert home specialties

CONVERSATION CONTEXT:
${context.conversationStage ? `Current stage: ${context.conversationStage}` : ''}
${context.lastService ? `Last discussed service: ${context.lastService}` : ''}

Keep responses helpful, professional, and focused on handyman services. Always encourage contacting the business for quotes and scheduling. Be conversational and remember the context of previous messages.`;

      const messages = [
        { role: 'system', content: systemPrompt },
        ...conversationHistory.slice(-4), // Last 4 messages for context
      ];

      // Note: In production, you would use actual Grok API credentials
      // For now, we'll simulate Grok with enhanced local AI
      const grokResponse = await simulateGrokResponse(userMessage, messages, context);

      return grokResponse;
    } catch (error) {
      console.error('❌ Grok API error:', error);
      throw error;
    }
  };

  // Enhanced AI simulation (placeholder for actual Grok integration)
  const simulateGrokResponse = async (userMessage, messages, context) => {
    // This simulates a more intelligent AI response
    const message = userMessage.toLowerCase();

    // Context-aware responses
    if (context.conversationHistory && context.conversationHistory.length > 2) {
      const recentMessages = context.conversationHistory.slice(-3);
      const hasAskedAboutPricing = recentMessages.some(msg =>
        msg.content && msg.content.toLowerCase().includes('price') ||
        msg.content && msg.content.toLowerCase().includes('cost')
      );

      if (hasAskedAboutPricing && message.includes('when')) {
        return "Since we discussed pricing, let me help with scheduling! We typically book handyman services 2-5 days out, with same-day emergency available. For the services we discussed, I recommend calling (480) 255-5887 to check our current availability and lock in a time that works for you. What time of day generally works best?";
      }

      const hasDiscussedService = recentMessages.some(msg =>
        msg.content && (msg.content.toLowerCase().includes('electrical') ||
          msg.content.toLowerCase().includes('plumbing') ||
          msg.content.toLowerCase().includes('repair'))
      );

      if (hasDiscussedService && message.includes('also') || message.includes('additionally')) {
        return "Absolutely! Many customers bundle multiple services together - it's more efficient and often more cost-effective. We can handle multiple handyman tasks in one visit. What additional services are you thinking about? I can help coordinate everything for a comprehensive home improvement session.";
      }
    }

    // Complex query handling
    if (message.length > 100 || message.split(' ').length > 15) {
      return "That's a detailed question - I appreciate the context! For complex projects like this, our handyman team would benefit from discussing this directly with you to ensure we address every aspect properly. Would you like to schedule a free consultation call at (480) 255-5887? Our team can walk through your specific situation and provide expert recommendations tailored to your needs.";
    }

    // Follow-up questions
    if (message.match(/\b(but|however|what about|though|although)\b/)) {
      return "Great follow-up question! I want to make sure I give you the most accurate information for your specific situation. These details matter a lot for handyman work. Would it be helpful if I have one of our experienced technicians give you a quick call to discuss the specifics? They can provide expert insight that's tailored exactly to your project.";
    }

    // Default enhanced response
    return "That's a great question about handyman services! While I try to be as helpful as possible, some situations benefit from our team's hands-on expertise. I'd love to connect you with our Scottsdale handyman professionals who can give you detailed, personalized advice. Would you prefer a phone consultation at (480) 255-5887 or should I have them email you at the address you prefer?";
  };

  // Lead Collection Handler
  const handleLeadCollection = async (userMessage) => {
    const { currentField } = leadData;
    let response = "";
    let nextField = null;

    switch (currentField) {
      case 'customerName':
        if (userMessage.trim().length > 1) {
          setLeadData(prev => ({
            ...prev,
            customerName: userMessage.trim(),
            currentField: 'phoneNumber'
          }));
          response = `Thanks, ${userMessage.trim()}! Now I'll need your phone number so our team can contact you.`;
        } else {
          response = "Please provide your full name so we can properly assist you.";
        }
        break;

      case 'phoneNumber':
        const phoneRegex = /[\d\s\-\(\)\.]{10,}/;
        if (phoneRegex.test(userMessage)) {
          setLeadData(prev => ({
            ...prev,
            phoneNumber: userMessage.trim(),
            currentField: 'address'
          }));
          response = "Perfect! What's the address where the work needs to be done? (This helps us provide accurate estimates and scheduling)";
        } else {
          response = "Please provide a valid phone number (with area code) so our team can reach you.";
        }
        break;

      case 'address':
        setLeadData(prev => ({
          ...prev,
          address: userMessage.trim(),
          currentField: 'scopeOfWork'
        }));
        response = "Great! Now, please describe what kind of handyman work you need done. Be as specific as possible - what needs to be fixed, installed, or repaired?";
        break;

      case 'scopeOfWork':
        setLeadData(prev => ({
          ...prev,
          scopeOfWork: userMessage.trim(),
          currentField: 'notes'
        }));
        response = "Excellent! Is there anything else you'd like to add? Any special requirements, timeline preferences, or additional details?";
        break;

      case 'notes':
        const finalLeadData = {
          ...leadData,
          notes: userMessage.trim(),
          collectingLead: false,
          currentField: null
        };

        // Submit the lead
        try {
          const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3002';
          const response = await fetch(`${apiUrl}/api/submit-lead`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              customerName: finalLeadData.customerName,
              phoneNumber: finalLeadData.phoneNumber,
              address: finalLeadData.address,
              scopeOfWork: finalLeadData.scopeOfWork,
              notes: finalLeadData.notes,
              conversationId: chatSessionId,
              timestamp: new Date().toISOString()
            }),
          });

          if (response.ok) {
            // Reset lead data
            setLeadData({
              customerName: '',
              phoneNumber: '',
              address: '',
              scopeOfWork: '',
              notes: '',
              collectingLead: false,
              currentField: null
            });

            return `Perfect! ✅ I've successfully submitted your information to our team:\n\n` +
              `📋 **Your Request Summary:**\n` +
              `• Name: ${finalLeadData.customerName}\n` +
              `• Phone: ${finalLeadData.phoneNumber}\n` +
              `• Address: ${finalLeadData.address}\n` +
              `• Work Needed: ${finalLeadData.scopeOfWork}\n` +
              `${finalLeadData.notes ? `• Notes: ${finalLeadData.notes}\n` : ''}` +
              `\n🚀 **Next Steps:**\n` +
              `• Our team will review your request\n` +
              `• We'll contact you within 2 hours (weekdays)\n` +
              `• Free estimate will be provided\n\n` +
              `📞 **Need immediate help?** Call (480) 255-5887\n\n` +
              `Thank you for choosing Scottsdale Handyman Solutions!`;
          } else {
            throw new Error('Failed to submit lead');
          }
        } catch (error) {
          console.error('Lead submission error:', error);

          // Reset lead collection state
          setLeadData({
            customerName: '',
            phoneNumber: '',
            address: '',
            scopeOfWork: '',
            notes: '',
            collectingLead: false,
            currentField: null
          });

          return `I apologize, but there was an issue submitting your information. Please call us directly at (480) 255-5887 or email help.scottsdalehandyman@gmail.com with these details:\n\n` +
            `• Name: ${finalLeadData.customerName}\n` +
            `• Phone: ${finalLeadData.phoneNumber}\n` +
            `• Address: ${finalLeadData.address}\n` +
            `• Work Needed: ${finalLeadData.scopeOfWork}\n` +
            `${finalLeadData.notes ? `• Notes: ${finalLeadData.notes}` : ''}`;
        }
        break;

      default:
        // Reset if something went wrong
        setLeadData({
          customerName: '',
          phoneNumber: '',
          address: '',
          scopeOfWork: '',
          notes: '',
          collectingLead: false,
          currentField: null
        });
        response = "Let me start over. What's your name?";
        setLeadData(prev => ({
          ...prev,
          collectingLead: true,
          currentField: 'customerName'
        }));
    }

    return response;
  };

  // Fallback response when all else fails
  const generateFallbackResponse = (userMessage, context) => {
    const responses = [
      "I want to give you the best help possible! For questions like this, our experienced handyman team can provide much better guidance than I can. Would you like to call (480) 255-5887 or should I have them reach out to you?",

      "That's exactly the kind of detailed question our Scottsdale handyman experts love to tackle! Rather than guess, let me connect you with someone who can give you accurate, professional advice. What's the best way to reach you - phone or email?",

      "You know what? This deserves a proper answer from our professional team rather than my best guess. Our experienced handymen have solved thousands of similar challenges in Scottsdale homes. Can I have them give you a call to discuss this properly?"
    ];

    const response = responses[Math.floor(Math.random() * responses.length)];
    context.actionButtons = generateActionButtons(['contactUs', 'quoteRequest', 'emailUs']);
    return response;
  };

  // Advanced NLP Response Generator with Enhanced Scottsdale Local Content
  const generateChatResponse = async (userMessage, context = {}) => {
    console.log('🎯 generateChatResponse called with:', {
      userMessage,
      type: typeof userMessage,
      length: userMessage?.length,
      context,
      chatHistory: chatMessages.slice(-5) // Show last 5 messages for context
    });

    const message = userMessage.toLowerCase();
    console.log('🔍 Processing message:', message);

    // LEAD COLLECTION LOGIC - Priority handling
    if (leadData.collectingLead) {
      return handleLeadCollection(userMessage);
    }

    // Check if user wants to get a quote or schedule service - triggers lead collection
    if (message.match(/\b(quote|estimate|schedule|appointment|service|get started|hire|book|contact me|call me|interested|need work done|project)\b/)) {
      const leadTriggers = ['quote', 'estimate', 'schedule', 'appointment', 'hire', 'book', 'get started', 'interested'];
      if (leadTriggers.some(trigger => message.includes(trigger))) {
        setLeadData(prev => ({
          ...prev,
          collectingLead: true,
          currentField: 'customerName'
        }));

        return "Great! I'd love to help connect you with our handyman team. To get started, I'll need to collect some basic information.\n\nFirst, what's your name?";
      }
    }

    let response = "";
    let newContext = { ...chatContext };
    let confidence = 0;
    let matchedService = null;

    // Build conversation history for context
    const conversationHistory = chatMessages.slice(-6).map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text
    }));

    // Add current message to history
    conversationHistory.push({
      role: 'user',
      content: userMessage
    });

    // Enhanced context tracking
    newContext.conversationHistory = conversationHistory;
    newContext.messageCount = (newContext.messageCount || 0) + 1;
    newContext.lastUserMessage = userMessage;
    newContext.timestamp = new Date().toISOString();

    // Advanced keyword matching with scoring
    const scoreMatch = (text, keywords) => {
      const words = text.split(/\s+/);
      let score = 0;
      keywords.forEach(keyword => {
        if (text.includes(keyword.toLowerCase())) {
          // Exact match gets higher score
          score += keyword.length;
          // Bonus for multiple word matches
          if (keyword.includes(' ')) score += 5;
        }
      });
      return score;
    };

    // Scottsdale-specific location detection
    const scottsdaleAreas = [
      'scottsdale', 'paradise valley', 'fountain hills', 'tempe', 'phoenix', 'mesa',
      'cave creek', 'carefree', 'rio verde', 'mccormick ranch', 'gainey ranch',
      'dc ranch', 'grayhawk', 'kierland', 'north scottsdale', 'old town scottsdale',
      'south scottsdale', 'desert ridge', 'ahwatukee'
    ];

    const isLocalArea = scottsdaleAreas.some(area => message.includes(area));
    const hasLocationContext = isLocalArea || message.includes('arizona') || message.includes('az');

    // Check for service matches
    Object.entries(handymanKnowledgeBase.services).forEach(([service, data]) => {
      const score = scoreMatch(message, data.keywords);
      if (score > confidence) {
        confidence = score;
        matchedService = service;
      }
    });

    // Quick Action specific responses with enhanced local context
    if (message === 'i have an emergency repair needed') {
      response = "🚨 SCOTTSDALE EMERGENCY SERVICE - AVAILABLE NOW!\n\nImmediate 24/7 response for:\n• Water leaks & pipe bursts\n• Electrical hazards & outages\n• Lock-outs & security breaches\n• HVAC failures (critical in AZ heat!)\n• Storm damage repairs\n\n📞 CALL EMERGENCY LINE: (480) 255-5887\n🚗 Average response time: 45-90 minutes\n\nServing all Scottsdale areas including Paradise Valley, Fountain Hills, and North Phoenix. What's your emergency?";
      newContext.conversationStage = 'emergency';
      newContext.actionButtons = generateActionButtons(['emergencyService', 'contactUs']);
    }
    else if (message === 'i need a free quote for my project') {
      // Start lead collection for quote requests
      setLeadData(prev => ({
        ...prev,
        collectingLead: true,
        currentField: 'customerName'
      }));

      response = "💰 FREE SCOTTSDALE HANDYMAN QUOTE!\n\nI'd love to connect you with our team for a personalized quote. To get started, I'll need to collect some basic information.\n\nFirst, what's your name?";
      newContext.conversationStage = 'quote_request';
    }
    else if (message === 'what services do you offer?') {
      response = "🔧 COMPLETE SCOTTSDALE HANDYMAN SERVICES:\n\n⚡ ELECTRICAL:\n• Ceiling fans (essential for AZ!)\n• Outlets & switches\n• Light fixtures\n• Electrical troubleshooting\n\n🚿 PLUMBING:\n• Faucet & toilet repairs\n• Water heater service\n• Leak detection\n• Pipe insulation\n\n🏠 HOME REPAIRS:\n• Drywall & stucco patching\n• Tile repair & replacement\n• Door & window adjustments\n• Weather stripping\n\n🌵 DESERT HOME SPECIALS:\n• Pool equipment repairs\n• Outdoor fixture installation\n• Monsoon prep & repairs\n• Energy efficiency upgrades\n\nWhat specific service interests you?";
      newContext.conversationStage = 'service_overview';
      newContext.actionButtons = generateActionButtons(['quoteRequest', 'viewServices', 'contactUs']);
    }
    else if (message === 'how can i contact you?') {
      response = "📞 SCOTTSDALE HANDYMAN CONTACT:\n\n🔥 Main: (480) 255-5887\n📧 Email: help.scottsdalehandyman@gmail.com\n� Text: Same number for quick response\n\n⏰ HOURS:\n• Mon-Sat: 7AM-6PM\n• Emergency: 24/7 available\n• Sunday: Emergency only\n\n🗺️ SERVICE AREA:\n• All of Scottsdale\n• Paradise Valley\n• Fountain Hills\n• North Phoenix/Tempe\n\n✅ GUARANTEED:\n• Response within 2 hours (weekdays)\n• Licensed, bonded & insured\n• Upfront pricing\n\nPrefer call, text, or email?";
      newContext.conversationStage = 'contact';
      newContext.actionButtons = generateActionButtons(['contactUs', 'emailUs', 'emergencyService']);
    }
    // Enhanced greeting responses with local awareness
    else if (message.match(/\b(hello|hi|hey|good morning|good afternoon|good evening|howdy|greetings)\b/)) {
      const localGreetings = [
        `Hi! I'm your Scottsdale handyman AI assistant. ${hasLocationContext ? 'Great, I see you\'re in our service area!' : ''} What needs fixing or installing today?`,
        `Hello! Welcome to Scottsdale's trusted handyman service. What project can I help with - electrical, plumbing, repairs, or installation?`,
        `Hey there! Beautiful day in the desert! Tell me about your handyman needs - what's broken or what would you like upgraded?`
      ];
      response = localGreetings[Math.floor(Math.random() * localGreetings.length)];
      newContext.conversationStage = 'engaged';
      newContext.actionButtons = generateActionButtons(['quoteRequest', 'viewServices', 'emergencyService']);
      // Remove reference to undefined quickReplies
    }

    // Pricing and cost inquiries
    else if (message.match(/\b(price|cost|pricing|rates?|charge|charges|expensive|cheap|budget|money|pay|payment|fees?|estimate|quote|service|services|how much|much)\b/)) {
      response = "💰 SCOTTSDALE HANDYMAN PRICING:\n\n🎯 **STANDARD RATES:**\n• General Handyman: $85/hour\n• Electrical Work: $125/hour  \n• Plumbing Repairs: $95/hour\n• Painting: $200-400/room\n• Drywall Repair: $85/hour\n• HVAC Service: $125/hour\n\n✅ **WHAT'S INCLUDED:**\n• Free estimates for jobs over $200\n• Upfront pricing - no surprises\n• Licensed, bonded & insured\n• 1-year warranty on workmanship\n• Same-day service available\n\n📋 **FOR ACCURATE PRICING:**\nWhat specific project are you considering? I can connect you with our team for a detailed, free estimate!";
      newContext.conversationStage = 'pricing_inquiry';
      newContext.actionButtons = generateActionButtons(['quoteRequest', 'scheduleService', 'contactUs']);
    }

    // General repair inquiries  
    else if (message.match(/\b(repair|repairs|fix|fixing|broken|replace|replacement)\b/) && !matchedService) {
      response = "🔧 REPAIR SERVICES AVAILABLE!\n\nI can help you with repairs! We handle:\n\n• **Electrical:** Outlets, switches, lights, fans\n• **Plumbing:** Faucets, toilets, leaks, clogs  \n• **Walls:** Holes, cracks, texture, painting\n• **Doors/Windows:** Adjustments, weather stripping\n• **Flooring:** Tile, wood, vinyl repairs\n• **General:** Furniture, cabinets, shelves\n\nWhat specifically needs repair? The more details you provide, the better I can help estimate the job!";
      newContext.conversationStage = 'repair_inquiry';
      newContext.actionButtons = generateActionButtons(['quoteRequest', 'viewServices', 'contactUs']);
    }

    // Service-specific responses with high confidence
    else if (matchedService && confidence > 5) {
      const serviceData = handymanKnowledgeBase.services[matchedService];

      // Shortened, fact-finding responses
      const shortResponses = {
        electrical: "I can help with electrical work. What specifically needs attention - outlets, lights, switches, or circuit issues?",
        plumbing: "Plumbing problems covered! Is this a leak, clog, installation, or repair? Where's the issue located?",
        painting: "Paint projects are our specialty. Interior or exterior? How many rooms or approximate square footage?",
        drywall: "Drywall and wall repairs handled daily. Small holes, large damage, or new installation? Which room?",
        flooring: "Flooring installations and repairs available. What type - tile, hardwood, laminate? What's the square footage?",
        hvac: "HVAC maintenance and minor repairs covered. Is your system not cooling/heating properly or need maintenance?",
        general: "General handyman services available. What specific task - assembly, installation, or repair? Where?",
        emergency: "🚨 Emergency service available 24/7! What's the urgent issue? Call (480) 255-5887 for immediate help."
      };

      response = shortResponses[matchedService] || serviceData.response;
      newContext.lastService = matchedService;
      newContext.conversationStage = 'service_details';

      // Add quick replies based on service type
      if (matchedService === 'electrical') {
        newContext.quickReplies = quickReplies.electrical;
      } else if (matchedService === 'plumbing') {
        newContext.quickReplies = quickReplies.plumbing;
      } else if (matchedService === 'painting') {
        newContext.quickReplies = quickReplies.painting;
      } else if (matchedService === 'general') {
        newContext.quickReplies = quickReplies.general;
      }

      // Add action buttons based on service type
      if (matchedService === 'emergency') {
        newContext.actionButtons = generateActionButtons(['emergencyService', 'contactUs']);
      } else {
        newContext.actionButtons = generateActionButtons(['quoteRequest', 'scheduleService', 'contactUs']);
      }
    }

    // Enhanced context-aware follow-up responses with conversation memory
    else if (newContext.conversationHistory && newContext.conversationHistory.length > 2) {
      const recentMessages = newContext.conversationHistory.slice(-4);
      const hasDiscussedService = recentMessages.some(msg =>
        msg.content && (msg.content.toLowerCase().includes('electrical') ||
          msg.content.toLowerCase().includes('plumbing') ||
          msg.content.toLowerCase().includes('repair') ||
          msg.content.toLowerCase().includes('install'))
      );

      const hasAskedAboutPricing = recentMessages.some(msg =>
        msg.content && (msg.content.toLowerCase().includes('price') ||
          msg.content.toLowerCase().includes('cost') ||
          msg.content.toLowerCase().includes('how much'))
      );

      // Context-based follow-up responses
      if (context.conversationStage === 'service_details' && context.lastService) {
        if (message.match(/\b(small|minor|quick|little|tiny|simple)\b/)) {
          response = `Got it, a smaller ${context.lastService} job! These typically take 1-3 hours and range from $150-400. Based on our conversation, sounds like a straightforward project. Would you like me to connect you with our team for a free estimate?`;
          newContext.conversationStage = 'ready_to_book';
          newContext.actionButtons = generateActionButtons(['quoteRequest', 'contactUs', 'scheduleService']);
        } else if (message.match(/\b(large|major|big|huge|extensive|complete|full)\b/)) {
          response = `Sounds like a bigger ${context.lastService} project! For larger jobs like this, we always provide detailed free estimates. I can tell from our conversation this needs proper planning. Would you like to schedule an in-person consultation?`;
          newContext.conversationStage = 'ready_to_book';
          newContext.actionButtons = generateActionButtons(['quoteRequest', 'scheduleService', 'contactUs']);
        } else if (message.match(/\b(room|rooms|bathroom|kitchen|bedroom|living room|square feet|sq ft)\b/)) {
          response = `Perfect! Room details really help with ${context.lastService} estimates. From what we've discussed, this sounds like a solid project scope. Would you like me to have our team call you for a detailed quote based on these specifics?`;
          newContext.conversationStage = 'ready_to_book';
          newContext.actionButtons = generateActionButtons(['quoteRequest', 'contactUs', 'emailUs']);
        }
      }
      // Cross-referencing previous conversation topics  
      else if (hasDiscussedService && message.match(/\b(also|additionally|and|plus|too|as well)\b/)) {
        response = "Great! I see you're thinking about multiple services. Many customers bundle projects together - it's more efficient and often more cost-effective. We can handle multiple handyman tasks in one visit. What additional services are you considering? I can help coordinate everything.";
        newContext.conversationStage = 'multiple_services';
        newContext.actionButtons = generateActionButtons(['quoteRequest', 'viewServices', 'contactUs']);
      }
      else if (hasAskedAboutPricing && message.match(/\b(when|schedule|available|timing|appointment)\b/)) {
        response = "Perfect timing question! Since we discussed pricing, let me help with scheduling. We typically book handyman services 2-5 days out, with same-day emergency available. For the services we talked about, I recommend calling (480) 255-5887 to check our current availability. What time of day generally works best for you?";
        newContext.conversationStage = 'scheduling_after_pricing';
        newContext.actionButtons = generateActionButtons(['scheduleService', 'contactUs', 'emergencyService']);
      }
      else if (message.match(/\b(but|however|what about|though|although)\b/)) {
        response = "I appreciate the follow-up question! These details matter a lot for handyman work. From our conversation, I can tell you're thinking this through carefully. Would it be helpful if one of our experienced technicians gave you a quick call to discuss these specifics? They can provide expert insight tailored to your situation.";
        newContext.conversationStage = 'detailed_consultation';
        newContext.actionButtons = generateActionButtons(['contactUs', 'quoteRequest', 'scheduleService']);
      }
    }
    // Original context-aware follow-up for backward compatibility
    else if (context.conversationStage === 'service_details' && context.lastService) {
      if (message.match(/\b(small|minor|quick|little|tiny|simple)\b/)) {
        response = `Got it, a smaller ${context.lastService} job! These typically take 1-3 hours and range from $150-400. Would you like me to connect you with our team for a free estimate?`;
        newContext.conversationStage = 'ready_to_book';
        newContext.actionButtons = generateActionButtons(['quoteRequest', 'contactUs', 'scheduleService']);
        newContext.quickReplies = quickReplies.followup;
      } else if (message.match(/\b(large|major|big|huge|extensive|complete|full)\b/)) {
        response = `Sounds like a bigger ${context.lastService} project! For larger jobs, we always provide detailed free estimates. Would you like to schedule an in-person consultation?`;
        newContext.conversationStage = 'ready_to_book';
        newContext.actionButtons = generateActionButtons(['quoteRequest', 'scheduleService', 'contactUs']);
        newContext.quickReplies = quickReplies.followup;
      } else if (message.match(/\b(room|rooms|bathroom|kitchen|bedroom|living room|square feet|sq ft)\b/)) {
        response = `Thanks for the room details! For ${context.lastService} work, room-by-room pricing helps us give accurate estimates. Would you like me to have our team call you for a detailed quote?`;
        newContext.conversationStage = 'ready_to_book';
        newContext.actionButtons = generateActionButtons(['quoteRequest', 'contactUs', 'emailUs']);
        newContext.quickReplies = quickReplies.followup;
      }
    }

    // Pricing inquiries
    else if (message.match(/\b(price|cost|rate|charge|how much|expensive|cheap|budget|afford)\b/)) {
      response = "Pricing: $75-150/hour depending on complexity. Most jobs include FREE estimates. What type of project and approximate size?";
      newContext.conversationStage = 'pricing';
      newContext.actionButtons = generateActionButtons(['quoteRequest', 'contactUs', 'viewServices']);
      newContext.quickReplies = quickReplies.pricing;
    }

    // Scheduling inquiries  
    else if (message.match(/\b(schedule|appointment|available|when|book|timing|today|tomorrow|this week)\b/)) {
      response = "Available Mon-Sat 7AM-6PM, 24/7 emergency. Regular appointments within 2-5 days, priority next-day available. What type of service and preferred timing?";
      newContext.conversationStage = 'scheduling';
      newContext.actionButtons = generateActionButtons(['scheduleService', 'quoteRequest', 'emergencyService']);
    }

    // Location and service area with enhanced local knowledge
    else if (message.match(/\b(area|location|serve|where|travel|distance|phoenix|scottsdale|tempe|mesa|paradise valley|fountain hills|carefree|cave creek|ahwatukee|chandler|gilbert)\b/)) {
      response = "🏜️ SCOTTSDALE HANDYMAN SERVICE AREA:\n\n🎯 PRIMARY ZONES (No travel fee):\n• All of Scottsdale\n• Paradise Valley\n• Fountain Hills\n• North Phoenix/Tempe\n\n🗺️ EXTENDED SERVICE:\n• Mesa, Chandler, Gilbert\n• Cave Creek, Carefree\n• Ahwatukee, Desert Ridge\n• Rio Verde, Queen Creek\n\n💰 Travel fees apply 25+ miles from Scottsdale\n🚗 Average response time: 30-60 minutes\n\n🌵 Desert Home Expertise:\n• Adobe & stucco repairs\n• Pool equipment service\n• HVAC efficiency (critical!)\n• Monsoon damage prevention\n\nWhat area are you located in?";
      newContext.conversationStage = 'location';
      newContext.actionButtons = generateActionButtons(['quoteRequest', 'contactUs']);
    }

    // Seasonal Arizona-specific responses
    else if (message.match(/\b(summer|heat|hot|cooling|air conditioning|ac|hvac|fan|monsoon|storm|winter|cold)\b/)) {
      const currentMonth = new Date().getMonth() + 1; // 1-12
      let seasonResponse = "";

      if (currentMonth >= 5 && currentMonth <= 9) {
        // Summer months (May-September)
        seasonResponse = "🔥 ARIZONA SUMMER SERVICES (May-Sept):\n\n❄️ COOLING PRIORITIES:\n• AC tune-ups & repairs\n• Ceiling fan installation/repair\n• Window treatments for heat\n• Insulation improvements\n\n⚡ HIGH-DEMAND SERVICES:\n• Pool equipment repairs\n• Outdoor misting systems\n• Electrical safety checks\n• Emergency cooling repairs\n\n� Beat the heat with priority scheduling!";
      } else if (currentMonth >= 6 && currentMonth <= 8) {
        // Monsoon season
        seasonResponse = "⛈️ MONSOON SEASON PREP (June-August):\n\n🏠 STORM READINESS:\n• Roof & gutter inspection\n• Window & door sealing\n• Electrical system checks\n• Drainage improvements\n\n� POST-STORM REPAIRS:\n• Water damage restoration\n• Electrical troubleshooting\n• Roof & stucco patching\n• Window/door adjustments";
      } else if (currentMonth >= 10 && currentMonth <= 3) {
        // Cooler months
        seasonResponse = "🌡️ ARIZONA WINTER SERVICES (Oct-March):\n\n🔧 PERFECT WEATHER FOR:\n• Outdoor projects\n• Home improvements\n• Preventive maintenance\n• Major installations\n\n🏠 SEASONAL PREP:\n• Heating system checks\n• Pipe insulation\n• Weather stripping\n• Home efficiency upgrades";
      }

      response = seasonResponse + "\n\nWhat specific service do you need?";
      newContext.conversationStage = 'seasonal_service';
      newContext.actionButtons = generateActionButtons(['quoteRequest', 'emergencyService', 'contactUs']);
    }

    // Contact information
    else if (message.match(/\b(contact|phone|email|call|reach|number)\b/)) {
      response = "Contact: (480) 255-5887 or help.scottsdalehandyman@gmail.com. Response within 2 hours. Prefer phone or email?";
      newContext.conversationStage = 'contact';
      newContext.actionButtons = generateActionButtons(['contactUs', 'emailUs', 'emergencyService']);
    }

    // Quote requests
    else if (message.match(/\b(quote|estimate|free|consultation)\b/)) {
      response = "FREE estimates available - phone, in-home, or photo estimates. What's the project type and approximate scope?";
      newContext.conversationStage = 'quote_request';
      newContext.actionButtons = generateActionButtons(['quoteRequest', 'scheduleService', 'contactUs']);
    }

    // Positive responses
    else if (message.match(/\b(yes|sure|okay|ok|sounds good|let's do it|interested)\b/) && context.conversationStage === 'ready_to_book') {
      response = "Perfect! Choose: Call (480) 255-5887, use the quote button below, or email us. What works best for you?";
      newContext.conversationStage = 'closing';
      newContext.actionButtons = generateActionButtons(['quoteRequest', 'contactUs', 'emailUs']);

      // Log conversation when user shows booking intent
      setTimeout(() => logChatConversation('booking_intent'), 1000);
    }

    // Thank you responses
    else if (message.match(/\b(thank|thanks|appreciate|helpful|great)\b/)) {
      response = "You're very welcome! I'm here to help make your home improvement projects as smooth as possible. Is there anything else you'd like to know, or are you ready to get started?";
    }

    // Negative responses
    else if (message.match(/\b(no|not interested|maybe later|not ready|not now)\b/)) {
      response = "No problem at all! I'm here whenever you're ready. Feel free to ask about any of our services, or just save my info for future projects. We're always happy to help!";
      newContext.conversationStage = 'engaged';
    }

    // Default intelligent response with enhanced term recognition
    else {
      let recognizedTerms = [];
      let specializedServices = [];

      // Check all knowledge base categories
      Object.entries(handymanKnowledgeBase.interiorTerms).forEach(([category, terms]) => {
        terms.forEach(term => {
          if (message.includes(term.toLowerCase())) {
            recognizedTerms.push({ term, category: `interior ${category}` });
          }
        });
      });

      Object.entries(handymanKnowledgeBase.exteriorTerms).forEach(([category, terms]) => {
        terms.forEach(term => {
          if (message.includes(term.toLowerCase())) {
            recognizedTerms.push({ term, category: `exterior ${category}` });
          }
        });
      });

      // Special handling for specific requests
      if (message.includes('countertop') || message.includes('counter top') || message.includes('kitchen counter')) {
        response = `Countertops require specialists for installation. I can help with prep work, plumbing/electrical connections, and backsplash. Need install partners or related services?`;
        newContext.conversationStage = 'specialized_service';
        newContext.actionButtons = generateActionButtons(['quoteRequest', 'contactUs', 'viewServices']);
      }
      else if (message.includes('cabinet') && (message.includes('install') || message.includes('new') || message.includes('replace'))) {
        response = `Cabinet installation available! Kitchen, bathroom, or built-ins? Pre-made or custom? What's the scope?`;
        newContext.conversationStage = 'service_details';
        newContext.lastService = 'cabinet_installation';
        newContext.actionButtons = generateActionButtons(['quoteRequest', 'scheduleService', 'contactUs']);
      }
      else if (message.includes('appliance') && (message.includes('install') || message.includes('hookup') || message.includes('connect'))) {
        response = `Appliance installations covered - dishwashers, disposals, range hoods, etc. Gas appliances require specialists. What appliance?`;
        newContext.conversationStage = 'service_details';
        newContext.lastService = 'appliance_installation';
        newContext.actionButtons = generateActionButtons(['quoteRequest', 'scheduleService', 'contactUs']);
      }
      else if (recognizedTerms.length > 0) {
        const uniqueTerms = [...new Set(recognizedTerms.map(r => r.term))];
        const categories = [...new Set(recognizedTerms.map(r => r.category))];

        response = `Great! I see you're asking about ${uniqueTerms.slice(0, 3).join(', ')}${uniqueTerms.length > 3 ? ` and ${uniqueTerms.length - 3} other items` : ''}. `;

        // Provide specific category responses
        if (recognizedTerms.some(r => r.category.includes('electrical'))) {
          response += `These electrical components are our expertise! What specific electrical work - installation, repair, or upgrade?`;
          newContext.lastService = 'electrical';
          newContext.actionButtons = generateActionButtons(['quoteRequest', 'scheduleService', 'contactUs']);
        } else if (recognizedTerms.some(r => r.category.includes('plumbing'))) {
          response += `Plumbing items we handle regularly! What's the specific issue - leak, installation, or repair?`;
          newContext.lastService = 'plumbing';
          newContext.actionButtons = generateActionButtons(['quoteRequest', 'emergencyService', 'contactUs']);
        } else if (recognizedTerms.some(r => r.category.includes('flooring'))) {
          response += `Flooring projects available! What type and square footage are you considering?`;
          newContext.lastService = 'flooring';
          newContext.actionButtons = generateActionButtons(['quoteRequest', 'scheduleService', 'viewServices']);
        } else if (recognizedTerms.some(r => r.category.includes('walls'))) {
          response += `Wall work specialty! What kind of repair or installation - holes, painting, or trim?`;
          newContext.lastService = 'drywall';
          newContext.actionButtons = generateActionButtons(['quoteRequest', 'scheduleService', 'contactUs']);
        } else {
          response += `We handle these items! What specific project can I help you plan?`;
          newContext.actionButtons = generateActionButtons(['quoteRequest', 'viewServices', 'contactUs']);
        }

        newContext.conversationStage = 'service_details';
      } else {
        response = `I'd help with your "${userMessage}" request! What's the specific project type, location, and scope? More details = better assistance!`;
        newContext.actionButtons = generateActionButtons(['quoteRequest', 'viewServices', 'contactUs']);
      }
    }

    // Update context
    setChatContext(newContext);

    // Grok AI Fallback - if response is generic, user seems confused, or after several exchanges
    if (!response || response.includes("I'd help with your") ||
      (newContext.messageCount > 3 && !newContext.conversationStage) ||
      message.includes('confused') || message.includes('don\'t understand') ||
      confidence === 0 && message.length > 20) {

      console.log('🤖 Attempting Grok AI fallback for complex query:', message);
      try {
        response = await getGrokResponse(userMessage, conversationHistory, newContext);
        newContext.usedGrokFallback = true;
        newContext.grokFallbackCount = (newContext.grokFallbackCount || 0) + 1;
      } catch (error) {
        console.error('❌ Grok fallback failed:', error);
        response = generateFallbackResponse(userMessage, newContext);
      }
    }

    // Handle very short or unclear messages
    if (!response || response.trim() === '') {
      if (message.length <= 3 || message.match(/^\?+$/) || message.match(/^[^\w\s]+$/)) {
        response = "🤔 I'm not quite sure what you're looking for. Could you give me a bit more detail?\n\nI can help with:\n• **Emergency repairs** (call 480-255-5887)\n• **Pricing information** \n• **Service quotes**\n• **Scheduling appointments**\n\nWhat handyman service do you need?";
      } else {
        response = '🏠 Thanks for reaching out! I\'m here to help with all your handyman needs. Could you tell me more about what you\'re looking for? Whether it\'s repairs, installations, or maintenance - I can connect you with our Scottsdale team for expert service!';
      }
    }

    return response;
  };

  const handleChatSubmit = (messageOrEvent) => {
    console.log('📨 App handleChatSubmit called with:', messageOrEvent);
    // Handle both event objects and direct string messages
    let message = '';
    if (typeof messageOrEvent === 'string') {
      message = messageOrEvent.trim();
      console.log('🔤 String message:', message);
    } else if (messageOrEvent && messageOrEvent.preventDefault) {
      messageOrEvent.preventDefault();
      message = chatInput.trim();
      console.log('🎯 Event message:', message);
      // Clear input for events
      setChatInput('');
    }

    if (!message) return

    const userMessage = {
      sender: 'user',
      text: message,
      timestamp: new Date()
    }

    setChatMessages(prev => [...prev, userMessage])
    setChatTyping(true)

    // More realistic typing delay based on message length
    const responseDelay = Math.min(Math.max(message.length * 50, 800), 3000)

    setTimeout(async () => {
      try {
        console.log('🤖 App: Generating response for:', message);
        const responseText = await generateChatResponse(message, chatContext);
        console.log('✅ App: Generated response:', responseText);

        // Ensure we have a valid response
        const finalResponse = responseText && typeof responseText === 'string' ? responseText :
          "I apologize, but I'm having trouble processing your request right now. Could you please rephrase your question or contact us directly at (480) 255-5887?";

        const botResponse = {
          sender: 'bot',
          text: finalResponse,
          timestamp: new Date()
        }

        setChatMessages(prev => [...prev, botResponse])
      } catch (error) {
        console.error('❌ App: Error generating response:', error);
        const errorResponse = {
          sender: 'bot',
          text: "I apologize, but I'm experiencing technical difficulties. Please contact us directly at (480) 255-5887 for immediate assistance.",
          timestamp: new Date()
        }
        setChatMessages(prev => [...prev, errorResponse])
      } finally {
        setChatTyping(false)
      }
    }, responseDelay)
  }

  // File Upload Utility Functions
  const handleFileUpload = (files) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    const maxSize = 10 * 1024 * 1024 // 10MB limit

    Array.from(files).forEach(file => {
      if (!allowedTypes.includes(file.type)) {
        alert(`File type ${file.type} is not supported. Please use images, PDFs, or document files.`)
        return
      }

      if (file.size > maxSize) {
        alert(`File ${file.name} is too large. Maximum size is 10MB.`)
        return
      }

      const fileId = Date.now() + Math.random()
      const reader = new FileReader()

      // Set initial upload progress
      setUploadProgress(prev => ({
        ...prev,
        [fileId]: 0
      }))

      reader.onload = (e) => {
        const newFile = {
          id: fileId,
          name: file.name,
          type: file.type,
          size: file.size,
          data: e.target.result,
          uploadedAt: new Date().toISOString(),
          category: file.type.startsWith('image/') ? 'image' : 'document'
        }

        // Simulate upload progress
        let progress = 0
        const progressInterval = setInterval(() => {
          progress += Math.random() * 30
          if (progress >= 100) {
            progress = 100
            clearInterval(progressInterval)

            // Complete upload
            setUploadedFiles(prev => [...prev, newFile])
            setUploadProgress(prev => {
              const updated = { ...prev }
              delete updated[fileId]
              return updated
            })
          } else {
            setUploadProgress(prev => ({
              ...prev,
              [fileId]: progress
            }))
          }
        }, 200)
      }

      reader.readAsDataURL(file)
    })
  }

  // Check for admin session on load
  useEffect(() => {
    const savedAuth = localStorage.getItem('scottsdaleAdminAuth')
    if (savedAuth === 'true') {
      setIsAdmin(true)
    }
  }, [])

  // Initialize Stripe
  useEffect(() => {
    const initializeStripe = async () => {
      try {
        // Get Stripe config from backend
        const response = await fetch('/api/stripe-config')
        const config = await response.json()

        setStripeConfig(config)

        // Initialize Stripe with publishable key
        if (config.publishableKey && config.publishableKey !== 'null' && config.publishableKey.startsWith('pk_')) {
          const stripe = await loadStripe(config.publishableKey)
          setStripePromise(stripe)
        } else {
          console.log('Stripe not initialized: No valid publishable key provided')
        }
      } catch (error) {
        console.log('Stripe initialization error:', error)
        // Don't initialize Stripe if there's no valid key
        setStripePromise(null)
      }
    }

    initializeStripe()
  }, [])

  // Blog posts data - editable via admin
  const [blogPosts, setBlogPosts] = useState([
    {
      id: 1,
      title: "Essential Home Maintenance Tasks Every Scottsdale Homeowner Should Know",
      excerpt: "Living in the beautiful Sonoran Desert comes with unique challenges for homeowners. Learn the essential maintenance tasks that can prevent costly repairs.",
      content: `Living in the beautiful Sonoran Desert comes with unique challenges for homeowners. The intense Arizona sun, monsoon seasons, and extreme temperature fluctuations can take a toll on your home if you're not proactive about maintenance.

**Spring Maintenance Checklist**

HVAC System Preparation: Before the scorching summer heat arrives, your air conditioning system needs attention. Replace air filters, clean outdoor units of debris and dust, and schedule professional maintenance. A well-maintained AC system can save you hundreds of dollars in energy costs and prevent emergency breakdowns during peak summer months.

Roof and Gutter Inspection: Winter weather and spring winds can damage roofing materials. Check for loose or missing tiles, inspect gutters for proper drainage, and look for signs of water damage around roof penetrations. Early detection of roofing issues can prevent expensive interior damage during monsoon season.

Exterior Painting Touch-ups: The intense UV radiation in Arizona fades and damages exterior paint faster than in most climates. Touch up any areas where paint is peeling or fading to protect underlying materials from sun and moisture damage.`,
      author: "The Scottsdale Handyman",
      date: "2025-01-15",
      category: "Maintenance",
      readTime: "8 min read",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop",
      featured: true,
      tags: ["scottsdale", "maintenance", "arizona", "desert"],
      seoKeywords: ["Scottsdale home maintenance", "Arizona desert home care", "monsoon preparation", "HVAC maintenance Scottsdale"]
    },
    {
      id: 2,
      title: "Paradise Valley Home Repairs: Luxury Property Maintenance Guide",
      excerpt: "Maintaining luxury homes in Paradise Valley requires specialized knowledge. Our expert guide covers unique maintenance needs for high-end desert properties.",
      content: `Paradise Valley's luxury homes require specialized maintenance approaches that protect significant investments while maintaining aesthetic appeal. Our comprehensive guide addresses unique challenges faced by high-end desert properties.

**Luxury Home Exterior Maintenance**

Stucco and Stone Care: Paradise Valley's signature architectural styles require specialized maintenance. Annual stucco inspection prevents water intrusion, while natural stone requires specific cleaning products to prevent UV damage and mineral staining.

Pool and Spa Systems: Luxury pools require year-round maintenance in Arizona's climate. Chemical balancing, equipment servicing, and tile cleaning ensure optimal performance and longevity of expensive aquatic features.

Landscape Irrigation: High-end landscaping demands sophisticated irrigation management. Smart controllers, drip systems, and seasonal adjustments protect valuable plantings while conserving water.

**Interior Luxury Maintenance**

Custom Millwork Preservation: Hand-crafted cabinetry and built-ins require specific cleaning and conditioning products. Annual professional maintenance protects these significant investments from Arizona's dry climate.

Natural Stone Countertops: Granite, marble, and quartzite require different care approaches. Professional sealing and appropriate cleaning products maintain beauty while preventing permanent staining or etching.

Hardwood Floor Care: Desert climate creates unique challenges for hardwood floors. Humidity control, specific cleaning products, and professional refinishing maintain investment-grade flooring.`,
      author: "Scottsdale Handyman Solutions",
      date: "2025-01-12",
      category: "Luxury Maintenance",
      readTime: "10 min read",
      image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&h=600&fit=crop",
      featured: true,
      tags: ["paradise valley", "luxury homes", "high-end", "maintenance"],
      seoKeywords: ["Paradise Valley luxury home maintenance", "high-end property care Arizona", "luxury home handyman services"]
    },
    {
      id: 3,
      title: "Commercial Property Maintenance in Scottsdale: Business Owner's Guide",
      excerpt: "Scottsdale businesses need reliable commercial handyman services. Learn how professional maintenance protects your investment and keeps operations running smoothly.",
      content: `Scottsdale's thriving business community relies on professional commercial maintenance to protect property investments and maintain operational efficiency. From Old Town retail spaces to North Scottsdale office complexes, commercial properties face unique maintenance challenges in Arizona's desert climate.

**Retail and Restaurant Maintenance**

Storefront Appeal: First impressions matter in competitive Scottsdale markets. Regular maintenance of exterior signage, lighting, and entrance areas ensures customers feel welcomed and businesses project professional images.

Kitchen Equipment Service: Restaurant equipment requires specialized maintenance in Arizona's extreme temperatures. Regular servicing prevents costly breakdowns during peak business periods.

HVAC Optimization: Commercial HVAC systems work overtime in Arizona. Regular maintenance, filter replacement, and system optimization reduce energy costs while ensuring customer comfort.

**Office Building Maintenance**

Tenant Retention: Well-maintained office spaces retain quality tenants and command premium rents. Regular maintenance addressing lighting, plumbing, and HVAC issues keeps tenants satisfied.

Safety Compliance: Commercial properties must meet specific safety requirements. Regular maintenance ensures compliance with local building codes and safety regulations.

Energy Efficiency: Rising energy costs impact business profitability. Professional maintenance optimizes systems for maximum efficiency, reducing operational expenses.

**Scheduled Maintenance Programs**

Preventive Approach: Regular scheduled maintenance prevents small issues from becoming expensive emergency repairs. Structured programs reduce long-term maintenance costs.

Emergency Response: Business disruptions cost money. Reliable emergency maintenance services minimize downtime and protect revenue streams.`,
      author: "Scottsdale Handyman Solutions",
      date: "2025-01-10",
      category: "Commercial",
      readTime: "12 min read",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop",
      featured: true,
      tags: ["commercial", "business", "scottsdale", "retail", "office"],
      seoKeywords: ["Scottsdale commercial handyman", "business property maintenance", "commercial repair services Arizona"]
    },
    {
      id: 4,
      title: "Fountain Hills Desert Home Winterization: Protecting Your Investment",
      excerpt: "Even in the desert, winter preparation is crucial. Learn specific steps to protect your Fountain Hills home during Arizona's cooler months.",
      content: `While Arizona winters are mild compared to northern climates, Fountain Hills homeowners still need winter preparation strategies to protect their investments and maintain comfort during cooler months.

**Heating System Preparation**

Annual HVAC Inspection: Even though heating demands are minimal, annual furnace inspection ensures safe operation and optimal efficiency during cold snaps. Replace filters and test carbon monoxide detectors.

Fireplace Safety: Many Fountain Hills homes feature fireplaces that see minimal use. Annual chimney inspection and cleaning prevent dangerous buildup while ensuring safe operation during occasional cold evenings.

Pipe Protection: While freezing is rare, exposed pipes in crawl spaces, garages, and outdoor areas can freeze during extreme cold events. Insulation and heat tape provide inexpensive protection against expensive burst pipe repairs.

**Landscape Winter Care**

Citrus Tree Protection: Many Fountain Hills properties feature citrus trees that require protection during frost warnings. Proper covering techniques and watering strategies protect valuable landscaping investments.

Irrigation System Maintenance: Winter is ideal for irrigation system maintenance and repairs. Inspect emitters, replace damaged lines, and adjust timing for reduced winter water needs.

Desert Plant Care: Native plants require minimal winter care but benefit from pruning dead growth and adjusting watering schedules to prevent root rot during dormant periods.`,
      author: "Scottsdale Handyman Solutions",
      date: "2025-01-08",
      category: "Seasonal",
      readTime: "7 min read",
      image: "https://images.unsplash.com/photo-1600298881974-6be191ceeda1?w=800&h=600&fit=crop",
      tags: ["fountain hills", "winter prep", "desert", "arizona"],
      seoKeywords: ["Fountain Hills home winterization", "Arizona winter home prep", "desert home winter maintenance"]
    },
    {
      id: 5,
      title: "North Scottsdale Smart Home Integration: Future-Proofing Desert Living",
      excerpt: "Discover how North Scottsdale homeowners are embracing smart technology to enhance comfort, security, and energy efficiency in luxury desert properties.",
      content: `North Scottsdale's newer luxury developments are perfectly positioned for comprehensive smart home integration. Modern infrastructure and tech-savvy residents create ideal conditions for advanced home automation systems.

**Climate-Optimized Smart Systems**

Advanced Thermostats: Smart thermostats with humidity sensors and outdoor temperature integration optimize HVAC performance for Arizona's extreme climate variations. Zoned systems allow precise control in large homes.

Automated Shade Systems: Motorized window treatments automatically adjust throughout the day, blocking intense morning and afternoon sun while preserving views and natural light during optimal periods.

Smart Irrigation Controllers: Weather-based irrigation systems adjust watering schedules based on real-time weather data, seasonal plant needs, and soil moisture levels, ensuring healthy landscapes while conserving water.

**Security and Access Control**

Comprehensive Video Systems: Multi-camera systems with 4K resolution, night vision, and AI-powered motion detection provide complete property monitoring accessible from anywhere in the world.

Smart Entry Systems: Biometric locks, smartphone control, and temporary access codes eliminate physical keys while providing detailed access logs and enhanced security features.

Perimeter Protection: Smart sensors along property boundaries provide early intrusion warning while integrating with lighting and camera systems for comprehensive security response.`,
      author: "Scottsdale Handyman Solutions",
      date: "2025-01-05",
      category: "Smart Home",
      readTime: "9 min read",
      image: "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800&h=600&fit=crop",
      tags: ["north scottsdale", "smart home", "luxury", "automation"],
      seoKeywords: ["North Scottsdale smart home installation", "luxury home automation Arizona", "smart home handyman services"]
    },
    {
      id: 6,
      title: "Monsoon Season Prep: Cave Creek & Carefree Storm Readiness",
      excerpt: "Higher elevation areas like Cave Creek and Carefree face unique monsoon challenges. Learn specific preparation strategies for foothill communities.",
      content: `Cave Creek and Carefree's foothill locations create unique monsoon challenges that require specialized preparation strategies. Higher elevations and varied terrain demand comprehensive storm readiness planning.

**Elevation-Specific Challenges**

Wind Protection: Foothill locations experience amplified wind speeds during storms. Secure outdoor furniture, trim trees near structures, and inspect roof attachments for wind resistance.

Drainage Management: Sloped terrain creates rapid runoff challenges. Ensure gutters can handle heavy water flow, and consider French drains or retention areas for extreme events.

Access Road Maintenance: Remote locations may experience access challenges during severe weather. Maintain emergency supplies and communication systems for potential isolation periods.

**Property Protection Strategies**

Rock and Boulder Securing: Natural rock formations and decorative boulders can shift during extreme weather. Inspect and secure loose materials that could cause property damage.

Well and Septic Systems: Rural properties with private utilities require specific storm preparation. Secure well heads and ensure septic systems can handle potential flooding.

Power System Backup: Rural areas may experience longer power outages. Backup generators and battery systems maintain critical systems during extended outages.`,
      author: "Scottsdale Handyman Solutions",
      date: "2025-01-01",
      category: "Storm Prep",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=800&h=600&fit=crop",
      tags: ["cave creek", "carefree", "monsoon", "storm prep"],
      seoKeywords: ["Cave Creek monsoon preparation", "Carefree storm readiness", "foothill home storm prep Arizona"]
    },
    {
      id: 7,
      title: "Old Town Scottsdale Historic Home Maintenance: Preserving Character",
      excerpt: "Historic homes in Old Town Scottsdale require specialized maintenance approaches that preserve architectural character while meeting modern needs.",
      content: `Old Town Scottsdale's historic properties require specialized maintenance approaches that preserve architectural integrity while incorporating modern functionality and efficiency improvements.

**Historic Preservation Techniques**

Adobe and Stucco Restoration: Traditional adobe construction requires specific repair techniques using compatible materials. Modern cement-based repairs can damage historical adobe structures.

Window and Door Restoration: Original wood windows and doors often provide better character and efficiency than modern replacements when properly restored. Professional restoration maintains historical integrity while improving performance.

Roofing Heritage Compliance: Clay tile roofing replacement must maintain historical accuracy while meeting modern building codes. Color matching and profile selection preserve neighborhood character.

**Modern Efficiency Integration**

Insulation Upgrades: Adding insulation to historic homes requires careful planning to avoid moisture problems while respecting original construction methods.

Electrical System Updates: Bringing electrical systems up to code while preserving original fixtures requires specialized knowledge of both historical preservation and modern electrical requirements.

Plumbing Modernization: Updating plumbing in historic homes often involves creative routing to avoid disturbing original architectural elements while providing modern functionality.`,
      author: "Scottsdale Handyman Solutions",
      date: "2024-12-28",
      category: "Historic Preservation",
      readTime: "8 min read",
      image: "https://images.unsplash.com/photo-1600298881974-6be191ceeda1?w=800&h=600&fit=crop",
      tags: ["old town", "historic homes", "preservation", "scottsdale"],
      seoKeywords: ["Old Town Scottsdale historic home repair", "historic preservation handyman", "adobe restoration Arizona"]
    },
    {
      id: 8,
      title: "Closet Organization Systems: Maximizing Storage in Scottsdale Homes",
      excerpt: "Custom closet organization transforms chaotic spaces into functional storage solutions that increase home value and daily convenience.",
      content: `Custom closet organization systems transform chaotic storage spaces into highly functional areas that improve daily routines while adding significant home value. Professional design maximizes available space while creating aesthetically pleasing storage solutions.

**Design Principles for Maximum Efficiency**

Vertical Space Utilization: Floor-to-ceiling storage systems maximize every inch of available space. Adjustable shelving accommodates changing needs over time.

Activity-Based Zones: Organizing by clothing type, season, or family member creates intuitive systems that are easier to maintain long-term.

Accessibility Considerations: Frequently used items should be within easy reach while seasonal or specialty items can be stored in higher or lower areas.

**Custom Storage Solutions**

Built-In Drawers: Soft-close drawer systems provide convenient storage for folded items, undergarments, and accessories while maintaining organization visibility.

Hanging Systems: Double-hang areas maximize vertical space for shirts and pants while full-height hanging accommodates dresses and coats.

Shoe Storage: Custom shoe racks, cubbies, or rotating systems keep footwear organized and easily accessible while protecting investment pieces.

**Material Selection and Durability**

Melamine and Laminate: Cost-effective options that provide durability and easy maintenance with numerous color and finish options.

Wood Systems: Solid wood or wood veneer systems provide luxury appearance and long-term durability while offering customization flexibility.

Wire Systems: Ventilated wire shelving prevents moisture buildup while providing lightweight, adjustable storage options ideal for Arizona's climate.

**Professional Installation Benefits**

Precise Measurements: Professional installation ensures optimal fit and maximum space utilization while avoiding costly measurement errors.

Structural Assessment: Proper wall anchoring and support ensure systems can handle full load capacity safely over time.

Warranty Protection: Professional installation typically includes warranties on both materials and workmanship, protecting your investment long-term.`,
      author: "Scottsdale Handyman Solutions",
      date: "2024-10-25",
      category: "Organization",
      readTime: "7 min read",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
      tags: ["closet organization", "storage", "scottsdale", "custom"],
      seoKeywords: ["Scottsdale closet organization", "custom closet installation Arizona", "home storage solutions"]
    },
    {
      id: 9,
      title: "Tempe Apartment & Condo Handyman Services: Maximizing Small Spaces",
      excerpt: "Living in Tempe apartments and condos requires creative solutions for maintenance and improvements. Learn how to make the most of compact urban living.",
      content: `Tempe's vibrant rental market and growing condo developments create unique maintenance challenges for residents and property managers. Urban living requires specialized handyman solutions that maximize functionality within limited spaces.

**Apartment-Specific Services**

Damage Repair: Moving in and out creates wall damage, scuffed floors, and fixture issues. Professional repair ensures security deposits are returned and properties remain rent-ready.

Space Optimization: Creative storage solutions, Murphy beds, and multi-functional furniture installation help maximize limited square footage in urban units.

Noise Reduction: Apartment living requires consideration for neighbors. Soundproofing solutions, carpet installation, and weather sealing reduce noise transmission.

**Condo Maintenance**

HOA Compliance: Condo improvements must meet HOA guidelines and community standards. Professional consultation ensures modifications comply with association rules.

Balcony Safety: Arizona sun and weather damage balcony railings and flooring. Regular maintenance ensures safety while preserving views and outdoor living space.

Plumbing Coordination: Condo plumbing systems require coordination with neighboring units. Professional service prevents issues that affect multiple residents.

**Property Manager Services**

Turn-Around Efficiency: Quick apartment turnover between tenants maximizes rental income. Efficient handyman services minimize vacancy periods.

Bulk Scheduling: Multiple units in the same complex benefit from coordinated maintenance scheduling, reducing costs and disruption.

Emergency Response: Apartment emergencies affect multiple residents. Rapid response minimizes damage and tenant complaints.`,
      author: "Scottsdale Handyman Solutions",
      date: "2024-12-20",
      category: "Urban Living",
      readTime: "9 min read",
      image: "https://images.unsplash.com/photo-1555636222-cae831e670b3?w=800&h=600&fit=crop",
      tags: ["tempe", "apartment", "condo", "urban", "rental"],
      seoKeywords: ["Tempe apartment handyman", "condo repair services Arizona", "urban living maintenance"]
    },
    {
      id: 10,
      title: "Home Office Design: Creating Productive Workspaces in the Age of Remote Work",
      excerpt: "Design a home office that boosts productivity and maintains work-life balance with proper lighting, storage, and technology integration.",
      content: `The shift to remote work has made dedicated home office spaces more important than ever. Proper design can significantly impact productivity, comfort, and work-life balance while adding value to your home.

**Lighting and Environment**

Natural Light Optimization: Positioning desks near windows reduces eye strain and improves mood while providing energy savings. However, proper window treatments prevent screen glare during peak sun hours.

Task Lighting: Adjustable desk lamps and under-cabinet lighting provide focused illumination for detailed work while reducing overall lighting needs.

Temperature Control: Consistent temperature and good air circulation improve concentration and comfort. Ceiling fans or personal HVAC zones can provide optimal conditions without affecting other areas.

**Storage and Organization**

Built-In Solutions: Custom shelving, filing systems, and storage cabinets keep workspaces organized while maximizing available floor space.

Cable Management: Professional cable management systems reduce clutter while providing easy access for technology updates and maintenance.

Display Storage: Open shelving for books, awards, and personal items creates professional video call backgrounds while maintaining organized appearance.

**Technology Infrastructure**

Electrical Planning: Adequate outlets, USB charging stations, and dedicated circuits for high-power equipment prevent overloading and provide flexible equipment placement.

Internet Connectivity: Hardwired internet connections provide more reliable connectivity than wireless for video calls and large file transfers.

Sound Management: Proper insulation, door seals, and sound-absorbing materials reduce distractions and prevent work calls from disturbing family activities.

**Ergonomic Considerations**

Proper Desk Height: Adjustable or properly sized desks reduce strain and improve comfort during long work sessions.

Seating Solutions: Quality office chairs provide necessary support while complementing overall room design aesthetics.

Monitor Positioning: Proper monitor height and distance reduce neck strain and eye fatigue while improving overall productivity.`,
      author: "Scottsdale Handyman Solutions",
      date: "2024-10-18",
      category: "Home Office",
      readTime: "8 min read",
      image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&h=600&fit=crop",
      tags: ["home office", "remote work", "productivity", "workspace"],
      seoKeywords: ["Scottsdale home office setup", "remote work space design", "home office handyman services Arizona"]
    },
    {
      id: 11,
      title: "Mesa Home Repairs: Affordable Solutions for Growing Families",
      excerpt: "Mesa families need cost-effective home repairs that prioritize safety and functionality. Our guide covers budget-friendly maintenance strategies.",
      content: `Mesa's family-friendly communities require practical, budget-conscious maintenance approaches that prioritize safety and functionality. Growing families face unique challenges that demand reliable, affordable handyman solutions.

**Family Safety Priorities**

Childproofing Services: Mesa families benefit from professional childproofing installation including cabinet locks, outlet covers, and window guards. Professional installation ensures effectiveness and durability.

Fence and Pool Safety: Arizona pool safety laws require proper barriers and self-closing gates. Professional installation and maintenance protect children while meeting legal requirements.

Stair and Railing Safety: Growing children challenge stair railings and balusters. Regular inspection and maintenance prevent accidents while maintaining home value.

**Budget-Friendly Improvements**

Paint and Refresh Projects: Strategic painting refreshes homes without major renovation costs. Professional consultation maximizes impact while staying within family budgets.

DIY Support Services: Many Mesa families prefer DIY projects but need professional guidance. Consultation services provide expert advice while keeping costs manageable.

Preventive Maintenance: Regular maintenance prevents small issues from becoming expensive repairs. Scheduled services fit family budgets while protecting long-term investments.

**Energy Efficiency for Families**

Window Treatments: Energy-efficient window coverings reduce cooling costs during Arizona summers. Professional installation ensures optimal performance and child safety.

Insulation Upgrades: Proper insulation in family homes reduces energy costs while improving year-round comfort. Professional assessment identifies priority areas for maximum impact.

HVAC Optimization: Large families strain HVAC systems. Professional maintenance and upgrades ensure adequate cooling while controlling energy costs.`,
      author: "Scottsdale Handyman Solutions",
      date: "2024-12-15",
      category: "Family Living",
      readTime: "10 min read",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop",
      tags: ["mesa", "family", "budget", "safety", "energy efficiency"],
      seoKeywords: ["Mesa family handyman services", "affordable home repairs Arizona", "family home maintenance Mesa"]
    },
    {
      id: 12,
      title: "Phoenix Metro Area: Emergency Storm Damage Repair Guide",
      excerpt: "Arizona storms can cause significant property damage quickly. Learn how to respond to storm damage and protect your home from future weather events.",
      content: `Phoenix metro area residents face unique weather challenges including monsoon storms, microbursts, and occasional severe weather events. Understanding proper response procedures and prevention strategies protects homes and families.

**Immediate Storm Response**

Safety Assessment: After severe weather, professional assessment identifies structural damage and safety hazards before residents re-enter properties. Electrical and gas system checks ensure safe occupancy.

Water Damage Prevention: Rapid response to roof leaks and water intrusion prevents mold growth and structural damage. Professional extraction and drying equipment minimize long-term damage.

Temporary Repairs: Emergency tarping, board-up services, and temporary fixes protect properties from further damage while permanent repairs are scheduled.

**Common Storm Damage Types**

Roof Damage: High winds and hail damage roofing materials requiring immediate attention. Professional assessment determines repair versus replacement needs.

Window and Door Damage: Flying debris breaks windows and damages doors. Emergency board-up services secure properties while replacement materials are ordered.

Fence and Outdoor Structure Damage: Pool equipment, patio covers, and fencing suffer frequent storm damage. Professional repair ensures safety and functionality.

**Prevention Strategies**

Tree Trimming: Regular tree maintenance reduces storm damage risk. Professional trimming removes dangerous branches while preserving tree health.

Roof Maintenance: Annual roof inspections identify potential failure points before storms arrive. Professional maintenance extends roof life while preventing storm damage.

Drainage Improvements: Proper grading and drainage prevent flood damage during heavy rains. French drains and retention systems protect foundations and landscaping.`,
      author: "Scottsdale Handyman Solutions",
      date: "2024-12-10",
      category: "Emergency Repair",
      readTime: "11 min read",
      image: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=800&h=600&fit=crop",
      tags: ["phoenix", "storm damage", "emergency repair", "prevention"],
      seoKeywords: ["Phoenix storm damage repair", "emergency handyman Arizona", "monsoon damage restoration"]
    },
    {
      id: 13,
      title: "Chandler New Home Customization: Making Builder Homes Your Own",
      excerpt: "Chandler's new construction homes offer great foundations but often lack personality. Learn how to customize builder homes with thoughtful improvements.",
      content: `Chandler's rapid growth brings numerous new construction homes with builder-grade finishes that benefit from professional customization. Strategic improvements transform generic spaces into personalized homes that reflect family style and needs.

**Interior Customization Priorities**

Lighting Upgrades: Builder lighting typically includes basic fixtures throughout. Custom lighting installation creates ambiance and functionality while adding personality to generic spaces.

Hardware and Fixture Upgrades: Cabinet hardware, plumbing fixtures, and door handles are simple upgrades with significant visual impact. Professional installation ensures proper fit and function.

Built-In Storage: New homes often lack adequate storage solutions. Custom built-ins maximize functionality while adding architectural interest and home value.

**Kitchen and Bath Improvements**

Backsplash Installation: Builder homes typically include basic backsplashes. Custom tile work creates focal points while protecting walls from cooking and moisture damage.

Cabinet Modifications: Additional shelving, pull-out drawers, and organizational systems improve kitchen functionality without full renovation costs.

Bathroom Luxury Upgrades: Towel warmers, heated floors, and upgraded fixtures add luxury touches that enhance daily routines and home value.

**Outdoor Living Enhancement**

Patio and Deck Construction: Arizona's climate demands outdoor living spaces. Professional construction creates entertainment areas that extend livable space year-round.

Landscape Installation: New construction often includes minimal landscaping. Professional design and installation create curb appeal while considering water conservation needs.

Pool and Spa Addition: Many Chandler neighborhoods accommodate pool installations. Professional consultation ensures compliance with HOA requirements and city regulations.`,
      author: "Scottsdale Handyman Solutions",
      date: "2024-12-05",
      category: "New Homes",
      readTime: "9 min read",
      image: "https://images.unsplash.com/photo-1600298881974-6be191ceeda1?w=800&h=600&fit=crop",
      tags: ["chandler", "new construction", "customization", "builder homes"],
      seoKeywords: ["Chandler home customization", "new construction improvements Arizona", "builder home upgrades"]
    },
    {
      id: 14,
      title: "Glendale Historic District: Restoration and Modern Integration",
      excerpt: "Glendale's historic neighborhoods require specialized maintenance that preserves character while incorporating modern conveniences and efficiency.",
      content: `Glendale's historic districts offer unique architectural character requiring specialized maintenance approaches. Successful restoration projects balance historical preservation with modern functionality and efficiency needs.

**Historical Preservation Standards**

Architectural Authenticity: Historic district properties must maintain period-appropriate appearances. Professional consultation ensures modifications comply with historical preservation requirements.

Material Compatibility: Original building materials require specific maintenance products and techniques. Incompatible modern materials can damage historical structures.

Documentation Requirements: Historic properties often require permits and documentation for modifications. Professional services navigate regulatory requirements efficiently.

**Modern Efficiency Integration**

Insulation Strategies: Adding insulation to historic homes requires specialized techniques that avoid moisture problems while respecting original construction methods.

Electrical System Upgrades: Historic homes need electrical updates for modern appliances and safety requirements. Professional work maintains historical aesthetics while meeting code requirements.

Plumbing Modernization: Updated plumbing systems improve functionality while preserving original fixtures and character elements wherever possible.

**Adaptive Restoration Projects**

Kitchen Modernization: Historic kitchens benefit from thoughtful updates that maintain character while improving functionality. Period-appropriate fixtures with modern efficiency create ideal solutions.

Bathroom Renovations: Historic bathrooms often require significant updates while preserving architectural character. Professional design balances modern needs with historical aesthetics.

Climate Control Addition: Many historic homes lack adequate cooling systems. Professional installation provides comfort while minimizing visual impact on historical character.`,
      author: "Scottsdale Handyman Solutions",
      date: "2024-11-30",
      category: "Historic Restoration",
      readTime: "12 min read",
      image: "https://images.unsplash.com/photo-1600298881974-6be191ceeda1?w=800&h=600&fit=crop",
      tags: ["glendale", "historic district", "restoration", "preservation"],
      seoKeywords: ["Glendale historic home restoration", "historic district handyman Arizona", "preservation contractor"]
    },
    {
      id: 15,
      title: "Ahwatukee Foothills: Desert Mountain Home Maintenance Essentials",
      excerpt: "Homes in Ahwatukee's desert foothills face unique environmental challenges. Learn specialized maintenance strategies for elevated desert properties.",
      content: `Ahwatukee Foothills properties combine luxury living with desert mountain challenges requiring specialized maintenance approaches. Elevated locations, unique microclimates, and luxury finishes demand professional expertise for optimal property protection.

**Elevation-Specific Challenges**

Wind Exposure: Higher elevations experience stronger winds requiring additional securing of outdoor furniture, decorative elements, and roof materials. Professional assessment identifies vulnerability points.

Temperature Variations: Mountain elevation creates greater temperature swings requiring HVAC systems capable of efficient heating and cooling. Professional maintenance ensures optimal performance.

Drainage Management: Sloped terrain creates runoff challenges during monsoon season. Professional grading and drainage solutions protect foundations and landscaping investments.

**Luxury Home Maintenance**

Pool and Spa Systems: Elevated locations require specialized pool equipment and maintenance schedules. Professional service ensures optimal performance despite environmental challenges.

High-End Landscaping: Desert mountain properties often feature extensive xeriscaping requiring specialized irrigation and maintenance. Professional care preserves investments while conserving water.

Outdoor Entertainment Areas: Covered patios, outdoor kitchens, and entertainment spaces require regular maintenance in harsh desert conditions. Professional service extends equipment life and maintains aesthetics.

**Environmental Protection**

UV Protection: Intense mountain sun damages exterior finishes, furniture, and decorative elements. Professional treatments and maintenance preserve appearances and extend material life.

Wildlife Considerations: Mountain locations attract wildlife requiring property modifications for protection. Professional consultation identifies necessary precautions and modifications.

Fire Prevention: Desert mountain locations face wildfire risks requiring defensible space maintenance and fire-resistant landscaping. Professional assessment ensures adequate protection.`,
      author: "Scottsdale Handyman Solutions",
      date: "2024-11-25",
      category: "Mountain Living",
      readTime: "10 min read",
      image: "https://images.unsplash.com/photo-1600298881974-6be191ceeda1?w=800&h=600&fit=crop",
      tags: ["ahwatukee", "foothills", "mountain living", "luxury homes"],
      seoKeywords: ["Ahwatukee foothills handyman", "desert mountain home maintenance", "luxury desert property care"]
    }
  ]);

  // Enhanced inspiration gallery - clean, deduplicated, optimized (Fixed: 2025-07-20)
  const [projectGallery, setProjectGallery] = useState([
    {
      id: 1,
      title: "Modern Kitchen Remodel - Desert Ridge",
      description: "Complete kitchen transformation with quartz countertops, custom white shaker cabinets, and designer lighting",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&auto=format",
      alt: "Modern kitchen remodel with white quartz countertops, custom cabinetry, and stainless steel appliances",
      category: "Kitchen",
      completionTime: "3 weeks",
      budget: "$25,000 - $35,000",
      location: "Desert Ridge",
      features: ["Quartz Countertops", "Custom Cabinets", "LED Under-Cabinet Lighting", "Subway Tile Backsplash", "Stainless Steel Appliances", "Soft-Close Drawers"]
    },
    {
      id: 2,
      title: "Luxury Master Bathroom - Old Town",
      description: "Spa-like master bathroom with walk-in glass shower, marble vanity, and smart home features",
      image: "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800&h=600&fit=crop&auto=format",
      alt: "Luxury bathroom renovation with walk-in glass shower, marble vanity, and modern fixtures",
      category: "Bathroom",
      completionTime: "2 weeks",
      budget: "$15,000 - $25,000",
      location: "Old Town Scottsdale",
      features: ["Walk-in Glass Shower", "Heated Tile Floors", "Marble Double Vanity", "Smart Fixtures", "Rain Showerhead", "Built-in Storage"]
    },
    {
      id: 3,
      title: "Custom Laundry Room Organization",
      description: "Transformed basic laundry room into organized, functional space with custom storage and folding station",
      image: "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&h=600&fit=crop&auto=format",
      alt: "Well-organized laundry room with custom storage, folding station, and utility sink",
      category: "Laundry",
      completionTime: "1 week",
      budget: "$5,000 - $10,000",
      location: "McCormick Ranch",
      features: ["Custom Storage Cabinets", "Folding Station", "Utility Sink", "Organization Systems", "Tile Flooring", "Task Lighting"]
    },
    {
      id: 4,
      title: "Walk-in Closet Organization System",
      description: "Custom storage solutions maximizing space with built-in shelving and organization systems",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&auto=format",
      alt: "Walk-in closet with custom organization system and built-in shelving",
      category: "Storage",
      completionTime: "3 days",
      budget: "$3,000 - $8,000",
      location: "Gainey Ranch",
      features: ["Custom Shelving", "Shoe Storage Racks", "Hanging Systems", "LED Strip Lighting", "Jewelry Drawer Inserts", "Full-Length Mirror"]
    },
    {
      id: 5,
      title: "Desert Outdoor Kitchen Paradise",
      description: "Ultimate entertaining space with built-in BBQ grill, bar seating, and ambient lighting perfect for Arizona climate",
      image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=600&fit=crop&auto=format",
      alt: "Outdoor kitchen with built-in grill, bar seating, and desert landscaping",
      category: "Outdoor",
      completionTime: "2 weeks",
      budget: "$20,000 - $40,000",
      location: "Scottsdale Ranch",
      features: ["Built-in Gas Grill", "Granite Bar Top", "Weather-Resistant Cabinets", "String Lighting", "Outdoor Refrigerator", "Shade Structure"]
    },
    {
      id: 6,
      title: "Executive Home Office Design",
      description: "Professional workspace with custom built-ins, cable management, and sophisticated lighting design",
      image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&h=600&fit=crop&auto=format",
      alt: "Modern home office with built-in desk, custom storage, and professional lighting",
      category: "Office",
      completionTime: "1 week",
      budget: "$5,000 - $12,000",
      location: "North Scottsdale",
      features: ["Built-in Desk", "Custom Shelving", "Task & Ambient Lighting", "Cable Management", "Built-in Filing", "USB Charging Stations"]
    },
    {
      id: 7,
      title: "Smart Security System Installation",
      description: "Comprehensive smart home security system with cameras, sensors, and mobile app control",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&auto=format",
      alt: "Smart home security system with cameras and control panel",
      category: "Smart Home",
      completionTime: "2 days",
      budget: "$2,500 - $8,000",
      location: "Fountain Hills",
      features: ["Smart Cameras", "Door/Window Sensors", "Smart Locks", "Mobile App Control", "Motion Detection", "Professional Installation"]
    },
    {
      id: 8,
      title: "Pool Equipment Organization",
      description: "Organized pool equipment area with proper ventilation and maintenance access",
      image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&h=600&fit=crop&auto=format",
      alt: "Well-organized pool equipment room with proper ventilation and storage",
      category: "Pool",
      completionTime: "1 day",
      budget: "$1,500 - $3,000",
      location: "Pinnacle Peak",
      features: ["Equipment Shelving", "Ventilation Upgrade", "Chemical Storage", "Maintenance Access", "Safety Features", "Drainage Improvement"]
    },
    {
      id: 9,
      title: "Energy-Efficient Window Upgrades",
      description: "Whole-house window replacement with energy-efficient double-pane windows",
      image: "https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800&h=600&fit=crop&auto=format",
      alt: "Modern energy-efficient windows with double-pane glass installation",
      category: "Energy Efficiency",
      completionTime: "3 days",
      budget: "$12,000 - $25,000",
      location: "Carefree",
      features: ["Double-Pane Glass", "Low-E Coating", "Insulated Frames", "Professional Installation", "Energy Tax Credits", "UV Protection"]
    },
    {
      id: 10,
      title: "Backyard Fire Pit Installation",
      description: "Custom fire pit area with seating and landscape integration perfect for desert evenings",
      image: "https://picsum.photos/800/600?random=10",
      alt: "Custom stone fire pit with built-in seating and desert landscaping",
      category: "Outdoor",
      completionTime: "3 days",
      budget: "$3,000 - $8,000",
      location: "Cave Creek",
      features: ["Natural Stone Fire Pit", "Built-in Seating", "Gas Line Installation", "Landscape Integration", "Ambient Lighting", "Fire Safety Features"]
    }
  ])

  // Scroll to section function
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMenuOpen(false)
  }

  // Admin Content Management Functions
  const saveBlogPost = (blogPost) => {
    if (blogPost.id) {
      // Update existing post
      setBlogPosts(posts => posts.map(post =>
        post.id === blogPost.id ? blogPost : post
      ))
    } else {
      // Add new post
      const newPost = {
        ...blogPost,
        id: Math.max(...blogPosts.map(p => p.id), 0) + 1,
        date: new Date().toISOString().split('T')[0]
      }
      setBlogPosts(posts => [...posts, newPost])
    }
    setEditingBlog(null)
  }

  const deleteBlogPost = (id) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      setBlogPosts(posts => posts.filter(post => post.id !== id))
    }
  }

  const saveProjectGallery = (project) => {
    if (project.id) {
      // Update existing project
      setProjectGallery(gallery => gallery.map(item =>
        item.id === project.id ? project : item
      ))
    } else {
      // Add new project
      const newProject = {
        ...project,
        id: Math.max(...projectGallery.map(p => p.id), 0) + 1
      }
      setProjectGallery(gallery => [...gallery, newProject])
    }
    setEditingProject(null)
  }

  const editProject = (project) => {
    setEditingProject(project)
  }

  const deleteProject = (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      setProjectGallery(gallery => gallery.filter(item => item.id !== id))
    }
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // Get form data
      const formData = new FormData(e.target)
      const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        address: formData.get('address'),
        service: formData.get('service'),
        description: formData.get('description'),
        contact_method: formData.get('contact_method') || 'phone',
        budget: formData.get('budget'),
        timeline: formData.get('timeline'),
        property_type: formData.get('property_type'),
        urgency: formData.get('urgency'),
        heard_about: formData.get('heard_about')
      }

      // Determine form type based on which form is being submitted
      const formType = leadFormModal || 'quote'

      // Submit to backend API
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api'
      const response = await fetch(`${API_BASE_URL}/forms/${formType}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        // Show success page with submitted data
        setSubmittedFormData({
          type: formType,
          data: data
        })
        setShowSuccessPage(true)
        setLeadFormModal(null)

        // Reset the form
        e.target.reset()

        // Hide success page after 5 seconds
        setTimeout(() => {
          setShowSuccessPage(false)
          setSubmittedFormData(null)
        }, 5000)

      } else {
        const errorData = await response.json()
        alert('There was an error sending your message: ' + (errorData.error || 'Please try again.'))
      }
    } catch (error) {
      console.error('Error:', error)
      alert('There was an error sending your message. Please try again or call (480) 255-5887.')
    }
  }

  // Handle payment form submission
  const handlePaymentSubmit = async (e) => {
    e.preventDefault()
    setIsProcessingPayment(true)
    setPaymentError(null)

    try {
      // Use FormData approach for reliable form handling
      const formData = new FormData(e.target)
      const data = {
        invoiceNumber: formData.get('invoiceNumber'),
        customerName: formData.get('customerName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        amount: formData.get('amount'),
        paymentMethod: formData.get('paymentMethod'),
        description: formData.get('description'),
        source: 'invoice_payment',
        submittedAt: new Date().toLocaleString()
      }

      // If Stripe is available and amount > 0, process actual payment
      if (stripePromise && data.amount && parseFloat(data.amount) > 0) {
        try {
          // Create payment intent on backend
          const response = await fetch('/api/create-payment-intent', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
          })

          if (!response.ok) {
            throw new Error('Payment processing failed')
          }

          const { client_secret } = await response.json()
          const stripe = await stripePromise

          // For demo purposes, we'll simulate a successful payment
          // In production, you'd use proper Stripe Elements for card collection
          console.log('Would process payment with client_secret:', client_secret)

        } catch (stripeError) {
          console.log('Stripe processing error:', stripeError)
          setPaymentError('Payment processing failed. Please try again.')
          return
        }
      }

      // Log form submission (for demo/testing purposes)
      console.log('Payment form submitted:', data)

      // Show success message
      setSubmittedFormData({
        type: 'payment_request',
        data: data
      })
      setShowSuccessPage(true)

      // Reset form
      e.target.reset()

      // Auto-close success page after 5 seconds
      setTimeout(() => {
        setShowSuccessPage(false)
        setSubmittedFormData(null)
      }, 5000)

    } catch (error) {
      console.error('Payment submission error:', error)
      setPaymentError('An error occurred. Please try again.')
    } finally {
      setIsProcessingPayment(false)
    }
  }

  // Handle work with us form submission
  const handleWorkSubmit = async (e) => {
    e.preventDefault()

    // Use FormData approach for reliable form handling
    const formData = new FormData(e.target)
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      experience: formData.get('experience'),
      position: formData.get('position'),
      skills: formData.get('skills'),
      availability: formData.get('availability'),
      source: 'work_with_us_application',
      submittedAt: new Date().toLocaleString()
    }

    // Here you would typically send to your applicant tracking system
    console.log('Work application submitted:', data)

    // Show success message
    setSubmittedFormData({
      type: 'work_application',
      data: data
    })
    setShowSuccessPage(true)

    // Reset form
    e.target.reset()

    // Auto-close success page after 5 seconds
    setTimeout(() => {
      setShowSuccessPage(false)
      setSubmittedFormData(null)
    }, 5000)
  }

  // Lead Form Handlers
  const openLeadForm = (formType, prefilledData = {}) => {
    if (formType === 'emergency') {
      setShowEmergencyPopup(true)
    } else {
      setLeadFormModal(formType)
    }
  }

  // Emergency Popup Handlers
  const openEmergencyForm = () => {
    setShowEmergencyPopup(false)
    setLeadFormModal('emergency')
  }

  const closeEmergencyPopup = () => {
    setShowEmergencyPopup(false)
  }

  const callEmergencyNumber = () => {
    window.location.href = 'tel:+14805551234'
  }

  const handleLeadFormSubmit = async (e) => {
    e.preventDefault()

    // Use FormData approach (same as working contact form)
    const formData = new FormData(e.target)
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      serviceType: formData.get('serviceType'),
      urgency: formData.get('urgency'),
      budget: formData.get('budget'),
      projectDetails: formData.get('projectDetails'),
      preferredContact: formData.get('preferredContact'),
      preferredTime: formData.get('preferredTime'),
      address: formData.get('address'),
      source: `${leadFormModal}_cta`,
      submittedAt: new Date().toLocaleString()
    }

    // Here you would typically send to your CRM or email service
    console.log('Lead form submitted:', data)

    // Show success message
    setSubmittedFormData({
      type: leadFormModal,
      data: data
    })
    setShowSuccessPage(true)
    setLeadFormModal(null)

    // Auto-close success page after 5 seconds
    setTimeout(() => {
      setShowSuccessPage(false)
      setSubmittedFormData(null)
    }, 5000)
  }

  const closeLeadForm = () => {
    setLeadFormModal(null)
  }

  // Navigation component
  const Navigation = () => (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <a
            href="#"
            className="logo"
            onClick={(e) => {
              e.preventDefault();
              // Secret admin access: Cmd+Alt+Click on logo (Mac) or Ctrl+Alt+Click (PC)
              if ((e.metaKey && e.altKey) || (e.ctrlKey && e.altKey)) {
                setCurrentPage('admin');
              } else {
                setCurrentPage('home');
              }
              setShowSuccessPage(false); // Reset success page
            }}
          >
            <div className="logo-icon">
              <svg width="52" height="52" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
                <g transform="translate(-4318 -5714)">
                  <circle cx="400" cy="400" r="400" transform="translate(4318 5714)" fill="#1e2749" />
                  <g transform="translate(4523.205 5891.88)">
                    <g transform="translate(0.269 0.052)">
                      <path d="M194.6,32.106l166.79,96.3V373.463H27.807V128.406l166.79-96.3M194.6,0,0,112.353V401.271H389.213V112.353L194.6,0Z" fill="#ffdb00" />
                      <path d="M257.77,133.82,87.52,34.06,61.3,51.7l168.663,98.173V374.579H257.77Z" transform="translate(48.039 26.692)" fill="#ffdb00" />
                      <path d="M212.1,353.7H184.292V177.137L13.15,78.323,41.207,60.7,212.1,161.085Z" transform="translate(10.305 47.568)" fill="#ffdb00" />
                      <path d="M129.182,173.571,12.53,106.22v32.106l88.862,51.3V318.03h27.789Z" transform="translate(9.819 83.241)" fill="#ffdb00" />
                    </g>
                  </g>
                </g>
              </svg>
            </div>
            <div className="logo-text">
              <span>Scottsdale Handyman</span>
              <span className="logo-subtitle">Licensed & Insured</span>
            </div>
          </a>

          <nav className="nav-desktop">
            <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); setCurrentPage('home'); setShowSuccessPage(false); }}>Home</a>
            <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); setCurrentPage('about'); setShowSuccessPage(false); }}>About</a>
            <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); setCurrentPage('services'); setShowSuccessPage(false); }}>Services</a>
            <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); setCurrentPage('blog'); setShowSuccessPage(false); }}>Blog</a>
            <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); setCurrentPage('work-with-us'); setShowSuccessPage(false); }}>Work With Us</a>
            <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); setCurrentPage('pay'); setShowSuccessPage(false); }}>Pay Invoice</a>
            <a href="#contact" className="emergency-btn" onClick={(e) => { e.preventDefault(); openLeadForm('emergency'); }}>
              <Phone size={16} />
              Emergency
            </a>
          </nav>

          <button
            className="menu-btn"
            onClick={() => {
              const newMenuState = !isMenuOpen;
              setIsMenuOpen(newMenuState);
              if (newMenuState) {
                document.body.classList.add('menu-open');
              } else {
                document.body.classList.remove('menu-open');
              }
            }}
            aria-label="Toggle mobile menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <div className={`nav-mobile ${isMenuOpen ? 'open' : ''}`}>
          <div className="nav-mobile-content">
            <div className="nav-mobile-links">
              <a href="#" className="nav-mobile-link" onClick={(e) => {
                e.preventDefault();
                setCurrentPage('home');
                setShowSuccessPage(false);
                setIsMenuOpen(false);
                document.body.classList.remove('menu-open');
              }}>
                <Home size={20} />
                Home
              </a>
              <a href="#" className="nav-mobile-link" onClick={(e) => {
                e.preventDefault();
                setCurrentPage('about');
                setShowSuccessPage(false);
                setIsMenuOpen(false);
                document.body.classList.remove('menu-open');
              }}>
                <Users size={20} />
                About
              </a>
              <a href="#" className="nav-mobile-link" onClick={(e) => {
                e.preventDefault();
                setCurrentPage('services');
                setShowSuccessPage(false);
                setIsMenuOpen(false);
                document.body.classList.remove('menu-open');
              }}>
                <Wrench size={20} />
                Services
              </a>
              <a href="#" className="nav-mobile-link" onClick={(e) => {
                e.preventDefault();
                setCurrentPage('blog');
                setShowSuccessPage(false);
                setIsMenuOpen(false);
                document.body.classList.remove('menu-open');
              }}>
                <Star size={20} />
                Blog
              </a>
              <a href="#" className="nav-mobile-link" onClick={(e) => {
                e.preventDefault();
                setCurrentPage('work-with-us');
                setShowSuccessPage(false);
                setIsMenuOpen(false);
                document.body.classList.remove('menu-open');
              }}>
                <Users size={20} />
                Work With Us
              </a>
              <a href="#" className="nav-mobile-link" onClick={(e) => {
                e.preventDefault();
                setCurrentPage('pay');
                setShowSuccessPage(false);
                setIsMenuOpen(false);
                document.body.classList.remove('menu-open');
              }}>
                <CreditCard size={20} />
                Pay Invoice
              </a>
            </div>
            <div className="nav-mobile-contact">
              <h3>24/7 Emergency Service</h3>
              <a href="tel:4802555887" className="nav-mobile-contact-item">
                <Phone size={20} />
                (480) 255-5887
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  )

  // Emergency Popup Component
  const EmergencyPopup = () => {
    if (!showEmergencyPopup) return null;

    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        padding: '20px'
      }}>
        <div style={{
          backgroundColor: 'white',
          color: '#1f2937',
          borderRadius: '20px',
          padding: '40px',
          maxWidth: '500px',
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 20px 40px rgba(255, 68, 68, 0.4)',
          border: '4px solid #ff4444',
          animation: 'pulse 2s infinite'
        }}>
          {/* Emergency Icon */}
          <div style={{
            fontSize: '4rem',
            marginBottom: '20px',
            animation: 'flash 1s infinite alternate'
          }}>
            🚨
          </div>

          <h2 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            marginBottom: '10px',
            color: '#dc2626',
            textShadow: 'none'
          }}>
            EMERGENCY SERVICE
          </h2>

          <p style={{
            fontSize: '1.1rem',
            marginBottom: '30px',
            lineHeight: '1.5',
            color: '#4b5563'
          }}>
            Available 24/7 for urgent repairs. Choose how to reach us:
          </p>

          {/* Emergency Action Buttons */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            marginBottom: '30px'
          }}>
            <button
              onClick={callEmergencyNumber}
              style={{
                backgroundColor: '#fff',
                color: '#ff4444',
                border: '3px solid #ff4444',
                borderRadius: '12px',
                padding: '15px 25px',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#ff4444'
                e.target.style.color = 'white'
                e.target.style.transform = 'scale(1.05)'
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = '#fff'
                e.target.style.color = '#ff4444'
                e.target.style.transform = 'scale(1)'
              }}
            >
              <Phone size={24} />
              CALL NOW: (480) 555-1234
            </button>

            <button
              onClick={openEmergencyForm}
              style={{
                backgroundColor: '#f9fafb',
                color: '#374151',
                border: '2px solid #d1d5db',
                borderRadius: '12px',
                padding: '12px 25px',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#e5e7eb'
                e.target.style.color = '#1f2937'
                e.target.style.transform = 'scale(1.05)'
                e.target.style.borderColor = '#9ca3af'
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = '#f9fafb'
                e.target.style.color = '#374151'
                e.target.style.transform = 'scale(1)'
                e.target.style.borderColor = '#d1d5db'
              }}
            >
              📋 Fill Emergency Request Form
            </button>
          </div>

          {/* Additional Emergency Info */}
          <div style={{
            backgroundColor: '#f3f4f6',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '20px',
            fontSize: '0.95rem',
            border: '1px solid #e5e7eb'
          }}>
            <p style={{ margin: '0 0 10px 0', fontWeight: 'bold', color: '#dc2626' }}>
              ⚡ 24/7 Emergency Response
            </p>
            <p style={{ margin: '0', color: '#4b5563' }}>
              • Plumbing emergencies • Electrical issues<br />
              • Gas leaks • Structural damage<br />
              • Water damage • Safety hazards
            </p>
          </div>

          {/* Close Button */}
          <button
            onClick={closeEmergencyPopup}
            style={{
              position: 'absolute',
              top: '15px',
              right: '15px',
              background: 'none',
              border: 'none',
              color: '#6b7280',
              fontSize: '1.5rem',
              cursor: 'pointer',
              padding: '5px',
              borderRadius: '4px',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.color = '#374151'
              e.target.style.backgroundColor = '#f3f4f6'
            }}
            onMouseOut={(e) => {
              e.target.style.color = '#6b7280'
              e.target.style.backgroundColor = 'transparent'
            }}
          >
            <X size={20} />
          </button>
        </div>
      </div>
    );
  };

  // Smart Lead Form Modal Component
  const SmartLeadForm = () => {
    if (!leadFormModal) return null;

    const formConfig = {
      quote: {
        title: 'Get Your Free Quote',
        subtitle: 'Describe your project for a detailed estimate within 24 hours.',
        fields: ['name', 'email', 'phone', 'serviceType', 'budget', 'projectDetails', 'address', 'preferredContact']
      },
      emergency: {
        title: 'Emergency Service Request',
        subtitle: 'Describe your emergency and we will contact you immediately.',
        fields: ['name', 'phone', 'serviceType', 'urgency', 'projectDetails', 'address']
      },
      consultation: {
        title: 'Schedule Free Consultation',
        subtitle: 'Schedule a consultation to discuss your project in detail.',
        fields: ['name', 'email', 'phone', 'serviceType', 'preferredTime', 'projectDetails', 'preferredContact']
      },
      general: {
        title: 'Contact Us',
        subtitle: 'Contact us and we will respond within 24 hours.',
        fields: ['name', 'email', 'phone', 'projectDetails', 'preferredContact']
      }
    };

    const config = formConfig[leadFormModal];

    return (
      <div
        className="lead-form-modal-overlay"
        onClick={closeLeadForm}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100000,
          padding: '1rem'
        }}>
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            background: 'white',
            borderRadius: '12px',
            padding: '2rem',
            width: '100%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflow: 'auto',
            position: 'relative'
          }}>
          <button
            onClick={closeLeadForm}
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: 'var(--gray-500)'
            }}
          >
            <X size={24} />
          </button>

          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{
              color: leadFormModal === 'emergency' ? '#dc2626' : 'var(--gray-900)',
              marginBottom: '0.5rem',
              fontSize: '1.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              {leadFormModal === 'emergency' && '🚨'}
              {config.title}
            </h2>
            <p style={{ color: 'var(--gray-600)', fontSize: '1rem', lineHeight: '1.5' }}>
              {config.subtitle}
            </p>
          </div>

          <form onSubmit={handleLeadFormSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
            {config.fields.includes('name') && (
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--gray-700)' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  style={{
                    width: '100%',
                    padding: '0.875rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                  placeholder="John Smith"
                />
              </div>
            )}

            {config.fields.includes('email') && (
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--gray-700)' }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  style={{
                    width: '100%',
                    padding: '0.875rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                  placeholder="john@email.com"
                />
              </div>
            )}

            {config.fields.includes('phone') && (
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--gray-700)' }}>
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  onInput={handlePhoneInput}
                  maxLength="14"
                  style={{
                    width: '100%',
                    padding: '0.875rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                  placeholder="(480) 555-0123"
                />
              </div>
            )}

            {config.fields.includes('serviceType') && (
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--gray-700)' }}>
                  Service Type *
                </label>
                <select
                  name="serviceType"
                  required
                  style={{
                    width: '100%',
                    padding: '0.875rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="">Select a service...</option>
                  <option value="general_repair">General Repairs</option>
                  <option value="bathroom">Bathroom Renovation</option>
                  <option value="kitchen">Kitchen Remodeling</option>
                  <option value="electrical">Electrical Work</option>
                  <option value="plumbing">Plumbing</option>
                  <option value="painting">Painting</option>
                  <option value="flooring">Flooring</option>
                  <option value="maintenance">Home Maintenance</option>
                  <option value="emergency">Emergency Repair</option>
                  <option value="custom">Custom Project</option>
                </select>
              </div>
            )}

            {config.fields.includes('urgency') && (
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--gray-700)' }}>
                  Urgency Level *
                </label>
                <select
                  name="urgency"
                  required
                  style={{
                    width: '100%',
                    padding: '0.875rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="">Select urgency...</option>
                  <option value="immediate">Immediate (ASAP)</option>
                  <option value="today">Within 24 hours</option>
                  <option value="week">Within a week</option>
                  <option value="flexible">Flexible timing</option>
                </select>
              </div>
            )}

            {config.fields.includes('budget') && (
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--gray-700)' }}>
                  Estimated Budget
                </label>
                <select
                  name="budget"
                  style={{
                    width: '100%',
                    padding: '0.875rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="">Select budget range...</option>
                  <option value="under_500">Under $500</option>
                  <option value="500_1500">$500 - $1,500</option>
                  <option value="1500_5000">$1,500 - $5,000</option>
                  <option value="5000_15000">$5,000 - $15,000</option>
                  <option value="15000_plus">$15,000+</option>
                  <option value="not_sure">Not sure yet</option>
                </select>
              </div>
            )}

            {config.fields.includes('address') && (
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--gray-700)' }}>
                  Service Address
                </label>
                <input
                  type="text"
                  name="address"
                  style={{
                    width: '100%',
                    padding: '0.875rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                  placeholder="Scottsdale, AZ"
                />
              </div>
            )}

            {config.fields.includes('preferredTime') && (
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--gray-700)' }}>
                  Preferred Time for Consultation
                </label>
                <select
                  name="preferredTime"
                  style={{
                    width: '100%',
                    padding: '0.875rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="">Select preferred time...</option>
                  <option value="morning">Morning (8am - 12pm)</option>
                  <option value="afternoon">Afternoon (12pm - 5pm)</option>
                  <option value="evening">Evening (5pm - 8pm)</option>
                  <option value="weekend">Weekend</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>
            )}

            {config.fields.includes('projectDetails') && (
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--gray-700)' }}>
                  {leadFormModal === 'emergency' ? 'Describe the Emergency *' : 'Project Details'}
                </label>
                <textarea
                  name="projectDetails"
                  required={leadFormModal === 'emergency'}
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '0.875rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    resize: 'vertical'
                  }}
                  placeholder={
                    leadFormModal === 'emergency'
                      ? "Please describe the emergency situation in detail..."
                      : "Describe your project, requirements, timeline, etc."
                  }
                />
              </div>
            )}

            {config.fields.includes('preferredContact') && (
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--gray-700)' }}>
                  Preferred Contact Method
                </label>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="preferredContact"
                      value="phone"
                    />
                    <Phone size={16} />
                    Phone Call
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="preferredContact"
                      value="text"
                    />
                    <MessageSquare size={16} />
                    Text Message
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="preferredContact"
                      value="email"
                    />
                    <Mail size={16} />
                    Email
                  </label>
                </div>
              </div>
            )}

            <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={closeLeadForm}
                style={{
                  padding: '0.875rem 1.5rem',
                  background: '#f3f4f6',
                  color: '#6b7280',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600'
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  padding: '0.875rem 2rem',
                  background: leadFormModal === 'emergency' ? '#dc2626' : 'var(--primary-600)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: leadFormModal === 'emergency' ? '0 4px 12px rgba(220, 38, 38, 0.3)' : 'none'
                }}
              >
                <Send size={16} />
                {leadFormModal === 'emergency' ? 'Request Emergency Service' : 'Submit Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Home page component
  const HomePage = () => (
    <div>
      {/* Hero Section */}
      <section
        className="hero"
        style={{
          paddingBottom: '4rem',
          backgroundImage: 'linear-gradient(135deg, rgba(26, 54, 93, 0.5) 0%, rgba(44, 82, 130, 0.6) 50%, rgba(30, 60, 114, 0.5) 100%), url("https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600&h=900&fit=crop&auto=format")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Animated background overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 80%, rgba(255, 193, 7, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 193, 7, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(255, 255, 255, 0.05) 0%, transparent 50%)
          `,
          zIndex: 1
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="hero-content" style={{ color: 'white', textShadow: '2px 2px 8px rgba(0,0,0,0.6)' }}>
            <h1 className="hero-title" style={{
              color: 'white',
              textShadow: '3px 3px 10px rgba(0,0,0,0.7)',
              marginBottom: '1.5rem'
            }}>Scottsdale's Most Trusted Handyman Solutions</h1>
            <p className="hero-subtitle" style={{
              color: 'rgba(255,255,255,0.95)',
              fontSize: '1.3rem',
              fontWeight: '500',
              marginBottom: '1rem'
            }}>Local Experts • Quality Service • Innovative Solutions</p>
            <p className="hero-description" style={{
              color: 'rgba(255,255,255,0.9)',
              fontSize: '1.1rem',
              lineHeight: '1.6',
              maxWidth: '800px',
              margin: '0 auto'
            }}>
              From quick fixes to smart home upgrades, we're your neighborhood handyman team with the expertise
              to handle any project. Serving Scottsdale with pride, we combine traditional
              craftsmanship with modern technology.
            </p>

            <div className="cta-buttons" style={{ marginTop: '2.5rem', marginBottom: '3rem' }}>
              <button
                className="btn-primary"
                onClick={() => openLeadForm('quote')}
                style={{
                  background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                  color: '#000',
                  fontWeight: '700',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 8px 25px rgba(255, 215, 0, 0.4)',
                  transition: 'all 0.3s ease'
                }}
              >
                Get Free Quote
              </button>
              <button
                className="btn-secondary"
                onClick={() => openLeadForm('emergency')}
                style={{
                  background: 'rgba(220, 53, 69, 0.9)',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 8px 25px rgba(220, 53, 69, 0.3)'
                }}
              >
                <Phone size={20} />
                24/7 Emergency Service
              </button>
            </div>

            <div className="trust-indicators" style={{
              marginTop: '2.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'stretch',
              gap: '2rem',
              flexWrap: 'wrap'
            }}>
              <div className="trust-item" style={{
                textAlign: 'center',
                flex: '1',
                minWidth: '200px',
                padding: '2rem 1.5rem',
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(15px)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 193, 7, 0.3)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                minHeight: '160px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                transition: 'all 0.3s ease'
              }}>
                <div className="trust-icon" style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginBottom: '1rem'
                }}>
                  <div style={{
                    padding: '12px'
                  }}>
                    <MapPin size={28} />
                  </div>
                </div>
                <div className="trust-title" style={{
                  fontWeight: '700',
                  fontSize: '1.2rem',
                  marginBottom: '0.5rem',
                  color: '#FFD700'
                }}>Local Scottsdale Experts</div>
                <div className="trust-subtitle" style={{
                  fontSize: '0.9rem',
                  opacity: '0.9',
                  lineHeight: '1.4'
                }}>Serving the Valley with pride</div>
              </div>

              <div className="trust-item" style={{
                textAlign: 'center',
                flex: '1',
                minWidth: '200px',
                padding: '2rem 1.5rem',
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(15px)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 193, 7, 0.3)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                minHeight: '160px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                transition: 'all 0.3s ease'
              }}>
                <div className="trust-icon" style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginBottom: '1rem'
                }}>
                  <div style={{
                    padding: '12px'
                  }}>
                    <Award size={28} />
                  </div>
                </div>
                <div className="trust-title" style={{
                  fontWeight: '700',
                  fontSize: '1.2rem',
                  marginBottom: '0.5rem',
                  color: '#FFD700'
                }}>Licensed & Insured</div>
                <div className="trust-subtitle" style={{
                  fontSize: '0.9rem',
                  opacity: '0.9',
                  lineHeight: '1.4'
                }}>Full bonding & liability coverage</div>
              </div>

              <div className="trust-item" style={{
                textAlign: 'center',
                flex: '1',
                minWidth: '200px',
                padding: '2rem 1.5rem',
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(15px)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 193, 7, 0.3)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                minHeight: '160px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                transition: 'all 0.3s ease'
              }}>
                <div className="trust-icon" style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginBottom: '1rem'
                }}>
                  <div style={{
                    padding: '12px'
                  }}>
                    <Star size={28} />
                  </div>
                </div>
                <div className="trust-title" style={{
                  fontWeight: '700',
                  fontSize: '1.2rem',
                  marginBottom: '0.5rem',
                  color: '#FFD700'
                }}>98% Customer Satisfaction</div>
                <div className="trust-subtitle" style={{
                  fontSize: '0.9rem',
                  opacity: '0.9',
                  lineHeight: '1.4'
                }}>Our reputation speaks for itself</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="services" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
        <div className="container">
          <div className="section-header" style={{ marginBottom: '3rem' }}>
            <h2 className="section-title">Complete Handyman Services for Your Scottsdale Home</h2>
            <p className="section-subtitle">
              From emergency repairs to planned improvements, we handle it all with professional expertise and transparent pricing.
            </p>
          </div>

          <div className="services-grid" style={{ gap: '2rem' }}>
            <div className="service-card" style={{
              background: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url('https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80') center/cover`,
              color: 'white',
              position: 'relative'
            }}>
              <div className="service-icon" style={{ background: 'rgba(255, 215, 0, 0.9)' }}>
                <Wrench />
              </div>
              <h3 className="service-title" style={{ color: 'white' }}>Home Repairs</h3>
              <p className="service-description" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                Quick fixes and emergency repairs to keep your home safe and functional. From leaky faucets to electrical issues.
              </p>
              <div className="service-price" style={{ color: '#FFD700' }}>Starting at $125</div>
              <ul className="service-features">
                <li style={{ color: 'rgba(255, 255, 255, 0.9)' }}>Plumbing repairs</li>
                <li style={{ color: 'rgba(255, 255, 255, 0.9)' }}>Electrical troubleshooting</li>
                <li style={{ color: 'rgba(255, 255, 255, 0.9)' }}>Drywall patching</li>
                <li style={{ color: 'rgba(255, 255, 255, 0.9)' }}>Door & window adjustments</li>
              </ul>
              <button className="service-btn" onClick={() => openLeadForm('quote', { serviceType: 'general_repair' })}>
                Get Quote
              </button>
            </div>

            <div className="service-card" style={{
              background: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url('https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80') center/cover`,
              color: 'white',
              position: 'relative'
            }}>
              <div className="service-icon" style={{ background: 'rgba(255, 215, 0, 0.9)' }}>
                <Calendar />
              </div>
              <h3 className="service-title" style={{ color: 'white' }}>Maintenance Services</h3>
              <p className="service-description" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                Regular upkeep to prevent costly problems. Our maintenance plans keep your home in peak condition year-round.
              </p>
              <div className="service-price" style={{ color: '#FFD700' }}>Plans from $149/month</div>
              <ul className="service-features">
                <li style={{ color: 'rgba(255, 255, 255, 0.9)' }}>Monthly inspections</li>
                <li style={{ color: 'rgba(255, 255, 255, 0.9)' }}>Preventive maintenance</li>
                <li style={{ color: 'rgba(255, 255, 255, 0.9)' }}>Priority scheduling</li>
                <li style={{ color: 'rgba(255, 255, 255, 0.9)' }}>Seasonal preparations</li>
              </ul>
              <button className="service-btn" onClick={() => openLeadForm('quote', { serviceType: 'maintenance' })}>
                Get Quote
              </button>
            </div>

            <div className="service-card" style={{
              background: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url('https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80') center/cover`,
              color: 'white',
              position: 'relative'
            }}>
              <div className="service-icon" style={{ background: 'rgba(255, 215, 0, 0.9)' }}>
                <Home />
              </div>
              <h3 className="service-title" style={{ color: 'white' }}>Home Improvements</h3>
              <p className="service-description" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                Transform your space with professional installations and upgrades. Kitchen updates, bathroom improvements, and more.
              </p>
              <div className="service-price" style={{ color: '#FFD700' }}>Project quotes available</div>
              <ul className="service-features">
                <li style={{ color: 'rgba(255, 255, 255, 0.9)' }}>Kitchen upgrades</li>
                <li style={{ color: 'rgba(255, 255, 255, 0.9)' }}>Bathroom improvements</li>
                <li style={{ color: 'rgba(255, 255, 255, 0.9)' }}>Fixture installations</li>
                <li style={{ color: 'rgba(255, 255, 255, 0.9)' }}>Custom solutions</li>
              </ul>
              <button className="service-btn" onClick={() => openLeadForm('quote', { serviceType: 'custom' })}>
                Get Quote
              </button>
            </div>

            <div className="service-card" style={{
              background: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url('https://images.unsplash.com/photo-1536431311719-398b6704d4cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80') center/cover`,
              color: 'white',
              position: 'relative'
            }}>
              <div className="service-icon" style={{ background: 'rgba(255, 215, 0, 0.9)' }}>
                <Zap />
              </div>
              <h3 className="service-title" style={{ color: 'white' }}>Emergency Services</h3>
              <p className="service-description" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                24/7 availability for urgent repairs that can't wait. Burst pipes, electrical failures, and security issues.
              </p>
              <div className="service-price" style={{ color: '#FFD700' }}>Emergency rates apply</div>
              <ul className="service-features">
                <li style={{ color: 'rgba(255, 255, 255, 0.9)' }}>24/7 availability</li>
                <li style={{ color: 'rgba(255, 255, 255, 0.9)' }}>1-4 hour response</li>
                <li style={{ color: 'rgba(255, 255, 255, 0.9)' }}>Licensed professionals</li>
                <li style={{ color: 'rgba(255, 255, 255, 0.9)' }}>Immediate solutions</li>
              </ul>
              <button className="service-btn" onClick={() => openLeadForm('emergency', { serviceType: 'emergency' })}>
                Get Quote
              </button>
            </div>

            <div className="service-card" style={{
              background: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url('https://images.unsplash.com/photo-1558002038-1055907df827?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80') center/cover`,
              color: 'white',
              position: 'relative'
            }}>
              <div className="service-icon" style={{ background: 'rgba(255, 215, 0, 0.9)' }}>
                <Smartphone />
              </div>
              <h3 className="service-title" style={{ color: 'white' }}>Smart Home Solutions</h3>
              <p className="service-description" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                Bring your home into the future with smart technology integration. Thermostats, security systems, and automation.
              </p>
              <div className="service-price" style={{ color: '#FFD700' }}>Packages from $1,285</div>
              <ul className="service-features">
                <li style={{ color: 'rgba(255, 255, 255, 0.9)' }}>Smart thermostats</li>
                <li style={{ color: 'rgba(255, 255, 255, 0.9)' }}>Security systems</li>
                <li style={{ color: 'rgba(255, 255, 255, 0.9)' }}>Lighting automation</li>
                <li style={{ color: 'rgba(255, 255, 255, 0.9)' }}>Energy monitoring</li>
              </ul>
              <button className="service-btn" onClick={() => openLeadForm('quote', { serviceType: 'custom' })}>
                Get Quote
              </button>
            </div>

            <div className="service-card" style={{
              background: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url('https://images.unsplash.com/photo-1607400201889-565b1ee75f8e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80') center/cover`,
              color: 'white',
              position: 'relative'
            }}>
              <div className="service-icon" style={{ background: 'rgba(255, 215, 0, 0.9)' }}>
                <Thermometer />
              </div>
              <h3 className="service-title" style={{ color: 'white' }}>Seasonal Services</h3>
              <p className="service-description" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                Prepare your home for Arizona's unique climate challenges. Spring prep, summer cooling, and winter protection.
              </p>
              <div className="service-price" style={{ color: '#FFD700' }}>Seasonal packages available</div>
              <ul className="service-features">
                <li style={{ color: 'rgba(255, 255, 255, 0.9)' }}>HVAC tune-ups</li>
                <li style={{ color: 'rgba(255, 255, 255, 0.9)' }}>Weatherproofing</li>
                <li style={{ color: 'rgba(255, 255, 255, 0.9)' }}>Pool equipment checks</li>
                <li style={{ color: 'rgba(255, 255, 255, 0.9)' }}>Energy efficiency</li>
              </ul>
              <button className="service-btn" onClick={() => openLeadForm('quote', { serviceType: 'maintenance' })}>
                Get Quote
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="why-choose" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
        <div className="container">
          <div className="section-header" style={{ marginBottom: '3rem' }}>
            <h2 className="section-title">Why Scottsdale Homeowners Choose Us</h2>
          </div>

          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">
                <Shield />
              </div>
              <h3 className="feature-title">Licensed & Insured Protection</h3>
              <p className="feature-description">
                We are fully licensed and insured, which means you're protected by Arizona's strict contractor regulations.
                Full liability insurance and bonding give you peace of mind on every project.
              </p>
            </div>

            <div className="feature-item">
              <div className="feature-icon">
                <MapPin />
              </div>
              <h3 className="feature-title">Local Scottsdale Expertise</h3>
              <p className="feature-description">
                We understand the unique challenges of Scottsdale homes. From desert climate considerations
                to local building codes, our team knows what works in your neighborhood.
              </p>
            </div>

            <div className="feature-item">
              <div className="feature-icon">
                <DollarSign />
              </div>
              <h3 className="feature-title">Transparent, Fair Pricing</h3>
              <p className="feature-description">
                No surprises, no hidden fees. We provide detailed estimates upfront and stick to our quoted prices.
                You know exactly what you're paying for before we start work.
              </p>
            </div>

            <div className="feature-item">
              <div className="feature-icon">
                <CheckCircle />
              </div>
              <h3 className="feature-title">Quality Guarantee</h3>
              <p className="feature-description">
                Every job comes with our satisfaction guarantee and comprehensive warranty coverage.
                We stand behind our work because we take pride in delivering exceptional results.
              </p>
            </div>

            <div className="feature-item">
              <div className="feature-icon">
                <Smartphone />
              </div>
              <h3 className="feature-title">Modern Technology Integration</h3>
              <p className="feature-description">
                We're not just traditional handymen – we're technology experts too. From smart home installations
                to energy-efficient upgrades, we help modernize your home.
              </p>
            </div>

            <div className="feature-item">
              <div className="feature-icon">
                <Clock />
              </div>
              <h3 className="feature-title">Fast, Reliable Service</h3>
              <p className="feature-description">
                Same-day service available for most repairs. Emergency response within 1-4 hours.
                We respect your time and show up when we say we will.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Inspiration Gallery Section */}
      <section className="gallery" style={{
        paddingTop: '4rem',
        paddingBottom: '4rem',
        backgroundColor: '#f8fafc'
      }}>
        <div className="container">
          <div className="section-header" style={{ marginBottom: '3rem' }}>
            <h2 className="section-title">Inspiration Gallery</h2>
            <p className="section-subtitle">
              Get inspired by our completed projects and see the quality craftsmanship we bring to every job.
              From luxury kitchens to spa-like bathrooms, we transform homes throughout Scottsdale.
            </p>
          </div>

          <div className="gallery-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '2rem',
            marginBottom: '2rem'
          }}>
            {projectGallery.slice(0, 12).map((project) => (
              <div key={project.id} className="gallery-item" style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'pointer'
              }}>
                <div style={{ position: 'relative', overflow: 'hidden' }}>
                  <img
                    src={project.image}
                    alt={project.alt || project.title}
                    className="gallery-image"
                    style={{
                      width: '100%',
                      height: '250px',
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease'
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    backgroundColor: '#1e40af',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    fontWeight: '600'
                  }}>
                    {project.category}
                  </div>
                </div>
                <div className="gallery-content" style={{ padding: '1.5rem' }}>
                  <h3 className="gallery-title" style={{
                    fontSize: '1.25rem',
                    fontWeight: '700',
                    marginBottom: '0.5rem',
                    color: '#1e293b'
                  }}>{project.title}</h3>
                  <p className="gallery-description" style={{
                    color: '#64748b',
                    fontSize: '0.875rem',
                    marginBottom: '1rem',
                    lineHeight: '1.5'
                  }}>{project.description}</p>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.75rem',
                    color: '#6b7280'
                  }}>
                    <span style={{ fontWeight: '600' }}>⏱️ {project.completionTime}</span>
                    <span style={{ fontWeight: '600' }}>💰 {project.budget}</span>
                  </div>
                  <div style={{ marginTop: '1rem' }}>
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '0.5rem',
                      marginTop: '0.5rem'
                    }}>
                      {project.features.slice(0, 3).map((feature, index) => (
                        <span key={index} style={{
                          backgroundColor: '#e0e7ff',
                          color: '#3730a3',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: '500'
                        }}>
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem', marginBottom: '2rem' }}>
            <button className="btn-primary" style={{
              backgroundColor: '#1e40af',
              color: 'white',
              padding: '1rem 2rem',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1.125rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }} onClick={() => openLeadForm('consultation')}>
              View All Projects & Get Your Quote
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
        <div className="container">
          <div className="section-header" style={{ marginBottom: '3rem' }}>
            <h2 className="section-title">What Our Scottsdale Neighbors Say</h2>
          </div>

          <div className="testimonials-grid" style={{ gap: '2rem' }}>
            <div className="testimonial-card">
              <p className="testimonial-quote">
                "After calling three other handyman services with no response, The Scottsdale Handyman
                had someone at my house within two hours. They fixed my garbage disposal and installed a new
                faucet the same day. Professional, courteous, and reasonably priced!"
              </p>
              <div className="testimonial-author">Sarah M.</div>
              <div className="testimonial-location">Desert Ridge</div>
            </div>

            <div className="testimonial-card">
              <p className="testimonial-quote">
                "I needed several electrical outlets installed in my home office, and being ROC licensed was
                important to me. The team did excellent work, cleaned up completely, and even gave me tips
                on energy efficiency."
              </p>
              <div className="testimonial-author">Mike R.</div>
              <div className="testimonial-location">Old Town Scottsdale</div>
            </div>

            <div className="testimonial-card">
              <p className="testimonial-quote">
                "We've been using their monthly maintenance plan for over a year now. It's amazing how many
                small issues they catch and fix before they become big problems. The peace of mind is worth
                every penny."
              </p>
              <div className="testimonial-author">Jennifer L.</div>
              <div className="testimonial-location">McCormick Ranch</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
        <div className="container">
          <div className="section-header" style={{ marginBottom: '3rem' }}>
            <h2 className="section-title">Ready to Help with Your Next Project</h2>
            <p className="section-subtitle">
              Multiple ways to reach us, fast response times, and emergency service available 24/7.
            </p>
          </div>

          <div className="contact-grid" style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '3rem',
            alignItems: 'flex-start'
          }}>
            <div className="contact-info" style={{
              display: 'grid',
              gridTemplateRows: 'repeat(3, 1fr)',
              gap: '1.5rem',
              height: 'fit-content'
            }}>
              <div className="contact-item" style={{
                backgroundColor: '#ffffff',
                padding: '2rem',
                borderRadius: '12px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                textAlign: 'center',
                border: '1px solid #e5e7eb',
                minHeight: '180px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                <div className="contact-item-icon" style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                  color: '#1e40af'
                }}>
                  <Phone size={32} />
                </div>
                <h3 className="contact-item-title" style={{
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  marginBottom: '0.5rem',
                  color: '#1e293b'
                }}>Call Us Today</h3>
                <div className="contact-item-value" style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                  color: '#1e40af'
                }}>(480) 255-5887</div>
                <p className="contact-item-description" style={{
                  fontSize: '0.875rem',
                  color: '#64748b',
                  margin: '0'
                }}>Available during business hours & 24/7 for emergencies</p>
              </div>

              <div className="contact-item" style={{
                backgroundColor: '#ffffff',
                padding: '2rem',
                borderRadius: '12px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                textAlign: 'center',
                border: '1px solid #e5e7eb',
                minHeight: '180px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                <div className="contact-item-icon" style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                  color: '#1e40af'
                }}>
                  <Mail size={32} />
                </div>
                <h3 className="contact-item-title" style={{
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  marginBottom: '0.5rem',
                  color: '#1e293b'
                }}>Email</h3>
                <div className="contact-item-value" style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                  color: '#1e40af'
                }}>info@scottsdalehandyman.com</div>
                <p className="contact-item-description" style={{
                  fontSize: '0.875rem',
                  color: '#64748b',
                  margin: '0'
                }}>Response within 24 hours</p>
              </div>

              <div className="contact-item" style={{
                backgroundColor: '#ffffff',
                padding: '2rem',
                borderRadius: '12px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                textAlign: 'center',
                border: '1px solid #e5e7eb',
                minHeight: '180px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                <div className="contact-item-icon" style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                  color: '#1e40af'
                }}>
                  <Clock size={32} />
                </div>
                <h3 className="contact-item-title" style={{
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  marginBottom: '0.5rem',
                  color: '#1e293b'
                }}>Business Hours</h3>
                <div className="contact-item-value" style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                  color: '#1e40af'
                }}>Mon-Fri: 8AM-6PM, Sat: 9AM-4PM</div>
                <p className="contact-item-description" style={{
                  fontSize: '0.875rem',
                  color: '#64748b',
                  margin: '0'
                }}>Emergency service available 24/7</p>
              </div>
            </div>

            <div className="contact-form" style={{
              backgroundColor: '#f8fafc',
              padding: '2rem',
              borderRadius: '12px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 className="form-title" style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                marginBottom: '0.5rem',
                textAlign: 'center'
              }}>Get Your Free Estimate Today</h3>
              <p className="form-description" style={{
                marginBottom: '2rem',
                textAlign: 'center',
                color: '#64748b',
                fontSize: '1rem'
              }}>
                Fill out the form below and we'll contact you within 24 hours to discuss your project.
              </p>

              <form onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.target)
                const data = {
                  name: formData.get('name'),
                  email: formData.get('email'),
                  phone: formData.get('phone'),
                  message: formData.get('message'),
                  submittedAt: new Date().toLocaleString()
                }
                setSubmittedFormData(data)
                setShowSuccessPage(true)
                // Auto redirect back to home after 5 seconds
                setTimeout(() => {
                  setShowSuccessPage(false)
                  setSubmittedFormData(null)
                }, 5000)
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <input
                    name="name"
                    type="text"
                    placeholder="Your Name"
                    required
                    style={{
                      padding: '12px',
                      border: '2px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  />

                  <input
                    name="email"
                    type="email"
                    placeholder="Your Email"
                    required
                    style={{
                      padding: '12px',
                      border: '2px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  />

                  <input
                    name="phone"
                    type="tel"
                    placeholder="Your Phone Number"
                    required
                    onInput={handlePhoneInput}
                    maxLength="14"
                    style={{
                      padding: '12px',
                      border: '2px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  />

                  <textarea
                    name="message"
                    placeholder="Describe your project..."
                    rows="4"
                    required
                    style={{
                      padding: '12px',
                      border: '2px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '16px',
                      resize: 'vertical'
                    }}
                  />

                  <button
                    type="submit"
                    style={{
                      padding: '15px',
                      backgroundColor: '#1e40af',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '18px',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    Get Free Quote
                  </button>
                </div>

                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                  <p style={{ color: '#6b7280', fontSize: '14px' }}>
                    ✓ Licensed & Insured • ✓ Free Estimates • ✓ Emergency Service Available
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Before & After Showcase Section */}
      <section className="before-after-showcase" style={{
        paddingTop: '4rem',
        paddingBottom: '4rem',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
      }}>
        <div className="container">
          <div className="section-header" style={{ marginBottom: '3rem' }}>
            <h2 className="section-title">Amazing Transformations</h2>
            <p className="section-subtitle">
              See the incredible results our expert team delivers for Scottsdale homeowners
            </p>
          </div>

          <div className="before-after-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '3rem',
            marginBottom: '3rem'
          }}>
            <div className="before-after-item" style={{
              background: 'white',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
              position: 'relative'
            }}>
              <div style={{ position: 'relative' }}>
                <img
                  src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop"
                  alt="Kitchen transformation before and after"
                  style={{ width: '100%', height: '250px', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  left: '1rem',
                  background: 'rgba(22, 101, 52, 0.9)',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  fontWeight: '600'
                }}>
                  AFTER
                </div>
              </div>
              <div style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem', color: '#1e293b' }}>
                  Kitchen Modernization - Desert Ridge
                </h3>
                <p style={{ color: '#64748b', marginBottom: '1rem', fontSize: '0.9rem' }}>
                  Transformed outdated kitchen into modern culinary space with custom cabinetry, quartz countertops, and designer lighting
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#6b7280' }}>
                  <span>💰 $28,000</span>
                  <span>⏱️ 3 weeks</span>
                  <span>⭐ 5-star result</span>
                </div>
              </div>
            </div>

            <div className="before-after-item" style={{
              background: 'white',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
              position: 'relative'
            }}>
              <div style={{ position: 'relative' }}>
                <img
                  src="https://images.unsplash.com/photo-1620626011761-996317b8d101?w=600&h=400&fit=crop"
                  alt="Bathroom renovation before and after"
                  style={{ width: '100%', height: '250px', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  left: '1rem',
                  background: 'rgba(22, 101, 52, 0.9)',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  fontWeight: '600'
                }}>
                  AFTER
                </div>
              </div>
              <div style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem', color: '#1e293b' }}>
                  Luxury Master Bath - Old Town
                </h3>
                <p style={{ color: '#64748b', marginBottom: '1rem', fontSize: '0.9rem' }}>
                  Complete bathroom renovation featuring walk-in shower, marble vanity, and heated floors
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#6b7280' }}>
                  <span>💰 $22,000</span>
                  <span>⏱️ 2 weeks</span>
                  <span>⭐ 5-star result</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <button className="btn-primary" style={{
              backgroundColor: '#1e40af',
              color: 'white',
              padding: '1rem 2rem',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1.125rem',
              fontWeight: '600',
              cursor: 'pointer'
            }} onClick={() => openLeadForm('consultation')}>
              See More Transformations & Get Your Quote
            </button>
          </div>
        </div>
      </section>

      {/* Process & Timeline Section */}
      <section className="process-timeline" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
        <div className="container">
          <div className="section-header" style={{ marginBottom: '3rem' }}>
            <h2 className="section-title">Our Proven 5-Step Process</h2>
            <p className="section-subtitle">
              From consultation to completion, we make home improvement stress-free
            </p>
          </div>

          <div className="process-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem',
            marginBottom: '3rem'
          }}>
            <div className="process-step" style={{
              textAlign: 'center',
              padding: '2rem',
              background: 'white',
              borderRadius: '12px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              border: '2px solid #e5e7eb',
              position: 'relative'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                background: 'linear-gradient(135deg, #3b82f6, #1e40af)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                color: 'white',
                fontSize: '1.5rem',
                fontWeight: '700'
              }}>1</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1rem', color: '#1e293b' }}>
                Free Consultation
              </h3>
              <p style={{ color: '#64748b', lineHeight: '1.6' }}>
                We assess your needs, discuss options, and provide detailed estimates with transparent pricing
              </p>
            </div>

            <div className="process-step" style={{
              textAlign: 'center',
              padding: '2rem',
              background: 'white',
              borderRadius: '12px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              border: '2px solid #e5e7eb',
              position: 'relative'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                background: 'linear-gradient(135deg, #3b82f6, #1e40af)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                color: 'white',
                fontSize: '1.5rem',
                fontWeight: '700'
              }}>2</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1rem', color: '#1e293b' }}>
                Planning & Design
              </h3>
              <p style={{ color: '#64748b', lineHeight: '1.6' }}>
                We create detailed plans and source quality materials, ensuring everything meets your vision
              </p>
            </div>

            <div className="process-step" style={{
              textAlign: 'center',
              padding: '2rem',
              background: 'white',
              borderRadius: '12px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              border: '2px solid #e5e7eb',
              position: 'relative'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                background: 'linear-gradient(135deg, #3b82f6, #1e40af)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                color: 'white',
                fontSize: '1.5rem',
                fontWeight: '700'
              }}>3</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1rem', color: '#1e293b' }}>
                Permit & Preparation
              </h3>
              <p style={{ color: '#64748b', lineHeight: '1.6' }}>
                We handle all permits and prep work, protecting your home and ensuring code compliance
              </p>
            </div>

            <div className="process-step" style={{
              textAlign: 'center',
              padding: '2rem',
              background: 'white',
              borderRadius: '12px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              border: '2px solid #e5e7eb',
              position: 'relative'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                background: 'linear-gradient(135deg, #3b82f6, #1e40af)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                color: 'white',
                fontSize: '1.5rem',
                fontWeight: '700'
              }}>4</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1rem', color: '#1e293b' }}>
                Expert Installation
              </h3>
              <p style={{ color: '#64748b', lineHeight: '1.6' }}>
                Our skilled craftsmen execute the work with precision, keeping you informed every step
              </p>
            </div>

            <div className="process-step" style={{
              textAlign: 'center',
              padding: '2rem',
              background: 'white',
              borderRadius: '12px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              border: '2px solid #e5e7eb',
              position: 'relative'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                background: 'linear-gradient(135deg, #3b82f6, #1e40af)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                color: 'white',
                fontSize: '1.5rem',
                fontWeight: '700'
              }}>5</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1rem', color: '#1e293b' }}>
                Final Walkthrough
              </h3>
              <p style={{ color: '#64748b', lineHeight: '1.6' }}>
                We ensure everything meets our high standards and your complete satisfaction
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Service Areas Map Section */}
      <section className="service-areas" style={{
        paddingTop: '4rem',
        paddingBottom: '4rem',
        backgroundColor: '#f8fafc'
      }}>
        <div className="container">
          <div className="section-header" style={{ marginBottom: '3rem' }}>
            <h2 className="section-title">Proudly Serving Greater Scottsdale</h2>
            <p className="section-subtitle">
              Local expertise across all Scottsdale neighborhoods and surrounding communities
            </p>
          </div>

          <div className="service-areas-content" style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '4rem',
            alignItems: 'center'
          }}>
            <div className="service-areas-image" style={{
              background: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop') center/cover`,
              height: '400px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '2rem',
              fontWeight: '700',
              textAlign: 'center'
            }}>
              <div>
                <MapPin size={48} />
                <div style={{ marginTop: '1rem' }}>Scottsdale & Beyond</div>
              </div>
            </div>

            <div className="service-areas-list">
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '2rem', color: '#1e293b' }}>
                We Service These Communities:
              </h3>
              <div className="areas-grid" style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem'
              }}>
                {[
                  'Old Town Scottsdale', 'Desert Ridge', 'McCormick Ranch', 'Gainey Ranch',
                  'Scottsdale Ranch', 'Paradise Valley Village', 'North Scottsdale', 'Central Scottsdale',
                  'Kierland', 'Troon Village', 'Desert Mountain', 'Fountain Hills',
                  'Cave Creek', 'Carefree', 'Pinnacle Peak', 'Ahwatukee Foothills'
                ].map((area, index) => (
                  <div key={index} style={{
                    background: 'white',
                    padding: '1rem',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '0.9rem',
                    fontWeight: '500'
                  }}>
                    <CheckCircle size={16} style={{ color: '#16a34a', marginRight: '0.5rem' }} />
                    {area}
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <h4 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#1e293b' }}>
                  📍 Service Area Details
                </h4>
                <ul style={{ margin: 0, paddingLeft: '1rem', color: '#64748b' }}>
                  <li>✅ Free estimates within 25 miles of Scottsdale</li>
                  <li>🚚 Same-day service available in core areas</li>
                  <li>⚡ Emergency response throughout the Valley</li>
                  <li>🏠 Residential and light commercial services</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
        <div className="container">
          <div className="section-header" style={{ marginBottom: '3rem' }}>
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-subtitle">
              Get answers to common questions about our handyman services
            </p>
          </div>

          <div className="faq-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '2rem'
          }}>
            {[
              {
                q: "Are you licensed and insured?",
                a: "Yes, we are fully licensed by the Arizona Registrar of Contractors (ROC) and carry comprehensive general liability and workers' compensation insurance. You can verify our license status anytime."
              },
              {
                q: "Do you provide free estimates?",
                a: "Absolutely! We provide free, detailed estimates for all projects. Our estimates include materials, labor, timeline, and any permits required. No hidden fees or surprises."
              },
              {
                q: "How quickly can you start my project?",
                a: "Most repairs can be completed same-day or within 24 hours. Larger projects typically start within 3-5 business days. Emergency services are available 24/7 with 1-4 hour response times."
              },
              {
                q: "What areas do you serve?",
                a: "We serve all of Scottsdale and surrounding communities including Paradise Valley, Fountain Hills, Cave Creek, and parts of Phoenix. Free estimates within 25 miles of Scottsdale."
              },
              {
                q: "Do you handle permit applications?",
                a: "Yes, we handle all necessary permit applications and ensure all work meets local building codes. We work with Scottsdale and other municipal building departments regularly."
              },
              {
                q: "What warranty do you provide?",
                a: "We provide a comprehensive warranty on all work - 1 year on labor and we honor manufacturer warranties on materials. We stand behind our craftsmanship 100%."
              }
            ].map((faq, index) => (
              <div key={index} className="faq-item" style={{
                background: 'white',
                padding: '2rem',
                borderRadius: '12px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e5e7eb'
              }}>
                <h4 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: '1rem', color: '#1e293b' }}>
                  {faq.q}
                </h4>
                <p style={{ color: '#64748b', lineHeight: '1.6', margin: 0 }}>
                  {faq.a}
                </p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <p style={{ fontSize: '1.125rem', marginBottom: '1.5rem', color: '#64748b' }}>
              Have more questions? We're here to help!
            </p>
            <button className="btn-primary" style={{
              backgroundColor: '#1e40af',
              color: 'white',
              padding: '1rem 2rem',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1.125rem',
              fontWeight: '600',
              cursor: 'pointer'
            }} onClick={() => openLeadForm('consultation')}>
              Ask Us Anything
            </button>
          </div>
        </div>
      </section>

      {/* Emergency Services Banner */}
      <section className="emergency-banner" style={{
        paddingTop: '3rem',
        paddingBottom: '3rem',
        background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
        color: 'white',
        border: 'none',
        boxShadow: '0 10px 25px rgba(220, 38, 38, 0.3)'
      }}>
        <div className="container">
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
              <AlertTriangle size={48} color="white" />
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '1rem', color: 'white' }}>
              24/7 Emergency Handyman Services - Fast Response Guaranteed
            </h2>
            <p style={{ fontSize: '1.2rem', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem', color: 'white' }}>
              Water damage, power outages, or lock-outs? Our licensed professionals are standing by to help when emergencies strike.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn-emergency" style={{
                background: 'white',
                color: '#dc2626',
                padding: '1rem 2rem',
                border: '2px solid white',
                borderRadius: '8px',
                fontSize: '1.125rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                transition: 'all 0.3s ease'
              }} onClick={() => openLeadForm('emergency')}>
                <Phone size={20} />
                Call Now: (480) 255-5887
              </button>
              <button className="btn-emergency-secondary" style={{
                background: 'transparent',
                color: 'white',
                padding: '1rem 2rem',
                border: '2px solid white',
                borderRadius: '8px',
                fontSize: '1.125rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }} onClick={() => openLeadForm('emergency')}>
                Request Emergency Service
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )

  // About page component
  const AboutPage = () => (
    <div style={{ minHeight: 'calc(100vh - 120px)' }}>
      <section
        className="hero"
        style={{
          backgroundImage: 'linear-gradient(135deg, rgba(44, 82, 130, 0.5) 0%, rgba(26, 54, 93, 0.6) 50%, rgba(30, 60, 114, 0.5) 100%), url("https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1600&h=900&fit=crop&auto=format")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Background overlay with subtle patterns */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 25% 75%, rgba(255, 193, 7, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 75% 25%, rgba(255, 193, 7, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.05) 0%, transparent 60%)
          `,
          zIndex: 1
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="hero-content" style={{
            color: 'white',
            textShadow: '3px 3px 10px rgba(0,0,0,0.7)',
            textAlign: 'center',
            maxWidth: '900px',
            margin: '0 auto'
          }}>
            <h1 className="hero-title" style={{
              color: 'white',
              fontSize: '3.2rem',
              fontWeight: '800',
              marginBottom: '1.5rem',
              lineHeight: '1.2'
            }}>About The Scottsdale Handyman</h1>
            <p className="hero-subtitle" style={{
              color: '#FFD700',
              fontSize: '1.4rem',
              fontWeight: '600',
              marginBottom: '1.5rem'
            }}>Your Trusted Local Handyman Experts Since Day One</p>
            <p className="hero-description" style={{
              color: 'rgba(255,255,255,0.95)',
              fontSize: '1.15rem',
              lineHeight: '1.7',
              maxWidth: '800px',
              margin: '0 auto'
            }}>
              We understand that your home is more than just a building – it's your sanctuary, your investment,
              and the place where life's most important moments unfold.
            </p>
          </div>
        </div>
      </section>

      <section className="services">
        <div className="container">
          <div className="content-wrapper text-left wide">
            <div className="about-grid">
              <div>
                <h2>Our Story</h2>
                <p className="lead">
                  The Scottsdale Handyman was founded on a simple principle: every homeowner deserves reliable,
                  professional service at a fair price.
                </p>
                <p>
                  As licensed contractors (ROC #327266), we bring years of experience and a commitment to excellence to every project.
                  What started as a small local business has grown into Scottsdale's most trusted handyman service, completing over
                  500 projects and maintaining a 98% customer satisfaction rate.
                </p>
                <p>
                  Our journey began when we recognized a significant gap in the local market. Too many homeowners were struggling
                  to find reliable contractors for smaller projects, while others were being overcharged for simple repairs. We saw
                  an opportunity to build something different – a handyman service that treats every job with the same level of
                  professionalism and attention to detail.
                </p>
              </div>

              <div>
                <h2>Our Mission</h2>
                <p className="lead">
                  To provide exceptional handyman services that enhance the comfort, safety, and value of your home.
                </p>
                <p>
                  We combine traditional craftsmanship with modern technology to deliver solutions that exceed expectations.
                  Every project, whether it's a simple repair or a complex renovation, receives our full attention and
                  professional expertise.
                </p>

                <h3>Why Choose Us</h3>
                <p>
                  Operating under Arizona ROC License #327266, we're not just another handyman service – we're a fully licensed
                  contractor committed to the highest standards of professionalism and quality. This licensing means we're held
                  to strict state regulations, carry comprehensive insurance coverage, and have demonstrated our competency in
                  the construction trades.
                </p>

                <h3>Local Expertise</h3>
                <p>
                  As Scottsdale natives, we understand the unique challenges that Arizona's desert climate presents to homeowners.
                  This local knowledge, combined with our commitment to industry best practices, ensures that every solution we
                  provide is perfectly suited to our desert environment.
                </p>
              </div>
            </div>
          </div>

          {/* Professional Team Section */}
          <div style={{
            background: `linear-gradient(rgba(26, 54, 93, 0.95), rgba(44, 82, 130, 0.95)), url('https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80') center/cover`,
            padding: '80px 20px',
            borderRadius: '20px',
            color: 'white',
            textAlign: 'center',
            margin: '60px 0',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(135deg, rgba(26, 54, 93, 0.9) 0%, rgba(44, 82, 130, 0.85) 100%)',
              borderRadius: '20px'
            }}></div>

            <div style={{ position: 'relative', zIndex: 2 }}>
              <h2 style={{
                fontSize: '2.8rem',
                marginBottom: '40px',
                fontWeight: '800',
                textShadow: '2px 2px 8px rgba(0,0,0,0.5)'
              }}>
                🏆 Meet Our Professional Team
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', maxWidth: '1000px', margin: '0 auto' }}>
                <div style={{
                  padding: '35px',
                  background: 'rgba(255,255,255,0.15)',
                  borderRadius: '16px',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
                }}>
                  <div style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    background: `url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80') center/cover`,
                    margin: '0 auto 20px',
                    border: '4px solid rgba(255, 215, 0, 0.8)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.3)'
                  }}></div>
                  <h3 style={{ fontSize: '1.7rem', marginBottom: '15px', fontWeight: '700', textShadow: '1px 1px 4px rgba(0,0,0,0.3)' }}>Mike Johnson</h3>
                  <p style={{ fontSize: '1.2rem', color: '#FFD700', marginBottom: '15px', fontWeight: '600' }}>Lead Handyman & Owner</p>
                  <p style={{ fontSize: '1rem', opacity: '0.95', lineHeight: '1.6', textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
                    15+ years experience in residential repairs and improvements. Licensed ROC contractor specializing in electrical and plumbing.
                  </p>
                </div>

                <div style={{
                  padding: '35px',
                  background: 'rgba(255,255,255,0.15)',
                  borderRadius: '16px',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
                }}>
                  <div style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    background: `url('https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80') center/cover`,
                    margin: '0 auto 20px',
                    border: '4px solid rgba(255, 215, 0, 0.8)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.3)'
                  }}></div>
                  <h3 style={{ fontSize: '1.7rem', marginBottom: '15px', fontWeight: '700', textShadow: '1px 1px 4px rgba(0,0,0,0.3)' }}>Carlos Rodriguez</h3>
                  <p style={{ fontSize: '1.2rem', color: '#FFD700', marginBottom: '15px', fontWeight: '600' }}>Senior Technician</p>
                  <p style={{ fontSize: '1rem', opacity: '0.95', lineHeight: '1.6', textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
                    Expert in home improvements and renovations. Specializes in kitchen and bathroom remodeling with 12+ years experience.
                  </p>
                </div>

                <div style={{
                  padding: '35px',
                  background: 'rgba(255,255,255,0.15)',
                  borderRadius: '16px',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
                }}>
                  <div style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    background: `url('https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80') center/cover`,
                    margin: '0 auto 20px',
                    border: '4px solid rgba(255, 215, 0, 0.8)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.3)'
                  }}></div>
                  <h3 style={{ fontSize: '1.7rem', marginBottom: '15px', fontWeight: '700', textShadow: '1px 1px 4px rgba(0,0,0,0.3)' }}>Dave Thompson</h3>
                  <p style={{ fontSize: '1.2rem', color: '#FFD700', marginBottom: '15px', fontWeight: '600' }}>Smart Home Specialist</p>
                  <p style={{ fontSize: '1rem', opacity: '0.95', lineHeight: '1.6', textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
                    Technology expert specializing in smart home installations, security systems, and home automation solutions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )

  // SEO-Optimized Services page component
  const ServicesPage = () => (
    <div style={{ minHeight: 'calc(100vh - 120px)', padding: '120px 20px 80px', backgroundColor: '#f8f9fa' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', color: '#1e3c72', marginBottom: '2rem' }}>🔧 Our Professional Services</h1>
        <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '3rem' }}>
          Comprehensive handyman services for your Scottsdale home
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            border: '2px solid #FFD700'
          }}>
            <h3 style={{ color: '#1e3c72', fontSize: '1.5rem', marginBottom: '1rem' }}>⚡ Electrical Services</h3>
            <p style={{ color: '#666', marginBottom: '1rem' }}>Professional electrical work for your home</p>
            <p style={{ color: '#FFD700', fontWeight: 'bold' }}>Starting at $125</p>
          </div>

          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            border: '2px solid #FFD700'
          }}>
            <h3 style={{ color: '#1e3c72', fontSize: '1.5rem', marginBottom: '1rem' }}>🔧 Plumbing Services</h3>
            <p style={{ color: '#666', marginBottom: '1rem' }}>Expert plumbing repairs and installations</p>
            <p style={{ color: '#FFD700', fontWeight: 'bold' }}>Starting at $95</p>
          </div>

          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            border: '2px solid #FFD700'
          }}>
            <h3 style={{ color: '#1e3c72', fontSize: '1.5rem', marginBottom: '1rem' }}>🏠 Home Repairs</h3>
            <p style={{ color: '#666', marginBottom: '1rem' }}>Quality home repair services</p>
            <p style={{ color: '#FFD700', fontWeight: 'bold' }}>Starting at $85</p>
          </div>
        </div>

        <button
          style={{
            background: '#FFD700',
            color: '#1a1a1a',
            padding: '15px 30px',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
          onClick={() => openLeadForm('quote')}
        >
          Get Free Quote
        </button>
      </div>

      {/* Company Story Section */}
      <section style={{
        paddingTop: '4rem',
        paddingBottom: '4rem',
        backgroundColor: 'white'
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '4rem',
            alignItems: 'center',
            marginBottom: '4rem'
          }}>
            <div>
              <h2 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '2rem', color: '#1e293b' }}>
                Our Story: Building Scottsdale Dreams Since 2018
              </h2>
              <p style={{ fontSize: '1.125rem', lineHeight: '1.8', color: '#64748b', marginBottom: '1.5rem' }}>
                Founded by master craftsman Mike Rodriguez, The Scottsdale Handyman began as a vision to
                bring honest, reliable home improvement services to our growing community. What started
                as a one-man operation has grown into a trusted team of skilled professionals.
              </p>
              <p style={{ fontSize: '1.125rem', lineHeight: '1.8', color: '#64748b', marginBottom: '2rem' }}>
                We've completed over 2,500 projects, from simple repairs to complete home transformations,
                always with the same commitment to quality and customer satisfaction that started it all.
              </p>
              <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#1e40af' }}>2,500+</div>
                  <div style={{ color: '#64748b', fontWeight: '500' }}>Projects Completed</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#1e40af' }}>98%</div>
                  <div style={{ color: '#64748b', fontWeight: '500' }}>Satisfaction Rate</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#1e40af' }}>6</div>
                  <div style={{ color: '#64748b', fontWeight: '500' }}>Years Serving</div>
                </div>
              </div>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop"
                alt="Professional handyman team working on home improvement project"
                style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section style={{
        paddingTop: '4rem',
        paddingBottom: '4rem',
        backgroundColor: '#f8fafc'
      }}>
        <div className="container">
          <div className="section-header" style={{ marginBottom: '3rem', textAlign: 'center' }}>
            <h2 className="section-title">Meet Our Expert Team</h2>
            <p className="section-subtitle">
              Skilled craftsmen with decades of combined experience in home improvement
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            <div className="team-member" style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '12px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              textAlign: 'center'
            }}>
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face"
                alt="Mike Rodriguez - Founder & Master Craftsman"
                style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 1.5rem' }}
              />
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem', color: '#1e293b' }}>
                Mike Rodriguez
              </h3>
              <p style={{ color: '#1e40af', fontWeight: '600', marginBottom: '1rem' }}>
                Founder & Master Craftsman
              </p>
              <p style={{ color: '#64748b', lineHeight: '1.6', marginBottom: '1rem' }}>
                20+ years experience in residential construction and home improvement. Licensed general contractor
                and certified in electrical and plumbing work.
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                <span style={{ background: '#e0e7ff', color: '#3730a3', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '500' }}>
                  ROC Licensed
                </span>
                <span style={{ background: '#e0e7ff', color: '#3730a3', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '500' }}>
                  Master Electrician
                </span>
              </div>
            </div>

            <div className="team-member" style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '12px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              textAlign: 'center'
            }}>
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face"
                alt="David Chen - Senior Carpenter"
                style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 1.5rem' }}
              />
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem', color: '#1e293b' }}>
                David Chen
              </h3>
              <p style={{ color: '#1e40af', fontWeight: '600', marginBottom: '1rem' }}>
                Senior Carpenter & Project Manager
              </p>
              <p style={{ color: '#64748b', lineHeight: '1.6', marginBottom: '1rem' }}>
                15+ years specializing in custom cabinetry, built-ins, and precision finish work.
                Expert in kitchen and bathroom renovations.
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                <span style={{ background: '#e0e7ff', color: '#3730a3', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '500' }}>
                  Master Carpenter
                </span>
                <span style={{ background: '#e0e7ff', color: '#3730a3', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '500' }}>
                  Project Management
                </span>
              </div>
            </div>

            <div className="team-member" style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '12px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              textAlign: 'center'
            }}>
              <img
                src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=face"
                alt="Carlos Mendez - Plumbing & HVAC Specialist"
                style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 1.5rem' }}
              />
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem', color: '#1e293b' }}>
                Carlos Mendez
              </h3>
              <p style={{ color: '#1e40af', fontWeight: '600', marginBottom: '1rem' }}>
                Plumbing & HVAC Specialist
              </p>
              <p style={{ color: '#64748b', lineHeight: '1.6', marginBottom: '1rem' }}>
                Licensed plumber with 12+ years experience. Specializes in complex pipe repairs,
                water heater installation, and HVAC maintenance.
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                <span style={{ background: '#e0e7ff', color: '#3730a3', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '500' }}>
                  Licensed Plumber
                </span>
                <span style={{ background: '#e0e7ff', color: '#3730a3', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '500' }}>
                  HVAC Certified
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values & Mission Section */}
      <section style={{
        paddingTop: '4rem',
        paddingBottom: '4rem',
        backgroundColor: 'white'
      }}>
        <div className="container">
          <div className="section-header" style={{ marginBottom: '3rem', textAlign: 'center' }}>
            <h2 className="section-title">Our Mission & Values</h2>
            <p className="section-subtitle">
              The principles that guide every project and interaction
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '4rem',
            alignItems: 'center'
          }}>
            <div>
              <h3 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '1.5rem', color: '#1e293b' }}>
                Our Mission
              </h3>
              <p style={{ fontSize: '1.125rem', lineHeight: '1.8', color: '#64748b', marginBottom: '2rem' }}>
                To be Scottsdale's most trusted handyman service by delivering exceptional craftsmanship,
                transparent pricing, and outstanding customer service on every project, no matter how big or small.
              </p>

              <div className="values-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '40px', height: '40px', background: '#1e40af', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle size={20} color="white" />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1e293b', margin: 0 }}>Quality First</h4>
                    <p style={{ color: '#64748b', margin: 0, fontSize: '0.9rem' }}>Excellence in every detail, from materials to finishing touches</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '40px', height: '40px', background: '#1e40af', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Shield size={20} color="white" />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1e293b', margin: 0 }}>Trust & Reliability</h4>
                    <p style={{ color: '#64748b', margin: 0, fontSize: '0.9rem' }}>On-time service, honest communication, and guaranteed results</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '40px', height: '40px', background: '#1e40af', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Heart size={20} color="white" />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1e293b', margin: 0 }}>Community Focus</h4>
                    <p style={{ color: '#64748b', margin: 0, fontSize: '0.9rem' }}>Supporting Scottsdale homeowners and local businesses</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <img
                src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=500&fit=crop"
                alt="Professional handyman team working with precision and care"
                style={{ width: '100%', height: '450px', objectFit: 'cover', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Certifications & Awards Section */}
      <section style={{
        paddingTop: '4rem',
        paddingBottom: '4rem',
        backgroundColor: '#f8fafc'
      }}>
        <div className="container">
          <div className="section-header" style={{ marginBottom: '3rem', textAlign: 'center' }}>
            <h2 className="section-title">Certifications & Recognition</h2>
            <p className="section-subtitle">
              Professional credentials and industry recognition that ensure quality work
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem'
          }}>
            <div className="credential-item" style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '12px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              textAlign: 'center'
            }}>
              <Award size={48} style={{ color: '#fbbf24', marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem', color: '#1e293b' }}>
                Arizona ROC License
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                Licensed General Contractor - ROC #12345678
              </p>
            </div>

            <div className="credential-item" style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '12px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              textAlign: 'center'
            }}>
              <Shield size={48} style={{ color: '#10b981', marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem', color: '#1e293b' }}>
                Fully Insured
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                $2M Liability • Workers Compensation • Bonded
              </p>
            </div>

            <div className="credential-item" style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '12px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              textAlign: 'center'
            }}>
              <Star size={48} style={{ color: '#f59e0b', marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem', color: '#1e293b' }}>
                HomeAdvisor Elite
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                Top-rated professional with 5-star reviews
              </p>
            </div>

            <div className="credential-item" style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '12px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              textAlign: 'center'
            }}>
              <CheckCircle size={48} style={{ color: '#8b5cf6', marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem', color: '#1e293b' }}>
                BBB Accredited
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                A+ Rating with Better Business Bureau
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Community Involvement Section */}
      <section style={{
        paddingTop: '4rem',
        paddingBottom: '4rem',
        backgroundColor: 'white'
      }}>
        <div className="container">
          <div className="section-header" style={{ marginBottom: '3rem', textAlign: 'center' }}>
            <h2 className="section-title">Community Involvement</h2>
            <p className="section-subtitle">
              Giving back to the Scottsdale community we're proud to call home
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            <div className="community-item" style={{
              background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
              padding: '2rem',
              borderRadius: '12px',
              border: '1px solid #e5e7eb'
            }}>
              <Home size={40} style={{ color: '#1e40af', marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1rem', color: '#1e293b' }}>
                Habitat for Humanity
              </h3>
              <p style={{ color: '#64748b', lineHeight: '1.6' }}>
                Our team volunteers monthly with Habitat for Humanity, helping build affordable housing
                for families in need throughout the Phoenix metro area.
              </p>
            </div>

            <div className="community-item" style={{
              background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
              padding: '2rem',
              borderRadius: '12px',
              border: '1px solid #e5e7eb'
            }}>
              <Users size={40} style={{ color: '#1e40af', marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1rem', color: '#1e293b' }}>
                Senior Assistance Program
              </h3>
              <p style={{ color: '#64748b', lineHeight: '1.6' }}>
                We provide discounted home safety modifications and repairs for seniors on fixed incomes,
                helping them age safely in their homes.
              </p>
            </div>

            <div className="community-item" style={{
              background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
              padding: '2rem',
              borderRadius: '12px',
              border: '1px solid #e5e7eb'
            }}>
              <GraduationCap size={40} style={{ color: '#1e40af', marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1rem', color: '#1e293b' }}>
                Trade Skills Education
              </h3>
              <p style={{ color: '#64748b', lineHeight: '1.6' }}>
                We partner with local high schools to provide hands-on trade skills training,
                inspiring the next generation of skilled craftsmen.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )

  // Modern Blog page component with enhanced design and functionality  
  const BlogPage = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('All')
    const [sortBy, setSortBy] = useState('newest')

    // Get unique categories
    const categories = ['All', ...new Set(blogPosts.map(post => post.category))]

    // Filter and sort posts
    const filteredPosts = blogPosts
      .filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
        const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory
        return matchesSearch && matchesCategory
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.date) - new Date(a.date)
        if (sortBy === 'oldest') return new Date(a.date) - new Date(b.date)
        if (sortBy === 'popular') return b.readTime.localeCompare(a.readTime)
        return 0
      })

    // Featured posts (first 2 posts marked as featured)
    const featuredPosts = blogPosts.filter(post => post.featured).slice(0, 2)

    return (
      <div style={{ minHeight: 'calc(100vh - 120px)', backgroundColor: '#fafafa' }}>
        {/* Hero Section */}
        <section style={{
          background: 'linear-gradient(135deg, #1e3a5f 0%, #2c5aa0 50%, #3b6ec7 100%)',
          color: 'white',
          padding: '100px 0 80px 0',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Background Pattern */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255, 215, 0, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 215, 0, 0.1) 0%, transparent 50%), radial-gradient(circle at 40% 80%, rgba(255, 215, 0, 0.08) 0%, transparent 50%)`,
            opacity: 0.7
          }}></div>

          {/* Animated Background Overlays */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(45deg, rgba(255, 215, 0, 0.05) 0%, transparent 50%, rgba(255, 215, 0, 0.03) 100%)',
            animation: 'shimmer 8s ease-in-out infinite alternate'
          }}></div>

          {/* Decorative Elements */}
          <div style={{
            position: 'absolute',
            top: '10%',
            left: '10%',
            width: '80px',
            height: '80px',
            backgroundColor: 'rgba(255, 215, 0, 0.15)',
            borderRadius: '50%',
            animation: 'float 6s ease-in-out infinite',
            backdropFilter: 'blur(10px)'
          }}></div>
          <div style={{
            position: 'absolute',
            bottom: '15%',
            right: '15%',
            width: '60px',
            height: '60px',
            backgroundColor: 'rgba(255, 215, 0, 0.12)',
            borderRadius: '50%',
            animation: 'float 8s ease-in-out infinite reverse',
            backdropFilter: 'blur(8px)'
          }}></div>

          <div className="container" style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ textAlign: 'center', maxWidth: '900px', margin: '0 auto' }}>
              {/* Icon */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '80px',
                height: '80px',
                backgroundColor: 'rgba(255, 215, 0, 0.2)',
                borderRadius: '50%',
                marginBottom: '2rem',
                backdropFilter: 'blur(15px)',
                border: '1px solid rgba(255, 215, 0, 0.3)'
              }}>
                <BookOpen size={36} color="#FFD700" />
              </div>

              <h1 style={{
                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                fontWeight: '900',
                marginBottom: '1.5rem',
                lineHeight: '1.1',
                textShadow: '2px 4px 12px rgba(0,0,0,0.4)',
                color: 'white',
                letterSpacing: '-0.02em'
              }}>
                Home Improvement<br />
                <span style={{
                  background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  Insights & Tips
                </span>
              </h1>

              <p style={{
                fontSize: '1.3rem',
                marginBottom: '2.5rem',
                opacity: 0.95,
                lineHeight: '1.7',
                color: 'white',
                maxWidth: '700px',
                margin: '0 auto 2.5rem'
              }}>
                Expert guidance from Scottsdale's trusted handyman professionals. Discover maintenance tips,
                renovation ideas, and seasonal advice to keep your desert home in perfect condition.
              </p>

              {/* Enhanced Search Bar */}
              <div style={{
                position: 'relative',
                maxWidth: '600px',
                margin: '0 auto',
                marginTop: '2.5rem'
              }}>
                <div style={{
                  position: 'relative',
                  background: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '50px',
                  padding: '4px',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.3)'
                }}>
                  <Search size={22} style={{
                    position: 'absolute',
                    left: '20px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#666',
                    zIndex: 3
                  }} />
                  <input
                    type="text"
                    placeholder="Search home improvement tips, guides, and expert advice..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '18px 20px 18px 55px',
                      borderRadius: '46px',
                      border: 'none',
                      fontSize: '1.1rem',
                      outline: 'none',
                      backgroundColor: 'transparent',
                      color: '#333',
                      fontWeight: '500'
                    }}
                  />
                  <button style={{
                    position: 'absolute',
                    right: '6px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '44px',
                    height: '44px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(255, 215, 0, 0.4)',
                    transition: 'all 0.3s ease'
                  }}>
                    <Search size={18} color="white" />
                  </button>
                </div>
              </div>

              {/* Stats Row */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '3rem',
                marginTop: '3rem',
                flexWrap: 'wrap'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: '700', color: '#FFD700', marginBottom: '0.5rem' }}>
                    {blogPosts.length}+
                  </div>
                  <div style={{ fontSize: '0.9rem', opacity: 0.8, color: 'white' }}>Expert Articles</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: '700', color: '#FFD700', marginBottom: '0.5rem' }}>
                    15+
                  </div>
                  <div style={{ fontSize: '0.9rem', opacity: 0.8, color: 'white' }}>Years Experience</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: '700', color: '#FFD700', marginBottom: '0.5rem' }}>
                    500+
                  </div>
                  <div style={{ fontSize: '0.9rem', opacity: 0.8, color: 'white' }}>Happy Homeowners</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="container" style={{ paddingTop: '40px', paddingBottom: '60px' }}>
          {selectedBlogPost ? (
            // Individual blog post view with enhanced design
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
              <button
                onClick={() => setSelectedBlogPost(null)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '10px 20px',
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #e9ecef',
                  borderRadius: '25px',
                  color: '#495057',
                  cursor: 'pointer',
                  marginBottom: '2rem',
                  fontSize: '0.95rem',
                  fontWeight: '500',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#e9ecef'
                  e.target.style.transform = 'translateX(-5px)'
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = '#f8f9fa'
                  e.target.style.transform = 'translateX(0)'
                }}
              >
                <ArrowLeft size={18} />
                Back to Articles
              </button>

              <article style={{
                backgroundColor: 'white',
                borderRadius: '15px',
                overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
              }}>
                <img
                  src={selectedBlogPost.image}
                  alt={selectedBlogPost.title}
                  style={{
                    width: '100%',
                    height: '400px',
                    objectFit: 'cover'
                  }}
                />

                <div style={{ padding: '3rem' }}>
                  {/* Article Meta */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                    <span style={{
                      padding: '0.4rem 1rem',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      borderRadius: '20px',
                      fontSize: '0.85rem',
                      fontWeight: '600'
                    }}>
                      {selectedBlogPost.category}
                    </span>
                    <span style={{ color: '#6c757d', fontSize: '0.9rem' }}>
                      {selectedBlogPost.date}
                    </span>
                    <span style={{ color: '#6c757d', fontSize: '0.9rem' }}>
                      {selectedBlogPost.readTime}
                    </span>
                    {selectedBlogPost.tags && (
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {selectedBlogPost.tags.map(tag => (
                          <span key={tag} style={{
                            padding: '0.2rem 0.6rem',
                            backgroundColor: '#f8f9fa',
                            color: '#495057',
                            fontSize: '0.75rem',
                            borderRadius: '12px',
                            border: '1px solid #e9ecef'
                          }}>
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <h1 style={{
                    fontSize: '2.75rem',
                    fontWeight: '800',
                    marginBottom: '1.5rem',
                    lineHeight: '1.2',
                    color: '#212529'
                  }}>
                    {selectedBlogPost.title}
                  </h1>

                  <p style={{
                    fontSize: '1.2rem',
                    color: '#6c757d',
                    marginBottom: '3rem',
                    fontStyle: 'italic',
                    lineHeight: '1.6',
                    borderLeft: '4px solid #667eea',
                    paddingLeft: '1.5rem'
                  }}>
                    {selectedBlogPost.excerpt}
                  </p>

                  {/* Article Content with Better Typography */}
                  <div style={{
                    fontSize: '1.1rem',
                    lineHeight: '1.8',
                    color: '#495057'
                  }}>
                    {selectedBlogPost.content.split('\n\n').map((paragraph, index) => (
                      <div key={index} style={{ marginBottom: '2rem' }}>
                        {paragraph.startsWith('**') && paragraph.endsWith('**') ? (
                          <h3 style={{
                            fontSize: '1.5rem',
                            fontWeight: '700',
                            color: '#212529',
                            marginBottom: '1rem',
                            borderBottom: '2px solid #e9ecef',
                            paddingBottom: '0.5rem'
                          }}>
                            {paragraph.slice(2, -2)}
                          </h3>
                        ) : (
                          <p>{paragraph}</p>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Call to Action */}
                  <div style={{
                    marginTop: '4rem',
                    padding: '2.5rem',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '15px',
                    textAlign: 'center',
                    color: 'white'
                  }}>
                    <h3 style={{ fontSize: '1.75rem', marginBottom: '1rem', fontWeight: '700' }}>
                      Ready to Get Started?
                    </h3>
                    <p style={{ fontSize: '1.1rem', marginBottom: '2rem', opacity: 0.95 }}>
                      Our licensed professionals are ready to help you implement these solutions in your Scottsdale home.
                    </p>
                    <button
                      onClick={() => openLeadForm('quote')}
                      style={{
                        padding: '12px 30px',
                        backgroundColor: 'white',
                        color: '#667eea',
                        border: 'none',
                        borderRadius: '25px',
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.transform = 'translateY(-2px)'
                        e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.25)'
                      }}
                      onMouseOut={(e) => {
                        e.target.style.transform = 'translateY(0)'
                        e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)'
                      }}
                    >
                      Get Your Free Consultation
                    </button>
                  </div>
                </div>
              </article>
            </div>
          ) : (
            // Blog list view with modern grid layout
            <>
              {/* Featured Articles Section */}
              {featuredPosts.length > 0 && (
                <section style={{ marginBottom: '4rem' }}>
                  <h2 style={{
                    fontSize: '2.5rem',
                    fontWeight: '700',
                    marginBottom: '2rem',
                    textAlign: 'center',
                    color: '#212529'
                  }}>
                    Featured Articles
                  </h2>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: featuredPosts.length > 1 ? 'repeat(auto-fit, minmax(400px, 1fr))' : '1fr',
                    gap: '2rem',
                    maxWidth: '1200px',
                    margin: '0 auto'
                  }}>
                    {featuredPosts.map((post) => (
                      <div
                        key={post.id}
                        onClick={() => setSelectedBlogPost(post)}
                        style={{
                          backgroundColor: 'white',
                          borderRadius: '15px',
                          overflow: 'hidden',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                          position: 'relative'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.transform = 'translateY(-8px)'
                          e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.15)'
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)'
                          e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)'
                        }}
                      >
                        <div style={{ position: 'relative' }}>
                          <img
                            src={post.image}
                            alt={post.title}
                            style={{
                              width: '100%',
                              height: '250px',
                              objectFit: 'cover'
                            }}
                          />
                          <div style={{
                            position: 'absolute',
                            top: '15px',
                            left: '15px',
                            padding: '0.4rem 1rem',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            borderRadius: '20px',
                            fontSize: '0.85rem',
                            fontWeight: '600'
                          }}>
                            Featured
                          </div>
                        </div>

                        <div style={{ padding: '2rem' }}>
                          <div style={{ marginBottom: '1rem' }}>
                            <span style={{
                              padding: '0.3rem 0.8rem',
                              backgroundColor: '#f8f9fa',
                              color: '#495057',
                              borderRadius: '15px',
                              fontSize: '0.8rem',
                              fontWeight: '600',
                              marginRight: '1rem'
                            }}>
                              {post.category}
                            </span>
                            <span style={{ color: '#6c757d', fontSize: '0.9rem' }}>
                              {post.readTime}
                            </span>
                          </div>

                          <h3 style={{
                            fontSize: '1.4rem',
                            fontWeight: '700',
                            marginBottom: '1rem',
                            lineHeight: '1.3',
                            color: '#212529'
                          }}>
                            {post.title}
                          </h3>

                          <p style={{
                            color: '#6c757d',
                            marginBottom: '1.5rem',
                            lineHeight: '1.6',
                            fontSize: '0.95rem'
                          }}>
                            {post.excerpt}
                          </p>

                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            paddingTop: '1rem',
                            borderTop: '1px solid #f1f3f4'
                          }}>
                            <span style={{ color: '#6c757d', fontSize: '0.85rem' }}>
                              {post.date}
                            </span>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              color: '#667eea',
                              fontWeight: '600',
                              fontSize: '0.9rem'
                            }}>
                              Read Article
                              <ChevronRight size={16} />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Enhanced Filter & Sort Section */}
              <section style={{
                marginBottom: '3rem',
                padding: '2.5rem',
                backgroundColor: 'white',
                borderRadius: '20px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                border: '1px solid rgba(102, 126, 234, 0.1)'
              }}>
                <div style={{
                  display: 'flex',
                  gap: '2rem',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between'
                }}>
                  {/* Category Filter */}
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontWeight: '600',
                      color: '#1e3a5f',
                      marginRight: '0.5rem'
                    }}>
                      <Filter size={18} />
                      Categories:
                    </div>
                    {categories.map(category => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        style={{
                          padding: '0.6rem 1.2rem',
                          border: selectedCategory === category ? 'none' : '2px solid #e9ecef',
                          background: selectedCategory === category
                            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                            : 'white',
                          color: selectedCategory === category ? 'white' : '#495057',
                          borderRadius: '25px',
                          cursor: 'pointer',
                          fontSize: '0.9rem',
                          fontWeight: '600',
                          transition: 'all 0.3s ease',
                          boxShadow: selectedCategory === category
                            ? '0 4px 15px rgba(102, 126, 234, 0.3)'
                            : '0 2px 8px rgba(0,0,0,0.1)',
                          transform: selectedCategory === category ? 'translateY(-2px)' : 'none'
                        }}
                        onMouseEnter={(e) => {
                          if (selectedCategory !== category) {
                            e.target.style.borderColor = '#667eea'
                            e.target.style.transform = 'translateY(-1px)'
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedCategory !== category) {
                            e.target.style.borderColor = '#e9ecef'
                            e.target.style.transform = 'none'
                          }
                        }}
                      >
                        {category}
                        {selectedCategory === category && (
                          <span style={{ marginLeft: '0.5rem' }}>✓</span>
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Enhanced Sort Options */}
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontWeight: '600',
                      color: '#1e3a5f'
                    }}>
                      <TrendingUp size={18} />
                      Sort by:
                    </div>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      style={{
                        padding: '0.6rem 2.5rem 0.6rem 1rem',
                        border: '2px solid #e9ecef',
                        borderRadius: '12px',
                        backgroundColor: 'white',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        transition: 'all 0.3s ease',
                        backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")',
                        backgroundPosition: 'right 0.5rem center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '1.5em 1.5em',
                        appearance: 'none'
                      }}
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="popular">Most Popular</option>
                    </select>
                  </div>
                </div>
              </section>

              {/* All Articles Grid */}
              <section>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '2rem'
                }}>
                  <h2 style={{
                    fontSize: '2rem',
                    fontWeight: '700',
                    color: '#212529'
                  }}>
                    All Articles
                  </h2>
                  <span style={{ color: '#6c757d' }}>
                    {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''} found
                  </span>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                  gap: '2rem'
                }}>
                  {filteredPosts.map((post) => (
                    <article
                      key={post.id}
                      onClick={() => setSelectedBlogPost(post)}
                      style={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                        border: '1px solid #f1f3f4'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'translateY(-5px)'
                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.12)'
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)'
                        e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.08)'
                      }}
                    >
                      <img
                        src={post.image}
                        alt={post.title}
                        style={{
                          width: '100%',
                          height: '200px',
                          objectFit: 'cover'
                        }}
                      />

                      <div style={{ padding: '1.5rem' }}>
                        <div style={{ marginBottom: '1rem' }}>
                          <span style={{
                            padding: '0.25rem 0.75rem',
                            backgroundColor: '#f8f9fa',
                            color: '#495057',
                            borderRadius: '12px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            marginRight: '1rem'
                          }}>
                            {post.category}
                          </span>
                          <span style={{ color: '#6c757d', fontSize: '0.85rem' }}>
                            {post.readTime}
                          </span>
                        </div>

                        <h3 style={{
                          fontSize: '1.2rem',
                          fontWeight: '700',
                          marginBottom: '0.75rem',
                          lineHeight: '1.3',
                          color: '#212529'
                        }}>
                          {post.title}
                        </h3>

                        <p style={{
                          color: '#6c757d',
                          marginBottom: '1rem',
                          lineHeight: '1.5',
                          fontSize: '0.9rem'
                        }}>
                          {post.excerpt}
                        </p>

                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          paddingTop: '1rem',
                          borderTop: '1px solid #f1f3f4'
                        }}>
                          <span style={{ color: '#6c757d', fontSize: '0.8rem' }}>
                            {post.date}
                          </span>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            color: '#667eea',
                            fontSize: '0.85rem',
                            fontWeight: '600'
                          }}>
                            Read More
                            <ChevronRight size={14} />
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                {filteredPosts.length === 0 && (
                  <div style={{
                    textAlign: 'center',
                    padding: '4rem 2rem',
                    backgroundColor: 'white',
                    borderRadius: '15px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
                  }}>
                    <Search size={48} style={{ color: '#6c757d', marginBottom: '1rem' }} />
                    <h3 style={{ color: '#495057', marginBottom: '1rem' }}>No articles found</h3>
                    <p style={{ color: '#6c757d' }}>
                      Try adjusting your search terms or browse all categories.
                    </p>
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </div>
    )
  }

  // Work With Us page component
  const WorkWithUsPage = () => (
    <div style={{ minHeight: 'calc(100vh - 120px)' }}>
      {/* Hero Section */}
      <section
        className="hero"
        style={{
          background: 'linear-gradient(135deg, #1e3a5f 0%, #2c5aa0 50%, #3b6ec7 100%)',
          color: 'white',
          padding: '100px 0 80px 0',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Background Pattern */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255, 215, 0, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 215, 0, 0.1) 0%, transparent 50%), radial-gradient(circle at 40% 80%, rgba(255, 215, 0, 0.08) 0%, transparent 50%)`,
          opacity: 0.7
        }}></div>

        {/* Animated Background Overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(45deg, rgba(255, 215, 0, 0.05) 0%, transparent 50%, rgba(255, 215, 0, 0.03) 100%)',
          animation: 'shimmer 8s ease-in-out infinite alternate'
        }}></div>

        {/* Decorative Elements */}
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: '80px',
          height: '80px',
          backgroundColor: 'rgba(255, 215, 0, 0.15)',
          borderRadius: '50%',
          animation: 'float 6s ease-in-out infinite',
          backdropFilter: 'blur(10px)'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '15%',
          right: '15%',
          width: '60px',
          height: '60px',
          backgroundColor: 'rgba(255, 215, 0, 0.12)',
          borderRadius: '50%',
          animation: 'float 8s ease-in-out infinite reverse',
          backdropFilter: 'blur(8px)'
        }}></div>

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="hero-content" style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
            {/* Icon */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '80px',
              height: '80px',
              backgroundColor: 'rgba(255, 215, 0, 0.2)',
              borderRadius: '50%',
              marginBottom: '2rem',
              backdropFilter: 'blur(15px)',
              border: '1px solid rgba(255, 215, 0, 0.3)'
            }}>
              <Users size={36} color="#FFD700" />
            </div>

            <h1 className="hero-title" style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: '900',
              marginBottom: '1.5rem',
              lineHeight: '1.1',
              textShadow: '2px 4px 12px rgba(0,0,0,0.4)',
              letterSpacing: '-0.02em'
            }}>
              Join Our Professional
              <br />
              <span style={{
                background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Handyman Team
              </span>
            </h1>
            <p className="hero-subtitle" style={{
              fontSize: '1.3rem',
              marginBottom: '1.5rem',
              opacity: 0.95,
              lineHeight: '1.7'
            }}>
              Build a rewarding career with Scottsdale's most trusted handyman company
            </p>
            <p className="hero-description" style={{
              fontSize: '1.1rem',
              lineHeight: '1.6',
              opacity: 0.85,
              maxWidth: '700px',
              margin: '0 auto'
            }}>
              We're seeking skilled professionals who share our commitment to quality workmanship and exceptional customer service.
              Join a team that values expertise, integrity, and professional growth.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section style={{ padding: '4rem 0', background: '#f8f9fa' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#2d3748', marginBottom: '1rem' }}>
              Why Work With Us?
            </h2>
            <p style={{ fontSize: '1.1rem', color: '#4a5568', maxWidth: '600px', margin: '0 auto' }}>
              We offer more than just a job – we provide a career path with growth opportunities, competitive benefits, and a supportive work environment.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
            marginBottom: '3rem'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '20px',
              padding: '2.5rem',
              boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
              textAlign: 'center',
              border: '1px solid rgba(255, 215, 0, 0.2)',
              backdropFilter: 'blur(20px)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)'
                e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.15)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 10px 40px rgba(0,0,0,0.1)'
              }}>
              <div style={{
                width: '70px',
                height: '70px',
                background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                boxShadow: '0 8px 25px rgba(255, 215, 0, 0.3)'
              }}>
                <DollarSign size={28} color="white" />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '600', color: '#2d3748', marginBottom: '1rem' }}>
                Competitive Compensation
              </h3>
              <p style={{ color: '#4a5568', lineHeight: '1.6', marginBottom: '1rem' }}>
                Starting wages $20-$45+ per hour based on experience and skills. Performance bonuses, overtime opportunities, and annual raises.
              </p>
              <ul style={{ textAlign: 'left', color: '#4a5568', fontSize: '0.95rem' }}>
                <li>Health, dental & vision insurance</li>
                <li>401(k) with company matching</li>
                <li>Paid time off and holidays</li>
                <li>Tool allowance program</li>
              </ul>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '20px',
              padding: '2.5rem',
              boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
              textAlign: 'center',
              border: '1px solid rgba(255, 215, 0, 0.2)',
              backdropFilter: 'blur(20px)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)'
                e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.15)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 10px 40px rgba(0,0,0,0.1)'
              }}>
              <div style={{
                width: '70px',
                height: '70px',
                background: 'linear-gradient(135deg, #48bb78, #38a169)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                boxShadow: '0 8px 25px rgba(72, 187, 120, 0.3)'
              }}>
                <Calendar size={28} color="white" />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '600', color: '#2d3748', marginBottom: '1rem' }}>
                Stable Employment
              </h3>
              <p style={{ color: '#4a5568', lineHeight: '1.6', marginBottom: '1rem' }}>
                Year-round work with diverse projects. No seasonal layoffs or uncertainty – we maintain steady work volume throughout all seasons.
              </p>
              <ul style={{ textAlign: 'left', color: '#4a5568', fontSize: '0.95rem' }}>
                <li>Consistent 40+ hour work weeks</li>
                <li>Diverse project portfolio</li>
                <li>Growing customer base</li>
                <li>Job security and stability</li>
              </ul>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '20px',
              padding: '2.5rem',
              boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
              textAlign: 'center',
              border: '1px solid rgba(255, 215, 0, 0.2)',
              backdropFilter: 'blur(20px)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)'
                e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.15)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 10px 40px rgba(0,0,0,0.1)'
              }}>
              <div style={{
                width: '70px',
                height: '70px',
                background: 'linear-gradient(135deg, #ed8936, #dd6b20)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                boxShadow: '0 8px 25px rgba(237, 137, 54, 0.3)'
              }}>
                <GraduationCap size={28} color="white" />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '600', color: '#2d3748', marginBottom: '1rem' }}>
                Professional Growth
              </h3>
              <p style={{ color: '#4a5568', lineHeight: '1.6', marginBottom: '1rem' }}>
                Advance your skills and career with our comprehensive training programs, certification support, and leadership opportunities.
              </p>
              <ul style={{ textAlign: 'left', color: '#4a5568', fontSize: '0.95rem' }}>
                <li>Paid training and development</li>
                <li>Certification reimbursement</li>
                <li>Career advancement paths</li>
                <li>Skills workshops and mentoring</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Positions Section */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#2d3748', marginBottom: '1rem' }}>
              Open Positions
            </h2>
            <p style={{ fontSize: '1.1rem', color: '#4a5568', maxWidth: '600px', margin: '0 auto' }}>
              We have opportunities for professionals at all experience levels. Find the right fit for your skills and career goals.
            </p>
          </div>

          <div style={{ display: 'grid', gap: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            {/* Lead Handyman Position */}
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '2rem',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              border: '2px solid #4299e1'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#2d3748' }}>Lead Handyman</h3>
                <span style={{
                  background: 'linear-gradient(135deg, #4299e1, #3182ce)',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  fontSize: '0.9rem',
                  fontWeight: '600'
                }}>
                  $35-$45+/hr
                </span>
              </div>
              <p style={{ color: '#4a5568', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                Senior role for experienced professionals who can work independently, manage complex projects, and mentor junior team members.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#2d3748', marginBottom: '0.5rem' }}>Requirements:</h4>
                  <ul style={{ color: '#4a5568', fontSize: '0.9rem', lineHeight: '1.5' }}>
                    <li>5+ years experience</li>
                    <li>Multi-trade expertise</li>
                    <li>Leadership abilities</li>
                    <li>Valid driver's license</li>
                  </ul>
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#2d3748', marginBottom: '0.5rem' }}>Benefits:</h4>
                  <ul style={{ color: '#4a5568', fontSize: '0.9rem', lineHeight: '1.5' }}>
                    <li>Company truck provided</li>
                    <li>Performance bonuses</li>
                    <li>Premium tool allowance</li>
                    <li>Leadership training</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* General Handyman Position */}
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '2rem',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#2d3748' }}>General Handyman</h3>
                <span style={{
                  background: 'linear-gradient(135deg, #48bb78, #38a169)',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  fontSize: '0.9rem',
                  fontWeight: '600'
                }}>
                  $25-$35/hr
                </span>
              </div>
              <p style={{ color: '#4a5568', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                Skilled professionals capable of handling a wide variety of repair and improvement projects with quality and efficiency.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#2d3748', marginBottom: '0.5rem' }}>Requirements:</h4>
                  <ul style={{ color: '#4a5568', fontSize: '0.9rem', lineHeight: '1.5' }}>
                    <li>3+ years experience</li>
                    <li>Multi-trade skills</li>
                    <li>Professional attitude</li>
                    <li>Own basic tools</li>
                  </ul>
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#2d3748', marginBottom: '0.5rem' }}>Benefits:</h4>
                  <ul style={{ color: '#4a5568', fontSize: '0.9rem', lineHeight: '1.5' }}>
                    <li>Full benefits package</li>
                    <li>Tool allowance</li>
                    <li>Skills training</li>
                    <li>Advancement opportunities</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Apprentice Position */}
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '2rem',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#2d3748' }}>Apprentice/Helper</h3>
                <span style={{
                  background: 'linear-gradient(135deg, #ed8936, #dd6b20)',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  fontSize: '0.9rem',
                  fontWeight: '600'
                }}>
                  $20-$25/hr
                </span>
              </div>
              <p style={{ color: '#4a5568', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                Entry-level positions for motivated individuals looking to start or advance their career in the skilled trades.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#2d3748', marginBottom: '0.5rem' }}>Requirements:</h4>
                  <ul style={{ color: '#4a5568', fontSize: '0.9rem', lineHeight: '1.5' }}>
                    <li>Willingness to learn</li>
                    <li>Strong work ethic</li>
                    <li>Basic tool knowledge</li>
                    <li>Reliable transportation</li>
                  </ul>
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#2d3748', marginBottom: '0.5rem' }}>Benefits:</h4>
                  <ul style={{ color: '#4a5568', fontSize: '0.9rem', lineHeight: '1.5' }}>
                    <li>Paid training program</li>
                    <li>Mentorship opportunities</li>
                    <li>Career development path</li>
                    <li>Benefits after 90 days</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Culture Section */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#2d3748', marginBottom: '1rem' }}>
              Our Team Culture
            </h2>
            <p style={{ fontSize: '1.1rem', color: '#4a5568', maxWidth: '700px', margin: '0 auto' }}>
              More than just coworkers, we're a family of professionals who support each other and celebrate success together.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '4rem',
            alignItems: 'center',
            marginBottom: '4rem'
          }}>
            <div>
              <img
                src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&h=400&fit=crop"
                alt="Professional handyman team collaborating on project"
                style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: '15px', boxShadow: '0 15px 35px rgba(0,0,0,0.1)' }}
              />
            </div>
            <div>
              <h3 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '1.5rem', color: '#2d3748' }}>
                What Our Team Says
              </h3>

              {/* Team Testimonials */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div style={{
                  background: 'white',
                  padding: '2rem',
                  borderRadius: '15px',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
                  border: '1px solid #e2e8f0',
                  position: 'relative'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <img
                      src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=60&h=60&fit=crop&crop=face"
                      alt="Team member"
                      style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#2d3748', margin: 0 }}>Carlos M.</h4>
                      <p style={{ fontSize: '0.9rem', color: '#4a5568', margin: 0 }}>Lead Carpenter, 8 years</p>
                    </div>
                  </div>
                  <p style={{ color: '#4a5568', lineHeight: '1.6', fontStyle: 'italic' }}>
                    "This is the best company I've ever worked for. They truly care about their employees and provide
                    opportunities to grow. The work is diverse and challenging, and I love helping customers."
                  </p>
                  <div style={{
                    position: 'absolute',
                    bottom: '-8px',
                    left: '30px',
                    width: '16px',
                    height: '16px',
                    background: 'white',
                    transform: 'rotate(45deg)',
                    border: '1px solid #e2e8f0',
                    borderTop: 'none',
                    borderLeft: 'none'
                  }}></div>
                </div>

                <div style={{
                  background: 'white',
                  padding: '2rem',
                  borderRadius: '15px',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
                  border: '1px solid #e2e8f0',
                  position: 'relative'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face"
                      alt="Team member"
                      style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#2d3748', margin: 0 }}>Mike R.</h4>
                      <p style={{ fontSize: '0.9rem', color: '#4a5568', margin: 0 }}>Electrical Specialist, 3 years</p>
                    </div>
                  </div>
                  <p style={{ color: '#4a5568', lineHeight: '1.6', fontStyle: 'italic' }}>
                    "Started as an apprentice and now I'm running my own jobs. The training and mentorship here
                    is incredible. They invested in my certifications and career advancement."
                  </p>
                  <div style={{
                    position: 'absolute',
                    bottom: '-8px',
                    left: '30px',
                    width: '16px',
                    height: '16px',
                    background: 'white',
                    transform: 'rotate(45deg)',
                    border: '1px solid #e2e8f0',
                    borderTop: 'none',
                    borderLeft: 'none'
                  }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Training & Development Section */}
      <section style={{ padding: '4rem 0', background: '#f8f9fa' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#2d3748', marginBottom: '1rem' }}>
              Training & Development
            </h2>
            <p style={{ fontSize: '1.1rem', color: '#4a5568', maxWidth: '700px', margin: '0 auto' }}>
              We invest in our team's success with comprehensive training programs and professional development opportunities.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            <div style={{
              background: 'white',
              padding: '2.5rem',
              borderRadius: '15px',
              boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
              textAlign: 'center'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                boxShadow: '0 10px 25px rgba(102, 126, 234, 0.3)'
              }}>
                <BookOpen size={32} color="white" />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '1rem', color: '#2d3748' }}>
                Comprehensive Onboarding
              </h3>
              <p style={{ color: '#4a5568', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                2-week intensive training covering safety protocols, company standards, customer service,
                and technical skills assessment.
              </p>
              <ul style={{ textAlign: 'left', color: '#4a5568', fontSize: '0.9rem' }}>
                <li>Safety certification (OSHA 10)</li>
                <li>Company procedures & standards</li>
                <li>Customer interaction training</li>
                <li>Tool and equipment certification</li>
              </ul>
            </div>

            <div style={{
              background: 'white',
              padding: '2.5rem',
              borderRadius: '15px',
              boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
              textAlign: 'center'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                boxShadow: '0 10px 25px rgba(72, 187, 120, 0.3)'
              }}>
                <Award size={32} color="white" />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '1rem', color: '#2d3748' }}>
                Skills Development
              </h3>
              <p style={{ color: '#4a5568', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                Ongoing training workshops, certification support, and mentorship programs to advance
                your expertise in specialized trades.
              </p>
              <ul style={{ textAlign: 'left', color: '#4a5568', fontSize: '0.9rem' }}>
                <li>Monthly skills workshops</li>
                <li>Certification reimbursement</li>
                <li>Cross-training opportunities</li>
                <li>Advanced technique seminars</li>
              </ul>
            </div>

            <div style={{
              background: 'white',
              padding: '2.5rem',
              borderRadius: '15px',
              boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
              textAlign: 'center'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                boxShadow: '0 10px 25px rgba(237, 137, 54, 0.3)'
              }}>
                <TrendingUp size={32} color="white" />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '1rem', color: '#2d3748' }}>
                Career Advancement
              </h3>
              <p style={{ color: '#4a5568', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                Clear career progression paths from apprentice to lead positions, with leadership training
                and business development opportunities.
              </p>
              <ul style={{ textAlign: 'left', color: '#4a5568', fontSize: '0.9rem' }}>
                <li>Leadership development program</li>
                <li>Project management training</li>
                <li>Business skills workshops</li>
                <li>Mentorship opportunities</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Company Values Section */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#2d3748', marginBottom: '1rem' }}>
              Our Core Values
            </h2>
            <p style={{ fontSize: '1.1rem', color: '#4a5568', maxWidth: '700px', margin: '0 auto' }}>
              The principles that guide how we work together and serve our community.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '100px',
                height: '100px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                boxShadow: '0 15px 35px rgba(102, 126, 234, 0.3)',
                transform: 'rotate(-5deg)'
              }}>
                <CheckCircle size={36} color="white" />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: '#2d3748' }}>
                Quality Excellence
              </h3>
              <p style={{ color: '#4a5568', lineHeight: '1.6' }}>
                Every project reflects our commitment to superior craftsmanship and attention to detail.
                We take pride in exceeding customer expectations.
              </p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '100px',
                height: '100px',
                background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                boxShadow: '0 15px 35px rgba(72, 187, 120, 0.3)',
                transform: 'rotate(5deg)'
              }}>
                <Heart size={36} color="white" />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: '#2d3748' }}>
                Team Respect
              </h3>
              <p style={{ color: '#4a5568', lineHeight: '1.6' }}>
                We value every team member's contributions and foster an environment of mutual respect,
                collaboration, and professional growth.
              </p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '100px',
                height: '100px',
                background: 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                boxShadow: '0 15px 35px rgba(237, 137, 54, 0.3)',
                transform: 'rotate(-3deg)'
              }}>
                <Shield size={36} color="white" />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: '#2d3748' }}>
                Safety First
              </h3>
              <p style={{ color: '#4a5568', lineHeight: '1.6' }}>
                Safety is non-negotiable. We maintain the highest safety standards and provide ongoing
                training to ensure every team member returns home safely.
              </p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '100px',
                height: '100px',
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                boxShadow: '0 15px 35px rgba(245, 87, 108, 0.3)',
                transform: 'rotate(7deg)'
              }}>
                <Users size={36} color="white" />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: '#2d3748' }}>
                Community Impact
              </h3>
              <p style={{ color: '#4a5568', lineHeight: '1.6' }}>
                We're committed to improving our Scottsdale community through quality work,
                volunteer service, and supporting local initiatives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section style={{ padding: '4rem 0', background: '#f8f9fa' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#2d3748', marginBottom: '1rem' }}>
              Frequently Asked Questions
            </h2>
            <p style={{ fontSize: '1.1rem', color: '#4a5568' }}>
              Common questions from potential team members
            </p>
          </div>

          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                overflow: 'hidden'
              }}>
                <div style={{ padding: '1.5rem' }}>
                  <h4 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#2d3748', marginBottom: '1rem' }}>
                    Do I need to have my own tools?
                  </h4>
                  <p style={{ color: '#4a5568', lineHeight: '1.6' }}>
                    Basic hand tools are expected, but we provide a tool allowance and will supply specialized equipment,
                    power tools, and company vehicles. We'll discuss specific requirements during your interview.
                  </p>
                </div>
              </div>

              <div style={{
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                overflow: 'hidden'
              }}>
                <div style={{ padding: '1.5rem' }}>
                  <h4 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#2d3748', marginBottom: '1rem' }}>
                    What kind of training do you provide?
                  </h4>
                  <p style={{ color: '#4a5568', lineHeight: '1.6' }}>
                    We offer comprehensive onboarding, ongoing skills training, safety certifications, and will pay for
                    relevant professional certifications. Our senior team members provide mentorship throughout your career.
                  </p>
                </div>
              </div>

              <div style={{
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                overflow: 'hidden'
              }}>
                <div style={{ padding: '1.5rem' }}>
                  <h4 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#2d3748', marginBottom: '1rem' }}>
                    What are the typical work hours?
                  </h4>
                  <p style={{ color: '#4a5568', lineHeight: '1.6' }}>
                    Standard hours are Monday-Friday, 7:00 AM - 4:00 PM, with occasional evening or weekend work available.
                    We respect work-life balance and provide advance notice for any schedule changes.
                  </p>
                </div>
              </div>

              <div style={{
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                overflow: 'hidden'
              }}>
                <div style={{ padding: '1.5rem' }}>
                  <h4 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#2d3748', marginBottom: '1rem' }}>
                    How quickly can I advance?
                  </h4>
                  <p style={{ color: '#4a5568', lineHeight: '1.6' }}>
                    Career advancement is based on performance, skills development, and leadership abilities.
                    Many team members have advanced within 12-18 months with our structured development programs.
                  </p>
                </div>
              </div>

              <div style={{
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                overflow: 'hidden'
              }}>
                <div style={{ padding: '1.5rem' }}>
                  <h4 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#2d3748', marginBottom: '1rem' }}>
                    Do you offer health benefits?
                  </h4>
                  <p style={{ color: '#4a5568', lineHeight: '1.6' }}>
                    Yes! We provide comprehensive health, dental, and vision insurance, plus 401(k) matching,
                    paid time off, and holiday pay. Benefits begin after 90 days of employment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Application Form Section */}
      <section style={{ padding: '4rem 0', background: '#f8f9fa' }}>
        <div className="container">
          <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h2 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#2d3748', marginBottom: '1rem' }}>
                Apply Today
              </h2>
              <p style={{ fontSize: '1.1rem', color: '#4a5568' }}>
                Ready to join our professional team? Submit your application and we'll contact you within 48 hours.
              </p>
            </div>

            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '2.5rem',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
            }}>
              <form onSubmit={handleWorkSubmit}>
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontWeight: '600', color: '#2d3748', marginBottom: '0.5rem' }}>
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        placeholder="Your full name"
                        required
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '2px solid #e2e8f0',
                          borderRadius: '6px',
                          fontSize: '1rem',
                          transition: 'border-color 0.2s ease',
                          outline: 'none'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#4299e1'}
                        onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontWeight: '600', color: '#2d3748', marginBottom: '0.5rem' }}>
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="(480) 555-0123"
                        required
                        maxLength="14"
                        onInput={handlePhoneInput}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '2px solid #e2e8f0',
                          borderRadius: '6px',
                          fontSize: '1rem',
                          transition: 'border-color 0.2s ease',
                          outline: 'none'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#4299e1'}
                        onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontWeight: '600', color: '#2d3748', marginBottom: '0.5rem' }}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="your.email@example.com"
                      required
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid #e2e8f0',
                        borderRadius: '6px',
                        fontSize: '1rem',
                        transition: 'border-color 0.2s ease',
                        outline: 'none'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#4299e1'}
                      onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontWeight: '600', color: '#2d3748', marginBottom: '0.5rem' }}>
                        Years of Experience *
                      </label>
                      <select
                        name="experience"
                        required
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '2px solid #e2e8f0',
                          borderRadius: '6px',
                          fontSize: '1rem',
                          transition: 'border-color 0.2s ease',
                          outline: 'none',
                          backgroundColor: 'white'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#4299e1'}
                        onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                      >
                        <option value="">Select experience level</option>
                        <option value="0-1">0-1 years (Entry Level)</option>
                        <option value="2-3">2-3 years</option>
                        <option value="4-5">4-5 years</option>
                        <option value="6-10">6-10 years</option>
                        <option value="10+">10+ years (Expert)</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontWeight: '600', color: '#2d3748', marginBottom: '0.5rem' }}>
                        Position of Interest *
                      </label>
                      <select
                        name="position"
                        required
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '2px solid #e2e8f0',
                          borderRadius: '6px',
                          fontSize: '1rem',
                          transition: 'border-color 0.2s ease',
                          outline: 'none',
                          backgroundColor: 'white'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#4299e1'}
                        onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                      >
                        <option value="">Select position</option>
                        <option value="lead_handyman">Lead Handyman ($35-$45+/hr)</option>
                        <option value="general_handyman">General Handyman ($25-$35/hr)</option>
                        <option value="apprentice">Apprentice/Helper ($20-$25/hr)</option>
                        <option value="contractor">Independent Contractor</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontWeight: '600', color: '#2d3748', marginBottom: '0.5rem' }}>
                      Skills & Experience *
                    </label>
                    <textarea
                      name="skills"
                      placeholder="Describe your relevant skills, certifications, and experience. Include specific trades, tools you're proficient with, and any certifications you hold..."
                      required
                      rows="4"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid #e2e8f0',
                        borderRadius: '6px',
                        fontSize: '1rem',
                        transition: 'border-color 0.2s ease',
                        outline: 'none',
                        resize: 'vertical',
                        minHeight: '120px'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#4299e1'}
                      onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontWeight: '600', color: '#2d3748', marginBottom: '0.5rem' }}>
                      Availability *
                    </label>
                    <textarea
                      name="availability"
                      placeholder="When are you available to start? Any scheduling preferences, restrictions, or commitments we should know about?"
                      required
                      rows="3"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid #e2e8f0',
                        borderRadius: '6px',
                        fontSize: '1rem',
                        transition: 'border-color 0.2s ease',
                        outline: 'none',
                        resize: 'vertical',
                        minHeight: '100px'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#4299e1'}
                      onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '1rem 2rem',
                    background: 'linear-gradient(135deg, #4299e1, #3182ce)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease',
                    marginTop: '2rem'
                  }}
                  onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                  onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  Submit Application
                </button>
              </form>

              {/* Process Steps */}
              <div style={{
                marginTop: '2.5rem',
                padding: '1.5rem',
                background: '#f7fafc',
                borderRadius: '8px',
                border: '1px solid #e2e8f0'
              }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#2d3748', marginBottom: '1rem' }}>
                  Application Process:
                </h4>
                <ol style={{ color: '#4a5568', fontSize: '0.95rem', lineHeight: '1.6', paddingLeft: '1.2rem' }}>
                  <li style={{ marginBottom: '0.5rem' }}>Application review within 48 hours</li>
                  <li style={{ marginBottom: '0.5rem' }}>Phone interview to discuss experience and goals</li>
                  <li style={{ marginBottom: '0.5rem' }}>In-person interview and skills assessment</li>
                  <li style={{ marginBottom: '0.5rem' }}>Reference and background verification</li>
                  <li>Onboarding and welcome to the team!</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )

  // Stripe Payment Form Component
  const StripePaymentForm = () => {
    const stripe = useStripe()
    const elements = useElements()
    const [processing, setProcessing] = useState(false)
    const [error, setError] = useState(null)
    const [paymentMethod, setPaymentMethod] = useState('card') // 'card' or 'ach'

    const handleSubmit = async (event) => {
      event.preventDefault()
      setProcessing(true)
      setError(null)

      if (!stripe || !elements) {
        setError('Stripe is not loaded')
        setProcessing(false)
        return
      }

      const formData = new FormData(event.target)
      const invoiceData = {
        invoiceNumber: formData.get('invoiceNumber'),
        customerName: formData.get('customerName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        amount: formData.get('amount'),
        description: formData.get('description'),
      }

      try {
        // Create payment intent
        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(invoiceData)
        })

        if (!response.ok) {
          throw new Error('Failed to create payment intent')
        }

        const { client_secret } = await response.json()

        // Confirm payment with Stripe
        const cardElement = elements.getElement(CardElement)
        const result = await stripe.confirmCardPayment(client_secret, {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: invoiceData.customerName,
              email: invoiceData.email,
              phone: invoiceData.phone,
            },
          }
        })

        if (result.error) {
          setError(result.error.message)
        } else {
          // Payment succeeded
          console.log('Payment succeeded!', result.paymentIntent)
          setSubmittedFormData({
            type: 'payment_success',
            data: {
              ...invoiceData,
              paymentId: result.paymentIntent.id,
              status: 'succeeded'
            }
          })
          setShowSuccessPage(true)
          event.target.reset()

          setTimeout(() => {
            setShowSuccessPage(false)
            setSubmittedFormData(null)
          }, 5000)
        }
      } catch (err) {
        setError(err.message)
      }

      setProcessing(false)
    }

    return (
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
        <div className="form-group">
          <label className="form-label required">Invoice Number</label>
          <input
            type="text"
            name="invoiceNumber"
            className="form-input"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '2px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '1rem',
              outline: 'none'
            }}
            placeholder="INV-2024-001"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label required">Customer Name</label>
          <input
            type="text"
            name="customerName"
            className="form-input"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '2px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '1rem',
              outline: 'none'
            }}
            placeholder="John Doe"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label required">Email</label>
          <input
            type="email"
            name="email"
            className="form-input"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '2px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '1rem',
              outline: 'none'
            }}
            placeholder="john@example.com"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label required">Phone</label>
          <input
            type="tel"
            name="phone"
            className="form-input"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '2px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '1rem',
              outline: 'none'
            }}
            placeholder="(480) 555-0123"
            required
            maxLength="14"
            onInput={handlePhoneInput}
          />
        </div>

        <div className="form-group">
          <label className="form-label required">Payment Amount</label>
          <input
            type="number"
            step="0.01"
            name="amount"
            className="form-input"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '2px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '1rem',
              outline: 'none'
            }}
            placeholder="0.00"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            className="form-input"
            rows="3"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '2px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '1rem',
              outline: 'none'
            }}
            placeholder="Payment description..."
          />
        </div>

        /* Credit Card Input */
        {paymentMethod === 'card' && (
          <div className="form-group">
            <label className="form-label required">Credit Card Information</label>
            <div style={{
              padding: '0.75rem',
              border: '2px solid #d1d5db',
              borderRadius: '8px',
              backgroundColor: 'white'
            }}>
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#424770',
                      '::placeholder': {
                        color: '#aab7c4',
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
        )}

        /* ACH Bank Transfer Input */
        {paymentMethod === 'ach' && (
          <>
            <div className="form-group">
              <label className="form-label required">Routing Number</label>
              <input
                type="text"
                name="routingNumber"
                className="form-input"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  outline: 'none'
                }}
                placeholder="123456789"
                maxLength="9"
                pattern="[0-9]{9}"
                required={paymentMethod === 'ach'}
              />
              <small style={{ color: '#6b7280', fontSize: '0.8rem' }}>
                9-digit routing number found on the bottom of your check
              </small>
            </div>

            <div className="form-group">
              <label className="form-label required">Account Number</label>
              <input
                type="text"
                name="accountNumber"
                className="form-input"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  outline: 'none'
                }}
                placeholder="Account number"
                required={paymentMethod === 'ach'}
              />
            </div>

            <div className="form-group">
              <label className="form-label required">Account Type</label>
              <select
                name="accountType"
                className="form-input"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  outline: 'none'
                }}
                required={paymentMethod === 'ach'}
              >
                <option value="">Select account type</option>
                <option value="checking">Checking Account</option>
                <option value="savings">Savings Account</option>
              </select>
            </div>

            <div style={{
              backgroundColor: '#fef3c7',
              border: '1px solid #fcd34d',
              color: '#92400e',
              padding: '1rem',
              borderRadius: '8px',
              fontSize: '0.875rem'
            }}>
              <strong>ACH Processing:</strong> ACH payments typically take 3-5 business days to process.
              You'll receive email confirmation when the payment is complete.
            </div>
          </>
        )}

        {/* Payment Method Selection */}
        <div className="form-group">
          <label className="form-label">Payment Method</label>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            marginTop: '0.5rem'
          }}>
            <button
              type="button"
              onClick={() => setPaymentMethod('card')}
              style={{
                padding: '1rem',
                border: paymentMethod === 'card' ? '2px solid #FFD700' : '2px solid #d1d5db',
                borderRadius: '8px',
                backgroundColor: paymentMethod === 'card' ? 'rgba(255, 215, 0, 0.1)' : 'white',
                color: paymentMethod === 'card' ? '#B8860B' : '#374151',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                fontSize: '0.9rem',
                fontWeight: '500',
                transition: 'all 0.3s ease'
              }}
            >
              <CreditCard size={20} />
              Credit/Debit Card
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod('ach')}
              style={{
                padding: '1rem',
                border: paymentMethod === 'ach' ? '2px solid #FFD700' : '2px solid #d1d5db',
                borderRadius: '8px',
                backgroundColor: paymentMethod === 'ach' ? 'rgba(255, 215, 0, 0.1)' : 'white',
                color: paymentMethod === 'ach' ? '#B8860B' : '#374151',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                fontSize: '0.9rem',
                fontWeight: '500',
                transition: 'all 0.3s ease'
              }}
            >
              <Building size={20} />
              ACH Bank Transfer
            </button>
          </div>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            padding: '1rem',
            borderRadius: '8px'
          }}>
            <strong>Payment Error:</strong> {error}
          </div>
        )}

        {stripeConfig && (
          <div style={{
            backgroundColor: stripeConfig.environment === 'development' ? '#fef3c7' : '#d1fae5',
            border: `1px solid ${stripeConfig.environment === 'development' ? '#fcd34d' : '#a7f3d0'}`,
            color: stripeConfig.environment === 'development' ? '#92400e' : '#065f46',
            padding: '0.75rem',
            borderRadius: '8px',
            fontSize: '0.875rem'
          }}>
            <strong>Payment Mode:</strong> {stripeConfig.environment === 'development' ? 'Test Mode (Sandbox)' : 'Live Mode'}
            {stripeConfig.environment === 'development' && ' - Use test card: 4242424242424242'}
          </div>
        )}

        <button
          type="submit"
          disabled={!stripe || processing}
          style={{
            width: '100%',
            padding: '1rem 2rem',
            background: (!stripe || processing) ? '#9ca3af' : 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
            color: (!stripe || processing) ? '#ffffff' : '#1a365d',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1.125rem',
            fontWeight: '600',
            cursor: (!stripe || processing) ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            marginTop: '1rem',
            boxShadow: (!stripe || processing) ? 'none' : '0 4px 12px rgba(255, 215, 0, 0.4)',
            transition: 'all 0.3s ease'
          }}
        >
          {paymentMethod === 'card' ? <CreditCard size={20} /> : <Building size={20} />}
          {processing ? 'Processing Payment...' : `Process ${paymentMethod === 'card' ? 'Card' : 'ACH'} Payment`}
        </button>

        <div style={{ fontSize: '0.875rem', color: '#6b7280', textAlign: 'center' }}>
          <p>🔒 Your payment information is encrypted and secure</p>
          <p>Powered by Stripe - PCI DSS compliant</p>
        </div>
      </form>
    )
  }

  // Payment page component
  const PaymentPage = () => (
    <div style={{ minHeight: 'calc(100vh - 120px)' }}>
      <section
        className="hero"
        style={{
          background: 'linear-gradient(135deg, #1e3a5f 0%, #2c5aa0 50%, #3b6ec7 100%)',
          color: 'white',
          padding: '100px 0 80px 0',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Background Pattern */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255, 215, 0, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 215, 0, 0.1) 0%, transparent 50%), radial-gradient(circle at 40% 80%, rgba(255, 215, 0, 0.08) 0%, transparent 50%)`,
          opacity: 0.7
        }}></div>

        {/* Animated Background Overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(45deg, rgba(255, 215, 0, 0.05) 0%, transparent 50%, rgba(255, 215, 0, 0.03) 100%)',
          animation: 'shimmer 8s ease-in-out infinite alternate'
        }}></div>

        {/* Decorative Elements */}
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: '80px',
          height: '80px',
          backgroundColor: 'rgba(255, 215, 0, 0.15)',
          borderRadius: '50%',
          animation: 'float 6s ease-in-out infinite',
          backdropFilter: 'blur(10px)'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '15%',
          right: '15%',
          width: '60px',
          height: '60px',
          backgroundColor: 'rgba(255, 215, 0, 0.12)',
          borderRadius: '50%',
          animation: 'float 8s ease-in-out infinite reverse',
          backdropFilter: 'blur(8px)'
        }}></div>

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="hero-content" style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
            {/* Icon */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '80px',
              height: '80px',
              backgroundColor: 'rgba(255, 215, 0, 0.2)',
              borderRadius: '50%',
              marginBottom: '2rem',
              backdropFilter: 'blur(15px)',
              border: '1px solid rgba(255, 215, 0, 0.3)'
            }}>
              <CreditCard size={36} color="#FFD700" />
            </div>

            <h1 className="hero-title" style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: '900',
              marginBottom: '1.5rem',
              lineHeight: '1.1',
              textShadow: '2px 4px 12px rgba(0,0,0,0.4)',
              letterSpacing: '-0.02em'
            }}>
              Pay Your Invoice
              <br />
              <span style={{
                background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Online & Secure
              </span>
            </h1>
            <p className="hero-subtitle" style={{
              fontSize: '1.3rem',
              marginBottom: '1.5rem',
              opacity: 0.95,
              lineHeight: '1.7'
            }}>
              Secure, fast, and convenient payment processing
            </p>
            <p className="hero-description" style={{
              fontSize: '1.1rem',
              lineHeight: '1.6',
              opacity: 0.85,
              maxWidth: '700px',
              margin: '0 auto'
            }}>
              Pay your The Scottsdale Handyman invoice quickly and securely online.
              We accept all major credit cards, ACH transfers, and digital payment methods.
            </p>

            {/* Trust Badges */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '3rem',
              marginTop: '3rem',
              flexWrap: 'wrap'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'rgba(255, 215, 0, 0.1)',
                padding: '0.75rem 1.5rem',
                borderRadius: '25px',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 215, 0, 0.2)'
              }}>
                <Shield size={20} color="#FFD700" />
                <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>SSL Encrypted</span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'rgba(255, 215, 0, 0.1)',
                padding: '0.75rem 1.5rem',
                borderRadius: '25px',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 215, 0, 0.2)'
              }}>
                <Lock size={20} color="#FFD700" />
                <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>PCI Compliant</span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'rgba(255, 215, 0, 0.1)',
                padding: '0.75rem 1.5rem',
                borderRadius: '25px',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 215, 0, 0.2)'
              }}>
                <CheckCircle size={20} color="#FFD700" />
                <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Instant Processing</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="contact" style={{ paddingTop: '2rem' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'flex-start' }}>

            {/* Payment Information */}
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem' }}>Payment Information</h2>

              <div style={{ backgroundColor: '#f8fafc', padding: '2rem', borderRadius: '12px', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CreditCard size={24} />
                  Accepted Payment Methods
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', backgroundColor: 'white', borderRadius: '8px' }}>
                    <CreditCard size={20} color="#1e40af" />
                    <span>Visa / Mastercard</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', backgroundColor: 'white', borderRadius: '8px' }}>
                    <CreditCard size={20} color="#1e40af" />
                    <span>American Express</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', backgroundColor: 'white', borderRadius: '8px' }}>
                    <Building size={20} color="#1e40af" />
                    <span>ACH Bank Transfer</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', backgroundColor: 'white', borderRadius: '8px' }}>
                    <Smartphone size={20} color="#1e40af" />
                    <span>Digital Wallet</span>
                  </div>
                </div>
              </div>

              <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
                <h4 style={{ color: '#15803d', fontWeight: '600', marginBottom: '0.5rem' }}>Secure Processing</h4>
                <p style={{ color: '#166534', fontSize: '0.875rem' }}>
                  All payments are processed through our secure, PCI-compliant payment gateway.
                  Your financial information is encrypted and protected.
                </p>
              </div>

              <div style={{ backgroundColor: '#fff7ed', border: '1px solid #fed7aa', padding: '1.5rem', borderRadius: '8px' }}>
                <h4 style={{ color: '#c2410c', fontWeight: '600', marginBottom: '0.5rem' }}>Payment Terms</h4>
                <ul style={{ color: '#9a3412', fontSize: '0.875rem', margin: '0', paddingLeft: '1rem' }}>
                  <li>Payments are processed immediately</li>
                  <li>Email confirmation sent upon successful payment</li>
                  <li>For questions, call (480) 255-5887</li>
                  <li>Payment disputes must be reported within 30 days</li>
                </ul>
              </div>
            </div>

            {/* Payment Form */}
            <div className="contact-form" style={{
              backgroundColor: '#ffffff',
              padding: '2rem',
              borderRadius: '12px',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e5e7eb'
            }}>
              <h3 className="form-title" style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                marginBottom: '0.5rem',
                textAlign: 'center',
                color: '#1f2937'
              }}>Invoice Payment Form</h3>
              <p className="form-description" style={{
                marginBottom: '2rem',
                textAlign: 'center',
                color: '#6b7280',
                fontSize: '1rem'
              }}>
                Enter your invoice details and payment information
              </p>

              {stripePromise ? (
                <Elements stripe={stripePromise}>
                  <StripePaymentForm />
                </Elements>
              ) : (
                <div style={{
                  textAlign: 'center',
                  padding: '2rem',
                  color: '#6b7280'
                }}>
                  <div>Loading secure payment form...</div>
                  <div style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                    Initializing Stripe payment processor
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )

  // Admin Panel Component
  const AdminPanel = ({ onLogout }) => {
    if (!isAdminLoggedIn) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #2c3e50, #3498db)',
          color: 'white'
        }}>
          <div style={{
            background: 'white',
            padding: '40px',
            borderRadius: '15px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            maxWidth: '400px',
            width: '100%',
            margin: '20px'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <Lock size={48} style={{ color: '#3498db', marginBottom: '15px' }} />
              <h2 style={{ color: '#2c3e50', marginBottom: '10px', fontSize: '24px' }}>Admin Login</h2>
              <p style={{ color: '#7f8c8d', fontSize: '14px' }}>
                Access the content management system
              </p>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const username = e.target.username.value;
              const password = e.target.password.value;

              if (username === 'admin' && password === 'scottsdaleHandyman2025!') {
                setIsAdmin(true);
                localStorage.setItem('scottsdaleAdminAuth', 'true');
                setCurrentPage('admin');
              } else {
                alert('Invalid credentials');
              }
            }}>
              <div style={{ marginBottom: '20px' }}>
                <input
                  name="username"
                  type="text"
                  placeholder="Username"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                    background: '#f8f9fa',
                    color: '#2c3e50',
                    fontSize: '16px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: '30px', position: 'relative' }}>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  style={{
                    width: '100%',
                    padding: '12px 45px 12px 12px',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                    background: '#f8f9fa',
                    color: '#2c3e50',
                    fontSize: '16px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    color: '#666'
                  }}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#3498db',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background 0.3s ease'
                }}
                onMouseOver={(e) => e.target.style.background = '#2980b9'}
                onMouseOut={(e) => e.target.style.background = '#3498db'}
              >
                Login to Admin Panel
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button
                onClick={() => setCurrentPage('home')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#7f8c8d',
                  cursor: 'pointer',
                  fontSize: '14px',
                  textDecoration: 'underline'
                }}
              >
                ← Back to Website
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div style={{ minHeight: '100vh', background: '#f8f9fa', padding: '20px' }}>
        {/* Simple Admin Header */}
        <div style={{
          background: 'white',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{ margin: 0, color: '#1f2937', fontSize: '24px' }}>
              🛠️ Admin Dashboard
            </h1>
            <p style={{ margin: '5px 0 0 0', color: '#6b7280' }}>
              Welcome back! Manage your website content.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setCurrentPage('home')}
              style={{
                padding: '8px 16px',
                background: '#f3f4f6',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              🏠 View Site
            </button>
            <button
              onClick={onLogout}
              style={{
                padding: '8px 16px',
                background: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              🚪 Logout
            </button>
          </div>
        </div>

        {/* Admin Content Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px'
        }}>
          {/* Dashboard Stats */}
          <div style={{
            background: 'white',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#1f2937' }}>📊 Website Stats</h3>
            <div style={{ color: '#6b7280' }}>
              <p>• Total Pages: 8</p>
              <p>• Admin Status: Active</p>
              <p>• Last Login: {new Date().toLocaleDateString()}</p>
              <p>• System Status: ✅ Online</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{
            background: 'white',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#1f2937' }}>⚡ Quick Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                onClick={() => setAdminSection('blogs')}
                style={{
                  padding: '10px',
                  background: adminSection === 'blogs' ? '#dbeafe' : '#f8f9fa',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                📝 Manage Blog Posts
              </button>
              <button
                onClick={() => setAdminSection('gallery')}
                style={{
                  padding: '10px',
                  background: adminSection === 'gallery' ? '#dbeafe' : '#f8f9fa',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                🖼️ Photo Gallery
              </button>
              <button
                onClick={() => setAdminSection('media')}
                style={{
                  padding: '10px',
                  background: adminSection === 'media' ? '#dbeafe' : '#f8f9fa',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                📁 Media Library
              </button>
              <button
                onClick={() => setAdminSection('chatbot')}
                style={{
                  padding: '10px',
                  background: adminSection === 'chatbot' ? '#dbeafe' : '#f8f9fa',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                💬 Chatbot Logs
              </button>
            </div>
          </div>
        </div>

        {/* Selected Section Content */}
        {adminSection !== 'dashboard' && (
          <div style={{
            background: 'white',
            borderRadius: '8px',
            padding: '20px',
            marginTop: '20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            minHeight: '400px'
          }}>
            <h2 style={{ margin: '0 0 20px 0', color: '#1f2937' }}>
              {adminSection === 'blogs' && '📝 Blog Management'}
              {adminSection === 'gallery' && '🖼️ Gallery Management'}
              {adminSection === 'media' && '📁 Media Library'}
              {adminSection === 'chatbot' && '💬 Chatbot Conversations'}
            </h2>

            {adminSection === 'blogs' && <BlogEditor />}
            {adminSection === 'gallery' && <GalleryManager />}
            {adminSection === 'media' && <MediaLibrary />}
            {adminSection === 'chatbot' && <ChatbotLogs />}
          </div>
        )}
      </div>
    );
  };

  // Admin Blogs Component
  const AdminBlogs = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ color: 'var(--gray-900)', margin: 0 }}>Blog Management</h2>
        <button
          onClick={() => setEditingBlog({
            title: '',
            excerpt: '',
            content: '',
            author: 'Scottsdale Handyman Solutions',
            category: '',
            readTime: '',
            image: ''
          })}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'var(--primary-600)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <Plus size={16} />
          New Blog Post
        </button>
      </div>

      {editingBlog ? (
        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid var(--gray-200)',
          marginBottom: '1.5rem'
        }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--gray-900)' }}>
            {editingBlog.id ? 'Edit Blog Post' : 'Create New Blog Post'}
          </h3>

          <div style={{ display: 'grid', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--gray-700)' }}>
                Title
              </label>
              <input
                type="text"
                value={editingBlog.title}
                onChange={(e) => setEditingBlog({ ...editingBlog, title: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid var(--gray-300)',
                  borderRadius: '6px',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--gray-700)' }}>
                Excerpt
              </label>
              <textarea
                value={editingBlog.excerpt}
                onChange={(e) => setEditingBlog({ ...editingBlog, excerpt: e.target.value })}
                rows={3}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid var(--gray-300)',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--gray-700)' }}>
                  Category
                </label>
                <input
                  type="text"
                  value={editingBlog.category}
                  onChange={(e) => setEditingBlog({ ...editingBlog, category: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid var(--gray-300)',
                    borderRadius: '6px',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--gray-700)' }}>
                  Read Time
                </label>
                <input
                  type="text"
                  value={editingBlog.readTime}
                  onChange={(e) => setEditingBlog({ ...editingBlog, readTime: e.target.value })}
                  placeholder="e.g., 5 min read"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid var(--gray-300)',
                    borderRadius: '6px',
                    fontSize: '1rem'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--gray-700)' }}>
                Featured Image
              </label>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'stretch' }}>
                <input
                  type="url"
                  value={editingBlog.image}
                  onChange={(e) => setEditingBlog({ ...editingBlog, image: e.target.value })}
                  placeholder="Enter image URL or select from media library"
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    border: '1px solid var(--gray-300)',
                    borderRadius: '6px',
                    fontSize: '1rem'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowImageManager(true)}
                  style={{
                    padding: '0.75rem 1rem',
                    background: 'var(--primary-100)',
                    color: 'var(--primary-700)',
                    border: '1px solid var(--primary-300)',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <Image size={16} />
                  Browse Library
                </button>
              </div>
              {editingBlog.image && (
                <div style={{ marginTop: '0.5rem' }}>
                  <img
                    src={editingBlog.image}
                    alt="Featured image preview"
                    style={{
                      maxWidth: '200px',
                      maxHeight: '120px',
                      objectFit: 'cover',
                      borderRadius: '6px',
                      border: '1px solid var(--gray-300)'
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none'
                    }}
                  />
                </div>
              )}
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--gray-700)' }}>
                Content (Markdown supported)
              </label>
              <textarea
                value={editingBlog.content}
                onChange={(e) => setEditingBlog({ ...editingBlog, content: e.target.value })}
                rows={15}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid var(--gray-300)',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  fontFamily: 'monospace',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', paddingTop: '1rem' }}>
              <button
                onClick={() => saveBlogPost(editingBlog)}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'var(--success)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <Save size={16} />
                Save Post
              </button>

              <button
                onClick={() => setEditingBlog(null)}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'var(--gray-500)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Image Manager Modal */}
      {showImageManager && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '2rem'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '2rem',
            maxWidth: '800px',
            width: '100%',
            maxHeight: '600px',
            overflow: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, color: 'var(--gray-900)' }}>Select Image from Media Library</h3>
              <button
                onClick={() => setShowImageManager(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.5rem',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  color: 'var(--gray-500)'
                }}
              >
                <X size={20} />
              </button>
            </div>

            {uploadedFiles.filter(file => file.type.startsWith('image/')).length > 0 ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                gap: '1rem'
              }}>
                {uploadedFiles.filter(file => file.type.startsWith('image/')).map(file => (
                  <div
                    key={file.id}
                    onClick={() => {
                      if (editingBlog) {
                        setEditingBlog({ ...editingBlog, image: file.data })
                      } else if (editingProject) {
                        // For project editing, we need to update the form input directly
                        const imageInput = document.querySelector('input[name="image"]')
                        if (imageInput) {
                          imageInput.value = file.data
                          imageInput.dispatchEvent(new Event('input', { bubbles: true }))
                        }
                      }
                      setShowImageManager(false)
                    }}
                    style={{
                      cursor: 'pointer',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      border: '2px solid transparent',
                      transition: 'border-color 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.borderColor = 'var(--primary-500)'
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.borderColor = 'transparent'
                    }}
                  >
                    <img
                      src={file.data}
                      alt={file.name}
                      style={{
                        width: '100%',
                        height: '100px',
                        objectFit: 'cover',
                        display: 'block'
                      }}
                    />
                    <div style={{
                      padding: '0.5rem',
                      background: 'white',
                      fontSize: '0.8rem',
                      color: 'var(--gray-600)',
                      textAlign: 'center'
                    }}>
                      {file.name.length > 15 ? file.name.substring(0, 15) + '...' : file.name}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '2rem',
                color: 'var(--gray-500)'
              }}>
                <Image size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                <p>No images in media library. Upload some images first.</p>
                <button
                  onClick={() => {
                    setShowImageManager(false)
                    setAdminSection('media')
                  }}
                  style={{
                    padding: '0.5rem 1rem',
                    background: 'var(--primary-600)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    marginTop: '1rem'
                  }}
                >
                  Go to Media Library
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <div style={{
        background: 'white',
        borderRadius: '12px',
        border: '1px solid var(--gray-200)',
        overflow: 'hidden'
      }}>
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--gray-200)' }}>
          <h3 style={{ margin: 0, color: 'var(--gray-900)' }}>All Blog Posts</h3>
        </div>

        <div style={{ padding: '0' }}>
          {blogPosts.map((post) => (
            <div
              key={post.id}
              style={{
                padding: '1rem 1.5rem',
                borderBottom: '1px solid var(--gray-100)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <h4 style={{ margin: 0, marginBottom: '0.5rem', color: 'var(--gray-900)' }}>
                  {post.title}
                </h4>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                  <span>{post.category}</span>
                  <span>{post.readTime}</span>
                  <span>{post.date}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => setEditingBlog(post)}
                  style={{
                    padding: '0.5rem',
                    background: 'var(--primary-100)',
                    color: 'var(--primary-700)',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  <Edit3 size={14} />
                </button>

                <button
                  onClick={() => deleteBlogPost(post.id)}
                  style={{
                    padding: '0.5rem',
                    background: 'var(--error)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Drag and Drop Upload Component
  const DragDropUpload = ({ onFilesUploaded, accept = "image/*,application/pdf,.doc,.docx,.txt", multiple = true }) => {
    const [dragActive, setDragActive] = useState(false)

    const handleDrag = (e) => {
      e.preventDefault()
      e.stopPropagation()
      if (e.type === "dragenter" || e.type === "dragover") {
        setDragActive(true)
      } else if (e.type === "dragleave") {
        setDragActive(false)
      }
    }

    const handleDrop = (e) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFileUpload(e.dataTransfer.files)
        if (onFilesUploaded) {
          onFilesUploaded(Array.from(e.dataTransfer.files))
        }
      }
    }

    const handleFileInputChange = (e) => {
      if (e.target.files && e.target.files[0]) {
        handleFileUpload(e.target.files)
        if (onFilesUploaded) {
          onFilesUploaded(Array.from(e.target.files))
        }
      }
    }

    return (
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${dragActive ? 'var(--primary-500)' : 'var(--gray-300)'}`,
          borderRadius: '12px',
          padding: '2rem',
          textAlign: 'center',
          background: dragActive ? 'var(--primary-50)' : 'var(--gray-50)',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          position: 'relative'
        }}
        onClick={() => document.getElementById('file-upload-input').click()}
      >
        <input
          id="file-upload-input"
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={handleFileInputChange}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: 0,
            cursor: 'pointer'
          }}
        />

        <div style={{ pointerEvents: 'none' }}>
          <Upload
            size={48}
            style={{
              color: dragActive ? 'var(--primary-500)' : 'var(--gray-400)',
              marginBottom: '1rem'
            }}
          />
          <h3 style={{
            margin: '0 0 0.5rem 0',
            color: dragActive ? 'var(--primary-700)' : 'var(--gray-700)',
            fontSize: '1.1rem'
          }}>
            {dragActive ? 'Drop files here' : 'Drag & drop files here'}
          </h3>
          <p style={{
            margin: 0,
            color: 'var(--gray-500)',
            fontSize: '0.9rem'
          }}>
            or click to browse • Supports images, PDFs, and documents up to 10MB
          </p>
        </div>
      </div>
    )
  }

  // File Preview Component
  const FilePreview = ({ file, onDelete, onCopy }) => {
    const isImage = file.type.startsWith('image/')
    const fileSize = (file.size / 1024 / 1024).toFixed(2) + ' MB'

    return (
      <div style={{
        background: 'white',
        border: '1px solid var(--gray-200)',
        borderRadius: '8px',
        overflow: 'hidden',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
      }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'translateY(-2px)'
          e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'translateY(0)'
          e.target.style.boxShadow = 'none'
        }}
      >
        {isImage ? (
          <div style={{
            aspectRatio: '16/9',
            backgroundImage: `url(${file.data})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              top: '0.5rem',
              right: '0.5rem',
              display: 'flex',
              gap: '0.25rem'
            }}>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onCopy(file)
                }}
                style={{
                  background: 'rgba(0,0,0,0.7)',
                  border: 'none',
                  borderRadius: '4px',
                  color: 'white',
                  padding: '0.25rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}
                title="Copy URL"
              >
                <Share2 size={12} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(file.id)
                }}
                style={{
                  background: 'rgba(220, 38, 38, 0.9)',
                  border: 'none',
                  borderRadius: '4px',
                  color: 'white',
                  padding: '0.25rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}
                title="Delete file"
              >
                <Trash2 size={12} />
              </button>
            </div>
          </div>
        ) : (
          <div style={{
            aspectRatio: '16/9',
            background: 'var(--gray-100)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            position: 'relative'
          }}>
            <FileText size={32} color="var(--gray-500)" />
            <div style={{
              position: 'absolute',
              top: '0.5rem',
              right: '0.5rem',
              display: 'flex',
              gap: '0.25rem'
            }}>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onCopy(file)
                }}
                style={{
                  background: 'rgba(0,0,0,0.7)',
                  border: 'none',
                  borderRadius: '4px',
                  color: 'white',
                  padding: '0.25rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}
                title="Copy URL"
              >
                <Share2 size={12} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(file.id)
                }}
                style={{
                  background: 'rgba(220, 38, 38, 0.9)',
                  border: 'none',
                  borderRadius: '4px',
                  color: 'white',
                  padding: '0.25rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}
                title="Delete file"
              >
                <Trash2 size={12} />
              </button>
            </div>
          </div>
        )}

        <div style={{ padding: '0.75rem' }}>
          <h4 style={{
            margin: '0 0 0.25rem 0',
            fontSize: '0.9rem',
            color: 'var(--gray-900)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {file.name}
          </h4>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.75rem',
            color: 'var(--gray-500)'
          }}>
            <span>{fileSize}</span>
            <span>{file.type.split('/')[1]?.toUpperCase()}</span>
          </div>
        </div>
      </div>
    )
  }

  // Admin Media Library Component - MongoDB Connected
  const AdminMediaLibrary = () => {
    const [filterType, setFilterType] = useState('all')
    const [searchTerm, setSearchTerm] = useState('')
    const [mediaFiles, setMediaFiles] = useState([])
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [selectedFile, setSelectedFile] = useState(null)
    const [editingFile, setEditingFile] = useState(null)

    // Load media files from MongoDB
    const loadMediaFiles = async (page = 1) => {
      setLoading(true)
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: '20',
          type: filterType,
          search: searchTerm
        })

        const response = await fetch(`/api/media-library?${params}`)
        const data = await response.json()

        if (data.success) {
          setMediaFiles(data.files)
          setTotalPages(data.pagination.pages)
          setCurrentPage(data.pagination.page)
        } else {
          console.error('Failed to load media files:', data.error)
        }
      } catch (error) {
        console.error('Error loading media files:', error)
      } finally {
        setLoading(false)
      }
    }

    // Upload file to MongoDB
    const uploadFileToMongo = async (file) => {
      setUploading(true)
      try {
        // Convert file to base64
        const reader = new FileReader()
        reader.onload = async () => {
          try {
            const base64Data = reader.result.split(',')[1]

            const uploadData = {
              title: file.name.replace(/\.[^/.]+$/, ''), // Remove extension
              description: `Uploaded file: ${file.name}`,
              filename: file.name,
              contentType: file.type,
              fileSize: file.size,
              imageData: base64Data,
              category: file.type.startsWith('image/') ? 'gallery' : 'document',
              tags: [file.type.split('/')[0]], // 'image' or other type
              uploadDate: new Date().toISOString()
            }

            const response = await fetch('/api/upload-image', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(uploadData)
            })

            const result = await response.json()

            if (result.success) {
              // Reload media library
              loadMediaFiles(currentPage)
              alert('File uploaded successfully!')
            } else {
              alert('Upload failed: ' + result.error)
            }
          } catch (error) {
            console.error('Upload error:', error)
            alert('Upload failed: ' + error.message)
          } finally {
            setUploading(false)
          }
        }
        reader.readAsDataURL(file)
      } catch (error) {
        console.error('File reading error:', error)
        setUploading(false)
      }
    }

    // Delete file
    const deleteFile = async (fileId) => {
      if (!confirm('Are you sure you want to delete this file?')) return

      try {
        const response = await fetch(`/api/media/${fileId}`, { method: 'DELETE' })
        const result = await response.json()

        if (result.success) {
          loadMediaFiles(currentPage)
        } else {
          alert('Delete failed: ' + result.error)
        }
      } catch (error) {
        console.error('Delete error:', error)
        alert('Delete failed: ' + error.message)
      }
    }

    // Update file metadata
    const updateFile = async (fileId, updateData) => {
      try {
        const response = await fetch(`/api/media/${fileId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updateData)
        })

        const result = await response.json()

        if (result.success) {
          loadMediaFiles(currentPage)
          setEditingFile(null)
        } else {
          alert('Update failed: ' + result.error)
        }
      } catch (error) {
        console.error('Update error:', error)
        alert('Update failed: ' + error.message)
      }
    }

    // Load files on component mount and when filters change
    useEffect(() => {
      loadMediaFiles(1)
    }, [filterType, searchTerm])

    const filteredFiles = mediaFiles // Files are already filtered by the backend

    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ color: 'var(--gray-900)', margin: 0 }}>Media Library - MongoDB</h2>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <Filter size={16} color="var(--gray-500)" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                style={{
                  padding: '0.5rem',
                  border: '1px solid var(--gray-300)',
                  borderRadius: '6px',
                  fontSize: '0.9rem'
                }}
              >
                <option value="all">All Files</option>
                <option value="images">Images</option>
                <option value="documents">Documents</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <Search size={16} color="var(--gray-500)" />
              <input
                type="text"
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  padding: '0.5rem',
                  border: '1px solid var(--gray-300)',
                  borderRadius: '6px',
                  fontSize: '0.9rem',
                  minWidth: '200px'
                }}
              />
            </div>
          </div>
        </div>

        {/* Upload Area */}
        <div style={{
          marginBottom: '2rem',
          border: '2px dashed var(--gray-300)',
          borderRadius: '12px',
          padding: '2rem',
          textAlign: 'center',
          backgroundColor: uploading ? 'var(--gray-50)' : 'white'
        }}>
          <input
            type="file"
            multiple
            accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={(e) => {
              Array.from(e.target.files).forEach(uploadFileToMongo)
            }}
            style={{ display: 'none' }}
            id="file-upload"
            disabled={uploading}
          />
          <label htmlFor="file-upload" style={{ cursor: uploading ? 'not-allowed' : 'pointer' }}>
            <Upload size={48} color="var(--primary-500)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--gray-700)' }}>
              {uploading ? 'Uploading...' : 'Upload Files to MongoDB'}
            </h3>
            <p style={{ margin: 0, color: 'var(--gray-500)' }}>
              {uploading ? 'Please wait...' : 'Drag files here or click to browse'}
            </p>
          </label>
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>Loading files from MongoDB...</p>
          </div>
        )}

        {/* Files Grid */}
        {!loading && filteredFiles.length > 0 ? (
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem'
            }}>
              <h3 style={{ margin: 0, color: 'var(--gray-700)' }}>
                {filteredFiles.length} {filteredFiles.length === 1 ? 'file' : 'files'}
              </h3>

              {/* Pagination */}
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <button
                  onClick={() => loadMediaFiles(currentPage - 1)}
                  disabled={currentPage <= 1}
                  style={{
                    padding: '0.5rem',
                    border: '1px solid var(--gray-300)',
                    borderRadius: '4px',
                    backgroundColor: 'white',
                    cursor: currentPage <= 1 ? 'not-allowed' : 'pointer'
                  }}
                >
                  Previous
                </button>
                <span style={{ padding: '0 1rem' }}>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => loadMediaFiles(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  style={{
                    padding: '0.5rem',
                    border: '1px solid var(--gray-300)',
                    borderRadius: '4px',
                    backgroundColor: 'white',
                    cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer'
                  }}
                >
                  Next
                </button>
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '1rem'
            }}>
              {filteredFiles.map(file => (
                <div key={file._id} style={{
                  background: 'white',
                  border: '1px solid var(--gray-200)',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}>
                  {/* File Preview */}
                  <div style={{
                    height: '200px',
                    backgroundColor: 'var(--gray-50)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                  }}>
                    {file.contentType?.startsWith('image/') ? (
                      <img
                        src={file.thumbnailUrl}
                        alt={file.title}
                        style={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    ) : (
                      <FileText size={48} color="var(--gray-400)" />
                    )}
                  </div>

                  {/* File Info */}
                  <div style={{ padding: '1rem' }}>
                    <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--gray-900)' }}>
                      {file.title}
                    </h4>
                    <p style={{ margin: '0 0 0.5rem 0', color: 'var(--gray-600)', fontSize: '0.875rem' }}>
                      {file.filename}
                    </p>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: '1rem'
                    }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                        {file.fileSize ? Math.round(file.fileSize / 1024) + 'KB' : 'N/A'}
                      </span>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => setEditingFile(file)}
                          style={{
                            padding: '0.25rem',
                            border: 'none',
                            backgroundColor: 'var(--primary-100)',
                            color: 'var(--primary-700)',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(file.fullUrl)
                            alert('URL copied to clipboard!')
                          }}
                          style={{
                            padding: '0.25rem',
                            border: 'none',
                            backgroundColor: 'var(--gray-100)',
                            color: 'var(--gray-700)',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          <Share2 size={14} />
                        </button>
                        <button
                          onClick={() => deleteFile(file._id)}
                          style={{
                            padding: '0.25rem',
                            border: 'none',
                            backgroundColor: 'var(--red-100)',
                            color: 'var(--red-700)',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : !loading ? (
          <div style={{
            background: 'white',
            border: '1px solid var(--gray-200)',
            borderRadius: '12px',
            padding: '3rem',
            textAlign: 'center',
            color: 'var(--gray-500)'
          }}>
            <Database size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--gray-600)' }}>
              {searchTerm ? 'No files match your search' : 'No files in MongoDB yet'}
            </h3>
            <p style={{ margin: 0 }}>
              {searchTerm ? 'Try adjusting your search terms' : 'Upload your first file using the area above'}
            </p>
          </div>
        ) : null}

        {/* Edit File Modal */}
        {editingFile && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '2rem',
              maxWidth: '500px',
              width: '90%'
            }}>
              <h3 style={{ margin: '0 0 1rem 0' }}>Edit File</h3>
              <form onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.target)
                updateFile(editingFile._id, {
                  title: formData.get('title'),
                  description: formData.get('description'),
                  category: formData.get('category'),
                  tags: formData.get('tags').split(',').map(t => t.trim()).filter(Boolean)
                })
              }}>
                <div style={{ marginBottom: '1rem' }}>
                  <label>Title:</label>
                  <input
                    name="title"
                    defaultValue={editingFile.title}
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--gray-300)', borderRadius: '4px' }}
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label>Description:</label>
                  <textarea
                    name="description"
                    defaultValue={editingFile.description}
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--gray-300)', borderRadius: '4px' }}
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label>Category:</label>
                  <input
                    name="category"
                    defaultValue={editingFile.category}
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--gray-300)', borderRadius: '4px' }}
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label>Tags (comma separated):</label>
                  <input
                    name="tags"
                    defaultValue={editingFile.tags?.join(', ') || ''}
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--gray-300)', borderRadius: '4px' }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => setEditingFile(null)}
                    style={{ padding: '0.5rem 1rem', border: '1px solid var(--gray-300)', borderRadius: '4px', backgroundColor: 'white' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{ padding: '0.5rem 1rem', border: 'none', borderRadius: '4px', backgroundColor: 'var(--primary-500)', color: 'white' }}
                  >
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Admin Gallery Component
  const AdminGallery = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ color: 'var(--gray-900)', margin: 0 }}>Inspiration Gallery</h2>
        <button
          onClick={() => setEditingProject({
            id: null,
            title: '',
            description: '',
            category: 'General Repair',
            budget: '',
            image: '',
            alt: ''
          })}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'var(--primary-600)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <Plus size={16} />
          Add Project
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {projectGallery.map((project) => (
          <div
            key={project.id}
            style={{
              background: 'white',
              borderRadius: '12px',
              border: '1px solid var(--gray-200)',
              overflow: 'hidden'
            }}
          >
            <img
              src={project.image}
              alt={project.alt}
              style={{
                width: '100%',
                height: '200px',
                objectFit: 'cover'
              }}
            />

            <div style={{ padding: '1rem' }}>
              <h4 style={{ margin: 0, marginBottom: '0.5rem', color: 'var(--gray-900)' }}>
                {project.title}
              </h4>
              <p style={{ margin: 0, marginBottom: '0.75rem', color: 'var(--gray-600)', fontSize: '0.875rem' }}>
                {project.description}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{
                  padding: '0.25rem 0.75rem',
                  background: 'var(--primary-100)',
                  color: 'var(--primary-700)',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: '600'
                }}>
                  {project.category}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                  {project.budget}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => editProject(project)}
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    background: 'var(--primary-100)',
                    color: 'var(--primary-700)',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <Edit3 size={14} />
                  Edit
                </button>

                <button
                  onClick={() => deleteProject(project.id)}
                  style={{
                    padding: '0.5rem',
                    background: 'var(--error)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Project Edit Modal */}
      {editingProject && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '12px',
            width: '90%',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <h3 style={{ margin: '0 0 1.5rem 0' }}>Edit Project</h3>

            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              saveProjectGallery({
                id: editingProject.id,
                title: formData.get('title'),
                description: formData.get('description'),
                category: formData.get('category'),
                budget: formData.get('budget'),
                image: formData.get('image'),
                alt: formData.get('alt')
              });
            }}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                  Project Title
                </label>
                <input
                  name="title"
                  type="text"
                  defaultValue={editingProject.title}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid var(--gray-300)',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    boxSizing: 'border-box'
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                  Description
                </label>
                <textarea
                  name="description"
                  defaultValue={editingProject.description}
                  rows="3"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid var(--gray-300)',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    resize: 'vertical',
                    boxSizing: 'border-box'
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                  Category
                </label>
                <select
                  name="category"
                  defaultValue={editingProject.category}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid var(--gray-300)',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    boxSizing: 'border-box'
                  }}
                  required
                >
                  <option value="Bathroom">Bathroom</option>
                  <option value="Kitchen">Kitchen</option>
                  <option value="Plumbing">Plumbing</option>
                  <option value="Electrical">Electrical</option>
                  <option value="General Repair">General Repair</option>
                  <option value="Installation">Installation</option>
                </select>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                  Budget Range
                </label>
                <input
                  name="budget"
                  type="text"
                  defaultValue={editingProject.budget}
                  placeholder="e.g., $500-$1000"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid var(--gray-300)',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    boxSizing: 'border-box'
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                  Project Image
                </label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'stretch' }}>
                  <input
                    name="image"
                    type="url"
                    defaultValue={editingProject.image}
                    placeholder="Enter image URL or select from media library"
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      border: '1px solid var(--gray-300)',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      boxSizing: 'border-box'
                    }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowImageManager(true)}
                    style={{
                      padding: '0.75rem 1rem',
                      background: 'var(--primary-100)',
                      color: 'var(--primary-700)',
                      border: '1px solid var(--primary-300)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <Image size={16} />
                    Browse
                  </button>
                </div>
                {editingProject.image && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <img
                      src={editingProject.image}
                      alt="Project image preview"
                      style={{
                        maxWidth: '200px',
                        maxHeight: '120px',
                        objectFit: 'cover',
                        borderRadius: '6px',
                        border: '1px solid var(--gray-300)'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none'
                      }}
                    />
                  </div>
                )}
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                  Alt Text
                </label>
                <input
                  name="alt"
                  type="text"
                  defaultValue={editingProject.alt}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid var(--gray-300)',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    boxSizing: 'border-box'
                  }}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: 'var(--gray-300)',
                    color: 'var(--gray-700)',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: 'var(--primary-600)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  // Admin Content Component
  const AdminContent = () => (
    <div>
      <h2 style={{ color: 'var(--gray-900)', marginBottom: '1.5rem' }}>Site Content Management</h2>

      <div style={{ display: 'grid', gap: '1.5rem' }}>
        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid var(--gray-200)'
        }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--gray-900)' }}>Hero Section</h3>
          <p style={{ color: 'var(--gray-600)', marginBottom: '1rem' }}>
            Edit the main hero section content that appears on the homepage.
          </p>
          <button
            style={{
              padding: '0.75rem 1.5rem',
              background: 'var(--primary-600)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Edit Hero Content
          </button>
        </div>

        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid var(--gray-200)'
        }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--gray-900)' }}>Services Section</h3>
          <p style={{ color: 'var(--gray-600)', marginBottom: '1rem' }}>
            Manage service offerings, descriptions, and pricing information.
          </p>
          <button
            style={{
              padding: '0.75rem 1.5rem',
              background: 'var(--primary-600)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Edit Services
          </button>
        </div>

        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid var(--gray-200)'
        }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--gray-900)' }}>Contact Information</h3>
          <p style={{ color: 'var(--gray-600)', marginBottom: '1rem' }}>
            Update phone number, email, address, and business hours.
          </p>
          <button
            style={{
              padding: '0.75rem 1.5rem',
              background: 'var(--primary-600)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Edit Contact Info
          </button>
        </div>
      </div>
    </div>
  );

  // Admin Payments Component
  const AdminPayments = () => {
    const [paymentSettings, setPaymentSettings] = useState({
      processingFee: '2.9',
      minAmount: '50.00',
      maxAmount: '10000.00',
      acceptedMethods: ['card', 'ach', 'check'],
      gateway: {
        provider: 'stripe', // stripe, paypal, square, authorize_net
        testMode: true,
        credentials: {
          stripe: {
            publishableKey: '',
            secretKey: '',
            webhookSecret: ''
          },
          paypal: {
            clientId: '',
            clientSecret: '',
            sandboxMode: true
          },
          square: {
            applicationId: '',
            accessToken: '',
            environment: 'sandbox'
          },
          authorize_net: {
            apiLoginId: '',
            transactionKey: '',
            signatureKey: ''
          }
        }
      },
      servicePackages: [
        { id: 1, name: 'Basic Repair', price: '125.00', description: 'Minor repairs and fixes' },
        { id: 2, name: 'Maintenance Plan', price: '149.00', description: 'Monthly maintenance package', recurring: true },
        { id: 3, name: 'Custom Project', price: '0.00', description: 'Custom quote required', customPrice: true },
        { id: 4, name: 'Emergency Service', price: '200.00', description: 'Emergency repair service' },
        { id: 5, name: 'Remodeling Package', price: '1285.00', description: 'Complete remodeling services' },
        { id: 6, name: 'Seasonal Maintenance', price: '299.00', description: 'Seasonal maintenance package' }
      ]
    });

    const [editingPackage, setEditingPackage] = useState(null);
    const [newPackage, setNewPackage] = useState({ name: '', price: '', description: '', recurring: false, customPrice: false });

    const updatePaymentMethod = (method, enabled) => {
      setPaymentSettings(prev => ({
        ...prev,
        acceptedMethods: enabled
          ? [...prev.acceptedMethods, method]
          : prev.acceptedMethods.filter(m => m !== method)
      }));
    };

    const addServicePackage = () => {
      if (newPackage.name && newPackage.description) {
        setPaymentSettings(prev => ({
          ...prev,
          servicePackages: [...prev.servicePackages, {
            id: Date.now(),
            ...newPackage,
            price: newPackage.customPrice ? '0.00' : newPackage.price
          }]
        }));
        setNewPackage({ name: '', price: '', description: '', recurring: false, customPrice: false });
      }
    };

    const updateServicePackage = (id, updatedPackage) => {
      setPaymentSettings(prev => ({
        ...prev,
        servicePackages: prev.servicePackages.map(pkg =>
          pkg.id === id ? { ...pkg, ...updatedPackage } : pkg
        )
      }));
      setEditingPackage(null);
    };

    const deleteServicePackage = (id) => {
      setPaymentSettings(prev => ({
        ...prev,
        servicePackages: prev.servicePackages.filter(pkg => pkg.id !== id)
      }));
    };

    const updateGatewayProvider = (provider) => {
      setPaymentSettings(prev => ({
        ...prev,
        gateway: { ...prev.gateway, provider }
      }));
    };

    const updateGatewayCredentials = (provider, field, value) => {
      setPaymentSettings(prev => ({
        ...prev,
        gateway: {
          ...prev.gateway,
          credentials: {
            ...prev.credentials,
            [provider]: {
              ...prev.gateway.credentials[provider],
              [field]: value
            }
          }
        }
      }));
    };

    const updateGatewayTestMode = (testMode) => {
      setPaymentSettings(prev => ({
        ...prev,
        gateway: { ...prev.gateway, testMode }
      }));
    };

    return (
      <div>
        <h2 style={{ color: 'var(--gray-900)', marginBottom: '1.5rem' }}>Payment Settings</h2>

        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {/* Payment Configuration */}
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            border: '1px solid var(--gray-200)'
          }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--gray-900)' }}>Payment Configuration</h3>

            <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
              <div>
                <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '0.5rem' }}>
                  Processing Fee (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={paymentSettings.processingFee}
                  onChange={(e) => setPaymentSettings(prev => ({ ...prev, processingFee: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '0.5rem' }}>
                  Minimum Amount ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={paymentSettings.minAmount}
                  onChange={(e) => setPaymentSettings(prev => ({ ...prev, minAmount: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '0.5rem' }}>
                  Maximum Amount ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={paymentSettings.maxAmount}
                  onChange={(e) => setPaymentSettings(prev => ({ ...prev, maxAmount: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Payment Gateway Configuration */}
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            border: '1px solid var(--gray-200)'
          }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--gray-900)' }}>Payment Gateway Configuration</h3>

            {/* Gateway Provider Selection */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '0.5rem' }}>
                Payment Gateway Provider
              </label>
              <select
                value={paymentSettings.gateway.provider}
                onChange={(e) => updateGatewayProvider(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  backgroundColor: 'white'
                }}
              >
                <option value="stripe">Stripe</option>
                <option value="paypal">PayPal</option>
                <option value="square">Square</option>
                <option value="authorize_net">Authorize.Net</option>
              </select>
            </div>

            {/* Test Mode Toggle */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={paymentSettings.gateway.testMode}
                  onChange={(e) => updateGatewayTestMode(e.target.checked)}
                />
                <span style={{ color: 'var(--gray-700)', fontWeight: '600' }}>Test Mode (Use sandbox/test environment)</span>
              </label>
              <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                Enable this for testing. Disable for live payments.
              </p>
            </div>

            {/* Gateway Credentials */}
            {paymentSettings.gateway.provider === 'stripe' && (
              <div>
                <h4 style={{ color: 'var(--gray-800)', marginBottom: '1rem', fontSize: '1rem' }}>Stripe Configuration</h4>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '0.5rem' }}>
                      Publishable Key {paymentSettings.gateway.testMode ? '(Test)' : '(Live)'}
                    </label>
                    <input
                      type="text"
                      value={paymentSettings.gateway.credentials.stripe.publishableKey}
                      onChange={(e) => updateGatewayCredentials('stripe', 'publishableKey', e.target.value)}
                      placeholder={paymentSettings.gateway.testMode ? 'pk_test_...' : 'pk_live_...'}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '0.5rem' }}>
                      Secret Key {paymentSettings.gateway.testMode ? '(Test)' : '(Live)'}
                    </label>
                    <input
                      type="password"
                      value={paymentSettings.gateway.credentials.stripe.secretKey}
                      onChange={(e) => updateGatewayCredentials('stripe', 'secretKey', e.target.value)}
                      placeholder={paymentSettings.gateway.testMode ? 'sk_test_...' : 'sk_live_...'}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '0.5rem' }}>
                      Webhook Signing Secret
                    </label>
                    <input
                      type="password"
                      value={paymentSettings.gateway.credentials.stripe.webhookSecret}
                      onChange={(e) => updateGatewayCredentials('stripe', 'webhookSecret', e.target.value)}
                      placeholder="whsec_..."
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                    />
                    <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                      Required for webhooks and payment status updates
                    </p>
                  </div>
                </div>
              </div>
            )}

            {paymentSettings.gateway.provider === 'paypal' && (
              <div>
                <h4 style={{ color: 'var(--gray-800)', marginBottom: '1rem', fontSize: '1rem' }}>PayPal Configuration</h4>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '0.5rem' }}>
                      Client ID
                    </label>
                    <input
                      type="text"
                      value={paymentSettings.gateway.credentials.paypal.clientId}
                      onChange={(e) => updateGatewayCredentials('paypal', 'clientId', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '0.5rem' }}>
                      Client Secret
                    </label>
                    <input
                      type="password"
                      value={paymentSettings.gateway.credentials.paypal.clientSecret}
                      onChange={(e) => updateGatewayCredentials('paypal', 'clientSecret', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentSettings.gateway.provider === 'square' && (
              <div>
                <h4 style={{ color: 'var(--gray-800)', marginBottom: '1rem', fontSize: '1rem' }}>Square Configuration</h4>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '0.5rem' }}>
                      Application ID
                    </label>
                    <input
                      type="text"
                      value={paymentSettings.gateway.credentials.square.applicationId}
                      onChange={(e) => updateGatewayCredentials('square', 'applicationId', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '0.5rem' }}>
                      Access Token
                    </label>
                    <input
                      type="password"
                      value={paymentSettings.gateway.credentials.square.accessToken}
                      onChange={(e) => updateGatewayCredentials('square', 'accessToken', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentSettings.gateway.provider === 'authorize_net' && (
              <div>
                <h4 style={{ color: 'var(--gray-800)', marginBottom: '1rem', fontSize: '1rem' }}>Authorize.Net Configuration</h4>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '0.5rem' }}>
                      API Login ID
                    </label>
                    <input
                      type="text"
                      value={paymentSettings.gateway.credentials.authorize_net.apiLoginId}
                      onChange={(e) => updateGatewayCredentials('authorize_net', 'apiLoginId', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '0.5rem' }}>
                      Transaction Key
                    </label>
                    <input
                      type="password"
                      value={paymentSettings.gateway.credentials.authorize_net.transactionKey}
                      onChange={(e) => updateGatewayCredentials('authorize_net', 'transactionKey', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '0.5rem' }}>
                      Signature Key
                    </label>
                    <input
                      type="password"
                      value={paymentSettings.gateway.credentials.authorize_net.signatureKey}
                      onChange={(e) => updateGatewayCredentials('authorize_net', 'signatureKey', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Connection Test Button */}
            <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--gray-50)', borderRadius: '8px' }}>
              <button
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'var(--primary-600)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  marginRight: '1rem'
                }}
              >
                Test Connection
              </button>
              <span style={{ color: 'var(--gray-600)', fontSize: '0.875rem' }}>
                Test your payment gateway configuration
              </span>
            </div>
          </div>

          {/* Payment Methods */}
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            border: '1px solid var(--gray-200)'
          }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--gray-900)' }}>Accepted Payment Methods</h3>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {[
                { key: 'card', label: 'Credit/Debit Card', icon: '💳' },
                { key: 'ach', label: 'Bank Transfer (ACH)', icon: '🏦' },
                { key: 'check', label: 'Electronic Check', icon: '📝' }
              ].map(method => (
                <label key={method.key} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={paymentSettings.acceptedMethods.includes(method.key)}
                    onChange={(e) => updatePaymentMethod(method.key, e.target.checked)}
                    style={{ marginRight: '0.5rem' }}
                  />
                  <span style={{ fontSize: '1.2rem' }}>{method.icon}</span>
                  <span style={{ color: 'var(--gray-700)' }}>{method.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Service Packages */}
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            border: '1px solid var(--gray-200)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ color: 'var(--gray-900)', margin: 0 }}>Service Packages</h3>
              <button
                onClick={() => setEditingPackage('new')}
                style={{
                  padding: '0.5rem 1rem',
                  background: 'var(--primary-600)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
              >
                <Plus size={14} style={{ marginRight: '0.5rem' }} />
                Add Package
              </button>
            </div>

            <div style={{ display: 'grid', gap: '1rem' }}>
              {paymentSettings.servicePackages.map(pkg => (
                <div key={pkg.id} style={{
                  padding: '1rem',
                  border: '1px solid var(--gray-200)',
                  borderRadius: '8px',
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  alignItems: 'center',
                  gap: '1rem'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <h4 style={{ margin: 0, color: 'var(--gray-900)' }}>{pkg.name}</h4>
                      {pkg.recurring && <span style={{
                        background: 'var(--primary-100)',
                        color: 'var(--primary-700)',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.75rem'
                      }}>Recurring</span>}
                      {pkg.customPrice && <span style={{
                        background: 'var(--orange-100)',
                        color: 'var(--orange-700)',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.75rem'
                      }}>Custom Quote</span>}
                    </div>
                    <p style={{ margin: '0 0 0.5rem 0', color: 'var(--gray-600)', fontSize: '0.875rem' }}>{pkg.description}</p>
                    <div style={{ fontWeight: '600', color: 'var(--primary-600)', fontSize: '1.125rem' }}>
                      {pkg.customPrice ? 'Quote Required' : `$${pkg.price}${pkg.recurring ? '/month' : ''}`}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => setEditingPackage(pkg.id)}
                      style={{
                        padding: '0.5rem',
                        background: 'var(--gray-100)',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => deleteServicePackage(pkg.id)}
                      style={{
                        padding: '0.5rem',
                        background: 'var(--red-100)',
                        color: 'var(--red-600)',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add/Edit Package Form */}
            {editingPackage && (
              <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000
              }}>
                <div style={{
                  background: 'white',
                  padding: '2rem',
                  borderRadius: '12px',
                  width: '90%',
                  maxWidth: '500px',
                  maxHeight: '90vh',
                  overflow: 'auto'
                }}>
                  <h3 style={{ marginBottom: '1rem', color: 'var(--gray-900)' }}>
                    {editingPackage === 'new' ? 'Add New Package' : 'Edit Package'}
                  </h3>

                  <div style={{ display: 'grid', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div>
                      <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '0.5rem' }}>
                        Package Name
                      </label>
                      <input
                        type="text"
                        value={editingPackage === 'new' ? newPackage.name : paymentSettings.servicePackages.find(p => p.id === editingPackage)?.name || ''}
                        onChange={(e) => editingPackage === 'new'
                          ? setNewPackage(prev => ({ ...prev, name: e.target.value }))
                          : updateServicePackage(editingPackage, { name: e.target.value })
                        }
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '2px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '1rem'
                        }}
                        placeholder="e.g., Basic Repair Service"
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '0.5rem' }}>
                        Description
                      </label>
                      <textarea
                        value={editingPackage === 'new' ? newPackage.description : paymentSettings.servicePackages.find(p => p.id === editingPackage)?.description || ''}
                        onChange={(e) => editingPackage === 'new'
                          ? setNewPackage(prev => ({ ...prev, description: e.target.value }))
                          : updateServicePackage(editingPackage, { description: e.target.value })
                        }
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '2px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '1rem',
                          minHeight: '80px'
                        }}
                        placeholder="Describe what's included in this package"
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '0.5rem' }}>
                        Price ($)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        disabled={editingPackage === 'new' ? newPackage.customPrice : paymentSettings.servicePackages.find(p => p.id === editingPackage)?.customPrice}
                        value={editingPackage === 'new' ? newPackage.price : paymentSettings.servicePackages.find(p => p.id === editingPackage)?.price || ''}
                        onChange={(e) => editingPackage === 'new'
                          ? setNewPackage(prev => ({ ...prev, price: e.target.value }))
                          : updateServicePackage(editingPackage, { price: e.target.value })
                        }
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '2px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '1rem',
                          opacity: (editingPackage === 'new' ? newPackage.customPrice : paymentSettings.servicePackages.find(p => p.id === editingPackage)?.customPrice) ? 0.5 : 1
                        }}
                        placeholder="0.00"
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={editingPackage === 'new' ? newPackage.recurring : paymentSettings.servicePackages.find(p => p.id === editingPackage)?.recurring || false}
                          onChange={(e) => editingPackage === 'new'
                            ? setNewPackage(prev => ({ ...prev, recurring: e.target.checked }))
                            : updateServicePackage(editingPackage, { recurring: e.target.checked })
                          }
                        />
                        <span style={{ color: 'var(--gray-700)' }}>Recurring Service</span>
                      </label>

                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={editingPackage === 'new' ? newPackage.customPrice : paymentSettings.servicePackages.find(p => p.id === editingPackage)?.customPrice || false}
                          onChange={(e) => editingPackage === 'new'
                            ? setNewPackage(prev => ({ ...prev, customPrice: e.target.checked }))
                            : updateServicePackage(editingPackage, { customPrice: e.target.checked })
                          }
                        />
                        <span style={{ color: 'var(--gray-700)' }}>Custom Quote</span>
                      </label>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => setEditingPackage(null)}
                      style={{
                        padding: '0.75rem 1.5rem',
                        background: 'var(--gray-100)',
                        color: 'var(--gray-700)',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => editingPackage === 'new' ? addServicePackage() : setEditingPackage(null)}
                      style={{
                        padding: '0.75rem 1.5rem',
                        background: 'var(--primary-600)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer'
                      }}
                    >
                      {editingPackage === 'new' ? 'Add Package' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Integration Instructions */}
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            border: '1px solid var(--gray-200)'
          }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--gray-900)' }}>Integration Instructions</h3>

            <div style={{ background: 'var(--blue-50)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
              <h4 style={{ color: 'var(--blue-800)', marginBottom: '0.5rem', fontSize: '1rem' }}>
                📋 Setup Steps for {paymentSettings.gateway.provider.charAt(0).toUpperCase() + paymentSettings.gateway.provider.slice(1)}
              </h4>

              {paymentSettings.gateway.provider === 'stripe' && (
                <ol style={{ color: 'var(--blue-700)', margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
                  <li>Create a Stripe account at <a href="https://dashboard.stripe.com/register" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--blue-600)' }}>https://dashboard.stripe.com</a></li>
                  <li>Get your API keys from the Developers section</li>
                  <li>Enable webhooks at: https://dashboard.stripe.com/webhooks</li>
                  <li>Add webhook endpoint: <code style={{ background: 'var(--blue-100)', padding: '0.25rem', borderRadius: '4px' }}>https://yourdomain.com/api/webhooks/stripe</code></li>
                  <li>Select events: <code>payment_intent.succeeded</code>, <code>payment_intent.payment_failed</code></li>
                  <li>Copy the webhook signing secret and paste it above</li>
                </ol>
              )}

              {paymentSettings.gateway.provider === 'paypal' && (
                <ol style={{ color: 'var(--blue-700)', margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
                  <li>Create a PayPal Developer account at <a href="https://developer.paypal.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--blue-600)' }}>https://developer.paypal.com</a></li>
                  <li>Create a new app in your PayPal Developer Dashboard</li>
                  <li>Get your Client ID and Client Secret</li>
                  <li>Set up webhooks for payment notifications</li>
                  <li>Configure return URLs for successful/cancelled payments</li>
                </ol>
              )}

              {paymentSettings.gateway.provider === 'square' && (
                <ol style={{ color: 'var(--blue-700)', margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
                  <li>Create a Square Developer account at <a href="https://developer.squareup.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--blue-600)' }}>https://developer.squareup.com</a></li>
                  <li>Create a new application</li>
                  <li>Get your Application ID and Access Token</li>
                  <li>Configure webhook endpoints for payment events</li>
                  <li>Set sandbox/production environment as needed</li>
                </ol>
              )}

              {paymentSettings.gateway.provider === 'authorize_net' && (
                <ol style={{ color: 'var(--blue-700)', margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
                  <li>Sign up for Authorize.Net at <a href="https://www.authorize.net" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--blue-600)' }}>https://www.authorize.net</a></li>
                  <li>Get your API Login ID and Transaction Key from Account settings</li>
                  <li>Generate a Signature Key for webhook verification</li>
                  <li>Configure Silent Post URL for transaction notifications</li>
                  <li>Enable test mode for development</li>
                </ol>
              )}
            </div>

            <div style={{ background: 'var(--orange-50)', padding: '1rem', borderRadius: '8px' }}>
              <h4 style={{ color: 'var(--orange-800)', marginBottom: '0.5rem', fontSize: '1rem' }}>
                ⚠️ Security Considerations
              </h4>
              <ul style={{ color: 'var(--orange-700)', margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
                <li>Never store sensitive credentials in your frontend code</li>
                <li>Use environment variables for API keys on your server</li>
                <li>Enable HTTPS for all payment-related pages</li>
                <li>Implement proper webhook signature verification</li>
                <li>Use test mode during development and testing</li>
                <li>Regularly rotate API keys and secrets</li>
              </ul>
            </div>

            <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
              <button
                style={{
                  padding: '0.5rem 1rem',
                  background: 'var(--gray-100)',
                  color: 'var(--gray-700)',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
              >
                📖 View Documentation
              </button>
              <button
                style={{
                  padding: '0.5rem 1rem',
                  background: 'var(--gray-100)',
                  color: 'var(--gray-700)',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
              >
                🔗 Generate Webhook URL
              </button>
            </div>
          </div>

          {/* Save Settings */}
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            border: '1px solid var(--gray-200)',
            textAlign: 'center'
          }}>
            <button
              style={{
                padding: '1rem 2rem',
                background: 'var(--primary-600)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1.125rem',
                fontWeight: '600'
              }}
            >
              <Save size={16} style={{ marginRight: '0.5rem' }} />
              Save Payment Settings
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Admin Chatbot Component
  const AdminChatbot = () => {
    const [chatbotSettings, setChatbotSettings] = useState({
      enabled: true,
      welcomeMessage: "Hi! I'm your AI handyman assistant. I can help you with service information, pricing, scheduling, and emergency support. What can I help you with today?",
      responseDelay: 800,
      maxMessages: 50,
      autoLog: true,
      logEmail: "help.scottsdalehandyman@gmail.com",
      knowledgeBase: {
        electrical: true,
        plumbing: true,
        painting: true,
        hvac: true,
        general: true,
        emergency: true
      },
      quickReplies: {
        enabled: true,
        categories: ['electrical', 'plumbing', 'painting', 'general', 'pricing', 'scheduling']
      },
      actionButtons: {
        enabled: true,
        showQuoteRequest: true,
        showEmergencyService: true,
        showContactUs: true,
        showEmailUs: true
      },
      analytics: {
        trackConversations: true,
        trackPopularQueries: true,
        trackServiceRequests: true
      }
    });

    const [chatStats, setChatStats] = useState({
      totalConversations: 127,
      averageMessagesPerSession: 4.2,
      mostPopularServices: [
        { service: 'Electrical', count: 45 },
        { service: 'Plumbing', count: 38 },
        { service: 'Painting', count: 22 },
        { service: 'General Repairs', count: 19 },
        { service: 'Emergency', count: 13 }
      ],
      recentQueries: [
        { query: "electrical outlet installation", timestamp: "2 hours ago" },
        { query: "plumbing leak repair", timestamp: "4 hours ago" },
        { query: "emergency plumbing service", timestamp: "6 hours ago" },
        { query: "painting interior walls", timestamp: "1 day ago" },
        { query: "ceiling fan installation", timestamp: "1 day ago" }
      ]
    });

    const [testMessage, setTestMessage] = useState('');
    const [testResponse, setTestResponse] = useState('');

    const testChatbot = () => {
      if (!testMessage.trim()) return;

      // Use the existing generateChatResponse function
      const response = generateChatResponse(testMessage, {});
      setTestResponse(response);
    };

    const resetChatbot = () => {
      setChatMessages([{
        id: 1,
        type: 'bot',
        message: chatbotSettings.welcomeMessage,
        timestamp: new Date(),
        quickReplies: [
          { text: "⚡ Electrical Issues", action: "electrical problems" },
          { text: "🔧 Plumbing Help", action: "plumbing repair" },
          { text: "🎨 Painting Project", action: "painting service" },
          { text: "🔨 General Repairs", action: "handyman repairs" },
          { text: "💰 Get Pricing", action: "pricing information" },
          { text: "📅 Schedule Now", action: "schedule appointment" }
        ]
      }]);
    };

    const exportChatData = () => {
      const data = {
        settings: chatbotSettings,
        stats: chatStats,
        recentMessages: chatMessages,
        exportDate: new Date().toISOString()
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `chatbot-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    };

    return (
      <div style={{ display: 'grid', gap: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ color: 'var(--gray-900)', margin: 0 }}>Chatbot Controls</h2>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={exportChatData}
              style={{
                padding: '0.5rem 1rem',
                background: 'var(--primary-600)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem'
              }}
            >
              <Download size={16} />
              Export Data
            </button>
            <button
              onClick={resetChatbot}
              style={{
                padding: '0.5rem 1rem',
                background: 'var(--warning)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem'
              }}
            >
              <RotateCcw size={16} />
              Reset Chat
            </button>
          </div>
        </div>

        {/* Analytics Overview */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            border: '1px solid var(--gray-200)',
            textAlign: 'center'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              color: 'white'
            }}>
              <MessageCircle size={24} />
            </div>
            <h3 style={{ margin: '0 0 0.5rem', color: 'var(--gray-900)', fontSize: '2rem' }}>
              {chatStats.totalConversations}
            </h3>
            <p style={{ margin: 0, color: 'var(--gray-600)', fontSize: '0.9rem' }}>
              Total Conversations
            </p>
          </div>

          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            border: '1px solid var(--gray-200)',
            textAlign: 'center'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              color: 'white'
            }}>
              <TrendingUp size={24} />
            </div>
            <h3 style={{ margin: '0 0 0.5rem', color: 'var(--gray-900)', fontSize: '2rem' }}>
              {chatStats.averageMessagesPerSession}
            </h3>
            <p style={{ margin: 0, color: 'var(--gray-600)', fontSize: '0.9rem' }}>
              Avg Messages/Session
            </p>
          </div>

          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            border: '1px solid var(--gray-200)',
            textAlign: 'center'
          }}>
            <div style={{
              background: chatbotSettings.enabled ? 'var(--success)' : 'var(--error)',
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              color: 'white'
            }}>
              <Bot size={24} />
            </div>
            <h3 style={{ margin: '0 0 0.5rem', color: 'var(--gray-900)', fontSize: '1.5rem' }}>
              {chatbotSettings.enabled ? 'Active' : 'Disabled'}
            </h3>
            <p style={{ margin: 0, color: 'var(--gray-600)', fontSize: '0.9rem' }}>
              Chatbot Status
            </p>
          </div>

          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            border: '1px solid var(--gray-200)',
            textAlign: 'center'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              color: 'white'
            }}>
              <Target size={24} />
            </div>
            <h3 style={{ margin: '0 0 0.5rem', color: 'var(--gray-900)', fontSize: '2rem' }}>
              {chatStats.mostPopularServices[0]?.count || 0}
            </h3>
            <p style={{ margin: 0, color: 'var(--gray-600)', fontSize: '0.9rem' }}>
              Top Service Requests
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          {/* Chatbot Settings */}
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            border: '1px solid var(--gray-200)'
          }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--gray-900)' }}>Chatbot Settings</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label style={{ color: 'var(--gray-700)' }}>Enable Chatbot</label>
                <input
                  type="checkbox"
                  checked={chatbotSettings.enabled}
                  onChange={(e) => setChatbotSettings(prev => ({ ...prev, enabled: e.target.checked }))}
                  style={{ transform: 'scale(1.2)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--gray-700)' }}>
                  Welcome Message
                </label>
                <textarea
                  value={chatbotSettings.welcomeMessage}
                  onChange={(e) => setChatbotSettings(prev => ({ ...prev, welcomeMessage: e.target.value }))}
                  style={{
                    width: '100%',
                    minHeight: '80px',
                    padding: '0.75rem',
                    border: '1px solid var(--gray-300)',
                    borderRadius: '6px',
                    resize: 'vertical',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--gray-700)' }}>
                  Response Delay (ms)
                </label>
                <input
                  type="number"
                  value={chatbotSettings.responseDelay}
                  onChange={(e) => setChatbotSettings(prev => ({ ...prev, responseDelay: parseInt(e.target.value) }))}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid var(--gray-300)',
                    borderRadius: '6px',
                    fontSize: '0.9rem'
                  }}
                  min="100"
                  max="5000"
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label style={{ color: 'var(--gray-700)' }}>Auto-log Conversations</label>
                <input
                  type="checkbox"
                  checked={chatbotSettings.autoLog}
                  onChange={(e) => setChatbotSettings(prev => ({ ...prev, autoLog: e.target.checked }))}
                  style={{ transform: 'scale(1.2)' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label style={{ color: 'var(--gray-700)' }}>Quick Replies</label>
                <input
                  type="checkbox"
                  checked={chatbotSettings.quickReplies.enabled}
                  onChange={(e) => setChatbotSettings(prev => ({
                    ...prev,
                    quickReplies: { ...prev.quickReplies, enabled: e.target.checked }
                  }))}
                  style={{ transform: 'scale(1.2)' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label style={{ color: 'var(--gray-700)' }}>Action Buttons</label>
                <input
                  type="checkbox"
                  checked={chatbotSettings.actionButtons.enabled}
                  onChange={(e) => setChatbotSettings(prev => ({
                    ...prev,
                    actionButtons: { ...prev.actionButtons, enabled: e.target.checked }
                  }))}
                  style={{ transform: 'scale(1.2)' }}
                />
              </div>
            </div>

            <button
              style={{
                width: '100%',
                marginTop: '1rem',
                padding: '0.75rem',
                background: 'var(--primary-600)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              <Save size={16} />
              Save Settings
            </button>
          </div>

          {/* Test Chatbot */}
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            border: '1px solid var(--gray-200)'
          }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--gray-900)' }}>Test Chatbot</h3>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--gray-700)' }}>
                Test Message
              </label>
              <input
                type="text"
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                placeholder="Type a test message..."
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid var(--gray-300)',
                  borderRadius: '6px',
                  fontSize: '0.9rem'
                }}
              />
            </div>

            <button
              onClick={testChatbot}
              style={{
                width: '100%',
                marginBottom: '1rem',
                padding: '0.75rem',
                background: 'var(--success)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              <Send size={16} />
              Test Response
            </button>

            {testResponse && (
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--gray-700)' }}>
                  Bot Response
                </label>
                <div style={{
                  padding: '1rem',
                  background: 'var(--gray-50)',
                  border: '1px solid var(--gray-200)',
                  borderRadius: '6px',
                  fontSize: '0.9rem',
                  color: 'var(--gray-700)',
                  whiteSpace: 'pre-wrap'
                }}>
                  {testResponse}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Analytics */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          {/* Popular Services */}
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            border: '1px solid var(--gray-200)'
          }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--gray-900)' }}>Popular Services</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {chatStats.mostPopularServices.map((service, index) => (
                <div key={index} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem',
                  background: 'var(--gray-50)',
                  borderRadius: '6px'
                }}>
                  <span style={{ color: 'var(--gray-700)' }}>{service.service}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{
                      background: 'var(--primary-600)',
                      color: 'white',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.8rem'
                    }}>
                      {service.count}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Queries */}
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            border: '1px solid var(--gray-200)'
          }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--gray-900)' }}>Recent Queries</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {chatStats.recentQueries.map((query, index) => (
                <div key={index} style={{
                  padding: '0.75rem',
                  background: 'var(--gray-50)',
                  borderRadius: '6px'
                }}>
                  <div style={{ color: 'var(--gray-700)', marginBottom: '0.25rem' }}>
                    "{query.query}"
                  </div>
                  <div style={{ color: 'var(--gray-500)', fontSize: '0.8rem' }}>
                    {query.timestamp}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Knowledge Base Management */}
        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid var(--gray-200)'
        }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--gray-900)' }}>Knowledge Base</h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {Object.entries(chatbotSettings.knowledgeBase).map(([category, enabled]) => (
              <div key={category} style={{
                padding: '1rem',
                background: enabled ? 'var(--success-50)' : 'var(--gray-50)',
                border: `1px solid ${enabled ? 'var(--success-200)' : 'var(--gray-200)'}`,
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <span style={{
                  color: enabled ? 'var(--success-700)' : 'var(--gray-600)',
                  textTransform: 'capitalize',
                  fontWeight: '500'
                }}>
                  {category}
                </span>
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={(e) => setChatbotSettings(prev => ({
                    ...prev,
                    knowledgeBase: {
                      ...prev.knowledgeBase,
                      [category]: e.target.checked
                    }
                  }))}
                  style={{ transform: 'scale(1.2)' }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Footer component
  const Footer = () => (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Contact Info</h3>
            <p>Phone: (480) 255-5887</p>
            <p>Email: info@scottsdalehandyman.com</p>
            <p>Service Area: Scottsdale & Surrounding Areas</p>
          </div>

          <div className="footer-section">
            <h3>Services</h3>
            <p><a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('home-repairs'); setShowSuccessPage(false); }}>Home Repairs</a></p>
            <p><a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('maintenance-plans'); setShowSuccessPage(false); }}>Maintenance Plans</a></p>
            <p><a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('home-improvements'); setShowSuccessPage(false); }}>Home Improvements</a></p>
            <p><a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('emergency-services'); setShowSuccessPage(false); }}>Emergency Services</a></p>
            <p><a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('smart-home-solutions'); setShowSuccessPage(false); }}>Smart Home Solutions</a></p>
          </div>

          <div className="footer-section">
            <h3>Company</h3>
            <p><a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('about'); setShowSuccessPage(false); }}>About Us</a></p>
            <p><a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('blog'); setShowSuccessPage(false); }}>Blog</a></p>
            <p><a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('work-with-us'); setShowSuccessPage(false); }}>Careers</a></p>
            <p><a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('pay'); setShowSuccessPage(false); }}>Pay Invoice</a></p>
          </div>

          <div className="footer-section">
            <h3>Business Hours</h3>
            <p>Monday - Friday: 8AM - 6PM</p>
            <p>Saturday: 9AM - 4PM</p>
            <p>Sunday: Emergency Only</p>
            <p>Emergency Service: 24/7</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2024 Scottsdale Handyman Solutions LLC. All rights reserved. Licensed, Bonded & Insured.</p>
        </div>
      </div>
    </footer>
  )

  // MongoDB Image Gallery Component
  const ImageGallery = ({ category = null }) => {
    const [images, setImages] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedImage, setSelectedImage] = useState(null)

    useEffect(() => {
      const fetchImages = async () => {
        try {
          setLoading(true)
          const url = category ? `/api/gallery-images?category=${category}` : '/api/gallery-images'
          const response = await fetch(url)
          const data = await response.json()

          if (data.success) {
            setImages(data.images)
          }
        } catch (error) {
          console.error('Error fetching images:', error)
        } finally {
          setLoading(false)
        }
      }

      fetchImages()
    }, [category])

    if (loading) {
      return (
        <div style={{
          textAlign: 'center',
          padding: '2rem',
          color: '#666'
        }}>
          Loading gallery...
        </div>
      )
    }

    return (
      <div style={{ margin: '2rem 0' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1rem'
        }}>
          {images.map((image) => (
            <div
              key={image._id}
              onClick={() => setSelectedImage(image)}
              style={{
                position: 'relative',
                cursor: 'pointer',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease',
                background: 'white'
              }}
            >
              <img
                src={`data:${image.contentType};base64,${image.imageData}`}
                alt={image.title || 'Gallery image'}
                style={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'cover'
                }}
              />
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                color: 'white',
                padding: '1rem',
                textAlign: 'center'
              }}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>
                  {image.title || 'Project Image'}
                </h4>
                <p style={{ margin: 0, fontSize: '0.8rem', opacity: '0.9' }}>
                  {image.description || 'Click to view'}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Modal for selected image */}
        {selectedImage && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '2rem'
            }}
            onClick={() => setSelectedImage(null)}
          >
            <div style={{
              maxWidth: '90vw',
              maxHeight: '90vh',
              background: 'white',
              borderRadius: '12px',
              overflow: 'hidden',
              position: 'relative'
            }}>
              <button
                onClick={() => setSelectedImage(null)}
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'rgba(0,0,0,0.7)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  cursor: 'pointer',
                  zIndex: 1001
                }}
              >
                ×
              </button>
              <img
                src={`data:${selectedImage.contentType};base64,${selectedImage.imageData}`}
                alt={selectedImage.title}
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block'
                }}
              />
              <div style={{ padding: '1.5rem' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>
                  {selectedImage.title || 'Project Image'}
                </h3>
                <p style={{ margin: 0, color: '#666', lineHeight: '1.5' }}>
                  {selectedImage.description || 'Quality handyman work by Scottsdale Handyman Solutions.'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Service Page Components
  const HomeRepairsPage = () => (
    <div style={{ minHeight: 'calc(100vh - 120px)', background: '#f8f9fa', paddingTop: '120px', paddingBottom: '80px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        {/* Hero Section with Background Image */}
        <div style={{
          background: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url('https://images.unsplash.com/photo-1581878542071-8ad02062a5ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80') center/cover`,
          padding: '80px 40px',
          borderRadius: '16px',
          color: 'white',
          textAlign: 'center',
          marginBottom: '60px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Enhanced overlay for better text readability */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.4)',
            borderRadius: '16px'
          }}></div>

          <div style={{ position: 'relative', zIndex: 2 }}>
            <h1 style={{
              fontSize: '3.5rem',
              marginBottom: '24px',
              fontWeight: '800',
              color: 'white',
              textShadow: '2px 2px 8px rgba(0,0,0,0.5)',
              lineHeight: '1.2'
            }}>
              🏠 Professional Home Repairs
            </h1>
            <p style={{
              fontSize: '1.4rem',
              maxWidth: '900px',
              margin: '0 auto 30px',
              color: 'white',
              lineHeight: '1.6',
              textShadow: '1px 1px 4px rgba(0,0,0,0.4)',
              opacity: '0.98'
            }}>
              Expert repair services to keep your Scottsdale home in perfect condition. From minor fixes to major repairs, our licensed professionals deliver quality workmanship you can trust.
            </p>
            <div style={{
              background: 'rgba(255, 215, 0, 0.95)',
              color: '#1a1a1a',
              padding: '20px 30px',
              borderRadius: '12px',
              display: 'inline-block',
              boxShadow: '0 8px 25px rgba(255, 215, 0, 0.4)',
              marginTop: '10px'
            }}>
              <div style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '5px' }}>📞 Call Now: (480) 255-5887</div>
              <div style={{ fontSize: '1rem', opacity: '0.8', fontWeight: '600' }}>⚡ Same-Day Service Available</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '40px', marginBottom: '80px' }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            boxShadow: '0 15px 40px rgba(0,0,0,0.1)',
            border: '3px solid #FFD700',
            overflow: 'hidden',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease'
          }}>
            {/* Interior Repairs Header with Better Image Integration */}
            <div style={{
              position: 'relative',
              height: '200px',
              background: `url('https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80') center/cover`,
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🏡</div>
                  <h3 style={{
                    margin: 0,
                    fontSize: '1.8rem',
                    fontWeight: '800',
                    color: 'white',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                  }}>
                    Interior Repairs
                  </h3>
                </div>
              </div>
            </div>
            <div style={{ padding: '35px' }}>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ padding: '15px 0', color: '#333', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: '#1e3c72', marginRight: '12px', fontSize: '1.3rem' }}>🔨</span>
                  <span style={{ fontWeight: '500', fontSize: '1rem' }}>Drywall repair and patching</span>
                </li>
                <li style={{ padding: '15px 0', color: '#333', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: '#1e3c72', marginRight: '12px', fontSize: '1.3rem' }}>🚪</span>
                  <span style={{ fontWeight: '500', fontSize: '1rem' }}>Door and window repairs</span>
                </li>
                <li style={{ padding: '15px 0', color: '#333', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: '#1e3c72', marginRight: '12px', fontSize: '1.3rem' }}>📐</span>
                  <span style={{ fontWeight: '500', fontSize: '1rem' }}>Flooring repairs and replacement</span>
                </li>
                <li style={{ padding: '15px 0', color: '#333', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: '#1e3c72', marginRight: '12px', fontSize: '1.3rem' }}>🗄️</span>
                  <span style={{ fontWeight: '500', fontSize: '1rem' }}>Cabinet door adjustments</span>
                </li>
                <li style={{ padding: '15px 0', color: '#333', display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: '#1e3c72', marginRight: '12px', fontSize: '1.3rem' }}>✨</span>
                  <span style={{ fontWeight: '500', fontSize: '1rem' }}>Trim and molding repair</span>
                </li>
              </ul>
            </div>
          </div>

          <div style={{
            background: 'white',
            borderRadius: '20px',
            boxShadow: '0 15px 40px rgba(0,0,0,0.1)',
            border: '3px solid #FFD700',
            overflow: 'hidden',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease'
          }}>
            {/* Exterior Repairs Header with Better Image Integration */}
            <div style={{
              position: 'relative',
              height: '200px',
              background: `url('https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80') center/cover`,
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🏘️</div>
                  <h3 style={{
                    margin: 0,
                    fontSize: '1.8rem',
                    fontWeight: '800',
                    color: 'white',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                  }}>
                    Exterior Repairs
                  </h3>
                </div>
              </div>
            </div>
            <div style={{ padding: '35px' }}>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ padding: '15px 0', color: '#333', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: '#1e3c72', marginRight: '12px', fontSize: '1.3rem' }}>🚧</span>
                  <span style={{ fontWeight: '500', fontSize: '1rem' }}>Fence and gate repairs</span>
                </li>
                <li style={{ padding: '15px 0', color: '#333', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: '#1e3c72', marginRight: '12px', fontSize: '1.3rem' }}>🏖️</span>
                  <span style={{ fontWeight: '500', fontSize: '1rem' }}>Deck and patio repairs</span>
                </li>
                <li style={{ padding: '15px 0', color: '#333', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: '#1e3c72', marginRight: '12px', fontSize: '1.3rem' }}>🧱</span>
                  <span style={{ fontWeight: '500', fontSize: '1rem' }}>Stucco and siding repair</span>
                </li>
                <li style={{ padding: '15px 0', color: '#333', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: '#1e3c72', marginRight: '12px', fontSize: '1.3rem' }}>🏠</span>
                  <span style={{ fontWeight: '500', fontSize: '1rem' }}>Roof minor repairs</span>
                </li>
                <li style={{ padding: '15px 0', color: '#333', display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: '#1e3c72', marginRight: '12px', fontSize: '1.3rem' }}>🌧️</span>
                  <span style={{ fontWeight: '500', fontSize: '1rem' }}>Gutter cleaning and repair</span>
                </li>
              </ul>
            </div>
          </div>

          <div style={{
            background: 'white',
            borderRadius: '20px',
            boxShadow: '0 15px 40px rgba(0,0,0,0.1)',
            border: '3px solid #FFD700',
            overflow: 'hidden',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease'
          }}>
            {/* Electrical & Plumbing Header with Better Image Integration */}
            <div style={{
              position: 'relative',
              height: '200px',
              background: `url('https://images.unsplash.com/photo-1621905252507-b35492cc74b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80') center/cover`,
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '10px' }}>⚡</div>
                  <h3 style={{
                    margin: 0,
                    fontSize: '1.8rem',
                    fontWeight: '800',
                    color: 'white',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                  }}>
                    Electrical & Plumbing
                  </h3>
                </div>
              </div>
            </div>
            <div style={{ padding: '35px' }}>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ padding: '15px 0', color: '#333', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: '#1e3c72', marginRight: '12px', fontSize: '1.3rem' }}>💡</span>
                  <span style={{ fontWeight: '500', fontSize: '1rem' }}>Fixture replacements</span>
                </li>
                <li style={{ padding: '15px 0', color: '#333', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: '#1e3c72', marginRight: '12px', fontSize: '1.3rem' }}>🔌</span>
                  <span style={{ fontWeight: '500', fontSize: '1rem' }}>Outlet and switch repair</span>
                </li>
                <li style={{ padding: '15px 0', color: '#333', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: '#1e3c72', marginRight: '12px', fontSize: '1.3rem' }}>🚿</span>
                  <span style={{ fontWeight: '500', fontSize: '1rem' }}>Faucet and toilet repairs</span>
                </li>
                <li style={{ padding: '15px 0', color: '#333', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: '#1e3c72', marginRight: '12px', fontSize: '1.3rem' }}>💧</span>
                  <span style={{ fontWeight: '500', fontSize: '1rem' }}>Leak detection and repair</span>
                </li>
                <li style={{ padding: '15px 0', color: '#333', display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: '#1e3c72', marginRight: '12px', fontSize: '1.3rem' }}>🔧</span>
                  <span style={{ fontWeight: '500', fontSize: '1rem' }}>Caulking and sealing</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div style={{
          background: 'white',
          padding: '60px 50px',
          borderRadius: '20px',
          boxShadow: '0 15px 40px rgba(0,0,0,0.1)',
          border: '3px solid #FFD700',
          textAlign: 'center',
          marginBottom: '60px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
            color: 'white',
            padding: '25px',
            borderRadius: '16px',
            marginBottom: '50px'
          }}>
            <h3 style={{ margin: 0, fontSize: '2.2rem', fontWeight: '800' }}>⭐ Why Choose Our Repair Services?</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px', marginBottom: '50px' }}>
            <div style={{
              background: '#f8f9fa',
              padding: '30px',
              borderRadius: '16px',
              border: '2px solid #e9ecef',
              transition: 'transform 0.3s ease'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '15px' }}>⚡</div>
              <h4 style={{ color: '#1e3c72', marginBottom: '15px', fontSize: '1.3rem', fontWeight: '700' }}>Quick Response</h4>
              <p style={{ color: '#666', lineHeight: '1.6', fontSize: '1rem' }}>Same-day service available for urgent repairs. We understand your time is valuable.</p>
            </div>
            <div style={{
              background: '#f8f9fa',
              padding: '30px',
              borderRadius: '16px',
              border: '2px solid #e9ecef',
              transition: 'transform 0.3s ease'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🏆</div>
              <h4 style={{ color: '#1e3c72', marginBottom: '15px', fontSize: '1.3rem', fontWeight: '700' }}>Quality Materials</h4>
              <p style={{ color: '#666', lineHeight: '1.6', fontSize: '1rem' }}>We use only high-quality, durable materials designed for Arizona's desert climate.</p>
            </div>
            <div style={{
              background: '#f8f9fa',
              padding: '30px',
              borderRadius: '16px',
              border: '2px solid #e9ecef',
              transition: 'transform 0.3s ease'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '15px' }}>💰</div>
              <h4 style={{ color: '#1e3c72', marginBottom: '15px', fontSize: '1.3rem', fontWeight: '700' }}>Fair Pricing</h4>
              <p style={{ color: '#666', lineHeight: '1.6', fontSize: '1rem' }}>Transparent, competitive pricing with no hidden fees. You know the cost upfront.</p>
            </div>
            <div style={{
              background: '#f8f9fa',
              padding: '30px',
              borderRadius: '16px',
              border: '2px solid #e9ecef',
              transition: 'transform 0.3s ease'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '15px' }}>✅</div>
              <h4 style={{ color: '#1e3c72', marginBottom: '15px', fontSize: '1.3rem', fontWeight: '700' }}>Guaranteed Work</h4>
              <p style={{ color: '#666', lineHeight: '1.6', fontSize: '1rem' }}>All repairs backed by our 100% satisfaction guarantee and warranty protection.</p>
            </div>
          </div>

          {/* Service Packages */}
          <div style={{
            background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
            color: 'white',
            padding: '25px',
            borderRadius: '16px',
            marginBottom: '40px'
          }}>
            <h3 style={{ margin: 0, fontSize: '2rem', fontWeight: '800' }}>🛠️ Home Repair Service Packages</h3>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '30px',
            marginBottom: '40px'
          }}>
            {servicePackages['home-repairs'].packages.map((pkg, index) => (
              <div key={pkg.id} style={{
                background: 'white',
                padding: '35px',
                borderRadius: '16px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                border: '3px solid #FFD700',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                  color: 'white',
                  padding: '15px',
                  borderRadius: '12px',
                  marginBottom: '20px'
                }}>
                  <h4 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '700' }}>{pkg.name}</h4>
                </div>
                <div style={{
                  fontSize: '2.5rem',
                  fontWeight: '800',
                  color: '#1e3c72',
                  marginBottom: '20px',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
                }}>
                  ${pkg.price}
                </div>
                <p style={{
                  color: '#666',
                  marginBottom: '25px',
                  fontSize: '1rem',
                  lineHeight: '1.5',
                  fontWeight: '500'
                }}>
                  {pkg.description}
                </p>
                <button
                  onClick={() => {
                    setSelectedService(pkg);
                    setCurrentPage('checkout');
                  }}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                    color: 'white',
                    padding: '15px 25px',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '1.1rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    boxShadow: '0 6px 20px rgba(30, 60, 114, 0.3)'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 25px rgba(30, 60, 114, 0.4)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 6px 20px rgba(30, 60, 114, 0.3)';
                  }}
                >
                  🔧 Book This Service
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={() => {
              setCurrentPage('home');
              setTimeout(() => {
                const contactSection = document.getElementById('contact');
                if (contactSection) {
                  contactSection.scrollIntoView({ behavior: 'smooth' });
                }
              }, 100);
            }}
            style={{
              background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
              color: 'white',
              padding: '18px 40px',
              border: 'none',
              borderRadius: '12px',
              fontSize: '1.2rem',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 8px 25px rgba(30, 60, 114, 0.4)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 12px 35px rgba(30, 60, 114, 0.5)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 8px 25px rgba(30, 60, 114, 0.4)';
            }}
          >
            📞 Get Your Free Estimate
          </button>
        </div>
      </div>
    </div>
  )

  const MaintenancePlansPage = () => (
    <div style={{ minHeight: 'calc(100vh - 120px)', background: '#f8f9fa', paddingTop: '120px', paddingBottom: '80px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        {/* Hero Section with Background Image */}
        <div style={{
          background: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url('https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80') center/cover`,
          padding: '80px 40px',
          borderRadius: '16px',
          color: 'white',
          textAlign: 'center',
          marginBottom: '60px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Enhanced overlay for better text readability */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(40, 167, 69, 0.9) 0%, rgba(52, 206, 87, 0.8) 100%)',
            borderRadius: '16px'
          }}></div>

          <div style={{ position: 'relative', zIndex: 2 }}>
            <h1 style={{
              fontSize: '3.5rem',
              marginBottom: '24px',
              fontWeight: '800',
              color: 'white',
              textShadow: '2px 2px 8px rgba(0,0,0,0.5)',
              lineHeight: '1.2'
            }}>
              🛠️ Maintenance Plans
            </h1>
            <p style={{
              fontSize: '1.4rem',
              maxWidth: '900px',
              margin: '0 auto 30px',
              color: 'white',
              lineHeight: '1.6',
              textShadow: '1px 1px 4px rgba(0,0,0,0.4)',
              opacity: '0.98'
            }}>
              Preventive maintenance plans to keep your Scottsdale home in peak condition year-round. Save money and avoid costly repairs with our comprehensive maintenance programs.
            </p>
            <div style={{
              background: 'rgba(255, 215, 0, 0.95)',
              color: '#1a1a1a',
              padding: '20px 30px',
              borderRadius: '12px',
              display: 'inline-block',
              boxShadow: '0 8px 25px rgba(255, 215, 0, 0.4)',
              marginTop: '10px'
            }}>
              <div style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '5px' }}>💰 Save Up to 30% on Repairs</div>
              <div style={{ fontSize: '1rem', opacity: '0.8', fontWeight: '600' }}>🔧 Professional Maintenance Included</div>
            </div>
          </div>
        </div>

        {/* Maintenance Plans Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '40px', marginBottom: '80px' }}>
          {/* Basic Plan */}
          <div style={{
            background: 'white',
            borderRadius: '20px',
            boxShadow: '0 15px 40px rgba(0,0,0,0.1)',
            border: '3px solid #FFD700',
            overflow: 'hidden',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #28a745 0%, #34ce57 100%)',
              padding: '35px',
              textAlign: 'center',
              color: 'white'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🏠</div>
              <h3 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '800' }}>Basic Plan</h3>
              <div style={{ fontSize: '2.8rem', fontWeight: '800', marginTop: '15px' }}>
                $99<span style={{ fontSize: '1.2rem', fontWeight: '500' }}>/month</span>
              </div>
            </div>
            <div style={{ padding: '40px' }}>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 30px 0' }}>
                <li style={{ padding: '15px 0', color: '#333', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: '#28a745', marginRight: '12px', fontSize: '1.3rem' }}>🔍</span>
                  <span style={{ fontWeight: '500', fontSize: '1rem' }}>Quarterly home inspection</span>
                </li>
                <li style={{ padding: '15px 0', color: '#333', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: '#28a745', marginRight: '12px', fontSize: '1.3rem' }}>🌬️</span>
                  <span style={{ fontWeight: '500', fontSize: '1rem' }}>HVAC filter replacement</span>
                </li>
                <li style={{ padding: '15px 0', color: '#333', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: '#28a745', marginRight: '12px', fontSize: '1.3rem' }}>🚨</span>
                  <span style={{ fontWeight: '500', fontSize: '1rem' }}>Smoke detector testing</span>
                </li>
                <li style={{ padding: '15px 0', color: '#333', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: '#28a745', marginRight: '12px', fontSize: '1.3rem' }}>💰</span>
                  <span style={{ fontWeight: '500', fontSize: '1rem' }}>10% discount on repairs</span>
                </li>
                <li style={{ padding: '15px 0', color: '#333', display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: '#28a745', marginRight: '12px', fontSize: '1.3rem' }}>⏰</span>
                  <span style={{ fontWeight: '500', fontSize: '1rem' }}>Priority scheduling</span>
                </li>
              </ul>
              <button
                onClick={() => {
                  setSelectedService(servicePackages['maintenance'].packages.find(pkg => pkg.id === 'maintenance-basic'));
                  setCurrentPage('checkout');
                }}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #28a745 0%, #34ce57 100%)',
                  color: 'white',
                  padding: '15px 25px',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  boxShadow: '0 6px 20px rgba(40, 167, 69, 0.3)'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(40, 167, 69, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 6px 20px rgba(40, 167, 69, 0.3)';
                }}
              >
                🏠 Choose Basic Plan
              </button>
            </div>
          </div>

          {/* Premium Plan - Most Popular */}
          <div style={{
            background: 'white',
            borderRadius: '20px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
            border: '4px solid #28a745',
            overflow: 'hidden',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              top: '-12px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
              color: '#1a1a1a',
              padding: '8px 20px',
              borderRadius: '20px',
              fontSize: '0.9rem',
              fontWeight: '800',
              boxShadow: '0 4px 15px rgba(255, 215, 0, 0.4)',
              zIndex: 10
            }}>
              ⭐ MOST POPULAR
            </div>
            <div style={{
              background: 'linear-gradient(135deg, #28a745 0%, #34ce57 100%)',
              padding: '45px 35px 35px',
              textAlign: 'center',
              color: 'white'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🏆</div>
              <h3 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '800' }}>Premium Plan</h3>
              <div style={{ fontSize: '2.8rem', fontWeight: '800', marginTop: '15px' }}>
                $199<span style={{ fontSize: '1.2rem', fontWeight: '500' }}>/month</span>
              </div>
            </div>
            <div style={{ padding: '40px' }}>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 30px 0' }}>
                <li style={{ padding: '15px 0', color: '#333', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: '#28a745', marginRight: '12px', fontSize: '1.3rem' }}>📅</span>
                  <span style={{ fontWeight: '500', fontSize: '1rem' }}>Monthly home inspection</span>
                </li>
                <li style={{ padding: '15px 0', color: '#333', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: '#28a745', marginRight: '12px', fontSize: '1.3rem' }}>🔧</span>
                  <span style={{ fontWeight: '500', fontSize: '1rem' }}>HVAC maintenance & cleaning</span>
                </li>
                <li style={{ padding: '15px 0', color: '#333', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: '#28a745', marginRight: '12px', fontSize: '1.3rem' }}>🌧️</span>
                  <span style={{ fontWeight: '500', fontSize: '1rem' }}>Gutter cleaning (2x/year)</span>
                </li>
                <li style={{ padding: '15px 0', color: '#333', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: '#28a745', marginRight: '12px', fontSize: '1.3rem' }}>🔨</span>
                  <span style={{ fontWeight: '500', fontSize: '1rem' }}>Minor repairs included</span>
                </li>
                <li style={{ padding: '15px 0', color: '#333', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: '#28a745', marginRight: '12px', fontSize: '1.3rem' }}>💸</span>
                  <span style={{ fontWeight: '500', fontSize: '1rem' }}>20% discount on major repairs</span>
                </li>
                <li style={{ padding: '15px 0', color: '#333', display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: '#28a745', marginRight: '12px', fontSize: '1.3rem' }}>🚨</span>
                  <span style={{ fontWeight: '500', fontSize: '1rem' }}>Emergency service priority</span>
                </li>
              </ul>
              <button
                onClick={() => {
                  setSelectedService(servicePackages['maintenance'].packages.find(pkg => pkg.id === 'maintenance-premium'));
                  setCurrentPage('checkout');
                }}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #28a745 0%, #34ce57 100%)',
                  color: 'white',
                  padding: '15px 25px',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  boxShadow: '0 6px 20px rgba(40, 167, 69, 0.3)'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(40, 167, 69, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 6px 20px rgba(40, 167, 69, 0.3)';
                }}
              >
                🏆 Choose Premium Plan
              </button>
            </div>
          </div>

          {/* Elite Plan */}
          <div style={{
            background: 'white',
            borderRadius: '20px',
            boxShadow: '0 15px 40px rgba(0,0,0,0.1)',
            border: '3px solid #FFD700',
            overflow: 'hidden',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #28a745 0%, #34ce57 100%)',
              padding: '35px',
              textAlign: 'center',
              color: 'white'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '15px' }}>💎</div>
              <h3 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '800' }}>Elite Plan</h3>
              <div style={{ fontSize: '2.8rem', fontWeight: '800', marginTop: '15px' }}>
                $349<span style={{ fontSize: '1.2rem', fontWeight: '500' }}>/month</span>
              </div>
            </div>
            <div style={{ padding: '40px' }}>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 30px 0' }}>
                <li style={{ padding: '15px 0', color: '#333', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: '#28a745', marginRight: '12px', fontSize: '1.3rem' }}>📋</span>
                  <span style={{ fontWeight: '500', fontSize: '1rem' }}>Weekly property checks</span>
                </li>
                <li style={{ padding: '15px 0', color: '#333', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: '#28a745', marginRight: '12px', fontSize: '1.3rem' }}>❄️</span>
                  <span style={{ fontWeight: '500', fontSize: '1rem' }}>Complete HVAC service</span>
                </li>
                <li style={{ padding: '15px 0', color: '#333', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: '#28a745', marginRight: '12px', fontSize: '1.3rem' }}>🌿</span>
                  <span style={{ fontWeight: '500', fontSize: '1rem' }}>Landscaping maintenance</span>
                </li>
                <li style={{ padding: '15px 0', color: '#333', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: '#28a745', marginRight: '12px', fontSize: '1.3rem' }}>🔧</span>
                  <span style={{ fontWeight: '500', fontSize: '1rem' }}>All minor repairs included</span>
                </li>
                <li style={{ padding: '15px 0', color: '#333', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: '#28a745', marginRight: '12px', fontSize: '1.3rem' }}>💯</span>
                  <span style={{ fontWeight: '500', fontSize: '1rem' }}>30% discount on major work</span>
                </li>
                <li style={{ padding: '15px 0', color: '#333', display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: '#28a745', marginRight: '12px', fontSize: '1.3rem' }}>🚑</span>
                  <span style={{ fontWeight: '500', fontSize: '1rem' }}>24/7 emergency response</span>
                </li>
              </ul>
              <button
                onClick={() => {
                  setSelectedService(servicePackages['maintenance'].packages.find(pkg => pkg.id === 'maintenance-elite'));
                  setCurrentPage('checkout');
                }}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #28a745 0%, #34ce57 100%)',
                  color: 'white',
                  padding: '15px 25px',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  boxShadow: '0 6px 20px rgba(40, 167, 69, 0.3)'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(40, 167, 69, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 6px 20px rgba(40, 167, 69, 0.3)';
                }}
              >
                💎 Choose Elite Plan
              </button>
            </div>
          </div>
        </div>

        <div style={{
          background: `linear-gradient(rgba(40, 167, 69, 0.95), rgba(52, 206, 87, 0.95)), url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80') center/cover`,
          padding: '80px 50px',
          borderRadius: '20px',
          color: 'white',
          textAlign: 'center',
          marginBottom: '60px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.4)',
            borderRadius: '20px'
          }}></div>

          <div style={{ position: 'relative', zIndex: 2 }}>
            <h2 style={{
              fontSize: '2.8rem',
              marginBottom: '40px',
              fontWeight: '800',
              textShadow: '2px 2px 8px rgba(0,0,0,0.5)'
            }}>
              🌟 Why Choose Our Maintenance Plans?
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', maxWidth: '1000px', margin: '0 auto' }}>
              <div style={{
                padding: '35px',
                background: 'rgba(255,255,255,0.15)',
                borderRadius: '16px',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '20px' }}>💰</div>
                <h3 style={{ fontSize: '1.7rem', marginBottom: '20px', fontWeight: '700', textShadow: '1px 1px 4px rgba(0,0,0,0.3)' }}>Save Big Money</h3>
                <p style={{ fontSize: '1.1rem', opacity: '0.95', lineHeight: '1.6', textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
                  Regular maintenance prevents costly emergency repairs and extends the life of your home systems by up to 50%.
                </p>
              </div>

              <div style={{
                padding: '35px',
                background: 'rgba(255,255,255,0.15)',
                borderRadius: '16px',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '20px' }}>😌</div>
                <h3 style={{ fontSize: '1.7rem', marginBottom: '20px', fontWeight: '700', textShadow: '1px 1px 4px rgba(0,0,0,0.3)' }}>Complete Peace of Mind</h3>
                <p style={{ fontSize: '1.1rem', opacity: '0.95', lineHeight: '1.6', textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
                  Your home is professionally maintained and monitored year-round by Scottsdale's trusted handyman experts.
                </p>
              </div>

              <div style={{
                padding: '35px',
                background: 'rgba(255,255,255,0.15)',
                borderRadius: '16px',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '20px' }}>⚡</div>
                <h3 style={{ fontSize: '1.7rem', marginBottom: '20px', fontWeight: '700', textShadow: '1px 1px 4px rgba(0,0,0,0.3)' }}>Priority VIP Service</h3>
                <p style={{ fontSize: '1.1rem', opacity: '0.95', lineHeight: '1.6', textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
                  Skip the wait with priority scheduling and emergency response when you need repairs most.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call-to-Action Section */}
        <div style={{
          background: `linear-gradient(rgba(255, 215, 0, 0.95), rgba(255, 165, 0, 0.95)), url('https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80') center/cover`,
          padding: '70px 50px',
          borderRadius: '20px',
          textAlign: 'center',
          color: '#1a1a1a',
          position: 'relative',
          overflow: 'hidden',
          marginBottom: '60px'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.9) 0%, rgba(255, 165, 0, 0.85) 100%)',
            borderRadius: '20px'
          }}></div>

          <div style={{ position: 'relative', zIndex: 2 }}>
            <h2 style={{
              fontSize: '2.8rem',
              marginBottom: '25px',
              fontWeight: '800',
              color: '#1a1a1a',
              textShadow: '2px 2px 8px rgba(255,255,255,0.3)'
            }}>
              🏠 Ready to Protect Your Investment?
            </h2>
            <p style={{
              fontSize: '1.3rem',
              marginBottom: '40px',
              maxWidth: '800px',
              margin: '0 auto 40px',
              lineHeight: '1.6',
              fontWeight: '600',
              color: '#1a1a1a'
            }}>
              Join hundreds of satisfied Scottsdale homeowners who trust us with their property maintenance.
              Get started today and protect your home's value!
            </p>

            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => setCurrentPage('contact')}
                style={{
                  background: 'linear-gradient(135deg, #28a745 0%, #34ce57 100%)',
                  color: 'white',
                  padding: '18px 35px',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '1.2rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  boxShadow: '0 8px 25px rgba(40, 167, 69, 0.4)',
                  minWidth: '200px'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-3px)';
                  e.target.style.boxShadow = '0 12px 35px rgba(40, 167, 69, 0.5)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 8px 25px rgba(40, 167, 69, 0.4)';
                }}
              >
                📞 Get Free Consultation
              </button>

              <button
                onClick={() => setCurrentPage('services')}
                style={{
                  background: 'rgba(255,255,255,0.95)',
                  color: '#1a1a1a',
                  padding: '18px 35px',
                  border: '3px solid #28a745',
                  borderRadius: '12px',
                  fontSize: '1.2rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                  minWidth: '200px'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-3px)';
                  e.target.style.boxShadow = '0 12px 35px rgba(0,0,0,0.2)';
                  e.target.style.background = 'white';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                  e.target.style.background = 'rgba(255,255,255,0.95)';
                }}
              >
                🔧 View All Services
              </button>
            </div>

            <div style={{ marginTop: '30px', color: '#1a1a1a' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '10px' }}>
                🌟 Trusted by 500+ Scottsdale Homeowners
              </div>
              <div style={{ fontSize: '1rem', opacity: '0.8' }}>
                ⭐⭐⭐⭐⭐ 4.9/5 Rating | 🏆 Licensed & Insured | 📞 24/7 Emergency Service
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const HomeImprovementsPage = () => (
    <div style={{ minHeight: 'calc(100vh - 120px)', background: '#f8f9fa', paddingTop: '120px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #f39c12 0%, #e74c3c 100%)',
          padding: '60px 40px',
          borderRadius: '12px',
          color: 'white',
          textAlign: 'center',
          marginBottom: '40px'
        }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '20px', fontWeight: '700' }}>Home Improvements</h1>
          <p style={{ fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto', opacity: '0.9' }}>
            Transform your space with our comprehensive home improvement services. From kitchen upgrades to complete renovations, we bring your vision to life.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px', marginBottom: '60px' }}>
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ color: '#f39c12', marginBottom: '20px', fontSize: '1.5rem' }}>Kitchen & Bath</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ padding: '8px 0', color: '#666', borderBottom: '1px solid #eee' }}>✓ Cabinet refacing & installation</li>
              <li style={{ padding: '8px 0', color: '#666', borderBottom: '1px solid #eee' }}>✓ Countertop replacement</li>
              <li style={{ padding: '8px 0', color: '#666', borderBottom: '1px solid #eee' }}>✓ Tile & backsplash installation</li>
              <li style={{ padding: '8px 0', color: '#666', borderBottom: '1px solid #eee' }}>✓ Vanity & mirror installation</li>
              <li style={{ padding: '8px 0', color: '#666' }}>✓ Complete bathroom remodels</li>
            </ul>
          </div>

          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ color: '#f39c12', marginBottom: '20px', fontSize: '1.5rem' }}>Flooring & Paint</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ padding: '8px 0', color: '#666', borderBottom: '1px solid #eee' }}>✓ Hardwood installation & refinishing</li>
              <li style={{ padding: '8px 0', color: '#666', borderBottom: '1px solid #eee' }}>✓ Tile & vinyl plank flooring</li>
              <li style={{ padding: '8px 0', color: '#666', borderBottom: '1px solid #eee' }}>✓ Interior & exterior painting</li>
              <li style={{ padding: '8px 0', color: '#666', borderBottom: '1px solid #eee' }}>✓ Texture & drywall work</li>
              <li style={{ padding: '8px 0', color: '#666' }}>✓ Crown molding & trim</li>
            </ul>
          </div>

          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ color: '#f39c12', marginBottom: '20px', fontSize: '1.5rem' }}>Outdoor Living</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ padding: '8px 0', color: '#666', borderBottom: '1px solid #eee' }}>✓ Deck & patio construction</li>
              <li style={{ padding: '8px 0', color: '#666', borderBottom: '1px solid #eee' }}>✓ Pergola & shade structures</li>
              <li style={{ padding: '8px 0', color: '#666', borderBottom: '1px solid #eee' }}>✓ Outdoor kitchens</li>
              <li style={{ padding: '8px 0', color: '#666', borderBottom: '1px solid #eee' }}>✓ Fire pit installation</li>
              <li style={{ padding: '8px 0', color: '#666' }}>✓ Landscape lighting</li>
            </ul>
          </div>
        </div>

        <div style={{
          background: 'white',
          padding: '40px',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          marginBottom: '40px'
        }}>
          <h3 style={{ color: '#f39c12', marginBottom: '30px', fontSize: '2rem', textAlign: 'center' }}>Our Improvement Process</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '30px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '60px',
                height: '60px',
                background: '#f39c12',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 15px',
                color: 'white',
                fontSize: '1.5rem',
                fontWeight: 'bold'
              }}>1</div>
              <h4 style={{ color: '#e74c3c', marginBottom: '10px' }}>Consultation</h4>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>Free in-home consultation to discuss your vision and needs</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '60px',
                height: '60px',
                background: '#f39c12',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 15px',
                color: 'white',
                fontSize: '1.5rem',
                fontWeight: 'bold'
              }}>2</div>
              <h4 style={{ color: '#e74c3c', marginBottom: '10px' }}>Design & Quote</h4>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>Detailed proposal with 3D renderings and transparent pricing</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '60px',
                height: '60px',
                background: '#f39c12',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 15px',
                color: 'white',
                fontSize: '1.5rem',
                fontWeight: 'bold'
              }}>3</div>
              <h4 style={{ color: '#e74c3c', marginBottom: '10px' }}>Material Selection</h4>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>Help choosing the perfect materials within your budget</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '60px',
                height: '60px',
                background: '#f39c12',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 15px',
                color: 'white',
                fontSize: '1.5rem',
                fontWeight: 'bold'
              }}>4</div>
              <h4 style={{ color: '#e74c3c', marginBottom: '10px' }}>Construction</h4>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>Professional installation with minimal disruption to your home</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '60px',
                height: '60px',
                background: '#f39c12',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 15px',
                color: 'white',
                fontSize: '1.5rem',
                fontWeight: 'bold'
              }}>5</div>
              <h4 style={{ color: '#e74c3c', marginBottom: '10px' }}>Final Walkthrough</h4>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>Quality inspection and cleanup before project completion</p>
            </div>
          </div>
        </div>

        {/* Home Improvement Service Packages */}
        <div style={{ marginBottom: '40px' }}>
          <h3 style={{ color: '#f39c12', marginBottom: '30px', fontSize: '2rem', textAlign: 'center' }}>Home Improvement Packages</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px',
            marginBottom: '40px'
          }}>
            {servicePackages['home-improvements'].packages.map((pkg, index) => (
              <div key={pkg.id} style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                padding: '25px',
                borderRadius: '16px',
                boxShadow: '0 8px 32px rgba(243, 156, 18, 0.2)',
                border: '2px solid #f39c12',
                textAlign: 'center'
              }}>
                <h4 style={{ color: '#f39c12', fontSize: '1.4rem', marginBottom: '10px' }}>{pkg.name}</h4>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: '#f39c12', marginBottom: '15px' }}>
                  ${pkg.price.toLocaleString()}
                </div>
                <p style={{ color: '#666', marginBottom: '20px', fontSize: '0.9rem' }}>
                  {pkg.description}
                </p>
                <ul style={{ listStyle: 'none', padding: 0, marginBottom: '20px', textAlign: 'left' }}>
                  {pkg.features.map((feature, featureIndex) => (
                    <li key={featureIndex} style={{ color: '#666', padding: '5px 0', fontSize: '0.9rem' }}>
                      ✓ {feature}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => {
                    setSelectedService(pkg);
                    setCurrentPage('checkout');
                  }}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #f39c12 0%, #e74c3c 100%)',
                    color: 'white',
                    padding: '12px 20px',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'transform 0.3s'
                  }}
                  onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                  onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  Get Custom Quote
                </button>
              </div>
            ))}
          </div>
        </div>

        <div style={{
          background: 'white',
          padding: '40px',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#f39c12', marginBottom: '20px', fontSize: '2rem' }}>Ready to Transform Your Home?</h3>
          <p style={{ color: '#666', fontSize: '1.1rem', marginBottom: '30px', maxWidth: '600px', margin: '0 auto 30px' }}>
            Let's discuss your home improvement project and create a space you'll love for years to come.
          </p>
          <button
            onClick={() => {
              setCurrentPage('home');
              setTimeout(() => {
                const contactSection = document.getElementById('contact');
                if (contactSection) {
                  contactSection.scrollIntoView({ behavior: 'smooth' });
                }
              }, 100);
            }}
            style={{
              background: 'linear-gradient(135deg, #f39c12 0%, #e74c3c 100%)',
              color: 'white',
              padding: '15px 30px',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Start Your Project Today
          </button>
        </div>
      </div>
    </div>
  )

  const EmergencyServicesPage = () => (
    <div style={{ minHeight: 'calc(100vh - 120px)', background: '#f8f9fa', paddingTop: '120px', paddingBottom: '80px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        <div style={{
          background: 'white',
          padding: '60px 40px',
          borderRadius: '16px',
          color: '#333',
          textAlign: 'center',
          marginBottom: '40px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
          border: '3px solid #FFD700'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
            padding: '30px',
            borderRadius: '12px',
            color: 'white',
            marginBottom: '30px'
          }}>
            <h1 style={{ fontSize: '3rem', marginBottom: '20px', fontWeight: '700' }}>🚨 Emergency Services</h1>
            <p style={{ fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto', opacity: '0.95' }}>
              24/7 emergency handyman services when you need us most. Fast response times for urgent repairs that can't wait.
            </p>
          </div>
          <div style={{
            background: '#FFD700',
            color: '#1a1a1a',
            padding: '25px',
            borderRadius: '12px',
            display: 'inline-block',
            boxShadow: '0 8px 25px rgba(255, 215, 0, 0.4)',
            border: '2px solid #e6c200'
          }}>
            <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '800' }}>📞 Call Now: (480) 255-5887</h2>
            <p style={{ margin: '5px 0 0 0', opacity: '0.8', fontWeight: '600' }}>⏱️ Average Response Time: 30 minutes</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px', marginBottom: '60px' }}>
          <div style={{
            background: 'white',
            padding: '35px',
            borderRadius: '16px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            border: '3px solid #FFD700',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
              color: 'white',
              padding: '15px',
              borderRadius: '12px',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700' }}>🔧 Plumbing Emergencies</h3>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ padding: '12px 0', color: '#333', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center' }}>
                <span style={{ color: '#dc3545', marginRight: '10px', fontSize: '1.2rem' }}>🚨</span>
                <span style={{ fontWeight: '500' }}>Burst pipes & flooding</span>
              </li>
              <li style={{ padding: '12px 0', color: '#333', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center' }}>
                <span style={{ color: '#dc3545', marginRight: '10px', fontSize: '1.2rem' }}>🚨</span>
                <span style={{ fontWeight: '500' }}>Severe leaks & water damage</span>
              </li>
              <li style={{ padding: '12px 0', color: '#333', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center' }}>
                <span style={{ color: '#dc3545', marginRight: '10px', fontSize: '1.2rem' }}>🚨</span>
                <span style={{ fontWeight: '500' }}>Sewer line backups</span>
              </li>
              <li style={{ padding: '12px 0', color: '#333', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center' }}>
                <span style={{ color: '#dc3545', marginRight: '10px', fontSize: '1.2rem' }}>🚨</span>
                <span style={{ fontWeight: '500' }}>No hot water issues</span>
              </li>
              <li style={{ padding: '12px 0', color: '#333', display: 'flex', alignItems: 'center' }}>
                <span style={{ color: '#dc3545', marginRight: '10px', fontSize: '1.2rem' }}>🚨</span>
                <span style={{ fontWeight: '500' }}>Toilet & drain blockages</span>
              </li>
            </ul>
          </div>

          <div style={{
            background: 'white',
            padding: '35px',
            borderRadius: '16px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            border: '3px solid #FFD700',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
              color: 'white',
              padding: '15px',
              borderRadius: '12px',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700' }}>⚡ Electrical Emergencies</h3>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ padding: '12px 0', color: '#333', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center' }}>
                <span style={{ color: '#dc3545', marginRight: '10px', fontSize: '1.2rem' }}>⚡</span>
                <span style={{ fontWeight: '500' }}>Power outages & failures</span>
              </li>
              <li style={{ padding: '12px 0', color: '#333', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center' }}>
                <span style={{ color: '#dc3545', marginRight: '10px', fontSize: '1.2rem' }}>⚡</span>
                <span style={{ fontWeight: '500' }}>Sparking outlets & switches</span>
              </li>
              <li style={{ padding: '12px 0', color: '#333', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center' }}>
                <span style={{ color: '#dc3545', marginRight: '10px', fontSize: '1.2rem' }}>⚡</span>
                <span style={{ fontWeight: '500' }}>Circuit breaker issues</span>
              </li>
              <li style={{ padding: '12px 0', color: '#333', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center' }}>
                <span style={{ color: '#dc3545', marginRight: '10px', fontSize: '1.2rem' }}>⚡</span>
                <span style={{ fontWeight: '500' }}>Electrical burning smells</span>
              </li>
              <li style={{ padding: '12px 0', color: '#333', display: 'flex', alignItems: 'center' }}>
                <span style={{ color: '#dc3545', marginRight: '10px', fontSize: '1.2rem' }}>⚡</span>
                <span style={{ fontWeight: '500' }}>Flickering lights & surges</span>
              </li>
            </ul>
          </div>

          <div style={{
            background: 'white',
            padding: '35px',
            borderRadius: '16px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            border: '3px solid #FFD700',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
              color: 'white',
              padding: '15px',
              borderRadius: '12px',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700' }}>🔒 Security & Access</h3>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ padding: '12px 0', color: '#333', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center' }}>
                <span style={{ color: '#dc3545', marginRight: '10px', fontSize: '1.2rem' }}>🔒</span>
                <span style={{ fontWeight: '500' }}>Lockouts & broken locks</span>
              </li>
              <li style={{ padding: '12px 0', color: '#333', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center' }}>
                <span style={{ color: '#dc3545', marginRight: '10px', fontSize: '1.2rem' }}>🔒</span>
                <span style={{ fontWeight: '500' }}>Door & window security</span>
              </li>
              <li style={{ padding: '12px 0', color: '#333', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center' }}>
                <span style={{ color: '#dc3545', marginRight: '10px', fontSize: '1.2rem' }}>🔒</span>
                <span style={{ fontWeight: '500' }}>Garage door malfunctions</span>
              </li>
              <li style={{ padding: '12px 0', color: '#333', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center' }}>
                <span style={{ color: '#dc3545', marginRight: '10px', fontSize: '1.2rem' }}>🔒</span>
                <span style={{ fontWeight: '500' }}>Sliding door issues</span>
              </li>
              <li style={{ padding: '12px 0', color: '#333', display: 'flex', alignItems: 'center' }}>
                <span style={{ color: '#dc3545', marginRight: '10px', fontSize: '1.2rem' }}>🔒</span>
                <span style={{ fontWeight: '500' }}>Emergency boarding up</span>
              </li>
            </ul>
          </div>
        </div>

        <div style={{
          background: 'white',
          padding: '50px 40px',
          borderRadius: '16px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
          marginBottom: '50px',
          border: '3px solid #FFD700'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
            color: 'white',
            padding: '20px',
            borderRadius: '12px',
            textAlign: 'center',
            marginBottom: '40px'
          }}>
            <h3 style={{ margin: 0, fontSize: '2rem', fontWeight: '700' }}>⚡ Emergency Response Protocol</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '35px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '90px',
                height: '90px',
                background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                color: 'white',
                fontSize: '2.2rem',
                boxShadow: '0 8px 25px rgba(220, 53, 69, 0.3)'
              }}>📞</div>
              <h4 style={{ color: '#333', marginBottom: '15px', fontSize: '1.2rem', fontWeight: '700' }}>Call Immediately</h4>
              <p style={{ color: '#666', fontSize: '1rem', lineHeight: '1.5' }}>
                <strong>(480) 255-5887</strong><br />
                Our emergency line is always staffed
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '90px',
                height: '90px',
                background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                color: 'white',
                fontSize: '2.2rem',
                boxShadow: '0 8px 25px rgba(220, 53, 69, 0.3)'
              }}>🚗</div>
              <h4 style={{ color: '#333', marginBottom: '15px', fontSize: '1.2rem', fontWeight: '700' }}>Rapid Dispatch</h4>
              <p style={{ color: '#666', fontSize: '1rem', lineHeight: '1.5' }}>
                Technician dispatched within <strong>15 minutes</strong> of your call
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '90px',
                height: '90px',
                background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                color: 'white',
                fontSize: '2.2rem',
                boxShadow: '0 8px 25px rgba(220, 53, 69, 0.3)'
              }}>🔧</div>
              <h4 style={{ color: '#333', marginBottom: '15px', fontSize: '1.2rem', fontWeight: '700' }}>On-Site Assessment</h4>
              <p style={{ color: '#666', fontSize: '1rem', lineHeight: '1.5' }}>
                Quick diagnosis and immediate temporary solutions
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '90px',
                height: '90px',
                background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                color: 'white',
                fontSize: '2.2rem',
                boxShadow: '0 8px 25px rgba(220, 53, 69, 0.3)'
              }}>✅</div>
              <h4 style={{ color: '#333', marginBottom: '15px', fontSize: '1.2rem', fontWeight: '700' }}>Emergency Repair</h4>
              <p style={{ color: '#666', fontSize: '1rem', lineHeight: '1.5' }}>
                Permanent repair or safe temporary fix until morning
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '50px' }}>
          <div style={{
            background: 'white',
            padding: '40px',
            borderRadius: '16px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            border: '3px solid #FFD700'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
              color: 'white',
              padding: '15px',
              borderRadius: '12px',
              textAlign: 'center',
              marginBottom: '25px'
            }}>
              <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700' }}>💰 Emergency Rates</h3>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{
                padding: '15px 0',
                color: '#333',
                borderBottom: '1px solid #f0f0f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontWeight: '500' }}>🌅 Weekday Evenings (6PM-10PM)</span>
                <strong style={{ color: '#dc3545', fontSize: '1.1rem' }}>$150/hour</strong>
              </li>
              <li style={{
                padding: '15px 0',
                color: '#333',
                borderBottom: '1px solid #f0f0f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontWeight: '500' }}>🗓️ Weekends (All Day)</span>
                <strong style={{ color: '#dc3545', fontSize: '1.1rem' }}>$175/hour</strong>
              </li>
              <li style={{
                padding: '15px 0',
                color: '#333',
                borderBottom: '1px solid #f0f0f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontWeight: '500' }}>🌙 Overnight (10PM-6AM)</span>
                <strong style={{ color: '#dc3545', fontSize: '1.1rem' }}>$200/hour</strong>
              </li>
              <li style={{
                padding: '15px 0',
                color: '#333',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontWeight: '500' }}>🎉 Holiday Emergency</span>
                <strong style={{ color: '#dc3545', fontSize: '1.1rem' }}>$225/hour</strong>
              </li>
            </ul>
          </div>

          <div style={{
            background: 'white',
            padding: '40px',
            borderRadius: '16px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            border: '3px solid #FFD700'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
              color: 'white',
              padding: '15px',
              borderRadius: '12px',
              textAlign: 'center',
              marginBottom: '25px'
            }}>
              <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700' }}>🛠️ What We Bring</h3>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ padding: '15px 0', color: '#333', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center' }}>
                <span style={{ color: '#dc3545', marginRight: '12px', fontSize: '1.3rem' }}>🧰</span>
                <span style={{ fontWeight: '500' }}>Fully stocked emergency truck</span>
              </li>
              <li style={{ padding: '15px 0', color: '#333', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center' }}>
                <span style={{ color: '#dc3545', marginRight: '12px', fontSize: '1.3rem' }}>🔦</span>
                <span style={{ fontWeight: '500' }}>Professional diagnostic tools</span>
              </li>
              <li style={{ padding: '15px 0', color: '#333', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center' }}>
                <span style={{ color: '#dc3545', marginRight: '12px', fontSize: '1.3rem' }}>🛡️</span>
                <span style={{ fontWeight: '500' }}>Safety equipment & protocols</span>
              </li>
              <li style={{ padding: '15px 0', color: '#333', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center' }}>
                <span style={{ color: '#dc3545', marginRight: '12px', fontSize: '1.3rem' }}>📋</span>
                <span style={{ fontWeight: '500' }}>Detailed damage assessment</span>
              </li>
              <li style={{ padding: '15px 0', color: '#333', display: 'flex', alignItems: 'center' }}>
                <span style={{ color: '#dc3545', marginRight: '12px', fontSize: '1.3rem' }}>📞</span>
                <span style={{ fontWeight: '500' }}>Insurance coordination assistance</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Emergency Service Packages */}
        <div style={{ marginBottom: '50px' }}>
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '16px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            border: '3px solid #FFD700',
            marginBottom: '40px'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
              color: 'white',
              padding: '20px',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <h3 style={{ margin: 0, fontSize: '2rem', fontWeight: '700' }}>🚨 Emergency Service Packages</h3>
            </div>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '30px'
          }}>
            {servicePackages['emergency'].packages.map((pkg, index) => (
              <div key={pkg.id} style={{
                background: 'white',
                padding: '35px',
                borderRadius: '16px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                border: '3px solid #FFD700',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
                  color: 'white',
                  padding: '15px',
                  borderRadius: '12px',
                  marginBottom: '20px'
                }}>
                  <h4 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '700' }}>{pkg.name}</h4>
                </div>
                <div style={{
                  fontSize: '2.5rem',
                  fontWeight: '800',
                  color: '#dc3545',
                  marginBottom: '20px',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
                }}>
                  ${pkg.price}
                </div>
                <p style={{
                  color: '#666',
                  marginBottom: '25px',
                  fontSize: '1rem',
                  lineHeight: '1.5',
                  fontWeight: '500'
                }}>
                  {pkg.description}
                </p>
                <div style={{
                  background: '#f8f9fa',
                  padding: '20px',
                  borderRadius: '12px',
                  marginBottom: '25px',
                  border: '2px solid #e9ecef'
                }}>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, textAlign: 'left' }}>
                    {pkg.features.map((feature, featureIndex) => (
                      <li key={featureIndex} style={{
                        color: '#333',
                        padding: '8px 0',
                        fontSize: '0.95rem',
                        display: 'flex',
                        alignItems: 'center'
                      }}>
                        <span style={{ color: '#28a745', marginRight: '10px', fontWeight: 'bold' }}>✓</span>
                        <span style={{ fontWeight: '500' }}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  onClick={() => {
                    setSelectedService(pkg);
                    setCurrentPage('checkout');
                  }}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
                    color: 'white',
                    padding: '15px 25px',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '1.1rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    boxShadow: '0 6px 20px rgba(220, 53, 69, 0.3)'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 25px rgba(220, 53, 69, 0.4)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 6px 20px rgba(220, 53, 69, 0.3)';
                  }}
                >
                  🚨 Book Emergency Service
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Response Showcase */}
        <div style={{
          background: `linear-gradient(rgba(220, 53, 69, 0.95), rgba(200, 35, 51, 0.95)), url('https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80') center/cover`,
          padding: '80px 50px',
          borderRadius: '20px',
          color: 'white',
          textAlign: 'center',
          marginBottom: '60px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(220, 53, 69, 0.9) 0%, rgba(200, 35, 51, 0.85) 100%)',
            borderRadius: '20px'
          }}></div>

          <div style={{ position: 'relative', zIndex: 2 }}>
            <h2 style={{
              fontSize: '2.8rem',
              marginBottom: '40px',
              fontWeight: '800',
              textShadow: '2px 2px 8px rgba(0,0,0,0.5)'
            }}>
              🚨 Fast Emergency Response Team
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', maxWidth: '1000px', margin: '0 auto' }}>
              <div style={{
                padding: '35px',
                background: 'rgba(255,255,255,0.15)',
                borderRadius: '16px',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '12px',
                  background: `url('https://images.unsplash.com/photo-1609347346074-bc93e9b02ac1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80') center/cover`,
                  margin: '0 auto 20px',
                  border: '3px solid rgba(255, 215, 0, 0.8)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.3)'
                }}></div>
                <h3 style={{ fontSize: '1.7rem', marginBottom: '15px', fontWeight: '700', textShadow: '1px 1px 4px rgba(0,0,0,0.3)' }}>⏱️ 30-Minute Response</h3>
                <p style={{ fontSize: '1.1rem', opacity: '0.95', lineHeight: '1.6', textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
                  Our emergency team is equipped and ready to respond to your call within 30 minutes, day or night.
                </p>
              </div>

              <div style={{
                padding: '35px',
                background: 'rgba(255,255,255,0.15)',
                borderRadius: '16px',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '12px',
                  background: `url('https://images.unsplash.com/photo-1536431311719-398b6704d4cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80') center/cover`,
                  margin: '0 auto 20px',
                  border: '3px solid rgba(255, 215, 0, 0.8)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.3)'
                }}></div>
                <h3 style={{ fontSize: '1.7rem', marginBottom: '15px', fontWeight: '700', textShadow: '1px 1px 4px rgba(0,0,0,0.3)' }}>🛠️ Fully Equipped</h3>
                <p style={{ fontSize: '1.1rem', opacity: '0.95', lineHeight: '1.6', textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
                  Professional tools, safety equipment, and emergency supplies ready for any situation that arises.
                </p>
              </div>

              <div style={{
                padding: '35px',
                background: 'rgba(255,255,255,0.15)',
                borderRadius: '16px',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '12px',
                  background: `url('https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80') center/cover`,
                  margin: '0 auto 20px',
                  border: '3px solid rgba(255, 215, 0, 0.8)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.3)'
                }}></div>
                <h3 style={{ fontSize: '1.7rem', marginBottom: '15px', fontWeight: '700', textShadow: '1px 1px 4px rgba(0,0,0,0.3)' }}>🏆 Licensed Experts</h3>
                <p style={{ fontSize: '1.1rem', opacity: '0.95', lineHeight: '1.6', textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
                  ROC licensed and insured professionals with years of experience handling emergency situations.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div style={{
          background: 'white',
          padding: '50px 40px',
          borderRadius: '16px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
          border: '3px solid #FFD700',
          textAlign: 'center',
          marginBottom: '80px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
            padding: '40px',
            borderRadius: '16px',
            color: 'white',
            marginBottom: '30px'
          }}>
            <h3 style={{ marginBottom: '20px', fontSize: '2.5rem', fontWeight: '800' }}>🚨 Don't Wait - Call Now!</h3>
            <p style={{ fontSize: '1.2rem', marginBottom: '0', opacity: '0.95', lineHeight: '1.6' }}>
              Emergency situations require immediate attention. Our certified technicians are standing by 24/7 to help you resolve any urgent issues quickly and safely.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
            <a
              href="tel:4802555887"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
                color: 'white',
                padding: '20px 40px',
                borderRadius: '12px',
                textDecoration: 'none',
                fontSize: '1.4rem',
                fontWeight: '800',
                boxShadow: '0 8px 25px rgba(220, 53, 69, 0.4)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-3px)';
                e.target.style.boxShadow = '0 12px 35px rgba(220, 53, 69, 0.5)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 8px 25px rgba(220, 53, 69, 0.4)';
              }}
            >
              📞 (480) 255-5887
            </a>
            <button
              onClick={() => {
                setCurrentPage('home');
                setTimeout(() => {
                  const contactSection = document.getElementById('contact');
                  if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }, 100);
              }}
              style={{
                background: 'white',
                color: '#dc3545',
                padding: '18px 35px',
                border: '3px solid #dc3545',
                borderRadius: '12px',
                fontSize: '1.1rem',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 6px 20px rgba(220, 53, 69, 0.2)'
              }}
              onMouseOver={(e) => {
                e.target.style.background = '#dc3545';
                e.target.style.color = 'white';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(220, 53, 69, 0.3)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'white';
                e.target.style.color = '#dc3545';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 6px 20px rgba(220, 53, 69, 0.2)';
              }}
            >
              💬 Online Contact Form
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const SmartHomeSolutionsPage = () => (
    <div style={{ minHeight: 'calc(100vh - 120px)', background: '#f8f9fa', paddingTop: '120px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        {/* Hero Section with Background Image */}
        <div style={{
          background: `linear-gradient(rgba(111, 66, 193, 0.85), rgba(0, 123, 255, 0.85)), url('https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80') center/cover`,
          padding: '80px 40px',
          borderRadius: '16px',
          color: 'white',
          textAlign: 'center',
          marginBottom: '60px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Overlay for better text readability */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(111, 66, 193, 0.8) 0%, rgba(0, 123, 255, 0.8) 100%)',
            borderRadius: '16px'
          }}></div>

          <div style={{ position: 'relative', zIndex: 2 }}>
            <h1 style={{
              fontSize: '3.5rem',
              marginBottom: '24px',
              fontWeight: '700',
              color: 'white',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
            }}>
              Smart Home Solutions
            </h1>
            <p style={{
              fontSize: '1.3rem',
              maxWidth: '800px',
              margin: '0 auto',
              color: 'white',
              lineHeight: '1.6',
              textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
            }}>
              Transform your Scottsdale home into an intelligent living space with cutting-edge smart technology.
              Professional installation and setup of home automation systems that enhance comfort, security, and efficiency.
            </p>

            {/* Hero Action Buttons */}
            <div style={{
              display: 'flex',
              gap: '20px',
              justifyContent: 'center',
              marginTop: '40px',
              flexWrap: 'wrap'
            }}>
              <button style={{
                background: 'rgba(255, 255, 255, 0.95)',
                color: '#6f42c1',
                padding: '16px 32px',
                border: 'none',
                borderRadius: '50px',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
              }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
                }}>
                Get Free Consultation
              </button>
              <button style={{
                background: 'transparent',
                color: 'white',
                padding: '16px 32px',
                border: '2px solid white',
                borderRadius: '50px',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.transform = 'translateY(0)';
                }}>
                View Packages
              </button>
            </div>
          </div>
        </div>

        {/* Service Categories with Images */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '40px', marginBottom: '80px' }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            overflow: 'hidden',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease'
          }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.1)';
            }}>
            <div style={{
              height: '200px',
              background: 'linear-gradient(135deg, #6f42c1, #8b5cf6), url("https://images.unsplash.com/photo-1556075798-4825dfaaf498?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80") center/cover',
              backgroundBlendMode: 'overlay',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {/* Fallback icon if image doesn't load */}
              <div style={{
                fontSize: '3rem',
                color: 'rgba(255,255,255,0.3)',
                position: 'absolute',
                zIndex: 1
              }}>🔒</div>
              <div style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                background: 'rgba(111, 66, 193, 0.95)',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '0.9rem',
                fontWeight: '600',
                zIndex: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
              }}>
                Security & Monitoring
              </div>
            </div>
            <div style={{ padding: '32px' }}>
              <h3 style={{ color: '#6f42c1', marginBottom: '20px', fontSize: '1.6rem', fontWeight: '700' }}>
                Security & Monitoring
              </h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ padding: '12px 0', color: '#555', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '1.2rem' }}>📹</span> Smart security cameras with night vision
                </li>
                <li style={{ padding: '12px 0', color: '#555', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '1.2rem' }}>🔔</span> Video doorbells with two-way audio
                </li>
                <li style={{ padding: '12px 0', color: '#555', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '1.2rem' }}>🚨</span> Motion sensors & smart alarms
                </li>
                <li style={{ padding: '12px 0', color: '#555', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '1.2rem' }}>🔐</span> Smart locks & access control
                </li>
                <li style={{ padding: '12px 0', color: '#555', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '1.2rem' }}>📱</span> Mobile app integration & alerts
                </li>
              </ul>
            </div>
          </div>

          <div style={{
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            overflow: 'hidden',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease'
          }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.1)';
            }}>
            <div style={{
              height: '200px',
              background: 'linear-gradient(135deg, #007bff, #0056b3), url("https://images.unsplash.com/photo-1621905251918-48416bd8575a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80") center/cover',
              backgroundBlendMode: 'overlay',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                background: 'rgba(0, 123, 255, 0.95)',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '0.9rem',
                fontWeight: '600',
                zIndex: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
              }}>
                Climate Control
              </div>
            </div>
            <div style={{ padding: '32px' }}>
              <h3 style={{ color: '#007bff', marginBottom: '20px', fontSize: '1.6rem', fontWeight: '700' }}>
                Climate Control
              </h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ padding: '12px 0', color: '#555', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '1.2rem' }}>🌡️</span> Smart thermostats with scheduling
                </li>
                <li style={{ padding: '12px 0', color: '#555', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '1.2rem' }}>❄️</span> Zoned HVAC control systems
                </li>
                <li style={{ padding: '12px 0', color: '#555', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '1.2rem' }}>💨</span> Smart ceiling fans with voice control
                </li>
                <li style={{ padding: '12px 0', color: '#555', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '1.2rem' }}>🏠</span> Whole-home automation integration
                </li>
                <li style={{ padding: '12px 0', color: '#555', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '1.2rem' }}>⚡</span> Energy monitoring & optimization
                </li>
              </ul>
            </div>
          </div>

          <div style={{
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            overflow: 'hidden',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease'
          }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.1)';
            }}>
            <div style={{
              height: '200px',
              background: 'linear-gradient(135deg, #10b981, #059669), url("https://images.unsplash.com/photo-1540932239986-30128078f3c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80") center/cover',
              backgroundBlendMode: 'overlay',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {/* Fallback icon if image doesn't load */}
              <div style={{
                fontSize: '3rem',
                color: 'rgba(255,255,255,0.3)',
                position: 'absolute',
                zIndex: 1
              }}>💡</div>
              <div style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                background: 'rgba(16, 185, 129, 0.95)',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '0.9rem',
                fontWeight: '600',
                zIndex: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
              }}>
                Lighting & Entertainment
              </div>
            </div>
            <div style={{ padding: '32px' }}>
              <h3 style={{ color: '#10b981', marginBottom: '20px', fontSize: '1.6rem', fontWeight: '700' }}>
                Lighting & Entertainment
              </h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ padding: '12px 0', color: '#555', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '1.2rem' }}>💡</span> Smart LED lighting with color control
                </li>
                <li style={{ padding: '12px 0', color: '#555', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '1.2rem' }}>🏡</span> Automated shades & smart blinds
                </li>
                <li style={{ padding: '12px 0', color: '#555', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '1.2rem' }}>🔊</span> Multi-room audio systems
                </li>
                <li style={{ padding: '12px 0', color: '#555', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '1.2rem' }}>📺</span> Home theater setup & installation
                </li>
                <li style={{ padding: '12px 0', color: '#555', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '1.2rem' }}>🗣️</span> Voice assistant integration (Alexa, Google)
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div style={{
          background: 'white',
          padding: '40px',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          marginBottom: '40px'
        }}>
          <h3 style={{ color: '#6f42c1', marginBottom: '30px', fontSize: '2rem', textAlign: 'center' }}>Popular Smart Home Packages</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>

            <div style={{
              border: '2px solid #e9ecef',
              borderRadius: '12px',
              padding: '30px',
              textAlign: 'center'
            }}>
              <h4 style={{ color: '#6f42c1', fontSize: '1.5rem', marginBottom: '10px' }}>Starter Package</h4>
              <div style={{ color: '#007bff', fontSize: '2rem', fontWeight: '700', marginBottom: '20px' }}>
                $1,299
              </div>
              <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left' }}>
                <li style={{ padding: '8px 0', color: '#666', borderBottom: '1px solid #eee' }}>✓ Smart thermostat installation</li>
                <li style={{ padding: '8px 0', color: '#666', borderBottom: '1px solid #eee' }}>✓ Smart doorbell with camera</li>
                <li style={{ padding: '8px 0', color: '#666', borderBottom: '1px solid #eee' }}>✓ 4 smart light switches</li>
                <li style={{ padding: '8px 0', color: '#666', borderBottom: '1px solid #eee' }}>✓ Smart door lock</li>
                <li style={{ padding: '8px 0', color: '#666' }}>✓ Basic setup & training</li>
              </ul>
              <button
                onClick={() => {
                  setSelectedService(servicePackages['smart-home'].packages.find(pkg => pkg.id === 'smart-starter'));
                  setCurrentPage('checkout');
                }}
                style={{
                  width: '100%',
                  marginTop: '20px',
                  background: '#6f42c1',
                  color: 'white',
                  padding: '12px',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 4px 12px rgba(111, 66, 193, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}>
                Choose Starter
              </button>
            </div>

            <div style={{
              border: '2px solid #007bff',
              borderRadius: '12px',
              padding: '30px',
              textAlign: 'center',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                top: '-10px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: '#007bff',
                color: 'white',
                padding: '5px 15px',
                borderRadius: '15px',
                fontSize: '0.8rem',
                fontWeight: '600'
              }}>
                MOST POPULAR
              </div>
              <h4 style={{ color: '#6f42c1', fontSize: '1.5rem', marginBottom: '10px' }}>Complete Package</h4>
              <div style={{ color: '#007bff', fontSize: '2rem', fontWeight: '700', marginBottom: '20px' }}>
                $2,799
              </div>
              <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left' }}>
                <li style={{ padding: '8px 0', color: '#666', borderBottom: '1px solid #eee' }}>✓ Everything in Starter Package</li>
                <li style={{ padding: '8px 0', color: '#666', borderBottom: '1px solid #eee' }}>✓ 4 security cameras (indoor/outdoor)</li>
                <li style={{ padding: '8px 0', color: '#666', borderBottom: '1px solid #eee' }}>✓ Motion sensors & alarms</li>
                <li style={{ padding: '8px 0', color: '#666', borderBottom: '1px solid #eee' }}>✓ Smart ceiling fans (2)</li>
                <li style={{ padding: '8px 0', color: '#666', borderBottom: '1px solid #eee' }}>✓ Automated blinds (living areas)</li>
                <li style={{ padding: '8px 0', color: '#666' }}>✓ Full integration & training</li>
              </ul>
              <button
                onClick={() => {
                  setSelectedService(servicePackages['smart-home'].packages.find(pkg => pkg.id === 'smart-complete'));
                  setCurrentPage('checkout');
                }}
                style={{
                  width: '100%',
                  marginTop: '20px',
                  background: '#007bff',
                  color: 'white',
                  padding: '12px',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 4px 12px rgba(0, 123, 255, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}>
                Choose Complete
              </button>
            </div>

            <div style={{
              border: '2px solid #e9ecef',
              borderRadius: '12px',
              padding: '30px',
              textAlign: 'center'
            }}>
              <h4 style={{ color: '#6f42c1', fontSize: '1.5rem', marginBottom: '10px' }}>Premium Package</h4>
              <div style={{ color: '#007bff', fontSize: '2rem', fontWeight: '700', marginBottom: '20px' }}>
                $4,999
              </div>
              <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left' }}>
                <li style={{ padding: '8px 0', color: '#666', borderBottom: '1px solid #eee' }}>✓ Everything in Complete Package</li>
                <li style={{ padding: '8px 0', color: '#666', borderBottom: '1px solid #eee' }}>✓ Whole-home audio system</li>
                <li style={{ padding: '8px 0', color: '#666', borderBottom: '1px solid #eee' }}>✓ Home theater setup</li>
                <li style={{ padding: '8px 0', color: '#666', borderBottom: '1px solid #eee' }}>✓ Smart irrigation system</li>
                <li style={{ padding: '8px 0', color: '#666', borderBottom: '1px solid #eee' }}>✓ Energy monitoring dashboard</li>
                <li style={{ padding: '8px 0', color: '#666' }}>✓ 1-year maintenance included</li>
              </ul>
              <button
                onClick={() => {
                  setSelectedService(servicePackages['smart-home'].packages.find(pkg => pkg.id === 'smart-premium'));
                  setCurrentPage('checkout');
                }}
                style={{
                  width: '100%',
                  marginTop: '20px',
                  background: '#6f42c1',
                  color: 'white',
                  padding: '12px',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 4px 12px rgba(111, 66, 193, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}>
                Choose Premium
              </button>
            </div>
          </div>
        </div>

        {/* Smart Home Benefits with Background */}
        <div style={{
          background: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('https://images.unsplash.com/photo-1560472355-536de3962603?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80') center/cover`,
          padding: '80px 40px',
          borderRadius: '16px',
          marginBottom: '60px',
          color: 'white'
        }}>
          <h3 style={{
            color: 'white',
            marginBottom: '50px',
            fontSize: '2.5rem',
            textAlign: 'center',
            fontWeight: '700',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
          }}>
            Why Choose Smart Home Technology?
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '100px',
                height: '100px',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                color: 'white',
                fontSize: '2.5rem',
                boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)'
              }}>💰</div>
              <h4 style={{ color: 'white', marginBottom: '15px', fontSize: '1.4rem', fontWeight: '600' }}>Energy Savings</h4>
              <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1rem', lineHeight: '1.6' }}>
                Reduce utility bills by 20-30% with intelligent automation that optimizes energy usage based on your daily routines
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '100px',
                height: '100px',
                background: 'linear-gradient(135deg, #6f42c1, #553c9a)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                color: 'white',
                fontSize: '2.5rem',
                boxShadow: '0 8px 24px rgba(111, 66, 193, 0.3)'
              }}>🏠</div>
              <h4 style={{ color: 'white', marginBottom: '15px', fontSize: '1.4rem', fontWeight: '600' }}>Home Value</h4>
              <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1rem', lineHeight: '1.6' }}>
                Increase property value by 10-15% with modern smart home features that today's buyers demand
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '100px',
                height: '100px',
                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                color: 'white',
                fontSize: '2.5rem',
                boxShadow: '0 8px 24px rgba(239, 68, 68, 0.3)'
              }}>🔒</div>
              <h4 style={{ color: 'white', marginBottom: '15px', fontSize: '1.4rem', fontWeight: '600' }}>Enhanced Security</h4>
              <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1rem', lineHeight: '1.6' }}>
                24/7 monitoring with instant alerts and remote access for complete peace of mind while you're away
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '100px',
                height: '100px',
                background: 'linear-gradient(135deg, #007bff, #0056b3)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                color: 'white',
                fontSize: '2.5rem',
                boxShadow: '0 8px 24px rgba(0, 123, 255, 0.3)'
              }}>📱</div>
              <h4 style={{ color: 'white', marginBottom: '15px', fontSize: '1.4rem', fontWeight: '600' }}>Remote Control</h4>
              <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1rem', lineHeight: '1.6' }}>
                Control your entire home from anywhere in the world with intuitive mobile apps and voice commands
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action Section */}
        <div style={{
          background: `linear-gradient(rgba(111, 66, 193, 0.95), rgba(0, 123, 255, 0.95)), url('https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80') center/cover`,
          padding: '80px 40px',
          borderRadius: '16px',
          color: 'white',
          textAlign: 'center',
          marginBottom: '40px'
        }}>
          <h3 style={{
            marginBottom: '24px',
            fontSize: '2.5rem',
            fontWeight: '700',
            color: 'white',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}>
            Ready to Transform Your Home?
          </h3>
          <p style={{
            fontSize: '1.2rem',
            marginBottom: '40px',
            color: 'white',
            maxWidth: '600px',
            margin: '0 auto 40px auto',
            lineHeight: '1.6',
            textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
          }}>
            Schedule a free consultation to design the perfect smart home system for your Scottsdale lifestyle and budget.
            Our experts will assess your home and create a custom automation plan.
          </p>
          <div style={{
            display: 'flex',
            gap: '20px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={() => {
                setCurrentPage('home');
                setTimeout(() => {
                  const contactSection = document.getElementById('contact');
                  if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }, 100);
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                color: '#6f42c1',
                padding: '18px 36px',
                border: 'none',
                borderRadius: '50px',
                fontSize: '1.1rem',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 6px 20px rgba(0,0,0,0.2)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-3px)';
                e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.2)';
              }}
            >
              Schedule Free Consultation
            </button>
            <button
              onClick={() => window.location.href = 'tel:+14802555887'}
              style={{
                background: 'transparent',
                color: 'white',
                padding: '18px 36px',
                border: '2px solid white',
                borderRadius: '50px',
                fontSize: '1.1rem',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                e.target.style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              Call (480) 255-5887
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  // Universal Checkout Page Component - handles all service types
  const UniversalCheckoutPage = ({ selectedService, currentPage, setCurrentPage }) => {
    const [formData, setFormData] = useState({
      customerName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      zipCode: '',
      preferredDate: '',
      preferredTime: '',
      urgency: 'routine',
      specialRequests: '',
      contactPreference: 'phone',
      agreedToTerms: false
    })

    const [errors, setErrors] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleInputChange = (e) => {
      const { name, value, type, checked } = e.target
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }))

      // Clear error when user starts typing
      if (errors[name]) {
        setErrors(prev => ({
          ...prev,
          [name]: ''
        }))
      }
    }

    const validateForm = () => {
      const newErrors = {}

      if (!formData.customerName.trim()) newErrors.customerName = 'Name is required'
      if (!formData.email.trim()) newErrors.email = 'Email is required'
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format'
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
      if (!formData.address.trim()) newErrors.address = 'Address is required'
      if (!formData.city.trim()) newErrors.city = 'City is required'
      if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required'
      if (!formData.preferredDate) newErrors.preferredDate = 'Preferred date is required'
      if (!formData.agreedToTerms) newErrors.agreedToTerms = 'You must agree to terms and conditions'

      setErrors(newErrors)
      return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
      e.preventDefault()

      if (!validateForm()) return

      setIsSubmitting(true)

      try {
        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 2000))

        // Show success page
        setSubmittedFormData({
          ...formData,
          selectedService,
          serviceCategory: selectedService.category,
          packageName: selectedService.name,
          packagePrice: selectedService.price,
          isRecurring: selectedService.recurring || false,
          submissionDate: new Date().toLocaleDateString()
        })
        setShowSuccessPage(true)
        setCurrentPage('home')

      } catch (error) {
        console.error('Submission error:', error)
      } finally {
        setIsSubmitting(false)
      }
    }

    if (!selectedService) {
      return (
        <div style={{ minHeight: 'calc(100vh - 120px)', paddingTop: '120px', textAlign: 'center' }}>
          <h2>No service selected</h2>
          <button onClick={() => setCurrentPage('services')}>Browse Services</button>
        </div>
      )
    }

    return (
      <div style={{ minHeight: 'calc(100vh - 120px)', paddingTop: '120px', background: '#f8f9fa' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <button
              onClick={() => setCurrentPage('services')}
              style={{
                background: 'none',
                border: '2px solid #007bff',
                color: '#007bff',
                padding: '10px 20px',
                borderRadius: '8px',
                cursor: 'pointer',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                margin: '0 auto 20px'
              }}
            >
              <ArrowLeft size={16} />
              Back to Services
            </button>
            <h1 style={{ fontSize: '2.5rem', color: '#333', marginBottom: '10px' }}>Service Checkout</h1>
            <p style={{ color: '#666', fontSize: '1.1rem' }}>Complete your service booking</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '40px', alignItems: 'start' }}>
            {/* Order Form */}
            <div style={{ background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
              <h2 style={{ marginBottom: '20px', color: '#333' }}>Service Details & Contact Information</h2>

              <form onSubmit={handleSubmit}>
                {/* Customer Information */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: errors.customerName ? '2px solid #dc3545' : '2px solid #e9ecef',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                      placeholder="Enter your full name"
                    />
                    {errors.customerName && <span style={{ color: '#dc3545', fontSize: '0.875rem' }}>{errors.customerName}</span>}
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      onInput={handlePhoneInput}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: errors.phone ? '2px solid #dc3545' : '2px solid #e9ecef',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                      placeholder="(555) 123-4567"
                    />
                    {errors.phone && <span style={{ color: '#dc3545', fontSize: '0.875rem' }}>{errors.phone}</span>}
                  </div>
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: errors.email ? '2px solid #dc3545' : '2px solid #e9ecef',
                      borderRadius: '8px',
                      fontSize: '1rem'
                    }}
                    placeholder="your.email@example.com"
                  />
                  {errors.email && <span style={{ color: '#dc3545', fontSize: '0.875rem' }}>{errors.email}</span>}
                </div>

                {/* Address Information */}
                <div style={{ marginBottom: '25px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
                    Service Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: errors.address ? '2px solid #dc3545' : '2px solid #e9ecef',
                      borderRadius: '8px',
                      fontSize: '1rem'
                    }}
                    placeholder="123 Main Street"
                  />
                  {errors.address && <span style={{ color: '#dc3545', fontSize: '0.875rem' }}>{errors.address}</span>}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: '20px', marginBottom: '25px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: errors.city ? '2px solid #dc3545' : '2px solid #e9ecef',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                      placeholder="Scottsdale"
                    />
                    {errors.city && <span style={{ color: '#dc3545', fontSize: '0.875rem' }}>{errors.city}</span>}
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: errors.zipCode ? '2px solid #dc3545' : '2px solid #e9ecef',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                      placeholder="85251"
                    />
                    {errors.zipCode && <span style={{ color: '#dc3545', fontSize: '0.875rem' }}>{errors.zipCode}</span>}
                  </div>
                </div>

                {/* Scheduling */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
                      Preferred Date *
                    </label>
                    <input
                      type="date"
                      name="preferredDate"
                      value={formData.preferredDate}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: errors.preferredDate ? '2px solid #dc3545' : '2px solid #e9ecef',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                    />
                    {errors.preferredDate && <span style={{ color: '#dc3545', fontSize: '0.875rem' }}>{errors.preferredDate}</span>}
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
                      Preferred Time
                    </label>
                    <select
                      name="preferredTime"
                      value={formData.preferredTime}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #e9ecef',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                    >
                      <option value="">Any time</option>
                      <option value="morning">Morning (8AM - 12PM)</option>
                      <option value="afternoon">Afternoon (12PM - 5PM)</option>
                      <option value="evening">Evening (5PM - 8PM)</option>
                    </select>
                  </div>
                </div>

                {/* Service Preferences */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
                      Service Urgency
                    </label>
                    <select
                      name="urgency"
                      value={formData.urgency}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #e9ecef',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                    >
                      <option value="routine">Routine</option>
                      <option value="important">Important</option>
                      <option value="urgent">Urgent</option>
                      <option value="emergency">Emergency</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
                      Contact Preference
                    </label>
                    <select
                      name="contactPreference"
                      value={formData.contactPreference}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #e9ecef',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                    >
                      <option value="phone">Phone Call</option>
                      <option value="text">Text Message</option>
                      <option value="email">Email</option>
                    </select>
                  </div>
                </div>

                {/* Special Requests */}
                <div style={{ marginBottom: '25px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
                    Special Requests or Notes
                  </label>
                  <textarea
                    name="specialRequests"
                    value={formData.specialRequests}
                    onChange={handleInputChange}
                    rows={4}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e9ecef',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontFamily: 'inherit',
                      resize: 'vertical'
                    }}
                    placeholder="Any specific requirements or additional information..."
                  />
                </div>

                {/* Terms Agreement */}
                <div style={{ marginBottom: '30px' }}>
                  <label style={{ display: 'flex', alignItems: 'start', gap: '10px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      name="agreedToTerms"
                      checked={formData.agreedToTerms}
                      onChange={handleInputChange}
                      style={{ marginTop: '4px' }}
                    />
                    <span style={{ color: errors.agreedToTerms ? '#dc3545' : '#333', fontSize: '0.9rem' }}>
                      I agree to the <a href="#" style={{ color: '#007bff' }}>terms and conditions</a> and
                      authorize Scottsdale Handyman Solutions to contact me regarding this service request.
                    </span>
                  </label>
                  {errors.agreedToTerms && <span style={{ color: '#dc3545', fontSize: '0.875rem' }}>{errors.agreedToTerms}</span>}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    width: '100%',
                    background: isSubmitting ? '#6c757d' : '#007bff',
                    color: 'white',
                    padding: '15px',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    transition: 'background-color 0.3s ease'
                  }}
                >
                  {isSubmitting ? 'Processing...' : 'Book Service'}
                </button>
              </form>
            </div>

            {/* Order Summary */}
            <div style={{ background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', position: 'sticky', top: '140px' }}>
              <h3 style={{ marginBottom: '20px', color: '#333' }}>Service Summary</h3>

              <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #eee' }}>
                <h4 style={{ color: '#007bff', marginBottom: '5px' }}>{selectedService.category}</h4>
                <h5 style={{ margin: '0 0 10px 0', fontSize: '1.2rem' }}>{selectedService.name}</h5>
                <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '15px' }}>{selectedService.description}</p>

                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#28a745' }}>
                  ${selectedService.price.toLocaleString()}
                  {selectedService.recurring && <span style={{ fontSize: '1rem', fontWeight: '400' }}>/month</span>}
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ marginBottom: '10px', color: '#333', fontSize: '1rem' }}>What's Included:</h4>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {selectedService.features.map((feature, index) => (
                    <li key={index} style={{ padding: '5px 0', color: '#666', fontSize: '0.9rem', display: 'flex', alignItems: 'start' }}>
                      <CheckCircle size={16} style={{ color: '#28a745', marginRight: '8px', marginTop: '2px', flexShrink: 0 }} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ padding: '15px', background: '#f8f9fa', borderRadius: '8px', textAlign: 'center' }}>
                <p style={{ margin: '0 0 10px 0', color: '#666', fontSize: '0.9rem' }}>
                  � Secure booking process
                </p>
                <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>
                  📞 Questions? Call{' '}
                  <a href="tel:+14802555887" style={{ color: '#007bff', textDecoration: 'none' }}>
                    (480) 255-5887
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Success Page Component with enhanced branding
  const SuccessPage = () => (
    <div style={{
      minHeight: 'calc(100vh - 120px)',
      background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '3rem 2rem',
        maxWidth: '600px',
        width: '100%',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        border: '1px solid #e5e7eb'
      }}>
        {/* Success Icon */}
        <div style={{
          width: '80px',
          height: '80px',
          background: '#22c55e',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 2rem auto',
          boxShadow: '0 8px 20px rgba(34, 197, 94, 0.3)'
        }}>
          <Check size={32} color="white" strokeWidth={3} />
        </div>

        <h1 style={{
          color: '#1f2937',
          fontSize: '2.5rem',
          marginBottom: '1rem',
          fontWeight: '800'
        }}>
          Request Submitted!
        </h1>

        <p style={{
          color: '#6b7280',
          fontSize: '1.2rem',
          marginBottom: '2rem',
          lineHeight: '1.6'
        }}>
          Thank you for choosing Scottsdale Handyman Solutions! We'll contact you within 2 hours.
        </p>

        {/* What's Next Section */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.02)',
          borderRadius: '12px',
          padding: '2rem',
          marginBottom: '2rem',
          textAlign: 'left'
        }}>
          <h3 style={{
            color: '#1f2937',
            fontSize: '1.3rem',
            fontWeight: '700',
            marginBottom: '1.5rem',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}>
            <Clock size={20} color="#2563eb" />
            What Happens Next?
          </h3>

          <div style={{
            display: 'grid',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{
                width: '28px',
                height: '28px',
                backgroundColor: '#2563eb',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.9rem',
                fontWeight: '700',
                color: 'white',
                flexShrink: 0,
                marginTop: '2px'
              }}>1</div>
              <div>
                <p style={{ color: '#1f2937', fontWeight: '600', marginBottom: '0.25rem', fontSize: '1rem' }}>
                  Review Your Request
                </p>
                <p style={{ color: '#6b7280', fontSize: '0.95rem', lineHeight: '1.5' }}>
                  Our team reviews your project details and requirements.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{
                width: '28px',
                height: '28px',
                backgroundColor: '#2563eb',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.9rem',
                fontWeight: '700',
                color: 'white',
                flexShrink: 0,
                marginTop: '2px'
              }}>2</div>
              <div>
                <p style={{ color: '#1f2937', fontWeight: '600', marginBottom: '0.25rem', fontSize: '1rem' }}>
                  Quick Response Call
                </p>
                <p style={{ color: '#6b7280', fontSize: '0.95rem', lineHeight: '1.5' }}>
                  We'll call you within 2 hours to discuss your project.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{
                width: '28px',
                height: '28px',
                backgroundColor: '#2563eb',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.9rem',
                fontWeight: '700',
                color: 'white',
                flexShrink: 0,
                marginTop: '2px'
              }}>3</div>
              <div>
                <p style={{ color: '#1f2937', fontWeight: '600', marginBottom: '0.25rem', fontSize: '1rem' }}>
                  Free Estimate & Schedule
                </p>
                <p style={{ color: '#6b7280', fontSize: '0.95rem', lineHeight: '1.5' }}>
                  Get your detailed quote and schedule service.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: '1.5rem'
        }}>
          <button
            onClick={() => { setShowSuccessPage(false); setCurrentPage('home'); }}
            style={{
              padding: '1rem 2rem',
              background: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.background = '#1d4ed8';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.background = '#2563eb';
            }}
          >
            <Home size={18} />
            Return Home
          </button>

          <a
            href="tel:4802555887"
            style={{
              padding: '1rem 2rem',
              background: 'white',
              color: '#2563eb',
              border: '2px solid #2563eb',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              textDecoration: 'none'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#f8fafc';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'white';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            <Phone size={18} />
            Call Now
          </a>
        </div>

        {/* Emergency Contact */}
        <div style={{
          paddingTop: '1.5rem',
          borderTop: '1px solid #e5e7eb',
          fontSize: '0.95rem'
        }}>
          <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>
            Need immediate assistance?
          </p>
          <p style={{ color: '#dc2626', fontWeight: '700', fontSize: '1rem' }}>
            Emergency: (480) 255-5887
          </p>
        </div>
      </div>
    </div>
  )

  // Main render
  return (
    <div className="App">
      {/* Admin Login Modal */}
      {showAdminLogin && !isAdminLoggedIn && (
        <AdminLogin onLogin={handleAdminLogin} />
      )}

      {/* Admin Panel */}
      {isAdminLoggedIn ? (
        <AdminPanel onLogout={handleAdminLogout} />
      ) : (
        <>
          <Navigation />

          {showSuccessPage ? (
            <SuccessPage />
          ) : (
            <>
              {currentPage === 'home' && <HomePage />}
              {currentPage === 'about' && <AboutPage />}
              {currentPage === 'services' && <ServicesPage />}
              {currentPage === 'blog' && <BlogPage />}
              {currentPage === 'work-with-us' && <WorkWithUsPage />}
              {currentPage === 'pay' && <PaymentPage />}
              {currentPage === 'home-repairs' && <HomeRepairsPage />}
              {currentPage === 'maintenance-plans' && <MaintenancePlansPage />}
              {currentPage === 'home-improvements' && <HomeImprovementsPage />}
              {currentPage === 'emergency-services' && <EmergencyServicesPage />}
              {currentPage === 'smart-home-solutions' && <SmartHomeSolutionsPage />}
              {currentPage === 'admin' && <AdminPanel />}
              {currentPage === 'checkout' && (
                <UniversalCheckoutPage
                  selectedService={selectedService}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                />
              )}
            </>
          )}

        </>
      )}

      {!showSuccessPage && <Footer />}

      {/* Emergency Popup */}
      <EmergencyPopup />

      {/* Smart Lead Form Modal */}
      <SmartLeadForm />

      {/* Chatbot Widget */}
      <ChatbotWidget
        chatOpen={chatOpen}
        setChatOpen={setChatOpen}
        chatMessages={chatMessages}
        setChatMessages={setChatMessages}
        chatInput={chatInput}
        setChatInput={setChatInput}
        chatTyping={chatTyping}
        setChatTyping={setChatTyping}
        chatContext={chatContext}
        setChatContext={setChatContext}
        handleChatSubmit={handleChatSubmit}
        generateChatResponse={generateChatResponse}
        openLeadForm={openLeadForm}
        logChatConversation={logChatConversation}
        handleQuickReply={handleQuickReply}
      />
    </div>
  );
};

export default App;

