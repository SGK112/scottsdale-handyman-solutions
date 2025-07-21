# MongoDB Integration Guide

## Overview
MongoDB integration in this project is **completely optional**. The application will function perfectly without MongoDB, but adding it enables enhanced features like image gallery management and conversation logging.

## When to Enable MongoDB

### Enable MongoDB if you want:
- **Image Gallery**: Upload and manage project images via admin panel
- **Chat Logging**: Persistent storage of chatbot conversations
- **Advanced Analytics**: Store and analyze user interactions
- **Scalable Storage**: GridFS for large file management

### Skip MongoDB if you:
- Want minimal setup complexity
- Don't need image upload features
- Prefer file-system based storage
- Are building a simple informational site

## Setup Options

### Option 1: Local MongoDB Development
```bash
# Install MongoDB locally (macOS)
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB service
brew services start mongodb-community

# Add to your .env file
MONGODB_URI=mongodb://localhost:27017/
MONGODB_DATABASE=handyman_db
```

### Option 2: MongoDB Atlas (Cloud)
1. Create free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get connection string
4. Add to .env:
```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
MONGODB_DATABASE=handyman_db
```

### Option 3: No MongoDB (Default)
Simply don't set MONGODB_URI environment variable. The app will:
- Skip MongoDB connection attempts
- Store images in local filesystem
- Log conversations to console/files
- Gracefully disable MongoDB-dependent features

## Features Affected

### With MongoDB Enabled:
- ✅ Admin image gallery with upload/delete
- ✅ GridFS for large file storage
- ✅ Persistent chat conversation logging
- ✅ Admin analytics and reporting
- ✅ Scalable data storage

### Without MongoDB:
- ✅ All core website functionality
- ✅ Contact forms and email notifications
- ✅ Chatbot functionality (memory within session)
- ✅ Admin content management
- ❌ Image gallery uploads
- ❌ Persistent chat history
- ❌ Advanced analytics

## Code Architecture

The codebase is designed with MongoDB as optional:

### Backend (main.py)
```python
# MongoDB connection is wrapped in try/catch
try:
    if MONGODB_URI:
        mongo_client = MongoClient(MONGODB_URI)
        mongo_db = mongo_client[MONGODB_DATABASE]
        print(f"MongoDB connected to {MONGODB_DATABASE}")
except Exception as e:
    print(f"MongoDB connection failed: {e}")
    mongo_client = None
    mongo_db = None
```

### Feature Detection
Each MongoDB-dependent feature checks for availability:
```python
if mongo_db is not None:
    # Use MongoDB features
else:
    # Fall back to alternative storage
```

## Troubleshooting

### Common Issues
1. **ImportError: No module named 'pymongo'**
   - Solution: `pip install pymongo` or remove MongoDB_URI from .env

2. **Connection timeout**
   - Check MongoDB service is running
   - Verify connection string and credentials
   - Check network connectivity for Atlas

3. **Authentication failed**
   - Verify username/password in connection string
   - Check MongoDB Atlas IP whitelist
   - Ensure database user has proper permissions

### Testing MongoDB Integration
```python
# Add this to test MongoDB connection
if mongo_db is not None:
    try:
        # Test the connection
        mongo_db.admin.command('ping')
        print("MongoDB ping successful")
    except Exception as e:
        print(f"MongoDB ping failed: {e}")
```

## Migration Strategy

### Adding MongoDB to Existing Installation
1. Install pymongo: `pip install pymongo`
2. Add MONGODB_URI to .env
3. Restart the application
4. Features will automatically become available

### Removing MongoDB from Installation
1. Remove MONGODB_URI from .env
2. Restart the application
3. MongoDB features will gracefully disable
4. Optionally uninstall: `pip uninstall pymongo`
