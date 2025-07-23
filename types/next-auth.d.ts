import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id: number;
    username: string;
    email: string;
    jwt: string;
  }

  interface Session {
    user: {
      id: number;
      username: string;
      email: string;
    };
    jwt: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: number;
    username: string;
    jwt: string;
  }
}
