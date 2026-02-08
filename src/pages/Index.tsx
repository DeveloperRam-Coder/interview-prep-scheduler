import { Link } from "react-router-dom";
import { ArrowRight, Calendar, CheckCircle, Clock, FileText, Video, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import HeroInterview from "@/components/illustrations/HeroInterview";

const features = [
  {
    icon: Calendar,
    title: "Easy Scheduling",
    description: "Choose from available interview slots with just a few clicks.",
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-500/10 dark:bg-blue-500/20",
  },
  {
    icon: CheckCircle,
    title: "Multiple Interview Types",
    description: "Technical, behavioral, or mock interviews tailored to your needs.",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10 dark:bg-emerald-500/20",
  },
  {
    icon: FileText,
    title: "Resume Upload",
    description: "Upload your resume for admin review before the interview.",
    color: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-500/10 dark:bg-violet-500/20",
  },
  {
    icon: Bell,
    title: "Real-time Notifications",
    description: "Get instant updates when your interview is accepted or rescheduled.",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/10 dark:bg-amber-500/20",
  },
  {
    icon: Video,
    title: "Join Remotely",
    description: "Connect via meeting link when your interview is confirmed.",
    color: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-500/10 dark:bg-rose-500/20",
  },
  {
    icon: Clock,
    title: "Quick Setup",
    description: "Get your interview scheduled in less than 2 minutes.",
    color: "text-cyan-600 dark:text-cyan-400",
    bg: "bg-cyan-500/10 dark:bg-cyan-500/20",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background transition-colors duration-300">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="pt-28 pb-12 md:pt-36 md:pb-20 overflow-hidden">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl">
                  Simplify Your{" "}
                  <span className="text-primary">
                    Interview
                  </span>{" "}
                  Scheduling
                </h1>
                <p className="text-lg text-muted-foreground md:text-xl max-w-xl">
                  A seamless platform for IT students to schedule and prepare for
                  technical interviews. Upload your resume, pick a slot, and get
                  real-time updates.
                </p>
                <div className="flex flex-col gap-4 sm:flex-row pt-2">
                  <Button size="lg" className="rounded-xl h-12 px-8 transition-all duration-300 hover:scale-[1.02]" asChild>
                    <Link to="/login">
                      Get started
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="rounded-xl h-12 px-8 transition-all duration-300 hover:bg-accent" asChild>
                    <Link to="/register">Create account</Link>
                  </Button>
                </div>
              </div>
              <div className="relative lg:pl-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
                <HeroInterview className="w-full max-w-lg mx-auto h-auto text-muted-foreground/50" />
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 md:py-28 bg-muted/40 dark:bg-muted/20 transition-colors">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center mb-14">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                How it works
              </h2>
              <p className="mt-3 text-muted-foreground text-lg">
                We've simplified the interview scheduling process so you can
                focus on preparation.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <Card
                    key={feature.title}
                    className="border-border bg-card shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary/20"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <CardHeader className="space-y-3">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${feature.bg} ${feature.color} transition-transform duration-300 group-hover:scale-110`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                      <CardDescription className="text-base">{feature.description}</CardDescription>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 md:py-28">
          <div className="container">
            <Card className="mx-auto max-w-3xl border-border bg-card shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
              <CardContent className="p-10 md:p-16 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
                <div className="relative">
                  <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
                    Ready to ace your next interview?
                  </h2>
                  <p className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto">
                    Schedule your interview session now and take the first step
                    towards your dream IT career.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                    <Button size="lg" className="rounded-xl h-12 px-8" asChild>
                      <Link to="/login">
                        Get started
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button size="lg" variant="outline" className="rounded-xl h-12 px-8" asChild>
                      <Link to="/about">Learn more</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
