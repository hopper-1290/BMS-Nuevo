Database Schema for Barangay Management System (CockroachDB)
Date: November 15, 2025

This document describes the PostgreSQL-compatible (CockroachDB) schema for the Barangay Management System covering Residents, Officials, Admins, Documents, Complaints, Events, Announcements, Messages, Audit, Exports/Imports, sessions/security, and pending registrations. UUIDs are used for primary keys, timestamps use TIMESTAMPTZ, and JSONB columns are used for flexible metadata. Soft deletes use deleted_at where applicable.

Conventions & Notes
Primary keys: UUID (gen_random_uuid() / gen_uuid() depending on environment).
Timestamps: created_at, updated_at are TIMESTAMPTZ with defaults.
Soft deletes: deleted_at TIMESTAMPTZ NULL.
Strings: use STRING (CockroachDB-compatible) or TEXT where large text expected.
JSON fields: JSONB (for flexible metadata / arrays).
Indexes: include common indexes (lowercase email/username, status, foreign keys, date fields).
Sensitive data: store masked forms or references to secure file storage; encrypt PII at rest where required.
Validation: enforce in application layer and some checks via DB constraints.
Age/DOB rules: enforce at registration (min 16, max 90) in application; optional DB CHECK examples included.
Tables
users
System accounts (residents, officials, admins).

id UUID PK
username STRING NOT NULL UNIQUE
email STRING NULL UNIQUE
password_hash STRING NULL
full_name STRING NOT NULL
roles STRING[] NOT NULL DEFAULT ['resident']
status STRING NOT NULL DEFAULT 'active' -- active, disabled, pending
mfa_enabled BOOL DEFAULT FALSE
last_login_at TIMESTAMPTZ NULL
last_login_ip STRING NULL
created_at TIMESTAMPTZ DEFAULT now()
updated_at TIMESTAMPTZ DEFAULT now()
deleted_at TIMESTAMPTZ NULL
Indexes:

idx_users_email_lower ON lower(email)
idx_users_username_lower ON lower(username)
residents
Resident profiles linked optionally to users.

id UUID PK
user_id UUID NULL REFERENCES users(id) ON DELETE SET NULL
resident_id STRING UNIQUE NOT NULL -- human-friendly ID
first_name STRING NOT NULL
middle_name STRING NULL
last_name STRING NOT NULL
dob DATE NOT NULL
sex STRING NULL
purok STRING NOT NULL
barangay_zone STRING NULL
address STRING NULL
contact_number STRING NULL
email STRING NULL
national_id_masked STRING NULL
household_id UUID NULL REFERENCES households(id)
occupation STRING NULL
marital_status STRING NULL
registration_status STRING NOT NULL DEFAULT 'active' -- active, pending, archived
photo_url STRING NULL
privacy_settings JSONB DEFAULT '{}'
created_at TIMESTAMPTZ DEFAULT now()
updated_at TIMESTAMPTZ DEFAULT now()
deleted_at TIMESTAMPTZ NULL
Indexes:

idx_residents_purok (purok)
idx_residents_dob (dob)
Optional CHECK (example):

CHECK to ensure DOB age limits enforced at application level.
households
Household header info.

id UUID PK
household_id STRING UNIQUE NOT NULL
head_resident_id UUID NULL REFERENCES residents(id)
purok STRING NULL
address STRING NULL
created_at TIMESTAMPTZ DEFAULT now()
updated_at TIMESTAMPTZ DEFAULT now()
deleted_at TIMESTAMPTZ NULL
household_members
Links residents to households.

id UUID PK
household_id UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE
resident_id UUID NOT NULL REFERENCES residents(id) ON DELETE CASCADE
relation STRING NULL
created_at TIMESTAMPTZ DEFAULT now()
updated_at TIMESTAMPTZ DEFAULT now()
Unique:

UNIQUE (household_id, resident_id)
officials
Official profiles (may link to a user account).

id UUID PK
user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
official_id STRING UNIQUE NOT NULL
full_name STRING NOT NULL
position STRING NOT NULL
term_start DATE NULL
term_end DATE NULL
contact_number STRING NULL
email STRING NULL
photo_url STRING NULL
appointment_docs JSONB NULL
status STRING DEFAULT 'active' -- active, former, on_leave
linked_user_id UUID NULL
created_at TIMESTAMPTZ DEFAULT now()
updated_at TIMESTAMPTZ DEFAULT now()
Indexes:

