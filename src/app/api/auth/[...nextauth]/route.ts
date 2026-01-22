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
      // ✅ FIX: Add authorization parameters
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
    // ✅ FIXED: Redirect callback to prevent 404
    async redirect({ url, baseUrl }) {
      // If the url is relative, use it
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      
      // If the url is on the same origin, use it
      if (new URL(url).origin === baseUrl) return url;
      
      // Otherwise redirect to home
      return baseUrl;
    },

    // 🔥 GOOGLE SIGN-IN → USER CREATE/CHECK
    async signIn({ user, account, profile }: { user: any; account: any; profile?: any }) {
      if (account?.provider === 'google') {
        try {
          await dbConnect();
          
          let existingUser = await User.findOne({ email: user.email })
            .select('+password')
            .lean();

          if (!existingUser) {
            console.log('✅ Creating new user from Google sign-in');
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
            
            console.log('✅ New user created:', existingUser?.email);
          } else {
            console.log('✅ Existing user found:', existingUser.email);
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

    async jwt({ token, user, trigger, session, account }: { 
      token: any; 
      user: any; 
      trigger?: string; 
      session?: any;
      account?: any;
    }) {
      const expiresInString = process.env.JWT_ACCESS_EXPIRES_IN || '20d';
      const expiresInMs = parseExpiresIn(expiresInString);

      // ✅ Handle session update trigger
      if (trigger === 'update' && session) {
        console.log('🔄 Session update triggered');
        
        if (session.name) token.name = session.name;
        if (session.email) token.email = session.email;
        if (session.phoneNumber) token.phoneNumber = session.phoneNumber;
        if (session.profilePicture) token.profilePicture = session.profilePicture;
        if (session.address) token.address = session.address;

        if (token.id) {
          await deleteCacheKey(CacheKeys.USER.PROFILE(token.id));
        }

        return token;
      }

      // ✅ Initial sign-in
      if (user) {
        const dbUser = user.dbUser || user;

        token.role = dbUser.role || user.role || 'user';
        token.id = dbUser._id?.toString() || user.id;
        token.name = dbUser.name || user.name;
        token.email = dbUser.email || user.email;
        token.phoneNumber = dbUser.phoneNumber || user.phoneNumber;
        token.profilePicture = dbUser.profilePicture || user.profilePicture || user.image;
        token.address = dbUser.address || user.address;
        token.vendorId = user.vendorId || dbUser.vendorInfo?._id?.toString();
        token.hasPassword = !!dbUser.password || user.hasPassword || false;
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

        console.log('✅ Tokens generated for user:', token.email);
        return token;
      }

      // Auto refresh logic
      const isExpired = Date.now() >= (token.accessTokenExpires || 0);

      if (!isExpired) {
        return token;
      }

      console.log('⏰ Access token expired. Attempting refresh...');
      
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

        console.log('✅ Access token refreshed');
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
    // ✅ FIX: Remove newUser page if not needed
  },

  secret: process.env.NEXTAUTH_SECRET,
  
  // ✅ Enable debug in development
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };