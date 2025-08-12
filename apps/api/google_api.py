"""
Google API Integration for Scottsdale Handyman Solutions
Provides Google Calendar, Maps, and Places API functionality
"""

import os
import json
import requests
import logging
from datetime import datetime, timedelta
from flask import Blueprint, request, jsonify
from urllib.parse import quote

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create Blueprint
google_bp = Blueprint('google_api', __name__)

# Google API configuration
GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY', 'AIzaSyAUjw9Yk4sYC09AAADP6Gr07qwUEZyKHZ0')
GOOGLE_CALENDAR_BASE_URL = "https://www.googleapis.com/calendar/v3"
GOOGLE_MAPS_BASE_URL = "https://maps.googleapis.com/maps/api"
GOOGLE_PLACES_BASE_URL = "https://maps.googleapis.com/maps/api/place"

# ===== GOOGLE CALENDAR API INTEGRATION =====

@google_bp.route('/api/google/calendar/events', methods=['GET'])
def get_calendar_events():
    """
    Get events from Google Calendar
    """
    try:
        calendar_id = request.args.get('calendar_id', 'primary')
        time_min = request.args.get('time_min')
        time_max = request.args.get('time_max')
        
        # Default to current month if no time range specified
        if not time_min:
            time_min = datetime.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0).isoformat() + 'Z'
        if not time_max:
            next_month = datetime.now().replace(day=28) + timedelta(days=4)
            time_max = (next_month - timedelta(days=next_month.day)).replace(hour=23, minute=59, second=59).isoformat() + 'Z'

        url = f"{GOOGLE_CALENDAR_BASE_URL}/calendars/{calendar_id}/events"
        params = {
            'key': GOOGLE_API_KEY,
            'timeMin': time_min,
            'timeMax': time_max,
            'singleEvents': True,
            'orderBy': 'startTime'
        }

        response = requests.get(url, params=params)
        
        if response.status_code == 200:
            events_data = response.json()
            
            # Format events for our calendar system
            formatted_events = []
            for event in events_data.get('items', []):
                start_time = event.get('start', {})
                end_time = event.get('end', {})
                
                # Handle both date and dateTime formats
                if 'dateTime' in start_time:
                    start_dt = datetime.fromisoformat(start_time['dateTime'].replace('Z', '+00:00'))
                    end_dt = datetime.fromisoformat(end_time['dateTime'].replace('Z', '+00:00'))
                    is_all_day = False
                else:
                    start_dt = datetime.fromisoformat(start_time['date'])
                    end_dt = datetime.fromisoformat(end_time['date'])
                    is_all_day = True

                formatted_event = {
                    'id': event['id'],
                    'title': event.get('summary', 'Untitled Event'),
                    'description': event.get('description', ''),
                    'location': event.get('location', ''),
                    'date': start_dt.strftime('%Y-%m-%d'),
                    'startTime': start_dt.strftime('%H:%M') if not is_all_day else '00:00',
                    'endTime': end_dt.strftime('%H:%M') if not is_all_day else '23:59',
                    'isAllDay': is_all_day,
                    'status': event.get('status', 'confirmed'),
                    'type': 'google_calendar',
                    'googleEventId': event['id'],
                    'attendees': [
                        {
                            'email': attendee.get('email', ''),
                            'name': attendee.get('displayName', ''),
                            'status': attendee.get('responseStatus', 'needsAction')
                        }
                        for attendee in event.get('attendees', [])
                    ]
                }
                formatted_events.append(formatted_event)

            return jsonify({
                'success': True,
                'events': formatted_events,
                'count': len(formatted_events)
            })
        else:
            logger.error(f"Google Calendar API error: {response.status_code} - {response.text}")
            return jsonify({
                'success': False,
                'error': 'Failed to fetch calendar events',
                'details': response.text
            }), response.status_code

    except Exception as e:
        logger.error(f"Error fetching calendar events: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Internal server error',
            'details': str(e)
        }), 500