idx_officials_position (position)
document_requests
Document / certificate / permit requests.

id UUID PK
request_id STRING UNIQUE NOT NULL
resident_id UUID NOT NULL REFERENCES residents(id)
type STRING NOT NULL -- clearance, certificate, permit
status STRING NOT NULL DEFAULT 'submitted' -- submitted, reviewed, processing, approved, released, cancelled, rejected
metadata JSONB DEFAULT '{}'
attachments JSONB NULL -- array of file refs
payment_info JSONB NULL
submitted_at TIMESTAMPTZ DEFAULT now()
updated_at TIMESTAMPTZ DEFAULT now()
processed_by UUID NULL REFERENCES users(id)
processed_at TIMESTAMPTZ NULL
Indexes:

idx_docreq_resident (resident_id)
idx_docreq_status (status)
complaints
Resident complaints and issues.

id UUID PK
complaint_id STRING UNIQUE NOT NULL
resident_id UUID NULL REFERENCES residents(id)
complainant_name STRING NULL
contact STRING NULL
category STRING NOT NULL
subcategory STRING NULL
subject STRING NULL
description TEXT NOT NULL
purok STRING NULL
location STRING NULL
confidential BOOL DEFAULT FALSE
attachments JSONB NULL
status STRING NOT NULL DEFAULT 'new' -- new, in_progress, resolved, closed, rejected
assigned_to UUID NULL REFERENCES users(id)
priority STRING DEFAULT 'normal'
resolution_notes TEXT NULL
reported_at TIMESTAMPTZ DEFAULT now()
updated_at TIMESTAMPTZ DEFAULT now()
resolved_at TIMESTAMPTZ NULL
Indexes:

idx_complaints_status (status)
idx_complaints_purok (purok)
idx_complaints_assigned (assigned_to)
events
Community events.

id UUID PK
event_id STRING UNIQUE NOT NULL
title STRING NOT NULL
description TEXT NULL
organizer_id UUID NULL REFERENCES users(id)
category STRING NULL
start_at TIMESTAMPTZ NOT NULL
end_at TIMESTAMPTZ NOT NULL
venue STRING NULL
max_capacity INT NULL
registration_required BOOL DEFAULT FALSE
status STRING DEFAULT 'draft' -- draft, published, cancelled
attachments JSONB NULL
created_by UUID NULL REFERENCES users(id)
created_at TIMESTAMPTZ DEFAULT now()
updated_at TIMESTAMPTZ DEFAULT now()
Indexes:

idx_events_start (start_at)
idx_events_status (status)
event_registrations
Event RSVPs/registrations.

id UUID PK
event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE
resident_id UUID NOT NULL REFERENCES residents(id)
registered_at TIMESTAMPTZ DEFAULT now()
status STRING DEFAULT 'registered' -- registered, cancelled, attended
Unique:

UNIQUE (event_id, resident_id)
Indexes:

idx_event_reg_by_resident (resident_id)
announcements
Public announcements.

id UUID PK
announcement_id STRING UNIQUE NOT NULL
title STRING NOT NULL
body TEXT NOT NULL
audience JSONB DEFAULT '{}' -- e.g., {"purok": ["Purok1"], "roles": ["resident"]}
priority STRING DEFAULT 'normal'
pinned BOOL DEFAULT FALSE
start_at TIMESTAMPTZ NULL
end_at TIMESTAMPTZ NULL
attachments JSONB NULL
delivery_channels STRING[] DEFAULT ['in_app'] -- in_app, email, sms
status STRING DEFAULT 'draft' -- draft, published, archived
created_by UUID NULL REFERENCES users(id)
created_at TIMESTAMPTZ DEFAULT now()
updated_at TIMESTAMPTZ DEFAULT now()
Index:

idx_announcements_start (start_at)
conversations, conversation_participants, messages
Messaging / inbox system.

conversations:

id UUID PK
subject STRING NULL
created_at TIMESTAMPTZ DEFAULT now()
updated_at TIMESTAMPTZ DEFAULT now()
conversation_participants:

