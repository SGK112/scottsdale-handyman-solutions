// Redirects to Stripe-hosted Checkout, via the VoiceNow storefront API.
//
// Was pointed at the Flask API in apps/api, which held its own Stripe key and
// its own hardcoded price list. That is gone: payments now run through the
// VoiceNow Connect account for this business, so money lands in the Scottsdale
// Handyman bank account with Scottsdale Handyman as merchant of record, and the
// catalog lives in Stripe instead of in two places that could disagree.
//
// The browser still never sends an amount — only a package slug. The server
// resolves that to a Stripe Price it has verified belongs to this business.

const CRM_BASE = (import.meta.env.VITE_CRM_URL || 'https://www.voicenowcrm.com').replace(/\/+$/, '');
const CHECKOUT_KEY = import.meta.env.VITE_CHECKOUT_KEY || '';

const REQUEST_TIMEOUT_MS = 15000;

// Display name -> the packageKey seeded in the Stripe catalog. Kept as a static
// map because the modal needs to decide whether to show a Pay button before the
// catalog request has come back.
export const PACKAGE_KEYS = {
  'Quick Fix': 'quick_fix',
  'Handyman Essentials': 'essentials',
  'Home Improvement Pro': 'improvement_pro',
  'Complete Renovation': 'renovation',
  'Emergency Service': 'emergency',
};

export const MAINTENANCE_PACKAGE_NAME = 'Monthly Maintenance';
const MAINTENANCE_KEY = 'monthly_maintenance';

async function withTimeout(url, init) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

// Ask what is actually purchasable before offering to take money — showing a
// Pay button that then fails is worse than not showing one. Cached for the page
// lifetime; the catalog does not change mid-session.
let configPromise = null;

export function getPaymentsConfig() {
  if (!configPromise) {
    if (!CHECKOUT_KEY) {
      // Unset env var must read as "payments off", not as a broken page.
      configPromise = Promise.resolve({ configured: false, maintenance_plan: false, items: [] });
      return configPromise;
    }

    configPromise = withTimeout(`${CRM_BASE}/api/storefront/${CHECKOUT_KEY}/catalog`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        const items = data?.items || [];
        const has = (key) => items.some((i) => i.packageKey === key);
        return {
          // Configured means at least one one-time package is really buyable,
          // not merely that the request succeeded.
          configured: Object.values(PACKAGE_KEYS).some(has),
          maintenance_plan: has(MAINTENANCE_KEY),
          items,
        };
      })
      .catch(() => ({ configured: false, maintenance_plan: false, items: [] }));
  }
  return configPromise;
}

async function startCheckout(packageKey, { email, address, message } = {}) {
  if (!CHECKOUT_KEY) throw new Error('Online payment is not available right now');

  const response = await withTimeout(`${CRM_BASE}/api/storefront/${CHECKOUT_KEY}/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      packageKey,
      email,
      successUrl: `${window.location.origin}/payment-complete.html?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${window.location.origin}/?checkout=cancelled`,
      // Carried onto the Stripe object so the job details survive on the
      // payment record instead of living only in the lead.
      metadata: {
        service_address: address || '',
        job_notes: message || '',
        origin: 'scottsdalehandyman.com',
      },
    }),
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok || !result.url) {
    throw new Error(result.error || `Could not start checkout (${response.status})`);
  }
  window.location.href = result.url;
}

export async function startPackageCheckout({ packageName, email, address, message }) {
  const key = PACKAGE_KEYS[packageName];
  if (!key) throw new Error('That package is not available for online payment');
  return startCheckout(key, { email, address, message });
}

export async function startMaintenanceSubscription({ email, address }) {
  return startCheckout(MAINTENANCE_KEY, { email, address });
}
