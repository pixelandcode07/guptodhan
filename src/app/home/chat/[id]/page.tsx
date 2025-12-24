// // ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\app\home\chat\[id]\page.tsx
// 'use client';

// import { useEffect, useState } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import { useSession } from 'next-auth/react';
// import ChatWindow from '@/app/components/ChatWindow';

// interface Conversation {
//   _id: string;
//   ad: { title: string };
//   participants: Array<{ _id: string; name: string; profilePicture?: string }>;
//   lastMessage?: string;
// }

// export default function ChatPage() {
//   const params = useParams();
//   const router = useRouter();
//   const { data: session, status } = useSession();

//   const conversationId = params?.id ? (params.id as string) : null;

//   const [conversation, setConversation] = useState<Conversation | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   // 🔍 STEP 1: Log initial state
//   useEffect(() => {
//     console.log('=== 🔍 CHAT PAGE LOADED ===');
//     console.log('conversationId:', conversationId);
//     console.log('session status:', status);
//     console.log('session user:', session?.user ? 'EXISTS' : 'NOT FOUND');
//   }, []);

//   // Fetch conversation details
//   useEffect(() => {
//     // 🔍 STEP 2: Check conversationId
//     if (!conversationId) {
//       console.error('❌ STEP 2: conversationId is NULL or UNDEFINED');
//       setError('Invalid conversation ID');
//       setLoading(false);
//       return;
//     }
//     console.log('✅ STEP 2: conversationId exists:', conversationId);

//     // 🔍 STEP 3: Check session loading
//     if (status === 'loading') {
//       console.log('⏳ STEP 3: Session is still loading...');
//       return;
//     }
//     console.log('✅ STEP 3: Session loading complete. Status:', status);

//     // 🔍 STEP 4: Check authentication
//     if (status !== 'authenticated' || !session?.user) {
//       console.error('❌ STEP 4: User NOT authenticated');
//       console.log('  - status:', status);
//       console.log('  - session?.user:', session?.user ? 'EXISTS' : 'NOT FOUND');
//       router.push('/login');
//       return;
//     }
//     console.log('✅ STEP 4: User is authenticated');

//     // 🔍 STEP 5: Get token
//     const token = (session.user as any).accessToken;
//     if (!token) {
//       console.error('❌ STEP 5: Token NOT found in session');
//       console.log('  - session.user:', session.user);
//       setError('Access token not found');
//       setLoading(false);
//       return;
//     }
//     console.log('✅ STEP 5: Token exists (length:', token.length, ')');

//     // 🔍 STEP 6: Fetch conversation
//     const fetchConversation = async () => {
//       try {
//         console.log('\n📡 === FETCHING CONVERSATION ===');
//         console.log('URL: /api/v1/conversations/' + conversationId);
//         console.log('Method: GET');
//         console.log('Authorization: Bearer [TOKEN]');

//         const response = await fetch(
//           `/api/v1/conversations/${conversationId}`,
//           {
//             method: 'GET',
//             headers: {
//               'Authorization': `Bearer ${token}`,
//               'Content-Type': 'application/json',
//             },
//           }
//         );

//         console.log('\n📊 === RESPONSE RECEIVED ===');
//         console.log('Status Code:', response.status);
//         console.log('Status Text:', response.statusText);

//         if (!response.ok) {
//           console.error('❌ Response NOT OK');
//           const errorData = await response.json();
//           console.error('Error response:', errorData);
//           throw new Error(
//             errorData.message || `Failed to fetch conversation (${response.status})`
//           );
//         }

//         console.log('✅ Response OK');

//         const data = await response.json();

//         console.log('\n📋 === RESPONSE DATA STRUCTURE ===');
//         console.log('Full response:', data);
//         console.log('data.success:', data.success);
//         console.log('data.data:', data.data);
//         console.log('data.data type:', typeof data.data);

//         // 🔍 STEP 7: Validate response structure
//         if (!data.data) {
//           console.error('❌ STEP 7: data.data is MISSING or NULL');
//           console.log('  - Response keys:', Object.keys(data));
//           throw new Error('Invalid response structure - missing data field');
//         }
//         console.log('✅ STEP 7: data.data exists');

//         const conv = data.data;

//         console.log('\n🔍 === CONVERSATION OBJECT CHECK ===');
//         console.log('_id:', conv._id);
//         console.log('ad:', conv.ad);
//         console.log('participants:', conv.participants);
//         console.log('participants type:', typeof conv.participants);
//         console.log('participants is array:', Array.isArray(conv.participants));
//         console.log('participants length:', Array.isArray(conv.participants) ? conv.participants.length : 'NOT AN ARRAY');

//         // 🔍 STEP 8: Validate participants
//         if (!conv.participants) {
//           console.error('❌ STEP 8a: participants is NULL or UNDEFINED');
//           console.error('  Available fields:', Object.keys(conv));
//           throw new Error('participants is missing from response');
//         }
//         console.log('✅ STEP 8a: participants exists');

//         if (!Array.isArray(conv.participants)) {
//           console.error('❌ STEP 8b: participants is NOT an ARRAY');
//           console.log('  - participants type:', typeof conv.participants);
//           console.log('  - participants value:', conv.participants);
//           throw new Error('participants is not an array');
//         }
//         console.log('✅ STEP 8b: participants is an array');

//         if (conv.participants.length === 0) {
//           console.error('❌ STEP 8c: participants array is EMPTY');
//           throw new Error('participants array is empty');
//         }
//         console.log('✅ STEP 8c: participants array has', conv.participants.length, 'items');

//         console.log('\n👥 === PARTICIPANTS DATA ===');
//         conv.participants.forEach((p: any, i: number) => {
//           console.log(`Participant ${i}:`, p);
//         });

//         // 🔍 STEP 9: All validations passed
//         console.log('\n✅ === ALL VALIDATIONS PASSED ===');
//         setConversation(conv);
//       } catch (err) {
//         console.error('\n❌ === ERROR OCCURRED ===');
//         console.error('Error type:', typeof err);
//         console.error('Error message:', err instanceof Error ? err.message : String(err));
//         console.error('Full error:', err);
//         setError(
//           err instanceof Error ? err.message : 'Failed to load conversation'
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchConversation();
//   }, [conversationId, session, status, router]);

//   // 🔍 RENDER LOGS
//   console.log('\n🎨 === RENDER STATE ===');
//   console.log('loading:', loading);
//   console.log('conversation:', conversation ? 'EXISTS' : 'NULL');
//   console.log('error:', error);
//   console.log('status:', status);

//   // ✅ Show loading while checking authentication
//   if (status === 'loading' || loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading conversation...</p>
//         </div>
//       </div>
//     );
//   }

//   // ✅ Show error if no conversation ID
//   if (!conversationId) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center">
//           <p className="text-red-600 text-lg font-semibold">❌ Invalid conversation ID</p>
//           <p className="text-gray-600 mt-2">Check browser console for details</p>
//           <button
//             onClick={() => router.back()}
//             className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//           >
//             Go Back
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // ✅ Show login prompt if not authenticated
//   if (status !== 'authenticated') {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center">
//           <p className="text-gray-600 text-lg font-semibold">Please log in to access chat</p>
//           <button
//             onClick={() => router.push('/login')}
//             className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
//           >
//             Go to Login
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // ✅ Show error if conversation failed to load
//   if (!conversation) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center">
//           <p className="text-red-600 text-lg font-semibold">
//             ❌ {error || 'Conversation not found'}
//           </p>
//           <p className="text-gray-600 mt-2">Check browser console for error details</p>
//           <pre className="mt-4 bg-red-50 p-4 rounded text-left text-sm overflow-auto max-w-md">
//             {error}
//           </pre>
//           <button
//             onClick={() => router.back()}
//             className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//           >
//             Go Back
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // ✅ Get user ID and token from NextAuth session
//   const userId = (session?.user as any)?.id;
//   const token = (session?.user as any)?.accessToken;

//   // ✅ Validate user data
//   if (!userId || !token) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center">
//           <p className="text-red-600 text-lg font-semibold">
//             User data not found. Please log in again.
//           </p>
//           <button
//             onClick={() => router.push('/login')}
//             className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
//           >
//             Go to Login
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // ✅ Validate participants exist
//   if (!conversation.participants || conversation.participants.length === 0) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center">
//           <p className="text-red-600 text-lg font-semibold">
//             ❌ Invalid conversation data
//           </p>
//           <p className="text-gray-600 mt-2">No participants found in conversation</p>
//           <pre className="mt-4 bg-red-50 p-4 rounded text-left text-sm">
//             participants: {JSON.stringify(conversation.participants)}
//           </pre>
//           <button
//             onClick={() => router.back()}
//             className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//           >
//             Go Back
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // Find the other participant
//   const otherParticipant = conversation.participants.find(
//     (p) => p._id !== userId
//   );

//   // ✅ Validate other participant exists
//   if (!otherParticipant) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center">
//           <p className="text-red-600 text-lg font-semibold">
//             Other participant not found in conversation
//           </p>
//           <pre className="mt-4 bg-red-50 p-4 rounded text-left text-sm">
//             {JSON.stringify(conversation.participants, null, 2)}
//           </pre>
//           <button
//             onClick={() => router.back()}
//             className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//           >
//             Go Back
//           </button>
//         </div>
//       </div>
//     );
//   }

//   console.log('\n✅ === RENDERING CHATWINDOW ===');
//   console.log('Passing props:');
//   console.log('  - conversationId:', conversationId);
//   console.log('  - userId:', userId);
//   console.log('  - receiverId:', otherParticipant._id);
//   console.log('  - userName:', otherParticipant.name);
//   console.log('  - adTitle:', conversation.ad.title);
//   console.log('  - token: [PRESENT]');

//   return (
//     <ChatWindow
//       conversationId={conversationId}
//       userId={userId}
//       receiverId={otherParticipant._id}
//       userName={otherParticipant.name}
//       adTitle={conversation.ad.title}
//       token={token}
//     />
//   );
// }


import React from 'react'

export default function page() {
  return (
    <div>
      No need
    </div>
  )
}
