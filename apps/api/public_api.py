# Public API Routes - Customer-facing endpoints
from flask import request, jsonify
import json
import os
from datetime import datetime

def create_public_routes(app):
    """Create all public API routes for customer interactions"""

    # Storage file for leads (in production, use a database)
    LEADS_FILE = os.path.join(os.path.dirname(__file__), 'leads.json')
    
    def load_leads():
        """Load leads from JSON file"""
        try:
            with open(LEADS_FILE, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            return []
    
    def save_leads(leads):
        """Save leads to JSON file"""
        try:
            # Ensure directory exists
            os.makedirs(os.path.dirname(LEADS_FILE), exist_ok=True)
            with open(LEADS_FILE, 'w') as f:
                json.dump(leads, f, indent=2)
            return True
        except Exception as e:
            print(f"Error saving leads: {e}")
            return False

    @app.route('/api/health', methods=['GET'])
    def health_check():
        """API health check"""
        return jsonify({
            'status': 'healthy',
            'service': 'Scottsdale Handyman API',
            'timestamp': datetime.now().isoformat()
        })

    @app.route('/api/contact', methods=['POST'])
    def submit_contact():
        """Handle contact form submissions from the public website"""
        try:
            data = request.get_json()
            
            # Validate required fields
            required_fields = ['name', 'phone', 'service', 'description']
            for field in required_fields:
                if not data.get(field):
                    return jsonify({
                        'success': False,
                        'message': f'Missing required field: {field}'
                    }), 400

            # Create lead from contact form
            lead_data = {
                'id': int(datetime.now().timestamp() * 1000),  # Simple ID generation
                'name': data['name'],
                'phone': data['phone'],
                'email': data.get('email', ''),
                'address': data.get('address', ''),
                'service': data['service'],
                'description': data['description'],
                'urgency': data.get('urgency', 'medium'),
                'source': 'website',
                'estimatedValue': data.get('estimatedValue', 0),
                'notes': '',
                'status': 'new',
                'date': datetime.now().strftime('%Y-%m-%d'),
                'created_at': datetime.now().isoformat()
            }

            # Load existing leads and add new one
            leads = load_leads()
            leads.append(lead_data)
            
            if save_leads(leads):
                print(f"✅ New lead saved: {lead_data['name']} - {lead_data['service']}")
                return jsonify({
                    'success': True,
                    'message': 'Contact form submitted successfully!',
                    'lead_id': lead_data['id']
                })
            else:
                return jsonify({
                    'success': False,
                    'message': 'Error saving contact information'
                }), 500

        except Exception as e:
            print(f"❌ Error in contact submission: {e}")
            return jsonify({
                'success': False,
                'message': 'Server error processing contact form'
            }), 500

    @app.route('/api/services', methods=['GET'])
    def get_services():
        """Get list of available services"""
        services = [
            {
                'id': 'plumbing',
                'name': 'Plumbing Repair',
                'description': 'Leak repairs, fixture installation, pipe maintenance',
                'icon': '🔧',
                'pricing': 'Starting at $85/hour'
            },
            {
                'id': 'electrical',
                'name': 'Electrical Work',
                'description': 'Outlet installation, lighting, electrical repairs',
                'icon': '⚡',
                'pricing': 'Starting at $95/hour'
            },
            {
                'id': 'kitchen',
                'name': 'Kitchen Repair',
                'description': 'Cabinet repair, countertop fixes, appliance installation',
                'icon': '🏠',
                'pricing': 'Starting at $85/hour'
            },
            {
                'id': 'bathroom',
                'name': 'Bathroom Remodel',
                'description': 'Full bathroom renovation and repairs',
                'icon': '🚿',
                'pricing': 'Project-based pricing'
            },
            {
                'id': 'deck',
                'name': 'Deck Installation',
                'description': 'Custom deck construction and repair',
                'icon': '🏗️',
                'pricing': 'Project-based pricing'
            },
            {
                'id': 'fence',
                'name': 'Fence Repair',
                'description': 'Fence installation and maintenance',
                'icon': '🏡',
                'pricing': 'Starting at $125/section'
            },
            {
                'id': 'painting',
                'name': 'Painting',
                'description': 'Interior and exterior painting services',
                'icon': '🎨',
                'pricing': 'Starting at $3/sq ft'
            },
            {
                'id': 'drywall',
                'name': 'Drywall Repair',
                'description': 'Hole repair, texture matching, painting',
                'icon': '🔨',
                'pricing': 'Starting at $150/repair'
            }
        ]
        
        return jsonify({
            'success': True,
            'services': services
        })

    @app.route('/api/quote', methods=['POST'])
    def request_quote():
        """Handle quote requests from the public website"""
        try:
            data = request.get_json()
            
            # Similar to contact but specifically for quotes
            required_fields = ['name', 'phone', 'service']
            for field in required_fields:
                if not data.get(field):
                    return jsonify({
                        'success': False,
                        'message': f'Missing required field: {field}'
                    }), 400

            # Create lead from quote request
            lead_data = {
                'id': int(datetime.now().timestamp() * 1000),
                'name': data['name'],
                'phone': data['phone'],
                'email': data.get('email', ''),
                'address': data.get('address', ''),
                'service': data['service'],
                'description': data.get('description', 'Quote request'),
                'urgency': data.get('urgency', 'medium'),
                'source': 'quote_request',
                'estimatedValue': data.get('estimatedValue', 0),
                'notes': f"Quote requested for {data['service']}",
                'status': 'new',
                'date': datetime.now().strftime('%Y-%m-%d'),
                'created_at': datetime.now().isoformat(),
                'type': 'quote'
            }

            leads = load_leads()
            leads.append(lead_data)
            
            if save_leads(leads):
                return jsonify({
                    'success': True,
                    'message': 'Quote request submitted successfully!',
                    'lead_id': lead_data['id']
                })
            else:
                return jsonify({
                    'success': False,
                    'message': 'Error saving quote request'
                }), 500

        except Exception as e:
            print(f"❌ Error in quote request: {e}")
            return jsonify({
                'success': False,
                'message': 'Server error processing quote request'
            }), 500

    @app.route('/api/chatbot', methods=['POST'])
    def chatbot_response():
        """Handle chatbot interactions"""
        try:
            data = request.get_json()
            message = data.get('message', '').lower()

            # Simple rule-based responses (in production, use AI/ML)
            responses = {
                'hello': 'Hi! I\'m here to help with your handyman needs. What service are you looking for?',
                'services': 'We offer plumbing, electrical, kitchen repair, bathroom remodeling, deck installation, fence repair, painting, and drywall repair.',
                'pricing': 'Our rates start at $85/hour for most services. Would you like a free estimate?',
                'emergency': 'For emergencies, please call us directly at (480) 555-HANDY. We offer 24/7 emergency services.',
                'quote': 'I can help you get a quote! What type of work do you need done?',
                'contact': 'You can reach us at (480) 555-HANDY or fill out our contact form for a quick response.',
                'availability': 'We\'re available Monday through Saturday, 7 AM to 7 PM. Emergency services available 24/7.',
                'licensed': 'Yes, we\'re fully licensed, bonded, and insured in Arizona. License #ROC123456.',
                'warranty': 'All our work comes with a 1-year warranty on labor and we use manufacturer warranties on parts.'
            }

            # Find best matching response
            response_text = "I'd be happy to help! For specific questions about your project, please call us at (480) 555-HANDY or fill out our contact form."
            
            for keyword, response in responses.items():
                if keyword in message:
                    response_text = response
                    break

            return jsonify({
                'success': True,
                'response': response_text,
                'timestamp': datetime.now().isoformat()
            })

        except Exception as e:
            print(f"❌ Error in chatbot: {e}")
            return jsonify({
                'success': False,
                'response': 'Sorry, I\'m having trouble right now. Please call us at (480) 555-HANDY for immediate help.'
            }), 500
