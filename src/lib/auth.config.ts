import { NextAuthConfig } from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import clientPromise from '@/server/db/mongodb';
import User from '@/server/models/User';
import dbConnect from '@/server/db';

export const authConfig: NextAuthConfig = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/sign-in',
    error: '/api/auth/error',
  },
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) return false;

      try {
        await dbConnect();

        // Update or create user with tracking info
        const existingUser = await User.findOne({ email: user.email });

        if (existingUser) {
          // Update login tracking
          existingUser.lastLoginAt = new Date();
          existingUser.loginCount += 1;

          // Update name if it's missing and now provided
          if (!existingUser.name && user.name) {
            existingUser.name = user.name;
          }

          await existingUser.save();
        } else {
          // Create new user (adapter handles this, we just set defaults)
          await User.findOneAndUpdate(
            { email: user.email },
            {
              $setOnInsert: {
                name: user.name || user.email?.split('@')[0] || 'User',
                status: 'active',
                role: 'user',
                loginCount: 1,
                lastLoginAt: new Date(),
                preferences: {},
              },
            },
            { upsert: true, new: true }
          );
        }

        return true;
      } catch (error) {
        console.error('SignIn callback error:', error);
        return false;
      }
    },
    async jwt({ token, user, account }) {
      if (user) {
        await dbConnect();
        const dbUser = await User.findOne({ email: user.email });

        if (dbUser) {
          token.userId = dbUser._id.toString();
          token.status = dbUser.status;
          token.role = dbUser.role;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.userId as string;
        session.user.status = token.status as string;
        session.user.role = token.role as string;
      }

      return session;
    },
  },
  events: {
    async signIn({ user }) {
      // Additional tracking on sign-in if needed
      console.log(`User signed in: ${user.email}`);
    },
  },
};
