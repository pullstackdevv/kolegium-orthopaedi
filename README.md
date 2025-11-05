# Kolegium Orthopaedi - Management System

> Sistem Manajemen Kolegium Orthopaedi Indonesia

## Tentang Project

Kolegium Orthopaedi adalah aplikasi manajemen berbasis web yang dibangun dengan Laravel dan React (Inertia.js). Sistem ini fokus pada:

- **Authentication & Authorization** - Sistem login, register, dan permission management
- **User Management** - Manajemen pengguna dengan role-based access control
- **Role Management** - Konfigurasi role dan permissions
- **CMS (Content Management System)** - Dashboard admin untuk mengelola konten

## Tech Stack

### Backend
- Laravel 12.x
- PHP 8.2+
- Laravel Sanctum (API Authentication)
- MySQL/PostgreSQL

### Frontend
- React 19.x
- Inertia.js 2.x
- TailwindCSS 3.4
- Flowbite React
- Vite 6.x

## Fitur Utama

### 1. Authentication System
- Login & Register
- Token-based authentication (Sanctum)
- Password management
- Session management

### 2. User Management
- CRUD operations untuk users
- Toggle user status (active/inactive)
- Change password functionality
- User profile management

### 3. Role & Permission Management
- Role-based access control (RBAC)
- Permission assignment per role
- Dynamic permission checking
- Module-based permissions

### 4. CMS Dashboard
- Admin dashboard
- User settings interface
- Role settings interface
- Responsive design

## Installation

### Requirements
- PHP >= 8.2
- Composer
- Node.js >= 18.x
- NPM or Yarn
- MySQL >= 8.0 or PostgreSQL >= 13

### Steps

1. Clone repository
```bash
git clone <repository-url>
cd kolegium-orthopaedi
```

2. Install PHP dependencies
```bash
composer install
```

3. Install Node dependencies
```bash
npm install
```

4. Setup environment
```bash
cp .env.example .env
php artisan key:generate
```

5. Configure database di `.env`
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=kolegium
DB_USERNAME=root
DB_PASSWORD=
```

6. Run migrations
```bash
php artisan migrate
```

7. Seed database (optional)
```bash
php artisan db:seed
```

8. Start development servers
```bash
# Terminal 1 - Laravel
php artisan serve

# Terminal 2 - Vite
npm run dev

# Atau gunakan concurrently
composer dev
```

9. Akses aplikasi
```
http://localhost:8000
```

## Project Structure

```
kolegium-orthopaedi/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── AuthController.php
│   │   │   ├── UserController.php
│   │   │   └── RoleController.php
│   │   └── Middleware/
│   └── Models/
│       ├── User.php
│       └── Role.php
├── resources/
│   └── js/
│       ├── Pages/
│       │   ├── Auth/
│       │   │   ├── Login.jsx
│       │   │   └── Register.jsx
│       │   └── Settings/
│       │       ├── UserSettings.jsx
│       │       ├── RoleSettings.jsx
│       │       └── AddEditUser.jsx
│       └── Layouts/
├── routes/
│   ├── api.php
│   └── web.php
└── database/
    └── migrations/
```

## API Endpoints

### Authentication
```
POST   /api/auth/login       - Login user
POST   /api/auth/register    - Register new user
POST   /api/auth/logout      - Logout user
GET    /api/auth/me          - Get authenticated user
```

### Users (Protected)
```
GET    /api/users                        - List all users
POST   /api/users                        - Create new user
GET    /api/users/{id}                   - Get user details
PUT    /api/users/{id}                   - Update user
DELETE /api/users/{id}                   - Delete user
POST   /api/users/{id}/toggle-status     - Toggle user status
POST   /api/users/{id}/change-password   - Change user password
```

### Roles (Protected)
```
GET    /api/roles                    - List all roles
GET    /api/roles/permissions        - Get all permissions
PUT    /api/roles/{name}             - Update role permissions
```

## Cleanup Notes

Project ini telah dibersihkan dari modul-modul yang tidak diperlukan:

### ✅ Dihapus:
- Order Management
- Product Management
- Customer Management
- Inventory/Stock Management
- Expense Management
- Voucher Management
- Payment Gateway Integration
- Shipping/Courier Management
- Marketplace/E-commerce features
- Reporting/Analytics

### ✅ Dipertahankan:
- Authentication & Authorization
- User Management
- Role Management
- CMS Dashboard
- Settings Interface

## Development

### Running Tests
```bash
php artisan test
```

### Code Style
```bash
php artisan pint
```

### Build for Production
```bash
npm run build
```

## License

MIT License
