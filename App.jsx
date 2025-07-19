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
  Download
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

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState('home')
  const [selectedBlogPost, setSelectedBlogPost] = useState(null)
  
  // Admin System State
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminSection, setAdminSection] = useState('dashboard')
  const [editingBlog, setEditingBlog] = useState(null)
  const [editingService, setEditingService] = useState(null)
  const [editingProject, setEditingProject] = useState(null)
  const [showImageManager, setShowImageManager] = useState(false)
  
  // File Upload State
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [isDragging, setIsDragging] = useState(false)
  const [uploadProgress, setUploadProgress] = useState({})
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

  // Chatbot state
  const [chatOpen, setChatOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      type: 'bot',
      message: 'Hi! I\'m your AI handyman assistant. I can help you with service information, pricing, scheduling, and emergency support. What can I help you with today?',
      timestamp: new Date(),
      quickReplies: [
        { text: "⚡ Electrical Issues", action: "electrical problems" },
        { text: "🔧 Plumbing Help", action: "plumbing repair" },
        { text: "🎨 Painting Project", action: "painting service" },
        { text: "🔨 General Repairs", action: "handyman repairs" },
        { text: "💰 Get Pricing", action: "pricing information" },
        { text: "📅 Schedule Now", action: "schedule appointment" }
      ]
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
      action: () => setCurrentPage('quote'),
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
      description: "Learn more about Scottsdale Handyman Solutions"
    },
    scheduleService: {
      text: "📅 Schedule Service",
      action: () => setCurrentPage('quote'),
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
    const userMessage = {
      id: Date.now(),
      type: 'user',
      message: replyText,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatTyping(true);

    // Process the quick reply as a regular message
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        type: 'bot',
        message: generateChatResponse(replyText, chatContext),
        timestamp: new Date(),
        actionButtons: chatContext.actionButtons || null,
        quickReplies: chatContext.quickReplies || null
      };
      
      setChatMessages(prev => [...prev, botResponse]);
      setChatTyping(false);
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

  // Advanced NLP Response Generator
  const generateChatResponse = (userMessage, context = {}) => {
    const message = userMessage.toLowerCase();
    let response = "";
    let newContext = { ...chatContext };
    let confidence = 0;
    let matchedService = null;

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

    // Check for service matches
    Object.entries(handymanKnowledgeBase.services).forEach(([service, data]) => {
      const score = scoreMatch(message, data.keywords);
      if (score > confidence) {
        confidence = score;
        matchedService = service;
      }
    });

    // Quick Action specific responses
    if (message === 'i have an emergency repair needed') {
      response = "🚨 EMERGENCY SERVICE AVAILABLE 24/7!\n\nImmediate response for:\n• Water leaks & flooding\n• Electrical hazards\n• Lock-outs & security\n• HVAC failures\n\nCall NOW: (480) 255-5887\n\nWhat's your emergency?";
      newContext.conversationStage = 'emergency';
      newContext.actionButtons = generateActionButtons(['emergencyService', 'contactUs']);
    }
    else if (message === 'i need a free quote for my project') {
      response = "💰 FREE QUOTE AVAILABLE!\n\nQuick options:\n📞 Phone estimate (5-15 min)\n🏠 In-home visit (most accurate)\n📸 Photo estimate (send pics)\n\nWhat's your project type and size?";
      newContext.conversationStage = 'quote_request';
      newContext.actionButtons = generateActionButtons(['quoteRequest', 'scheduleService', 'contactUs']);
    }
    else if (message === 'what services do you offer?') {
      response = "🔧 FULL HANDYMAN SERVICES:\n\n⚡ Electrical: outlets, fixtures, fans\n🚿 Plumbing: faucets, toilets, repairs\n🖼️ Interior: drywall, painting, trim\n🏠 Exterior: doors, windows, repairs\n🔨 Assembly: furniture, fixtures\n🛠️ General: honey-do lists\n\nWhat specific service interests you?";
      newContext.conversationStage = 'service_overview';
      newContext.actionButtons = generateActionButtons(['quoteRequest', 'viewServices', 'contactUs']);
    }
    else if (message === 'how can i contact you?') {
      response = "📞 CONTACT INFO:\n\n🔥 Phone: (480) 255-5887\n📧 Email: help.scottsdalehandyman@gmail.com\n🕒 Hours: Mon-Sat 7AM-6PM\n⚡ Emergency: 24/7 available\n\nResponse within 2 hours guaranteed!\nPrefer call or text?";
      newContext.conversationStage = 'contact';
      newContext.actionButtons = generateActionButtons(['contactUs', 'emailUs', 'emergencyService']);
    }
    // Greeting responses
    else if (message.match(/\b(hello|hi|hey|good morning|good afternoon|good evening|howdy|greetings)\b/)) {
      const greetings = [
        "Hi! I'm your handyman AI assistant. What needs fixing or installing today?",
        "Hello! What project can I help you with - electrical, plumbing, repairs, or installation?",
        "Hey there! Tell me about your handyman needs - what's broken or what would you like installed?"
      ];
      response = greetings[Math.floor(Math.random() * greetings.length)];
      newContext.conversationStage = 'engaged';
      newContext.actionButtons = generateActionButtons(['quoteRequest', 'viewServices', 'emergencyService']);
      newContext.quickReplies = quickReplies.greeting;
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

    // Context-aware follow-up responses
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

    // Location and service area
    else if (message.match(/\b(area|location|serve|where|travel|distance|phoenix|scottsdale|tempe|mesa)\b/)) {
      response = "We serve Scottsdale and the greater Phoenix area including:\n\n🏙️ Scottsdale, Paradise Valley, Tempe, Mesa, Fountain Hills, Cave Creek, Carefree\n📍 Generally within 25 miles of Scottsdale\n🚛 Some travel fees may apply for distant locations\n\nWhat area are you located in?";
      newContext.conversationStage = 'location';
      newContext.actionButtons = generateActionButtons(['quoteRequest', 'contactUs']);
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
            recognizedTerms.push({term, category: `interior ${category}`});
          }
        });
      });

      Object.entries(handymanKnowledgeBase.exteriorTerms).forEach(([category, terms]) => {
        terms.forEach(term => {
          if (message.includes(term.toLowerCase())) {
            recognizedTerms.push({term, category: `exterior ${category}`});
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
    
    return response;
  };

  const handleChatSubmit = (e) => {
    e.preventDefault()
    if (!chatInput.trim()) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      message: chatInput.trim(),
      timestamp: new Date()
    }

    setChatMessages(prev => [...prev, userMessage])
    setChatInput('')
    setChatTyping(true)

    // More realistic typing delay based on message length
    const responseDelay = Math.min(Math.max(userMessage.message.length * 50, 800), 3000)

    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        type: 'bot',
        message: generateChatResponse(userMessage.message, chatContext),
        timestamp: new Date(),
        actionButtons: chatContext.actionButtons || null,
        quickReplies: chatContext.quickReplies || null
      }
      
      setChatMessages(prev => [...prev, botResponse])
      setChatTyping(false)
    }, responseDelay)
  }

  // Admin Authentication Functions
  const handleAdminLogout = () => {
    setIsAdmin(false)
    localStorage.removeItem('scottsdaleAdminAuth')
    setCurrentPage('home')
    setAdminSection('dashboard')
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

  const deleteUploadedFile = (fileId) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      setUploadedFiles(prev => prev.filter(file => file.id !== fileId))
    }
  }

  const copyFileUrl = (file) => {
    // In a real application, this would be the actual URL
    const url = file.data
    navigator.clipboard.writeText(url).then(() => {
      alert('File URL copied to clipboard!')
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
        if (config.publishableKey) {
          const stripe = await loadStripe(config.publishableKey)
          setStripePromise(stripe)
        }
      } catch (error) {
        console.log('Stripe initialization error:', error)
        // Fallback: try with a basic test key for now
        const testStripe = await loadStripe('pk_test_51RmUDcRjM9anbUvSzLM0p0yrBNI25ULjUpjAWlSjIdGADxTLfpfwgkhvNwZtU6Xs6ycUzCUOvwN6VfQG0PUYW3cY009ruWWyDP')
        setStripePromise(testStripe)
        setStripeConfig({
          publishableKey: 'pk_test_51RmUDcRjM9anbUvSzLM0p0yrBNI25ULjUpjAWlSjIdGADxTLfpfwgkhvNwZtU6Xs6ycUzCUOvwN6VfQG0PUYW3cY009ruWWyDP',
          environment: 'development'
        })
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

Exterior Painting Touch-ups: The intense UV radiation in Arizona fades and damages exterior paint faster than in most climates. Touch up any areas where paint is peeling or fading to protect underlying materials from sun and moisture damage.

**Summer Survival Strategies**

Cooling System Optimization: During summer months, your HVAC system works overtime. Keep vents unobstructed, use ceiling fans to improve air circulation, and consider upgrading to a programmable thermostat to optimize energy usage during peak rate periods.

Landscape Irrigation Management: Proper irrigation not only keeps your landscape healthy but also protects your home's foundation. Ensure sprinkler systems are directing water away from the foundation and check for leaks that could cause foundation settling or pest problems.

Window and Door Sealing: Gaps around windows and doors let conditioned air escape and hot air enter. Inspect and replace weatherstripping, caulk gaps, and consider upgrading to energy-efficient windows if your current ones are more than 15 years old.`,
      author: "Scottsdale Handyman Solutions",
      date: "2024-12-15",
      category: "Maintenance",
      readTime: "8 min read",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop"
    },
    {
      id: 2,
      title: "Smart Home Technology Integration for Modern Scottsdale Homes",
      excerpt: "Discover how smart home integration can improve comfort, security, and energy efficiency while adding significant value to your property.",
      content: `The future of home living is here, and it's smarter than ever. As technology continues to evolve, homeowners in Scottsdale are discovering how smart home integration can improve comfort, security, and energy efficiency while adding significant value to their properties.

**Smart Thermostats: Your First Step to Efficiency**

Energy Savings Potential: Smart thermostats can reduce energy costs by 10-15% through intelligent scheduling and learning your preferences. In Arizona's extreme climate, this translates to substantial savings on utility bills.

Advanced Features: Modern smart thermostats offer geofencing (automatically adjusting temperature when you leave or return), humidity control, and integration with other smart home devices. Some models even provide energy usage reports and maintenance reminders.

Professional Installation Benefits: While some smart thermostats are marketed as DIY projects, professional installation ensures proper wiring, calibration, and integration with your existing HVAC system. Improper installation can damage expensive equipment and void warranties.

**Security Systems for Peace of Mind**

Comprehensive Protection: Modern smart security systems go beyond basic burglar alarms. They include doorbell cameras, motion sensors, window and door sensors, and environmental monitoring for smoke, carbon monoxide, and water leaks.

Remote Monitoring: Whether you're at work, traveling, or just want to check on your home, smart security systems provide real-time alerts and video feeds accessible from your smartphone or computer.

Integration Opportunities: Smart security systems can integrate with lighting, door locks, and garage door openers to create comprehensive automation scenarios. For example, your system can automatically turn on lights and unlock doors when you arrive home.`,
      author: "Scottsdale Handyman Solutions",
      date: "2024-12-10",
      category: "Smart Home",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800&h=600&fit=crop"
    },
    {
      id: 3,
      title: "Kitchen Remodeling Trends That Add Value to Your Scottsdale Home",
      excerpt: "Current trends in kitchen design focus on functionality, sustainability, and creating spaces that work for modern lifestyles.",
      content: `The kitchen remains the heart of the home and the most important room for resale value. Current trends in kitchen design focus on functionality, sustainability, and creating spaces that work for modern lifestyles.

**Open Concept Integration**

Breaking Down Barriers: Removing walls between kitchens and living areas creates a sense of spaciousness and improves traffic flow. This is particularly valuable in Scottsdale's many ranch-style homes where original layouts can feel compartmentalized.

Structural Considerations: Not all walls can be removed safely. Professional assessment is essential to determine which walls are load-bearing and what modifications are possible. Proper permits and engineering may be required for structural changes.

Design Continuity: Open concept spaces require careful attention to design continuity. Flooring, color schemes, and lighting should flow seamlessly between areas to create a cohesive look.

**Sustainable Materials and Energy Efficiency**

Eco-Friendly Countertops: Recycled glass, bamboo, and reclaimed wood countertops offer unique aesthetics while supporting environmental responsibility. These materials often provide better durability and lower maintenance than traditional options.

Energy-Efficient Appliances: ENERGY STAR certified appliances can significantly reduce utility costs while providing superior performance. In Arizona's climate, efficient refrigeration and dishwashing are particularly important.

Water Conservation: Low-flow faucets, efficient dishwashers, and proper insulation around plumbing can reduce water usage and energy costs associated with heating water.`,
      author: "Scottsdale Handyman Solutions",
      date: "2024-12-05",
      category: "Remodeling",
      readTime: "7 min read",
      image: "https://images.unsplash.com/photo-1565182999561-18d7dc61c393?w=800&h=600&fit=crop"
    },
    {
      id: 4,
      title: "Preparing Your Scottsdale Home for Monsoon Season",
      excerpt: "Arizona's monsoon season brings unique challenges. Learn how to protect your home from high winds, flash flooding, and sudden temperature changes.",
      content: `Arizona's monsoon season brings unique challenges that can catch unprepared homeowners off guard. High winds, flash flooding, and sudden temperature changes can cause significant damage if your home isn't properly prepared.

**Roof and Gutter Preparation**

Tile Inspection: High winds can lift and break roof tiles, creating entry points for water. Inspect tiles for cracks, loose mortar, or missing pieces. Professional repairs should be completed before storm season begins.

Gutter Cleaning: Clogged gutters can't handle the sudden influx of water from monsoon storms. Clean gutters and downspouts, and ensure proper drainage away from your foundation.

Tree Trimming: Overhanging branches can damage roofs during high winds. Trim trees to maintain at least six feet of clearance from your roof line.

**Exterior Protection**

Window and Door Sealing: Check weatherstripping and caulking around windows and doors. Even small gaps can allow wind-driven rain to enter your home.

Outdoor Furniture Security: Secure or store outdoor furniture, decorations, and equipment that could become projectiles in high winds.

Drainage Assessment: Ensure your property's grading directs water away from your foundation. Poor drainage can lead to flooding and foundation problems.`,
      author: "Scottsdale Handyman Solutions",
      date: "2024-11-28",
      category: "Seasonal",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=800&h=600&fit=crop"
    },
    {
      id: 5,
      title: "Energy Efficiency Upgrades That Pay for Themselves",
      excerpt: "With Arizona's extreme temperatures and high energy costs, efficiency upgrades can provide substantial savings while improving comfort.",
      content: `With Arizona's extreme temperatures and high energy costs, efficiency upgrades can provide substantial savings while improving comfort. Our energy efficiency specialists have helped hundreds of homeowners reduce their utility bills through strategic improvements.

**Insulation and Air Sealing**

Attic Insulation: Proper attic insulation is crucial in Arizona's climate. Upgrading to R-38 or higher insulation can reduce cooling costs by 20-30% while improving comfort.

Air Sealing: Sealing air leaks around windows, doors, electrical outlets, and plumbing penetrations prevents conditioned air from escaping and hot air from entering.

Ductwork Improvements: Sealing and insulating ductwork can improve HVAC efficiency by 15-20%. Many homes have significant duct leakage that wastes energy and reduces comfort.

**Window and Door Upgrades**

Energy-Efficient Windows: Double-pane windows with low-E coatings can significantly reduce heat gain while maintaining natural light. The investment typically pays for itself within 7-10 years through energy savings.

Proper Installation: Even the best windows won't perform well if improperly installed. Professional installation ensures proper sealing and optimal performance.

Door Upgrades: Energy-efficient exterior doors with proper weatherstripping can reduce air leakage and improve security while enhancing curb appeal.`,
      author: "Scottsdale Handyman Solutions",
      date: "2024-11-20",
      category: "Energy Efficiency",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop"
    },
    {
      id: 6,
      title: "Outdoor Living Spaces: Extending Your Home into the Desert",
      excerpt: "Scottsdale's beautiful climate makes outdoor living spaces incredibly valuable. Learn how to create custom outdoor areas that take advantage of our desert setting.",
      content: `Scottsdale's beautiful climate makes outdoor living spaces incredibly valuable for most of the year. Well-designed outdoor areas can effectively double your living space while providing unique entertainment and relaxation opportunities.

**Covered Patios and Ramadas**

Sun Protection: Solid roof structures provide essential shade during intense summer months while allowing year-round use of outdoor spaces.

Design Integration: Outdoor structures should complement your home's architecture while providing functional benefits like improved energy efficiency through shading.

Utility Integration: Planning for electrical, plumbing, and gas connections during construction allows for future additions like outdoor kitchens, lighting, and entertainment systems.

**Outdoor Kitchens and Entertainment**

Appliance Selection: Outdoor appliances must withstand extreme temperatures and UV exposure. Stainless steel construction and proper ventilation are essential for longevity.

Storage Solutions: Weather-resistant storage keeps outdoor cooking equipment and supplies organized and protected from the elements.

Lighting Design: Proper lighting extends the usability of outdoor spaces into evening hours while providing safety and ambiance.`,
      author: "Scottsdale Handyman Solutions",
      date: "2024-11-15",
      category: "Outdoor Living",
      readTime: "7 min read",
      image: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=800&h=600&fit=crop"
    },
    {
      id: 7,
      title: "Bathroom Renovation Trends: Creating Spa-Like Retreats in Your Scottsdale Home",
      excerpt: "Transform your bathroom into a luxurious retreat with modern design trends that maximize both functionality and relaxation.",
      content: `Modern bathroom design focuses on creating personal spa retreats that provide relaxation and luxury while maintaining practical functionality. Current trends emphasize clean lines, natural materials, and smart technology integration.

**Walk-In Shower Luxury**

Doorless Designs: Walk-in showers without doors create seamless, spacious feels while being easier to clean and maintain. Proper drainage and sizing are crucial for preventing water spillage.

Multiple Shower Heads: Rain showers, handheld units, and body sprays create customizable shower experiences. Professional plumbing ensures adequate water pressure and temperature control.

Built-In Seating and Storage: Integrated benches and niches provide comfort and functionality while maintaining clean design aesthetics.

**Smart Technology Integration**

Digital Shower Controls: Programmable temperature and flow controls allow personalized settings for different family members while providing consistent comfort.

Heated Floors: Radiant floor heating provides luxury comfort while being energy efficient. Electric systems are ideal for bathroom renovations without major plumbing modifications.

Smart Mirrors: LED-lit mirrors with anti-fog technology, integrated lighting controls, and even display capabilities represent the future of bathroom functionality.

**Natural Materials and Finishes**

Stone and Wood Accents: Natural materials like travertine, marble, and reclaimed wood create spa-like atmospheres while providing durability in moisture-rich environments.

Neutral Color Palettes: Calming colors like soft grays, warm whites, and natural beiges create timeless appeal that won't feel dated as trends change.

Large Format Tiles: Bigger tiles create seamless looks with fewer grout lines, making surfaces easier to clean while creating visual spaciousness.`,
      author: "Scottsdale Handyman Solutions",
      date: "2024-11-08",
      category: "Bathroom",
      readTime: "8 min read",
      image: "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800&h=600&fit=crop"
    },
    {
      id: 8,
      title: "Smart Home Security: Protecting Your Scottsdale Investment with Modern Technology",
      excerpt: "Comprehensive home security goes beyond traditional alarms. Discover how modern smart security systems provide protection, convenience, and peace of mind.",
      content: `Modern home security systems provide comprehensive protection that goes far beyond traditional burglar alarms. Smart security integration offers convenience, energy savings, and insurance benefits while protecting your most valuable investment.

**Comprehensive Security Ecosystems**

Video Surveillance: High-definition cameras with night vision, motion detection, and smartphone alerts provide 24/7 monitoring capability. Cloud storage ensures footage preservation even if local equipment is compromised.

Smart Doorbells: Video doorbells allow you to see and communicate with visitors from anywhere while recording activity at your front entrance. Package theft deterrence and visitor screening provide daily security benefits.

Access Control: Smart locks, keypad entry, and smartphone-controlled access eliminate physical key vulnerabilities while providing detailed entry logs and temporary access capabilities.

**Environmental Monitoring**

Smoke and CO Detection: Smart detectors provide early warning while sending alerts to your smartphone and emergency contacts. Battery backup ensures operation during power outages.

Water Leak Detection: Sensors placed near water heaters, washing machines, and plumbing fixtures can detect leaks before they cause major damage. Automatic water shutoff valves provide ultimate protection.

Temperature Monitoring: Extreme temperature alerts protect pipes, plants, and pets while ensuring HVAC system malfunctions are detected quickly.

**Professional Installation Benefits**

System Design: Professional assessment ensures optimal sensor placement, adequate coverage areas, and proper integration with existing home systems.

Ongoing Support: Professional installation includes system monitoring, software updates, and technical support ensuring continued effectiveness as technology evolves.

Insurance Benefits: Many insurance companies offer discounts for professionally monitored security systems, often offsetting monthly monitoring costs while providing superior protection.`,
      author: "Scottsdale Handyman Solutions",
      date: "2024-11-01",
      category: "Security",
      readTime: "9 min read",
      image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&h=600&fit=crop"
    },
    {
      id: 9,
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
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop"
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
      image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&h=600&fit=crop"
    }
  ])

  // Enhanced inspiration gallery with metadata - editable via admin
  const [projectGallery, setProjectGallery] = useState([
    {
      id: 1,
      title: "Modern Kitchen Remodel",
      description: "Complete kitchen transformation with quartz countertops and custom cabinetry",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop",
      alt: "Modern kitchen remodel with white quartz countertops, custom cabinetry, and stainless steel appliances in Scottsdale home",
      category: "Kitchen",
      completionTime: "3 weeks",
      budget: "$25,000 - $35,000",
      features: ["Quartz Countertops", "Custom Cabinets", "LED Lighting", "Tile Backsplash"]
    },
    {
      id: 2,
      title: "Luxury Bathroom Renovation",
      description: "Spa-like master bathroom with walk-in shower and heated floors",
      image: "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800&h=600&fit=crop",
      alt: "Luxury bathroom renovation with walk-in glass shower, marble vanity, and modern fixtures",
      category: "Bathroom",
      completionTime: "2 weeks",
      budget: "$15,000 - $25,000",
      features: ["Walk-in Shower", "Heated Floors", "Double Vanity", "Smart Fixtures"]
    },
    {
      id: 3,
      title: "Custom Laundry Room",
      description: "Functional and beautiful laundry space with custom storage",
      image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&h=600&fit=crop",
      alt: "Custom organized laundry room with built-in storage, folding station, and utility sink",
      category: "Laundry",
      completionTime: "1 week",
      budget: "$5,000 - $10,000",
      features: ["Custom Storage", "Folding Station", "Utility Sink", "Organization Systems"]
    },
    {
      id: 4,
      title: "Walk-in Closet Organization",
      description: "Custom storage solutions for maximum organization",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
      category: "Storage",
      completionTime: "3 days",
      budget: "$3,000 - $8,000",
      features: ["Custom Shelving", "Shoe Storage", "Hanging Systems", "LED Lighting"]
    },
    {
      id: 5,
      title: "Outdoor Kitchen Design",
      description: "Perfect for entertaining with built-in grill and bar seating",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
      category: "Outdoor",
      completionTime: "2 weeks",
      budget: "$20,000 - $40,000",
      features: ["Built-in Grill", "Bar Seating", "Storage Cabinets", "Lighting"]
    },
    {
      id: 6,
      title: "Kitchen Island Installation",
      description: "Functional centerpiece with additional storage and seating",
      image: "https://images.unsplash.com/photo-1565182999561-18d7dc61c393?w=800&h=600&fit=crop",
      category: "Kitchen",
      completionTime: "1 week",
      budget: "$8,000 - $15,000",
      features: ["Granite Top", "Storage Drawers", "Bar Seating", "Electrical Outlets"]
    },
    {
      id: 7,
      title: "Home Office Renovation",
      description: "Professional workspace with custom built-ins and lighting",
      image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&h=600&fit=crop",
      category: "Office",
      completionTime: "1 week",
      budget: "$5,000 - $12,000",
      features: ["Built-in Desk", "Custom Shelving", "Task Lighting", "Cable Management"]
    },
    {
      id: 8,
      title: "Deck Repair & Restoration",
      description: "Complete deck restoration with new decking and railings",
      image: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=800&h=600&fit=crop",
      category: "Outdoor",
      completionTime: "1 week",
      budget: "$8,000 - $15,000",
      features: ["New Decking", "Railing Replacement", "Staining", "Structural Repairs"]
    },
    {
      id: 9,
      title: "Garage Organization System",
      description: "Complete garage transformation with custom storage solutions",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
      category: "Storage",
      completionTime: "2 days",
      budget: "$2,000 - $5,000",
      features: ["Wall Storage", "Overhead Racks", "Workbench", "Tool Organization"]
    },
    {
      id: 10,
      title: "Basement Finishing",
      description: "Transform unused basement into functional living space",
      image: "https://images.unsplash.com/photo-1555636222-cae831e670b3?w=800&h=600&fit=crop",
      category: "Basement",
      completionTime: "4 weeks",
      budget: "$30,000 - $50,000",
      features: ["Flooring", "Drywall", "Lighting", "Entertainment Area"]
    },
    {
      id: 11,
      title: "Master Bedroom Suite",
      description: "Elegant master bedroom with custom built-ins and lighting",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
      category: "Bedroom",
      completionTime: "2 weeks",
      budget: "$12,000 - $20,000",
      features: ["Custom Built-ins", "Crown Molding", "Accent Lighting", "Hardwood Floors"]
    },
    {
      id: 12,
      title: "Front Porch Renovation",
      description: "Welcoming entry with new decking and decorative elements",
      image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop",
      category: "Outdoor",
      completionTime: "1 week",
      budget: "$6,000 - $12,000",
      features: ["Composite Decking", "New Railings", "Lighting", "Landscaping"]
    },
    {
      id: 13,
      title: "Pantry Organization",
      description: "Custom pantry shelving for maximum storage efficiency",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop",
      category: "Kitchen",
      completionTime: "3 days",
      budget: "$2,500 - $5,000",
      features: ["Custom Shelving", "Pull-out Drawers", "Label System", "LED Strip Lights"]
    },
    {
      id: 14,
      title: "Fireplace Makeover",
      description: "Modern fireplace surround with stone veneer and mantel",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop",
      category: "Living Room",
      completionTime: "1 week",
      budget: "$4,000 - $8,000",
      features: ["Stone Veneer", "Custom Mantel", "Built-in Storage", "Accent Lighting"]
    },
    {
      id: 15,
      title: "Pool Area Renovation",
      description: "Complete pool deck and landscaping transformation",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop",
      category: "Outdoor",
      completionTime: "2 weeks",
      budget: "$15,000 - $25,000",
      features: ["Travertine Decking", "Pool Equipment Enclosure", "Landscape Design", "Lighting"]
    },
    {
      id: 16,
      title: "Guest Bathroom Refresh",
      description: "Stylish powder room update with modern fixtures",
      image: "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=800&h=600&fit=crop",
      category: "Bathroom",
      completionTime: "1 week",
      budget: "$3,000 - $6,000",
      features: ["New Vanity", "Modern Fixtures", "Tile Work", "Mirror & Lighting"]
    },
    {
      id: 17,
      title: "Mudroom Installation",
      description: "Functional entryway with built-in storage and bench seating",
      image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&h=600&fit=crop",
      category: "Storage",
      completionTime: "1 week",
      budget: "$4,000 - $8,000",
      features: ["Built-in Cubbies", "Bench Seating", "Coat Hooks", "Tile Flooring"]
    },
    {
      id: 18,
      title: "Attic Conversion",
      description: "Transform attic space into functional bonus room",
      image: "https://images.unsplash.com/photo-1555636222-cae831e670b3?w=800&h=600&fit=crop",
      category: "Conversion",
      completionTime: "3 weeks",
      budget: "$20,000 - $35,000",
      features: ["Insulation", "Drywall", "Flooring", "Windows", "HVAC Extension"]
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
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      
      if (response.ok) {
        alert('Thank you for contacting us. We will respond within 24 hours.')
        setFormData({
          name: '',
          email: '',
          phone: '',
          address: '',
          service: '',
          description: '',
          contact_method: 'phone',
          budget: '',
          timeline: '',
          property_type: '',
          urgency: '',
          heard_about: '',
          images: []
        })
      } else {
        alert('There was an error sending your message. Please try again.')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('There was an error sending your message. Please try again.')
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
              <Wrench size={24} />
            </div>
            <div className="logo-text">
              <span>Scottsdale Handyman Solutions</span>
              <span className="logo-subtitle">Licensed & Insured</span>
            </div>
          </a>

          <nav className="nav-desktop">
            <a href="#" className="nav-link" onClick={(e) => {e.preventDefault(); setCurrentPage('home'); setShowSuccessPage(false);}}>Home</a>
            <a href="#" className="nav-link" onClick={(e) => {e.preventDefault(); setCurrentPage('about'); setShowSuccessPage(false);}}>About</a>
            <a href="#" className="nav-link" onClick={(e) => {e.preventDefault(); setCurrentPage('blog'); setShowSuccessPage(false);}}>Blog</a>
            <a href="#" className="nav-link" onClick={(e) => {e.preventDefault(); setCurrentPage('work-with-us'); setShowSuccessPage(false);}}>Work With Us</a>
            <a href="#" className="nav-link" onClick={(e) => {e.preventDefault(); setCurrentPage('pay'); setShowSuccessPage(false);}}>Pay Invoice</a>
            <a href="#contact" className="emergency-btn" onClick={(e) => {e.preventDefault(); openLeadForm('emergency');}}>
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
          backgroundColor: '#ff4444',
          color: 'white',
          borderRadius: '20px',
          padding: '40px',
          maxWidth: '500px',
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 20px 40px rgba(255, 68, 68, 0.4)',
          border: '4px solid #ff6666',
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
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}>
            EMERGENCY SERVICE
          </h2>
          
          <p style={{
            fontSize: '1.1rem',
            marginBottom: '30px',
            lineHeight: '1.5'
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
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                border: '2px solid white',
                borderRadius: '12px',
                padding: '12px 25px',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = 'white'
                e.target.style.color = '#ff4444'
                e.target.style.transform = 'scale(1.05)'
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'
                e.target.style.color = 'white'
                e.target.style.transform = 'scale(1)'
              }}
            >
              📋 Fill Emergency Request Form
            </button>
          </div>

          {/* Additional Emergency Info */}
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '20px',
            fontSize: '0.95rem'
          }}>
            <p style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>
              ⚡ 24/7 Emergency Response
            </p>
            <p style={{ margin: '0', opacity: 0.9 }}>
              • Plumbing emergencies • Electrical issues<br/>
              • Gas leaks • Structural damage<br/>
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
              color: 'white',
              fontSize: '1.5rem',
              cursor: 'pointer',
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'
            }}
            onMouseOut={(e) => {
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
        zIndex: 9999,
        padding: '1rem'
      }}>
        <div style={{
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
            <h2 style={{ color: 'var(--gray-900)', marginBottom: '0.5rem', fontSize: '1.75rem' }}>
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
                  background: 'var(--primary-600)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
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
          backgroundImage: 'linear-gradient(rgba(26, 54, 93, 0.8), rgba(44, 82, 130, 0.9)), url("https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600&h=900&fit=crop&auto=format")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          color: 'white'
        }}
      >
        <div className="container">
          <div className="hero-content" style={{ color: 'white', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
            <h1 className="hero-title" style={{ color: 'white' }}>Scottsdale's Most Trusted Handyman Solutions</h1>
            <p className="hero-subtitle" style={{ color: 'rgba(255,255,255,0.95)' }}>Local Experts • Quality Service • Innovative Solutions</p>
            <p className="hero-description" style={{ color: 'rgba(255,255,255,0.9)' }}>
              From quick fixes to smart home upgrades, we're your neighborhood handyman team with the expertise 
              to handle any project. Serving Scottsdale with pride, we combine traditional 
              craftsmanship with modern technology.
            </p>
            
            <div className="cta-buttons" style={{ marginTop: '2rem', marginBottom: '3rem' }}>
              <button className="btn-primary" onClick={() => openLeadForm('quote')}>
                Get Free Quote
              </button>
              <button className="btn-secondary" onClick={() => openLeadForm('emergency')}>
                <Phone size={20} />
                24/7 Emergency Service
              </button>
            </div>

            <div className="trust-indicators" style={{ 
              marginTop: '2rem',
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
                padding: '1.5rem',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                minHeight: '140px'
              }}>
                <div className="trust-icon" style={{ 
                  display: 'flex',
                  justifyContent: 'center',
                  marginBottom: '0.75rem'
                }}>
                  <MapPin size={28} />
                </div>
                <div className="trust-title" style={{ 
                  fontWeight: '600',
                  fontSize: '1.125rem',
                  marginBottom: '0.5rem'
                }}>Local Scottsdale Experts</div>
                <div className="trust-subtitle" style={{ 
                  fontSize: '0.875rem',
                  opacity: '0.8'
                }}>Serving the Valley with pride</div>
              </div>
              <div className="trust-item" style={{ 
                textAlign: 'center', 
                flex: '1', 
                minWidth: '200px',
                padding: '1.5rem',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                minHeight: '140px'
              }}>
                <div className="trust-icon" style={{ 
                  display: 'flex',
                  justifyContent: 'center',
                  marginBottom: '0.75rem'
                }}>
                  <Award size={28} />
                </div>
                <div className="trust-title" style={{ 
                  fontWeight: '600',
                  fontSize: '1.125rem',
                  marginBottom: '0.5rem'
                }}>Licensed & Insured</div>
                <div className="trust-subtitle" style={{ 
                  fontSize: '0.875rem',
                  opacity: '0.8'
                }}>Full bonding & liability coverage</div>
              </div>
              <div className="trust-item" style={{ 
                textAlign: 'center', 
                flex: '1', 
                minWidth: '200px',
                padding: '1.5rem',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                minHeight: '140px'
              }}>
                <div className="trust-icon" style={{ 
                  display: 'flex',
                  justifyContent: 'center',
                  marginBottom: '0.75rem'
                }}>
                  <Star size={28} />
                </div>
                <div className="trust-title" style={{ 
                  fontWeight: '600',
                  fontSize: '1.125rem',
                  marginBottom: '0.5rem'
                }}>98% Customer Satisfaction</div>
                <div className="trust-subtitle" style={{ 
                  fontSize: '0.875rem',
                  opacity: '0.8'
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
            <div className="service-card">
              <div className="service-icon">
                <Wrench />
              </div>
              <h3 className="service-title">Home Repairs</h3>
              <p className="service-description">
                Quick fixes and emergency repairs to keep your home safe and functional. From leaky faucets to electrical issues.
              </p>
              <div className="service-price">Starting at $125</div>
              <ul className="service-features">
                <li>Plumbing repairs</li>
                <li>Electrical troubleshooting</li>
                <li>Drywall patching</li>
                <li>Door & window adjustments</li>
              </ul>
              <button className="service-btn" onClick={() => openLeadForm('quote', { serviceType: 'general_repair' })}>
                Get Quote
              </button>
            </div>

            <div className="service-card">
              <div className="service-icon">
                <Calendar />
              </div>
              <h3 className="service-title">Maintenance Services</h3>
              <p className="service-description">
                Regular upkeep to prevent costly problems. Our maintenance plans keep your home in peak condition year-round.
              </p>
              <div className="service-price">Plans from $149/month</div>
              <ul className="service-features">
                <li>Monthly inspections</li>
                <li>Preventive maintenance</li>
                <li>Priority scheduling</li>
                <li>Seasonal preparations</li>
              </ul>
              <button className="service-btn" onClick={() => openLeadForm('quote', { serviceType: 'maintenance' })}>
                Get Quote
              </button>
            </div>

            <div className="service-card">
              <div className="service-icon">
                <Home />
              </div>
              <h3 className="service-title">Home Improvements</h3>
              <p className="service-description">
                Transform your space with professional installations and upgrades. Kitchen updates, bathroom improvements, and more.
              </p>
              <div className="service-price">Project quotes available</div>
              <ul className="service-features">
                <li>Kitchen upgrades</li>
                <li>Bathroom improvements</li>
                <li>Fixture installations</li>
                <li>Custom solutions</li>
              </ul>
              <button className="service-btn" onClick={() => openLeadForm('quote', { serviceType: 'custom' })}>
                Get Quote
              </button>
            </div>

            <div className="service-card">
              <div className="service-icon">
                <Zap />
              </div>
              <h3 className="service-title">Emergency Services</h3>
              <p className="service-description">
                24/7 availability for urgent repairs that can't wait. Burst pipes, electrical failures, and security issues.
              </p>
              <div className="service-price">Emergency rates apply</div>
              <ul className="service-features">
                <li>24/7 availability</li>
                <li>1-4 hour response</li>
                <li>Licensed professionals</li>
                <li>Immediate solutions</li>
              </ul>
              <button className="service-btn" onClick={() => openLeadForm('emergency', { serviceType: 'emergency' })}>
                Get Quote
              </button>
            </div>

            <div className="service-card">
              <div className="service-icon">
                <Smartphone />
              </div>
              <h3 className="service-title">Smart Home Solutions</h3>
              <p className="service-description">
                Bring your home into the future with smart technology integration. Thermostats, security systems, and automation.
              </p>
              <div className="service-price">Packages from $1,285</div>
              <ul className="service-features">
                <li>Smart thermostats</li>
                <li>Security systems</li>
                <li>Lighting automation</li>
                <li>Energy monitoring</li>
              </ul>
              <button className="service-btn" onClick={() => openLeadForm('quote', { serviceType: 'custom' })}>
                Get Quote
              </button>
            </div>

            <div className="service-card">
              <div className="service-icon">
                <Thermometer />
              </div>
              <h3 className="service-title">Seasonal Services</h3>
              <p className="service-description">
                Prepare your home for Arizona's unique climate challenges. Spring prep, summer cooling, and winter protection.
              </p>
              <div className="service-price">Seasonal packages available</div>
              <ul className="service-features">
                <li>HVAC tune-ups</li>
                <li>Weatherproofing</li>
                <li>Pool equipment checks</li>
                <li>Energy efficiency</li>
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
                "After calling three other handyman services with no response, Scottsdale Handyman Solutions 
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
    </div>
  )

  // About page component
  const AboutPage = () => (
    <div style={{ minHeight: 'calc(100vh - 120px)' }}>
      <section 
        className="hero"
        style={{
          backgroundImage: 'linear-gradient(rgba(44, 82, 130, 0.8), rgba(26, 54, 93, 0.9)), url("https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1600&h=900&fit=crop&auto=format")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          color: 'white'
        }}
      >
        <div className="container">
          <div className="hero-content" style={{ color: 'white', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
            <h1 className="hero-title" style={{ color: 'white' }}>About Scottsdale Handyman Solutions LLC</h1>
            <p className="hero-subtitle" style={{ color: 'rgba(255,255,255,0.95)' }}>Your Trusted Local Handyman Experts Since Day One</p>
            <p className="hero-description" style={{ color: 'rgba(255,255,255,0.9)' }}>
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
                  Scottsdale Handyman Solutions LLC was founded on a simple principle: every homeowner deserves reliable, 
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
          {/* Background Image */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'url("https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1600&h=900&fit=crop&auto=format")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            opacity: 0.25
          }}></div>
          
          {/* Gradient Overlay */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(30, 58, 95, 0.8) 0%, rgba(44, 90, 160, 0.7) 50%, rgba(59, 110, 199, 0.8) 100%)'
          }}></div>
          
          {/* Decorative Elements */}
          <div style={{
            position: 'absolute',
            top: '10%',
            left: '10%',
            width: '80px',
            height: '80px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            animation: 'float 6s ease-in-out infinite'
          }}></div>
          <div style={{
            position: 'absolute',
            bottom: '15%',
            right: '15%',
            width: '60px',
            height: '60px',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '50%',
            animation: 'float 8s ease-in-out infinite reverse'
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
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                borderRadius: '50%',
                marginBottom: '2rem',
                backdropFilter: 'blur(10px)'
              }}>
                <BookOpen size={36} color="white" />
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
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '44px',
                    height: '44px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
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
          background: 'linear-gradient(135deg, rgba(26, 54, 93, 0.8) 0%, rgba(44, 82, 130, 0.9) 100%), url("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1600&h=900&fit=crop&auto=format")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          color: 'white' 
        }}
      >
        <div className="container">
          <div className="hero-content" style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
            <h1 className="hero-title" style={{ color: 'white', fontSize: '3rem', marginBottom: '1rem' }}>
              Join Our Professional Team
            </h1>
            <p className="hero-subtitle" style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.3rem', marginBottom: '1.5rem' }}>
              Build a rewarding career with Scottsdale's most trusted handyman company
            </p>
            <p className="hero-description" style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.1rem', lineHeight: '1.6' }}>
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
              background: 'white', 
              borderRadius: '12px', 
              padding: '2rem', 
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              textAlign: 'center',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ 
                width: '60px', 
                height: '60px', 
                background: 'linear-gradient(135deg, #4299e1, #3182ce)', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                margin: '0 auto 1.5rem'
              }}>
                <DollarSign size={24} color="white" />
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
              background: 'white', 
              borderRadius: '12px', 
              padding: '2rem', 
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              textAlign: 'center',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ 
                width: '60px', 
                height: '60px', 
                background: 'linear-gradient(135deg, #48bb78, #38a169)', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                margin: '0 auto 1.5rem'
              }}>
                <Calendar size={24} color="white" />
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
              background: 'white', 
              borderRadius: '12px', 
              padding: '2rem', 
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              textAlign: 'center',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ 
                width: '60px', 
                height: '60px', 
                background: 'linear-gradient(135deg, #ed8936, #dd6b20)', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                margin: '0 auto 1.5rem'
              }}>
                <GraduationCap size={24} color="white" />
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

        {/* Credit Card Input */}
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
            backgroundColor: (!stripe || processing) ? '#9ca3af' : '#059669',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1.125rem',
            fontWeight: '600',
            cursor: (!stripe || processing) ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            marginTop: '1rem'
          }}
        >
          <CreditCard size={20} />
          {processing ? 'Processing Payment...' : 'Process Secure Payment'}
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
          paddingBottom: '2rem',
          backgroundImage: 'linear-gradient(rgba(26, 54, 93, 0.8), rgba(44, 82, 130, 0.9)), url("https://images.unsplash.com/photo-1560472355-536de3962603?w=1600&h=900&fit=crop&auto=format")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          color: 'white'
        }}
      >
        <div className="container">
          <div className="hero-content" style={{ textAlign: 'center', color: 'white', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
            <h1 className="hero-title" style={{ color: 'white' }}>Pay Your Invoice Online</h1>
            <p className="hero-subtitle" style={{ color: 'rgba(255,255,255,0.95)' }}>Secure, fast, and convenient payment processing</p>
            <p className="hero-description" style={{ color: 'rgba(255,255,255,0.9)' }}>
              Pay your Scottsdale Handyman Solutions invoice quickly and securely online. 
              We accept all major credit cards, ACH transfers, and digital payment methods.
            </p>
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
  const AdminPanel = () => {
    if (!isAdmin) {
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
      <div style={{ minHeight: '100vh', background: 'var(--gray-100)' }}>
        {/* Admin Header */}
        <div style={{
          background: 'white',
          borderBottom: '1px solid var(--gray-200)',
          padding: '1rem 0',
          position: 'sticky',
          top: 0,
          zIndex: 1000
        }}>
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Settings size={24} color="var(--primary-600)" />
                <h1 style={{ color: 'var(--gray-900)', fontSize: '1.5rem', margin: 0 }}>
                  Scottsdale Handyman - Admin Panel
                </h1>
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <button
                  onClick={() => setCurrentPage('home')}
                  style={{
                    padding: '0.5rem 1rem',
                    background: 'var(--gray-200)',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <Eye size={16} />
                  View Site
                </button>
                
                <button
                  onClick={handleAdminLogout}
                  style={{
                    padding: '0.5rem 1rem',
                    background: 'var(--error)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '2rem' }}>
            {/* Sidebar */}
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '1.5rem',
              height: 'fit-content',
              border: '1px solid var(--gray-200)'
            }}>
              <h3 style={{ marginBottom: '1rem', color: 'var(--gray-900)' }}>Management</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button
                  onClick={() => setAdminSection('dashboard')}
                  style={{
                    padding: '0.75rem',
                    background: adminSection === 'dashboard' ? 'var(--primary-100)' : 'transparent',
                    color: adminSection === 'dashboard' ? 'var(--primary-700)' : 'var(--gray-600)',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <Database size={16} />
                  Dashboard
                </button>
                
                <button
                  onClick={() => setAdminSection('blogs')}
                  style={{
                    padding: '0.75rem',
                    background: adminSection === 'blogs' ? 'var(--primary-100)' : 'transparent',
                    color: adminSection === 'blogs' ? 'var(--primary-700)' : 'var(--gray-600)',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <BookOpen size={16} />
                  Blog Posts
                </button>
                
                <button
                  onClick={() => setAdminSection('gallery')}
                  style={{
                    padding: '0.75rem',
                    background: adminSection === 'gallery' ? 'var(--primary-100)' : 'transparent',
                    color: adminSection === 'gallery' ? 'var(--primary-700)' : 'var(--gray-600)',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <Image size={16} />
                  Inspiration Gallery
                </button>
                
                <button
                  onClick={() => setAdminSection('media')}
                  style={{
                    padding: '0.75rem',
                    background: adminSection === 'media' ? 'var(--primary-100)' : 'transparent',
                    color: adminSection === 'media' ? 'var(--primary-700)' : 'var(--gray-600)',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <Upload size={16} />
                  Media Library
                </button>
                
                <button
                  onClick={() => setAdminSection('content')}
                  style={{
                    padding: '0.75rem',
                    background: adminSection === 'content' ? 'var(--primary-100)' : 'transparent',
                    color: adminSection === 'content' ? 'var(--primary-700)' : 'var(--gray-600)',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <Type size={16} />
                  Site Content
                </button>
                
                <button
                  onClick={() => setAdminSection('chatbot')}
                  style={{
                    padding: '0.75rem',
                    background: adminSection === 'chatbot' ? 'var(--primary-100)' : 'transparent',
                    color: adminSection === 'chatbot' ? 'var(--primary-700)' : 'var(--gray-600)',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <Bot size={16} />
                  Chatbot Controls
                </button>
                
                <button
                  onClick={() => setAdminSection('payments')}
                  style={{
                    padding: '0.75rem',
                    background: adminSection === 'payments' ? 'var(--primary-100)' : 'transparent',
                    color: adminSection === 'payments' ? 'var(--primary-700)' : 'var(--gray-600)',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <CreditCard size={16} />
                  Payment Settings
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div>
              {adminSection === 'dashboard' && <AdminDashboard />}
              {adminSection === 'blogs' && <AdminBlogs />}
              {adminSection === 'gallery' && <AdminGallery />}
              {adminSection === 'media' && <AdminMediaLibrary />}
              {adminSection === 'content' && <AdminContent />}
              {adminSection === 'chatbot' && <AdminChatbot />}
              {adminSection === 'payments' && <AdminPayments />}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Admin Dashboard Component
  const AdminDashboard = () => (
    <div style={{ display: 'grid', gap: '1.5rem' }}>
      <h2 style={{ color: 'var(--gray-900)', marginBottom: '1rem' }}>Dashboard Overview</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid var(--gray-200)',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{
            background: 'var(--primary-100)',
            padding: '0.75rem',
            borderRadius: '10px',
            color: 'var(--primary-600)'
          }}>
            <BookOpen size={24} />
          </div>
          <div>
            <h3 style={{ margin: 0, color: 'var(--gray-900)' }}>{blogPosts.length}</h3>
            <p style={{ margin: 0, color: 'var(--gray-600)', fontSize: '0.9rem' }}>Blog Posts</p>
          </div>
        </div>
        
        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid var(--gray-200)',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{
            background: 'var(--accent-100)',
            padding: '0.75rem',
            borderRadius: '10px',
            color: 'var(--accent-600)'
          }}>
            <Image size={24} />
          </div>
          <div>
            <h3 style={{ margin: 0, color: 'var(--gray-900)' }}>{projectGallery.length}</h3>
            <p style={{ margin: 0, color: 'var(--gray-600)', fontSize: '0.9rem' }}>Gallery Items</p>
          </div>
        </div>
        
        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid var(--gray-200)',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{
            background: 'var(--success)',
            padding: '0.75rem',
            borderRadius: '10px',
            color: 'white'
          }}>
            <Settings size={24} />
          </div>
          <div>
            <h3 style={{ margin: 0, color: 'var(--gray-900)' }}>Active</h3>
            <p style={{ margin: 0, color: 'var(--gray-600)', fontSize: '0.9rem' }}>Admin Session</p>
          </div>
        </div>
        
        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid var(--gray-200)',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
            padding: '0.75rem',
            borderRadius: '10px',
            color: 'white'
          }}>
            <Upload size={24} />
          </div>
          <div>
            <h3 style={{ margin: 0, color: 'var(--gray-900)' }}>{uploadedFiles.length}</h3>
            <p style={{ margin: 0, color: 'var(--gray-600)', fontSize: '0.9rem' }}>Media Files</p>
          </div>
        </div>
        
        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid var(--gray-200)',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
            padding: '0.75rem',
            borderRadius: '10px',
            color: 'white'
          }}>
            <Bot size={24} />
          </div>
          <div>
            <h3 style={{ margin: 0, color: 'var(--gray-900)' }}>{chatMessages.length > 1 ? chatMessages.length - 1 : 0}</h3>
            <p style={{ margin: 0, color: 'var(--gray-600)', fontSize: '0.9rem' }}>Chat Messages</p>
          </div>
        </div>
      </div>
      
      <div style={{
        background: 'white',
        padding: '1.5rem',
        borderRadius: '12px',
        border: '1px solid var(--gray-200)'
      }}>
        <h3 style={{ marginBottom: '1rem', color: 'var(--gray-900)' }}>Quick Actions</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setAdminSection('blogs')}
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
          
          <button
            onClick={() => setAdminSection('gallery')}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'var(--accent-500)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Upload size={16} />
            Add Project
          </button>
          
          <button
            onClick={() => setAdminSection('media')}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'var(--gray-600)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Image size={16} />
            Media Library
          </button>
        </div>
      </div>
    </div>
  );

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
                onChange={(e) => setEditingBlog({...editingBlog, title: e.target.value})}
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
                onChange={(e) => setEditingBlog({...editingBlog, excerpt: e.target.value})}
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
                  onChange={(e) => setEditingBlog({...editingBlog, category: e.target.value})}
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
                  onChange={(e) => setEditingBlog({...editingBlog, readTime: e.target.value})}
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
                  onChange={(e) => setEditingBlog({...editingBlog, image: e.target.value})}
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
                onChange={(e) => setEditingBlog({...editingBlog, content: e.target.value})}
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
                        setEditingBlog({...editingBlog, image: file.data})
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

  // Admin Media Library Component
  const AdminMediaLibrary = () => {
    const [filterType, setFilterType] = useState('all')
    const [searchTerm, setSearchTerm] = useState('')
    
    const filteredFiles = uploadedFiles.filter(file => {
      const matchesType = filterType === 'all' || 
        (filterType === 'images' && file.type.startsWith('image/')) ||
        (filterType === 'documents' && !file.type.startsWith('image/'))
      
      const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase())
      
      return matchesType && matchesSearch
    })

    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ color: 'var(--gray-900)', margin: 0 }}>Media Library</h2>
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
        <div style={{ marginBottom: '2rem' }}>
          <DragDropUpload />
          
          {/* Upload Progress */}
          {Object.keys(uploadProgress).length > 0 && (
            <div style={{ marginTop: '1rem' }}>
              <h4 style={{ marginBottom: '0.5rem', color: 'var(--gray-700)' }}>Uploading...</h4>
              {Object.entries(uploadProgress).map(([fileId, progress]) => (
                <div key={fileId} style={{ marginBottom: '0.5rem' }}>
                  <div style={{
                    background: 'var(--gray-200)',
                    borderRadius: '4px',
                    height: '8px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      background: 'var(--primary-500)',
                      height: '100%',
                      width: `${progress}%`,
                      transition: 'width 0.3s ease',
                      borderRadius: '4px'
                    }} />
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: '0.25rem' }}>
                    {Math.round(progress)}% complete
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Files Grid */}
        {filteredFiles.length > 0 ? (
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
            </div>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '1rem'
            }}>
              {filteredFiles.map(file => (
                <FilePreview
                  key={file.id}
                  file={file}
                  onDelete={deleteUploadedFile}
                  onCopy={copyFileUrl}
                />
              ))}
            </div>
          </div>
        ) : (
          <div style={{
            background: 'white',
            border: '1px solid var(--gray-200)',
            borderRadius: '12px',
            padding: '3rem',
            textAlign: 'center',
            color: 'var(--gray-500)'
          }}>
            <Image size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--gray-600)' }}>
              {searchTerm ? 'No files match your search' : 'No files uploaded yet'}
            </h3>
            <p style={{ margin: 0 }}>
              {searchTerm ? 'Try adjusting your search terms' : 'Upload your first file using the area above'}
            </p>
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
                  onChange={(e) => setPaymentSettings(prev => ({...prev, processingFee: e.target.value}))}
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
                  onChange={(e) => setPaymentSettings(prev => ({...prev, minAmount: e.target.value}))}
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
                  onChange={(e) => setPaymentSettings(prev => ({...prev, maxAmount: e.target.value}))}
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
                          ? setNewPackage(prev => ({...prev, name: e.target.value}))
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
                          ? setNewPackage(prev => ({...prev, description: e.target.value}))
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
                          ? setNewPackage(prev => ({...prev, price: e.target.value}))
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
                            ? setNewPackage(prev => ({...prev, recurring: e.target.checked}))
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
                            ? setNewPackage(prev => ({...prev, customPrice: e.target.checked}))
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
            <p><a href="#services">Home Repairs</a></p>
            <p><a href="#services">Maintenance Plans</a></p>
            <p><a href="#services">Home Improvements</a></p>
            <p><a href="#services">Emergency Services</a></p>
            <p><a href="#services">Smart Home Solutions</a></p>
          </div>

          <div className="footer-section">
            <h3>Company</h3>
            <p><a href="#" onClick={(e) => {e.preventDefault(); setCurrentPage('about'); setShowSuccessPage(false);}}>About Us</a></p>
            <p><a href="#" onClick={(e) => {e.preventDefault(); setCurrentPage('blog'); setShowSuccessPage(false);}}>Blog</a></p>
            <p><a href="#" onClick={(e) => {e.preventDefault(); setCurrentPage('work-with-us'); setShowSuccessPage(false);}}>Careers</a></p>
            <p><a href="#" onClick={(e) => {e.preventDefault(); setCurrentPage('pay'); setShowSuccessPage(false);}}>Pay Invoice</a></p>
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

  // Success Page Component
  const SuccessPage = () => (
    <div style={{
      minHeight: 'calc(100vh - 120px)',
      background: '#f8f9fa',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '8px',
        padding: '40px',
        maxWidth: '500px',
        width: '100%',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        {/* Success Icon */}
        <div style={{
          width: '60px',
          height: '60px',
          background: '#28a745',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px'
        }}>
          <Check size={30} color="white" />
        </div>

        {/* Success Message */}
        <h1 style={{
          color: '#333',
          fontSize: '1.8rem',
          marginBottom: '15px',
          fontWeight: '600'
        }}>
          Request Submitted
        </h1>

        <p style={{
          color: '#666',
          fontSize: '1rem',
          marginBottom: '25px',
          lineHeight: '1.5'
        }}>
          Thank you for contacting Scottsdale Handyman Solutions. We will respond within 24 hours.
        </p>

        {/* Next Steps */}
        <div style={{
          background: '#f8f9fa',
          borderRadius: '6px',
          padding: '20px',
          marginBottom: '25px',
          textAlign: 'left'
        }}>
          <h3 style={{ color: '#333', marginBottom: '12px', fontSize: '1.1rem', fontWeight: '600' }}>Next Steps:</h3>
          <div style={{ color: '#555', fontSize: '0.9rem' }}>
            <p style={{ margin: '5px 0' }}>• Review of your project details</p>
            <p style={{ margin: '5px 0' }}>• Free consultation scheduling</p>
            <p style={{ margin: '5px 0' }}>• Detailed quote within 48 hours</p>
          </div>
        </div>

        {/* Contact Information */}
        <div style={{
          borderTop: '1px solid #e9ecef',
          paddingTop: '20px',
          marginBottom: '25px'
        }}>
          <p style={{ color: '#666', marginBottom: '8px', fontSize: '0.9rem' }}>
            For urgent matters:
          </p>
          <a href="tel:+14802555887" style={{
            color: '#dc3545',
            fontSize: '1.1rem',
            fontWeight: '600',
            textDecoration: 'none'
          }}>
            (480) 255-5887
          </a>
        </div>

        {/* Return Button */}
        <button
          onClick={() => setShowSuccessPage(false)}
          style={{
            background: '#007bff',
            color: 'white',
            border: 'none',
            padding: '10px 24px',
            borderRadius: '4px',
            fontSize: '1rem',
            cursor: 'pointer',
            fontWeight: '500',
            transition: 'background-color 0.2s ease'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
        >
          Return to Home
        </button>
      </div>
    </div>
  )

  // Main render
  return (
    <div className="App">
      {currentPage !== 'admin' && <Navigation />}
      
      {showSuccessPage ? (
        <SuccessPage />
      ) : (
        <>
          {currentPage === 'home' && <HomePage />}
          {currentPage === 'about' && <AboutPage />}
          {currentPage === 'blog' && <BlogPage />}
          {currentPage === 'work-with-us' && <WorkWithUsPage />}
          {currentPage === 'pay' && <PaymentPage />}
          {currentPage === 'admin' && <AdminPanel />}
        </>
      )}
      
      {currentPage !== 'admin' && !showSuccessPage && <Footer />}
      
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
  )
}

export default App

