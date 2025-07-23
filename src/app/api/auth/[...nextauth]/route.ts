import NextAuth, { AuthOptions } from "next-auth"; // Import AuthOptions
import CredentialsProvider from "next-auth/providers/credentials";

// 1. Define and export your auth configuration object
export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // ... (your existing authorize logic)
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
      // On the initial sign-in, the 'user' object from the 'authorize' function is available
      if (user) {
        token.id = user.id;
        token.username = user.username; // Ensure username is added to the token
        token.jwt = user.jwt;
      }
      return token;
    },
    // This callback runs when the session is accessed
    async session({ session, token }) {
      // Pass the properties from the token to the final session object
      if (session.user) {
        session.user.id = token.id;
        session.user.username = token.username; // Ensure username is added to the session.user
      }
      session.jwt = token.jwt;
      return session;
    },
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
};

// 2. Use the configuration to create the handler
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
