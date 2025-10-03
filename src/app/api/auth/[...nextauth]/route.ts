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

// Helper to get the correct host from request
function getAuthUrl(req: NextRequest): string {
  const protocol = req.headers.get("x-forwarded-proto") || "https";
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "";
  
  // This will use the actual domain being accessed (www.thehouseoferaya.in)
  // instead of the Vercel deployment URL
  return `${protocol}://${host}${BASE_PATH}/api/auth`;
}

export async function GET(req: NextRequest) {
  // Force the correct NEXTAUTH_URL at runtime
  process.env.NEXTAUTH_URL = getAuthUrl(req);
  
  // Prevent Vercel's auto-detection
  const originalVercelUrl = process.env.VERCEL_URL;
  delete process.env.VERCEL_URL;
  
  const handler = NextAuth(authOptions);
  const response = await handler(req);
  
  // Restore (cleanup, though not strictly necessary in serverless)
  if (originalVercelUrl) {
    process.env.VERCEL_URL = originalVercelUrl;
  }
  
  return response;
}

export async function POST(req: NextRequest) {
  // Force the correct NEXTAUTH_URL at runtime
  process.env.NEXTAUTH_URL = getAuthUrl(req);
  
  // Prevent Vercel's auto-detection
  const originalVercelUrl = process.env.VERCEL_URL;
  delete process.env.VERCEL_URL;
  
  const handler = NextAuth(authOptions);
  const response = await handler(req);
  
  // Restore (cleanup, though not strictly necessary in serverless)
  if (originalVercelUrl) {
    process.env.VERCEL_URL = originalVercelUrl;
  }
  
  return response;
}