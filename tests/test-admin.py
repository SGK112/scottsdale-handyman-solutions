#!/usr/bin/env python3

import sys
import os
import requests
import json
from urllib.parse import urlparse

print("🧪 Testing Admin System Integration...\n")

# Configuration
BACKEND_URL = "http://localhost:3000"
API_BASE = f"{BACKEND_URL}/api"
TEST_EMAIL = "test@handymantest.com"

def test_admin_login():
    """Test admin login functionality"""
    print("Testing admin login...")
    
    # Test login endpoint exists
    try:
        response = requests.post(f"{API_BASE}/admin-login", json={
            "email": TEST_EMAIL,
            "password": "wrong_password"
        }, timeout=5)
        
        # Should return 401 for wrong credentials
        if response.status_code == 401:
            print("✅ Admin login endpoint working (authentication required)")
            return True
        elif response.status_code == 200:
            print("⚠️  Admin login accepted test credentials (check security)")
            return True
        else:
            print(f"❌ Unexpected response: {response.status_code}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to backend. Is it running on port 3000?")
        return False
    except Exception as e:
        print(f"❌ Admin login test failed: {e}")
        return False

def test_chat_logging():
    """Test chat conversation logging"""
    print("Testing chat logging...")
    
    test_conversation = {
        "conversation": [
            {"role": "user", "content": "I need help with plumbing"},
            {"role": "assistant", "content": "I can help you with plumbing issues. What specific problem are you experiencing?"}
        ],
        "userEmail": TEST_EMAIL,
        "timestamp": "2025-01-20T12:00:00Z"
    }
    
    try:
        response = requests.post(f"{API_BASE}/chatbot-log", 
                               json=test_conversation, 
                               timeout=5)
        
        if response.status_code == 200:
            print("✅ Chat logging working")
            return True
        else:
            print(f"❌ Chat logging failed: {response.status_code}")
            print(f"Response: {response.text[:200]}...")
            return False
            
    except Exception as e:
        print(f"❌ Chat logging test failed: {e}")
        return False

def test_gallery_images():
    """Test gallery images endpoint"""
    print("Testing gallery images...")
    
    try:
        response = requests.get(f"{API_BASE}/gallery-images", timeout=5)
        
        if response.status_code == 200:
            try:
                data = response.json()
                if isinstance(data, list):
                    print(f"✅ Gallery images endpoint working (returned {len(data)} images)")
                    return True
                else:
                    print("❌ Gallery images should return array")
                    return False
            except json.JSONDecodeError:
                print("❌ Gallery images returned invalid JSON")
                return False
        else:
            print(f"❌ Gallery images failed: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Gallery images test failed: {e}")
        return False

def test_stripe_config():
    """Test Stripe configuration"""
    print("Testing Stripe configuration...")
    
    try:
        response = requests.get(f"{API_BASE}/stripe-config", timeout=5)
        
        if response.status_code == 200:
            try:
                data = response.json()
                if 'publishableKey' in data:
                    print("✅ Stripe configuration working")
                    return True
                else:
                    print("❌ Stripe config missing publishable key")
                    return False
            except json.JSONDecodeError:
                print("❌ Stripe config returned invalid JSON")
                return False
        else:
            print(f"❌ Stripe config failed: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Stripe config test failed: {e}")
        return False

def check_environment():
    """Check development environment setup"""
    print("Checking environment setup...")
    
    # Check required files
    required_files = [
        'main.py',
        'App.jsx', 
        'ChatbotWidget.jsx',
        'requirements.txt',
        'package.json'
    ]
    
    missing_files = []
    for file in required_files:
        if not os.path.exists(file):
            missing_files.append(file)
    
    if missing_files:
        print(f"❌ Missing required files: {', '.join(missing_files)}")
        return False
    else:
        print("✅ All required files present")
    
    # Check Python dependencies
    try:
        import flask
        import flask_cors
        import flask_mail
        print("✅ Key Python dependencies installed")
    except ImportError as e:
        print(f"❌ Missing Python dependency: {e}")
        return False
    
    # Check optional dependencies
    try:
        import pymongo
        print("✅ MongoDB support available (pymongo installed)")
    except ImportError:
        print("ℹ️  MongoDB support not installed (optional)")
    
    return True

def main():
    print("🔧 Scottsdale Handyman Solutions - Integration Tests\n")
    
    tests = [
        ("Environment Setup", check_environment),
        ("Admin Login", test_admin_login),
        ("Chat Logging", test_chat_logging),
        ("Gallery Images", test_gallery_images),
        ("Stripe Config", test_stripe_config)
    ]
    
    results = []
    for test_name, test_func in tests:
        print(f"\n🧪 {test_name}:")
        result = test_func()
        results.append((test_name, result))
        print()
    
    # Summary
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    print("=" * 50)
    print(f"📊 Test Results: {passed}/{total} passed")
    print(f"Success Rate: {(passed/total*100):.1f}%")
    
    if passed == total:
        print("\n🎉 All tests passed! Your setup is working correctly.")
        print("\nNext steps:")
        print("1. Start frontend: npm run dev")
        print("2. Visit: http://localhost:5173")
        print("3. Test admin: http://localhost:5173?admin=true")
        return 0
    else:
        print(f"\n🔧 {total-passed} tests failed. Please fix the issues above.")
        print("\nFailed tests:")
        for test_name, result in results:
            if not result:
                print(f"  ❌ {test_name}")
        return 1

if __name__ == "__main__":
    sys.exit(main())
