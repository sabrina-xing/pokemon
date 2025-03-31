import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { JWT } from "next-auth/jwt";
import pool from "../../../lib/db"; // Ensure `db.ts` is set up correctly

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

          // Query MySQL `account` table for user
          const [users]: any[] = await pool.query("SELECT * FROM account WHERE email = ?", [credentials.email]);

          if (users.length === 0) {
            throw new Error("User not found");
          }

          const user = users[0];

          // Validate password
          const isMatch = await bcrypt.compare(credentials.password, user.usr_password);
          if (!isMatch) {
            throw new Error("Invalid credentials");
          }

          return { id: user.uid.toString(), name: user.username, email: user.email };
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
    async jwt({ token, user }: { token: JWT; user?: any }) {
      if (user) {
        token.id = user.id;
        token.username = user.name;
        token.email = user.email ?? "";
        token.uid = user.uid;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: JWT }) {
      session.user = {
        id: token.id as string,
        name: token.username as string,
        email: token.email as string, // Ensure it's a string
        uid: token.uid as string,
        user: token.username as string,
      };
      return session;
    },
  },
  pages: { signIn: "/login" },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

