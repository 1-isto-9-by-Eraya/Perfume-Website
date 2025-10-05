// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth-utils";
import type { SessionPayload } from "@/lib/auth-utils";

const ALLOWED = (process.env.ALLOWED_EMAILS || "")
  .split(",")
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

const BASE_PATH = "/1isto9-perfumery";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = req.cookies.get("session")?.value;
  let session: SessionPayload | null = null;

  if (token) {
    session = await verifyToken(token);
  }

  // Protected routes
  const protectedPaths = [
    `${BASE_PATH}/dashboard`,
    `${BASE_PATH}/blog/new`,
    `${BASE_PATH}/reviews`,
    `${BASE_PATH}/manage-posts`, // ✅ ADD THIS
  ];

  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  if (isProtected) {
    if (!session) {
      const pathWithoutBase = pathname.replace(BASE_PATH, "");
      const signInUrl = new URL(`${BASE_PATH}/signin`, req.url);
      signInUrl.searchParams.set("callbackUrl", pathWithoutBase);
      return NextResponse.redirect(signInUrl);
    }

    const email = session.email?.toLowerCase() || "";
    if (!ALLOWED.includes(email)) {
      const unauthorizedUrl = new URL(`${BASE_PATH}/blog`, req.url);
      unauthorizedUrl.searchParams.set("unauthorized", "1");
      return NextResponse.redirect(unauthorizedUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/1isto9-perfumery/dashboard/:path*",
    "/1isto9-perfumery/blog/new/:path*",
    "/1isto9-perfumery/reviews/:path*",
    "/1isto9-perfumery/manage-posts/:path*", // ✅ ADD THIS
  ],
};