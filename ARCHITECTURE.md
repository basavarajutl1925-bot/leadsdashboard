# 🏗️ System Architecture - Public Lead Capture

```
┌─────────────────────────────────────────────────────────────────┐
│                    LEAD MANAGEMENT DASHBOARD v2.0               │
│                   (Public Lead Capture Edition)                 │
└─────────────────────────────────────────────────────────────────┘

                           INTERNET
                              │
                ┌─────────────┼─────────────┐
                │             │             │
                │             │             │
            Instagram       Facebook      WhatsApp
                │             │             │
                └─────────────┼─────────────┘
                              │
                              ▼
        ┌────────────────────────────────────────┐
        │        Frontend (React v18.2.0)        │
        │        Port: 3000                      │
        └────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
    ┌─────────┐       ┌─────────────┐       ┌──────────┐
    │  Login  │       │  Dashboard  │       │  Public  │
    │ Page    │       │  (Protected)│       │   Form   │
    │         │       │             │       │          │
    │ admin   │       │  • Stats    │       │ No Auth  │
    │/admin   │       │  • Leads    │       │ Required │
    │         │       │  • Filters  │       │          │
    └────┬────┘       └──────┬──────┘       └────┬─────┘
         │                   │                   │
         │ Token Auth        │ Token Auth        │ Get Location
         │                   │                   ├→ IP-API
         │                   │                   │
         └───────────────────┼───────────────────┘
                              │
                              ▼
        ┌────────────────────────────────────────────┐
        │      REST API (Express.js)                 │
        │      Port: 5000                            │
        ├────────────────────────────────────────────┤
        │ Routes:                                    │
        │  • POST   /api/leads        (Public)      │
        │  • GET    /api/leads        (Protected)   │
        │  • GET    /api/leads/:id    (Protected)   │
        │  • PUT    /api/leads/:id    (Protected)   │
        │  • DELETE /api/leads/:id    (Protected)   │
        │  • POST   /api/auth/login   (Public)      │
        │  • GET    /health           (Public)      │
        └────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
   ┌─────────┐          ┌──────────┐         ┌──────────┐
   │ Database│          │ WhatsApp │         │ IP-API   │
   │         │          │ Service  │         │          │
   │MongoDB  │          │(Twilio)  │         │Geolocation
   │         │          │          │         │          │
   │• Leads  │          │ • Send   │         │• City    │
   │• Users  │          │ • Status │         │• Country │
   │• Stats  │          │ • Delivery
   │         │          │          │         │          │
   └─────────┘          └──────────┘         └──────────┘
```

## Component Architecture

```
Frontend Structure:
═══════════════════════════════════════════════════════════════

src/
├── pages/
│   ├── LeadCapturePage.js      ← Public form (NEW!)
│   ├── Dashboard.js            ← Admin panel
│   └── Login.js                ← Auth page
│
├── components/
│   ├── LeadForm.js             (kept but not used)
│   ├── StatsCards.js
│   ├── LeadsTable.js
│   ├── FiltersPanel.js
│   └── Login.js
│
├── styles/
│   ├── LeadCapturePage.css     ← Public form styles (NEW!)
│   ├── Dashboard.css           ← Updated
│   ├── Login.css
│   └── index.css
│
├── utils/
│   └── api.js                  ← Axios client
│
├── App.js                      ← Updated with routing
└── index.js
```

```
Backend Structure:
═══════════════════════════════════════════════════════════════

src/
├── controllers/
│   ├── leadController.js       ← Updated (WhatsApp integration)
│   └── authController.js
│
├── models/
│   ├── Lead.js                 ← Updated (new fields)
│   └── User.js
│
├── routes/
│   ├── leadRoutes.js
│   └── authRoutes.js
│
├── utils/
│   ├── whatsappService.js      ← Enhanced
│   ├── locationService.js
│   └── database.js
│
├── middleware/
│   └── auth.js
│
├── server.js                   ← Main app
└── .env                        ← Configuration
```

## Data Flow Diagram

```
Scenario: Customer submits from Instagram

1. User Access:
   ┌─────────────────────────────────┐
   │ HTTP: GET /?source=instagram    │
   └──────────────────┬──────────────┘
                      ▼
   ┌─────────────────────────────────┐
   │ App.js detects URL parameter    │
   └──────────────────┬──────────────┘
                      ▼
   ┌─────────────────────────────────┐
   │ isPublicPage = true             │
   └──────────────────┬──────────────┘
                      ▼
   ┌─────────────────────────────────┐
   │ Render LeadCapturePage          │
   └─────────────────────────────────┘

2. Location Detection:
   ┌─────────────────────────────────┐
   │ useEffect runs on mount         │
   └──────────────────┬──────────────┘
                      ▼
   ┌─────────────────────────────────┐
   │ axios.get to IP-API             │
   └──────────────────┬──────────────┘
                      ▼
   ┌─────────────────────────────────┐
   │ Get: city, country from IP      │
   └──────────────────┬──────────────┘
                      ▼
   ┌─────────────────────────────────┐
   │ setLocation({ city, country })  │
   └─────────────────────────────────┘

3. Form Fill:
   ┌─────────────────────────────────┐
   │ User enters:                    │
   │ • name: "John Doe"              │
   │ • email: "john@example.com"     │
   │ • phone: "+12025551234"         │
   │ • message: "Contact me ASAP"    │
   └──────────────────┬──────────────┘
                      ▼
   ┌─────────────────────────────────┐
   │ User clicks Submit               │
   └──────────────────┬──────────────┘
                      ▼

4. Form Submission:
   ┌──────────────────────────────────────────────────────┐
   │ POST /api/leads                                      │
   │ {                                                    │
   │   "name": "John Doe",                               │
   │   "email": "john@example.com",                      │
   │   "phone": "+12025551234",                          │
   │   "message": "Contact me ASAP",                     │
   │   "source": "instagram",         ← From URL         │
   │   "city": "San Francisco",       ← From IP-API      │
   │   "country": "United States",    ← From IP-API      │
   │   "status": "new"                                   │
   │ }                                                    │
   └──────────────────┬───────────────────────────────────┘
                      ▼

5. Backend Processing:
   ┌──────────────────────────────────────────────────────┐
   │ leadController.createLead()                          │
   └──────────────────┬───────────────────────────────────┘
                      ▼
   ┌──────────────────────────────────────────────────────┐
   │ Validate all fields:                                 │
   │ • name required                                      │
   │ • email valid format                                 │
   │ • phone min 10 digits                                │
   └──────────────────┬───────────────────────────────────┘
                      ▼
   ┌──────────────────────────────────────────────────────┐
   │ Create Lead document in MongoDB                      │
   └──────────────────┬───────────────────────────────────┘
                      ▼
   ┌──────────────────────────────────────────────────────┐
   │ If Twilio configured:                                │
   │ • Format phone: "+1202555123<-"                      │
   │ • Generate welcome message with source & city        │
   │ • Send via WhatsApp                                  │
   └──────────────────┬───────────────────────────────────┘
                      ▼
   ┌──────────────────────────────────────────────────────┐
   │ Return 201 + Lead data with messageSid               │
   └──────────────────┬───────────────────────────────────┘
                      ▼

6. Frontend Response:
   ┌──────────────────────────────────────────────────────┐
   │ Response 201: {"success": true, "data": {...}}       │
   └──────────────────┬───────────────────────────────────┘
                      ▼
   ┌──────────────────────────────────────────────────────┐
   │ Show success message:                                │
   │ "✅ Thank You! Your inquiry has been received"       │
   └──────────────────┬───────────────────────────────────┘
                      ▼
   ┌──────────────────────────────────────────────────────┐
   │ Clear form                                           │
   │ Auto-hide success after 5 seconds                    │
   └──────────────────┴───────────────────────────────────┘

7. Admin View:
   ┌──────────────────────────────────────────────────────┐
   │ Login as admin: admin/admin                          │
   └──────────────────┬───────────────────────────────────┘
                      ▼
   ┌──────────────────────────────────────────────────────┐
   │ GET /api/leads                                       │
   │ Returns all leads including new one                  │
   └──────────────────┬───────────────────────────────────┘
                      ▼
   ┌──────────────────────────────────────────────────────┐
   │ Dashboard displays:                                  │
   │ • Lead row with name, email, phone                   │
   │ • source: "instagram"                                │
   │ • location: "San Francisco, United States"           │
   │ • status: "new"                                      │
   │ • WhatsApp icon showing message sent                 │
   └──────────────────┴───────────────────────────────────┘
```

