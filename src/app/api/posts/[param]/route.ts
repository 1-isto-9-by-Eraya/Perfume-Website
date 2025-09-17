// app/api/posts/[param]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isAllowedEmail } from "@/lib/acl";

function canModerate(session: any) {
  const email = session?.user?.email ?? null;
  const role = session?.user?.role;
  return !!session && (role === "REVIEWER" || isAllowedEmail(email));
}

async function findByParam(param: string) {
  // Try id first, then slug
  let post = await prisma.post.findUnique({ where: { id: param } });
  if (!post) post = await prisma.post.findUnique({ where: { slug: param } });
  return post;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ param: string }> }
) {
  const { param } = await params;
  const post = await findByParam(param);
  if (!post) return new NextResponse("Not found", { status: 404 });
  return NextResponse.json(post);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ param: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!canModerate(session)) return new NextResponse("Forbidden", { status: 403 });

  const { param } = await params;
  const current = await findByParam(param);
  if (!current) return new NextResponse("Not found", { status: 404 });

  const body = await req.json();
  const data: any = {};
  if (typeof body.title === "string") data.title = body.title;
  if (typeof body.heroImage === "string") data.heroImage = body.heroImage;
  if (Array.isArray(body.sections)) data.sections = body.sections;
  if (typeof body.published === "boolean") data.published = body.published;
  if (typeof body.status === "string") data.status = body.status;
  if (typeof body.postType === "string") data.postType = body.postType;

  const updated = await prisma.post.update({
    where: { id: current.id }, // always update by id
    data,
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ param: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!canModerate(session)) return new NextResponse("Forbidden", { status: 403 });

  const { param } = await params;
  const existing = await findByParam(param);
  if (!existing) return new NextResponse("Post not found", { status: 404 });

  await prisma.post.delete({ where: { id: existing.id } });
  return new NextResponse(null, { status: 204 });
}
