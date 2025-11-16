# BMS (Barangay Management System) - Backend Setup Guide

## Overview

This is a production-ready Node.js/Express backend for the Barangay Management System, fully integrated with **CockroachDB** (PostgreSQL-compatible distributed database). All authentication, session management, and data persistence are connected to CockroachDB via the native PostgreSQL driver.

## ✨ Key Features

- ✅ **Full Database Integration**: All data stored in CockroachDB
- ✅ **No localStorage**: All session data stored server-side (via tokens)
- ✅ **JWT Authentication**: Secure token-based authentication with refresh tokens
- ✅ **Rate Limiting**: Built-in protection against brute force attacks
- ✅ **Complete Validation**: Server-side validation for all inputs
- ✅ **Audit Logging**: Track all user actions in database
- ✅ **Session Management**: Secure session handling with token revocation
- ✅ **Role-Based Access Control**: Admin, Clerk, Resident roles

## 🛠️ Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and update:

```bash
# .env file
DATABASE_URL=postgresql://username:password@host:port/database?sslmode=verify-full
JWT_SECRET=your_jwt_secret_key
PORT=5000
NODE_ENV=production
```

The `.env` file already includes:
- **DATABASE_URL** for CockroachDB connection
- **JWT_SECRET** for token signing
- **PORT** configuration

### 3. Initialize Database

```bash
npm run init-db
```

This script will:
- Create all database tables (schema)
- Seed initial admin/clerk/resident users
- Set up indexes and constraints

**Demo Credentials:**
- Admin: `admin` / `Admin@123456`
- Clerk: `clerk` / `Resident@12345`
- Resident: `resident1` / `Resident@12345`

## 🚀 Running the Server

### Development Mode (with auto-reload)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

Server will start on `http://localhost:5000`

## 📊 Database Schema

### Core Tables

#### `users`
- Stores all user accounts (admin, clerk, resident)
- Fields: username, email, password_hash, role, status
- Status: pending, active, rejected
- Roles: admin, clerk, resident

#### `sessions`
- Secure session tokens (hashed)
- Tracks login history and device info
- Token expiration and revocation

#### `residents`
- Extended resident profiles
- One-to-one with users table
- Contact info, address, civil status

#### `officials`
- Barangay officials information
- Position and term dates

#### `audit_logs`
- Complete audit trail of all actions
- User, action type, resource, IP, timestamp

#### `login_attempts`
- Failed/successful login tracking
- Rate limiting enforcement

#### `announcements`, `events`, `complaints`, `documents`
- Additional data tables for system features

## 🔐 Authentication Flow

### Registration Flow

1. **Frontend submits registration** → POST `/api/auth/register`
2. **Server validates**:
   - Username/email uniqueness (checked against DB)
   - Password strength requirements
   - Age (16-90 years)
   - Phone number format
3. **User created in DB** with status: `pending`
4. **Reference ID returned** to track application
5. **Frontend shows pending status** page

### Login Flow

1. **Frontend submits credentials** → POST `/api/auth/login`
2. **Server validates**:
   - User exists in database
   - Account status is `active`
   - Password matches stored hash
   - Rate limiting (max 5 attempts in 15 mins)
3. **JWT tokens generated**:
   - `accessToken` (24h expiry) - for API requests
   - `refreshToken` (7d expiry) - to get new access tokens
4. **Session stored in database**:
   - Token hash (for revocation)
   - IP address, user agent
   - Last activity tracking
5. **Frontend receives tokens** and stores in `sessionStorage`
6. **User redirected to dashboard**

### Token Refresh Flow

1. **Frontend detects token expiration**
2. **POST `/api/auth/refresh`** with refreshToken
3. **Server validates** and generates new `accessToken`
4. **User can continue** without re-login

### Logout Flow

1. **Frontend requests** POST `/api/auth/logout`
2. **Server revokes token** in database
3. **Frontend clears sessionStorage**
4. **User redirected to login**

## 📡 API Endpoints

### Authentication

```
POST   /api/auth/register              Register new user
POST   /api/auth/login                 Login with credentials
POST   /api/auth/refresh               Get new access token
POST   /api/auth/logout                Logout (requires auth)
GET    /api/auth/me                    Get current user profile (requires auth)
GET    /api/auth/check-username/:name  Check username availability
GET    /api/auth/check-email/:email    Check email availability
GET    /api/auth/status/:userId        Get registration status
```

### Request/Response Examples

#### Register
```javascript
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

Response:
{
  "success": true,
  "message": "Registration successful...",
  "referenceId": "uuid-here",
  "email": "juan@example.com",
  "status": "pending"
}
```

#### Login
```javascript
POST /api/auth/login
{
  "username": "juan_dc",
  "password": "SecurePass123!",
  "rememberMe": false
}

Response:
{
  "success": true,
  "message": "Login successful",
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "username": "juan_dc",
    "email": "juan@example.com",
    "role": "resident"
  }
}
```

#### Get Profile (with auth)
```javascript
GET /api/auth/me
Headers: Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

Response:
{
  "success": true,
  "user": {
    "id": "uuid",
    "username": "juan_dc",
    "email": "juan@example.com",
    "first_name": "Juan",
    "last_name": "Dela Cruz",
    "role": "resident",
    "status": "active"
  }
}
```

## 🔒 Security Features

### Password Security
- Hashed with bcrypt (10 salt rounds)
- Minimum 8 characters
- Requires uppercase, lowercase, number, special char
- Never stored in plain text

### Token Security
- JWT signed with `JWT_SECRET`
- Access tokens valid 24 hours
- Refresh tokens valid 7 days
- Tokens hashed before storage in database
- Can be revoked server-side

### Rate Limiting
- 5 login attempts per 15 minutes
- Account lockout after threshold
- Tracked per IP address in database
- Progressive delays possible

### Session Management
- Secure, HttpOnly cookies option
- IP address verification
- User agent tracking
- Last activity timestamps
- Manual revocation capability

### Audit Trail
- All sensitive actions logged
- User ID, action type, resource
- IP address and user agent
- Timestamps for forensics

## 🗄️ Database Connection

### CockroachDB Setup
1. Create account at https://www.cockroachlabs.com
2. Create cluster
3. Get connection string from cluster dashboard
4. Set `DATABASE_URL` in `.env`

### Connection Pool
- Default: 20 max connections
- 30s idle timeout
- 2s connection timeout
- SSL enabled (verify-full)

### Connection Test
```bash
npm run dev
# Look for: ✓ Database connected successfully at: [timestamp]
```

## 📝 Middleware

### Authentication Middleware
```javascript
// Protect routes with authentication
app.get('/protected', authenticate, (req, res) => {
  // req.user available: { userId, role }
});

// Restrict to specific roles
app.post('/admin', authenticate, authorize(['admin']), (req, res) => {
  // Only admin users
});
```

### Rate Limiting
```javascript
// Apply rate limiting
app.post('/login', rateLimit('login', 5, 15 * 60 * 1000), (req, res) => {
  // Max 5 attempts per 15 minutes
});
```

### Error Handling
- Centralized error handler
- Consistent error responses
- No sensitive data in errors
- Stack traces in development only

## 📦 Dependencies

### Core
- `express` - Web framework
- `pg` - PostgreSQL client (CockroachDB compatible)
- `jsonwebtoken` - JWT token handling
- `bcryptjs` - Password hashing
- `dotenv` - Environment variables

### Utilities
- `cors` - Cross-origin requests
- `helmet` - Security headers
- `morgan` - Request logging
- `cookie-parser` - Cookie handling
- `express-validator` - Input validation

### Development
- `nodemon` - Auto-reload server

## 🐛 Debugging

### Enable Verbose Logging
Set in `.env`:
```
DEBUG=bms:*
NODE_ENV=development
```

### Check Database Connection
```bash
node -e "import('./config/database.js').then(() => console.log('✓ Connected')).catch(e => console.error('✗ Error:', e))"
```

### View Active Sessions
```sql
SELECT * FROM sessions WHERE revoked_at IS NULL;
```

### Check Audit Logs
```sql
SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 20;
```

## 🚨 Troubleshooting

### Database Connection Error
- Verify `DATABASE_URL` in `.env`
- Check network connectivity to CockroachDB
- Ensure SSL certificate is valid
- Test: `npm run init-db`

### Token Expired
- Frontend should handle 401 responses
- Refresh token using `/api/auth/refresh`
- Re-authenticate if refresh fails

### Rate Limiting Issues
- Check `login_attempts` table
- Clear old records if needed
- Verify IP address tracking

### Session Problems
- Check `sessions` table for revoked entries
- Verify token hash matches
- Look for expired entries

## 📚 Additional Resources

- [CockroachDB Docs](https://www.cockroachlabs.com/docs/)
- [Express.js Guide](https://expressjs.com/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [OWASP Security](https://owasp.org/)

## 📞 Support

For issues or questions:
1. Check logs: `npm run dev`
2. Review database schema
3. Verify `.env` configuration
4. Check API responses in browser DevTools

---

**Last Updated:** November 2025  
**Status:** Production Ready ✅
