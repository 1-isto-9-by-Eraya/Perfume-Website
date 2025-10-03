// src/app/api/debug-env/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || "NOT SET",
    VERCEL_URL: process.env.VERCEL_URL || "NOT SET",
    NODE_ENV: process.env.NODE_ENV,
    // Don't expose secrets, just check if they exist
    hasSecret: !!process.env.NEXTAUTH_SECRET || !!process.env.AUTH_SECRET,
    hasOAuthId: !!process.env.OAUTH_CLIENT_ID,
    hasOAuthSecret: !!process.env.OAUTH_CLIENT_SECRET,
  });
}