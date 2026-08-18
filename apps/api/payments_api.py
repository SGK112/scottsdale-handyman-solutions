# Stripe payments for Scottsdale Handyman Solutions.
#
# Integration shape follows the Stripe implementation planner's recommendation
# for this business (owner-operated home services, web, US-only):
#   - one-time packages      -> Stripe-hosted Checkout, mode='payment'
#   - $79/mo maintenance     -> Stripe-hosted Checkout, mode='subscription'
#   - plan self-management   -> Stripe Customer Portal
#   - invoices               -> raised in the Dashboard, paid on the Hosted
#                               Invoice Page (no code here by design)
#   - tax                    -> Stripe Tax (automatic_tax) with a services PTC
#
# Deliberately NOT here: custom card forms. Every payment surface is hosted by
# Stripe so this app never touches raw card data.

import os
import logging

import stripe
from flask import Blueprint, jsonify, request

logger = logging.getLogger(__name__)

payments_bp = Blueprint('payments', __name__)

stripe.api_key = os.environ.get('STRIPE_SECRET_KEY', '')

WEBHOOK_SECRET = os.environ.get('STRIPE_WEBHOOK_SECRET', '')
SITE_URL = os.environ.get('SITE_URL', 'https://www.scottsdalehandyman.com')

# Recurring Price for the monthly maintenance plan. Created once in Stripe
# (Dashboard or API) — a subscription needs a real recurring Price, unlike the
# one-time packages which can be priced inline.
MAINTENANCE_PRICE_ID = os.environ.get('STRIPE_PRICE_MAINTENANCE_MONTHLY', '')

# Protects the endpoints that accept an operator-supplied amount.
ADMIN_TOKEN = os.environ.get('ADMIN_TOKEN', '')

# "General - Services". Verified against Stripe's product tax code list.
# Handyman labor is performed at the customer's property, and this code allows
# an optional performance_location so tax can be sourced to the job site.
# Confirm the correct classification for Arizona TPT with an accountant before
# going live — repair/maintenance and larger modification work can differ.
TAX_CODE_SERVICES = os.environ.get('STRIPE_TAX_CODE_SERVICES', 'txcd_20030000')

# Server-side price catalog. The client sends a package KEY, never an amount —
# otherwise anyone could book the $799 renovation for $1.
PACKAGES = {
    'quick_fix':        {'name': 'Quick Fix',             'amount': 9900,  'description': 'Single repair or small task, 1-2 hours'},
    'essentials':       {'name': 'Handyman Essentials',   'amount': 19900, 'description': 'Half day of professional service'},
    'improvement_pro':  {'name': 'Home Improvement Pro',  'amount': 39900, 'description': 'Full day of comprehensive service'},
    'renovation':       {'name': 'Complete Renovation',   'amount': 79900, 'description': '16+ hours of expert service, 2 days'},
    'emergency':        {'name': 'Emergency Service',     'amount': 14900, 'description': '24/7 emergency response, no overtime charges'},
}


def _require_stripe():
    if not stripe.api_key:
        return jsonify({'error': 'Payments are not configured'}), 503
    return None


def _is_admin():
    supplied = request.headers.get('X-Admin-Token', '')
    return bool(ADMIN_TOKEN) and supplied == ADMIN_TOKEN


def _line_item(name, description, amount_cents):
    """One-time line item priced inline, tagged with the services tax code."""
    return {
        'quantity': 1,
        'price_data': {
            'currency': 'usd',
            'unit_amount': amount_cents,
            'product_data': {
                'name': name,
                'description': description,
                'tax_code': TAX_CODE_SERVICES,
            },
            # Stripe Tax adds tax on top of the listed price.
            'tax_behavior': 'exclusive',
        },
    }


