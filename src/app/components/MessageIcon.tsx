'use client';

import { useEffect, useState } from 'react';
import { MessageCircle, MessageSquare, MessagesSquare } from 'lucide-react';
import { useSocket } from '@/hooks/useSocket';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { motion } from 'framer-motion';

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
    <div className="fixed bottom-25 right-7 md:bottom-20 md:right-10 z-9999">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <motion.button
            className="relative flex flex-col items-center justify-center w-16 h-16 bg-white border-2 border-blue-100 shadow-[0_10px_40px_rgba(0,0,0,0.15)] rounded-full outline-none"
            animate={{
              rotateY: [0, 0, 180, 180, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <div className="relative w-10 h-10">
              <Image
                src="/img/chat.png"
                alt="Chat"
                fill
                className="object-contain"
              />

              {/* Unread Badge */}
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold h-6 w-6 flex items-center justify-center rounded-full border-2 border-white shadow-lg z-10">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </div>
          </motion.button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          side="top"
          align="end"
          className="w-64 p-2 mb-4 rounded-2xl shadow-2xl border-blue-50 animate-in slide-in-from-bottom-2"
        >
          {/* WhatsApp Support Option */}
          <DropdownMenuItem asChild>
            <Link
              href="https://wa.me/8801816500600?text=Welcome%20,%20How%20can%20we%20help%20you?"
              target="_blank"
              className="flex items-center gap-3 p-3 cursor-pointer hover:bg-green-50 rounded-xl transition-colors group"
            >
              <div className="bg-green-500 p-2 rounded-lg text-white group-hover:scale-110 transition-transform">
                <MessageCircle size={20} />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-gray-800 text-sm">WhatsApp Support</span>
                <span className="text-[10px] text-gray-500">Instant help on WhatsApp</span>
              </div>
            </Link>
          </DropdownMenuItem>

          <div className="h-[1px] bg-gray-100 my-1" />

          {/* Website Internal Chat Option */}
          <DropdownMenuItem asChild>
            <Link
              href="/home/chat"
              className="flex items-center gap-3 p-3 cursor-pointer hover:bg-blue-50 rounded-xl transition-colors group"
            >
              <div className="bg-blue-600 p-2 rounded-lg text-white group-hover:scale-110 transition-transform relative">
                <MessagesSquare size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 w-2.5 h-2.5 rounded-full border border-white" />
                )}
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-gray-800 text-sm">Live Chat</span>
                <span className="text-[10px] text-gray-500">Chat with our agents</span>
              </div>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}