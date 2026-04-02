# 🔌 API Documentation - Updated

## Base URL

```
http://localhost:5000/api
```

---

## 📝 Authentication Endpoints

### Login
**Endpoint:** `POST /auth/login`

**Request:**
```json
{
  "username": "admin",
  "password": "admin"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "user_token_here",
  "user": {
    "id": "user_id",
    "username": "admin"
  }
}
```

**Response (Error - 401):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

## 🎯 Lead Endpoints

### Create Lead (Public - No Auth Required)
**Endpoint:** `POST /leads`

**Description:** Create a new lead from public form submission. No authentication required.

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+12025551234",
  "message": "I'm interested in your services",
  "source": "instagram",
  "city": "San Francisco",
  "country": "United States",
  "status": "new"
}
```

**Fields:**
- `name` (string, required) - Lead's full name
- `email` (string, required) - Lead's email address
- `phone` (string, required) - Lead's phone number (preferably with country code)
- `message` (string, optional) - Additional message/details
- `source` (string, optional) - Where lead came from
  - Valid values: `instagram`, `facebook`, `whatsapp`, `direct`, `email`, `phone`, `website`
  - Default: `direct`
- `city` (string, optional) - Lead's city
- `country` (string, optional) - Lead's country
- `status` (string, optional) - Lead status
  - Valid values: `new`, `contacted`, `qualified`, `lost`, `converted`
  - Default: `new`

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "Lead created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+12025551234",
    "message": "I'm interested in your services",
    "source": "instagram",
    "city": "San Francisco",
    "country": "United States",
    "status": "new",
    "messageStatus": {
      "messageSid": "SMxxxxxxxxxxxxxxxxxxxxxxxxxx",
      "status": "sent",
      "sentAt": "2024-01-15T10:30:45.123Z"
    },
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:45.123Z"
  }
}
```

**Response (Error - 400):**
```json
{
  "success": false,
  "message": "Name, email, and phone are required"
}
```

---

### Get All Leads (Protected - Auth Required)
**Endpoint:** `GET /leads`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `source` (optional) - Filter by source (instagram, facebook, whatsapp, etc)
- `startDate` (optional) - Filter by start date (YYYY-MM-DD)
- `endDate` (optional) - Filter by end date (YYYY-MM-DD)
- `page` (optional) - Page number (default: 1)
- `limit` (optional) - Items per page (default: 10)

**Examples:**
```
GET /leads                          # All leads, page 1
GET /leads?source=instagram         # Only Instagram leads
GET /leads?page=2&limit=20          # Page 2, 20 items per page
GET /leads?startDate=2024-01-01&endDate=2024-01-31  # Date range
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Leads retrieved successfully",
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  },
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+12025551234",
      "message": "I'm interested in your services",
      "source": "instagram",
      "city": "San Francisco",
      "country": "United States",
      "status": "new",
      "messageStatus": {
        "messageSid": "SMxxxxxxxxxxxxxxxxxxxxxxxxxx",
        "status": "sent",
        "sentAt": "2024-01-15T10:30:45.123Z"
      },
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:45.123Z"
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "phone": "+12025551235",
      "message": "Need information",
      "source": "facebook",
      "city": "New York",
      "country": "United States",
      "status": "new",
      "messageStatus": {
        "messageSid": "SMxxxxxxxxxxxxxxxxxxxxxxxxxx",
        "status": "delivered",
        "sentAt": "2024-01-15T10:35:45.123Z"
      },
      "createdAt": "2024-01-15T10:35:00.000Z",
      "updatedAt": "2024-01-15T10:35:45.123Z"
    }
  ]
}
```

---

### Get Lead by ID (Protected - Auth Required)
**Endpoint:** `GET /leads/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Lead retrieved successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+12025551234",
    "message": "I'm interested in your services",
    "source": "instagram",
    "city": "San Francisco",
    "country": "United States",
    "status": "new",
    "messageStatus": {
      "messageSid": "SMxxxxxxxxxxxxxxxxxxxxxxxxxx",
      "status": "sent",
      "sentAt": "2024-01-15T10:30:45.123Z"
    },
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:45.123Z"
  }
}
```

