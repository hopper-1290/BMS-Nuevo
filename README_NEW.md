# Barangay Management System (BMS)

A modern, real-time Barangay Management System built with Node.js, React, and CockroachDB.

## Features

- **Authentication & Authorization**: Role-based access control (Resident, Official, Admin)
- **User Management**: Comprehensive user management for all roles
- **Document Management**: Request, approve, and track documents with print functionality
- **Announcements & Events**: Create, manage, and publish barangay announcements and events
- **Complaint Management**: Submit and track complaints with status updates
- **Audit Logging**: Complete audit trail for all system actions
- **Frosted Glass UI**: Modern, visually appealing interface with frosted glass design
- **Resident Dashboard**: Personal dashboard with profile, requests, complaints, and events

## Tech Stack

- **Backend**: Node.js with Express.js
- **Frontend**: React 18
- **Database**: CockroachDB (PostgreSQL compatible)
- **Authentication**: JWT
- **Password Hashing**: bcryptjs
- **API Documentation**: Built-in REST API

## Installation

### Prerequisites
- Node.js >= 18.0.0
- npm or yarn
- CockroachDB credentials

### Backend Setup

1. Navigate to the project root:
```bash
cd path/to/BMS
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file with your database credentials:
```
DATABASE_URL=postgresql://eugene:Jq7tSeEAfKLbOvYjW3Xpjg@bms-ostrich-18371.j77.aws-ap-southeast-1.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
NODE_ENV=development
REACT_APP_API_URL=http://localhost:5000
```

4. Seed the database:
```bash
npm run seed
```

5. Start the server:
```bash
npm start
```

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the React development server:
```bash
npm start
```

## Running Both Frontend and Backend

From the root directory:
```bash
npm run dev
```

## Deployment

### Deploy to Render.com

1. Push code to GitHub
2. Create a new Web Service on Render.com
3. Connect your GitHub repository
4. Set environment variables in Render settings
5. Build command: `npm install`
6. Start command: `node server.js`

### Building for Production

```bash
cd client
npm run build
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | CockroachDB connection string |
| `JWT_SECRET` | Secret key for JWT signing |
| `PORT` | Server port (default: 5000) |
| `NODE_ENV` | Environment (production) |
| `REACT_APP_API_URL` | Frontend API URL |

## Security Notes

- All passwords are hashed using bcryptjs
- JWT tokens expire in 7 days
- SSL/TLS encryption for database connection
- CORS enabled for production deployment
- Helmet.js for security headers
- Input validation on all endpoints

## Database Schema

For complete database schema documentation, see [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md).

### Key Tables Overview

| Table | Purpose |
|-------|---------|
| `users` | System authentication and role management |
| `residents` | Resident profiles and household information |
| `officials` | Barangay officials and positions |
| `document_requests` | Document request tracking (clearance, permits, etc.) |
| `complaints` | Complaint submission and resolution |
| `events` | Community events and registrations |
| `announcements` | Official announcements and notices |
| `messages` | Messaging and inbox system |
| `audit_logs` | Complete audit trail for all actions |
| `households` | Household groupings and family relations |

### Schema Highlights

- **Primary Keys**: UUID type for all records
- **Timestamps**: All tables include `created_at`, `updated_at`, and soft-delete `deleted_at`
- **Soft Deletes**: Records are marked deleted rather than physically removed
- **Audit Trail**: Every administrative action logged with actor, timestamp, and details
- **Relationships**: Proper foreign key constraints with cascade behaviors
- **JSON Fields**: JSONB columns for flexible metadata, attachments, and custom data
- **Indexes**: Optimized for common query patterns (email, username, status, dates)

### Security Features

- Encrypted password storage with bcryptjs
- Masked sensitive data (National ID) in resident records
- Role-based access control enforcement
- Session tokens with short expiry times
- Failed login rate-limiting
- Comprehensive audit logging for compliance

### API Endpoints Reference

**Resident Dashboard:**
- `GET /residents/{id}/dashboard` - Dashboard summary
- `GET /residents/{id}/profile` - Resident profile
- `PATCH /residents/{id}/profile` - Update profile

**Documents:**
- `POST /documents/requests` - Request new document
- `GET /residents/{id}/documents` - List requests

**Complaints:**
- `GET /residents/{id}/complaints` - List complaints
- `POST /complaints` - File new complaint
- `GET /complaints/{id}` - Complaint details

**Events:**
- `GET /events` - List all events
- `POST /events/{id}/register` - Register for event
- `GET /residents/{id}/events` - Registered events

**Announcements:**
- `GET /announcements` - List announcements
- `GET /announcements/{id}` - Announcement details

## Contributing

1. Create a feature branch
2. Make your changes
3. Commit with descriptive messages
4. Push to GitHub
5. Create a Pull Request

## Support

For issues or questions, please check the GitHub repository or contact the development team.
