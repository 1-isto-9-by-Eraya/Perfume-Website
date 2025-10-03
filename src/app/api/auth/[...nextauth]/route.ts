// // src/app/api/auth/[...nextauth]/route.ts
// import NextAuth from "next-auth";
// import { authOptions } from "@/lib/auth";

// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };



// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";
import type { NextRequest } from "next/server";

const BASE_PATH = "/1isto9-perfumery";

// Wrapper to override NEXTAUTH_URL at request time
async function authHandler(req: NextRequest, ctx: any) {
  // Force the correct URL based on the actual request
  const proto = req.headers.get("x-forwarded-proto") || "https";
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  
  // Set NEXTAUTH_URL to include basePath
  const originalUrl = process.env.NEXTAUTH_URL;
  process.env.NEXTAUTH_URL = `${proto}://${host}${BASE_PATH}/api/auth`;
  
  // Temporarily remove VERCEL_URL to prevent auto-detection
  const originalVercelUrl = process.env.VERCEL_URL;
  delete process.env.VERCEL_URL;
  
  // Create handler with updated env vars
  const handler = NextAuth(authOptions);
  const response = await handler(req, ctx);
  
  // Restore (cleanup)
  if (originalUrl) process.env.NEXTAUTH_URL = originalUrl;
  if (originalVercelUrl) process.env.VERCEL_URL = originalVercelUrl;
  
  return response;
}

export async function GET(req: NextRequest, ctx: any) {
  return authHandler(req, ctx);
}

export async function POST(req: NextRequest, ctx: any) {
  return authHandler(req, ctx);
}