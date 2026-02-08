import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL =
  import.meta.env.VITE_API_URL != null && import.meta.env.VITE_API_URL !== ''
    ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '')
    : window.location.origin;

export function useSocket(token: string | null) {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!token) {
      setSocket(null);
      return;
    }
    const s = io(SOCKET_URL, { auth: { token } });
    setSocket(s);
    return () => {
      s.disconnect();
      setSocket(null);
    };
  }, [token]);

  return socket;
}
