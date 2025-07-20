#!/bin/bash

echo "🔧 Setting up Scottsdale Handyman Admin Panel..."

# Install backend dependencies
echo "📦 Installing backend dependencies..."
npm install --save express cors @octokit/rest dotenv

# Install development dependencies
echo "📦 Installing development dependencies..."
npm install --save-dev nodemon

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "🔑 Creating environment variables file..."
    cp .env.backend .env
    echo "✅ Created .env file - IMPORTANT: Update with your actual tokens!"
fi

# Create a simple start script
echo "📝 Creating start scripts..."

# Add backend scripts to package.json
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
pkg.scripts = pkg.scripts || {};
pkg.scripts['backend'] = 'node server.js';
pkg.scripts['backend:dev'] = 'nodemon server.js';
pkg.scripts['start:all'] = 'concurrently \"npm run backend:dev\" \"npm run dev\"';
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
console.log('✅ Updated package.json scripts');
"

# Install concurrently for running both frontend and backend
npm install --save-dev concurrently

echo ""
echo "🎉 Setup complete! Next steps:"
echo ""
echo "1. 🔑 SETUP GITHUB TOKEN:"
echo "   - Go to GitHub Settings > Developer settings > Personal access tokens"
echo "   - Create a token with 'repo' permissions"
echo "   - Edit .env file and replace 'your_github_personal_access_token_here' with your token"
echo ""
echo "2. 🔐 SETUP ADMIN TOKEN:"
echo "   - Edit .env file and replace 'your_secure_admin_token_here' with a secure password"
echo "   - This will be used for API authentication"
echo ""
echo "3. 🚀 START THE APPLICATION:"
echo "   npm run start:all    (starts both backend and frontend)"
echo "   OR run separately:"
echo "   npm run backend:dev  (starts backend server on port 5000)"
echo "   npm run dev         (starts frontend on port 5174)"
echo ""
echo "4. 🔧 ACCESS ADMIN PANEL:"
echo "   - Go to your website URL and add ?admin=true"
echo "   - Example: http://localhost:5174?admin=true"
echo "   - Default login: admin / handyman2024!"
echo "   - CHANGE THESE CREDENTIALS IN PRODUCTION!"
echo ""
echo "5. 📝 MAKE CHANGES:"
echo "   - Add/edit blog posts through the admin panel"
echo "   - Changes will automatically be saved and pushed to GitHub"
echo "   - Form submissions will be stored in form-submissions.json"
echo ""
echo "⚠️  IMPORTANT SECURITY NOTES:"
echo "   - Change default admin credentials before going live"
echo "   - Keep your GitHub token secret"
echo "   - Use HTTPS in production"
echo "   - Consider using a proper database for larger scale"
echo ""
echo "Need help? Check the README.md or contact support!"
