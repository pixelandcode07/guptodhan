'use client';

import { useEffect, useState, useRef } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { useSocket } from '@/hooks/useSocket';
import { Button } from '@/components/ui/button';

interface ChatWindowProps {
  conversationId: string;
  userId: string;
  receiverId: string;
  userName: string;
  adTitle: string;
  token: string;
}

export default function ChatWindow({ conversationId, userId, receiverId, userName, adTitle, token }: ChatWindowProps) {
  const { isConnected, authenticate, joinConversation, sendMessage, on, off } = useSocket();
  const [messages, setMessages] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ১. সকেট কানেক্ট হলে অটোমেটিক জয়েন এবং মেসেজ ফেচ
  useEffect(() => {
    if (isConnected) {
      authenticate(userId);
      joinConversation(conversationId);
      fetchMessages();
    }
  }, [isConnected, conversationId, userId]);

  // ২. রিয়েল-টাইম মেসেজ রিসিভ করা
  useEffect(() => {
    const handleReceive = (msg: any) => {
      setMessages((prev) => [...prev, msg]);
    };

    on('receive_message', handleReceive);

    return () => {
      off('receive_message');
    };
  }, [on, off]);

  // ৩. মেসেজ আসার পর অটোমেটিক নিচে স্ক্রল করা
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ৪. পুরনো মেসেজগুলো ডাটাবেস থেকে নিয়ে আসা
  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/v1/conversations/${conversationId}/messages`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setMessages(data.data);
    } catch (e) {
      console.error('Fetch error:', e);
    }
  };

  // ৫. মেসেজ পাঠানো
  const handleSend = () => {
    if (!inputValue.trim() || isSending || !isConnected) return;
    setIsSending(true);

    const data = { 
      conversationId, 
      senderId: userId, 
      receiverId, 
      content: inputValue.trim() 
    };

    sendMessage(data, (res: any) => {
      setIsSending(false);
      if (res.success) {
        setInputValue('');
      } else {
        alert("Error: " + (res.error || "Unknown error"));
      }
    });
  };

  return (
    <div className="flex flex-col h-[600px] w-full max-w-2xl mx-auto bg-white border rounded-xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="p-4 bg-green-600 text-white flex justify-between items-center">
        <div>
          <h2 className="font-bold">{userName}</h2>
          <p className="text-xs opacity-80">{adTitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`w-3 h-3 rounded-full ${isConnected ? 'bg-white animate-pulse' : 'bg-red-400'}`}></span>
          <span className="text-xs">{isConnected ? 'Connected' : 'Connecting...'}</span>
        </div>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((m, i) => {
          // ✅ সলভড লজিক: sender আইডি স্ট্রিং অথবা অবজেক্ট যাই হোক না কেন এটি কাজ করবে
          const isMe = (m.sender?._id === userId) || (m.sender === userId);

          return (
            <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] p-3 rounded-2xl shadow-sm ${
                isMe 
                  ? 'bg-green-600 text-white rounded-br-none' // আপনার মেসেজ (ডানে)
                  : 'bg-white border rounded-bl-none text-gray-800' // অন্যের মেসেজ (বামে)
              }`}>
                <p className="text-sm">{m.content}</p>
                <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-green-100' : 'text-gray-400'}`}>
                  {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t">
        <div className="flex gap-2">
          <input
            className="flex-1 bg-gray-100 border-none rounded-full px-5 py-3 outline-none focus:ring-2 focus:ring-green-500 text-sm disabled:opacity-50"
            placeholder={isConnected ? "Type a message..." : "Connecting to chat..."}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            disabled={!isConnected || isSending} 
          />
          <Button 
            onClick={handleSend} 
            disabled={!isConnected || isSending || !inputValue.trim()}
            className="rounded-full bg-green-600 hover:bg-green-700 w-12 h-12 p-0 flex items-center justify-center transition-all active:scale-95"
          >
            {isSending ? <Loader2 className="animate-spin" /> : <Send size={20} />}
          </Button>
        </div>
      </div>
    </div>
  );
}