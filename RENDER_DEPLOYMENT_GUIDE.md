# 🚀 Deployment Guide to Render - Google API Integration

## 📋 Overview

This guide covers deploying your Scottsdale Handyman Solutions application with Google API integration to Render. Your app consists of three services that need to be deployed:

1. **Customer Website** (Static React app)
2. **Pro Portal** (Static React app) 
3. **API Backend** (Flask with Google API integration)

## 🔧 Pre-Deployment Steps

### 1. Commit and Push Your Changes

```bash
# Navigate to your project directory
cd /Users/homepc/SHMS/scottsdale-handyman-solutions/scottsdale-handyman-solutions

# Add all your changes
git add .

# Commit with descriptive message
git commit -m "Add Google API integration with Maps, Calendar, and Address validation"

# Push to your GitHub repository
git push origin main
```

### 2. Verify Your Repository Structure

Make sure your GitHub repository contains:
- ✅ `render.yaml` (deployment configuration)
- ✅ `apps/api/google_api.py` (Google API backend)
- ✅ `apps/pro-portal/src/GoogleIntegration.jsx` (Pro calendar integration)
- ✅ `apps/website/src/components/GoogleMapsIntegration.jsx` (Customer maps integration)
- ✅ Updated `apps/api/server.py` with Google blueprint
- ✅ All necessary requirements in `apps/api/requirements.txt`

## 🌐 Render Deployment Process

### Option 1: Automatic Deployment via render.yaml (Recommended)

1. **Connect Your Repository to Render**:
   - Go to https://dashboard.render.com
   - Click "New" → "Blueprint"
   - Connect your GitHub repository: `SGK112/scottsdale-handyman-solutions`
   - Render will automatically detect your `render.yaml` file

2. **Configure Service Names** (if different):
   - Customer Website: `scottsdale-handyman-website`
   - Pro Portal: `scottsdale-handyman-pro-portal`
   - API Backend: `scottsdale-handyman-api`

### Option 2: Manual Service Creation

If automatic deployment doesn't work, create each service manually:

#### A. API Backend Service
1. **New Web Service**:
   - Repository: `SGK112/scottsdale-handyman-solutions`
   - Root Directory: `apps/api`
   - Environment: `Python`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn server:app --bind 0.0.0.0:$PORT`

#### B. Customer Website
1. **New Static Site**:
   - Repository: `SGK112/scottsdale-handyman-solutions`
   - Root Directory: `apps/website`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`

#### C. Pro Portal
1. **New Static Site**:
   - Repository: `SGK112/scottsdale-handyman-solutions`
   - Root Directory: `apps/pro-portal`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`

## 🔐 Environment Variables Configuration

### Critical: API Backend Environment Variables

**You MUST add these environment variables to your API backend service in Render Dashboard:**

```bash
# Google API Integration (REQUIRED)
GOOGLE_API_KEY=AIzaSyAUjw9Yk4sYC09AAADP6Gr07qwUEZyKHZ0

# CORS Configuration (REQUIRED)
CORS_ORIGINS=https://scottsdale-handyman-website.onrender.com,https://scottsdale-handyman-pro-portal.onrender.com

# Flask Configuration (REQUIRED)
FLASK_SECRET_KEY=C2kkKCnTHJXDHwTzhdFX3NC2rUNAx9jdn1ldXlqTmYA
ENVIRONMENT=production

# Email Configuration (if using email features)
MAIL_PASSWORD=nfsx nosf sfbp ckmp

# Stripe Configuration (if using payments)
STRIPE_PUBLISHABLE_KEY_TEST=pk_test_...
STRIPE_SECRET_KEY_TEST=sk_test_...

