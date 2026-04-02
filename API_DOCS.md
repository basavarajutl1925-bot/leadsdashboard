# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Health Check

### ✅ Check Server Status
```
GET /health
```

**Response:**
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

---

## Leads Endpoints

### 📝 Create a New Lead

Creates a new lead and sends WhatsApp message automatically.

```
POST /api/leads
```

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "source": "instagram"
}
```

**Request Validation:**
- `name`: Required, minimum 2 characters
- `email`: Required, valid email format
- `phone`: Required, valid phone format (minimum 10 digits)
- `source`: Required, must be one of: `instagram`, `facebook`, `whatsapp`

**Response (Success):**
```json
{
  "success": true,
  "message": "Lead created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "source": "instagram",
    "location": {
      "city": "San Francisco",
      "country": "United States",
      "ipAddress": "203.0.113.42"
    },
    "messageStatus": {
      "messageSid": "SM1234567890abcdef",
      "status": "sent",
      "sentAt": "2024-04-02T10:30:00.000Z"
    },
    "status": "new",
    "createdAt": "2024-04-02T10:30:00.000Z",
    "updatedAt": "2024-04-02T10:30:00.000Z"
  }
}
```

**Response (Validation Error):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "msg": "Valid email is required",
      "param": "email"
    }
  ]
}
```

**cURL Example:**
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

---

### 📋 Get All Leads

Retrieve all leads with optional filtering and pagination.

```
GET /api/leads?page=1&limit=10&source=instagram&startDate=2024-01-01&endDate=2024-12-31
```

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | number | 1 | Page number for pagination |
| limit | number | 10 | Number of leads per page |
| source | string | - | Filter by source (instagram, facebook, whatsapp) |
| startDate | string (ISO) | - | Filter leads from this date |
| endDate | string (ISO) | - | Filter leads until this date |

**Response (Success):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "source": "instagram",
      "location": {
        "city": "San Francisco",
        "country": "United States"
      },
      "messageStatus": {
        "status": "delivered",
        "sentAt": "2024-04-02T10:30:00.000Z",
        "deliveredAt": "2024-04-02T10:31:00.000Z"
      },
      "status": "new",
      "createdAt": "2024-04-02T10:30:00.000Z"
    }
  ],
  "pagination": {
    "total": 45,
    "page": 1,
    "limit": 10,
    "pages": 5
  }
}
```

**cURL Example:**
```bash
# Get first page
curl http://localhost:5000/api/leads?page=1&limit=10

# Filter by source
curl http://localhost:5000/api/leads?source=instagram

# Filter by date range
curl "http://localhost:5000/api/leads?startDate=2024-01-01&endDate=2024-12-31"

# Combination
curl "http://localhost:5000/api/leads?page=2&limit=20&source=facebook&startDate=2024-01-01"
```

---

### 📊 Get Lead Statistics

Get statistics about leads grouped by source.

```
GET /api/leads/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 42,
    "bySource": {
      "instagram": 18,
      "facebook": 15,
      "whatsapp": 9
    }
  }
}
```

**cURL Example:**
```bash
curl http://localhost:5000/api/leads/stats
```

---

### 🔍 Get Single Lead

Retrieve a specific lead by ID.

```
GET /api/leads/:id
```

**Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Lead MongoDB ObjectId |

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "source": "instagram",
    "location": {
      "city": "San Francisco",
      "country": "United States",
      "ipAddress": "203.0.113.42"
    },
    "messageStatus": {
      "messageSid": "SM1234567890abcdef",
      "status": "delivered"
    },
    "notes": "Interested in premium plan",
    "status": "qualified",
    "createdAt": "2024-04-02T10:30:00.000Z",
    "updatedAt": "2024-04-02T11:45:00.000Z"
  }
}
```

**Response (Not Found):**
```json
{
  "success": false,
  "message": "Lead not found"
}
```

**cURL Example:**
```bash
curl http://localhost:5000/api/leads/507f1f77bcf86cd799439011
```

---

### ✏️ Update a Lead

Update lead information.

```
PUT /api/leads/:id
```

**Request Body:**
```json
{
  "status": "qualified",
  "notes": "Updated notes here"
}
```

**Updateable Fields:**
- `status`: new, contacted, qualified, lost
- `notes`: Any notes about the lead

**Response (Success):**
```json
{
  "success": true,
  "message": "Lead updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "status": "qualified",
    "notes": "Updated notes here",
    "updatedAt": "2024-04-02T12:00:00.000Z"
  }
}
```

**cURL Example:**
```bash
curl -X PUT http://localhost:5000/api/leads/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "qualified",
    "notes": "Very interested customer"
  }'
```

---

### 🗑️ Delete a Lead

Delete a lead from the database.

```
DELETE /api/leads/:id
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Lead deleted successfully"
}
```

**cURL Example:**
```bash
curl -X DELETE http://localhost:5000/api/leads/507f1f77bcf86cd799439011
```

---

### 💬 Get Message Status

Get the WhatsApp message status for a lead.

```
GET /api/leads/:id/message-status
```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "messageSid": "SM1234567890abcdef",
    "status": "delivered",
    "sentAt": "2024-04-02T10:30:00.000Z",
    "deliveredAt": "2024-04-02T10:31:00.000Z"
  }
}
```

**Message Status Values:**
- `pending`: Message is being processed
- `sent`: Message was sent to Twilio
- `delivered`: Message was delivered to recipient
- `failed`: Message delivery failed

**cURL Example:**
```bash
curl http://localhost:5000/api/leads/507f1f77bcf86cd799439011/message-status
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation Error",
  "errors": ["Invalid email format"]
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Lead not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

---

## Request/Response Examples

### JavaScript (Axios)
```javascript
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create lead
const createLead = async (leadData) => {
  try {
    const response = await axios.post(`${API_URL}/leads`, leadData);
    console.log('Lead created:', response.data.data);
  } catch (error) {
    console.error('Error:', error.response.data);
  }
};

// Get all leads
const getAllLeads = async () => {
  try {
    const response = await axios.get(`${API_URL}/leads`, {
      params: { page: 1, limit: 10, source: 'instagram' }
    });
    console.log('Leads:', response.data.data);
  } catch (error) {
    console.error('Error:', error);
  }
};

// Get stats
const getStats = async () => {
  try {
    const response = await axios.get(`${API_URL}/leads/stats`);
    console.log('Stats:', response.data.data);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### Python (Requests)
```python
import requests

API_URL = 'http://localhost:5000/api'

# Create lead
lead_data = {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "source": "instagram"
}

response = requests.post(f'{API_URL}/leads', json=lead_data)
print(response.json())

# Get all leads
response = requests.get(f'{API_URL}/leads', params={'page': 1, 'limit': 10})
print(response.json())

# Get stats
response = requests.get(f'{API_URL}/leads/stats')
print(response.json())
```

### cURL (Shell)
```bash
# Create lead
curl -X POST http://localhost:5000/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "source": "instagram"
  }'

# Get all leads
curl http://localhost:5000/api/leads?page=1&limit=10

# Get stats
curl http://localhost:5000/api/leads/stats
```

---

## Rate Limiting

Currently no rate limiting is implemented. In production, consider adding:
- Request rate limiting (e.g., using express-rate-limit)
- API key authentication
- User quotas

---

## Authentication

Currently endpoints are public. For production, consider adding:
- JWT authentication
- API key authentication
- OAuth2

---

For more information, see [README.md](README.md)
