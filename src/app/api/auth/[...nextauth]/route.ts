// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\app\api\auth\[...nextauth]\route.ts

import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import dbConnect from '@/lib/db';
import { User } from '@/lib/modules/user/user.model';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    // আপনি যদি চান, ভবিষ্যতে আপনার ম্যানুয়াল ইমেইল/পাসওয়ার্ড লগইনকেও
    // CredentialsProvider ব্যবহার করে NextAuth-এর অধীনে নিয়ে আসতে পারবেন।
  ],
  callbacks: {
    // এই ফাংশনটি Google দিয়ে সফলভাবে সাইন-ইন করার পর কল হবে
    async signIn({ user, account }: { user: any; account: any }) {
      if (account.provider === 'google') {
        try {
          await dbConnect();
          
          // চেক করা হচ্ছে এই ইমেইলের কোনো ইউজার আগে থেকেই আমাদের ডেটাবেসে আছে কিনা
          const existingUser = await User.findOne({ email: user.email });

          if (!existingUser) {
            // যদি না থাকে, তাহলে Google থেকে পাওয়া তথ্য দিয়ে নতুন ইউজার তৈরি করা হচ্ছে
            await User.create({
              name: user.name,
              email: user.email,
              profilePicture: user.image,
              role: 'user',
              isVerified: true, // Google দিয়ে লগইন করলে ইমেইল ভেরিফাইড ধরা হয়
            });
          }
          return true; // সাইন-ইন সফল
        } catch (error) {
          console.error("Error during Google sign-in and user creation:", error);
          return false; // সাইন-ইন ব্যর্থ
        }
      }
      return true;
    },
    // JWT এবং সেশনে ইউজারের role এবং id যোগ করার জন্য
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        // ডেটাবেস থেকে ইউজারের সম্পূর্ণ তথ্য নিয়ে আসা হচ্ছে
        // এটি নিশ্চিত করে যে সেশনে সবসময় লেটেস্ট ডেটা থাকবে
        const dbUser = await User.findOne({ email: user.email });
        if (dbUser) {
          token.role = dbUser.role;
          token.id = dbUser._id.toString();
        }
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (session.user) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login', // আপনার লগইন পেজের পাথ (যদি থাকে)
    error: '/api/auth/error', // অথেনটিকেশন এরর হলে এই পেজে রিডাইরেক্ট হবে
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };