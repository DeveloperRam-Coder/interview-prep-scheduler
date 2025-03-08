
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import InterviewForm from '@/components/forms/InterviewForm';

const Schedule = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <section className="flex-1 pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-foreground mb-4">Schedule Your Interview</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Fill out the form below to schedule your interview session. We'll send you a confirmation email with all the details.
            </p>
          </div>
          
          <InterviewForm />
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Schedule;
