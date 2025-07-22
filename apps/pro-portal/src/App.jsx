import { useState, useEffect } from 'react';
import {
    Eye, EyeOff, Plus, Edit3, Trash2, Save, Upload, X, Image,
    FileText, Share2, Filter, Search, Database, Edit2, Download,
    RotateCcw, MessageCircle, TrendingUp, Bot, Target, Send
} from 'lucide-react';

const ProPortalApp = () => {
    // Authentication state
    const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showSignup, setShowSignup] = useState(false);

    // API configuration
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

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

        // Filter and search leads
        const filteredLeads = leads.filter(lead => {
            const matchesFilter = leadFilter === 'all' || lead.status === leadFilter
            const matchesSearch = leadSearch === '' ||
                lead.name.toLowerCase().includes(leadSearch.toLowerCase()) ||
                lead.service.toLowerCase().includes(leadSearch.toLowerCase()) ||
                lead.phone.includes(leadSearch)
            return matchesFilter && matchesSearch
        })

        // Load data on component mount
        useEffect(() => {
            fetchLeads()
        }, [])

        // Sample data - in production this would come from the backend
        useState(() => {
            setLeads([
                { id: 1, name: 'John Smith', phone: '480-555-0123', service: 'Kitchen Repair', status: 'new', date: '2025-01-15', value: 850 },
                { id: 2, name: 'Sarah Johnson', phone: '480-555-0156', service: 'Bathroom Remodel', status: 'contacted', date: '2025-01-14', value: 2400 },
                { id: 3, name: 'Mike Wilson', phone: '480-555-0189', service: 'Deck Installation', status: 'scheduled', date: '2025-01-13', value: 3200 }
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
                    borderRadius: '12px',
                    padding: window.innerWidth <= 768 ? '15px' : '25px',
                    marginBottom: window.innerWidth <= 768 ? '15px' : '25px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    color: 'white'
                }}>
                    <div style={{ 
                        display: 'flex', 
                        flexDirection: window.innerWidth <= 768 ? 'column' : 'row',
                        justifyContent: 'space-between', 
                        alignItems: window.innerWidth <= 768 ? 'flex-start' : 'center',
                        gap: window.innerWidth <= 768 ? '15px' : '0'
                    }}>
                        <div>
                            <h1 style={{ 
                                margin: 0, 
                                fontSize: window.innerWidth <= 768 ? '24px' : '28px', 
                                fontWeight: '700', 
                                color: 'white' 
                            }}>
                                🛠️ Pro Dashboard
                            </h1>
                            <p style={{ 
                                margin: '8px 0 0 0', 
                                fontSize: window.innerWidth <= 768 ? '14px' : '16px', 
                                opacity: 0.9, 
                                color: 'rgba(255,255,255,0.95)' 
                            }}>
                                Welcome back! Manage your business operations.
                            </p>
                        </div>
                        <div style={{ 
                            display: 'flex', 
                            flexDirection: window.innerWidth <= 768 ? 'column' : 'row',
                            gap: window.innerWidth <= 768 ? '8px' : '12px', 
                            alignItems: window.innerWidth <= 768 ? 'stretch' : 'center',
                            width: window.innerWidth <= 768 ? '100%' : 'auto'
                        }}>
                            <div style={{ 
                                textAlign: window.innerWidth <= 768 ? 'center' : 'right', 
                                marginRight: window.innerWidth <= 768 ? '0' : '15px',
                                marginBottom: window.innerWidth <= 768 ? '8px' : '0'
                            }}>
                                <div style={{ 
                                    fontSize: window.innerWidth <= 768 ? '12px' : '14px', 
                                    opacity: 0.8, 
                                    color: 'rgba(255,255,255,0.8)' 
                                }}>Today's Revenue</div>
                                <div style={{ 
                                    fontSize: window.innerWidth <= 768 ? '20px' : '24px', 
                                    fontWeight: '700', 
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
                                    onClick={() => window.location.href = '/'}
                                    style={{
                                        padding: window.innerWidth <= 768 ? '12px 16px' : '10px 20px',
                                        background: 'rgba(255,255,255,0.2)',
                                        border: '1px solid rgba(255,255,255,0.3)',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        color: 'white',
                                        backdropFilter: 'blur(10px)',
                                        fontSize: window.innerWidth <= 768 ? '14px' : '16px',
                                        fontWeight: '500'
                                    }}
                                >
                                    🏠 View Site
                                </button>
                                <button
                                    onClick={onLogout}
                                    style={{
                                        padding: window.innerWidth <= 768 ? '12px 16px' : '10px 20px',
                                        background: '#ef4444',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontSize: window.innerWidth <= 768 ? '14px' : '16px',
                                        fontWeight: '500'
                                    }}
                                >
                                    🚪 Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '0',
                    marginBottom: window.innerWidth <= 768 ? '15px' : '25px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    overflow: 'hidden'
                }}>
                    <div style={{ 
                        display: 'flex', 
                        overflowX: 'auto',
                        scrollbarWidth: 'none', /* Firefox */
                        msOverflowStyle: 'none', /* IE/Edge */
                        WebkitScrollbar: { display: 'none' } /* Chrome/Safari */
                    }}>
                        {[
                            { id: 'dashboard', label: window.innerWidth <= 768 ? '📊' : '📊 Dashboard', icon: '📊' },
                            { id: 'leads', label: window.innerWidth <= 768 ? '👥' : '👥 Leads', icon: '👥' },
                            { id: 'projects', label: window.innerWidth <= 768 ? '🏗️' : '🏗️ Projects', icon: '🏗️' },
                            { id: 'invoices', label: window.innerWidth <= 768 ? '💰' : '💰 Invoices', icon: '💰' },
                            { id: 'estimates', label: window.innerWidth <= 768 ? '📋' : '📋 Estimates', icon: '📋' },
                            { id: 'time', label: window.innerWidth <= 768 ? '⏰' : '⏰ Time Tracking', icon: '⏰' },
                            { id: 'expenses', label: window.innerWidth <= 768 ? '💸' : '💸 Expenses', icon: '💸' },
                            { id: 'clients', label: window.innerWidth <= 768 ? '👤' : '👤 Clients', icon: '👤' }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveSection(tab.id)}
                                style={{
                                    padding: window.innerWidth <= 768 ? '12px 8px' : '15px 25px',
                                    border: 'none',
                                    background: activeSection === tab.id ? '#1e3a5f' : 'transparent',
                                    color: activeSection === tab.id ? 'white' : '#374151',
                                    cursor: 'pointer',
                                    fontSize: window.innerWidth <= 768 ? '16px' : '14px',
                                    fontWeight: '500',
                                    whiteSpace: 'nowrap',
                                    transition: 'all 0.3s ease',
                                    minWidth: window.innerWidth <= 768 ? '44px' : 'auto',
                                    textAlign: 'center',
                                    flex: window.innerWidth <= 768 ? '0 0 auto' : 'none'
                                }}
                            >
                                {tab.label}
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
                            gridTemplateColumns: window.innerWidth <= 768 ? '1fr' : 'repeat(auto-fit, minmax(250px, 1fr))',
                            gap: window.innerWidth <= 768 ? '12px' : '20px',
                            marginBottom: window.innerWidth <= 768 ? '15px' : '25px'
                        }}>
                            <div style={{
                                background: 'linear-gradient(135deg, #10b981, #059669)',
                                color: 'white',
                                padding: window.innerWidth <= 768 ? '20px' : '25px',
                                borderRadius: '12px',
                                boxShadow: '0 4px 12px rgba(16,185,129,0.3)'
                            }}>
                                <div style={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems: 'center',
                                    flexDirection: window.innerWidth <= 480 ? 'column' : 'row',
                                    gap: window.innerWidth <= 480 ? '8px' : '0'
                                }}>
                                    <div style={{ textAlign: window.innerWidth <= 480 ? 'center' : 'left' }}>
                                        <div style={{ 
                                            fontSize: window.innerWidth <= 768 ? '12px' : '14px', 
                                            opacity: 0.9 
                                        }}>Active Leads</div>
                                        <div style={{ 
                                            fontSize: window.innerWidth <= 768 ? '28px' : '32px', 
                                            fontWeight: '700' 
                                        }}>{leads.length}</div>
                                    </div>
                                    <div style={{ 
                                        fontSize: window.innerWidth <= 768 ? '28px' : '32px' 
                                    }}>👥</div>
                                </div>
                            </div>

                            <div style={{
                                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                                color: 'white',
                                padding: window.innerWidth <= 768 ? '20px' : '25px',
                                borderRadius: '12px',
                                boxShadow: '0 4px 12px rgba(59,130,246,0.3)'
                            }}>
                                <div style={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems: 'center',
                                    flexDirection: window.innerWidth <= 480 ? 'column' : 'row',
                                    gap: window.innerWidth <= 480 ? '8px' : '0'
                                }}>
                                    <div style={{ textAlign: window.innerWidth <= 480 ? 'center' : 'left' }}>
                                        <div style={{ 
                                            fontSize: window.innerWidth <= 768 ? '12px' : '14px', 
                                            opacity: 0.9 
                                        }}>Pending Invoices</div>
                                        <div style={{ 
                                            fontSize: window.innerWidth <= 768 ? '28px' : '32px', 
                                            fontWeight: '700' 
                                        }}>{invoices.filter(inv => inv.status === 'pending').length}</div>
                                    </div>
                                    <div style={{ 
                                        fontSize: window.innerWidth <= 768 ? '28px' : '32px' 
                                    }}>💰</div>
                                </div>
                            </div>

                            <div style={{
                                background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                                color: 'white',
                                padding: window.innerWidth <= 768 ? '20px' : '25px',
                                borderRadius: '12px',
                                boxShadow: '0 4px 12px rgba(139,92,246,0.3)'
                            }}>
                                <div style={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems: 'center',
                                    flexDirection: window.innerWidth <= 480 ? 'column' : 'row',
                                    gap: window.innerWidth <= 480 ? '8px' : '0'
                                }}>
                                    <div style={{ textAlign: window.innerWidth <= 480 ? 'center' : 'left' }}>
                                        <div style={{ 
                                            fontSize: window.innerWidth <= 768 ? '12px' : '14px', 
                                            opacity: 0.9 
                                        }}>This Month Revenue</div>
                                        <div style={{ 
                                            fontSize: window.innerWidth <= 768 ? '28px' : '32px', 
                                            fontWeight: '700' 
                                        }}>$8,450</div>
                                    </div>
                                    <div style={{ 
                                        fontSize: window.innerWidth <= 768 ? '28px' : '32px' 
                                    }}>📈</div>
                                </div>
                            </div>

                            <div style={{
                                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                                color: 'white',
                                padding: window.innerWidth <= 768 ? '20px' : '25px',
                                borderRadius: '12px',
                                boxShadow: '0 4px 12px rgba(245,158,11,0.3)'
                            }}>
                                <div style={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems: 'center',
                                    flexDirection: window.innerWidth <= 480 ? 'column' : 'row',
                                    gap: window.innerWidth <= 480 ? '8px' : '0'
                                }}>
                                    <div style={{ textAlign: window.innerWidth <= 480 ? 'center' : 'left' }}>
                                        <div style={{ 
                                            fontSize: window.innerWidth <= 768 ? '12px' : '14px', 
                                            opacity: 0.9 
                                        }}>Hours This Week</div>
                                        <div style={{ 
                                            fontSize: window.innerWidth <= 768 ? '28px' : '32px', 
                                            fontWeight: '700' 
                                        }}>32.5</div>
                                    </div>
                                    <div style={{ 
                                        fontSize: window.innerWidth <= 768 ? '28px' : '32px' 
                                    }}>⏰</div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '25px'
                        }}>
                            <div style={{
                                background: 'white',
                                borderRadius: '12px',
                                padding: '25px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                            }}>
                                <h3 style={{ margin: '0 0 20px 0', color: '#1f2937', fontSize: '20px' }}>Recent Leads</h3>
                                {leads.slice(0, 3).map(lead => (
                                    <div key={lead.id} style={{
                                        padding: '15px',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '8px',
                                        marginBottom: '10px'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <div>
                                                <strong>{lead.name}</strong>
                                                <div style={{ color: '#6b7280', fontSize: '14px' }}>{lead.service}</div>
                                            </div>
                                            <span style={{
                                                padding: '4px 8px',
                                                borderRadius: '12px',
                                                fontSize: '12px',
                                                background: lead.status === 'new' ? '#fef3c7' : lead.status === 'contacted' ? '#ddd6fe' : '#d1fae5',
                                                color: lead.status === 'new' ? '#92400e' : lead.status === 'contacted' ? '#5b21b6' : '#065f46'
                                            }}>
                                                {lead.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div style={{
                                background: 'white',
                                borderRadius: '12px',
                                padding: '25px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                            }}>
                                <h3 style={{ margin: '0 0 20px 0', color: '#1f2937', fontSize: '20px' }}>Recent Expenses</h3>
                                {expenses.slice(0, 3).map(expense => (
                                    <div key={expense.id} style={{
                                        padding: '15px',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '8px',
                                        marginBottom: '10px'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <div>
                                                <strong>{expense.description}</strong>
                                                <div style={{ color: '#6b7280', fontSize: '14px' }}>{expense.category}</div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <strong>${expense.amount}</strong>
                                                <div style={{ fontSize: '12px', color: expense.receipt ? '#059669' : '#dc2626' }}>
                                                    {expense.receipt ? '✅ Receipt' : '❌ No Receipt'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
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
                                            background: '#fafafa'
                                        }}>
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
                                                <div style={{ fontSize: '14px', color: '#1f2937', marginBottom: '4px' }}>🔧 {lead.serviceType}</div>
                                                <div style={{ fontSize: '12px', color: '#6b7280' }}>{lead.description}</div>
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
                                                    onClick={() => {
                                                        setEditingLead(lead)
                                                        setLeadForm({
                                                            name: lead.name,
                                                            email: lead.email,
                                                            phone: lead.phone,
                                                            address: lead.address,
                                                            serviceType: lead.serviceType,
                                                            description: lead.description,
                                                            estimatedValue: lead.estimatedValue,
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
                                                    onClick={() => deleteLead(lead.id)}
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
                                                }}>
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
                                                                onClick={() => {
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
                                                                onClick={() => updateLeadStatus(lead.id, 'won')}
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
                                                                onClick={() => deleteLead(lead.id)}
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

                {/* Other sections would go here... */}
                {activeSection === 'invoices' && (
                    <div style={{
                        background: 'white',
                        borderRadius: '12px',
                        padding: '25px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}>
                        <h2>Invoice Management - Coming Soon</h2>
                        <p>Invoice management features will be implemented here.</p>
                    </div>
                )}

                {/* Add other sections as needed */}

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
                            const username = e.target.username.value;
                            const password = e.target.password.value;

                            try {
                                const response = await fetch(`${API_BASE_URL}/api/pro/auth/login`, {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ username, password })
                                });

                                const data = await response.json();

                                if (data.success) {
                                    setIsAdminLoggedIn(true);
                                    localStorage.setItem('scottsdaleProAuth', 'true');
                                    localStorage.setItem('scottsdaleProToken', data.token);
                                    localStorage.setItem('scottsdaleProUser', JSON.stringify(data.user));
                                } else {
                                    alert('Invalid credentials');
                                }
                            } catch (error) {
                                console.error('Login error:', error);
                                // Fallback to client-side authentication for development
                                if (username === 'admin' && password === 'scottsdaleHandyman2025!') {
                                    setIsAdminLoggedIn(true);
                                    localStorage.setItem('scottsdaleProAuth', 'true');
                                } else {
                                    alert('Invalid credentials');
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
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    background: '#1e3a5f',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'background 0.3s ease'
                                }}
                                onMouseOver={(e) => e.target.style.background = '#2c5aa0'}
                                onMouseOut={(e) => e.target.style.background = '#1e3a5f'}
                            >
                                Login to Pro Portal
                            </button>
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
                            href="/"
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
