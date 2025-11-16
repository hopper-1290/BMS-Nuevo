# Official Dashboard - Developer Reference Guide
## Barangay Management System

**Version:** 1.0  
**Last Updated:** November 15, 2024

---

## Quick Start

### File Locations
```
public/official-dashboard.html       (Main dashboard page - 1000+ lines)
public/css/official-dashboard.css    (Styling - 1400+ lines)  
public/js/official-dashboard.js      (Functionality - 400+ lines)
OFFICIAL_DASHBOARD_DESIGN.md         (Design documentation)
```

### Quick URLs
- **Dashboard**: `/public/official-dashboard.html`
- **Profile**: `/public/official-dashboard.html#profile` (navigate to profile section)
- **Tasks**: `/public/official-dashboard.html#tasks`
- **Calendar**: `/public/official-dashboard.html#calendar`

### How to Run
1. Open `official-dashboard.html` in a modern browser
2. Dashboard loads with sample data
3. Navigation sidebar switches between sections
4. Notifications appear in top-right of dashboard

---

## JavaScript Functions Reference

### Navigation Functions

#### `navigateToSection(sectionName)`
Switch to a different dashboard section.
```javascript
// Usage
navigateToSection('dashboard');
navigateToSection('tasks');
navigateToSection('complaints');
navigateToSection('calendar');

// Valid sections: 'dashboard', 'tasks', 'calendar', 'complaints', 
// 'approvals', 'residents', 'announcements', 'reports', 'documents', 'audit'
```

#### `getActiveSectionName()`
Get current section name.
```javascript
const current = getActiveSectionName();  // Returns: 'dashboard', 'tasks', etc.
```

### Modal & Dialog Functions

#### `showNotification(message, type)`
Display a toast notification.
```javascript
showNotification('Item approved successfully', 'success');
showNotification('Please review the complaint', 'info');
showNotification('Action failed', 'error');

// Types: 'success', 'info', 'error', 'warning'
// Auto-dismisses after 5 seconds
```

### API Functions

#### `makeAPIRequest(endpoint, method, data)`
Make authenticated API request.
```javascript
// GET request
const complaints = await makeAPIRequest('/complaints?status=pending', 'GET');

// POST request
const result = await makeAPIRequest('/comments', 'POST', {
    complaintId: '2024-0051',
    comment: 'Moving to next phase'
});

// PATCH request (update)
await makeAPIRequest('/complaints/2024-0051/status', 'PATCH', {
    status: 'Resolved'
});

// Returns: Response JSON or null on error
```

### Status & Action Functions

#### `handleApproval(itemId, status)`
Approve or reject a document.
```javascript
handleApproval('DOC-001', 'approved');
handleApproval('DOC-001', 'rejected');
```

#### `handleStatusUpdate(itemId, status)`
Update complaint status.
```javascript
handleStatusUpdate('#2024-0051', 'In Progress');
handleStatusUpdate('#2024-0051', 'Escalated');
handleStatusUpdate('#2024-0051', 'Resolved');
```

#### `handleAddNote(itemId, note)`
Add a note/comment to an item.
```javascript
handleAddNote('#2024-0051', 'Scheduled for follow-up on Nov 20');
```

#### `handleEventRSVP(eventName, status)`
RSVP for events.
```javascript
handleEventRSVP('Community Cleanup Drive', 'confirmed');
handleEventRSVP('Community Cleanup Drive', 'cancelled');
```

### Filter Functions

#### `handleTaskFilter(e)`
Filter tasks by type. Called automatically on dropdown change.
```javascript
// Triggered when user changes filter select
// Values: 'all', 'complaints', 'approvals', 'events'
```

#### `handleComplaintFilter(e)`
Filter complaints by status. Called automatically on dropdown change.
```javascript
// Values: 'all', 'pending', 'in-progress', 'escalated', 'resolved'
```

### Utility Functions

#### `formatDate(date)`
Format date for display.
```javascript
const formatted = formatDate(new Date('2024-11-15'));
// Returns: 'Nov 15, 2024'
```

#### `calculateAge(birthDate)`
Calculate age from birth date.
```javascript
const age = calculateAge(new Date('1990-05-20'));
// Returns: 34
```

#### `capitalizeFirstLetter(str)`
Capitalize first letter of string.
```javascript
const result = capitalizeFirstLetter('success');
// Returns: 'Success'
```

### Authentication Functions

#### `handleLogout()`
Logout current user and redirect to login.
```javascript
handleLogout();
// Clears stored auth data
// Shows success notification
// Redirects to /login.html after 1 second
```

---

## CSS Classes Reference

### Layout Classes

