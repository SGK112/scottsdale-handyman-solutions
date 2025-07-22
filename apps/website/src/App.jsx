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

  @keyframes float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-20px);
    }
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.8;
    }
  }

  .service-card {
    transition: all 0.3s ease;
  }

  .service-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 60px rgba(0,0,0,0.12) !important;
  }

  .testimonial-card {
    transition: transform 0.3s ease;
  }

  .testimonial-card:hover {
    transform: translateY(-5px);
  }

  .cta-button {
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  .nav-item {
    position: relative;
    transition: color 0.3s ease;
  }

  .nav-item:hover {
    color: #FFD700;
  }

  .nav-item::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 0;
    height: 2px;
    background: linear-gradient(135deg, #FFD700, #FFA500);
    transition: width 0.3s ease;
  }

  .nav-item:hover::after {
    width: 100%;
  }

  @media (max-width: 768px) {
    .hero-title {
      font-size: clamp(2rem, 8vw, 3rem) !important;
    }
    
    .hero-subtitle {
      font-size: clamp(1rem, 4vw, 1.2rem) !important;
    }
    
    .service-grid {
      grid-template-columns: 1fr !important;
      gap: 1.5rem !important;
    }
    
    .testimonial-grid {
      grid-template-columns: 1fr !important;
    }
    
    .cta-buttons {
      flex-direction: column !important;
      align-items: center !important;
    }
    
    .trust-indicators {
      flex-direction: column !important;
      gap: 1rem !important;
    }

    .about-grid {
      grid-template-columns: 1fr !important;
      gap: 2rem !important;
    }

    .stats-grid {
      grid-template-columns: repeat(3, 1fr) !important;
      gap: 1rem !important;
    }

    .team-grid {
      grid-template-columns: 1fr !important;
    }

    .service-categories {
      grid-template-columns: 1fr !important;
    }

    .guarantee-items {
      flex-direction: column !important;
      gap: 1rem !important;
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
                            href="http://localhost:5178"
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
                                href="http://localhost:5178"
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
                        {/* Enhanced Hero Section */}
                        <section style={{
                            minHeight: '90vh',
                            background: 'linear-gradient(135deg, rgba(26, 54, 93, 0.85), rgba(30, 60, 114, 0.85)), url("https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=1600&h=900&fit=crop") center/cover',
                            display: 'flex',
                            alignItems: 'center',
                            color: 'white',
                            textAlign: 'center',
                            padding: '4rem 1rem',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            {/* Floating elements for visual interest */}
                            <div style={{
                                position: 'absolute',
                                top: '20%',
                                right: '10%',
                                width: '100px',
                                height: '100px',
                                background: 'rgba(255, 215, 0, 0.1)',
                                borderRadius: '50%',
                                animation: 'float 6s ease-in-out infinite'
                            }} />
                            <div style={{
                                position: 'absolute',
                                bottom: '15%',
                                left: '15%',
                                width: '60px',
                                height: '60px',
                                background: 'rgba(255, 215, 0, 0.15)',
                                borderRadius: '50%',
                                animation: 'float 4s ease-in-out infinite reverse'
                            }} />

                            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
                                <div style={{ marginBottom: '2rem' }}>
                                    <span style={{
                                        display: 'inline-block',
                                        background: 'rgba(255, 215, 0, 0.2)',
                                        color: '#FFD700',
                                        padding: '0.5rem 1.5rem',
                                        borderRadius: '50px',
                                        fontSize: '0.95rem',
                                        fontWeight: '600',
                                        marginBottom: '1.5rem',
                                        border: '1px solid rgba(255, 215, 0, 0.3)'
                                    }}>
                                        🏆 Scottsdale's #1 Rated Handyman Service
                                    </span>
                                </div>

                                <h1 style={{ 
                                    fontSize: 'clamp(2.5rem, 5vw, 4rem)', 
                                    fontWeight: '800', 
                                    marginBottom: '1.5rem',
                                    lineHeight: '1.1',
                                    textShadow: '0 4px 8px rgba(0,0,0,0.3)'
                                }}>
                                    Your Home's Best Friend in
                                    <span style={{ 
                                        display: 'block',
                                        background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                                        backgroundClip: 'text',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        filter: 'drop-shadow(0 2px 4px rgba(255,215,0,0.3))'
                                    }}>
                                        Scottsdale & Beyond
                                    </span>
                                </h1>

                                <p style={{ 
                                    fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)', 
                                    marginBottom: '3rem', 
                                    opacity: 0.95,
                                    maxWidth: '700px',
                                    margin: '0 auto 3rem auto',
                                    lineHeight: '1.6'
                                }}>
                                    From emergency repairs to smart home installations, we're your trusted local experts ready to tackle any project with precision and care.
                                </p>

                                {/* Enhanced CTA buttons with icons and animations */}
                                <div className="cta-buttons" style={{ 
                                    display: 'flex', 
                                    gap: '1.5rem', 
                                    justifyContent: 'center', 
                                    flexWrap: 'wrap',
                                    marginBottom: '3rem'
                                }}>
                                    <button
                                        onClick={() => openLeadForm('quote')}
                                        style={{
                                            background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                                            color: '#000',
                                            border: 'none',
                                            borderRadius: '12px',
                                            padding: '1.25rem 2.5rem',
                                            fontSize: '1.1rem',
                                            fontWeight: '700',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.75rem',
                                            boxShadow: '0 8px 25px rgba(255, 215, 0, 0.4)',
                                            transition: 'all 0.3s ease',
                                            transform: 'translateY(0)'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.transform = 'translateY(-2px)';
                                            e.target.style.boxShadow = '0 12px 35px rgba(255, 215, 0, 0.5)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.transform = 'translateY(0)';
                                            e.target.style.boxShadow = '0 8px 25px rgba(255, 215, 0, 0.4)';
                                        }}
                                    >
                                        <FileText size={20} />
                                        Get Free Quote
                                    </button>
                                    <button
                                        onClick={() => openLeadForm('emergency')}
                                        style={{
                                            background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '12px',
                                            padding: '1.25rem 2.5rem',
                                            fontSize: '1.1rem',
                                            fontWeight: '700',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.75rem',
                                            boxShadow: '0 8px 25px rgba(220, 38, 38, 0.4)',
                                            transition: 'all 0.3s ease',
                                            transform: 'translateY(0)',
                                            animation: 'pulse 2s infinite'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.transform = 'translateY(-2px)';
                                            e.target.style.boxShadow = '0 12px 35px rgba(220, 38, 38, 0.5)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.transform = 'translateY(0)';
                                            e.target.style.boxShadow = '0 8px 25px rgba(220, 38, 38, 0.4)';
                                        }}
                                    >
                                        <Phone size={20} />
                                        24/7 Emergency
                                    </button>
                                </div>

                                {/* Trust indicators */}
                                <div className="trust-indicators" style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: '2rem',
                                    flexWrap: 'wrap',
                                    opacity: 0.9
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Shield size={20} style={{ color: '#10b981' }} />
                                        <span style={{ fontSize: '0.9rem' }}>Licensed & Insured</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Star size={20} style={{ color: '#FFD700' }} />
                                        <span style={{ fontSize: '0.9rem' }}>4.9/5 Customer Rating</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Clock size={20} style={{ color: '#60a5fa' }} />
                                        <span style={{ fontSize: '0.9rem' }}>Same-Day Service</span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Enhanced Services Preview */}
                        <section style={{ padding: '5rem 1rem', background: '#f8fafc' }}>
                            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                                    <h2 style={{ 
                                        fontSize: 'clamp(2rem, 4vw, 2.8rem)', 
                                        marginBottom: '1rem', 
                                        color: '#1a365e',
                                        fontWeight: '700'
                                    }}>
                                        Complete Home Solutions
                                    </h2>
                                    <p style={{ 
                                        fontSize: '1.2rem', 
                                        color: '#64748b', 
                                        maxWidth: '600px', 
                                        margin: '0 auto',
                                        lineHeight: '1.6'
                                    }}>
                                        From quick fixes to major renovations, we handle every aspect of home maintenance and improvement
                                    </p>
                                </div>

                                <div className="service-grid" style={{ 
                                    display: 'grid', 
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
                                    gap: '2rem', 
                                    marginBottom: '3rem'
                                }}>
                                    <div style={{ 
                                        padding: '2.5rem', 
                                        background: 'white', 
                                        borderRadius: '16px', 
                                        boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                                        transition: 'all 0.3s ease',
                                        border: '1px solid rgba(226, 232, 240, 0.5)',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}>
                                        <div style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            height: '4px',
                                            background: 'linear-gradient(135deg, #FFD700, #FFA500)'
                                        }} />
                                        <div style={{
                                            width: '64px',
                                            height: '64px',
                                            background: 'linear-gradient(135deg, rgba(255,215,0,0.1), rgba(255,165,0,0.1))',
                                            borderRadius: '16px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginBottom: '1.5rem'
                                        }}>
                                            <Wrench size={32} style={{ color: '#FFD700' }} />
                                        </div>
                                        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#1a365e', fontWeight: '600' }}>
                                            Expert Repairs
                                        </h3>
                                        <p style={{ color: '#64748b', lineHeight: '1.7', marginBottom: '1.5rem' }}>
                                            Quick, reliable fixes for electrical, plumbing, drywall, and general maintenance issues. Emergency service available 24/7.
                                        </p>
                                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                            {['Emergency repairs', 'Electrical fixes', 'Plumbing solutions', 'Drywall patches'].map((item, i) => (
                                                <li key={i} style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem',
                                                    marginBottom: '0.5rem',
                                                    fontSize: '0.9rem',
                                                    color: '#64748b'
                                                }}>
                                                    <CheckCircle size={16} style={{ color: '#10b981' }} />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div style={{ 
                                        padding: '2.5rem', 
                                        background: 'white', 
                                        borderRadius: '16px', 
                                        boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                                        transition: 'all 0.3s ease',
                                        border: '1px solid rgba(226, 232, 240, 0.5)',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}>
                                        <div style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            height: '4px',
                                            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
                                        }} />
                                        <div style={{
                                            width: '64px',
                                            height: '64px',
                                            background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(29,78,216,0.1))',
                                            borderRadius: '16px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginBottom: '1.5rem'
                                        }}>
                                            <Calendar size={32} style={{ color: '#3b82f6' }} />
                                        </div>
                                        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#1a365e', fontWeight: '600' }}>
                                            Maintenance Plans
                                        </h3>
                                        <p style={{ color: '#64748b', lineHeight: '1.7', marginBottom: '1.5rem' }}>
                                            Proactive care to prevent problems before they start. Custom plans for every home and budget.
                                        </p>
                                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                            {['Monthly inspections', 'Preventive care', 'Priority scheduling', 'Discounted repairs'].map((item, i) => (
                                                <li key={i} style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem',
                                                    marginBottom: '0.5rem',
                                                    fontSize: '0.9rem',
                                                    color: '#64748b'
                                                }}>
                                                    <CheckCircle size={16} style={{ color: '#10b981' }} />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div style={{ 
                                        padding: '2.5rem', 
                                        background: 'white', 
                                        borderRadius: '16px', 
                                        boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                                        transition: 'all 0.3s ease',
                                        border: '1px solid rgba(226, 232, 240, 0.5)',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}>
                                        <div style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            height: '4px',
                                            background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)'
                                        }} />
                                        <div style={{
                                            width: '64px',
                                            height: '64px',
                                            background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(124,58,237,0.1))',
                                            borderRadius: '16px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginBottom: '1.5rem'
                                        }}>
                                            <Smartphone size={32} style={{ color: '#8b5cf6' }} />
                                        </div>
                                        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#1a365e', fontWeight: '600' }}>
                                            Smart Home Solutions
                                        </h3>
                                        <p style={{ color: '#64748b', lineHeight: '1.7', marginBottom: '1.5rem' }}>
                                            Transform your home with cutting-edge automation and intelligent systems for comfort and efficiency.
                                        </p>
                                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                            {['Smart thermostats', 'Security systems', 'Automated lighting', 'Voice control'].map((item, i) => (
                                                <li key={i} style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem',
                                                    marginBottom: '0.5rem',
                                                    fontSize: '0.9rem',
                                                    color: '#64748b'
                                                }}>
                                                    <CheckCircle size={16} style={{ color: '#10b981' }} />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                <div style={{ textAlign: 'center' }}>
                                    <button
                                        onClick={() => setCurrentPage('services')}
                                        style={{
                                            background: 'linear-gradient(135deg, #1a365e, #2c5282)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '12px',
                                            padding: '1rem 2rem',
                                            fontSize: '1.1rem',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            transition: 'all 0.3s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.transform = 'translateY(-2px)';
                                            e.target.style.boxShadow = '0 8px 25px rgba(26, 54, 94, 0.3)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.transform = 'translateY(0)';
                                            e.target.style.boxShadow = 'none';
                                        }}
                                    >
                                        View All Services
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            </div>
                        </section>

                        {/* New Customer Testimonials Section */}
                        <section style={{ padding: '5rem 1rem', background: 'linear-gradient(135deg, #1a365e, #2c5282)' }}>
                            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                                    <h2 style={{ 
                                        fontSize: 'clamp(2rem, 4vw, 2.8rem)', 
                                        marginBottom: '1rem', 
                                        color: 'white',
                                        fontWeight: '700'
                                    }}>
                                        What Our Customers Say
                                    </h2>
                                    <p style={{ 
                                        fontSize: '1.2rem', 
                                        color: 'rgba(255,255,255,0.9)', 
                                        maxWidth: '600px', 
                                        margin: '0 auto'
                                    }}>
                                        Trusted by thousands of Scottsdale homeowners
                                    </p>
                                </div>

                                <div className="testimonial-grid" style={{ 
                                    display: 'grid', 
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                                    gap: '2rem'
                                }}>
                                    {[
                                        {
                                            name: 'Sarah M.',
                                            location: 'Desert Ridge',
                                            rating: 5,
                                            text: 'Incredible service! They fixed our emergency plumbing leak within 2 hours and the quality was outstanding. Professional, clean, and fair pricing.',
                                            service: 'Emergency Plumbing'
                                        },
                                        {
                                            name: 'Mike R.',
                                            location: 'Old Town Scottsdale',
                                            rating: 5,
                                            text: 'The smart home installation exceeded expectations. Now I can control everything from my phone. The team was knowledgeable and efficient.',
                                            service: 'Smart Home Installation'
                                        },
                                        {
                                            name: 'Jennifer L.',
                                            location: 'North Scottsdale',
                                            rating: 5,
                                            text: 'Monthly maintenance plan has saved me so much money! They catch problems early and my home has never been in better condition.',
                                            service: 'Maintenance Plan'
                                        }
                                    ].map((testimonial, index) => (
                                        <div key={index} style={{
                                            background: 'rgba(255,255,255,0.95)',
                                            borderRadius: '16px',
                                            padding: '2rem',
                                            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                                            transition: 'transform 0.3s ease'
                                        }}>
                                            <div style={{ display: 'flex', marginBottom: '1rem' }}>
                                                {[...Array(testimonial.rating)].map((_, i) => (
                                                    <Star key={i} size={20} style={{ color: '#FFD700', fill: '#FFD700' }} />
                                                ))}
                                            </div>
                                            <p style={{ 
                                                color: '#374151', 
                                                lineHeight: '1.7', 
                                                marginBottom: '1.5rem',
                                                fontStyle: 'italic'
                                            }}>
                                                "{testimonial.text}"
                                            </p>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
                                                <div>
                                                    <div style={{ fontWeight: '600', color: '#1a365e' }}>
                                                        {testimonial.name}
                                                    </div>
                                                    <div style={{ fontSize: '0.9rem', color: '#64748b' }}>
                                                        {testimonial.location}
                                                    </div>
                                                </div>
                                                <div style={{ 
                                                    fontSize: '0.8rem', 
                                                    color: '#8b5cf6',
                                                    fontWeight: '500',
                                                    textAlign: 'right'
                                                }}>
                                                    {testimonial.service}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* Enhanced Why Choose Us Section */}
                        <section style={{ padding: '5rem 1rem', background: 'white' }}>
                            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                                    <h2 style={{ 
                                        fontSize: 'clamp(2rem, 4vw, 2.8rem)', 
                                        marginBottom: '1rem', 
                                        color: '#1a365e',
                                        fontWeight: '700'
                                    }}>
                                        Why Scottsdale Chooses Us
                                    </h2>
                                    <p style={{ 
                                        fontSize: '1.2rem', 
                                        color: '#64748b', 
                                        maxWidth: '600px', 
                                        margin: '0 auto'
                                    }}>
                                        Experience the difference of working with true professionals
                                    </p>
                                </div>

                                <div style={{ 
                                    display: 'grid', 
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                                    gap: '2rem'
                                }}>
                                    {[
                                        {
                                            icon: Shield,
                                            title: 'Licensed & Insured',
                                            description: 'Full licensing and comprehensive insurance coverage for your complete peace of mind.'
                                        },
                                        {
                                            icon: Clock,
                                            title: 'Fast Response',
                                            description: 'Same-day service for most requests, with 24/7 emergency support when you need it most.'
                                        },
                                        {
                                            icon: Award,
                                            title: 'Quality Guaranteed',
                                            description: 'Every job backed by our satisfaction guarantee and comprehensive warranty protection.'
                                        },
                                        {
                                            icon: Users,
                                            title: 'Expert Team',
                                            description: 'Skilled professionals with years of experience and ongoing training in the latest techniques.'
                                        }
                                    ].map((feature, index) => {
                                        const IconComponent = feature.icon;
                                        return (
                                            <div key={index} style={{
                                                textAlign: 'center',
                                                padding: '2rem 1rem'
                                            }}>
                                                <div style={{
                                                    width: '80px',
                                                    height: '80px',
                                                    background: 'linear-gradient(135deg, rgba(255,215,0,0.1), rgba(255,165,0,0.1))',
                                                    borderRadius: '20px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    margin: '0 auto 1.5rem auto',
                                                    border: '2px solid rgba(255,215,0,0.2)'
                                                }}>
                                                    <IconComponent size={40} style={{ color: '#FFD700' }} />
                                                </div>
                                                <h3 style={{ 
                                                    fontSize: '1.3rem', 
                                                    marginBottom: '1rem', 
                                                    color: '#1a365e',
                                                    fontWeight: '600'
                                                }}>
                                                    {feature.title}
                                                </h3>
                                                <p style={{ 
                                                    color: '#64748b', 
                                                    lineHeight: '1.6',
                                                    fontSize: '1rem'
                                                }}>
                                                    {feature.description}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </section>
                    </div>
                )}

                {currentPage === 'services' && (
                    <div>
                        {/* Services Hero Section */}
                        <section style={{
                            background: 'linear-gradient(135deg, rgba(26, 54, 93, 0.9), rgba(44, 82, 160, 0.9)), url("https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&h=600&fit=crop") center/cover',
                            padding: '5rem 1rem',
                            color: 'white',
                            textAlign: 'center'
                        }}>
                            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                                <h1 style={{ 
                                    fontSize: 'clamp(2.5rem, 5vw, 4rem)', 
                                    fontWeight: '700', 
                                    marginBottom: '1.5rem',
                                    textShadow: '0 4px 8px rgba(0,0,0,0.3)'
                                }}>
                                    Complete Home Services
                                </h1>
                                <p style={{ 
                                    fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)', 
                                    marginBottom: '2rem', 
                                    opacity: 0.95,
                                    maxWidth: '800px',
                                    margin: '0 auto 2rem auto',
                                    lineHeight: '1.6'
                                }}>
                                    From emergency repairs to complete home transformations, we're your one-stop solution
                                </p>
                                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <CheckCircle size={20} style={{ color: '#10b981' }} />
                                        <span>Licensed & Insured</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <CheckCircle size={20} style={{ color: '#10b981' }} />
                                        <span>24/7 Emergency Service</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <CheckCircle size={20} style={{ color: '#10b981' }} />
                                        <span>Satisfaction Guaranteed</span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Service Categories Grid */}
                        <section style={{ padding: '5rem 1rem', background: 'white' }}>
                            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                                    <h2 style={{ 
                                        fontSize: 'clamp(2rem, 4vw, 2.8rem)', 
                                        marginBottom: '1rem', 
                                        color: '#1a365e',
                                        fontWeight: '700'
                                    }}>
                                        Our Service Categories
                                    </h2>
                                    <p style={{ 
                                        fontSize: '1.2rem', 
                                        color: '#64748b', 
                                        maxWidth: '600px', 
                                        margin: '0 auto'
                                    }}>
                                        Professional solutions for every part of your home
                                    </p>
                                </div>

                                <div className="service-categories" style={{ 
                                    display: 'grid', 
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
                                    gap: '2rem',
                                    marginBottom: '4rem'
                                }}>
                                    {/* Emergency Repairs */}
                                    <div className="service-card" style={{
                                        background: 'white',
                                        borderRadius: '16px',
                                        padding: '2.5rem',
                                        boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                                        border: '1px solid rgba(226, 232, 240, 0.5)',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}>
                                        <div style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            height: '4px',
                                            background: 'linear-gradient(135deg, #dc2626, #b91c1c)'
                                        }} />
                                        <div style={{
                                            width: '64px',
                                            height: '64px',
                                            background: 'linear-gradient(135deg, rgba(220,38,38,0.1), rgba(185,28,28,0.1))',
                                            borderRadius: '16px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginBottom: '1.5rem'
                                        }}>
                                            <AlertTriangle size={32} style={{ color: '#dc2626' }} />
                                        </div>
                                        <h3 style={{ fontSize: '1.6rem', marginBottom: '1rem', color: '#1a365e', fontWeight: '600' }}>
                                            Emergency Repairs
                                        </h3>
                                        <p style={{ color: '#64748b', lineHeight: '1.7', marginBottom: '1.5rem' }}>
                                            24/7 emergency service for urgent repairs. Water leaks, electrical issues, broken locks, and other critical problems that can't wait.
                                        </p>
                                        <div style={{ marginBottom: '1.5rem' }}>
                                            <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1a365e', marginBottom: '0.5rem' }}>
                                                Includes:
                                            </div>
                                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                                {['Water leak repairs', 'Electrical emergencies', 'Lock & security fixes', 'Storm damage assessment'].map((item, i) => (
                                                    <li key={i} style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.5rem',
                                                        marginBottom: '0.5rem',
                                                        fontSize: '0.9rem',
                                                        color: '#64748b'
                                                    }}>
                                                        <CheckCircle size={16} style={{ color: '#10b981' }} />
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div style={{ 
                                            display: 'flex', 
                                            justifyContent: 'space-between', 
                                            alignItems: 'center',
                                            marginBottom: '1.5rem'
                                        }}>
                                            <span style={{ fontSize: '1.4rem', fontWeight: '700', color: '#dc2626' }}>
                                                From $150
                                            </span>
                                            <span style={{ 
                                                background: 'rgba(220, 38, 38, 0.1)', 
                                                color: '#dc2626',
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '12px',
                                                fontSize: '0.8rem',
                                                fontWeight: '600'
                                            }}>
                                                24/7 Available
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => openLeadForm('emergency')}
                                            style={{
                                                background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '12px',
                                                padding: '1rem 2rem',
                                                cursor: 'pointer',
                                                width: '100%',
                                                fontWeight: '600',
                                                fontSize: '1rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '0.5rem'
                                            }}
                                        >
                                            <Phone size={18} />
                                            Emergency Call
                                        </button>
                                    </div>

                                    {/* General Repairs */}
                                    <div className="service-card" style={{
                                        background: 'white',
                                        borderRadius: '16px',
                                        padding: '2.5rem',
                                        boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                                        border: '1px solid rgba(226, 232, 240, 0.5)',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}>
                                        <div style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            height: '4px',
                                            background: 'linear-gradient(135deg, #FFD700, #FFA500)'
                                        }} />
                                        <div style={{
                                            width: '64px',
                                            height: '64px',
                                            background: 'linear-gradient(135deg, rgba(255,215,0,0.1), rgba(255,165,0,0.1))',
                                            borderRadius: '16px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginBottom: '1.5rem'
                                        }}>
                                            <Wrench size={32} style={{ color: '#FFD700' }} />
                                        </div>
                                        <h3 style={{ fontSize: '1.6rem', marginBottom: '1rem', color: '#1a365e', fontWeight: '600' }}>
                                            General Repairs
                                        </h3>
                                        <p style={{ color: '#64748b', lineHeight: '1.7', marginBottom: '1.5rem' }}>
                                            Common household repairs and maintenance tasks. Perfect for those weekend to-do lists and ongoing home care needs.
                                        </p>
                                        <div style={{ marginBottom: '1.5rem' }}>
                                            <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1a365e', marginBottom: '0.5rem' }}>
                                                Popular Services:
                                            </div>
                                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                                {['Drywall & painting', 'Cabinet & door repairs', 'Faucet & fixture fixes', 'Window & blind installation'].map((item, i) => (
                                                    <li key={i} style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.5rem',
                                                        marginBottom: '0.5rem',
                                                        fontSize: '0.9rem',
                                                        color: '#64748b'
                                                    }}>
                                                        <CheckCircle size={16} style={{ color: '#10b981' }} />
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div style={{ 
                                            display: 'flex', 
                                            justifyContent: 'space-between', 
                                            alignItems: 'center',
                                            marginBottom: '1.5rem'
                                        }}>
                                            <span style={{ fontSize: '1.4rem', fontWeight: '700', color: '#FFD700' }}>
                                                From $99
                                            </span>
                                            <span style={{ 
                                                background: 'rgba(255, 215, 0, 0.1)', 
                                                color: '#FFD700',
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '12px',
                                                fontSize: '0.8rem',
                                                fontWeight: '600'
                                            }}>
                                                Most Popular
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => openLeadForm('quote')}
                                            style={{
                                                background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                                                color: '#000',
                                                border: 'none',
                                                borderRadius: '12px',
                                                padding: '1rem 2rem',
                                                cursor: 'pointer',
                                                width: '100%',
                                                fontWeight: '600',
                                                fontSize: '1rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '0.5rem'
                                            }}
                                        >
                                            <FileText size={18} />
                                            Get Free Quote
                                        </button>
                                    </div>

                                    {/* Smart Home Solutions */}
                                    <div className="service-card" style={{
                                        background: 'white',
                                        borderRadius: '16px',
                                        padding: '2.5rem',
                                        boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                                        border: '1px solid rgba(226, 232, 240, 0.5)',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}>
                                        <div style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            height: '4px',
                                            background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)'
                                        }} />
                                        <div style={{
                                            width: '64px',
                                            height: '64px',
                                            background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(124,58,237,0.1))',
                                            borderRadius: '16px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginBottom: '1.5rem'
                                        }}>
                                            <Smartphone size={32} style={{ color: '#8b5cf6' }} />
                                        </div>
                                        <h3 style={{ fontSize: '1.6rem', marginBottom: '1rem', color: '#1a365e', fontWeight: '600' }}>
                                            Smart Home Solutions
                                        </h3>
                                        <p style={{ color: '#64748b', lineHeight: '1.7', marginBottom: '1.5rem' }}>
                                            Transform your home with cutting-edge automation technology. Professional installation and setup of smart devices.
                                        </p>
                                        <div style={{ marginBottom: '1.5rem' }}>
                                            <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1a365e', marginBottom: '0.5rem' }}>
                                                Smart Solutions:
                                            </div>
                                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                                {['Smart thermostats', 'Security cameras & doorbells', 'Automated lighting', 'Voice control setup'].map((item, i) => (
                                                    <li key={i} style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.5rem',
                                                        marginBottom: '0.5rem',
                                                        fontSize: '0.9rem',
                                                        color: '#64748b'
                                                    }}>
                                                        <CheckCircle size={16} style={{ color: '#10b981' }} />
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div style={{ 
                                            display: 'flex', 
                                            justifyContent: 'space-between', 
                                            alignItems: 'center',
                                            marginBottom: '1.5rem'
                                        }}>
                                            <span style={{ fontSize: '1.4rem', fontWeight: '700', color: '#8b5cf6' }}>
                                                From $199
                                            </span>
                                            <span style={{ 
                                                background: 'rgba(139, 92, 246, 0.1)', 
                                                color: '#8b5cf6',
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '12px',
                                                fontSize: '0.8rem',
                                                fontWeight: '600'
                                            }}>
                                                Future Ready
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => openLeadForm('quote')}
                                            style={{
                                                background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '12px',
                                                padding: '1rem 2rem',
                                                cursor: 'pointer',
                                                width: '100%',
                                                fontWeight: '600',
                                                fontSize: '1rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '0.5rem'
                                            }}
                                        >
                                            <Settings size={18} />
                                            Learn More
                                        </button>
                                    </div>

                                    {/* Maintenance Plans */}
                                    <div className="service-card" style={{
                                        background: 'white',
                                        borderRadius: '16px',
                                        padding: '2.5rem',
                                        boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                                        border: '1px solid rgba(226, 232, 240, 0.5)',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}>
                                        <div style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            height: '4px',
                                            background: 'linear-gradient(135deg, #10b981, #059669)'
                                        }} />
                                        <div style={{
                                            width: '64px',
                                            height: '64px',
                                            background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(5,150,105,0.1))',
                                            borderRadius: '16px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginBottom: '1.5rem'
                                        }}>
                                            <Calendar size={32} style={{ color: '#10b981' }} />
                                        </div>
                                        <h3 style={{ fontSize: '1.6rem', marginBottom: '1rem', color: '#1a365e', fontWeight: '600' }}>
                                            Maintenance Plans
                                        </h3>
                                        <p style={{ color: '#64748b', lineHeight: '1.7', marginBottom: '1.5rem' }}>
                                            Proactive care to prevent costly problems. Regular inspections and maintenance to keep your home in perfect condition.
                                        </p>
                                        <div style={{ marginBottom: '1.5rem' }}>
                                            <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1a365e', marginBottom: '0.5rem' }}>
                                                Plan Benefits:
                                            </div>
                                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                                {['Monthly inspections', 'Priority scheduling', '20% discount on repairs', 'Preventive maintenance'].map((item, i) => (
                                                    <li key={i} style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.5rem',
                                                        marginBottom: '0.5rem',
                                                        fontSize: '0.9rem',
                                                        color: '#64748b'
                                                    }}>
                                                        <CheckCircle size={16} style={{ color: '#10b981' }} />
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div style={{ 
                                            display: 'flex', 
                                            justifyContent: 'space-between', 
                                            alignItems: 'center',
                                            marginBottom: '1.5rem'
                                        }}>
                                            <span style={{ fontSize: '1.4rem', fontWeight: '700', color: '#10b981' }}>
                                                $79/month
                                            </span>
                                            <span style={{ 
                                                background: 'rgba(16, 185, 129, 0.1)', 
                                                color: '#10b981',
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '12px',
                                                fontSize: '0.8rem',
                                                fontWeight: '600'
                                            }}>
                                                Best Value
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => openLeadForm('maintenance')}
                                            style={{
                                                background: 'linear-gradient(135deg, #10b981, #059669)',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '12px',
                                                padding: '1rem 2rem',
                                                cursor: 'pointer',
                                                width: '100%',
                                                fontWeight: '600',
                                                fontSize: '1rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '0.5rem'
                                            }}
                                        >
                                            <Calendar size={18} />
                                            Join Plan
                                        </button>
                                    </div>

                                    {/* Home Improvements */}
                                    <div className="service-card" style={{
                                        background: 'white',
                                        borderRadius: '16px',
                                        padding: '2.5rem',
                                        boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                                        border: '1px solid rgba(226, 232, 240, 0.5)',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}>
                                        <div style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            height: '4px',
                                            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
                                        }} />
                                        <div style={{
                                            width: '64px',
                                            height: '64px',
                                            background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(29,78,216,0.1))',
                                            borderRadius: '16px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginBottom: '1.5rem'
                                        }}>
                                            <Home size={32} style={{ color: '#3b82f6' }} />
                                        </div>
                                        <h3 style={{ fontSize: '1.6rem', marginBottom: '1rem', color: '#1a365e', fontWeight: '600' }}>
                                            Home Improvements
                                        </h3>
                                        <p style={{ color: '#64748b', lineHeight: '1.7', marginBottom: '1.5rem' }}>
                                            Larger projects that add value and comfort to your home. From bathroom updates to kitchen renovations.
                                        </p>
                                        <div style={{ marginBottom: '1.5rem' }}>
                                            <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1a365e', marginBottom: '0.5rem' }}>
                                                Project Types:
                                            </div>
                                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                                {['Bathroom remodeling', 'Kitchen updates', 'Flooring installation', 'Room additions'].map((item, i) => (
                                                    <li key={i} style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.5rem',
                                                        marginBottom: '0.5rem',
                                                        fontSize: '0.9rem',
                                                        color: '#64748b'
                                                    }}>
                                                        <CheckCircle size={16} style={{ color: '#10b981' }} />
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div style={{ 
                                            display: 'flex', 
                                            justifyContent: 'space-between', 
                                            alignItems: 'center',
                                            marginBottom: '1.5rem'
                                        }}>
                                            <span style={{ fontSize: '1.4rem', fontWeight: '700', color: '#3b82f6' }}>
                                                Custom Quote
                                            </span>
                                            <span style={{ 
                                                background: 'rgba(59, 130, 246, 0.1)', 
                                                color: '#3b82f6',
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '12px',
                                                fontSize: '0.8rem',
                                                fontWeight: '600'
                                            }}>
                                                High Value
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => openLeadForm('project')}
                                            style={{
                                                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '12px',
                                                padding: '1rem 2rem',
                                                cursor: 'pointer',
                                                width: '100%',
                                                fontWeight: '600',
                                                fontSize: '1rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '0.5rem'
                                            }}
                                        >
                                            <TrendingUp size={18} />
                                            Start Project
                                        </button>
                                    </div>

                                    {/* Specialty Services */}
                                    <div className="service-card" style={{
                                        background: 'white',
                                        borderRadius: '16px',
                                        padding: '2.5rem',
                                        boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                                        border: '1px solid rgba(226, 232, 240, 0.5)',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}>
                                        <div style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            height: '4px',
                                            background: 'linear-gradient(135deg, #f59e0b, #d97706)'
                                        }} />
                                        <div style={{
                                            width: '64px',
                                            height: '64px',
                                            background: 'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(217,119,6,0.1))',
                                            borderRadius: '16px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginBottom: '1.5rem'
                                        }}>
                                            <Target size={32} style={{ color: '#f59e0b' }} />
                                        </div>
                                        <h3 style={{ fontSize: '1.6rem', marginBottom: '1rem', color: '#1a365e', fontWeight: '600' }}>
                                            Specialty Services
                                        </h3>
                                        <p style={{ color: '#64748b', lineHeight: '1.7', marginBottom: '1.5rem' }}>
                                            Unique solutions for specific needs. Custom work, accessibility improvements, and specialized installations.
                                        </p>
                                        <div style={{ marginBottom: '1.5rem' }}>
                                            <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1a365e', marginBottom: '0.5rem' }}>
                                                Specialty Areas:
                                            </div>
                                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                                {['Accessibility modifications', 'Energy efficiency upgrades', 'Custom storage solutions', 'Outdoor improvements'].map((item, i) => (
                                                    <li key={i} style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.5rem',
                                                        marginBottom: '0.5rem',
                                                        fontSize: '0.9rem',
                                                        color: '#64748b'
                                                    }}>
                                                        <CheckCircle size={16} style={{ color: '#10b981' }} />
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div style={{ 
                                            display: 'flex', 
                                            justifyContent: 'space-between', 
                                            alignItems: 'center',
                                            marginBottom: '1.5rem'
                                        }}>
                                            <span style={{ fontSize: '1.4rem', fontWeight: '700', color: '#f59e0b' }}>
                                                Consultation
                                            </span>
                                            <span style={{ 
                                                background: 'rgba(245, 158, 11, 0.1)', 
                                                color: '#f59e0b',
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '12px',
                                                fontSize: '0.8rem',
                                                fontWeight: '600'
                                            }}>
                                                Custom
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => openLeadForm('consultation')}
                                            style={{
                                                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '12px',
                                                padding: '1rem 2rem',
                                                cursor: 'pointer',
                                                width: '100%',
                                                fontWeight: '600',
                                                fontSize: '1rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '0.5rem'
                                            }}
                                        >
                                            <MessageSquare size={18} />
                                            Discuss Needs
                                        </button>
                                    </div>
                                </div>

                                {/* Service Guarantee Section */}
                                <div style={{
                                    background: 'linear-gradient(135deg, #f8fafc, #e2e8f0)',
                                    borderRadius: '16px',
                                    padding: '3rem',
                                    textAlign: 'center',
                                    marginTop: '3rem'
                                }}>
                                    <h3 style={{ 
                                        fontSize: '1.8rem', 
                                        marginBottom: '1rem', 
                                        color: '#1a365e',
                                        fontWeight: '700'
                                    }}>
                                        Our Service Guarantee
                                    </h3>
                                    <p style={{ 
                                        fontSize: '1.1rem', 
                                        color: '#64748b', 
                                        marginBottom: '2rem',
                                        maxWidth: '600px',
                                        margin: '0 auto 2rem auto',
                                        lineHeight: '1.7'
                                    }}>
                                        We stand behind every job with our comprehensive satisfaction guarantee. 
                                        If you're not completely happy with our work, we'll make it right.
                                    </p>
                                    <div className="guarantee-items" style={{ 
                                        display: 'flex', 
                                        justifyContent: 'center', 
                                        gap: '3rem',
                                        flexWrap: 'wrap'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <Shield size={24} style={{ color: '#10b981' }} />
                                            <span style={{ fontWeight: '600', color: '#1a365e' }}>100% Satisfaction</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <Award size={24} style={{ color: '#10b981' }} />
                                            <span style={{ fontWeight: '600', color: '#1a365e' }}>Quality Workmanship</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <Clock size={24} style={{ color: '#10b981' }} />
                                            <span style={{ fontWeight: '600', color: '#1a365e' }}>On-Time Service</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                )}

                {currentPage === 'about' && (
                    <div>
                        {/* About Hero Section */}
                        <section style={{
                            background: 'linear-gradient(135deg, rgba(26, 54, 93, 0.9), rgba(44, 82, 160, 0.9)), url("https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1600&h=600&fit=crop") center/cover',
                            padding: '5rem 1rem',
                            color: 'white',
                            textAlign: 'center'
                        }}>
                            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                                <h1 style={{ 
                                    fontSize: 'clamp(2.5rem, 5vw, 4rem)', 
                                    fontWeight: '700', 
                                    marginBottom: '1.5rem',
                                    textShadow: '0 4px 8px rgba(0,0,0,0.3)'
                                }}>
                                    About Scottsdale Handyman Solutions
                                </h1>
                                <p style={{ 
                                    fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)', 
                                    marginBottom: '2rem', 
                                    opacity: 0.95,
                                    maxWidth: '800px',
                                    margin: '0 auto',
                                    lineHeight: '1.6'
                                }}>
                                    Your trusted local experts, dedicated to excellence since 2018
                                </p>
                            </div>
                        </section>

                        {/* Our Story Section */}
                        <section style={{ padding: '5rem 1rem', background: 'white' }}>
                            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                                <div className="about-grid" style={{ 
                                    display: 'grid', 
                                    gridTemplateColumns: '1fr 1fr', 
                                    gap: '4rem', 
                                    alignItems: 'center',
                                    marginBottom: '4rem'
                                }}>
                                    <div>
                                        <h2 style={{ 
                                            fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', 
                                            marginBottom: '1.5rem', 
                                            color: '#1a365e',
                                            fontWeight: '700'
                                        }}>
                                            Your Trusted Local Experts
                                        </h2>
                                        <p style={{ 
                                            fontSize: '1.1rem', 
                                            lineHeight: '1.8', 
                                            color: '#4a5568', 
                                            marginBottom: '1.5rem' 
                                        }}>
                                            Founded in 2018 with a simple mission: to provide Scottsdale homeowners with reliable, 
                                            professional handyman services they can trust. What started as a one-person operation 
                                            has grown into a team of skilled craftsmen serving the entire Valley.
                                        </p>
                                        <p style={{ 
                                            fontSize: '1.1rem', 
                                            lineHeight: '1.8', 
                                            color: '#4a5568', 
                                            marginBottom: '2rem' 
                                        }}>
                                            We're not just contractors – we're your neighbors, invested in making our community 
                                            stronger one home at a time. Every project, from emergency repairs to smart home 
                                            installations, receives our full attention and expertise.
                                        </p>

                                        {/* Key Stats */}
                                        <div className="stats-grid" style={{ 
                                            display: 'grid', 
                                            gridTemplateColumns: 'repeat(3, 1fr)', 
                                            gap: '1.5rem',
                                            marginTop: '2rem'
                                        }}>
                                            <div style={{ textAlign: 'center', padding: '1rem' }}>
                                                <div style={{ 
                                                    fontSize: '2.5rem', 
                                                    fontWeight: 'bold', 
                                                    color: '#FFD700',
                                                    marginBottom: '0.5rem'
                                                }}>
                                                    850+
                                                </div>
                                                <div style={{ color: '#64748b', fontWeight: '600' }}>Happy Customers</div>
                                            </div>
                                            <div style={{ textAlign: 'center', padding: '1rem' }}>
                                                <div style={{ 
                                                    fontSize: '2.5rem', 
                                                    fontWeight: 'bold', 
                                                    color: '#FFD700',
                                                    marginBottom: '0.5rem'
                                                }}>
                                                    7+
                                                </div>
                                                <div style={{ color: '#64748b', fontWeight: '600' }}>Years Experience</div>
                                            </div>
                                            <div style={{ textAlign: 'center', padding: '1rem' }}>
                                                <div style={{ 
                                                    fontSize: '2.5rem', 
                                                    fontWeight: 'bold', 
                                                    color: '#FFD700',
                                                    marginBottom: '0.5rem'
                                                }}>
                                                    4.9
                                                </div>
                                                <div style={{ color: '#64748b', fontWeight: '600' }}>Star Rating</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ position: 'relative' }}>
                                        <img
                                            src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop"
                                            alt="Professional handyman team at work"
                                            style={{ 
                                                width: '100%', 
                                                borderRadius: '16px', 
                                                boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                                                position: 'relative',
                                                zIndex: 2
                                            }}
                                        />
                                        {/* Decorative elements */}
                                        <div style={{
                                            position: 'absolute',
                                            top: '-20px',
                                            right: '-20px',
                                            width: '100px',
                                            height: '100px',
                                            background: 'linear-gradient(135deg, rgba(255,215,0,0.2), rgba(255,165,0,0.2))',
                                            borderRadius: '50%',
                                            zIndex: 1
                                        }} />
                                        <div style={{
                                            position: 'absolute',
                                            bottom: '-30px',
                                            left: '-30px',
                                            width: '60px',
                                            height: '60px',
                                            background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(29,78,216,0.2))',
                                            borderRadius: '50%',
                                            zIndex: 1
                                        }} />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Our Values Section */}
                        <section style={{ padding: '5rem 1rem', background: '#f8fafc' }}>
                            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                                    <h2 style={{ 
                                        fontSize: 'clamp(2rem, 4vw, 2.8rem)', 
                                        marginBottom: '1rem', 
                                        color: '#1a365e',
                                        fontWeight: '700'
                                    }}>
                                        Our Core Values
                                    </h2>
                                    <p style={{ 
                                        fontSize: '1.2rem', 
                                        color: '#64748b', 
                                        maxWidth: '600px', 
                                        margin: '0 auto'
                                    }}>
                                        The principles that guide every interaction and every project
                                    </p>
                                </div>

                                <div style={{ 
                                    display: 'grid', 
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
                                    gap: '2rem' 
                                }}>
                                    {[
                                        {
                                            icon: Shield,
                                            title: 'Integrity',
                                            description: 'Honest pricing, transparent communication, and doing what\'s right even when no one is watching.',
                                            color: '#10b981'
                                        },
                                        {
                                            icon: Star,
                                            title: 'Excellence',
                                            description: 'We don\'t just meet standards – we exceed them. Every job is an opportunity to showcase our craftsmanship.',
                                            color: '#FFD700'
                                        },
                                        {
                                            icon: Users,
                                            title: 'Community',
                                            description: 'We\'re invested in Scottsdale\'s future. Supporting local families and businesses is what drives us.',
                                            color: '#3b82f6'
                                        },
                                        {
                                            icon: Clock,
                                            title: 'Reliability',
                                            description: 'When we say we\'ll be there, we\'ll be there. Your time is valuable, and we respect that.',
                                            color: '#8b5cf6'
                                        }
                                    ].map((value, index) => {
                                        const IconComponent = value.icon;
                                        return (
                                            <div key={index} style={{
                                                background: 'white',
                                                padding: '2.5rem',
                                                borderRadius: '16px',
                                                boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                                                textAlign: 'center',
                                                transition: 'all 0.3s ease',
                                                border: '1px solid rgba(226, 232, 240, 0.5)',
                                                position: 'relative',
                                                overflow: 'hidden'
                                            }}>
                                                <div style={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    right: 0,
                                                    height: '4px',
                                                    background: value.color
                                                }} />
                                                <div style={{
                                                    width: '80px',
                                                    height: '80px',
                                                    background: `${value.color}15`,
                                                    borderRadius: '20px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    margin: '0 auto 1.5rem auto',
                                                    border: `2px solid ${value.color}30`
                                                }}>
                                                    <IconComponent size={40} style={{ color: value.color }} />
                                                </div>
                                                <h3 style={{ 
                                                    fontSize: '1.4rem', 
                                                    marginBottom: '1rem', 
                                                    color: '#1a365e',
                                                    fontWeight: '600'
                                                }}>
                                                    {value.title}
                                                </h3>
                                                <p style={{ 
                                                    color: '#64748b', 
                                                    lineHeight: '1.7',
                                                    fontSize: '1rem'
                                                }}>
                                                    {value.description}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </section>

                        {/* Team Section */}
                        <section style={{ padding: '5rem 1rem', background: 'white' }}>
                            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                                    <h2 style={{ 
                                        fontSize: 'clamp(2rem, 4vw, 2.8rem)', 
                                        marginBottom: '1rem', 
                                        color: '#1a365e',
                                        fontWeight: '700'
                                    }}>
                                        Meet Our Expert Team
                                    </h2>
                                    <p style={{ 
                                        fontSize: '1.2rem', 
                                        color: '#64748b', 
                                        maxWidth: '600px', 
                                        margin: '0 auto'
                                    }}>
                                        Skilled professionals dedicated to bringing your vision to life
                                    </p>
                                </div>

                                <div className="team-grid" style={{ 
                                    display: 'grid', 
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                                    gap: '2rem' 
                                }}>
                                    {[
                                        {
                                            name: 'Mike Rodriguez',
                                            title: 'Lead Handyman & Founder',
                                            experience: '15+ years experience',
                                            specialties: ['Electrical', 'Plumbing', 'Smart Home'],
                                            image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop&crop=face'
                                        },
                                        {
                                            name: 'Sarah Chen',
                                            title: 'Project Manager',
                                            experience: '8+ years experience',
                                            specialties: ['Project Planning', 'Customer Relations', 'Quality Control'],
                                            image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop&crop=face'
                                        },
                                        {
                                            name: 'Carlos Martinez',
                                            title: 'Senior Technician',
                                            experience: '12+ years experience',
                                            specialties: ['Carpentry', 'Drywall', 'Painting'],
                                            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face'
                                        }
                                    ].map((member, index) => (
                                        <div key={index} style={{
                                            background: 'white',
                                            borderRadius: '16px',
                                            padding: '2rem',
                                            textAlign: 'center',
                                            boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                                            transition: 'transform 0.3s ease',
                                            border: '1px solid rgba(226, 232, 240, 0.5)'
                                        }}>
                                            <img
                                                src={member.image}
                                                alt={member.name}
                                                style={{
                                                    width: '120px',
                                                    height: '120px',
                                                    borderRadius: '50%',
                                                    objectFit: 'cover',
                                                    margin: '0 auto 1.5rem auto',
                                                    border: '4px solid #f1f5f9'
                                                }}
                                            />
                                            <h3 style={{ 
                                                fontSize: '1.3rem', 
                                                marginBottom: '0.5rem', 
                                                color: '#1a365e',
                                                fontWeight: '600'
                                            }}>
                                                {member.name}
                                            </h3>
                                            <p style={{ 
                                                color: '#FFD700', 
                                                fontWeight: '600',
                                                marginBottom: '0.5rem'
                                            }}>
                                                {member.title}
                                            </p>
                                            <p style={{ 
                                                color: '#64748b', 
                                                fontSize: '0.9rem',
                                                marginBottom: '1rem'
                                            }}>
                                                {member.experience}
                                            </p>
                                            <div style={{ 
                                                display: 'flex', 
                                                flexWrap: 'wrap', 
                                                gap: '0.5rem',
                                                justifyContent: 'center'
                                            }}>
                                                {member.specialties.map((specialty, i) => (
                                                    <span key={i} style={{
                                                        background: 'rgba(59, 130, 246, 0.1)',
                                                        color: '#3b82f6',
                                                        padding: '0.25rem 0.75rem',
                                                        borderRadius: '12px',
                                                        fontSize: '0.8rem',
                                                        fontWeight: '500'
                                                    }}>
                                                        {specialty}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* Certifications & Credentials */}
                        <section style={{ padding: '5rem 1rem', background: 'linear-gradient(135deg, #1a365e, #2c5282)' }}>
                            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                                    <h2 style={{ 
                                        fontSize: 'clamp(2rem, 4vw, 2.8rem)', 
                                        marginBottom: '1rem', 
                                        color: 'white',
                                        fontWeight: '700'
                                    }}>
                                        Licensed, Insured & Certified
                                    </h2>
                                    <p style={{ 
                                        fontSize: '1.2rem', 
                                        color: 'rgba(255,255,255,0.9)', 
                                        maxWidth: '600px', 
                                        margin: '0 auto'
                                    }}>
                                        Your peace of mind is our priority
                                    </p>
                                </div>

                                <div style={{ 
                                    display: 'grid', 
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                                    gap: '2rem',
                                    textAlign: 'center'
                                }}>
                                    {[
                                        { icon: Shield, title: 'Licensed Contractor', subtitle: 'State of Arizona' },
                                        { icon: Award, title: 'Fully Insured', subtitle: '$2M Liability Coverage' },
                                        { icon: CheckCircle, title: 'BBB Accredited', subtitle: 'A+ Rating' },
                                        { icon: Star, title: 'EPA Certified', subtitle: 'Environmental Safety' }
                                    ].map((cert, index) => {
                                        const IconComponent = cert.icon;
                                        return (
                                            <div key={index} style={{
                                                background: 'rgba(255,255,255,0.1)',
                                                padding: '2rem',
                                                borderRadius: '12px',
                                                backdropFilter: 'blur(10px)',
                                                border: '1px solid rgba(255,255,255,0.2)'
                                            }}>
                                                <IconComponent size={48} style={{ color: '#FFD700', marginBottom: '1rem' }} />
                                                <h3 style={{ color: 'white', marginBottom: '0.5rem', fontWeight: '600' }}>
                                                    {cert.title}
                                                </h3>
                                                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>
                                                    {cert.subtitle}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </section>
                    </div>
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
