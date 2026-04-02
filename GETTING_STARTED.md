# 🚀 Getting Started Checklist

Complete this checklist to get your Lead Management Dashboard up and running!

## ✅ Pre-Setup

- [ ] Node.js v14+ installed
- [ ] npm or yarn package manager available
- [ ] MongoDB installed (local) OR MongoDB Atlas account created
- [ ] Twilio account created
- [ ] Text editor/IDE ready (VS Code, WebStorm, etc.)
- [ ] Terminal/Command prompt ready

## 📋 Twilio Setup (5 minutes)

### Get Twilio Credentials
- [ ] Create Twilio account: https://www.twilio.com/
- [ ] Navigate to Console Dashboard
- [ ] Copy **Account SID**
- [ ] Copy **Auth Token**
- [ ] Navigate to Messaging → WhatsApp → Learn
- [ ] Copy your **WhatsApp Number** (format: whatsapp:+1234567890)
- [ ] Note: Twilio free trial gives $15 credit
- [ ] Optional: Add payment method for production

## 💾 Database Setup (5 minutes)

### Option A: Local MongoDB
- [ ] Install MongoDB: https://docs.mongodb.com/manual/installation/
- [ ] Start MongoDB service (mongod)
- [ ] Test connection: `mongosh`
- [ ] Exit mongosh

### Option B: MongoDB Atlas (Cloud)
- [ ] Create MongoDB Atlas account: https://www.mongodb.com/cloud/atlas
- [ ] Create free cluster
- [ ] Create database user
- [ ] Add IP to whitelist (or use 0.0.0.0/0)
- [ ] Get connection string
- [ ] Copy connection string

## 🛠️ Backend Setup (10 minutes)

### Installation
- [ ] Open terminal/command prompt
- [ ] Navigate to project: `cd dashboard`
- [ ] Navigate to backend: `cd backend`
- [ ] Install dependencies: `npm install`

### Configuration
- [ ] Copy `.env.example` to `.env`
  ```bash
  # Linux/Mac
  cp .env.example .env
  
  # Windows
  copy .env.example .env
  ```
- [ ] Edit `.env` file with:
  - [ ] MONGODB_URI (local or Atlas)
  - [ ] TWILIO_ACCOUNT_SID
  - [ ] TWILIO_AUTH_TOKEN
  - [ ] TWILIO_PHONE_NUMBER
  - [ ] FRONTEND_URL=http://localhost:3000

### Verification
- [ ] `npm run dev` (should show "Server running on http://localhost:5000")
- [ ] In browser: http://localhost:5000/health
- [ ] Should see: `{"status":"OK","message":"Server is running"}`
- [ ] Stop server (Ctrl+C)

## 🎨 Frontend Setup (10 minutes)

### Installation
- [ ] Open new terminal/command prompt
- [ ] Navigate to frontend: `cd dashboard/frontend`
- [ ] Install dependencies: `npm install`

### Configuration
- [ ] `.env` file is already created with REACT_APP_API_URL
- [ ] Default value: http://localhost:5000/api
- [ ] Edit if needed for different backend URL

### Verification
- [ ] (Skip for now - will test after starting)

## 🚀 Running the Application

### Step 1: Ensure MongoDB is Running
- [ ] Open terminal
- [ ] Run: `mongod` (if using local MongoDB)
- [ ] See: `[initandlisten] waiting for connections on port 27017`
- [ ] Leave running

### Step 2: Start Backend
- [ ] Open new terminal
- [ ] Navigate to: `cd dashboard/backend`
- [ ] Run: `npm run dev`
- [ ] See: `🚀 Server running on http://localhost:5000`
- [ ] Leave running

### Step 3: Start Frontend
- [ ] Open new terminal
- [ ] Navigate to: `cd dashboard/frontend`
- [ ] Run: `npm start`
- [ ] Browser should open to http://localhost:3000
- [ ] See: Lead Management Dashboard

## ✨ Testing the Application

### Test Lead Creation
- [ ] Fill in the form:
  - [ ] Name: Enter any name
  - [ ] Email: Enter valid email
  - [ ] Phone: Enter phone with country code (+1234567890)
  - [ ] Source: Select Instagram, Facebook, or WhatsApp
