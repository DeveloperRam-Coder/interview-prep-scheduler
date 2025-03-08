
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AnimatedLogo from '@/components/ui-elements/AnimatedLogo';

const features = [
  {
    icon: <Calendar className="h-6 w-6" />,
    title: 'Easy Scheduling',
    description: 'Choose from available interview slots with just a few clicks.',
  },
  {
    icon: <CheckCircle className="h-6 w-6" />,
    title: 'Multiple Interview Types',
    description: 'Technical, behavioral, or mock interviews tailored to your needs.',
  },
  {
    icon: <Clock className="h-6 w-6" />,
    title: 'Quick Setup',
    description: 'Get your interview scheduled in less than 2 minutes.',
  },
];

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <AnimatedLogo className="mx-auto mb-8" />
            
            <h1 className="text-foreground animate-slide-up">
              Simplify Your <span className="text-primary">IT Interview</span> Scheduling
            </h1>
            
            <p className="text-xl md:text-2xl max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '100ms' }}>
              A seamless platform for IT students to schedule and prepare for technical interviews.
            </p>
            
            <div className="pt-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
              <Link to="/schedule">
                <Button size="lg" className="rounded-full px-8">
                  Schedule Interview
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Feature Section */}
      <section className="py-16 md:py-24 bg-secondary/50">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-foreground mb-4">How It Works</h2>
            <p className="text-xl">
              We've simplified the interview scheduling process so you can focus on what matters most—preparation.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="glass rounded-xl p-6 md:p-8 hover-lift"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-medium text-foreground mb-3">{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="max-w-4xl mx-auto glass rounded-2xl overflow-hidden shadow-medium">
            <div className="p-8 md:p-12 text-center">
              <h2 className="text-foreground mb-4">Ready to ace your next interview?</h2>
              <p className="text-xl mb-8">
                Schedule your interview session now and take the first step towards your dream IT career.
              </p>
              <Link to="/schedule">
                <Button size="lg" className="rounded-full px-8">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
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

export default Index;
