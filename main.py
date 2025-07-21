import os
import sys
import time
import stripe
import mimetypes
from dotenv import load_dotenv
try:
    from pymongo import MongoClient
    from bson import ObjectId
    PYMONGO_AVAILABLE = True
except ImportError:
    PYMONGO_AVAILABLE = False
    MongoClient = None
    ObjectId = None
import base64
import json

from flask import Flask, send_from_directory, request, jsonify, Response
from flask_cors import CORS
from flask_mail import Mail, Message

# Load environment variables
load_dotenv()

app = Flask(__name__, static_folder='dist')
app.config['SECRET_KEY'] = os.getenv('FLASK_SECRET_KEY', 'asdf#FGSgvasgf$5$WGT')

# Configure MIME types for JavaScript modules
mimetypes.add_type('application/javascript', '.js')
mimetypes.add_type('application/javascript', '.mjs')
mimetypes.add_type('text/css', '.css')

# Enable CORS for all routes
CORS(app)

# MongoDB configuration (optional - add to .env if you want to use MongoDB)
MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/')
MONGODB_DATABASE = os.getenv('MONGODB_DATABASE', 'handyman_db')

# Initialize MongoDB client (optional)
mongo_client = None
mongo_db = None
try:
    if MONGODB_URI:
        mongo_client = MongoClient(MONGODB_URI)
        mongo_db = mongo_client[MONGODB_DATABASE]
        print(f"MongoDB connected to {MONGODB_DATABASE}")
except Exception as e:
    print(f"MongoDB connection failed: {e}")
    mongo_client = None
    mongo_db = None

# Stripe configuration
ENVIRONMENT = os.getenv('ENVIRONMENT', 'development')
if ENVIRONMENT == 'production':
    stripe.api_key = os.getenv('STRIPE_SECRET_KEY_LIVE')
    STRIPE_PUBLISHABLE_KEY = os.getenv('STRIPE_PUBLISHABLE_KEY_LIVE')
    WEBHOOK_SECRET = os.getenv('STRIPE_WEBHOOK_SECRET_LIVE')
else:
    stripe.api_key = os.getenv('STRIPE_SECRET_KEY')
    STRIPE_PUBLISHABLE_KEY = os.getenv('STRIPE_PUBLISHABLE_KEY')
    WEBHOOK_SECRET = os.getenv('STRIPE_WEBHOOK_SECRET')

# Email configuration
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'help.scottsdalehandyman@gmail.com'
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD', 'nfsx nosf sfbp ckmp')
app.config['MAIL_DEFAULT_SENDER'] = 'help.scottsdalehandyman@gmail.com'

# Initialize Mail
mail = Mail(app)

# Routes will be added here when src structure is created