id UUID PK
conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE
user_id UUID NOT NULL REFERENCES users(id)
unread_count INT DEFAULT 0
last_read_at TIMESTAMPTZ NULL
UNIQUE (conversation_id, user_id)
messages:

id UUID PK
conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE
sender_user_id UUID NULL REFERENCES users(id)
sender_resident_id UUID NULL REFERENCES residents(id)
body TEXT NULL
attachments JSONB NULL
created_at TIMESTAMPTZ DEFAULT now()
Index:

idx_messages_conv (conversation_id)
notifications
In-app notifications.

id UUID PK
user_id UUID NOT NULL REFERENCES users(id)
resident_id UUID NULL REFERENCES residents(id)
type STRING NOT NULL
payload JSONB
read BOOL DEFAULT FALSE
created_at TIMESTAMPTZ DEFAULT now()
Index:

idx_notifications_user (user_id)
audit_logs
Immutable audit trail for critical actions.

id UUID PK
timestamp TIMESTAMPTZ DEFAULT now()
actor_user_id UUID NULL REFERENCES users(id)
actor_name STRING NULL
action_type STRING NOT NULL -- Create, Update, Delete, Login, Export, Import, PermissionChange, etc.
target_type STRING NULL -- Resident, Document, Event, User, Complaint, etc.
target_id STRING NULL
ip_address STRING NULL
user_agent STRING NULL
details JSONB NULL
correlation_id UUID NULL
immutable BOOL DEFAULT TRUE
Indexes:

idx_audit_actor (actor_user_id)
idx_audit_time (timestamp DESC)
exports
Export jobs and download metadata.

id UUID PK
export_id STRING UNIQUE NOT NULL
requested_by UUID NOT NULL REFERENCES users(id)
requested_at TIMESTAMPTZ DEFAULT now()
dataset STRING NOT NULL -- Residents, Complaints, Events, FullAudit, Custom
filters JSONB NULL
format STRING NOT NULL -- CSV, XLSX, JSON, PDF
status STRING DEFAULT 'queued' -- queued, processing, ready, failed
download_url STRING NULL
records_count INT NULL
retention_until TIMESTAMPTZ NULL
updated_at TIMESTAMPTZ DEFAULT now()
imports
Import jobs and validation.

id UUID PK
import_id STRING UNIQUE NOT NULL
requested_by UUID NOT NULL REFERENCES users(id)
requested_at TIMESTAMPTZ DEFAULT now()
dataset_target STRING NOT NULL
file_name STRING NULL
mapping JSONB NULL
status STRING DEFAULT 'uploaded' -- uploaded, validating, processing, completed, failed
preview_errors JSONB NULL
records_total INT NULL
records_imported INT NULL
records_failed INT NULL
rollback_available BOOL DEFAULT FALSE
report JSONB NULL
updated_at TIMESTAMPTZ DEFAULT now()
sessions
User sessions and tokens.

id UUID PK
user_id UUID NOT NULL REFERENCES users(id)
resident_id UUID NULL REFERENCES residents(id)
session_token STRING NOT NULL UNIQUE
refresh_token_hash STRING NULL
issued_at TIMESTAMPTZ DEFAULT now()
expires_at TIMESTAMPTZ NOT NULL
revoked BOOL DEFAULT FALSE
ip_address STRING NULL
user_agent STRING NULL
Index:

idx_sessions_user (user_id)
failed_logins
Rate-limiting and brute-force tracking.

id UUID PK
username STRING NULL
ip_address STRING NULL
attempted_at TIMESTAMPTZ DEFAULT now()
Index:

idx_failed_logins_time (attempted_at DESC)
registration_pending
Pending registrations (shown in Pending Form).

id UUID PK
registration_id STRING UNIQUE NOT NULL
user_payload JSONB NOT NULL -- store submitted form data securely
status STRING DEFAULT 'pending' -- pending, approved, rejected, withdrawn
reference_resident_id UUID NULL REFERENCES residents(id)
created_at TIMESTAMPTZ DEFAULT now()
updated_at TIMESTAMPTZ DEFAULT now()
estimated_review_ETA TIMESTAMPTZ NULL
Index:

