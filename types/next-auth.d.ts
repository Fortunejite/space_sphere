/* eslint-disable @typescript-eslint/no-unused-vars */
import { Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface User {
    _id: string;
    email: string;
    username: string;
    password?: string;
    avatar?: string | null;
    isAdmin: boolean;
  }

  interface Session {
    user: {
      _id: string;
      email: string;
      username: string;
      avatar?: string | null;
      isAdmin: boolean;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    _id: string;
    email: string;
    username: string;
    avatar?: string | null;
    isAdmin: boolean;
  }
}
