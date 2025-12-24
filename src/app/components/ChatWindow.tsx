'use client';

import { useEffect, useState, useRef } from 'react';
import { Send, Loader2, ArrowLeft } from 'lucide-react';
import { useSocket } from '@/hooks/useSocket';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ChatWindowProps {
  conversationId: string;
  userId: string;
  receiverId: string;
  userName: string;
  adTitle: string;
  token: string;
  onBack?: () => void;
  isMobileView?: boolean;
}

export default function ChatWindow({
  conversationId,
  userId,
  receiverId,
  userName,
  adTitle,
  token,
  onBack,
  isMobileView = false,
}: ChatWindowProps) {
  const { isConnected, authenticate, joinConversation, sendMessage, on, off } = useSocket();
  const [messages, setMessages] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // সকেট লজিক একই থাকবে...
  useEffect(() => {
    if (isConnected) {
      authenticate(userId);
      joinConversation(conversationId);
      fetchMessages();
    }
  }, [isConnected, conversationId, userId]);

  useEffect(() => {
    const handleReceive = (msg: any) => {
      setMessages((prev) => [...prev, msg]);
    };
    on('receive_message', handleReceive);
    return () => off('receive_message');
  }, [on, off]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/v1/conversations/${conversationId}/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setMessages(data.data);
    } catch (e) {
      console.error('Fetch messages error:', e);
    }
  };

  const handleSend = () => {
    if (!inputValue.trim() || isSending || !isConnected) return;

    setIsSending(true);
    const data = {
      conversationId,
      senderId: userId,
      receiverId,
      content: inputValue.trim(),
    };

    sendMessage(data, (res: any) => {
      setIsSending(false);
      if (res.success) {
        setInputValue('');
      } else {
        alert('Error: ' + (res.error || 'Failed to send message'));
      }
    });
  };

  // মোবাইল কিনা চেক (ফলব্যাক হিসেবে)
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  // ব্যাক হ্যান্ডলার: প্রপস থাকলে সেটা ব্যবহার করো, না থাকলে window.history.back()
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      window.history.back();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* ====================== HEADER ====================== */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-4 shadow-sm">
        {/* ব্যাক বাটন শুধু মোবাইলে এবং onBack প্রপস থাকলে দেখাবে */}
        {(isMobile || isMobileView) && onBack && (
          <button
            onClick={handleBack}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <ArrowLeft className="w-6 h-6 md:hidden " />
          </button>
        )}

        <Avatar className="h-10 w-10 flex-shrink-0">
          <AvatarFallback className="bg-green-100 text-green-700 text-lg">
            {userName[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <h2 className="font-semibold text-gray-900 truncate">{userName}</h2>
          <p className="text-xs text-gray-500 truncate">{adTitle}</p>
        </div>

        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full ${
              isConnected ? 'bg-green-500' : 'bg-gray-400'
            } animate-pulse`}
          />
          <span className="text-xs text-gray-600">
            {isConnected ? 'Online' : 'Connecting...'}
          </span>
        </div>
      </div>

      {/* বাকি সব একই থাকবে – Messages Area & Input Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-gradient-to-b from-gray-50 to-gray-100">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 mt-20">
            <p className="text-lg">No messages yet</p>
            <p className="text-sm mt-2">Start the conversation!</p>
          </div>
        ) : (
          messages.map((m, i) => {
            const isMe = (m.sender?._id === userId) || (m.sender === userId);

            return (
              <div
                key={i}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}
              >
                <div
                  className={`max-w-[70%] px-4 py-3 rounded-2xl shadow-md relative ${
                    isMe
                      ? 'bg-green-600 text-white rounded-br-none'
                      : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{m.content}</p>
                  <p
                    className={`text-[10px] mt-2 text-right ${
                      isMe ? 'text-green-100' : 'text-gray-400'
                    }`}
                  >
                    {new Date(m.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 px-4 py-4">
        <div className="flex items-center gap-3">
          <input
            type="text"
            className="flex-1 bg-gray-100 rounded-full px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all disabled:opacity-50"
            placeholder={isConnected ? 'Type a message...' : 'Connecting...'}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            disabled={!isConnected || isSending}
          />
          <Button
            onClick={handleSend}
            disabled={!isConnected || isSending || !inputValue.trim()}
            className="rounded-full bg-green-600 hover:bg-green-700 w-12 h-12 p-0 shadow-lg transition-all active:scale-95"
          >
            {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </Button>
        </div>
      </div>
    </div>
  );
}