import { createInertiaApp, router } from '@inertiajs/react'
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers'
import ReactDOM from 'react-dom/client'
import '../css/app.css'; // <--- WAJIB!
import { enableReactDevTools } from './utils/devtools';

// Enable React DevTools in development
if (import.meta.env.DEV) {
  enableReactDevTools();
}

createInertiaApp({
  resolve: name =>
    resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
  setup({ el, App, props }) {
    ReactDOM.createRoot(el).render(<App {...props} />)
  },
  progress: {
    delay: 250,
    color: '#4F46E5',
    includeCSS: true,
    showSpinner: true,
  },
})

// ========================================
// GLOBAL ERROR HANDLERS
// ========================================

// Handle HTTP errors (419 CSRF, 401 Unauthorized, etc)
router.on('error', (event) => {
  const status = event.detail.errors?.status || event.detail.response?.status
  
  // CSRF token mismatch or session expired
  if (status === 419) {
    console.warn('Session expired (419). Reloading page...')
    window.location.reload()
    return
  }
  
  // Unauthorized - redirect to login
  if (status === 401) {
    console.warn('Unauthorized (401). Redirecting to login...')
    window.location.href = '/login'
    return
  }
  
  // Server error - reload to recover
  if (status >= 500) {
    console.error('Server error. Reloading page...')
    setTimeout(() => window.location.reload(), 2000)
    return
  }
})

// Handle invalid Inertia responses (prevent JSON display)
router.on('invalid', (event) => {
  console.warn('Invalid Inertia response detected. Reloading...')
  event.preventDefault()
  window.location.reload()
})

// Handle navigation to ensure component exists
router.on('navigate', (event) => {
  if (!event.detail.page.component) {
    console.error('Missing component in Inertia response. Reloading...')
    window.location.reload()
  }
})

// ========================================
// VISIBILITY CHANGE HANDLER
// ========================================

// Track last activity time
let lastActivityTime = Date.now()

// Update activity time on user interaction
const updateActivity = () => {
  lastActivityTime = Date.now()
}

// Listen to user interactions
;['mousedown', 'keydown', 'scroll', 'touchstart'].forEach(event => {
  document.addEventListener(event, updateActivity, { passive: true })
})

// Handle page visibility change
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    const inactiveTime = Date.now() - lastActivityTime
    const FIVE_MINUTES = 5 * 60 * 1000
    
    // Reload if inactive > 5 minutes (likely session expired)
    if (inactiveTime > FIVE_MINUTES) {
      console.log('Page was inactive for', Math.round(inactiveTime / 60000), 'minutes. Reloading...')
      router.reload({ preserveState: false, preserveScroll: false })
    }
  }
})

// ========================================
// BROWSER BACK/FORWARD HANDLING
// ========================================

// Ensure proper handling of browser navigation
window.addEventListener('popstate', () => {
  // Let Inertia handle it, but ensure fresh data
  setTimeout(() => {
    if (!document.querySelector('[data-page]')) {
      console.warn('Inertia page data missing after popstate. Reloading...')
      window.location.reload()
    }
  }, 100)
})
