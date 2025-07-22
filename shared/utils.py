# Shared utilities between microservices
class LeadValidator:
    """Validate lead data across services"""
    
    @staticmethod
    def validate_required_fields(data, required_fields):
        """Check if all required fields are present"""
        missing_fields = []
        for field in required_fields:
            if not data.get(field):
                missing_fields.append(field)
        return missing_fields
    
    @staticmethod
    def validate_phone(phone):
        """Validate phone number format"""
        import re
        # Basic phone validation
        phone_pattern = r'^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$'
        return re.match(phone_pattern, phone) is not None
    
    @staticmethod
    def validate_email(email):
        """Validate email format"""
        import re
        if not email:
            return True  # Email is optional
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return re.match(email_pattern, email) is not None

class ResponseFormatter:
    """Format API responses consistently"""
    
    @staticmethod
    def success(data=None, message="Success"):
        """Format success response"""
        response = {
            'success': True,
            'message': message
        }
        if data is not None:
            response['data'] = data
        return response
    
    @staticmethod
    def error(message="An error occurred", code=400):
        """Format error response"""
        return {
            'success': False,
            'message': message,
            'error_code': code
        }

class Constants:
    """Shared constants"""
    
    # Service types
    SERVICES = [
        'Plumbing Repair',
        'Electrical Work', 
        'Kitchen Repair',
        'Bathroom Remodel',
        'Deck Installation',
        'Fence Repair',
        'Painting',
        'Drywall Repair',
        'Tile Work',
        'Other'
    ]
    
    # Lead statuses
    LEAD_STATUSES = [
        'new',
        'contacted', 
        'quoted',
        'scheduled',
        'in_progress',
        'completed',
        'won',
        'lost'
    ]
    
    # Urgency levels
    URGENCY_LEVELS = ['low', 'medium', 'high']
    
    # Lead sources
    LEAD_SOURCES = [
        'website',
        'phone',
        'referral',
        'google',
        'facebook',
        'nextdoor',
        'manual',
        'other'
    ]
