// src/types/next-auth.d.ts
import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      vendorId?: string | null;
      email?: string | null;
      phone?: string | null; 
      image?: string | null;
    };
  }
}