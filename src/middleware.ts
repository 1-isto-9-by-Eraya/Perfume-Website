// // src/middleware.ts
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { getToken } from "next-auth/jwt";

// const ALLOWED = (process.env.ALLOWED_EMAILS || "")
//   .split(",")
//   .map((s) => s.trim().toLowerCase())
//   .filter(Boolean);

// export async function middleware(req: NextRequest) {
//   const { pathname, origin } = req.nextUrl;
  
//   // Routes that need authentication
//   const needsAuth = 
//     pathname.startsWith("/blog/new") || 
//     pathname.startsWith("/api/posts") ||
//     pathname.startsWith("/dashboard") ||
//     pathname.startsWith("/reviews");

//   if (!needsAuth) return NextResponse.next();

//   const token = await getToken({
//     req,
//     secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
//   });

//   // If not signed in, redirect to sign-in
//   if (!token) {
//     const signInUrl = new URL("/api/auth/signin", origin);
//     signInUrl.searchParams.set("callbackUrl", req.nextUrl.href);
//     return NextResponse.redirect(signInUrl);
//   }

//   // Check if user is authorized
//   const email = (token.email || "").toLowerCase();
//   if (!ALLOWED.includes(email)) {
//     // Unauthorized user - redirect to blog with unauthorized flag
//     const url = new URL("/blog", origin);
//     url.searchParams.set("unauthorized", "1");
//     return NextResponse.redirect(url);
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/blog/new", "/api/posts/:path*", "/dashboard", "/reviews"],
// };










// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const ALLOWED = (process.env.ALLOWED_EMAILS || "")
  .split(",")
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

// Helper: path checks
const isApi = (p: string) => p.startsWith("/api");
const isAuthApi = (p: string) => p.startsWith("/api/auth");
const isPublicLikesEndpoint = (p: string) =>
  /^\/api\/posts\/[^/]+\/likes\/?$/.test(p);

// Public API endpoints that don't need authentication
const isPublicApiEndpoint = (p: string) => {
  return (
    isAuthApi(p) || // NextAuth endpoints
    isPublicLikesEndpoint(p) || // Likes endpoints
    p === "/api/health" || // Health check if you have one
    p.startsWith("/api/public/") // Any other public APIs you might have
  );
};

export async function middleware(req: NextRequest) {
  const { pathname, origin } = req.nextUrl;

  // Always let preflight pass
  if (req.method === "OPTIONS") {
    return NextResponse.next();
  }

  // Let public API endpoints pass without authentication
  if (isPublicApiEndpoint(pathname)) {
    return NextResponse.next();
  }

  // Routes that need authentication
  const needsAuth =
    pathname.startsWith("/blog/new") ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/reviews") ||
    // All other API routes (except public ones handled above)
    (isApi(pathname) && !isPublicApiEndpoint(pathname));

  // If no auth needed, let it pass
  if (!needsAuth) {
    return NextResponse.next();
  }

  // Get token for protected routes
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
  });

  // Not signed in
  if (!token) {
    // For API routes, return JSON 401 instead of redirecting
    if (isApi(pathname)) {
      return NextResponse.json(
        { error: "Authentication required" }, 
        { status: 401 }
      );
    }
    
    // For pages, redirect to sign-in
    const signInUrl = new URL("/api/auth/signin", origin);
    signInUrl.searchParams.set("callbackUrl", req.nextUrl.href);
    return NextResponse.redirect(signInUrl);
  }

  // Signed in but check if user is authorized
  const email = (token.email || "").toLowerCase();
  if (!ALLOWED.includes(email)) {
    // For API routes, return JSON 403
    if (isApi(pathname)) {
      return NextResponse.json(
        { error: "Insufficient permissions" }, 
        { status: 403 }
      );
    }
    
    // For pages, redirect with error flag
    const url = new URL("/blog", origin);
    url.searchParams.set("unauthorized", "1");
    return NextResponse.redirect(url);
  }

  // User is authenticated and authorized
  return NextResponse.next();
}

// Matcher: be specific about what we want to intercept
export const config = {
  matcher: [
    // Pages that need auth
    "/blog/new",
    "/dashboard/:path*",
    "/reviews/:path*",
    // API routes (but we'll exclude public ones in the middleware logic)
    "/api/posts/:path*",
    "/api/upload/:path*",
    "/api/admin/:path*",
    // Add any other protected API routes here
  ],
};