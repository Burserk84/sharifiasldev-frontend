import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        identifier: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials) return null;

        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/auth/local`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              identifier: credentials.identifier,
              password: credentials.password,
            }),
          });

          const data = await res.json();

          if (data.user) {
            // Return user and jwt to be stored in the session
            return { ...data.user, jwt: data.jwt };
          }
          return null;

        } catch (error) {
          console.error("Authorize Error:", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    // This callback is called whenever a JWT is created or updated.
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.jwt = user.jwt;
      }
      return token;
    },
    // This callback is called whenever a session is checked.
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.jwt = token.jwt;
      }
      return session;
    }
  },
  // We are using JWT for session management
  session: {
    strategy: 'jwt',
  },
  // You need to add a NEXTAUTH_SECRET to your .env.local file
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };