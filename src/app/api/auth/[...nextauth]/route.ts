/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import dbConnect from '@/lib/db';
import { User } from '@/lib/modules/user/user.model';
import { generateToken } from '@/lib/utils/jwt'; 

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
      if (user) {
        const dbUser = user.dbUser;
        
        // NextAuth 
        token.role = dbUser.role;
        token.id = dbUser._id.toString();

        const accessTokenPayload = { userId: dbUser._id, role: dbUser.role };
        token.accessToken = generateToken(
            accessTokenPayload,
            process.env.JWT_ACCESS_SECRET!,
            process.env.JWT_ACCESS_EXPIRES_IN!
        );
      }
      console.log("access tokens", token)
      return token;
    },

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