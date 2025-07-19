import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/auth/local`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                identifier: credentials.identifier,
                password: credentials.password,
              }),
            }
          );

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
      },
    }),
  ],
  callbacks: {
    // This callback adds data to the token
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.jwt = user.jwt; // Make sure the JWT from Strapi is added to the token
      }
      return token;
    },
    // This callback adds data from the token to the session
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.username = token.username;
        session.jwt = token.jwt; // Make sure the JWT is added to the final session object
      }
      return session;
    },
  // You need to add a NEXTAUTH_SECRET to your .env.local file
  secret: process.env.NEXTAUTH_SECRET,
}});

export { handler as GET, handler as POST };
