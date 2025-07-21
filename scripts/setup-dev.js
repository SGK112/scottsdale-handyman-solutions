#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🛠️  Setting up development environment...\n');

// Create .env.example if it doesn't exist
const envExample = `# Scottsdale Handyman Solutions - Environment Variables

# Flask Configuration
FLASK_SECRET_KEY=your_secret_key_here

# Email Configuration (for contact forms)
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=True
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password

# Stripe Configuration (for payments)
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
STRIPE_SECRET_KEY=sk_test_your_secret_key

# MongoDB Configuration (optional)
MONGODB_URI=mongodb://localhost:27017/
MONGODB_DATABASE=handyman_db

# Frontend API URL (for production)
REACT_APP_API_URL=https://your-backend-url.com/api

# Environment
ENVIRONMENT=development
`;

if (!fs.existsSync('.env.example')) {
  fs.writeFileSync('.env.example', envExample);
  console.log('✅ Created .env.example file');
} else {
  console.log('ℹ️  .env.example already exists');
}

// Create basic .env for development if it doesn't exist
if (!fs.existsSync('.env')) {
  const basicEnv = `# Development Environment
FLASK_SECRET_KEY=dev_secret_key_change_in_production
ENVIRONMENT=development

# Optional: Add your email and Stripe credentials here
# MAIL_SERVER=smtp.gmail.com
# MAIL_PORT=587
# MAIL_USE_TLS=True
# MAIL_USERNAME=your_email@gmail.com
# MAIL_PASSWORD=your_app_password
# STRIPE_PUBLISHABLE_KEY=pk_test_your_key
# STRIPE_SECRET_KEY=sk_test_your_key
`;

  fs.writeFileSync('.env', basicEnv);
  console.log('✅ Created basic .env file for development');
} else {
  console.log('ℹ️  .env file already exists');
}

// Create VS Code settings for better development experience
const vscodeDir = '.vscode';
if (!fs.existsSync(vscodeDir)) {
  fs.mkdirSync(vscodeDir);
}

const vscodeSettings = {
  "python.defaultInterpreterPath": "python",
  "python.terminal.activateEnvironment": true,
  "files.associations": {
    "*.jsx": "javascriptreact"
  },
  "emmet.includeLanguages": {
    "javascriptreact": "html"
  },
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
};

const settingsPath = path.join(vscodeDir, 'settings.json');
if (!fs.existsSync(settingsPath)) {
  fs.writeFileSync(settingsPath, JSON.stringify(vscodeSettings, null, 2));
  console.log('✅ Created VS Code settings');
} else {
  console.log('ℹ️  VS Code settings already exist');
}

// Create launch configuration for debugging
const launchConfig = {
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Launch Flask Backend",
      "type": "python",
      "request": "launch",
      "program": "main.py",
      "console": "integratedTerminal",
      "env": {
        "FLASK_DEBUG": "1"
      }
    }
  ]
};

const launchPath = path.join(vscodeDir, 'launch.json');
if (!fs.existsSync(launchPath)) {
  fs.writeFileSync(launchPath, JSON.stringify(launchConfig, null, 2));
  console.log('✅ Created VS Code launch configuration');
} else {
  console.log('ℹ️  VS Code launch configuration already exists');
}

console.log('\n🎉 Development environment setup complete!');
console.log('\nRecommended next steps:');
console.log('1. Review and update .env file with your credentials');
console.log('2. Run "npm install" to install dependencies');
console.log('3. Run "pip install -r requirements.txt" for Python dependencies');
console.log('4. Run "npm run validate:env" to verify setup');
console.log('5. Start development with "npm run dev:full"');