@payments_bp.route('/api/payments/checkout', methods=['POST'])
def create_checkout():
    """Hosted Checkout for a fixed-price package."""
    guard = _require_stripe()
    if guard:
        return guard

    data = request.get_json(silent=True) or {}
    package = PACKAGES.get(data.get('package'))
    if not package:
        return jsonify({'error': 'Unknown package'}), 400

    try:
        session = stripe.checkout.Session.create(
            mode='payment',
            line_items=[_line_item(package['name'], package['description'], package['amount'])],
            success_url=f'{SITE_URL}/booking-confirmed.html?session_id={{CHECKOUT_SESSION_ID}}',
            cancel_url=f'{SITE_URL}/?booking=cancelled',
            customer_email=data.get('email') or None,
            # Required for Stripe Tax to determine a jurisdiction.
            billing_address_collection='required',
            automatic_tax={'enabled': True},
            # Keep a Customer so the same person can be put on a plan or
            # invoiced later without re-keying their details.
            customer_creation='always',
            phone_number_collection={'enabled': True},
            metadata={
                'package': data.get('package', ''),
                'service_address': (data.get('address') or '')[:500],
                'job_notes': (data.get('message') or '')[:500],
                'source': 'scottsdalehandyman.com',
            },
        )
        return jsonify({'url': session.url, 'id': session.id})
    except stripe.error.StripeError as e:
        logger.error('Checkout session failed: %s', e)
        return jsonify({'error': e.user_message or 'Could not start checkout'}), 400


@payments_bp.route('/api/payments/subscribe', methods=['POST'])
def create_subscription_checkout():
    """Hosted Checkout for the $79/mo maintenance plan (one per property)."""
    guard = _require_stripe()
    if guard:
        return guard

    if not MAINTENANCE_PRICE_ID:
        return jsonify({'error': 'Maintenance plan is not configured'}), 503

    data = request.get_json(silent=True) or {}
    service_address = (data.get('address') or '').strip()
    if not service_address:
        # Plans are sold per property, so the address is the subscription's
        # identity — a landlord may hold several.
        return jsonify({'error': 'Service address is required'}), 400

    try:
        session = stripe.checkout.Session.create(
            mode='subscription',
            line_items=[{'price': MAINTENANCE_PRICE_ID, 'quantity': 1}],
            success_url=f'{SITE_URL}/plan-active.html?session_id={{CHECKOUT_SESSION_ID}}',
            cancel_url=f'{SITE_URL}/?plan=cancelled',
            customer_email=data.get('email') or None,
            billing_address_collection='required',
            automatic_tax={'enabled': True},
            subscription_data={
                'metadata': {
                    'service_address': service_address[:500],
                    'source': 'scottsdalehandyman.com',
                },
            },
            metadata={'service_address': service_address[:500]},
        )
        return jsonify({'url': session.url, 'id': session.id})
    except stripe.error.StripeError as e:
        logger.error('Subscription checkout failed: %s', e)
        return jsonify({'error': e.user_message or 'Could not start checkout'}), 400


@payments_bp.route('/api/payments/custom', methods=['POST'])
def create_custom_checkout():
    """Operator-initiated payment for a quoted job: deposit or final balance.

    Amount is supplied by the owner, not the customer, so this is admin-only —
    an open custom-amount endpoint is a tampering hole.
    """
    guard = _require_stripe()
    if guard:
        return guard

    if not _is_admin():
        return jsonify({'error': 'Not authorized'}), 401

    data = request.get_json(silent=True) or {}
    try:
        amount_cents = int(round(float(data['amount']) * 100))
    except (KeyError, TypeError, ValueError):
        return jsonify({'error': 'A valid amount is required'}), 400

    if amount_cents < 100:
        return jsonify({'error': 'Amount must be at least $1.00'}), 400

    stage = data.get('stage', 'deposit')  # 'deposit' | 'balance'
    job_ref = (data.get('job_reference') or '').strip()
    label = 'Deposit' if stage == 'deposit' else 'Balance due'
    description = f'{label} for job {job_ref}' if job_ref else label

    try:
        session = stripe.checkout.Session.create(
            mode='payment',
            line_items=[_line_item(f'{label} — Scottsdale Handyman Solutions',
                                   description, amount_cents)],
            success_url=f'{SITE_URL}/payment-received.html?session_id={{CHECKOUT_SESSION_ID}}',
            cancel_url=f'{SITE_URL}/',
            customer_email=data.get('email') or None,
            billing_address_collection='required',
            automatic_tax={'enabled': True},
            customer_creation='always',
            metadata={'stage': stage, 'job_reference': job_ref[:200]},
        )
        return jsonify({'url': session.url, 'id': session.id})
    except stripe.error.StripeError as e:
        logger.error('Custom checkout failed: %s', e)
        return jsonify({'error': e.user_message or 'Could not start checkout'}), 400


