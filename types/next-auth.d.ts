import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user?: {
      id?: string | null;
      username?: string | null;
      email?: string | null;
    };
    jwt?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    jwt?: string;
  }
}