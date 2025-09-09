import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Clock, Phone } from 'lucide-react';

const GoogleMapsIntegration = () => {
    const [customerAddress, setCustomerAddress] = useState('');
    const [validationResult, setValidationResult] = useState(null);
    const [directions, setDirections] = useState(null);
    const [isValidating, setIsValidating] = useState(false);
    const [isInServiceArea, setIsInServiceArea] = useState(null);

    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const BUSINESS_ADDRESS = '7014 E Camelback Rd, Scottsdale, AZ 85251';

    const validateServiceArea = async (address) => {
        if (!address || address.length < 5) return;

        setIsValidating(true);
        try {
            // Validate address
            const addressResponse = await fetch(`${API_BASE}/api/google/validate-address`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ address })
            });

            const addressData = await addressResponse.json();
            setValidationResult(addressData);

            if (addressData.success && addressData.is_valid) {
                // Check if in Scottsdale area
                setIsInServiceArea(addressData.is_scottsdale);

                // Get directions
                const directionsResponse = await fetch(`${API_BASE}/api/google/maps/directions`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        origin: BUSINESS_ADDRESS,
                        destination: addressData.formatted_address
                    })
                });

                const directionsData = await directionsResponse.json();
                if (directionsData.success) {
                    setDirections(directionsData);
                }
            }
        } catch (error) {
            console.error('Service area validation error:', error);
        } finally {
            setIsValidating(false);
        }
    };

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            if (customerAddress) {
                validateServiceArea(customerAddress);
            }
        }, 1000);

        return () => clearTimeout(debounceTimer);
    }, [customerAddress]);

    const openDirections = () => {
        if (validationResult?.coordinates) {
            const { lat, lng } = validationResult.coordinates;
            const mapsUrl = `https://www.google.com/maps/dir/${BUSINESS_ADDRESS}/${lat},${lng}`;
            window.open(mapsUrl, '_blank');
        }
    };

    return (
        <div style={{
            background: 'linear-gradient(135deg, #f8fafc, #e2e8f0)',
            padding: '32px',
            borderRadius: '20px',
            margin: '40px 0',
            border: '1px solid rgba(0,0,0,0.08)'
        }}>
            <div style={{
                textAlign: 'center',
                marginBottom: '32px'
            }}>
                <h3 style={{
                    fontSize: '28px',
                    fontWeight: '700',
                    color: '#1f2937',
                    marginBottom: '12px'
                }}>
                    Check Our Service Area
                </h3>
                <p style={{
                    fontSize: '16px',
                    color: '#6b7280',
                    margin: 0
                }}>
                    Enter your address to see if we serve your area and get directions
                </p>
            </div>

            <div style={{
                maxWidth: '600px',
                margin: '0 auto'
            }}>
                <div style={{
                    display: 'flex',
                    gap: '12px',
                    marginBottom: '24px'
                }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <input
                            type="text"
                            value={customerAddress}
                            onChange={(e) => setCustomerAddress(e.target.value)}
                            placeholder="Enter your address..."
                            style={{
                                width: '100%',
                                padding: '16px 20px',
                                fontSize: '16px',
                                borderRadius: '12px',
                                border: '2px solid #e5e7eb',
                                outline: 'none',
                                boxSizing: 'border-box',
                                transition: 'border-color 0.3s ease'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                        />
                        {isValidating && (
                            <div style={{
                                position: 'absolute',
                                right: '16px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                width: '20px',
                                height: '20px',
                                border: '2px solid #e5e7eb',
                                borderTop: '2px solid #3b82f6',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite'
                            }}></div>
                        )}
                    </div>
                </div>

                {validationResult && validationResult.success && (
                    <div style={{
                        background: 'white',
                        borderRadius: '16px',
                        padding: '24px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                        border: '1px solid rgba(0,0,0,0.05)'
                    }}>
                        {validationResult.is_valid ? (
                            <>
                                {/* Address Validation Success */}
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '12px',
                                    marginBottom: '20px'
                                }}>
                                    <div style={{
                                        width: '24px',
                                        height: '24px',
                                        background: '#10b981',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0
                                    }}>
                                        <MapPin size={14} color="white" />
                                    </div>
                                    <div>
                                        <div style={{
                                            fontWeight: '600',
                                            color: '#1f2937',
                                            marginBottom: '4px'
                                        }}>
                                            Address Verified
                                        </div>
                                        <div style={{
                                            color: '#6b7280',
                                            fontSize: '14px'
                                        }}>
                                            {validationResult.formatted_address}
                                        </div>
                                    </div>
                                </div>

                                {/* Service Area Status */}
                                <div style={{
                                    padding: '16px',
                                    borderRadius: '12px',
                                    background: isInServiceArea 
                                        ? 'linear-gradient(135deg, #d1fae5, #a7f3d0)'
                                        : 'linear-gradient(135deg, #fed7d7, #fbb6ce)',
                                    border: `2px solid ${isInServiceArea ? '#10b981' : '#ef4444'}`,
                                    marginBottom: '20px'
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        marginBottom: '8px'
                                    }}>
                                        <div style={{
                                            width: '20px',
                                            height: '20px',
                                            background: isInServiceArea ? '#10b981' : '#ef4444',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            {isInServiceArea ? '✓' : '!'}
                                        </div>
                                        <span style={{
                                            fontWeight: '600',
                                            color: isInServiceArea ? '#065f46' : '#991b1b',
                                            fontSize: '16px'
                                        }}>
                                            {isInServiceArea ? 'In Primary Service Area' : 'Outside Primary Service Area'}
                                        </span>
                                    </div>
                                    <div style={{
                                        color: isInServiceArea ? '#065f46' : '#991b1b',
                                        fontSize: '14px'
                                    }}>
                                        {isInServiceArea 
                                            ? 'Great news! We provide full services to your area with fast response times.'
                                            : 'We may still be able to help! Contact us to discuss availability and potential travel fees.'
                                        }
                                    </div>
                                </div>

                                {/* Directions Information */}
                                {directions && (
                                    <div style={{
                                        padding: '16px',
                                        background: '#f8fafc',
                                        borderRadius: '12px',
                                        marginBottom: '20px'
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            marginBottom: '12px'
                                        }}>
                                            <Navigation size={18} color="#3b82f6" />
                                            <span style={{
                                                fontWeight: '600',
                                                color: '#1f2937'
                                            }}>
                                                Travel Information
                                            </span>
                                        </div>
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: '1fr 1fr',
                                            gap: '16px'
                                        }}>
                                            <div>
                                                <div style={{
                                                    fontSize: '12px',
                                                    color: '#6b7280',
                                                    marginBottom: '4px'
                                                }}>
                                                    Distance from our office
                                                </div>
                                                <div style={{
                                                    fontWeight: '600',
                                                    color: '#1f2937',
                                                    fontSize: '16px'
                                                }}>
                                                    {directions.distance}
                                                </div>
                                            </div>
                                            <div>
                                                <div style={{
                                                    fontSize: '12px',
                                                    color: '#6b7280',
                                                    marginBottom: '4px'
                                                }}>
                                                    Estimated travel time
                                                </div>
                                                <div style={{
                                                    fontWeight: '600',
                                                    color: '#1f2937',
                                                    fontSize: '16px'
                                                }}>
                                                    {directions.duration}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div style={{
                                    display: 'flex',
                                    gap: '12px',
                                    flexWrap: 'wrap'
                                }}>
                                    <button
                                        onClick={openDirections}
                                        style={{
                                            padding: '12px 20px',
                                            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '10px',
                                            cursor: 'pointer',
                                            fontWeight: '600',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            fontSize: '14px',
                                            transition: 'transform 0.2s ease'
                                        }}
                                        onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                                        onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                                    >
                                        <Navigation size={16} />
                                        Get Directions
                                    </button>

                                    <button
                                        onClick={() => window.location.href = 'tel:+1-480-553-7017'}
                                        style={{
                                            padding: '12px 20px',
                                            background: 'linear-gradient(135deg, #10b981, #059669)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '10px',
                                            cursor: 'pointer',
                                            fontWeight: '600',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            fontSize: '14px',
                                            transition: 'transform 0.2s ease'
                                        }}
                                        onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                                        onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                                    >
                                        <Phone size={16} />
                                        Call Now
                                    </button>

                                    <button
                                        type="button"
                                        className="cta-button-nav"
                                        onClick={() => {
                                            const contactSection = document.getElementById('contact');
                                            if (contactSection) {
                                                contactSection.scrollIntoView({ behavior: 'smooth' });
                                            }
                                        }}
                                        style={{
                                            padding: '12px 20px',
                                            background: 'white',
                                            color: '#374151',
                                            border: '2px solid #d1d5db',
                                            borderRadius: '10px',
                                            cursor: 'pointer',
                                            fontWeight: '600',
                                            fontSize: '14px',
                                            transition: 'all 0.2s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.transform = 'translateY(-2px)';
                                            e.target.style.borderColor = '#9ca3af';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.transform = 'translateY(0)';
                                            e.target.style.borderColor = '#d1d5db';
                                        }}
                                    >
                                        Get Free Quote
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div style={{
                                textAlign: 'center',
                                color: '#ef4444',
                                fontWeight: '600'
                            }}>
                                Unable to verify address. Please check your entry and try again.
                            </div>
                        )}
                    </div>
                )}

                {/* Business Location Info */}
                <div style={{
                    marginTop: '32px',
                    textAlign: 'center',
                    padding: '20px',
                    background: 'rgba(255,255,255,0.8)',
                    borderRadius: '12px'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        marginBottom: '8px'
                    }}>
                        <MapPin size={18} color="#3b82f6" />
                        <span style={{ fontWeight: '600', color: '#1f2937' }}>
                            Our Location
                        </span>
                    </div>
                    <div style={{ color: '#6b7280', fontSize: '14px', marginBottom: '12px' }}>
                        {BUSINESS_ADDRESS}
                    </div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        color: '#059669',
                        fontSize: '14px'
                    }}>
                        <Clock size={14} />
                        <span>Serving Scottsdale & surrounding areas</span>
                    </div>
                </div>
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

export default GoogleMapsIntegration;
