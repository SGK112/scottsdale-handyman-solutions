# Property onboarding intake.
#
# Forwards the completed survey into the VoiceNow CRM. The lead-capture key is
# read from the server environment rather than shipped to the browser, so it
# never appears in this public repository.

import os
import json
import logging
import urllib.request
import urllib.error

from flask import Blueprint, jsonify, request

logger = logging.getLogger(__name__)

onboarding_bp = Blueprint('onboarding', __name__)

CRM_BASE = os.environ.get('CRM_URL', 'https://www.voicenowcrm.com')
LEAD_KEY = os.environ.get('LEAD_CAPTURE_KEY', '')

# Lead.source in VoiceNow is a REQUIRED ENUM. Anything outside it fails
# validation server-side and the lead is dropped with a 500, so this must stay
# a valid value — the real origin travels separately.
CRM_SOURCE = 'website'

FIELD_LABELS = [
    ('property_type', 'Property type'),
    ('ownership', 'Owner or manager'),
    ('year_built', 'Approx. year built'),
    ('square_feet', 'Approximate size'),
    ('stories', 'Stories'),
    ('hvac_units', 'HVAC units'),
    ('hvac_last_service', 'HVAC last serviced'),
    ('water_heater', 'Water heater type / age'),
    ('roof_type', 'Roof type'),
    ('pool', 'Pool or spa'),
    ('irrigation', 'Irrigation system'),
    ('known_issues', 'Known problems today'),
    ('priorities', 'What matters most'),
    ('occupancy', 'Who is on site'),
    ('access', 'Access arrangements'),
    ('pets', 'Pets on site'),
    ('preferred_window', 'Preferred visit window'),
    ('notes', 'Anything else'),
]


def _summary(data):
    """Readable transcript so the owner can read the survey in the CRM."""
    lines = []
    for key, label in FIELD_LABELS:
        value = data.get(key)
        if isinstance(value, list):
            value = ', '.join(value)
        if value:
            lines.append(f'{label}: {value}')
    return '\n'.join(lines)


@onboarding_bp.route('/api/onboarding', methods=['POST'])
def submit_onboarding():
    if not LEAD_KEY:
        return jsonify({'success': False, 'error': 'Onboarding is not configured'}), 503

    data = request.get_json(silent=True) or {}

    name = (data.get('name') or '').strip()
    phone = (data.get('phone') or '').strip()
    email = (data.get('email') or '').strip()
    address = (data.get('address') or '').strip()

    if not name or not (phone or email):
        return jsonify({'success': False, 'error': 'Name and a phone or email are required'}), 400

    payload = {
        'name': name,
        'phone': phone,
        'email': email,
        'address': address,
        'service': 'Maintenance plan onboarding',
        'source': CRM_SOURCE,
        'origin': 'scottsdalehandyman.com/onboarding',
        'message': f'PROPERTY ONBOARDING SURVEY\nService address: {address or "not given"}\n\n{_summary(data)}',
        # the full answer set rides along and lands on the lead's metadata
        'survey': data,
    }

    try:
        req = urllib.request.Request(
            f'{CRM_BASE}/webhooks/lead/{LEAD_KEY}',
            data=json.dumps(payload).encode(),
            headers={
                'Content-Type': 'application/json',
                # VoiceNow sits behind Cloudflare, which rejects the default
                # Python-urllib signature with 403 error 1010. Identify properly.
                'User-Agent': 'ScottsdaleHandymanSite/1.0 (+https://www.scottsdalehandyman.com)',
                'Accept': 'application/json',
            },
            method='POST',
        )
        with urllib.request.urlopen(req, timeout=20) as resp:
            body = json.loads(resp.read().decode() or '{}')
        if not body.get('success'):
            raise RuntimeError(body.get('error') or 'CRM rejected the submission')
        return jsonify({'success': True, 'leadId': body.get('leadId')})

    except urllib.error.HTTPError as e:
        detail = e.read().decode()[:200]
        logger.error('Onboarding forward failed: %s %s', e.code, detail)
        return jsonify({'success': False, 'error': 'Could not save your answers'}), 502
    except Exception as e:
        logger.error('Onboarding forward failed: %s', e)
        return jsonify({'success': False, 'error': 'Could not save your answers'}), 502


@onboarding_bp.route('/api/onboarding/config', methods=['GET'])
def onboarding_config():
    return jsonify({'configured': bool(LEAD_KEY)})
