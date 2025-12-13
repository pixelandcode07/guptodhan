/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from '@/lib/db';
import { User } from '@/lib/modules/user/user.model';
import { generateToken, verifyToken } from '@/lib/utils/jwt';
import { parseExpiresIn } from '@/lib/utils/time';




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
        vendorId: { label: 'Vendor ID', type: 'text' }, // 🔥 Vendor ID added
        name: { label: 'Name', type: 'text' },
        email: { label: 'Email', type: 'text' },
        phoneNumber: { label: 'Phone Number', type: 'text' },
        profilePicture: { label: 'Profile Picture', type: 'text' },
        address: { label: 'Address', type: 'text' },
      },

      async authorize(credentials) {
        if (credentials?.userId && credentials?.role) {
          return {
            id: credentials.userId,
            role: credentials.role,
            accessToken: credentials.accessToken,
            name: credentials.name,
            email: credentials.email,
            phoneNumber: credentials.phoneNumber,
            profilePicture: credentials.profilePicture,
            address: credentials.address,
            vendorId: credentials.vendorId, // 🔥 Passing Vendor ID
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
          console.error('Error during Google sign-in:', error);
          return false;
        }
      }
      return true;
    },

    // 🔥 JWT CALLBACK → ACCESS TOKEN + AUTO REFRESH + USER DATA
    async jwt({ token, user }: { token: any; user: any }) {
      const expiresInString = process.env.JWT_ACCESS_EXPIRES_IN || '1h';
      const expiresInMs = parseExpiresIn(expiresInString);

      // যখন user প্রথমবার sign-in করে
      if (user) {
        const dbUser = user.dbUser || user;


        // ✅ সব user data token এ রাখা হচ্ছে
        token.role = dbUser.role || user.role;
        token.id = dbUser._id?.toString() || user.id;
        token.name = dbUser.name || user.name;
        token.email = dbUser.email || user.email;
        token.phoneNumber = dbUser.phoneNumber || user.phoneNumber;
        token.profilePicture = dbUser.profilePicture || user.profilePicture || user.image;
        token.address = dbUser.address || user.address;
        
        // 🔥 Saving Vendor ID to Token
        token.vendorId = user.vendorId || dbUser.vendorInfo?._id;

        const accessTokenPayload = { userId: token.id, role: token.role };
        const refreshTokenPayload = { userId: token.id, role: token.role };

        // 💡 অ্যাক্সেস এবং রিফ্রেশ টোকেন উভয়ই তৈরি করুন
        token.accessToken = generateToken(
          accessTokenPayload,
          process.env.JWT_ACCESS_SECRET!,
          expiresInString,
        );

        console.log("🔥 Access Token (On Login):", token.accessToken);

        token.refreshToken = generateToken(
          refreshTokenPayload,
          process.env.JWT_REFRESH_SECRET!,
          process.env.JWT_REFRESH_EXPIRES_IN!,
        );

        console.log('✅ Refresh Token Generated (on login).');
        token.accessTokenExpires = Date.now() + expiresInMs;
        return token;
      }

      // --- AUTO REFRESH LOGIC HERE ---
      const isExpired = Date.now() >= (token.accessTokenExpires || 0);

      if (!isExpired) {
        return token; // টোকেন এখনো ভ্যালিড
      }

      // 💡 টোকেন এক্সপায়ারড → fetch করার বদলে সরাসরি এখানেই রিফ্রেশ করুন
      console.log('Access token expired. Attempting refresh internally...');
      try {
        if (!token.refreshToken) {
          throw new Error('Missing refresh token in NextAuth session');
        }

        // 1. Verify the refresh token
        const refreshTokenSecret = process.env.JWT_REFRESH_SECRET;
        if (!refreshTokenSecret) {
          throw new Error('JWT refresh secret not configured');
        }

        // 2. টোকেনটি ভেরিফাই করুন
        const decoded = verifyToken(token.refreshToken, refreshTokenSecret) as {
          userId?: string;
        };
        if (!decoded || !decoded.userId) {
          throw new Error('Invalid refresh token');
        }

        // 3. নতুন Access Token তৈরি করুন
        const accessTokenPayload = { userId: token.id, role: token.role };
        token.accessToken = generateToken(
          accessTokenPayload,
          process.env.JWT_ACCESS_SECRET!,
          expiresInString,
        );
        token.accessTokenExpires = Date.now() + expiresInMs;

        console.log('Access token refreshed internally successfully.');
        return token;
      } catch (error) {
        console.error('Internal token refresh failed:', error);
        // রিফ্রেশ ফেইল করলে ক্লায়েন্টকে লগআউট করার জন্য error সেট করুন
        return { ...token, error: 'RefreshAccessTokenError' };
      }
    },

    // 🔥 SESSION CALLBACK → FRONTEND এ সব DATA পাঠানো
    async session({ session, token }: { session: any; token: any }) {
      if (token.error) {
        session.error = token.error;
      }

      if (session.user) {
        session.user.role = token.role;
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.phoneNumber = token.phoneNumber;
        session.user.image = token.profilePicture;
        session.user.address = token.address;
        session.user.accessToken = token.accessToken;

        // 🔥 VENDOR ID ADDED HERE (Most Important Part)
        session.user.vendorId = token.vendorId;
      }

      session.accessToken = token.accessToken;

      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };