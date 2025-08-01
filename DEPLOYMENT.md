# 🚀 Deployment Guide - StyleStore E-commerce

## 📋 Prerequisites
- Vercel account
- MongoDB Atlas account (for database)
- Environment variables configured

## 🔧 Deployment Steps

### 1. **Frontend Deployment (Vercel)**

#### Option A: Deploy via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

#### Option B: Deploy via GitHub
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Vercel will automatically detect it's a Vite project
4. Deploy with default settings

### 2. **Environment Variables Setup**

In your Vercel dashboard, add these environment variables:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/ecommerce

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here

# Frontend URL (your Vercel domain)
CLIENT_URL=https://your-app.vercel.app

# Node Environment
NODE_ENV=production
```

### 3. **Backend Deployment**

Since your backend is in the same repository, you have two options:

#### Option A: Deploy Backend to Vercel (Recommended)
- Vercel will automatically detect your `server.js` file
- API routes will be available at `/api/*`
- No additional configuration needed

#### Option B: Deploy Backend Separately
- Deploy `server.js` to Railway, Render, or Heroku
- Update `CLIENT_URL` in your backend environment
- Update API base URL in your frontend

### 4. **Build Configuration**

Your project is already configured with:
- ✅ `vercel.json` - Vercel configuration
- ✅ `vite.config.js` - Build optimization
- ✅ `package.json` - Build scripts

### 5. **Post-Deployment**

1. **Test your site**: Visit your Vercel URL
2. **Check API endpoints**: Test `/api/products` endpoint
3. **Verify authentication**: Test login/signup functionality
4. **Check database connection**: Ensure MongoDB is connected

## 🐛 Troubleshooting

### Issue: "Page not found" on refresh
**Solution**: This is handled by the `vercel.json` configuration with the catch-all route.

### Issue: API calls failing
**Solution**: 
1. Check environment variables in Vercel dashboard
2. Ensure MongoDB URI is correct
3. Verify JWT_SECRET is set

### Issue: Build failing
**Solution**:
1. Check for any missing dependencies
2. Ensure all imports are correct
3. Verify Tailwind CSS configuration

## 📁 Project Structure for Deployment

```
your-project/
├── src/                    # React source code
├── dist/                   # Build output (auto-generated)
├── server.js              # Backend API
├── vercel.json            # Vercel configuration
├── vite.config.js         # Vite configuration
├── package.json           # Dependencies and scripts
└── .env                   # Environment variables (local only)
```

## 🔗 Important URLs

- **Frontend**: `https://your-app.vercel.app`
- **API Base**: `https://your-app.vercel.app/api`
- **MongoDB**: Your MongoDB Atlas cluster

## ✅ Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Vercel project connected
- [ ] Environment variables set
- [ ] Build successful
- [ ] Site loads correctly
- [ ] Navigation works
- [ ] API endpoints respond
- [ ] Authentication works
- [ ] Database connected

## 🎉 Success!

Your StyleStore e-commerce site should now be live and fully functional! 🛍️✨ 