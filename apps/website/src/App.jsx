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
    AlertTriangle,
    Palette,
    Sun,
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
    Settings2
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

  /* Professional Enhancements */
  @keyframes professionalSlideIn {
    from {
      opacity: 0;
      transform: translateY(10px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @keyframes tooltipPulse {
    0% { 
      box-shadow: 0 4px 20px rgba(26, 54, 94, 0.15);
    }
    50% { 
      box-shadow: 0 8px 30px rgba(26, 54, 94, 0.25);
    }
    100% { 
      box-shadow: 0 4px 20px rgba(26, 54, 94, 0.15);
    }
  }

  @keyframes gentleFloat {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-3px); }
  }

  .professional-card {
    background: linear-gradient(145deg, #ffffff, #f8fafc);
    border: 1px solid rgba(226, 232, 240, 0.8);
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .professional-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 40px rgba(0, 0, 0, 0.12);
    border-color: rgba(255, 215, 0, 0.3);
  }

  .chat-tooltip {
    animation: professionalSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    background: linear-gradient(135deg, #1a365e, #2c5aa0);
    color: white;
    padding: 12px 16px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 500;
    box-shadow: 0 8px 30px rgba(26, 54, 94, 0.3);
    position: relative;
    max-width: 220px;
    text-align: center;
    line-height: 1.4;
  }

  .chat-tooltip::before {
    content: '';
    position: absolute;
    bottom: -6px;
    right: 20px;
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid #1a365e;
  }

  .service-card-professional {
    background: linear-gradient(145deg, #ffffff, #f8fafc);
    border: 1px solid rgba(226, 232, 240, 0.6);
    border-radius: 20px;
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
  }

  .service-card-professional::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
    transition: left 0.6s;
  }

  .service-card-professional:hover::before {
    left: 100%;
  }

  .service-card-professional:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
    border-color: rgba(255, 215, 0, 0.4);
  }

  .quick-link-card {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .quick-link-card:hover {
    transform: translateY(-8px);
  }

  .quick-link-card:active {
    transform: translateY(-4px);
  }

  .quick-links-carousel::-webkit-scrollbar {
    height: 8px;
  }

  .quick-links-carousel::-webkit-scrollbar-track {
    background: rgba(226, 232, 240, 0.3);
    border-radius: 4px;
  }

  .quick-links-carousel::-webkit-scrollbar-thumb {
    background: linear-gradient(90deg, rgba(79, 70, 229, 0.6), rgba(124, 58, 237, 0.6));
    border-radius: 4px;
    transition: background 0.3s ease;
  }

  .quick-links-carousel::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(90deg, rgba(79, 70, 229, 0.8), rgba(124, 58, 237, 0.8));
  }

  @media (max-width: 768px) {
    .quick-links-carousel {
      scroll-snap-type: x mandatory;
    }
    
    .quick-link-card {
      scroll-snap-align: start;
      min-width: 160px;
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
    const [selectedServiceType, setSelectedServiceType] = useState('')

    // Intelligent form data with service-specific fields
    const [intelligentFormData, setIntelligentFormData] = useState({
        // Basic info
        name: '',
        email: '',
        phone: '',
        address: '',

        // Service-specific fields
        serviceType: '',
        urgency: 'medium',
        budget: '',
        timeline: '',
        projectDetails: '',

        // Smart Home specific
        currentSmartDevices: '',
        homeSize: '',
        techComfort: '',

        // Maintenance specific
        homeAge: '',
        lastMaintenance: '',
        preferredSchedule: '',
        maintenanceType: [],

        // Repair specific
        problemDescription: '',
        problemLocation: '',
        safetyIssue: '',
        photosAvailable: '',

        // Emergency specific
        emergencyType: '',
        immediateRisk: '',
        temporarySolution: '',
        availableNow: '',

        // Improvement specific
        improvementType: '',
        roomsAffected: '',
        designPreference: '',
        permitRequired: '',

        // Seasonal specific
        seasonalService: '',
        previouslyDone: '',
        equipmentAge: '',

        // Contact preferences
        preferredContact: 'phone',
        bestTimeToCall: '',
        specialRequests: ''
    })

    // Service-specific form fields configuration
    const getIntelligentFormFields = (serviceType) => {
        const baseFields = [
            { name: 'name', type: 'text', label: 'Full Name', required: true },
            { name: 'email', type: 'email', label: 'Email Address', required: true },
            { name: 'phone', type: 'tel', label: 'Phone Number', required: true },
            { name: 'address', type: 'text', label: 'Service Address', required: true }
        ]

        const serviceSpecificFields = {
            'smart-home': [
                { name: 'homeSize', type: 'select', label: 'Home Size', options: ['Under 1,500 sq ft', '1,500-2,500 sq ft', '2,500-4,000 sq ft', 'Over 4,000 sq ft'], required: true },
                { name: 'currentSmartDevices', type: 'textarea', label: 'Current Smart Devices (if any)', placeholder: 'List any smart home devices you currently have...' },
                { name: 'techComfort', type: 'select', label: 'Tech Comfort Level', options: ['Beginner', 'Intermediate', 'Advanced'], required: true },
                { name: 'budget', type: 'select', label: 'Budget Range', options: ['$1,000-$2,000', '$2,000-$4,000', '$4,000-$7,000', '$7,000+'], required: true },
                { name: 'timeline', type: 'select', label: 'Desired Timeline', options: ['ASAP', 'Within 2 weeks', 'Within 1 month', 'Within 3 months', 'Flexible'], required: true }
            ],
            'maintenance': [
                { name: 'homeAge', type: 'select', label: 'Home Age', options: ['Less than 5 years', '5-15 years', '15-30 years', 'Over 30 years'], required: true },
                { name: 'lastMaintenance', type: 'select', label: 'Last Professional Maintenance', options: ['Within 6 months', '6-12 months ago', '1-2 years ago', 'Over 2 years ago', 'Never'], required: true },
                { name: 'maintenanceType', type: 'checkbox', label: 'Areas of Focus', options: ['HVAC', 'Plumbing', 'Electrical', 'Exterior', 'Appliances', 'Smart Home Devices'] },
                { name: 'preferredSchedule', type: 'select', label: 'Preferred Schedule', options: ['Monthly', 'Quarterly', 'Bi-annually', 'As needed'], required: true }
            ],
            'home-repairs': [
                { name: 'problemDescription', type: 'textarea', label: 'Problem Description', placeholder: 'Describe the issue in detail...', required: true },
                { name: 'problemLocation', type: 'text', label: 'Location of Problem', placeholder: 'e.g., Kitchen sink, Master bedroom, Front door', required: true },
                { name: 'safetyIssue', type: 'select', label: 'Safety Concern Level', options: ['No safety risk', 'Minor safety concern', 'Moderate safety risk', 'Serious safety hazard'], required: true },
                { name: 'urgency', type: 'select', label: 'Urgency Level', options: ['Can wait weeks', 'Should fix soon', 'Need within days', 'Urgent/Emergency'], required: true },
                { name: 'photosAvailable', type: 'select', label: 'Can you provide photos?', options: ['Yes, will email photos', 'Yes, will text photos', 'No photos available'], required: true }
            ],
            'emergency': [
                { name: 'emergencyType', type: 'select', label: 'Emergency Type', options: ['Plumbing leak/flood', 'Electrical issue', 'Structural damage', 'Security/lock issue', 'HVAC failure', 'Other'], required: true },
                { name: 'immediateRisk', type: 'select', label: 'Immediate Risk Level', options: ['Property damage risk', 'Safety hazard', 'Security concern', 'Major inconvenience'], required: true },
                { name: 'temporarySolution', type: 'select', label: 'Temporary Solution Status', options: ['Issue contained', 'Partial containment', 'Cannot contain', 'Getting worse'], required: true },
                { name: 'availableNow', type: 'select', label: 'Available for service?', options: ['Available now', 'Available within 1 hour', 'Available within 2-4 hours', 'Need to schedule'], required: true },
                { name: 'problemDescription', type: 'textarea', label: 'Emergency Details', placeholder: 'Describe the emergency situation in detail...', required: true }
            ],
            'home-improvements': [
                { name: 'improvementType', type: 'select', label: 'Improvement Type', options: ['Kitchen remodel', 'Bathroom remodel', 'Room addition', 'Flooring', 'Painting', 'Custom carpentry', 'Other'], required: true },
                { name: 'roomsAffected', type: 'text', label: 'Rooms/Areas Affected', placeholder: 'e.g., Master bathroom, Kitchen and dining room', required: true },
                { name: 'budget', type: 'select', label: 'Budget Range', options: ['Under $5,000', '$5,000-$15,000', '$15,000-$30,000', '$30,000-$50,000', 'Over $50,000'], required: true },
                { name: 'timeline', type: 'select', label: 'Project Timeline', options: ['1-2 weeks', '1 month', '2-3 months', '3-6 months', 'Flexible'], required: true },
                { name: 'designPreference', type: 'select', label: 'Design Style', options: ['Modern', 'Traditional', 'Transitional', 'Rustic/Farmhouse', 'Contemporary', 'Not sure'], required: true },
                { name: 'permitRequired', type: 'select', label: 'Permits Needed?', options: ['Yes, I have permits', 'Yes, need help with permits', 'No permits needed', 'Not sure'], required: true }
            ],
            'seasonal': [
                { name: 'seasonalService', type: 'select', label: 'Seasonal Service Type', options: ['Spring preparation', 'Summer readiness', 'Fall maintenance', 'Winter protection', 'Year-round plan'], required: true },
                { name: 'previouslyDone', type: 'select', label: 'Previous Seasonal Service', options: ['Yes, with us', 'Yes, with others', 'DIY maintenance', 'Never done'], required: true },
                { name: 'equipmentAge', type: 'select', label: 'HVAC Equipment Age', options: ['Less than 5 years', '5-10 years', '10-15 years', 'Over 15 years', 'Not sure'], required: true },
                { name: 'timeline', type: 'select', label: 'Service Timeline', options: ['This week', 'Within 2 weeks', 'Within month', 'Flexible'], required: true }
            ]
        }

        const contactFields = [
            { name: 'preferredContact', type: 'select', label: 'Preferred Contact Method', options: ['Phone call', 'Text message', 'Email', 'Any method'], required: true },
            { name: 'bestTimeToCall', type: 'select', label: 'Best Time to Contact', options: ['Morning (8am-12pm)', 'Afternoon (12pm-5pm)', 'Evening (5pm-8pm)', 'Anytime'], required: true },
            { name: 'specialRequests', type: 'textarea', label: 'Additional Notes', placeholder: 'Any specific requirements or questions...' }
        ]

        return [...baseFields, ...(serviceSpecificFields[serviceType] || []), ...contactFields]
    }

    // Open intelligent lead form with specific service type
    const openIntelligentForm = (serviceType = '') => {
        setSelectedServiceType(serviceType)
        setIntelligentFormData({
            ...intelligentFormData,
            serviceType: serviceType
        })
        setLeadFormModal('intelligent')
    }

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

Exterior Painting Touch-ups: The intense UV radiation in Arizona fades and damages exterior paint faster than in most climates. Touch up any areas where paint is peeling or fading to protect underlying materials from sun and moisture damage.

**Summer Preparations**

Pool Equipment Maintenance: If you have a pool, ensure all equipment is functioning properly before peak swimming season. Check filters, pumps, and chemical levels regularly.

Landscape Irrigation: Adjust sprinkler systems for increased water needs and check for leaks or broken sprinkler heads that waste water and money.

**Year-Round Vigilance**

Regular professional inspections can catch small problems before they become expensive repairs. Our team at Scottsdale Handyman Solutions provides comprehensive home maintenance services tailored to Arizona's unique climate challenges.`,
            author: "The Scottsdale Handyman",
            date: "January 15, 2025",
            category: "Maintenance",
            readTime: "8 min read",
            image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
            featured: true,
            tags: ["scottsdale", "maintenance", "arizona", "desert"],
            seoKeywords: ["Scottsdale home maintenance", "Arizona desert home care", "monsoon preparation", "HVAC maintenance Scottsdale"]
        },
        {
            id: 2,
            title: "Smart Home Upgrades That Add Value",
            excerpt: "Discover which smart home improvements offer the best return on investment in today's market.",
            content: `In today's technology-driven world, smart home upgrades aren't just conveniences—they're investments that can significantly increase your property value and improve your daily life.

**High-ROI Smart Home Upgrades**

Smart Thermostats: A programmable smart thermostat can save you 10-15% on heating and cooling costs. In Arizona's extreme climate, this translates to substantial savings. Models like Nest or Ecobee learn your preferences and adjust automatically.

Smart Security Systems: Modern security systems with cameras, smart locks, and doorbell cameras provide peace of mind and are highly attractive to potential buyers. Ring, ADT, and SimpliSafe offer excellent options that integrate with smartphones.

Smart Lighting: LED smart bulbs and switches allow you to control lighting remotely, set schedules, and even change colors. This upgrade is relatively inexpensive but adds a modern touch that buyers love.

**Advanced Smart Features**

Smart Water Management: In water-conscious Arizona, smart irrigation systems and leak detectors are particularly valuable. They can prevent costly water damage and reduce utility bills.

Voice Assistants Integration: Amazon Alexa or Google Home hubs that control multiple smart devices create a seamless, futuristic living experience.

**Professional Installation Benefits**

While some smart devices are DIY-friendly, professional installation ensures optimal performance and warranty protection. Our team can help you choose and install the right smart home upgrades for your specific needs and budget.`,
            author: "The Scottsdale Handyman",
            date: "January 10, 2025",
            category: "Technology",
            readTime: "6 min read",
            image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&h=600&fit=crop",
            featured: false,
            tags: ["smart home", "technology", "roi", "value"],
            seoKeywords: ["smart home Scottsdale", "home automation", "property value increase", "smart thermostat installation"]
        },
        {
            id: 3,
            title: "Emergency Repairs Every Homeowner Should Know",
            excerpt: "Quick fixes that can prevent major damage while you wait for professional help.",
            content: `Home emergencies never happen at convenient times. Knowing how to handle common emergency situations can prevent extensive damage and save you thousands of dollars while you wait for professional help.

**Water Emergencies**

Burst Pipes: First, shut off the main water supply immediately. This valve is usually located near the water meter or where the main line enters your home. Remove water with mops and buckets, and use fans to start drying the area.

Toilet Overflow: Turn off the water supply valve behind the toilet (clockwise). If you can't reach it, remove the toilet tank lid and push the flapper down to stop water flow.

Water Heater Leaks: Turn off both the water supply to the heater and the electrical/gas supply. For gas heaters, turn the gas valve to "pilot" or "off." For electric, flip the circuit breaker.

**Electrical Emergencies**

Power Outages: Reset circuit breakers by switching them completely off, then back on. If this doesn't work, check with neighbors to determine if it's a neighborhood issue.

Sparking Outlets: Turn off power to that outlet at the circuit breaker immediately. Never touch the outlet with wet hands or metal objects.

**HVAC Emergencies**

No Air Conditioning: Check your air filter first—a clogged filter is the most common cause. Also verify the thermostat settings and check for tripped circuit breakers.

Strange Noises: Turn off your HVAC system immediately if you hear grinding, squealing, or banging sounds. Continuing to run the system could cause expensive damage.

**When to Call Professionals**

While these temporary fixes can prevent immediate damage, always call qualified professionals for permanent repairs. Our emergency response team is available 24/7 for Scottsdale area emergencies.`,
            author: "The Scottsdale Handyman",
            date: "January 5, 2025",
            category: "Emergency",
            readTime: "7 min read",
            image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=600&fit=crop",
            featured: false,
            tags: ["emergency", "repairs", "diy", "water damage"],
            seoKeywords: ["emergency repairs Scottsdale", "burst pipe repair", "HVAC emergency", "24/7 handyman"]
        },
        {
            id: 4,
            title: "Preparing Your Phoenix-Area Home for Arizona's Monsoon Season",
            excerpt: "Essential preparations for monsoon season across Phoenix, Tempe, Mesa, and Scottsdale to protect your home from summer storms.",
            content: `Arizona's monsoon season from June through September brings dramatic weather changes to the Valley of the Sun. From Scottsdale to Mesa, from Tempe to Chandler, homeowners need to prepare for intense thunderstorms, flash flooding, and damaging winds.

**Pre-Monsoon Home Checklist**

Roof and Gutter Maintenance: The combination of extreme heat and sudden heavy rains can expose roof vulnerabilities. Inspect tile roofs common in Scottsdale and Paradise Valley for loose or cracked tiles. Clean gutters and downspouts thoroughly—many Phoenix-area homes have minimal guttering that can quickly overwhelm during sudden downpours.

Tree Trimming and Yard Preparation: Desert landscaping requires special attention before monsoon season. Trim mesquite, palo verde, and other desert trees to remove dead branches that could become projectiles in high winds. Secure outdoor furniture and decorative elements common in Southwestern home designs.

Pool Area Safety: Most Scottsdale and Phoenix homes have pools that require monsoon preparation. Ensure pool equipment is properly grounded and electrical connections are protected. Check pool decking for loose pavers or tiles that strong winds could dislodge.

**Electrical System Protection**

GFCI Outlets: Arizona's sudden temperature changes and moisture can stress electrical systems. Ensure all outdoor outlets and those near water sources have GFCI protection. This is especially important for homes in areas like Ahwatukee and Desert Ridge with extensive outdoor living spaces.

Surge Protection: Lightning strikes are common during monsoons. Install whole-house surge protectors to protect expensive electronics and smart home systems popular in upscale Scottsdale neighborhoods.

**Flooding Prevention**

Drainage Systems: Many Phoenix-area communities were built on ancient washes and flood plains. Ensure your property's drainage directs water away from your foundation. This is particularly crucial in areas like Tempe and Mesa where flash flooding can occur rapidly.

Basement and Lower Level Protection: Though less common, homes with basements in areas like Carefree and Cave Creek need special attention to prevent water intrusion during intense storms.

**Professional Monsoon Preparation**

Our team provides comprehensive monsoon preparation services throughout the Phoenix metropolitan area. We understand the unique challenges facing homeowners from Fountain Hills to Glendale and can help protect your investment before storm season arrives.`,
            author: "Arizona Home Experts",
            date: "July 20, 2025",
            category: "Weather Preparation",
            readTime: "9 min read",
            image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
            featured: true,
            tags: ["monsoon", "phoenix", "tempe", "mesa", "chandler", "storm preparation"],
            seoKeywords: ["Phoenix monsoon preparation", "Arizona storm damage prevention", "Scottsdale weather protection", "Mesa flood prevention"]
        },
        {
            id: 5,
            title: "Energy-Efficient Home Improvements for Arizona's Extreme Heat",
            excerpt: "Beat the heat and reduce energy bills with these proven upgrades perfect for Scottsdale, Paradise Valley, and surrounding desert communities.",
            content: `Living in the Sonoran Desert means facing some of the nation's highest energy bills. From Scottsdale's luxury communities to Tempe's family neighborhoods, Arizona homeowners can implement proven strategies to reduce cooling costs and improve comfort during our intense summer months.

**Insulation Upgrades for Desert Homes**

Attic Insulation: Many homes in established Scottsdale and Phoenix neighborhoods have inadequate attic insulation. Upgrading to R-38 or higher can reduce cooling costs by 15-25%. Radiant barrier insulation is particularly effective in Arizona's intense solar conditions.

Wall Insulation: Older homes in areas like Central Phoenix and Tempe often lack proper wall insulation. Blown-in insulation can dramatically improve comfort and energy efficiency without major renovation.

Window Treatments: The large windows popular in Southwestern architecture can be energy liabilities. Installing cellular shades, solar screens, or window film can reduce heat gain by up to 70%. This is especially important for west-facing windows common in Paradise Valley homes.

**HVAC System Optimization**

High-Efficiency Systems: With cooling costs representing 60-70% of summer energy bills in Phoenix-area homes, upgrading to a high-efficiency HVAC system pays for itself quickly. Look for systems with SEER ratings of 16 or higher.

Ductwork Sealing: Leaky ducts can waste 30% of your cooling energy. Professional duct sealing is particularly important in two-story homes common in Ahwatukee and Chandler where ducts run through hot attic spaces.

Smart Thermostats: Programmable thermostats can save 10-15% on cooling costs by automatically adjusting temperatures when you're away. This is especially valuable for snowbirds with homes in Fountain Hills or Cave Creek.

**Exterior Improvements**

Cool Roofing: Dark roofs absorb tremendous heat in Arizona's intense sun. Light-colored or reflective roofing materials can reduce attic temperatures by 30-50 degrees. This is crucial for tile roofs common in Scottsdale and desert tile popular throughout the Valley.

Shade Structures: Strategically placed shade structures can reduce cooling costs and create comfortable outdoor spaces. Pergolas, ramadas, and shade sails are popular additions to Scottsdale and Paradise Valley homes.

Landscape Design: Desert landscaping with native plants requires less water and creates natural cooling through evapotranspiration. Strategic tree placement can shade your home's most vulnerable surfaces.

**Professional Energy Audits**

Our certified energy specialists provide comprehensive home energy audits throughout the Phoenix metropolitan area. We understand the unique challenges of desert living and can recommend the most cost-effective improvements for your specific home and neighborhood.`,
            author: "Desert Energy Solutions",
            date: "July 18, 2025",
            category: "Energy Efficiency",
            readTime: "10 min read",
            image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop",
            featured: false,
            tags: ["energy efficiency", "scottsdale", "paradise valley", "cooling costs", "insulation"],
            seoKeywords: ["energy efficient homes Arizona", "reduce cooling costs Scottsdale", "Phoenix HVAC upgrades", "desert home insulation"]
        },
        {
            id: 6,
            title: "Outdoor Living Spaces: Making the Most of Arizona's Beautiful Weather",
            excerpt: "Design and maintenance tips for creating stunning outdoor spaces in Fountain Hills, Cave Creek, and throughout the Phoenix area.",
            content: `Arizona's 330+ days of sunshine make outdoor living spaces essential for enjoying our incredible climate. From intimate patios in Central Scottsdale to expansive entertainment areas in Paradise Valley, well-designed outdoor spaces extend your living area and increase property value.

**Popular Outdoor Features by Area**

Scottsdale Style: Luxury communities favor sophisticated outdoor kitchens with built-in grills, refrigeration, and elegant lighting. Natural stone and stucco complement the Southwestern aesthetic while providing durability in desert conditions.

Cave Creek Character: This rustic community embraces outdoor spaces that blend with the natural desert landscape. Fire pits, natural stone seating areas, and drought-resistant landscaping create authentic Southwestern ambiance.

Fountain Hills Elegance: Known for stunning mountain views, Fountain Hills homes often feature raised decks and multi-level patios to maximize vista potential. Shade structures are essential for afternoon comfort.

Tempe Family Spaces: University town families prioritize functional outdoor spaces with durable materials that can handle active lifestyles. Concrete patios with decorative overlays provide low-maintenance elegance.

**Essential Design Elements**

Shade Solutions: Arizona's intense sun makes shade critical for outdoor comfort. Popular options include:
- Solid roof pergolas for year-round protection
- Shade sails for flexible coverage
- Retractable awnings for adaptable spaces
- Strategic tree placement for natural cooling

Cooling Features: Beat the heat with these popular additions:
- Misting systems for immediate relief
- Water features for evaporative cooling
- Ceiling fans in covered areas
- Strategic ventilation for air circulation

**Material Considerations for Desert Conditions**

Flooring Options: Choose materials that handle extreme temperature swings:
- Natural stone remains cooler underfoot
- Textured concrete prevents slipping and reduces glare
- Pavers allow for thermal expansion
- Avoid dark colors that absorb excessive heat

Furniture Selection: Invest in pieces designed for desert conditions:
- Powder-coated aluminum resists corrosion
- Solution-dyed fabrics resist UV fading
- Quick-dry cushions handle unexpected rain
- Weighted umbrellas withstand desert winds

**Maintenance in Desert Conditions**

Dust Management: Regular cleaning prevents dust buildup on surfaces and furniture. Sealed concrete and stone require minimal maintenance compared to wood alternatives.

UV Protection: Apply UV-resistant finishes to prevent fading and deterioration. This is especially important for furniture and decorative elements.

Water Conservation: Design irrigation systems that efficiently water plants while conserving this precious resource. Drip irrigation and smart controllers are popular in water-conscious communities like Fountain Hills.

**Professional Design Services**

Our design team understands the unique requirements of outdoor living in the Sonoran Desert. From concept to completion, we create outdoor spaces that enhance your lifestyle while withstanding Arizona's challenging climate conditions.`,
            author: "Outdoor Living Specialists",
            date: "July 15, 2025",
            category: "Outdoor Living",
            readTime: "8 min read",
            image: "https://images.unsplash.com/photo-1519475889208-a35a1c5b6de8?w=800&h=600&fit=crop",
            featured: false,
            tags: ["outdoor living", "patios", "scottsdale", "cave creek", "fountain hills", "desert landscaping"],
            seoKeywords: ["outdoor living Scottsdale", "patio design Arizona", "desert outdoor kitchens", "Paradise Valley outdoor spaces"]
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

    // Handle intelligent form submission
    const handleIntelligentFormSubmit = async (e) => {
        e.preventDefault()

        try {
            const formData = new FormData(e.target)

            // Build comprehensive lead data
            const leadData = {
                // Basic information
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                address: formData.get('address'),

                // Service details
                serviceType: selectedServiceType,

                // Collect all form fields
                ...Object.fromEntries(formData.entries()),

                // Metadata
                source: 'intelligent_form',
                leadScore: calculateLeadScore(formData, selectedServiceType),
                submittedAt: new Date().toLocaleString(),
                formType: selectedServiceType
            }

            // Send to backend
            const response = await fetch('/api/submit-lead', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(leadData),
            })

            if (response.ok) {
                // Show success page
                setSubmittedFormData({
                    type: 'intelligent_lead',
                    data: leadData
                })
                setShowSuccessPage(true)
                setLeadFormModal(null)

                // Reset form
                setIntelligentFormData({
                    name: '', email: '', phone: '', address: '', serviceType: '',
                    urgency: 'medium', budget: '', timeline: '', projectDetails: '',
                    currentSmartDevices: '', homeSize: '', techComfort: '',
                    homeAge: '', lastMaintenance: '', preferredSchedule: '', maintenanceType: [],
                    problemDescription: '', problemLocation: '', safetyIssue: '', photosAvailable: '',
                    emergencyType: '', immediateRisk: '', temporarySolution: '', availableNow: '',
                    improvementType: '', roomsAffected: '', designPreference: '', permitRequired: '',
                    seasonalService: '', previouslyDone: '', equipmentAge: '',
                    preferredContact: 'phone', bestTimeToCall: '', specialRequests: ''
                })

                setTimeout(() => {
                    setShowSuccessPage(false)
                    setSubmittedFormData(null)
                }, 5000)

            } else {
                const errorData = await response.json()
                alert('Error submitting lead: ' + (errorData.error || 'Please try again.'))
            }
        } catch (error) {
            console.error('Error:', error)
            alert('Error submitting lead. Please try again or call (480) 255-5887.')
        }
    }

    // Calculate lead score based on form responses
    const calculateLeadScore = (formData, serviceType) => {
        let score = 50 // Base score

        // Budget scoring
        const budget = formData.get('budget')
        if (budget) {
            if (budget.includes('7,000+') || budget.includes('50,000+')) score += 30
            else if (budget.includes('4,000-7,000') || budget.includes('30,000-50,000')) score += 20
            else if (budget.includes('2,000-4,000') || budget.includes('15,000-30,000')) score += 15
            else score += 10
        }

        // Timeline scoring (sooner = higher score)
        const timeline = formData.get('timeline')
        if (timeline) {
            if (timeline.includes('ASAP') || timeline.includes('This week')) score += 25
            else if (timeline.includes('2 weeks') || timeline.includes('1 month')) score += 15
            else if (timeline.includes('Within month')) score += 10
            else score += 5
        }

        // Urgency scoring
        const urgency = formData.get('urgency')
        if (urgency) {
            if (urgency.includes('Urgent') || urgency.includes('Emergency')) score += 25
            else if (urgency.includes('days')) score += 15
            else if (urgency.includes('soon')) score += 10
            else score += 5
        }

        // Service-specific scoring
        if (serviceType === 'emergency') score += 40
        else if (serviceType === 'smart-home') score += 20
        else if (serviceType === 'home-improvements') score += 15
        else if (serviceType === 'maintenance') score += 10

        return Math.min(score, 100) // Cap at 100
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

                        {/* Professional Quick Links Carousel */}
                        <section style={{
                            padding: '3rem 0',
                            background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.02) 0%, rgba(124, 58, 237, 0.02) 100%)',
                            borderTop: '1px solid rgba(226, 232, 240, 0.5)',
                            borderBottom: '1px solid rgba(226, 232, 240, 0.5)',
                            overflow: 'hidden'
                        }}>
                            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
                                <h2 style={{
                                    fontSize: '1.8rem',
                                    textAlign: 'center',
                                    marginBottom: '2.5rem',
                                    color: '#1a365e',
                                    fontWeight: '600',
                                    letterSpacing: '-0.5px'
                                }}>
                                    Quick Access
                                </h2>
                                <div style={{
                                    display: 'flex',
                                    gap: '1.5rem',
                                    overflowX: 'auto',
                                    scrollBehavior: 'smooth',
                                    paddingBottom: '1rem',
                                    scrollbarWidth: 'thin',
                                    scrollbarColor: 'rgba(79, 70, 229, 0.3) transparent'
                                }}
                                    className="quick-links-carousel">
                                    {/* Schedule Service */}
                                    <div className="quick-link-card" style={{
                                        background: 'white',
                                        borderRadius: '16px',
                                        padding: '2rem 1.5rem',
                                        textAlign: 'center',
                                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                                        border: '1px solid rgba(226, 232, 240, 0.8)',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        minWidth: '180px',
                                        flexShrink: 0
                                    }}
                                        onClick={() => openLeadForm('quote')}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-8px)';
                                            e.currentTarget.style.boxShadow = '0 12px 40px rgba(79, 70, 229, 0.15)';
                                            e.currentTarget.style.borderColor = 'rgba(79, 70, 229, 0.3)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
                                            e.currentTarget.style.borderColor = 'rgba(226, 232, 240, 0.8)';
                                        }}>
                                        <div style={{
                                            position: 'absolute',
                                            top: '-10px',
                                            right: '-10px',
                                            width: '60px',
                                            height: '60px',
                                            background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.1), rgba(79, 70, 229, 0.2))',
                                            borderRadius: '50%',
                                            zIndex: 0
                                        }}></div>
                                        <Calendar size={32} style={{
                                            color: '#4f46e5',
                                            marginBottom: '1rem',
                                            position: 'relative',
                                            zIndex: 1
                                        }} />
                                        <h3 style={{
                                            fontSize: '1.1rem',
                                            color: '#1a365e',
                                            marginBottom: '0.5rem',
                                            fontWeight: '600',
                                            position: 'relative',
                                            zIndex: 1
                                        }}>Schedule Service</h3>
                                        <p style={{
                                            color: '#64748b',
                                            fontSize: '0.9rem',
                                            lineHeight: '1.4',
                                            position: 'relative',
                                            zIndex: 1
                                        }}>Book your appointment</p>
                                    </div>

                                    {/* Emergency Service */}
                                    <div className="quick-link-card" style={{
                                        background: 'white',
                                        borderRadius: '16px',
                                        padding: '2rem 1.5rem',
                                        textAlign: 'center',
                                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                                        border: '1px solid rgba(226, 232, 240, 0.8)',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        minWidth: '180px',
                                        flexShrink: 0
                                    }}
                                        onClick={() => openLeadForm('emergency')}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-8px)';
                                            e.currentTarget.style.boxShadow = '0 12px 40px rgba(220, 38, 38, 0.15)';
                                            e.currentTarget.style.borderColor = 'rgba(220, 38, 38, 0.3)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
                                            e.currentTarget.style.borderColor = 'rgba(226, 232, 240, 0.8)';
                                        }}>
                                        <div style={{
                                            position: 'absolute',
                                            top: '-10px',
                                            right: '-10px',
                                            width: '60px',
                                            height: '60px',
                                            background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.1), rgba(220, 38, 38, 0.2))',
                                            borderRadius: '50%',
                                            zIndex: 0
                                        }}></div>
                                        <AlertTriangle size={32} style={{
                                            color: '#dc2626',
                                            marginBottom: '1rem',
                                            position: 'relative',
                                            zIndex: 1
                                        }} />
                                        <h3 style={{
                                            fontSize: '1.1rem',
                                            color: '#1a365e',
                                            marginBottom: '0.5rem',
                                            fontWeight: '600',
                                            position: 'relative',
                                            zIndex: 1
                                        }}>Emergency Service</h3>
                                        <p style={{
                                            color: '#64748b',
                                            fontSize: '0.9rem',
                                            lineHeight: '1.4',
                                            position: 'relative',
                                            zIndex: 1
                                        }}>24/7 urgent repairs</p>
                                    </div>

                                    {/* View Services */}
                                    <div className="quick-link-card" style={{
                                        background: 'white',
                                        borderRadius: '16px',
                                        padding: '2rem 1.5rem',
                                        textAlign: 'center',
                                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                                        border: '1px solid rgba(226, 232, 240, 0.8)',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        minWidth: '180px',
                                        flexShrink: 0
                                    }}
                                        onClick={() => setCurrentPage('services')}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-8px)';
                                            e.currentTarget.style.boxShadow = '0 12px 40px rgba(34, 197, 94, 0.15)';
                                            e.currentTarget.style.borderColor = 'rgba(34, 197, 94, 0.3)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
                                            e.currentTarget.style.borderColor = 'rgba(226, 232, 240, 0.8)';
                                        }}>
                                        <div style={{
                                            position: 'absolute',
                                            top: '-10px',
                                            right: '-10px',
                                            width: '60px',
                                            height: '60px',
                                            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(34, 197, 94, 0.2))',
                                            borderRadius: '50%',
                                            zIndex: 0
                                        }}></div>
                                        <Wrench size={32} style={{
                                            color: '#22c55e',
                                            marginBottom: '1rem',
                                            position: 'relative',
                                            zIndex: 1
                                        }} />
                                        <h3 style={{
                                            fontSize: '1.1rem',
                                            color: '#1a365e',
                                            marginBottom: '0.5rem',
                                            fontWeight: '600',
                                            position: 'relative',
                                            zIndex: 1
                                        }}>View Services</h3>
                                        <p style={{
                                            color: '#64748b',
                                            fontSize: '0.9rem',
                                            lineHeight: '1.4',
                                            position: 'relative',
                                            zIndex: 1
                                        }}>All our offerings</p>
                                    </div>

                                    {/* Read Blog */}
                                    <div className="quick-link-card" style={{
                                        background: 'white',
                                        borderRadius: '16px',
                                        padding: '2rem 1.5rem',
                                        textAlign: 'center',
                                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                                        border: '1px solid rgba(226, 232, 240, 0.8)',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        minWidth: '180px',
                                        flexShrink: 0
                                    }}
                                        onClick={() => setCurrentPage('blog')}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-8px)';
                                            e.currentTarget.style.boxShadow = '0 12px 40px rgba(168, 85, 247, 0.15)';
                                            e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.3)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
                                            e.currentTarget.style.borderColor = 'rgba(226, 232, 240, 0.8)';
                                        }}>
                                        <div style={{
                                            position: 'absolute',
                                            top: '-10px',
                                            right: '-10px',
                                            width: '60px',
                                            height: '60px',
                                            background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(168, 85, 247, 0.2))',
                                            borderRadius: '50%',
                                            zIndex: 0
                                        }}></div>
                                        <FileText size={32} style={{
                                            color: '#a855f7',
                                            marginBottom: '1rem',
                                            position: 'relative',
                                            zIndex: 1
                                        }} />
                                        <h3 style={{
                                            fontSize: '1.1rem',
                                            color: '#1a365e',
                                            marginBottom: '0.5rem',
                                            fontWeight: '600',
                                            position: 'relative',
                                            zIndex: 1
                                        }}>Read Blog</h3>
                                        <p style={{
                                            color: '#64748b',
                                            fontSize: '0.9rem',
                                            lineHeight: '1.4',
                                            position: 'relative',
                                            zIndex: 1
                                        }}>Tips & insights</p>
                                    </div>

                                    {/* Pro Portal */}
                                    <div className="quick-link-card" style={{
                                        background: 'white',
                                        borderRadius: '16px',
                                        padding: '2rem 1.5rem',
                                        textAlign: 'center',
                                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                                        border: '1px solid rgba(226, 232, 240, 0.8)',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        minWidth: '180px',
                                        flexShrink: 0
                                    }}
                                        onClick={() => window.open(import.meta.env.VITE_PRO_PORTAL_URL || "https://scottsdale-handyman-pro-portal.onrender.com", '_blank')}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-8px)';
                                            e.currentTarget.style.boxShadow = '0 12px 40px rgba(59, 130, 246, 0.15)';
                                            e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
                                            e.currentTarget.style.borderColor = 'rgba(226, 232, 240, 0.8)';
                                        }}>
                                        <div style={{
                                            position: 'absolute',
                                            top: '-10px',
                                            right: '-10px',
                                            width: '60px',
                                            height: '60px',
                                            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.2))',
                                            borderRadius: '50%',
                                            zIndex: 0
                                        }}></div>
                                        <Lock size={32} style={{
                                            color: '#3b82f6',
                                            marginBottom: '1rem',
                                            position: 'relative',
                                            zIndex: 1
                                        }} />
                                        <h3 style={{
                                            fontSize: '1.1rem',
                                            color: '#1a365e',
                                            marginBottom: '0.5rem',
                                            fontWeight: '600',
                                            position: 'relative',
                                            zIndex: 1
                                        }}>Pro Portal</h3>
                                        <p style={{
                                            color: '#64748b',
                                            fontSize: '0.9rem',
                                            lineHeight: '1.4',
                                            position: 'relative',
                                            zIndex: 1
                                        }}>Professional access</p>
                                    </div>

                                    {/* Pay Invoice */}
                                    <div className="quick-link-card" style={{
                                        background: 'white',
                                        borderRadius: '16px',
                                        padding: '2rem 1.5rem',
                                        textAlign: 'center',
                                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                                        border: '1px solid rgba(226, 232, 240, 0.8)',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        minWidth: '180px',
                                        flexShrink: 0
                                    }}
                                        onClick={() => setCurrentPage('pay')}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-8px)';
                                            e.currentTarget.style.boxShadow = '0 12px 40px rgba(245, 158, 11, 0.15)';
                                            e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.3)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
                                            e.currentTarget.style.borderColor = 'rgba(226, 232, 240, 0.8)';
                                        }}>
                                        <div style={{
                                            position: 'absolute',
                                            top: '-10px',
                                            right: '-10px',
                                            width: '60px',
                                            height: '60px',
                                            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(245, 158, 11, 0.2))',
                                            borderRadius: '50%',
                                            zIndex: 0
                                        }}></div>
                                        <CreditCard size={32} style={{
                                            color: '#f59e0b',
                                            marginBottom: '1rem',
                                            position: 'relative',
                                            zIndex: 1
                                        }} />
                                        <h3 style={{
                                            fontSize: '1.1rem',
                                            color: '#1a365e',
                                            marginBottom: '0.5rem',
                                            fontWeight: '600',
                                            position: 'relative',
                                            zIndex: 1
                                        }}>Pay Invoice</h3>
                                        <p style={{
                                            color: '#64748b',
                                            fontSize: '0.9rem',
                                            lineHeight: '1.4',
                                            position: 'relative',
                                            zIndex: 1
                                        }}>Secure payments</p>
                                    </div>
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

                                    {/* Emergency Repairs - Professional Version */}
                                    <div className="service-card-professional" style={{
                                        padding: '2.5rem',
                                        background: 'linear-gradient(135deg, rgba(220, 53, 69, 0.05), rgba(220, 53, 69, 0.1))',
                                        position: 'relative',
                                        zIndex: 1
                                    }}>
                                        <div style={{
                                            position: 'absolute',
                                            top: '-20px',
                                            right: '-20px',
                                            width: '120px',
                                            height: '120px',
                                            background: 'linear-gradient(135deg, rgba(220, 53, 69, 0.1), rgba(220, 53, 69, 0.2))',
                                            borderRadius: '50%',
                                            zIndex: -1,
                                            animation: 'gentleFloat 3s ease-in-out infinite'
                                        }}></div>
                                        <div style={{ position: 'relative', zIndex: 2 }}>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                marginBottom: '1.5rem'
                                            }}>
                                                <AlertTriangle size={52} style={{
                                                    color: '#dc3545',
                                                    filter: 'drop-shadow(0 4px 8px rgba(220, 53, 69, 0.3))'
                                                }} />
                                                <span style={{
                                                    background: 'linear-gradient(135deg, #dc3545, #c82333)',
                                                    color: 'white',
                                                    padding: '0.5rem 1rem',
                                                    borderRadius: '25px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 'bold',
                                                    letterSpacing: '0.5px',
                                                    boxShadow: '0 4px 15px rgba(220, 53, 69, 0.3)',
                                                    animation: 'tooltipPulse 2s ease-in-out infinite'
                                                }}>24/7 AVAILABLE</span>
                                            </div>
                                            <h3 style={{
                                                fontSize: '1.6rem',
                                                marginBottom: '1rem',
                                                color: '#1a365e',
                                                fontWeight: 'bold',
                                                letterSpacing: '-0.5px'
                                            }}>Emergency Repairs</h3>
                                            <p style={{
                                                color: '#64748b',
                                                lineHeight: '1.7',
                                                marginBottom: '2rem',
                                                fontSize: '1rem'
                                            }}>
                                                Urgent repairs that can't wait. Available 24/7 for plumbing leaks, electrical issues, and safety hazards.
                                            </p>
                                            <button
                                                onClick={() => openIntelligentForm('emergency')}
                                                className="quick-action-btn"
                                                style={{
                                                    background: 'linear-gradient(135deg, #dc3545, #c82333)',
                                                    color: 'white',
                                                    border: 'none',
                                                    padding: '1rem 2rem',
                                                    borderRadius: '12px',
                                                    cursor: 'pointer',
                                                    fontSize: '1rem',
                                                    fontWeight: '600',
                                                    width: '100%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '0.75rem',
                                                    boxShadow: '0 6px 25px rgba(220, 53, 69, 0.3)',
                                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                                }}
                                            >
                                                <Phone size={20} />
                                                Get Emergency Help
                                            </button>
                                        </div>
                                    </div>

                                    {/* Smart Home Solutions */}
                                    <div style={{
                                        padding: '2rem',
                                        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(59, 130, 246, 0.1))',
                                        borderRadius: '12px',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                        border: '2px solid rgba(59, 130, 246, 0.2)',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}>
                                        <div style={{
                                            position: 'absolute',
                                            top: '-30px',
                                            left: '-30px',
                                            width: '120px',
                                            height: '120px',
                                            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.2))',
                                            borderRadius: '50%',
                                            zIndex: 0
                                        }}></div>
                                        <div style={{ position: 'relative', zIndex: 1 }}>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '1rem',
                                                marginBottom: '1rem'
                                            }}>
                                                <Smartphone size={48} style={{ color: '#3b82f6' }} />
                                                <span style={{
                                                    background: '#3b82f6',
                                                    color: 'white',
                                                    padding: '0.25rem 0.75rem',
                                                    borderRadius: '20px',
                                                    fontSize: '0.8rem',
                                                    fontWeight: 'bold'
                                                }}>TRENDING</span>
                                            </div>
                                            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#1a365e' }}>Smart Home Solutions</h3>
                                            <p style={{ color: '#64748b', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                                                Modern automation for security, lighting, climate control, and entertainment systems.
                                            </p>
                                            <button
                                                onClick={() => openIntelligentForm('smart-home')}
                                                style={{
                                                    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    padding: '0.75rem 1.5rem',
                                                    cursor: 'pointer',
                                                    width: '100%',
                                                    fontWeight: '600',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '0.5rem'
                                                }}
                                            >
                                                <Zap size={18} />
                                                Get Smart Home Quote
                                            </button>
                                        </div>
                                    </div>

                                    {/* Home Repairs */}
                                    <div style={{
                                        padding: '2rem',
                                        background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.05), rgba(255, 165, 0, 0.1))',
                                        borderRadius: '12px',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                        border: '2px solid rgba(255, 215, 0, 0.3)',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}>
                                        <div style={{
                                            position: 'absolute',
                                            bottom: '-40px',
                                            right: '-40px',
                                            width: '150px',
                                            height: '150px',
                                            background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 165, 0, 0.2))',
                                            borderRadius: '50%',
                                            zIndex: 0
                                        }}></div>
                                        <div style={{ position: 'relative', zIndex: 1 }}>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '1rem',
                                                marginBottom: '1rem'
                                            }}>
                                                <Wrench size={48} style={{ color: '#FFD700' }} />
                                                <span style={{
                                                    background: '#FFD700',
                                                    color: '#000',
                                                    padding: '0.25rem 0.75rem',
                                                    borderRadius: '20px',
                                                    fontSize: '0.8rem',
                                                    fontWeight: 'bold'
                                                }}>MOST POPULAR</span>
                                            </div>
                                            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#1a365e' }}>Home Repairs</h3>
                                            <p style={{ color: '#64748b', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                                                Quick fixes, plumbing, electrical, and maintenance to keep your home in perfect condition.
                                            </p>
                                            <button
                                                onClick={() => openIntelligentForm('home-repairs')}
                                                style={{
                                                    background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                                                    color: '#000',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    padding: '0.75rem 1.5rem',
                                                    cursor: 'pointer',
                                                    width: '100%',
                                                    fontWeight: '600',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '0.5rem'
                                                }}
                                            >
                                                <Wrench size={18} />
                                                Get Repair Quote
                                            </button>
                                        </div>
                                    </div>

                                    {/* Maintenance Plans */}
                                    <div style={{
                                        padding: '2rem',
                                        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05), rgba(16, 185, 129, 0.1))',
                                        borderRadius: '12px',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                        border: '2px solid rgba(16, 185, 129, 0.2)',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}>
                                        <div style={{
                                            position: 'absolute',
                                            top: '50%',
                                            left: '-50px',
                                            width: '100px',
                                            height: '100px',
                                            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.2))',
                                            borderRadius: '50%',
                                            zIndex: 0
                                        }}></div>
                                        <div style={{ position: 'relative', zIndex: 1 }}>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '1rem',
                                                marginBottom: '1rem'
                                            }}>
                                                <Calendar size={48} style={{ color: '#10b981' }} />
                                                <span style={{
                                                    background: '#10b981',
                                                    color: 'white',
                                                    padding: '0.25rem 0.75rem',
                                                    borderRadius: '20px',
                                                    fontSize: '0.8rem',
                                                    fontWeight: 'bold'
                                                }}>PREVENTIVE</span>
                                            </div>
                                            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#1a365e' }}>Maintenance Plans</h3>
                                            <p style={{ color: '#64748b', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                                                Regular upkeep to prevent costly problems and keep your home in peak condition.
                                            </p>
                                            <button
                                                onClick={() => openIntelligentForm('maintenance')}
                                                style={{
                                                    background: 'linear-gradient(135deg, #10b981, #059669)',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    padding: '0.75rem 1.5rem',
                                                    cursor: 'pointer',
                                                    width: '100%',
                                                    fontWeight: '600',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '0.5rem'
                                                }}
                                            >
                                                <Shield size={18} />
                                                Get Maintenance Plan
                                            </button>
                                        </div>
                                    </div>

                                    {/* Home Improvements */}
                                    <div style={{
                                        padding: '2rem',
                                        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05), rgba(139, 92, 246, 0.1))',
                                        borderRadius: '12px',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                        border: '2px solid rgba(139, 92, 246, 0.2)',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}>
                                        <div style={{
                                            position: 'absolute',
                                            bottom: '-20px',
                                            left: '-20px',
                                            width: '80px',
                                            height: '80px',
                                            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(139, 92, 246, 0.2))',
                                            borderRadius: '50%',
                                            zIndex: 0
                                        }}></div>
                                        <div style={{ position: 'relative', zIndex: 1 }}>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '1rem',
                                                marginBottom: '1rem'
                                            }}>
                                                <Home size={48} style={{ color: '#8b5cf6' }} />
                                                <span style={{
                                                    background: '#8b5cf6',
                                                    color: 'white',
                                                    padding: '0.25rem 0.75rem',
                                                    borderRadius: '20px',
                                                    fontSize: '0.8rem',
                                                    fontWeight: 'bold'
                                                }}>TRANSFORM</span>
                                            </div>
                                            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#1a365e' }}>Home Improvements</h3>
                                            <p style={{ color: '#64748b', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                                                Renovations, remodeling, and upgrades to transform your living space.
                                            </p>
                                            <button
                                                onClick={() => openIntelligentForm('home-improvements')}
                                                style={{
                                                    background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    padding: '0.75rem 1.5rem',
                                                    cursor: 'pointer',
                                                    width: '100%',
                                                    fontWeight: '600',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '0.5rem'
                                                }}
                                            >
                                                <Palette size={18} />
                                                Get Improvement Quote
                                            </button>
                                        </div>
                                    </div>

                                    {/* Seasonal Services */}
                                    <div style={{
                                        padding: '2rem',
                                        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.05), rgba(245, 158, 11, 0.1))',
                                        borderRadius: '12px',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                        border: '2px solid rgba(245, 158, 11, 0.2)',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}>
                                        <div style={{
                                            position: 'absolute',
                                            top: '-30px',
                                            right: '-30px',
                                            width: '90px',
                                            height: '90px',
                                            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(245, 158, 11, 0.2))',
                                            borderRadius: '50%',
                                            zIndex: 0
                                        }}></div>
                                        <div style={{ position: 'relative', zIndex: 1 }}>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '1rem',
                                                marginBottom: '1rem'
                                            }}>
                                                <Sun size={48} style={{ color: '#f59e0b' }} />
                                                <span style={{
                                                    background: '#f59e0b',
                                                    color: 'white',
                                                    padding: '0.25rem 0.75rem',
                                                    borderRadius: '20px',
                                                    fontSize: '0.8rem',
                                                    fontWeight: 'bold'
                                                }}>SEASONAL</span>
                                            </div>
                                            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#1a365e' }}>Seasonal Services</h3>
                                            <p style={{ color: '#64748b', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                                                Prepare your home for Arizona's changing seasons with specialized maintenance.
                                            </p>
                                            <button
                                                onClick={() => openIntelligentForm('seasonal')}
                                                style={{
                                                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    padding: '0.75rem 1.5rem',
                                                    cursor: 'pointer',
                                                    width: '100%',
                                                    fontWeight: '600',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '0.5rem'
                                                }}
                                            >
                                                <Thermometer size={18} />
                                                Get Seasonal Service
                                            </button>
                                        </div>
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
                                            onClick={() => openIntelligentForm(key)}
                                            style={{
                                                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '8px',
                                                padding: '0.75rem 1.5rem',
                                                cursor: 'pointer',
                                                width: '100%',
                                                fontWeight: '600',
                                                transition: 'all 0.3s ease'
                                            }}
                                            onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                                            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                                        >
                                            Get Smart Quote
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

                {currentPage === 'blog' && !selectedBlogPost && (
                    <section style={{ padding: '4rem 2rem', minHeight: '80vh' }}>
                        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                            <h1 style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '2rem', color: '#1a365e' }}>
                                Home Improvement Blog
                            </h1>
                            <p style={{ fontSize: '1.2rem', textAlign: 'center', color: '#64748b', marginBottom: '3rem' }}>
                                Tips, tricks, and insights from your local handyman experts
                            </p>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
                                {blogPosts.map((post) => (
                                    <article key={post.id} style={{
                                        background: 'white',
                                        borderRadius: '12px',
                                        overflow: 'hidden',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                        cursor: 'pointer'
                                    }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-5px)'
                                            e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.15)'
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)'
                                            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)'
                                        }}>
                                        <img
                                            src={post.image}
                                            alt={post.title}
                                            style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                                        />
                                        <div style={{ padding: '1.5rem' }}>
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                marginBottom: '0.5rem'
                                            }}>
                                                <span style={{ fontSize: '0.9rem', color: '#FFD700' }}>
                                                    {post.date}
                                                </span>
                                                <span style={{
                                                    fontSize: '0.8rem',
                                                    color: '#64748b',
                                                    background: '#f1f5f9',
                                                    padding: '0.25rem 0.5rem',
                                                    borderRadius: '4px'
                                                }}>
                                                    {post.readTime}
                                                </span>
                                            </div>
                                            <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', color: '#1a365e' }}>
                                                {post.title}
                                            </h3>
                                            <p style={{ color: '#64748b', lineHeight: '1.6', marginBottom: '1rem' }}>
                                                {post.excerpt}
                                            </p>
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center'
                                            }}>
                                                <button
                                                    onClick={() => setSelectedBlogPost(post)}
                                                    style={{
                                                        background: 'linear-gradient(135deg, #1a365e, #2c5aa0)',
                                                        color: 'white',
                                                        border: 'none',
                                                        padding: '0.5rem 1rem',
                                                        borderRadius: '6px',
                                                        cursor: 'pointer',
                                                        fontSize: '0.9rem',
                                                        transition: 'transform 0.2s ease'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.transform = 'scale(1.05)'
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.transform = 'scale(1)'
                                                    }}
                                                >
                                                    Read More <ChevronRight size={16} style={{ display: 'inline', marginLeft: '4px' }} />
                                                </button>
                                                <span style={{
                                                    fontSize: '0.8rem',
                                                    color: '#64748b',
                                                    background: '#e2e8f0',
                                                    padding: '0.25rem 0.5rem',
                                                    borderRadius: '12px'
                                                }}>
                                                    {post.category}
                                                </span>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {currentPage === 'blog' && selectedBlogPost && (
                    <section style={{ padding: '4rem 2rem', minHeight: '80vh' }}>
                        <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
                            {/* Back to Blog Button */}
                            <button
                                onClick={() => setSelectedBlogPost(null)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    background: 'transparent',
                                    border: 'none',
                                    color: '#64748b',
                                    cursor: 'pointer',
                                    marginBottom: '2rem',
                                    fontSize: '1rem',
                                    transition: 'color 0.2s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.color = '#1a365e'
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.color = '#64748b'
                                }}
                            >
                                <ArrowLeft size={20} /> Back to Blog
                            </button>

                            {/* Blog Post Header */}
                            <div style={{ marginBottom: '2rem' }}>
                                <div style={{
                                    display: 'flex',
                                    gap: '1rem',
                                    alignItems: 'center',
                                    marginBottom: '1rem',
                                    flexWrap: 'wrap'
                                }}>
                                    <span style={{
                                        fontSize: '0.9rem',
                                        color: '#FFD700',
                                        background: '#fef3c7',
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '20px'
                                    }}>
                                        {selectedBlogPost.date}
                                    </span>
                                    <span style={{
                                        fontSize: '0.9rem',
                                        color: '#64748b',
                                        background: '#f1f5f9',
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '20px'
                                    }}>
                                        {selectedBlogPost.readTime}
                                    </span>
                                    <span style={{
                                        fontSize: '0.9rem',
                                        color: '#1a365e',
                                        background: '#e2e8f0',
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '20px'
                                    }}>
                                        {selectedBlogPost.category}
                                    </span>
                                </div>
                                <h1 style={{
                                    fontSize: '2.5rem',
                                    color: '#1a365e',
                                    lineHeight: '1.2',
                                    marginBottom: '1rem'
                                }}>
                                    {selectedBlogPost.title}
                                </h1>
                                <p style={{
                                    fontSize: '1.2rem',
                                    color: '#64748b',
                                    lineHeight: '1.6',
                                    marginBottom: '1rem'
                                }}>
                                    {selectedBlogPost.excerpt}
                                </p>
                                <div style={{
                                    fontSize: '0.9rem',
                                    color: '#64748b',
                                    borderBottom: '1px solid #e5e7eb',
                                    paddingBottom: '1rem'
                                }}>
                                    By {selectedBlogPost.author}
                                </div>
                            </div>

                            {/* Featured Image */}
                            <div style={{ marginBottom: '2rem' }}>
                                <img
                                    src={selectedBlogPost.image}
                                    alt={selectedBlogPost.title}
                                    style={{
                                        width: '100%',
                                        height: '400px',
                                        objectFit: 'cover',
                                        borderRadius: '12px',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                                    }}
                                />
                            </div>

                            {/* Blog Content */}
                            <div style={{
                                fontSize: '1.1rem',
                                lineHeight: '1.8',
                                color: '#374151',
                                marginBottom: '3rem'
                            }}>
                                {selectedBlogPost.content.split('\n\n').map((paragraph, index) => {
                                    if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                                        return (
                                            <h3 key={index} style={{
                                                fontSize: '1.4rem',
                                                color: '#1a365e',
                                                marginTop: '2rem',
                                                marginBottom: '1rem',
                                                fontWeight: 'bold'
                                            }}>
                                                {paragraph.replace(/\*\*/g, '')}
                                            </h3>
                                        )
                                    }
                                    return (
                                        <p key={index} style={{ marginBottom: '1.5rem' }}>
                                            {paragraph}
                                        </p>
                                    )
                                })}
                            </div>

                            {/* Tags */}
                            {selectedBlogPost.tags && selectedBlogPost.tags.length > 0 && (
                                <div style={{ marginBottom: '2rem' }}>
                                    <h4 style={{
                                        fontSize: '1rem',
                                        color: '#1a365e',
                                        marginBottom: '0.5rem'
                                    }}>
                                        Tags:
                                    </h4>
                                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                        {selectedBlogPost.tags.map((tag, index) => (
                                            <span key={index} style={{
                                                fontSize: '0.8rem',
                                                color: '#64748b',
                                                background: '#f1f5f9',
                                                padding: '0.25rem 0.5rem',
                                                borderRadius: '12px',
                                                border: '1px solid #e2e8f0'
                                            }}>
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Call to Action */}
                            <div style={{
                                background: 'linear-gradient(135deg, #f8fafc, #e2e8f0)',
                                padding: '2rem',
                                borderRadius: '12px',
                                textAlign: 'center',
                                border: '1px solid #e2e8f0'
                            }}>
                                <h3 style={{
                                    fontSize: '1.3rem',
                                    color: '#1a365e',
                                    marginBottom: '1rem'
                                }}>
                                    Need Professional Help?
                                </h3>
                                <p style={{
                                    color: '#64748b',
                                    marginBottom: '1.5rem'
                                }}>
                                    Our experienced team is here to help with all your home maintenance and repair needs.
                                </p>
                                <button
                                    onClick={() => {
                                        setCurrentPage('home')
                                        setLeadFormModal('quote')
                                    }}
                                    style={{
                                        background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                                        color: '#000',
                                        border: 'none',
                                        padding: '0.75rem 2rem',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontSize: '1rem',
                                        fontWeight: '600',
                                        transition: 'transform 0.2s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'scale(1.05)'
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'scale(1)'
                                    }}
                                >
                                    Get Your Free Quote
                                </button>
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

            {/* Professional ChatBot */}
            <ChatbotWidget />

            {/* Footer - Powered by REMODELY */}
            <footer style={{
                background: 'linear-gradient(135deg, #1e293b, #0f172a)',
                color: 'white',
                textAlign: 'center',
                padding: '20px',
                marginTop: '50px',
                borderTop: '3px solid #3b82f6'
            }}>
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '14px'
                }}>
                    <span style={{ color: '#94a3b8' }}>Powered by</span>
                    <span style={{
                        fontWeight: 'bold',
                        fontSize: '16px',
                        background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        letterSpacing: '1px'
                    }}>
                        REMODELY
                    </span>
                    <span style={{ color: '#94a3b8' }}>|</span>
                    <span style={{ color: '#94a3b8', fontSize: '12px' }}>
                        Advanced AI-Powered Home Services Platform
                    </span>
                </div>
                <div style={{
                    marginTop: '8px',
                    fontSize: '12px',
                    color: '#64748b'
                }}>
                    © 2025 Scottsdale Handyman Solutions | Licensed & Insured | (480) 255-5887
                </div>
            </footer>

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

            {/* Intelligent Service Form Modal */}
            {leadFormModal === 'intelligent' && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10000,
                    padding: '20px'
                }} onClick={() => setLeadFormModal(null)}>
                    <div onClick={(e) => e.stopPropagation()} style={{
                        background: 'white',
                        borderRadius: '12px',
                        padding: '2rem',
                        width: '100%',
                        maxWidth: '700px',
                        maxHeight: '90vh',
                        overflow: 'auto',
                        position: 'relative',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
                    }}>
                        <button
                            onClick={() => setLeadFormModal(null)}
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

                        <div style={{ marginBottom: '2rem' }}>
                            <h2 style={{
                                color: '#1a365e',
                                marginBottom: '0.5rem',
                                fontSize: '1.75rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}>
                                {selectedServiceType === 'emergency' && <><AlertTriangle size={28} style={{ color: '#dc3545' }} /> Emergency Service Request</>}
                                {selectedServiceType === 'smart-home' && <><Smartphone size={28} style={{ color: '#3b82f6' }} /> Smart Home Consultation</>}
                                {selectedServiceType === 'home-repairs' && <><Wrench size={28} style={{ color: '#FFD700' }} /> Home Repair Request</>}
                                {selectedServiceType === 'maintenance' && <><Shield size={28} style={{ color: '#10b981' }} /> Maintenance Plan Quote</>}
                                {selectedServiceType === 'home-improvements' && <><Home size={28} style={{ color: '#8b5cf6' }} /> Home Improvement Quote</>}
                                {selectedServiceType === 'seasonal' && <><Sun size={28} style={{ color: '#f59e0b' }} /> Seasonal Service Request</>}
                                {!selectedServiceType && <>Get Your Service Quote</>}
                            </h2>
                            <p style={{ color: '#64748b', fontSize: '1rem' }}>
                                {selectedServiceType === 'emergency' && 'Tell us about your emergency for immediate assistance.'}
                                {selectedServiceType === 'smart-home' && 'Help us understand your smart home goals for a personalized solution.'}
                                {selectedServiceType === 'home-repairs' && 'Describe your repair needs for an accurate quote.'}
                                {selectedServiceType === 'maintenance' && 'Let us know your maintenance preferences for a custom plan.'}
                                {selectedServiceType === 'home-improvements' && 'Share your improvement vision for a detailed proposal.'}
                                {selectedServiceType === 'seasonal' && 'Tell us about your seasonal service needs.'}
                                {!selectedServiceType && 'Provide your service details for a personalized quote.'}
                            </p>
                        </div>

                        <form onSubmit={handleIntelligentFormSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
                            {getIntelligentFormFields(selectedServiceType).map((field, index) => (
                                <div key={field.name} style={{ display: 'grid', gap: '0.5rem' }}>
                                    <label style={{
                                        fontWeight: '600',
                                        color: '#374151',
                                        fontSize: '0.875rem'
                                    }}>
                                        {field.label} {field.required && <span style={{ color: '#dc3545' }}>*</span>}
                                    </label>

                                    {field.type === 'text' || field.type === 'email' || field.type === 'tel' ? (
                                        <input
                                            type={field.type}
                                            name={field.name}
                                            placeholder={field.placeholder || field.label}
                                            required={field.required}
                                            onInput={field.type === 'tel' ? handlePhoneInput : undefined}
                                            style={{
                                                padding: '0.875rem',
                                                border: '2px solid #e5e7eb',
                                                borderRadius: '8px',
                                                fontSize: '1rem',
                                                transition: 'border-color 0.2s',
                                                ':focus': { borderColor: '#3b82f6' }
                                            }}
                                        />
                                    ) : field.type === 'select' ? (
                                        <select
                                            name={field.name}
                                            required={field.required}
                                            style={{
                                                padding: '0.875rem',
                                                border: '2px solid #e5e7eb',
                                                borderRadius: '8px',
                                                fontSize: '1rem',
                                                backgroundColor: 'white'
                                            }}
                                        >
                                            <option value="">Select {field.label}</option>
                                            {field.options?.map(option => (
                                                <option key={option} value={option}>{option}</option>
                                            ))}
                                        </select>
                                    ) : field.type === 'textarea' ? (
                                        <textarea
                                            name={field.name}
                                            placeholder={field.placeholder || field.label}
                                            required={field.required}
                                            rows={3}
                                            style={{
                                                padding: '0.875rem',
                                                border: '2px solid #e5e7eb',
                                                borderRadius: '8px',
                                                fontSize: '1rem',
                                                resize: 'vertical',
                                                fontFamily: 'inherit'
                                            }}
                                        />
                                    ) : field.type === 'checkbox' ? (
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                            gap: '0.5rem',
                                            padding: '0.5rem',
                                            border: '2px solid #e5e7eb',
                                            borderRadius: '8px'
                                        }}>
                                            {field.options?.map(option => (
                                                <label key={option} style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem',
                                                    fontSize: '0.875rem'
                                                }}>
                                                    <input
                                                        type="checkbox"
                                                        name={field.name}
                                                        value={option}
                                                        style={{ width: '16px', height: '16px' }}
                                                    />
                                                    {option}
                                                </label>
                                            ))}
                                        </div>
                                    ) : null}
                                </div>
                            ))}

                            <div style={{
                                display: 'flex',
                                gap: '1rem',
                                justifyContent: 'flex-end',
                                marginTop: '1rem',
                                paddingTop: '1rem',
                                borderTop: '1px solid #e5e7eb'
                            }}>
                                <button
                                    type="button"
                                    onClick={() => setLeadFormModal(null)}
                                    style={{
                                        padding: '0.875rem 1.5rem',
                                        background: '#f3f4f6',
                                        color: '#6b7280',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontWeight: '500'
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    style={{
                                        padding: '0.875rem 2rem',
                                        background: selectedServiceType === 'emergency'
                                            ? 'linear-gradient(135deg, #dc3545, #c82333)'
                                            : selectedServiceType === 'smart-home'
                                                ? 'linear-gradient(135deg, #3b82f6, #2563eb)'
                                                : selectedServiceType === 'maintenance'
                                                    ? 'linear-gradient(135deg, #10b981, #059669)'
                                                    : selectedServiceType === 'home-improvements'
                                                        ? 'linear-gradient(135deg, #8b5cf6, #7c3aed)'
                                                        : selectedServiceType === 'seasonal'
                                                            ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                                                            : 'linear-gradient(135deg, #FFD700, #FFA500)',
                                        color: selectedServiceType === 'home-repairs' || !selectedServiceType ? '#000' : 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontWeight: '600',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem'
                                    }}
                                >
                                    {selectedServiceType === 'emergency' ? (
                                        <><Phone size={18} /> Submit Emergency Request</>
                                    ) : selectedServiceType === 'smart-home' ? (
                                        <><Zap size={18} /> Get Smart Home Quote</>
                                    ) : selectedServiceType === 'maintenance' ? (
                                        <><Shield size={18} /> Get Maintenance Plan</>
                                    ) : selectedServiceType === 'home-improvements' ? (
                                        <><Palette size={18} /> Get Improvement Quote</>
                                    ) : selectedServiceType === 'seasonal' ? (
                                        <><Sun size={18} /> Get Seasonal Service</>
                                    ) : (
                                        <><Wrench size={18} /> Submit Request</>
                                    )}
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