**Response (Error - 404):**
```json
{
  "success": false,
  "message": "Lead not found"
}
```

---

### Update Lead (Protected - Auth Required)
**Endpoint:** `PUT /leads/:id`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request:**
```json
{
  "status": "contacted",
  "message": "Will call today",
  "notes": "Interested in premium plan"
}
```

**Updatable Fields:**
- `status` - new, contacted, qualified, lost, converted
- `message` - message/details
- `notes` - internal notes

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Lead updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+12025551234",
    "message": "Will call today",
    "source": "instagram",
    "city": "San Francisco",
    "country": "United States",
    "status": "contacted",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

---

### Delete Lead (Protected - Auth Required)
**Endpoint:** `DELETE /leads/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Lead deleted successfully"
}
```

**Response (Error - 404):**
```json
{
  "success": false,
  "message": "Lead not found"
}
```

---

## 📊 Statistics Endpoints

### Get Lead Statistics (Protected - Auth Required)
**Endpoint:** `GET /leads/stats/summary`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Statistics retrieved successfully",
  "data": {
    "totalLeads": 42,
    "bySource": {
      "instagram": 15,
      "facebook": 12,
      "whatsapp": 8,
      "direct": 5,
      "email": 2
    },
    "byStatus": {
      "new": 20,
      "contacted": 12,
      "qualified": 7,
      "lost": 2,
      "converted": 1
    },
    "thisMonth": 18,
    "thisWeek": 5,
    "today": 2
  }
}
```

---

## Health Check

### API Health
**Endpoint:** `GET /health`

**Response (Success - 200):**
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "message": "Lead Management API is running"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Invalid request",
  "error": "Detailed error message"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Authentication required",
  "error": "Missing or invalid token"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error",
  "error": "Error details"
}
```

---

## cURL Examples

### Create Lead (Public - No Auth)
```bash
curl -X POST http://localhost:5000/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+12025551234",
    "message": "Interested in your services",
    "source": "instagram",
    "city": "San Francisco",
    "country": "United States"
  }'
```

### Get All Leads (Protected)
```bash
curl -X GET "http://localhost:5000/api/leads" \
  -H "Authorization: Bearer <your_token>"
```

### Get Leads by Source
```bash
curl -X GET "http://localhost:5000/api/leads?source=instagram" \
  -H "Authorization: Bearer <your_token>"
```

### Update Lead Status
```bash
curl -X PUT http://localhost:5000/api/leads/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_token>" \
  -d '{
    "status": "contacted"
  }'
```

### Delete Lead
```bash
curl -X DELETE http://localhost:5000/api/leads/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer <your_token>"
```

---

## Rate Limiting

Currently no rate limiting is enabled. In production, implement:
- 100 requests per 15 minutes per IP for public endpoints
- 1000 requests per 15 minutes per user for protected endpoints

---

## CORS Configuration

**Allowed Origins:** http://localhost:3000
**Allowed Methods:** GET, POST, PUT, DELETE, PATCH, OPTIONS
**Allowed Headers:** Content-Type, Authorization

To allow additional origins, update `backend/src/server.js`:
```javascript
cors({
  origin: [
    'http://localhost:3000',
    'https://yourdomain.com',
    'https://www.yourdomain.com'
  ]
})
```

---

## Pagination

All list endpoints return paginated results:
- Default page: 1
- Default limit: 10
- Max limit: 50

Example:
```
/api/leads?page=2&limit=20
```

Returns items 21-40.

---

## Sorting

List endpoints support sorting by:
- `createdAt` (default, descending)
- `name`
- `source`
- `status`

Example:
```
/api/leads?sort=-createdAt  # Newest first
/api/leads?sort=name         # A-Z
```

---

## Version

**Current Version:** 2.0 (Public Lead Capture Edition)
**Last Updated:** 2024
**Status:** Production Ready

For more information, see [QUICK_START.md](QUICK_START.md) and [PUBLIC_LEAD_CAPTURE.md](PUBLIC_LEAD_CAPTURE.md)
