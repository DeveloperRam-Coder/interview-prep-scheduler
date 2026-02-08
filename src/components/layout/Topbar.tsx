import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import NotificationBell from "@/components/notifications/NotificationBell";

interface TopbarProps {
  title: string;
  onMenuClick?: () => void;
}

const Topbar = ({ title, onMenuClick }: TopbarProps) => {
  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-4 border-b border-border bg-card/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-card/80 sm:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </Button>
      <h1 className="flex-1 text-lg font-semibold text-foreground truncate">
        {title}
      </h1>
      <div className="flex items-center gap-1">
        <ThemeToggle />
        <NotificationBell />
      </div>
    </header>
  );
};

export default Topbar;
