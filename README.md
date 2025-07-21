# Scottsdale Handyman Solutions LLC Website

A modern, responsive website for Scottsdale Handyman Solutions LLC featuring an AI-powered chatbot, service showcase, and contact functionality.

## 🚀 Features

- **Modern React Frontend** - Built with Vite, React 19, and Tailwind CSS
- **AI-Powered Chatbot** - Intelligent chatbot with comprehensive handyman knowledge base
- **Responsive Design** - Mobile-first design with beautiful animations
- **Flask Backend** - Python Flask API with email integration
- **Service Showcase** - Professional presentation of handyman services
- **Contact Forms** - Multiple contact methods with email notifications
- **Admin System** - Content management accessible via `?admin=true` URL parameter

## 🤖 For AI Agents

This project includes comprehensive AI coding agent instructions in `.github/copilot-instructions.md`. Key highlights:
- Single-file architecture pattern (intentional)
- Dual-service monorepo deployment
- Admin access via URL parameter `?admin=true`
- MongoDB optional integration

## 🛠️ Tech Stack

**Frontend:**
- React 19.1.0
- Vite 6.3.5
- Tailwind CSS 4.1.7
- Framer Motion 12.15.0
- Radix UI Components

**Backend:**
- Python Flask 3.1.1
- Flask-Mail for email functionality
- Flask-CORS for cross-origin requests
- Stripe integration ready

## 🚀 Deployment

This project is configured for deployment on **Render**:

1. Push this repository to GitHub
2. Connect your GitHub repo to Render
3. The `render.yaml` file will automatically configure both frontend and backend services
4. Set your environment variables in the Render dashboard

### Required Environment Variables

Set these in your Render dashboard:

```
MAIL_SERVER=your_smtp_server
MAIL_PORT=587
MAIL_USE_TLS=True
MAIL_USERNAME=your_email
MAIL_PASSWORD=your_email_password
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
FLASK_SECRET_KEY=your_secret_key
```

## 🏃‍♂️ Local Development

**Quick Start:**
```bash
npm run setup:dev    # Initialize development environment
npm install          # Install frontend dependencies
pip install -r requirements.txt  # Install backend dependencies
npm run dev:full     # Start both frontend and backend
```

**Individual Services:**
```bash
# Frontend (port 5173)
npm run dev

# Backend (port 3000)
python main.py
```

**Validation:**
```bash
npm run validate:env      # Check environment setup
npm run test:integration  # Test API endpoints
npm run test:admin       # Test admin functionality
```

## 📚 Documentation

- **[Developer Onboarding](DEVELOPER_ONBOARDING.md)** - Complete setup guide
- **[MongoDB Integration](MONGODB_INTEGRATION.md)** - Optional database setup
- **[AI Agent Instructions](.github/copilot-instructions.md)** - For GitHub Copilot and other AI tools
- **[Documentation Testing](DOCUMENTATION_TEST_RESULTS.md)** - Validation results

## 📁 Project Structure

```
├── src/                    # React components and assets
├── ChatbotWidget.jsx      # AI chatbot component
├── App.jsx               # Main React application
├── main.py              # Flask backend
├── requirements.txt     # Python dependencies
├── package.json        # Node.js dependencies
├── vite.config.js      # Vite configuration
└── render.yaml         # Render deployment config
```

## 🤖 Chatbot Features

- Comprehensive handyman knowledge base (200+ terms)
- Quick action buttons for common inquiries
- Email logging of conversations
- Professional responses with formatting
- Mobile-responsive design

## 📄 License

© 2025 Scottsdale Handyman Solutions LLC. All rights reserved.
