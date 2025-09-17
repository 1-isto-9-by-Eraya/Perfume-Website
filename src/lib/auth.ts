// src/lib/auth.ts
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/db";
import { isAllowedEmail } from "@/lib/acl";
import { DEFAULT_USER_ROLE, getRoleByEmail } from "@/lib/roles";
import type { UserRole } from "@prisma/client";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },

  providers: [
    GoogleProvider({
      clientId: process.env.OAUTH_CLIENT_ID!,
      clientSecret: process.env.OAUTH_CLIENT_SECRET!,
    }),
  ],

  // OPTIONAL: pretty sign-in page (if you created /signin)
  // pages: { signIn: "/signin" },

  callbacks: {
    // 1) Block non-allowed emails (so public users never get created)
    async signIn({ user }) {
      return isAllowedEmail(user?.email);
    },

    // 2) Always compute the correct role from email; sync DB if mismatched
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;

        // Derive correct role from env-driven helper
        const computedRole = getRoleByEmail(user.email) as UserRole;

        // Get DB role (if user already exists)
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { role: true },
        });

        // If DB role differs, fix it; otherwise keep DB role
        const roleToUse = dbUser?.role ?? DEFAULT_USER_ROLE;
        if (roleToUse !== computedRole) {
          await prisma.user.update({
            where: { id: user.id },
            data: { role: computedRole },
          });
          token.role = computedRole;
        } else {
          token.role = roleToUse;
        }
      }

      if (trigger === "update" && session) {
        token.name = session.user?.name ?? token.name;
        token.email = session.user?.email ?? token.email;
        token.picture = session.user?.image ?? token.picture;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.email = (token.email as string) ?? null;
        session.user.name = (token.name as string) ?? null;
        session.user.image = (token.picture as string) ?? null;
        session.user.role = (token.role as UserRole) ?? DEFAULT_USER_ROLE;
      }
      return session;
    },
  },

  // No events.createUser — we block at signIn now
  events: {},

  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
};