## Database Schema

```
MongoDB Collections:
═══════════════════════════════════════════════════════════════

leads {
  _id: ObjectId,
  name: String,                    // Required: Lead's name
  email: String,                   // Required: Validated email
  phone: String,                   // Required: Formatted phone
  message: String,                 // Optional: Additional info
  source: String,                  // instagram|facebook|whatsapp|...
  city: String,                    // Optional: Auto-detected city
  country: String,                 // Optional: Auto-detected country
  status: String,                  // new|contacted|qualified|lost|converted
  messageStatus: {
    messageSid: String,            // Twilio message ID
    status: String,                // sent|delivered|failed|pending
    sentAt: Date,
    deliveredAt: Date,
    errorMessage: String
  },
  notes: String,                   // Admin notes
  location: {                       // Backward compatible
    city: String,
    country: String,
    ipAddress: String
  },
  createdAt: Date,                 // Auto timestamp
  updatedAt: Date                  // Auto timestamp
}

users {
  _id: ObjectId,
  username: String,                // Unique username
  password: String,                // Hashed password
  createdAt: Date,
  updatedAt: Date
}
```

## External Services

```
1. IP-API (Geolocation)
   ├── Endpoint: http://ip-api.com/json/
   ├── Response: { city, country, latitude, longitude, ... }
   ├── Rate: 45 calls/minute (non-commercial)
   └── Fallback: "Unknown" if fails

2. Twilio WhatsApp
   ├── Service: WhatsApp message sending
   ├── Authentication: Account SID + Auth Token
   ├── From: Twilio WhatsApp phone number
   ├── To: User's phone number (+ required)
   └── Response: Message SID, status, delivery

3. MongoDB (Database)
   ├── Local: mongodb://localhost:27017/leads_db
   ├── Or: MongoDB Atlas (cloud)
   ├── Collections: leads, users
   └── Indexes: source+createdAt, email, phone
```

## Deployment Architecture

```
Production Setup:
═══════════════════════════════════════════════════════════════

     ┌──────────────────────────────────┐
     │   Internet (Users/Customers)     │
     └────────────────┬─────────────────┘
                      │
          ┌───────────┴──────────┐
          │                      │
          ▼                      ▼
    ┌──────────────┐       ┌──────────────┐
    │     HTTPS    │       │     HTTPS    │
    │   Domain 1   │       │   Domain 2   │
    │   (Frontend)  │       │  (API)       │
    └──────┬───────┘       └────┬─────────┘
           │                    │
           ▼                    ▼
    ┌──────────────┐       ┌──────────────┐
    │   React App  │       │  Express.js  │
    │ (Nginx/CDN)  │       │  (PM2/Node)  │
    └──────┬───────┘       └────┬─────────┘
           │                    │
           └────────┬───────────┘
                    │
                    ▼
           ┌─────────────────┐
           │  MongoDB Atlas  │
           │   (Cloud)       │
           └─────────────────┘
```

## Security Layers

```
1. Frontend Layer
   ├── Email/Phone validation
   ├── XSS protection (React sanitization)
   └── HTTPS only in production

2. API Layer
   ├── CORS configured
   ├── Helmet.js (security headers)
   ├── Input validation
   └── Rate limiting (recommended)

3. Database Layer
   ├── Connection auth required
   ├── Mongoose schema validation
   ├── Indexes for performance
   └── Encrypted passwords
```

---

## Technology Stack

```
Frontend:
├── React 18.2.0
├── Axios (HTTP client)
├── CSS3 (styling)
├── No external UI library (custom CSS)
└── Responsive design

Backend:
├── Node.js (runtime)
├── Express.js 4.18.2 (framework)
├── MongoDB with Mongoose 7.0.0
├── Twilio SDK 3.77.0
├── Express-validator 7.0.0
├── Helmet 7.0.0 (security)
├── CORS 2.8.5
└── Dotenv 16.0.3

Deployment:
├── Frontend: Netlify / Vercel / Nginx
├── Backend: Heroku / Railway / AWS / GCP
├── Database: MongoDB Atlas
└── HTTPS: Let's Encrypt / CloudFlare

External Services:
├── Twilio (WhatsApp)
├── IP-API (Geolocation)
└── DNS provider
```

---

**Version:** 2.0 | Architecture Date: 2024 | Status: Production Ready
