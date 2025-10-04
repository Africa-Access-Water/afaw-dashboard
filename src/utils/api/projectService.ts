import axios from "axios";
import getAuthHeader from './getAuthHeader';
import { API_BASE_URL } from '../../config';
const BASE_URL = API_BASE_URL;
const API_URL = `${BASE_URL}/api/projects`;


// GET all Projects
export const fetchProjects = async () => {
  const res = await axios.get(API_URL, {
    headers: getAuthHeader(),
  });
  return res.data;
};

// GET a single Project by ID
export const fetchProjectById = async (id: number) => {
  const res = await axios.get(`${API_URL}/${id}`, {
    headers: getAuthHeader(),
  });
  return res.data;
};
