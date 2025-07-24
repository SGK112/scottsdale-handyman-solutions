import { useState, useEffect } from 'react';
import {
    Eye, EyeOff, Plus, Edit3, Trash2, Save, Upload, X, Image,
    FileText, Share2, Filter, Search, Database, Edit2, Download,
    RotateCcw, MessageCircle, TrendingUp, Bot, Target, Send, Calendar,
    ExternalLink, Clock, MapPin, ChevronLeft, ChevronRight, Users,
    Phone, Mail, Home, Wrench, AlertCircle, CheckCircle, RefreshCw
} from 'lucide-react';

const ProPortalApp = () => {
    // Authentication state
    const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showSignup, setShowSignup] = useState(false);
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [loginError, setLoginError] = useState('');

    // API configuration
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002';

    // Check authentication on component mount
    useEffect(() => {
        const authStatus = localStorage.getItem('scottsdaleProAuth');
        if (authStatus === 'true') {
            setIsAdminLoggedIn(true);
        }
    }, []);

    // Logout handler
    const handleLogout = () => {
        localStorage.removeItem('scottsdaleProAuth');
        setIsAdminLoggedIn(false);
    };

    // ProDashboard component - main business management interface
    const ProDashboard = ({ onLogout }) => {
        const [activeSection, setActiveSection] = useState('dashboard')
        const [leads, setLeads] = useState([])
        const [invoices, setInvoices] = useState([])
        const [estimates, setEstimates] = useState([])
        const [timeEntries, setTimeEntries] = useState([])
        const [expenses, setExpenses] = useState([])
        const [projects, setProjects] = useState([])
        const [clients, setClients] = useState([])

        // Lead Management State
        const [showAddLead, setShowAddLead] = useState(false)
        const [editingLead, setEditingLead] = useState(null)
        const [leadFilter, setLeadFilter] = useState('all')
        const [leadSearch, setLeadSearch] = useState('')
        const [selectedLead, setSelectedLead] = useState(null)
        const [showLeadDetail, setShowLeadDetail] = useState(false)

        // Enhanced Lead Action States
        const [showEditForm, setShowEditForm] = useState(false)
        const [showContactForm, setShowContactForm] = useState(false)
        const [showScheduleForm, setShowScheduleForm] = useState(false)
        const [contactForm, setContactForm] = useState({
            contactType: 'phone',
            notes: '',
            outcome: 'interested',
            followUpDate: '',
            followUpTime: ''
        })
        const [scheduleForm, setScheduleForm] = useState({
            visitDate: '',
            visitTime: '',
            visitType: 'estimate',
            notes: '',
            address: '',
            duration: '1'
        })

        // Calendar Integration State
        const [calendarIntegration, setCalendarIntegration] = useState({
            googleCalendar: false,
            outlookCalendar: false,
            appleCalendar: false,
            defaultCalendar: 'google'
        })
        const [showCalendarSettings, setShowCalendarSettings] = useState(false)

        // Internal Calendar State
        const [calendarEvents, setCalendarEvents] = useState([])
        const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date())
        const [calendarView, setCalendarView] = useState('month') // 'month', 'week', 'day'
        const [showAddEvent, setShowAddEvent] = useState(false)
        const [selectedEvent, setSelectedEvent] = useState(null)
        const [showEventDetail, setShowEventDetail] = useState(false)
        const [eventForm, setEventForm] = useState({
            title: '',
            date: '',
            startTime: '',
            endTime: '',
            type: 'appointment',
            client: '',
            location: '',
            description: '',
            reminder: '15',
            status: 'scheduled'
        })

        // Lead Form State
        const [leadForm, setLeadForm] = useState({
            name: '',
            phone: '',
            email: '',
            address: '',
            service: '',
            description: '',
            urgency: 'medium',
            source: 'phone',
            estimatedValue: '',
            notes: ''
        })

        // Fetch leads from backend
        const fetchLeads = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/pro/leads`)
                const data = await response.json()
                if (data.success) {
                    setLeads(data.leads)
                }
            } catch (error) {
                console.error('Error fetching leads:', error)
                // Use sample data as fallback
                setLeads([
                    {
                        id: 1,
                        name: 'John Smith',
                        phone: '480-555-0123',
                        email: 'john@example.com',
                        address: '123 Desert View Dr, Scottsdale, AZ',
                        service: 'Kitchen Repair',
                        status: 'new',
                        date: '2025-01-15',
                        value: 850,
                        urgency: 'high',
                        source: 'website',
                        description: 'Kitchen sink is leaking and cabinet door is broken',
                        notes: 'Available weekends only'
                    },
                    {
                        id: 2,
                        name: 'Sarah Johnson',
                        phone: '480-555-0156',
                        email: 'sarah@example.com',
                        address: '456 Cactus Rd, Scottsdale, AZ',
                        service: 'Bathroom Remodel',
                        status: 'contacted',
                        date: '2025-01-14',
                        value: 2400,
                        urgency: 'medium',
                        source: 'referral',
                        description: 'Full bathroom renovation including tiles and fixtures',
                        notes: 'Budget approved, ready to start'
                    },
                    {
                        id: 3,
                        name: 'Mike Wilson',
                        phone: '480-555-0189',
                        email: 'mike@example.com',
                        address: '789 Mountain View Blvd, Scottsdale, AZ',
                        service: 'Deck Installation',
                        status: 'quoted',
                        date: '2025-01-13',
                        value: 3200,
                        urgency: 'low',
                        source: 'phone',
                        description: '20x12 composite deck with railing',
                        notes: 'Waiting for HOA approval'
                    },
                    {
                        id: 4,
                        name: 'Jennifer Brown',
                        phone: '480-555-0198',
                        email: 'jennifer@example.com',
                        address: '321 Palm Tree Lane, Scottsdale, AZ',
                        service: 'Fence Repair',
                        status: 'scheduled',
                        date: '2025-01-12',
                        value: 650,
                        urgency: 'high',
                        source: 'google',
                        description: 'Privacy fence damaged by wind, need 3 panels replaced',
                        notes: 'Insurance claim approved'
                    }
                ])
            }
        }

        // Add new lead
        const addLead = async (leadData) => {
            try {
                console.log('Adding lead:', leadData)
                const response = await fetch(`${API_BASE_URL}/api/pro/leads`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(leadData)
                })
                const data = await response.json()
                console.log('Server response:', data)
                if (data.success && data.lead) {
                    setLeads(prev => [data.lead, ...prev])
                    resetLeadForm()
                    setShowAddLead(false)
                    alert('Lead added successfully!')
                } else {
                    alert('Error: ' + (data.message || 'Failed to add lead'))
                }
            } catch (error) {
                console.error('Error adding lead:', error)
                // Fallback: add to local state
                const newLead = {
                    id: Date.now(),
                    ...leadData,
                    status: 'new',
                    date: new Date().toISOString().split('T')[0]
                }
                setLeads(prev => [newLead, ...prev])
                resetLeadForm()
                setShowAddLead(false)
                alert('Lead added (offline mode)')
            }
        }

        // Update lead status
        const updateLeadStatus = async (leadId, newStatus) => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/pro/leads/${leadId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: newStatus })
                })
                const data = await response.json()
                if (data.success) {
                    setLeads(prev => prev.map(lead =>
                        lead.id === leadId ? { ...lead, status: newStatus } : lead
                    ))
                }
            } catch (error) {
                console.error('Error updating lead:', error)
                // Fallback: update local state
                setLeads(prev => prev.map(lead =>
                    lead.id === leadId ? { ...lead, status: newStatus } : lead
                ))
            }
        }

        // Delete lead
        const deleteLead = async (leadId) => {
            if (!confirm('Are you sure you want to delete this lead?')) return

            try {
                const response = await fetch(`${API_BASE_URL}/api/pro/leads/${leadId}`, { method: 'DELETE' })
                const data = await response.json()
                if (data.success) {
                    setLeads(prev => prev.filter(lead => lead.id !== leadId))
                }
            } catch (error) {
                console.error('Error deleting lead:', error)
                // Fallback: delete from local state
                setLeads(prev => prev.filter(lead => lead.id !== leadId))
            }
        }

        // Reset lead form
        const resetLeadForm = () => {
            setLeadForm({
                name: '',
                phone: '',
                email: '',
                address: '',
                service: '',
                description: '',
                urgency: 'medium',
                source: 'phone',
                estimatedValue: '',
                notes: ''
            })
            setEditingLead(null)
        }

        // Enhanced Lead Action Functions
        const handleEditLead = (lead) => {
            setEditingLead(lead)
            setLeadForm({
                name: lead.name,
                phone: lead.phone,
                email: lead.email,
                address: lead.address,
                service: lead.service,
                description: lead.description,
                urgency: lead.urgency,
                source: lead.source,
                estimatedValue: lead.value?.toString() || '',
                notes: lead.notes || ''
            })
            setShowEditForm(true)
            setShowLeadDetail(false)
        }

        const handleMarkContacted = (lead) => {
            setSelectedLead(lead)
            setContactForm({
                contactType: 'phone',
                notes: '',
                outcome: 'interested',
                followUpDate: '',
                followUpTime: ''
            })
            setShowContactForm(true)
            setShowLeadDetail(false)
        }

        const handleScheduleVisit = (lead) => {
            setSelectedLead(lead)
            setScheduleForm({
                visitDate: '',
                visitTime: '',
                visitType: 'estimate',
                notes: '',
                address: lead.address || '',
                duration: '1'
            })
            setShowScheduleForm(true)
            setShowLeadDetail(false)
        }

        const submitContactForm = async () => {
            try {
                const contactData = {
                    leadId: selectedLead.id,
                    contactType: contactForm.contactType,
                    notes: contactForm.notes,
                    outcome: contactForm.outcome,
                    followUpDate: contactForm.followUpDate,
                    followUpTime: contactForm.followUpTime,
                    contactDate: new Date().toISOString().split('T')[0],
                    contactTime: new Date().toTimeString().split(' ')[0]
                }

                // Update lead status to contacted and last contact date
                const updatedLead = {
                    ...selectedLead,
                    status: 'contacted',
                    lastContact: new Date().toISOString().split('T')[0],
                    followUpDate: contactForm.followUpDate
                }

                setLeads(prev => prev.map(lead =>
                    lead.id === selectedLead.id ? updatedLead : lead
                ))

                setShowContactForm(false)
                setSelectedLead(null)

                // Here you would typically save to backend
                console.log('Contact logged:', contactData)
            } catch (error) {
                console.error('Error logging contact:', error)
            }
        }

        const submitScheduleForm = async () => {
            try {
                const scheduleData = {
                    leadId: selectedLead.id,
                    visitDate: scheduleForm.visitDate,
                    visitTime: scheduleForm.visitTime,
                    visitType: scheduleForm.visitType,
                    notes: scheduleForm.notes,
                    address: scheduleForm.address,
                    duration: scheduleForm.duration,
                    createdDate: new Date().toISOString().split('T')[0]
                }

                // Update lead status to scheduled
                const updatedLead = {
                    ...selectedLead,
                    status: 'scheduled',
                    followUpDate: scheduleForm.visitDate
                }

                setLeads(prev => prev.map(lead =>
                    lead.id === selectedLead.id ? updatedLead : lead
                ))

                setShowScheduleForm(false)
                setSelectedLead(null)

                // Here you would typically save to backend
                console.log('Visit scheduled:', scheduleData)
            } catch (error) {
                console.error('Error scheduling visit:', error)
            }
        }

        const updateEditedLead = async () => {
            try {
                const updatedLead = {
                    ...editingLead,
                    name: leadForm.name,
                    phone: leadForm.phone,
                    email: leadForm.email,
                    address: leadForm.address,
                    service: leadForm.service,
                    description: leadForm.description,
                    urgency: leadForm.urgency,
                    source: leadForm.source,
                    value: parseFloat(leadForm.estimatedValue) || 0,
                    notes: leadForm.notes
                }

                setLeads(prev => prev.map(lead =>
                    lead.id === editingLead.id ? updatedLead : lead
                ))

                setShowEditForm(false)
                resetLeadForm()

                // Here you would typically save to backend
                console.log('Lead updated:', updatedLead)
            } catch (error) {
                console.error('Error updating lead:', error)
            }
        }

        // Calendar Integration Functions
        const createGoogleCalendarEvent = (eventDetails) => {
            const { title, date, time, duration, location, description } = eventDetails

            // Convert date and time to Google Calendar format
            const startDateTime = new Date(`${date}T${time}:00`)
            const endDateTime = new Date(startDateTime.getTime() + (parseFloat(duration) * 60 * 60 * 1000))

            const googleCalendarUrl = new URL('https://calendar.google.com/calendar/render')
            googleCalendarUrl.searchParams.set('action', 'TEMPLATE')
            googleCalendarUrl.searchParams.set('text', title)
            googleCalendarUrl.searchParams.set('dates',
                `${startDateTime.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}/${endDateTime.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}`
            )
            googleCalendarUrl.searchParams.set('location', location)
            googleCalendarUrl.searchParams.set('details', description)

            return googleCalendarUrl.toString()
        }

        const createOutlookCalendarEvent = (eventDetails) => {
            const { title, date, time, duration, location, description } = eventDetails

            const startDateTime = new Date(`${date}T${time}:00`)
            const endDateTime = new Date(startDateTime.getTime() + (parseFloat(duration) * 60 * 60 * 1000))

            const outlookUrl = new URL('https://outlook.live.com/calendar/0/deeplink/compose')
            outlookUrl.searchParams.set('subject', title)
            outlookUrl.searchParams.set('startdt', startDateTime.toISOString())
            outlookUrl.searchParams.set('enddt', endDateTime.toISOString())
            outlookUrl.searchParams.set('location', location)
            outlookUrl.searchParams.set('body', description)

            return outlookUrl.toString()
        }

        const createAppleCalendarEvent = (eventDetails) => {
            const { title, date, time, duration, location, description } = eventDetails

            // Create ICS content for Apple Calendar
            const startDateTime = new Date(`${date}T${time}:00`)
            const endDateTime = new Date(startDateTime.getTime() + (parseFloat(duration) * 60 * 60 * 1000))

            const icsContent = [
                'BEGIN:VCALENDAR',
                'VERSION:2.0',
                'PRODID:-//Scottsdale Handyman Solutions//Lead Scheduler//EN',
                'BEGIN:VEVENT',
                `UID:${Date.now()}@scottsdalehandyman.com`,
                `DTSTART:${startDateTime.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}`,
                `DTEND:${endDateTime.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}`,
                `SUMMARY:${title}`,
                `DESCRIPTION:${description}`,
                `LOCATION:${location}`,
                'END:VEVENT',
                'END:VCALENDAR'
            ].join('\r\n')

            const blob = new Blob([icsContent], { type: 'text/calendar' })
            return URL.createObjectURL(blob)
        }

        const addToCalendar = (eventDetails, calendarType = 'google') => {
            let calendarUrl

            switch (calendarType) {
                case 'google':
                    calendarUrl = createGoogleCalendarEvent(eventDetails)
                    window.open(calendarUrl, '_blank')
                    break
                case 'outlook':
                    calendarUrl = createOutlookCalendarEvent(eventDetails)
                    window.open(calendarUrl, '_blank')
                    break
                case 'apple':
                    calendarUrl = createAppleCalendarEvent(eventDetails)
                    const link = document.createElement('a')
                    link.href = calendarUrl
                    link.download = `${eventDetails.title.replace(/\s+/g, '_')}.ics`
                    document.body.appendChild(link)
                    link.click()
                    document.body.removeChild(link)
                    URL.revokeObjectURL(calendarUrl)
                    break
                default:
                    console.error('Unsupported calendar type:', calendarType)
            }
        }

        const handleScheduleWithCalendar = async (calendarType) => {
            try {
                // First submit the schedule form
                await submitScheduleForm()

                // Create internal calendar event
                const newEvent = {
                    id: Date.now(),
                    title: `${scheduleForm.visitType.charAt(0).toUpperCase() + scheduleForm.visitType.slice(1)} - ${selectedLead.name}`,
                    date: scheduleForm.visitDate,
                    startTime: scheduleForm.visitTime,
                    endTime: addHoursToTime(scheduleForm.visitTime, parseFloat(scheduleForm.duration)),
                    type: 'appointment',
                    client: selectedLead.name,
                    clientPhone: selectedLead.phone,
                    clientEmail: selectedLead.email,
                    location: scheduleForm.address,
                    description: `${scheduleForm.visitType} visit for ${selectedLead.name}\n\nService: ${selectedLead.service}\nPhone: ${selectedLead.phone}\nEmail: ${selectedLead.email}\n\nNotes: ${scheduleForm.notes}`,
                    reminder: '15',
                    status: 'scheduled',
                    leadId: selectedLead.id,
                    createdAt: new Date().toISOString()
                }

                // Add to internal calendar
                setCalendarEvents(prev => [...prev, newEvent])

                // Create calendar event details for external sync
                const eventDetails = {
                    title: `${scheduleForm.visitType.charAt(0).toUpperCase() + scheduleForm.visitType.slice(1)} - ${selectedLead.name}`,
                    date: scheduleForm.visitDate,
                    time: scheduleForm.visitTime,
                    duration: scheduleForm.duration,
                    location: scheduleForm.address,
                    description: `${scheduleForm.visitType} visit for ${selectedLead.name}\n\nService: ${selectedLead.service}\nPhone: ${selectedLead.phone}\nEmail: ${selectedLead.email}\n\nNotes: ${scheduleForm.notes}`
                }

                // Add to external calendar
                addToCalendar(eventDetails, calendarType)

                console.log('Event added to both internal and external calendar:', eventDetails)
            } catch (error) {
                console.error('Error scheduling with calendar:', error)
            }
        }

        // Internal Calendar Functions
        const addHoursToTime = (time, hours) => {
            const [h, m] = time.split(':').map(Number)
            const date = new Date()
            date.setHours(h, m)
            date.setTime(date.getTime() + (hours * 60 * 60 * 1000))
            return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
        }

        const addCalendarEvent = async (eventData) => {
            try {
                const newEvent = {
                    id: Date.now(),
                    ...eventData,
                    createdAt: new Date().toISOString()
                }
                setCalendarEvents(prev => [...prev, newEvent])

                // Optionally sync to external calendar
                if (calendarIntegration.defaultCalendar) {
                    const eventDetails = {
                        title: eventData.title,
                        date: eventData.date,
                        time: eventData.startTime,
                        duration: calculateDuration(eventData.startTime, eventData.endTime),
                        location: eventData.location,
                        description: eventData.description
                    }

                    const calendarUrl = addToCalendar(eventDetails, calendarIntegration.defaultCalendar)
                    if (calendarUrl && calendarIntegration.defaultCalendar !== 'apple') {
                        // Auto-open external calendar for non-Apple calendars
                        setTimeout(() => window.open(calendarUrl, '_blank'), 1000)
                    }
                }

                return newEvent
            } catch (error) {
                console.error('Error adding calendar event:', error)
                throw error
            }
        }

        const updateCalendarEvent = async (eventId, updates) => {
            try {
                setCalendarEvents(prev => prev.map(event =>
                    event.id === eventId ? { ...event, ...updates } : event
                ))
            } catch (error) {
                console.error('Error updating calendar event:', error)
                throw error
            }
        }

        const deleteCalendarEvent = async (eventId) => {
            try {
                setCalendarEvents(prev => prev.filter(event => event.id !== eventId))
            } catch (error) {
                console.error('Error deleting calendar event:', error)
                throw error
            }
        }

        const calculateDuration = (startTime, endTime) => {
            const [startH, startM] = startTime.split(':').map(Number)
            const [endH, endM] = endTime.split(':').map(Number)
            const startMinutes = startH * 60 + startM
            const endMinutes = endH * 60 + endM
            return Math.max(0, (endMinutes - startMinutes) / 60).toString()
        }

        const getCalendarEventsForDate = (date) => {
            const dateStr = date.toISOString().split('T')[0]
            return calendarEvents.filter(event => event.date === dateStr)
        }

        const getCalendarEventsForMonth = (date) => {
            const year = date.getFullYear()
            const month = date.getMonth()
            return calendarEvents.filter(event => {
                const eventDate = new Date(event.date)
                return eventDate.getFullYear() === year && eventDate.getMonth() === month
            })
        }

        const syncExternalCalendar = (calendarType = calendarIntegration.defaultCalendar) => {
            // Export all events to external calendar
            calendarEvents.forEach(event => {
                const eventDetails = {
                    title: event.title,
                    date: event.date,
                    time: event.startTime,
                    duration: calculateDuration(event.startTime, event.endTime),
                    location: event.location,
                    description: event.description
                }

                const calendarUrl = addToCalendar(eventDetails, calendarType)
                if (calendarUrl && calendarType !== 'apple') {
                    setTimeout(() => window.open(calendarUrl, '_blank'), 500)
                }
            })
        }

        // Filter and search leads
        const filteredLeads = leads.filter(lead => {
            const matchesFilter = leadFilter === 'all' || lead.status === leadFilter
            const matchesSearch = leadSearch === '' ||
                lead.name.toLowerCase().includes(leadSearch.toLowerCase()) ||
                lead.service.toLowerCase().includes(leadSearch.toLowerCase()) ||
                lead.phone.includes(leadSearch)
            return matchesFilter && matchesSearch
        })

        // Load sample calendar events
        useEffect(() => {
            const sampleEvents = [
                {
                    id: 1,
                    title: 'Kitchen Repair - John Smith',
                    date: new Date().toISOString().split('T')[0],
                    startTime: '09:00',
                    endTime: '11:00',
                    type: 'appointment',
                    client: 'John Smith',
                    clientPhone: '480-555-0123',
                    clientEmail: 'john@example.com',
                    location: '123 Desert View Dr, Scottsdale, AZ',
                    description: 'Kitchen cabinet repair and faucet replacement',
                    status: 'scheduled',
                    leadId: 1
                },
                {
                    id: 2,
                    title: 'Bathroom Estimate - Sarah Johnson',
                    date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
                    startTime: '14:00',
                    endTime: '15:00',
                    type: 'estimate',
                    client: 'Sarah Johnson',
                    clientPhone: '480-555-0156',
                    clientEmail: 'sarah@example.com',
                    location: '456 Cactus Rd, Scottsdale, AZ',
                    description: 'Bathroom remodel estimate',
                    status: 'scheduled',
                    leadId: 2
                }
            ]
            setCalendarEvents(sampleEvents)
        }, [])

        // Calendar View Components
        const CalendarMonthView = ({ currentDate, events, onEventClick, onDateClick }) => {
            const year = currentDate.getFullYear()
            const month = currentDate.getMonth()
            const firstDay = new Date(year, month, 1)
            const lastDay = new Date(year, month + 1, 0)
            const startDate = new Date(firstDay)
            startDate.setDate(startDate.getDate() - firstDay.getDay())

            const days = []
            for (let i = 0; i < 42; i++) {
                const day = new Date(startDate)
                day.setDate(startDate.getDate() + i)
                days.push(day)
            }

            const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

            return (
                <div>
                    {/* Day headers */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(7, 1fr)',
                        gap: '1px',
                        marginBottom: '10px'
                    }}>
                        {dayNames.map(day => (
                            <div key={day} style={{
                                padding: '12px',
                                textAlign: 'center',
                                fontWeight: '600',
                                color: '#6b7280',
                                fontSize: '14px'
                            }}>
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(7, 1fr)',
                        gap: '1px',
                        background: '#e5e7eb'
                    }}>
                        {days.map((day, index) => {
                            const dateStr = day.toISOString().split('T')[0]
                            const dayEvents = events.filter(event => event.date === dateStr)
                            const isCurrentMonth = day.getMonth() === month
                            const isToday = day.toDateString() === new Date().toDateString()

                            return (
                                <div
                                    key={index}
                                    onClick={() => onDateClick(day)}
                                    style={{
                                        background: 'white',
                                        minHeight: '100px',
                                        padding: '8px',
                                        cursor: 'pointer',
                                        opacity: isCurrentMonth ? 1 : 0.4,
                                        border: isToday ? '2px solid #3b82f6' : 'none',
                                        position: 'relative'
                                    }}
                                >
                                    <div style={{
                                        fontSize: '14px',
                                        fontWeight: isToday ? '700' : '500',
                                        color: isToday ? '#3b82f6' : '#374151',
                                        marginBottom: '4px'
                                    }}>
                                        {day.getDate()}
                                    </div>
                                    <div style={{ fontSize: '11px' }}>
                                        {dayEvents.map(event => (
                                            <div
                                                key={event.id}
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    onEventClick(event)
                                                }}
                                                style={{
                                                    background: event.type === 'appointment' ? '#10b981' : '#3b82f6',
                                                    color: 'white',
                                                    padding: '2px 6px',
                                                    borderRadius: '4px',
                                                    marginBottom: '2px',
                                                    cursor: 'pointer',
                                                    fontSize: '10px',
                                                    fontWeight: '500',
                                                    overflow: 'hidden',
                                                    whiteSpace: 'nowrap',
                                                    textOverflow: 'ellipsis'
                                                }}
                                            >
                                                {event.startTime} {event.title.split(' - ')[0]}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )
        }

        const CalendarWeekView = ({ currentDate, events, onEventClick }) => {
            const startOfWeek = new Date(currentDate)
            startOfWeek.setDate(currentDate.getDate() - currentDate.getDay())

            const weekDays = []
            for (let i = 0; i < 7; i++) {
                const day = new Date(startOfWeek)
                day.setDate(startOfWeek.getDate() + i)
                weekDays.push(day)
            }

            const hours = Array.from({ length: 12 }, (_, i) => i + 8) // 8 AM to 7 PM

            return (
                <div>
                    {/* Week header */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '60px repeat(7, 1fr)',
                        gap: '1px',
                        marginBottom: '10px'
                    }}>
                        <div></div>
                        {weekDays.map(day => (
                            <div key={day.toISOString()} style={{
                                padding: '12px',
                                textAlign: 'center',
                                fontWeight: '600',
                                color: '#374151'
                            }}>
                                <div style={{ fontSize: '14px', marginBottom: '4px' }}>
                                    {day.toLocaleDateString('en-US', { weekday: 'short' })}
                                </div>
                                <div style={{ fontSize: '16px' }}>
                                    {day.getDate()}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Week grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '60px repeat(7, 1fr)',
                        gap: '1px',
                        background: '#f3f4f6'
                    }}>
                        {hours.map(hour => (
                            <React.Fragment key={hour}>
                                <div style={{
                                    padding: '8px',
                                    fontSize: '12px',
                                    color: '#6b7280',
                                    background: 'white',
                                    textAlign: 'center'
                                }}>
                                    {hour}:00
                                </div>
                                {weekDays.map(day => {
                                    const dateStr = day.toISOString().split('T')[0]
                                    const hourEvents = events.filter(event => {
                                        if (event.date !== dateStr) return false
                                        const eventHour = parseInt(event.startTime.split(':')[0])
                                        return eventHour === hour
                                    })

                                    return (
                                        <div
                                            key={`${day.toISOString()}-${hour}`}
                                            style={{
                                                background: 'white',
                                                minHeight: '60px',
                                                padding: '4px',
                                                position: 'relative'
                                            }}
                                        >
                                            {hourEvents.map(event => (
                                                <div
                                                    key={event.id}
                                                    onClick={() => onEventClick(event)}
                                                    style={{
                                                        background: event.type === 'appointment' ? '#10b981' : '#3b82f6',
                                                        color: 'white',
                                                        padding: '4px 6px',
                                                        borderRadius: '4px',
                                                        fontSize: '11px',
                                                        cursor: 'pointer',
                                                        fontWeight: '500',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap'
                                                    }}
                                                >
                                                    {event.title}
                                                </div>
                                            ))}
                                        </div>
                                    )
                                })}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            )
        }

        const CalendarDayView = ({ currentDate, events, onEventClick }) => {
            const hours = Array.from({ length: 12 }, (_, i) => i + 8) // 8 AM to 7 PM

            return (
                <div>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '80px 1fr',
                        gap: '1px',
                        background: '#f3f4f6'
                    }}>
                        {hours.map(hour => {
                            const hourEvents = events.filter(event => {
                                const eventHour = parseInt(event.startTime.split(':')[0])
                                return eventHour === hour
                            })

                            return (
                                <React.Fragment key={hour}>
                                    <div style={{
                                        padding: '12px',
                                        fontSize: '14px',
                                        color: '#6b7280',
                                        background: 'white',
                                        textAlign: 'center',
                                        fontWeight: '500'
                                    }}>
                                        {hour}:00
                                    </div>
                                    <div style={{
                                        background: 'white',
                                        minHeight: '80px',
                                        padding: '8px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '4px'
                                    }}>
                                        {hourEvents.map(event => (
                                            <div
                                                key={event.id}
                                                onClick={() => onEventClick(event)}
                                                style={{
                                                    background: event.type === 'appointment' ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #3b82f6, #1e40af)',
                                                    color: 'white',
                                                    padding: '12px',
                                                    borderRadius: '8px',
                                                    cursor: 'pointer',
                                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                                }}
                                            >
                                                <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                                                    {event.title}
                                                </div>
                                                <div style={{ fontSize: '12px', opacity: 0.9 }}>
                                                    {event.startTime} - {event.endTime}
                                                </div>
                                                <div style={{ fontSize: '12px', opacity: 0.8 }}>
                                                    {event.location}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </React.Fragment>
                            )
                        })}
                    </div>
                </div>
            )
        }

        // Sample data - in production this would come from the backend
        useState(() => {
            setLeads([
                {
                    id: 1,
                    name: 'John Smith',
                    phone: '480-555-0123',
                    email: 'john.smith@email.com',
                    address: '1234 Desert View Dr, Scottsdale, AZ 85251',
                    service: 'Kitchen Repair',
                    description: 'Kitchen cabinet doors are not closing properly, hinges need adjustment or replacement. Also need to fix a leaky faucet and replace the garbage disposal unit.',
                    status: 'new',
                    date: '2025-01-15',
                    value: 850,
                    urgency: 'medium',
                    source: 'website',
                    notes: 'Customer mentioned they need work completed before hosting a dinner party next month.',
                    lastContact: '2025-01-15',
                    followUpDate: '2025-01-18',
                    preferredContactTime: 'Evenings after 6pm'
                },
                {
                    id: 2,
                    name: 'Sarah Johnson',
                    phone: '480-555-0156',
                    email: 'sarah.j@email.com',
                    address: '5678 Oak Street, Phoenix, AZ 85016',
                    service: 'Bathroom Remodel',
                    description: 'Complete bathroom renovation - new tile, vanity, toilet, and shower fixtures. Looking for modern design with neutral colors.',
                    status: 'contacted',
                    date: '2025-01-14',
                    value: 2400,
                    urgency: 'low',
                    source: 'referral',
                    notes: 'Referred by Mike Wilson. Very detail-oriented customer, wants multiple quotes for comparison.',
                    lastContact: '2025-01-16',
                    followUpDate: '2025-01-20',
                    preferredContactTime: 'Weekday mornings'
                },
                {
                    id: 3,
                    name: 'Mike Wilson',
                    phone: '480-555-0189',
                    email: 'mike.w@email.com',
                    address: '9012 Pine Avenue, Tempe, AZ 85284',
                    service: 'Deck Installation',
                    description: 'Build new composite deck in backyard, approximately 16x20 feet. Include railing and steps. Prefer low-maintenance materials.',
                    status: 'scheduled',
                    date: '2025-01-13',
                    value: 3200,
                    urgency: 'high',
                    source: 'google',
                    notes: 'Scheduled for site visit on Jan 22nd at 10am. Customer wants work completed before spring.',
                    lastContact: '2025-01-17',
                    followUpDate: '2025-01-22',
                    preferredContactTime: 'Flexible schedule'
                }
            ])
            setInvoices([
                { id: 'INV-001', client: 'John Smith', amount: 850, status: 'paid', date: '2025-01-10', dueDate: '2025-01-24' },
                { id: 'INV-002', client: 'Sarah Johnson', amount: 1200, status: 'pending', date: '2025-01-12', dueDate: '2025-01-26' },
                { id: 'INV-003', client: 'Mike Wilson', amount: 3200, status: 'overdue', date: '2025-01-05', dueDate: '2025-01-19' }
            ])
            setEstimates([
                { id: 'EST-001', client: 'Jennifer Brown', service: 'Fence Repair', amount: 650, status: 'sent', date: '2025-01-14' },
                { id: 'EST-002', client: 'David Lee', service: 'Tile Installation', amount: 1800, status: 'approved', date: '2025-01-13' }
            ])
            setTimeEntries([
                { id: 1, project: 'Kitchen Repair - John Smith', hours: 6.5, rate: 85, date: '2025-01-15', total: 552.50 },
                { id: 2, project: 'Bathroom Remodel - Sarah Johnson', hours: 8, rate: 85, date: '2025-01-14', total: 680 }
            ])
            setExpenses([
                { id: 1, description: 'Gas - Job Site Travel', amount: 45.20, category: 'Vehicle', date: '2025-01-15', receipt: true },
                { id: 2, description: 'Hardware Store - Supplies', amount: 123.45, category: 'Materials', date: '2025-01-14', receipt: true },
                { id: 3, description: 'Lunch - Client Meeting', amount: 18.50, category: 'Meals', date: '2025-01-13', receipt: false }
            ])
            setClients([
                {
                    id: 1,
                    name: 'John Smith',
                    email: 'john.smith@email.com',
                    phone: '480-555-0123',
                    address: '1234 Main St, Scottsdale, AZ',
                    projectCount: 3,
                    totalValue: '8,500',
                    lastContact: 'Jan 15, 2025'
                },
                {
                    id: 2,
                    name: 'Sarah Johnson',
                    email: 'sarah.j@email.com',
                    phone: '480-555-0156',
                    address: '5678 Oak Ave, Phoenix, AZ',
                    projectCount: 2,
                    totalValue: '4,200',
                    lastContact: 'Jan 14, 2025'
                },
                {
                    id: 3,
                    name: 'Mike Wilson',
                    email: 'mike.w@email.com',
                    phone: '480-555-0189',
                    address: '9012 Pine Dr, Tempe, AZ',
                    projectCount: 1,
                    totalValue: '3,200',
                    lastContact: 'Jan 13, 2025'
                },
                {
                    id: 4,
                    name: 'Jennifer Davis',
                    email: 'jen.davis@email.com',
                    phone: '480-555-0212',
                    address: '3456 Elm St, Chandler, AZ',
                    projectCount: 4,
                    totalValue: '12,800',
                    lastContact: 'Jan 12, 2025'
                },
                {
                    id: 5,
                    name: 'Robert Chen',
                    email: 'robert.chen@email.com',
                    phone: '480-555-0245',
                    address: '7890 Maple Ln, Mesa, AZ',
                    projectCount: 2,
                    totalValue: '6,750',
                    lastContact: 'Jan 10, 2025'
                },
                {
                    id: 6,
                    name: 'Lisa Martinez',
                    email: 'lisa.m@email.com',
                    phone: '480-555-0278',
                    address: '2468 Cedar Way, Glendale, AZ',
                    projectCount: 1,
                    totalValue: '2,800',
                    lastContact: 'Jan 8, 2025'
                }
            ])
        }, [])

        return (
            <div style={{
                minHeight: '100vh',
                background: '#f8f9fa',
                padding: window.innerWidth <= 768 ? '10px' : '20px'
            }}>
                {/* Pro Dashboard Header */}
                <div style={{
                    background: 'linear-gradient(135deg, #1e3a5f, #2c5aa0)',
                    borderRadius: '16px',
                    padding: window.innerWidth <= 768 ? '20px' : '32px',
                    marginBottom: window.innerWidth <= 768 ? '20px' : '32px',
                    boxShadow: '0 8px 32px rgba(30, 58, 95, 0.15)',
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    {/* Background Pattern */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: '120px',
                        height: '120px',
                        background: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
                        backgroundSize: '20px 20px',
                        opacity: 0.3
                    }}></div>

                    <div style={{
                        display: 'flex',
                        flexDirection: window.innerWidth <= 768 ? 'column' : 'row',
                        justifyContent: 'space-between',
                        alignItems: window.innerWidth <= 768 ? 'flex-start' : 'center',
                        gap: window.innerWidth <= 768 ? '20px' : '0',
                        position: 'relative',
                        zIndex: 1
                    }}>
                        <div>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                marginBottom: '8px'
                            }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    background: 'rgba(255,255,255,0.2)',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(255,255,255,0.3)'
                                }}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                                    </svg>
                                </div>
                                <h1 style={{
                                    margin: 0,
                                    fontSize: window.innerWidth <= 768 ? '26px' : '32px',
                                    fontWeight: '800',
                                    color: 'white',
                                    letterSpacing: '-0.5px'
                                }}>
                                    Pro Dashboard
                                </h1>
                            </div>
                            <p style={{
                                margin: 0,
                                fontSize: window.innerWidth <= 768 ? '15px' : '17px',
                                opacity: 0.9,
                                color: 'rgba(255,255,255,0.95)',
                                fontWeight: '400'
                            }}>
                                Welcome back! Manage your business operations with precision.
                            </p>
                        </div>
                        <div style={{
                            display: 'flex',
                            flexDirection: window.innerWidth <= 768 ? 'column' : 'row',
                            gap: window.innerWidth <= 768 ? '12px' : '16px',
                            alignItems: window.innerWidth <= 768 ? 'stretch' : 'center',
                            width: window.innerWidth <= 768 ? '100%' : 'auto'
                        }}>
                            <div style={{
                                background: 'rgba(255,255,255,0.15)',
                                borderRadius: '12px',
                                padding: '16px 20px',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                textAlign: 'center',
                                minWidth: '140px'
                            }}>
                                <div style={{
                                    fontSize: '12px',
                                    opacity: 0.8,
                                    color: 'rgba(255,255,255,0.8)',
                                    marginBottom: '4px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                    fontWeight: '500'
                                }}>Today's Revenue</div>
                                <div style={{
                                    fontSize: window.innerWidth <= 768 ? '24px' : '28px',
                                    fontWeight: '800',
                                    color: 'white'
                                }}>$1,232</div>
                            </div>

                            <div style={{
                                display: 'flex',
                                flexDirection: window.innerWidth <= 768 ? 'column' : 'row',
                                gap: window.innerWidth <= 768 ? '8px' : '12px',
                                width: window.innerWidth <= 768 ? '100%' : 'auto'
                            }}>
                                <button
                                    onClick={() => {
                                        // Multiple fallback strategies
                                        let websiteUrl;
                                        
                                        // Strategy 1: Environment variable
                                        if (import.meta.env.VITE_WEBSITE_URL) {
                                            websiteUrl = import.meta.env.VITE_WEBSITE_URL;
                                        }
                                        // Strategy 2: Check if we're in development
                                        else if (window.location.hostname === 'localhost') {
                                            websiteUrl = 'http://localhost:5173';
                                        }
                                        // Strategy 3: Production fallback
                                        else {
                                            websiteUrl = 'https://scottsdale-handyman-website.onrender.com';
                                        }
                                        
                                        console.log('View Site button clicked, URL:', websiteUrl);
                                        console.log('Current location:', window.location.href);
                                        console.log('Environment vars:', import.meta.env);
                                        
                                        try {
                                            window.open(websiteUrl, '_blank');
                                        } catch (error) {
                                            console.error('Error opening window:', error);
                                            // Fallback: try direct navigation
                                            window.location.href = websiteUrl;
                                        }
                                    }}
                                    style={{
                                        padding: window.innerWidth <= 768 ? '14px 18px' : '12px 24px',
                                        background: 'rgba(255,255,255,0.2)',
                                        border: '1px solid rgba(255,255,255,0.3)',
                                        borderRadius: '10px',
                                        cursor: 'pointer',
                                        color: 'white',
                                        backdropFilter: 'blur(10px)',
                                        fontSize: window.innerWidth <= 768 ? '14px' : '15px',
                                        fontWeight: '600',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        justifyContent: 'center',
                                        transition: 'all 0.3s ease',
                                        ':hover': {
                                            background: 'rgba(255,255,255,0.3)'
                                        }
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.background = 'rgba(255,255,255,0.3)';
                                        e.target.style.transform = 'translateY(-1px)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.background = 'rgba(255,255,255,0.2)';
                                        e.target.style.transform = 'translateY(0)';
                                    }}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                        <polyline points="9,22 9,12 15,12 15,22" />
                                    </svg>
                                    View Site
                                </button>
                                <button
                                    onClick={() => setShowCalendarSettings(true)}
                                    style={{
                                        padding: window.innerWidth <= 768 ? '14px 18px' : '12px 24px',
                                        background: 'rgba(255,255,255,0.2)',
                                        color: 'white',
                                        border: '1px solid rgba(255,255,255,0.3)',
                                        borderRadius: '10px',
                                        cursor: 'pointer',
                                        fontSize: window.innerWidth <= 768 ? '14px' : '15px',
                                        fontWeight: '600',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        justifyContent: 'center',
                                        transition: 'all 0.3s ease',
                                        backdropFilter: 'blur(10px)'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.background = 'rgba(255,255,255,0.3)';
                                        e.target.style.transform = 'translateY(-1px)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.background = 'rgba(255,255,255,0.2)';
                                        e.target.style.transform = 'translateY(0)';
                                    }}
                                >
                                    <Calendar size={16} />
                                    Calendar
                                </button>
                                <button
                                    onClick={onLogout}
                                    style={{
                                        padding: window.innerWidth <= 768 ? '14px 18px' : '12px 24px',
                                        background: '#ef4444',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '10px',
                                        cursor: 'pointer',
                                        fontSize: window.innerWidth <= 768 ? '14px' : '15px',
                                        fontWeight: '600',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        justifyContent: 'center',
                                        transition: 'all 0.3s ease',
                                        boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.background = '#dc2626';
                                        e.target.style.transform = 'translateY(-1px)';
                                        e.target.style.boxShadow = '0 6px 16px rgba(239, 68, 68, 0.5)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.background = '#ef4444';
                                        e.target.style.transform = 'translateY(0)';
                                        e.target.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.4)';
                                    }}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                        <polyline points="16,17 21,12 16,7" />
                                        <line x1="21" y1="12" x2="9" y2="12" />
                                    </svg>
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '8px',
                    marginBottom: window.innerWidth <= 768 ? '20px' : '32px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    overflow: 'hidden',
                    border: '1px solid rgba(0,0,0,0.05)'
                }}>
                    <div style={{
                        display: 'flex',
                        overflowX: 'auto',
                        scrollbarWidth: 'none', /* Firefox */
                        msOverflowStyle: 'none', /* IE/Edge */
                        WebkitScrollbar: { display: 'none' }, /* Chrome/Safari */
                        gap: '4px'
                    }}>
                        {[
                            {
                                id: 'dashboard', label: window.innerWidth <= 768 ? 'Dashboard' : 'Dashboard', icon: (
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="3" y="3" width="7" height="7" />
                                        <rect x="14" y="3" width="7" height="7" />
                                        <rect x="14" y="14" width="7" height="7" />
                                        <rect x="3" y="14" width="7" height="7" />
                                    </svg>
                                )
                            },
                            {
                                id: 'calendar', label: window.innerWidth <= 768 ? 'Calendar' : 'Calendar', icon: (
                                    <Calendar size={18} />
                                )
                            },
                            {
                                id: 'leads', label: window.innerWidth <= 768 ? 'Leads' : 'Leads', icon: (
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                        <circle cx="9" cy="7" r="4" />
                                        <path d="m22 2-5 5" />
                                        <path d="m17 7 5-5" />
                                    </svg>
                                )
                            },
                            {
                                id: 'projects', label: window.innerWidth <= 768 ? 'Projects' : 'Projects', icon: (
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                                        <line x1="8" y1="21" x2="16" y2="21" />
                                        <line x1="12" y1="17" x2="12" y2="21" />
                                    </svg>
                                )
                            },
                            {
                                id: 'invoices', label: window.innerWidth <= 768 ? 'Invoices' : 'Invoices', icon: (
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                        <polyline points="14,2 14,8 20,8" />
                                        <line x1="16" y1="13" x2="8" y2="13" />
                                        <line x1="16" y1="17" x2="8" y2="17" />
                                        <polyline points="10,9 9,9 8,9" />
                                    </svg>
                                )
                            },
                            {
                                id: 'estimates', label: window.innerWidth <= 768 ? 'Estimates' : 'Estimates', icon: (
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M9 11H5a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2h-4l-3-3H9l-3 3" />
                                        <path d="M9 7V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v3" />
                                    </svg>
                                )
                            },
                            {
                                id: 'time', label: window.innerWidth <= 768 ? 'Time' : 'Time Tracking', icon: (
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10" />
                                        <polyline points="12,6 12,12 16,14" />
                                    </svg>
                                )
                            },
                            {
                                id: 'expenses', label: window.innerWidth <= 768 ? 'Expenses' : 'Expenses', icon: (
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <line x1="12" y1="1" x2="12" y2="23" />
                                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                                    </svg>
                                )
                            },
                            {
                                id: 'clients', label: window.innerWidth <= 768 ? 'Clients' : 'Clients', icon: (
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                        <circle cx="9" cy="7" r="4" />
                                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                    </svg>
                                )
                            }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveSection(tab.id)}
                                style={{
                                    padding: window.innerWidth <= 768 ? '12px 16px' : '14px 20px',
                                    border: 'none',
                                    background: activeSection === tab.id ? 'linear-gradient(135deg, #1e3a5f, #2c5aa0)' : 'transparent',
                                    color: activeSection === tab.id ? 'white' : '#6b7280',
                                    cursor: 'pointer',
                                    fontSize: window.innerWidth <= 768 ? '13px' : '14px',
                                    fontWeight: activeSection === tab.id ? '600' : '500',
                                    whiteSpace: 'nowrap',
                                    transition: 'all 0.3s ease',
                                    minWidth: window.innerWidth <= 768 ? 'auto' : 'auto',
                                    textAlign: 'center',
                                    flex: '0 0 auto',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    boxShadow: activeSection === tab.id ? '0 4px 12px rgba(30, 58, 95, 0.3)' : 'none'
                                }}
                                onMouseEnter={(e) => {
                                    if (activeSection !== tab.id) {
                                        e.target.style.background = '#f3f4f6';
                                        e.target.style.color = '#374151';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (activeSection !== tab.id) {
                                        e.target.style.background = 'transparent';
                                        e.target.style.color = '#6b7280';
                                    }
                                }}
                            >
                                {tab.icon}
                                {window.innerWidth > 640 && tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Dashboard Content */}
                {activeSection === 'dashboard' && (
                    <div>
                        {/* Stats Cards */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: window.innerWidth <= 768 ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))',
                            gap: window.innerWidth <= 768 ? '16px' : '24px',
                            marginBottom: window.innerWidth <= 768 ? '24px' : '32px'
                        }}>
                            <div style={{
                                background: 'linear-gradient(135deg, #10b981, #059669)',
                                color: 'white',
                                padding: window.innerWidth <= 768 ? '24px' : '28px',
                                borderRadius: '18px',
                                boxShadow: '0 8px 32px rgba(16,185,129,0.25)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                position: 'relative',
                                overflow: 'hidden',
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(16,185,129,0.35)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(16,185,129,0.25)';
                                }}
                            >
                                {/* Background Pattern */}
                                <div style={{
                                    position: 'absolute',
                                    top: '-20px',
                                    right: '-20px',
                                    width: '80px',
                                    height: '80px',
                                    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 2px, transparent 2px)',
                                    backgroundSize: '16px 16px',
                                    borderRadius: '50%'
                                }}></div>

                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start',
                                    position: 'relative',
                                    zIndex: 1
                                }}>
                                    <div>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            marginBottom: '12px'
                                        }}>
                                            <div style={{
                                                width: '32px',
                                                height: '32px',
                                                background: 'rgba(255,255,255,0.2)',
                                                borderRadius: '10px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                backdropFilter: 'blur(10px)'
                                            }}>
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                                    <circle cx="9" cy="7" r="4" />
                                                    <path d="m22 2-5 5" />
                                                    <path d="m17 7 5-5" />
                                                </svg>
                                            </div>
                                            <div style={{
                                                fontSize: window.innerWidth <= 768 ? '13px' : '14px',
                                                opacity: 0.9,
                                                fontWeight: '600',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px'
                                            }}>Active Leads</div>
                                        </div>
                                        <div style={{
                                            fontSize: window.innerWidth <= 768 ? '32px' : '36px',
                                            fontWeight: '800',
                                            lineHeight: '1',
                                            marginBottom: '8px'
                                        }}>{leads.length}</div>
                                        <div style={{
                                            fontSize: '13px',
                                            opacity: 0.8,
                                            fontWeight: '500'
                                        }}>+12% from last week</div>
                                    </div>
                                </div>
                            </div>

                            <div style={{
                                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                                color: 'white',
                                padding: window.innerWidth <= 768 ? '24px' : '28px',
                                borderRadius: '18px',
                                boxShadow: '0 8px 32px rgba(59,130,246,0.25)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                position: 'relative',
                                overflow: 'hidden',
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(59,130,246,0.35)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(59,130,246,0.25)';
                                }}
                            >
                                <div style={{
                                    position: 'absolute',
                                    top: '-20px',
                                    right: '-20px',
                                    width: '80px',
                                    height: '80px',
                                    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 2px, transparent 2px)',
                                    backgroundSize: '16px 16px',
                                    borderRadius: '50%'
                                }}></div>

                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start',
                                    position: 'relative',
                                    zIndex: 1
                                }}>
                                    <div>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            marginBottom: '12px'
                                        }}>
                                            <div style={{
                                                width: '32px',
                                                height: '32px',
                                                background: 'rgba(255,255,255,0.2)',
                                                borderRadius: '10px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                backdropFilter: 'blur(10px)'
                                            }}>
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                                    <polyline points="14,2 14,8 20,8" />
                                                    <line x1="16" y1="13" x2="8" y2="13" />
                                                    <line x1="16" y1="17" x2="8" y2="17" />
                                                </svg>
                                            </div>
                                            <div style={{
                                                fontSize: window.innerWidth <= 768 ? '13px' : '14px',
                                                opacity: 0.9,
                                                fontWeight: '600',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px'
                                            }}>Pending Invoices</div>
                                        </div>
                                        <div style={{
                                            fontSize: window.innerWidth <= 768 ? '32px' : '36px',
                                            fontWeight: '800',
                                            lineHeight: '1',
                                            marginBottom: '8px'
                                        }}>{invoices.filter(inv => inv.status === 'pending').length}</div>
                                        <div style={{
                                            fontSize: '13px',
                                            opacity: 0.8,
                                            fontWeight: '500'
                                        }}>$3,240 total value</div>
                                    </div>
                                </div>
                            </div>

                            <div style={{
                                background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                                color: 'white',
                                padding: window.innerWidth <= 768 ? '24px' : '28px',
                                borderRadius: '18px',
                                boxShadow: '0 8px 32px rgba(139,92,246,0.25)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                position: 'relative',
                                overflow: 'hidden',
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(139,92,246,0.35)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(139,92,246,0.25)';
                                }}
                            >
                                <div style={{
                                    position: 'absolute',
                                    top: '-20px',
                                    right: '-20px',
                                    width: '80px',
                                    height: '80px',
                                    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 2px, transparent 2px)',
                                    backgroundSize: '16px 16px',
                                    borderRadius: '50%'
                                }}></div>

                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start',
                                    position: 'relative',
                                    zIndex: 1
                                }}>
                                    <div>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            marginBottom: '12px'
                                        }}>
                                            <div style={{
                                                width: '32px',
                                                height: '32px',
                                                background: 'rgba(255,255,255,0.2)',
                                                borderRadius: '10px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                backdropFilter: 'blur(10px)'
                                            }}>
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                    <line x1="18" y1="20" x2="18" y2="10" />
                                                    <line x1="12" y1="20" x2="12" y2="4" />
                                                    <line x1="6" y1="20" x2="6" y2="14" />
                                                </svg>
                                            </div>
                                            <div style={{
                                                fontSize: window.innerWidth <= 768 ? '13px' : '14px',
                                                opacity: 0.9,
                                                fontWeight: '600',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px'
                                            }}>Monthly Revenue</div>
                                        </div>
                                        <div style={{
                                            fontSize: window.innerWidth <= 768 ? '32px' : '36px',
                                            fontWeight: '800',
                                            lineHeight: '1',
                                            marginBottom: '8px'
                                        }}>$8,450</div>
                                        <div style={{
                                            fontSize: '13px',
                                            opacity: 0.8,
                                            fontWeight: '500'
                                        }}>+24% from last month</div>
                                    </div>
                                </div>
                            </div>

                            <div style={{
                                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                                color: 'white',
                                padding: window.innerWidth <= 768 ? '24px' : '28px',
                                borderRadius: '18px',
                                boxShadow: '0 8px 32px rgba(245,158,11,0.25)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                position: 'relative',
                                overflow: 'hidden',
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(245,158,11,0.35)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(245,158,11,0.25)';
                                }}
                            >
                                <div style={{
                                    position: 'absolute',
                                    top: '-20px',
                                    right: '-20px',
                                    width: '80px',
                                    height: '80px',
                                    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 2px, transparent 2px)',
                                    backgroundSize: '16px 16px',
                                    borderRadius: '50%'
                                }}></div>

                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start',
                                    position: 'relative',
                                    zIndex: 1
                                }}>
                                    <div>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            marginBottom: '12px'
                                        }}>
                                            <div style={{
                                                width: '32px',
                                                height: '32px',
                                                background: 'rgba(255,255,255,0.2)',
                                                borderRadius: '10px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                backdropFilter: 'blur(10px)'
                                            }}>
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                    <circle cx="12" cy="12" r="10" />
                                                    <polyline points="12,6 12,12 16,14" />
                                                </svg>
                                            </div>
                                            <div style={{
                                                fontSize: window.innerWidth <= 768 ? '13px' : '14px',
                                                opacity: 0.9,
                                                fontWeight: '600',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px'
                                            }}>Hours This Week</div>
                                        </div>
                                        <div style={{
                                            fontSize: window.innerWidth <= 768 ? '32px' : '36px',
                                            fontWeight: '800',
                                            lineHeight: '1',
                                            marginBottom: '8px'
                                        }}>32.5</div>
                                        <div style={{
                                            fontSize: '13px',
                                            opacity: 0.8,
                                            fontWeight: '500'
                                        }}>5.5 hours today</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: window.innerWidth <= 768 ? '1fr' : '1fr 1fr',
                            gap: window.innerWidth <= 768 ? '20px' : '32px'
                        }}>
                            <div style={{
                                background: 'white',
                                borderRadius: '18px',
                                padding: '28px',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                                border: '1px solid rgba(0,0,0,0.05)'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    marginBottom: '24px'
                                }}>
                                    <div style={{
                                        width: '36px',
                                        height: '36px',
                                        background: 'linear-gradient(135deg, #10b981, #059669)',
                                        borderRadius: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                            <circle cx="9" cy="7" r="4" />
                                            <path d="m22 2-5 5" />
                                            <path d="m17 7 5-5" />
                                        </svg>
                                    </div>
                                    <h3 style={{
                                        margin: 0,
                                        color: '#1f2937',
                                        fontSize: '20px',
                                        fontWeight: '700'
                                    }}>Recent Leads</h3>
                                </div>
                                {leads.slice(0, 3).map(lead => (
                                    <div key={lead.id} style={{
                                        padding: '20px',
                                        border: '1px solid #f3f4f6',
                                        borderRadius: '12px',
                                        marginBottom: '12px',
                                        background: '#fafafa',
                                        transition: 'all 0.3s ease'
                                    }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = '#f8fafc';
                                            e.currentTarget.style.borderColor = '#e2e8f0';
                                            e.currentTarget.style.transform = 'translateY(-1px)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = '#fafafa';
                                            e.currentTarget.style.borderColor = '#f3f4f6';
                                            e.currentTarget.style.transform = 'translateY(0)';
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div style={{ flex: 1 }}>
                                                <div style={{
                                                    fontWeight: '600',
                                                    color: '#1f2937',
                                                    fontSize: '16px',
                                                    marginBottom: '4px'
                                                }}>{lead.name}</div>
                                                <div style={{
                                                    color: '#6b7280',
                                                    fontSize: '14px',
                                                    fontWeight: '500'
                                                }}>{lead.service}</div>
                                            </div>
                                            <span style={{
                                                padding: '6px 12px',
                                                borderRadius: '20px',
                                                fontSize: '12px',
                                                fontWeight: '600',
                                                background: lead.status === 'new' ? '#fef3c7' : lead.status === 'contacted' ? '#ddd6fe' : '#d1fae5',
                                                color: lead.status === 'new' ? '#92400e' : lead.status === 'contacted' ? '#5b21b6' : '#065f46',
                                                textTransform: 'capitalize'
                                            }}>
                                                {lead.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div style={{
                                background: 'white',
                                borderRadius: '18px',
                                padding: '28px',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                                border: '1px solid rgba(0,0,0,0.05)'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    marginBottom: '24px'
                                }}>
                                    <div style={{
                                        width: '36px',
                                        height: '36px',
                                        background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                                        borderRadius: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                            <line x1="12" y1="1" x2="12" y2="23" />
                                            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                                        </svg>
                                    </div>
                                    <h3 style={{
                                        margin: 0,
                                        color: '#1f2937',
                                        fontSize: '20px',
                                        fontWeight: '700'
                                    }}>Recent Expenses</h3>
                                </div>
                                {expenses.slice(0, 3).map(expense => (
                                    <div key={expense.id} style={{
                                        padding: '20px',
                                        border: '1px solid #f3f4f6',
                                        borderRadius: '12px',
                                        marginBottom: '12px',
                                        background: '#fafafa',
                                        transition: 'all 0.3s ease'
                                    }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = '#f8fafc';
                                            e.currentTarget.style.borderColor = '#e2e8f0';
                                            e.currentTarget.style.transform = 'translateY(-1px)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = '#fafafa';
                                            e.currentTarget.style.borderColor = '#f3f4f6';
                                            e.currentTarget.style.transform = 'translateY(0)';
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div style={{ flex: 1 }}>
                                                <div style={{
                                                    fontWeight: '600',
                                                    color: '#1f2937',
                                                    fontSize: '16px',
                                                    marginBottom: '4px'
                                                }}>{expense.description}</div>
                                                <div style={{
                                                    color: '#6b7280',
                                                    fontSize: '14px',
                                                    fontWeight: '500'
                                                }}>{expense.category}</div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{
                                                    fontWeight: '700',
                                                    fontSize: '16px',
                                                    color: '#1f2937'
                                                }}>${expense.amount}</div>
                                                <div style={{
                                                    fontSize: '12px',
                                                    fontWeight: '600',
                                                    color: expense.receipt ? '#059669' : '#dc2626',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '4px',
                                                    justifyContent: 'flex-end',
                                                    marginTop: '4px'
                                                }}>
                                                    {expense.receipt ? (
                                                        <>
                                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                <polyline points="20,6 9,17 4,12" />
                                                            </svg>
                                                            Receipt
                                                        </>
                                                    ) : (
                                                        <>
                                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                <line x1="18" y1="6" x2="6" y2="18" />
                                                                <line x1="6" y1="6" x2="18" y2="18" />
                                                            </svg>
                                                            No Receipt
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Internal Calendar */}
                {activeSection === 'calendar' && (
                    <div>
                        {/* Calendar Header */}
                        <div style={{
                            background: 'white',
                            borderRadius: '16px',
                            padding: '25px',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                            marginBottom: '25px',
                            border: '1px solid rgba(0,0,0,0.05)'
                        }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                flexWrap: 'wrap',
                                gap: '15px'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <div style={{
                                        background: 'linear-gradient(135deg, #3b82f6, #1e40af)',
                                        color: 'white',
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <Calendar size={24} />
                                    </div>
                                    <div>
                                        <h2 style={{ margin: 0, color: '#1f2937', fontSize: '24px', fontWeight: '700' }}>
                                            Business Calendar
                                        </h2>
                                        <p style={{ margin: '4px 0 0 0', color: '#6b7280', fontSize: '14px' }}>
                                            Manage appointments and sync with external calendars
                                        </p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                    <button
                                        onClick={() => setShowAddEvent(true)}
                                        style={{
                                            padding: '12px 20px',
                                            background: 'linear-gradient(135deg, #10b981, #059669)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '10px',
                                            cursor: 'pointer',
                                            fontSize: '14px',
                                            fontWeight: '600',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        <Plus size={16} />
                                        Add Event
                                    </button>
                                    <button
                                        onClick={() => syncExternalCalendar()}
                                        style={{
                                            padding: '12px 20px',
                                            background: 'linear-gradient(135deg, #3b82f6, #1e40af)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '10px',
                                            cursor: 'pointer',
                                            fontSize: '14px',
                                            fontWeight: '600',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        <RefreshCw size={16} />
                                        Sync External
                                    </button>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button
                                            onClick={() => setCalendarView('month')}
                                            style={{
                                                padding: '8px 12px',
                                                background: calendarView === 'month' ? '#e5e7eb' : 'transparent',
                                                border: '1px solid #d1d5db',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                fontSize: '13px',
                                                fontWeight: '500',
                                                color: '#374151'
                                            }}
                                        >
                                            Month
                                        </button>
                                        <button
                                            onClick={() => setCalendarView('week')}
                                            style={{
                                                padding: '8px 12px',
                                                background: calendarView === 'week' ? '#e5e7eb' : 'transparent',
                                                border: '1px solid #d1d5db',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                fontSize: '13px',
                                                fontWeight: '500',
                                                color: '#374151'
                                            }}
                                        >
                                            Week
                                        </button>
                                        <button
                                            onClick={() => setCalendarView('day')}
                                            style={{
                                                padding: '8px 12px',
                                                background: calendarView === 'day' ? '#e5e7eb' : 'transparent',
                                                border: '1px solid #d1d5db',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                fontSize: '13px',
                                                fontWeight: '500',
                                                color: '#374151'
                                            }}
                                        >
                                            Day
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Calendar Navigation */}
                        <div style={{
                            background: 'white',
                            borderRadius: '12px',
                            padding: '20px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                            marginBottom: '20px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <button
                                onClick={() => {
                                    const newDate = new Date(currentCalendarDate)
                                    if (calendarView === 'month') {
                                        newDate.setMonth(newDate.getMonth() - 1)
                                    } else if (calendarView === 'week') {
                                        newDate.setDate(newDate.getDate() - 7)
                                    } else {
                                        newDate.setDate(newDate.getDate() - 1)
                                    }
                                    setCurrentCalendarDate(newDate)
                                }}
                                style={{
                                    padding: '10px',
                                    background: '#f3f4f6',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <ChevronLeft size={20} />
                            </button>

                            <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '600', color: '#1f2937' }}>
                                {calendarView === 'month' && currentCalendarDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                {calendarView === 'week' && `Week of ${currentCalendarDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
                                {calendarView === 'day' && currentCalendarDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                            </h3>

                            <button
                                onClick={() => {
                                    const newDate = new Date(currentCalendarDate)
                                    if (calendarView === 'month') {
                                        newDate.setMonth(newDate.getMonth() + 1)
                                    } else if (calendarView === 'week') {
                                        newDate.setDate(newDate.getDate() + 7)
                                    } else {
                                        newDate.setDate(newDate.getDate() + 1)
                                    }
                                    setCurrentCalendarDate(newDate)
                                }}
                                style={{
                                    padding: '10px',
                                    background: '#f3f4f6',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>

                        {/* Calendar Grid */}
                        {calendarView === 'month' && (
                            <div style={{
                                background: 'white',
                                borderRadius: '12px',
                                padding: '20px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                            }}>
                                {/* Month view implementation */}
                                <CalendarMonthView
                                    currentDate={currentCalendarDate}
                                    events={getCalendarEventsForMonth(currentCalendarDate)}
                                    onEventClick={(event) => {
                                        setSelectedEvent(event)
                                        setShowEventDetail(true)
                                    }}
                                    onDateClick={(date) => {
                                        const dateStr = date.toISOString().split('T')[0]
                                        setEventForm(prev => ({ ...prev, date: dateStr }))
                                        setShowAddEvent(true)
                                    }}
                                />
                            </div>
                        )}

                        {calendarView === 'week' && (
                            <div style={{
                                background: 'white',
                                borderRadius: '12px',
                                padding: '20px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                            }}>
                                {/* Week view implementation */}
                                <CalendarWeekView
                                    currentDate={currentCalendarDate}
                                    events={calendarEvents}
                                    onEventClick={(event) => {
                                        setSelectedEvent(event)
                                        setShowEventDetail(true)
                                    }}
                                />
                            </div>
                        )}

                        {calendarView === 'day' && (
                            <div style={{
                                background: 'white',
                                borderRadius: '12px',
                                padding: '20px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                            }}>
                                {/* Day view implementation */}
                                <CalendarDayView
                                    currentDate={currentCalendarDate}
                                    events={getCalendarEventsForDate(currentCalendarDate)}
                                    onEventClick={(event) => {
                                        setSelectedEvent(event)
                                        setShowEventDetail(true)
                                    }}
                                />
                            </div>
                        )}

                        {/* Quick Stats */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: window.innerWidth <= 768 ? '1fr' : 'repeat(auto-fit, minmax(250px, 1fr))',
                            gap: '20px',
                            marginTop: '25px'
                        }}>
                            <div style={{
                                background: 'linear-gradient(135deg, #10b981, #059669)',
                                color: 'white',
                                padding: '20px',
                                borderRadius: '12px',
                                boxShadow: '0 4px 16px rgba(16,185,129,0.3)'
                            }}>
                                <div style={{ fontSize: '14px', marginBottom: '8px', opacity: 0.9 }}>
                                    Today's Appointments
                                </div>
                                <div style={{ fontSize: '32px', fontWeight: '700' }}>
                                    {getCalendarEventsForDate(new Date()).length}
                                </div>
                            </div>

                            <div style={{
                                background: 'linear-gradient(135deg, #3b82f6, #1e40af)',
                                color: 'white',
                                padding: '20px',
                                borderRadius: '12px',
                                boxShadow: '0 4px 16px rgba(59,130,246,0.3)'
                            }}>
                                <div style={{ fontSize: '14px', marginBottom: '8px', opacity: 0.9 }}>
                                    This Week
                                </div>
                                <div style={{ fontSize: '32px', fontWeight: '700' }}>
                                    {(() => {
                                        const today = new Date()
                                        const weekStart = new Date(today.setDate(today.getDate() - today.getDay()))
                                        let weekEvents = 0
                                        for (let i = 0; i < 7; i++) {
                                            const day = new Date(weekStart)
                                            day.setDate(weekStart.getDate() + i)
                                            weekEvents += getCalendarEventsForDate(day).length
                                        }
                                        return weekEvents
                                    })()}
                                </div>
                            </div>

                            <div style={{
                                background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                                color: 'white',
                                padding: '20px',
                                borderRadius: '12px',
                                boxShadow: '0 4px 16px rgba(139,92,246,0.3)'
                            }}>
                                <div style={{ fontSize: '14px', marginBottom: '8px', opacity: 0.9 }}>
                                    This Month
                                </div>
                                <div style={{ fontSize: '32px', fontWeight: '700' }}>
                                    {getCalendarEventsForMonth(new Date()).length}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Leads Management */}
                {activeSection === 'leads' && (
                    <div>
                        {/* Lead Management Header */}
                        <div style={{
                            background: 'white',
                            borderRadius: '12px',
                            padding: '25px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            marginBottom: '20px'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h2 style={{ margin: 0, color: '#1f2937', fontSize: '24px' }}>👥 Lead Management</h2>
                                <button
                                    onClick={() => setShowAddLead(true)}
                                    style={{
                                        padding: '12px 24px',
                                        background: 'linear-gradient(135deg, #1e3a5f, #2c5aa0)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontWeight: '500',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}
                                >
                                    + Add New Lead
                                </button>
                            </div>

                            {/* Filters and Search */}
                            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginBottom: '20px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ fontSize: '14px', color: '#6b7280' }}>Filter:</span>
                                    <select
                                        value={leadFilter}
                                        onChange={(e) => setLeadFilter(e.target.value)}
                                        style={{
                                            padding: '8px 12px',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '6px',
                                            fontSize: '14px'
                                        }}
                                    >
                                        <option value="all">All Leads</option>
                                        <option value="new">New</option>
                                        <option value="contacted">Contacted</option>
                                        <option value="quoted">Quoted</option>
                                        <option value="scheduled">Scheduled</option>
                                        <option value="won">Won</option>
                                        <option value="lost">Lost</option>
                                    </select>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ fontSize: '14px', color: '#6b7280' }}>Search:</span>
                                    <input
                                        type="text"
                                        placeholder="Search by name, service, or phone..."
                                        value={leadSearch}
                                        onChange={(e) => setLeadSearch(e.target.value)}
                                        style={{
                                            padding: '8px 12px',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '6px',
                                            fontSize: '14px',
                                            width: '300px'
                                        }}
                                    />
                                </div>

                                <div style={{ marginLeft: 'auto', color: '#6b7280', fontSize: '14px' }}>
                                    Showing {filteredLeads.length} of {leads.length} leads
                                </div>
                            </div>

                            {/* Lead Stats */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                                <div style={{
                                    padding: '15px',
                                    background: 'linear-gradient(135deg, #10b981, #059669)',
                                    borderRadius: '8px',
                                    color: 'white',
                                    textAlign: 'center'
                                }}>
                                    <div style={{ fontSize: '24px', fontWeight: '700' }}>{leads.filter(l => l.status === 'new').length}</div>
                                    <div style={{ fontSize: '12px', opacity: 0.9 }}>New Leads</div>
                                </div>
                                <div style={{
                                    padding: '15px',
                                    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                                    borderRadius: '8px',
                                    color: 'white',
                                    textAlign: 'center'
                                }}>
                                    <div style={{ fontSize: '24px', fontWeight: '700' }}>{leads.filter(l => l.status === 'contacted').length}</div>
                                    <div style={{ fontSize: '12px', opacity: 0.9 }}>Contacted</div>
                                </div>
                                <div style={{
                                    padding: '15px',
                                    background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                                    borderRadius: '8px',
                                    color: 'white',
                                    textAlign: 'center'
                                }}>
                                    <div style={{ fontSize: '24px', fontWeight: '700' }}>{leads.filter(l => l.status === 'quoted').length}</div>
                                    <div style={{ fontSize: '12px', opacity: 0.9 }}>Quoted</div>
                                </div>
                                <div style={{
                                    padding: '15px',
                                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                                    borderRadius: '8px',
                                    color: 'white',
                                    textAlign: 'center'
                                }}>
                                    <div style={{ fontSize: '24px', fontWeight: '700' }}>
                                        ${leads.reduce((sum, lead) => sum + (lead.value || 0), 0).toLocaleString()}
                                    </div>
                                    <div style={{ fontSize: '12px', opacity: 0.9 }}>Total Pipeline Value</div>
                                </div>
                            </div>
                        </div>

                        {/* Leads Table */}
                        <div style={{
                            background: 'white',
                            borderRadius: '12px',
                            padding: window.innerWidth <= 768 ? '15px' : '25px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}>
                            {window.innerWidth <= 768 ? (
                                // Mobile Card Layout
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {filteredLeads.map(lead => (
                                        <div key={lead.id} style={{
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '8px',
                                            padding: '15px',
                                            background: '#fafafa',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            ':hover': {
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                                transform: 'translateY(-2px)'
                                            }
                                        }}
                                            onClick={() => {
                                                setSelectedLead(lead)
                                                setShowLeadDetail(true)
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'
                                                e.target.style.transform = 'translateY(-2px)'
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.boxShadow = 'none'
                                                e.target.style.transform = 'translateY(0)'
                                            }}
                                        >
                                            <div style={{ marginBottom: '12px' }}>
                                                <div style={{ fontWeight: '600', color: '#1f2937', fontSize: '16px', marginBottom: '4px' }}>{lead.name}</div>
                                                <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '2px' }}>{lead.address}</div>
                                                <div style={{ fontSize: '12px', color: '#6b7280' }}>Added: {lead.date}</div>
                                            </div>

                                            <div style={{ marginBottom: '12px' }}>
                                                <div style={{ fontSize: '14px', color: '#1f2937', marginBottom: '2px' }}>📞 {lead.phone}</div>
                                                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>✉️ {lead.email}</div>
                                                <div style={{
                                                    fontSize: '11px',
                                                    color: '#6b7280',
                                                    background: '#f3f4f6',
                                                    padding: '2px 6px',
                                                    borderRadius: '4px',
                                                    display: 'inline-block'
                                                }}>
                                                    Source: {lead.source}
                                                </div>
                                            </div>

                                            <div style={{ marginBottom: '12px' }}>
                                                <div style={{ fontSize: '14px', color: '#1f2937', marginBottom: '4px' }}>🔧 {lead.service}</div>
                                                <div style={{ fontSize: '12px', color: '#6b7280' }}>{lead.description?.substring(0, 80)}...</div>
                                            </div>

                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                flexWrap: 'wrap',
                                                gap: '8px',
                                                marginBottom: '12px'
                                            }}>
                                                <div style={{
                                                    padding: '4px 8px',
                                                    borderRadius: '12px',
                                                    fontSize: '12px',
                                                    fontWeight: '500',
                                                    background: lead.status === 'new' ? '#dbeafe' :
                                                        lead.status === 'contacted' ? '#fef3c7' : '#dcfce7',
                                                    color: lead.status === 'new' ? '#1e40af' :
                                                        lead.status === 'contacted' ? '#92400e' : '#166534'
                                                }}>
                                                    {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                                                </div>
                                                <div style={{ fontSize: '14px', fontWeight: '600', color: '#059669' }}>
                                                    ${lead.estimatedValue}
                                                </div>
                                                <div style={{
                                                    padding: '4px 8px',
                                                    borderRadius: '12px',
                                                    fontSize: '12px',
                                                    fontWeight: '500',
                                                    background: lead.urgency === 'high' ? '#fee2e2' :
                                                        lead.urgency === 'medium' ? '#fef3c7' : '#f0fdf4',
                                                    color: lead.urgency === 'high' ? '#dc2626' :
                                                        lead.urgency === 'medium' ? '#d97706' : '#059669'
                                                }}>
                                                    {lead.urgency.charAt(0).toUpperCase() + lead.urgency.slice(1)}
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setSelectedLead(lead)
                                                        setShowLeadDetail(true)
                                                    }}
                                                    style={{
                                                        padding: '8px 12px',
                                                        background: '#059669',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '6px',
                                                        cursor: 'pointer',
                                                        fontSize: '12px',
                                                        fontWeight: '500',
                                                        flex: '1'
                                                    }}
                                                >
                                                    👁️ View Details
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setEditingLead(lead)
                                                        setLeadForm({
                                                            name: lead.name,
                                                            email: lead.email,
                                                            phone: lead.phone,
                                                            address: lead.address,
                                                            service: lead.service,
                                                            description: lead.description,
                                                            estimatedValue: lead.value,
                                                            urgency: lead.urgency,
                                                            status: lead.status,
                                                            source: lead.source,
                                                            notes: lead.notes || ''
                                                        })
                                                    }}
                                                    style={{
                                                        padding: '8px 12px',
                                                        background: '#3b82f6',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '6px',
                                                        cursor: 'pointer',
                                                        fontSize: '12px',
                                                        fontWeight: '500',
                                                        flex: '1'
                                                    }}
                                                >
                                                    ✏️ Edit
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        deleteLead(lead.id)
                                                    }}
                                                    style={{
                                                        padding: '8px 12px',
                                                        background: '#ef4444',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '6px',
                                                        cursor: 'pointer',
                                                        fontSize: '12px',
                                                        fontWeight: '500',
                                                        flex: '1'
                                                    }}
                                                >
                                                    🗑️ Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                // Desktop Table Layout
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                                                <th style={{ padding: '15px', textAlign: 'left', color: '#374151', fontSize: '14px', fontWeight: '600' }}>Lead Details</th>
                                                <th style={{ padding: '15px', textAlign: 'left', color: '#374151', fontSize: '14px', fontWeight: '600' }}>Contact</th>
                                                <th style={{ padding: '15px', textAlign: 'left', color: '#374151', fontSize: '14px', fontWeight: '600' }}>Service</th>
                                                <th style={{ padding: '15px', textAlign: 'left', color: '#374151', fontSize: '14px', fontWeight: '600' }}>Status</th>
                                                <th style={{ padding: '15px', textAlign: 'left', color: '#374151', fontSize: '14px', fontWeight: '600' }}>Value</th>
                                                <th style={{ padding: '15px', textAlign: 'left', color: '#374151', fontSize: '14px', fontWeight: '600' }}>Urgency</th>
                                                <th style={{ padding: '15px', textAlign: 'left', color: '#374151', fontSize: '14px', fontWeight: '600' }}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredLeads.map(lead => (
                                                <tr key={lead.id} style={{
                                                    borderBottom: '1px solid #f3f4f6',
                                                    transition: 'background-color 0.2s',
                                                    cursor: 'pointer'
                                                }}
                                                    onClick={() => {
                                                        setSelectedLead(lead)
                                                        setShowLeadDetail(true)
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.target.closest('tr').style.backgroundColor = '#f9fafb'
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.target.closest('tr').style.backgroundColor = 'transparent'
                                                    }}
                                                >
                                                    <td style={{ padding: '15px' }}>
                                                        <div>
                                                            <div style={{ fontWeight: '600', color: '#1f2937', marginBottom: '4px' }}>{lead.name}</div>
                                                            <div style={{ fontSize: '12px', color: '#6b7280' }}>{lead.address}</div>
                                                            <div style={{ fontSize: '12px', color: '#6b7280' }}>Added: {lead.date}</div>
                                                        </div>
                                                    </td>
                                                    <td style={{ padding: '15px' }}>
                                                        <div>
                                                            <div style={{ color: '#1f2937', marginBottom: '2px' }}>{lead.phone}</div>
                                                            <div style={{ fontSize: '12px', color: '#6b7280' }}>{lead.email}</div>
                                                            <div style={{
                                                                fontSize: '11px',
                                                                color: '#6b7280',
                                                                background: '#f3f4f6',
                                                                padding: '2px 6px',
                                                                borderRadius: '4px',
                                                                display: 'inline-block',
                                                                marginTop: '4px'
                                                            }}>
                                                                {lead.source}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td style={{ padding: '15px' }}>
                                                        <div>
                                                            <div style={{ fontWeight: '500', color: '#1f2937' }}>{lead.service}</div>
                                                            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                                                                {lead.description?.substring(0, 50)}{lead.description?.length > 50 ? '...' : ''}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td style={{ padding: '15px' }}>
                                                        <select
                                                            value={lead.status}
                                                            onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                                                            style={{
                                                                padding: '6px 12px',
                                                                borderRadius: '12px',
                                                                fontSize: '12px',
                                                                fontWeight: '500',
                                                                border: 'none',
                                                                cursor: 'pointer',
                                                                background:
                                                                    lead.status === 'new' ? '#fef3c7' :
                                                                        lead.status === 'contacted' ? '#ddd6fe' :
                                                                            lead.status === 'quoted' ? '#fed7aa' :
                                                                                lead.status === 'scheduled' ? '#bbf7d0' :
                                                                                    lead.status === 'won' ? '#d1fae5' : '#fecaca',
                                                                color:
                                                                    lead.status === 'new' ? '#92400e' :
                                                                        lead.status === 'contacted' ? '#5b21b6' :
                                                                            lead.status === 'quoted' ? '#c2410c' :
                                                                                lead.status === 'scheduled' ? '#065f46' :
                                                                                    lead.status === 'won' ? '#064e3b' : '#991b1b'
                                                            }}
                                                        >
                                                            <option value="new">New</option>
                                                            <option value="contacted">Contacted</option>
                                                            <option value="quoted">Quoted</option>
                                                            <option value="scheduled">Scheduled</option>
                                                            <option value="won">Won</option>
                                                            <option value="lost">Lost</option>
                                                        </select>
                                                    </td>
                                                    <td style={{ padding: '15px', fontWeight: '600', color: '#1f2937' }}>
                                                        ${lead.value?.toLocaleString() || '0'}
                                                    </td>
                                                    <td style={{ padding: '15px' }}>
                                                        <span style={{
                                                            padding: '4px 8px',
                                                            borderRadius: '8px',
                                                            fontSize: '11px',
                                                            fontWeight: '500',
                                                            background:
                                                                lead.urgency === 'high' ? '#fecaca' :
                                                                    lead.urgency === 'medium' ? '#fed7aa' : '#d1fae5',
                                                            color:
                                                                lead.urgency === 'high' ? '#991b1b' :
                                                                    lead.urgency === 'medium' ? '#c2410c' : '#065f46'
                                                        }}>
                                                            {lead.urgency}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '15px' }}>
                                                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    setSelectedLead(lead)
                                                                    setShowLeadDetail(true)
                                                                }}
                                                                style={{
                                                                    padding: '6px 10px',
                                                                    background: '#059669',
                                                                    color: 'white',
                                                                    border: 'none',
                                                                    borderRadius: '6px',
                                                                    fontSize: '11px',
                                                                    cursor: 'pointer'
                                                                }}
                                                            >
                                                                👁️ View
                                                            </button>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    setEditingLead(lead)
                                                                    setLeadForm({
                                                                        name: lead.name,
                                                                        phone: lead.phone,
                                                                        email: lead.email,
                                                                        address: lead.address,
                                                                        service: lead.service,
                                                                        description: lead.description,
                                                                        urgency: lead.urgency,
                                                                        source: lead.source,
                                                                        estimatedValue: lead.value?.toString() || '',
                                                                        notes: lead.notes || ''
                                                                    })
                                                                    setShowAddLead(true)
                                                                }}
                                                                style={{
                                                                    padding: '6px 10px',
                                                                    background: '#3b82f6',
                                                                    color: 'white',
                                                                    border: 'none',
                                                                    borderRadius: '6px',
                                                                    fontSize: '11px',
                                                                    cursor: 'pointer'
                                                                }}
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    updateLeadStatus(lead.id, 'won')
                                                                }}
                                                                style={{
                                                                    padding: '6px 10px',
                                                                    background: '#10b981',
                                                                    color: 'white',
                                                                    border: 'none',
                                                                    borderRadius: '6px',
                                                                    fontSize: '11px',
                                                                    cursor: 'pointer'
                                                                }}
                                                            >
                                                                Convert
                                                            </button>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    deleteLead(lead.id)
                                                                }}
                                                                style={{
                                                                    padding: '6px 10px',
                                                                    background: '#ef4444',
                                                                    color: 'white',
                                                                    border: 'none',
                                                                    borderRadius: '6px',
                                                                    fontSize: '11px',
                                                                    cursor: 'pointer'
                                                                }}
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {filteredLeads.length === 0 && (
                                <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>👥</div>
                                    <div style={{ fontSize: '18px', fontWeight: '500', marginBottom: '8px' }}>No leads found</div>
                                    <div style={{ fontSize: '14px' }}>
                                        {leadSearch || leadFilter !== 'all'
                                            ? 'Try adjusting your search or filter criteria'
                                            : 'Add your first lead to get started'
                                        }
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Add/Edit Lead Modal */}
                        {showAddLead && (
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
                                    borderRadius: '12px',
                                    padding: '30px',
                                    width: '90%',
                                    maxWidth: '600px',
                                    maxHeight: '90vh',
                                    overflowY: 'auto'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                                        <h3 style={{ margin: 0, fontSize: '20px', color: '#1f2937' }}>
                                            {editingLead ? 'Edit Lead' : 'Add New Lead'}
                                        </h3>
                                        <button
                                            onClick={() => {
                                                setShowAddLead(false)
                                                resetLeadForm()
                                            }}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                fontSize: '24px',
                                                cursor: 'pointer',
                                                color: '#6b7280'
                                            }}
                                        >
                                            ×
                                        </button>
                                    </div>

                                    <form onSubmit={(e) => {
                                        e.preventDefault()
                                        if (editingLead) {
                                            // Update lead logic here
                                            console.log('Update lead:', editingLead.id, leadForm)
                                        } else {
                                            const leadDataWithDate = {
                                                ...leadForm,
                                                value: parseFloat(leadForm.estimatedValue) || 0,
                                                date: new Date().toISOString().split('T')[0] // Add current date
                                            }
                                            addLead(leadDataWithDate)
                                        }
                                    }}>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                                            <div>
                                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>
                                                    Name *
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={leadForm.name}
                                                    onChange={(e) => setLeadForm(prev => ({ ...prev, name: e.target.value }))}
                                                    style={{
                                                        width: '100%',
                                                        padding: '10px',
                                                        border: '1px solid #d1d5db',
                                                        borderRadius: '6px',
                                                        fontSize: '14px'
                                                    }}
                                                    placeholder="Enter full name"
                                                />
                                            </div>

                                            <div>
                                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>
                                                    Phone *
                                                </label>
                                                <input
                                                    type="tel"
                                                    required
                                                    value={leadForm.phone}
                                                    onChange={(e) => setLeadForm(prev => ({ ...prev, phone: e.target.value }))}
                                                    style={{
                                                        width: '100%',
                                                        padding: '10px',
                                                        border: '1px solid #d1d5db',
                                                        borderRadius: '6px',
                                                        fontSize: '14px'
                                                    }}
                                                    placeholder="480-555-0123"
                                                />
                                            </div>

                                            <div>
                                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>
                                                    Email
                                                </label>
                                                <input
                                                    type="email"
                                                    value={leadForm.email}
                                                    onChange={(e) => setLeadForm(prev => ({ ...prev, email: e.target.value }))}
                                                    style={{
                                                        width: '100%',
                                                        padding: '10px',
                                                        border: '1px solid #d1d5db',
                                                        borderRadius: '6px',
                                                        fontSize: '14px'
                                                    }}
                                                    placeholder="email@example.com"
                                                />
                                            </div>

                                            <div>
                                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>
                                                    Service Needed *
                                                </label>
                                                <select
                                                    required
                                                    value={leadForm.service}
                                                    onChange={(e) => setLeadForm(prev => ({ ...prev, service: e.target.value }))}
                                                    style={{
                                                        width: '100%',
                                                        padding: '10px',
                                                        border: '1px solid #d1d5db',
                                                        borderRadius: '6px',
                                                        fontSize: '14px'
                                                    }}
                                                >
                                                    <option value="">Select a service</option>
                                                    <option value="Plumbing Repair">Plumbing Repair</option>
                                                    <option value="Electrical Work">Electrical Work</option>
                                                    <option value="Kitchen Repair">Kitchen Repair</option>
                                                    <option value="Bathroom Remodel">Bathroom Remodel</option>
                                                    <option value="Deck Installation">Deck Installation</option>
                                                    <option value="Fence Repair">Fence Repair</option>
                                                    <option value="Painting">Painting</option>
                                                    <option value="Drywall Repair">Drywall Repair</option>
                                                    <option value="Tile Work">Tile Work</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>
                                                    Estimated Value ($)
                                                </label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="50"
                                                    value={leadForm.estimatedValue}
                                                    onChange={(e) => setLeadForm(prev => ({ ...prev, estimatedValue: e.target.value }))}
                                                    style={{
                                                        width: '100%',
                                                        padding: '10px',
                                                        border: '1px solid #d1d5db',
                                                        borderRadius: '6px',
                                                        fontSize: '14px'
                                                    }}
                                                    placeholder="1000"
                                                />
                                            </div>

                                            <div>
                                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>
                                                    Urgency
                                                </label>
                                                <select
                                                    value={leadForm.urgency}
                                                    onChange={(e) => setLeadForm(prev => ({ ...prev, urgency: e.target.value }))}
                                                    style={{
                                                        width: '100%',
                                                        padding: '10px',
                                                        border: '1px solid #d1d5db',
                                                        borderRadius: '6px',
                                                        fontSize: '14px'
                                                    }}
                                                >
                                                    <option value="low">Low</option>
                                                    <option value="medium">Medium</option>
                                                    <option value="high">High</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>
                                                    Lead Source
                                                </label>
                                                <select
                                                    value={leadForm.source}
                                                    onChange={(e) => setLeadForm(prev => ({ ...prev, source: e.target.value }))}
                                                    style={{
                                                        width: '100%',
                                                        padding: '10px',
                                                        border: '1px solid #d1d5db',
                                                        borderRadius: '6px',
                                                        fontSize: '14px'
                                                    }}
                                                >
                                                    <option value="phone">Phone Call</option>
                                                    <option value="website">Website</option>
                                                    <option value="referral">Referral</option>
                                                    <option value="google">Google</option>
                                                    <option value="facebook">Facebook</option>
                                                    <option value="nextdoor">Nextdoor</option>
                                                    <option value="other">Other</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div style={{ marginTop: '20px' }}>
                                            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>
                                                Address
                                            </label>
                                            <input
                                                type="text"
                                                value={leadForm.address}
                                                onChange={(e) => setLeadForm(prev => ({ ...prev, address: e.target.value }))}
                                                style={{
                                                    width: '100%',
                                                    padding: '10px',
                                                    border: '1px solid #d1d5db',
                                                    borderRadius: '6px',
                                                    fontSize: '14px'
                                                }}
                                                placeholder="123 Desert View Dr, Scottsdale, AZ 85251"
                                            />
                                        </div>

                                        <div style={{ marginTop: '20px' }}>
                                            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>
                                                Description
                                            </label>
                                            <textarea
                                                value={leadForm.description}
                                                onChange={(e) => setLeadForm(prev => ({ ...prev, description: e.target.value }))}
                                                style={{
                                                    width: '100%',
                                                    padding: '10px',
                                                    border: '1px solid #d1d5db',
                                                    borderRadius: '6px',
                                                    fontSize: '14px',
                                                    minHeight: '80px',
                                                    resize: 'vertical'
                                                }}
                                                placeholder="Describe the work needed..."
                                            />
                                        </div>

                                        <div style={{ marginTop: '20px' }}>
                                            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>
                                                Notes
                                            </label>
                                            <textarea
                                                value={leadForm.notes}
                                                onChange={(e) => setLeadForm(prev => ({ ...prev, notes: e.target.value }))}
                                                style={{
                                                    width: '100%',
                                                    padding: '10px',
                                                    border: '1px solid #d1d5db',
                                                    borderRadius: '6px',
                                                    fontSize: '14px',
                                                    minHeight: '60px',
                                                    resize: 'vertical'
                                                }}
                                                placeholder="Internal notes..."
                                            />
                                        </div>

                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '30px' }}>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setShowAddLead(false)
                                                    resetLeadForm()
                                                }}
                                                style={{
                                                    padding: '10px 20px',
                                                    background: '#f3f4f6',
                                                    color: '#374151',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                style={{
                                                    padding: '10px 20px',
                                                    background: 'linear-gradient(135deg, #1e3a5f, #2c5aa0)',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer',
                                                    fontWeight: '500'
                                                }}
                                            >
                                                {editingLead ? 'Update Lead' : 'Add Lead'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Lead Detail View */}
                {showLeadDetail && selectedLead && (
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
                        zIndex: 1000,
                        padding: '20px'
                    }}>
                        <div style={{
                            background: 'white',
                            borderRadius: '16px',
                            width: '100%',
                            maxWidth: '800px',
                            maxHeight: '90vh',
                            overflow: 'auto',
                            position: 'relative'
                        }}>
                            {/* Header */}
                            <div style={{
                                background: 'linear-gradient(135deg, #1e3a5f, #2c5aa0)',
                                color: 'white',
                                padding: '25px',
                                borderRadius: '16px 16px 0 0',
                                position: 'relative'
                            }}>
                                <button
                                    onClick={() => {
                                        setShowLeadDetail(false)
                                        setSelectedLead(null)
                                    }}
                                    style={{
                                        position: 'absolute',
                                        top: '20px',
                                        right: '20px',
                                        background: 'rgba(255,255,255,0.2)',
                                        border: 'none',
                                        color: 'white',
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '50%',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '18px'
                                    }}
                                >
                                    ×
                                </button>
                                <h2 style={{ margin: 0, fontSize: '24px', marginBottom: '8px' }}>👤 {selectedLead.name}</h2>
                                <div style={{ fontSize: '16px', opacity: 0.9 }}>{selectedLead.service}</div>
                            </div>

                            {/* Content */}
                            <div style={{ padding: '30px' }}>
                                {/* Status and Value Row */}
                                <div style={{
                                    display: 'flex',
                                    gap: '20px',
                                    marginBottom: '30px',
                                    flexWrap: 'wrap'
                                }}>
                                    <div style={{ flex: 1, minWidth: '200px' }}>
                                        <div style={{
                                            background: '#f8fafc',
                                            padding: '20px',
                                            borderRadius: '12px',
                                            border: '1px solid #e2e8f0'
                                        }}>
                                            <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px' }}>Status</div>
                                            <div style={{
                                                padding: '8px 16px',
                                                borderRadius: '20px',
                                                fontSize: '14px',
                                                fontWeight: '600',
                                                background: selectedLead.status === 'new' ? '#dbeafe' :
                                                    selectedLead.status === 'contacted' ? '#fef3c7' :
                                                        selectedLead.status === 'scheduled' ? '#dcfce7' : '#f3f4f6',
                                                color: selectedLead.status === 'new' ? '#1e40af' :
                                                    selectedLead.status === 'contacted' ? '#92400e' :
                                                        selectedLead.status === 'scheduled' ? '#166534' : '#374151',
                                                display: 'inline-block'
                                            }}>
                                                {selectedLead.status.charAt(0).toUpperCase() + selectedLead.status.slice(1)}
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ flex: 1, minWidth: '200px' }}>
                                        <div style={{
                                            background: '#f8fafc',
                                            padding: '20px',
                                            borderRadius: '12px',
                                            border: '1px solid #e2e8f0'
                                        }}>
                                            <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px' }}>Estimated Value</div>
                                            <div style={{ fontSize: '24px', fontWeight: '700', color: '#059669' }}>
                                                ${selectedLead.value?.toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ flex: 1, minWidth: '200px' }}>
                                        <div style={{
                                            background: '#f8fafc',
                                            padding: '20px',
                                            borderRadius: '12px',
                                            border: '1px solid #e2e8f0'
                                        }}>
                                            <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px' }}>Urgency</div>
                                            <div style={{
                                                padding: '8px 16px',
                                                borderRadius: '20px',
                                                fontSize: '14px',
                                                fontWeight: '600',
                                                background: selectedLead.urgency === 'high' ? '#fee2e2' :
                                                    selectedLead.urgency === 'medium' ? '#fef3c7' : '#f0fdf4',
                                                color: selectedLead.urgency === 'high' ? '#dc2626' :
                                                    selectedLead.urgency === 'medium' ? '#d97706' : '#059669',
                                                display: 'inline-block'
                                            }}>
                                                {selectedLead.urgency.charAt(0).toUpperCase() + selectedLead.urgency.slice(1)} Priority
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Information */}
                                <div style={{ marginBottom: '30px' }}>
                                    <h3 style={{
                                        margin: '0 0 20px 0',
                                        color: '#1f2937',
                                        fontSize: '18px',
                                        borderBottom: '2px solid #e5e7eb',
                                        paddingBottom: '10px'
                                    }}>
                                        📞 Contact Information
                                    </h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                                        <div>
                                            <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '4px' }}>Phone</div>
                                            <div style={{ fontSize: '16px', color: '#1f2937', fontWeight: '500' }}>{selectedLead.phone}</div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '4px' }}>Email</div>
                                            <div style={{ fontSize: '16px', color: '#1f2937', fontWeight: '500' }}>{selectedLead.email}</div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '4px' }}>Preferred Contact Time</div>
                                            <div style={{ fontSize: '16px', color: '#1f2937', fontWeight: '500' }}>{selectedLead.preferredContactTime}</div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '4px' }}>Lead Source</div>
                                            <div style={{ fontSize: '16px', color: '#1f2937', fontWeight: '500' }}>{selectedLead.source}</div>
                                        </div>
                                    </div>
                                    <div style={{ marginTop: '20px' }}>
                                        <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '4px' }}>Address</div>
                                        <div style={{ fontSize: '16px', color: '#1f2937', fontWeight: '500' }}>{selectedLead.address}</div>
                                    </div>
                                </div>

                                {/* Project Details */}
                                <div style={{ marginBottom: '30px' }}>
                                    <h3 style={{
                                        margin: '0 0 20px 0',
                                        color: '#1f2937',
                                        fontSize: '18px',
                                        borderBottom: '2px solid #e5e7eb',
                                        paddingBottom: '10px'
                                    }}>
                                        🔧 Project Details
                                    </h3>
                                    <div style={{ marginBottom: '20px' }}>
                                        <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px' }}>Service Requested</div>
                                        <div style={{
                                            fontSize: '16px',
                                            color: '#1f2937',
                                            fontWeight: '600',
                                            background: '#f1f5f9',
                                            padding: '12px 16px',
                                            borderRadius: '8px',
                                            border: '1px solid #e2e8f0'
                                        }}>
                                            {selectedLead.service}
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px' }}>Description</div>
                                        <div style={{
                                            fontSize: '15px',
                                            color: '#374151',
                                            lineHeight: '1.6',
                                            background: '#f9fafb',
                                            padding: '16px',
                                            borderRadius: '8px',
                                            border: '1px solid #e5e7eb'
                                        }}>
                                            {selectedLead.description}
                                        </div>
                                    </div>
                                </div>

                                {/* Timeline */}
                                <div style={{ marginBottom: '30px' }}>
                                    <h3 style={{
                                        margin: '0 0 20px 0',
                                        color: '#1f2937',
                                        fontSize: '18px',
                                        borderBottom: '2px solid #e5e7eb',
                                        paddingBottom: '10px'
                                    }}>
                                        📅 Timeline
                                    </h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                                        <div>
                                            <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '4px' }}>Lead Created</div>
                                            <div style={{ fontSize: '16px', color: '#1f2937', fontWeight: '500' }}>{selectedLead.date}</div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '4px' }}>Last Contact</div>
                                            <div style={{ fontSize: '16px', color: '#1f2937', fontWeight: '500' }}>{selectedLead.lastContact}</div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '4px' }}>Follow-up Date</div>
                                            <div style={{ fontSize: '16px', color: '#1f2937', fontWeight: '500' }}>{selectedLead.followUpDate}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Notes */}
                                {selectedLead.notes && (
                                    <div style={{ marginBottom: '30px' }}>
                                        <h3 style={{
                                            margin: '0 0 20px 0',
                                            color: '#1f2937',
                                            fontSize: '18px',
                                            borderBottom: '2px solid #e5e7eb',
                                            paddingBottom: '10px'
                                        }}>
                                            📝 Notes
                                        </h3>
                                        <div style={{
                                            fontSize: '15px',
                                            color: '#374151',
                                            lineHeight: '1.6',
                                            background: '#fffbeb',
                                            padding: '16px',
                                            borderRadius: '8px',
                                            border: '1px solid #fed7aa'
                                        }}>
                                            {selectedLead.notes}
                                        </div>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div style={{
                                    display: 'flex',
                                    gap: '15px',
                                    justifyContent: 'center',
                                    paddingTop: '20px',
                                    borderTop: '1px solid #e5e7eb',
                                    flexWrap: 'wrap'
                                }}>
                                    <button
                                        onClick={() => handleEditLead(selectedLead)}
                                        style={{
                                            padding: '12px 24px',
                                            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontWeight: '500',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            transition: 'transform 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                                        onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                                    >
                                        ✏️ Edit Lead
                                    </button>
                                    <button
                                        onClick={() => handleMarkContacted(selectedLead)}
                                        style={{
                                            padding: '12px 24px',
                                            background: 'linear-gradient(135deg, #059669, #047857)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontWeight: '500',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            transition: 'transform 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                                        onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                                    >
                                        📞 Mark Contacted
                                    </button>
                                    <button
                                        onClick={() => handleScheduleVisit(selectedLead)}
                                        style={{
                                            padding: '12px 24px',
                                            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontWeight: '500',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            transition: 'transform 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                                        onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                                    >
                                        📅 Schedule Visit
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit Lead Form Modal */}
                {showEditForm && editingLead && (
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
                        zIndex: 1000,
                        padding: '20px'
                    }}>
                        <div style={{
                            background: 'white',
                            borderRadius: '16px',
                            width: '100%',
                            maxWidth: '600px',
                            maxHeight: '90vh',
                            overflow: 'auto'
                        }}>
                            {/* Header */}
                            <div style={{
                                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                                color: 'white',
                                padding: '25px',
                                borderRadius: '16px 16px 0 0',
                                position: 'relative'
                            }}>
                                <button
                                    onClick={() => {
                                        setShowEditForm(false)
                                        resetLeadForm()
                                    }}
                                    style={{
                                        position: 'absolute',
                                        top: '20px',
                                        right: '20px',
                                        background: 'rgba(255,255,255,0.2)',
                                        border: 'none',
                                        color: 'white',
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '50%',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '18px'
                                    }}
                                >
                                    ×
                                </button>
                                <h2 style={{ margin: 0, fontSize: '24px' }}>✏️ Edit Lead</h2>
                            </div>

                            {/* Form Content */}
                            <div style={{ padding: '30px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '20px' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Name</label>
                                        <input
                                            type="text"
                                            value={leadForm.name}
                                            onChange={(e) => setLeadForm(prev => ({ ...prev, name: e.target.value }))}
                                            style={{
                                                width: '100%',
                                                padding: '12px',
                                                border: '1px solid #d1d5db',
                                                borderRadius: '8px',
                                                fontSize: '14px'
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Phone</label>
                                        <input
                                            type="tel"
                                            value={leadForm.phone}
                                            onChange={(e) => setLeadForm(prev => ({ ...prev, phone: e.target.value }))}
                                            style={{
                                                width: '100%',
                                                padding: '12px',
                                                border: '1px solid #d1d5db',
                                                borderRadius: '8px',
                                                fontSize: '14px'
                                            }}
                                        />
                                    </div>
                                </div>

                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Email</label>
                                    <input
                                        type="email"
                                        value={leadForm.email}
                                        onChange={(e) => setLeadForm(prev => ({ ...prev, email: e.target.value }))}
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '8px',
                                            fontSize: '14px'
                                        }}
                                    />
                                </div>

                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Address</label>
                                    <input
                                        type="text"
                                        value={leadForm.address}
                                        onChange={(e) => setLeadForm(prev => ({ ...prev, address: e.target.value }))}
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '8px',
                                            fontSize: '14px'
                                        }}
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '20px' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Service</label>
                                        <input
                                            type="text"
                                            value={leadForm.service}
                                            onChange={(e) => setLeadForm(prev => ({ ...prev, service: e.target.value }))}
                                            style={{
                                                width: '100%',
                                                padding: '12px',
                                                border: '1px solid #d1d5db',
                                                borderRadius: '8px',
                                                fontSize: '14px'
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Estimated Value</label>
                                        <input
                                            type="number"
                                            value={leadForm.estimatedValue}
                                            onChange={(e) => setLeadForm(prev => ({ ...prev, estimatedValue: e.target.value }))}
                                            style={{
                                                width: '100%',
                                                padding: '12px',
                                                border: '1px solid #d1d5db',
                                                borderRadius: '8px',
                                                fontSize: '14px'
                                            }}
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minWidth(200px, 1fr))', gap: '20px', marginBottom: '20px' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Urgency</label>
                                        <select
                                            value={leadForm.urgency}
                                            onChange={(e) => setLeadForm(prev => ({ ...prev, urgency: e.target.value }))}
                                            style={{
                                                width: '100%',
                                                padding: '12px',
                                                border: '1px solid #d1d5db',
                                                borderRadius: '8px',
                                                fontSize: '14px'
                                            }}
                                        >
                                            <option value="low">Low</option>
                                            <option value="medium">Medium</option>
                                            <option value="high">High</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Source</label>
                                        <select
                                            value={leadForm.source}
                                            onChange={(e) => setLeadForm(prev => ({ ...prev, source: e.target.value }))}
                                            style={{
                                                width: '100%',
                                                padding: '12px',
                                                border: '1px solid #d1d5db',
                                                borderRadius: '8px',
                                                fontSize: '14px'
                                            }}
                                        >
                                            <option value="phone">Phone Call</option>
                                            <option value="website">Website</option>
                                            <option value="referral">Referral</option>
                                            <option value="google">Google</option>
                                            <option value="facebook">Facebook</option>
                                            <option value="nextdoor">Nextdoor</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                </div>

                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Description</label>
                                    <textarea
                                        value={leadForm.description}
                                        onChange={(e) => setLeadForm(prev => ({ ...prev, description: e.target.value }))}
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '8px',
                                            fontSize: '14px',
                                            minHeight: '100px',
                                            resize: 'vertical'
                                        }}
                                    />
                                </div>

                                <div style={{ marginBottom: '30px' }}>
                                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Notes</label>
                                    <textarea
                                        value={leadForm.notes}
                                        onChange={(e) => setLeadForm(prev => ({ ...prev, notes: e.target.value }))}
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '8px',
                                            fontSize: '14px',
                                            minHeight: '80px',
                                            resize: 'vertical'
                                        }}
                                        placeholder="Any additional notes or customer preferences..."
                                    />
                                </div>

                                {/* Action Buttons */}
                                <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', paddingTop: '20px', borderTop: '1px solid #e5e7eb' }}>
                                    <button
                                        onClick={() => {
                                            setShowEditForm(false)
                                            resetLeadForm()
                                        }}
                                        style={{
                                            padding: '12px 24px',
                                            background: '#6b7280',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontWeight: '500'
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={updateEditedLead}
                                        style={{
                                            padding: '12px 24px',
                                            background: 'linear-gradient(135deg, #059669, #047857)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontWeight: '500'
                                        }}
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Contact Form Modal */}
                {showContactForm && selectedLead && (
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
                        zIndex: 1000,
                        padding: '20px'
                    }}>
                        <div style={{
                            background: 'white',
                            borderRadius: '16px',
                            width: '100%',
                            maxWidth: '500px',
                            maxHeight: '90vh',
                            overflow: 'auto'
                        }}>
                            {/* Header */}
                            <div style={{
                                background: 'linear-gradient(135deg, #059669, #047857)',
                                color: 'white',
                                padding: '25px',
                                borderRadius: '16px 16px 0 0',
                                position: 'relative'
                            }}>
                                <button
                                    onClick={() => setShowContactForm(false)}
                                    style={{
                                        position: 'absolute',
                                        top: '20px',
                                        right: '20px',
                                        background: 'rgba(255,255,255,0.2)',
                                        border: 'none',
                                        color: 'white',
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '50%',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '18px'
                                    }}
                                >
                                    ×
                                </button>
                                <h2 style={{ margin: 0, fontSize: '24px', marginBottom: '8px' }}>📞 Log Contact</h2>
                                <div style={{ fontSize: '16px', opacity: 0.9 }}>{selectedLead.name}</div>
                            </div>

                            {/* Form Content */}
                            <div style={{ padding: '30px' }}>
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Contact Method</label>
                                    <select
                                        value={contactForm.contactType}
                                        onChange={(e) => setContactForm(prev => ({ ...prev, contactType: e.target.value }))}
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '8px',
                                            fontSize: '14px'
                                        }}
                                    >
                                        <option value="phone">Phone Call</option>
                                        <option value="email">Email</option>
                                        <option value="text">Text Message</option>
                                        <option value="in-person">In Person</option>
                                    </select>
                                </div>

                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Outcome</label>
                                    <select
                                        value={contactForm.outcome}
                                        onChange={(e) => setContactForm(prev => ({ ...prev, outcome: e.target.value }))}
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '8px',
                                            fontSize: '14px'
                                        }}
                                    >
                                        <option value="interested">Still Interested</option>
                                        <option value="scheduled">Scheduled Meeting</option>
                                        <option value="not-interested">Not Interested</option>
                                        <option value="callback">Requested Callback</option>
                                        <option value="voicemail">Left Voicemail</option>
                                        <option value="no-answer">No Answer</option>
                                    </select>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Follow-up Date</label>
                                        <input
                                            type="date"
                                            value={contactForm.followUpDate}
                                            onChange={(e) => setContactForm(prev => ({ ...prev, followUpDate: e.target.value }))}
                                            style={{
                                                width: '100%',
                                                padding: '12px',
                                                border: '1px solid #d1d5db',
                                                borderRadius: '8px',
                                                fontSize: '14px'
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Follow-up Time</label>
                                        <input
                                            type="time"
                                            value={contactForm.followUpTime}
                                            onChange={(e) => setContactForm(prev => ({ ...prev, followUpTime: e.target.value }))}
                                            style={{
                                                width: '100%',
                                                padding: '12px',
                                                border: '1px solid #d1d5db',
                                                borderRadius: '8px',
                                                fontSize: '14px'
                                            }}
                                        />
                                    </div>
                                </div>

                                <div style={{ marginBottom: '30px' }}>
                                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Contact Notes</label>
                                    <textarea
                                        value={contactForm.notes}
                                        onChange={(e) => setContactForm(prev => ({ ...prev, notes: e.target.value }))}
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '8px',
                                            fontSize: '14px',
                                            minHeight: '100px',
                                            resize: 'vertical'
                                        }}
                                        placeholder="What was discussed? Customer concerns, preferences, etc."
                                    />
                                </div>

                                {/* Action Buttons */}
                                <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', paddingTop: '20px', borderTop: '1px solid #e5e7eb' }}>
                                    <button
                                        onClick={() => setShowContactForm(false)}
                                        style={{
                                            padding: '12px 24px',
                                            background: '#6b7280',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontWeight: '500'
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={submitContactForm}
                                        style={{
                                            padding: '12px 24px',
                                            background: 'linear-gradient(135deg, #059669, #047857)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontWeight: '500'
                                        }}
                                    >
                                        Log Contact
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Schedule Visit Form Modal */}
                {showScheduleForm && selectedLead && (
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
                        zIndex: 1000,
                        padding: '20px'
                    }}>
                        <div style={{
                            background: 'white',
                            borderRadius: '16px',
                            width: '100%',
                            maxWidth: '600px',
                            maxHeight: '90vh',
                            overflow: 'auto'
                        }}>
                            {/* Header */}
                            <div style={{
                                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                                color: 'white',
                                padding: '25px',
                                borderRadius: '16px 16px 0 0',
                                position: 'relative'
                            }}>
                                <button
                                    onClick={() => setShowScheduleForm(false)}
                                    style={{
                                        position: 'absolute',
                                        top: '20px',
                                        right: '20px',
                                        background: 'rgba(255,255,255,0.2)',
                                        border: 'none',
                                        color: 'white',
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '50%',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '18px'
                                    }}
                                >
                                    ×
                                </button>
                                <h2 style={{ margin: 0, fontSize: '24px', marginBottom: '8px' }}>📅 Schedule Visit</h2>
                                <div style={{ fontSize: '16px', opacity: 0.9 }}>{selectedLead.name}</div>
                            </div>

                            {/* Form Content */}
                            <div style={{ padding: '30px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Visit Date</label>
                                        <input
                                            type="date"
                                            value={scheduleForm.visitDate}
                                            onChange={(e) => setScheduleForm(prev => ({ ...prev, visitDate: e.target.value }))}
                                            style={{
                                                width: '100%',
                                                padding: '12px',
                                                border: '1px solid #d1d5db',
                                                borderRadius: '8px',
                                                fontSize: '14px'
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Visit Time</label>
                                        <input
                                            type="time"
                                            value={scheduleForm.visitTime}
                                            onChange={(e) => setScheduleForm(prev => ({ ...prev, visitTime: e.target.value }))}
                                            style={{
                                                width: '100%',
                                                padding: '12px',
                                                border: '1px solid #d1d5db',
                                                borderRadius: '8px',
                                                fontSize: '14px'
                                            }}
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Visit Type</label>
                                        <select
                                            value={scheduleForm.visitType}
                                            onChange={(e) => setScheduleForm(prev => ({ ...prev, visitType: e.target.value }))}
                                            style={{
                                                width: '100%',
                                                padding: '12px',
                                                border: '1px solid #d1d5db',
                                                borderRadius: '8px',
                                                fontSize: '14px'
                                            }}
                                        >
                                            <option value="estimate">Estimate</option>
                                            <option value="consultation">Consultation</option>
                                            <option value="follow-up">Follow-up</option>
                                            <option value="work">Scheduled Work</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Duration (hours)</label>
                                        <select
                                            value={scheduleForm.duration}
                                            onChange={(e) => setScheduleForm(prev => ({ ...prev, duration: e.target.value }))}
                                            style={{
                                                width: '100%',
                                                padding: '12px',
                                                border: '1px solid #d1d5db',
                                                borderRadius: '8px',
                                                fontSize: '14px'
                                            }}
                                        >
                                            <option value="0.5">30 minutes</option>
                                            <option value="1">1 hour</option>
                                            <option value="1.5">1.5 hours</option>
                                            <option value="2">2 hours</option>
                                            <option value="3">3 hours</option>
                                            <option value="4">4+ hours</option>
                                        </select>
                                    </div>
                                </div>

                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Address</label>
                                    <input
                                        type="text"
                                        value={scheduleForm.address}
                                        onChange={(e) => setScheduleForm(prev => ({ ...prev, address: e.target.value }))}
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '8px',
                                            fontSize: '14px'
                                        }}
                                        placeholder="Visit location address"
                                    />
                                </div>

                                <div style={{ marginBottom: '30px' }}>
                                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Visit Notes</label>
                                    <textarea
                                        value={scheduleForm.notes}
                                        onChange={(e) => setScheduleForm(prev => ({ ...prev, notes: e.target.value }))}
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '8px',
                                            fontSize: '14px',
                                            minHeight: '100px',
                                            resize: 'vertical'
                                        }}
                                        placeholder="Purpose of visit, what to bring, special instructions..."
                                    />
                                </div>

                                {/* Action Buttons */}
                                <div style={{ paddingTop: '20px', borderTop: '1px solid #e5e7eb' }}>
                                    {/* Regular Schedule Button */}
                                    <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginBottom: '20px' }}>
                                        <button
                                            onClick={() => setShowScheduleForm(false)}
                                            style={{
                                                padding: '12px 24px',
                                                background: '#6b7280',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                fontWeight: '500'
                                            }}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={submitScheduleForm}
                                            style={{
                                                padding: '12px 24px',
                                                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                fontWeight: '500'
                                            }}
                                        >
                                            Schedule Visit Only
                                        </button>
                                    </div>

                                    {/* Calendar Integration Section */}
                                    <div style={{
                                        background: '#f8fafc',
                                        padding: '20px',
                                        borderRadius: '12px',
                                        border: '1px solid #e2e8f0'
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            marginBottom: '15px'
                                        }}>
                                            <Calendar size={20} color="#059669" />
                                            <h4 style={{ margin: 0, color: '#1f2937', fontSize: '16px' }}>
                                                Schedule & Add to Calendar
                                            </h4>
                                        </div>
                                        <p style={{
                                            margin: '0 0 15px 0',
                                            color: '#6b7280',
                                            fontSize: '14px'
                                        }}>
                                            Schedule the visit and automatically add it to your calendar
                                        </p>

                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                                            gap: '12px'
                                        }}>
                                            <button
                                                onClick={() => handleScheduleWithCalendar('google')}
                                                style={{
                                                    padding: '12px 16px',
                                                    background: 'linear-gradient(135deg, #4285f4, #34a853)',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    cursor: 'pointer',
                                                    fontWeight: '500',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '8px',
                                                    fontSize: '14px'
                                                }}
                                            >
                                                <ExternalLink size={16} />
                                                Google Calendar
                                            </button>

                                            <button
                                                onClick={() => handleScheduleWithCalendar('outlook')}
                                                style={{
                                                    padding: '12px 16px',
                                                    background: 'linear-gradient(135deg, #0078d4, #106ebe)',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    cursor: 'pointer',
                                                    fontWeight: '500',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '8px',
                                                    fontSize: '14px'
                                                }}
                                            >
                                                <ExternalLink size={16} />
                                                Outlook Calendar
                                            </button>

                                            <button
                                                onClick={() => handleScheduleWithCalendar('apple')}
                                                style={{
                                                    padding: '12px 16px',
                                                    background: 'linear-gradient(135deg, #1d1d1f, #86868b)',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    cursor: 'pointer',
                                                    fontWeight: '500',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '8px',
                                                    fontSize: '14px'
                                                }}
                                            >
                                                <Download size={16} />
                                                Apple Calendar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Calendar Settings Modal */}
                {showCalendarSettings && (
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
                        zIndex: 1000,
                        padding: '20px'
                    }}>
                        <div style={{
                            background: 'white',
                            borderRadius: '16px',
                            width: '100%',
                            maxWidth: '500px',
                            maxHeight: '90vh',
                            overflow: 'auto'
                        }}>
                            {/* Header */}
                            <div style={{
                                background: 'linear-gradient(135deg, #059669, #047857)',
                                color: 'white',
                                padding: '25px',
                                borderRadius: '16px 16px 0 0',
                                position: 'relative'
                            }}>
                                <button
                                    onClick={() => setShowCalendarSettings(false)}
                                    style={{
                                        position: 'absolute',
                                        top: '20px',
                                        right: '20px',
                                        background: 'rgba(255,255,255,0.2)',
                                        border: 'none',
                                        color: 'white',
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '50%',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '18px'
                                    }}
                                >
                                    ×
                                </button>
                                <h2 style={{ margin: 0, fontSize: '24px', marginBottom: '8px' }}>
                                    <Calendar size={24} style={{ display: 'inline', marginRight: '8px' }} />
                                    Calendar Integration
                                </h2>
                                <div style={{ fontSize: '16px', opacity: 0.9 }}>Manage calendar connections</div>
                            </div>

                            {/* Content */}
                            <div style={{ padding: '30px' }}>
                                <div style={{ marginBottom: '25px' }}>
                                    <h3 style={{ margin: '0 0 15px 0', color: '#1f2937', fontSize: '18px' }}>
                                        Calendar Services
                                    </h3>
                                    <p style={{ margin: '0 0 20px 0', color: '#6b7280', fontSize: '14px' }}>
                                        Choose your preferred calendar service for automatic event creation
                                    </p>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        <div style={{
                                            padding: '16px',
                                            border: '2px solid #e5e7eb',
                                            borderRadius: '12px',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            background: calendarIntegration.defaultCalendar === 'google' ? '#f0f9ff' : 'white',
                                            borderColor: calendarIntegration.defaultCalendar === 'google' ? '#3b82f6' : '#e5e7eb'
                                        }}
                                            onClick={() => setCalendarIntegration(prev => ({ ...prev, defaultCalendar: 'google' }))}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{
                                                    width: '40px',
                                                    height: '40px',
                                                    background: 'linear-gradient(135deg, #4285f4, #34a853)',
                                                    borderRadius: '8px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}>
                                                    <Calendar size={20} color="white" />
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: '600', color: '#1f2937' }}>Google Calendar</div>
                                                    <div style={{ fontSize: '14px', color: '#6b7280' }}>Opens in new tab, easy sharing</div>
                                                </div>
                                                {calendarIntegration.defaultCalendar === 'google' && (
                                                    <div style={{ marginLeft: 'auto', color: '#3b82f6' }}>✓</div>
                                                )}
                                            </div>
                                        </div>

                                        <div style={{
                                            padding: '16px',
                                            border: '2px solid #e5e7eb',
                                            borderRadius: '12px',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            background: calendarIntegration.defaultCalendar === 'outlook' ? '#f0f9ff' : 'white',
                                            borderColor: calendarIntegration.defaultCalendar === 'outlook' ? '#3b82f6' : '#e5e7eb'
                                        }}
                                            onClick={() => setCalendarIntegration(prev => ({ ...prev, defaultCalendar: 'outlook' }))}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{
                                                    width: '40px',
                                                    height: '40px',
                                                    background: 'linear-gradient(135deg, #0078d4, #106ebe)',
                                                    borderRadius: '8px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}>
                                                    <Calendar size={20} color="white" />
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: '600', color: '#1f2937' }}>Outlook Calendar</div>
                                                    <div style={{ fontSize: '14px', color: '#6b7280' }}>Microsoft 365 integration</div>
                                                </div>
                                                {calendarIntegration.defaultCalendar === 'outlook' && (
                                                    <div style={{ marginLeft: 'auto', color: '#3b82f6' }}>✓</div>
                                                )}
                                            </div>
                                        </div>

                                        <div style={{
                                            padding: '16px',
                                            border: '2px solid #e5e7eb',
                                            borderRadius: '12px',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            background: calendarIntegration.defaultCalendar === 'apple' ? '#f0f9ff' : 'white',
                                            borderColor: calendarIntegration.defaultCalendar === 'apple' ? '#3b82f6' : '#e5e7eb'
                                        }}
                                            onClick={() => setCalendarIntegration(prev => ({ ...prev, defaultCalendar: 'apple' }))}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{
                                                    width: '40px',
                                                    height: '40px',
                                                    background: 'linear-gradient(135deg, #1d1d1f, #86868b)',
                                                    borderRadius: '8px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}>
                                                    <Calendar size={20} color="white" />
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: '600', color: '#1f2937' }}>Apple Calendar</div>
                                                    <div style={{ fontSize: '14px', color: '#6b7280' }}>Downloads .ics file</div>
                                                </div>
                                                {calendarIntegration.defaultCalendar === 'apple' && (
                                                    <div style={{ marginLeft: 'auto', color: '#3b82f6' }}>✓</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Calendar Access */}
                                <div style={{
                                    background: '#f8fafc',
                                    padding: '20px',
                                    borderRadius: '12px',
                                    border: '1px solid #e2e8f0',
                                    marginBottom: '25px'
                                }}>
                                    <h4 style={{ margin: '0 0 15px 0', color: '#1f2937', fontSize: '16px' }}>
                                        Quick Calendar Access
                                    </h4>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px' }}>
                                        <button
                                            onClick={() => window.open('https://calendar.google.com', '_blank')}
                                            style={{
                                                padding: '10px 16px',
                                                background: 'linear-gradient(135deg, #4285f4, #34a853)',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                fontSize: '14px',
                                                fontWeight: '500',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '6px'
                                            }}
                                        >
                                            <ExternalLink size={14} />
                                            Google
                                        </button>
                                        <button
                                            onClick={() => window.open('https://outlook.live.com/calendar', '_blank')}
                                            style={{
                                                padding: '10px 16px',
                                                background: 'linear-gradient(135deg, #0078d4, #106ebe)',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                fontSize: '14px',
                                                fontWeight: '500',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '6px'
                                            }}
                                        >
                                            <ExternalLink size={14} />
                                            Outlook
                                        </button>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', paddingTop: '20px', borderTop: '1px solid #e5e7eb' }}>
                                    <button
                                        onClick={() => setShowCalendarSettings(false)}
                                        style={{
                                            padding: '12px 24px',
                                            background: 'linear-gradient(135deg, #059669, #047857)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontWeight: '500'
                                        }}
                                    >
                                        Save Settings
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Add Event Modal */}
                {showAddEvent && (
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
                        zIndex: 1000,
                        padding: '20px'
                    }}>
                        <div style={{
                            background: 'white',
                            borderRadius: '16px',
                            width: '100%',
                            maxWidth: '600px',
                            maxHeight: '90vh',
                            overflow: 'auto'
                        }}>
                            {/* Header */}
                            <div style={{
                                background: 'linear-gradient(135deg, #3b82f6, #1e40af)',
                                color: 'white',
                                padding: '25px',
                                borderRadius: '16px 16px 0 0',
                                position: 'relative'
                            }}>
                                <button
                                    onClick={() => {
                                        setShowAddEvent(false)
                                        setEventForm({
                                            title: '',
                                            date: '',
                                            startTime: '',
                                            endTime: '',
                                            type: 'appointment',
                                            client: '',
                                            location: '',
                                            description: '',
                                            reminder: '15',
                                            status: 'scheduled'
                                        })
                                    }}
                                    style={{
                                        position: 'absolute',
                                        top: '20px',
                                        right: '20px',
                                        background: 'rgba(255,255,255,0.2)',
                                        border: 'none',
                                        color: 'white',
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '50%',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '18px'
                                    }}
                                >
                                    ×
                                </button>
                                <h2 style={{ margin: 0, fontSize: '24px', marginBottom: '8px' }}>
                                    <Calendar size={24} style={{ display: 'inline', marginRight: '8px' }} />
                                    Add New Event
                                </h2>
                                <div style={{ fontSize: '16px', opacity: 0.9 }}>Schedule a new appointment or event</div>
                            </div>

                            {/* Form */}
                            <div style={{ padding: '30px' }}>
                                <div style={{ display: 'grid', gap: '20px' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
                                            Event Title *
                                        </label>
                                        <input
                                            type="text"
                                            value={eventForm.title}
                                            onChange={(e) => setEventForm(prev => ({ ...prev, title: e.target.value }))}
                                            style={{
                                                width: '100%',
                                                padding: '12px',
                                                border: '2px solid #e5e7eb',
                                                borderRadius: '8px',
                                                fontSize: '14px'
                                            }}
                                            placeholder="Enter event title"
                                        />
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
                                                Event Type
                                            </label>
                                            <select
                                                value={eventForm.type}
                                                onChange={(e) => setEventForm(prev => ({ ...prev, type: e.target.value }))}
                                                style={{
                                                    width: '100%',
                                                    padding: '12px',
                                                    border: '2px solid #e5e7eb',
                                                    borderRadius: '8px',
                                                    fontSize: '14px'
                                                }}
                                            >
                                                <option value="appointment">Appointment</option>
                                                <option value="estimate">Estimate</option>
                                                <option value="consultation">Consultation</option>
                                                <option value="follow-up">Follow-up</option>
                                                <option value="meeting">Meeting</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
                                                Date *
                                            </label>
                                            <input
                                                type="date"
                                                value={eventForm.date}
                                                onChange={(e) => setEventForm(prev => ({ ...prev, date: e.target.value }))}
                                                style={{
                                                    width: '100%',
                                                    padding: '12px',
                                                    border: '2px solid #e5e7eb',
                                                    borderRadius: '8px',
                                                    fontSize: '14px'
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
                                                Start Time *
                                            </label>
                                            <input
                                                type="time"
                                                value={eventForm.startTime}
                                                onChange={(e) => setEventForm(prev => ({ ...prev, startTime: e.target.value }))}
                                                style={{
                                                    width: '100%',
                                                    padding: '12px',
                                                    border: '2px solid #e5e7eb',
                                                    borderRadius: '8px',
                                                    fontSize: '14px'
                                                }}
                                            />
                                        </div>

                                        <div>
                                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
                                                End Time *
                                            </label>
                                            <input
                                                type="time"
                                                value={eventForm.endTime}
                                                onChange={(e) => setEventForm(prev => ({ ...prev, endTime: e.target.value }))}
                                                style={{
                                                    width: '100%',
                                                    padding: '12px',
                                                    border: '2px solid #e5e7eb',
                                                    borderRadius: '8px',
                                                    fontSize: '14px'
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
                                            Client Name
                                        </label>
                                        <input
                                            type="text"
                                            value={eventForm.client}
                                            onChange={(e) => setEventForm(prev => ({ ...prev, client: e.target.value }))}
                                            style={{
                                                width: '100%',
                                                padding: '12px',
                                                border: '2px solid #e5e7eb',
                                                borderRadius: '8px',
                                                fontSize: '14px'
                                            }}
                                            placeholder="Enter client name"
                                        />
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
                                            Location
                                        </label>
                                        <input
                                            type="text"
                                            value={eventForm.location}
                                            onChange={(e) => setEventForm(prev => ({ ...prev, location: e.target.value }))}
                                            style={{
                                                width: '100%',
                                                padding: '12px',
                                                border: '2px solid #e5e7eb',
                                                borderRadius: '8px',
                                                fontSize: '14px'
                                            }}
                                            placeholder="Enter location or address"
                                        />
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
                                            Description
                                        </label>
                                        <textarea
                                            value={eventForm.description}
                                            onChange={(e) => setEventForm(prev => ({ ...prev, description: e.target.value }))}
                                            rows={3}
                                            style={{
                                                width: '100%',
                                                padding: '12px',
                                                border: '2px solid #e5e7eb',
                                                borderRadius: '8px',
                                                fontSize: '14px',
                                                resize: 'vertical'
                                            }}
                                            placeholder="Enter event description or notes"
                                        />
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
                                            Reminder
                                        </label>
                                        <select
                                            value={eventForm.reminder}
                                            onChange={(e) => setEventForm(prev => ({ ...prev, reminder: e.target.value }))}
                                            style={{
                                                width: '100%',
                                                padding: '12px',
                                                border: '2px solid #e5e7eb',
                                                borderRadius: '8px',
                                                fontSize: '14px'
                                            }}
                                        >
                                            <option value="0">No reminder</option>
                                            <option value="15">15 minutes before</option>
                                            <option value="30">30 minutes before</option>
                                            <option value="60">1 hour before</option>
                                            <option value="1440">1 day before</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end', paddingTop: '30px', borderTop: '1px solid #e5e7eb', marginTop: '30px' }}>
                                    <button
                                        onClick={() => {
                                            setShowAddEvent(false)
                                            setEventForm({
                                                title: '',
                                                date: '',
                                                startTime: '',
                                                endTime: '',
                                                type: 'appointment',
                                                client: '',
                                                location: '',
                                                description: '',
                                                reminder: '15',
                                                status: 'scheduled'
                                            })
                                        }}
                                        style={{
                                            padding: '12px 24px',
                                            background: '#f3f4f6',
                                            color: '#374151',
                                            border: 'none',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontWeight: '500'
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={async () => {
                                            try {
                                                await addCalendarEvent(eventForm)
                                                setShowAddEvent(false)
                                                setEventForm({
                                                    title: '',
                                                    date: '',
                                                    startTime: '',
                                                    endTime: '',
                                                    type: 'appointment',
                                                    client: '',
                                                    location: '',
                                                    description: '',
                                                    reminder: '15',
                                                    status: 'scheduled'
                                                })
                                                alert('Event added successfully!')
                                            } catch (error) {
                                                alert('Error adding event. Please try again.')
                                            }
                                        }}
                                        style={{
                                            padding: '12px 24px',
                                            background: 'linear-gradient(135deg, #3b82f6, #1e40af)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontWeight: '500',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        }}
                                    >
                                        <Calendar size={16} />
                                        Add Event
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Event Detail Modal */}
                {showEventDetail && selectedEvent && (
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
                        zIndex: 1000,
                        padding: '20px'
                    }}>
                        <div style={{
                            background: 'white',
                            borderRadius: '16px',
                            width: '100%',
                            maxWidth: '600px',
                            maxHeight: '90vh',
                            overflow: 'auto'
                        }}>
                            {/* Header */}
                            <div style={{
                                background: selectedEvent.type === 'appointment' ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #3b82f6, #1e40af)',
                                color: 'white',
                                padding: '25px',
                                borderRadius: '16px 16px 0 0',
                                position: 'relative'
                            }}>
                                <button
                                    onClick={() => {
                                        setShowEventDetail(false)
                                        setSelectedEvent(null)
                                    }}
                                    style={{
                                        position: 'absolute',
                                        top: '20px',
                                        right: '20px',
                                        background: 'rgba(255,255,255,0.2)',
                                        border: 'none',
                                        color: 'white',
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '50%',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '18px'
                                    }}
                                >
                                    ×
                                </button>
                                <h2 style={{ margin: 0, fontSize: '24px', marginBottom: '8px' }}>
                                    {selectedEvent.title}
                                </h2>
                                <div style={{ fontSize: '16px', opacity: 0.9, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Clock size={16} />
                                    {new Date(selectedEvent.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                                </div>
                            </div>

                            {/* Content */}
                            <div style={{ padding: '30px' }}>
                                <div style={{ display: 'grid', gap: '20px' }}>
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                        gap: '20px',
                                        padding: '20px',
                                        background: '#f8fafc',
                                        borderRadius: '12px',
                                        border: '1px solid #e2e8f0'
                                    }}>
                                        <div>
                                            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px', fontWeight: '600' }}>
                                                TIME
                                            </div>
                                            <div style={{ fontSize: '16px', color: '#1f2937', fontWeight: '600' }}>
                                                {selectedEvent.startTime} - {selectedEvent.endTime}
                                            </div>
                                        </div>

                                        <div>
                                            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px', fontWeight: '600' }}>
                                                TYPE
                                            </div>
                                            <div style={{
                                                fontSize: '14px',
                                                color: 'white',
                                                background: selectedEvent.type === 'appointment' ? '#10b981' : '#3b82f6',
                                                padding: '4px 8px',
                                                borderRadius: '6px',
                                                fontWeight: '500',
                                                display: 'inline-block',
                                                textTransform: 'capitalize'
                                            }}>
                                                {selectedEvent.type}
                                            </div>
                                        </div>
                                    </div>

                                    {selectedEvent.client && (
                                        <div>
                                            <h4 style={{ margin: '0 0 10px 0', color: '#1f2937', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <Users size={16} />
                                                Client Information
                                            </h4>
                                            <div style={{ color: '#374151', fontSize: '15px', fontWeight: '500' }}>
                                                {selectedEvent.client}
                                            </div>
                                            {selectedEvent.clientPhone && (
                                                <div style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <Phone size={14} />
                                                    {selectedEvent.clientPhone}
                                                </div>
                                            )}
                                            {selectedEvent.clientEmail && (
                                                <div style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <Mail size={14} />
                                                    {selectedEvent.clientEmail}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {selectedEvent.location && (
                                        <div>
                                            <h4 style={{ margin: '0 0 10px 0', color: '#1f2937', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <MapPin size={16} />
                                                Location
                                            </h4>
                                            <div style={{ color: '#374151', fontSize: '15px' }}>
                                                {selectedEvent.location}
                                            </div>
                                        </div>
                                    )}

                                    {selectedEvent.description && (
                                        <div>
                                            <h4 style={{ margin: '0 0 10px 0', color: '#1f2937', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <FileText size={16} />
                                                Description
                                            </h4>
                                            <div style={{ color: '#374151', fontSize: '15px', lineHeight: '1.5' }}>
                                                {selectedEvent.description}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end', paddingTop: '30px', borderTop: '1px solid #e5e7eb', marginTop: '30px' }}>
                                    <button
                                        onClick={() => {
                                            const eventDetails = {
                                                title: selectedEvent.title,
                                                date: selectedEvent.date,
                                                time: selectedEvent.startTime,
                                                duration: calculateDuration(selectedEvent.startTime, selectedEvent.endTime),
                                                location: selectedEvent.location,
                                                description: selectedEvent.description
                                            }
                                            addToCalendar(eventDetails, calendarIntegration.defaultCalendar)
                                        }}
                                        style={{
                                            padding: '12px 20px',
                                            background: 'linear-gradient(135deg, #3b82f6, #1e40af)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontWeight: '500',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        }}
                                    >
                                        <ExternalLink size={16} />
                                        Export to Calendar
                                    </button>
                                    <button
                                        onClick={async () => {
                                            if (confirm('Are you sure you want to delete this event?')) {
                                                try {
                                                    await deleteCalendarEvent(selectedEvent.id)
                                                    setShowEventDetail(false)
                                                    setSelectedEvent(null)
                                                    alert('Event deleted successfully!')
                                                } catch (error) {
                                                    alert('Error deleting event. Please try again.')
                                                }
                                            }
                                        }}
                                        style={{
                                            padding: '12px 20px',
                                            background: '#ef4444',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontWeight: '500',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        }}
                                    >
                                        <Trash2 size={16} />
                                        Delete Event
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Other sections would go here... */}

                {/* Projects Management */}
                {activeSection === 'projects' && (
                    <div>
                        {/* Projects Header */}
                        <div style={{
                            background: 'white',
                            borderRadius: '18px',
                            padding: '28px',
                            marginBottom: '24px',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                            border: '1px solid rgba(0,0,0,0.05)'
                        }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '24px',
                                flexWrap: 'wrap',
                                gap: '16px'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{
                                        width: '36px',
                                        height: '36px',
                                        background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                                        borderRadius: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                                            <line x1="8" y1="21" x2="16" y2="21" />
                                            <line x1="12" y1="17" x2="12" y2="21" />
                                        </svg>
                                    </div>
                                    <h2 style={{ margin: 0, color: '#1f2937', fontSize: '24px', fontWeight: '700' }}>
                                        Project Management
                                    </h2>
                                </div>
                                <button style={{
                                    padding: '12px 24px',
                                    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)'
                                }}>
                                    <Plus size={18} />
                                    New Project
                                </button>
                            </div>

                            {/* Project Stats */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                gap: '16px'
                            }}>
                                <div style={{
                                    padding: '20px',
                                    background: 'linear-gradient(135deg, #10b981, #059669)',
                                    borderRadius: '12px',
                                    color: 'white'
                                }}>
                                    <div style={{ fontSize: '28px', fontWeight: '800', marginBottom: '4px' }}>12</div>
                                    <div style={{ fontSize: '14px', opacity: 0.9 }}>Active Projects</div>
                                </div>
                                <div style={{
                                    padding: '20px',
                                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                                    borderRadius: '12px',
                                    color: 'white'
                                }}>
                                    <div style={{ fontSize: '28px', fontWeight: '800', marginBottom: '4px' }}>5</div>
                                    <div style={{ fontSize: '14px', opacity: 0.9 }}>Due This Week</div>
                                </div>
                                <div style={{
                                    padding: '20px',
                                    background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                                    borderRadius: '12px',
                                    color: 'white'
                                }}>
                                    <div style={{ fontSize: '28px', fontWeight: '800', marginBottom: '4px' }}>$24,500</div>
                                    <div style={{ fontSize: '14px', opacity: 0.9 }}>Active Value</div>
                                </div>
                            </div>
                        </div>

                        {/* Projects Grid */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                            gap: '20px'
                        }}>
                            {[
                                {
                                    id: 1,
                                    name: 'Kitchen Renovation - Smith Residence',
                                    client: 'John Smith',
                                    status: 'in-progress',
                                    progress: 65,
                                    dueDate: '2024-08-15',
                                    value: '$8,500',
                                    tasks: ['Plumbing rough-in', 'Electrical work', 'Drywall installation']
                                },
                                {
                                    id: 2,
                                    name: 'Bathroom Remodel - Johnson Home',
                                    client: 'Sarah Johnson',
                                    status: 'planning',
                                    progress: 15,
                                    dueDate: '2024-09-01',
                                    value: '$6,200',
                                    tasks: ['Design finalization', 'Permit application', 'Material ordering']
                                },
                                {
                                    id: 3,
                                    name: 'Deck Construction - Williams House',
                                    client: 'Mike Williams',
                                    status: 'completed',
                                    progress: 100,
                                    dueDate: '2024-07-20',
                                    value: '$4,800',
                                    tasks: ['Foundation', 'Framing', 'Decking', 'Railing']
                                }
                            ].map(project => (
                                <div key={project.id} style={{
                                    background: 'white',
                                    borderRadius: '16px',
                                    padding: '24px',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                                    border: '1px solid rgba(0,0,0,0.05)',
                                    transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                                }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-4px)';
                                        e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.12)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
                                    }}
                                >
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'flex-start',
                                        marginBottom: '16px'
                                    }}>
                                        <div>
                                            <h3 style={{
                                                margin: '0 0 8px 0',
                                                color: '#1f2937',
                                                fontSize: '18px',
                                                fontWeight: '600'
                                            }}>{project.name}</h3>
                                            <p style={{
                                                margin: 0,
                                                color: '#6b7280',
                                                fontSize: '14px'
                                            }}>Client: {project.client}</p>
                                        </div>
                                        <span style={{
                                            padding: '4px 12px',
                                            borderRadius: '20px',
                                            fontSize: '12px',
                                            fontWeight: '600',
                                            background: project.status === 'completed' ? '#dcfce7' :
                                                project.status === 'in-progress' ? '#dbeafe' : '#fef3c7',
                                            color: project.status === 'completed' ? '#166534' :
                                                project.status === 'in-progress' ? '#1e40af' : '#92400e'
                                        }}>
                                            {project.status.replace('-', ' ').toUpperCase()}
                                        </span>
                                    </div>

                                    <div style={{ marginBottom: '16px' }}>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            marginBottom: '8px'
                                        }}>
                                            <span style={{ fontSize: '14px', color: '#6b7280' }}>Progress</span>
                                            <span style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                                                {project.progress}%
                                            </span>
                                        </div>
                                        <div style={{
                                            width: '100%',
                                            height: '8px',
                                            background: '#f3f4f6',
                                            borderRadius: '4px',
                                            overflow: 'hidden'
                                        }}>
                                            <div style={{
                                                width: `${project.progress}%`,
                                                height: '100%',
                                                background: project.status === 'completed' ? '#10b981' :
                                                    project.status === 'in-progress' ? '#3b82f6' : '#f59e0b',
                                                transition: 'width 0.3s ease'
                                            }}></div>
                                        </div>
                                    </div>

                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: '16px'
                                    }}>
                                        <div>
                                            <div style={{ fontSize: '12px', color: '#6b7280' }}>Due Date</div>
                                            <div style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                                                {project.dueDate}
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '12px', color: '#6b7280' }}>Value</div>
                                            <div style={{ fontSize: '18px', fontWeight: '700', color: '#059669' }}>
                                                {project.value}
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ marginBottom: '16px' }}>
                                        <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
                                            Recent Tasks
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            {project.tasks.slice(0, 2).map((task, index) => (
                                                <div key={index} style={{
                                                    fontSize: '13px',
                                                    color: '#374151',
                                                    padding: '4px 8px',
                                                    background: '#f9fafb',
                                                    borderRadius: '6px'
                                                }}>
                                                    • {task}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button style={{
                                            flex: 1,
                                            padding: '8px 12px',
                                            background: '#3b82f6',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontSize: '13px',
                                            fontWeight: '600'
                                        }}>
                                            View Details
                                        </button>
                                        <button style={{
                                            padding: '8px 12px',
                                            background: '#f3f4f6',
                                            color: '#374151',
                                            border: 'none',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontSize: '13px',
                                            fontWeight: '600'
                                        }}>
                                            <Edit3 size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Invoices Management */}
                {activeSection === 'invoices' && (
                    <div>
                        {/* Invoice Header */}
                        <div style={{
                            background: 'white',
                            borderRadius: '18px',
                            padding: '28px',
                            marginBottom: '24px',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                            border: '1px solid rgba(0,0,0,0.05)'
                        }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '24px',
                                flexWrap: 'wrap',
                                gap: '16px'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{
                                        width: '36px',
                                        height: '36px',
                                        background: 'linear-gradient(135deg, #059669, #10b981)',
                                        borderRadius: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                            <polyline points="14,2 14,8 20,8" />
                                            <line x1="16" y1="13" x2="8" y2="13" />
                                            <line x1="16" y1="17" x2="8" y2="17" />
                                        </svg>
                                    </div>
                                    <h2 style={{ margin: 0, color: '#1f2937', fontSize: '24px', fontWeight: '700' }}>
                                        Invoice Management
                                    </h2>
                                </div>
                                <button style={{
                                    padding: '12px 24px',
                                    background: 'linear-gradient(135deg, #059669, #10b981)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    boxShadow: '0 4px 12px rgba(5, 150, 105, 0.4)'
                                }}>
                                    <Plus size={18} />
                                    Create Invoice
                                </button>
                            </div>

                            {/* Invoice Stats */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                gap: '16px'
                            }}>
                                <div style={{
                                    padding: '20px',
                                    background: 'linear-gradient(135deg, #10b981, #059669)',
                                    borderRadius: '12px',
                                    color: 'white'
                                }}>
                                    <div style={{ fontSize: '28px', fontWeight: '800', marginBottom: '4px' }}>$12,450</div>
                                    <div style={{ fontSize: '14px', opacity: 0.9 }}>Outstanding</div>
                                </div>
                                <div style={{
                                    padding: '20px',
                                    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                                    borderRadius: '12px',
                                    color: 'white'
                                }}>
                                    <div style={{ fontSize: '28px', fontWeight: '800', marginBottom: '4px' }}>8</div>
                                    <div style={{ fontSize: '14px', opacity: 0.9 }}>Pending Payment</div>
                                </div>
                                <div style={{
                                    padding: '20px',
                                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                                    borderRadius: '12px',
                                    color: 'white'
                                }}>
                                    <div style={{ fontSize: '28px', fontWeight: '800', marginBottom: '4px' }}>3</div>
                                    <div style={{ fontSize: '14px', opacity: 0.9 }}>Overdue</div>
                                </div>
                            </div>
                        </div>

                        {/* Invoice List */}
                        <div style={{
                            background: 'white',
                            borderRadius: '18px',
                            padding: '28px',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                            border: '1px solid rgba(0,0,0,0.05)'
                        }}>
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '2px solid #f3f4f6' }}>
                                            <th style={{ padding: '16px', textAlign: 'left', color: '#374151', fontWeight: '600' }}>
                                                Invoice #
                                            </th>
                                            <th style={{ padding: '16px', textAlign: 'left', color: '#374151', fontWeight: '600' }}>
                                                Client
                                            </th>
                                            <th style={{ padding: '16px', textAlign: 'left', color: '#374151', fontWeight: '600' }}>
                                                Amount
                                            </th>
                                            <th style={{ padding: '16px', textAlign: 'left', color: '#374151', fontWeight: '600' }}>
                                                Due Date
                                            </th>
                                            <th style={{ padding: '16px', textAlign: 'left', color: '#374151', fontWeight: '600' }}>
                                                Status
                                            </th>
                                            <th style={{ padding: '16px', textAlign: 'center', color: '#374151', fontWeight: '600' }}>
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[
                                            {
                                                id: 'INV-001',
                                                client: 'John Smith',
                                                amount: '$2,450',
                                                dueDate: '2024-08-15',
                                                status: 'paid'
                                            },
                                            {
                                                id: 'INV-002',
                                                client: 'Sarah Johnson',
                                                amount: '$1,800',
                                                dueDate: '2024-08-20',
                                                status: 'pending'
                                            },
                                            {
                                                id: 'INV-003',
                                                client: 'Mike Williams',
                                                amount: '$3,200',
                                                dueDate: '2024-07-30',
                                                status: 'overdue'
                                            }
                                        ].map(invoice => (
                                            <tr key={invoice.id} style={{
                                                borderBottom: '1px solid #f3f4f6',
                                                transition: 'background-color 0.3s ease'
                                            }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.backgroundColor = '#f9fafb';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.backgroundColor = 'transparent';
                                                }}
                                            >
                                                <td style={{ padding: '16px', fontWeight: '600', color: '#1f2937' }}>
                                                    {invoice.id}
                                                </td>
                                                <td style={{ padding: '16px', color: '#374151' }}>
                                                    {invoice.client}
                                                </td>
                                                <td style={{ padding: '16px', fontWeight: '600', color: '#059669' }}>
                                                    {invoice.amount}
                                                </td>
                                                <td style={{ padding: '16px', color: '#374151' }}>
                                                    {invoice.dueDate}
                                                </td>
                                                <td style={{ padding: '16px' }}>
                                                    <span style={{
                                                        padding: '4px 12px',
                                                        borderRadius: '20px',
                                                        fontSize: '12px',
                                                        fontWeight: '600',
                                                        background: invoice.status === 'paid' ? '#dcfce7' :
                                                            invoice.status === 'pending' ? '#dbeafe' : '#fee2e2',
                                                        color: invoice.status === 'paid' ? '#166534' :
                                                            invoice.status === 'pending' ? '#1e40af' : '#dc2626'
                                                    }}>
                                                        {invoice.status.toUpperCase()}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '16px', textAlign: 'center' }}>
                                                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                                        <button style={{
                                                            padding: '6px 12px',
                                                            background: '#3b82f6',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '6px',
                                                            cursor: 'pointer',
                                                            fontSize: '12px'
                                                        }}>
                                                            View
                                                        </button>
                                                        <button style={{
                                                            padding: '6px 12px',
                                                            background: '#f3f4f6',
                                                            color: '#374151',
                                                            border: 'none',
                                                            borderRadius: '6px',
                                                            cursor: 'pointer',
                                                            fontSize: '12px'
                                                        }}>
                                                            Edit
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Add other sections as needed */}

                {/* Estimates Management */}
                {activeSection === 'estimates' && (
                    <div>
                        {/* Estimate Header */}
                        <div style={{
                            background: 'white',
                            borderRadius: '18px',
                            padding: '28px',
                            marginBottom: '24px',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                            border: '1px solid rgba(0,0,0,0.05)'
                        }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '24px',
                                flexWrap: 'wrap',
                                gap: '16px'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{
                                        width: '36px',
                                        height: '36px',
                                        background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                                        borderRadius: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                            <path d="M9 11H5a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2h-4l-3-3H9l-3 3" />
                                            <path d="M9 7V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v3" />
                                        </svg>
                                    </div>
                                    <h2 style={{ margin: 0, color: '#1f2937', fontSize: '24px', fontWeight: '700' }}>
                                        Estimates & Quotes
                                    </h2>
                                </div>
                                <button style={{
                                    padding: '12px 24px',
                                    background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    boxShadow: '0 4px 12px rgba(139, 92, 246, 0.4)'
                                }}>
                                    <Plus size={18} />
                                    New Estimate
                                </button>
                            </div>

                            {/* Estimate Stats */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                gap: '16px'
                            }}>
                                <div style={{
                                    padding: '20px',
                                    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                                    borderRadius: '12px',
                                    color: 'white'
                                }}>
                                    <div style={{ fontSize: '28px', fontWeight: '800', marginBottom: '4px' }}>15</div>
                                    <div style={{ fontSize: '14px', opacity: 0.9 }}>Pending Estimates</div>
                                </div>
                                <div style={{
                                    padding: '20px',
                                    background: 'linear-gradient(135deg, #10b981, #059669)',
                                    borderRadius: '12px',
                                    color: 'white'
                                }}>
                                    <div style={{ fontSize: '28px', fontWeight: '800', marginBottom: '4px' }}>68%</div>
                                    <div style={{ fontSize: '14px', opacity: 0.9 }}>Conversion Rate</div>
                                </div>
                                <div style={{
                                    padding: '20px',
                                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                                    borderRadius: '12px',
                                    color: 'white'
                                }}>
                                    <div style={{ fontSize: '28px', fontWeight: '800', marginBottom: '4px' }}>$18,750</div>
                                    <div style={{ fontSize: '14px', opacity: 0.9 }}>Pipeline Value</div>
                                </div>
                            </div>
                        </div>

                        {/* Estimates Grid */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                            gap: '20px'
                        }}>
                            {[
                                {
                                    id: 'EST-001',
                                    client: 'Jennifer Davis',
                                    project: 'Master Bathroom Renovation',
                                    amount: '$7,500',
                                    status: 'pending',
                                    date: '2024-07-20',
                                    validUntil: '2024-08-20'
                                },
                                {
                                    id: 'EST-002',
                                    client: 'Robert Chen',
                                    project: 'Kitchen Cabinet Installation',
                                    amount: '$4,200',
                                    status: 'accepted',
                                    date: '2024-07-18',
                                    validUntil: '2024-08-18'
                                },
                                {
                                    id: 'EST-003',
                                    client: 'Lisa Martinez',
                                    project: 'Outdoor Deck Repair',
                                    amount: '$2,800',
                                    status: 'declined',
                                    date: '2024-07-15',
                                    validUntil: '2024-08-15'
                                }
                            ].map(estimate => (
                                <div key={estimate.id} style={{
                                    background: 'white',
                                    borderRadius: '16px',
                                    padding: '24px',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                                    border: '1px solid rgba(0,0,0,0.05)',
                                    transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                                }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-4px)';
                                        e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.12)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
                                    }}
                                >
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'flex-start',
                                        marginBottom: '16px'
                                    }}>
                                        <div>
                                            <div style={{
                                                fontSize: '14px',
                                                color: '#6b7280',
                                                marginBottom: '4px'
                                            }}>{estimate.id}</div>
                                            <h3 style={{
                                                margin: '0 0 8px 0',
                                                color: '#1f2937',
                                                fontSize: '18px',
                                                fontWeight: '600'
                                            }}>{estimate.project}</h3>
                                            <p style={{
                                                margin: 0,
                                                color: '#6b7280',
                                                fontSize: '14px'
                                            }}>{estimate.client}</p>
                                        </div>
                                        <span style={{
                                            padding: '4px 12px',
                                            borderRadius: '20px',
                                            fontSize: '12px',
                                            fontWeight: '600',
                                            background: estimate.status === 'accepted' ? '#dcfce7' :
                                                estimate.status === 'pending' ? '#fef3c7' : '#fee2e2',
                                            color: estimate.status === 'accepted' ? '#166534' :
                                                estimate.status === 'pending' ? '#92400e' : '#dc2626'
                                        }}>
                                            {estimate.status.toUpperCase()}
                                        </span>
                                    </div>

                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: '16px'
                                    }}>
                                        <div>
                                            <div style={{ fontSize: '12px', color: '#6b7280' }}>Amount</div>
                                            <div style={{ fontSize: '24px', fontWeight: '700', color: '#059669' }}>
                                                {estimate.amount}
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '12px', color: '#6b7280' }}>Valid Until</div>
                                            <div style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                                                {estimate.validUntil}
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button style={{
                                            flex: 1,
                                            padding: '10px 16px',
                                            background: '#8b5cf6',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontSize: '14px',
                                            fontWeight: '600'
                                        }}>
                                            View Details
                                        </button>
                                        <button style={{
                                            padding: '10px 16px',
                                            background: '#f3f4f6',
                                            color: '#374151',
                                            border: 'none',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontSize: '14px',
                                            fontWeight: '600'
                                        }}>
                                            Duplicate
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Time Tracking */}
                {activeSection === 'time' && (
                    <div>
                        {/* Time Tracking Header */}
                        <div style={{
                            background: 'white',
                            borderRadius: '18px',
                            padding: '28px',
                            marginBottom: '24px',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                            border: '1px solid rgba(0,0,0,0.05)'
                        }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '24px',
                                flexWrap: 'wrap',
                                gap: '16px'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{
                                        width: '36px',
                                        height: '36px',
                                        background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                                        borderRadius: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                            <circle cx="12" cy="12" r="10" />
                                            <polyline points="12,6 12,12 16,14" />
                                        </svg>
                                    </div>
                                    <h2 style={{ margin: 0, color: '#1f2937', fontSize: '24px', fontWeight: '700' }}>
                                        Time Tracking
                                    </h2>
                                </div>
                                <button style={{
                                    padding: '12px 24px',
                                    background: 'linear-gradient(135deg, #10b981, #059669)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)'
                                }}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polygon points="5,3 19,12 5,21" />
                                    </svg>
                                    Start Timer
                                </button>
                            </div>

                            {/* Time Stats */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                gap: '16px'
                            }}>
                                <div style={{
                                    padding: '20px',
                                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                                    borderRadius: '12px',
                                    color: 'white'
                                }}>
                                    <div style={{ fontSize: '28px', fontWeight: '800', marginBottom: '4px' }}>32.5</div>
                                    <div style={{ fontSize: '14px', opacity: 0.9 }}>Hours This Week</div>
                                </div>
                                <div style={{
                                    padding: '20px',
                                    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                                    borderRadius: '12px',
                                    color: 'white'
                                }}>
                                    <div style={{ fontSize: '28px', fontWeight: '800', marginBottom: '4px' }}>128</div>
                                    <div style={{ fontSize: '14px', opacity: 0.9 }}>Hours This Month</div>
                                </div>
                                <div style={{
                                    padding: '20px',
                                    background: 'linear-gradient(135deg, #10b981, #059669)',
                                    borderRadius: '12px',
                                    color: 'white'
                                }}>
                                    <div style={{ fontSize: '28px', fontWeight: '800', marginBottom: '4px' }}>$65/hr</div>
                                    <div style={{ fontSize: '14px', opacity: 0.9 }}>Avg Hourly Rate</div>
                                </div>
                            </div>
                        </div>

                        {/* Current Timer */}
                        <div style={{
                            background: 'linear-gradient(135deg, #10b981, #059669)',
                            borderRadius: '18px',
                            padding: '28px',
                            marginBottom: '24px',
                            color: 'white'
                        }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                flexWrap: 'wrap',
                                gap: '16px'
                            }}>
                                <div>
                                    <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', fontWeight: '600' }}>
                                        Kitchen Renovation - Smith Residence
                                    </h3>
                                    <p style={{ margin: 0, opacity: 0.9, fontSize: '14px' }}>
                                        Started at 9:00 AM • Plumbing Installation
                                    </p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '36px', fontWeight: '800', marginBottom: '4px' }}>
                                        02:45:32
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button style={{
                                            padding: '8px 16px',
                                            background: 'rgba(255,255,255,0.2)',
                                            color: 'white',
                                            border: '1px solid rgba(255,255,255,0.3)',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontSize: '14px',
                                            fontWeight: '600'
                                        }}>
                                            Pause
                                        </button>
                                        <button style={{
                                            padding: '8px 16px',
                                            background: '#dc2626',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontSize: '14px',
                                            fontWeight: '600'
                                        }}>
                                            Stop
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Time Entries */}
                        <div style={{
                            background: 'white',
                            borderRadius: '18px',
                            padding: '28px',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                            border: '1px solid rgba(0,0,0,0.05)'
                        }}>
                            <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
                                Recent Time Entries
                            </h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {[
                                    {
                                        project: 'Kitchen Renovation - Smith',
                                        task: 'Electrical Installation',
                                        date: '2024-07-22',
                                        duration: '4h 30m',
                                        rate: '$65/hr',
                                        total: '$292.50'
                                    },
                                    {
                                        project: 'Bathroom Remodel - Johnson',
                                        task: 'Tile Installation',
                                        date: '2024-07-21',
                                        duration: '6h 15m',
                                        rate: '$65/hr',
                                        total: '$406.25'
                                    },
                                    {
                                        project: 'Deck Construction - Williams',
                                        task: 'Framework Assembly',
                                        date: '2024-07-20',
                                        duration: '3h 45m',
                                        rate: '$65/hr',
                                        total: '$243.75'
                                    }
                                ].map((entry, index) => (
                                    <div key={index} style={{
                                        padding: '20px',
                                        border: '1px solid #f3f4f6',
                                        borderRadius: '12px',
                                        background: '#fafafa',
                                        transition: 'all 0.3s ease'
                                    }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = '#f8fafc';
                                            e.currentTarget.style.borderColor = '#e2e8f0';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = '#fafafa';
                                            e.currentTarget.style.borderColor = '#f3f4f6';
                                        }}
                                    >
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'flex-start',
                                            flexWrap: 'wrap',
                                            gap: '12px'
                                        }}>
                                            <div style={{ flex: 1 }}>
                                                <div style={{
                                                    fontWeight: '600',
                                                    color: '#1f2937',
                                                    fontSize: '16px',
                                                    marginBottom: '4px'
                                                }}>{entry.project}</div>
                                                <div style={{
                                                    color: '#6b7280',
                                                    fontSize: '14px',
                                                    marginBottom: '4px'
                                                }}>{entry.task}</div>
                                                <div style={{
                                                    color: '#6b7280',
                                                    fontSize: '12px'
                                                }}>{entry.date}</div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{
                                                    fontSize: '18px',
                                                    fontWeight: '700',
                                                    color: '#059669',
                                                    marginBottom: '4px'
                                                }}>{entry.total}</div>
                                                <div style={{
                                                    fontSize: '14px',
                                                    color: '#6b7280',
                                                    marginBottom: '2px'
                                                }}>{entry.duration}</div>
                                                <div style={{
                                                    fontSize: '12px',
                                                    color: '#6b7280'
                                                }}>{entry.rate}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Expenses Management */}
                {activeSection === 'expenses' && (
                    <div>
                        {/* Expenses Header */}
                        <div style={{
                            background: 'white',
                            borderRadius: '18px',
                            padding: '28px',
                            marginBottom: '24px',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                            border: '1px solid rgba(0,0,0,0.05)'
                        }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '24px',
                                flexWrap: 'wrap',
                                gap: '16px'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{
                                        width: '36px',
                                        height: '36px',
                                        background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                                        borderRadius: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                            <line x1="12" y1="1" x2="12" y2="23" />
                                            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                                        </svg>
                                    </div>
                                    <h2 style={{ margin: 0, color: '#1f2937', fontSize: '24px', fontWeight: '700' }}>
                                        Expense Management
                                    </h2>
                                </div>
                                <button style={{
                                    padding: '12px 24px',
                                    background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    boxShadow: '0 4px 12px rgba(220, 38, 38, 0.4)'
                                }}>
                                    <Plus size={18} />
                                    Add Expense
                                </button>
                            </div>

                            {/* Expense Stats */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                gap: '16px'
                            }}>
                                <div style={{
                                    padding: '20px',
                                    background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                                    borderRadius: '12px',
                                    color: 'white'
                                }}>
                                    <div style={{ fontSize: '28px', fontWeight: '800', marginBottom: '4px' }}>$3,240</div>
                                    <div style={{ fontSize: '14px', opacity: 0.9 }}>This Month</div>
                                </div>
                                <div style={{
                                    padding: '20px',
                                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                                    borderRadius: '12px',
                                    color: 'white'
                                }}>
                                    <div style={{ fontSize: '28px', fontWeight: '800', marginBottom: '4px' }}>$850</div>
                                    <div style={{ fontSize: '14px', opacity: 0.9 }}>Missing Receipts</div>
                                </div>
                                <div style={{
                                    padding: '20px',
                                    background: 'linear-gradient(135deg, #10b981, #059669)',
                                    borderRadius: '12px',
                                    color: 'white'
                                }}>
                                    <div style={{ fontSize: '28px', fontWeight: '800', marginBottom: '4px' }}>85%</div>
                                    <div style={{ fontSize: '14px', opacity: 0.9 }}>Receipt Compliance</div>
                                </div>
                            </div>
                        </div>

                        {/* Expense Categories */}
                        <div style={{
                            background: 'white',
                            borderRadius: '18px',
                            padding: '28px',
                            marginBottom: '24px',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                            border: '1px solid rgba(0,0,0,0.05)'
                        }}>
                            <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
                                Expense Categories This Month
                            </h3>

                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                gap: '16px'
                            }}>
                                {[
                                    { category: 'Materials', amount: '$1,450', percentage: 45, color: '#3b82f6' },
                                    { category: 'Tools', amount: '$680', percentage: 21, color: '#f59e0b' },
                                    { category: 'Transportation', amount: '$420', percentage: 13, color: '#10b981' },
                                    { category: 'Equipment Rental', amount: '$320', percentage: 10, color: '#8b5cf6' },
                                    { category: 'Other', amount: '$370', percentage: 11, color: '#6b7280' }
                                ].map((item, index) => (
                                    <div key={index} style={{
                                        padding: '16px',
                                        border: '1px solid #f3f4f6',
                                        borderRadius: '12px',
                                        background: '#fafafa'
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            marginBottom: '8px'
                                        }}>
                                            <span style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                                                {item.category}
                                            </span>
                                            <span style={{ fontSize: '16px', fontWeight: '700', color: item.color }}>
                                                {item.amount}
                                            </span>
                                        </div>
                                        <div style={{
                                            width: '100%',
                                            height: '6px',
                                            background: '#f3f4f6',
                                            borderRadius: '3px',
                                            overflow: 'hidden'
                                        }}>
                                            <div style={{
                                                width: `${item.percentage}%`,
                                                height: '100%',
                                                background: item.color,
                                                transition: 'width 0.3s ease'
                                            }}></div>
                                        </div>
                                        <div style={{
                                            fontSize: '12px',
                                            color: '#6b7280',
                                            marginTop: '4px'
                                        }}>
                                            {item.percentage}% of total
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Expenses */}
                        <div style={{
                            background: 'white',
                            borderRadius: '18px',
                            padding: '28px',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                            border: '1px solid rgba(0,0,0,0.05)'
                        }}>
                            <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
                                Recent Expenses
                            </h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {expenses.slice(0, 5).map(expense => (
                                    <div key={expense.id} style={{
                                        padding: '20px',
                                        border: '1px solid #f3f4f6',
                                        borderRadius: '12px',
                                        background: '#fafafa',
                                        transition: 'all 0.3s ease'
                                    }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = '#f8fafc';
                                            e.currentTarget.style.borderColor = '#e2e8f0';
                                            e.currentTarget.style.transform = 'translateY(-1px)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = '#fafafa';
                                            e.currentTarget.style.borderColor = '#f3f4f6';
                                            e.currentTarget.style.transform = 'translateY(0)';
                                        }}
                                    >
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'flex-start',
                                            flexWrap: 'wrap',
                                            gap: '12px'
                                        }}>
                                            <div style={{ flex: 1 }}>
                                                <div style={{
                                                    fontWeight: '600',
                                                    color: '#1f2937',
                                                    fontSize: '16px',
                                                    marginBottom: '4px'
                                                }}>{expense.description}</div>
                                                <div style={{
                                                    color: '#6b7280',
                                                    fontSize: '14px',
                                                    marginBottom: '4px'
                                                }}>{expense.category}</div>
                                                <div style={{
                                                    color: '#6b7280',
                                                    fontSize: '12px'
                                                }}>{expense.date}</div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{
                                                    fontSize: '18px',
                                                    fontWeight: '700',
                                                    color: '#dc2626',
                                                    marginBottom: '4px'
                                                }}>${expense.amount}</div>
                                                <div style={{
                                                    fontSize: '12px',
                                                    fontWeight: '600',
                                                    color: expense.receipt ? '#059669' : '#dc2626',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '4px',
                                                    justifyContent: 'flex-end'
                                                }}>
                                                    {expense.receipt ? (
                                                        <>
                                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                <polyline points="20,6 9,17 4,12" />
                                                            </svg>
                                                            Receipt
                                                        </>
                                                    ) : (
                                                        <>
                                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                <line x1="18" y1="6" x2="6" y2="18" />
                                                                <line x1="6" y1="6" x2="18" y2="18" />
                                                            </svg>
                                                            No Receipt
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Clients Management */}
                {activeSection === 'clients' && (
                    <div>
                        {/* Clients Header */}
                        <div style={{
                            background: 'white',
                            borderRadius: '18px',
                            padding: '28px',
                            marginBottom: '24px',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                            border: '1px solid rgba(0,0,0,0.05)'
                        }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '24px',
                                flexWrap: 'wrap',
                                gap: '16px'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{
                                        width: '36px',
                                        height: '36px',
                                        background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                                        borderRadius: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                            <circle cx="9" cy="7" r="4" />
                                            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                        </svg>
                                    </div>
                                    <h2 style={{ margin: 0, color: '#1f2937', fontSize: '24px', fontWeight: '700' }}>
                                        Client Management
                                    </h2>
                                </div>
                                <button style={{
                                    padding: '12px 24px',
                                    background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)'
                                }}>
                                    <Plus size={18} />
                                    Add Client
                                </button>
                            </div>

                            {/* Client Stats */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                gap: '16px'
                            }}>
                                <div style={{
                                    padding: '20px',
                                    background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                                    borderRadius: '12px',
                                    color: 'white'
                                }}>
                                    <div style={{ fontSize: '28px', fontWeight: '800', marginBottom: '4px' }}>156</div>
                                    <div style={{ fontSize: '14px', opacity: 0.9 }}>Total Clients</div>
                                </div>
                                <div style={{
                                    padding: '20px',
                                    background: 'linear-gradient(135deg, #10b981, #059669)',
                                    borderRadius: '12px',
                                    color: 'white'
                                }}>
                                    <div style={{ fontSize: '28px', fontWeight: '800', marginBottom: '4px' }}>24</div>
                                    <div style={{ fontSize: '14px', opacity: 0.9 }}>Active Projects</div>
                                </div>
                                <div style={{
                                    padding: '20px',
                                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                                    borderRadius: '12px',
                                    color: 'white'
                                }}>
                                    <div style={{ fontSize: '28px', fontWeight: '800', marginBottom: '4px' }}>$2,850</div>
                                    <div style={{ fontSize: '14px', opacity: 0.9 }}>Avg Project Value</div>
                                </div>
                            </div>
                        </div>

                        {/* Client Grid */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                            gap: '20px'
                        }}>
                            {clients.map(client => (
                                <div key={client.id} style={{
                                    background: 'white',
                                    borderRadius: '16px',
                                    padding: '24px',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                                    border: '1px solid rgba(0,0,0,0.05)',
                                    transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                                }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-4px)';
                                        e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.12)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
                                    }}
                                >
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '16px',
                                        marginBottom: '16px'
                                    }}>
                                        <div style={{
                                            width: '48px',
                                            height: '48px',
                                            background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            fontSize: '18px',
                                            fontWeight: '600'
                                        }}>
                                            {client.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 style={{
                                                margin: '0 0 4px 0',
                                                color: '#1f2937',
                                                fontSize: '18px',
                                                fontWeight: '600'
                                            }}>{client.name}</h3>
                                            <p style={{
                                                margin: 0,
                                                color: '#6b7280',
                                                fontSize: '14px'
                                            }}>{client.email}</p>
                                        </div>
                                    </div>

                                    <div style={{ marginBottom: '16px' }}>
                                        <div style={{
                                            fontSize: '14px',
                                            color: '#6b7280',
                                            marginBottom: '8px'
                                        }}>Contact Information</div>
                                        <div style={{
                                            fontSize: '14px',
                                            color: '#374151',
                                            marginBottom: '4px'
                                        }}>📞 {client.phone}</div>
                                        <div style={{
                                            fontSize: '14px',
                                            color: '#374151'
                                        }}>📍 {client.address}</div>
                                    </div>

                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: '16px'
                                    }}>
                                        <div>
                                            <div style={{ fontSize: '12px', color: '#6b7280' }}>Projects</div>
                                            <div style={{ fontSize: '20px', fontWeight: '700', color: '#1f2937' }}>
                                                {client.projectCount || 0}
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'center' }}>
                                            <div style={{ fontSize: '12px', color: '#6b7280' }}>Total Value</div>
                                            <div style={{ fontSize: '20px', fontWeight: '700', color: '#059669' }}>
                                                ${client.totalValue || '0'}
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '12px', color: '#6b7280' }}>Last Contact</div>
                                            <div style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                                                {client.lastContact || 'Never'}
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button style={{
                                            flex: 1,
                                            padding: '10px 16px',
                                            background: '#6366f1',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontSize: '14px',
                                            fontWeight: '600'
                                        }}>
                                            View Details
                                        </button>
                                        <button style={{
                                            padding: '10px 16px',
                                            background: '#f3f4f6',
                                            color: '#374151',
                                            border: 'none',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontSize: '14px',
                                            fontWeight: '600'
                                        }}>
                                            Contact
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        );
    };

    // Authentication form when not logged in
    if (!isAdminLoggedIn) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #1e3a5f, #2c5aa0)',
                color: 'white'
            }}>
                <div style={{
                    background: 'white',
                    padding: '40px',
                    borderRadius: '15px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                    maxWidth: '500px',
                    width: '100%',
                    margin: '20px'
                }}>
                    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '60px',
                            height: '60px',
                            backgroundColor: '#1e3a5f',
                            borderRadius: '50%',
                            marginBottom: '15px'
                        }}>
                            🛠️
                        </div>
                        <h2 style={{ color: '#2c3e50', marginBottom: '10px', fontSize: '24px' }}>
                            {showSignup ? 'Join Our Pro Network' : 'Pro Portal Login'}
                        </h2>
                        <p style={{ color: '#7f8c8d', fontSize: '14px' }}>
                            {showSignup
                                ? 'Register as a professional handyman and start getting leads'
                                : 'Access your business management dashboard'
                            }
                        </p>
                    </div>

                    {/* Toggle Buttons */}
                    <div style={{
                        display: 'flex',
                        marginBottom: '30px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        border: '1px solid #e1e5e9'
                    }}>
                        <button
                            type="button"
                            onClick={() => setShowSignup(false)}
                            style={{
                                flex: 1,
                                padding: '12px',
                                background: !showSignup ? '#1e3a5f' : '#f8f9fa',
                                color: !showSignup ? 'white' : '#64748b',
                                border: 'none',
                                cursor: 'pointer',
                                fontWeight: '600',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            Login
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowSignup(true)}
                            style={{
                                flex: 1,
                                padding: '12px',
                                background: showSignup ? '#1e3a5f' : '#f8f9fa',
                                color: showSignup ? 'white' : '#64748b',
                                border: 'none',
                                cursor: 'pointer',
                                fontWeight: '600',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            Sign Up
                        </button>
                    </div>

                    {/* Login Form */}
                    {!showSignup && (
                        <form onSubmit={async (e) => {
                            e.preventDefault();
                            setIsLoggingIn(true);
                            setLoginError('');

                            const username = e.target.username.value;
                            const password = e.target.password.value;

                            try {
                                const response = await fetch(`${API_BASE_URL}/api/pro/auth/login`, {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ username, password })
                                });

                                if (response.ok) {
                                    const data = await response.json();
                                    if (data.success) {
                                        setIsAdminLoggedIn(true);
                                        localStorage.setItem('scottsdaleProAuth', 'true');
                                        localStorage.setItem('scottsdaleProToken', data.token);
                                        localStorage.setItem('scottsdaleProUser', JSON.stringify(data.user));
                                        setIsLoggingIn(false);
                                        return;
                                    }
                                }

                                // If API fails or returns error, fall back to client-side auth
                                throw new Error('API authentication failed');
                            } catch (error) {
                                console.error('Login error:', error);
                                // Fallback to client-side authentication for development
                                if (username === 'admin' && password === 'scottsdaleHandyman2025!') {
                                    setIsAdminLoggedIn(true);
                                    localStorage.setItem('scottsdaleProAuth', 'true');
                                    setIsLoggingIn(false);
                                } else {
                                    setLoginError('Invalid credentials. Please check your username and password.');
                                    setIsLoggingIn(false);
                                }
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
                                disabled={isLoggingIn}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    background: isLoggingIn ? '#ccc' : '#1e3a5f',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    cursor: isLoggingIn ? 'not-allowed' : 'pointer',
                                    transition: 'background 0.3s ease',
                                    opacity: isLoggingIn ? 0.7 : 1
                                }}
                                onMouseOver={(e) => {
                                    if (!isLoggingIn) e.target.style.background = '#2c5aa0';
                                }}
                                onMouseOut={(e) => {
                                    if (!isLoggingIn) e.target.style.background = '#1e3a5f';
                                }}
                            >
                                {isLoggingIn ? 'Logging in...' : 'Login to Pro Portal'}
                            </button>

                            {/* Error Message Display */}
                            {loginError && (
                                <div style={{
                                    marginTop: '16px',
                                    padding: '12px',
                                    background: '#fee',
                                    border: '1px solid #f88',
                                    borderRadius: '8px',
                                    color: '#d33',
                                    fontSize: '14px',
                                    textAlign: 'center'
                                }}>
                                    {loginError}
                                </div>
                            )}
                        </form>
                    )}

                    {/* Signup Form */}
                    {showSignup && (
                        <form onSubmit={async (e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target);
                            const signupData = {
                                username: formData.get('username'),
                                email: formData.get('email'),
                                password: formData.get('password'),
                                confirmPassword: formData.get('confirmPassword'),
                                fullName: formData.get('fullName'),
                                phone: formData.get('phone'),
                                businessName: formData.get('businessName'),
                                licenseNumber: formData.get('licenseNumber'),
                                specialties: formData.get('specialties'),
                                experience: formData.get('experience'),
                                serviceArea: formData.get('serviceArea'),
                                hourlyRate: formData.get('hourlyRate')
                            };

                            // Validate passwords match
                            if (signupData.password !== signupData.confirmPassword) {
                                alert('Passwords do not match');
                                return;
                            }

                            try {
                                const response = await fetch(`${API_BASE_URL}/api/pro/auth/signup`, {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify(signupData)
                                });

                                const data = await response.json();

                                if (data.success) {
                                    alert('Registration successful! Please wait for admin approval. You will receive an email confirmation.');
                                    setShowSignup(false); // Switch back to login form
                                } else {
                                    alert(data.message || 'Registration failed');
                                }
                            } catch (error) {
                                console.error('Signup error:', error);
                                alert('Registration failed. Please try again.');
                            }
                        }}>
                            {/* Row 1: Basic Info */}
                            <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                                <input
                                    name="fullName"
                                    type="text"
                                    placeholder="Full Name *"
                                    style={{
                                        flex: 1,
                                        padding: '12px',
                                        borderRadius: '8px',
                                        border: '1px solid #ddd',
                                        background: '#f8f9fa',
                                        color: '#2c3e50',
                                        fontSize: '14px',
                                        outline: 'none',
                                        boxSizing: 'border-box'
                                    }}
                                    required
                                />
                                <input
                                    name="phone"
                                    type="tel"
                                    placeholder="Phone Number *"
                                    style={{
                                        flex: 1,
                                        padding: '12px',
                                        borderRadius: '8px',
                                        border: '1px solid #ddd',
                                        background: '#f8f9fa',
                                        color: '#2c3e50',
                                        fontSize: '14px',
                                        outline: 'none',
                                        boxSizing: 'border-box'
                                    }}
                                    required
                                />
                            </div>

                            {/* Row 2: Credentials */}
                            <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                                <input
                                    name="username"
                                    type="text"
                                    placeholder="Username *"
                                    style={{
                                        flex: 1,
                                        padding: '12px',
                                        borderRadius: '8px',
                                        border: '1px solid #ddd',
                                        background: '#f8f9fa',
                                        color: '#2c3e50',
                                        fontSize: '14px',
                                        outline: 'none',
                                        boxSizing: 'border-box'
                                    }}
                                    required
                                />
                                <input
                                    name="email"
                                    type="email"
                                    placeholder="Email Address *"
                                    style={{
                                        flex: 1,
                                        padding: '12px',
                                        borderRadius: '8px',
                                        border: '1px solid #ddd',
                                        background: '#f8f9fa',
                                        color: '#2c3e50',
                                        fontSize: '14px',
                                        outline: 'none',
                                        boxSizing: 'border-box'
                                    }}
                                    required
                                />
                            </div>

                            {/* Row 3: Business Info */}
                            <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                                <input
                                    name="businessName"
                                    type="text"
                                    placeholder="Business Name"
                                    style={{
                                        flex: 1,
                                        padding: '12px',
                                        borderRadius: '8px',
                                        border: '1px solid #ddd',
                                        background: '#f8f9fa',
                                        color: '#2c3e50',
                                        fontSize: '14px',
                                        outline: 'none',
                                        boxSizing: 'border-box'
                                    }}
                                />
                                <input
                                    name="licenseNumber"
                                    type="text"
                                    placeholder="License Number"
                                    style={{
                                        flex: 1,
                                        padding: '12px',
                                        borderRadius: '8px',
                                        border: '1px solid #ddd',
                                        background: '#f8f9fa',
                                        color: '#2c3e50',
                                        fontSize: '14px',
                                        outline: 'none',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>

                            {/* Row 4: Service Details */}
                            <div style={{ marginBottom: '20px' }}>
                                <select
                                    name="specialties"
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        borderRadius: '8px',
                                        border: '1px solid #ddd',
                                        background: '#f8f9fa',
                                        color: '#2c3e50',
                                        fontSize: '14px',
                                        outline: 'none',
                                        boxSizing: 'border-box'
                                    }}
                                    required
                                >
                                    <option value="">Select Your Primary Specialty *</option>
                                    <option value="general">General Handyman</option>
                                    <option value="plumbing">Plumbing</option>
                                    <option value="electrical">Electrical</option>
                                    <option value="carpentry">Carpentry</option>
                                    <option value="painting">Painting</option>
                                    <option value="hvac">HVAC</option>
                                    <option value="flooring">Flooring</option>
                                    <option value="roofing">Roofing</option>
                                    <option value="landscaping">Landscaping</option>
                                    <option value="smart-home">Smart Home Installation</option>
                                </select>
                            </div>

                            {/* Row 5: Experience and Area */}
                            <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                                <select
                                    name="experience"
                                    style={{
                                        flex: 1,
                                        padding: '12px',
                                        borderRadius: '8px',
                                        border: '1px solid #ddd',
                                        background: '#f8f9fa',
                                        color: '#2c3e50',
                                        fontSize: '14px',
                                        outline: 'none',
                                        boxSizing: 'border-box'
                                    }}
                                    required
                                >
                                    <option value="">Years of Experience *</option>
                                    <option value="1-3">1-3 years</option>
                                    <option value="4-7">4-7 years</option>
                                    <option value="8-15">8-15 years</option>
                                    <option value="15+">15+ years</option>
                                </select>
                                <input
                                    name="hourlyRate"
                                    type="number"
                                    placeholder="Hourly Rate ($)"
                                    min="25"
                                    max="200"
                                    style={{
                                        flex: 1,
                                        padding: '12px',
                                        borderRadius: '8px',
                                        border: '1px solid #ddd',
                                        background: '#f8f9fa',
                                        color: '#2c3e50',
                                        fontSize: '14px',
                                        outline: 'none',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>

                            {/* Service Area */}
                            <div style={{ marginBottom: '20px' }}>
                                <input
                                    name="serviceArea"
                                    type="text"
                                    placeholder="Service Area (e.g., Scottsdale, Phoenix, Tempe) *"
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        borderRadius: '8px',
                                        border: '1px solid #ddd',
                                        background: '#f8f9fa',
                                        color: '#2c3e50',
                                        fontSize: '14px',
                                        outline: 'none',
                                        boxSizing: 'border-box'
                                    }}
                                    required
                                />
                            </div>

                            {/* Password Fields */}
                            <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
                                <div style={{ flex: 1, position: 'relative' }}>
                                    <input
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Password *"
                                        style={{
                                            width: '100%',
                                            padding: '12px 45px 12px 12px',
                                            borderRadius: '8px',
                                            border: '1px solid #ddd',
                                            background: '#f8f9fa',
                                            color: '#2c3e50',
                                            fontSize: '14px',
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
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                <input
                                    name="confirmPassword"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Confirm Password *"
                                    style={{
                                        flex: 1,
                                        padding: '12px',
                                        borderRadius: '8px',
                                        border: '1px solid #ddd',
                                        background: '#f8f9fa',
                                        color: '#2c3e50',
                                        fontSize: '14px',
                                        outline: 'none',
                                        boxSizing: 'border-box'
                                    }}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    background: '#10b981',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'background 0.3s ease'
                                }}
                                onMouseOver={(e) => e.target.style.background = '#059669'}
                                onMouseOut={(e) => e.target.style.background = '#10b981'}
                            >
                                Register as Pro Handyman
                            </button>

                            <p style={{
                                color: '#7f8c8d',
                                fontSize: '12px',
                                marginTop: '15px',
                                textAlign: 'center',
                                lineHeight: '1.4'
                            }}>
                                By registering, you agree to our terms of service. Your application will be reviewed and you'll receive approval notification within 24-48 hours.
                            </p>
                        </form>
                    )}

                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                        <a
                            href="#"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => {
                                e.preventDefault();
                                
                                // Multiple fallback strategies
                                let websiteUrl;
                                
                                // Strategy 1: Environment variable
                                if (import.meta.env.VITE_WEBSITE_URL) {
                                    websiteUrl = import.meta.env.VITE_WEBSITE_URL;
                                }
                                // Strategy 2: Check if we're in development
                                else if (window.location.hostname === 'localhost') {
                                    websiteUrl = 'http://localhost:5173';
                                }
                                // Strategy 3: Production fallback
                                else {
                                    websiteUrl = 'https://scottsdale-handyman-website.onrender.com';
                                }
                                
                                console.log('Back to Website clicked, URL:', websiteUrl);
                                console.log('Current location:', window.location.href);
                                console.log('Environment vars:', import.meta.env);
                                
                                try {
                                    window.open(websiteUrl, '_blank');
                                } catch (error) {
                                    console.error('Error opening window:', error);
                                    // Fallback: try direct navigation
                                    window.location.href = websiteUrl;
                                }
                            }}
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
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    // Main Pro Dashboard
    return <ProDashboard onLogout={handleLogout} />;
};

export default ProPortalApp;
