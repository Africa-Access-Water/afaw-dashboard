import axios from "axios";

import { API_BASE_URL } from '../../config';
const BASE_URL = API_BASE_URL;
const API_URL = `${BASE_URL}/api/posts`;


const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return {
    Authorization: user?.token ? `Bearer ${user.token}` : "",
  };
};


// GET all Posts
export const fetchPosts = async () => {
  const res = await axios.get(API_URL, {
    headers: getAuthHeader(),
  });
  return res.data;
};

// GET a single Post by ID
export const fetchPostById = async (id: number) => {
  const res = await axios.get(`${API_URL}/${id}`, {
    headers: getAuthHeader(),
  });
  return res.data;
};

// CREATE a Post
export const createPost = async (formData: FormData) => {
  const res = await axios.post(API_URL, formData, {
    headers: {
      ...getAuthHeader(),
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

// UPDATE a Post
export const updatePost = async (id: number, formData: FormData) => {
  const res = await axios.put(`${API_URL}/${id}`, formData, {
    headers: {
      ...getAuthHeader(),
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

// DELETE a Post
export const deletePost = async (id: number) => {
  const res = await axios.delete(`${API_URL}/${id}`, {
    headers: getAuthHeader(),
  });
  return res.data;
};
