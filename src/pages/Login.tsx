import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { LogIn, Mail, Lock } from "lucide-react";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(formData.email, formData.password);
      toast.success("Welcome back!");
      navigate(user.role === "ADMIN" ? "/admin" : "/dashboard");
    } catch (error) {
      toast.error("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 dashboard-page-bg transition-colors duration-300">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2">
            <img
              src="/logo.png"
              alt="Interview Haven"
              className="h-10 w-10 rounded-lg object-cover"
            />
            <span className="text-xl font-semibold text-foreground">
              Interview Haven
            </span>
          </Link>
          <p className="text-sm text-muted-foreground">Sign in to your account</p>
        </div>

        <Card className="border-border shadow-lg transition-all duration-300 hover:shadow-xl">
          <CardHeader>
            <CardTitle>Sign in</CardTitle>
            <CardDescription>
              Enter your email and password to continue
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="pl-9 h-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="pl-9 h-10"
                    required
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full h-10"
                disabled={loading}
              >
                <LogIn className="h-4 w-4 mr-2" />
                {loading ? "Signing in…" : "Sign in"}
              </Button>
            </CardContent>
          </form>
          <CardFooter className="flex flex-col gap-4 border-t border-border pt-6">
            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-medium text-primary hover:underline"
              >
                Sign up
              </Link>
            </p>
            <div className="rounded-lg bg-muted/50 p-3 text-center">
              <p className="text-xs font-medium text-muted-foreground mb-1">
                Demo accounts
              </p>
              <p className="text-xs text-muted-foreground">
                User: user@example.com / user123
              </p>
              <p className="text-xs text-muted-foreground">
                Admin: admin@example.com / admin123
              </p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
