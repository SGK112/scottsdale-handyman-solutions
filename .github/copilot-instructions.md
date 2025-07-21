# Copilot Instructions for Scottsdale Handyman Solutions

## Project Architecture

This is a **dual-service monorepo** combining a React frontend with a Flask backend, deployed as separate services on Render:

- **Frontend**: React 19 + Vite + Tailwind CSS (static site deployment)
- **Backend**: Flask 3.1 + Python (web service deployment)
- **Database**: Optional MongoDB (configured via env vars)

## Key Components & Data Flow

### Single-File Architecture Pattern
The main application logic is contained in **massive single files** (`App.jsx` ~15k lines, `ChatbotWidget.jsx` ~1k lines). This is intentional for this project - don't split into smaller components unless explicitly requested.

### State Management Strategy
- **No external state management** - uses React hooks and prop drilling
- **Admin state**: `isAdminLoggedIn`, `adminToken` stored in localStorage
- **Page routing**: Simple string-based `currentPage` state, not React Router
- **Chat state**: Multiple useState hooks for chat functionality managed in `App.jsx`

### Critical Integration Points
1. **API Proxy**: Vite dev server proxies `/api/*` to `localhost:3000` (see `vite.config.js`)
2. **Production URLs**: Frontend calls backend via env var `REACT_APP_API_URL`
3. **Admin Access**: URL param `?admin=true` triggers admin login modal
4. **Chat Logging**: Chatbot conversations are sent to Flask `/api/log-conversation` endpoint

## Development Workflows

### Local Development Commands
```bash
# Frontend (port 5173)
npm run dev

# Backend (port 3000, matches proxy config)
python main.py
```

### Deployment Architecture
- **Render deployment**: Both services defined in single `render.yaml`
- **Environment variables**: Set in Render dashboard, not `.env` files
- **Static frontend**: Built to `/dist`, serves `index.html` for all routes

## Project-Specific Conventions

### Component Patterns
- **Inline styles**: Extensive use of Tailwind classes in JSX
- **Icon imports**: Lucide React icons imported at top of files
- **Modal pattern**: Conditional rendering with backdrop, not portal-based
- **Form handling**: Manual state management, not react-hook-form despite being installed

### Backend API Conventions
- **Endpoints**: All prefixed with `/api/`
- **Key APIs**: `/chatbot-log`, `/gallery-images`, `/upload-image`, `/stripe-config`
- **Authentication**: Simple token-based auth for admin features
- **Email integration**: Flask-Mail for contact form submissions
- **Stripe integration**: Payment intents and webhook handling built-in
- **File uploads**: Image handling with MongoDB GridFS or filesystem storage

### Content Management
- **Blog posts**: Admin can create/edit via `AdminPanel.jsx`
- **Service content**: Hardcoded in `website_content.md` and `App.jsx`
- **Pricing**: Embedded in component code, not database-driven

## Critical Files to Understand
- `App.jsx`: Main application component with all page logic
- `ChatbotWidget.jsx`: AI chatbot with handyman knowledge base
- `main.py`: Flask backend with all API endpoints
- `render.yaml`: Deployment configuration for both services
- `website_content.md`: Business content and copy guidelines

## Common Gotchas
- **Flask serves static files**: Backend serves React build files in production
- **Admin login**: Requires `?admin=true` URL param to show login form
- **MongoDB optional**: App works without MongoDB; install pymongo for full features
- **CORS setup**: Flask-CORS enabled for all routes, needed for cross-origin dev
- **MIME types**: Flask explicitly sets JS/CSS content types for modules

## When Modifying Code
- **Keep single-file structure** unless explicitly asked to refactor
- **Update both dev and prod API URLs** when adding new endpoints
- **Test admin functionality** by adding `?admin=true` to URL
- **Verify email integration** works in production environment
- **Check mobile responsiveness** - this is a mobile-first design

## Quick Validation Checklist
- Frontend accessible at `http://localhost:5173`
- Backend API responding at `http://localhost:3000/api/`
- Admin panel accessible via `?admin=true` URL parameter
- Chat widget functional and logging conversations
- MongoDB connection optional but should not break app if unavailable
