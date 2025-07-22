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

// Add CSS animations
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

  /* Responsive Navigation */
  @media (min-width: 768px) {
    .nav-desktop {
      display: flex !important;
    }
    .menu-btn {
      display: none !important;
    }
  }

  @media (max-width: 767px) {
    .nav-desktop {
      display: none !important;
    }
    .menu-btn {
      display: flex !important;
    }
  }
`

// Inject styles into document head
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style')
  styleSheet.textContent = styles
  document.head.appendChild(styleSheet)
}

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState('home')
  const [selectedBlogPost, setSelectedBlogPost] = useState(null)

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

  // Simple form state
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

  // Blog posts data
  const [blogPosts] = useState([
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
    }
  ])

  // Project gallery data
  const [projectGallery] = useState([
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
    }
  ])

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
      const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'
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
  const openLeadForm = (formType) => {
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
    window.location.href = 'tel:+14802555887'
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

  // ... The rest will be the extracted customer website components and functions ...

  // This would continue with all the customer website components (Navigation, HomePage, etc.)
  // I'll provide the key sections to get you started:

  // Navigation component
  const Navigation = () => (
    <header className="header" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      zIndex: 1000,
      transition: 'all 0.3s ease'
    }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        <div className="header-content" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '80px'
        }}>
          <a
            href="#"
            className="logo"
            onClick={(e) => {
              e.preventDefault();
              setCurrentPage('home');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              textDecoration: 'none',
              color: '#1a365e',
              fontWeight: 'bold',
              transition: 'all 0.3s ease',
              transform: 'scale(1)',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.02)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
            }}
          >
            <div style={{ 
              position: 'relative',
              transition: 'all 0.3s ease',
              flexShrink: 0
            }}>
              <img 
                src="/favicon.svg" 
                alt="Scottsdale Handyman Solutions" 
                style={{ 
                  width: '48px', 
                  height: '48px',
                  filter: 'drop-shadow(0 2px 6px rgba(26, 54, 94, 0.15))',
                  transition: 'all 0.3s ease'
                }}
                onError={(e) => {
                  // Fallback to enhanced gradient background with wrench icon if image fails to load
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div style={{
                width: '48px',
                height: '48px',
                background: 'linear-gradient(135deg, #1a365e 0%, #2c5282 50%, #3182ce 100%)',
                borderRadius: '12px',
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFD700',
                position: 'absolute',
                top: 0,
                left: 0,
                boxShadow: '0 4px 16px rgba(26, 54, 94, 0.25), inset 0 1px 0 rgba(255,255,255,0.1)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                transition: 'all 0.3s ease'
              }}>
                <Wrench size={24} style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} />
              </div>
            </div>
            <div style={{ 
              display: 'flex',
              flexDirection: 'column',
              gap: '1px',
              minWidth: 0
            }}>
              <div style={{ 
                fontSize: '1.25rem', 
                fontWeight: '800', 
                color: '#1a365e',
                background: 'linear-gradient(135deg, #1a365e, #2c5282)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 1px 3px rgba(26, 54, 94, 0.1)',
                letterSpacing: '-0.01em',
                lineHeight: '1.1',
                whiteSpace: 'nowrap'
              }}>
                Scottsdale Handyman
              </div>
              <div style={{ 
                fontSize: '0.7rem', 
                color: '#64748b',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                opacity: 0.9
              }}>
                <Shield size={9} style={{ color: '#10b981', flexShrink: 0 }} />
                Licensed & Insured
              </div>
            </div>
          </a>

          <nav style={{ display: 'none', gap: '2rem', alignItems: 'center' }} className="nav-desktop">
            <a href="#" style={{ color: '#64748b', textDecoration: 'none', fontWeight: '500' }} onClick={(e) => { e.preventDefault(); setCurrentPage('home'); }}>Home</a>
            <a href="#" style={{ color: '#64748b', textDecoration: 'none', fontWeight: '500' }} onClick={(e) => { e.preventDefault(); setCurrentPage('about'); }}>About</a>
            <a href="#" style={{ color: '#64748b', textDecoration: 'none', fontWeight: '500' }} onClick={(e) => { e.preventDefault(); setCurrentPage('services'); }}>Services</a>
            <a href="#" style={{ color: '#64748b', textDecoration: 'none', fontWeight: '500' }} onClick={(e) => { e.preventDefault(); setCurrentPage('blog'); }}>Blog</a>
            <a href="#" style={{ color: '#64748b', textDecoration: 'none', fontWeight: '500' }} onClick={(e) => { e.preventDefault(); setCurrentPage('work-with-us'); }}>Work With Us</a>
            <a href="#" style={{ color: '#64748b', textDecoration: 'none', fontWeight: '500' }} onClick={(e) => { e.preventDefault(); setCurrentPage('pay'); }}>Pay Invoice</a>
            
            {/* Pro Portal Link */}
            <a
              href={import.meta.env.VITE_PRO_PORTAL_URL || "https://scottsdale-handyman-pro-portal.onrender.com"}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#4f46e5',
                textDecoration: 'none',
                fontWeight: '600',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                border: '1px solid rgba(79, 70, 229, 0.2)',
                background: 'rgba(79, 70, 229, 0.05)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(79, 70, 229, 0.1)';
                e.target.style.borderColor = 'rgba(79, 70, 229, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(79, 70, 229, 0.05)';
                e.target.style.borderColor = 'rgba(79, 70, 229, 0.2)';
              }}
            >
              <Lock size={16} />
              Pro Portal
            </a>

            <button onClick={() => openLeadForm('emergency')} style={{
              background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '0.5rem 1rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <Phone size={16} />
              Emergency
            </button>
          </nav>

          <button
            className="menu-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{
              display: 'flex',
              background: 'none',
              border: 'none',
              color: '#64748b',
              cursor: 'pointer',
              padding: '0.5rem'
            }}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Enhanced Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div 
          style={{
            position: 'fixed',
            top: '80px',
            left: 0,
            right: 0,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.98) 100%)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 10px 40px rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.1)',
            zIndex: 999,
            padding: '1.5rem 0',
            borderBottom: '1px solid rgba(226,232,240,0.5)',
            animation: 'slideInRight 0.3s ease-out'
          }}
          onClick={() => setIsMenuOpen(false)}
        >
          <nav style={{ display: 'flex', flexDirection: 'column' }}>
            {/* Main Navigation Links */}
            <div style={{ marginBottom: '1rem' }}>
              <a 
                href="#" 
                style={{ 
                  color: '#1a365e', 
                  textDecoration: 'none', 
                  fontWeight: '600', 
                  padding: '1rem 2rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  borderLeft: '4px solid transparent',
                  transition: 'all 0.3s ease',
                  fontSize: '1.1rem'
                }} 
                onClick={(e) => { 
                  e.preventDefault(); 
                  setCurrentPage('home'); 
                  setIsMenuOpen(false);
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderLeftColor = '#4f46e5';
                  e.target.style.background = 'rgba(79, 70, 229, 0.05)';
                  e.target.style.color = '#4f46e5';
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderLeftColor = 'transparent';
                  e.target.style.background = 'transparent';
                  e.target.style.color = '#1a365e';
                }}
              >
                <Home size={20} />
                Home
              </a>
              <a 
                href="#" 
                style={{ 
                  color: '#1a365e', 
                  textDecoration: 'none', 
                  fontWeight: '600', 
                  padding: '1rem 2rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  borderLeft: '4px solid transparent',
                  transition: 'all 0.3s ease',
                  fontSize: '1.1rem'
                }} 
                onClick={(e) => { 
                  e.preventDefault(); 
                  setCurrentPage('about'); 
                  setIsMenuOpen(false);
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderLeftColor = '#4f46e5';
                  e.target.style.background = 'rgba(79, 70, 229, 0.05)';
                  e.target.style.color = '#4f46e5';
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderLeftColor = 'transparent';
                  e.target.style.background = 'transparent';
                  e.target.style.color = '#1a365e';
                }}
              >
                <Building size={20} />
                About
              </a>
              <a 
                href="#" 
                style={{ 
                  color: '#1a365e', 
                  textDecoration: 'none', 
                  fontWeight: '600', 
                  padding: '1rem 2rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  borderLeft: '4px solid transparent',
                  transition: 'all 0.3s ease',
                  fontSize: '1.1rem'
                }} 
                onClick={(e) => { 
                  e.preventDefault(); 
                  setCurrentPage('services'); 
                  setIsMenuOpen(false);
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderLeftColor = '#4f46e5';
                  e.target.style.background = 'rgba(79, 70, 229, 0.05)';
                  e.target.style.color = '#4f46e5';
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderLeftColor = 'transparent';
                  e.target.style.background = 'transparent';
                  e.target.style.color = '#1a365e';
                }}
              >
                <Wrench size={20} />
                Services
              </a>
              <a 
                href="#" 
                style={{ 
                  color: '#1a365e', 
                  textDecoration: 'none', 
                  fontWeight: '600', 
                  padding: '1rem 2rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  borderLeft: '4px solid transparent',
                  transition: 'all 0.3s ease',
                  fontSize: '1.1rem'
                }} 
                onClick={(e) => { 
                  e.preventDefault(); 
                  setCurrentPage('blog'); 
                  setIsMenuOpen(false);
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderLeftColor = '#4f46e5';
                  e.target.style.background = 'rgba(79, 70, 229, 0.05)';
                  e.target.style.color = '#4f46e5';
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderLeftColor = 'transparent';
                  e.target.style.background = 'transparent';
                  e.target.style.color = '#1a365e';
                }}
              >
                <BookOpen size={20} />
                Blog
              </a>
              <a 
                href="#" 
                style={{ 
                  color: '#1a365e', 
                  textDecoration: 'none', 
                  fontWeight: '600', 
                  padding: '1rem 2rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  borderLeft: '4px solid transparent',
                  transition: 'all 0.3s ease',
                  fontSize: '1.1rem'
                }} 
                onClick={(e) => { 
                  e.preventDefault(); 
                  setCurrentPage('work-with-us'); 
                  setIsMenuOpen(false);
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderLeftColor = '#4f46e5';
                  e.target.style.background = 'rgba(79, 70, 229, 0.05)';
                  e.target.style.color = '#4f46e5';
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderLeftColor = 'transparent';
                  e.target.style.background = 'transparent';
                  e.target.style.color = '#1a365e';
                }}
              >
                <Briefcase size={20} />
                Work With Us
              </a>
              <a 
                href="#" 
                style={{ 
                  color: '#1a365e', 
                  textDecoration: 'none', 
                  fontWeight: '600', 
                  padding: '1rem 2rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  borderLeft: '4px solid transparent',
                  transition: 'all 0.3s ease',
                  fontSize: '1.1rem'
                }} 
                onClick={(e) => { 
                  e.preventDefault(); 
                  setCurrentPage('pay'); 
                  setIsMenuOpen(false);
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderLeftColor = '#4f46e5';
                  e.target.style.background = 'rgba(79, 70, 229, 0.05)';
                  e.target.style.color = '#4f46e5';
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderLeftColor = 'transparent';
                  e.target.style.background = 'transparent';
                  e.target.style.color = '#1a365e';
                }}
              >
                <CreditCard size={20} />
                Pay Invoice
              </a>
            </div>

            {/* Separator */}
            <div style={{ 
              height: '1px', 
              background: 'linear-gradient(90deg, transparent, rgba(148,163,184,0.3), transparent)', 
              margin: '0.5rem 2rem' 
            }} />

            {/* Professional Login/Signup Section */}
            <div style={{ 
              padding: '1rem 2rem', 
              background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.03) 0%, rgba(124, 58, 237, 0.03) 100%)',
              margin: '0.5rem 1rem',
              borderRadius: '12px',
              border: '1px solid rgba(79, 70, 229, 0.1)'
            }}>
              <div style={{ 
                fontSize: '0.9rem', 
                color: '#64748b', 
                marginBottom: '1rem',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                For Professionals
              </div>
              
              <a
                href={import.meta.env.VITE_PRO_PORTAL_URL || "https://scottsdale-handyman-pro-portal.onrender.com"}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: '#4f46e5', 
                  textDecoration: 'none', 
                  fontWeight: '600', 
                  padding: '0.75rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  borderRadius: '8px',
                  background: 'rgba(79, 70, 229, 0.1)',
                  border: '2px solid rgba(79, 70, 229, 0.2)',
                  transition: 'all 0.3s ease',
                  marginBottom: '0.75rem',
                  fontSize: '1rem'
                }}
                onClick={() => setIsMenuOpen(false)}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(79, 70, 229, 0.15)';
                  e.target.style.borderColor = 'rgba(79, 70, 229, 0.4)';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 4px 15px rgba(79, 70, 229, 0.25)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(79, 70, 229, 0.1)';
                  e.target.style.borderColor = 'rgba(79, 70, 229, 0.2)';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <Lock size={18} />
                Pro Portal Login
                <ExternalLink size={16} style={{ marginLeft: 'auto' }} />
              </a>

              <div style={{ 
                fontSize: '0.85rem', 
                color: '#64748b', 
                textAlign: 'center',
                lineHeight: '1.4'
              }}>
                Access leads, manage projects, track earnings
              </div>
            </div>

            {/* Emergency CTA */}
            <div style={{ padding: '1rem 2rem' }}>
              <button 
                onClick={() => {
                  openLeadForm('emergency');
                  setIsMenuOpen(false);
                }} 
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '1rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  fontSize: '1.1rem',
                  boxShadow: '0 4px 15px rgba(220, 38, 38, 0.3)',
                  transition: 'all 0.3s ease',
                  animation: 'pulse 2s infinite'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(220, 38, 38, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 15px rgba(220, 38, 38, 0.3)';
                }}
              >
                <AlertTriangle size={20} />
                Emergency Service
                <Phone size={18} />
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )

  // Render main app
  return (
    <div className="App">
      <Navigation />
      
      <main style={{ paddingTop: '80px' }}>
        {currentPage === 'home' && (
          <div>
            {/* Hero Section */}
            <section style={{
              minHeight: '80vh',
              background: 'linear-gradient(135deg, rgba(26, 54, 93, 0.8), rgba(30, 60, 114, 0.8)), url("https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600&h=900&fit=crop") center/cover',
              display: 'flex',
              alignItems: 'center',
              color: 'white',
              textAlign: 'center',
              padding: '4rem 2rem'
            }}>
              <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <h1 style={{ fontSize: '3.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                  Scottsdale's Most Trusted Handyman Solutions
                </h1>
                <p style={{ fontSize: '1.3rem', marginBottom: '2rem', opacity: 0.9 }}>
                  Local Experts • Quality Service • Innovative Solutions
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button 
                    onClick={() => openLeadForm('quote')}
                    style={{
                      background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                      color: '#000',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '1rem 2rem',
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    Get Free Quote
                  </button>
                  <button 
                    onClick={() => openLeadForm('emergency')}
                    style={{
                      background: 'rgba(220, 53, 69, 0.9)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '1rem 2rem',
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <Phone size={20} />
                    24/7 Emergency Service
                  </button>
                </div>
              </div>
            </section>

            {/* Services Preview */}
            <section style={{ padding: '4rem 2rem' }}>
              <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <h2 style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '2rem', color: '#1a365e' }}>
                  Complete Handyman Services
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '3rem' }}>
                  <div style={{ padding: '2rem', background: 'white', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                    <Wrench size={48} style={{ color: '#FFD700', marginBottom: '1rem' }} />
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#1a365e' }}>Home Repairs</h3>
                    <p style={{ color: '#64748b', lineHeight: '1.6' }}>
                      Quick fixes and emergency repairs to keep your home safe and functional.
                    </p>
                  </div>
                  <div style={{ padding: '2rem', background: 'white', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                    <Calendar size={48} style={{ color: '#FFD700', marginBottom: '1rem' }} />
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#1a365e' }}>Maintenance Plans</h3>
                    <p style={{ color: '#64748b', lineHeight: '1.6' }}>
                      Regular upkeep to prevent costly problems and keep your home in peak condition.
                    </p>
                  </div>
                  <div style={{ padding: '2rem', background: 'white', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                    <Smartphone size={48} style={{ color: '#FFD700', marginBottom: '1rem' }} />
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#1a365e' }}>Smart Home</h3>
                    <p style={{ color: '#64748b', lineHeight: '1.6' }}>
                      Modern automation solutions to make your home more efficient and convenient.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {currentPage === 'services' && (
          <section style={{ padding: '4rem 2rem', minHeight: '80vh' }}>
            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
              <h1 style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '2rem', color: '#1a365e' }}>
                Our Services
              </h1>
              <p style={{ fontSize: '1.2rem', textAlign: 'center', color: '#64748b', marginBottom: '3rem' }}>
                Professional handyman services for all your home improvement needs
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                {Object.entries(servicePackages).map(([key, service]) => (
                  <div key={key} style={{ 
                    background: 'white', 
                    borderRadius: '12px', 
                    padding: '2rem', 
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    transition: 'transform 0.3s ease'
                  }}>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#1a365e' }}>
                      {service.category}
                    </h3>
                    <p style={{ color: '#64748b', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                      {service.packages[0].description}
                    </p>
                    <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#FFD700', marginBottom: '1rem' }}>
                      Starting at ${service.packages[0].price}
                    </div>
                    <button
                      onClick={() => openLeadForm('quote')}
                      style={{
                        background: 'linear-gradient(135deg, #1a365e, #2c5282)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '0.75rem 1.5rem',
                        cursor: 'pointer',
                        width: '100%',
                        fontWeight: '600'
                      }}
                    >
                      Get Quote
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {currentPage === 'about' && (
          <section style={{ padding: '4rem 2rem', minHeight: '80vh' }}>
            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
              <h1 style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '2rem', color: '#1a365e' }}>
                About Scottsdale Handyman Solutions
              </h1>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center', marginBottom: '4rem' }}>
                <div>
                  <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#1a365e' }}>
                    Your Trusted Local Experts
                  </h2>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#64748b', marginBottom: '1.5rem' }}>
                    Since 2018, Scottsdale Handyman Solutions has been serving the greater Scottsdale area with 
                    professional, reliable handyman services. We're a locally owned and operated business that 
                    takes pride in delivering quality workmanship and exceptional customer service.
                  </p>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#64748b', marginBottom: '1.5rem' }}>
                    Our team of skilled professionals is fully licensed, bonded, and insured, giving you peace 
                    of mind with every project. From small repairs to major home improvements, we treat every 
                    job with the same attention to detail and commitment to excellence.
                  </p>
                  
                  <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#FFD700' }}>500+</div>
                      <div style={{ color: '#64748b' }}>Happy Customers</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#FFD700' }}>7+</div>
                      <div style={{ color: '#64748b' }}>Years Experience</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#FFD700' }}>24/7</div>
                      <div style={{ color: '#64748b' }}>Emergency Service</div>
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <img 
                    src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop" 
                    alt="Professional handyman at work" 
                    style={{ width: '100%', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                  />
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: '3rem', borderRadius: '12px', marginTop: '3rem' }}>
                <h3 style={{ fontSize: '1.8rem', textAlign: 'center', marginBottom: '2rem', color: '#1a365e' }}>
                  Our Commitment to You
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                  <div style={{ textAlign: 'center' }}>
                    <Shield size={48} style={{ color: '#FFD700', marginBottom: '1rem', margin: '0 auto' }} />
                    <h4 style={{ marginBottom: '0.5rem', color: '#1a365e' }}>Licensed & Insured</h4>
                    <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Fully bonded and insured for your protection</p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <Star size={48} style={{ color: '#FFD700', marginBottom: '1rem', margin: '0 auto' }} />
                    <h4 style={{ marginBottom: '0.5rem', color: '#1a365e' }}>Quality Guarantee</h4>
                    <p style={{ color: '#64748b', fontSize: '0.9rem' }}>100% satisfaction guaranteed on all work</p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <Clock size={48} style={{ color: '#FFD700', marginBottom: '1rem', margin: '0 auto' }} />
                    <h4 style={{ marginBottom: '0.5rem', color: '#1a365e' }}>On-Time Service</h4>
                    <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Reliable scheduling you can count on</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {currentPage === 'blog' && (
          <section style={{ padding: '4rem 2rem', minHeight: '80vh' }}>
            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
              <h1 style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '2rem', color: '#1a365e' }}>
                Home Improvement Blog
              </h1>
              <p style={{ fontSize: '1.2rem', textAlign: 'center', color: '#64748b', marginBottom: '3rem' }}>
                Tips, tricks, and insights from your local handyman experts
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
                {[
                  {
                    title: "10 Essential Home Maintenance Tasks for Arizona Homes",
                    excerpt: "Living in the desert presents unique challenges. Here's how to keep your home in top shape year-round.",
                    date: "January 15, 2025",
                    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop"
                  },
                  {
                    title: "Smart Home Upgrades That Add Value",
                    excerpt: "Discover which smart home improvements offer the best return on investment in today's market.",
                    date: "January 10, 2025", 
                    image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=400&h=250&fit=crop"
                  },
                  {
                    title: "Emergency Repairs Every Homeowner Should Know",
                    excerpt: "Quick fixes that can prevent major damage while you wait for professional help.",
                    date: "January 5, 2025",
                    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=250&fit=crop"
                  }
                ].map((post, index) => (
                  <article key={index} style={{
                    background: 'white',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    transition: 'transform 0.3s ease'
                  }}>
                    <img 
                      src={post.image} 
                      alt={post.title}
                      style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                    />
                    <div style={{ padding: '1.5rem' }}>
                      <div style={{ fontSize: '0.9rem', color: '#FFD700', marginBottom: '0.5rem' }}>
                        {post.date}
                      </div>
                      <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', color: '#1a365e' }}>
                        {post.title}
                      </h3>
                      <p style={{ color: '#64748b', lineHeight: '1.6', marginBottom: '1rem' }}>
                        {post.excerpt}
                      </p>
                      <button style={{
                        background: 'linear-gradient(135deg, #1a365e, #2c5aa0)',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                      }}>
                        Read More
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {currentPage === 'work-with-us' && (
          <section style={{ padding: '4rem 1rem', minHeight: '80vh' }}>
            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
              <h1 style={{ 
                fontSize: 'clamp(2rem, 5vw, 3rem)', 
                textAlign: 'center', 
                marginBottom: '2rem', 
                color: '#1a365e' 
              }}>
                Work With Us
              </h1>
              <p style={{ 
                fontSize: 'clamp(1rem, 3vw, 1.2rem)', 
                textAlign: 'center', 
                color: '#64748b', 
                marginBottom: '3rem',
                maxWidth: '800px',
                margin: '0 auto 3rem auto'
              }}>
                Join our team of skilled professionals and grow your career with Scottsdale's premier handyman service
              </p>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                gap: 'clamp(2rem, 5vw, 4rem)', 
                marginBottom: '4rem' 
              }}>
                <div>
                  <h2 style={{ 
                    fontSize: 'clamp(1.5rem, 4vw, 2rem)', 
                    marginBottom: '1.5rem', 
                    color: '#1a365e' 
                  }}>
                    Why Choose Our Team?
                  </h2>
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    {[
                      'Competitive pay and benefits',
                      'Flexible scheduling options',
                      'Professional development opportunities',
                      'Modern tools and equipment provided',
                      'Supportive team environment',
                      'Opportunity for advancement'
                    ].map((benefit, index) => (
                      <li key={index} style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '1rem',
                        fontSize: 'clamp(1rem, 2.5vw, 1.1rem)'
                      }}>
                        <CheckCircle size={20} style={{ color: '#FFD700', marginRight: '1rem', flexShrink: 0 }} />
                        <span style={{ color: '#64748b' }}>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div style={{ 
                  background: '#f8fafc', 
                  padding: 'clamp(1.5rem, 4vw, 2rem)', 
                  borderRadius: '12px' 
                }}>
                  <h3 style={{ 
                    fontSize: 'clamp(1.25rem, 3vw, 1.5rem)', 
                    marginBottom: '1rem', 
                    color: '#1a365e' 
                  }}>
                    Current Openings
                  </h3>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h4 style={{ 
                      color: '#1a365e', 
                      marginBottom: '0.5rem',
                      fontSize: 'clamp(1rem, 2.5vw, 1.1rem)'
                    }}>Experienced Handyman</h4>
                    <p style={{ 
                      color: '#64748b', 
                      fontSize: 'clamp(0.85rem, 2vw, 0.9rem)', 
                      marginBottom: '0.5rem',
                      lineHeight: '1.4'
                    }}>
                      Full-time position for skilled professional with 3+ years experience
                    </p>
                    <span style={{ 
                      fontSize: 'clamp(0.75rem, 2vw, 0.8rem)', 
                      color: '#FFD700', 
                      fontWeight: 'bold' 
                    }}>
                      $25-35/hour + benefits
                    </span>
                  </div>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h4 style={{ 
                      color: '#1a365e', 
                      marginBottom: '0.5rem',
                      fontSize: 'clamp(1rem, 2.5vw, 1.1rem)'
                    }}>Apprentice Technician</h4>
                    <p style={{ 
                      color: '#64748b', 
                      fontSize: 'clamp(0.85rem, 2vw, 0.9rem)', 
                      marginBottom: '0.5rem',
                      lineHeight: '1.4'
                    }}>
                      Entry-level position with training provided for motivated individuals
                    </p>
                    <span style={{ 
                      fontSize: 'clamp(0.75rem, 2vw, 0.8rem)', 
                      color: '#FFD700', 
                      fontWeight: 'bold' 
                    }}>
                      $18-22/hour + training
                    </span>
                  </div>
                  <button
                    onClick={() => openLeadForm('employment')}
                    style={{
                      background: 'linear-gradient(135deg, #1a365e, #2c5aa0)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      padding: 'clamp(0.75rem, 2vw, 1rem) clamp(1.5rem, 3vw, 2rem)',
                      cursor: 'pointer',
                      width: '100%',
                      fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
                      fontWeight: 'bold'
                    }}
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {currentPage === 'pay' && (
          <section style={{ padding: '4rem 1rem', minHeight: '80vh' }}>
            <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
              <h1 style={{ 
                fontSize: 'clamp(2rem, 5vw, 3rem)', 
                textAlign: 'center', 
                marginBottom: '2rem', 
                color: '#1a365e' 
              }}>
                Pay Your Invoice
              </h1>
              <p style={{ 
                fontSize: 'clamp(1rem, 3vw, 1.2rem)', 
                textAlign: 'center', 
                color: '#64748b', 
                marginBottom: '3rem',
                maxWidth: '600px',
                margin: '0 auto 3rem auto'
              }}>
                Secure online payment for your handyman services
              </p>
              
              <div style={{ 
                background: 'white', 
                padding: 'clamp(1.5rem, 4vw, 3rem)', 
                borderRadius: '12px', 
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)' 
              }}>
                <form style={{ display: 'grid', gap: '1.5rem' }}>
                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '0.5rem', 
                      color: '#1a365e', 
                      fontWeight: 'bold',
                      fontSize: 'clamp(0.9rem, 2.5vw, 1rem)'
                    }}>
                      Invoice Number
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your invoice number"
                      style={{
                        width: '100%',
                        padding: 'clamp(0.75rem, 2vw, 1rem)',
                        border: '2px solid #e2e8f0',
                        borderRadius: '6px',
                        fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                  
                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '0.5rem', 
                      color: '#1a365e', 
                      fontWeight: 'bold',
                      fontSize: 'clamp(0.9rem, 2.5vw, 1rem)'
                    }}>
                      Amount
                    </label>
                    <input
                      type="number"
                      placeholder="0.00"
                      step="0.01"
                      style={{
                        width: '100%',
                        padding: 'clamp(0.75rem, 2vw, 1rem)',
                        border: '2px solid #e2e8f0',
                        borderRadius: '6px',
                        fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                  
                  <div style={{ 
                    background: '#f8fafc', 
                    padding: 'clamp(1.5rem, 3vw, 2rem)', 
                    borderRadius: '8px', 
                    marginTop: '1rem' 
                  }}>
                    <h3 style={{ 
                      marginBottom: '1rem', 
                      color: '#1a365e',
                      fontSize: 'clamp(1.1rem, 3vw, 1.25rem)'
                    }}>Payment Information</h3>
                    <div style={{ display: 'grid', gap: '1rem' }}>
                      <input
                        type="text"
                        placeholder="Card Number"
                        style={{
                          width: '100%',
                          padding: 'clamp(0.75rem, 2vw, 1rem)',
                          border: '2px solid #e2e8f0',
                          borderRadius: '6px',
                          fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
                          boxSizing: 'border-box'
                        }}
                      />
                      <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: '1fr 1fr', 
                        gap: '1rem' 
                      }}>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          style={{
                            width: '100%',
                            padding: 'clamp(0.75rem, 2vw, 1rem)',
                            border: '2px solid #e2e8f0',
                            borderRadius: '6px',
                            fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
                            boxSizing: 'border-box'
                          }}
                        />
                        <input
                          type="text"
                          placeholder="CVC"
                          style={{
                            width: '100%',
                            padding: 'clamp(0.75rem, 2vw, 1rem)',
                            border: '2px solid #e2e8f0',
                            borderRadius: '6px',
                            fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Name on Card"
                        style={{
                          width: '100%',
                          padding: 'clamp(0.75rem, 2vw, 1rem)',
                          border: '2px solid #e2e8f0',
                          borderRadius: '6px',
                          fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    style={{
                      background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                      color: '#000',
                      border: 'none',
                      borderRadius: '8px',
                      padding: 'clamp(1rem, 2.5vw, 1.25rem) clamp(1.5rem, 4vw, 2rem)',
                      fontSize: 'clamp(1rem, 2.5vw, 1.1rem)',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      marginTop: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      width: '100%',
                      boxSizing: 'border-box'
                    }}
                  >
                    <CreditCard size={20} />
                    Pay Securely
                  </button>
                </form>
                
                <div style={{ 
                  textAlign: 'center', 
                  marginTop: '2rem', 
                  padding: 'clamp(1rem, 2.5vw, 1.5rem)', 
                  background: '#f0f9ff', 
                  borderRadius: '8px' 
                }}>
                  <p style={{ 
                    color: '#0369a1', 
                    fontSize: 'clamp(0.85rem, 2vw, 0.9rem)', 
                    margin: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    flexWrap: 'wrap'
                  }}>
                    <Shield size={16} style={{ flexShrink: 0 }} />
                    <span>Your payment is secured with 256-bit SSL encryption</span>
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Contact Section on every page */}
        <section id="contact" style={{ padding: '4rem 2rem', background: '#f8fafc' }}>
          <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h2 style={{ fontSize: '2.5rem', color: '#1a365e', marginBottom: '1rem' }}>
                Get Started Today
              </h2>
              <p style={{ fontSize: '1.2rem', color: '#64748b' }}>
                Ready to improve your home? Contact us for a free consultation.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
              <div>
                <h3 style={{ fontSize: '1.5rem', color: '#1a365e', marginBottom: '1rem' }}>Contact Information</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Phone size={20} style={{ color: '#FFD700' }} />
                    <a href="tel:+14802555887" style={{ color: '#1a365e', textDecoration: 'none' }}>
                      (480) 255-5887
                    </a>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Mail size={20} style={{ color: '#FFD700' }} />
                    <a href="mailto:help.scottsdalehandyman@gmail.com" style={{ color: '#1a365e', textDecoration: 'none' }}>
                      help.scottsdalehandyman@gmail.com
                    </a>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <MapPin size={20} style={{ color: '#FFD700' }} />
                    <span style={{ color: '#64748b' }}>Serving Greater Scottsdale Area</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Clock size={20} style={{ color: '#FFD700' }} />
                    <span style={{ color: '#64748b' }}>Mon-Sat: 7AM-6PM, 24/7 Emergency</span>
                  </div>
                </div>
              </div>

              <div>
                <form onSubmit={handleSubmit} style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                  <div style={{ display: 'grid', gap: '1rem' }}>
                    <input
                      type="text"
                      name="name"
                      placeholder="Your Name"
                      required
                      style={{
                        padding: '0.75rem',
                        border: '2px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="Your Email"
                      required
                      style={{
                        padding: '0.75rem',
                        border: '2px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                    />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Your Phone"
                      onInput={handlePhoneInput}
                      style={{
                        padding: '0.75rem',
                        border: '2px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                    />
                    <textarea
                      name="description"
                      placeholder="Describe your project..."
                      rows="4"
                      required
                      style={{
                        padding: '0.75rem',
                        border: '2px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        resize: 'vertical'
                      }}
                    />
                    <button
                      type="submit"
                      style={{
                        background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                        color: '#000',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '0.75rem',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                      }}
                    >
                      Send Message
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ChatBot Integration */}
      <ChatbotWidget />

      {/* Smart Lead Form Modal */}
      {leadFormModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '1rem'
        }} onClick={closeLeadForm}>
          <div onClick={(e) => e.stopPropagation()} style={{
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
                color: '#64748b'
              }}
            >
              <X size={24} />
            </button>

            <h2 style={{ color: '#1a365e', marginBottom: '1rem', fontSize: '1.75rem' }}>
              Get Your Free Quote
            </h2>
            <p style={{ color: '#64748b', marginBottom: '2rem' }}>
              Describe your project for a detailed estimate within 24 hours.
            </p>

            <form onSubmit={handleLeadFormSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                required
                style={{
                  padding: '0.875rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                required
                style={{
                  padding: '0.875rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                onInput={handlePhoneInput}
                required
                style={{
                  padding: '0.875rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              />
              <textarea
                name="projectDetails"
                placeholder="Describe your project, requirements, timeline, etc."
                rows={4}
                style={{
                  padding: '0.875rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  resize: 'vertical'
                }}
              />
              
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={closeLeadForm}
                  style={{
                    padding: '0.875rem 1.5rem',
                    background: '#f3f4f6',
                    color: '#6b7280',
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
                    padding: '0.875rem 2rem',
                    background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                    color: '#000',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Emergency Popup */}
      {showEmergencyPopup && (
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
            borderRadius: '20px',
            padding: '40px',
            maxWidth: '500px',
            width: '100%',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(255, 68, 68, 0.4)',
            border: '4px solid #ff4444',
            position: 'relative'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🚨</div>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '10px', color: '#dc2626' }}>
              EMERGENCY SERVICE
            </h2>
            <p style={{ fontSize: '1.1rem', marginBottom: '30px', color: '#4b5563' }}>
              Available 24/7 for urgent repairs. Choose how to reach us:
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' }}>
              <button
                onClick={callEmergencyNumber}
                style={{
                  backgroundColor: '#ff4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '15px 25px',
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px'
                }}
              >
                <Phone size={24} />
                CALL NOW: (480) 255-5887
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
                  cursor: 'pointer'
                }}
              >
                📋 Fill Emergency Request Form
              </button>
            </div>

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
                cursor: 'pointer'
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Success Page */}
      {showSuccessPage && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '1rem'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '3rem',
            maxWidth: '500px',
            width: '100%',
            textAlign: 'center',
            position: 'relative'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
            <h2 style={{ fontSize: '2rem', color: '#059669', marginBottom: '1rem' }}>
              Message Sent Successfully!
            </h2>
            <p style={{ color: '#6b7280', marginBottom: '2rem', lineHeight: '1.6' }}>
              Thank you for contacting us. We'll respond within 2 hours during business hours.
            </p>
            <p style={{ fontSize: '0.9rem', color: '#9ca3af' }}>
              This message will close automatically in a few seconds.
            </p>
            
            <button
              onClick={() => setShowSuccessPage(false)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'none',
                border: 'none',
                color: '#6b7280',
                cursor: 'pointer'
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