idx_registration_pending_status (status)
email_queue
Queued emails (notifications).

id UUID PK
to_email STRING NOT NULL
subject STRING NULL
body TEXT NULL
payload JSONB NULL
attempt_count INT DEFAULT 0
last_attempt_at TIMESTAMPTZ NULL
status STRING DEFAULT 'queued' -- queued, sent, failed
created_at TIMESTAMPTZ DEFAULT now()
files
Stored file references (attachments).

id UUID PK
file_name STRING NOT NULL
content_type STRING NULL
url STRING NOT NULL
size_bytes INT NULL
uploaded_by UUID NULL REFERENCES users(id)
uploaded_at TIMESTAMPTZ DEFAULT now()
metadata JSONB DEFAULT '{}'
Index:

idx_files_uploaded_by (uploaded_by)
app_settings
Key-value settings.

key STRING PK
value JSONB
lookup_values
Configurable lookup values (puroks, categories).

id UUID PK
category STRING NOT NULL
code STRING NOT NULL
label STRING NOT NULL
meta JSONB NULL
UNIQUE (category, code)
Suggested Constraints, Triggers & Behaviors
Unique username/email: enforce lowercase/trim at application layer and create DB unique constraints on normalized values (e.g., lower(email)).
DOB age limits (16–90): enforce in application on registration; optional CHECK examples can be added to DB but maintain flexibility for admin overrides.
Triggers to set updated_at on row changes.
Soft-delete: application should set deleted_at and avoid physical delete unless required.
Audit every administrative action: write to audit_logs with actor, timestamp, action_type, target, details.
Rate-limiting: record failed login attempts to failed_logins; enforce progressive delays and CAPTCHA after threshold.
Session security: short-lived access tokens + refresh tokens hashed in DB; revoke refresh tokens on logout or suspicious activity.
Sensitive file storage: store files in external object storage (S3-compatible) and save signed URLs in files table; keep full IDs and sensitive documents access-controlled.
JSONB indexes: use inverted indexes for heavy JSONB searches (CockroachDB supports inverted indexes on JSONB).
Index & Performance Notes
Add composite indexes based on query patterns, e.g., (purok, status) on complaints and document_requests.
Use indexes on start_at and status columns for events and announcements.
Use materialized views or denormalized counters (with careful consistency mechanisms) for summary cards (e.g., counts for “My Complaints”, “Active Requests”).
For large-scale audit_logs, partition by time or use TTL/archival to cheaper storage.
Security & Privacy Recommendations
Encrypt PII at rest (column-level encryption where available) and restrict DB user privileges.
Store only masked national IDs in residents table; keep full documents in secured files storage with audit logging on access.
Apply role-based access control in application; never expose other users’ pending registrations or documents without authorization checks.
Use parameterized queries to prevent SQL injection.
Log and monitor suspicious activity (multiple failed logins, unusual exports).
Exports/download URLs: generate signed, time-limited URLs and record in exports table with retention_until.
Example API Mapping (for UI to DB)
GET /residents/{id}/dashboard -> aggregate counts from residents, complaints, document_requests, event_registrations, announcements
GET /residents/{id}/profile -> SELECT * FROM residents WHERE id = {id}
PATCH /residents/{id}/profile -> UPDATE residents ...; write audit log
GET /residents/{id}/complaints -> SELECT * FROM complaints WHERE resident_id = {id}
POST /complaints -> INSERT INTO complaints (...); create conversation/notification; write audit log
POST /documents/requests -> INSERT INTO document_requests; attach files; send email_queue
GET /events -> SELECT FROM events WHERE status = 'published' AND (start_at >= now() OR other filters)
POST /events/{id}/register -> INSERT INTO event_registrations; check capacity and duplicate registration
Deployment & CockroachDB Notes
Use gen_random_uuid() / crdb_internal functions recommended by your CockroachDB version.
Configure cluster zone configs if geo-partitioning is needed (e.g., resident data locality).
Consider secondary indexes and inverted indexes for JSONB searches.
Tune cluster settings for expected read/write patterns (e.g., higher write throughput for audit/log-heavy operations).
Use connection pooling and careful transaction design (avoid long-running transactions for UI flows).