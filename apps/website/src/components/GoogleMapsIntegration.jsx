import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, CheckCircle, AlertCircle, Phone, ExternalLink } from 'lucide-react';

const GoogleMapsIntegration = ({ address, onAddressValidated, onServiceAreaVerified }) => {
    const [addressValidation, setAddressValidation] = useState(null);
    const [serviceAreaStatus, setServiceAreaStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    const [directions, setDirections] = useState(null);

    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

    useEffect(() => {
        if (address && address.length > 5) {
            validateAddress();
        }
    }, [address]);

    const validateAddress = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/google/validate-address`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ address })
            });

            const data = await response.json();
            setAddressValidation(data);
            
            if (data.isValid) {
                await checkServiceArea(data.validatedAddress || address);
                onAddressValidated?.(data);
            }
        } catch (error) {
            console.error('Address validation error:', error);
            setAddressValidation({ 
                isValid: false, 
                error: 'Unable to validate address' 
            });
        } finally {
            setLoading(false);
        }
    };

    const checkServiceArea = async (validatedAddress) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/google/check-service-area`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ address: validatedAddress })
            });

            const data = await response.json();
            setServiceAreaStatus(data);
            onServiceAreaVerified?.(data);

            if (data.inServiceArea) {
                await getDirections(validatedAddress);
            }
        } catch (error) {
            console.error('Service area check error:', error);
            setServiceAreaStatus({
                inServiceArea: false,
                error: 'Unable to check service area'
            });
        }
    };

    const getDirections = async (destination) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/google/directions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    destination,
                    origin: 'Scottsdale, AZ'
                })
            });

            const data = await response.json();
            setDirections(data);
        } catch (error) {
            console.error('Directions error:', error);
        }
    };

    const openInGoogleMaps = () => {
        if (addressValidation?.validatedAddress) {
            const encodedAddress = encodeURIComponent(addressValidation.validatedAddress);
            window.open(`https://maps.google.com/?q=${encodedAddress}`, '_blank');
        }
    };

    const getDirectionsInMaps = () => {
        if (addressValidation?.validatedAddress) {
            const encodedAddress = encodeURIComponent(addressValidation.validatedAddress);
            window.open(`https://maps.google.com/dir/Scottsdale,+AZ/${encodedAddress}`, '_blank');
        }
    };

    if (!address || address.length <= 5) {
        return null;
    }

    return (
        <div style={{
            marginTop: '12px',
            padding: '16px',
            background: '#f8f9fa',
            borderRadius: '8px',
            border: '1px solid #e9ecef'
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '12px'
            }}>
                <MapPin size={18} style={{ color: '#0066cc' }} />
                <span style={{ fontWeight: '600', color: '#333' }}>
                    Address Verification
                </span>
                {loading && (
                    <div style={{
                        width: '16px',
                        height: '16px',
                        border: '2px solid #f3f4f6',
                        borderTop: '2px solid #0066cc',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                    }} />
                )}
            </div>

            {addressValidation && (
                <div style={{ marginBottom: '12px' }}>
                    {addressValidation.isValid ? (
                        <div style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '8px',
                            color: '#28a745'
                        }}>
                            <CheckCircle size={16} style={{ marginTop: '2px', flexShrink: 0 }} />
                            <div>
                                <div style={{ fontWeight: '500' }}>✓ Address Verified</div>
                                {addressValidation.validatedAddress && (
                                    <div style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>
                                        {addressValidation.validatedAddress}
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '8px',
                            color: '#dc3545'
                        }}>
                            <AlertCircle size={16} style={{ marginTop: '2px', flexShrink: 0 }} />
                            <div>
                                <div style={{ fontWeight: '500' }}>Address needs verification</div>
                                <div style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>
                                    Please check the spelling and format
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {serviceAreaStatus && (
                <div style={{ marginBottom: '12px' }}>
                    {serviceAreaStatus.inServiceArea ? (
                        <div style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '8px',
                            color: '#28a745'
                        }}>
                            <CheckCircle size={16} style={{ marginTop: '2px', flexShrink: 0 }} />
                            <div>
                                <div style={{ fontWeight: '500' }}>✓ We serve your area!</div>
                                {serviceAreaStatus.distance && (
                                    <div style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>
                                        Distance: {serviceAreaStatus.distance}
                                        {serviceAreaStatus.duration && ` • Travel time: ${serviceAreaStatus.duration}`}
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '8px',
                            color: '#ffc107'
                        }}>
                            <AlertCircle size={16} style={{ marginTop: '2px', flexShrink: 0 }} />
                            <div>
                                <div style={{ fontWeight: '500' }}>Service area notice</div>
                                <div style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>
                                    This location may be outside our primary service area. Additional travel fees may apply.
                                </div>
                                <div style={{ 
                                    fontSize: '14px', 
                                    color: '#0066cc', 
                                    marginTop: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                }}>
                                    <Phone size={14} />
                                    <span>Call us at (480) 418-1635 to discuss your project</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {addressValidation?.isValid && (
                <div style={{
                    display: 'flex',
                    gap: '8px',
                    flexWrap: 'wrap'
                }}>
                    <button
                        onClick={openInGoogleMaps}
                        style={{
                            padding: '8px 12px',
                            background: '#0066cc',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '14px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                        }}
                    >
                        <ExternalLink size={14} />
                        View on Maps
                    </button>

                    {serviceAreaStatus?.inServiceArea && (
                        <button
                            onClick={getDirectionsInMaps}
                            style={{
                                padding: '8px 12px',
                                background: '#28a745',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '14px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}
                        >
                            <Navigation size={14} />
                            Get Directions
                        </button>
                    )}
                </div>
            )}

            {directions && directions.routes && directions.routes.length > 0 && (
                <div style={{
                    marginTop: '12px',
                    padding: '12px',
                    background: '#e7f3ff',
                    borderRadius: '6px',
                    fontSize: '14px'
                }}>
                    <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                        Route Information:
                    </div>
                    <div>
                        Distance: {directions.routes[0].legs[0].distance.text} • 
                        Duration: {directions.routes[0].legs[0].duration.text}
                    </div>
                </div>
            )}

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
