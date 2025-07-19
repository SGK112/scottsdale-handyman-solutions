#!/bin/bash

echo "🚀 Deploying Scottsdale Handyman Solutions Website to Render..."

echo "📦 Installing dependencies..."
npm install

echo "🏗️ Building the project..."
npm run build

echo "✅ Build complete! Ready for Render deployment."
echo ""
echo "Next steps:"
echo "1. Push this code to GitHub"
echo "2. Connect your GitHub repo to Render"
echo "3. Set your environment variables in Render dashboard"
echo "4. Deploy!"
echo ""
echo "Required environment variables:"
echo "- MAIL_SERVER"
echo "- MAIL_PORT"  
echo "- MAIL_USE_TLS"
echo "- MAIL_USERNAME"
echo "- MAIL_PASSWORD"
echo "- STRIPE_PUBLISHABLE_KEY"
echo "- STRIPE_SECRET_KEY"
echo "- FLASK_SECRET_KEY"
