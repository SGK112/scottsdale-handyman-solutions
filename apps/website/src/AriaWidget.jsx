import { useEffect } from 'react';

// Mounts the real VoiceNow assistant, scoped to the Scottsdale Handyman tenant.
//
// This replaces the old ProfessionalChatbotWidget, which looked like a chatbot
// but was a hardcoded if/else script — it answered from canned strings, reached
// no AI, and nothing a visitor typed into it ever reached the CRM.
//
// The widget served here talks to Aria with this business's context and can
// capture the visitor as a lead, plus WebRTC voice via the same session.

const CRM_BASE = import.meta.env.VITE_CRM_URL || 'https://www.voicenowcrm.com';
const TENANT_ID = import.meta.env.VITE_VOICENOW_USER_ID || '';

export default function AriaWidget() {
  useEffect(() => {
    if (!TENANT_ID) {
      // Without a tenant the widget would load unscoped and answer as nobody.
      console.warn('[aria] VITE_VOICENOW_USER_ID is not set — assistant not mounted');
      return undefined;
    }

    const existing = document.getElementById('voicenow-widget-script');
    if (existing) return undefined;

    const script = document.createElement('script');
    script.id = 'voicenow-widget-script';
    script.async = true;
    script.src =
      `${CRM_BASE}/api/webrtc-agent/widget.js` +
      `?userId=${encodeURIComponent(TENANT_ID)}&agentId=aria&position=bottom-right&theme=light` +
      // Cloudflare fronts VoiceNow and cached the script back when it was served
      // with Cross-Origin-Resource-Policy: same-origin, which blocked the embed.
      // Bump this to claim a fresh cache key if that ever happens again.
      `&v=3`;
    script.onerror = () => console.warn('[aria] assistant failed to load');
    document.body.appendChild(script);

    return () => {
      script.remove();
      document.querySelectorAll('.voicenow-widget-container').forEach((n) => n.remove());
    };
  }, []);

  return null;
}
