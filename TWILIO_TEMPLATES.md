# 🎯 WhatsApp Template Messages Setup

## ✅ You Have Everything!

From your Twilio code, I can see you have:
- ✅ Account SID: `AC42454bfe6e584df0ef9eef3191876006`
- ✅ Template SID: `HXb5b62575e6e4ff6129ad7c8efe1f983e`
- ✅ Your phone: `whatsapp:+919008983960`
- ❌ Auth Token: Still need to get from Twilio console

---

## 🔑 Step 1: Get Your Real Auth Token

### From Twilio Console:
1. Go to: https://www.twilio.com/console
2. Look for the **Auth Token** (long string under your Account SID)
3. It's usually hidden - click the eye icon to reveal it
4. Copy the entire token

### Update .env File:
Edit `/home/basavaraju/Desktop/dashboard/backend/.env`

Replace:
```env
TWILIO_AUTH_TOKEN=your_real_auth_token_here
```

With your copied token (example format):
```env
TWILIO_AUTH_TOKEN=abcdef1234567890abcdef1234567890
```

---

## 🎨 Step 2: Configure Template (Optional)

Your template SID is already configured in `.env`:
```env
TWILIO_TEMPLATE_SID=HXb5b62575e6e4ff6129ad7c8efe1f983e
```

If you have a different template SID from Twilio, update this.

---

## 📝 Template Variable Format

Your template accepts variables:
```json
{
  "1": "12/1",
  "2": "3pm"
}
```

These map to placeholders in your Twilio template like:
- `{1}` → "12/1"
- `{2}` → "3pm"

Example template message:
```
Hi! Your appointment is on {1} at {2}. See you soon!
```

Would render as:
```
Hi! Your appointment is on 12/1 at 3pm. See you soon!
```

---

## 🚀 Two Ways to Send Messages

### Option 1: Regular Message (Current Setup)
```javascript
await smsService.sendWhatsApp(
  '+919008983960',
  'Hi! Thank you for your inquiry. Our team will contact you soon.'
);
```

### Option 2: Template Message (New)
```javascript
await smsService.sendWhatsAppTemplate(
  '+919008983960',
  'HXb5b62575e6e4ff6129ad7c8efe1f983e',
  {
    "1": "12/1",
    "2": "3pm"
  }
);
```

---

## 🧪 Test Your Setup

### Option 1: Test Regular Message
```bash
# Start backend
cd backend
npm start

# In another terminal, test:
curl -X POST http://localhost:5000/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+919008983960",
    "source": "direct",
    "city": "Bengaluru",
    "country": "India"
  }'
```

You should receive an SMS or WhatsApp message!

---

## ✨ Example Code Flow

When a lead submits the form:

1. **Form submitted** → POST /api/leads
2. **Lead saved** → MongoDB
3. **Notification sent** → 
   - Try SMS first
   - If fails, try WhatsApp
   - Message includes: name, source, city
4. **Status tracked** → Admin dashboard

---

## 📊 Backend Log Examples

After you add real Auth Token and submit a lead:

**Success (SMS):**
```
📧 Sending notification to Test User (+919008983960)
📱 Sending SMS to: +919008983960
✅ Notification sent via sms: SMxxxxxxxxxxxxxxxxx
```

**Success (WhatsApp):**
```
📧 Sending notification to Test User (+919008983960)
💬 Sending WhatsApp to: 919008983960
✅ Notification sent via whatsapp: SMxxxxxxxxxxxxxxxxx
```

**With Template:**
```
💬 Sending WhatsApp template to: 919008983960
✅ WhatsApp template sent! SID: SMxxxxxxxxxxxxxxxxx
```

---

## 🔍 Your Twilio Code Converted

Your Twilio code:
```javascript
const accountSid = 'AC42454bfe6e584df0ef9eef3191876006';
const authToken = '[AuthToken]';
const client = require('twilio')(accountSid, authToken);

client.messages.create({
  from: 'whatsapp:+14155238886',
  contentSid: 'HXb5b62575e6e4ff6129ad7c8efe1f983e',
  contentVariables: '{"1":"12/1","2":"3pm"}',
  to: 'whatsapp:+919008983960'
})
```

In our service (automatically handled):
```javascript
await smsService.sendWhatsAppTemplate(
  '+919008983960',
  'HXb5b62575e6e4ff6129ad7c8efe1f983e',
  { "1": "12/1", "2": "3pm" }
);
```

---

## ✅ Checklist

- [ ] Get real Auth Token from Twilio console
- [ ] Update `TWILIO_AUTH_TOKEN` in `.env`
- [ ] Update `TWILIO_TEMPLATE_SID` if you have different one
- [ ] Restart backend: `npm start`
- [ ] See backend log: "✅ Twilio SMS Service initialized successfully"
- [ ] Submit test lead
- [ ] Check your phone for message
- [ ] View lead in admin dashboard

---

## 🆘 Troubleshooting

### "Twilio not initialized"
- Auth Token is placeholder or missing
- Update `.env` with real token
- Restart backend

### "Message sending but not delivering"
- Phone number format wrong (must have +countrycode)
- Twilio WhatsApp not enabled for number
- Check backend logs for Twilio error

### "Template message sent but not received"
- Template SID wrong
- Template not approved by Twilio
- Variables don't match template placeholders

---

## 📞 Support

- Twilio Console: https://www.twilio.com/console
- SMS Setup: https://www.twilio.com/console/sms/getting-started
- WhatsApp Setup: https://www.twilio.com/console/sms/whatsapp/learn
- Template Messages: https://www.twilio.com/console/sms/content

---

**Ready?** Update your Auth Token and restart! 🚀
