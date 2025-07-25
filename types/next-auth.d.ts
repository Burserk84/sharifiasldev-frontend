import "next-auth";
import "next-auth/jwt";
import { StrapiImage } from "@/lib/definitions";

declare module "next-auth" {
  // Extends the User object returned from authorize
  interface User {
    id: number;
    username: string;
    email: string;
    firstName?: string | null;
    lastName?: string | null;
    profilePicture?: StrapiImage | null;
    coverImage?: StrapiImage | null;
    jwt: string;
  }

  // Extends the session object available to the client
  interface Session {
    user: {
      id: number;
      username: string;
      email: string;
      firstName?: string | null;
      lastName?: string | null;
      profilePicture?: StrapiImage | null;
      coverImage?: StrapiImage | null;
    };
    jwt: string;
  }
}

declare module "next-auth/jwt" {
  // Extends the token object used in callbacks
  interface JWT {
    id: number;
    username: string;
    firstName?: string | null;
    lastName?: string | null;
    profilePicture?: StrapiImage | null;
    coverImage?: StrapiImage | null;
    jwt: string;
  }
}
