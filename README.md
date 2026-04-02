# Lead Management Dashboard - MERN Stack

A full-stack lead management dashboard built with MongoDB, Express.js, React, and Node.js (MERN stack) with WhatsApp integration using Twilio.

## 🎯 Features

- **Lead Capture Form**: Simple form to capture leads with automatic location detection
- **Location Detection**: Auto-detect user's city and country using IP-based API
- **Dashboard**: Beautiful UI showing:
  - Total leads count
  - Leads grouped by source (Instagram, Facebook, WhatsApp)
  - Bar and doughnut charts for lead distribution
  - Table with all leads and filters
- **WhatsApp Integration**: Automatic WhatsApp message sending via Twilio
- **Message Tracking**: Track message delivery status (sent, delivered, failed)
- **Filtering**: Filter leads by source and date range
- **Pagination**: Paginated leads table for better performance
- **Responsive Design**: Mobile-friendly UI
- **Error Handling**: Comprehensive error handling and validation
- **Production-Ready**: Clean code structure and best practices

## 📁 Project Structure

```
dashboard/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   └── leadController.js
│   │   ├── middleware/
│   │   │   ├── errorHandler.js
│   │   │   └── validators.js
│   │   ├── models/
│   │   │   └── Lead.js
│   │   ├── routes/
│   │   │   └── leadRoutes.js
│   │   ├── utils/
│   │   │   ├── locationService.js
│   │   │   └── whatsappService.js
│   │   └── server.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── LeadForm.js
│   │   │   ├── LeadsTable.js
│   │   │   ├── StatsCards.js
│   │   │   └── FiltersPanel.js
│   │   ├── pages/
│   │   │   └── Dashboard.js
│   │   ├── styles/
│   │   │   ├── Dashboard.css
│   │   │   ├── LeadForm.css
│   │   │   ├── LeadsTable.css
│   │   │   ├── StatsCards.css
│   │   │   ├── FiltersPanel.css
│   │   │   └── index.css
│   │   ├── utils/
│   │   │   ├── api.js
│   │   │   └── helpers.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Twilio Account (for WhatsApp integration)

### Installation

#### 1. Clone or Extract the Project

```bash
cd dashboard
```

#### 2. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your configuration
# - MongoDB URI
# - Twilio credentials
# - Port (default 5000)
# - Frontend URL (for CORS)
```

**Backend .env Example:**
```
MONGODB_URI=mongodb://localhost:27017/lead-dashboard
PORT=5000
NODE_ENV=development

TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=whatsapp:+1234567890

FRONTEND_URL=http://localhost:3000
```

#### 3. Setup Frontend

```bash
cd ../frontend

# Install dependencies
npm install

# Create .env file (optional, but recommended)
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env
```

**Frontend .env Example:**
```
REACT_APP_API_URL=http://localhost:5000/api
```

## 🏃 Running the Application

### Start MongoDB (if local)

```bash
# On Linux/Mac
mongod

# On Windows
"C:\Program Files\MongoDB\Server\{version}\bin\mongod.exe"
```

### Start Backend Server

```bash
cd backend
npm run dev
```

The backend will run on `http://localhost:5000`

Health check: `http://localhost:5000/health`

### Start Frontend (in a new terminal)

```bash
cd frontend
npm start
```

The frontend will run on `http://localhost:3000`

## 📡 API Endpoints

### Leads

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/leads` | Create a new lead and send WhatsApp message |
| GET | `/api/leads` | Get all leads (with pagination & filters) |
| GET | `/api/leads/stats` | Get lead statistics by source |
| GET | `/api/leads/:id` | Get a single lead |
| PUT | `/api/leads/:id` | Update a lead |
| DELETE | `/api/leads/:id` | Delete a lead |
| GET | `/api/leads/:id/message-status` | Get WhatsApp message status |

### Query Parameters

**GET /api/leads**
- `page` (default: 1): Page number for pagination
- `limit` (default: 10): Number of leads per page
- `source` (optional): Filter by source (instagram, facebook, whatsapp)
- `startDate` (optional): Filter by start date (ISO format)
- `endDate` (optional): Filter by end date (ISO format)

### Example Requests

#### Create a Lead
```bash
curl -X POST http://localhost:5000/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "source": "instagram"
  }'
