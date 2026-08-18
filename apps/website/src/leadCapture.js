// Sends website form submissions into the VoiceNow CRM.
//
// The key is per-tenant: it belongs to the Scottsdale Handyman account in
// VoiceNow, NOT the Surprise Granite one. Set VITE_LEAD_CAPTURE_KEY in the
// Render environment for this static site — never commit the value.
//
// Endpoint contract: POST /webhooks/lead/:apiKey creates a lead on that
// tenant and fires Aria's `lead.created` automations (auto-text / auto-call).

const CRM_BASE = import.meta.env.VITE_CRM_URL || 'https://www.voicenowcrm.com';
const LEAD_KEY = import.meta.env.VITE_LEAD_CAPTURE_KEY || '';

export const BUSINESS_PHONE = '(480) 255-5887';
export const BUSINESS_PHONE_HREF = 'tel:+14802555887';

export const isLeadCaptureConfigured = () => Boolean(LEAD_KEY);

// Never leave the request unbounded — a stalled CRM must not pin the submit
// button forever, it has to fail fast so we can show the phone number instead.
const REQUEST_TIMEOUT_MS = 15000;

export async function submitLead(fields) {
  if (!LEAD_KEY) {
    throw new Error('Lead capture is not configured');
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${CRM_BASE}/webhooks/lead/${LEAD_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...fields,
        source: fields.source || 'scottsdalehandyman.com',
      }),
      signal: controller.signal,
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok || result.success === false) {
      throw new Error(result.error || `Submission failed (${response.status})`);
    }

    return result;
  } finally {
    clearTimeout(timer);
  }
}