@google_bp.route('/api/google/calendar/events', methods=['POST'])
def create_calendar_event():
    """
    Create a new event in Google Calendar
    """
    try:
        data = request.get_json()
        calendar_id = data.get('calendar_id', 'primary')
        
        # Extract event details
        title = data.get('title', '')
        description = data.get('description', '')
        location = data.get('location', '')
        date = data.get('date')  # YYYY-MM-DD
        start_time = data.get('startTime')  # HH:MM
        end_time = data.get('endTime')  # HH:MM
        is_all_day = data.get('isAllDay', False)
        attendees = data.get('attendees', [])

        # Validate required fields
        if not title or not date:
            return jsonify({
                'success': False,
                'error': 'Title and date are required'
            }), 400

        # Prepare event data for Google Calendar
        event_data = {
            'summary': title,
            'description': description,
            'location': location
        }

        if is_all_day:
            # All-day event
            event_data['start'] = {'date': date}
            event_data['end'] = {'date': date}
        else:
            # Timed event
            if not start_time or not end_time:
                return jsonify({
                    'success': False,
                    'error': 'Start time and end time required for timed events'
                }), 400
                
            start_datetime = f"{date}T{start_time}:00"
            end_datetime = f"{date}T{end_time}:00"
            
            event_data['start'] = {
                'dateTime': start_datetime,
                'timeZone': 'America/Phoenix'  # Arizona timezone
            }
            event_data['end'] = {
                'dateTime': end_datetime,
                'timeZone': 'America/Phoenix'
            }

        # Add attendees if provided
        if attendees:
            event_data['attendees'] = [
                {'email': attendee} if isinstance(attendee, str) else attendee
                for attendee in attendees
            ]

        # Add reminders
        event_data['reminders'] = {
            'useDefault': False,
            'overrides': [
                {'method': 'email', 'minutes': 60},
                {'method': 'popup', 'minutes': 15}
            ]
        }

        url = f"{GOOGLE_CALENDAR_BASE_URL}/calendars/{calendar_id}/events"
        params = {'key': GOOGLE_API_KEY}
        
        response = requests.post(url, params=params, json=event_data)
        
        if response.status_code in [200, 201]:
            created_event = response.json()
            return jsonify({
                'success': True,
                'event': created_event,
                'eventId': created_event['id'],
                'htmlLink': created_event.get('htmlLink', '')
            })
        else:
            logger.error(f"Google Calendar create event error: {response.status_code} - {response.text}")
            return jsonify({
                'success': False,
                'error': 'Failed to create calendar event',
                'details': response.text
            }), response.status_code

    except Exception as e:
        logger.error(f"Error creating calendar event: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Internal server error',
            'details': str(e)
        }), 500

# ===== GOOGLE MAPS API INTEGRATION =====

@google_bp.route('/api/google/maps/geocode', methods=['POST'])
def geocode_address():
    """
    Convert address to coordinates using Google Geocoding API
    """
    try:
        data = request.get_json()
        address = data.get('address', '')
        
        if not address:
            return jsonify({
                'success': False,
                'error': 'Address is required'
            }), 400

        url = f"{GOOGLE_MAPS_BASE_URL}/geocode/json"
        params = {
            'address': address,
            'key': GOOGLE_API_KEY
        }

        response = requests.get(url, params=params)
        
        if response.status_code == 200:
            geocode_data = response.json()
            
            if geocode_data['status'] == 'OK' and geocode_data['results']:
                result = geocode_data['results'][0]
                
                return jsonify({
                    'success': True,
                    'formatted_address': result['formatted_address'],
                    'coordinates': {
                        'lat': result['geometry']['location']['lat'],
                        'lng': result['geometry']['location']['lng']
                    },
                    'place_id': result['place_id'],
                    'types': result['types']
                })
            else:
                return jsonify({
                    'success': False,
                    'error': 'Address not found',
                    'status': geocode_data['status']
                }), 404
        else:
            return jsonify({
                'success': False,
                'error': 'Geocoding service error'
            }), response.status_code

    except Exception as e:
        logger.error(f"Error geocoding address: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Internal server error',
            'details': str(e)
        }), 500

@google_bp.route('/api/google/maps/directions', methods=['POST'])
def get_directions():
    """
    Get directions between two locations using Google Directions API
    """
    try:
        data = request.get_json()
        origin = data.get('origin', '')
        destination = data.get('destination', '')
        
        if not origin or not destination:
            return jsonify({
                'success': False,
                'error': 'Origin and destination are required'
            }), 400

        url = f"{GOOGLE_MAPS_BASE_URL}/directions/json"
        params = {
            'origin': origin,
            'destination': destination,
            'key': GOOGLE_API_KEY,
            'units': 'imperial'  # Use miles
        }

        response = requests.get(url, params=params)
        
        if response.status_code == 200:
            directions_data = response.json()
            
            if directions_data['status'] == 'OK' and directions_data['routes']:
                route = directions_data['routes'][0]
                leg = route['legs'][0]
                
                return jsonify({
                    'success': True,
                    'distance': leg['distance']['text'],
                    'duration': leg['duration']['text'],
                    'start_address': leg['start_address'],
                    'end_address': leg['end_address'],
                    'steps': [
                        {
                            'instruction': step['html_instructions'],
                            'distance': step['distance']['text'],
                            'duration': step['duration']['text']
                        }
                        for step in leg['steps']
                    ]
                })
            else:
                return jsonify({
                    'success': False,
                    'error': 'Route not found',
                    'status': directions_data['status']
                }), 404
        else:
            return jsonify({
                'success': False,
                'error': 'Directions service error'
            }), response.status_code

    except Exception as e:
        logger.error(f"Error getting directions: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Internal server error',
            'details': str(e)
        }), 500

# ===== GOOGLE PLACES API INTEGRATION =====

