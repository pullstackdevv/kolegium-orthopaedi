# API Documentation - Kolegium Orthopaedi

Dokumentasi lengkap API endpoints dengan contoh request/response.

## 📋 Table of Contents
- [Authentication](#authentication)
- [User Management](#user-management)
- [Role Management](#role-management)
- [Permission Management](#permission-management)
- [Affiliation Management](#affiliation-management)
- [Agenda Events](#agenda-events)
- [Database Members](#database-members)
- [Well-Being Survey](#well-being-survey)
- [Public API Endpoints](#public-api-endpoints)
- [Error Handling](#error-handling)

---

## Base Configuration

### API Base URL
```
Development: http://localhost:8000/api
Production: https://your-domain.com/api
```

### Standard Headers
```http
Accept: application/json
Content-Type: application/json
Authorization: Bearer {token}  # untuk protected endpoints
```

### Response Format
Semua response menggunakan format konsisten:

**Success Response:**
```json
{
  "success": true,
  "message": "Success message",
  "data": { /* response data */ }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error message",
  "errors": { /* validation errors jika ada */ }
}
```

---

## Authentication

### 1. Login

Authenticate user dan mendapatkan access token.

**Endpoint:** `POST /api/auth/login`

**Request:**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@gmail.com",
  "password": "password"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "name": "Admin User",
      "email": "admin@gmail.com",
      "is_active": true,
      "email_verified_at": null,
      "created_at": "2024-01-01T00:00:00.000000Z",
      "updated_at": "2024-01-01T00:00:00.000000Z",
      "role": {
        "id": 1,
        "name": "admin",
        "description": "Super Administrator"
      },
      "permissions": ["*"]
    },
    "token": "1|laravel_sanctum_abcd1234567890..."
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

**Error Response (422):**
```json
{
  "success": false,
  "message": "Validation error",
  "errors": {
    "email": ["The email field is required."],
    "password": ["The password field is required."]
  }
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "email": "admin@gmail.com",
    "password": "password"
  }'
```

**JavaScript/Axios Example:**
```javascript
import axios from 'axios'

const login = async (email, password) => {
  try {
    const response = await axios.post('/api/auth/login', {
      email,
      password
    })
    
    const { token, user } = response.data.data
    
    // Save token ke localStorage
    localStorage.setItem('auth_token', token)
    localStorage.setItem('user', JSON.stringify(user))
    
    return response.data
  } catch (error) {
    console.error('Login error:', error.response.data)
    throw error
  }
}
```

---

### 2. Register

Register user baru.

**Endpoint:** `POST /api/auth/register`

**Rate Limit:** 5 requests per minute

**Request:**
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123"
}
```

**Validation Rules:**
- `name`: required, string, max:255
- `email`: required, email, unique:users
- `password`: required, string, min:8, confirmed

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 2,
      "name": "John Doe",
      "email": "john@example.com",
      "is_active": true,
      "created_at": "2024-01-01T00:00:00.000000Z",
      "updated_at": "2024-01-01T00:00:00.000000Z",
      "role": null,
      "permissions": []
    },
    "token": "2|laravel_sanctum_xyz789..."
  }
}
```

**Error Response (422):**
```json
{
  "success": false,
  "message": "Validation error",
  "errors": {
    "email": ["The email has already been taken."],
    "password": ["The password confirmation does not match."]
  }
}
```

**Error Response (429):**
```json
{
  "success": false,
  "message": "Too many registration attempts. Please try again later."
}
```

---

### 3. Logout

Revoke current access token.

**Endpoint:** `POST /api/auth/logout`

**Headers Required:**
```http
Authorization: Bearer {token}
```

**Request:**
```http
POST /api/auth/logout
Authorization: Bearer 1|laravel_sanctum_token...
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**JavaScript Example:**
```javascript
const logout = async () => {
  const token = localStorage.getItem('auth_token')
  
  try {
    await axios.post('/api/auth/logout', {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    // Clear localStorage
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
    
  } catch (error) {
    console.error('Logout error:', error)
  }
}
```

---

### 4. Get Current User

Get authenticated user information.

**Endpoint:** `GET /api/auth/me`

**Headers Required:**
```http
Authorization: Bearer {token}
```

**Request:**
```http
GET /api/auth/me
Authorization: Bearer 1|laravel_sanctum_token...
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@gmail.com",
    "is_active": true,
    "email_verified_at": null,
    "created_at": "2024-01-01T00:00:00.000000Z",
    "updated_at": "2024-01-01T00:00:00.000000Z",
    "role": {
      "id": 1,
      "name": "admin",
      "description": "Super Administrator"
    },
    "permissions": ["*"]
  }
}
```

---

## User Management

**All endpoints require authentication token.**

### 1. Get All Users

List semua users dengan pagination dan search.

**Endpoint:** `GET /api/users`

**Query Parameters:**
- `page` (optional): Page number, default: 1
- `per_page` (optional): Items per page, default: 15
- `search` (optional): Search by name or email

**Request:**
```http
GET /api/users?page=1&per_page=10&search=john
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": 1,
        "name": "Admin User",
        "email": "admin@gmail.com",
        "is_active": true,
        "email_verified_at": null,
        "created_at": "2024-01-01T00:00:00.000000Z",
        "updated_at": "2024-01-01T00:00:00.000000Z",
        "role": {
          "id": 1,
          "name": "admin",
          "description": "Super Administrator"
        },
        "permissions": ["*"]
      },
      {
        "id": 2,
        "name": "Staff User",
        "email": "staff@gmail.com",
        "is_active": true,
        "email_verified_at": null,
        "created_at": "2024-01-01T00:00:00.000000Z",
        "updated_at": "2024-01-01T00:00:00.000000Z",
        "role": {
          "id": 2,
          "name": "staff",
          "description": "Staff"
        },
        "permissions": ["dashboard.view", "users.view"]
      }
    ],
    "first_page_url": "http://localhost:8000/api/users?page=1",
    "from": 1,
    "last_page": 5,
    "last_page_url": "http://localhost:8000/api/users?page=5",
    "next_page_url": "http://localhost:8000/api/users?page=2",
    "path": "http://localhost:8000/api/users",
    "per_page": 10,
    "prev_page_url": null,
    "to": 10,
    "total": 50
  }
}
```

**JavaScript Example:**
```javascript
const getUsers = async (page = 1, perPage = 15, search = '') => {
  const response = await axios.get('/api/users', {
    params: { page, per_page: perPage, search },
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
    }
  })
  return response.data.data
}
```

---

### 2. Get User by ID

Get detail user spesifik.

**Endpoint:** `GET /api/users/{id}`

**Request:**
```http
GET /api/users/1
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@gmail.com",
    "is_active": true,
    "email_verified_at": null,
    "created_at": "2024-01-01T00:00:00.000000Z",
    "updated_at": "2024-01-01T00:00:00.000000Z",
    "role": {
      "id": 1,
      "name": "admin",
      "description": "Super Administrator"
    },
    "permissions": ["*"]
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "User not found"
}
```

---

### 3. Create User

Create user baru.

**Endpoint:** `POST /api/users`

**Request:**
```http
POST /api/users
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "password123",
  "password_confirmation": "password123",
  "role_id": 2,
  "is_active": true
}
```

**Validation Rules:**
- `name`: required, string, max:255
- `email`: required, email, unique:users
- `password`: required, string, min:8, confirmed
- `role_id`: required, exists:roles,id
- `is_active`: boolean, default: true

**Success Response (201):**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": 3,
    "name": "Jane Doe",
    "email": "jane@example.com",
    "is_active": true,
    "created_at": "2024-01-01T00:00:00.000000Z",
    "updated_at": "2024-01-01T00:00:00.000000Z",
    "role": {
      "id": 2,
      "name": "staff",
      "description": "Staff"
    },
    "permissions": ["dashboard.view"]
  }
}
```

**Error Response (422):**
```json
{
  "success": false,
  "message": "Validation error",
  "errors": {
    "email": ["The email has already been taken."],
    "password": ["The password must be at least 8 characters."],
    "role_id": ["The selected role id is invalid."]
  }
}
```

---

### 4. Update User

Update user yang sudah ada.

**Endpoint:** `PUT /api/users/{id}`

**Request:**
```http
PUT /api/users/3
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Jane Smith",
  "email": "jane.smith@example.com",
  "role_id": 2,
  "is_active": true,
  "password": "newpassword123",
  "password_confirmation": "newpassword123"
}
```

**Validation Rules:**
- `name`: required, string, max:255
- `email`: required, email, unique:users,email,{id}
- `role_id`: required, exists:roles,id
- `is_active`: boolean
- `password`: nullable, string, min:8, confirmed (optional)

**Success Response (200):**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": 3,
    "name": "Jane Smith",
    "email": "jane.smith@example.com",
    "is_active": true,
    "created_at": "2024-01-01T00:00:00.000000Z",
    "updated_at": "2024-01-02T00:00:00.000000Z",
    "role": {
      "id": 2,
      "name": "staff",
      "description": "Staff"
    }
  }
}
```

---

### 5. Delete User

Soft delete user.

**Endpoint:** `DELETE /api/users/{id}`

**Request:**
```http
DELETE /api/users/3
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "User not found"
}
```

**Note:** User tidak benar-benar dihapus dari database, hanya di-mark `deleted_at`.

---

### 6. Toggle User Status

Activate atau deactivate user.

**Endpoint:** `POST /api/users/{id}/toggle-status`

**Request:**
```http
POST /api/users/3/toggle-status
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "User status updated successfully",
  "data": {
    "id": 3,
    "is_active": false
  }
}
```

---

### 7. Change User Password

Change password untuk user spesifik (admin action).

**Endpoint:** `POST /api/users/{id}/change-password`

**Request:**
```http
POST /api/users/3/change-password
Authorization: Bearer {token}
Content-Type: application/json

{
  "password": "newpassword123",
  "password_confirmation": "newpassword123"
}
```

**Validation Rules:**
- `password`: required, string, min:8, confirmed

**Success Response (200):**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

### 8. Get Role Permissions

Get list roles dengan permissions mereka.

**Endpoint:** `GET /api/users/role-permissions`

**Request:**
```http
GET /api/users/role-permissions
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "admin",
      "description": "Super Administrator",
      "is_active": true,
      "permissions": [
        {
          "id": 1,
          "name": "*",
          "display_name": "All Permissions",
          "module": null
        }
      ]
    },
    {
      "id": 2,
      "name": "staff",
      "description": "Staff",
      "is_active": true,
      "permissions": [
        {
          "id": 2,
          "name": "dashboard.view",
          "display_name": "View Dashboard",
          "module": "dashboard"
        },
        {
          "id": 3,
          "name": "users.view",
          "display_name": "View Users",
          "module": "users"
        }
      ]
    }
  ]
}
```

---

## Role Management

### 1. Get All Roles

List semua roles dengan users count dan permissions.

**Endpoint:** `GET /api/roles`

**Request:**
```http
GET /api/roles
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "admin",
      "description": "Super Administrator",
      "is_active": true,
      "is_system": true,
      "users_count": 5,
      "created_at": "2024-01-01T00:00:00.000000Z",
      "updated_at": "2024-01-01T00:00:00.000000Z",
      "permissions": [
        {
          "id": 1,
          "name": "*",
          "display_name": "All Permissions",
          "module": null
        }
      ]
    },
    {
      "id": 2,
      "name": "staff",
      "description": "Staff",
      "is_active": true,
      "is_system": false,
      "users_count": 10,
      "created_at": "2024-01-01T00:00:00.000000Z",
      "updated_at": "2024-01-01T00:00:00.000000Z",
      "permissions": [
        {
          "id": 2,
          "name": "dashboard.view",
          "display_name": "View Dashboard",
          "module": "dashboard"
        }
      ]
    }
  ]
}
```

---

### 2. Get All Permissions

List semua available permissions.

**Endpoint:** `GET /api/roles/permissions`

**Request:**
```http
GET /api/roles/permissions
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "*",
      "display_name": "All Permissions",
      "module": null
    },
    {
      "id": 2,
      "name": "dashboard.view",
      "display_name": "View Dashboard",
      "module": "dashboard"
    },
    {
      "id": 3,
      "name": "users.view",
      "display_name": "View Users",
      "module": "users"
    },
    {
      "id": 4,
      "name": "users.create",
      "display_name": "Create Users",
      "module": "users"
    }
  ]
}
```

---

### 3. Create Role

Create role baru dengan permissions.

**Endpoint:** `POST /api/roles`

**Request:**
```http
POST /api/roles
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "manager",
  "description": "Manager",
  "is_active": true,
  "permissions": [2, 3, 4]
}
```

**Validation Rules:**
- `name`: required, string, unique:roles, alpha_dash, max:255
- `description`: required, string, max:255
- `is_active`: boolean, default: true
- `permissions`: array (optional)

**Success Response (201):**
```json
{
  "success": true,
  "message": "Role created successfully",
  "data": {
    "id": 3,
    "name": "manager",
    "description": "Manager",
    "is_active": true,
    "is_system": false,
    "created_at": "2024-01-01T00:00:00.000000Z",
    "updated_at": "2024-01-01T00:00:00.000000Z",
    "permissions": [
      {
        "id": 2,
        "name": "dashboard.view",
        "display_name": "View Dashboard",
        "module": "dashboard"
      },
      {
        "id": 3,
        "name": "users.view",
        "display_name": "View Users",
        "module": "users"
      }
    ]
  }
}
```

---

### 4. Update Role

Update role dan permissions.

**Endpoint:** `PUT /api/roles/{roleName}`

**Note:** Parameter adalah `name` (string), bukan `id`.

**Request:**
```http
PUT /api/roles/manager
Authorization: Bearer {token}
Content-Type: application/json

{
  "description": "Updated Manager Role",
  "is_active": true,
  "permissions": [2, 3, 4, 5]
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Role updated successfully",
  "data": {
    "id": 3,
    "name": "manager",
    "description": "Updated Manager Role",
    "is_active": true,
    "is_system": false,
    "updated_at": "2024-01-02T00:00:00.000000Z"
  }
}
```

**Error Response (403):**
```json
{
  "success": false,
  "message": "Cannot modify system role"
}
```

---

### 5. Delete Role

Delete role (tidak bisa delete system role).

**Endpoint:** `DELETE /api/roles/{id}`

**Request:**
```http
DELETE /api/roles/3
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Role deleted successfully"
}
```

**Error Response (403):**
```json
{
  "success": false,
  "message": "Cannot delete system role"
}
```

**Error Response (409):**
```json
{
  "success": false,
  "message": "Cannot delete role with active users"
}
```

---

## Permission Management

### 1. Get All Permissions

List semua permissions grouped by module.

**Endpoint:** `GET /api/permissions`

**Request:**
```http
GET /api/permissions
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "*",
      "display_name": "All Permissions",
      "module": null,
      "created_at": "2024-01-01T00:00:00.000000Z",
      "updated_at": "2024-01-01T00:00:00.000000Z"
    },
    {
      "id": 2,
      "name": "dashboard.view",
      "display_name": "View Dashboard",
      "module": "dashboard",
      "created_at": "2024-01-01T00:00:00.000000Z",
      "updated_at": "2024-01-01T00:00:00.000000Z"
    },
    {
      "id": 3,
      "name": "users.view",
      "display_name": "View Users",
      "module": "users",
      "created_at": "2024-01-01T00:00:00.000000Z",
      "updated_at": "2024-01-01T00:00:00.000000Z"
    }
  ]
}
```

---

### 2. Create Permission

Create permission baru.

**Endpoint:** `POST /api/permissions`

**Request:**
```http
POST /api/permissions
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "reports.view",
  "display_name": "View Reports",
  "module": "reports"
}
```

**Validation Rules:**
- `name`: required, string, unique:permissions, format: `module.action`
- `display_name`: required, string, max:255
- `module`: nullable, string, max:100

**Success Response (201):**
```json
{
  "success": true,
  "message": "Permission created successfully",
  "data": {
    "id": 10,
    "name": "reports.view",
    "display_name": "View Reports",
    "module": "reports",
    "created_at": "2024-01-01T00:00:00.000000Z",
    "updated_at": "2024-01-01T00:00:00.000000Z"
  }
}
```

---

### 3. Update Permission

Update permission details.

**Endpoint:** `PUT /api/permissions/{id}`

**Request:**
```http
PUT /api/permissions/10
Authorization: Bearer {token}
Content-Type: application/json

{
  "display_name": "View All Reports",
  "module": "reports"
}
```

**Note:** Field `name` tidak bisa diubah.

**Success Response (200):**
```json
{
  "success": true,
  "message": "Permission updated successfully",
  "data": {
    "id": 10,
    "name": "reports.view",
    "display_name": "View All Reports",
    "module": "reports",
    "updated_at": "2024-01-02T00:00:00.000000Z"
  }
}
```

---

### 4. Delete Permission

Delete permission.

**Endpoint:** `DELETE /api/permissions/{id}`

**Request:**
```http
DELETE /api/permissions/10
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Permission deleted successfully"
}
```

**Error Response (409):**
```json
{
  "success": false,
  "message": "Cannot delete permission that is currently in use"
}
```

---

## Error Handling

### Standard Error Codes

| Status Code | Description |
|-------------|-------------|
| 400 | Bad Request - Invalid request format |
| 401 | Unauthorized - Invalid or missing token |
| 403 | Forbidden - No permission |
| 404 | Not Found - Resource doesn't exist |
| 422 | Unprocessable Entity - Validation error |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |

### Error Response Examples

**400 Bad Request:**
```json
{
  "success": false,
  "message": "Invalid request format"
}
```

**401 Unauthorized:**
```json
{
  "success": false,
  "message": "Unauthenticated. Please login."
}
```

**403 Forbidden:**
```json
{
  "success": false,
  "message": "You do not have permission to perform this action"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "message": "Resource not found"
}
```

**422 Validation Error:**
```json
{
  "success": false,
  "message": "The given data was invalid",
  "errors": {
    "email": [
      "The email field is required.",
      "The email must be a valid email address."
    ],
    "password": [
      "The password must be at least 8 characters."
    ]
  }
}
```

**429 Rate Limit:**
```json
{
  "success": false,
  "message": "Too many requests. Please try again in 60 seconds."
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "message": "Internal server error. Please contact administrator."
}
```

### JavaScript Error Handling Example

```javascript
import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
})

// Request interceptor - add token
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      const { status, data } = error.response
      
      switch (status) {
        case 401:
          // Redirect to login
          localStorage.removeItem('auth_token')
          window.location.href = '/cms/login'
          break
          
        case 403:
          alert('You do not have permission')
          break
          
        case 422:
          // Handle validation errors
          console.error('Validation errors:', data.errors)
          break
          
        case 429:
          alert('Too many requests. Please wait.')
          break
          
        case 500:
          alert('Server error. Please try again later.')
          break
      }
    }
    
    return Promise.reject(error)
  }
)

export default apiClient
```

---

## Rate Limiting

Beberapa endpoints memiliki rate limiting:

| Endpoint | Limit |
|----------|-------|
| `POST /api/auth/register` | 5 requests per minute |
| `POST /api/auth/login` | 10 requests per minute |
| Other API endpoints | 60 requests per minute |

**Rate Limit Headers:**
```http
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 59
Retry-After: 60
```

---

## Affiliation Management

### List Affiliations (Protected)

```http
GET /api/affiliations
Authorization: Bearer {token}
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| search | string | No | Search by name or code |
| type | string | No | Filter by type: `kolegium`, `residen`, `clinical_fellowship`, `subspesialis`, `peer_group` |
| sort_by | string | No | Column to sort by |
| sort_direction | string | No | `asc` or `desc` (default: `asc`) |

**Required Permission:** `users.view`

**Response 200:**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "name": "Kolegium Orthopaedi dan Traumatologi",
      "code": "KOT",
      "type": "kolegium",
      "since": "1999",
      "logo": "/storage/affiliations/logos/kot.png",
      "users_count": 5,
      "created_at": "2025-01-01T00:00:00.000000Z"
    }
  ]
}
```

### Show Affiliation (Protected)

```http
GET /api/affiliations/{id}
Authorization: Bearer {token}
```

**Required Permission:** `users.view`

### Create Affiliation (Protected)

```http
POST /api/affiliations
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Body:**
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| name | string | Yes | max:255 |
| type | string | Yes | Enum: `kolegium`, `residen`, `clinical_fellowship`, `subspesialis`, `peer_group` |
| code | string | Yes | max:50, unique |
| since | string | No | max:4 (year) |
| logo | file | No | image, max:2MB, jpeg/png/jpg/gif/svg |

**Required Permission:** `users.create`

### Update Affiliation (Protected)

```http
PUT /api/affiliations/{id}
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

Same fields as Create, all `sometimes` required.

**Required Permission:** `users.edit`

### Delete Affiliation (Protected)

```http
DELETE /api/affiliations/{id}
Authorization: Bearer {token}
```

**Required Permission:** `users.delete`

> **Note:** Cannot delete affiliations that have users assigned.

### Get User Affiliations (Protected)

```http
GET /api/affiliations/user/{user_id}
Authorization: Bearer {token}
```

**Required Permission:** `users.view`

### Assign User Affiliations (Protected)

```http
POST /api/affiliations/user/{user_id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "affiliation_ids": [1, 5, 12]
}
```

**Required Permission:** `users.edit`

> Replaces all existing affiliations with provided list (sync).

### Get Affiliation by Code (Public)

```http
GET /api/affiliations/by-code/{code}
```

No authentication required. Returns single affiliation matching the code.

---

## Agenda Events

### List Events (Protected/CMS)

```http
GET /api/agenda-events
Authorization: Bearer {token}
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| scope | string | No | `kolegium`, `study_program`, `peer_group` |
| section | string | Conditional | Required if scope=`study_program`: `resident`, `fellow`, `trainee` |
| type | string | No | Event type filter |
| from | date | No | Start date filter (YYYY-MM-DD) |
| to | date | No | End date filter (YYYY-MM-DD) |
| per_page | int | No | Default: 10 |

**Permission:** Based on scope — e.g. `agenda.kolegium.view`, `agenda.study_program.resident.view`

**Response 200:**
```json
{
  "status": "success",
  "data": {
    "data": [
      {
        "id": 1,
        "scope": "kolegium",
        "section": null,
        "type": "ujian_nasional",
        "title": "Ujian Board Nasional 2025",
        "description": "<p>Rich text content...</p>",
        "location": "Jakarta",
        "registration_url": "https://...",
        "image_url": "https://...",
        "start_date": "2025-03-15",
        "end_date": "2025-03-16",
        "is_published": true,
        "published_at": "2025-02-01 10:00:00",
        "created_by": 1,
        "affiliation_id": 1
      }
    ],
    "current_page": 1,
    "last_page": 5,
    "per_page": 10,
    "total": 48
  }
}
```

### Create Event (Protected)

```http
POST /api/agenda-events
Authorization: Bearer {token}
Content-Type: application/json

{
  "scope": "kolegium",
  "section": null,
  "type": "ujian_nasional",
  "title": "Ujian Board Nasional 2025",
  "description": "<p>Deskripsi event...</p>",
  "location": "Jakarta Convention Center",
  "registration_url": "https://register.example.com",
  "image_url": "/storage/agenda-events/image.jpg",
  "start_date": "2025-03-15",
  "end_date": "2025-03-16",
  "is_published": false,
  "affiliation_id": 1
}
```

**Validation:**
| Field | Type | Required | Rules |
|-------|------|----------|-------|
| scope | string | Yes | `kolegium`, `study_program`, `peer_group` |
| section | string | Conditional | Required if scope=`study_program`: `resident`, `fellow`, `trainee` |
| type | string | Yes | See event types below |
| title | string | Yes | max:255 |
| description | string | No | Rich text |
| location | string | No | max:255 |
| registration_url | string | No | max:500 |
| image_url | string | No | max:500 |
| start_date | date | Yes | |
| end_date | date | No | Must be >= start_date |
| is_published | boolean | No | |
| affiliation_id | int | No | Must exist in affiliations. Auto-assigned for non-super-admin. |

**Event Types:**
- `ujian_lokal` — Ujian Lokal
- `ujian_nasional` — Ujian Nasional
- `event_lokal` — Event Lokal
- `event_nasional` — Event Nasional
- `event_peer_group` — Event Peer Group International (peer_group scope only)
- `event_peer_group_nasional` — Event Peer Group National (peer_group scope only)

**Permission:** `agenda.{scope}.create` or `agenda.{scope}.{section}.create`

### Update Event (Protected)

```http
PUT /api/agenda-events/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Updated Title",
  "description": "Updated description",
  "start_date": "2025-04-01"
}
```

Same fields as Create, all `sometimes` required. Scope and section cannot be changed.

**Permission:** `agenda.{scope}.edit` or `agenda.{scope}.{section}.edit`

### Delete Event (Protected)

```http
DELETE /api/agenda-events/{id}
Authorization: Bearer {token}
```

Soft deletes the event.

**Permission:** `agenda.{scope}.delete` or `agenda.{scope}.{section}.delete`

### Publish Event (Protected)

```http
POST /api/agenda-events/{id}/publish
Authorization: Bearer {token}
```

Sets `is_published=true` and `published_at=now()`.

**Permission:** `agenda.{scope}.publish`

### Unpublish Event (Protected)

```http
POST /api/agenda-events/{id}/unpublish
Authorization: Bearer {token}
```

Sets `is_published=false` and `published_at=null`.

**Permission:** `agenda.{scope}.publish`

### Upload Event Image (Protected)

```http
POST /api/agenda-events/upload-image
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Body:**
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| scope | string | Yes | `kolegium`, `study_program`, `peer_group` |
| section | string | Conditional | Required if scope=`study_program` |
| image | file | Yes | image, max:5MB |

**Response 200:**
```json
{
  "status": "success",
  "message": "Image uploaded successfully",
  "data": {
    "path": "agenda-events/abc123.jpg",
    "url": "https://domain.com/storage/agenda-events/abc123.jpg"
  }
}
```

### Upload Image for Existing Event (Protected)

```http
POST /api/agenda-events/{id}/upload-image
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Body:** `image` (file, required, max:5MB)

Also updates the event's `image_url` field automatically.

---

## Database Members

### List Members (Protected/CMS)

```http
GET /api/database-members
Authorization: Bearer {token}
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| organization_type | string | Yes | `koti`, `kolkes`, `resident`, `fellow`, `trainee`, `peer_group` |
| affiliation_id | int | No | Filter by affiliation (required for non-super-admin without affiliations) |
| per_page | int | No | Default: 10, max: 100 |

**Permission:** Based on org type — e.g. `database.kolegium.koti.view`, `database.study_program.resident.view`

> Data automatically filtered by user's affiliations for non-super-admin users.

**Response 200:**
```json
{
  "status": "success",
  "data": {
    "data": [
      {
        "id": 1,
        "organization_type": "resident",
        "affiliation_id": 2,
        "member_code": "RES-001",
        "name": "Dr. John Doe",
        "position": "",
        "photo": "https://...",
        "contact": "+62812...",
        "entry_date": "2023-07-01",
        "gender": "male",
        "specialization": "Orthopaedic Spine",
        "status": "active",
        "title": "dr., Sp.OT",
        "affiliation": {
          "id": 2,
          "name": "FK Universitas Indonesia",
          "code": "FK-UI"
        }
      }
    ],
    "current_page": 1,
    "last_page": 3,
    "per_page": 10,
    "total": 25
  }
}
```

### Create Member (Protected)

```http
POST /api/database-members
Authorization: Bearer {token}
Content-Type: application/json

{
  "organization_type": "resident",
  "affiliation_id": 2,
  "member_code": "RES-002",
  "name": "Dr. Jane Smith",
  "gender": "female",
  "entry_date": "2024-01-15",
  "specialization": "Orthopaedic Spine",
  "status": "active"
}
```

**Validation:**
| Field | Type | Required | Rules |
|-------|------|----------|-------|
| organization_type | string | Yes | `koti`, `kolkes`, `resident`, `fellow`, `trainee`, `peer_group` |
| affiliation_id | int | No | Auto-assigned for non-super-admin |
| member_code | string | Yes | max:255, unique per org_type+affiliation |
| name | string | Yes | max:255 |
| position | string | No | max:255 |
| photo | string | No | URL/path, max:1000 |
| contact | string | No | max:255 |
| entry_date | date | No | |
| gender | string | No | `male` or `female` |
| specialization | string | No | Must be from predefined list (see below) |
| status | string | No | `active`, `graduated`, `leave` (default: `active`) |
| specialty | string | No | max:255 |
| group | string | No | max:255 |
| title | string | No | max:255 |
| location | string | No | max:255 |

**Specialization Options:**
- Hip and Knee (Adult Reconstruction, Trauma, and Sports)
- Orthopaedic Sports Injury
- Advanced Orthopaedic Trauma
- Shoulder and Elbow
- Foot and Ankle
- Pediatric Orthopaedic
- Orthopaedic Oncology
- Hand, Upper Limb and Microsurgery
- Orthopaedic Spine

**Permission:** `database.{mapped_module}.create` (e.g. `database.study_program.resident.create`)

### Update Member (Protected)

```http
PUT /api/database-members/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Dr. Jane Smith Updated",
  "status": "graduated"
}
```

Same fields as Create (except `organization_type`), all `sometimes` required.

**Permission:** `database.{mapped_module}.edit`

### Delete Member (Protected)

```http
DELETE /api/database-members/{id}
Authorization: Bearer {token}
```

Soft deletes the member.

**Permission:** `database.{mapped_module}.delete`

### Upload Photo (Protected)

```http
POST /api/database-members/upload-photo
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Body:**
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| organization_type | string | Yes | Valid org type |
| image | file | Yes | image, max:5MB |