```

#### Get All Leads
```bash
curl http://localhost:5000/api/leads?page=1&limit=10&source=instagram
```

#### Get Statistics
```bash
curl http://localhost:5000/api/leads/stats
```

## 🔐 Setting Up Twilio WhatsApp

1. **Create Twilio Account**
   - Go to https://www.twilio.com
   - Sign up for a free account
   - Get your Account SID and Auth Token from the Dashboard

2. **Enable WhatsApp**
   - In Twilio Console, navigate to Messaging → Try it out → Send a WhatsApp message
   - Obtain your Twilio WhatsApp number (format: whatsapp:+1XXXXXXXXXX)

3. **Update .env**
   ```
   TWILIO_ACCOUNT_SID=your_sid_here
   TWILIO_AUTH_TOKEN=your_token_here
   TWILIO_PHONE_NUMBER=whatsapp:+1234567890
   ```

4. **Test WhatsApp Message**
   - Submit a lead form on the dashboard
   - Check your WhatsApp for the welcome message

## 🗄️ MongoDB Schema

### Lead Collection

```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  phone: String (required),
  source: String (enum: ['instagram', 'facebook', 'whatsapp']),
  location: {
    city: String,
    country: String,
    ipAddress: String
  },
  messageStatus: {
    messageSid: String (unique),
    status: String (enum: ['sent', 'delivered', 'failed', 'pending']),
    errorMessage: String,
    sentAt: Date,
    deliveredAt: Date
  },
  notes: String,
  status: String (enum: ['new', 'contacted', 'qualified', 'lost']),
  createdAt: Date,
  updatedAt: Date
}
```

## 🎨 Frontend Components

### LeadForm
- Captures lead information
- Auto-detects location
- Validates input
- Submits to backend

### StatsCards
- Displays total leads count
- Shows breakdown by source
- Displays bar and doughnut charts

### LeadsTable
- Lists all leads with pagination
- Show lead status and message status
- Allow updating lead status
- Delete leads functionality

### FiltersPanel
- Filter by lead source
- Filter by date range
- Refresh leads

## 🛡️ Security Features

- **Input Validation**: All inputs are validated on both frontend and backend
- **CORS Protection**: Configured CORS to allow only frontend origin
- **Helmet.js**: Adds HTTP headers for security
- **Error Handling**: Comprehensive error handling without exposing sensitive data
- **Environment Variables**: Sensitive data stored in .env files

## 📦 Dependencies

### Backend
- **express**: Web framework
- **mongoose**: MongoDB ODM
- **dotenv**: Environment variables
- **axios**: HTTP client for location API
- **twilio**: WhatsApp messaging
- **cors**: Cross-Origin Resource Sharing
- **helmet**: Security middleware
- **express-validator**: Input validation

### Frontend
- **react**: UI library
- **axios**: HTTP client
- **chart.js**: Charting library
- **react-chartjs-2**: React wrapper for Chart.js
- **date-fns**: Date utilities

## 🧪 Testing the Application

1. **Create a Lead**
   - Fill the form on the dashboard
   - Submit to create a lead
   - Check your WhatsApp for the message

2. **View Statistics**
   - Create multiple leads from different sources
   - Check the stats cards and charts

3. **Filter Leads**
   - Use the filters panel to filter by source and date
   - Check pagination

4. **Update Lead Status**
   - Click on the status dropdown in the table
   - Change status and verify update

5. **Delete Lead**
   - Click delete button on any lead
   - Confirm deletion

## 📊 Sample Data

To populate the database with sample leads:

```bash
# Create a seed.js file in backend/src
# Add sample leads and import it in server.js
```

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Solution: Ensure MongoDB is running and connection string is correct
```

### WhatsApp Messages Not Sending
```
Solution: 
1. Check Twilio credentials
2. Verify phone number format (include country code)
3. Check Twilio account balance
4. Verify recipient has WhatsApp
```

### CORS Error
```
Solution: Check FRONTEND_URL in backend .env matches your frontend URL
```

### Port Already in Use
```
Solution: Change PORT in .env or kill the process using the port
```

## 📚 Additional Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Twilio WhatsApp API](https://www.twilio.com/docs/whatsapp)
- [Chart.js Documentation](https://www.chartjs.org/)

## 🤝 Contributing

Feel free to fork, modify, and improve this project!

## 📝 License

MIT License - Feel free to use for personal and commercial projects

## 👨‍💻 Author

Created as a comprehensive MERN stack example with real-world integrations

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review API documentation
3. Check browser console for frontend errors
4. Check server logs for backend errors

---

**Happy coding! 🚀**