| Class | Purpose |
|-------|---------|
| `.official-header` | Top header bar |
| `.official-container` | Main flex container |
| `.official-sidebar` | Left navigation sidebar |
| `.official-main` | Main content area |
| `.content-section` | Individual section container |
| `.content-section.active` | Currently visible section |

### Component Classes

#### Summary Cards
```css
.summary-cards              /* Grid container (5 columns) */
.summary-card              /* Individual card */
.card-icon                 /* Icon wrapper (50x50px) */
.card-content              /* Text content area */
.card-count                /* Large number display */
```

#### Task Cards
```css
.tasks-container           /* Grid container */
.task-card                 /* Individual task card */
.task-header               /* Title + badge area */
.task-body                 /* Task details */
.task-actions              /* Buttons container */
.task-badge                /* Status badge */
.task-badge.urgent         /* Red badge */
.task-badge.pending        /* Orange badge */
.task-badge.info           /* Blue badge */
```

#### Action Buttons
```css
.action-btn                /* Default button */
.action-btn.view-btn       /* View button (blue hover) */
.action-btn.update-btn     /* Update button (orange hover) */
.action-btn.approve-btn    /* Approve button (green hover) */
.action-btn.reject-btn     /* Reject button (red hover) */
.action-btn.note-btn       /* Note button (purple hover) */
.action-btn-small          /* Small button variant */
```

#### Tables
```css
.table-container           /* Table wrapper */
.data-table                /* Table element */
.data-table thead          /* Table header */
.data-table th             /* Header cells */
.data-table td             /* Data cells */
.action-cell               /* Button column */
```

#### Status Badges
```css
.badge                     /* Base badge */
.badge.status-success      /* Green */
.badge.status-warning      /* Orange */
.badge.status-urgent       /* Red */
.badge.status-active       /* Green (active state) */
.badge.status-info         /* Blue */
```

#### Flags
```css
.flag                      /* Base flag */
.flag.vulnerable           /* Vulnerable households */
.flag.follow-up            /* Require follow-up */
```

#### Timeline
```css
.activity-timeline         /* Timeline container */
.timeline-item             /* Individual item */
.timeline-marker           /* Colored dot */
.timeline-marker.completed /* Green */
.timeline-marker.pending   /* Orange */
.timeline-marker.alert     /* Red */
.timeline-marker.system    /* Blue */
.timeline-content          /* Item content */
```

#### Notifications
```css
.notifications-list        /* Container */
.notification-item         /* Individual notification */
.notification-item.urgent  /* Highlighted urgent */
.notification-icon         /* Icon wrapper */
.notification-content      /* Content area */
.dismiss-btn               /* Close button */
```

#### Calendar
```css
.calendar-container        /* Main container */
.mini-calendar             /* Mini calendar */
.calendar-grid             /* Grid of dates */
.calendar-day              /* Individual date cell */
.calendar-day.today        /* Highlighted today */
.calendar-day.has-event    /* Marked with event */
.events-list               /* Events listing */
.event-card                /* Individual event */
.event-date                /* Date box */
.event-rsvp                /* RSVP status */
```

#### Announcements
```css
.announcements-list        /* Container */
.announcement-card         /* Card */
.announcement-header       /* Title area */
.announcement-content      /* Body text */
.announcement-meta         /* Metadata (date/author) */
.announcement-actions      /* Buttons */
```

#### Reports & Documents
```css
.reports-grid              /* Grid container */
.documents-grid            /* Grid container */
.report-card               /* Card */
.document-card             /* Card */
.report-stats              /* Statistics grid */
.stat                      /* Individual stat */
.stat-label                /* Stat label */
.stat-value                /* Stat number */
```

#### Forms & Filters
```css
.filter-group              /* Filter controls container */
.filter-select             /* Dropdown select */
.filter-input              /* Text input */
.section-header            /* Section title area */
```

### Utility Classes

```css
.hidden                    /* display: none !important */
.text-center              /* text-align: center */
.text-right               /* text-align: right */
.mt-1, .mt-2, .mt-3      /* margin-top (small, medium, large) */
.mb-1, .mb-2, .mb-3      /* margin-bottom */
.gap-1, .gap-2, .gap-3   /* gap (for flex/grid) */
```

---

## CSS Variables Reference

### Colors
```css
--color-primary: #667eea              /* Blue */
--color-primary-light: #764ba2        /* Purple */
--color-accent: #4ade80               /* Neon Green */
--color-accent-light: #86efac         /* Light Green */

--color-bg-dark: #0f172a              /* Main background */
--color-bg-darker: #0a0e1a            /* Gradient start */
--color-surface: #1a2235              /* Card background */
--color-surface-light: #2d3748        /* Hover state */

--color-text-primary: #f1f5f9         /* Main text */
--color-text-secondary: #cbd5e1       /* Secondary text */
--color-text-muted: #94a3b8           /* Muted text */

--color-success: #10b981              /* Green */
--color-warning: #f59e0b              /* Orange */
--color-danger: #ef4444               /* Red */
--color-info: #3b82f6                 /* Blue */
--color-urgent: #dc2626               /* Dark Red */

--color-vulnerable: #f97316           /* Orange (vulnerable) */
--color-follow-up: #eab308            /* Yellow (follow-up) */
```

