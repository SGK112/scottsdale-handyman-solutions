import React, { useState, useEffect } from 'react';
import { X } from './icons.jsx';
import { CheckCircle2 } from 'lucide-react';
import { submitLead, BUSINESS_PHONE, BUSINESS_PHONE_HREF } from '../leadCapture';
import { startPackageCheckout, startMaintenanceSubscription, getPaymentsConfig, PACKAGE_KEYS, MAINTENANCE_PACKAGE_NAME } from '../payments';

const BookingModal = ({ isOpen, onClose, selectedPackage }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    message: ''
  });

  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [errorMessage, setErrorMessage] = useState('');
  const [payStatus, setPayStatus] = useState('idle'); // idle | starting | error
  const [payError, setPayError] = useState('');
  const [payConfig, setPayConfig] = useState(null);

  useEffect(() => { getPaymentsConfig().then(setPayConfig); }, []);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const isEmergency = selectedPackage?.name === 'Emergency Service';
  const isMaintenancePlan = selectedPackage?.name === MAINTENANCE_PACKAGE_NAME;
  const canPayOnline = Boolean(selectedPackage) && Boolean(payConfig?.configured) &&
    (isMaintenancePlan
      ? Boolean(payConfig?.maintenance_plan)
      : Boolean(PACKAGE_KEYS[selectedPackage.name]));

  const handlePayNow = async () => {
    setPayStatus('starting');
    setPayError('');
    try {
      if (isMaintenancePlan) {
        await startMaintenanceSubscription({ email: formData.email, address: formData.address });
      } else {
        await startPackageCheckout({
          packageName: selectedPackage.name,
          email: formData.email,
          address: formData.address,
          message: formData.message,
        });
      }
      // On success the browser navigates to Stripe, so nothing runs past here.
    } catch (error) {
      console.error('Checkout failed:', error);
      setPayError(error.message || 'Could not open the payment page');
      setPayStatus('error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === 'sending') return;

    setStatus('sending');
    setErrorMessage('');

    try {
      await submitLead({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        message: formData.message,
        service: selectedPackage?.name || 'General inquiry',
        urgency: isEmergency ? 'emergency' : 'normal',
        package_price: selectedPackage?.price || '',
        // Dropped with the Google address widget: service_area was hardcoded to
        // "in-area" on every lead (its endpoint 404'd, so the status was always
        // null and the ternary always fell through), and validated_address was
        // just a duplicate of address. Both were confident-looking noise in the
        // CRM rather than data anyone had actually checked.
      });
      setStatus('sent');
    } catch (error) {
      // Never tell someone we received a request we did not receive — show the
      // failure and the phone number so the lead has a way through.
      console.error('Booking submission failed:', error);
      setErrorMessage(error.message || 'Something went wrong');
      setStatus('error');
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Book Your Service</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        
        <div className="modal-body">
          {status === 'sent' ? (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <CheckCircle2 size={56} strokeWidth={2} style={{ color: '#1e4034' }} />
              <h3 style={{ margin: '1rem 0 0.5rem' }}>Request received</h3>
              <p style={{ color: '#4b5563', margin: 0 }}>
                {isEmergency
                  ? 'This came in as an emergency — we respond 24/7 and will call you right away.'
                  : "We've got your details and will be in touch shortly to confirm your appointment."}
              </p>
              {canPayOnline && (
                <div style={{
                  background: '#f8fafc', border: '1px solid #e6edf4', borderRadius: '10px',
                  padding: '1rem', margin: '1.25rem 0 0', textAlign: 'left'
                }}>
                  <strong style={{ display: 'block', marginBottom: '.25rem' }}>
                    {isMaintenancePlan
                      ? `Start your plan — ${selectedPackage.price}/month`
                      : `Pay ${selectedPackage.price} now to lock in your booking`}
                  </strong>
                  <span style={{ fontSize: '.9rem', color: '#4b5563' }}>
                    {isMaintenancePlan
                      ? 'Cancel any time with 30 days notice. Secure checkout by Stripe.'
                      : 'Optional — you can also settle up when the work is done. Secure checkout by Stripe.'}
                  </span>
                  {payStatus === 'error' && (
                    <div style={{ color: '#991b1b', fontSize: '.9rem', marginTop: '.5rem' }}>
                      {payError}. You can still pay when we arrive.
                    </div>
                  )}
                  <button
                    type="button"
                    className="btn-primary"
                    style={{ width: '100%', marginTop: '.75rem' }}
                    onClick={handlePayNow}
                    disabled={payStatus === 'starting'}
                  >
                    {payStatus === 'starting' ? 'Opening secure checkout…'
                      : isMaintenancePlan ? 'Start plan' : `Pay ${selectedPackage.price}`}
                  </button>
                </div>
              )}
              <p style={{ color: '#4b5563', marginTop: '1rem' }}>
                Need us sooner? Call{' '}
                <a href={BUSINESS_PHONE_HREF} style={{ fontWeight: 700 }}>{BUSINESS_PHONE}</a>.
              </p>
              <div className="modal-footer" style={{ justifyContent: 'center' }}>
                <button type="button" onClick={onClose} className="btn-secondary">Done</button>
              </div>
            </div>
          ) : (
          <>
          {selectedPackage && (
            <div className="selected-package">
              <h3>{selectedPackage.name}</h3>
              <p className="package-price">{selectedPackage.price}</p>
              <ul>
                {selectedPackage.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                name="name"
                className="form-input"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Email *</label>
              <input
                type="email"
                name="email"
                className="form-input"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Phone *</label>
              <input
                type="tel"
                name="phone"
                className="form-input"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Address *</label>
              <input
                type="text"
                name="address"
                className="form-input"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Street, city, ZIP"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Project Details</label>
              <textarea
                name="message"
                className="form-input form-textarea"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Please describe your project or any specific requirements..."
              />
            </div>
            
            {status === 'error' && (
              <div style={{
                background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b',
                borderRadius: '8px', padding: '0.75rem 1rem', margin: '0 0 1rem'
              }}>
                <strong>We couldn't send that request.</strong>
                <div style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>
                  {errorMessage}. Please call{' '}
                  <a href={BUSINESS_PHONE_HREF} style={{ color: '#991b1b', fontWeight: 700 }}>
                    {BUSINESS_PHONE}
                  </a>{' '}
                  and we'll take care of you directly.
                </div>
              </div>
            )}

            <div className="modal-footer">
              <button type="button" onClick={onClose} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn-primary" disabled={status === 'sending'}>
                {status === 'sending' ? 'Sending…' : status === 'error' ? 'Try Again' : 'Submit Request'}
              </button>
            </div>
          </form>
          </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
