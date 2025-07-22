# API Microservice
# Handles all backend API endpoints for both public and pro services

import os
import sys

# Add the parent directory to the path to import shared modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from flask import Flask
from flask_cors import CORS
from public_api import create_public_routes
from pro_api import create_pro_routes

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173", "http://localhost:5174"])

# Register route blueprints
create_public_routes(app)
create_pro_routes(app)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 3000))
    print(f"🚀 API Server starting on port {port}")
    print(f"📡 Customer API: http://localhost:{port}/api/")
    print(f"🛠️ Pro Portal API: http://localhost:{port}/api/pro/")
    app.run(host='0.0.0.0', port=port, debug=True)