### Shadows
```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3)
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.2)
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.3)
--shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.4)
```

### Transitions
```css
--transition-fast: 0.15s cubic-bezier(0.4, 0, 0.2, 1)
--transition-base: 0.3s cubic-bezier(0.4, 0, 0.2, 1)
--transition-slow: 0.5s cubic-bezier(0.4, 0, 0.2, 1)
```

### Spacing
```css
--space-xs: 0.5rem
--space-sm: 1rem
--space-md: 1.5rem
--space-lg: 2rem
--space-xl: 3rem
```

### Border Radius
```css
--radius-sm: 6px
--radius-md: 12px
--radius-lg: 16px
--radius-xl: 20px
```

### Z-Index
```css
--z-dropdown: 100
--z-sticky: 200
--z-fixed: 300
--z-modal: 400
```

---

## Required API Endpoints

### Dashboard
```javascript
GET /officials/{id}/dashboard
```
**Response**:
```json
{
  "assignedComplaints": 12,
  "pendingApprovals": 5,
  "upcomingEvents": 3,
  "announcements": 8,
  "messages": 15,
  "recentActivity": [...],
  "notifications": [...]
}
```

### Tasks
```javascript
GET /officials/{id}/tasks?status=all|pending|approved|events
GET /officials/{id}/tasks?filter=complaints|approvals|events
```

### Complaints
```javascript
GET /complaints?assigned_to={officialId}&status={status}
PATCH /complaints/{id}/status
POST /complaints/{id}/comment
```

### Documents
```javascript
GET /documents?assigned_to={officialId}
PATCH /documents/{id}
```

### Residents
```javascript
GET /residents?purok={purokId}
GET /residents?flags=vulnerable|follow-up
GET /residents/search?q={query}
```

### Events
```javascript
GET /events
GET /events/{id}/rsvp
POST /events/{id}/rsvp
```

### Announcements
```javascript
GET /announcements
POST /announcements
PATCH /announcements/{id}
DELETE /announcements/{id}
```

### Reports
```javascript
GET /reports/official/{id}
GET /reports/official/{id}/export?format=pdf|csv
```

### Audit
```javascript
GET /audit-logs?official_id={officialId}
GET /audit-logs?record_type={type}&record_id={id}
```

---

## Color Palette Quick Reference

### Primary (Use for main elements)
- **#667eea** - Primary Blue
- **#764ba2** - Primary Purple (gradient)
- Accent: **#4ade80** - Neon Green (highlight)

### Backgrounds
- **#0f172a** - Page background
- **#1a2235** - Card background
- **#2d3748** - Hover state

### Text
- **#f1f5f9** - Primary text (bright white)
- **#cbd5e1** - Secondary text (gray)
- **#94a3b8** - Muted text (darker gray)

### Status
- **#10b981** - Success (green)
- **#f59e0b** - Warning (orange)
- **#ef4444** - Danger (red)
- **#3b82f6** - Info (blue)
- **#dc2626** - Urgent (dark red)

### Flags
- **#f97316** - Vulnerable (orange)
- **#eab308** - Follow-up (yellow)

---

## Configuration Guide

### Set Official Information
```javascript
// In official-dashboard.js or HTML
officialDashboard.position = 'Barangay Chairperson';
officialDashboard.name = 'Juan dela Cruz';
officialDashboard.officialId = 'official-001';
officialDashboard.authToken = 'your-jwt-token';

// Or store in localStorage
localStorage.setItem('officialPosition', 'Barangay Chairperson');
localStorage.setItem('officialName', 'Juan dela Cruz');
localStorage.setItem('authToken', 'jwt-token-here');
```

### API Base URL
```javascript
// In official-dashboard.js
const API_CONFIG = {
    BASE_URL: 'http://localhost:3000/api',  // Development
    // Change to production URL for deployment
};
```

### Notification Auto-Dismiss Time
```javascript
// In official-dashboard.js, line ~450
setTimeout(() => {
    notification.remove();
}, 5000);  // 5 seconds - adjust as needed
```

---

## Customization Guide

### Change Primary Color
```css
/* In official-dashboard.css */
--color-primary: #667eea;      /* Change to your color */
--color-primary-light: #764ba2; /* Change gradient color */
```