@payments_bp.route('/api/payments/portal', methods=['POST'])
def create_portal_session():
    """Customer Portal — how plan members update a card or cancel.

    The published terms promise cancellation any time with 30 days' notice, so
    this has to exist rather than routing every change through a phone call.
    """
    guard = _require_stripe()
    if guard:
        return guard

    data = request.get_json(silent=True) or {}
    customer_id = data.get('customer_id')
    if not customer_id:
        return jsonify({'error': 'customer_id is required'}), 400

    try:
        session = stripe.billing_portal.Session.create(
            customer=customer_id,
            return_url=SITE_URL,
        )
        return jsonify({'url': session.url})
    except stripe.error.StripeError as e:
        logger.error('Portal session failed: %s', e)
        return jsonify({'error': e.user_message or 'Could not open portal'}), 400


@payments_bp.route('/api/payments/webhook', methods=['POST'])
def stripe_webhook():
    """Signature-verified webhook.

    Returns 200 for handled and ignored events alike; anything else makes
    Stripe retry. Never trust the body without construct_event.
    """
    if not WEBHOOK_SECRET:
        logger.error('Webhook received but STRIPE_WEBHOOK_SECRET is not set')
        return jsonify({'error': 'Webhook not configured'}), 503

    payload = request.get_data()
    signature = request.headers.get('Stripe-Signature', '')

    try:
        event = stripe.Webhook.construct_event(payload, signature, WEBHOOK_SECRET)
    except ValueError:
        return jsonify({'error': 'Invalid payload'}), 400
    except stripe.error.SignatureVerificationError:
        logger.warning('Rejected webhook with bad signature')
        return jsonify({'error': 'Invalid signature'}), 400

    event_type = event['type']
    obj = event['data']['object']

    if event_type == 'checkout.session.completed':
        logger.info('Payment complete: %s %s %s',
                    obj.get('id'), obj.get('amount_total'),
                    (obj.get('metadata') or {}).get('package', ''))
    elif event_type == 'invoice.paid':
        logger.info('Invoice paid: %s', obj.get('id'))
    elif event_type == 'invoice.payment_failed':
        # Smart Retries handles the retry schedule and dunning emails; this is
        # just so a failing plan member is visible in the logs.
        logger.warning('Invoice payment failed: %s customer=%s',
                       obj.get('id'), obj.get('customer'))
    elif event_type == 'customer.subscription.deleted':
        logger.info('Maintenance plan cancelled: %s', obj.get('id'))
    else:
        logger.debug('Unhandled Stripe event: %s', event_type)

    return jsonify({'received': True}), 200


@payments_bp.route('/api/payments/config', methods=['GET'])
def payments_config():
    """Lets the frontend and a health check see what is actually wired."""
    return jsonify({
        'configured': bool(stripe.api_key),
        'maintenance_plan': bool(MAINTENANCE_PRICE_ID),
        'webhook': bool(WEBHOOK_SECRET),
        'packages': {k: {'name': v['name'], 'amount': v['amount']} for k, v in PACKAGES.items()},
    })
