# Resident Dashboard - Developer Quick Reference

## Quick Start

### Access the Dashboard
```
URL: /resident-dashboard.html
Auth Required: Yes (JWT in localStorage.authToken)
```

### File Locations
```
HTML:  public/resident-dashboard.html
CSS:   public/css/resident-dashboard.css  
JS:    public/js/resident-dashboard.js
Docs:  RESIDENT_DASHBOARD_DESIGN.md
```

---

## Key JavaScript Functions

### Navigation
```javascript
navigateToSection(sectionName)     // Switch to home/profile/documents/etc
getActiveSectionName()              // Get current section
```

### Modals
```javascript
openModal(modalId)                  // Open modal by ID
closeModal(modalId)                 // Close modal
// Modal IDs: complaintForm, documentForm, eventForm, householdForm
```

### Events
```javascript
registerEvent(eventId)              // Register for event
unregisterEvent(eventId)            // Unregister from event
```

### Notifications
```javascript
showNotification(message, type)     // Show toast (type: success/error/info)
```

### Data Loading
```javascript
loadProfileData()                   // Load profile section
loadHouseholdData()                 // Load household members
loadDocumentsData()                 // Load documents list
loadComplaintsData()                // Load complaints list
loadEventsData()                    // Load events
loadAnnouncementsData()             // Load announcements
loadMessagesData()                  // Load messages
```

### Utilities
```javascript
formatDate(date)                    // Format date to readable format
calculateAge(dob)                   // Calculate age from DOB
```

---

## CSS Classes Reference

### Layouts
```css
.main-container              /* Flex container for sidebar + content */
.sidebar                    /* Left navigation sidebar */
.main-content              /* Main scrollable content area */
.content-section           /* Each page section */
```

### Components
```css
.summary-cards             /* Summary card grid */
.summary-card              /* Individual card */
.welcome-card              /* Welcome section */
.section-header            /* Section title + buttons */
.data-table                /* Data table styling */
.modal                     /* Modal dialog */
.timeline                  /* Activity timeline */
.notification-item         /* Notification card */
.status-badge              /* Status badge */
.complaint-card            /* Complaint card */
.event-card                /* Event card */
.announcement-card         /* Announcement card */
```

### Utilities
```css
.btn-primary               /* Green gradient button */
.btn-secondary             /* Gray button */
.btn-sm                    /* Small button */
.btn-danger                /* Red button */
.status-pending            /* Orange badge */
.status-approved           /* Green badge */
.status-processing         /* Blue badge */
.active                    /* Active state */
.hidden                    /* Hide element */
```

---

## API Endpoints Required

### Profile
```
GET    /api/residents/{id}/dashboard      # Dashboard overview
GET    /api/residents/{id}/profile        # Get profile
PATCH  /api/residents/{id}/profile        # Update profile
```

### Household
```
GET    /api/residents/{id}/household      # Get members
POST   /api/residents/{id}/household      # Add member
PATCH  /api/residents/{id}/household/{mid} # Update member
DELETE /api/residents/{id}/household/{mid} # Remove member
```

### Documents
```
GET    /api/residents/{id}/documents      # List requests
POST   /api/documents/requests            # Create request
GET    /api/documents/{id}                # Get details
PATCH  /api/documents/{id}                # Update
DELETE /api/documents/{id}                # Cancel
```

### Complaints
```
GET    /api/residents/{id}/complaints     # List complaints
POST   /api/complaints                    # File complaint
GET    /api/complaints/{id}               # Get details
PATCH  /api/complaints/{id}               # Update status
DELETE /api/complaints/{id}               # Delete
```

### Events
```
GET    /api/events                        # List all events
GET    /api/events/{id}                   # Get details
POST   /api/events/{id}/register          # Register
DELETE /api/events/{id}/register          # Unregister
```

### Announcements
```
GET    /api/announcements                 # List all
GET    /api/announcements/{id}            # Get details
```

### Messages
```
GET    /api/residents/{id}/messages       # Get conversations
POST   /api/messages                      # Send message
GET    /api/messages/{id}                 # Get thread
```

---

## Color Reference

```javascript
// CSS Variables in :root
--primary-gradient: #667eea → #764ba2  // Blue-purple
--accent-neon: #4ade80                  // Neon green
--success: #10b981                      // Green
--warning: #f59e0b                      // Orange
--danger: #ef4444                       // Red
--info: #3b82f6                         // Blue
--background: #0f172a                   // Dark navy
--surface: #1e293b                      // Slate
--text-primary: #f1f5f9                 // Light text
--text-secondary: #cbd5e1               // Muted text
```

---

## Configuration

