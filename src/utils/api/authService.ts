import axios from 'axios';

import { API_BASE_URL } from '../../config';
const BASE_URL = API_BASE_URL;
const API_URL = `${BASE_URL}/api/auth`;

// Register a new user
export const register = async (userData: { name: string; email: string; password: string; role: string }) => {
  const res = await axios.post(`${API_URL}/signup`, userData);
  return res.data;
};

// Login user
export const login = async (credentials: { email: string; password: string }, rememberMe: boolean = false) => {
  const res = await axios.post(`${API_URL}/login`, credentials);

  if (res.data) {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem('user', JSON.stringify(res.data));
  }

  return res.data;
};

// Logout user
export const logout = () => {
  localStorage.removeItem('user');
  sessionStorage.removeItem('user');
};

// Get current logged-in user
export const getCurrentUser = () => {
  // Try sessionStorage first, then localStorage
  const sessionUser = sessionStorage.getItem('user');
  const localUser = localStorage.getItem('user');
  return JSON.parse(sessionUser || localUser || '{}');
};

// Check if user has specific role
export const hasRole = (role: string): boolean => {
  const user = getCurrentUser();
  return user?.user?.role && typeof user.user.role === 'string' && user.user.role.toLowerCase() === role.toLowerCase();
};

// Convenience helper for admin role
export const isAdmin = (): boolean => hasRole('admin');
