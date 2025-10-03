// // src/lib/auth.ts
// import type { NextAuthOptions } from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
// import { PrismaAdapter } from "@next-auth/prisma-adapter";
// import { prisma } from "@/lib/db";
// import { isAllowedEmail } from "@/lib/acl";
// import { DEFAULT_USER_ROLE, getRoleByEmail } from "@/lib/roles";
// import type { UserRole } from "@prisma/client";

// export const authOptions: NextAuthOptions = {
//   adapter: PrismaAdapter(prisma),
//   session: { strategy: "jwt" },

//   providers: [
//     GoogleProvider({
//       clientId: process.env.OAUTH_CLIENT_ID!,
//       clientSecret: process.env.OAUTH_CLIENT_SECRET!,
//     }),
//   ],

//   // OPTIONAL: pretty sign-in page (if you created /signin)
//   // pages: { signIn: "/signin" },

//   callbacks: {
//     // 1) Block non-allowed emails (so public users never get created)
//     async signIn({ user }) {
//       return isAllowedEmail(user?.email);
//     },

//     // 2) Always compute the correct role from email; sync DB if mismatched
//     async jwt({ token, user, trigger, session }) {
//       if (user) {
//         token.id = user.id;
//         token.email = user.email;
//         token.name = user.name;
//         token.picture = user.image;

//         // Derive correct role from env-driven helper
//         const computedRole = getRoleByEmail(user.email) as UserRole;

//         // Get DB role (if user already exists)
//         const dbUser = await prisma.user.findUnique({
//           where: { id: user.id },
//           select: { role: true },
//         });

//         // If DB role differs, fix it; otherwise keep DB role
//         const roleToUse = dbUser?.role ?? DEFAULT_USER_ROLE;
//         if (roleToUse !== computedRole) {
//           await prisma.user.update({
//             where: { id: user.id },
//             data: { role: computedRole },
//           });
//           token.role = computedRole;
//         } else {
//           token.role = roleToUse;
//         }
//       }

//       if (trigger === "update" && session) {
//         token.name = session.user?.name ?? token.name;
//         token.email = session.user?.email ?? token.email;
//         token.picture = session.user?.image ?? token.picture;
//       }

//       return token;
//     },

//     async session({ session, token }) {
//       if (session.user && token) {
//         session.user.id = token.id as string;
//         session.user.email = (token.email as string) ?? null;
//         session.user.name = (token.name as string) ?? null;
//         session.user.image = (token.picture as string) ?? null;
//         session.user.role = (token.role as UserRole) ?? DEFAULT_USER_ROLE;
//       }
//       return session;
//     },
//   },

//   // No events.createUser — we block at signIn now
//   events: {},

//   secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
// };














// // src/lib/auth.ts
// import type { NextAuthOptions } from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
// import { PrismaAdapter } from "@next-auth/prisma-adapter";
// import { prisma } from "@/lib/db";
// import { isAllowedEmail } from "@/lib/acl";
// import { DEFAULT_USER_ROLE, getRoleByEmail } from "@/lib/roles";
// import type { UserRole } from "@prisma/client";

// export const authOptions: NextAuthOptions = {
//   adapter: PrismaAdapter(prisma),
//   session: { strategy: "jwt" },

//   providers: [
//     GoogleProvider({
//       clientId: process.env.OAUTH_CLIENT_ID!,
//       clientSecret: process.env.OAUTH_CLIENT_SECRET!,
//     }),
//   ],

//   callbacks: {
//     async redirect({ url, baseUrl }) {
//       // Ensure redirects include the base path
//       const basePath = "/1isto9-perfumery";
      
//       // If url is relative, prepend basePath and baseUrl
//       if (url.startsWith("/")) {
//         return `${baseUrl}${basePath}${url}`;
//       }
//       // If url already includes baseUrl, check if it has basePath
//       if (url.startsWith(baseUrl)) {
//         const urlObj = new URL(url);
//         if (!urlObj.pathname.startsWith(basePath)) {
//           urlObj.pathname = `${basePath}${urlObj.pathname}`;
//           return urlObj.toString();
//         }
//       }
//       return url;
//     },

//     async signIn({ user }) {
//       return isAllowedEmail(user?.email);
//     },

//     async jwt({ token, user, trigger, session }) {
//       if (user) {
//         token.id = user.id;
//         token.email = user.email;
//         token.name = user.name;
//         token.picture = user.image;

//         const computedRole = getRoleByEmail(user.email) as UserRole;
//         const dbUser = await prisma.user.findUnique({
//           where: { id: user.id },
//           select: { role: true },
//         });

//         const roleToUse = dbUser?.role ?? DEFAULT_USER_ROLE;
//         if (roleToUse !== computedRole) {
//           await prisma.user.update({
//             where: { id: user.id },
//             data: { role: computedRole },
//           });
//           token.role = computedRole;
//         } else {
//           token.role = roleToUse;
//         }
//       }

//       if (trigger === "update" && session) {
//         token.name = session.user?.name ?? token.name;
//         token.email = session.user?.email ?? token.email;
//         token.picture = session.user?.image ?? token.picture;
//       }

//       return token;
//     },

//     async session({ session, token }) {
//       if (session.user && token) {
//         session.user.id = token.id as string;
//         session.user.email = (token.email as string) ?? null;
//         session.user.name = (token.name as string) ?? null;
//         session.user.image = (token.picture as string) ?? null;
//         session.user.role = (token.role as UserRole) ?? DEFAULT_USER_ROLE;
//       }
//       return session;
//     },
//   },

//   events: {},
//   secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
// };







// src/lib/auth.ts
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/db";
import { isAllowedEmail } from "@/lib/acl";
import { DEFAULT_USER_ROLE, getRoleByEmail } from "@/lib/roles";
import type { UserRole } from "@prisma/client";

const BASE_PATH = "/1isto9-perfumery";

// Force the correct NEXTAUTH_URL at runtime
const getNextAuthUrl = () => {
  // In production, use the production URL
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}${BASE_PATH}/api/auth`;
  }
  
  // Fallback to environment variable or construct from parts
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL;
  }
  
  // Development fallback
  return `http://localhost:3000${BASE_PATH}/api/auth`;
};

// Override the URL before NextAuth processes it
process.env.NEXTAUTH_URL = getNextAuthUrl();

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },

  providers: [
    GoogleProvider({
      clientId: process.env.OAUTH_CLIENT_ID!,
      clientSecret: process.env.OAUTH_CLIENT_SECRET!,
      // Explicitly set the authorization URL with basePath
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],

  callbacks: {
    async redirect({ url, baseUrl }) {
      const basePath = BASE_PATH;
      
      // If url is relative
      if (url.startsWith("/")) {
        if (url.startsWith(basePath)) {
          return `${baseUrl}${url}`;
        }
        return `${baseUrl}${basePath}${url}`;
      }
      
      // If url is absolute and on same domain
      if (url.startsWith(baseUrl)) {
        const urlObj = new URL(url);
        if (!urlObj.pathname.startsWith(basePath)) {
          urlObj.pathname = `${basePath}${urlObj.pathname}`;
          return urlObj.toString();
        }
        return url;
      }
      
      // External or unsafe - redirect to home
      return `${baseUrl}${basePath}`;
    },

    async signIn({ user }) {
      return isAllowedEmail(user?.email);
    },

    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;

        const computedRole = getRoleByEmail(user.email) as UserRole;
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { role: true },
        });

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

  events: {},
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
};