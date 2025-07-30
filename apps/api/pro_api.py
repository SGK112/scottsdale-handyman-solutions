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

    @app.route('/api/pro/auth/signup', methods=['POST'])
    def pro_signup():
        """Enhanced contractor application submission with file uploads"""
        try:
            # Handle both JSON and FormData
            if request.content_type and 'multipart/form-data' in request.content_type:
                # Handle file uploads
                data = request.form.to_dict()
                files = request.files
                
                # Parse JSON fields
                if 'specialties' in data:
                    data['specialties'] = json.loads(data['specialties'])
                if 'serviceAreas' in data:
                    data['serviceAreas'] = json.loads(data['serviceAreas'])
                if 'references' in data:
                    data['references'] = json.loads(data['references'])
                if 'certifications' in data:
                    data['certifications'] = json.loads(data['certifications'])
                if 'preferredJobTypes' in data:
                    data['preferredJobTypes'] = json.loads(data['preferredJobTypes'])
            else:
                # Handle JSON request
                data = request.get_json()
                files = {}
            
            # Validate required fields for comprehensive application
            required_fields = ['fullName', 'email', 'phone', 'experience']
            missing_fields = [field for field in required_fields if not data.get(field)]
            
            if missing_fields:
                return jsonify({
                    'success': False,
                    'message': f'Missing required fields: {", ".join(missing_fields)}'
                }), 400
            
            # Load existing pros
            PROS_FILE = os.path.join(os.path.dirname(__file__), 'pros.json')
            pros = load_json_file(PROS_FILE, [])
            
            # Check for existing email
            existing_pro = next((p for p in pros if p['email'] == data['email']), None)
            if existing_pro:
                return jsonify({
                    'success': False,
                    'message': 'Email already exists in our system'
                }), 400
            
            # Create uploads directory
            uploads_dir = os.path.join(os.path.dirname(__file__), 'uploads', 'contractors')
            os.makedirs(uploads_dir, exist_ok=True)
            
            # Process file uploads
            uploaded_files = {}
            contractor_id = int(datetime.now().timestamp() * 1000)
            
            # Handle single files
            single_file_fields = ['profilePhoto', 'licenseDocument']
            for field in single_file_fields:
                if field in files and files[field].filename:
                    file = files[field]
                    filename = f"{contractor_id}_{field}_{file.filename}"
                    filepath = os.path.join(uploads_dir, filename)
                    file.save(filepath)
                    uploaded_files[field] = filename
            
            # Handle multiple files (arrays)
            multi_file_fields = ['insuranceDocuments', 'certificationDocuments', 'portfolioImages']
            for field in multi_file_fields:
                uploaded_files[field] = []
                # Handle multiple files with array notation like field[0], field[1], etc.
                for key in files.keys():
                    if key.startswith(f"{field}[") and files[key].filename:
                        file = files[key]
                        filename = f"{contractor_id}_{field}_{len(uploaded_files[field])}_{file.filename}"
                        filepath = os.path.join(uploads_dir, filename)
                        file.save(filepath)
                        uploaded_files[field].append(filename)
            
            # Create comprehensive contractor profile
            new_contractor = {
                'id': contractor_id,
                'email': data['email'],
                'fullName': data['fullName'],
                'phone': data['phone'],
                'businessName': data.get('businessName', ''),
                'website': data.get('website', ''),
                
                # Professional Details
                'licenseNumber': data.get('licenseNumber', ''),
                'specialties': data.get('specialties', []),
                'experience': data['experience'],
                'serviceAreas': data.get('serviceAreas', []),
                'hourlyRate': float(data.get('hourlyRate', 0)) if data.get('hourlyRate') else 0,
                
                # Insurance & Certifications
                'insurance': {
                    'hasLiability': data.get('hasLiabilityInsurance', 'false').lower() == 'true',
                    'hasBonding': data.get('hasBondingInsurance', 'false').lower() == 'true',
                    'expiryDate': data.get('insuranceExpiryDate', ''),
                    'documents': uploaded_files.get('insuranceDocuments', [])
                },
                'certifications': data.get('certifications', []),
                'certificationDocuments': uploaded_files.get('certificationDocuments', []),
                
                # Work Preferences
                'preferences': {
                    'availableWeekdays': data.get('availableWeekdays', 'true').lower() == 'true',
                    'availableWeekends': data.get('availableWeekends', 'false').lower() == 'true',
                    'availableEvenings': data.get('availableEvenings', 'false').lower() == 'true',
                    'maxDistanceMiles': int(data.get('maxDistanceMiles', 25)),
                    'preferredJobTypes': data.get('preferredJobTypes', [])
                },
                
                # Documents & Media
                'profilePhoto': uploaded_files.get('profilePhoto'),
                'licenseDocument': uploaded_files.get('licenseDocument'),
                'portfolioImages': uploaded_files.get('portfolioImages', []),
                
                # Application Details
                'application': {
                    'whyJoinUs': data.get('whyJoinUs', ''),
                    'previousExperience': data.get('previousExperience', ''),
                    'references': data.get('references', []),
                    'agreeToTerms': data.get('agreeToTerms', 'false').lower() == 'true',
                    'agreeToBackground': data.get('agreeToBackground', 'false').lower() == 'true',
                    'agreeToMarketing': data.get('agreeToMarketing', 'false').lower() == 'true'
                },
                
                # System Fields
                'status': 'pending',  # pending, under_review, approved, rejected
                'createdAt': datetime.now().isoformat(),
                'reviewedAt': None,
                'approvedAt': None,
                'reviewNotes': '',
                'rating': 0.0,
                'completedJobs': 0,
                'totalEarnings': 0.0,
                'isActive': False,  # Activated after approval
                
                # Generated username (can be changed later)
                'username': data['email'].split('@')[0] + str(contractor_id)[-4:]
            }
            
            # Add to contractors list
            pros.append(new_contractor)
            
            # Save to file
            if save_json_file(PROS_FILE, pros):
                # Send notification email to admin (in production)
                print(f"📧 New contractor application: {data['fullName']} ({data['email']})")
                print(f"   Specialties: {data.get('specialties', [])}")
                print(f"   Service Areas: {data.get('serviceAreas', [])}")
                print(f"   Experience: {data['experience']}")
                print(f"   Files uploaded: {list(uploaded_files.keys())}")
                
                return jsonify({
                    'success': True,
                    'message': 'Your contractor application has been submitted successfully! We\'ll review your application and contact you within 24-48 hours.',
                    'application': {
                        'id': new_contractor['id'],
                        'fullName': new_contractor['fullName'],
                        'email': new_contractor['email'],
                        'status': new_contractor['status'],
                        'specialties': new_contractor['specialties'],
                        'submittedAt': new_contractor['createdAt']
                    }
                })
            else:
                return jsonify({
                    'success': False,
                    'message': 'Failed to save application'
                }), 500
                
        except Exception as e:
            print(f"❌ Error in contractor application: {e}")
            import traceback
            traceback.print_exc()
            return jsonify({
                'success': False,
                'message': 'Server error during application submission'
            }), 500

    # Pro Management endpoints (Admin only)
    @app.route('/api/pro/pros', methods=['GET'])
    def get_all_pros():
        """Get all registered pros for admin management"""
        try:
            PROS_FILE = os.path.join(os.path.dirname(__file__), 'pros.json')
            pros = load_json_file(PROS_FILE, [])
            
            # Remove sensitive data (passwords) before sending
            safe_pros = []
            for pro in pros:
                safe_pro = {k: v for k, v in pro.items() if k != 'password'}
                safe_pros.append(safe_pro)
            
            return jsonify({
                'success': True,
                'pros': safe_pros,
                'total': len(safe_pros),
                'pending': len([p for p in pros if p['status'] == 'pending']),
                'approved': len([p for p in pros if p['status'] == 'approved']),
                'suspended': len([p for p in pros if p['status'] == 'suspended'])
            })
        except Exception as e:
            print(f"❌ Error fetching pros: {e}")
            return jsonify({
                'success': False,
                'message': 'Error fetching pros'
            }), 500

    @app.route('/api/pro/pros/<int:pro_id>/approve', methods=['POST'])
    def approve_pro(pro_id):
        """Approve a pending pro registration"""
        try:
            PROS_FILE = os.path.join(os.path.dirname(__file__), 'pros.json')
            pros = load_json_file(PROS_FILE, [])
            
            # Find the pro
            pro_index = next((i for i, p in enumerate(pros) if p['id'] == pro_id), None)
            if pro_index is None:
                return jsonify({
                    'success': False,
                    'message': 'Pro not found'
                }), 404
            
            # Update status
            pros[pro_index]['status'] = 'approved'
            pros[pro_index]['approvedAt'] = datetime.now().isoformat()
            
            # Save changes
            if save_json_file(PROS_FILE, pros):
                print(f"✅ Pro approved: {pros[pro_index]['fullName']} ({pros[pro_index]['email']})")
                return jsonify({
                    'success': True,
                    'message': 'Pro approved successfully',
                    'pro': {k: v for k, v in pros[pro_index].items() if k != 'password'}
                })
            else:
                return jsonify({
                    'success': False,
                    'message': 'Failed to save approval'
                }), 500
                
        except Exception as e:
            print(f"❌ Error approving pro: {e}")
            return jsonify({
                'success': False,
                'message': 'Error approving pro'
            }), 500

    @app.route('/api/pro/pros/<int:pro_id>/suspend', methods=['POST'])
    def suspend_pro(pro_id):
        """Suspend a pro"""
        try:
            PROS_FILE = os.path.join(os.path.dirname(__file__), 'pros.json')
            pros = load_json_file(PROS_FILE, [])
            
            # Find the pro
            pro_index = next((i for i, p in enumerate(pros) if p['id'] == pro_id), None)
            if pro_index is None:
                return jsonify({
                    'success': False,
                    'message': 'Pro not found'
                }), 404
            
            # Update status
            pros[pro_index]['status'] = 'suspended'
            pros[pro_index]['suspendedAt'] = datetime.now().isoformat()
            
            # Save changes
            if save_json_file(PROS_FILE, pros):
                print(f"⚠️ Pro suspended: {pros[pro_index]['fullName']} ({pros[pro_index]['email']})")
                return jsonify({
                    'success': True,
                    'message': 'Pro suspended successfully',
                    'pro': {k: v for k, v in pros[pro_index].items() if k != 'password'}
                })
            else:
                return jsonify({
                    'success': False,
                    'message': 'Failed to save suspension'
                }), 500
                
        except Exception as e:
            print(f"❌ Error suspending pro: {e}")
            return jsonify({
                'success': False,
                'message': 'Error suspending pro'
            }), 500

    @app.route('/api/pro/pros/<int:pro_id>/reject', methods=['POST'])
    def reject_pro(pro_id):
        """Reject a pending pro application"""
        try:
            data = request.get_json() or {}
            notes = data.get('notes', '')
            
            PROS_FILE = os.path.join(os.path.dirname(__file__), 'pros.json')
            pros = load_json_file(PROS_FILE, [])
            
            # Find the pro
            pro_index = next((i for i, p in enumerate(pros) if p['id'] == pro_id), None)
            if pro_index is None:
                return jsonify({
                    'success': False,
                    'message': 'Pro not found'
                }), 404
            
            # Update status
            pros[pro_index]['status'] = 'rejected'
            pros[pro_index]['rejectedAt'] = datetime.now().isoformat()
            pros[pro_index]['reviewNotes'] = notes
            
            # Save changes
            if save_json_file(PROS_FILE, pros):
                print(f"❌ Pro rejected: {pros[pro_index]['fullName']} ({pros[pro_index]['email']}) - Reason: {notes}")
                return jsonify({
                    'success': True,
                    'message': 'Pro application rejected',
                    'pro': {k: v for k, v in pros[pro_index].items() if k != 'password'}
                })
            else:
                return jsonify({
                    'success': False,
                    'message': 'Failed to save rejection'
                }), 500
                
        except Exception as e:
            print(f"❌ Error rejecting pro: {e}")
            return jsonify({
                'success': False,
                'message': 'Error rejecting pro'
            }), 500
                
        except Exception as e:
            print(f"❌ Error suspending pro: {e}")
            return jsonify({
                'success': False,
                'message': 'Error suspending pro'
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
