# Scottsdale Handyman Solutions LLC Website

A modern, responsive website for Scottsdale Handyman Solutions LLC featuring an AI-powered chatbot, service showcase, and contact functionality.

## 🚀 Features

- **Modern React Frontend** - Built with Vite, React 19, and Tailwind CSS
- **AI-Powered Chatbot** - Intelligent chatbot with comprehensive handyman knowledge base
- **Responsive Design** - Mobile-first design with beautiful animations
- **Flask Backend** - Python Flask API with email integration
- **Service Showcase** - Professional presentation of handyman services
- **Contact Forms** - Multiple contact methods with email notifications

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

**Frontend:**
```bash
npm install
npm run dev
```

**Backend:**
```bash
pip install -r requirements.txt
python main.py
```

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
