/**
 * Re-export the shared API client and helpers.
 * Use @/lib/api for all requests (auth, interceptors, base URL).
 */
import api from '@/lib/api';

// User's own interviews (CRUD)
export const getInterviews = () => api.get('/interviews');
export const getInterviewById = (id: string) => api.get(`/interviews/${id}`);
export const createInterview = (interviewData: { interviewType: string; date: string; time: string; additionalInfo?: string }) =>
  api.post('/interviews', interviewData);
export const updateInterview = (id: string, interviewData: { interviewType?: string; date?: string; time?: string; additionalInfo?: string }) =>
  api.patch(`/interviews/${id}`, interviewData);
export const deleteInterview = (id: string) => api.delete(`/interviews/${id}`);

export default api;
