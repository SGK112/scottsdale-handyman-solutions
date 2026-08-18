import React, { useState, useEffect, Suspense, lazy } from 'react';
import './App.css';

// Lazy load components for better performance
const AriaWidget = lazy(() => import('./AriaWidget'));
const SiteRedesign = lazy(() => import('./SiteRedesign'));
const BookingModal = lazy(() => import('./components/BookingModal'));
const ProPortalModal = lazy(() => import('./components/ProPortalModal'));
const WorkWithUsModal = lazy(() => import('./components/WorkWithUsModal'));

// Loading fallback component
const LoadingFallback = () => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '50vh',
    gap: '1rem'
  }}>
    <div style={{
      width: '40px',
      height: '40px',
      border: '4px solid #f3f4f6',
      borderTop: '4px solid #3b82f6',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }}></div>
    <p style={{ color: '#6b7280', fontSize: '1rem' }}>Loading Scottsdale Handyman Solutions...</p>
  </div>
);

// Main App Component
function App() {
  const [isBookingModalOpen, setBookingModalOpen] = useState(false);
  const [isProPortalModalOpen, setProPortalModalOpen] = useState(false);
  const [isWorkWithUsModalOpen, setWorkWithUsModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);

  // No Stripe.js on the client: payments use Stripe-hosted Checkout, so the
  // browser only ever receives a redirect URL minted by our API. Nothing to
  // initialize and no publishable key to ship.

  const handleBookNow = (pkg) => {
    setSelectedPackage(pkg);
    setBookingModalOpen(true);
  };

  const handleOpenProPortal = () => setProPortalModalOpen(true);
  const handleOpenWorkWithUs = () => setWorkWithUsModalOpen(true);

  const handleCloseModals = () => {
    setBookingModalOpen(false);
    setProPortalModalOpen(false);
    setWorkWithUsModalOpen(false);
  };

  return (
    <div className="App">
      <Suspense fallback={<LoadingFallback />}>
        <SiteRedesign
          onBookNow={handleBookNow}
          onProPortalClick={handleOpenProPortal}
          onWorkWithUsClick={handleOpenWorkWithUs}
        />

        {isBookingModalOpen && (
          <BookingModal
            isOpen={isBookingModalOpen}
            onClose={handleCloseModals}
            selectedPackage={selectedPackage}
          />
        )}

        {isProPortalModalOpen && (
          <ProPortalModal isOpen={isProPortalModalOpen} onClose={handleCloseModals} />
        )}

        {isWorkWithUsModalOpen && (
          <WorkWithUsModal isOpen={isWorkWithUsModalOpen} onClose={handleCloseModals} />
        )}

        <AriaWidget />
      </Suspense>
    </div>
  );
}

export default App;
