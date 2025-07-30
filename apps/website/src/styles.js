// Optimized CSS styles for better performance and professional appearance

export const cssStyles = `
  /* Performance-optimized animations */
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

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
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

  /* Performance optimizations */
  * {
    box-sizing: border-box;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  /* Reduce repaints */
  .smooth-transform {
    will-change: transform;
    transform: translateZ(0);
  }

  /* Hardware acceleration for animations */
  .animate {
    transform: translateZ(0);
    backface-visibility: hidden;
    perspective: 1000px;
  }
`

// Inject styles optimally
export const injectStyles = () => {
    if (typeof document !== 'undefined' && !document.getElementById('app-styles')) {
        const styleSheet = document.createElement('style')
        styleSheet.id = 'app-styles'
        styleSheet.textContent = cssStyles
        document.head.appendChild(styleSheet)
    }
}
