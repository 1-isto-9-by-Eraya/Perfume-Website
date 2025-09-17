import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isAllowedEmail } from "@/lib/acl";

export async function GET() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email || null;
  return NextResponse.json({
    signedIn: !!session,
    allowed: isAllowedEmail(email),
  });
}
