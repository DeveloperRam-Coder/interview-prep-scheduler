import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  Calendar,
  FileText,
  User,
  LogOut,
  Users,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface SidebarProps {
  onNavigate?: () => void;
}

const Sidebar = ({ onNavigate }: SidebarProps) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const userLinks = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/my-interviews", icon: Calendar, label: "My Interviews" },
    { to: "/new-request", icon: FileText, label: "New Request" },
    { to: "/profile", icon: User, label: "Profile" },
  ];

  const adminLinks = [
    { to: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/admin/interviews", icon: Calendar, label: "Interviews" },
    { to: "/admin/users", icon: Users, label: "Users" },
    { to: "/profile", icon: User, label: "Profile" },
  ];

  const links = user?.role === "ADMIN" ? adminLinks : userLinks;

  const handleLogout = () => {
    logout();
    navigate("/login");
    onNavigate?.();
  };

  const handleLinkClick = () => {
    onNavigate?.();
  };

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      {/* Brand */}
      <div className="flex h-14 shrink-0 items-center gap-2 border-b border-sidebar-border px-4 lg:px-5">
        <Link to={user?.role === "ADMIN" ? "/admin" : "/dashboard"} onClick={handleLinkClick} className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="h-8 w-8 rounded-lg object-cover" />
          <span className="font-semibold text-sidebar-foreground">Interview Haven</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 p-3 lg:p-4">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              onClick={handleLinkClick}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <Separator className="bg-sidebar-border" />

      {/* User + Logout */}
      <div className="p-3 lg:p-4">
        <div className="mb-2 flex items-center gap-3 rounded-lg px-3 py-2.5">
          <Avatar className="h-9 w-9 border-2 border-sidebar-border">
            <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-sm font-medium">
              {user?.name?.charAt(0).toUpperCase() ?? "U"}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-sidebar-foreground">
              {user?.name ?? "User"}
            </p>
            <p className="truncate text-xs text-sidebar-foreground/70">{user?.role}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 justify-start gap-3 text-sidebar-foreground/80 hover:bg-destructive/10 hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Log out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
