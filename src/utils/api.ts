
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interviews
export const getInterviews = () => api.get('/interviews');
export const getInterviewById = (id: string) => api.get(`/interviews/${id}`);
export const createInterview = (interviewData: any) => api.post('/interviews', interviewData);
export const updateInterview = (id: string, interviewData: any) => api.put(`/interviews/${id}`, interviewData);
export const deleteInterview = (id: string) => api.delete(`/interviews/${id}`);

// Resources
export const getResources = (params?: {type?: string, category?: string}) => 
  api.get('/resources', { params });
export const getResourceById = (id: string) => api.get(`/resources/${id}`);
export const createResource = (resourceData: any) => api.post('/resources', resourceData);
export const updateResource = (id: string, resourceData: any) => api.put(`/resources/${id}`, resourceData);
export const deleteResource = (id: string) => api.delete(`/resources/${id}`);

// Users
export const getUsers = () => api.get('/users');
export const getUserById = (id: string) => api.get(`/users/${id}`);
export const createUser = (userData: any) => api.post('/users', userData);
export const updateUser = (id: string, userData: any) => api.put(`/users/${id}`, userData);
export const deleteUser = (id: string) => api.delete(`/users/${id}`);

export default api;
