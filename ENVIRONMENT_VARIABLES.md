# 🔐 Environment Variables for Render Deployment

## 🚨 CRITICAL: API Backend Environment Variables

**Add these EXACTLY to your `scottsdale-handyman-api` service in Render Dashboard:**

```bash
# Google API Integration (REQUIRED)
GOOGLE_API_KEY=AIzaSyAUjw9Yk4sYC09AAADP6Gr07qwUEZyKHZ0

# CORS Configuration (REQUIRED)
CORS_ORIGINS=https://scottsdale-handyman-website.onrender.com,https://scottsdale-handyman-pro-portal.onrender.com

# Flask Configuration (REQUIRED)
FLASK_SECRET_KEY=C2kkKCnTHJXDHwTzhdFX3NC2rUNAx9jdn1ldXlqTmYA
ENVIRONMENT=production

# Email Configuration (Optional - if using email features)
MAIL_PASSWORD=nfsx nosf sfbp ckmp

# Stripe Configuration (Optional - if using payments)
STRIPE_PUBLISHABLE_KEY_TEST=pk_test_...
STRIPE_SECRET_KEY_TEST=sk_test_...

# Python Version (Optional - for consistency)
PYTHON_VERSION=3.11.0
```

## 📝 How to Add Environment Variables in Render:

1. Go to https://dashboard.render.com
2. Click on your `scottsdale-handyman-api` service
3. Click "Environment" in the left sidebar
4. Click "Add Environment Variable"
5. Add each variable name and value EXACTLY as shown above
6. Click "Save Changes" (this will trigger a redeploy)

## ✅ Frontend Environment Variables (Automatic)

These are automatically set by your `render.yaml` file:

**Customer Website (`scottsdale-handyman-website`)**:
- `VITE_API_URL=https://scottsdale-handyman-api.onrender.com`
- `VITE_PRO_PORTAL_URL=https://scottsdale-handyman-pro-portal.onrender.com`

**Pro Portal (`scottsdale-handyman-pro-portal`)**:
- `VITE_API_URL=https://scottsdale-handyman-api.onrender.com`

## 🎯 Quick Test Commands

After deployment, test with:

```bash
# Test Google API health
curl https://scottsdale-handyman-api.onrender.com/api/google/health

# Test address validation
curl -X POST https://scottsdale-handyman-api.onrender.com/api/google/validate-address \
  -H "Content-Type: application/json" \
  -d '{"address": "123 Main St, Scottsdale, AZ"}'
```

## 🚨 Don't Forget:

1. **Push your code to GitHub first**: `git push origin main`
2. **Add environment variables to API service**: The deployment will fail without `GOOGLE_API_KEY`
3. **Wait for all 3 services to show "Live"**: Check Render dashboard
4. **Test Google integration**: Verify address validation and calendar features work
