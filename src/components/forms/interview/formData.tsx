
import { Code, Users, Video } from 'lucide-react';
import { ReactNode } from 'react';

export interface InterviewType {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
}

export interface InterviewFormData {
  name: string;
  email: string;
  phone: string;
  interviewType: string;
  date: Date | undefined;
  time: string | undefined;
  additionalInfo: string;
}

export const interviewTypes: InterviewType[] = [
  {
    id: 'technical',
    title: 'Technical Interview',
    description: 'Coding challenges and technical questions to assess your skills.',
    icon: <Code className="h-6 w-6" />,
  },
  {
    id: 'behavioral',
    title: 'Behavioral Interview',
    description: 'Questions about your experiences, teamwork, and soft skills.',
    icon: <Users className="h-6 w-6" />,
  },
  {
    id: 'mock',
    title: 'Mock Interview',
    description: 'Practice interview with feedback to help you improve.',
    icon: <Video className="h-6 w-6" />,
  },
];

export const initialFormData: InterviewFormData = {
  name: '',
  email: '',
  phone: '',
  interviewType: '',
  date: undefined,
  time: undefined,
  additionalInfo: '',
};
