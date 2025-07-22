# Pro API Routes - Business management endpoints
from flask import request, jsonify
import json
import os
from datetime import datetime

def create_pro_routes(app):
    """Create all Pro Portal API routes for business management"""

    # Storage files (in production, use a database)
    LEADS_FILE = os.path.join(os.path.dirname(__file__), 'leads.json')
    INVOICES_FILE = os.path.join(os.path.dirname(__file__), 'invoices.json')
    PROJECTS_FILE = os.path.join(os.path.dirname(__file__), 'projects.json')
    
    def load_json_file(filepath, default=[]):
        """Load data from JSON file"""
        try:
            with open(filepath, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            return default
    
    def save_json_file(filepath, data):
        """Save data to JSON file"""
        try:
            os.makedirs(os.path.dirname(filepath), exist_ok=True)
            with open(filepath, 'w') as f:
                json.dump(data, f, indent=2)
            return True
        except Exception as e:
            print(f"Error saving to {filepath}: {e}")
            return False

    # Pro Portal Authentication endpoints
    @app.route('/api/pro/auth/login', methods=['POST'])
    def pro_login():
        """Handle pro portal login"""
        try:
            data = request.get_json()
            username = data.get('username')
            password = data.get('password')
            
            # Simple authentication (in production, use proper auth)
            if username == 'admin' and password == 'scottsdaleHandyman2025!':
                return jsonify({
                    'success': True,
                    'message': 'Login successful',
                    'token': 'pro_authenticated',  # In production, use JWT
                    'user': {
                        'username': username,
                        'role': 'admin'
                    }
                })
            else:
                return jsonify({
                    'success': False,
                    'message': 'Invalid credentials'
                }), 401
                
        except Exception as e:
            print(f"❌ Error in pro login: {e}")
            return jsonify({
                'success': False,
                'message': 'Server error during login'
            }), 500

    # Lead Management endpoints
    @app.route('/api/pro/leads', methods=['GET'])
    def get_all_leads():
        """Get all leads for the pro dashboard"""
        try:
            leads = load_json_file(LEADS_FILE, [])
            return jsonify({
                'success': True,
                'leads': leads,
                'total': len(leads)
            })
        except Exception as e:
            print(f"❌ Error fetching leads: {e}")
            return jsonify({
                'success': False,
                'message': 'Error fetching leads'
            }), 500

    @app.route('/api/pro/leads', methods=['POST'])
    def create_lead():
        """Create a new lead"""
        try:
            data = request.get_json()
            
            # Validate required fields
            required_fields = ['name', 'phone', 'service']
            for field in required_fields:
                if not data.get(field):
                    return jsonify({
                        'success': False,
                        'message': f'Missing required field: {field}'
                    }), 400

            # Create new lead
            lead_data = {
                'id': int(datetime.now().timestamp() * 1000),
                'name': data['name'],
                'phone': data['phone'],
                'email': data.get('email', ''),
                'address': data.get('address', ''),
                'service': data['service'],
                'description': data.get('description', ''),
                'urgency': data.get('urgency', 'medium'),
                'source': data.get('source', 'manual'),
                'value': float(data.get('estimatedValue', 0)),
                'notes': data.get('notes', ''),
                'status': 'new',
                'date': datetime.now().strftime('%Y-%m-%d'),
                'created_at': datetime.now().isoformat(),
                'updated_at': datetime.now().isoformat()
            }

            leads = load_json_file(LEADS_FILE, [])
            leads.append(lead_data)
            
            if save_json_file(LEADS_FILE, leads):
                print(f"✅ Pro: New lead created: {lead_data['name']} - {lead_data['service']}")
                return jsonify({
                    'success': True,
                    'message': 'Lead created successfully',
                    'lead': lead_data
                })
            else:
                return jsonify({
                    'success': False,
                    'message': 'Error saving lead'
                }), 500

        except Exception as e:
            print(f"❌ Error creating lead: {e}")
            return jsonify({
                'success': False,
                'message': 'Server error creating lead'
            }), 500

    @app.route('/api/pro/leads/<int:lead_id>', methods=['PUT'])
    def update_lead(lead_id):
        """Update an existing lead"""
        try:
            data = request.get_json()
            leads = load_json_file(LEADS_FILE, [])
            
            # Find and update lead
            lead_found = False
            for lead in leads:
                if lead['id'] == lead_id:
                    lead.update(data)
                    lead['updated_at'] = datetime.now().isoformat()
                    lead_found = True
                    break
            
            if not lead_found:
                return jsonify({
                    'success': False,
                    'message': 'Lead not found'
                }), 404
            
            if save_json_file(LEADS_FILE, leads):
                return jsonify({
                    'success': True,
                    'message': 'Lead updated successfully'
                })
            else:
                return jsonify({
                    'success': False,
                    'message': 'Error updating lead'
                }), 500

        except Exception as e:
            print(f"❌ Error updating lead: {e}")
            return jsonify({
                'success': False,
                'message': 'Server error updating lead'
            }), 500

    @app.route('/api/pro/leads/<int:lead_id>', methods=['DELETE'])
    def delete_lead(lead_id):
        """Delete a lead"""
        try:
            leads = load_json_file(LEADS_FILE, [])
            original_length = len(leads)
            
            # Remove lead
            leads = [lead for lead in leads if lead['id'] != lead_id]
            
            if len(leads) == original_length:
                return jsonify({
                    'success': False,
                    'message': 'Lead not found'
                }), 404
            
            if save_json_file(LEADS_FILE, leads):
                return jsonify({
                    'success': True,
                    'message': 'Lead deleted successfully'
                })
            else:
                return jsonify({
                    'success': False,
                    'message': 'Error deleting lead'
                }), 500

        except Exception as e:
            print(f"❌ Error deleting lead: {e}")
            return jsonify({
                'success': False,
                'message': 'Server error deleting lead'
            }), 500

    # Dashboard Analytics endpoints
    @app.route('/api/pro/analytics/dashboard', methods=['GET'])
    def get_dashboard_analytics():
        """Get dashboard analytics data"""
        try:
            leads = load_json_file(LEADS_FILE, [])
            
            # Calculate analytics
            total_leads = len(leads)
            new_leads = len([l for l in leads if l.get('status') == 'new'])
            pipeline_value = sum([float(l.get('value', 0)) for l in leads])
            conversion_rate = len([l for l in leads if l.get('status') == 'won']) / max(total_leads, 1) * 100
            
            # Recent activity
            recent_leads = sorted(leads, key=lambda x: x.get('created_at', ''), reverse=True)[:5]
            
            return jsonify({
                'success': True,
                'analytics': {
                    'total_leads': total_leads,
                    'new_leads': new_leads,
                    'pipeline_value': pipeline_value,
                    'conversion_rate': round(conversion_rate, 1),
                    'recent_leads': recent_leads
                }
            })
            
        except Exception as e:
            print(f"❌ Error fetching analytics: {e}")
            return jsonify({
                'success': False,
                'message': 'Error fetching analytics'
            }), 500

    # Invoice Management endpoints
    @app.route('/api/pro/invoices', methods=['GET'])
    def get_invoices():
        """Get all invoices"""
        try:
            invoices = load_json_file(INVOICES_FILE, [])
            return jsonify({
                'success': True,
                'invoices': invoices
            })
        except Exception as e:
            print(f"❌ Error fetching invoices: {e}")
            return jsonify({
                'success': False,
                'message': 'Error fetching invoices'
            }), 500

    @app.route('/api/pro/invoices', methods=['POST'])
    def create_invoice():
        """Create a new invoice"""
        try:
            data = request.get_json()
            
            invoice_data = {
                'id': f"INV-{int(datetime.now().timestamp())}",
                'client': data['client'],
                'amount': float(data['amount']),
                'status': 'pending',
                'date': datetime.now().strftime('%Y-%m-%d'),
                'due_date': data.get('due_date'),
                'items': data.get('items', []),
                'notes': data.get('notes', ''),
                'created_at': datetime.now().isoformat()
            }

            invoices = load_json_file(INVOICES_FILE, [])
            invoices.append(invoice_data)
            
            if save_json_file(INVOICES_FILE, invoices):
                return jsonify({
                    'success': True,
                    'message': 'Invoice created successfully',
                    'invoice': invoice_data
                })
            else:
                return jsonify({
                    'success': False,
                    'message': 'Error creating invoice'
                }), 500

        except Exception as e:
            print(f"❌ Error creating invoice: {e}")
            return jsonify({
                'success': False,
                'message': 'Server error creating invoice'
            }), 500

    # Project Management endpoints
    @app.route('/api/pro/projects', methods=['GET'])
    def get_projects():
        """Get all projects"""
        try:
            projects = load_json_file(PROJECTS_FILE, [])
            return jsonify({
                'success': True,
                'projects': projects
            })
        except Exception as e:
            print(f"❌ Error fetching projects: {e}")
            return jsonify({
                'success': False,
                'message': 'Error fetching projects'
            }), 500

    @app.route('/api/pro/reports/monthly', methods=['GET'])
    def get_monthly_report():
        """Generate monthly business report"""
        try:
            leads = load_json_file(LEADS_FILE, [])
            invoices = load_json_file(INVOICES_FILE, [])
            
            # Calculate monthly metrics
            current_month = datetime.now().strftime('%Y-%m')
            monthly_leads = [l for l in leads if l.get('date', '').startswith(current_month)]
            monthly_revenue = sum([float(i.get('amount', 0)) for i in invoices 
                                 if i.get('status') == 'paid' and i.get('date', '').startswith(current_month)])
            
            return jsonify({
                'success': True,
                'report': {
                    'month': current_month,
                    'leads_generated': len(monthly_leads),
                    'revenue': monthly_revenue,
                    'conversion_rate': len([l for l in monthly_leads if l.get('status') == 'won']) / max(len(monthly_leads), 1) * 100
                }
            })
            
        except Exception as e:
            print(f"❌ Error generating report: {e}")
            return jsonify({
                'success': False,
                'message': 'Error generating report'
            }), 500