### Change Accent Color
```css
--color-accent: #4ade80;        /* Change to your color */
--color-accent-light: #86efac;  /* Change hover color */
```

### Modify Spacing
```css
/* All spacing uses these variables */
--space-xs: 0.5rem;   /* Adjust all small gaps */
--space-sm: 1rem;     /* Adjust small spacing */
--space-md: 1.5rem;   /* Adjust medium spacing */
--space-lg: 2rem;     /* Adjust large spacing */
```

### Change Border Radius
```css
--radius-sm: 6px;     /* Small corners */
--radius-md: 12px;    /* Medium corners */
--radius-lg: 16px;    /* Large corners */
```

### Add New Section
1. **Add HTML**: Create new section in HTML with `id="new-section"` and `class="content-section"`
2. **Add Navigation**: Add new nav item with `data-section="new-section"`
3. **Add Load Function**: Create `loadNewSectionData()` in JavaScript
4. **Add Case**: Add case in `loadSectionData()` switch statement

---

## Common Patterns

### Form Submission Pattern
```javascript
function handleFormSubmit(formData) {
    try {
        // Validate
        if (!formData.field) {
            showNotification('Field is required', 'error');
            return;
        }
        
        // Submit
        const result = await makeAPIRequest('/endpoint', 'POST', formData);
        
        // Handle result
        if (result) {
            showNotification('Success!', 'success');
            loadSectionData(currentSection);
        }
    } catch (error) {
        showNotification('Error: ' + error.message, 'error');
    }
}
```

### Data Loading Pattern
```javascript
function loadSectionData() {
    // Fetch data
    makeAPIRequest('/endpoint', 'GET')
        .then(data => {
            // Update UI with data
            updateUI(data);
        })
        .catch(error => {
            showNotification('Failed to load data', 'error');
        });
}
```

### Filter Implementation Pattern
```javascript
function handleFilter(filterValue) {
    const items = document.querySelectorAll('.item');
    
    items.forEach(item => {
        if (filterValue === 'all') {
            item.style.display = 'flex';
        } else {
            // Check if item matches filter
            if (item.dataset.category === filterValue) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        }
    });
}
```

### Event Handler Pattern
```javascript
document.querySelectorAll('.item').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const id = item.dataset.id;
        handleAction(id);
    });
});
```

---

## Troubleshooting

### Issue: Navigation not working
**Solution**: Check if data-section attribute matches section id
```html
<!-- HTML -->
<a href="#tasks" class="nav-item" data-section="tasks">Tasks</a>
<section id="tasks" class="content-section">Content</section>
```

### Issue: Notifications not showing
**Solution**: Verify .notifications-list exists and check browser console
```javascript
const list = document.querySelector('.notifications-list');
console.log('Notifications list exists:', !!list);
```

### Issue: API calls failing
**Solution**: Check API_CONFIG.BASE_URL and authentication token
```javascript
console.log('API Base URL:', API_CONFIG.BASE_URL);
console.log('Auth Token:', officialDashboard.authToken);
```

### Issue: CSS variables not working
**Solution**: Ensure browser supports CSS custom properties (all modern browsers do)
```javascript
// Check if supported
const supported = CSS.supports('--x: 0');
console.log('CSS Variables supported:', supported);
```

### Issue: Styling breaks on mobile
**Solution**: Test media queries and check responsive classes
```css
@media (max-width: 768px) {
    /* Add mobile-specific styles */
}
```

---

## Performance Tips

1. **Use Event Delegation**: Attach listeners to parent, check target
2. **Lazy Load Data**: Only load section data when navigating to it
3. **Cache API Responses**: Store in localStorage when appropriate
4. **Debounce Filters**: Prevent excessive API calls on filter changes
5. **Minimize Repaints**: Batch DOM changes together
6. **Use CSS Transforms**: For animations (GPU-accelerated)
7. **Lazy Load Images**: Use loading="lazy" attribute

---

## Testing Checklist

- [ ] All navigation items work
- [ ] Task filter shows/hides correct items
- [ ] Complaint filter works
- [ ] Action buttons (View, Update, Approve) function
- [ ] Notifications appear and auto-dismiss
- [ ] Logout clears localStorage
- [ ] API calls include auth header
- [ ] Error responses show notification
- [ ] Mobile responsive layout works
- [ ] Focus states visible
- [ ] No console errors

---

## Support & Resources

- **Design Docs**: See OFFICIAL_DASHBOARD_DESIGN.md
- **Browser DevTools**: F12 to open inspector
- **Console**: Check for error messages
- **Network Tab**: Verify API calls and responses
- **Accessibility**: Lighthouse audit (Chrome DevTools)

---

**End of Developer Reference**
