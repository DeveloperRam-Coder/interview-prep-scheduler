import { Target, Users, Heart } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const About = () => {
  const items = [
    {
      icon: Target,
      title: "Our mission",
      description:
        "Making interview scheduling effortless and accessible for everyone.",
    },
    {
      icon: Users,
      title: "Our team",
      description:
        "Dedicated professionals committed to your success.",
    },
    {
      icon: Heart,
      title: "Our values",
      description:
        "Simplicity, reliability, and a student-first approach.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 pt-28 pb-16 md:pt-36 md:pb-24">
        <div className="container">
          <div className="mx-auto max-w-3xl space-y-12">
            <div className="text-center space-y-4">
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                About Interview Haven
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                We're on a mission to simplify the interview scheduling process
                for IT students and professionals.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map(({ icon: Icon, title, description }) => (
                <Card
                  key={title}
                  className="border-border bg-card shadow-sm text-center"
                >
                  <CardHeader>
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-lg">{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>

            <Card className="border-border bg-card shadow-sm">
              <CardHeader>
                <CardTitle>Why choose us?</CardTitle>
                <CardDescription>
                  Built for students, by people who care about your success
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  Interview Haven was created to address the common challenges
                  students face when scheduling technical interviews. We
                  understand that the process can be stressful, so we've built a
                  platform that removes the friction from scheduling.
                </p>
                <p>
                  Our platform offers a streamlined, user-friendly experience so
                  you can focus on what matters most: preparing for your interview
                  and showcasing your skills.
                </p>
                <p>
                  Whether you need technical assessments, behavioral interviews,
                  or mock interview practice, we've got you covered with flexible
                  scheduling options and clear confirmations.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
