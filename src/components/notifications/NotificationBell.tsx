import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '@/hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';
import type { Notification } from '@/hooks/useNotifications';

function NotificationItem({
  n,
  onRead,
  onNavigate,
}: {
  n: Notification;
  onRead: (id: string) => void;
  onNavigate: (id: string) => void;
}) {
  const handleClick = () => {
    if (!n.readAt) onRead(n.id);
    if (n.referenceId) onNavigate(n.referenceId);
  };

  return (
    <DropdownMenuItem
      onClick={handleClick}
      className={`flex flex-col items-start gap-1 cursor-pointer ${!n.readAt ? 'bg-muted/50' : ''}`}
    >
      <span className="font-medium text-sm">{n.title}</span>
      {n.body && <span className="text-xs text-muted-foreground line-clamp-2">{n.body}</span>}
      <span className="text-xs text-muted-foreground">
        {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
      </span>
    </DropdownMenuItem>
  );
}

export default function NotificationBell() {
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  const handleNavigate = (interviewId: string) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role === 'ADMIN') {
      navigate('/admin/interviews');
    } else {
      navigate('/my-interviews');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-2 py-2 border-b">
          <span className="font-semibold text-sm">Notifications</span>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={markAllAsRead}>
              Mark all read
            </Button>
          )}
        </div>
        <ScrollArea className="h-[280px]">
          {notifications.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No notifications
            </div>
          ) : (
            notifications.map((n) => (
              <NotificationItem
                key={n.id}
                n={n}
                onRead={markAsRead}
                onNavigate={handleNavigate}
              />
            ))
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
