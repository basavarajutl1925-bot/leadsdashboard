# 🚀 Quick Setup & Testing Guide

## What's New

✨ **Public Lead Capture Pages** - No authentication required!
- Share links with customers on Instagram, Facebook, WhatsApp, etc
- Auto-detect user location and source
- Beautiful responsive forms
- Automatic WhatsApp notifications

## Prerequisites

- Node.js v14+
- MongoDB (local or Atlas)
- Twilio Account (for WhatsApp)

## Quick Start

### 1. Setup Backend

```bash
cd backend

# Install dependencies (if not already done)
npm install

# Create .env file with your Twilio credentials
cat > .env << EOF
PORT=5000
MONGODB_URI=mongodb://localhost:27017/leads_db
TWILIO_ACCOUNT_SID=AC42454bfe6e584df0ef9eef3191876006
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=whatsapp:+14155238886
NODE_ENV=development
EOF

# Start the backend
npm start
```

You should see:
```
✅ Server running on port 5000
✅ MongoDB connected
✅ Twilio initialized successfully
```

### 2. Setup Frontend

```bash
cd frontend

# Install dependencies (if not already done)
npm install

# Start the frontend
npm start
```

You should see:
```
Compiled successfully!
You can now view the app in the browser at:
  http://localhost:3000
```

## Testing the Public Lead Capture Pages

### Option 1: Direct URLs

Open these in your browser:

**Instagram Lead Form:**
```
http://localhost:3000/?source=instagram
```

**Facebook Lead Form:**
```
http://localhost:3000/?source=facebook
```

**WhatsApp Lead Form:**
```
http://localhost:3000/?source=whatsapp
```

**Direct Lead Form:**
```
http://localhost:3000/?source=direct
```

### Option 2: Test Submission

1. Open any public link above
2. Fill out the form:
   - Name: `John Doe`
   - Email: `john@example.com`
   - Phone: `+12025551234`
   - Message: `I'm interested in your services`
3. Click "Submit Inquiry"
4. You should see a success message ✅

### Option 3: View in Admin Dashboard

1. Go to `http://localhost:3000` (no URL parameter)
2. Login with:
   - Username: `admin`
   - Password: `admin`
3. You'll see:
   - New lead in the table
   - Source column shows "instagram", "facebook", etc.
   - Location shows detected city/country
   - Stats updated

## File Structure

```
dashboard/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── leadController.js (✅ Updated with WhatsApp)
│   │   ├── models/
│   │   │   └── Lead.js (✅ Updated with new fields)
│   │   ├── utils/
│   │   │   └── whatsappService.js (✅ Enhanced)
│   │   └── server.js
│   ├── .env (Update with Twilio credentials)
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LeadCapturePage.js (✨ NEW)
│   │   │   ├── Dashboard.js (✅ Updated - LeadForm removed)
│   │   │   └── Login.js
│   │   ├── styles/
│   │   │   ├── LeadCapturePage.css (✨ NEW)
│   │   │   └── Dashboard.css (✅ Updated)
│   │   ├── App.js (✅ Updated routing)
│   │   └── index.js
│   └── package.json
│
└── PUBLIC_LEAD_CAPTURE.md (✨ NEW Documentation)
```

## API Testing

### Test Lead Creation

```bash
curl -X POST http://localhost:5000/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@example.com",
    "phone": "+12025551234",
    "message": "Please call me back",
    "source": "facebook",
    "city": "New York",
    "country": "United States",
    "status": "new"
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "Lead created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "phone": "+12025551234",
    "message": "Please call me back",
    "source": "facebook",
    "city": "New York",
    "country": "United States",
    "status": "new",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### Get All Leads

```bash
curl http://localhost:5000/api/leads
```

### Get Leads by Source

```bash
curl http://localhost:5000/api/leads?source=instagram
```

## Troubleshooting

### Backend Won't Start

**Error: `Cannot find module 'dotenv'`**
```bash
cd backend
npm install
```

**Error: `MongoDB connection failed`**
- Make sure MongoDB is running locally, or
- Update `.env` with your MongoDB Atlas connection string

**Error: `Twilio not initialized`**
- Update `.env` with correct Twilio credentials
- Check Auth Token is valid

### Frontend Won't Start

**Error: `Port 3000 already in use`**
```bash
# Kill existing process
lsof -ti:3000 | xargs kill -9

# Or start on different port
PORT=3001 npm start
```

**Error: `Cannot find module 'axios'`**
```bash
cd frontend
npm install
```

### Form Not Submitting

1. Open browser DevTools (F12)
2. Check Console for errors
3. Verify backend is running and accessible
4. Check Network tab for POST request to `/api/leads`

### WhatsApp Not Sending

1. Verify Twilio credentials in `.env`
2. Check phone number format (must start with +)
3. Check backend logs for WhatsApp errors
4. Note: WhatsApp won't work without valid Twilio account

## Monitoring & Analytics

### Backend Logs

Watch the backend terminal for:
- ✅ Lead creation confirmations
- 📤 WhatsApp sending attempts
- ✅ Message delivery confirmations
- ⚠️ Any errors

### Database Checks

```bash
# Using MongoDB CLI
mongosh

# Select database
use leads_db

# View all leads
db.leads.find()

# View leads by source
db.leads.find({ source: "instagram" })

# View lead statistics
db.leads.aggregate([
  { $group: { _id: "$source", count: { $sum: 1 } } }
])
```

## Production Deployment

1. **Update URLs** - Change localhost to your domain
2. **Environment Variables** - Set production values in `.env`
3. **Database** - Use MongoDB Atlas for production
4. **Twilio** - Ensure production API keys
5. **HTTPS** - Enable SSL for public pages
6. **CORS** - Update if frontend/backend on different domains

## Next Steps

1. ✅ Test all public URLs
2. ✅ Verify WhatsApp notifications
3. ✅ Check admin dashboard displays leads
4. ✅ Share public links with marketing
5. ✅ Monitor leads in admin panel
6. ✅ Respond to leads

## Support Documentation

- **Complete Guide:** [PUBLIC_LEAD_CAPTURE.md](PUBLIC_LEAD_CAPTURE.md)
- **API Docs:** [API_DOCS.md](API_DOCS.md)
- **Deployment:** [DEPLOYMENT.md](DEPLOYMENT.md)
- **Architecture:** [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)

## Quick Commands Reference

```bash
# Backend
cd backend && npm start        # Start backend
npm run dev                    # Developer mode
npm test                       # Run tests

# Frontend
cd frontend && npm start       # Start frontend
npm build                      # Production build

# Database
mongosh                        # Connect to MongoDB
```

---

**Ready to test?** 
Visit: `http://localhost:3000/?source=instagram` and try it out! 🚀
