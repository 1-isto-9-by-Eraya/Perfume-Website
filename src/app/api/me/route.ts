// app/api/me/route.ts
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth-utils";
import { isAllowedEmail } from "@/lib/acl";

export async function GET() {
  const session = await getSession();
  
  if (!session) {
    return NextResponse.json({ user: null, allowed: false });
  }

  return NextResponse.json({
    user: session,
    allowed: isAllowedEmail(session.email),
  });
}

export const dynamic = 'force-dynamic';