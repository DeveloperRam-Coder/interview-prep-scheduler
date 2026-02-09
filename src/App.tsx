import React from "react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { SocketProvider } from "./contexts/SocketContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/UserDashboard";
import MyInterviews from "./pages/MyInterviews";
import NewRequest from "./pages/NewRequest";
import EditRequest from "./pages/EditRequest";
import AdminDashboard from "./pages/AdminDashboard";
import AdminInterviews from "./pages/AdminInterviews";
import AdminInterviewDetail from "./pages/AdminInterviewDetail";
import AdminUsers from "./pages/AdminUsers";
import Profile from "./pages/Profile";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import InterviewerDashboard from "./pages/InterviewerDashboard";
import AvailabilityManagement from "./pages/AvailabilityManagement";
import InterviewerInterviews from "./pages/InterviewerInterviews";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem storageKey="interview-haven-theme">
      <AuthProvider>
        <SocketProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/about" element={<About />} />
                <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
                <Route path="/my-interviews" element={<ProtectedRoute><MyInterviews /></ProtectedRoute>} />
                <Route path="/new-request" element={<ProtectedRoute><NewRequest /></ProtectedRoute>} />
                <Route path="/edit-request/:id" element={<ProtectedRoute><EditRequest /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
                <Route path="/admin/interviews" element={<ProtectedRoute adminOnly><AdminInterviews /></ProtectedRoute>} />
                <Route path="/admin/interviews/:id" element={<ProtectedRoute adminOnly><AdminInterviewDetail /></ProtectedRoute>} />
                <Route path="/admin/users" element={<ProtectedRoute adminOnly><AdminUsers /></ProtectedRoute>} />
                <Route path="/interviewer/dashboard" element={<ProtectedRoute interviewerOnly><InterviewerDashboard /></ProtectedRoute>} />
                <Route path="/interviewer/availability" element={<ProtectedRoute interviewerOnly><AvailabilityManagement /></ProtectedRoute>} />
                <Route path="/interviewer/interviews" element={<ProtectedRoute interviewerOnly><InterviewerInterviews /></ProtectedRoute>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </SocketProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
