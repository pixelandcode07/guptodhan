/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import dbConnect from '@/lib/db';
import { User } from '@/lib/modules/user/user.model';
import { generateToken } from '@/lib/utils/jwt'; // ✅ আপনার JWT ইউটিলিটি ইম্পোর্ট করুন

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }: { user: any; account: any }) {
      if (account.provider === 'google') {
        try {
          await dbConnect();
          let existingUser = await User.findOne({ email: user.email });

          if (!existingUser) {
            existingUser = await User.create({
              name: user.name,
              email: user.email,
              profilePicture: user.image,
              role: 'user',
              isVerified: true,
            });
          }
          // ✅ পরবর্তী callback-এ পুরো ইউজার অবজেক্ট পাস করা হচ্ছে
          user.dbUser = existingUser;
          return true;
        } catch (error) {
          console.error("Error during Google sign-in:", error);
          return false;
        }
      }
      return true;
    },

    async jwt({ token, user }: { token: any; user: any }) {
      // user অবজেক্টটি শুধুমাত্র প্রথমবার লগইনের সময় পাওয়া যায়
      if (user) {
        const dbUser = user.dbUser; // signIn থেকে পাওয়া ইউজার অবজেক্ট
        
        // NextAuth টোকেনে প্রয়োজনীয় তথ্য যোগ করা হচ্ছে
        token.role = dbUser.role;
        token.id = dbUser._id.toString();

        // ✅ FIX: আপনার নিজের backend-এর জন্য custom accessToken তৈরি করা হচ্ছে
        const accessTokenPayload = { userId: dbUser._id, role: dbUser.role };
        token.accessToken = generateToken(
            accessTokenPayload,
            process.env.JWT_ACCESS_SECRET!,
            process.env.JWT_ACCESS_EXPIRES_IN!
        );
      }
      return token;
    },

    async session({ session, token }: { session: any; token: any }) {
      // টোকেন থেকে সেশনে তথ্য যোগ করা হচ্ছে, যা frontend-এ পাওয়া যাবে
      if (session.user) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      
      // ✅ FIX: session অবজেক্টে accessToken যোগ করা হচ্ছে
      session.accessToken = token.accessToken;
      
      return session;
    },
  },
  // pages: {
  //   signIn: '/login', // আপনার লগইন পেজের পাথ
  //   error: '/api/auth/error',
  // },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };