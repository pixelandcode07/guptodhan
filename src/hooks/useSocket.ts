'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const SOCKET_URL = "https://guptodhan-socket-server.onrender.com";

    if (!socketRef.current) {
      socketRef.current = io(SOCKET_URL, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 10,
      });

      socketRef.current.on('connect', () => {
        console.log('✅ Socket Connected:', socketRef.current?.id);
        setIsConnected(true);
      });

      socketRef.current.on('disconnect', () => {
        console.log('❌ Socket Disconnected');
        setIsConnected(false);
      });

      socketRef.current.on('authenticated', (data) => {
        console.log('✅ Socket authenticated:', data);
      });
    }

    return () => {
      // socketRef.current?.disconnect();
    };
  }, []);

  const sendMessage = useCallback((data: any, onAck: (res: any) => void) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('send_message', data, onAck);
    } else {
      onAck({ success: false, error: 'Socket not connected' });
    }
  }, []);

  const authenticate = useCallback((userId: string) => {
    socketRef.current?.emit('authenticate', userId);
  }, []);

  const joinConversation = useCallback((conversationId: string) => {
    socketRef.current?.emit('join_conversation', {
      conversationId: conversationId
    });
  }, []);

  const checkUserStatus = useCallback((userId: string, callback?: (status: any) => void) => {
    socketRef.current?.emit('check_user_status', userId, (status: any) => {
      console.log('📊 User status:', status);
      if (callback) {
        callback(status);
      }
    });
  }, []);

  const on = useCallback((event: string, callback: any) => {
    socketRef.current?.on(event, callback);
  }, []);

  const off = useCallback((event: string, callback?: any) => {
    if (callback) {
      socketRef.current?.off(event, callback);
    } else {
      socketRef.current?.off(event);
    }
  }, []);

  return {
    isConnected,
    sendMessage,
    authenticate,
    joinConversation,
    checkUserStatus,
    on,
    off,
  };
};