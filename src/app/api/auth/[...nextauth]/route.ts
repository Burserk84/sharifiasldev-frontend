import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
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
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/auth/local`,
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
            // Return a clean user object with the JWT
            return {
              id: data.user.id,
              username: data.user.username,
              email: data.user.email,
              jwt: data.jwt,
            };
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
    // This callback runs when the JWT is created
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.jwt = user.jwt;
      }
      return token;
    },
    // This callback runs when the session is accessed
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id; // Ensure the user ID is passed from the token
        session.user.username = token.username;
      }
      session.jwt = token.jwt;
      return session;
    },
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
