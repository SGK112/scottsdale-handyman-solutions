import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Navigation, CheckCircle, AlertCircle } from 'lucide-react';

const GoogleIntegration = ({ lead, onScheduleComplete }) => {
    const [isValidatingAddress, setIsValidatingAddress] = useState(false);
    const [addressValidation, setAddressValidation] = useState(null);
    const [directions, setDirections] = useState(null);
    const [isCreatingEvent, setIsCreatingEvent] = useState(false);
    const [scheduleForm, setScheduleForm] = useState({
        title: '',
        date: '',
        startTime: '',
        endTime: '',
        description: '',
        location: lead?.address || '',
        attendees: []
    });

    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

    // Auto-populate form when lead changes
    useEffect(() => {
        if (lead) {
            setScheduleForm(prev => ({
                ...prev,
                title: `${lead.service} - ${lead.name}`,
                description: `Service: ${lead.service}\n\nCustomer: ${lead.name}\nPhone: ${lead.phone}\nEmail: ${lead.email}\n\nDescription: ${lead.description}`,
                location: lead.address || '',
                attendees: lead.email ? [lead.email] : []
            }));
            
            // Validate address if provided
            if (lead.address) {
                validateAddress(lead.address);
            }
        }
    }, [lead]);

    const validateAddress = async (address) => {
        if (!address) return;
        
        setIsValidatingAddress(true);
        try {
            const response = await fetch(`${API_BASE}/api/google/validate-address`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ address })
            });

            const data = await response.json();
            setAddressValidation(data);
            
            if (data.success && data.is_valid) {
                // Get directions from business location to customer
                getDirections('7014 E Camelback Rd, Scottsdale, AZ 85251', data.formatted_address);
            }
        } catch (error) {
            console.error('Address validation error:', error);
            setAddressValidation({ success: false, error: 'Validation failed' });
        } finally {
            setIsValidatingAddress(false);
        }
    };

    const getDirections = async (origin, destination) => {
        try {
            const response = await fetch(`${API_BASE}/api/google/maps/directions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ origin, destination })
            });

            const data = await response.json();
            if (data.success) {
                setDirections(data);
            }
        } catch (error) {
            console.error('Directions error:', error);
        }
    };

    const createGoogleCalendarEvent = async () => {
        if (!scheduleForm.title || !scheduleForm.date || !scheduleForm.startTime || !scheduleForm.endTime) {
            alert('Please fill in all required fields');
            return;
        }

        setIsCreatingEvent(true);
        try {
            const response = await fetch(`${API_BASE}/api/google/calendar/events`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: scheduleForm.title,
                    description: scheduleForm.description,
                    location: addressValidation?.formatted_address || scheduleForm.location,
                    date: scheduleForm.date,
                    startTime: scheduleForm.startTime,
                    endTime: scheduleForm.endTime,
                    attendees: scheduleForm.attendees,
                    isAllDay: false
                })
            });

            const data = await response.json();
            
            if (data.success) {
                alert('Event successfully created in Google Calendar!');
                if (onScheduleComplete) {
                    onScheduleComplete({
                        ...scheduleForm,
                        googleEventId: data.eventId,
                        htmlLink: data.htmlLink
                    });
                }
            } else {
                alert(`Failed to create calendar event: ${data.error}`);
            }
        } catch (error) {
            console.error('Calendar event creation error:', error);
            alert('Error creating calendar event');
        } finally {
            setIsCreatingEvent(false);
        }
    };

    const openGoogleMaps = () => {
        if (addressValidation?.coordinates) {
            const { lat, lng } = addressValidation.coordinates;
            const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
            window.open(mapsUrl, '_blank');
        }
    };

    return (
        <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '28px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            border: '1px solid rgba(0,0,0,0.08)'
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '24px'
            }}>
                <div style={{
                    width: '40px',
                    height: '40px',
                    background: 'linear-gradient(135deg, #4285f4, #34a853)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Calendar size={20} color="white" />
                </div>
                <h3 style={{
                    margin: 0,
                    fontSize: '22px',
                    fontWeight: '700',
                    color: '#1f2937'
                }}>
                    Google Calendar Integration
                </h3>
            </div>

            {/* Address Validation */}
            {scheduleForm.location && (
                <div style={{
                    background: '#f8fafc',
                    padding: '20px',
                    borderRadius: '12px',
                    marginBottom: '24px',
                    border: '1px solid #e2e8f0'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '12px'
                    }}>
                        <MapPin size={18} color="#059669" />
                        <span style={{ fontWeight: '600', color: '#1f2937' }}>Address Validation</span>
                        {isValidatingAddress && (
                            <div style={{
                                width: '16px',
                                height: '16px',
                                border: '2px solid #e5e7eb',
                                borderTop: '2px solid #3b82f6',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite'
                            }}></div>
                        )}
                    </div>

                    {addressValidation && (
                        <div style={{ marginBottom: '16px' }}>
                            {addressValidation.success && addressValidation.is_valid ? (
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                                    <CheckCircle size={16} color="#059669" style={{ marginTop: '2px' }} />
                                    <div>
                                        <div style={{ color: '#059669', fontWeight: '500', marginBottom: '4px' }}>
                                            ✓ Valid Address
                                        </div>
                                        <div style={{ color: '#6b7280', fontSize: '14px' }}>
                                            {addressValidation.formatted_address}
                                        </div>
                                        {addressValidation.is_scottsdale && (
                                            <div style={{
                                                display: 'inline-block',
                                                background: '#10b981',
                                                color: 'white',
                                                padding: '2px 8px',
                                                borderRadius: '6px',
                                                fontSize: '12px',
                                                fontWeight: '500',
                                                marginTop: '8px'
                                            }}>
                                                Scottsdale Service Area ✓
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                                    <AlertCircle size={16} color="#ef4444" style={{ marginTop: '2px' }} />
                                    <div style={{ color: '#ef4444', fontWeight: '500' }}>
                                        Address validation failed
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Directions Info */}
                    {directions && (
                        <div style={{
                            background: 'white',
                            padding: '16px',
                            borderRadius: '8px',
                            border: '1px solid #d1d5db'
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                marginBottom: '12px'
                            }}>
                                <Navigation size={16} color="#3b82f6" />
                                <span style={{ fontWeight: '600', color: '#1f2937' }}>Travel Information</span>
                            </div>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '16px',
                                marginBottom: '12px'
                            }}>
                                <div>
                                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Distance</div>
                                    <div style={{ fontWeight: '600', color: '#1f2937' }}>{directions.distance}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Duration</div>
                                    <div style={{ fontWeight: '600', color: '#1f2937' }}>{directions.duration}</div>
                                </div>
                            </div>
                            <button
                                onClick={openGoogleMaps}
                                style={{
                                    padding: '8px 16px',
                                    background: '#3b82f6',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                }}
                            >
                                <Navigation size={14} />
                                Open in Google Maps
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Schedule Form */}
            <div style={{ display: 'grid', gap: '20px' }}>
                <div>
                    <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: '600',
                        color: '#374151'
                    }}>
                        Event Title *
                    </label>
                    <input
                        type="text"
                        value={scheduleForm.title}
                        onChange={(e) => setScheduleForm(prev => ({ ...prev, title: e.target.value }))}
                        style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid #d1d5db',
                            fontSize: '16px',
                            outline: 'none',
                            boxSizing: 'border-box'
                        }}
                        placeholder="Service appointment title"
                    />
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    gap: '16px'
                }}>
                    <div>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '600',
                            color: '#374151'
                        }}>
                            Date *
                        </label>
                        <input
                            type="date"
                            value={scheduleForm.date}
                            onChange={(e) => setScheduleForm(prev => ({ ...prev, date: e.target.value }))}
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid #d1d5db',
                                fontSize: '16px',
                                outline: 'none',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>

                    <div>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '600',
                            color: '#374151'
                        }}>
                            Start Time *
                        </label>
                        <input
                            type="time"
                            value={scheduleForm.startTime}
                            onChange={(e) => setScheduleForm(prev => ({ ...prev, startTime: e.target.value }))}
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid #d1d5db',
                                fontSize: '16px',
                                outline: 'none',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>

                    <div>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '600',
                            color: '#374151'
                        }}>
                            End Time *
                        </label>
                        <input
                            type="time"
                            value={scheduleForm.endTime}
                            onChange={(e) => setScheduleForm(prev => ({ ...prev, endTime: e.target.value }))}
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid #d1d5db',
                                fontSize: '16px',
                                outline: 'none',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>
                </div>

                <div>
                    <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: '600',
                        color: '#374151'
                    }}>
                        Location
                    </label>
                    <input
                        type="text"
                        value={scheduleForm.location}
                        onChange={(e) => {
                            const newLocation = e.target.value;
                            setScheduleForm(prev => ({ ...prev, location: newLocation }));
                            if (newLocation.length > 5) {
                                validateAddress(newLocation);
                            }
                        }}
                        style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid #d1d5db',
                            fontSize: '16px',
                            outline: 'none',
                            boxSizing: 'border-box'
                        }}
                        placeholder="Customer address"
                    />
                </div>

                <div>
                    <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: '600',
                        color: '#374151'
                    }}>
                        Description
                    </label>
                    <textarea
                        value={scheduleForm.description}
                        onChange={(e) => setScheduleForm(prev => ({ ...prev, description: e.target.value }))}
                        rows="4"
                        style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid #d1d5db',
                            fontSize: '16px',
                            outline: 'none',
                            boxSizing: 'border-box',
                            resize: 'vertical'
                        }}
                        placeholder="Service details and notes"
                    />
                </div>

                <button
                    onClick={createGoogleCalendarEvent}
                    disabled={isCreatingEvent}
                    style={{
                        padding: '16px 24px',
                        background: isCreatingEvent 
                            ? '#9ca3af' 
                            : 'linear-gradient(135deg, #4285f4, #34a853)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        cursor: isCreatingEvent ? 'not-allowed' : 'pointer',
                        fontSize: '16px',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        transition: 'all 0.3s ease'
                    }}
                >
                    {isCreatingEvent ? (
                        <>
                            <div style={{
                                width: '16px',
                                height: '16px',
                                border: '2px solid rgba(255,255,255,0.3)',
                                borderTop: '2px solid white',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite'
                            }}></div>
                            Creating Event...
                        </>
                    ) : (
                        <>
                            <Calendar size={18} />
                            Create Google Calendar Event
                        </>
                    )}
                </button>
            </div>

            <style jsx>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default GoogleIntegration;
