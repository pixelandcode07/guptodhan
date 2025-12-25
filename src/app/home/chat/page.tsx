'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { MessageCircle, ShoppingBag } from 'lucide-react';
import ChatWindow from '@/app/components/ChatWindow';
import LoadingChat from '@/app/components/LoadingChat';
import Image from 'next/image';

interface Conversation {
  _id: string;
  ad: { title: string; images?: string[] };
  participants: Array<{ _id: string; name: string; profilePicture?: string }>;
  lastMessage?: { content: string; createdAt: string };
  updatedAt: string;
}

export default function ChatPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [showChatOnly, setShowChatOnly] = useState(false);

  const userId = (session?.user as any)?.id;
  const token = (session?.user as any)?.accessToken;

  useEffect(() => {
    if (status === 'loading') return;

    if (status === 'unauthenticated' || !token || !userId) {
      router.push('/');
    } else {
      fetchConversations();
    }
  }, [status, token, userId, router]);

  const fetchConversations = async () => {
    try {
      const res = await fetch('/api/v1/conversations', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setConversations(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  // Mobile detection for chat view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setShowChatOnly(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // loading
  if (status === 'loading' || loading) {
    return <LoadingChat />
  }

  if (!token || !userId) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* ====================== LEFT: CHAT LIST ====================== */}
      <div
        className={`${showChatOnly ? 'hidden' : 'block'} md:block w-full md:w-96 bg-white border-r border-gray-200 flex flex-col`}
      >
        <div className='flex justify-between items-center border-b border-gray-200'>
          <div>
            {/* Logo */}
            <Link href={'/'}>
              <Image src="/img/logo.png" width={130} height={44} alt="logo" />
            </Link>
          </div>
          <div className="p-4 ">
            <h1 className="text-xl font-bold flex items-center gap-2">
              <MessageCircle className="text-green-600" /> Chats
            </h1>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <Card className="m-4 p-8 text-center text-gray-500">
              <p>No conversations yet.</p>
              <Link href="/home/buyandsell" className="text-green-600 font-medium mt-2 block">
                Browse ads to start chatting
              </Link>
            </Card>
          ) : (
            <div className="divide-y divide-gray-100">
              {conversations.map((conv) => {
                const otherUser = conv.participants.find((p) => p._id !== userId);
                if (!otherUser) return null;

                return (
                  <div
                    key={conv._id}
                    onClick={() => {
                      setSelectedConv(conv);
                      if (window.innerWidth < 768) {
                        setShowChatOnly(true);
                      }
                    }}
                    className="p-4 hover:bg-gray-50 cursor-pointer transition flex items-center gap-4"
                  >
                    <Avatar className="h-12 w-12 border">
                      <AvatarImage src={otherUser.profilePicture} />
                      <AvatarFallback>{otherUser.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{otherUser.name}</h3>
                      <p className="text-sm text-green-600 flex items-center gap-1">
                        <ShoppingBag size={14} /> {conv.ad.title}
                      </p>
                      {conv.lastMessage && (
                        <p className="text-xs text-gray-500 truncate mt-1">
                          {conv.lastMessage.content}
                        </p>
                      )}
                    </div>
                    <div className="text-right text-xs text-gray-400">
                      {new Date(conv.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ====================== RIGHT: CHAT WINDOW ====================== */}
      <div className={`${showChatOnly ? 'block' : 'hidden md:block'} flex-1 flex flex-col bg-gray-50`}>
        {selectedConv ? (
          <ChatWindow
            conversationId={selectedConv._id}
            userId={userId}
            receiverId={selectedConv.participants.find((p) => p._id !== userId)!._id}
            userName={selectedConv.participants.find((p) => p._id !== userId)!.name}
            adTitle={selectedConv.ad.title}
            token={token}
            onBack={() => setShowChatOnly(false)}
            isMobileView={showChatOnly}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center pt-36">
              <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg">Select a chat to start messaging</p>
              <p className="text-sm mt-2">Click on any conversation from the left</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


// 'use client';

// import { useEffect, useState } from 'react';
// import { useSession } from 'next-auth/react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { Card } from '@/components/ui/card';
// import { MessageCircle, ShoppingBag } from 'lucide-react';

// interface Conversation {
//   _id: string;
//   ad: { title: string; images: string[] };
//   participants: any[];
//   lastMessage?: { content: string; createdAt: string };
//   updatedAt: string;
// }

// export default function ChatListPage() {
//   const { data: session, status } = useSession();
//   const router = useRouter();
//   const [conversations, setConversations] = useState<Conversation[]>([]);
//   const [loading, setLoading] = useState(true);

//   const userId = (session?.user as any)?.id;
//   const token = (session?.user as any)?.accessToken;

//   useEffect(() => {
//     if (status === 'unauthenticated') router.push('/login');
//     if (status === 'authenticated') fetchConversations();
//   }, [status]);

//   const fetchConversations = async () => {
//     try {
//       const res = await fetch('/api/v1/conversations', {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       const data = await res.json();
//       if (data.success) setConversations(data.data);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) return <div className="p-10 text-center">Loading chats...</div>;

//   return (
//     <div className="max-w-4xl mx-auto p-4 min-h-screen">
//       <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
//         <MessageCircle className="text-green-600" /> My Chats
//       </h1>

//       {conversations.length === 0 ? (
//         <Card className="p-10 text-center text-gray-500">
//           <p>No conversations found.</p>
//           <Link href="/home/buyandsell" className="text-green-600 font-medium mt-2 block">
//             Browse ads to start chatting
//           </Link>
//         </Card>
//       ) : (
//         <div className="space-y-3">
//           {conversations.map((conv) => {
//             const otherUser = conv.participants.find(p => p._id !== userId);
//             return (
//               <Link key={conv._id} href={`/home/chat/${conv._id}`}>
//                 <Card className="p-4 hover:bg-gray-50 transition flex items-center justify-between border-l-4 border-l-transparent hover:border-l-green-600">
//                   <div className="flex items-center gap-4">
//                     <Avatar className="h-12 w-12 border">
//                       <AvatarImage src={otherUser?.profilePicture} />
//                       <AvatarFallback>{otherUser?.name?.[0]}</AvatarFallback>
//                     </Avatar>
//                     <div>
//                       <h3 className="font-bold text-gray-900">{otherUser?.name}</h3>
//                       <p className="text-sm text-green-600 flex items-center gap-1 font-medium">
//                         <ShoppingBag size={14} /> {conv.ad?.title}
//                       </p>
//                       {conv.lastMessage && (
//                         <p className="text-sm text-gray-500 line-clamp-1 mt-1">
//                           {conv.lastMessage.content}
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                   <div className="text-right">
//                     <p className="text-[10px] text-gray-400">
//                       {new Date(conv.updatedAt).toLocaleDateString()}
//                     </p>
//                   </div>
//                 </Card>
//               </Link>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }
