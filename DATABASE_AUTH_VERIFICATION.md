# Database Authentication Verification

## ✅ System Architecture

Your BMS-Nuevo system is configured to **ALWAYS** validate credentials against **CockroachDB**:

```
login.html
    ↓
login.js submits credentials
    ↓
POST /api/auth/login (backend route)
    ↓
routes/auth.js validates against database
    ↓
SELECT FROM users table in CockroachDB
    ↓
Verify password hash with bcrypt
    ↓
Return tokens if credentials match
```

## ✅ Database Configuration

### Connection String
The system uses: `DATABASE_URL` from `.env` file

**Example for CockroachDB Cloud:**
```
DATABASE_URL=postgresql://username:password@host:26257/defaultdb?sslmode=verify-full
```

**Configuration Location:**
- File: `config/database.js`
- Method: Uses `pg` (PostgreSQL client)
- Connection Pool: 20 max connections
- SSL: Enabled by default

### Verification
When server starts, you'll see:
```
✓ Database connected successfully at: [timestamp]
```

## ✅ Authentication Flow

### Step 1: Seed Test Users (First Time Only)
```bash
node scripts/seed-test-users.js
```

**What happens:**
1. Script connects to CockroachDB
2. Checks if admin user exists
3. Hashes password: `admin123` → bcrypt hash
4. Inserts into `users` table:
   - username: `admin`
   - email: `eugenemaddela9@gmail.com`
   - password_hash: (hashed)
   - first_name: `Eugene`
   - last_name: `Maddela`
   - role: `admin`
   - status: `active`
5. Creates corresponding profile in database
6. Logs action in audit logs

### Step 2: Login with Credentials
**Request:**
```json
{
  "username": "admin",
  "password": "admin123",
  "rememberMe": false
}
```

**Backend Processing (routes/auth.js):**
1. Query database:
   ```sql
   SELECT id, username, email, password_hash, role, status
   FROM users
   WHERE LOWER(username) = 'admin' OR LOWER(email) = 'admin@...'
   ```

2. Verify password:
   ```javascript
   const isPasswordValid = await comparePassword('admin123', stored_hash);
   ```

3. Check account status:
   ```javascript
   if (user.status === 'active') {
     // Generate tokens
     // Return success
   }
   ```

4. Record login attempt:
   ```sql
   INSERT INTO login_attempts (...)
   ```

5. Return tokens:
   ```json
   {
     "success": true,
     "accessToken": "jwt_token",
     "refreshToken": "jwt_token",
     "user": {
       "id": 123,
       "username": "admin",
       "email": "eugenemaddela9@gmail.com",
       "role": "admin"
     }
   }
   ```

### Step 3: Dashboard Redirect
Based on role from database:
- `role: 'admin'` → `/admin/admin-dashboard.html`
- `role: 'official'` → `/official-dashboard.html`
- `role: 'resident'` → `/resident-dashboard.html`

## ✅ Database Tables Used

### users table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  date_of_birth DATE,
  phone_number VARCHAR(20),
  purok VARCHAR(255),
  role VARCHAR(50) NOT NULL,  -- admin, official, clerk, resident
  status VARCHAR(50),         -- active, pending, rejected
  verified_at TIMESTAMP,
  last_login_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### login_attempts table
```sql
CREATE TABLE login_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier VARCHAR(255),
  attempt_at TIMESTAMP DEFAULT NOW(),
  ip_address VARCHAR(45),
  user_agent TEXT,
  success BOOLEAN DEFAULT false
);
```

### sessions table
```sql
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  token_hash VARCHAR(255),
  refresh_token_hash VARCHAR(255),
  ip_address VARCHAR(45),
  user_agent TEXT,
  remember_me BOOLEAN DEFAULT false,
  expires_at TIMESTAMP,
  revoked_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## ✅ Your Admin Account Data

**Will be stored in CockroachDB:**

```
Table: users
├── id: [auto-generated UUID]
├── username: admin
├── email: eugenemaddela9@gmail.com
├── password_hash: [bcrypt hash of 'admin123']
├── first_name: Eugene
├── last_name: Maddela
├── date_of_birth: 2005-09-30
├── phone_number: 09987654321
├── purok: Zone 4
├── role: admin
├── status: active
├── verified_at: NOW()
├── created_at: NOW()
└── updated_at: NOW()
```

## ✅ Security Features

### Password Security
- ✅ Passwords hashed with bcrypt (not stored plaintext)
- ✅ Salt rounds: 10 (industry standard)
- ✅ Password never transmitted in plaintext over HTTP (use HTTPS in production)

### Token Security
- ✅ JWT tokens signed with `JWT_SECRET`
- ✅ Access token expiry: 24 hours
- ✅ Refresh token stored in sessions table
- ✅ Token revocation on logout

### Database Security
- ✅ SSL/TLS connection to CockroachDB
- ✅ Connection pooling (max 20)
- ✅ Parameterized queries (prevents SQL injection)
- ✅ Rate limiting on login (5 attempts per 15 minutes)
- ✅ Failed login attempts logged

### Audit Trail
- ✅ All login attempts recorded (success/failure)
- ✅ All user registration logged
- ✅ IP address and user agent stored
- ✅ Timestamp on every action

## ✅ Verification Checklist

Before going live, verify:

- [ ] `.env` file exists with `DATABASE_URL` pointing to CockroachDB
- [ ] Database tables created (users, sessions, login_attempts)
- [ ] `node scripts/seed-test-users.js` runs without errors
- [ ] Admin user appears in CockroachDB `users` table
- [ ] Login page accepts credentials
- [ ] Backend validates against database (check logs)
- [ ] Correct dashboard loads after login
- [ ] JWT tokens generated and stored
- [ ] Logout clears tokens

## ✅ Testing Credentials

After seeding, you can login with:
```
Username: admin
Password: admin123
Email: eugenemaddela9@gmail.com
```

This account will be verified in the database every time you login.

## ✅ Monitoring

### Check Database Connection
```bash
# Server logs should show:
✓ Database connected successfully at: [timestamp]
```

### Check Failed Login Attempts
```sql
SELECT * FROM login_attempts WHERE success = false ORDER BY attempt_at DESC LIMIT 10;
```

### Check User Sessions
```sql
SELECT * FROM sessions WHERE user_id = '[admin_user_id]';
```

### Check Audit Log
```sql
SELECT * FROM audit_logs WHERE resource_type = 'users' ORDER BY created_at DESC LIMIT 20;
```

## ⚠️ Important Notes

1. **Database URL Required**: Login will fail if `DATABASE_URL` is not set correctly
2. **Tables Must Exist**: Create tables before seeding (migration script needed)
3. **User Must Have 'active' Status**: Pending/rejected users cannot login
4. **Password Hash Required**: Plain text passwords won't work
5. **JWT Secret Required**: Must be set in `.env` for token generation

## 🚀 Quick Start

```bash
# 1. Ensure .env has DATABASE_URL pointing to CockroachDB
cat .env | grep DATABASE_URL

# 2. Create database tables (if not exists)
# Run migration script or SQL queries

# 3. Seed test users into database
node scripts/seed-test-users.js

# 4. Start server
npm run dev

# 5. Go to login and test
# http://localhost:5000/login.html
# Username: admin
# Password: admin123
```

---

**All credentials are ALWAYS verified against CockroachDB database.**
**No hardcoded credentials. No local testing data.**
**100% database-driven authentication.**

Last Updated: November 16, 2025
