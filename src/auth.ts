import Credentials from 'next-auth/providers/credentials';
import NextAuth from 'next-auth';
import type { NextAuthConfig } from 'next-auth';
import { compare } from 'bcrypt';
import UserModel from './models/User.model';
import dbConnect from './lib/mongodb';
import { loginUserSchema } from './lib/schema/auth';

const config: NextAuthConfig = {
  pages: {
    signIn: '/login',
  },

  providers: [
    Credentials({
      credentials: {},

      authorize: async (credentials) => {
        // TODO: wrap with try catch block and use a universal error handler
        const { email, password } = loginUserSchema.parse(credentials);
        await dbConnect();

        const user = await UserModel.findOne({ email });
        if (!user) {
          return null;
        }

        if (user.provider) return null;

        const isValid = await compare(password, user.password);
        if (!isValid) return null;

        return user;
      },
    }),
  ],

  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token._id = user._id.toString();
        token.email = user.email || '';
        token.avatar = user.avatar;
        token.isAdmin = user.isAdmin;
        token.username = user.username || '';
      }
      return token;
    },

    async session({ session, token }) {
      if (session?.user) {
        session.user._id = token._id;
        session.user.email = token.email || '';
        session.user.avatar = token.avatar;
        session.user.username = token.username;
        session.user.isAdmin = token.isAdmin;
      }

      return session;
    },
  },
};

export const { handlers, signIn, signOut, auth } = NextAuth(config);
