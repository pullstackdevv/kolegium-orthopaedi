# API Documentation - Kolegium Orthopaedi

Dokumentasi lengkap API endpoints dengan contoh request/response.

## 📋 Table of Contents
- [Authentication](#authentication)
- [User Management](#user-management)
- [Role Management](#role-management)
- [Permission Management](#permission-management)
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

**Last Updated:** December 2024