**Response 200:**
```json
{
  "status": "success",
  "data": {
    "path": "database-members/abc123.jpg",
    "url": "https://domain.com/storage/database-members/abc123.jpg"
  }
}
```

### Upload Photo for Existing Member (Protected)

```http
POST /api/database-members/{id}/upload-photo
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Body:** `image` (file, required, max:5MB)

Also updates the member's `photo` field automatically.

### Export Excel (Protected)

```http
GET /api/database-members/export-excel
Authorization: Bearer {token}
```

**Query Parameters:**
| Parameter | Type | Required |
|-----------|------|----------|
| organization_type | string | Yes |
| affiliation_id | int | No |

Returns `.xlsx` file download. Columns vary by org type (peer_group has fewer columns).

**Permission:** `database.{mapped_module}.view`

### Download Template Excel (Protected)

```http
GET /api/database-members/template-excel
Authorization: Bearer {token}
```

**Query Parameters:**
| Parameter | Type | Required |
|-----------|------|----------|
| organization_type | string | Yes |
| affiliation_id | int | No |

Returns empty `.xlsx` template with correct headers for import.

**Permission:** `database.{mapped_module}.import`

### Import Excel (Protected)

```http
POST /api/database-members/import-excel
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Body:**
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| organization_type | string | Yes | Valid org type |
| affiliation_id | int | No | Auto-assigned for non-super-admin |
| file | file | Yes | `.xlsx` or `.xls` |

**Import Behavior:**
- Required columns: `member_code`, `name`
- Supports Indonesian header aliases (e.g. "Nomor Identitas" → `member_code`, "Nama" → `name`)
- Gender values auto-mapped: `Laki-laki`/`Pria`/`M` → `male`, `Perempuan`/`Wanita`/`F` → `female`
- Status values auto-mapped: `Aktif` → `active`, `Lulus` → `graduated`, `Cuti` → `leave`
- Upsert logic: updates existing records if `org_type + affiliation_id + member_code + name` match
- Returns row-level errors if validation fails

**Response 200:**
```json
{
  "status": "success",
  "message": "Import completed successfully.",
  "data": { "processed": 25 }
}
```

**Response 422 (validation errors):**
```json
{
  "status": "error",
  "message": "Validation failed.",
  "errors": [
    { "row": 3, "column": "member_code", "message": "member_code is required." },
    { "row": 7, "column": "gender", "message": "gender must be male or female." }
  ]
}
```

### Get Affiliations for Database (Protected)

```http
GET /api/database-members/affiliations
Authorization: Bearer {token}
```

**Query Parameters:**
| Parameter | Type | Required |
|-----------|------|----------|
| type | string | No | Filter by affiliation type |

Returns affiliations filtered by user's database permissions.

### Search Members (Public)

```http
GET /api/database-members/search
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| search_type | string | Yes | `member_code`, `nama`, or `contact` |
| search_value | string | Yes | Search value, max:255 |
| affiliation_id | int | No | Filter by affiliation |

Used by Well-Being Survey to verify member identity before survey submission.

**Response 200:**
```json
{
  "status": "success",
  "data": {
    "id": 42,
    "member_code": "RES-001",
    "name": "Dr. John Doe",
    "contact": "+62812...",
    "affiliation_id": 2
  }
}
```

**Response 404:**
```json
{
  "status": "error",
  "message": "Member not found",
  "data": null
}
```

---

## Well-Being Survey

### Submit Survey (Public)

```http
POST /api/wellbeing-surveys
Content-Type: application/json

