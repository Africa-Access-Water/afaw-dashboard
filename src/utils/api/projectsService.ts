import axios from "axios";
import { Project } from "../../types/types/types"; // ✅ adjust path

import { API_BASE_URL } from '../../config';
import getAuthHeader from './getAuthHeader';

const API_URL = `${API_BASE_URL}/api/projects`;

// GET all Projects
export const fetchProjects = async (): Promise<Project[]> => {
  const res = await axios.get<Project[]>(API_URL, { headers: getAuthHeader() });
  return res.data;
};

// GET a single Project
export const fetchProjectById = async (id: number): Promise<Project> => {
  const res = await axios.get<Project>(`${API_URL}/${id}`, {
    headers: getAuthHeader(),
  });
  return res.data;
};

// CREATE a Project
export const createProject = async (formData: FormData): Promise<Project> => {
  const res = await axios.post<Project>(API_URL, formData, {
    headers: {
      ...getAuthHeader(),
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

// UPDATE a Project
export const updateProject = async (id: number, formData: FormData): Promise<Project> => {
  const res = await axios.put<Project>(`${API_URL}/${id}`, formData, {
    headers: {
      ...getAuthHeader(),
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

// DELETE a Project
export const deleteProject = async (
  id: number
): Promise<{ message: string }> => {
  const res = await axios.delete<{ message: string }>(`${API_URL}/${id}`, {
    headers: getAuthHeader(),
  });
  return res.data;
};
