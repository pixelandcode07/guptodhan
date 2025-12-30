'use client';

import { useEffect, useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { useSocket } from '@/hooks/useSocket';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';

export default function MessageIcon() {
  const { data: session } = useSession();
  const { isConnected, on, off } = useSocket();
  const [unreadCount, setUnreadCount] = useState(0);

  const token = (session?.user as any)?.accessToken;
  const userId = (session?.user as any)?.id;

  // ✅ Database থেকে unread count fetch করা
  useEffect(() => {
    const fetchCount = async () => {
      if (!token || !userId) {
        console.log('⏳ Waiting for token and userId');
        return;
      }

      try {
        console.log('📥 Fetching unread count for user:', userId);
        const res = await fetch('/api/v1/messages', {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();

        if (data.success) {
          console.log('✅ Unread count:', data.data.unreadCount);
          setUnreadCount(data.data.unreadCount);
        }
      } catch (err) {
        console.error('❌ Error fetching unread count:', err);
      }
    };

    fetchCount();
  }, [token, userId]);

  // ✅ Socket থেকে real-time unread message count update
  useEffect(() => {
    if (!isConnected || !userId) {
      console.log('⏳ Socket not connected or userId missing');
      return;
    }

    console.log('📡 Setting up receive_message listener for unread count');

    const handleNewMsg = (msg: any) => {
      console.log('📬 New message received:', {
        sender: msg.sender?._id || msg.sender,
        receiver: msg.receiver,
        userId: userId,
      });

      // ✅ যদি message আপনার জন্য হয় তাহলে count বাড়ান
      if (msg.receiver === userId || msg.receiver?._id === userId) {
        console.log('✅ Message is for me, incrementing unread count');
        setUnreadCount((prev) => {
          const newCount = prev + 1;
          console.log('📊 Unread count updated:', prev, '→', newCount);
          return newCount;
        });
      }
    };

    on('receive_message', handleNewMsg);

    return () => {
      console.log('🧹 Cleaning up receive_message listener');
      off('receive_message');
    };
  }, [isConnected, userId, on, off]);

  // ✅ Chat page এ যাওয়ার সময় unread count reset করা
  const handleChatClick = async () => {
    try {
      console.log('🔗 User clicked on Chat link');
      // এটা optional - যদি চান তাহলে সব messages mark as read করতে পারেন
      // কিন্তু আমরা এখানে শুধু count reset করছি
      // Actual marking করবে ChatWindow component
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <div>
      <Link
        href="/home/chat"
        onClick={handleChatClick}
        className="flex flex-col justify-center items-center text-[#00005E] font-medium relative group"
      >
        <div className="relative">
          <MessageSquare
            size={20}
            className="flex flex-col justify-center items-center text-[#00005E] font-medium cursor-pointer transition hover:text-blue-600"
          />
          {/* ✅ Unread badge - শুধু unread count > 0 হলে দেখাবে */}
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full animate-pulse shadow-lg">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </div>
        <span className="text-[#00005E] text-[12px]">Chat</span>
      </Link>
    </div>
  );
}