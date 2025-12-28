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
  const { isConnected, authenticate, joinConversation, sendMessage, on, off, checkUserStatus } = useSocket();
  const [messages, setMessages] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [receiverStatus, setReceiverStatus] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ✅ Socket initialize করা
  useEffect(() => {
    console.log('=== CHATWINDOW MOUNTED ===');
    console.log('conversationId:', conversationId);
    console.log('userId:', userId);
    console.log('receiverId:', receiverId);
    console.log('isConnected:', isConnected);

    if (!isConnected) {
      console.log('⏳ Socket not connected yet, waiting...');
      return;
    }

    if (!conversationId) {
      console.log('❌ No conversationId provided');
      return;
    }

    console.log('✅ Socket is connected and conversationId exists');
    console.log('👤 Authenticating user:', userId);
    authenticate(userId);

    console.log('💬 Joining conversation:', conversationId);
    joinConversation(conversationId);

    console.log('🔍 Checking receiver status:', receiverId);
    checkUserStatus(receiverId);

    console.log('📥 Fetching old messages...');
    fetchMessages();
  }, [isConnected, conversationId, userId, receiverId]);

  // ✅ পুরনো মেসেজ ফেচ করা
  const fetchMessages = async () => {
    try {
      console.log('📥 API Call: GET /api/v1/conversations/' + conversationId + '/messages');
      
      const res = await fetch(
        `/api/v1/conversations/${conversationId}/messages`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('📊 Response Status:', res.status, res.statusText);

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to fetch messages');
      }

      const data = await res.json();
      console.log('📋 Response Data:', data);

      if (data.success && Array.isArray(data.data)) {
        console.log('✅ Messages fetched successfully:', data.data.length, 'messages');
        console.log('Messages:', data.data);
        setMessages(data.data);
      } else {
        console.warn('⚠️ Unexpected response format:', data);
        setMessages([]);
      }
    } catch (error) {
      console.error('❌ Error fetching messages:', error);
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Real-time message listener (FIXED: removed messages from dependency)
  useEffect(() => {
    console.log('📡 Setting up receive_message listener');

    const handleReceiveMessage = (msg: any) => {
      console.log('📬 ===== MESSAGE RECEIVED FROM SOCKET =====');
      console.log('Message ID:', msg._id);
      console.log('Message Content:', msg.content);
      console.log('Sender:', msg.sender);
      console.log('Receiver:', msg.receiver);
      console.log('Created At:', msg.createdAt);
      console.log('Full message:', msg);

      // ✅ Using closure - prev has the latest messages state
      setMessages((prev) => {
        console.log('Current messages in state:', prev.length);

        // ✅ Check for duplicate
        const isDuplicate = prev.some((m) => m._id === msg._id);
        if (isDuplicate) {
          console.log('⚠️ Duplicate message detected, skipping');
          return prev;
        }

        console.log('✅ Adding message to state');
        const updatedMessages = [...prev, msg];
        console.log('✅ Messages updated. New total:', updatedMessages.length);
        return updatedMessages;
      });
    };

    on('receive_message', handleReceiveMessage);

    // ✅ Cleanup function
    return () => {
      console.log('🧹 Cleaning up receive_message listener');
      off('receive_message');
    };
  }, [on, off]); // ✅ FIXED: removed 'messages' from dependency array

  // ✅ Online status listener
  useEffect(() => {
    console.log('📡 Setting up user_online_status listener');

    const handleStatusChange = (status: any) => {
      console.log('📡 Status update received:', status);

      if (status.userId === receiverId) {
        console.log(
          `✅ ${receiverId} is ${status.isOnline ? 'ONLINE' : 'OFFLINE'}`
        );
        setReceiverStatus(status);
      }
    };

    on('user_online_status', handleStatusChange);

    return () => {
      console.log('🧹 Cleaning up user_online_status listener');
      off('user_online_status');
    };
  }, [receiverId, on, off]);

  // ✅ অপঠিত মেসেজগুলো "seen" মার্ক করা (Chat page খুললে)
  useEffect(() => {
    const markMessagesAsRead = async () => {
      if (messages.length === 0 || !token) {
        console.log('⏳ No messages to mark or no token');
        return;
      }

      try {
        console.log('📋 ===== MARKING MESSAGES AS READ =====');
        
        // ✅ আপনার জন্য যে মেসেজগুলো এসেছে এবং unread সেগুলো খুঁজা
        const unreadMessages = messages.filter(
          (m) => (m.receiver === userId || m.receiver?._id === userId) && !m.isRead
        );

        console.log('📬 Unread messages for me:', unreadMessages.length);

        if (unreadMessages.length === 0) {
          console.log('✅ No unread messages');
          return;
        }

        // ✅ প্রতিটা অপঠিত মেসেজ এর জন্য API call করা
        for (const msg of unreadMessages) {
          try {
            console.log('✅ Marking message as read:', msg._id);
            
            const res = await fetch('/api/v1/messages/read', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                messageId: msg._id,
              }),
            });

            if (res.ok) {
              const resData = await res.json();
              console.log('✅ Message marked as read:', msg._id);
            } else {
              console.error('❌ Failed to mark message as read:', msg._id);
            }
          } catch (err) {
            console.error('❌ Error marking message as read:', msg._id, err);
          }
        }
        
        console.log('✅ ===== ALL MESSAGES MARKED AS READ =====');
      } catch (error) {
        console.error('❌ Error in markMessagesAsRead:', error);
      }
    };

    // ✅ 500ms delay দিয়ে চালানো (যাতে user দেখতে পায়)
    const timer = setTimeout(() => {
      markMessagesAsRead();
    }, 500);

    return () => clearTimeout(timer);
  }, [messages, token, userId]);

  // ✅ Auto scroll to bottom
  useEffect(() => {
    console.log('⬇️ Auto scrolling to bottom');
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ✅ Send message function
  const handleSend = () => {
    console.log('=== SEND BUTTON CLICKED ===');
    console.log('Input value:', inputValue);
    console.log('Is sending:', isSending);
    console.log('Socket connected:', isConnected);

    if (!inputValue.trim()) {
      console.warn('⚠️ Input is empty');
      return;
    }

    if (isSending) {
      console.warn('⚠️ Already sending a message');
      return;
    }

    if (!isConnected) {
      console.warn('⚠️ Socket is not connected');
      alert('Socket connection lost. Please wait for reconnection.');
      return;
    }

    setIsSending(true);

    const messageData = {
      conversationId,
      senderId: userId,
      receiverId,
      content: inputValue.trim(),
    };

    console.log('📤 ===== SENDING MESSAGE =====');
    console.log('Conversation ID:', messageData.conversationId);
    console.log('Sender ID:', messageData.senderId);
    console.log('Receiver ID:', messageData.receiverId);
    console.log('Content:', messageData.content);

    sendMessage(messageData, (res: any) => {
      console.log('💬 ===== SEND CALLBACK RECEIVED =====');
      console.log('Response:', res);

      setIsSending(false);

      if (res.success) {
        console.log('✅ Message sent successfully');
        console.log('Message saved with ID:', res.data?._id);
        setInputValue(''); // Clear input
        console.log('✅ Input cleared, waiting for socket receive_message event...');
      } else {
        console.error('❌ Error sending message:', res.error);
        alert('Failed to send message: ' + res.error);
      }
    });
  };

  // ✅ Format last seen time
  const formatLastSeen = (date: string | Date) => {
    const now = new Date();
    const lastSeen = new Date(date);
    const diffMs = now.getTime() - lastSeen.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return lastSeen.toLocaleDateString();
  };

  const isMobile =
    typeof window !== 'undefined' && window.innerWidth < 768;

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      window.history.back();
    }
  };

  // ✅ Show loading state
  if (isLoading) {
    return (
      <div className="flex flex-col h-screen bg-gray-50">
        {/* HEADER */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-4 shadow-sm">
          {(isMobile || isMobileView) && onBack && (
            <button
              onClick={handleBack}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
          )}

          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-green-100 text-green-700">
              {userName[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <h2 className="font-semibold text-gray-900">{userName}</h2>
            <p className="text-xs text-gray-500">{adTitle}</p>
          </div>

          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${
                isConnected ? 'bg-green-500' : 'bg-gray-400'
              } animate-pulse`}
            />
            <span className="text-xs text-gray-600">
              {isConnected ? 'Connected' : 'Connecting...'}
            </span>
          </div>
        </div>

        {/* LOADING */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading messages...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* ====================== HEADER ====================== */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-4 shadow-sm">
        {(isMobile || isMobileView) && onBack && (
          <button
            onClick={handleBack}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <ArrowLeft className="w-6 h-6 md:hidden" />
          </button>
        )}

        <Avatar className="h-10 w-10 flex-shrink-0">
          <AvatarFallback className="bg-blue-100 text-blue-500 text-lg">
            {userName[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <h2 className="font-semibold text-gray-900 truncate">{userName}</h2>
          <p className="text-xs text-gray-500 truncate">{adTitle}</p>

          {/* ✅ Online Status with Last Seen */}
          <div className="text-xs mt-1">
            {receiverStatus?.isOnline ? (
              <p className="text-green-600 font-medium">🟢 Online</p>
            ) : (
              <p className="text-gray-400">
                {receiverStatus?.lastSeen
                  ? `Last seen ${formatLastSeen(receiverStatus.lastSeen)}`
                  : 'Offline'}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full ${
              isConnected ? 'bg-green-500' : 'bg-gray-400'
            } animate-pulse`}
          />
          <span className="text-xs text-gray-600">
            {isConnected ? 'Connected' : 'Connecting...'}
          </span>
        </div>
      </div>

      {/* ====================== MESSAGES AREA ====================== */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-gradient-to-b from-gray-50 to-gray-100">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 mt-20">
            <p className="text-lg">No messages yet</p>
            <p className="text-sm mt-2">Start the conversation!</p>
          </div>
        ) : (
          messages.map((m, i) => {
            const isMe =
              (m.sender?._id === userId) || (m.sender === userId);

            return (
              <div
                key={m._id || i}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}
              >
                <div
                  className={`max-w-[70%] px-4 py-3 rounded-2xl shadow-md relative ${
                    isMe
                      ? 'bg-blue-500 text-white rounded-br-none'
                      : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm leading-relaxed break-words">
                    {m.content}
                  </p>
                  <p
                    className={`text-[10px] mt-2 text-right ${
                      isMe ? 'text-green-100' : 'text-gray-400'
                    }`}
                  >
                    {new Date(m.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                    {/* ✅ Seen status indicator */}
                    {isMe && m.isRead && (
                      <span className="ml-1">✓✓</span>
                    )}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* ====================== INPUT AREA ====================== */}
      <div className="bg-white border-t border-gray-200 px-4 py-4">
        <div className="flex items-center gap-3">
          <input
            type="text"
            className="flex-1 bg-gray-100 rounded-full px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all disabled:opacity-50"
            placeholder={
              isConnected ? 'Type a message...' : 'Connecting...'
            }
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) =>
              e.key === 'Enter' && !e.shiftKey && handleSend()
            }
            disabled={!isConnected || isSending}
          />
          <Button
            onClick={handleSend}
            disabled={!isConnected || isSending || !inputValue.trim()}
            className="rounded-full bg-blue-500 hover:bg-blue-500 w-12 h-12 p-0 shadow-lg transition-all active:scale-95"
          >
            {isSending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
} 