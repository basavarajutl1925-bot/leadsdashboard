# 📱 SMS/WhatsApp Setup Guide

## ❌ Current Status: AUTH TOKEN MISSING

Your Twilio is set up but the **Auth Token is a placeholder**. That's why messages aren't being sent!

---

## ✅ How to Get Your Real Twilio Auth Token

### Step 1: Go to Twilio Console
Visit: https://www.twilio.com/console

### Step 2: Find Your Auth Credentials
- Look for **Account SID** (format: `ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` ✅)
- Look for **Auth Token** (the long string under your Account SID)
- Copy the Auth Token

### Step 3: Update .env File
Edit `/home/basavaraju/Desktop/dashboard/backend/.env`

Replace this:
```env
TWILIO_AUTH_TOKEN=your_auth_token_here
```

With your real token:
```env
TWILIO_AUTH_TOKEN=abc123xyz789abc123xyz789abc123xyz
```

### Step 4: Restart Backend
```bash
cd backend
pkill -f "node.*server.js"
npm start
```

Wait for message:
```
✅ Twilio SMS Service initialized successfully
```

---

## 🧪 Test After Setup

1. **Submit a lead** on the public form (http://localhost:3000/?source=direct)
2. **Check backend logs** for messages like:
   ```
   📱 Sending notification to [name] ([phone])
   ✅ Notification sent via sms: SMxxxxxxxxx
   ```
3. **Check your phone** - You should receive an SMS or WhatsApp!

---

## 📊 Messages Supported

### SMS Messages
- Regular text messages to any phone number
- Works with or without WhatsApp

### WhatsApp Messages
- Messages sent via WhatsApp (if Twilio WhatsApp is configured)
- Falls back to SMS if WhatsApp fails
- Only works with WhatsApp-enabled phone numbers

---

## 📝 Example Notification Message

```
Hi Basavaraju! 👋

Thank you for your interest from direct! We've received your inquiry in Bengaluru, India.

Our team will contact you shortly.

Best regards!
```

---

## 🔍 Troubleshooting

### Messages Not Sending?

**Check 1: Is Auth Token real?**
```bash
cat backend/.env | grep TWILIO_AUTH_TOKEN
```
Should NOT show `your_auth_token_here`

**Check 2: Is Twilio initialized?**
Look in backend logs for:
```
✅ Twilio SMS Service initialized successfully
```

**Check 3: Phone number format?**
- Must have country code: `+1` for US, `+91` for India
- Example: `+919008983960` ✅

**Check 4: Backend restarted?**
```bash
pkill -f "node.*server.js"
sleep 2
cd /home/basavaraju/Desktop/dashboard/backend && npm start
```

---

## 📞 Service Status Endpoint

Check if Twilio is properly configured:

```bash
curl http://localhost:5000/health
```

Look for Twilio status in the response.

---

## 💡 Tips

1. **SMS is cheaper** - Use SMS first, WhatsApp as backup
2. **Test with your own number** - Send yourself a test message
3. **Check message status** - Each message gets a SID for tracking
4. **Rate limits** - Twilio has rate limits, be careful with bulk sends

---

## 🔑 Environment Variables Summary

```env
# Required
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_real_token_here  ← UPDATE THIS!

# Optional (defaults provided)
TWILIO_PHONE_NUMBER=whatsapp:+14155238886
TWILIO_SMS_NUMBER=+14155238886
```

---

## ✅ Ready?

Once you add your real Auth Token and restart, messages will:
1. ✅ Send automatically when leads are submitted
2. ✅ Include personalized greeting with name
3. ✅ Show source and city
4. ✅ Display status in admin dashboard

**Need help?** Check the backend logs for detailed error messages!

Good luck! 🚀
