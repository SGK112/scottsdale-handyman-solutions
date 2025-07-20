#!/usr/bin/env python3
"""
Test script for MongoDB image gallery functionality
This script demonstrates how to upload, store, and retrieve images from MongoDB
"""

import os
import base64
import json
from datetime import datetime
from pymongo import MongoClient
from bson import ObjectId

# MongoDB Configuration
MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/')
DATABASE_NAME = 'handyman_db'
COLLECTION_NAME = 'project_images'

def connect_to_mongodb():
    """Connect to MongoDB and return database instance"""
    try:
        client = MongoClient(MONGODB_URI)
        # Test the connection
        client.admin.command('ping')
        db = client[DATABASE_NAME]
        print(f"✅ Successfully connected to MongoDB at {MONGODB_URI}")
        return db, client
    except Exception as e:
        print(f"❌ Failed to connect to MongoDB: {e}")
        return None, None

def image_to_base64(image_path):
    """Convert image file to base64 string"""
    try:
        with open(image_path, 'rb') as image_file:
            encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
            return encoded_string
    except Exception as e:
        print(f"❌ Error encoding image {image_path}: {e}")
        return None

def create_sample_image_document(title, description, category, filename):
    """Create a sample image document for testing"""
    # Create a simple test image (1x1 pixel PNG in base64)
    test_image_base64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
    
    return {
        'title': title,
        'description': description,
        'imageData': test_image_base64,
        'contentType': 'image/png',
        'category': category,
        'filename': filename,
        'uploadDate': datetime.now().isoformat(),
        'tags': ['sample', 'test', category.lower()],
        'projectInfo': {
            'location': 'Scottsdale, AZ',
            'duration': '1 week',
            'client': 'Sample Client'
        }
    }

def upload_sample_images(db):
    """Upload sample project images to MongoDB"""
    collection = db[COLLECTION_NAME]
    
    sample_images = [
        {
            'title': 'Kitchen Cabinet Refurbishment',
            'description': 'Complete kitchen cabinet restoration with new hardware and professional finishing',
            'category': 'Kitchen Improvements',
            'filename': 'kitchen_cabinets_before_after.png'
        },
        {
            'title': 'Bathroom Tile Installation',
            'description': 'Modern subway tile installation with waterproof membrane and professional grouting',
            'category': 'Bathroom Renovations', 
            'filename': 'bathroom_tile_project.png'
        },
        {
            'title': 'Living Room Drywall Repair',
            'description': 'Professional drywall patching and texture matching for seamless wall repair',
            'category': 'Interior Repairs',
            'filename': 'drywall_repair_completion.png'
        },
        {
            'title': 'Exterior Deck Staining',
            'description': 'Deck restoration with pressure washing, sanding, and premium stain application',
            'category': 'Exterior Maintenance',
            'filename': 'deck_staining_project.png'
        },
        {
            'title': 'Smart Thermostat Installation',
            'description': 'Smart home thermostat installation with app setup and programming',
            'category': 'Smart Home Solutions',
            'filename': 'smart_thermostat_install.png'
        }
    ]
    
    uploaded_images = []
    
    for image_info in sample_images:
        document = create_sample_image_document(
            image_info['title'],
            image_info['description'], 
            image_info['category'],
            image_info['filename']
        )
        
        try:
            result = collection.insert_one(document)
            uploaded_images.append(result.inserted_id)
            print(f"✅ Uploaded: {image_info['title']} (ID: {result.inserted_id})")
        except Exception as e:
            print(f"❌ Failed to upload {image_info['title']}: {e}")
    
    return uploaded_images

def retrieve_images_by_category(db, category=None):
    """Retrieve images from MongoDB, optionally filtered by category"""
    collection = db[COLLECTION_NAME]
    
    try:
        # Build query filter
        query_filter = {}
        if category:
            query_filter['category'] = category
        
        # Fetch images
        images = list(collection.find(query_filter, {
            'title': 1,
            'description': 1,
            'category': 1,
            'filename': 1,
            'uploadDate': 1,
            'tags': 1,
            'projectInfo': 1,
            # Don't include imageData in list view to reduce payload size
        }).limit(10))
        
        # Convert ObjectId to string for JSON serialization
        for image in images:
            image['_id'] = str(image['_id'])
        
        print(f"\n📷 Retrieved {len(images)} images" + (f" in category '{category}'" if category else ""))
        for image in images:
            print(f"   • {image['title']} ({image['category']})")
        
        return images
        
    except Exception as e:
        print(f"❌ Error retrieving images: {e}")
        return []

def get_image_by_id(db, image_id):
    """Retrieve a specific image by ID, including the base64 data"""
    collection = db[COLLECTION_NAME]
    
    try:
        image = collection.find_one({'_id': ObjectId(image_id)})
        
        if image:
            image['_id'] = str(image['_id'])
            print(f"📷 Retrieved image: {image['title']}")
            print(f"   Category: {image['category']}")
            print(f"   Size: {len(image['imageData'])} characters (base64)")
            return image
        else:
            print(f"❌ Image not found: {image_id}")
            return None
            
    except Exception as e:
        print(f"❌ Error retrieving image {image_id}: {e}")
        return None

def test_api_endpoints(db):
    """Test the API endpoint functionality"""
    print("\n🔧 Testing API endpoint functionality...")
    
    # Test getting all images
    all_images = retrieve_images_by_category(db)
    
    # Test category filtering
    categories = ['Kitchen Improvements', 'Bathroom Renovations', 'Smart Home Solutions']
    for category in categories:
        category_images = retrieve_images_by_category(db, category)
    
    # Test getting specific image
    if all_images:
        first_image_id = all_images[0]['_id']
        specific_image = get_image_by_id(db, first_image_id)

def cleanup_test_data(db):
    """Remove test data (optional)"""
    collection = db[COLLECTION_NAME]
    
    try:
        # Delete all test images (those with 'test' tag)
        result = collection.delete_many({'tags': 'test'})
        print(f"🧹 Cleaned up {result.deleted_count} test images")
    except Exception as e:
        print(f"❌ Error cleaning up test data: {e}")

def main():
    """Main test function"""
    print("🚀 Starting MongoDB Image Gallery Test")
    print("=" * 50)
    
    # Connect to MongoDB
    db, client = connect_to_mongodb()
    if db is None:
        return
    
    try:
        # Upload sample images
        print("\n📤 Uploading sample images...")
        uploaded_ids = upload_sample_images(db)
        
        # Test API functionality
        test_api_endpoints(db)
        
        # Display collection stats
        collection = db[COLLECTION_NAME]
        total_images = collection.count_documents({})
        print(f"\n📊 Collection Statistics:")
        print(f"   Total images in database: {total_images}")
        
        # Show available categories
        categories = collection.distinct('category')
        print(f"   Available categories: {', '.join(categories)}")
        
        print("\n✅ MongoDB Image Gallery test completed successfully!")
        print("\n💡 Tips for production use:")
        print("   • Set up proper MongoDB indexes on 'category' and 'uploadDate'")
        print("   • Implement image compression for large files")
        print("   • Add pagination for large image collections")
        print("   • Set up MongoDB Atlas for cloud hosting")
        print("   • Configure proper authentication and access controls")
        
    except Exception as e:
        print(f"❌ Test failed: {e}")
    
    finally:
        # Close connection
        if client:
            client.close()
            print("\n🔌 MongoDB connection closed")

if __name__ == "__main__":
    main()
