/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth, { AuthOptions, SessionStrategy } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from '@/lib/db';
import { User } from '@/lib/modules/user/user.model';
import { generateToken, verifyToken } from '@/lib/utils/jwt';
import { parseExpiresIn } from '@/lib/utils/time';
// 🆕 Redis cache helpers import
import { deleteCacheKey } from '@/lib/redis/cache-helpers';
import { CacheKeys } from '@/lib/redis/cache-keys';

export const authOptions: AuthOptions = {
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
        vendorId: { label: 'Vendor ID', type: 'text' },
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
            vendorId: credentials.vendorId,
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
          
          // ✅ OPTIMIZATION 1: Use lean() for faster query
          let existingUser = await User.findOne({ email: user.email })
            .select('+password') // Include password for check
            .lean(); // 30% faster

          if (!existingUser) {
            // Create new user
            const newUser = await User.create({
              name: user.name,
              email: user.email,
              profilePicture: user.image,
              role: 'user',
              isVerified: true,
              isActive: true, // ✅ Explicitly set
            });

            // ✅ Get created user with lean()
            existingUser = await User.findById(newUser._id)
              .select('+password')
              .lean();
          }

          user.dbUser = existingUser;
          return true;
        } catch (error) {
          console.error('❌ Error during Google sign-in:', error);
          return false;
        }
      }
      return true;
    },

    // 🔥 JWT CALLBACK → ACCESS TOKEN + AUTO REFRESH + USER DATA
    async jwt({ token, user, trigger, session }: { 
      token: any; 
      user: any; 
      trigger?: string; 
      session?: any; 
    }) {
      const expiresInString = process.env.JWT_ACCESS_EXPIRES_IN || '1h';
      const expiresInMs = parseExpiresIn(expiresInString);

      // ✅ Handle session update trigger (profile update)
      if (trigger === 'update' && session) {
        console.log('🔄 Session update triggered');
        
        // Update token with new session data
        if (session.name) token.name = session.name;
        if (session.email) token.email = session.email;
        if (session.phoneNumber) token.phoneNumber = session.phoneNumber;
        if (session.profilePicture) token.profilePicture = session.profilePicture;
        if (session.address) token.address = session.address;

        // 🗑️ Clear user cache on profile update
        if (token.id) {
          await deleteCacheKey(CacheKeys.USER.PROFILE(token.id));
        }

        return token;
      }

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
        token.vendorId = user.vendorId || dbUser.vendorInfo?._id?.toString();

        // ✅ hasPassword সেট করা হচ্ছে
        token.hasPassword = !!dbUser.password || user.hasPassword || false;

        // ✅ isActive and isDeleted flags
        token.isActive = dbUser.isActive ?? true;
        token.isDeleted = dbUser.isDeleted ?? false;

        const accessTokenPayload = { 
          userId: token.id, 
          role: token.role,
          isActive: token.isActive,
        };
        
        const refreshTokenPayload = { 
          userId: token.id, 
          role: token.role 
        };

        // 💡 অ্যাক্সেস এবং রিফ্রেশ টোকেন উভয়ই তৈরি করুন
        token.accessToken = generateToken(
          accessTokenPayload,
          process.env.JWT_ACCESS_SECRET!,
          expiresInString
        );

        console.log('🔥 Access Token Generated (On Login)');

        token.refreshToken = generateToken(
          refreshTokenPayload,
          process.env.JWT_REFRESH_SECRET!,
          process.env.JWT_REFRESH_EXPIRES_IN!
        );

        console.log('✅ Refresh Token Generated (On Login)');
        token.accessTokenExpires = Date.now() + expiresInMs;

        return token;
      }

      // --- AUTO REFRESH LOGIC HERE ---
      const isExpired = Date.now() >= (token.accessTokenExpires || 0);

      if (!isExpired) {
        return token; // টোকেন এখনো ভ্যালিড
      }

      // 💡 টোকেন এক্সপায়ারড → সরাসরি এখানেই রিফ্রেশ করুন
      console.log('⏰ Access token expired. Attempting refresh internally...');
      
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
          role?: string;
        };
        
        if (!decoded || !decoded.userId) {
          throw new Error('Invalid refresh token');
        }

        // ✅ SECURITY CHECK: Verify user still exists and is active
        await dbConnect();
        const currentUser = await User.findById(decoded.userId)
          .select('isActive isDeleted role')
          .lean();

        if (!currentUser || currentUser.isDeleted || !currentUser.isActive) {
          throw new Error('User account is no longer valid');
        }

        // 3. নতুন Access Token তৈরি করুন
        const accessTokenPayload = { 
          userId: token.id, 
          role: currentUser.role, // Use current role from DB
          isActive: currentUser.isActive,
        };
        
        token.accessToken = generateToken(
          accessTokenPayload,
          process.env.JWT_ACCESS_SECRET!,
          expiresInString
        );
        
        token.accessTokenExpires = Date.now() + expiresInMs;
        
        // Update role if changed
        token.role = currentUser.role;

        console.log('✅ Access token refreshed internally successfully');
        return token;

      } catch (error: any) {
        console.error('❌ Internal token refresh failed:', error.message);
        
        // রিফ্রেশ ফেইল করলে ক্লায়েন্টকে লগআউট করার জন্য error সেট করুন
        return { ...token, error: 'RefreshAccessTokenError' };
      }
    },

    // 🔥 SESSION CALLBACK → FRONTEND এ সব DATA পাঠানো
    async session({ session, token }: { session: any; token: any }) {
      // ✅ Handle token refresh error
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

        // 🔥 VENDOR ID ADDED HERE
        session.user.vendorId = token.vendorId;
        
        // hasPassword টোকেন থেকে সেশনে পাস করা
        session.user.hasPassword = token.hasPassword ?? false;

        // ✅ Account status flags
        session.user.isActive = token.isActive ?? true;
        session.user.isDeleted = token.isDeleted ?? false;
      }

      session.accessToken = token.accessToken;

      return session;
    },
  },

  // ✅ Session strategy - Fixed type
  session: {
    strategy: 'jwt' as SessionStrategy,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // ✅ Pages configuration
  pages: {
    signIn: '/auth/signin', // Custom sign-in page
    error: '/auth/error',   // Error page
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };