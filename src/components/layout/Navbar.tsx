import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = user
    ? [
        { name: "Home", path: "/" },
        {
          name: user.role === "ADMIN" ? "Admin" : "Dashboard",
          path: user.role === "ADMIN" ? "/admin" : "/dashboard",
        },
        { name: "Profile", path: "/profile" },
      ]
    : [
        { name: "Home", path: "/" },
        { name: "About", path: "/about" },
      ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 border-b border-border/80 transition-all duration-200",
        isScrolled
          ? "bg-background/90 py-3 shadow-sm backdrop-blur-md"
          : "bg-transparent py-4"
      )}
    >
      <div className="container flex h-12 items-center justify-between sm:h-14">
        <Link
          to="/"
          className="flex items-center gap-2 rounded-lg outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
        >
          <img
            src="/logo.png"
            alt="Interview Haven"
            className="h-8 w-8 rounded-lg object-cover"
          />
          <span className="font-semibold text-foreground">Interview Haven</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                location.pathname === link.path
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              {link.name}
            </Link>
          ))}
          {user ? (
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="ml-2"
            >
              Log out
            </Button>
          ) : (
            <Link to="/login" className="ml-2">
              <Button size="sm">Log in</Button>
            </Link>
          )}
        </nav>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {mobileMenuOpen && (
        <nav className="md:hidden border-t border-border bg-background/95 py-3 shadow-lg backdrop-blur-md animate-in slide-in-from-top-2">
          <div className="container flex flex-col gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                  location.pathname === link.path
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:bg-accent"
                )}
              >
                {link.name}
              </Link>
            ))}
            {user ? (
              <Button
                variant="outline"
                onClick={logout}
                className="mx-4 mt-2"
              >
                Log out
              </Button>
            ) : (
              <Link to="/login" className="mx-4 mt-2">
                <Button className="w-full">Log in</Button>
              </Link>
            )}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
