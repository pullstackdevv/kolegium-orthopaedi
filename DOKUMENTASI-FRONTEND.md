# Frontend Documentation - Kolegium Orthopaedi

Dokumentasi lengkap untuk frontend React + Inertia.js application.

## 📋 Table of Contents
- [Struktur Frontend](#struktur-frontend)
- [Inertia.js Flow](#inertiajs-flow)
- [React Components](#react-components)
- [Styling dengan TailwindCSS](#styling-dengan-tailwindcss)
- [State Management](#state-management)
- [Form Handling](#form-handling)
- [Routing](#routing)
- [Best Practices](#best-practices)

---

## Struktur Frontend

```
resources/js/
├── api/                      # API client functions
│   ├── axios.js             # Axios configuration
│   ├── auth.js              # Authentication API
│   ├── routes.js            # Route definitions
│   └── index.js             # API exports
│
├── components/              # Reusable components
│   ├── ui/                  # shadcn/ui components (22 files)
│   ├── DonutChart.jsx       # Chart component
│   ├── PermissionGuard.jsx  # Permission HOC
│   ├── TiptapEditor.jsx     # Rich text editor
│   ├── theme-provider.jsx   # Theme context
│   └── theme-toggle.jsx     # Dark mode toggle
│
├── Layouts/                 # Layout components
│   ├── HomepageLayout.jsx   # Public layout
│   ├── DashboardLayout.jsx  # CMS layout
│   └── dashboard/           # Dashboard sub-components
│       ├── AppSidebar.jsx   # Sidebar navigation
│       ├── Navbar.jsx       # Top navbar
│       ├── Footer.jsx       # Footer
│       └── ...
│
├── Pages/                   # Page components (routes)
│   ├── Auth/
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── ProfileStudyProgram/
│   │   ├── PPDS1.jsx
│   │   ├── ClinicalFellowship.jsx
│   │   ├── Subspesialis.jsx
│   │   └── UniversityDetail.jsx
│   ├── Settings/
│   │   ├── index.jsx
│   │   ├── UserSettings.jsx
│   │   ├── RoleSettings.jsx
│   │   └── PermissionSettings.jsx
│   ├── Homepage.jsx
│   ├── AboutUs.jsx
│   ├── CalendarAcademic.jsx
│   ├── PeerGroup.jsx
│   ├── Resident.jsx
│   └── NotFound.jsx
│
├── contexts/                # React contexts
├── data/                    # Static data
├── hooks/                   # Custom React hooks
├── utils/                   # Utility functions
├── app.jsx                  # Inertia app entry point
└── bootstrap.js             # Bootstrap JS
```

---

## Inertia.js Flow

### Konsep Dasar

Inertia.js adalah "modern monolith" - menggabungkan backend routing dengan SPA experience.

```
┌──────────────┐
│   Browser    │
└──────┬───────┘
       │
       ▼
┌──────────────────────┐
│  React Component     │
│  (Inertia Page)      │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│  Inertia.visit()     │ ──┐
│  Inertia.post()      │   │
│  Inertia.get()       │   │
└──────────────────────┘   │
                           │ XHR Request
                           │
                    ┌──────▼──────────┐
                    │  Laravel Route  │
                    └──────┬──────────┘
                           │
                           ▼
                    ┌──────────────────┐
                    │   Controller     │
                    └──────┬───────────┘
                           │
                           ▼
                    ┌──────────────────┐
                    │ Inertia::render  │
                    │ (with props)     │
                    └──────┬───────────┘
                           │ JSON Response
                           │
       ┌───────────────────┘
       │
       ▼
┌──────────────────────┐
│  React Component     │
│  (receives props)    │
└──────────────────────┘
```

### App Setup

**File:** `resources/js/app.jsx`

```jsx
import './bootstrap'
import '../css/app.css'

import { createRoot } from 'react-dom/client'
import { createInertiaApp } from '@inertiajs/react'
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers'

const appName = import.meta.env.VITE_APP_NAME || 'Laravel'

createInertiaApp({
  title: (title) => `${title} - ${appName}`,
  
  // Resolve page component dynamically
  resolve: (name) => resolvePageComponent(
    `./Pages/${name}.jsx`,
    import.meta.glob('./Pages/**/*.jsx')
  ),
  
  // Setup app
  setup({ el, App, props }) {
    const root = createRoot(el)
    root.render(<App {...props} />)
  },
  
  progress: {
    color: '#4B5563',
  },
})
```

### Backend Rendering

**File:** `routes/web.php`

```php
use Inertia\Inertia;

Route::get('/about-us', function () {
    return Inertia::render('AboutUs', [
        'data' => ['key' => 'value']  // Props passed to React
    ]);
})->name('about.us');
```

### Frontend Receiving Props

**File:** `resources/js/Pages/AboutUs.jsx`

```jsx
import { Head } from '@inertiajs/react'

export default function AboutUs({ data }) {
  // data dari backend available sebagai props
  
  return (
    <>
      <Head title="About Us" />
      <div>
        <h1>About Us</h1>
        <p>{data.key}</p>
      </div>
    </>
  )
}
```

### Inertia Navigation

```jsx
import { Link, router } from '@inertiajs/react'

// Method 1: Using Link component
<Link href="/about-us">About</Link>

// Method 2: Using router
router.visit('/about-us')

// Method 3: Form submission
router.post('/users', {
  name: 'John',
  email: 'john@example.com'
})

// Method 4: With options
router.visit('/users', {
  method: 'post',
  data: { name: 'John' },
  preserveState: true,
  preserveScroll: true,
  onSuccess: () => alert('Success!'),
  onError: (errors) => console.error(errors)
})
```

---

## React Components

### Page Component Structure

**Template untuk page baru:**

```jsx
import { Head, Link, router } from '@inertiajs/react'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function PageName({ initialData, auth }) {
  // State
  const [data, setData] = useState(initialData)
  
  // Effects
  useEffect(() => {
    // Component did mount logic
  }, [])
  
  // Handlers
  const handleAction = () => {
    router.post('/api/endpoint', data, {
      onSuccess: () => {
        // Success callback
      },
      onError: (errors) => {
        // Error handling
      }
    })
  }
  
  return (
    <>
      {/* Page title for SEO */}
      <Head title="Page Name" />
      
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Page Name</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Page content */}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
```

### Layout Components

#### Homepage Layout

**File:** `resources/js/Layouts/HomepageLayout.jsx`

```jsx
import { Link } from '@inertiajs/react'
import Navbar from './homepage/Navbar'
import Footer from './homepage/Footer'

export default function HomepageLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {children}
      </main>
      
      <Footer />
    </div>
  )
}
```

**Usage dalam page:**
```jsx
import HomepageLayout from '@/Layouts/HomepageLayout'

export default function Homepage() {
  return (
    <HomepageLayout>
      <div>Homepage content</div>
    </HomepageLayout>
  )
}
```

#### Dashboard Layout

**File:** `resources/js/Layouts/DashboardLayout.jsx`

```jsx
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from './dashboard/AppSidebar'
import Navbar from './dashboard/Navbar'
import Footer from './dashboard/Footer'

export default function DashboardLayout({ children, user }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar user={user} />
        
        <div className="flex-1 flex flex-col">
          <Navbar user={user} />
          
          <main className="flex-1 p-6">
            {children}
          </main>
          
          <Footer />
        </div>
      </div>
    </SidebarProvider>
  )
}
```

### Custom Components

#### PermissionGuard

**File:** `resources/js/components/PermissionGuard.jsx`

```jsx
import { usePage } from '@inertiajs/react'

export default function PermissionGuard({ 
  permission, 
  children, 
  fallback = null 
}) {
  const { auth } = usePage().props
  const user = auth?.user
  
  if (!user) return fallback
  
  const hasPermission = (perm) => {
    if (!user.permissions) return false
    
    // Super admin has all permissions
    if (user.permissions.includes('*')) return true
    
    // Check exact permission
    if (user.permissions.includes(perm)) return true
    
    // Check wildcard (e.g., 'users.*' matches 'users.edit')
    const module = perm.split('.')[0]
    if (user.permissions.includes(`${module}.*`)) return true
    
    return false
  }
  
  // Handle array of permissions (any)
  if (Array.isArray(permission)) {
    const hasAny = permission.some(p => hasPermission(p))
    return hasAny ? children : fallback
  }
  
  // Single permission
  return hasPermission(permission) ? children : fallback
}
```

**Usage:**
```jsx
<PermissionGuard permission="users.edit">
  <Button>Edit User</Button>
</PermissionGuard>

<PermissionGuard 
  permission={["users.edit", "users.delete"]}
  fallback={<p>No access</p>}
>
  <ActionButtons />
</PermissionGuard>
```

#### Theme Provider & Toggle

**File:** `resources/js/components/theme-provider.jsx`

```jsx
import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext({
  theme: 'light',
  setTheme: () => null,
})

export function ThemeProvider({ children, defaultTheme = 'light' }) {
  const [theme, setTheme] = useState(
    () => localStorage.getItem('theme') || defaultTheme
  )
  
  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
    localStorage.setItem('theme', theme)
  }, [theme])
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
```

**File:** `resources/js/components/theme-toggle.jsx`

```jsx
import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from './theme-provider'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      {theme === 'light' ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
    </Button>
  )
}
```

**Usage:**
```jsx
// In app.jsx or layout
import { ThemeProvider } from '@/components/theme-provider'

<ThemeProvider defaultTheme="light">
  <App />
</ThemeProvider>

// In navbar
import { ThemeToggle } from '@/components/theme-toggle'

<ThemeToggle />
```

---

## Styling dengan TailwindCSS

### Configuration

**File:** `tailwind.config.js`

```javascript
export default {
  darkMode: ['class'],
  content: [
    './resources/**/*.blade.php',
    './resources/**/*.js',
    './resources/**/*.jsx',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        // ... more colors
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('tailwindcss-animate'),
  ],
}
```

### Common Patterns

```jsx
// Container
<div className="container mx-auto px-4">
  Content
</div>

// Grid Layout
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>

// Flexbox
<div className="flex items-center justify-between">
  <span>Left</span>
  <span>Right</span>
</div>

// Responsive
<div className="text-sm md:text-base lg:text-lg">
  Responsive text
</div>

// Dark mode
<div className="bg-white dark:bg-gray-800 text-black dark:text-white">
  Dark mode support
</div>
```

### shadcn/ui Components

shadcn/ui menggunakan Radix UI primitives + TailwindCSS.

**Example - Button:**
```jsx
import { Button } from '@/components/ui/button'

// Variants
<Button variant="default">Default</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Sizes
<Button size="default">Default</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon">
  <Icon />
</Button>
```

**Example - Dialog:**
```jsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Confirm Action</DialogTitle>
      <DialogDescription>
        Are you sure you want to proceed?
      </DialogDescription>
    </DialogHeader>
    
    <DialogFooter>
      <Button variant="outline">Cancel</Button>
      <Button>Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

## State Management

### Local State (useState)

```jsx
import { useState } from 'react'

function Component() {
  const [count, setCount] = useState(0)
  const [data, setData] = useState([])
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  )
}
```

### Shared Props (Inertia)

```php
// Backend - Share data globally
Inertia::share([
    'auth' => fn () => [
        'user' => Auth::user(),
    ],
    'flash' => fn () => [
        'success' => session('success'),
        'error' => session('error'),
    ],
]);
```

```jsx
// Frontend - Access shared data
import { usePage } from '@inertiajs/react'

function Component() {
  const { auth, flash } = usePage().props
  
  return (
    <div>
      <p>Welcome, {auth.user?.name}</p>
      {flash.success && <Alert>{flash.success}</Alert>}
    </div>
  )
}
```

### Context API

```jsx
// Create context
import { createContext, useContext, useState } from 'react'

const UserContext = createContext()

export function UserProvider({ children, initialUser }) {
  const [user, setUser] = useState(initialUser)
  
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)

// Usage
function Component() {
  const { user, setUser } = useUser()
  
  return <div>Hello, {user.name}</div>
}
```

---

## Form Handling

### Basic Form with Inertia

```jsx
import { useForm } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function CreateUser() {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    email: '',
    password: '',
  })
  
  const submit = (e) => {
    e.preventDefault()
    
    post('/api/users', {
      onSuccess: () => {
        // Success callback
        alert('User created!')
      },
      onError: (errors) => {
        // Validation errors available in 'errors' object
        console.error(errors)
      }
    })
  }
  
  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={data.name}
          onChange={e => setData('name', e.target.value)}
          disabled={processing}
        />
        {errors.name && (
          <p className="text-sm text-red-500 mt-1">{errors.name}</p>
        )}
      </div>
      
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={data.email}
          onChange={e => setData('email', e.target.value)}
          disabled={processing}
        />
        {errors.email && (
          <p className="text-sm text-red-500 mt-1">{errors.email}</p>
        )}
      </div>
      
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={data.password}
          onChange={e => setData('password', e.target.value)}
          disabled={processing}
        />
        {errors.password && (
          <p className="text-sm text-red-500 mt-1">{errors.password}</p>
        )}
      </div>
      
      <Button type="submit" disabled={processing}>
        {processing ? 'Creating...' : 'Create User'}
      </Button>
    </form>
  )
}
```

### Form with react-hook-form

```jsx
import { useForm as useReactForm } from 'react-hook-form'
import { router } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function UserForm() {
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useReactForm()
  
  const onSubmit = (data) => {
    router.post('/api/users', data, {
      onSuccess: () => {
        alert('Success!')
      }
    })
  }
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Input
          {...register('name', { 
            required: 'Name is required',
            minLength: { value: 3, message: 'Min 3 characters' }
          })}
          placeholder="Name"
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>
      
      <div>
        <Input
          {...register('email', { 
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email'
            }
          })}
          placeholder="Email"
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
      </div>
      
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </Button>
    </form>
  )
}
```

---

## Routing

### Laravel Routes (Backend)

**File:** `routes/web.php`

```php
use Inertia\Inertia;

// Public routes
Route::get('/', fn() => Inertia::render('Homepage'))
    ->name('home');

Route::get('/about-us', fn() => Inertia::render('AboutUs'))
    ->name('about.us');

// Protected routes
Route::middleware(['auth'])->prefix('cms')->name('cms.')->group(function () {
    Route::get('/dashboard', fn() => Inertia::render('Dashboard/Index'))
        ->name('dashboard');
    
    Route::get('/settings/user', fn() => Inertia::render('Settings/UserSettings'))
        ->name('settings.user');
});
```

### Frontend Navigation

```jsx
import { Link, router } from '@inertiajs/react'

// Using Link component
<Link 
  href="/about-us" 
  className="text-blue-500"
>
  About Us
</Link>

// Using Link with route() helper (Ziggy)
<Link href={route('about.us')}>
  About Us
</Link>

// Programmatic navigation
const navigate = () => {
  router.visit('/about-us')
}

// Navigation with state preservation
<Link 
  href="/users" 
  preserveState 
  preserveScroll
>
  Users
</Link>
```

### Ziggy Route Helper

**Backend generate routes:**
```bash
php artisan ziggy:generate
```

**Frontend usage:**
```jsx
import route from 'ziggy-js'

// Simple route
route('home') // '/'

// Route with parameters
route('users.show', { id: 1 }) // '/users/1'

// Route with query params
route('users.index', { search: 'john' }) // '/users?search=john'

// Check current route
route().current('home') // true/false
```

---

## Best Practices

### Component Organization

```jsx
// 1. Imports
import { useState, useEffect } from 'react'
import { Head, Link, router } from '@inertiajs/react'
import { Button } from '@/components/ui/button'

// 2. Component definition
export default function ComponentName({ propA, propB }) {
  // 3. State
  const [state, setState] = useState()
  
  // 4. Effects
  useEffect(() => {
    // effect logic
  }, [])
  
  // 5. Handlers
  const handleClick = () => {
    // handler logic
  }
  
  // 6. Render
  return (
    <>
      <Head title="Page Title" />
      <div>{/* JSX */}</div>
    </>
  )
}
```

### Error Handling

```jsx
import { router } from '@inertiajs/react'
import { toast } from 'sonner'

const handleSubmit = (data) => {
  router.post('/api/users', data, {
    onSuccess: (response) => {
      toast.success('User created successfully')
    },
    onError: (errors) => {
      // Display validation errors
      Object.keys(errors).forEach(key => {
        toast.error(errors[key])
      })
    },
    onFinish: () => {
      // Always runs
      console.log('Request finished')
    }
  })
}
```

### Loading States

```jsx
import { router } from '@inertiajs/react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

function Component() {
  const [loading, setLoading] = useState(false)
  
  const handleAction = () => {
    setLoading(true)
    
    router.post('/api/endpoint', data, {
      onFinish: () => setLoading(false)
    })
  }
  
  if (loading) {
    return <Skeleton className="w-full h-32" />
  }
  
  return (
    <Button onClick={handleAction} disabled={loading}>
      {loading ? 'Loading...' : 'Submit'}
    </Button>
  )
}
```

### Confirmation Dialogs

```jsx
import Swal from 'sweetalert2'
import { router } from '@inertiajs/react'

const handleDelete = (userId) => {
  Swal.fire({
    title: 'Are you sure?',
    text: 'This action cannot be undone',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel'
  }).then((result) => {
    if (result.isConfirmed) {
      router.delete(`/api/users/${userId}`, {
        onSuccess: () => {
          Swal.fire('Deleted!', 'User has been deleted.', 'success')
        }
      })
    }
  })
}
```

### Toast Notifications

```jsx
import { toast } from 'sonner'

// Success
toast.success('Operation successful')

// Error
toast.error('Something went wrong')

// Info
toast.info('Information message')

// Warning
toast.warning('Warning message')

// Custom
toast('Custom message', {
  description: 'With description',
  duration: 5000,
})
```

### Performance Optimization

```jsx
import { memo, useMemo, useCallback } from 'react'

// Memoize component
const MemoizedComponent = memo(function Component({ data }) {
  return <div>{data}</div>
})

// Memoize expensive calculations
function Component({ items }) {
  const total = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price, 0)
  }, [items])
  
  return <div>Total: {total}</div>
}

// Memoize callbacks
function Component({ onUpdate }) {
  const handleClick = useCallback(() => {
    onUpdate()
  }, [onUpdate])
  
  return <button onClick={handleClick}>Update</button>
}
```

---

## Development Tips

### Hot Module Replacement

Vite provides instant HMR. Changes reflect immediately without full page reload.

```bash
# Start dev server
npm run dev
```

### Debugging

```jsx
// React DevTools
// Install browser extension

// Log props
console.log('Props:', props)

// Inertia page data
import { usePage } from '@inertiajs/react'
const { props } = usePage()
console.log('Page props:', props)
```

### Code Splitting

```jsx
// Lazy load components
import { lazy, Suspense } from 'react'

const HeavyComponent = lazy(() => import('./HeavyComponent'))

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeavyComponent />
    </Suspense>
  )
}
```

---

**Last Updated:** December 2024
