# BMS Quick Reference - CockroachDB Integration

## 🚀 30-Second Setup

```bash
# 1. Install packages
npm install

# 2. Initialize database
npm run init-db

# 3. Start server
npm run dev

# 4. Open browser
open http://localhost:5000/login.html
```

## 🔐 Demo Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `Admin@123456` |
| Clerk | `clerk` | `Resident@12345` |
| Resident | `resident1` | `Resident@12345` |

## 📡 Core API Endpoints

```javascript
// Register new account
POST /api/auth/register
{
  "firstName": "Juan",
  "lastName": "Dela Cruz",
  "dateOfBirth": "1990-01-15",
  "purok": "Zone A",
  "phoneNumber": "09171234567",
  "username": "juan_dc",
  "email": "juan@example.com",
  "password": "SecurePass123!",
  "acceptedTerms": true,
  "acceptedPrivacy": true
}

// Login
POST /api/auth/login
{
  "username": "juan_dc",
  "password": "SecurePass123!",
  "rememberMe": false
}
→ Returns: { accessToken, refreshToken, user }

// Get current user (requires auth header)
GET /api/auth/me
Header: Authorization: Bearer [accessToken]

// Logout
POST /api/auth/logout
Header: Authorization: Bearer [accessToken]

// Check username availability
GET /api/auth/check-username/juan_dc

// Check email availability
GET /api/auth/check-email/juan@example.com

// Get registration status
GET /api/auth/status/[userId]
```

## 🗄️ Database Quick Access

```bash
# Connect to CockroachDB
psql $DATABASE_URL

# View all users
SELECT id, username, email, role, status FROM users;

# View active sessions
SELECT user_id, ip_address, created_at FROM sessions WHERE revoked_at IS NULL;

# View recent audit logs
SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 20;

# View login attempts
SELECT identifier, attempt_at, ip_address, success FROM login_attempts ORDER BY attempt_at DESC;
```

## 🔑 Environment Variables

```env
DATABASE_URL=postgresql://user:pass@host:26257/db?sslmode=verify-full
JWT_SECRET=your_secret_key
PORT=5000
NODE_ENV=production
```

## 📝 File Structure

```
BMS-Nuevo/
├── config/
│   ├── database.js      ← DB connection pool
│   └── auth.js          ← Auth utilities & validation
├── middleware/
│   └── auth.js          ← JWT, rate limiting, error handling
├── routes/
│   └── auth.js          ← All auth API endpoints
├── scripts/
│   ├── schema.sql       ← Database schema
│   └── init-db.js       ← Database initialization
├── public/
│   ├── login.html       ← Login/Register forms
│   └── js/
│       └── login.js     ← Frontend API integration
├── server.js            ← Express server setup
├── package.json         ← Dependencies
├── .env                 ← Configuration (has DATABASE_URL)
├── BACKEND_SETUP.md     ← Full backend guide
├── ENV_SETUP.md         ← Environment configuration
└── INTEGRATION_SUMMARY.md ← This summary
```

## 🔒 Security Features

| Feature | Implementation |
|---------|-----------------|
| **Passwords** | bcrypt, 10 rounds |
| **Tokens** | JWT, 24h access + 7d refresh |
| **Rate Limiting** | 5 attempts/15 min, DB tracked |
| **Sessions** | Secure, can be revoked |
| **Audit Trail** | All actions logged in DB |
| **Input Validation** | Server-side, parameterized queries |
| **CORS** | Configured per domain |
| **Headers** | Helmet security headers |

## 💾 Database Tables

```
users              → User accounts (id, username, email, password_hash, role, status)
sessions           → Active sessions (id, user_id, token_hash, expires_at)
residents          → Resident profiles (id, user_id, first_name, last_name, purok)
officials          → Barangay officials (id, user_id, position, term_start, term_end)
announcements      → System announcements (id, title, content, author_id, status)
events             → Barangay events (id, title, start_date, organizer_id)
complaints         → Community complaints (id, title, category, complainant_id, status)
documents          → Resident documents (id, resident_id, document_type, status)
audit_logs         → Action audit trail (id, user_id, action_type, details, timestamp)
login_attempts     → Failed/successful logins (id, identifier, attempt_at, success)
password_reset_tokens     → Password recovery tokens
email_verification_tokens → Email verification tokens
```

## 🚨 Common Issues & Fixes

### Server won't start
```bash
# Check port is available
lsof -i :5000

# Check .env exists
cat .env | grep DATABASE_URL

# Reinstall dependencies
npm install
```

### Database initialization fails
```bash
# Verify DATABASE_URL
echo $DATABASE_URL

# Test connection
npm run init-db

# Check CockroachDB is accessible
nc -zv bms-jaguar-18449.j77.aws-ap-southeast-1.cockroachlabs.cloud 26257
```

### Login not working
```bash
# Check credentials (case-sensitive username)
SELECT * FROM users WHERE username = 'admin';

# Verify password hash exists
SELECT password_hash FROM users WHERE username = 'admin' LIMIT 1;

# Check server logs
npm run dev
```

### Tokens expired
```javascript
// Frontend should catch 401 and refresh
POST /api/auth/refresh
{
  "refreshToken": "eyJhbGci..."
}
→ Returns new accessToken
```

## 📊 npm Scripts

```bash
npm start       # Start production server
npm run dev     # Start with auto-reload
npm run init-db # Initialize database
```

## 🎯 Frontend Integration Points

```javascript
// Send request with token
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username, password, rememberMe })
});
const data = await response.json();

// Store tokens (NOT localStorage)
sessionStorage.setItem('accessToken', data.accessToken);
sessionStorage.setItem('refreshToken', data.refreshToken);

// Use token in requests
fetch('/api/auth/me', {
  headers: {
    'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
  }
});
```

## 🔄 Authentication Flow

```
1. User registers
   ↓
   POST /api/auth/register
   ↓
   User created in DB with status: "pending"
   ↓
   Show pending status page with Reference ID
   
2. User logs in
   ↓
   POST /api/auth/login
   ↓
   Check rate limiting (5 attempts/15 min)
   ↓
   Verify credentials against DB
   ↓
   Check account status = "active"
   ↓
   Generate JWT tokens
   ↓
   Store session in DB
   ↓
   Return tokens + user info
   ↓
   Frontend stores in sessionStorage
   ↓
   Redirect to dashboard

3. Token expiry
   ↓
   Frontend gets 401 error
   ↓
   POST /api/auth/refresh with refreshToken
   ↓
   Get new accessToken
   ↓
   Continue working
```

## 🎓 Key Concepts

### JWT Tokens
- **accessToken**: Short-lived (24h), use for API requests
- **refreshToken**: Long-lived (7d), use to get new access tokens

### Session Storage vs localStorage
- ❌ localStorage: Persists after browser close (security risk)
- ✅ sessionStorage: Cleared when tab closes (better for tokens)

### Rate Limiting
- Maximum 5 failed login attempts per 15 minutes
- Tracked by IP address in database
- Account temporarily locked after threshold

### Audit Logging
- Every action recorded in `audit_logs` table
- Includes user, action type, timestamp, IP address
- Useful for compliance and forensics

## 🚀 Deployment Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Generate secure `JWT_SECRET`
- [ ] Use CockroachDB Cloud connection
- [ ] Set `ALLOWED_ORIGINS` (remove localhost)
- [ ] Enable HTTPS for all connections
- [ ] Test all API endpoints
- [ ] Check rate limiting works
- [ ] Verify tokens refresh correctly
- [ ] Monitor audit logs
- [ ] Set up error monitoring
- [ ] Enable database backups

## 📞 Quick Help

```bash
# View database logs
npm run dev

# Reset database (WARNING: Deletes all data)
# Edit init-db.js to drop tables first

# View active users
psql $DATABASE_URL -c "SELECT * FROM users;"

# View failed login attempts
psql $DATABASE_URL -c "SELECT * FROM login_attempts WHERE success = false;"

# Check token in header
# DevTools → Network → Headers → Authorization
```

## 📚 Documentation Files

- **BACKEND_SETUP.md** - Complete backend guide
- **ENV_SETUP.md** - Environment configuration
- **INTEGRATION_SUMMARY.md** - Full integration details
- **schema.sql** - Database schema
- **config/auth.js** - Auth utilities source code

---

**System Status:** ✅ Production Ready

**Last Updated:** November 2025

For detailed information, see the comprehensive documentation files.
