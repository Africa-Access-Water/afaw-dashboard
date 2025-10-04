import axios from 'axios';
import { API_BASE_URL } from '../../config';
import { getAuthHeader } from './getAuthHeader';

const BASE_URL = API_BASE_URL;
const API_URL = `${BASE_URL}/api/auth`;

export interface PendingUser {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar_url: string;
  created_at: string;
}

// Get all pending user requests
export const getPendingUsers = async (): Promise<PendingUser[]> => {
  const res = await axios.get(`${API_URL}/pending-users`, {
    headers: getAuthHeader()
  });
  return res.data.users;
};

// Approve a user's registration request
export const approveUser = async (userId: number): Promise<void> => {
  await axios.put(`${API_URL}/approve-user/${userId}`, null, {
    headers: getAuthHeader()
  });
};

// Reject a user's registration request
export const rejectUser = async (userId: number): Promise<void> => {
  await axios.put(`${API_URL}/reject-user/${userId}`, null, {
    headers: getAuthHeader()
  });
};