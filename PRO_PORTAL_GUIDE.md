# 🔧 Scottsdale Handyman Solutions - Pro Portal Guide

## 🚀 Quick Start

### For Regular Website
Visit: `http://localhost:5173`

### For Contractor Pro Portal  
Visit: `http://localhost:5173?pro=true`

**Demo Login Credentials:**
- Username: `contractor@scottsdalehandyman.com`
- Password: `propass123`

---

## 🖥️ Server Management

### Manual Server Control
```bash
# Start both servers
./monitor-servers.sh start

# Check server status
./monitor-servers.sh status

# Restart servers
./monitor-servers.sh restart

# Stop all servers
./monitor-servers.sh stop
```

### Automatic Monitoring (RECOMMENDED)
```bash
# Start with auto-restart monitoring
./monitor-servers.sh monitor
```
This keeps servers running 24/7 and automatically restarts them if they crash.

---

## 🔧 Pro Portal Features

### 📊 Dashboard
- Revenue tracking and analytics
- Monthly performance metrics
- Quick stats overview
- Active projects summary

### 🎯 Lead Management
- View and manage incoming leads
- Lead status tracking (New, Contacted, Quoted, Won, Lost)
- Contact information and project details
- Lead source tracking

### 📋 Project Management
- Active project tracking
- Project timelines and milestones
- Client communication logs
- Project status updates

### 💰 Invoice Management
- Create and send invoices
- Track payment status
- Invoice templates
- Payment history

### 📝 Estimate System
- Generate professional estimates
- Track estimate status
- Convert estimates to projects
- Estimate templates

### ⏰ Time Tracking
- Log work hours per project
- Track billable vs non-billable time
- Generate time reports
- Mobile-friendly time entry

### 💸 Expense Tracking
- Log business expenses
- Categorize expenses (Gas, Materials, Tools, etc.)
- Receipt photo uploads
- Tax deduction tracking

### 👥 Client Management
- Client contact database
- Project history per client
- Communication logs
- Client preferences

---

## 🔐 Security Features

### Authentication
- Secure login system
- Session management
- Password protection
- Access control

### Data Protection
- MongoDB data persistence
- Secure API endpoints
- CORS protection
- Input validation

---

## 🛠️ Technical Details

### Frontend (React + Vite)
- **Port:** 5173
- **Framework:** React 18.3.1
- **Build Tool:** Vite 6.3.5
- **Styling:** Inline styles with responsive design

### Backend (Flask + MongoDB)
- **Port:** 3002
- **Framework:** Flask with Python 3.13.5
- **Database:** MongoDB (local instance)
- **API:** RESTful endpoints with CORS

### API Endpoints
- `GET /api/pro/dashboard-stats` - Dashboard analytics
- `GET /api/pro/leads` - Lead management
- `GET /api/pro/projects` - Project tracking
- `GET /api/pro/invoices` - Invoice system
- `GET /api/pro/estimates` - Estimate management
- `GET /api/pro/time-entries` - Time tracking
- `GET /api/pro/expenses` - Expense management

---

## 🚨 Troubleshooting

### Blank Page Issues
1. Check if both servers are running: `./monitor-servers.sh status`
2. Restart servers: `./monitor-servers.sh restart`
3. Check browser console for errors
4. Verify the correct URL with `?pro=true` for pro portal

### Server Connection Issues
1. Kill any conflicting processes: `pkill -f "vite" && pkill -f "main.py"`
2. Restart clean: `./monitor-servers.sh start`
3. Check ports 5173 and 3002 are available

### MongoDB Issues
1. Ensure MongoDB is running locally
2. Check connection string in main.py
3. Verify database permissions

### Performance Issues
1. Use monitoring script: `./monitor-servers.sh monitor`
2. Check system resources
3. Restart servers if memory usage is high

---

## 📱 Mobile Compatibility

The Pro Portal is fully responsive and works on:
- ✅ Desktop browsers
- ✅ Tablets
- ✅ Mobile phones
- ✅ iOS Safari
- ✅ Android Chrome

---

## 🔄 Backup & Recovery

### Data Backup
- MongoDB collections are automatically managed
- Sample data is included for testing
- Production data should be backed up regularly

### Code Backup
- All code is version controlled in Git
- GitHub repository available
- Regular commits recommended

---

## 📈 Performance Monitoring

### Server Health
- Automatic restart on crashes
- Port monitoring every 10 seconds
- Resource usage tracking
- Error logging

### Usage Analytics
- Built-in dashboard metrics
- Performance tracking
- User activity monitoring

---

## 🎯 Next Steps for Production

1. **Database Setup**
   - Configure production MongoDB
   - Set up data backups
   - Implement user authentication

2. **Server Deployment**
   - Deploy to production server
   - Configure domain and SSL
   - Set up monitoring alerts

3. **Feature Enhancement**
   - Add more business metrics
   - Implement reporting features
   - Mobile app development

---

## 📞 Support

For technical support or feature requests, the monitoring system will help maintain server stability, and the modular architecture allows for easy updates and enhancements.

**Remember:** Always use `./monitor-servers.sh monitor` for production-like reliability!
