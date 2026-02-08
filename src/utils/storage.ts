// Simple localStorage utility for demo purposes
export interface StoredInterview {
  id: string;
  name: string;
  email: string;
  phone: string;
  interviewType: string;
  date: string;
  time: string;
  additionalInfo: string;
  createdAt: string;
}

const STORAGE_KEY = 'interview_bookings';

export const saveInterview = (data: Omit<StoredInterview, 'id' | 'createdAt'>): StoredInterview => {
  const interviews = getInterviews();
  const newInterview: StoredInterview = {
    ...data,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  
  interviews.push(newInterview);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(interviews));
  
  return newInterview;
};

export const getInterviews = (): StoredInterview[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const getInterviewById = (id: string): StoredInterview | undefined => {
  const interviews = getInterviews();
  return interviews.find(interview => interview.id === id);
};

export const deleteInterview = (id: string): void => {
  const interviews = getInterviews();
  const filtered = interviews.filter(interview => interview.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};
