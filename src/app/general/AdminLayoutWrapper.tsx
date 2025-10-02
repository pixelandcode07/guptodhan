'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // সেশন লোড হওয়া পর্যন্ত অপেক্ষা করা হচ্ছে
    if (status === 'loading') return;

    // যদি ইউজার লগইন করা না থাকে বা তার role 'admin' না হয়
    if (status === 'unauthenticated' || session?.user?.role !== 'admin') {
      // তাহলে তাকে লগইন পেজে পাঠিয়ে দেওয়া হচ্ছে
      router.push('/login');
    }
  }, [session, status, router]);

  // যদি সেশন লোড হয় এবং ইউজার অ্যাডমিন হয়, তাহলে পেজটি দেখানো হচ্ছে
  if (status === 'authenticated' && session.user?.role === 'admin') {
    return <>{children}</>;
  }

  // ডিফল্টভাবে লোডিং স্টেট বা কিছুই না দেখানো
  return <div>Loading...</div>; // অথবা একটি সুন্দর লোডিং স্পিনার
}