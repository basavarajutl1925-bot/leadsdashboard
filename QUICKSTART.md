## QUICK START GUIDE

### Prerequisites
- Node.js (v14+)
- MongoDB
- Twilio Account (for WhatsApp)

### 1. Run Setup Script

**On Linux/Mac:**
```bash
chmod +x setup.sh
./setup.sh
```

**On Windows:**
```bash
setup.bat
```

This will automatically install all dependencies and create .env files.

### 2. Configure Environment Variables

#### Backend (.env)
Update `/backend/.env` with:
```
MONGODB_URI=mongodb://localhost:27017/lead-dashboard
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=whatsapp:+1234567890
```

#### Frontend (.env)
The frontend .env is optional. Default API URL is `http://localhost:5000/api`

### 3. Start MongoDB
```bash
# Linux/Mac
mongod

# Windows
"C:\Program Files\MongoDB\Server\{version}\bin\mongod.exe"
```

### 4. Start Backend
```bash
cd backend
npm run dev
```
Backend runs on: http://localhost:5000

### 5. Start Frontend (new terminal)
```bash
cd frontend
npm start
```
Frontend runs on: http://localhost:3000

### 6. Test the Application

1. Open http://localhost:3000 in your browser
2. Fill out the lead form
3. Submit the form
4. Check your WhatsApp for the welcome message
5. View the lead on the dashboard

### API Health Check
```bash
curl http://localhost:5000/health
```

### Common Issues

**MongoDB Error:**
- Make sure MongoDB is running
- Check connection string in .env

**WhatsApp not working:**
- Verify Twilio credentials
- Check phone number format (+country code)
- Ensure recipient has WhatsApp installed

**Port in use:**
- Change PORT in backend .env
- Or kill the process using the port

**CORS Error:**
- Check FRONTEND_URL in backend .env
- Should match your frontend URL (usually http://localhost:3000)

### Project Structure
```
dashboard/
├── backend/          # Node.js/Express server
├── frontend/         # React application
├── README.md         # Full documentation
├── setup.sh          # Setup script (Linux/Mac)
└── setup.bat         # Setup script (Windows)
```

### Useful Commands

**Backend Development:**
```bash
cd backend
npm run dev          # Start with auto-reload
npm start            # Start normally
```

**Frontend Development:**
```bash
cd frontend
npm start            # Start with auto-reload
npm run build        # Build for production
```

### Next Steps

1. Register for Twilio account: https://www.twilio.com
2. Get WhatsApp sandbox: https://www.twilio.com/console/sms/whatsapp/learn
3. Update Twilio credentials in backend/.env
4. Test sending leads and receiving WhatsApp messages

### Production Deployment

For production deployment:

**Backend:**
- Deploy to Heroku, AWS Lambda, DigitalOcean, etc.
- Use MongoDB Atlas for cloud database
- Update FRONTEND_URL in environment

**Frontend:**
- Build: `npm run build`
- Deploy to Netlify, Vercel, GitHub Pages, etc.
- Update REACT_APP_API_URL to point to deployment backend

---

For detailed setup instructions, see [README.md](README.md)
