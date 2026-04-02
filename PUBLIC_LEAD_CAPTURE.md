# Public Lead Capture Feature

## Overview

The Lead Management Dashboard now includes a **public lead capture page** that allows users to submit inquiries without requiring authentication. This page is accessible via URL parameters and automatically detects the source (Instagram, Facebook, WhatsApp, etc.) and user location.

## Features

✅ **No Authentication Required** - Anyone can access via direct URL
✅ **Source Detection** - Automatically detects source from URL parameter
✅ **Auto Location Detection** - Gets user's city and country via IP-API
✅ **Beautiful UI** - Responsive design with gradient backgrounds
✅ **Form Validation** - Client-side validation for all fields
✅ **Success Feedback** - Shows confirmation message after submission
✅ **Mobile Optimized** - Fully responsive on all devices

## Access URLs

The public lead capture page is accessible via these URLs:

```
# Instagram source
http://localhost:3000/?source=instagram

# Facebook source
http://localhost:3000/?source=facebook

# WhatsApp source
http://localhost:3000/?source=whatsapp

# Direct/Generic link
http://localhost:3000/?source=direct

# Email source
http://localhost:3000/?source=email
```

## How It Works

1. **URL-Based Routing**: When a user visits the app with a `?source=` parameter, the `App.js` detects this and shows the lead capture page instead of login
2. **Location Detection**: The page automatically fetches the user's location (city & country) using IP-API
3. **Source Tracking**: The selected source is maintained throughout the form and included in the submission
4. **Form Submission**: Data is posted to the backend `/api/leads` endpoint
5. **Success Confirmation**: After submission, user sees a success message for 5 seconds

## Form Fields

The lead capture form collects:

- **Full Name** (required)
- **Email Address** (required, validated)
- **Phone Number** (required, minimum 10 digits)
- **Message** (optional)
- **Auto-detected Location** (city & country)
- **Source** (from URL parameter)
- **Status** (automatically set to "new")

## Sharing Links with Customers

You can share these links with your marketing campaigns:

### Copy-Paste Examples

**For Instagram campaigns:**
```
https://yourdomain.com/?source=instagram
```

**For Facebook campaigns:**
```
https://yourdomain.com/?source=facebook
```

**For WhatsApp campaigns:**
```
https://yourdomain.com/?source=whatsapp
```

**In QR codes:**
Generate a QR code pointing to any of the above URLs for easy mobile access.

## Admin Dashboard

The admin dashboard now includes:

1. **Lead Sources Information Section** - Shows all available public lead capture URLs
2. **Leads Table** - Displays all captured leads with their source and location
3. **Filters** - Can filter leads by source, date range, etc.
4. **Statistics** - Shows breakdowns by source

## API Endpoint

The public form submits to:

```
POST http://localhost:5000/api/leads
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "message": "I'm interested in your services",
  "source": "instagram",
  "city": "San Francisco",
  "country": "United States",
  "status": "new"
}
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "message": "I'm interested in your services",
  "source": "instagram",
  "city": "San Francisco",
  "country": "United States",
  "status": "new",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

## File Structure

**Frontend:**
```
frontend/src/
├── pages/
│   ├── LeadCapturePage.js       # Public lead capture page
│   └── Dashboard.js              # Admin dashboard (LeadForm removed)
├── styles/
│   └── LeadCapturePage.css       # Public page styling
└── App.js                        # Updated with public route handling
```

**Backend:**
- No changes needed - existing `/api/leads` endpoint handles submissions
- Leads are stored in MongoDB with source and location

## Customization

### Change Form Fields

Edit `frontend/src/pages/LeadCapturePage.js` in the `useState` and form JSX.

### Change Success Message

Modify the `success-message` section in `LeadCapturePage.js`:
```jsx
<div className="success-message">
  <div className="success-icon">✅</div>
  <h3>Thank You!</h3>
  <p>Your message here</p>
</div>
```

### Add WhatsApp Notification

Update backend `leadController.js` to send WhatsApp message on lead submission:
```javascript
const whatsappService = require('../utils/whatsappService');

// In createLead function
if (lead.phone) {
  await whatsappService.sendMessage(
    lead.phone,
    `Thanks for your inquiry, ${lead.name}! We'll be in touch soon.`
  );
}
```

### Change Colors

Update `frontend/src/styles/LeadCapturePage.css`:
```css
/* Change gradient colors */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* To your brand colors */
background: linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%);
```

## Testing

1. **Start Backend:**
   ```bash
   cd backend
   npm start
   ```

2. **Start Frontend:**
   ```bash
   cd frontend
   npm start
   ```

3. **Test Public Page:**
   - Visit: `http://localhost:3000/?source=instagram`
   - Fill out the form
   - Click "Submit Inquiry"
   - Check success message

4. **Verify in Admin:**
   - Login as admin (username: `admin`, password: `admin`)
   - View the new lead in the dashboard
   - Should see source as "instagram"

## Troubleshooting

### Form not submitting?
- Check browser console for errors
- Verify backend is running on port 5000
- Check MongoDB connection

### Location not showing?
- IP-API might be blocked
- Falls back to "Unknown" if lookup fails
- Location is optional and doesn't block submission

### Source not detected?
- Verify URL has `?source=` parameter
- Make sure parameter is one of: instagram, facebook, whatsapp, direct, email
- Check browser console for `setSource` calls

### Styling issues?
- Clear browser cache (Ctrl+Shift+Del)
- Restart frontend server
- Check if CSS file is properly linked

## Analytics Integration

To track form submissions per source:

1. Backend already stores source in database
2. Admin can filter by source in dashboard
3. Use the statistics cards to see breakdowns

Example:
```javascript
const leadsBySource = await Lead.aggregate([
  {
    $group: {
      _id: '$source',
      count: { $sum: 1 }
    }
  }
]);
```

## Next Steps

1. Deploy frontend/backend to production
2. Point domain to frontend (e.g., yourdomain.com)
3. Share public URLs with marketing team
4. Monitor leads in admin dashboard
5. Set up WhatsApp notifications for new leads
6. Track conversion rate by source

## Support

For issues or questions about the public lead capture feature, check:
- [LeadCapturePage.js](frontend/src/pages/LeadCapturePage.js)
- [LeadCapturePage.css](frontend/src/styles/LeadCapturePage.css)
- [App.js](frontend/src/App.js)
- Main README.md for general setup
