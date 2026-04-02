# ✅ Testing Checklist - Public Lead Capture System

## Pre-Testing Setup

- [ ] Backend running on http://localhost:5000 (`npm start` in backend folder)
- [ ] Frontend running on http://localhost:3000 (`npm start` in frontend folder)
- [ ] MongoDB connected and ready
- [ ] `.env` file properly configured with Twilio credentials

## Component Tests

### 1. Frontend Routing

**Test: Public page detection**
- [ ] Visit `http://localhost:3000/?source=instagram` → Shows LeadCapturePage ✅
- [ ] Visit `http://localhost:3000/?source=facebook` → Shows LeadCapturePage ✅
- [ ] Visit `http://localhost:3000/?source=whatsapp` → Shows LeadCapturePage ✅
- [ ] Visit `http://localhost:3000/?source=direct` → Shows LeadCapturePage ✅
- [ ] Visit `http://localhost:3000` (no params) → Shows Login page ✅
- [ ] Visit `http://localhost:3000/?source=invalid` → Shows appropriate handling ✅

### 2. LeadCapturePage UI

**Test: Form elements visible**
- [ ] Header displays "Get in Touch" ✅
- [ ] Subheader displays "We'd love to hear from you..." ✅
- [ ] Name field visible and labeled ✅
- [ ] Email field visible and labeled ✅
- [ ] Phone field visible and labeled ✅
- [ ] Message field visible and labeled ✅
- [ ] Location badge shows detected city/country ✅
- [ ] Source badge shows correct icon and source name ✅
- [ ] Submit button visible ✅

**Test: Form styling**
- [ ] Form has gradient background ✅
- [ ] Form card has rounded corners ✅
- [ ] Input fields have proper styling ✅
- [ ] Submit button has gradient ✅
- [ ] No layout issues on desktop ✅

### 3. Location Detection

**Test: IP-API integration**
- [ ] Location badge displays valid city name ✅
- [ ] Location badge displays valid country name ✅
- [ ] Location updates when page loads ✅
- [ ] "Detecting..." message appears initially then updates ✅

### 4. Source Detection

**Test: URL parameter parsing**
- [ ] Instagram source shows: 📸 From Instagram ✅
- [ ] Facebook source shows: 👍 From Facebook ✅
- [ ] WhatsApp source shows: 💬 From WhatsApp ✅
- [ ] Direct source shows: 🔗 From Direct Link ✅
- [ ] Email source shows: ✉️ From Email ✅

### 5. Form Validation

**Test: Required fields**
- [ ] Cannot submit with empty name (shows error) ✅
- [ ] Cannot submit with empty email (shows error) ✅
- [ ] Cannot submit with empty phone (shows error) ✅
- [ ] Can submit with empty message (optional) ✅

**Test: Email validation**
- [ ] Rejects invalid emails (e.g., "test") ✅
- [ ] Accepts valid emails (e.g., "test@example.com") ✅
- [ ] Shows error message for invalid email ✅

**Test: Phone validation**
- [ ] Rejects phone numbers < 10 digits ✅
- [ ] Accepts phone numbers ≥ 10 digits ✅
- [ ] Accepts phone numbers with + prefix ✅
- [ ] Accepts phone numbers without + prefix ✅

### 6. Form Submission

**Test: Valid submission**
- [ ] Fill form with valid data ✅
- [ ] Click submit button ✅
- [ ] Submit button shows "Submitting..." ✅
- [ ] Spinner animation displays ✅
- [ ] Success message appears ✅
- [ ] Success message shows 5 seconds then disappears ✅
- [ ] Form clears after success ✅

**Test: Network errors**
- [ ] Show error if backend unreachable ✅
- [ ] Show error message on failed submission ✅
- [ ] Allow retry after error ✅

### 7. API Integration

**Test: Backend acceptance**
- [ ] POST /api/leads endpoint receives data ✅
- [ ] Endpoint returns 201 status ✅
- [ ] Endpoint returns created lead with ID ✅
- [ ] Lead stored in MongoDB ✅
- [ ] All fields properly stored ✅

### 8. Admin Dashboard

**Test: Login works**
- [ ] Visit `http://localhost:3000` (no params) ✅
- [ ] Enter username: admin ✅
- [ ] Enter password: admin ✅
- [ ] Click login ✅
- [ ] Redirected to dashboard ✅

**Test: Info banner visible**
- [ ] Info banner displays with "Lead Capture" title ✅
- [ ] Shows link for Instagram source ✅
- [ ] Shows link for Facebook source ✅
- [ ] Shows link for WhatsApp source ✅
- [ ] Links are properly formatted code blocks ✅

**Test: New lead appears**
- [ ] Submit a public form ✅
- [ ] Go to admin dashboard ✅
- [ ] New lead appears in leads table ✅
- [ ] Source shows correctly (instagram, facebook, etc.) ✅
- [ ] City/country shows correctly ✅
- [ ] Status shows as "new" ✅

**Test: Lead filtering**
- [ ] Filter by source=instagram ✅
- [ ] Filter by source=facebook ✅
- [ ] Filter shows only leads from that source ✅
- [ ] Clear filter shows all leads ✅

**Test: Statistics**
- [ ] Total lead count increases ✅
- [ ] Per-source counts update ✅
- [ ] Charts display correctly ✅

### 9. WhatsApp Integration

