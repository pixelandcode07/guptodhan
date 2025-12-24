'use client';

import { useEffect, useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { useSocket } from '@/hooks/useSocket';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function MessageIcon() {
  const { data: session } = useSession();
  const { isConnected, on, off } = useSocket();
  const [unreadCount, setUnreadCount] = useState(0);

  const token = (session?.user as any)?.accessToken;
  const userId = (session?.user as any)?.id;

  // ১. ডাটাবেস থেকে আনরিড কাউন্ট নিয়ে আসা
  useEffect(() => {
    const fetchCount = async () => {
      if (!token) return;
      try {
        // ✅ পাথটি আপনার ব্যাকএন্ড অনুযায়ী আপডেট করা হয়েছে
        const res = await fetch('/api/v1/messages', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json(); // ✅ টাইপো ঠিক করা হয়েছে
        if (data.success) setUnreadCount(data.data.unreadCount);
      } catch (err) {
        console.error('Error fetching unread count:', err);
      }
    };
    fetchCount();
  }, [token]);

  // ২. সকেটের মাধ্যমে রিয়েল-টাইম আপডেট
  useEffect(() => {
    if (isConnected && userId) {
      const handleNewMsg = (msg: any) => {
        // যদি মেসেজটি আপনার জন্য হয়, তবে ব্যাজ সংখ্যা ১ বাড়ান
        if (msg.receiver === userId || msg.receiver?._id === userId) {
          setUnreadCount(prev => prev + 1);
        }
      };

      on('receive_message', handleNewMsg);
      return () => {
        off('receive_message');
      };
    }
  }, [isConnected, userId, on, off]);

  return (
    <Link href="/home/chat" className="flex flex-col justify-center items-center text-[#00005E] font-medium relative group">
      <div className="relative">
        <MessageSquare size={20} className="group-hover:text-green-600 transition-colors" />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </div>
      <span className="text-[#00005E] text-[12px]">Chat</span>
    </Link>
  );
}