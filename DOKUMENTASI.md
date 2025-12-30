# Dokumentasi Sistem Kolegium Orthopaedi Indonesia

## 📋 Daftar Isi

1. [Pengenalan](#pengenalan)
2. [Arsitektur Sistem](#arsitektur-sistem)
3. [Tech Stack](#tech-stack)
4. [Struktur Project](#struktur-project)
5. [Fitur-Fitur Utama](#fitur-fitur-utama)
6. [Database Schema](#database-schema)
7. [API Documentation](#api-documentation)
8. [Frontend Components](#frontend-components)
9. [Setup & Installation](#setup--installation)
10. [Development Guide](#development-guide)

---

## 🎯 Pengenalan

**Kolegium Orthopaedi** adalah sistem manajemen berbasis web untuk Kolegium Orthopaedi Indonesia yang dibangun dengan Laravel 12 + React 19 (Inertia.js).

### Tujuan Aplikasi
- Portal informasi program studi orthopaedi (PPDS1, Clinical Fellowship, Subspesialis)
- Manajemen konten akademik dan kalender
- Informasi untuk residen dan peer group
- Sistem manajemen admin dengan role-based access control (RBAC)

### Target Pengguna
- **Public Users**: Akses informasi program studi, kalender akademik, konten publik
- **Admin/Staff**: Mengelola konten, user, dan pengaturan sistem
- **Super Admin**: Full control atas sistem

---

## 🏗️ Arsitektur Sistem

```
┌─────────────────────────────────────────┐
│         User Browser (Client)            │
└───────────────────┬─────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│   Frontend Layer (React 19 + Inertia)   │
│   - TailwindCSS + shadcn/ui              │
│   - Vite Build Tool                      │
└───────────────────┬─────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│      Backend Layer (Laravel 12)          │
│   - RESTful API (Sanctum Auth)           │
│   - Controllers & Business Logic         │
└───────────────────┬─────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│    Database Layer (MySQL/MariaDB)        │
│   - Eloquent ORM                         │
└─────────────────────────────────────────┘
```

**Request Flow:**
```
User Action → React Component → Inertia → Laravel Route → 
Middleware → Controller → Model → Database → Response → 
Inertia Render → React Update
```

---

## 💻 Tech Stack

### Backend
- **PHP** 8.2+
- **Laravel** 12.x
- **Laravel Sanctum** 4.1 (API Authentication)
- **Inertia Laravel** 2.0
- **MySQL/MariaDB** 8.0+/10.x

**Key Dependencies:**
- `barryvdh/laravel-dompdf` - PDF generation
- `midtrans/midtrans-php` - Payment gateway
- `phpoffice/phpspreadsheet` - Excel operations
- `tightenco/ziggy` - Route helper untuk JS

### Frontend
- **React** 19.1.0
- **Inertia.js** 2.0.13
- **Vite** 6.2.4
- **TailwindCSS** 3.4.1
- **TypeScript** support

**UI Libraries:**
- **Radix UI** - Headless component primitives
- **shadcn/ui** - Pre-built components
- **Flowbite React** - Additional UI components
- **Lucide React** - Icons
- **Framer Motion** - Animations

**Utilities:**
- `axios` - HTTP client
- `react-hook-form` - Form management
- `sonner` - Toast notifications
- `sweetalert2` - Alert dialogs
- `highcharts` - Charts
- `@tinymce/tinymce-react` - Rich text editor
- `ziggy-js` - Laravel routes di JS

---

## 📁 Struktur Project

```
kolegium-orthopaedi/
├── app/
│   ├── Enums/UserRole.php
│   ├── Helpers/ResponseFormatter.php
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── AuthController.php
│   │   │   ├── UserController.php
│   │   │   ├── RoleController.php
│   │   │   └── VoucherController.php
│   │   ├── Middleware/
│   │   │   ├── ApiRateLimiter.php
│   │   │   ├── EnsureModulePermission.php
│   │   │   └── HandleInertiaRequests.php
│   │   ├── Requests/
│   │   │   ├── Role/{StoreRequest, UpdateRequest}.php
│   │   │   └── User/{StoreRequest, UpdateRequest}.php
│   │   └── Resources/
│   ├── Models/
│   │   ├── User.php
│   │   ├── Role.php
│   │   └── Permission.php
│   ├── Providers/
│   ├── Rules/
│   └── Traits/HasRoles.php
│
├── database/
│   ├── migrations/
│   │   ├── *_create_users_table.php
│   │   ├── *_create_roles_table.php
│   │   ├── *_create_permissions_table.php
│   │   ├── *_create_user_has_roles_table.php
│   │   ├── *_create_role_has_permissions_table.php
│   │   └── *_create_user_has_permissions_table.php
│   └── seeders/
│       ├── DatabaseSeeder.php
│       ├── RoleSeeder.php
│       └── UserSeeder.php
│
├── resources/
│   ├── css/app.css
│   └── js/
│       ├── api/
│       │   ├── auth.js
│       │   ├── axios.js
│       │   └── routes.js
│       ├── components/
│       │   ├── ui/ (22 shadcn components)
│       │   ├── DonutChart.jsx
│       │   ├── PermissionGuard.jsx
│       │   ├── TiptapEditor.jsx
│       │   ├── theme-provider.jsx
│       │   └── theme-toggle.jsx
│       ├── Layouts/
│       │   ├── HomepageLayout.jsx
│       │   ├── DashboardLayout.jsx
│       │   └── dashboard/
│       ├── Pages/
│       │   ├── Auth/{Login, Register}.jsx
│       │   ├── ProfileStudyProgram/
│       │   │   ├── PPDS1.jsx
│       │   │   ├── ClinicalFellowship.jsx
│       │   │   ├── Subspesialis.jsx
│       │   │   └── UniversityDetail.jsx
│       │   ├── Settings/
│       │   │   ├── index.jsx
│       │   │   ├── UserSettings.jsx
│       │   │   ├── RoleSettings.jsx
│       │   │   └── PermissionSettings.jsx
│       │   ├── Homepage.jsx
│       │   ├── AboutUs.jsx
│       │   ├── CalendarAcademic.jsx
│       │   ├── PeerGroup.jsx
│       │   ├── Resident.jsx
│       │   └── NotFound.jsx
│       ├── utils/
│       └── app.jsx
│
├── routes/
│   ├── web.php (Inertia routes)
│   ├── api.php (REST API routes)
│   └── console.php
│
├── config/
├── public/
├── storage/
├── tests/
├── .env & .env.example
├── composer.json
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

---

## 🎨 Fitur-Fitur Utama

### 1. Public Website

| Page | Route | Component | Deskripsi |
|------|-------|-----------|-----------|
| Homepage | `/` | `Homepage.jsx` | Landing page |
| PPDS1 | `/profile-study-program/ppds1` | `PPDS1.jsx` | Program PPDS1 |
| Clinical Fellowship | `/profile-study-program/clinical-fellowship` | `ClinicalFellowship.jsx` | Program fellowship |
| Subspesialis | `/profile-study-program/subspesialis` | `Subspesialis.jsx` | Program subspesialis |
| University Detail | `/profile-study-program/{type}/{id}` | `UniversityDetail.jsx` | Detail universitas |
| Peer Group | `/peer-group` | `PeerGroup.jsx` | List peer group |
| Peer Group Detail | `/peer-group/{id}` | `PeerGroupDetail.jsx` | Detail peer group |
| Resident | `/resident` | `Resident.jsx` | Info residen |
| Calendar | `/calendar-academic` | `CalendarAcademic.jsx` | Kalender akademik |
| About | `/about-us` | `AboutUs.jsx` | Tentang kolegium |

**Layout:** Semua public pages menggunakan `HomepageLayout.jsx`

### 2. CMS (Admin Panel)

#### Authentication
- **Login**: `/cms/login` → `Auth/Login.jsx`
- **Register**: `/cms/register` → `Auth/Register.jsx` (optional)
- **Logout**: `/cms/logout`

#### Dashboard
- **Main**: `/cms/dashboard` → redirect ke User Settings
- **Layout**: Menggunakan `DashboardLayout.jsx` dengan sidebar

#### User Management
| Feature | Route | API Endpoint |
|---------|-------|--------------|
| User List | `/cms/settings/user` | `GET /api/users` |
| Create User | `/cms/settings/users/create` | `POST /api/users` |
| Edit User | `/cms/settings/users/{id}/edit` | `PUT /api/users/{id}` |
| Delete User | - | `DELETE /api/users/{id}` |
| Toggle Status | - | `POST /api/users/{id}/toggle-status` |
| Change Password | - | `POST /api/users/{id}/change-password` |

#### Role Management
| Feature | Route | API Endpoint |
|---------|-------|--------------|
| Role List | `/cms/settings/role` | `GET /api/roles` |
| Create Role | - | `POST /api/roles` |
| Update Role | - | `PUT /api/roles/{name}` |
| Delete Role | - | `DELETE /api/roles/{id}` |
| Get Permissions | - | `GET /api/roles/permissions` |

#### Permission Management
| Feature | Route | API Endpoint |
|---------|-------|--------------|
| Permission List | `/cms/settings/permission` | `GET /api/permissions` |
| Create Permission | - | `POST /api/permissions` |
| Update Permission | - | `PUT /api/permissions/{id}` |
| Delete Permission | - | `DELETE /api/permissions/{id}` |

### 3. Role-Based Access Control (RBAC)

**Default Roles:**
- **Super Admin** (`admin`): Permission `*` (all access), system role
- **Staff** (`staff`): Custom permissions

**Permission Format:** `{module}.{action}`
- Examples: `users.view`, `users.create`, `users.edit`, `users.delete`
- Wildcards: `*` (all), `users.*` (all user permissions)

**Permission Check:**
```php
// Backend (Laravel)
$user->hasPermission('users.edit');
$user->hasRole('admin');

// Frontend (React)
<PermissionGuard permission="users.edit">
  <Button>Edit</Button>
</PermissionGuard>
```

---

## 🗄️ Database Schema

### Core Tables

#### users
```sql
CREATE TABLE users (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    email_verified_at TIMESTAMP NULL,
    remember_token VARCHAR(100) NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL
);
```

#### roles
```sql
CREATE TABLE roles (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) UNIQUE NOT NULL,
    description VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    is_system BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);
```

#### permissions
```sql
CREATE TABLE permissions (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) UNIQUE NOT NULL,
    display_name VARCHAR(255) NOT NULL,
    module VARCHAR(100) NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);
```

#### Pivot Tables
- **user_has_roles**: `user_id`, `role_id`
- **role_has_permissions**: `role_id`, `permission_id`
- **user_has_permissions**: `user_id`, `permission_id`

### ERD Relationship
```
users ←→ user_has_roles ←→ roles
  ↓                           ↓
user_has_permissions   role_has_permissions
  ↓                           ↓
  └─────→ permissions ←───────┘
```

---

## 🔌 API Documentation

### Base URL
```
Development: http://localhost:8000/api
Production: {APP_URL}/api
```

### Authentication
**Headers Required:**
```
Accept: application/json
Content-Type: application/json
Authorization: Bearer {token}  // untuk protected endpoints
```

### Auth Endpoints

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@gmail.com",
  "password": "password"
}

Response 200:
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { "id": 1, "name": "Admin", "email": "...", "role": {...} },
    "token": "1|abc123..."
  }
}
```

#### Register
```http
POST /api/auth/register
Rate Limit: 5 requests/minute

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123"
}
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer {token}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer {token}
```

### User Endpoints (Protected)

```http
GET    /api/users                        # List users (paginated)
GET    /api/users/{id}                   # Get user detail
POST   /api/users                        # Create user
PUT    /api/users/{id}                   # Update user
DELETE /api/users/{id}                   # Delete user
POST   /api/users/{id}/toggle-status     # Toggle active status
POST   /api/users/{id}/change-password   # Change password
GET    /api/users/role-permissions       # Get roles with permissions
```

### Role Endpoints (Protected)

```http
GET    /api/roles                    # List all roles
POST   /api/roles                    # Create role
PUT    /api/roles/{name}             # Update role
DELETE /api/roles/{id}               # Delete role
GET    /api/roles/permissions        # Get all permissions
```

### Permission Endpoints (Protected)

```http
GET    /api/permissions              # List permissions
POST   /api/permissions              # Create permission
PUT    /api/permissions/{id}         # Update permission
DELETE /api/permissions/{id}         # Delete permission
```

### Error Responses

```json
// 400 Bad Request
{
  "success": false,
  "message": "Validation error",
  "errors": { "email": ["The email field is required."] }
}

// 401 Unauthorized
{ "success": false, "message": "Unauthenticated" }

// 403 Forbidden
{ "success": false, "message": "You do not have permission" }

// 404 Not Found
{ "success": false, "message": "Resource not found" }

// 429 Too Many Requests
{ "success": false, "message": "Too many requests" }
```

---

## 🎨 Frontend Components

### Layouts

**HomepageLayout** (`/resources/js/Layouts/HomepageLayout.jsx`)
- Public website layout
- Navbar + Footer
- No auth required

**DashboardLayout** (`/resources/js/Layouts/DashboardLayout.jsx`)
- CMS/Admin layout
- Sidebar + Navbar + Footer
- Auth required

### UI Components (`/resources/js/components/ui/`)

22 shadcn/ui components berbasis Radix UI + TailwindCSS:

| Component | File | Deskripsi |
|-----------|------|-----------|
| Button | `button.jsx` | Tombol dengan variants |
| Input | `input.jsx` | Input field |
| Label | `label.jsx` | Form label |
| Textarea | `textarea.jsx` | Text area |
| Select | `select.jsx` | Dropdown select |
| Checkbox | `checkbox.jsx` | Checkbox |
| Dialog | `dialog.jsx` | Modal dialog |
| Sheet | `sheet.jsx` | Side panel |
| Tooltip | `tooltip.jsx` | Tooltip |
| Dropdown Menu | `dropdown-menu.jsx` | Dropdown menu |
| Tabs | `tabs.jsx` | Tab navigation |
| Breadcrumb | `breadcrumb.jsx` | Breadcrumb navigation |
| Sidebar | `sidebar.jsx` | Collapsible sidebar |
| Card | `card.jsx` | Content card |
| Alert | `alert.jsx` | Alert message |
| Badge | `badge.jsx` | Status badge |
| Avatar | `avatar.jsx` | User avatar |
| Skeleton | `skeleton.jsx` | Loading skeleton |
| Table | `table.jsx` | Data table |
| Scroll Area | `scroll-area.jsx` | Custom scrollbar |
| Separator | `separator.jsx` | Divider |
| Collapsible | `collapsible.jsx` | Collapsible section |

### Custom Components

**PermissionGuard** (`PermissionGuard.jsx`)
```jsx
<PermissionGuard permission="users.edit">
  <Button>Edit User</Button>
</PermissionGuard>
```

**TiptapEditor** (`TiptapEditor.jsx`)
```jsx
<TiptapEditor
  value={content}
  onChange={setContent}
  height={400}
/>
```

**DonutChart** (`DonutChart.jsx`)
```jsx
<DonutChart
  data={[{ name: 'A', y: 30 }, { name: 'B', y: 70 }]}
  title="Chart"
/>
```

**Theme Toggle** (`theme-toggle.jsx`)
- Dark/Light mode switcher
- Persisted in localStorage

---

## 🚀 Setup & Installation

### Requirements
- PHP >= 8.2
- Composer
- Node.js >= 18.x
- NPM or Yarn
- MySQL >= 8.0 atau MariaDB >= 10.x

### Installation Steps

1. **Clone Repository**
```bash
git clone <repository-url>
cd kolegium-orthopaedi
```

2. **Install Dependencies**
```bash
composer install
npm install
```

3. **Environment Setup**
```bash
cp .env.example .env
php artisan key:generate
```

4. **Configure Database (.env)**
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=kolegium
DB_USERNAME=root
DB_PASSWORD=
```

5. **Run Migrations & Seeders**
```bash
php artisan migrate
php artisan db:seed
```

**Default Credentials:**
- Super Admin: `admin@gmail.com` / `password`
- Staff: `staff@gmail.com` / `password`

6. **Start Development Servers**

**Option A - Separate terminals:**
```bash
# Terminal 1
php artisan serve

# Terminal 2
npm run dev
```

**Option B - Concurrently:**
```bash
composer dev
```

7. **Access Application**
- Frontend: `http://localhost:8000`
- CMS Login: `http://localhost:8000/cms/login`

---

## 🛠️ Development Guide

### Folder Structure Conventions

**Backend:**
- Controllers: `app/Http/Controllers/{Name}Controller.php`
- Models: `app/Models/{Name}.php`
- Requests: `app/Http/Requests/{Module}/{Action}Request.php`
- Middleware: `app/Http/Middleware/{Name}.php`

**Frontend:**
- Pages: `resources/js/Pages/{PageName}.jsx`
- Components: `resources/js/components/{ComponentName}.jsx`
- Layouts: `resources/js/Layouts/{LayoutName}.jsx`
- API: `resources/js/api/{module}.js`

### Code Style

**Backend (PHP):**
```bash
# Format code dengan Laravel Pint
php artisan pint

# Run tests
php artisan test
```

**Frontend (JavaScript/React):**
- Use functional components + hooks
- Follow React best practices
- Use TailwindCSS untuk styling
- Gunakan TypeScript types jika ada

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/nama-fitur

# Commit dengan descriptive message
git commit -m "feat: menambahkan fitur X"

# Push dan create PR
git push origin feature/nama-fitur
```

### Adding New Permission

1. **Backend - Create Permission**
```php
// database/seeders/PermissionSeeder.php
Permission::create([
    'name' => 'reports.view',
    'display_name' => 'View Reports',
    'module' => 'reports'
]);
```

2. **Assign to Role**
```php
$role = Role::where('name', 'staff')->first();
$role->givePermissionTo('reports.view');
```

3. **Frontend - Check Permission**
```jsx
<PermissionGuard permission="reports.view">
  <ReportComponent />
</PermissionGuard>
```

### Adding New Page

1. **Create React Component**
```jsx
// resources/js/Pages/NewPage.jsx
import { Head } from '@inertiajs/react'

export default function NewPage() {
  return (
    <>
      <Head title="New Page" />
      <div>New Page Content</div>
    </>
  )
}
```

2. **Add Route**
```php
// routes/web.php
Route::get('/new-page', function () {
    return Inertia::render('NewPage');
})->name('new.page');
```

### API Client Example

```javascript
// resources/js/api/users.js
import axios from './axios'

export const getUsers = (params) => {
  return axios.get('/users', { params })
}

export const createUser = (data) => {
  return axios.post('/users', data)
}

export const updateUser = (id, data) => {
  return axios.put(`/users/${id}`, data)
}
```

### Environment Variables

**Important .env variables:**
```env
APP_NAME="Kolegium Orthopaedi"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_DATABASE=kolegium

SESSION_DRIVER=database
QUEUE_CONNECTION=database
CACHE_STORE=database

MIDTRANS_SERVER_KEY=
MIDTRANS_CLIENT_KEY=
MIDTRANS_IS_PRODUCTION=false
```

### Build for Production

```bash
# Build frontend assets
npm run build

# Optimize Laravel
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Set .env to production
APP_ENV=production
APP_DEBUG=false
```

### Testing

```bash
# Run PHP tests
php artisan test

# Run specific test
php artisan test --filter=UserTest

# With coverage
php artisan test --coverage
```

### Logging & Debugging

**View Logs:**
```bash
# Real-time log viewing
php artisan pail

# Or check file
tail -f storage/logs/laravel.log
```

**Debug Tools:**
- Laravel Debugbar (dev only)
- React DevTools (browser extension)
- Inertia DevTools (browser extension)

### Queue & Jobs

```bash
# Run queue worker
php artisan queue:work

# Process specific queue
php artisan queue:work --queue=high,default

# Run single job
php artisan queue:work --once
```

### Maintenance Mode

```bash
# Enable maintenance
php artisan down

# With secret bypass
php artisan down --secret="my-secret"
# Access: /my-secret

# Disable maintenance
php artisan up
```

---

## 📝 Additional Notes

### Security Best Practices
1. Jangan commit `.env` file
2. Gunakan HTTPS di production
3. Enable CSRF protection
4. Sanitize user input
5. Use prepared statements (Eloquent ORM)
6. Rate limit API endpoints
7. Validate all form inputs
8. Hash passwords dengan bcrypt

### Performance Optimization
1. Use Laravel caching
2. Optimize database queries (N+1 problem)
3. Use eager loading
4. Enable asset minification
5. Use CDN untuk static assets
6. Enable gzip compression
7. Optimize images

### Deployment Checklist
- [ ] Set `APP_ENV=production`
- [ ] Set `APP_DEBUG=false`
- [ ] Configure database production
- [ ] Run `npm run build`
- [ ] Run `php artisan config:cache`
- [ ] Run `php artisan route:cache`
- [ ] Run `php artisan view:cache`
- [ ] Set proper file permissions
- [ ] Configure web server (Nginx/Apache)
- [ ] Setup SSL certificate
- [ ] Configure queue workers
- [ ] Setup scheduled tasks (cron)
- [ ] Enable logging & monitoring

---

## 📞 Support & Resources

### Documentation Links
- [Laravel Documentation](https://laravel.com/docs)
- [React Documentation](https://react.dev)
- [Inertia.js Documentation](https://inertiajs.com)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)

### Project Maintenance
- Check Laravel version: `php artisan --version`
- Check dependencies: `composer show` & `npm list`
- Update dependencies: `composer update` & `npm update`

---

## 📄 License

MIT License

---

**Last Updated:** December 2024  
**Version:** 1.0.0
