# Dokumentasi Sistem Kolegium Orthopaedi Indonesia

## 📋 Daftar Isi

1. [Pengenalan](#-pengenalan)
2. [Arsitektur Sistem](#️-arsitektur-sistem)
3. [Tech Stack](#-tech-stack)
4. [Struktur Project](#-struktur-project)
5. [Fitur-Fitur Utama](#-fitur-fitur-utama)
6. [Database Schema](#️-database-schema)
7. [RBAC & Affiliation System](#-rbac--affiliation-system)
8. [API Overview](#-api-overview)
9. [Frontend Overview](#-frontend-overview)
10. [Setup & Installation](#-setup--installation)
11. [Development Guide](#️-development-guide)
12. [Deployment & CI/CD](#-deployment--cicd)

> **Dokumen terkait:**
> - `DOKUMENTASI-API.md` — Detail lengkap semua API endpoints
> - `DOKUMENTASI-FRONTEND.md` — Detail arsitektur frontend React + Inertia.js

---

## 🎯 Pengenalan

**Kolegium Orthopaedi** adalah sistem manajemen berbasis web untuk Kolegium Orthopaedi dan Traumatologi Indonesia, dibangun dengan arsitektur **Laravel 12 + React 19 (Inertia.js)** sebagai modern monolith.

### Tujuan Aplikasi
- Portal informasi program studi orthopaedi (PPDS1, Clinical Fellowship, Subspesialis)
- Manajemen database anggota (Resident, Fellow, Trainee) per-universitas/RS
- Manajemen agenda/event akademik per-afiliasi
- Well-Being Survey untuk kesehatan mental residen
- Sistem CMS admin dengan Role-Based Access Control (RBAC) dan multi-tenant affiliation

### Target Pengguna
- **Public Users** — Akses informasi program studi, kalender akademik, peer group, well-being survey
- **Admin Kolegium** — Mengelola data & agenda tingkat kolegium
- **Admin Study Program** — Mengelola data resident/fellow/trainee & agenda per-universitas/RS
- **Admin Peer Group** — Mengelola data & agenda per-organisasi peer group
- **Super Admin** — Full control atas seluruh sistem

---

## 🏗️ Arsitektur Sistem

```
┌─────────────────────────────────────────────┐
│          User Browser (Client)               │
└───────────────────┬─────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────┐
│    Frontend Layer (React 19 + Inertia.js)   │
│    - TailwindCSS 3.4 + shadcn/ui (New York) │
│    - Vite 6.2 Build Tool                     │
│    - Radix UI primitives                     │
└───────────────────┬─────────────────────────┘
                    │ Inertia XHR / Axios API
                    ▼
┌─────────────────────────────────────────────┐
│       Backend Layer (Laravel 12)             │
│    - Inertia SSR (page rendering)            │
│    - RESTful API (Sanctum Auth)              │
│    - RBAC + Affiliation-based multi-tenancy  │
│    - Controllers & Business Logic            │
└───────────────────┬─────────────────────────┘
                    │ Eloquent ORM
                    ▼
┌─────────────────────────────────────────────┐
│     Database Layer (MariaDB)                 │
│    - 12+ tables (users, roles, permissions,  │
│      affiliations, agenda_events,            │
│      database_members, wellbeing_surveys...) │
└─────────────────────────────────────────────┘
```

### Request Flow

**Inertia Pages (Web):**
```
User Click → React Component → Inertia.visit() → Laravel Route (web.php) →
Middleware (Auth, HandleInertiaRequests) → Controller → Inertia::render() →
JSON Response → React re-renders with new props
```

**API Calls (dari CMS):**
```
React Component → Axios (api/axios.js) → Laravel Route (api.php) →
Middleware (auth:sanctum) → Controller → Model/DB →
JSON Response (ResponseFormatter) → React state update
```

### CI/CD Flow
```
Git Push → Jenkins Pipeline → SSH to VPS → git pull → composer install →
php artisan migrate → npm install → npm run build → Done
```

---

## 💻 Tech Stack

### Backend
- **PHP** 8.2+
- **Laravel** 12.x
- **Laravel Sanctum** (API token authentication via `auth:sanctum`)
- **Inertia Laravel** 2.0 (server-side adapter)
- **MariaDB** 10.x (via `DB_CONNECTION=mariadb`)

**Key Backend Dependencies:**
- `phpoffice/phpspreadsheet` — Excel import/export untuk Database Members
- `midtrans/midtrans-php` — Payment gateway (sandbox)
- `tightenco/ziggy` — Generate Laravel named routes untuk JavaScript
- Custom `ResponseFormatter` helper — Standardized API response format

### Frontend
- **React** 19.1.0
- **Inertia.js React** 2.0.13
- **Vite** 6.2.4 (dev server + build)
- **TailwindCSS** 3.4.1

**UI Libraries:**
- **shadcn/ui** (New York style, JSX) — 22 pre-built components via Radix UI
- **Radix UI** — Headless component primitives (dialog, select, tabs, etc.)
- **Flowbite React** — Additional UI components
- **Lucide React** — Icon library
- **@iconify/react** — Extended icon set
- **Framer Motion** — Animations

**Utilities:**
- `axios` — HTTP client (configured in `api/axios.js`)
- `react-hook-form` — Form management
- `sonner` — Toast notifications
- `sweetalert2` — Confirmation & alert dialogs
- `highcharts` + `highcharts-react-official` — Charts & data visualization
- `@tinymce/tinymce-react` + `tinymce` — Rich text editor (WYSIWYG)
- `ziggy-js` — Laravel named routes di JS
- `class-variance-authority` + `clsx` + `tailwind-merge` — className utility (shadcn/ui)

---

## 📁 Struktur Project

```
kolegium-orthopaedi/
├── app/
│   ├── Enums/
│   │   ├── AffiliationType.php          # kolegium|residen|clinical_fellowship|subspesialis|peer_group
│   │   └── UserRole.php                 # owner|admin|staff|warehouse
│   ├── Helpers/
│   │   └── ResponseFormatter.php        # Standardized API response (success/fail/error)
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── AffiliationController.php    # CRUD affiliations + user assignment
│   │   │   ├── AgendaEventController.php    # CRUD agenda, publish/unpublish, image upload
│   │   │   ├── AuthController.php           # Login, register, logout, me
│   │   │   ├── DashboardController.php      # Dashboard statistics & data
│   │   │   ├── DatabaseMemberController.php # CRUD members, import/export Excel, photo upload
│   │   │   ├── RoleController.php           # CRUD roles & permissions
│   │   │   ├── UserController.php           # CRUD users, toggle status, change password
│   │   │   ├── VoucherController.php        # (legacy, unused)
│   │   │   └── WellbeingSurveyController.php # Survey form, scoring, analytics
│   │   ├── Middleware/
│   │   │   ├── ApiRateLimiter.php           # Rate limiting for API endpoints
│   │   │   ├── EnsureModulePermission.php   # Permission check per CMS module
│   │   │   └── HandleInertiaRequests.php    # Shared Inertia props (auth, flash)
│   │   └── Requests/
│   │       ├── Role/{StoreRequest, UpdateRequest}.php
│   │       └── User/{StoreRequest, UpdateRequest}.php
│   ├── Models/
│   │   ├── Affiliation.php       # Organisasi/universitas/RS
│   │   ├── AgendaEvent.php       # Event/agenda akademik
│   │   ├── DatabaseMember.php    # Anggota (resident/fellow/trainee/koti/kolkes)
│   │   ├── Permission.php        # Permission (name, module)
│   │   ├── Role.php              # Role dengan permission management
│   │   ├── User.php              # User dengan HasRoles trait
│   │   ├── UserAffiliation.php   # Pivot user ↔ affiliation
│   │   └── WellbeingSurvey.php   # Survey kesehatan mental
│   ├── Providers/
│   │   ├── AppServiceProvider.php
│   │   ├── MidtransServiceProvider.php
│   │   └── RateLimiterServiceProvider.php
│   ├── Rules/
│   └── Traits/
│       ├── HasRoles.php              # RBAC trait untuk User model
│       └── HasAffiliationScope.php   # Multi-tenant filtering per affiliation
│
├── database/
│   ├── migrations/                   # 20 migration files
│   │   ├── *_create_users_table.php
│   │   ├── *_create_roles_table.php
│   │   ├── *_create_permissions_table.php
│   │   ├── *_create_user_has_roles_table.php
│   │   ├── *_create_role_has_permissions_table.php
│   │   ├── *_create_user_has_permissions_table.php
│   │   ├── *_create_sessions_table.php
│   │   ├── *_create_cache_table.php
│   │   ├── *_create_personal_access_tokens_table.php
│   │   ├── *_create_jobs_table.php
│   │   ├── *_create_agenda_events_table.php
│   │   ├── *_add_section_to_agenda_events_table.php
│   │   ├── *_add_deleted_at_to_agenda_events_table.php
│   │   ├── *_create_affiliations_table.php
│   │   ├── *_create_user_affiliations_table.php
│   │   ├── *_add_affiliation_id_to_agenda_events_table.php
│   │   ├── *_create_database_members_table.php
│   │   ├── *_update_database_members_unique_index.php
│   │   ├── *_add_since_and_logo_to_affiliations_table.php
│   │   └── *_create_wellbeing_surveys_table.php
│   └── seeders/
│       ├── DatabaseSeeder.php             # Master seeder
│       ├── RoleSeeder.php                 # 8 roles + 60+ permissions
│       ├── UserSeeder.php                 # Base users (super_admin, staff)
│       ├── AffiliationSeeder.php          # 30 affiliations
│       ├── AdminUserSeeder.php            # 30+ admin users per-affiliation
│       └── HomepageAgendaEventsSeeder.php # Sample agenda events
│
├── resources/
│   ├── css/
│   │   ├── app.css                  # Main stylesheet
│   │   ├── app-.css                 # shadcn/ui CSS variables
│   │   ├── sweetalert-fix.css       # SweetAlert2 overrides
│   │   ├── layouts/                 # Layout-specific styles
│   │   ├── override/                # Component overrides
│   │   └── theme/                   # Theme variables
│   └── js/
│       ├── api/
│       │   ├── axios.js             # Axios instance (baseURL: /api, CSRF, auth token)
│       │   ├── auth.js              # Auth API functions
│       │   ├── routes.js            # API route constants
│       │   └── index.js             # Exports
│       ├── components/
│       │   ├── ui/                  # 22 shadcn/ui components (JSX)
│       │   ├── WellbeingSurvey/     # Survey sub-components (6 files)
│       │   ├── DonutChart.jsx       # Highcharts donut chart wrapper
│       │   ├── PermissionGuard.jsx  # Conditional render by permission
│       │   ├── TiptapEditor.jsx     # TinyMCE rich text editor wrapper
│       │   ├── theme-provider.jsx   # Dark/light theme context
│       │   └── theme-toggle.jsx     # Theme switcher button
│       ├── contexts/
│       │   └── AuthContext.jsx      # Auth context (user, role, permissions, helpers)
│       ├── data/                    # Static data (legacy: productData, voucherData)
│       ├── hooks/
│       │   ├── use-mobile.jsx       # Responsive breakpoint hook
│       │   └── useCart.js           # (legacy, unused)
│       ├── lib/
│       │   └── utils.js             # cn() helper for className merging
│       ├── utils/
│       │   ├── asset.js             # Asset URL helper
│       │   ├── auth.js              # handleSessionExpired helper
│       │   ├── helpers.js           # General utility functions
│       │   ├── sweetalert.js        # SweetAlert2 presets
│       │   ├── checkoutSession.js   # (legacy, unused)
│       │   └── devtools.js          # React DevTools enabler
│       ├── Layouts/
│       │   ├── HomepageLayout.jsx   # Public website (Navbar + Footer)
│       │   ├── DashboardLayout.jsx  # Re-exports dashboard/DashboardLayout
│       │   └── dashboard/
│       │       ├── DashboardLayout.jsx   # CMS layout (SidebarProvider wrapper)
│       │       ├── components/           # Sidebar, Navbar sub-components
│       │       ├── config/               # Sidebar menu configuration
│       │       └── index.js              # Exports
│       ├── Pages/
│       │   ├── Auth/
│       │   │   ├── Login.jsx
│       │   │   └── Register.jsx
│       │   ├── Dashboard/
│       │   │   ├── index.jsx             # CMS Dashboard (stats, charts)
│       │   │   └── Calendar.jsx          # CMS Calendar view
│       │   ├── Settings/
│       │   │   ├── index.jsx             # Settings router (tabs)
│       │   │   ├── UserSettings.jsx      # User CRUD
│       │   │   ├── RoleSettings.jsx      # Role CRUD
│       │   │   ├── PermissionSettings.jsx # Permission CRUD
│       │   │   └── AffiliationSettings.jsx # Affiliation CRUD
│       │   ├── Agenda/
│       │   │   └── index.jsx             # CMS Agenda management
│       │   ├── Database/
│       │   │   ├── index.jsx             # CMS Database Members management
│       │   │   ├── DatabaseResidents.jsx  # Public: list residents
│       │   │   ├── DatabaseFellows.jsx    # Public: list fellows
│       │   │   └── DatabaseTrainees.jsx   # Public: list trainees
│       │   ├── ProfileStudyProgram/
│       │   │   ├── PPDS1.jsx                   # PPDS1 program listing
│       │   │   ├── ClinicalFellowship.jsx      # Clinical Fellowship listing
│       │   │   ├── Subspesialis.jsx             # Subspesialis listing
│       │   │   ├── StudyProgramDetail.jsx       # Detail per-universitas/RS
│       │   │   ├── ClinicalFellowshipDetail.jsx # Detail per-RS fellowship
│       │   │   └── DatabaseMembersLanding.jsx   # Members landing per-affiliation
│       │   ├── PeerGroup/
│       │   │   ├── index.jsx             # Peer group listing
│       │   │   └── PeerGroupDetail.jsx   # Detail per-peer group
│       │   ├── WellbeingSurvey/
│       │   │   ├── Index.jsx             # Survey landing/entry
│       │   │   └── Show.jsx              # Survey form & results
│       │   ├── Errors/
│       │   │   └── Forbidden.jsx         # 403 error page
│       │   ├── Homepage.jsx
│       │   ├── AboutUs.jsx
│       │   ├── CalendarAcademic.jsx
│       │   ├── Resident.jsx
│       │   ├── ComingSoon.jsx
│       │   └── NotFound.jsx
│       └── app.jsx                 # Inertia app entry point
│
├── routes/
│   ├── web.php                     # Inertia page routes (public + CMS)
│   ├── api.php                     # REST API routes (auth + protected + public)
│   └── console.php                 # Artisan commands
│
├── config/                         # Laravel config files
├── public/
│   ├── assets/                     # Static assets (icons, images)
│   ├── tinymce/                    # TinyMCE editor assets
│   └── build/                      # Vite build output
├── storage/
├── tests/
├── Jenkinsfile                     # CI/CD pipeline
├── vite.config.js                  # Vite + React + Laravel plugin
├── tailwind.config.js              # TailwindCSS + shadcn/ui theme
├── components.json                 # shadcn/ui configuration
├── package.json
└── .env.example
```

---

## 🎨 Fitur-Fitur Utama

### 1. Public Website

Semua public pages menggunakan `HomepageLayout.jsx` (Navbar + Footer).

| Page | Route | Component | Deskripsi |
|------|-------|-----------|-----------|
| Homepage | `/` | `Homepage.jsx` | Landing page utama |
| PPDS1 | `/profile-study-program/ppds1` | `PPDS1.jsx` | Daftar program studi PPDS1 |
| Clinical Fellowship | `/profile-study-program/clinical-fellowship` | `ClinicalFellowship.jsx` | Daftar program clinical fellowship |
| Subspesialis | `/profile-study-program/subspesialis` | `Subspesialis.jsx` | Daftar program subspesialis |
| Study Program Detail | `/profile-study-program/{type}/{code}` | `StudyProgramDetail.jsx` | Detail universitas (type: ppds1/subspesialis) |
| CF Detail | `/profile-study-program/clinical-fellowship/{id}` | `ClinicalFellowshipDetail.jsx` | Detail RS clinical fellowship |
| DB Members Landing | `/profile-study-program/{type}/{code}/database` | `DatabaseMembersLanding.jsx` | List members per-affiliation |
| Peer Group | `/peer-group` | `PeerGroup/index.jsx` | Daftar peer group |
| Peer Group Detail | `/peer-group/{id}` | `PeerGroupDetail.jsx` | Detail organisasi peer group |
| Resident | `/resident` | `Resident.jsx` | Informasi residen |
| Calendar | `/calendar-academic` | `CalendarAcademic.jsx` | Kalender akademik |
| About Us | `/about-us` | `AboutUs.jsx` | Tentang kolegium |
| Well-Being Survey | `/wellbeing-survey` | `WellbeingSurvey/Index.jsx` | Survey kesehatan mental |
| Survey Form | `/wellbeing-survey/show` | `WellbeingSurvey/Show.jsx` | Formulir & hasil survey |
| DB Residents | `/database-residents` | `Database/DatabaseResidents.jsx` | Public list semua residents |
| DB Fellows | `/database-fellows` | `Database/DatabaseFellows.jsx` | Public list semua fellows |
| DB Trainees | `/database-trainees` | `Database/DatabaseTrainees.jsx` | Public list semua trainees |

### 2. CMS (Admin Panel)

Semua CMS routes di bawah prefix `/cms`, protected oleh `Authenticate` middleware, menggunakan `DashboardLayout.jsx`.

#### Authentication
- **Login**: `GET /cms/login` → `Auth/Login.jsx`
- **Register**: `GET /cms/register` → `Auth/Register.jsx`
- **Login Post**: `POST /cms/login` → `AuthController@webLogin`
- **Logout**: `GET /cms/logout`

#### Dashboard & Calendar
| Feature | Route | Controller/Page |
|---------|-------|-----------------|
| Dashboard | `/cms/dashboard` | `DashboardController@index` → `Dashboard/index.jsx` |
| Calendar | `/cms/calendar` | `Dashboard/Calendar.jsx` |

#### Settings Module
| Feature | Route | API Endpoint | Page |
|---------|-------|--------------|------|
| User List | `/cms/settings/user` | `GET /api/users` | `Settings/UserSettings.jsx` |
| Create User | Modal in UserSettings | `POST /api/users` | — |
| Edit User | Modal in UserSettings | `PUT /api/users/{id}` | — |
| Delete User | Modal confirm | `DELETE /api/users/{id}` | — |
| Toggle Status | Button | `POST /api/users/{id}/toggle-status` | — |
| Change Password | Modal | `POST /api/users/{id}/change-password` | — |
| Role List | `/cms/settings/role` | `GET /api/roles` | `Settings/RoleSettings.jsx` |
| Create/Update Role | Modal | `POST/PUT /api/roles` | — |
| Permission List | `/cms/settings/permission` | `GET /api/permissions` | `Settings/PermissionSettings.jsx` |
| Affiliation List | `/cms/settings/affiliation` | `GET /api/affiliations` | `Settings/AffiliationSettings.jsx` |

#### Agenda Module
| Feature | Route | API Endpoint |
|---------|-------|--------------|
| Agenda CMS | `/cms/agenda` | `AgendaEventController@cmsPage` |
| List Events | (API) | `GET /api/agenda-events` |
| Create Event | (API) | `POST /api/agenda-events` |
| Update Event | (API) | `PUT /api/agenda-events/{id}` |
| Delete Event | (API) | `DELETE /api/agenda-events/{id}` |
| Publish/Unpublish | (API) | `POST /api/agenda-events/{id}/publish` |
| Upload Image | (API) | `POST /api/agenda-events/upload-image` |

#### Database Members Module
| Feature | Route | API Endpoint |
|---------|-------|--------------|
| Members CMS | `/cms/database` | `Database/index.jsx` |
| List Members | (API) | `GET /api/database-members` |
| Create Member | (API) | `POST /api/database-members` |
| Update Member | (API) | `PUT /api/database-members/{id}` |
| Delete Member | (API) | `DELETE /api/database-members/{id}` |
| Import Excel | (API) | `POST /api/database-members/import-excel` |
| Export Excel | (API) | `GET /api/database-members/export-excel` |
| Download Template | (API) | `GET /api/database-members/template-excel` |
| Upload Photo | (API) | `POST /api/database-members/upload-photo` |

### 3. Well-Being Survey Module

Survey kesehatan mental untuk residen, menghitung risk level berdasarkan jawaban.

**Flow:**
```
Landing Page → Verifikasi Member (search API) → Survey Form →
Hitung Score (backend) → Tampilkan Hasil + Resources
```

**Scoring Logic (WellbeingSurvey model):**
- 5 indikator boolean: burnout, emotional_hardening, depressed, sleep_issue, bullying
- Score = jumlah indikator `true` (0-5)
- Risk level:
  - `low`: score 0-1, mood bukan depressed/help_me/worry
  - `mild`: mood = worry
  - `moderate`: score 2-3
  - `high`: score 4-5, atau mood = depressed/help_me

---

## 🗄️ Database Schema

### ERD Overview

```
users ←→ user_has_roles ←→ roles ←→ role_has_permissions ←→ permissions
  │                                                              │
  └──── user_has_permissions ────────────────────────────────────┘
  │
  └──── user_affiliations ←→ affiliations
                                  │
                    ┌─────────────┼─────────────┐
                    │             │             │
              agenda_events  database_members  wellbeing_surveys
```

### Table Definitions

#### users
| Column | Type | Notes |
|--------|------|-------|
| id | BIGINT PK | Auto increment |
| name | VARCHAR(255) | |
| email | VARCHAR(255) | UNIQUE |
| password | VARCHAR(255) | Hashed (bcrypt) |
| is_active | BOOLEAN | Default: true |
| email_verified_at | TIMESTAMP | Nullable |
| remember_token | VARCHAR(100) | Nullable |
| deleted_at | TIMESTAMP | Soft delete |
| created_at, updated_at | TIMESTAMP | |

#### roles
| Column | Type | Notes |
|--------|------|-------|
| id | BIGINT PK | |
| name | VARCHAR(255) | UNIQUE (e.g. `super_admin`) |
| description | VARCHAR(255) | Human-readable label |
| is_active | BOOLEAN | Default: true |
| is_system | BOOLEAN | Default: false (cannot delete system roles) |
| created_at, updated_at | TIMESTAMP | |

#### permissions
| Column | Type | Notes |
|--------|------|-------|
| id | BIGINT PK | |
| name | VARCHAR(255) | UNIQUE (e.g. `agenda.kolegium.view`) |
| display_name | VARCHAR(255) | Human-readable |
| module | VARCHAR(100) | First segment of name |
| created_at, updated_at | TIMESTAMP | |

#### affiliations
| Column | Type | Notes |
|--------|------|-------|
| id | BIGINT PK | |
| name | VARCHAR(255) | Full name (e.g. "FK Universitas Indonesia") |
| type | VARCHAR(255) | Enum: kolegium, residen, clinical_fellowship, subspesialis, peer_group |
| code | VARCHAR(255) | UNIQUE (e.g. `FK-UI`, `IOSSA`) |
| since | VARCHAR(255) | Year established (nullable) |
| logo | VARCHAR(255) | Logo path (nullable) |
| created_at, updated_at | TIMESTAMP | |

#### agenda_events
| Column | Type | Notes |
|--------|------|-------|
| id | BIGINT PK | |
| scope | VARCHAR(255) | |
| section | VARCHAR(255) | |
| type | VARCHAR(255) | Event type |
| title | VARCHAR(255) | |
| description | TEXT | Rich text (TinyMCE) |
| location | VARCHAR(255) | |
| registration_url | VARCHAR(255) | |
| image_url | VARCHAR(255) | |
| start_date | DATE | |
| end_date | DATE | |
| is_published | BOOLEAN | |
| published_at | DATETIME | |
| created_by | BIGINT FK → users | |
| affiliation_id | BIGINT FK → affiliations | Nullable |
| deleted_at | TIMESTAMP | Soft delete |
| created_at, updated_at | TIMESTAMP | |

#### database_members
| Column | Type | Notes |
|--------|------|-------|
| id | BIGINT PK | |
| organization_type | VARCHAR(255) | resident, fellow, trainee, koti, kolkes |
| affiliation_id | BIGINT FK → affiliations | |
| member_code | VARCHAR(255) | |
| name | VARCHAR(255) | |
| position | VARCHAR(255) | |
| photo | VARCHAR(255) | Photo path |
| contact | VARCHAR(255) | |
| entry_date | DATE | |
| gender | VARCHAR(255) | |
| specialization | VARCHAR(255) | |
| status | VARCHAR(255) | active, inactive, alumni |
| specialty | VARCHAR(255) | |
| group | VARCHAR(255) | |
| title | VARCHAR(255) | |
| location | VARCHAR(255) | |
| deleted_at | TIMESTAMP | Soft delete |
| created_at, updated_at | TIMESTAMP | |

#### wellbeing_surveys
| Column | Type | Notes |
|--------|------|-------|
| id | BIGINT PK | |
| user_id | BIGINT FK → users | Nullable |
| affiliation_id | BIGINT FK → affiliations | Nullable |
| survey_type | VARCHAR(255) | |
| participant_type | VARCHAR(255) | |
| affiliation_code | VARCHAR(255) | |
| university, faculty, study_program_name | VARCHAR(255) | |
| program_type | VARCHAR(255) | |
| mood | VARCHAR(255) | happy, neutral, worry, depressed, help_me |
| burnout, emotional_hardening, depressed, sleep_issue, bullying, discomfort | BOOLEAN | |
| discomfort_note | TEXT | |
| mental_health_score | INTEGER | Calculated (0-5) |
| risk_level | VARCHAR(255) | low, mild, moderate, high |
| crisis_resources | JSON | |
| deleted_at | TIMESTAMP | Soft delete |
| created_at, updated_at | TIMESTAMP | |

#### Pivot Tables
- **user_has_roles** — `user_id` FK, `role_id` FK (UNIQUE constraint)
- **role_has_permissions** — `role_id` FK, `permission_id` FK (UNIQUE constraint)
- **user_has_permissions** — `user_id` FK, `permission_id` FK (UNIQUE constraint, direct permissions)
- **user_affiliations** — `user_id` FK, `affiliation_id` FK (UNIQUE constraint)

---

## 🔐 RBAC & Affiliation System

### 8 System Roles

| Role | Deskripsi | Permissions |
|------|-----------|-------------|
| `super_admin` | Akses penuh ke semua fitur | `*` (wildcard) |
| `admin_kolegium` | Kolegium content manager | `agenda.kolegium.*`, `database.kolegium.koti.*`, `database.kolegium.kolkes.*` |
| `admin_study_program` | Semua study program | `agenda.study_program.*`, `database.study_program.*` |
| `admin_study_program_resident` | Study Program Resident | `agenda.study_program.resident.*`, `database.study_program.resident.*` |
| `admin_study_program_fellow` | Study Program Fellow | `agenda.study_program.fellow.*`, `database.study_program.fellow.*` |
| `admin_study_program_trainee` | Study Program Trainee | `agenda.study_program.trainee.*`, `database.study_program.trainee.*` |
| `admin_peer_group` | Peer Group content | `agenda.peer_group.*`, `database.peer_group.*` |
| `staff` | View dashboard only | `dashboard.view` |

### Permission Format

Format: `{module}.{sub_module}.{action}` atau `{module}.{action}`

**Permission modules:**
- `dashboard` — view
- `users` — view, create, edit, delete
- `roles` — view, create, edit, delete
- `permissions` — view, create, edit, delete
- `agenda.kolegium` — view, create, edit, delete, publish
- `agenda.study_program.resident` — view, create, edit, delete, publish
- `agenda.study_program.fellow` — view, create, edit, delete, publish
- `agenda.study_program.trainee` — view, create, edit, delete, publish
- `agenda.peer_group` — view, create, edit, delete, publish
- `database.kolegium.koti` — view, create, edit, delete, import
- `database.kolegium.kolkes` — view, create, edit, delete, import
- `database.study_program.resident` — view, create, edit, delete, import
- `database.study_program.fellow` — view, create, edit, delete, import
- `database.study_program.trainee` — view, create, edit, delete, import
- `database.peer_group` — view, create, edit, delete, import

### Affiliation Types (5)

| Type | Jumlah | Contoh |
|------|--------|--------|
| `kolegium` | 1 | KOT (Kolegium Orthopaedi dan Traumatologi) |
| `residen` | 14 | FK-UI, FK-UNAIR, FK-UGM, FK-UNPAD, FK-UNHAS, FK-UNS, FK-UNUD, FK-USU, FK-UB, FK-UNSRI, FK-UNAND, FK-USK, FK-ULM, RSO-SOEHARSO |
| `clinical_fellowship` | 4 | RSUD-SAIFUL-ANWAR, RSUP-HASAN-SADIKIN, RSUP-SARDJITO, RSUD-MOEWARDI |
| `subspesialis` | 2 | FK-UI-TRAINEE, FK-UNAIR-TRAINEE |
| `peer_group` | 9 | IOSSA, INAMSOS, IHKS, INASES, IPOS, IOSSMA, INASHUM, INAFAS, ITOS |

### Multi-Tenant Pattern (`HasAffiliationScope` Trait)

Digunakan di model: `AgendaEvent`, `DatabaseMember`, `WellbeingSurvey`

```php
// Scope otomatis filter berdasarkan affiliation user login
AgendaEvent::forUserAffiliations()->get();

// Super admin bypass (melihat semua data)
// Non-super-admin hanya lihat data sesuai affiliation mereka

// Filter by tipe affiliation
DatabaseMember::forAffiliationType('residen')->get();

// Filter by specific affiliation
DatabaseMember::forAffiliation($affiliationId)->get();
```

### Permission Check

**Backend (PHP):**
```php
$user->hasPermission('agenda.kolegium.view');       // Check specific permission
$user->hasRole('super_admin');                       // Check role
$user->hasAnyPermission(['agenda.kolegium.view', 'agenda.peer_group.view']);
$user->getAllPermissions();                           // Get all permission names
```

**Frontend (React) — AuthContext:**
```jsx
import { useAuth } from '@/contexts/AuthContext';

function Component() {
  const { hasPermission, hasRole, isSuperAdmin } = useAuth();

  if (hasPermission('agenda.kolegium.create')) { /* ... */ }
  if (hasRole('admin_kolegium')) { /* ... */ }
}
```

**Frontend (React) — PermissionGuard component:**
```jsx
import PermissionGuard from '@/components/PermissionGuard';

<PermissionGuard permission="database.study_program.resident.edit">
  <Button>Edit Member</Button>
</PermissionGuard>

<PermissionGuard
  permission={["agenda.kolegium.view", "agenda.peer_group.view"]}
  fallback={<p>No access</p>}
>
  <AgendaList />
</PermissionGuard>
```

---

## 🔌 API Overview

> Detail lengkap semua endpoints: lihat `DOKUMENTASI-API.md`

### Base URL
```
Development: http://localhost:8000/api
Production: {APP_URL}/api
```

### Authentication
- **Sanctum token** via `auth:sanctum` middleware
- Token stored di `localStorage` (`auth_token`)
- CSRF token via `<meta name="csrf-token">`

### Response Format (ResponseFormatter)
```json
// Success
{ "status": "success", "message": "...", "data": {...}, "errors": [] }

// Fail (validation)
{ "status": "fail", "message": "...", "data": null, "errors": [{...}] }

// Error (server)
{ "status": "error", "message": "...", "data": null, "errors": [{...}] }
```

### API Endpoints Summary

| Module | Endpoints | Auth |
|--------|-----------|------|
| **Auth** | login, register, logout, me | Public (login, register) / Protected |
| **Users** | CRUD, toggle-status, change-password, role-permissions | Protected |
| **Roles** | CRUD, get permissions | Protected |
| **Permissions** | CRUD | Protected |
| **Affiliations** | CRUD, user assignment, public lookup by code | Protected / Public (lookup) |
| **Agenda Events** | CRUD, publish/unpublish, image upload | Protected |
| **Database Members** | CRUD, import/export Excel, photo upload, search | Protected / Public (search) |
| **WellBeing Survey** | Submit, get result, stats, list | Public (submit, result) / Protected (stats) |

### Public API Endpoints (no auth required)
```http
GET  /api/public/agenda-events          # Published events
GET  /api/public/affiliations           # All affiliations
GET  /api/public/database-members       # Members filtered
GET  /api/public/database-members/all   # All members
GET  /api/database-members/search       # Search members (for survey verification)
POST /api/wellbeing-surveys             # Submit survey
GET  /api/wellbeing-surveys/{id}/result # Get survey result
GET  /api/affiliations/by-code/{code}   # Lookup affiliation by code
```

---

## 🎨 Frontend Overview

> Detail lengkap: lihat `DOKUMENTASI-FRONTEND.md`

### Layouts

| Layout | File | Digunakan Oleh |
|--------|------|----------------|
| **HomepageLayout** | `Layouts/HomepageLayout.jsx` | Semua public pages |
| **DashboardLayout** | `Layouts/dashboard/DashboardLayout.jsx` | Semua CMS pages (auto-detected) |

Layout dipilih otomatis — CMS pages (prefix `/cms`) menggunakan DashboardLayout, public pages menggunakan HomepageLayout.

### shadcn/ui Components (22)

`resources/js/components/ui/` — Pre-built components: alert, avatar, badge, breadcrumb, button, card, checkbox, collapsible, dialog, dropdown-menu, input, label, scroll-area, select, separator, sheet, sidebar, skeleton, table, tabs, textarea, tooltip.

### Custom Components

| Component | File | Fungsi |
|-----------|------|--------|
| `PermissionGuard` | `PermissionGuard.jsx` | Conditional render berdasarkan permission |
| `DonutChart` | `DonutChart.jsx` | Highcharts donut chart wrapper |
| `TiptapEditor` | `TiptapEditor.jsx` | TinyMCE rich text editor |
| `theme-provider` | `theme-provider.jsx` | Dark/light mode context |
| `theme-toggle` | `theme-toggle.jsx` | Theme switcher button |
| `WellbeingSurvey/*` | `WellbeingSurvey/` | 6 sub-components untuk survey flow |

### Design System

**Colors (tailwind.config.js):**
- Primary: `#254D95` (dark blue)
- Secondary: `#34A1F4` (light blue)
- Tertiary: `#880E0D` (dark red)
- Font: Manrope (sans-serif)

---

## 🚀 Setup & Installation

### Requirements
- PHP >= 8.2
- Composer
- Node.js >= 18.x
- NPM
- MariaDB >= 10.x (atau MySQL >= 8.0)

### Installation Steps

1. **Clone Repository**
```bash
git clone https://github.com/pullstackdevv/kolegium-orthopaedi.git
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
DB_CONNECTION=mariadb
DB_HOST=127.0.0.1
DB_PORT=3308
DB_DATABASE=kolegium
DB_USERNAME=root
DB_PASSWORD=password
```

5. **Run Migrations & Seeders**
```bash
php artisan migrate
php artisan db:seed
```

**Seeder akan membuat:**
- 8 system roles dengan 60+ permissions
- 2 base users (super_admin, staff)
- 30 affiliations (universitas, RS, peer group)
- 30+ admin users (1 per affiliation)
- Sample agenda events

**Default Login Credentials:**

| Role | Email | Password |
|------|-------|----------|
| Super Admin | `admin@gmail.com` | `password` |
| Staff | `staff@gmail.com` | `password` |
| Admin Kolegium | `admin@kolegium-orthopaedi.com` | `Kolegium@2025` |
| Admin Residen UI | `residen.ui@kolegium-orthopaedi.com` | `ResidenUI@2025` |
| Admin Peer Group IOSSA | `iossa@kolegium-orthopaedi.com` | `IOSSA@2025` |

> Lihat `database/seeders/AdminUserSeeder.php` untuk daftar lengkap semua admin users.

6. **Start Development Servers**

**Option A — Separate terminals:**
```bash
# Terminal 1: Laravel
php artisan serve

# Terminal 2: Vite dev server
npm run dev
```

**Option B — Concurrently:**
```bash
npm run dev:all
```

7. **Access Application**
- Public Website: `http://localhost:8000`
- CMS Login: `http://localhost:8000/cms/login`

---

## 🛠️ Development Guide

### Folder Structure Conventions

**Backend:**
- Controllers: `app/Http/Controllers/{Name}Controller.php`
- Models: `app/Models/{Name}.php`
- Traits: `app/Traits/{Name}.php`
- Enums: `app/Enums/{Name}.php`
- Requests: `app/Http/Requests/{Module}/{Action}Request.php`
- Middleware: `app/Http/Middleware/{Name}.php`
- Migrations: `database/migrations/{timestamp}_{description}.php`

**Frontend:**
- Pages: `resources/js/Pages/{Module}/{PageName}.jsx`
- Components: `resources/js/components/{ComponentName}.jsx`
- UI Components: `resources/js/components/ui/{component-name}.jsx`
- Layouts: `resources/js/Layouts/{LayoutName}.jsx`
- API: `resources/js/api/{module}.js`
- Contexts: `resources/js/contexts/{Name}Context.jsx`
- Hooks: `resources/js/hooks/{useName}.js`
- Utils: `resources/js/utils/{name}.js`

### Adding New Page

1. **Create React Component**
```jsx
// resources/js/Pages/NewModule/NewPage.jsx
import { Head, usePage } from '@inertiajs/react'

export default function NewPage({ data }) {
  return (
    <>
      <Head title="New Page" />
      <div>{/* content */}</div>
    </>
  )
}
```

2. **Add Web Route**
```php
// routes/web.php — Public page
Route::get('/new-page', function () {
    return Inertia::render('NewModule/NewPage', ['data' => $data]);
})->name('new.page');

// Or CMS page (protected)
Route::get('/new-module', function () {
    return Inertia::render('NewModule/NewPage');
})->name('cms.new-module'); // Inside the cms middleware group
```

### Adding New API Endpoint

1. **Create Controller Method**
```php
// app/Http/Controllers/NewController.php
public function index(Request $request)
{
    $data = Model::forUserAffiliations()->paginate(15);
    return ResponseFormatter::success('Data retrieved', $data);
}
```

2. **Add API Route**
```php
// routes/api.php — Inside auth:sanctum group
Route::get('new-module', [NewController::class, 'index']);
```

3. **Call from Frontend**
```javascript
// Using the configured axios instance
import api from '@/api/axios';

const response = await api.get('/new-module');
```

### Adding New Permission

1. **Add to RoleSeeder**
```php
// database/seeders/RoleSeeder.php — Add to $permissionNames array
'new_module.view',
'new_module.create',
'new_module.edit',
'new_module.delete',
```

2. **Assign to Role(s)**
```php
// In the roles array, add to the appropriate role's permissions
[
    'name' => 'admin_kolegium',
    'permissions' => [
        // existing permissions...
        'new_module.view',
        'new_module.create',
    ],
],
```

3. **Re-run Seeder**
```bash
php artisan db:seed --class=RoleSeeder
```

4. **Check Permission in Frontend**
```jsx
<PermissionGuard permission="new_module.view">
  <NewComponent />
</PermissionGuard>
```

### Adding New Affiliation

1. **Add to AffiliationSeeder**
```php
// database/seeders/AffiliationSeeder.php
[
    'name' => 'New University',
    'type' => AffiliationType::RESIDEN->value,
    'code' => 'FK-NEW',
    'since' => '2020',
],
```

2. **Create Admin User (optional)**
```php
// database/seeders/AdminUserSeeder.php
[
    'name' => 'admin_residen_new',
    'email' => 'residen.new@kolegium-orthopaedi.com',
    'password' => Hash::make('ResidenNew@2025'),
    'is_active' => true,
    'role' => 'admin_study_program_resident',
    'affiliations' => ['FK-NEW'],
],
```

3. **Re-run Seeders**
```bash
php artisan db:seed --class=AffiliationSeeder
php artisan db:seed --class=AdminUserSeeder
```

### Adding New Model with Affiliation Scope

```php
// app/Models/NewModel.php
use App\Traits\HasAffiliationScope;
use Illuminate\Database\Eloquent\SoftDeletes;

class NewModel extends Model
{
    use SoftDeletes, HasAffiliationScope;

    protected $fillable = ['affiliation_id', /* ... */];

    public function affiliation(): BelongsTo
    {
        return $this->belongsTo(Affiliation::class);
    }
}
```

Usage in controller:
```php
// Auto-filter by user's affiliations
$data = NewModel::forUserAffiliations()->get();
```

### Environment Variables

**Key .env variables:**
```env
# App
APP_NAME="Kolegium Orthopaedi"
APP_ENV=local                    # local | production
APP_DEBUG=true                   # false in production
APP_URL=http://localhost:8000

# Database
DB_CONNECTION=mariadb
DB_HOST=127.0.0.1
DB_PORT=3308
DB_DATABASE=kolegium
DB_USERNAME=root
DB_PASSWORD=password

# Session & Cache (all use database driver)
SESSION_DRIVER=database
QUEUE_CONNECTION=database
CACHE_STORE=database

# Vite Dev Server (for remote development)
VITE_DEV_SERVER_URL=http://localhost:5173

# Payment (sandbox)
MIDTRANS_SERVER_KEY=SB-Mid-server-...
MIDTRANS_CLIENT_KEY=SB-Mid-client-...
MIDTRANS_IS_PRODUCTION=false

XENDIT_SECRET_KEY=xnd_development_...
XENDIT_PUBLIC_KEY=xnd_public_development_...
XENDIT_IS_PRODUCTION=false

# Deployment
DEPLOY_PATH=/www/wwwroot/kolegium-orthopaedi
DEPLOY_BRANCH=main
```

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/nama-fitur

# Commit dengan descriptive message
git commit -m "feat: menambahkan fitur X"

# Push dan create PR
git push origin feature/nama-fitur
```

### Build for Production

```bash
npm run build
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Testing

```bash
php artisan test
php artisan test --filter=ExampleTest
```

### Logging & Debugging

```bash
tail -f storage/logs/laravel.log
php artisan pail                    # Real-time log viewer
```

---

## 🚢 Deployment & CI/CD

### Jenkins Pipeline

Deployment otomatis via Jenkins (`Jenkinsfile`):

```
Git Push (staging branch) → Jenkins detects → SSH to VPS →
git fetch + reset --hard → composer install → php artisan migrate →
config:cache + route:cache → npm install → npm run build
```

**VPS:** `31.97.188.192`
**Default staging path:** `/www/wwwroot/kolegium-orthopaedi-staging`
**Default branch:** `staging`

### Production Deployment Checklist

- [ ] Set `APP_ENV=production`
- [ ] Set `APP_DEBUG=false`
- [ ] Configure database production credentials
- [ ] Run `npm run build`
- [ ] Run `php artisan migrate --force`
- [ ] Run `php artisan config:cache`
- [ ] Run `php artisan route:cache`
- [ ] Run `php artisan view:cache`
- [ ] Set proper file permissions (storage, bootstrap/cache writable)
- [ ] Configure web server (Nginx/Apache)
- [ ] Setup SSL certificate (HTTPS)
- [ ] Configure queue workers if needed
- [ ] Enable logging & monitoring

---

## 📞 Support & Resources

### Documentation Links
- [Laravel 12 Documentation](https://laravel.com/docs)
- [React 19 Documentation](https://react.dev)
- [Inertia.js Documentation](https://inertiajs.com)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Radix UI Documentation](https://www.radix-ui.com)
- [Laravel Sanctum](https://laravel.com/docs/sanctum)

### Project Maintenance
```bash
php artisan --version          # Check Laravel version
composer show                  # List PHP dependencies
npm list --depth=0             # List JS dependencies
composer update                # Update PHP packages
npm update                     # Update JS packages
```

---

**Last Updated:** February 2026
**Version:** 2.0.0
