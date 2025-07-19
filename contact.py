from flask import Blueprint, request, jsonify, current_app
from flask_mail import Message, Mail
import datetime

contact_bp = Blueprint('contact', __name__)

@contact_bp.route('/contact', methods=['POST'])
def submit_contact_form():
    try:
        # Get form data
        data = request.get_json()
        
        # Extract form fields
        name = data.get('name', '')
        phone = data.get('phone', '')
        email = data.get('email', '')
        property_address = data.get('propertyAddress', '')
        property_type = data.get('propertyType', '')
        service_type = data.get('serviceType', '')
        budget = data.get('budget', '')
        timeline = data.get('timeline', '')
        urgency = data.get('urgency', '')
        description = data.get('description', '')
        marketing_source = data.get('marketingSource', '')
        contact_method = data.get('contactMethod', '')
        
        # Create email content
        subject = f"New Lead: {service_type} - {name}"
        
        email_body = f"""
NEW LEAD SUBMISSION - Scottsdale Handyman Solutions
================================================

CUSTOMER INFORMATION:
• Name: {name}
• Phone: {phone}
• Email: {email}
• Property Address: {property_address}

PROJECT DETAILS:
• Property Type: {property_type}
• Service Type: {service_type}
• Budget Range: {budget}
• Timeline: {timeline}
• Urgency Level: {urgency}

PROJECT DESCRIPTION:
{description}

CONTACT PREFERENCES:
• Preferred Contact Method: {contact_method}
• Marketing Source: {marketing_source}

SUBMISSION TIME: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

================================================
FOLLOW-UP ACTIONS:
1. Contact customer within 2 hours
2. Schedule estimate appointment
3. Prepare detailed quote
4. Update CRM system
"""

        # Create and send email
        mail = Mail(current_app)
        msg = Message(
            subject=subject,
            recipients=['help.scottsdalehandyman@gmail.com'],
            body=email_body
        )
        
        mail.send(msg)
        
        return jsonify({
            'success': True,
            'message': 'Form submitted successfully! We will contact you within 24 hours.'
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error sending email: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'There was an error submitting your form. Please try again or call us directly.'
        }), 500

@contact_bp.route('/quick-quote', methods=['POST'])
def submit_quick_quote():
    try:
        # Get form data for quick quote requests
        data = request.get_json()
        
        # Extract basic fields
        name = data.get('name', '')
        phone = data.get('phone', '')
        service = data.get('service', '')
        urgency = data.get('urgency', 'Standard')
        
        # Create email content for quick quotes
        subject = f"Quick Quote Request: {service} - {name}"
        
        email_body = f"""
QUICK QUOTE REQUEST - Scottsdale Handyman Solutions
=================================================

CUSTOMER INFORMATION:
• Name: {name}
• Phone: {phone}
• Service Requested: {service}
• Urgency: {urgency}

SUBMISSION TIME: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

=================================================
FOLLOW-UP ACTIONS:
1. Call customer within 1 hour for quick quotes
2. Provide phone estimate if possible
3. Schedule site visit if needed
"""

        # Create and send email
        mail = Mail(current_app)
        msg = Message(
            subject=subject,
            recipients=['help.scottsdalehandyman@gmail.com'],
            body=email_body
        )
        
        mail.send(msg)
        
        return jsonify({
            'success': True,
            'message': 'Quote request submitted! We will call you within 1 hour.'
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error sending quick quote email: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'There was an error submitting your quote request. Please try again or call us directly.'
        }), 500

@contact_bp.route('/emergency', methods=['POST'])
def submit_emergency_request():
    try:
        # Get form data for emergency requests
        data = request.get_json()
        
        # Extract emergency fields
        name = data.get('name', '')
        phone = data.get('phone', '')
        address = data.get('address', '')
        emergency_type = data.get('emergencyType', '')
        description = data.get('description', '')
        
        # Create urgent email content
        subject = f"🚨 EMERGENCY REQUEST: {emergency_type} - {name}"
        
        email_body = f"""
🚨 EMERGENCY SERVICE REQUEST - IMMEDIATE ATTENTION REQUIRED
=========================================================

CUSTOMER INFORMATION:
• Name: {name}
• Phone: {phone}
• Address: {address}

EMERGENCY DETAILS:
• Type: {emergency_type}
• Description: {description}

SUBMISSION TIME: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

=========================================================
⚠️ URGENT FOLLOW-UP REQUIRED:
1. CALL CUSTOMER IMMEDIATELY
2. Dispatch technician within 1-4 hours
3. Provide emergency service pricing
4. Document emergency response time
"""

        # Create and send urgent email
        mail = Mail(current_app)
        msg = Message(
            subject=subject,
            recipients=['help.scottsdalehandyman@gmail.com'],
            body=email_body
        )
        
        mail.send(msg)
        
        return jsonify({
            'success': True,
            'message': 'Emergency request submitted! We will respond within 1-4 hours.'
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error sending emergency email: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'There was an error submitting your emergency request. Please call our emergency line directly.'
        }), 500