@google_bp.route('/api/google/places/search', methods=['POST'])
def search_places():
    """
    Search for places using Google Places API
    """
    try:
        data = request.get_json()
        query = data.get('query', '')
        location = data.get('location', 'Scottsdale, AZ')  # Default to Scottsdale
        radius = data.get('radius', 50000)  # 50km default
        
        if not query:
            return jsonify({
                'success': False,
                'error': 'Search query is required'
            }), 400

        url = f"{GOOGLE_PLACES_BASE_URL}/textsearch/json"
        params = {
            'query': f"{query} near {location}",
            'radius': radius,
            'key': GOOGLE_API_KEY
        }

        response = requests.get(url, params=params)
        
        if response.status_code == 200:
            places_data = response.json()
            
            if places_data['status'] == 'OK':
                places = []
                for place in places_data.get('results', []):
                    places.append({
                        'place_id': place['place_id'],
                        'name': place['name'],
                        'address': place.get('formatted_address', ''),
                        'rating': place.get('rating', 0),
                        'price_level': place.get('price_level', 0),
                        'types': place.get('types', []),
                        'coordinates': {
                            'lat': place['geometry']['location']['lat'],
                            'lng': place['geometry']['location']['lng']
                        }
                    })
                
                return jsonify({
                    'success': True,
                    'places': places,
                    'count': len(places)
                })
            else:
                return jsonify({
                    'success': False,
                    'error': 'No places found',
                    'status': places_data['status']
                }), 404
        else:
            return jsonify({
                'success': False,
                'error': 'Places search service error'
            }), response.status_code

    except Exception as e:
        logger.error(f"Error searching places: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Internal server error',
            'details': str(e)
        }), 500

# ===== UTILITY ENDPOINTS =====

@google_bp.route('/api/google/validate-address', methods=['POST'])
def validate_address():
    """
    Validate and format an address using Google's geocoding
    """
    try:
        data = request.get_json()
        address = data.get('address', '')
        
        if not address:
            return jsonify({
                'success': False,
                'error': 'Address is required'
            }), 400

        # Use geocoding to validate
        url = f"{GOOGLE_MAPS_BASE_URL}/geocode/json"
        params = {
            'address': address,
            'key': GOOGLE_API_KEY,
            'components': 'country:US|administrative_area:AZ'  # Restrict to Arizona
        }

        response = requests.get(url, params=params)
        
        if response.status_code == 200:
            geocode_data = response.json()
            
            if geocode_data['status'] == 'OK' and geocode_data['results']:
                result = geocode_data['results'][0]
                
                # Extract address components
                components = {}
                for component in result['address_components']:
                    for type_name in component['types']:
                        components[type_name] = component['long_name']
                
                is_scottsdale = 'Scottsdale' in result['formatted_address']
                
                return jsonify({
                    'success': True,
                    'is_valid': True,
                    'formatted_address': result['formatted_address'],
                    'is_scottsdale': is_scottsdale,
                    'coordinates': {
                        'lat': result['geometry']['location']['lat'],
                        'lng': result['geometry']['location']['lng']
                    },
                    'components': {
                        'street_number': components.get('street_number', ''),
                        'street_name': components.get('route', ''),
                        'city': components.get('locality', ''),
                        'state': components.get('administrative_area_level_1', ''),
                        'zip_code': components.get('postal_code', ''),
                        'county': components.get('administrative_area_level_2', '')
                    }
                })
            else:
                return jsonify({
                    'success': True,
                    'is_valid': False,
                    'error': 'Invalid address'
                })
        else:
            return jsonify({
                'success': False,
                'error': 'Address validation service error'
            }), response.status_code

    except Exception as e:
        logger.error(f"Error validating address: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Internal server error',
            'details': str(e)
        }), 500

@google_bp.route('/api/google/health', methods=['GET'])
def google_api_health():
    """
    Check if Google API services are accessible
    """
    try:
        # Test with a simple geocoding request
        url = f"{GOOGLE_MAPS_BASE_URL}/geocode/json"
        params = {
            'address': 'Scottsdale, AZ',
            'key': GOOGLE_API_KEY
        }
        
        response = requests.get(url, params=params, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data['status'] == 'OK':
                return jsonify({
                    'success': True,
                    'status': 'Google API services are operational',
                    'services': {
                        'geocoding': True,
                        'calendar': True,
                        'maps': True,
                        'places': True
                    }
                })
            else:
                return jsonify({
                    'success': False,
                    'status': 'Google API authentication issue',
                    'error': data['status']
                })
        else:
            return jsonify({
                'success': False,
                'status': 'Google API connection issue',
                'error': f"HTTP {response.status_code}"
            }), response.status_code

    except Exception as e:
        logger.error(f"Google API health check failed: {str(e)}")
        return jsonify({
            'success': False,
            'status': 'Google API health check failed',
            'error': str(e)
        }), 500