{
  "affiliation_id": 2,
  "affiliation_code": "FK-UI",
  "participant_type": "resident",
  "university": "Universitas Indonesia",
  "faculty": "FK",
  "study_program_name": "Orthopaedi dan Traumatologi",
  "program_type": "residen",
  "mood": "worry",
  "burnout": true,
  "emotional_hardening": false,
  "depressed": false,
  "sleep_issue": true,
  "bullying": false,
  "discomfort": true,
  "discomfort_note": "Feeling overwhelmed with workload"
}
```

No authentication required.

**Validation:**
| Field | Type | Required | Rules |
|-------|------|----------|-------|
| affiliation_id | int | Yes | Must exist in affiliations |
| affiliation_code | string | No | |
| participant_type | string | No | |
| university | string | No | |
| faculty | string | No | |
| study_program_name | string | No | |
| program_type | string | No | |
| mood | string | Yes | `happy`, `normal`, `worry`, `depressed`, `help_me` |
| burnout | boolean | Yes | |
| emotional_hardening | boolean | Yes | |
| depressed | boolean | Yes | |
| sleep_issue | boolean | Yes | |
| bullying | boolean | Yes | |
| discomfort | boolean | Yes | |
| discomfort_note | string | No | max:1000 |

**Backend Processing:**
1. Calculate `mental_health_score` (0-5): count of `true` values from burnout, emotional_hardening, depressed, sleep_issue, bullying
2. Calculate `risk_level`:
   - `low` — score 0-1, mood not depressed/help_me/worry
   - `mild` — mood = worry
   - `moderate` — score 2-3
   - `high` — score 4-5, or mood = depressed/help_me
3. Auto-generate `crisis_resources` based on affiliation

**Response 201:**
```json
{
  "status": "success",
  "message": "Survey submitted successfully.",
  "data": {
    "id": 15,
    "risk_level": "moderate",
    "mental_health_score": 2,
    "affirmation_message": "Your feelings are valid. Consider talking to someone you trust."
  }
}
```

### Get Survey Result (Public)

```http
GET /api/wellbeing-surveys/{id}/result
```

No authentication required.

**Response 200:**
```json
{
  "status": "success",
  "data": {
    "id": 15,
    "risk_level": "moderate",
    "mental_health_score": 2,
    "affirmation_message": "Your feelings are valid...",
    "mood": "worry",
    "discomfort": true,
    "discomfort_note": "Feeling overwhelmed with workload",
    "created_at": "2025-02-01T10:30:00.000000Z"
  }
}
```

### Get Survey Statistics (Protected)

```http
GET /api/wellbeing-surveys/stats
Authorization: Bearer {token}
```

**Query Parameters:**
| Parameter | Type | Required |
|-----------|------|----------|
| affiliation_id | int | No |

**Response 200:**
```json
{
  "status": "success",
  "data": {
    "total_surveys": 150,
    "risk_distribution": {
      "low": 80,
      "mild": 35,
      "moderate": 25,
      "high": 10
    },
    "mood_distribution": {
      "happy": 60,
      "normal": 45,
      "worry": 30,
      "depressed": 10,
      "help_me": 5
    },
    "discomfort_percentage": 42.5
  }
}
```

### List Surveys (Protected)

```http
GET /api/wellbeing-surveys
Authorization: Bearer {token}
```

**Query Parameters:**
| Parameter | Type | Required | Default |
|-----------|------|----------|---------|
| affiliation_id | int | No | |
| risk_level | string | No | |
| page | int | No | 1 |
| per_page | int | No | 15 |

**Response 200:**
```json
{
  "status": "success",
  "data": [ /* array of survey objects */ ],
  "pagination": {
    "total": 150,
    "per_page": 15,
    "current_page": 1,
    "last_page": 10
  }
}
```

---

## Public API Endpoints

Endpoints yang tidak memerlukan authentication.

### Public Agenda Events

```http
GET /api/public/agenda-events
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| affiliation_id | int | Filter by affiliation |
| scope | string | `kolegium`, `study_program`, `peer_group` |
| section | string | `resident`, `fellow`, `trainee` |
| type | string | Event type |
| from | date | Start date filter |
| to | date | End date filter |

Only returns events with `is_published=true`.

### Public Affiliations

```http
GET /api/public/affiliations
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| type | string | Filter by affiliation type |

### Public Database Members (per-affiliation)

```http
GET /api/public/database-members
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| organization_type | string | Yes | `koti`, `kolkes`, `resident`, `fellow`, `trainee`, `peer_group` |
| affiliation_id | int | Yes | Affiliation ID |
| per_page | int | No | Default: 10 |
| page | int | No | Default: 1 |
| status | string | No | `active`, `graduated`, `leave` |
| search | string | No | Search by name or member_code |

**Response includes `stats` object:**
```json
{
  "stats": {
    "total": 100,
    "active": 75,
    "graduated": 20,
    "leave": 5
  }
}
```

### Public Database Members (all residents/fellows/trainees)

```http
GET /api/public/database-members/all
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| per_page | int | Default: 12 |
| page | int | Default: 1 |
| status | string | `active`, `graduated`, `leave` |
| search | string | Search by name or member_code |
| organization_type | string | `resident`, `fellow`, `trainee` |
| affiliation_id | int | Filter by affiliation |

**Response includes extended `stats`:**
```json
{
  "stats": {
    "total": 500,
    "active": 350,
    "graduated": 120,
    "leave": 30,
    "resident": 300,
    "fellow": 150,
    "trainee": 50
  }
}
```

---

## Testing with Postman

### Environment Variables
```json
{
  "api_url": "http://localhost:8000/api",
  "auth_token": ""
}
```

### Pre-request Script (for authenticated endpoints)
```javascript
pm.request.headers.add({
  key: 'Authorization',
  value: 'Bearer ' + pm.environment.get('auth_token')
})
```

### Test Script (save token after login)
```javascript
if (pm.response.code === 200) {
  const response = pm.response.json()
  if (response.data && response.data.token) {
    pm.environment.set('auth_token', response.data.token)
  }
}
```

---

**Last Updated:** February 2026
**Version:** 2.0.0
