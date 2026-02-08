import { Link } from "react-router-dom";
import { ArrowRight, Calendar, CheckCircle, Clock } from "lucide-react";
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

const features = [
  {
    icon: Calendar,
    title: "Easy Scheduling",
    description:
      "Choose from available interview slots with just a few clicks.",
  },
  {
    icon: CheckCircle,
    title: "Multiple Interview Types",
    description:
      "Technical, behavioral, or mock interviews tailored to your needs.",
  },
  {
    icon: Clock,
    title: "Quick Setup",
    description: "Get your interview scheduled in less than 2 minutes.",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="pt-28 pb-16 md:pt-36 md:pb-24">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center space-y-6">
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                Simplify Your{" "}
                <span className="text-primary">IT Interview</span> Scheduling
              </h1>
              <p className="text-lg text-muted-foreground md:text-xl">
                A seamless platform for IT students to schedule and prepare for
                technical interviews.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center pt-2">
                <Button size="lg" className="rounded-lg" asChild>
                  <Link to="/login">
                    Get started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="rounded-lg" asChild>
                  <Link to="/new-request">Schedule Interview</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 md:py-24 bg-muted/40">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center mb-12">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                How it works
              </h2>
              <p className="mt-3 text-muted-foreground">
                We've simplified the interview scheduling process so you can
                focus on preparation.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <Card
                    key={feature.title}
                    className="border-border bg-card shadow-sm transition-shadow hover:shadow-md"
                  >
                    <CardHeader>
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Icon className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                      <CardDescription>{feature.description}</CardDescription>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-24">
          <div className="container">
            <Card className="mx-auto max-w-2xl border-border bg-card shadow-sm overflow-hidden">
              <CardContent className="p-8 md:p-12 text-center">
                <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                  Ready to ace your next interview?
                </h2>
                <p className="mt-3 text-muted-foreground">
                  Schedule your interview session now and take the first step
                  towards your dream IT career.
                </p>
                <Button size="lg" className="mt-6 rounded-lg" asChild>
                  <Link to="/login">
                    Get started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
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
