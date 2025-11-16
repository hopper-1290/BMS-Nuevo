# Deploy BMS-Nuevo to Render.com - Step by Step Guide

Complete step-by-step guide to deploy BMS-Nuevo building management system to Render.com with production database.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Step 1: Prepare Your GitHub Repository](#step-1-prepare-your-github-repository)
3. [Step 2: Create Render Account](#step-2-create-render-account)
4. [Step 3: Create PostgreSQL Database](#step-3-create-postgresql-database)
5. [Step 4: Deploy Web Service](#step-4-deploy-web-service)
6. [Step 5: Configure Environment Variables](#step-5-configure-environment-variables)
7. [Step 6: Test Your Deployment](#step-6-test-your-deployment)
8. [Step 7: Monitor and Troubleshoot](#step-7-monitor-and-troubleshoot)
9. [Maintenance & Updates](#maintenance--updates)
10. [Cost & Billing](#cost--billing)

---

## Prerequisites

Before starting, you need:

- ✅ GitHub account with your repository
- ✅ Email address for Render.com signup
- ✅ Credit card for Render.com (free tier available)
- ✅ All code pushed to GitHub main branch
- ✅ .env.example file in repository root

### Verify Prerequisites

Run these commands in your project directory:

```bash
# Verify git is initialized
git status

# Verify .env.example exists
ls -la .env.example

# Verify package.json exists
ls -la package.json

# Verify server.js exists
ls -la server.js
```

---

## Step 1: Prepare Your GitHub Repository

### 1.1 Update package.json

Your `package.json` should have these properties:

```json
{
  "name": "bms-nuevo",
  "version": "1.0.0",
  "description": "Building Management System",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "init-db": "node scripts/init-db.js"
  },
  "engines": {
    "node": "18.x"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mysql": "^2.18.1",
    "dotenv": "^16.0.3",
    "cors": "^2.8.5",
    "body-parser": "^1.20.2"
  }
}
```

✅ **Verify:** Open `package.json` and check the `"start"` script points to `node server.js`

### 1.2 Update .env.example

Create or update `.env.example` in your project root:

```env
# Server Configuration
NODE_ENV=production
PORT=10000

# Database Configuration (will be set by Render)
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password_here
DB_NAME=bms_database

# API Configuration
API_URL=https://your-app.onrender.com
API_PORT=10000
```

### 1.3 Create render.yaml

Create a `render.yaml` file in your project root:

```yaml
services:
  - type: web
    name: bms-nuevo
    runtime: node
    plan: free
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
```

### 1.4 Commit and Push to GitHub

```bash
# Stage all changes
git add .

# Commit
git commit -m "Prepare for Render deployment"

# Push to GitHub
git push origin main
```

✅ **Verify:** Go to GitHub and confirm files appear in `main` branch

---

## Step 2: Create Render Account

### 2.1 Sign Up for Render.com

1. Go to https://render.com
2. Click **"Sign up"** button
3. Choose signup method:
   - Email and password
   - GitHub (recommended)
   - Google account

**Recommended:** Use GitHub for automatic integration

### 2.2 Complete Setup

1. Verify your email address
2. Fill in your profile information
3. Add billing information (credit card)
4. Accept terms of service

✅ **Done:** You now have a Render.com account

---

## Step 3: Create PostgreSQL Database

### 3.1 Create New Database

1. Log in to https://render.com
2. Click **"+ New"** button (top right)
3. Select **"PostgreSQL"**
4. Fill in database details:
   - **Name:** `bms-database`
   - **Database:** `bms_database`
   - **User:** `postgres`
   - **Region:** Choose closest to your users
   - **Plan:** Free (for testing) or Paid

5. Click **"Create Database"**

### 3.2 Save Connection Details

After database is created, you'll see connection details. **COPY AND SAVE:**

```
Host: dpg-xxxxx-a.oregon-postgres.render.com
Database: bms_database
User: postgres
Password: xxxxxxxxxxxxxxxx
Port: 5432
```

**IMPORTANT:** Save these safely - you'll need them in Step 5

### 3.3 Wait for Database to be Ready

The database status will show:
- 🟡 **Creating** (1-2 minutes)
- 🟢 **Available** (Ready to use)

✅ **Wait until status is "Available"**

---

## Step 4: Deploy Web Service

### 4.1 Create New Web Service

1. Go to https://render.com
2. Click **"+ New"** button
3. Select **"Web Service"**
4. Choose repository connection:
   - **Public Repository:** Paste your GitHub URL
   - **GitHub Account:** Select from list (if already connected)

5. Fill in service details:
   - **Name:** `bms-nuevo`
   - **Branch:** `main`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free (for testing)

6. Click **"Create Web Service"**

### 4.2 Watch Deployment Progress

The deployment will show:
- 🔵 **Building** - Fetching dependencies
- 🟡 **Building** - Running build command
- 🔵 **Building** - Preparing service
- 🟢 **Live** - Service is ready

This takes **3-5 minutes** on first deployment.

✅ **Wait until status is "Live"**

### 4.3 Get Your Service URL

Once deployed, you'll see:

```
https://bms-nuevo.onrender.com
```

**SAVE THIS URL** - You'll use it to access your application

---

## Step 5: Configure Environment Variables

### 5.1 Add Environment Variables

1. In Render dashboard, select your web service (`bms-nuevo`)
2. Click **"Environment"** tab
3. Click **"Add Environment Variable"**
4. Add each variable (from database connection details):

| Key | Value | Example |
|-----|-------|---------|
| `NODE_ENV` | `production` | production |
| `PORT` | `10000` | 10000 |
| `DB_HOST` | From database connection | `dpg-xxxxx-a.oregon-postgres.render.com` |
| `DB_PORT` | From database connection | `5432` |
| `DB_USER` | From database connection | `postgres` |
| `DB_PASSWORD` | From database connection | `xxxxxxxxxxxx` |
| `DB_NAME` | From database connection | `bms_database` |
| `API_URL` | Your Render URL | `https://bms-nuevo.onrender.com` |

### 5.2 Format Example

```
KEY: DB_HOST
VALUE: dpg-xxxxx-a.oregon-postgres.render.com

KEY: DB_PASSWORD
VALUE: xxxxxxxxxxxxxxxx
```

### 5.3 Save Environment Variables

1. After adding all variables, click **"Save"**
2. Service will automatically restart with new environment

✅ **Wait 1-2 minutes for restart**

---

## Step 6: Test Your Deployment

### 6.1 Test Login Page

1. Open browser
2. Go to: `https://bms-nuevo.onrender.com`
3. You should see the landing page
4. Click **"Login"** or navigate to `/login.html`

### 6.2 Test Login Functionality

Try logging in with test credentials:

**Resident Account:**
- Username: `resident1`
- Password: `password`

**Official Account:**
- Username: `official1`
- Password: `password`

**Admin Account:**
- Username: `admin`
- Password: `admin123`

### 6.3 Test Real-Time Features

1. Log in to any dashboard
2. Verify **live clock** updates every second
3. Verify **date** is correct
4. Verify **calendar** shows today highlighted
5. Wait 30 seconds and verify **calendar** animation pulses

### 6.4 Check Deployment Logs

If anything doesn't work:

1. In Render dashboard, select your service
2. Click **"Logs"** tab
3. Look for errors in red text
4. Scroll to see most recent logs

✅ **All tests pass:** Your deployment is successful!

---

## Step 7: Monitor and Troubleshoot

### Common Issues and Solutions

#### Issue: "Cannot GET /"

**Cause:** Server not responding

**Solution:**
1. Check if service is in "Live" status
2. Go to "Logs" tab and look for errors
3. Verify environment variables are set
4. Check if `server.js` has correct port (should use `process.env.PORT`)

#### Issue: "Database Connection Failed"

**Cause:** Wrong database credentials

**Solution:**
1. Verify DB_HOST, DB_USER, DB_PASSWORD are correct
2. Check if database status is "Available"
3. Go to database details and copy credentials again
4. Update environment variables in Render
5. Manual restart: In web service, click "Manual Deploy" → "Deploy latest commit"

#### Issue: "Login page loads but login fails"

**Cause:** Database not initialized

**Solution:**
1. SSH into service (if available)
2. Run: `node scripts/init-db.js`
3. Or create tables manually via database connection
4. Verify credentials in database

#### Issue: "Clock not updating in real-time"

**Cause:** JavaScript not loading or browser issue

**Solution:**
1. Open browser Developer Tools (F12)
2. Check Console tab for errors
3. Check Network tab - ensure all .js files load
4. Clear cache: Ctrl+Shift+Delete
5. Hard refresh: Ctrl+Shift+R

#### Issue: "Real-time calendar not highlighting today"

**Cause:** Browser time zone or JavaScript timing issue

**Solution:**
1. Verify browser date/time is correct
2. Check if 30-second refresh interval is working (watch calendar update)
3. Open console and check for calendar-related errors
4. Try in Incognito/Private window

### Check Service Status

```
✅ Green status = Service running
🟡 Yellow status = Service deploying or restarting
🔴 Red status = Service crashed or failed
```

### View Logs in Real-Time

1. Select your web service
2. Click **"Logs"** tab
3. Logs update automatically
4. Search for specific errors using browser search (Ctrl+F)

---

## Maintenance & Updates

### Deploy Updates to Production

After making code changes:

```bash
# 1. Commit changes locally
git add .
git commit -m "Your commit message"

# 2. Push to GitHub
git push origin main

# 3. Render automatically detects and deploys
# Watch deployment in Render dashboard (3-5 minutes)
```

### Manual Redeployment

If auto-deploy doesn't trigger:

1. Go to Render dashboard
2. Select your web service
3. Click **"Manual Deploy"** button
4. Select **"Deploy latest commit"**
5. Wait for deployment to complete

### Database Backups

**Free Plan:** No automatic backups

**Recommendation:** 
- Export database weekly
- Keep backup locally
- Use paid plan for automatic backups

### Monitor Performance

1. Click **"Metrics"** tab to view:
   - CPU usage
   - Memory usage
   - Network activity
   - Request count

---

## Cost & Billing

### Free Tier

- **Web Service:** Free for 750 hours/month (always on: 24/7 × 30 = 720 hours)
- **PostgreSQL Database:** 256 MB for free
- **Bandwidth:** Included
- **Instances:** 1 shared CPU, 512MB RAM

**Cost:** $0/month

### Paid Tiers

| Plan | Price/Month | Features |
|------|-------------|----------|
| Starter | $7 | Private service, 1GB disk |
| Standard | $12 | Auto-scaling, daily backups |
| Pro | $25+ | Priority support, more resources |

### Estimate Your Costs

- **Web Service:** $0-7/month
- **PostgreSQL:** $0-15/month
- **Bandwidth:** Included (up to limits)
- **Total for Free Tier:** $0/month

**Recommendation:** Start with Free tier, upgrade when needed

---

## ✅ Deployment Checklist

Before deploying, verify:

- [ ] GitHub repository is public or private (Render has access)
- [ ] `.env.example` file exists in root
- [ ] `package.json` has correct "start" script
- [ ] `server.js` exists and uses `process.env.PORT`
- [ ] All code is committed and pushed to GitHub
- [ ] Render.com account created
- [ ] PostgreSQL database created and available
- [ ] Web service created and in "Live" status
- [ ] All environment variables added
- [ ] Login page loads and responds
- [ ] Login with test credentials works
- [ ] Real-time clock updates every second
- [ ] Real-time calendar updates every 30 seconds

---

## 🎉 Deployment Complete!

Your BMS-Nuevo application is now live on Render.com!

### Next Steps

1. **Share your URL:** `https://bms-nuevo.onrender.com`
2. **Create user accounts** via admin dashboard
3. **Configure settings** for your building
4. **Monitor performance** using Render dashboard
5. **Setup custom domain** (optional, in Render settings)

### Support Resources

- **Render Documentation:** https://render.com/docs
- **Node.js Guide:** https://nodejs.org/en/docs/
- **Express.js Guide:** https://expressjs.com/
- **PostgreSQL Guide:** https://www.postgresql.org/docs/

### Useful Links

- **Your App:** https://bms-nuevo.onrender.com
- **Render Dashboard:** https://dashboard.render.com
- **GitHub Repository:** https://github.com/yourusername/BMS-Nuevo
- **Render Docs:** https://render.com/docs

---

**Last Updated:** November 16, 2025
**Version:** 1.0.0
**Status:** Deployment Ready

For more information, see the main [README.md](./README.md) file.