- [ ] Click "Create Lead & Send Message"
- [ ] See success message
- [ ] Check your WhatsApp for welcome message
- [ ] (If no message, check Twilio sandbox setup)

### Test Dashboard
- [ ] Check total leads count is updated
- [ ] View charts for lead distribution
- [ ] See your lead in the table

### Test Filtering
- [ ] Click "Filter Leads"
- [ ] Select a source filter
- [ ] Click "Apply Filters"
- [ ] See filtered results

### Test Lead Management
- [ ] Click status dropdown on a lead
- [ ] Change status (e.g., to "Qualified")
- [ ] See status update
- [ ] Click "Delete" button
- [ ] Confirm deletion

## 📱 WhatsApp Testing

### First Time Setup
- [ ] Go to: https://www.twilio.com/console/sms/whatsapp/learn
- [ ] Send "join" to Twilio WhatsApp number
- [ ] Receive confirmation

### Test WhatsApp Integration
- [ ] Create a lead from the form
- [ ] Check WhatsApp for message within 30 seconds
- [ ] Message should say: "Hi [Name]! Welcome! We've received your inquiry..."
- [ ] Status should show "delivered" in dashboard

### Troubleshooting WhatsApp
- [ ] If no message received:
  - [ ] Check browser console for errors
  - [ ] Check backend logs for errors
  - [ ] Verify Twilio credentials in .env
  - [ ] Verify phone number format includes country code
  - [ ] Check Twilio account balance (free tier has $15 credit)

## 📊 API Testing (Optional)

### Test Backend API
- [ ] Open Postman or curl
- [ ] Test GET: http://localhost:5000/api/leads
- [ ] Test GET: http://localhost:5000/api/leads/stats
- [ ] See MongoDB data returned

### Location Detection
- [ ] Create a lead
- [ ] Check dashboard/browser console
- [ ] Location should be auto-detected
- [ ] Should show city and country

## 🎓 Next Steps After Testing

- [ ] Read README.md for full documentation
- [ ] Read API_DOCS.md for API reference
- [ ] Explore the code structure
- [ ] Customize styling as needed
- [ ] Add more features (email notifications, etc.)
- [ ] Deploy to production (see DEPLOYMENT.md)

## 🐛 Common Issues & Solutions

### "Cannot find module" error
```bash
# Solution: Reinstall dependencies
npm install
```

### "EADDRINUSE: address already in use"
```bash
# Backend port is already in use
# Change PORT in .env or kill the process
```

### "MongoDB connection failed"
```bash
# Ensure MongoDB is running
mongod  # If not running

# Or check MongoDB Atlas connection string
```

### "WhatsApp message not received"
```bash
# Check:
1. Twilio credentials correct
2. Phone number includes +country code
3. You joined Twilio WhatsApp sandbox
4. Account has balance/credits
```

### "CORS error"
```bash
# Backend FRONTEND_URL doesn't match
# Update backend .env FRONTEND_URL to match frontend URL
```

## 🎉 Success Checklist

If all items below are checked, you're done! 🎉

- [ ] Backend running on http://localhost:5000
- [ ] Frontend running on http://localhost:3000
- [ ] Dashboard displaying (no errors)
- [ ] Created at least 1 lead
- [ ] WhatsApp message received
- [ ] Statistics showing lead count
- [ ] Able to filter leads
- [ ] Able to update lead status
- [ ] Able to delete a lead
- [ ] No errors in console

## 📞 Need Help?

1. Check the **README.md** for comprehensive docs
2. Check the **API_DOCS.md** for API reference
3. Check **browser console** for frontend errors
4. Check **terminal logs** for backend errors
5. Review **QUICKSTART.md** for quick reference

## 🚢 Ready for Production?

- [ ] Read DEPLOYMENT.md
- [ ] Choose hosting platform
- [ ] Set up MongoDB Atlas
- [ ] Configure Twilio for production
- [ ] Deploy backend
- [ ] Deploy frontend
- [ ] Test production URLs
- [ ] Monitor application

---

**You're all set! Welcome to your Lead Management Dashboard!** 🎉

Estimated Time to Complete: 30-45 minutes

Need more help? Read the documentation files included in the project!
