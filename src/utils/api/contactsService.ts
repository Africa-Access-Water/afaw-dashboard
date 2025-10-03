import { API_BASE_URL } from '../../config';
import axios from "axios";
import getAuthHeader from './getAuthHeader';

export interface Contact {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

export const fetchContacts = async (): Promise<Contact[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/fetch-contacts`, {
      headers: getAuthHeader()
    });
    
    return response.data;
  } catch (error) {
    throw error instanceof Error ? error : new Error('An error occurred while fetching contacts');
  }
};
