// Authentication utilities
export const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem('authToken', token);
};

export const removeAuthToken = (): void => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
};

export const getStoredUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

// Google OAuth helper
export const initiateGoogleAuth = () => {
  window.location.href = 'http://localhost:5000/api/auth/google';
};

// Handle OAuth success callback
export const handleOAuthSuccess = (token: string) => {
  setAuthToken(token);
  // Redirect to home or intended page
  window.location.href = '/';
};