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
import { LogIn, Mail, Lock, CheckCircle2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

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
      if (user.role === "ADMIN") {
        navigate("/admin");
      } else if (user.role === "INTERVIEWER") {
        navigate("/interviewer/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex overflow-hidden bg-background">
      {/* Left Side: Visual/Hero (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-primary items-center justify-center p-12">
        {/* Animated Background Blobs */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />

        {/* Dynamic Mesh Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-indigo-600 to-purple-700 opacity-90" />

        <div className="relative z-10 w-full max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8 text-white"
          >
            <div className="space-y-4">
              <h1 className="text-5xl font-bold tracking-tight leading-tight">
                Level up your <span className="text-secondary tracking-tighter">interview</span> game.
              </h1>
              <p className="text-indigo-100 text-lg">
                Join thousands of students and professionals who use Interview Haven
                to land their dream jobs.
              </p>
            </div>

            <div className="space-y-4 pt-10">
              {[
                "Real-time interview scheduling",
                "Direct connection with industry experts",
                "Comprehensive feedback and reports",
                "Resource library for tech preparation"
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + (idx * 0.1) }}
                  className="flex items-center gap-3"
                >
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20">
                    <CheckCircle2 className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-indigo-50 font-medium">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-12 lg:p-16 relative">
        <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
          <div className="text-center lg:text-left space-y-2">
            <Link to="/" className="inline-flex lg:hidden items-center gap-2 mb-6">
              <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
                <LogIn className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-foreground">
                Interview Haven
              </span>
            </Link>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Welcome back
            </h2>
            <p className="text-muted-foreground">
              Please enter your details to sign in
            </p>
          </div>

          <Card className="border-none shadow-none bg-transparent">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="pl-10 h-12 bg-muted/50 border-transparent focus:bg-background focus:border-primary transition-all rounded-xl"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link to="#" className="text-xs text-primary hover:underline">Forgot password?</Link>
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="pl-10 h-12 bg-muted/50 border-transparent focus:bg-background focus:border-primary transition-all rounded-xl"
                      required
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold transition-all duration-300 hover:scale-[1.01] rounded-xl shadow-lg shadow-primary/20"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in…
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    Sign in <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </Button>
            </form>
          </Card>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              Start your journey today
            </Link>
          </p>

          <div className="pt-8">
            <div className="rounded-2xl bg-muted/50 p-6 border border-border/50">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">
                Quick Access (Demo)
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] text-muted-foreground">Candidate</p>
                  <p className="text-xs font-medium truncate">user@example.com</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-muted-foreground">Admin</p>
                  <p className="text-xs font-medium truncate">admin@example.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