# Health check endpoint
@app.route('/health', methods=['GET'])
@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint for monitoring and load balancers"""
    health_status = {
        'status': 'healthy',
        'timestamp': json.dumps(str(stripe.api_key is not None)),
        'services': {
            'flask': 'running',
            'mongodb': 'connected' if mongo_db is not None else 'disconnected',
            'stripe': 'configured' if stripe.api_key else 'not configured',
            'mail': 'configured' if app.config.get('MAIL_PASSWORD') else 'not configured'
        },
        'version': '2.0.0'
    }
    
    # Simple health check - return 200 if basic services are running
    status_code = 200
    if mongo_db is None:
        health_status['status'] = 'degraded'
        
    return jsonify(health_status), status_code

# Metrics endpoint for monitoring
@app.route('/api/metrics', methods=['GET'])
def metrics():
    """Basic metrics endpoint"""
    try:
        # You could integrate with prometheus_client here
        return jsonify({
            'requests_total': 'not_implemented',
            'mongodb_connected': mongo_db is not None,
            'stripe_configured': stripe.api_key is not None
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Chatbot logging endpoint
@app.route('/api/chatbot-log', methods=['POST'])
def chatbot_log():
    try:
        data = request.get_json()
        query = data.get('query', '')
        response = data.get('response', '')
        timestamp = data.get('timestamp', '')
        
        print(f"[{timestamp}] Chatbot Query: {query}")
        print(f"[{timestamp}] Chatbot Response: {response}")
        
        return jsonify({'status': 'success', 'message': 'Logged successfully'})
    except Exception as e:
        print(f"Error logging chatbot interaction: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 500

# MongoDB Gallery Images endpoint
@app.route('/api/gallery-images', methods=['GET'])
def get_gallery_images():
    try:
        if mongo_db is None:
            return jsonify({
                'success': False, 
                'error': 'MongoDB not connected',
                'images': []
            })
        
        category = request.args.get('category')
        
        # Build query filter
        query_filter = {}
        if category:
            query_filter['category'] = category
        
        # Fetch images from MongoDB
        images = list(mongo_db.project_images.find(query_filter, {
            'title': 1,
            'description': 1,
            'imageData': 1,
            'contentType': 1,
            'category': 1,
            'filename': 1,
            'uploadDate': 1
        }).limit(50))  # Limit to prevent large responses
        
        # Convert ObjectId to string for JSON serialization
        for image in images:
            image['_id'] = str(image['_id'])
        
        return jsonify({
            'success': True,
            'images': images,
            'count': len(images)
        })
    except Exception as e:
        print(f"Error fetching gallery images: {e}")
        return jsonify({
            'success': False,
            'error': str(e),
            'images': []
        })

# Upload image to MongoDB (for admin use)
@app.route('/api/upload-image', methods=['POST'])
def upload_image():
    try:
        if mongo_db is None:
            return jsonify({
                'success': False,
                'error': 'MongoDB not connected'
            }), 500
        
        data = request.get_json()
        
        # Validate required fields
        if not data.get('imageData') or not data.get('contentType'):
            return jsonify({
                'success': False,
                'error': 'Missing required fields: imageData, contentType'
            }), 400
        
        # Insert image into MongoDB
        image_doc = {
            'title': data.get('title', 'Untitled Project'),
            'description': data.get('description', ''),
            'imageData': data['imageData'],
            'contentType': data['contentType'],
            'category': data.get('category', 'general'),
            'filename': data.get('filename', 'uploaded_image'),
            'uploadDate': data.get('uploadDate'),
            'tags': data.get('tags', []),
            'fileSize': data.get('fileSize', 0),
            'uploadedBy': 'admin',
            'isActive': True
        }
        
        result = mongo_db.project_images.insert_one(image_doc)
        
        return jsonify({
            'success': True,
            'imageId': str(result.inserted_id),
            'message': 'Image uploaded successfully'
        })
        
    except Exception as e:
        print(f"Error uploading image: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# Media Library - Get all files with filtering/pagination
@app.route('/api/media-library', methods=['GET'])
def get_media_library():
    try:
        if mongo_db is None:
            return jsonify({
                'success': False,
                'error': 'MongoDB not connected',
                'files': []
            }), 500
        
        # Get query parameters
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 20))
        file_type = request.args.get('type', 'all')  # all, images, documents
        search = request.args.get('search', '')
        category = request.args.get('category', '')
        
        # Build query filter
        query_filter = {'isActive': True}
        
        if file_type == 'images':
            query_filter['contentType'] = {'$regex': '^image/'}
        elif file_type == 'documents':
            query_filter['contentType'] = {'$not': {'$regex': '^image/'}}
        
        if search:
            query_filter['$or'] = [
                {'title': {'$regex': search, '$options': 'i'}},
                {'description': {'$regex': search, '$options': 'i'}},
                {'filename': {'$regex': search, '$options': 'i'}},
                {'tags': {'$regex': search, '$options': 'i'}}
            ]
        
        if category:
            query_filter['category'] = category
        
        # Get total count
        total_count = mongo_db.project_images.count_documents(query_filter)
        
        # Get paginated results
        skip = (page - 1) * limit
        files = list(mongo_db.project_images.find(
            query_filter,
            {
                'title': 1,
                'description': 1,
                'filename': 1,
                'contentType': 1,
                'category': 1,
                'tags': 1,
                'fileSize': 1,
                'uploadDate': 1,
                'uploadedBy': 1,
                'imageData': {'$substr': ['$imageData', 0, 100]}  # Thumbnail preview
            }
        ).sort('uploadDate', -1).skip(skip).limit(limit))
        
        # Convert ObjectId to string
        for file in files:
            file['_id'] = str(file['_id'])
            # Create thumbnail URL
            file['thumbnailUrl'] = f'/api/images/{file["_id"]}?format=thumbnail'
            file['fullUrl'] = f'/api/images/{file["_id"]}?format=binary'
        
        return jsonify({
            'success': True,
            'files': files,
            'pagination': {
                'page': page,
                'limit': limit,
                'total': total_count,
                'pages': (total_count + limit - 1) // limit
            }
        })
        
    except Exception as e:
        print(f"Error fetching media library: {e}")
        return jsonify({
            'success': False,
            'error': str(e),
            'files': []
        }), 500

# Update media file metadata
@app.route('/api/media/<file_id>', methods=['PUT'])
def update_media_file(file_id):
    try:
        if mongo_db is None:
            return jsonify({'success': False, 'error': 'MongoDB not connected'}), 500
        
        data = request.get_json()
        
        # Update fields
        update_data = {}
        if 'title' in data:
            update_data['title'] = data['title']
        if 'description' in data:
            update_data['description'] = data['description']
        if 'category' in data:
            update_data['category'] = data['category']
        if 'tags' in data:
            update_data['tags'] = data['tags']
        
        result = mongo_db.project_images.update_one(
            {'_id': ObjectId(file_id)},
            {'$set': update_data}
        )
        
        if result.modified_count > 0:
            return jsonify({'success': True, 'message': 'File updated successfully'})
        else:
            return jsonify({'success': False, 'error': 'File not found or no changes made'}), 404
        
    except Exception as e:
        print(f"Error updating media file: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

# Delete media file
@app.route('/api/media/<file_id>', methods=['DELETE'])
def delete_media_file(file_id):
    try:
        if mongo_db is None:
            return jsonify({'success': False, 'error': 'MongoDB not connected'}), 500
        
        # Soft delete (mark as inactive)
        result = mongo_db.project_images.update_one(
            {'_id': ObjectId(file_id)},
            {'$set': {'isActive': False}}
        )
        
        if result.modified_count > 0:
            return jsonify({'success': True, 'message': 'File deleted successfully'})
        else:
            return jsonify({'success': False, 'error': 'File not found'}), 404
        
    except Exception as e:
        print(f"Error deleting media file: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

# Get single image by ID
@app.route('/api/images/<image_id>', methods=['GET'])
def get_image(image_id):
    try:
        if mongo_db is None:
            return jsonify({'error': 'MongoDB not connected'}), 500
        
        # Find image by ObjectId
        image = mongo_db.project_images.find_one({'_id': ObjectId(image_id)})
        
        if not image:
            return jsonify({'error': 'Image not found'}), 404
        
        format_type = request.args.get('format', 'json')
        
        if format_type == 'binary':
            # Return full size binary image data
            image_binary = base64.b64decode(image['imageData'])
            return Response(
                image_binary,
                mimetype=image['contentType'],
                headers={
                    'Content-Disposition': f'inline; filename="{image.get("filename", "image")}"',
                    'Cache-Control': 'public, max-age=3600'
                }
            )
        elif format_type == 'thumbnail':
            # Return thumbnail version (first 2000 chars of base64 for preview)
            thumbnail_data = image['imageData'][:2000] + '=='  # Add padding if needed
            try:
                image_binary = base64.b64decode(thumbnail_data)
                return Response(
                    image_binary,
                    mimetype=image['contentType'],
                    headers={
                        'Content-Disposition': f'inline; filename="thumb_{image.get("filename", "image")}"',
                        'Cache-Control': 'public, max-age=7200'
                    }
                )
            except:
                # Fallback to JSON if thumbnail generation fails
                return jsonify({
                    'success': True,
                    'thumbnailUrl': f'/api/images/{image_id}?format=binary'
                })
        else:
            # Return JSON with image metadata
            return jsonify({
                'success': True,
                'image': {
                    '_id': str(image['_id']),
                    'title': image.get('title'),
                    'description': image.get('description'),
                    'contentType': image['contentType'],
                    'category': image.get('category'),
                    'filename': image.get('filename'),
                    'fileSize': image.get('fileSize', 0),
                    'uploadDate': image.get('uploadDate'),
                    'tags': image.get('tags', []),
                    'fullUrl': f'/api/images/{image_id}?format=binary',
                    'thumbnailUrl': f'/api/images/{image_id}?format=thumbnail'
                }
            })
    except Exception as e:
        print(f"Error fetching image: {e}")
        return jsonify({'error': str(e)}), 500
def log_chatbot_conversation():
    """Log chatbot conversation to email"""
    try:
        data = request.json
        
        # Extract conversation data
        messages = data.get('messages', [])
        user_info = data.get('userInfo', {})
        conversation_id = data.get('conversationId', 'Unknown')
        
        if not messages:
            return jsonify({'error': 'No messages provided'}), 400
        
        # Format conversation for email
        conversation_text = "CHATBOT CONVERSATION LOG\n"
        conversation_text += "=" * 50 + "\n\n"
        conversation_text += f"Conversation ID: {conversation_id}\n"
        conversation_text += f"Date: {messages[-1].get('timestamp', 'Unknown')}\n"
        
        if user_info:
            conversation_text += f"User Info: {user_info}\n"
        
        conversation_text += "\n" + "-" * 30 + "\n\n"
        
        for msg in messages:
            timestamp = msg.get('timestamp', '')
            message_type = msg.get('type', 'unknown').upper()
            content = msg.get('message', '')
            
            conversation_text += f"[{timestamp}] {message_type}:\n{content}\n\n"
        
        # Send email
        msg = Message(
            subject=f'Chatbot Conversation Log - {conversation_id}',
            recipients=['help.scottsdalehandyman@gmail.com'],
            body=conversation_text
        )
        
        mail.send(msg)
        
        return jsonify({'success': True, 'message': 'Conversation logged successfully'})
        
    except Exception as e:
        print(f"Error logging chatbot conversation: {str(e)}")
        return jsonify({'error': 'Failed to log conversation'}), 500

# Lead Submission Route
@app.route('/api/submit-lead', methods=['POST'])
def submit_lead():
    """Submit lead information collected from chatbot"""
    try:
        data = request.json
        
        # Extract lead data
        customer_name = data.get('customerName', '')
        phone_number = data.get('phoneNumber', '')
        address = data.get('address', '')
        scope_of_work = data.get('scopeOfWork', '')
        notes = data.get('notes', '')
        conversation_id = data.get('conversationId', 'Unknown')
        timestamp = data.get('timestamp', '')
        
        # Validate required fields
        if not customer_name or not phone_number:
            return jsonify({'error': 'Customer name and phone number are required'}), 400
        
        # Format lead email
        email_subject = f'New Lead from Website Chatbot - {customer_name}'
        email_body = f"""
