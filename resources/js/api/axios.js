import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    withCredentials: true,
    headers: {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
    },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    const csrf = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    const headers = config.headers;

    if (csrf) {
        if (headers && typeof headers.set === 'function') {
            headers.set('X-CSRF-TOKEN', csrf);
        } else {
            config.headers = { ...(headers || {}), 'X-CSRF-TOKEN': csrf };
        }
    }

    if (token) {
        if (headers && typeof headers.set === 'function') {
            headers.set('Authorization', `Bearer ${token}`);
        } else {
            config.headers = { ...(config.headers || {}), Authorization: `Bearer ${token}` };
        }
    } else {
        if (headers && typeof headers.delete === 'function') {
            headers.delete('Authorization');
        } else if (headers && typeof headers.set === 'function') {
            headers.set('Authorization', '');
        } else if (config.headers && typeof config.headers === 'object') {
            delete config.headers.Authorization;
            delete config.headers.authorization;
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const hdr = error?.config?.headers;
    const skipVal = hdr && typeof hdr.get === 'function' ? hdr.get('X-Skip-Auth-Redirect') : hdr?.['X-Skip-Auth-Redirect'];
    const skipAuthRedirect = skipVal === '1' || skipVal === 1 || skipVal === true;

    if (error.response?.status === 401 && !skipAuthRedirect) {
      // Session expired or unauthorized - redirect to CMS login
      window.location.href = '/cms/login';
    }
    return Promise.reject(error);
  }
);

export default api;
