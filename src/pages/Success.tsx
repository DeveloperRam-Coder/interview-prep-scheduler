
import { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const Success = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { formData } = location.state || {};
  
  useEffect(() => {
    if (!formData) {
      navigate('/schedule');
    }
  }, [formData, navigate]);
  
  if (!formData) {
    return null;
  }
  
  const interviewTypeLabels = {
    technical: 'Technical Interview',
    behavioral: 'Behavioral Interview',
    mock: 'Mock Interview',
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <section className="flex-1 pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="container max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-8">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
            
            <h1 className="text-foreground mb-4">Interview Scheduled!</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Your interview has been successfully scheduled. We've sent a confirmation to your email with all the details.
            </p>
          </div>
          
          <Card className="shadow-lg border-primary/20 animate-scale-in">
            <CardContent className="p-6 md:p-8">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold">Interview Details</h2>
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                    Confirmed
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Candidate</p>
                    <p className="font-medium">{formData.name}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Interview Type</p>
                    <p className="font-medium">{interviewTypeLabels[formData.interviewType] || formData.interviewType}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Date</p>
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-primary" />
                      <p className="font-medium">
                        {formData.date ? format(new Date(formData.date), 'EEEE, MMMM d, yyyy') : 'Not specified'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Time</p>
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4 text-primary" />
                      <p className="font-medium">{formData.time || 'Not specified'}</p>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Contact Information</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <p className="text-sm">Email: <span className="font-medium">{formData.email}</span></p>
                    <p className="text-sm">Phone: <span className="font-medium">{formData.phone || 'Not provided'}</span></p>
                  </div>
                </div>
                
                {formData.additionalInfo && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Additional Information</p>
                    <p className="text-sm bg-secondary/50 p-3 rounded-md">{formData.additionalInfo}</p>
                  </div>
                )}
                
                <div className="bg-primary/5 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Preparing for Your Interview</h3>
                  <ul className="text-sm space-y-2">
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Review your resume and be prepared to discuss your experiences</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Research common interview questions for your interview type</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Check out our practice resources in the dashboard</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col sm:flex-row gap-4 p-6 md:p-8 pt-0 md:pt-0">
              <Link to="/" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full">
                  Return Home
                </Button>
              </Link>
              <Link to="/dashboard" className="w-full sm:w-auto">
                <Button className="w-full">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Success;