### Edit Resident ID
```javascript
// In resident-dashboard.js
const RESIDENT_ID = localStorage.getItem('residentId') || '1';
```

### Edit API Base URL
```javascript
// In resident-dashboard.js
const API_BASE_URL = '/api';  // Change if needed
```

### Edit Auth Token Key
```javascript
// In resident-dashboard.js
// Update all instances of:
localStorage.getItem('authToken')
// Or change to your auth method
```

---

## Common Customizations

### Change Color Scheme
Edit `:root` variables in `resident-dashboard.css`:
```css
:root {
    --primary-gradient: linear-gradient(...);
    --accent-neon: #yourColor;
    /* ... etc ... */
}
```

### Add New Section
1. Add navigation item to sidebar in HTML
2. Add content section with `id="name-section"`
3. Add CSS for section-specific styling
4. Add navigation handler in JavaScript
5. Add data loading function

### Customize Modal Forms
Edit modal HTML in `resident-dashboard.html`:
- Change form fields
- Update endpoints in JavaScript
- Add validation logic
- Customize button text

### Adjust Responsive Breakpoints
Edit media queries in `resident-dashboard.css`:
```css
@media (max-width: 1200px) { /* Desktop */ }
@media (max-width: 768px) { /* Tablet */ }
@media (max-width: 480px) { /* Mobile */ }
```

---

## Form Submission Pattern

```javascript
// Standard form submission handler
async function handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        
        if (response.ok) {
            showNotification('Success!', 'success');
            closeModal(modalId);
            loadSectionData(sectionName);
        } else {
            const error = await response.json();
            showNotification(`Error: ${error.message}`, 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('An error occurred', 'error');
    }
}
```

---

## Data Loading Pattern

```javascript
async function loadSectionData(sectionName) {
    try {
        const response = await fetch(`${API_BASE_URL}/endpoint`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            // Update DOM with data
            // Example: document.querySelector('.table-body').innerHTML = ...
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
```

---

## Troubleshooting

### Modal not opening
- Check modal ID matches the `openModal()` call
- Verify modal has correct structure
- Check z-index (should be 2000+)

### API calls failing
- Verify auth token in localStorage
- Check API endpoint URL
- Review network tab in DevTools
- Verify CORS settings on backend

### Styling issues
- Clear browser cache (Ctrl+Shift+Delete)
- Check CSS file is linked in HTML
- Verify color variables are defined
- Check responsive breakpoints

### Navigation not working
- Verify nav item has `data-section` attribute
- Check section ID matches: `name-section`
- Verify event listener is attached
- Check active class is being applied

---

## Performance Tips

1. **Lazy Load Images:** Use placeholders initially
2. **Debounce API Calls:** Wait before making repeated calls
3. **Cache Responses:** Store API data in sessionStorage
4. **Minimize Animations:** Use GPU-accelerated transforms
5. **Compress Assets:** Minify CSS and JavaScript
6. **Use CDN:** Serve static assets from CDN

---

## Browser DevTools

### View Network Calls
```
F12 → Network Tab → Check API calls
```

### Debug JavaScript
```
F12 → Console Tab → Type function names
F12 → Debugger Tab → Set breakpoints
```

### Inspect Elements
```
F12 → Inspector Tab → Click element
Check computed styles → Check box model
```

### Monitor Performance
```
F12 → Performance Tab → Record
Check FPS and render times
```

---

## Testing Checklist

### Functionality
- [ ] All navigation works
- [ ] Forms submit correctly
- [ ] API calls return data
- [ ] Modals open/close
- [ ] Buttons are responsive
- [ ] No console errors
- [ ] All sections load

### Responsive
- [ ] Works on desktop
- [ ] Works on tablet
- [ ] Works on mobile
- [ ] FAB only on mobile
- [ ] Text readable
- [ ] No horizontal scroll

### Data
- [ ] Profile data loads
- [ ] Documents display
- [ ] Complaints show
- [ ] Events list
- [ ] Messages thread
- [ ] Announcements display

### Security
- [ ] Auth token required
- [ ] API calls have headers
- [ ] Forms validate input
- [ ] No sensitive data exposed
- [ ] HTTPS in production

---

## Documentation Files

```
DATABASE_SCHEMA.md              # Complete schema reference
RESIDENT_DASHBOARD_DESIGN.md    # Design documentation
COMPLETION_REPORT_*.md          # Completion reports
README.md                       # Main project README
```

---

## Support

For issues or questions:
1. Check RESIDENT_DASHBOARD_DESIGN.md
2. Review JavaScript comments
3. Check CSS custom properties
4. Test in browser DevTools
5. Review API responses
6. Check console for errors

---

**Last Updated:** November 15, 2025  
**Version:** 1.0  
**Status:** Production-Ready
