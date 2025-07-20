#!/bin/bash

echo "🚀 Setting up GitHub repository for Scottsdale Handyman Solutions"
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing Git repository..."
    git init
    echo "✅ Git initialized"
else
    echo "✅ Git repository already exists"
fi

# Add all files
echo "📋 Adding files to Git..."
git add .

# Create initial commit
echo "💾 Creating initial commit..."
git commit -m "🎉 Initial commit: Scottsdale Handyman Solutions website with AI chatbot

Features:
- Modern React frontend with Vite
- AI-powered chatbot with comprehensive knowledge base
- Flask backend with email integration
- Responsive design with Tailwind CSS
- Stripe payment integration ready
- Render deployment configuration
- Professional UI with animations"

# Set main branch
echo "🌿 Setting main branch..."
git branch -M main

echo ""
echo "✅ Local repository is ready!"
echo ""
echo "🔗 Next steps:"
echo "1. Go to https://github.com/new"
echo "2. Repository name: scottsdale-handyman-solutions"
echo "3. Description: Professional handyman services website with AI chatbot"
echo "4. Make it Public (recommended for easier deployment)"
echo "5. DON'T initialize with README, .gitignore, or license (we already have them)"
echo "6. Click 'Create repository'"
echo ""
echo "7. Then run these commands:"
echo "   git remote add origin https://github.com/YOUR_USERNAME/scottsdale-handyman-solutions.git"
echo "   git push -u origin main"
echo ""
echo "🎯 Repository suggestions:"
echo "   Name: scottsdale-handyman-solutions"
echo "   Description: Professional handyman services website with AI-powered chatbot, built with React and Flask"
echo "   Topics: handyman, react, flask, chatbot, vite, tailwind, stripe"
