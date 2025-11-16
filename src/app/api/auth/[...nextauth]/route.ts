/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from '@/lib/db';
import { User } from '@/lib/modules/user/user.model';
import { generateToken } from '@/lib/utils/jwt';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        userId: { label: 'User ID', type: 'text' },
        role: { label: 'Role', type: 'text' },
        accessToken: { label: 'Access Token', type: 'text' },
      },
      async authorize(credentials) {
        if (credentials?.userId && credentials?.role) {
          return {
            id: credentials.userId,
            role: credentials.role,
            accessToken: credentials.accessToken,
          };
        }
        return null;
      },
    }),
  ],

  callbacks: {
    // 🔥 GOOGLE SIGN-IN → USER CREATE/CHECK
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

          user.dbUser = existingUser;
          return true;
        } catch (error) {
          console.error("Error during Google sign-in:", error);
          return false;
        }
      }
      return true;
    },

    // 🔥 JWT CALLBACK → ACCESS TOKEN + AUTO REFRESH
    async jwt({ token, user }: { token: any; user: any }) {
      // যখন user প্রথমবার sign-in করে
      if (user) {
        const dbUser = user.dbUser || user;

        token.role = dbUser.role;
        token.id = dbUser._id?.toString() || user.id;

        // fresh access token generate
        const accessTokenPayload = { userId: token.id, role: token.role };

        token.accessToken = generateToken(
          accessTokenPayload,
          process.env.JWT_ACCESS_SECRET!,
          process.env.JWT_ACCESS_EXPIRES_IN! // example: "1h"
        );

        token.accessTokenExpires = Date.now() + 60 * 60 * 1000; // 1 hour
        return token;
      }

      // --- AUTO REFRESH LOGIC HERE ---
      const isExpired = Date.now() >= token.accessTokenExpires;

      if (!isExpired) {
        return token; // still valid
      }

      // expired → refresh token fetch
      try {
        const res = await fetch(
          process.env.NEXT_PUBLIC_BASE_URL + "/api/v1/auth/refresh-token",
          {
            method: "POST",
            credentials: "include",
          }
        );

        if (!res.ok) throw new Error("Failed to refresh");

        const data = await res.json();

        token.accessToken = data.data.accessToken;
        token.accessTokenExpires = Date.now() + 60 * 60 * 1000;

        return token;
      } catch (error) {
        console.error("Token refresh failed", error);
        return token;
      }
    },

    // 🔥 SESSION CALLBACK → FRONTEND এ TOKEN পাঠানো
    async session({ session, token }: { session: any; token: any }) {
      if (session.user) {
        session.user.role = token.role;
        session.user.id = token.id;
        session.user.accessToken = token.accessToken;
      }

      session.accessToken = token.accessToken;

      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
