'use client';

import { SessionProvider } from 'next-auth/react';

export default function SessionProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider 
      // ✅ এটি ট্যাব সুইচ করলে বা উইন্ডো ফোকাস করলে অটো সেশন রিফেচ বন্ধ করবে
      // এর ফলে আপনার শপিং ইনফো পেজটি আর বারবার লোড হবে না
      refetchOnWindowFocus={false}
    >
      {children}
    </SessionProvider>
  );
}