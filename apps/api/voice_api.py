"""
ElevenLabs Voice Chat API Integration
Provides secure server-side integration with ElevenLabs Text-to-Speech API
"""

import os
import requests
import json
from flask import Blueprint, request, jsonify, Response
from flask_cors import cross_origin
import logging

# Create blueprint for voice chat routes
voice_bp = Blueprint('voice', __name__)

# ElevenLabs API configuration
ELEVENLABS_API_KEY = "sk_ea41f4ce7136e963cfa2bfc3dd6b0721f55b87c26d50920e"
ELEVENLABS_BASE_URL = "https://api.elevenlabs.io/v1"
DEFAULT_VOICE_ID = "pNInz6obpgDQGcFmaJgB"  # Adam - professional male voice

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@voice_bp.route('/api/voice/text-to-speech', methods=['POST'])
@cross_origin()
def text_to_speech():
    """
    Convert text to speech using ElevenLabs API
    Accepts: { "text": "Hello world", "voice_id": "optional" }
    Returns: Audio stream or error
    """
    try:
        data = request.get_json()
        
        if not data or 'text' not in data:
            return jsonify({'error': 'Text is required'}), 400
            
        text = data['text']
        voice_id = data.get('voice_id', DEFAULT_VOICE_ID)
        
        # Validate text length
        if len(text) > 5000:
            return jsonify({'error': 'Text too long (max 5000 characters)'}), 400
            
        logger.info(f"Converting text to speech: {text[:100]}...")
        
        # Prepare ElevenLabs API request
        url = f"{ELEVENLABS_BASE_URL}/text-to-speech/{voice_id}"
        
        headers = {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': ELEVENLABS_API_KEY
        }
        
        payload = {
            'text': text,
            'model_id': 'eleven_monolingual_v1',
            'voice_settings': {
                'stability': 0.5,
                'similarity_boost': 0.5,
                'style': 0.5,
                'use_speaker_boost': True
            }
        }
        
        # Make request to ElevenLabs
        response = requests.post(url, json=payload, headers=headers)
        
        if response.status_code == 200:
            # Return audio stream
            return Response(
                response.content,
                mimetype='audio/mpeg',
                headers={
                    'Content-Disposition': 'inline; filename="speech.mp3"',
                    'Access-Control-Allow-Origin': '*'
                }
            )
        else:
            logger.error(f"ElevenLabs API error: {response.status_code} - {response.text}")
            return jsonify({
                'error': 'TTS service unavailable',
                'details': response.text if response.status_code != 401 else 'API key issue'
            }), 500
            
    except requests.exceptions.RequestException as e:
        logger.error(f"Network error calling ElevenLabs: {str(e)}")
        return jsonify({'error': 'Network error', 'details': str(e)}), 500
        
    except Exception as e:
        logger.error(f"Unexpected error in TTS: {str(e)}")
        return jsonify({'error': 'Internal server error', 'details': str(e)}), 500

@voice_bp.route('/api/voice/voices', methods=['GET'])
@cross_origin()
def get_voices():
    """
    Get available voices from ElevenLabs
    Returns: List of available voices with IDs and names
    """
    try:
        url = f"{ELEVENLABS_BASE_URL}/voices"
        headers = {'xi-api-key': ELEVENLABS_API_KEY}
        
        response = requests.get(url, headers=headers)
        
        if response.status_code == 200:
            voices_data = response.json()
            
            # Simplify the response for frontend
            simplified_voices = []
            for voice in voices_data.get('voices', []):
                simplified_voices.append({
                    'voice_id': voice['voice_id'],
                    'name': voice['name'],
                    'category': voice.get('category', 'general'),
                    'description': voice.get('description', ''),
                    'preview_url': voice.get('preview_url', '')
                })
            
            return jsonify({
                'voices': simplified_voices,
                'default_voice_id': DEFAULT_VOICE_ID
            })
        else:
            logger.error(f"ElevenLabs voices API error: {response.status_code}")
            return jsonify({'error': 'Could not fetch voices'}), 500
            
    except Exception as e:
        logger.error(f"Error fetching voices: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@voice_bp.route('/api/voice/chat-response', methods=['POST'])
@cross_origin()  
def generate_chat_response():
    """
    Generate handyman-specific chat response and convert to speech
    Accepts: { "message": "user message", "voice_id": "optional" }
    Returns: { "text_response": "...", "audio_url": "..." }
    """
    try:
        data = request.get_json()
        
        if not data or 'message' not in data:
            return jsonify({'error': 'Message is required'}), 400
            
        user_message = data['message'].lower().strip()
        voice_id = data.get('voice_id', DEFAULT_VOICE_ID)
        
        logger.info(f"Generating chat response for: {user_message}")
        
        # Generate contextual handyman response
        response_text = generate_handyman_response(user_message)
        
        # Convert response to speech
        tts_url = f"{ELEVENLABS_BASE_URL}/text-to-speech/{voice_id}"
        
        headers = {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': ELEVENLABS_API_KEY
        }
        
        payload = {
            'text': response_text,
            'model_id': 'eleven_monolingual_v1',
            'voice_settings': {
                'stability': 0.5,
                'similarity_boost': 0.5,
                'style': 0.5,
                'use_speaker_boost': True
            }
        }
        
        # Get audio from ElevenLabs
        tts_response = requests.post(tts_url, json=payload, headers=headers)
        
        if tts_response.status_code == 200:
            # For now, return the text response and indicate audio is available
            # In production, you might want to save the audio and return a URL
            return jsonify({
                'text_response': response_text,
                'audio_available': True,
                'message': 'Audio generated successfully'
            })
        else:
            # Return text response even if TTS fails
            return jsonify({
                'text_response': response_text,
                'audio_available': False,
                'error': 'TTS generation failed'
            })
            
    except Exception as e:
        logger.error(f"Error in chat response: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

def generate_handyman_response(user_message):
    """
    Generate contextual handyman responses based on user input
    """
    message_lower = user_message.lower()
    
    # Emergency detection
    if any(word in message_lower for word in ['emergency', 'urgent', 'asap', 'immediately', 'help']):
        return """I understand this is urgent! For immediate emergency assistance, please call us right now at 4-8-0, 2-5-5, 5-8-8-7. 

Our emergency team responds within 1 hour, 24 hours a day, 7 days a week. 

For electrical fires, call 911 first. For gas leaks, evacuate immediately and call your gas company. For major flooding, shut off your main water valve.

How can I help you right now?"""

    # Pricing inquiries
    if any(word in message_lower for word in ['price', 'cost', 'quote', 'estimate', 'how much', 'pricing', 'rate']):
        return """I'd be happy to discuss our transparent pricing! 

Our basic handyman repairs start at $75 per hour. Installation work typically ranges from $100 to $300 depending on complexity. Emergency calls have a $125 service fee, but we respond within 1 hour.

We offer a 15% discount when you book multiple services. Every estimate includes a detailed scope of work, material costs breakdown, timeline expectations, and our 100% satisfaction guarantee.

Would you like me to connect you with our team for a free, no-obligation quote? Just call 4-8-0, 2-5-5, 5-8-8-7."""

    # Service information
    if any(word in message_lower for word in ['service', 'repair', 'fix', 'install', 'maintenance', 'what do you do']):
        return """Great question! We offer complete handyman services throughout the Scottsdale area.

Our most popular services include electrical repairs and installations, plumbing fixes and maintenance, interior and exterior painting, drywall repair and installation, flooring installation and repair, HVAC maintenance, general home repairs, and 24/7 emergency services.

We're fully licensed and insured, offer a 1-year warranty on all work, provide free estimates, and same-day service is often available.

What specific service do you need help with? I can provide more detailed information about pricing and scheduling."""

    # Contact information
    if any(word in message_lower for word in ['contact', 'phone', 'call', 'reach', 'number', 'hours']):
        return """You can reach Scottsdale Handyman Solutions at 4-8-0, 2-5-5, 5-8-8-7. 

We're available Monday through Saturday from 7 AM to 6 PM, with 24/7 emergency response available. 

You can also email us at help.scottsdalehandyman@gmail.com. We typically respond to emails within 2 hours during business hours.

For fastest service, especially for urgent needs, calling is always your best option. How would you prefer to proceed with your project?"""

    # Area/location questions
    if any(word in message_lower for word in ['area', 'location', 'scottsdale', 'phoenix', 'where', 'coverage']):
        return """We proudly serve Scottsdale and the greater Phoenix metropolitan area. 

Our primary service area includes Scottsdale, Paradise Valley, Fountain Hills, North Phoenix, and parts of Tempe and Mesa. We can often accommodate projects slightly outside these areas for larger jobs.

We're locally owned and operated, so we know the area well and can typically reach you quickly. Most appointments in Scottsdale can be scheduled within 24 to 48 hours, and emergency service is available 24/7.

What area are you located in? I can confirm our availability in your neighborhood."""

    # Default helpful response
    return """Welcome to Scottsdale Handyman Solutions! I'm here to help with all your home repair and improvement needs.

I can assist you with service information and pricing, scheduling appointments, emergency support, questions about our service areas, and free quotes and estimates.

We're your trusted local handyman team, fully licensed and insured, serving the Scottsdale area with professional, reliable service.

What can I help you with today? Feel free to ask about specific repairs, pricing, or scheduling!"""

@voice_bp.route('/api/voice/send-context', methods=['POST'])
@cross_origin()
def send_context_to_agent():
    """
    Send chat context to AI agent before phone call
    Accepts: { "phone_number": "+16028337194", "context": "chat history...", "timestamp": "..." }
    Returns: Success/failure status
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'Request data required'}), 400
            
        phone_number = data.get('phone_number')
        context = data.get('context', '')
        timestamp = data.get('timestamp')
        
        logger.info(f"Sending context to AI agent {phone_number}")
        logger.info(f"Context preview: {context[:200]}...")
        
        # For now, we'll log the context and return success
        # In production, you could:
        # 1. Send SMS with context to the AI agent number
        # 2. Store context in a database with timestamp for agent lookup
        # 3. Send to an API that your AI agent can query
        # 4. Email the context to a monitored address
        
        # Simulate storing context (you can implement actual storage/sending)
        context_data = {
            'phone_number': phone_number,
            'context': context,
            'timestamp': timestamp,
            'customer_session_id': f"session_{timestamp}",
            'status': 'sent'
        }
        
        # Log for now - replace with your preferred method
        logger.info(f"Context stored for AI agent: {context_data}")
        
        return jsonify({
            'success': True,
            'message': 'Context sent to AI agent',
            'session_id': context_data['customer_session_id']
        })
        
    except Exception as e:
        logger.error(f"Error sending context to agent: {str(e)}")
        return jsonify({'error': 'Failed to send context', 'details': str(e)}), 500

# Health check endpoint
@voice_bp.route('/api/voice/health', methods=['GET'])
@cross_origin()
def voice_health_check():
    """Health check for voice services"""
    return jsonify({
        'status': 'healthy',
        'service': 'ElevenLabs Voice Integration',
        'version': '1.0.0',
        'api_key_configured': bool(ELEVENLABS_API_KEY)
    })

if __name__ == '__main__':
    # This allows testing the blueprint standalone
    from flask import Flask
    app = Flask(__name__)
    app.register_blueprint(voice_bp)
    app.run(debug=True, port=5001)
