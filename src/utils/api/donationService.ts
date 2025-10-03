import axios from "axios";

import { API_BASE_URL } from '../../config';
import getAuthHeader from './getAuthHeader';

const API_URL = `${API_BASE_URL}/api/donations`;


// GET all Donations
export const fetchDonations = async () => {
  const res = await axios.get(API_URL, {
    headers: getAuthHeader(),
  });
  return res.data;
};

// GET all Donors
export const fetchDonors = async () => {
  const res = await axios.get(`${API_URL}/donors`, {
    headers: getAuthHeader(),
  });
  return res.data;
};

// GET donations by donor ID
export const fetchDonationsByDonor = async (donorId: number) => {
  const res = await axios.get(`${API_URL}?donor_id=${donorId}`, {
    headers: getAuthHeader(),
  });
  return res.data;
};

// GET project with donations
export const fetchProjectWithDonations = async (projectId: number) => {
  const res = await axios.get(`${API_URL}/project/${projectId}`, {
    headers: getAuthHeader(),
  });
  return res.data;
};
