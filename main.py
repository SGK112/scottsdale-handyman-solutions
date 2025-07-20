import os
import sys
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

app = Flask(__name__, static_folder='.')
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
    stripe.api_key = os.getenv('STRIPE_SECRET_KEY_TEST')
    STRIPE_PUBLISHABLE_KEY = os.getenv('STRIPE_PUBLISHABLE_KEY_TEST')
    WEBHOOK_SECRET = os.getenv('STRIPE_WEBHOOK_SECRET_TEST')

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
            'tags': data.get('tags', [])
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
        
        # Return image data as base64 or binary
        if request.args.get('format') == 'binary':
            # Return binary image data
            image_binary = base64.b64decode(image['imageData'])
            return Response(
                image_binary,
                mimetype=image['contentType'],
                headers={
                    'Content-Disposition': f'inline; filename="{image.get("filename", "image")}"'
                }
            )
        else:
            # Return JSON with image data
            return jsonify({
                'success': True,
                'image': {
                    '_id': str(image['_id']),
                    'title': image.get('title'),
                    'description': image.get('description'),
                    'imageData': image['imageData'],
                    'contentType': image['contentType'],
                    'category': image.get('category'),
                    'filename': image.get('filename')
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
            response.headers['Content-Type'] = 'application/javascript'
            return response
        elif file_ext == '.css':
            response = send_from_directory(static_folder_path, path)
            response.headers['Content-Type'] = 'text/css'
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
    app.run(host='0.0.0.0', port=3000, debug=True)
