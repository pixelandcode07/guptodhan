// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\components\SessionProviderWrapper.tsx
'use client';
import { SessionProvider } from 'next-auth/react';

export default function SessionProviderWrapper({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}