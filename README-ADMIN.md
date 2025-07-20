# Scottsdale Handyman Solutions - Admin Panel Setup

## Overview

This admin panel allows you to manage your website content and automatically save changes to GitHub, making them live on your website.

## Features

- ✅ **Blog Management**: Add, edit, and delete blog posts
- ✅ **Form Submissions**: View and manage customer inquiries  
- ✅ **GitHub Integration**: Changes automatically pushed to your repository
- ✅ **Real-time Updates**: Content changes appear immediately on your website
- ✅ **Secure Admin Access**: Token-based authentication

## Quick Setup

1. **Run the setup script:**
   ```bash
   chmod +x setup-admin.sh
   ./setup-admin.sh
   ```

2. **Configure your environment variables:**
   - Edit the `.env` file created during setup
   - Add your GitHub Personal Access Token
   - Set a secure admin password

3. **Start the application:**
   ```bash
   npm run start:all
   ```

4. **Access the admin panel:**
   - Go to `http://localhost:5174?admin=true`
   - Login with: `admin` / `handyman2024!`

## Manual Setup (Alternative)

### 1. Install Dependencies

```bash
# Backend dependencies
npm install express cors @octokit/rest dotenv nodemon concurrently

# If you don't have the frontend dependencies
npm install
```

### 2. Environment Variables

Create a `.env` file in your project root:

```env
GITHUB_TOKEN=your_github_personal_access_token_here
ADMIN_TOKEN=your_secure_admin_token_here
PORT=5000
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. GitHub Personal Access Token

1. Go to GitHub Settings > Developer settings > Personal access tokens
2. Click "Generate new token (classic)"
3. Select these permissions:
   - `repo` (Full control of private repositories)
   - `workflow` (Update GitHub Action workflows)
4. Copy the token and add it to your `.env` file

### 4. Start the Servers

```bash
# Start both frontend and backend
npm run start:all

# OR start them separately:
# Backend (in one terminal)
npm run backend:dev

# Frontend (in another terminal)  
npm run dev
```

## How It Works

### Backend API (`server.js`)
- **Express server** running on port 5000
- **GitHub integration** using Octokit
- **File management** for updating `App.jsx` with new content
- **Form submission storage** in `form-submissions.json`
- **Auto-commit and push** changes to your GitHub repository

### Admin Panel (`AdminPanel.jsx`)
- **Blog post management** with rich text editing
- **Form submission viewing** and management
- **Dashboard** with statistics and recent activity
- **Secure authentication** with token-based access

### Frontend Integration
- **Updated forms** that submit to the backend API
- **Admin login** accessible via `?admin=true` URL parameter
- **Real-time content** loaded from your updated GitHub repository

## API Endpoints

### Blog Posts
- `GET /api/blog-posts` - Get all blog posts
- `POST /api/blog-posts` - Create new blog post (admin only)
- `PUT /api/blog-posts/:id` - Update blog post (admin only)
- `DELETE /api/blog-posts/:id` - Delete blog post (admin only)

### Form Submissions
- `POST /api/forms/:type` - Submit form (quote, contact, etc.)
- `GET /api/submissions` - Get all submissions (admin only)

### Projects
- `PUT /api/projects` - Update project gallery (admin only)

## Security Notes

### For Development:
- Default credentials: `admin` / `handyman2024!`
- Local backend on `http://localhost:5000`

### For Production:
1. **Change admin credentials** in `AdminLogin.jsx`
2. **Use HTTPS** for your backend
3. **Set secure environment variables** on your hosting platform
4. **Use a proper database** (PostgreSQL, MongoDB, etc.) instead of JSON files
5. **Implement rate limiting** and additional security measures

## Deployment Options

### Option 1: Simple Node.js Hosting (Recommended)
- **Heroku**: Easy deployment with environment variables
- **Railway**: Modern hosting with GitHub integration
- **Render**: Free tier available with automatic deploys

### Option 2: Advanced Setup
- **AWS EC2** or **DigitalOcean**: Full control over server
- **Docker containers** for scalability
- **PostgreSQL database** for better data management
- **Redis** for session management

## Troubleshooting

### Backend Not Starting
```bash
# Check if port 5000 is in use
lsof -ti:5000

# Kill process if needed
kill -9 $(lsof -ti:5000)

# Restart backend
npm run backend:dev
```

### GitHub Integration Issues
- Verify your GitHub token has `repo` permissions
- Check that your repository name matches `REPO_OWNER` and `REPO_NAME` in `server.js`
- Ensure your token hasn't expired

### Admin Panel Access Issues
- Make sure backend is running on port 5000
- Check browser console for API errors
- Verify admin credentials in the code

### Form Submissions Not Saving
- Check that `form-submissions.json` is being created
- Verify API endpoints are working: `http://localhost:5000/api/submissions`
- Check server console for error messages

## Customization

### Adding New Content Types
1. Add API endpoints in `server.js`
2. Create management interface in `AdminPanel.jsx`
3. Update the content in your `App.jsx`

### Styling Changes
- Admin panel styles are inline for simplicity
- You can extract to CSS files for better organization
- Update colors and branding to match your site

### Additional Features
- **Email notifications** when forms are submitted
- **Image upload and management**
- **User management** with multiple admin accounts
- **Content scheduling** for blog posts
- **Analytics dashboard** with visitor stats

## Support

- Check the console logs for detailed error messages
- Ensure all environment variables are set correctly
- Test API endpoints directly with tools like Postman
- Verify your GitHub repository permissions

## File Structure

```
project/
├── server.js                 # Backend API server
├── AdminPanel.jsx           # Admin dashboard component  
├── AdminLogin.jsx           # Admin login form
├── App.jsx                  # Main React app (updated)
├── .env                     # Environment variables
├── form-submissions.json    # Form data storage
├── package.json            # Dependencies and scripts
└── README-ADMIN.md         # This file
```
