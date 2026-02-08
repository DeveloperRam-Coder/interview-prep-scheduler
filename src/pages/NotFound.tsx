import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <section className="flex-1 flex items-center justify-center px-4 py-24">
        <div className="mx-auto max-w-md text-center space-y-8">
          <div>
            <p className="text-6xl sm:text-8xl font-bold text-primary tracking-tight">
              404
            </p>
            <h1 className="mt-4 text-2xl font-semibold text-foreground sm:text-3xl">
              Page not found
            </h1>
            <p className="mt-2 text-muted-foreground">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button size="lg" className="rounded-lg" asChild>
              <Link to="/">
                <Home className="mr-2 h-4 w-4" />
                Go home
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-lg"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go back
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default NotFound;
