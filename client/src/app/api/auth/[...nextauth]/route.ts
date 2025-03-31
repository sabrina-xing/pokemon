import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { JWT } from "next-auth/jwt";
import pool from "../../../lib/db"; // Ensure `db.ts` is set up correctly
// import { update } from "next-auth/react";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Missing email or password");
          }

          const [users]: any[] = await pool.query(
            "SELECT * FROM account WHERE email = ?",
            [credentials.email]
          );

          if (users.length === 0) {
            throw new Error("User not found");
          }

          const user = users[0];

          const isMatch = await bcrypt.compare(
            credentials.password,
            user.usr_password
          );
          if (!isMatch) {
            throw new Error("Invalid credentials");
          }

          return {
            id: user.uid.toString(),
            name: user.username,
            email: user.email,
            bio: user.bio ?? "",
            pfp: user.pfp ?? "",
          };
        } catch (error) {
          console.error("Login Error:", error);
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user, trigger, session }: { token: JWT; user?: any; trigger?: string; session?: any }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.bio = user.bio;
        token.pfp = user.pfp;
      }

      if (trigger === "update" && session?.name) {
        // Note, that `session` can be any arbitrary object, remember to validate it!
        token.name = session.name
      }
      
      return token;
    },
    async session({ session, token, trigger, newSession }: { session: any; token: JWT; trigger?: string; newSession?: any }) {
      session.user = {
        id: token.id as string,
        name: token.name as string,
        email: token.email as string,
        bio: token.bio as string,
        pfp: token.pfp as string,
      };

      if (trigger === "update" && newSession?.name) {
        // You can update the session in the database if it's not already updated.
        // await adapter.updateUser(session.user.id, { name: newSession.name })

        // Make sure the updated value is reflected on the client
        session.name = newSession.name
      }
      return session;
    },
  },
  pages: { signIn: "/login" },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
