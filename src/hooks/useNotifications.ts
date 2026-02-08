import { useCallback, useEffect, useState } from 'react';
import api from '@/lib/api';
import { useSocket } from './useSocket';

export interface Notification {
  id: string;
  type: string;
  title: string;
  body?: string;
  referenceId: string;
  readAt: string | null;
  createdAt: string;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const socket = useSocket(token);

  const fetchNotifications = useCallback(async () => {
    try {
      const [listRes, countRes] = await Promise.all([
        api.get('/notifications?limit=20'),
        api.get('/notifications/unread-count'),
      ]);
      const list = listRes.data?.data ?? listRes.data ?? [];
      setNotifications(Array.isArray(list) ? list : []);
      setUnreadCount(countRes.data?.count ?? 0);
    } catch {
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    if (!socket) return;
    const handler = (n: Notification) => {
      setNotifications((prev) => [n, ...prev]);
      setUnreadCount((c) => c + 1);
    };
    socket.on('notification:new', handler);
    return () => {
      socket.off('notification:new', handler);
    };
  }, [socket]);

  const markAsRead = useCallback(async (id: string) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, readAt: new Date().toISOString() } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch {
      // ignore
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await api.patch('/notifications/read-all');
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, readAt: n.readAt ?? new Date().toISOString() }))
      );
      setUnreadCount(0);
    } catch {
      // ignore
    }
  }, []);

  return { notifications, unreadCount, loading, fetchNotifications, markAsRead, markAllAsRead };
}
