'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // 🔴 OLD RENDER LINK REMOVED
    // ✅ NEW VPS DOMAIN (সরাসরি তোমার ডোমেইন ব্যবহার করবে)
    // অথবা .env থেকে NEXT_PUBLIC_SOCKET_URL নিবে
    const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "https://guptodhan.com";

    if (!socketRef.current) {
      console.log('🔌 Connecting to Socket Server at:', SOCKET_URL);

      socketRef.current = io(SOCKET_URL, {
        path: '/socket.io/', // Nginx এর location ব্লকের সাথে মিল রেখে
        transports: ['websocket', 'polling'], // Nginx WebSocket সাপোর্ট করবে
        reconnection: true,
        reconnectionAttempts: 10,
        secure: true, // HTTPS এর জন্য জরুরি
      });

      socketRef.current.on('connect', () => {
        console.log('✅ Socket Connected successfully:', socketRef.current?.id);
        setIsConnected(true);
      });

      socketRef.current.on('disconnect', () => {
        console.log('❌ Socket Disconnected');
        setIsConnected(false);
      });

      socketRef.current.on('connect_error', (err) => {
        console.error('❌ Socket Connection Error:', err.message);
      });

      socketRef.current.on('authenticated', (data) => {
        console.log('✅ Socket authenticated:', data);
      });
    }

    return () => {
      // ক্লিনআপ: কম্পোনেন্ট আনমাউন্ট হলে ডিসকানেক্ট করার দরকার নেই যদি গ্লোবাল স্টেট থাকে
      // তবে চাইলে socketRef.current?.disconnect() করতে পারো
    };
  }, []);

  const sendMessage = useCallback((data: any, onAck: (res: any) => void) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('send_message', data, onAck);
    } else {
      console.warn('⚠️ Cannot send message: Socket not connected');
      onAck({ success: false, error: 'Socket not connected' });
    }
  }, []);

  const authenticate = useCallback((userId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('authenticate', userId);
    }
  }, []);

  const joinConversation = useCallback((conversationId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('join_conversation', {
        conversationId: conversationId
      });
    }
  }, []);

  const checkUserStatus = useCallback((userId: string, callback?: (status: any) => void) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('check_user_status', userId, (status: any) => {
        console.log('📊 User status:', status);
        if (callback) {
          callback(status);
        }
      });
    }
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