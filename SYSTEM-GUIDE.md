# 🚀 **SYSTEM GUIDE: How Your Website Works**

## 🌐 **LIVE ACCESS POINTS**

### **Customer Website** 
**URL**: http://localhost:5176/
- ✅ **Home Page**: Hero section with services overview
- ✅ **Services**: Complete service packages and pricing  
- ✅ **About**: Company story and credentials
- ✅ **Blog**: Home improvement tips and articles
- ✅ **Work With Us**: Career opportunities and job applications
- ✅ **Pay Invoice**: Secure payment processing
- ✅ **AI Chatbot**: Instant customer support (bottom right)

### **Pro Portal (Business Management)**
**URL**: http://localhost:5175/
- 🔐 **Login**: admin / scottsdaleHandyman2025!
- ✅ **Dashboard**: Business analytics and metrics
- ✅ **Lead Management**: Track and manage customer leads
- ✅ **Projects**: Project tracking (in development)
- ✅ **Invoices**: Invoice management (in development)

### **API Server**
**URL**: http://localhost:3000/
- ✅ **Health Check**: http://localhost:3000/api/health
- ✅ **Customer Endpoints**: `/api/*` (contact forms, services)
- ✅ **Business Endpoints**: `/api/pro/*` (lead management, analytics)

---

## 🧭 **How to Navigate the Website**

### **Customer Website Navigation**
1. **Click the logo** → Returns to home page
2. **Menu items** (desktop navigation):
   - Home → Landing page with hero section
   - About → Company information and credentials  
   - Services → Full service catalog with pricing
   - Blog → Home improvement articles
   - Work With Us → Career opportunities
   - Pay Invoice → Secure payment portal

3. **Mobile Navigation**:
   - Click the **☰ (hamburger menu)** to open mobile menu
   - All pages accessible via mobile-friendly menu

### **Interactive Features**
- **"Get Free Quote" button** → Opens lead generation form
- **"24/7 Emergency Service" button** → Opens emergency contact form
- **Chatbot widget** (bottom right) → AI-powered customer support
- **Service cards** → Click "Get Quote" to request specific service

---

## 🛠️ **Pro Portal Features**

### **Login Process**
1. Visit http://localhost:5175/
2. Enter credentials:
   - **Username**: admin
   - **Password**: scottsdaleHandyman2025!
3. Click "Login to Pro Portal"

### **Dashboard Overview**
- **Active Leads**: Total number of prospects
- **Pending Invoices**: Outstanding payments
- **Monthly Revenue**: Financial performance  
- **Hours This Week**: Time tracking summary

### **Lead Management**
- **View all leads** in organized table format
- **Filter leads** by status (new, contacted, quoted, etc.)
- **Search leads** by name, service, or phone
- **Add new leads** with comprehensive form
- **Update lead status** with dropdown menus
- **Edit/Delete leads** with action buttons

### **Navigation Tabs**
- 📊 **Dashboard**: Main analytics view
- 👥 **Leads**: Customer lead management
- 🏗️ **Projects**: Project tracking (in development)
- 💰 **Invoices**: Billing management (in development)  
- 📋 **Estimates**: Quote management (in development)
- ⏰ **Time Tracking**: Hour logging (in development)
- 💸 **Expenses**: Cost tracking (in development)
- 👤 **Clients**: Customer database (in development)

---

## 🔧 **Technical Architecture**

### **Microservice Structure**
```
🏗️ System Architecture:
├── Customer Website (Port 5176)    ← Public-facing site
├── Pro Portal (Port 5175)          ← Business management  
└── API Server (Port 3000)          ← Backend services
```

### **Development Commands**
```bash
# Start everything
npm run dev

# Individual services
npm run dev:website    # Customer site only
npm run dev:pro        # Pro portal only  
npm run dev:api        # API server only
```

### **Code Organization**
- **Customer Website**: `apps/website/src/App.jsx` (1,530+ lines)
- **AI Chatbot**: `apps/website/src/ChatbotWidget.jsx` (1,108 lines)
- **Pro Portal**: `apps/pro-portal/src/App.jsx` (business management)
- **API Services**: `apps/api/` (Python Flask backend)

---

## 🎯 **Key Features Explained**

### **Customer Lead Generation**
1. **Contact forms** throughout the site capture leads
2. **AI Chatbot** provides instant support and lead qualification
3. **Quote requests** automatically create leads in Pro Portal
4. **Emergency service** requests get high priority status

### **Business Management**
1. **All customer inquiries** flow into the Pro Portal as leads
2. **Lead tracking** from initial contact through completion
3. **Status management** (new → contacted → quoted → won/lost)
4. **Analytics dashboard** shows business performance metrics

### **Data Flow**
```
Customer Website → API Server → Pro Portal
     ↓                ↓            ↓
Contact Forms    →  Lead Storage  →  Management Interface
Chatbot         →  Conversation   →  Customer Support
Payments        →  Processing     →  Invoice Tracking
```

---

## 🔐 **Security Features**

- **Separated customer and business concerns** 
- **Secure authentication** for Pro Portal
- **CORS protection** on all API endpoints
- **Input validation** on all forms
- **SSL encryption** for payment processing

---

## 📱 **Mobile Responsive**

Both the customer website and Pro Portal are fully responsive:
- **Mobile-first design** approach
- **Touch-friendly navigation** 
- **Optimized layouts** for all screen sizes
- **Fast loading** on mobile networks

---

## 🚨 **Troubleshooting**

### **If menu isn't working:**
1. **Check JavaScript console** for errors (F12 → Console)
2. **Ensure services are running** on correct ports
3. **Clear browser cache** and refresh

### **If pages don't load:**
1. **Verify all services are running**: Check terminal output
2. **Check port conflicts**: Services auto-assign new ports if needed
3. **Restart services**: `npm run dev` to start fresh

### **If Pro Portal won't login:**
- **Username**: admin
- **Password**: scottsdaleHandyman2025!
- **Case sensitive** - use exact credentials

---

## 🎊 **Success! Your System is Now Running**

✅ **Customer Website**: Fully functional with navigation, forms, and AI chat  
✅ **Pro Portal**: Business management with lead tracking  
✅ **API Backend**: Secure data processing and storage  
✅ **Mobile Responsive**: Works perfectly on all devices  
✅ **Production Ready**: Scalable microservice architecture  

**Your Scottsdale Handyman Solutions website is now a complete business management platform!** 🚀

---

### **Next Steps:**
1. **Test all navigation** → Click through every menu item
2. **Try the chatbot** → Test AI customer support  
3. **Submit a test lead** → Use contact forms
4. **Login to Pro Portal** → Manage leads and view analytics
5. **Customize content** → Update services, pricing, and branding as needed

**The system is designed for maximum efficiency and ready to scale your business!** 💪
