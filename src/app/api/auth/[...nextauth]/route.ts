import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        try {
          // Populate all the user relations we need in the session
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/auth/local?populate=profilePicture,coverImage`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                identifier: credentials.identifier,
                password: credentials.password,
              }),
            }
          );

          const data = await res.json();
          if (data.user && data.jwt) {
            return { ...data.user, jwt: data.jwt };
          }
          return null;
        } catch (error) {
          console.error("Authorize Error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    // This callback runs when the JWT is created or updated
    async jwt({ token, user, trigger, session }) {
      if (user) {
        // On initial sign-in
        token.id = user.id;
        token.username = user.username;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.jwt = user.jwt;
        token.profilePicture = user.profilePicture;
        token.coverImage = user.coverImage;
      }
      if (trigger === "update" && session) {
        // When client calls `update()`
        token.username = session.username;
        token.firstName = session.firstName;
        token.lastName = session.lastName;
        token.email = session.email;
      }
      return token;
    },
    // This callback runs when the session is accessed
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.username = token.username;
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;
        session.user.email = token.email;
        session.user.profilePicture = token.profilePicture;
        session.user.coverImage = token.coverImage;
      }
      session.jwt = token.jwt;
      return session;
    },
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
