// Auth utilities for frontend
export const getToken = () => localStorage.getItem('token');

export const setToken = (token) => localStorage.setItem('token', token);

export const removeToken = () => localStorage.removeItem('token');

export const isAuthenticated = () => !!getToken();

export const getUser = () => {
  const token = getToken();
  if (!token) return null;

  try {
    // Decode JWT token (simple decode, not verify)
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

export const logout = () => {
  removeToken();
  window.location.href = '/login';
};