NEW LEAD SUBMISSION
====================

Customer Information:
- Name: {customer_name}
- Phone: {phone_number}
- Address: {address if address else 'Not provided'}

Project Details:
- Scope of Work: {scope_of_work if scope_of_work else 'Not specified'}
- Additional Notes: {notes if notes else 'None'}

Technical Details:
- Conversation ID: {conversation_id}
- Submitted: {timestamp if timestamp else 'Unknown time'}
- Source: Website Chatbot

====================
Follow up with this customer as soon as possible!
        """
        
        # Send lead notification email
        msg = Message(
            subject=email_subject,
            recipients=['help.scottsdalehandyman@gmail.com'],
            body=email_body
        )
        
        mail.send(msg)
        
        # Log to console for debugging
        print(f"Lead submitted: {customer_name} - {phone_number}")
        
        return jsonify({
            'success': True, 
            'message': 'Lead submitted successfully',
            'leadId': conversation_id
        })
        
    except Exception as e:
        print(f"Error submitting lead: {str(e)}")
        return jsonify({'error': 'Failed to submit lead'}), 500

# Admin Authentication Route
@app.route('/api/admin-login', methods=['POST'])
def admin_login():
    """Authenticate admin user against environment variables"""
    try:
        data = request.json
        username = data.get('username')
        password = data.get('password')
        
        # Get admin credentials from environment variables
        env_username = os.getenv('ADMIN_SECRET_KEY')
        env_password = os.getenv('ADMIN_PASSWORD')
        
        if username == env_username and password == env_password:
            # Generate a simple token (in production, use JWT)
            token = f"admin_token_{int(time.time())}"
            return jsonify({
                'success': True, 
                'token': token,
                'message': 'Login successful'
            }), 200
        else:
            return jsonify({
                'success': False, 
                'error': 'Invalid username or password'
            }), 401
            
    except Exception as e:
        print(f"Admin login error: {str(e)}")
        return jsonify({
            'success': False, 
            'error': 'Login failed. Please try again.'
        }), 500

# Stripe Payment Routes
@app.route('/api/stripe-config', methods=['GET'])
def stripe_config():
    """Get Stripe publishable key for frontend"""
    return jsonify({
        'publishableKey': STRIPE_PUBLISHABLE_KEY,
        'environment': ENVIRONMENT
    })

@app.route('/api/create-payment-intent', methods=['POST'])
def create_payment_intent():
    """Create a payment intent for invoice payments"""
    try:
        data = request.get_json()
        
        # Create payment intent
        intent = stripe.PaymentIntent.create(
            amount=int(float(data['amount']) * 100),  # Convert to cents
            currency='usd',
            metadata={
                'invoice_number': data.get('invoiceNumber', ''),
                'customer_name': data.get('customerName', ''),
                'customer_email': data.get('email', ''),
                'customer_phone': data.get('phone', ''),
                'description': data.get('description', ''),
                'source': 'handyman_invoice'
            }
        )
        
        return jsonify({
            'client_secret': intent.client_secret,
            'payment_intent_id': intent.id
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/webhook/stripe', methods=['POST'])
def stripe_webhook():
    """Handle Stripe webhooks"""
    payload = request.get_data(as_text=True)
    sig_header = request.headers.get('Stripe-Signature')
    
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, WEBHOOK_SECRET
        )
    except ValueError as e:
        # Invalid payload
        return 'Invalid payload', 400
    except stripe.error.SignatureVerificationError as e:
        # Invalid signature
        return 'Invalid signature', 400
    
    # Handle the event
    if event['type'] == 'payment_intent.succeeded':
        payment_intent = event['data']['object']
        print(f"Payment succeeded: {payment_intent['id']}")
        
        # Here you could:
        # - Send confirmation email
        # - Update database
        # - Generate invoice
        
    elif event['type'] == 'payment_intent.payment_failed':
        payment_intent = event['data']['object']
        print(f"Payment failed: {payment_intent['id']}")
        
    return 'Success', 200

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    static_folder_path = app.static_folder
    if static_folder_path is None:
        return "Static folder not configured", 404

    if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
        # Get the file extension and determine MIME type
        file_ext = os.path.splitext(path)[1].lower()
        
        # Set appropriate MIME type for JavaScript modules
        if file_ext == '.js' or file_ext == '.mjs':
            response = send_from_directory(static_folder_path, path)
            response.headers['Content-Type'] = 'application/javascript; charset=utf-8'
            response.headers['X-Content-Type-Options'] = 'nosniff'
            return response
        elif file_ext == '.css':
            response = send_from_directory(static_folder_path, path)
            response.headers['Content-Type'] = 'text/css; charset=utf-8'
            return response
        else:
            return send_from_directory(static_folder_path, path)
    else:
        index_path = os.path.join(static_folder_path, 'index.html')
        if os.path.exists(index_path):
            return send_from_directory(static_folder_path, 'index.html')
        else:
            return "index.html not found", 404


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3002, debug=True)
