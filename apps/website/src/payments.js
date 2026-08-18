// Redirects to Stripe-hosted Checkout.
//
// The browser never sends an amount — only a package key. Prices live in the
// server-side catalog in apps/api/payments_api.py.

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const REQUEST_TIMEOUT_MS = 15000;

// Maps the display names in data.js to the server catalog keys.
export const PACKAGE_KEYS = {
  'Quick Fix': 'quick_fix',
  'Handyman Essentials': 'essentials',
  'Home Improvement Pro': 'improvement_pro',
  'Complete Renovation': 'renovation',
  'Emergency Service': 'emergency',
};

export const MAINTENANCE_PACKAGE_NAME = 'Monthly Maintenance';

async function postJson(path, body) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || !result.url) {
      throw new Error(result.error || `Could not start checkout (${response.status})`);
    }
    return result.url;
  } finally {
    clearTimeout(timer);
  }
}

// Ask the API what is actually wired before offering to take money — showing
// a Pay button that 503s is worse than not showing one.
let configPromise = null;
export function getPaymentsConfig() {
  if (!configPromise) {
    configPromise = fetch(`${API_BASE}/api/payments/config`)
      .then((r) => (r.ok ? r.json() : null))
      .catch(() => null);
  }
  return configPromise;
}

export async function startPackageCheckout({ packageName, email, address, message }) {
  const key = PACKAGE_KEYS[packageName];
  if (!key) throw new Error('That package is not available for online payment');
  window.location.href = await postJson('/api/payments/checkout', {
    package: key, email, address, message,
  });
}

export async function startMaintenanceSubscription({ email, address }) {
  window.location.href = await postJson('/api/payments/subscribe', { email, address });
}
