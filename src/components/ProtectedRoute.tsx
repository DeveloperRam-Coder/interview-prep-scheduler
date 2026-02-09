
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
  interviewerOnly?: boolean;
}

export const ProtectedRoute = ({ children, adminOnly = false, interviewerOnly = false }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && user.role !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }

  if (interviewerOnly && user.role !== 'INTERVIEWER' && user.role !== 'ADMIN') {
    // Admins can likely access interviewer pages too, or maybe not.
    // SAFE default: users cannot access interviewer pages.
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
