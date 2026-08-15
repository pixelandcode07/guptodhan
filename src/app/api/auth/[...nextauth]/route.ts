/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth, { AuthOptions, SessionStrategy } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from '@/lib/db';
import { User } from '@/lib/modules/user/user.model';
import { generateToken, verifyToken } from '@/lib/utils/jwt';
import { parseExpiresIn } from '@/lib/utils/time';
import { deleteCacheKey } from '@/lib/redis/cache-helpers';
import { CacheKeys } from '@/lib/redis/cache-keys';

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
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
        hasPassword: { label: 'Has Password', type: 'text' },
      },

      async authorize(credentials) {
        if (credentials?.userId && credentials?.role) {
          // ✅ MAGIC FIX: ফ্রন্টএন্ডের ভরসায় না থেকে ডাটাবেস থেকে সরাসরি পাসওয়ার্ড চেক করা হচ্ছে
          await dbConnect();
          const dbUser = await User.findById(credentials.userId).select('+password').lean();

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
            hasPassword: !!dbUser?.password, // 🔥 Guaranteed fix: DataBase confirm!
          };
        }
        return null;
      },
    }),
  ],

  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },

    async signIn({ user, account, profile }: { user: any; account: any; profile?: any }) {
      if (account?.provider === 'google') {
        try {
          await dbConnect();

          let existingUser: any = await User.findOne({ email: user.email })
            .select('+password')
            .lean();

          if (!existingUser) {
            const newUser = await User.create({
              name: user.name,
              email: user.email,
              profilePicture: user.image,
              role: 'user',
              isVerified: true,
              isActive: true,
            });

            existingUser = await User.findById(newUser._id)
              .select('+password')
              .lean();
          }

          existingUser.hasPassword = !!existingUser?.password;
          user.dbUser = existingUser;

          return true;
        } catch (error) {
          console.error('❌ Error during Google sign-in:', error);
          return false;
        }
      }
      return true;
    },

    async jwt({ token, user, trigger, session, account }: { 
      token: any; 
      user: any; 
      trigger?: string; 
      session?: any;
      account?: any;
    }) {
      const expiresInString = process.env.JWT_ACCESS_EXPIRES_IN || '20d';
      const expiresInMs = parseExpiresIn(expiresInString);

      if (trigger === 'update') {
        await dbConnect();
        const latestUser: any = await User.findById(token.id)
          .select("+password hasPassword")
          .lean();

        if (latestUser) {
          token.name = latestUser.name;
          token.email = latestUser.email;
          token.phoneNumber = latestUser.phoneNumber;
          token.profilePicture = latestUser.profilePicture;
          token.address = latestUser.address;
          token.role = latestUser.role;
          token.hasPassword = !!latestUser.password;
          token.isActive = latestUser.isActive;
          token.isDeleted = latestUser.isDeleted;
        }

        if (token.id) {
          await deleteCacheKey(CacheKeys.USER.PROFILE(token.id));
        }

        return token;
      }

      // Initial sign-in
      if (user) {
        const dbUser: any = user.dbUser || user;

        token.role = dbUser.role || user.role || 'user';
        token.id = dbUser._id?.toString() || user.id;
        token.name = dbUser.name || user.name;
        token.email = dbUser.email || user.email;
        token.phoneNumber = dbUser.phoneNumber || user.phoneNumber;
        token.profilePicture = dbUser.profilePicture || user.profilePicture || user.image;
        token.address = dbUser.address || user.address;
        token.vendorId = user.vendorId || dbUser.vendorInfo?._id?.toString();

        // ✅ FIXED: hasPassword will directly come from authorize function which checks DB
        token.hasPassword = user.hasPassword;

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

        token.accessToken = generateToken(
          accessTokenPayload,
          process.env.JWT_ACCESS_SECRET!,
          expiresInString
        );

        token.refreshToken = generateToken(
          refreshTokenPayload,
          process.env.JWT_REFRESH_SECRET!,
          process.env.JWT_REFRESH_EXPIRES_IN!
        );

        token.accessTokenExpires = Date.now() + expiresInMs;
        return token;
      }

      // Auto refresh logic
      const isExpired = Date.now() >= (token.accessTokenExpires || 0);

      if (!isExpired) {
        return token;
      }
      
      try {
        if (!token.refreshToken) {
          throw new Error('Missing refresh token');
        }

        const refreshTokenSecret = process.env.JWT_REFRESH_SECRET;
        if (!refreshTokenSecret) {
          throw new Error('JWT refresh secret not configured');
        }

        const decoded = verifyToken(token.refreshToken, refreshTokenSecret) as {
          userId?: string;
          role?: string;
        };
        
        if (!decoded || !decoded.userId) {
          throw new Error('Invalid refresh token');
        }

        await dbConnect();
        const currentUser = await User.findById(decoded.userId)
          .select('isActive isDeleted role')
          .lean();

        if (!currentUser || currentUser.isDeleted || !currentUser.isActive) {
          throw new Error('User account is no longer valid');
        }

        const accessTokenPayload = { 
          userId: token.id, 
          role: currentUser.role,
          isActive: currentUser.isActive,
        };
        
        token.accessToken = generateToken(
          accessTokenPayload,
          process.env.JWT_ACCESS_SECRET!,
          expiresInString
        );
        
        token.accessTokenExpires = Date.now() + expiresInMs;
        token.role = currentUser.role;

        return token;

      } catch (error: any) {
        console.error('❌ Token refresh failed:', error.message);
        return { ...token, error: 'RefreshAccessTokenError' };
      }
    },

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
        session.user.vendorId = token.vendorId;
        session.user.hasPassword = token.hasPassword ?? false;
        session.user.isActive = token.isActive ?? true;
        session.user.isDeleted = token.isDeleted ?? false;
      }

      session.accessToken = token.accessToken;
      return session;
    },
  },

  session: {
    strategy: 'jwt' as SessionStrategy,
    maxAge: 30 * 24 * 60 * 60,
  },

  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };