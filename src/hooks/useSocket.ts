import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // ✅ আপনার Render.com এর সঠিক লিঙ্কটি এখানে দিন
    const RENDER_SOCKET_URL = "https://guptodhan-socket-server.onrender.com";

    if (!socketRef.current) {
      // সরাসরি Render URL এ কানেক্ট হবে, কোনো রিলেটিভ পাথ (/api/socket) নয়
      socketRef.current = io(RENDER_SOCKET_URL, {
        transports: ['websocket'], 
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 2000,
      });

      socketRef.current.on('connect', () => {
        console.log('✅ Connected to Render Socket Server');
        setIsConnected(true);
      });

      socketRef.current.on('connect_error', (err) => {
        console.log('⚠️ Socket Connection Error:', err.message);
        setIsConnected(false);
      });

      socketRef.current.on('disconnect', () => {
        console.log('❌ Socket Disconnected');
        setIsConnected(false);
      });
    }

    return () => {
      // Component unmount হলে cleanup (অপশনাল)
      // socketRef.current?.disconnect();
    };
  }, []);

  const sendMessage = (data: any, onAck: (res: any) => void) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('send_message', data, onAck);
    } else {
      onAck({ success: false, error: 'Chat server is starting or disconnected. Please wait.' });
    }
  };

  return {
    isConnected,
    authenticate: (uid: string) => socketRef.current?.emit('authenticate', uid),
    joinConversation: (cid: string) => socketRef.current?.emit('join_conversation', cid),
    sendMessage,
    on: (ev: string, cb: any) => { socketRef.current?.on(ev, cb); },
    off: (ev: string) => { socketRef.current?.off(ev); },
  };
};