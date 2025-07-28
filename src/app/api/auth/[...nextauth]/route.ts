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
    async jwt({ token, user }) {
      if (user) {
        // On initial sign-in, we only get basic info and the JWT
        token.jwt = user.jwt;

        // Make a second API call to get the user's full profile with images
        try {
          const profileRes = await fetch(
            `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users/me?populate=profilePicture,coverImage`,
            {
              headers: { Authorization: `Bearer ${user.jwt}` },
            }
          );
          const profileData = await profileRes.json();

          // Add all profile data to the token
          token.id = profileData.id;
          token.username = profileData.username;
          token.email = profileData.email;
          token.firstName = profileData.firstName;
          token.lastName = profileData.lastName;
          token.profilePicture = profileData.profilePicture;
          token.coverImage = profileData.coverImage;
        } catch (error) {
          console.error("Failed to fetch full user profile:", error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.username = token.username;
        session.user.email = token.email;
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;
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
