import { Link } from "react-router-dom";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card/50 py-12 mt-auto">
      <div className="container">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img
                src="/logo.png"
                alt="Interview Haven"
                className="h-8 w-8 rounded-lg object-cover"
              />
              <span className="font-semibold text-foreground">Interview Haven</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Simplifying the interview process for IT students with a seamless
              scheduling experience.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/new-request"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Schedule Interview
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  About
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium text-foreground mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/privacy"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {year} Interview Haven. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