# Python Version
PYTHON_VERSION=3.11.0
```

### Frontend Environment Variables (Automatically Set)

Your `render.yaml` already configures:

**Customer Website**:
```bash
VITE_API_URL=https://scottsdale-handyman-api.onrender.com
VITE_PRO_PORTAL_URL=https://scottsdale-handyman-pro-portal.onrender.com
```

**Pro Portal**:
```bash
VITE_API_URL=https://scottsdale-handyman-api.onrender.com
```

## 🎯 Step-by-Step Deployment Instructions

### Step 1: Push Your Code to GitHub

```bash
cd /Users/homepc/SHMS/scottsdale-handyman-solutions/scottsdale-handyman-solutions
git add .
git commit -m "Deploy Google API integration to production"
git push origin main
```

### Step 2: Deploy via Render Dashboard

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Click "New" → "Blueprint"**
3. **Connect Repository**: Select `SGK112/scottsdale-handyman-solutions`
4. **Render detects render.yaml**: Confirms 3 services will be created
5. **Click "Apply"**: Render starts deploying all services

### Step 3: Configure API Backend Environment Variables

**Critical Step - Your deployment will fail without this:**

1. **Navigate to API Service**: In Render dashboard, click on `scottsdale-handyman-api`
2. **Go to Environment**: Click "Environment" in the left sidebar
3. **Add Environment Variables**: Click "Add Environment Variable" for each:

```bash
GOOGLE_API_KEY=AIzaSyAUjw9Yk4sYC09AAADP6Gr07qwUEZyKHZ0
CORS_ORIGINS=https://scottsdale-handyman-website.onrender.com,https://scottsdale-handyman-pro-portal.onrender.com
FLASK_SECRET_KEY=C2kkKCnTHJXDHwTzhdFX3NC2rUNAx9jdn1ldXlqTmYA
ENVIRONMENT=production
```

4. **Click "Save Changes"**: This triggers a redeploy with the new variables

### Step 4: Verify Deployment URLs

After deployment completes, you'll have:

- **Customer Website**: `https://scottsdale-handyman-website.onrender.com`
- **Pro Portal**: `https://scottsdale-handyman-pro-portal.onrender.com`
- **API Backend**: `https://scottsdale-handyman-api.onrender.com`

### Step 5: Test Google API Integration

Test these endpoints to verify Google API is working:

```bash
# Test API health
curl https://scottsdale-handyman-api.onrender.com/api/google/health

# Test address validation
curl -X POST https://scottsdale-handyman-api.onrender.com/api/google/validate-address \
  -H "Content-Type: application/json" \
  -d '{"address": "123 Main St, Scottsdale, AZ"}'
```

## 🚨 Common Deployment Issues & Solutions

### Issue 1: API Service Won't Start
**Symptoms**: API service shows "Deploy failed" or "Service unavailable"
**Solution**: 
- Check that `GOOGLE_API_KEY` environment variable is set
- Verify `requirements.txt` includes all dependencies
- Check build logs for missing Python packages

### Issue 2: Frontend Can't Connect to API
**Symptoms**: Customer website works but booking form doesn't submit
**Solution**: 
- Verify `VITE_API_URL` points to correct API service URL
- Check CORS origins include your frontend URLs
- Ensure API service is deployed and running

### Issue 3: Google API Features Not Working
**Symptoms**: Address validation fails, calendar integration broken
**Solution**: 
- Verify `GOOGLE_API_KEY` environment variable is exactly: `AIzaSyAUjw9Yk4sYC09AAADP6Gr07qwUEZyKHZ0`
- Check Google API quotas and billing
- Test API endpoints directly

### Issue 4: Static Sites Don't Load Properly
**Symptoms**: White screen or 404 errors on frontend
**Solution**: 
- Verify build commands in render.yaml are correct
- Check that `dist` folder is being generated
- Ensure rewrite rules redirect all routes to `index.html`

## 📊 Post-Deployment Testing Checklist

### Customer Website Testing:
- ✅ Website loads at production URL
- ✅ Booking modal opens
- ✅ Address validation works as you type
- ✅ Service area checking displays correctly
- ✅ Google Maps links work
- ✅ Form submission succeeds

### Pro Portal Testing:
- ✅ Pro portal loads at production URL  
- ✅ Login works with credentials: `admin` / `scottsdaleHandyman2025!`
- ✅ Schedule modal opens
- ✅ Google integration component loads
- ✅ Address validation works in scheduling
- ✅ Calendar event creation works

### API Testing:
- ✅ Health check: `GET /api/google/health`
- ✅ Address validation: `POST /api/google/validate-address`
- ✅ Service area check: `POST /api/google/check-service-area`
- ✅ Calendar integration: `POST /api/google/calendar/create-event`

## 🔒 Security Considerations

### Production Security:
- ✅ API keys stored as environment variables (not in code)
- ✅ CORS properly configured for production domains
- ✅ HTTPS enabled on all services
- ✅ No sensitive data in GitHub repository

### Google API Security:
- ✅ API key restricted to specific APIs if needed
- ✅ Monitor API usage and quotas
- ✅ Consider IP restrictions for production

## 🚀 Deployment Success Indicators

Your deployment is successful when:

1. **All 3 services show "Live" status** in Render dashboard
2. **Customer website loads** at production URL
3. **Pro portal loads** and login works
4. **API endpoints respond** to test requests
5. **Google API integration works** in both frontends
6. **Address validation** works in real-time
7. **Calendar integration** creates events successfully

## 📞 Support & Troubleshooting

If you encounter issues:

1. **Check Render Logs**: Each service has detailed logs in the dashboard
2. **Verify Environment Variables**: Ensure all required variables are set
3. **Test API Endpoints**: Use curl or Postman to test backend directly
4. **Check GitHub Repository**: Ensure all files are committed and pushed

Your Google API integration is now production-ready! 🎉
