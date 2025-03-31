// types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      id: number;
      username: string;
      bio?: string | null;
      pfp?: string | null;
    };
  }

  interface User {
    uid: number;
    username: string;
  }

  interface JWT {
    uid: number;
    username: string;
  }
}
