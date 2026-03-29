import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { validateCredentials } from "./user-store";

const resolvedSecret =
  process.env.NEXTAUTH_SECRET ||
  (process.env.NODE_ENV !== "production" ? "autodiag-dev-secret-change-me" : undefined);

export const authOptions: NextAuthOptions = {
  secret: resolvedSecret,
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Email and Password",
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim();
        const password = credentials?.password;

        if (!email || !password) {
          return null;
        }

        const user = await validateCredentials(email, password);

        if (!user) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub || session.user.id;
      }
      return session;
    },
  },
};
