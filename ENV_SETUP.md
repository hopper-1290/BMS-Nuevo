# Environment Configuration Guide

## CockroachDB Connection Setup

### Option 1: Using CockroachDB Cloud (Recommended for Production)

1. **Create Free Cluster at:** https://www.cockroachlabs.com/cloud/

2. **Get Connection String:**
   - Navigate to Cluster → Connection String
   - Copy the PostgreSQL connection string
   - Format: `postgresql://user:password@host:port/database?sslmode=verify-full`

3. **Update `.env` file:**
   ```
   DATABASE_URL=postgresql://username:password@bms-jaguar-12345.j77.aws-ap-southeast-1.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full
   JWT_SECRET=your_secure_jwt_secret_key
   PORT=5000
   NODE_ENV=production
   REACT_APP_API_URL=https://your-domain.com
   ```

### Option 2: Local CockroachDB (Development)

1. **Install CockroachDB:**
   ```bash
   # macOS
   brew install cockroachdb/tap/cockroach
   
   # Linux
   wget -qO- https://binaries.cockroachdb.com/cockroach-v23.1.0.linux-amd64.tgz | tar xvz
   sudo cp cockroach-v23.1.0.linux-amd64/cockroach /usr/local/bin/
   ```

2. **Start Local Cluster:**
   ```bash
   cockroach start-single-node --insecure --advertise-addr=localhost
   ```

3. **Create Database:**
   ```bash
   cockroach sql --insecure
   > CREATE DATABASE bms_db;
   > \q
   ```

4. **Update `.env`:**
   ```
   DATABASE_URL=postgresql://root@localhost:26257/bms_db?sslmode=disable
   ```

## JWT Configuration

### Generating a Secure JWT Secret

```bash
# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# OpenSSL
openssl rand -hex 32
```

Example:
```
JWT_SECRET=a1f3b8c2e5d7f9a4b6c8e1f3a5b7c9d1e3f5a7b9c1d3e5f7a9b1c3d5e7f9a1
```

## .env Template

Create a `.env` file in project root:

```env
# ============================================================================
# DATABASE
# ============================================================================
DATABASE_URL=postgresql://eugene:qxT76HDyToUNm59JTlHRFg@bms-jaguar-18449.j77.aws-ap-southeast-1.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full

# ============================================================================
# AUTHENTICATION
# ============================================================================
JWT_SECRET=bms_secret_key_2025_production_sheeesh
SEED_SECRET=random_seed_secret_2025

# ============================================================================
# SERVER
# ============================================================================
PORT=5000
NODE_ENV=production
ALLOW_DEV_ROUTES=true

# ============================================================================
# FRONTEND
# ============================================================================
REACT_APP_API_URL=https://bms-nuevo.onrender.com

# ============================================================================
# OPTIONAL: CORS & SECURITY
# ============================================================================
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5000,https://your-domain.com

# ============================================================================
# OPTIONAL: EMAIL SERVICE (for future notifications)
# ============================================================================
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=your-email@gmail.com
# SMTP_PASSWORD=your-app-password
# SMTP_FROM=noreply@bms.local
```

## Verify Configuration

### 1. Test Database Connection

```bash
npm run init-db
```

Expected output:
```
🔄 Starting database initialization...
📝 Executing: CREATE TABLE IF NOT EXISTS users...
   ℹ️  Table already exists (skipping)
...
✅ Database schema initialized successfully!

🌱 Seeding initial data...
✓ Admin user created (admin / Admin@123456)
✓ Clerk user created (clerk / Resident@12345)
✓ Demo resident created (resident1 / Resident@12345)
✓ Resident profile created

✅ Database seeded successfully!

✨ Database setup complete!
```

### 2. Start Development Server

```bash
npm run dev
```

Expected output:
```
BMS server listening on http://localhost:5000
Environment: production
Database: Connected
```

### 3. Test API

```bash
# Test registration endpoint
curl -X GET http://localhost:5000/api/auth/check-username/testuser

# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin@123456"}'
```

## Production Deployment Checklist

- [ ] Set `NODE_ENV=production` in `.env`
- [ ] Generate strong `JWT_SECRET` (not in code)
- [ ] Use CockroachDB Cloud connection (not local)
- [ ] Set secure `ALLOWED_ORIGINS` (not localhost)
- [ ] Enable HTTPS for all connections
- [ ] Set strong database passwords
- [ ] Enable database backups
- [ ] Configure error logging/monitoring
- [ ] Test all API endpoints
- [ ] Verify CORS settings
- [ ] Check rate limiting thresholds
- [ ] Review audit logs regularly

## Deployment Platforms

### Render.com (Recommended)

1. Connect GitHub repository
2. Create Web Service
3. Set environment variables in Dashboard
4. Deploy

### Heroku

```bash
heroku create bms-nuevo
heroku config:set DATABASE_URL=...
heroku config:set JWT_SECRET=...
git push heroku main
```

### Railway.app

```bash
railway init
railway link
railway up
```

## Troubleshooting

### "Cannot find module" Errors
```bash
rm -rf node_modules package-lock.json
npm install
```

### Database Connection Timeout
```bash
# Check connection string
# Verify firewall allows port 26257
# Ensure SSL certificates are valid
```

### JWT Token Invalid
```bash
# Check JWT_SECRET matches in config/auth.js
# Verify token hasn't expired
# Check token format (Bearer token)
```

### Port Already in Use
```bash
# Find process using port
lsof -i :5000

# Kill process
kill -9 <PID>

# Or use different port
PORT=8000 npm run dev
```

---

**Last Updated:** November 2025
