# Resident Dashboard - Design Documentation

## Overview
A modern, clean, and user-friendly Resident Dashboard for the Barangay Management System with a soft blue-purple gradient background, rounded cards, subtle shadows, and neon-green accents. The design combines government-friendly aesthetics with futuristic digital service presentation.

**Date Created:** November 15, 2025  
**Version:** 1.0  
**Technology Stack:** HTML5, CSS3, JavaScript (Vanilla)  
**Color Scheme:** Soft Purple (#667eea, #764ba2), Neon Green (#4ade80, #10b981), Dark Background (#0f172a)

---

## File Structure

```
public/
├── resident-dashboard.html      # Main dashboard markup
├── css/
│   └── resident-dashboard.css   # Complete styling (1400+ lines)
├── js/
│   └── resident-dashboard.js    # Functionality & API integration
└── images/
    └── (placeholder images)
```

---

## Design Components

### 1. Header / Top Navigation Bar

**Location:** Fixed at top, z-index: 1000  
**Background:** Linear gradient (dark to darker)  
**Height:** ~100px

**Layout:**
- **Left Section:**
  - Barangay logo (circular with city icon)
  - System title with neon-green gradient text
  
- **Center Section:**
  - Dynamic title: "Resident Dashboard — [FullName]"
  
- **Right Section:**
  - Notification bell (with red badge showing count)
  - Messages icon (with red badge)
  - Profile avatar with dropdown menu
    - Profile
    - Settings
    - Sign Out

**Interactions:**
- Hover effects on icons (scale 1.1, color change to neon-green)
- Profile dropdown reveals on avatar hover
- Badge counts update in real-time via API

---

### 2. Left Sidebar Navigation

**Width:** 250px (responsive: collapses on mobile)  
**Background:** Semi-dark surface (#1e293b)  
**Border:** Right border with subtle shadow

**Navigation Items:**
1. Home (Dashboard icon)
2. My Profile (User icon)
3. Household Members (Users icon)
4. Documents & Requests (File icon)
5. Complaints (Exclamation icon)
6. Events & Calendar (Calendar icon)
7. Announcements (Megaphone icon)
8. Messages (Comments icon)
9. Help & Support (Question icon)

**Styling:**
- Icon + label in each item
- Active state: Left border highlight (3px neon-green), background highlight, text color change
- Hover state: Background color change, border animation
- Smooth transitions (0.3s cubic-bezier)

---

### 3. Main Content Area

**Background:** Gradient from dark to slightly lighter  
**Padding:** 2rem  
**Scrollable:** Yes (overflow-y: auto)

---

## Key Sections

### Section 1: Home Dashboard (Default)

#### A. Summary Cards (Top)
Five compact gradient cards in a responsive grid:

1. **My Profile Card**
   - Icon: ID Card
   - Shows: Purok, Household ID, Contact Number
   - Clickable

2. **Active Requests Card**
   - Icon: File Signature
   - Shows: Count of active requests
   - Link to details

3. **My Complaints Card**
   - Icon: Exclamation
   - Shows: Count + Status (In Progress)

4. **Upcoming Events Card**
   - Icon: Calendar
   - Shows: Next event title + date

5. **Announcements Card**
   - Icon: Megaphone
   - Shows: Total count + unread count

**Card Features:**
- Gradient top border appears on hover
- Lift effect (translateY -8px)
- Enhanced shadow on hover
- Neon-green accent on border

#### B. Welcome Section
Full-width gradient card with:
- Left: Welcome avatar (resident photo)
- Center: Greeting text + resident ID + purok
- Right: 4 Quick Action Buttons:
  - File Complaint
  - Request Document
  - Register for Event
  - View Announcements

**Button Style:** Semi-transparent white background, rounded edges, icon + text

#### C. Recent Activity Timeline
Vertical timeline showing:
- Document Approvals
- Complaint Updates
- New Announcements

**Features:**
- Color-coded markers (green=success, blue=info, orange=warning)
- Left border accent
- Timestamps

#### D. Notifications Panel
Scrollable list of recent notifications:
- Success notifications (green icon)
- Info notifications (blue icon)
- Close button on each
- Auto-dismiss after 5 seconds

---

### Section 2: My Profile Page

**Layout:** Two-column (left: photo, right: details)

#### Left Column:
- Profile photo (180x180px)
- Rounded corners
- Neon-green border
- "Update Photo" button

#### Right Column:
**Two-row layout for all fields:**
- Resident ID | Full Name
- Date of Birth (auto-calculates age) | Sex
- Purok / Zone | Address
- Contact Number | Email
- Household ID | Occupation
- Marital Status | National ID (masked with "Show" button)

**Field Display:**
- Read-only values in light background boxes
- Left accent border (neon-green)
- Edit button at top

**Privacy Settings Section:**
- Toggles for:
  - Show contact in directory
  - Email notifications
  - SMS notifications
  - 2-Factor authentication

---

### Section 3: Household Members

**Table Layout:**
| Member ID | Name | Relation | DOB | Age | Sex | Actions |

**Actions:**
- View icon
- Edit icon
- Remove button (danger color)

**Add Member Button:** Primary color, top right

---

### Section 4: Documents & Requests

**Filter Bar:** Dropdown to filter by status
- All Status
- Pending
- Approved
- Ready for Pickup
- Completed

**Table Layout:**
| Request ID | Document Type | Status | Submitted On | Expected Date | Actions |

**Status Badges:**
- Pending: Orange background
- Processing: Blue background
- Approved: Green background

**Actions per row:**
- View button
- Download button (for approved docs)
- Cancel button (danger)

**"Request New Document" Button:** Primary color

---

### Section 5: Complaints & Requests

**Filter Bar:** By status

**Complaint Cards** (not table):
- Header: Title + Status badge
- Category tag
- Description text
- Info box: Assigned to, Filed date, Expected resolution
- Action buttons: View Details, Add Note

**Status indicators:**
- In Progress: Blue
- Resolved: Green
- Pending: Orange

---

### Section 6: Events & Calendar

**Two-column layout:**

#### Left: Events List
Vertical list of event cards:
- Date box (day/month) with gradient background
- Event title
- Location icon + venue
- Time icon + time range
- Description text
- Attendee count
- Register/Registered button

**Registered events:** Green border highlight

#### Right: Calendar Grid
Simple calendar with:
- Month/year header
- Navigation arrows
- 7-column day grid
- Day numbers
- Event indicator dots on event dates
- Hover effects

---

### Section 7: Announcements

**Filter Bar:** By purok

**Announcement Cards:**
- Header: Title + Date
- Category/source
- Content summary
- Footer: Attachment count, action buttons

**Pinned announcements:** Orange left border, warning background

---

### Section 8: Messages / Inbox

**Two-panel layout:**

#### Left Panel (300px):
- Conversation list
- Each item shows:
  - Avatar
  - Conversation name
  - Last message preview
  - Timestamp
- Active state highlight

#### Right Panel:
- Thread header (name, email)
- Message history (alternating incoming/outgoing)
- Input box with:
  - Text field
  - Attachment button
  - Send button

**Message Styles:**
- Incoming: Dark background, left-aligned
- Outgoing: Gradient background, right-aligned
- Timestamps on each message

---

### Section 9: Help & Support

**Three subsections:**

#### 1. FAQ Section
- Collapsible FAQ items
- Icon rotates on expand
- Answer appears below question

#### 2. Support Form
- Subject field
- Category dropdown
- Message textarea
- Submit button

#### 3. SLA Table
| Service Type | Response Time | Resolution Time |
- Document Request: 1-2 days, 3-5 days
- Complaint Filing: 1 day, 7-15 days
- System Support: 24 hours, 48 hours
- General Inquiry: 2-3 days, 5 days

---

## Modal Dialogs

### 1. File Complaint Modal
Fields:
- Category dropdown (Infrastructure, Noise/Disturbance, Safety, Services, Other)
- Subject text field
- Description textarea
- Location (Purok) dropdown
- Attach photos (file input)
- Mark as confidential (checkbox)

**Buttons:** Cancel, Submit Complaint

---

### 2. Request Document Modal
Fields:
- Document Type dropdown
- Purpose textarea
- Upload supporting documents
- Progress bar for file upload

**Buttons:** Cancel, Submit Request

---

### 3. Register for Event Modal
Fields:
- Event dropdown
- Number of attendees (number input)
- Special requirements textarea
- Terms & conditions checkbox

**Buttons:** Cancel, Confirm Registration

---

### 4. Add Household Member Modal
Fields:
- Full Name
- Relation dropdown
- Date of Birth
- Sex
- Upload supporting documents

**Buttons:** Cancel, Add Member

---

## Floating Action Button (FAB)

**Mobile only (hidden on desktop)**

**Main button:**
- Position: Bottom-right (fixed)
- Style: Circular with gradient background
- Icon: Plus sign
- Size: 60x60px

**Sub-menu options (on click):**
- File Complaint
- Request Document
- Register Event

---

## Color Palette

| Use | Color | Hex |
|-----|-------|-----|
| Primary Gradient | Blue-Purple | #667eea → #764ba2 |
| Accent Neon | Green | #4ade80 |
| Success | Green | #10b981 |
| Warning | Orange | #f59e0b |
| Danger | Red | #ef4444 |
| Info | Blue | #3b82f6 |
| Background | Dark Navy | #0f172a |
| Surface | Dark Slate | #1e293b |
| Surface Light | Slate | #334155 |
| Text Primary | Light | #f1f5f9 |
| Text Secondary | Muted | #cbd5e1 |
| Border | Gray | #475569 |

---

## Typography

- **Font Family:** Segoe UI, Tahoma, Geneva, Verdana, sans-serif
- **Headings:** Bold (600-700)
- **Body:** Regular (400)
- **Small text:** 0.8-0.9rem
- **Line height:** 1.6

---

## Responsive Design

### Desktop (1200px+)
- Full sidebar (250px)
- Two-column layouts where applicable
- Full-width tables

### Tablet (768px - 1199px)
- Single-column event layout
- Stacked form rows
- Adjusted spacing

### Mobile (< 768px)
- Horizontal scrolling sidebar (flex-row)
- Single-column everything
- Floating Action Button visible
- Reduced padding/margin
- Modal takes 95% width
- Simplified header

### Extra Small (< 480px)
- System title hidden
- Stacked header sections
- Single-column cards
- Simplified tables
- Reduced font sizes

---

## Interactions & Animations

### Transitions
- Default: `all 0.3s cubic-bezier(0.4, 0, 0.2, 1)`
- Smooth, professional feel
- Applied to:
  - Hover effects
  - Color changes
  - Transform effects
  - Border changes

### Animation Effects
- **fadeIn:** Sections fade in when switched (0.3s)
- **slideUp:** Modals slide up from bottom (0.3s)
- **Hover lifts:** Cards translate up 5-8px on hover
- **Icon scale:** 1.1x on hover
- **Border animations:** Left border slides in on hover

### Interactive Elements
- Buttons have scale/shadow effects
- Links have color transitions
- Form inputs have focus states with shadow
- Dropdown menus have smooth reveal
- Modals have backdrop blur effect

---

## API Integration Points

```javascript
// All calls include JWT token in Authorization header

GET /residents/{id}/dashboard          // Load dashboard stats
GET /residents/{id}/profile            // Load profile details
PATCH /residents/{id}/profile          // Update profile
GET /residents/{id}/household          // Load household members
GET /residents/{id}/documents          // Load document requests
POST /documents/requests               // Submit document request
GET /residents/{id}/complaints         // Load complaints
POST /complaints                       // File new complaint
PATCH /complaints/{id}                 // Update complaint status
GET /events                            // Load events list
POST /events/{id}/register             // Register for event
DELETE /events/{id}/register           // Unregister from event
GET /announcements                     // Load announcements
GET /residents/{id}/messages           // Load messages
POST /messages                         // Send message
```

---

## Form Validation

- **Real-time validation** on input
- **Required field indicators** (*)
- **File upload preview** before submission
- **Progress bars** for file uploads
- **Confirmation modals** for destructive actions
- **Error messages** displayed inline
- **Success notifications** after submission

---

## Accessibility Features

- Semantic HTML5 elements
- ARIA labels on icons
- Keyboard navigation support
- Color contrast ratios meet WCAG AA
- Focus states visible on all interactive elements
- Alt text on all images
- Proper heading hierarchy

---

## Performance Considerations

1. **Lazy loading:** Sections load data only when viewed
2. **Debounced API calls:** Prevents excessive requests
3. **Cached responses:** Browser caching for repeated requests
4. **Optimized images:** Use placeholder dimensions
5. **Minimal animations:** GPU-accelerated transforms
6. **Minified assets:** CSS and JS minified in production

---

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari 14+, Chrome Mobile 90+)

---

## Future Enhancements

1. **Dark/Light Theme Toggle:** User preference storage
2. **Advanced Search:** Full-text search across documents/complaints
3. **Data Export:** Download records as PDF/CSV
4. **Notifications Preferences:** Customize alert types
5. **Multi-language Support:** Localization
6. **Accessibility Audit:** WCAG 2.1 AAA compliance
7. **Progressive Web App:** Offline support
8. **Real-time Updates:** WebSocket for live notifications
9. **Advanced Analytics:** Dashboard usage insights
10. **Mobile App:** Native iOS/Android versions

---

## Testing Checklist

### Functional Testing
- [ ] All navigation links work
- [ ] All modals open/close correctly
- [ ] Form submissions work
- [ ] API calls return correct data
- [ ] Filter dropdowns work
- [ ] Date pickers work
- [ ] File uploads work
- [ ] Buttons disable during loading

### Responsive Testing
- [ ] Layout works on desktop
- [ ] Layout works on tablet
- [ ] Layout works on mobile
- [ ] FAB appears on mobile only
- [ ] Text remains readable at all sizes
- [ ] Images scale correctly
- [ ] Tables remain usable

### Cross-browser Testing
- [ ] Works in Chrome
- [ ] Works in Firefox
- [ ] Works in Safari
- [ ] Works in Edge

### Accessibility Testing
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Color contrast adequate
- [ ] Focus states visible

### Performance Testing
- [ ] Page loads in < 3 seconds
- [ ] Images optimized
- [ ] No console errors
- [ ] API calls are efficient
- [ ] Smooth animations

---

## Deployment Instructions

1. **Place files in correct directories:**
   ```
   public/resident-dashboard.html
   public/css/resident-dashboard.css
   public/js/resident-dashboard.js
   ```

2. **Link in main HTML:**
   ```html
   <a href="/resident-dashboard.html">Resident Dashboard</a>
   ```

3. **Ensure API endpoints are available:**
   - Check all API routes are implemented
   - Verify JWT authentication
   - Test all endpoint responses

4. **Update configuration:**
   - Set `API_BASE_URL` in JavaScript
   - Configure image paths
   - Update auth token retrieval

5. **Test thoroughly:**
   - Run through testing checklist
   - Perform user acceptance testing
   - Verify on target devices

---

## Support & Maintenance

For issues, updates, or feature requests, please contact the development team or check the GitHub repository for the BMS project.

**Last Updated:** November 15, 2025  
**Created by:** Barangay Management System Development Team
