# Developer Onboarding Checklist

## Prerequisites
- [ ] Node.js 18+ installed
- [ ] Python 3.11+ installed
- [ ] pip package manager
- [ ] Git configured

## Initial Setup

### 1. Clone and Install Dependencies
```bash
git clone <repository-url>
cd scottsdale-handyman-solutions-1
npm install
pip install -r requirements.txt
```

### 2. Environment Configuration
- [ ] Copy `.env.example` to `.env` (if using local environment variables)
- [ ] Configure email settings for contact forms (optional for development)
- [ ] Set up Stripe keys for payment testing (optional)
- [ ] Configure MongoDB URI (optional - app works without it)

### 3. Development Server Setup
```bash
# Terminal 1 - Frontend (port 5173)
npm run dev

# Terminal 2 - Backend (port 3000)
python main.py
```

### 4. Verify Installation
- [ ] Frontend loads at `http://localhost:5173`
- [ ] Backend API responds at `http://localhost:3000/api/`
- [ ] Chat widget appears and functions
- [ ] Admin panel accessible at `http://localhost:5173?admin=true`

## Key Development Patterns

### Admin System Testing
1. Navigate to `http://localhost:5173?admin=true`
2. Login modal should appear
3. Use development credentials (check `main.py` for defaults)
4. Verify admin panel functionality

### API Development
- All endpoints prefixed with `/api/`
- CORS enabled for cross-origin development
- Authentication via simple token system
- MongoDB optional - app degrades gracefully

### Frontend Architecture
- Single-file components (`App.jsx` ~15k lines)
- No external state management
- Tailwind CSS for styling
- Lucide React for icons

## Deployment Checklist
- [ ] Environment variables set in Render dashboard
- [ ] `render.yaml` configuration reviewed
- [ ] Both frontend and backend services configured
- [ ] Static file serving tested in production

## Troubleshooting

### Common Issues
1. **Port conflicts**: Ensure backend runs on port 3000 to match proxy
2. **Admin access**: Must use `?admin=true` URL parameter
3. **MongoDB errors**: Check if pymongo is installed, or disable MongoDB features
4. **CORS issues**: Verify Flask-CORS is properly configured
5. **Static files**: Check MIME type configuration for JS/CSS modules

### Quick Tests
```bash
# Test backend health
curl http://localhost:3000/api/

# Test proxy configuration
curl http://localhost:5173/api/

# Verify admin endpoint
curl http://localhost:3000/api/admin-login
```

## Architecture Notes
- Dual-service monorepo (frontend + backend)
- Render deployment with separate services
- Optional MongoDB integration
- Stripe payment processing ready
- Flask-Mail email integration
