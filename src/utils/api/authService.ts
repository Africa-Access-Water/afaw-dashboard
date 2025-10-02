import axios from 'axios';

import { API_BASE_URL } from '../../config';
const BASE_URL = API_BASE_URL;
const API_URL = `${BASE_URL}/api/auth`;

// Register a new user
export const register = async (userData: { name: string; email: string; password: string }) => {
  const res = await axios.post(`${API_URL}/register`, userData);

  // Save user info & token to localStorage
  if (res.data) {
    localStorage.setItem('user', JSON.stringify(res.data));
  }

  return res.data;
};

// Login user
export const login = async (credentials: { email: string; password: string }) => {
  const res = await axios.post(`${API_URL}/login`, credentials);

  // Save user info & token to localStorage
  if (res.data) {
    localStorage.setItem('user', JSON.stringify(res.data));
  }

  return res.data;
};

// Logout user
export const logout = () => {
  localStorage.removeItem('user');
  sessionStorage.clear();
};

// Get current logged-in user
export const getCurrentUser = () => {
  console.log('Fetching current user from localStorage', localStorage.getItem('user'));
  return JSON.parse(localStorage.getItem('user') || '{}');
};
