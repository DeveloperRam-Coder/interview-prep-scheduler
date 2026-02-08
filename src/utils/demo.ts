// Demo data utility for testing
import { saveInterview } from './storage';

export const seedDemoData = () => {
  const demoInterviews = [
    {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '(555) 123-4567',
      interviewType: 'technical',
      date: new Date(Date.now() + 86400000 * 3).toISOString(), // 3 days from now
      time: '10:00 AM',
      additionalInfo: 'Looking forward to discussing React and TypeScript',
    },
    {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '(555) 987-6543',
      interviewType: 'behavioral',
      date: new Date(Date.now() + 86400000 * 5).toISOString(), // 5 days from now
      time: '2:00 PM',
      additionalInfo: 'Interested in team collaboration questions',
    },
    {
      name: 'Mike Johnson',
      email: 'mike.j@example.com',
      phone: '(555) 456-7890',
      interviewType: 'mock',
      date: new Date(Date.now() + 86400000 * 7).toISOString(), // 7 days from now
      time: '11:00 AM',
      additionalInfo: 'Need practice with system design questions',
    },
  ];

  demoInterviews.forEach(interview => {
    saveInterview(interview);
  });

  console.log('✅ Demo data seeded successfully!');
  console.log(`📊 ${demoInterviews.length} sample interviews added`);
};

export const clearAllData = () => {
  localStorage.removeItem('interview_bookings');
  console.log('🗑️ All interview data cleared');
};

// Expose to window for easy console access
if (typeof window !== 'undefined') {
  (window as any).seedDemoData = seedDemoData;
  (window as any).clearAllData = clearAllData;
}
