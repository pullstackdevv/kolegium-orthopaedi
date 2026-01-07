/**
 * Centralized authentication utilities
 */

/**
 * Handle user logout - clears all session data and redirects to login
 * @param {string} reason - Optional reason for logout (e.g., 'expired', 'manual')
 */
export const handleLogout = async (reason = '') => {
  // Clear all stored authentication data first
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user_data');
  sessionStorage.clear();
  
  try {
    // Try to call logout endpoint (best effort) - use GET method
    await fetch('/cms/logout', { 
      method: 'GET',
      credentials: 'same-origin'
    });
  } catch (e) {
    // Ignore errors, proceed with redirect anyway
    console.warn('Logout endpoint failed, proceeding with redirect:', e);
  }
  
  // Build redirect URL with reason
  const loginUrl = '/cms' + (reason ? `?reason=${encodeURIComponent(reason)}` : '');
  
  // Redirect to CMS page
  window.location.href = loginUrl;
};

/**
 * Handle session expiration
 */
export const handleSessionExpired = () => {
  handleLogout('session_expired');
};

/**
 * Handle unauthorized access
 */
export const handleUnauthorized = () => {
  handleLogout('unauthorized');
};

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem('auth_token');
  return !!token;
};

/**
 * Get current user data from localStorage
 * @returns {object|null}
 */
export const getCurrentUser = () => {
  try {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  } catch (e) {
    console.error('Failed to parse user data:', e);
    return null;
  }
};

/**
 * Get auth token
 * @returns {string|null}
 */
export const getAuthToken = () => {
  return localStorage.getItem('auth_token');
};