**Test: Message sending (if Twilio configured)**
- [ ] Submit lead with valid phone ✅
- [ ] Check backend logs for WhatsApp message ✅
- [ ] Message shows in backend console logs ✅
- [ ] Message includes personalized greeting ✅
- [ ] Message includes source ✅
- [ ] Message includes city ✅
- [ ] Lead record stores messageSid ✅
- [ ] Lead record stores message status ✅

### 10. Responsive Design

**Test: Mobile (320px width)**
- [ ] Form fits on screen ✅
- [ ] All inputs are clickable ✅
- [ ] Buttons are easy to tap ✅
- [ ] No horizontal scrolling ✅
- [ ] Text is readable ✅

**Test: Tablet (768px width)**
- [ ] Form displays nicely ✅
- [ ] Information banner responsive ✅
- [ ] No layout issues ✅

**Test: Desktop (1920px width)**
- [ ] Form displays with good spacing ✅
- [ ] Decorative blobs visible ✅
- [ ] All elements properly aligned ✅

### 11. Error Handling

**Test: Backend errors**
- [ ] 400 - Missing required fields shows error ✅
- [ ] 500 - Database error shows friendly message ✅

**Test: Frontend errors**
- [ ] Network timeout shows error ✅
- [ ] CORS error handled gracefully ✅
- [ ] Invalid response handled ✅

### 12. Data Integrity

**Test: MongoDB storage**
- [ ] Query MongoDB directly for leads ✅
- [ ] Verify all fields in database ✅
- [ ] Verify timestamps are correct ✅
- [ ] Verify sources are stored correctly ✅
- [ ] Verify no data corruption ✅

---

## Manual Test Scenarios

### Scenario 1: Instagram Lead
1. Open http://localhost:3000/?source=instagram
2. Fill form: John Doe, john@example.com, +12025551234, "Love your products"
3. Submit
4. Verify success message
5. Check admin dashboard - lead should show source=instagram

### Scenario 2: Facebook Lead
1. Open http://localhost:3000/?source=facebook
2. Fill form: Jane Smith, jane@example.com, +12025551235, "Need pricing info"
3. Submit
4. Verify success message
5. Check admin dashboard - lead should show source=facebook

### Scenario 3: Direct Lead
1. Open http://localhost:3000/?source=direct
2. Fill form: Bob Wilson, bob@example.com, +12025551236
3. Submit
4. Check admin dashboard - lead should show source=direct

### Scenario 4: Invalid Form Data
1. Open http://localhost:3000/?source=whatsapp
2. Try to submit with invalid email
3. Verify error message
4. Fix email and resubmit
5. Verify success

### Scenario 5: Missing Required Fields
1. Open http://localhost:3000/?source=instagram
2. Leave name empty
3. Try to submit
4. Verify error "Please enter your name"
5. Fill name and try again
6. Should work

### Scenario 6: Admin Filters
1. Login as admin
2. Submit 3 leads from different sources
3. Filter by instagram
4. Verify only instagram leads show
5. Clear filters
6. Verify all leads show

---

## Performance Tests

- [ ] Page loads in < 2 seconds
- [ ] Location detection completes in < 1 second
- [ ] Form submission completes in < 3 seconds
- [ ] No console errors
- [ ] No memory leaks

---

## Browser Compatibility

- [ ] Chrome - Latest version ✅
- [ ] Firefox - Latest version ✅
- [ ] Safari - Latest version ✅
- [ ] Edge - Latest version ✅
- [ ] Mobile Safari (iOS) ✅
- [ ] Mobile Chrome (Android) ✅

---

## Accessibility Tests

- [ ] Form labels associated with inputs
- [ ] Required fields marked with *
- [ ] Error messages accessible
- [ ] Color contrast sufficient
- [ ] Keyboard navigation works
- [ ] Screen reader friendly

---

## Security Tests

- [ ] CORS properly configured
- [ ] XSS protection active
- [ ] No sensitive data in URLs
- [ ] HTTPS ready (for production)
- [ ] Phone numbers not exposed in URL

---

## Final Sign-Off

Complete all tests above and mark them checked. Then:

- [ ] All tests passing
- [ ] No critical bugs
- [ ] No 404 errors
- [ ] No console errors
- [ ] User ready for production
- [ ] Documentation complete

---

## Issue Reporting

If tests fail, check:

1. **Backend running?**
   ```bash
   curl http://localhost:5000/health
   ```

2. **Frontend running?**
   ```bash
   curl http://localhost:3000
   ```

3. **MongoDB connected?**
   ```javascript
   // Check backend logs for "MongoDB connected"
   ```

4. **Ports correct?**
   - Frontend: 3000
   - Backend: 5000
   - MongoDB: 27017

5. **Console errors?**
   - Open DevTools (F12)
   - Check Console tab
   - Check Network tab for failed requests

---

## Test Report Template

```
Date: ____/____/____
Tester: ___________
Browser: _________
Status: [ ] PASS [ ] FAIL

Test Results:
- Component Tests: [ ] Pass [ ] Fail
- Form Validation: [ ] Pass [ ] Fail
- API Integration: [ ] Pass [ ] Fail
- Admin Dashboard: [ ] Pass [ ] Fail
- Responsive Design: [ ] Pass [ ] Fail

Issues Found:
1. ________________
2. ________________
3. ________________

Notes:
_____________________________

Signed: ________________
```

---

**Version:** 2.0
**Last Updated:** 2024
**Ready for Testing:** ✅ YES
