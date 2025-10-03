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

// Create the handler once
const handler = NextAuth(authOptions);

// Override NEXTAUTH_URL before any requests are handled
function setCorrectNextAuthUrl(req: NextRequest) {
  const protocol = req.headers.get("x-forwarded-proto") || "https";
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "";
  
  // Override the environment variable
  process.env.NEXTAUTH_URL = `${protocol}://${host}${BASE_PATH}/api/auth`;
  
  // Temporarily remove VERCEL_URL to prevent auto-detection
  delete process.env.VERCEL_URL;
}

export async function GET(req: NextRequest, context: any) {
  setCorrectNextAuthUrl(req);
  return handler(req, context);
}

export async function POST(req: NextRequest, context: any) {
  setCorrectNextAuthUrl(req);
  return handler(req, context);
}