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
    // Apni chaile apnar ager Credentials (email/password) provider-tio ekhane jog korte paren
  ],
  callbacks: {
    // Ei function-ti Google diye shofolvabe sign-in korar por call hobe
    async signIn({ user, account }: { user: any; account: any }) {
      if (account.provider === 'google') {
        try {
          await dbConnect();
          
          // Check kora hocche ei email-er kono user age thekei amader database-e ache kina
          const existingUser = await User.findOne({ email: user.email });

          if (!existingUser) {
            // Jodi na thake, tahole Google theke paowa tottho diye notun user toiri kora hocche
            await User.create({
              name: user.name,
              email: user.email,
              profilePicture: user.image,
              role: 'user', // Default role
              isVerified: true, // Google diye login korle amra dhore nicchi email verified
              // Jhetu password nei, tai ei field-ti baad dewa hocche
            });
          }
          return true; // Sign-in shofol
        } catch (error) {
          console.error("Error during Google sign-in and user creation:", error);
          return false; // Sign-in byartho
        }
      }
      return true; // Onnano provider er jonno
    },
    // JWT ebong session-e user-er role ebong id jog korar jonno
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        // Database theke user-er shompurno tottho niye asha hocche
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
    signIn: '/login', // Apnar login page-er path
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };