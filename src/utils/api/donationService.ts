import axios from "axios";

import { API_BASE_URL } from '../../config';
const BASE_URL = API_BASE_URL;
const API_URL = `${BASE_URL}/api/donations`;

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return {
    Authorization: user?.token ? `Bearer ${user.token}` : "",
  };
};

// GET all Donations (includes both one-time donations and subscriptions)
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
