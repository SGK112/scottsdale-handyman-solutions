# Copilot Instructions for Scottsdale Handyman Solutions

## Project Architecture

This is a **microservice monorepo** combining three separate services deployed independently on Render:

- **Customer Website**: React 18 + Vite + Tailwind CSS (`apps/website/`, port 5173)
- **Pro Portal**: React 18 + Vite business dashboard (`apps/pro-portal/`, port 5174)  
- **API Backend**: Flask 3.1 + Python services (`apps/api/`, port 3000)
- **Legacy Backend**: Flask `main.py` (kept for compatibility, being phased out)

## Key Components & Data Flow

### Microservice Architecture Pattern
The main application is split into **three independent services**:
- `apps/website/src/App.jsx` (~8,556 lines) - Customer-facing website
- `apps/website/src/ChatbotWidget.jsx` (~1,108 lines) - AI chatbot component
- `apps/pro-portal/src/App.jsx` - Business management dashboard
- `apps/api/server.py` - Unified backend API with separated routes

### State Management Strategy
- **No external state management** - uses React hooks and prop drilling within each service
- **Admin state**: `isAdminLoggedIn`, `adminToken` stored in localStorage (website service)
- **Page routing**: Simple string-based `currentPage` state, not React Router
- **Service isolation**: Customer and business data completely separated

### Critical Integration Points
1. **API Proxy**: Each Vite service proxies `/api/*` to `localhost:3000` (see individual `vite.config.js`)
2. **Production URLs**: Services communicate via env vars `VITE_API_URL`, `VITE_PRO_PORTAL_URL`
3. **Admin Access**: URL param `?admin=true` triggers admin login modal (website service)
4. **Pro Access**: Separate pro portal at dedicated URL/port
5. **API Routes**: Public routes `/api/*`, Pro routes `/api/pro/*`

## Development Workflows

### Microservice Development Commands
```bash
# Start all services concurrently
npm run dev

# Start individual services
npm run dev:website    # Customer website (port 5173)
npm run dev:pro        # Pro portal (port 5174)  
npm run dev:api        # API backend (port 3000)

# Build all frontend services
npm run build
```

### Deployment Architecture
- **Render deployment**: All three services defined in single `render.yaml`
- **Independent scaling**: Each service can be scaled separately
- **Environment isolation**: Separate environment variables per service
- **Static frontends**: Both React apps built to `/dist`, serve `index.html` for all routes

## Project-Specific Conventions

### Microservice Patterns
- **Service separation**: Customer website and pro portal are completely separate apps
- **Shared dependencies**: Common dependencies managed at workspace root
- **API route separation**: `/api/*` for public, `/api/pro/*` for business features
- **Cross-service communication**: Via environment variables and API calls only

### Component Patterns (Each Service)
- **Inline styles**: Extensive use of Tailwind classes in JSX
- **Icon imports**: Lucide React icons imported at top of files
- **Modal pattern**: Conditional rendering with backdrop, not portal-based
- **Form handling**: Manual state management, not react-hook-form

### Backend API Conventions
- **Dual API structure**: `public_api.py` and `pro_api.py` in `apps/api/`
- **Route prefixes**: All public endpoints `/api/`, all pro endpoints `/api/pro/`
- **Key APIs**: `/api/contact`, `/api/chatbot`, `/api/pro/leads`, `/api/pro/dashboard-stats`
- **Authentication**: Simple token-based auth for pro features
- **Data storage**: JSON file-based (easily upgradeable to database)

### Content Management
- **Blog posts**: Admin can create/edit via website service admin panel
- **Pro features**: Lead management, project tracking, analytics via pro portal
- **Service content**: Hardcoded in individual `App.jsx` files per service
- **Shared utilities**: Common code in `shared/` directory

## Critical Files to Understand
- `apps/website/src/App.jsx`: Customer website component (~8,556 lines)
- `apps/website/src/ChatbotWidget.jsx`: AI chatbot with handyman knowledge
- `apps/pro-portal/src/App.jsx`: Business management dashboard
- `apps/api/server.py`: Main Flask application with route delegation
- `apps/api/public_api.py`: Customer-facing API endpoints
- `apps/api/pro_api.py`: Business management API endpoints
- `render.yaml`: Deployment configuration for all three services
- `package.json`: Root workspace configuration with service scripts

## Common Gotchas
- **Service boundaries**: Keep customer and business logic completely separate
- **Port conflicts**: Website (5173), Pro Portal (5174), API (3000), Legacy (varies)
- **API routing**: Public routes go to `public_api.py`, pro routes to `pro_api.py`
- **Admin login**: Only available in customer website service with `?admin=true`
- **Pro portal access**: Separate service with independent authentication
- **CORS setup**: Each service has separate CORS configuration
- **Build isolation**: Each frontend service builds independently

## When Modifying Code
- **Maintain service boundaries** - don't mix customer and business logic
- **Update correct service** - identify which service needs changes
- **Test service isolation** - ensure services work independently
- **Update API routes appropriately** - public vs pro route separation
- **Verify cross-service communication** via environment variables
- **Check mobile responsiveness** on both customer and pro interfaces

## Quick Validation Checklist
- Customer Website accessible at `http://localhost:5173`
- Pro Portal accessible at `http://localhost:5174`  
- API Backend responding at `http://localhost:3000/api/`
- Public API endpoints work: `/api/contact`, `/api/chatbot`
- Pro API endpoints work: `/api/pro/leads`, `/api/pro/dashboard-stats`
- Admin panel accessible via `?admin=true` on customer website
- Services can communicate via configured environment variables
- All services build and deploy independently
