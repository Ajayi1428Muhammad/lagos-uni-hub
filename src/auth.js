import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google, 
    GitHub
    ],
  pages: {
    signIn: "/signin", 
  },
  callbacks:{
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      } 
      return session;
   },
    },
});
