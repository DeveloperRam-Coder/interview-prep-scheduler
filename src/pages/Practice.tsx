
import { useState } from 'react';
import { 
  Code, 
  Users, 
  Video, 
  ChevronRight, 
  Timer, 
  ArrowRight, 
  BookOpen 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PracticeQuestionCard from '@/components/practice/PracticeQuestionCard';

interface QuestionType {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  description: string;
}

const technicalQuestions: QuestionType[] = [
  {
    id: 't1',
    title: 'Reverse a Linked List',
    difficulty: 'medium',
    category: 'Data Structures',
    description: 'Implement a function to reverse a singly linked list.',
  },
  {
    id: 't2',
    title: 'Two Sum Problem',
    difficulty: 'easy',
    category: 'Algorithms',
    description: 'Find two numbers that add up to a specific target.',
  },
  {
    id: 't3',
    title: 'Binary Tree Traversal',
    difficulty: 'medium',
    category: 'Data Structures',
    description: 'Implement in-order, pre-order, and post-order traversals of a binary tree.',
  },
];

const behavioralQuestions: QuestionType[] = [
  {
    id: 'b1',
    title: 'Describe a challenging project',
    difficulty: 'medium',
    category: 'Leadership',
    description: 'Describe a challenging project you worked on and how you overcame obstacles.',
  },
  {
    id: 'b2',
    title: 'Team conflict resolution',
    difficulty: 'hard',
    category: 'Teamwork',
    description: 'Tell me about a time when you had a conflict with a team member and how you resolved it.',
  },
  {
    id: 'b3',
    title: 'Handling feedback',
    difficulty: 'easy',
    category: 'Growth',
    description: 'Describe how you handle constructive criticism or feedback about your work.',
  },
];

const Practice = () => {
  const [activeTab, setActiveTab] = useState('technical');
  
  const practiceTypes = [
    {
      id: 'technical',
      title: 'Technical Practice',
      description: 'Solve coding challenges and algorithms',
      icon: <Code className="h-5 w-5" />,
      color: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400',
    },
    {
      id: 'behavioral',
      title: 'Behavioral Practice',
      description: 'Practice answering common interview questions',
      icon: <Users className="h-5 w-5" />,
      color: 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400',
    },
    {
      id: 'mock',
      title: 'Mock Interviews',
      description: 'Realistic interview simulations with feedback',
      icon: <Video className="h-5 w-5" />,
      color: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400',
    },
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <section className="flex-1 pt-24 pb-16">
        <div className="container">
          <div className="flex flex-col lg:flex-row justify-between items-start mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Practice</h1>
              <p className="text-muted-foreground mt-1">
                Sharpen your interview skills with guided practice
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {practiceTypes.map((type) => (
              <Card 
                key={type.id} 
                className={`cursor-pointer hover:border-primary/50 transition-colors ${activeTab === type.id ? 'border-primary/50 shadow-md' : ''}`}
                onClick={() => setActiveTab(type.id)}
              >
                <CardHeader className="pb-2">
                  <div className={`w-10 h-10 rounded-full ${type.color} flex items-center justify-center mb-2`}>
                    {type.icon}
                  </div>
                  <CardTitle className="text-xl">{type.title}</CardTitle>
                  <CardDescription>{type.description}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button 
                    variant={activeTab === type.id ? "default" : "ghost"} 
                    className="w-full justify-between"
                    onClick={() => setActiveTab(type.id)}
                  >
                    Select
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-3 w-full md:w-[400px] h-11">
              <TabsTrigger value="technical">Technical</TabsTrigger>
              <TabsTrigger value="behavioral">Behavioral</TabsTrigger>
              <TabsTrigger value="mock">Mock Interview</TabsTrigger>
            </TabsList>
            
            <TabsContent value="technical" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Technical Questions</h2>
                <div className="flex items-center gap-2">
                  <Button variant="outline" className="gap-2">
                    <BookOpen className="h-4 w-4" />
                    Learning Resources
                  </Button>
                  <Button className="gap-2">
                    <Timer className="h-4 w-4" />
                    Timed Challenge
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {technicalQuestions.map((question) => (
                  <PracticeQuestionCard
                    key={question.id}
                    question={question}
                    type="technical"
                  />
                ))}
              </div>
              
              <div className="flex justify-center pt-4">
                <Button variant="outline" className="gap-2">
                  View More Questions
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="behavioral" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Behavioral Questions</h2>
                <div className="flex items-center gap-2">
                  <Button variant="outline" className="gap-2">
                    <BookOpen className="h-4 w-4" />
                    STAR Method Guide
                  </Button>
                  <Button className="gap-2">
                    <Video className="h-4 w-4" />
                    Record Response
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {behavioralQuestions.map((question) => (
                  <PracticeQuestionCard
                    key={question.id}
                    question={question}
                    type="behavioral"
                  />
                ))}
              </div>
              
              <div className="flex justify-center pt-4">
                <Button variant="outline" className="gap-2">
                  View More Questions
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="mock" className="space-y-4">
              <div className="text-center py-8">
                <h2 className="text-2xl font-semibold mb-2">Mock Interviews</h2>
                <p className="text-muted-foreground max-w-xl mx-auto mb-6">
                  Practice with realistic interview simulations. Get feedback on your performance and improve your skills.
                </p>
                <div className="flex justify-center gap-4">
                  <Button variant="outline" className="gap-2">
                    <Users className="h-4 w-4" />
                    Peer Practice
                  </Button>
                  <Button className="gap-2">
                    <Video className="h-4 w-4" />
                    AI Interview
                  </Button>
                </div>
              </div>
              
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Video className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-center md:text-left">
                      <h3 className="text-lg font-medium">Coming Soon: AI-Powered Mock Interviews</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Practice with our advanced AI interviewer and get instant feedback on your performance.
                      </p>
                    </div>
                    <Button size="sm" className="ml-auto">Join Waitlist</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Practice;
