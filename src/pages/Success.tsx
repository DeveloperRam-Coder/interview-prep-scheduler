
import { useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowLeft, Calendar, Clock, User, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { format } from 'date-fns';

const Success = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const formData = location.state?.formData;
  
  useEffect(() => {
    // If the user navigates directly to this page without form data, redirect to schedule
    if (!formData) {
      navigate('/schedule');
    }
  }, [formData, navigate]);
  
  if (!formData) return null;
  
  const getInterviewTypeName = (type: string) => {
    switch (type) {
      case 'technical':
        return 'Technical Interview';
      case 'behavioral':
        return 'Behavioral Interview';
      case 'mock':
        return 'Mock Interview';
      default:
        return 'Interview';
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <section className="flex-1 pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="container">
          <div className="max-w-2xl mx-auto glass rounded-2xl p-8 md:p-10 shadow-medium animate-scale-in">
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6">
                <CheckCircle className="h-8 w-8" />
              </div>
              <h1 className="text-2xl md:text-3xl font-medium text-foreground mb-4">Interview Scheduled Successfully!</h1>
              <p className="text-muted-foreground">
                Thank you for scheduling an interview with us. We've sent a confirmation email with all the details.
              </p>
            </div>
            
            <div className="bg-secondary/50 rounded-xl p-6 space-y-4 mb-8">
              <h2 className="text-lg font-medium text-foreground mb-4">Interview Details</h2>
              
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">Date</p>
                  <p className="text-muted-foreground">{formData.date ? format(formData.date, 'PPPP') : 'Not specified'}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">Time</p>
                  <p className="text-muted-foreground">{formData.time || 'Not specified'}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">Interview Type</p>
                  <p className="text-muted-foreground">{getInterviewTypeName(formData.interviewType)}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-secondary/50 rounded-xl p-6 space-y-4 mb-8">
              <h2 className="text-lg font-medium text-foreground mb-4">Your Information</h2>
              
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">Name</p>
                  <p className="text-muted-foreground">{formData.name}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">Email</p>
                  <p className="text-muted-foreground">{formData.email}</p>
                </div>
              </div>
              
              {formData.phone && (
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Phone</p>
                    <p className="text-muted-foreground">{formData.phone}</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-center">
              <Link to="/">
                <Button variant="outline" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Success;
