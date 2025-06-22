import React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Calendar, Clock, FileDown, Image } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const Success = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { formData } = location.state || {};
  const cardRef = useRef<HTMLDivElement>(null);
  const [hideButtons, setHideButtons] = useState(false);

  useEffect(() => {
    if (!formData) {
      navigate('/schedule');
    }
  }, [formData, navigate]);

  if (!formData) {
    return null;
  }

  const downloadAsImage = async () => {
    if (!cardRef.current) return;
    try {
      setHideButtons(true);
      await new Promise((res) => setTimeout(res, 100));
      const canvas = await html2canvas(cardRef.current, {
        scale: Math.max(window.devicePixelRatio * 6, 8),
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        scrollY: -window.scrollY,
        allowTaint: false,
        removeContainer: true,
      });
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `interview-confirmation-${formData.name.replace(/\s+/g, '-').toLowerCase()}.png`;
      link.click();
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setHideButtons(false);
    }
  };

  const downloadAsPDF = async () => {
    if (!cardRef.current) return;
    try {
      setHideButtons(true);
      await new Promise((res) => setTimeout(res, 100));
      const canvas = await html2canvas(cardRef.current, {
        scale: Math.max(window.devicePixelRatio * 3, 4),
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        allowTaint: false,
        removeContainer: true,
        scrollY: -window.scrollY
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      pdf.save(`interview-confirmation-${formData.name.replace(/\s+/g, '-').toLowerCase()}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setHideButtons(false);
    }
  };

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
          <Card 
            ref={cardRef} 
            style={{ 
              width: '794px', 
              maxWidth: '100%', 
              margin: '0 auto',
              textRendering: 'optimizeLegibility',
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale'
            }} 
            className="shadow-lg border-primary/20 animate-scale-in print-card"
          >
            <CardContent className="p-6 md:p-8 text-black dark:text-white">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold text-black dark:text-white">Interview Details</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Candidate</p>
                    <p className="font-medium text-black dark:text-white">{formData.name}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Interview Type</p>
                    <p className="font-medium text-black dark:text-white">{interviewTypeLabels[formData.interviewType] || formData.interviewType}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Date</p>
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-primary" />
                      <p className="font-medium text-black dark:text-white">
                        {formData.date ? format(new Date(formData.date), 'EEEE, MMMM d, yyyy') : 'Not specified'}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Time</p>
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4 text-primary" />
                      <p className="font-medium text-black dark:text-white">{formData.time || 'Not specified'}</p>
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Contact Information</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <p className="text-sm text-black dark:text-white">Email: <span className="font-medium">{formData.email}</span></p>
                    <p className="text-sm text-black dark:text-white">Phone: <span className="font-medium">{formData.phone || 'Not provided'}</span></p>
                  </div>
                </div>
                {formData.additionalInfo && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Additional Information</p>
                    <p className="text-sm bg-secondary/50 p-3 rounded-md text-black dark:text-white font-medium">{formData.additionalInfo}</p>
                  </div>
                )}
                <div className="bg-primary/5 p-4 rounded-lg">
                  <h3 className="font-medium mb-2 text-black dark:text-white">Preparing for Your Interview</h3>
                  <ul className="text-sm space-y-2">
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span className="text-black dark:text-white">Review your resume and be prepared to discuss your experiences</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span className="text-black dark:text-white">Research common interview questions for your interview type</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span className="text-black dark:text-white">Check out our practice resources in the dashboard</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 p-6 md:p-8 pt-0 md:pt-0">
              {!hideButtons && (
                <>
                  <div className="flex flex-col sm:flex-row gap-4 w-full">
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
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 w-full border-t pt-4">
                    <h3 className="text-sm font-medium mb-2 w-full">Download Confirmation:</h3>
                    <div className="flex gap-2 w-full sm:justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                        onClick={downloadAsImage}
                      >
                        <Image className="h-4 w-4" />
                        Save as Image
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                        onClick={downloadAsPDF}
                      >
                        <FileDown className="h-4 w-4" />
                        Save as PDF
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardFooter>
          </Card>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Success;
