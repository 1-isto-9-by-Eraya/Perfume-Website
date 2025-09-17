import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import crypto from 'crypto';

// Prisma-safe & prevent cached HTML overlays
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Find post by ID first, then by slug
async function findByParam(param: string) {
  let post = await prisma.post.findUnique({
    where: { id: param },
    select: { id: true, slug: true, likesCount: true, status: true, published: true },
  });
  if (!post) {
    post = await prisma.post.findUnique({
      where: { slug: param },
      select: { id: true, slug: true, likesCount: true, status: true, published: true },
    });
  }
  return post;
}

function generateFingerprint(req: NextRequest): string {
  const userAgent = req.headers.get('user-agent') || '';
  const acceptLanguage = req.headers.get('accept-language') || '';
  const acceptEncoding = req.headers.get('accept-encoding') || '';
  const forwardedFor = req.headers.get('x-forwarded-for') || '';
  const realIp = req.headers.get('x-real-ip') || '';
  return crypto
    .createHash('sha256')
    .update(`${userAgent}|${acceptLanguage}|${acceptEncoding}|${forwardedFor}|${realIp}`)
    .digest('hex');
}

// GET /api/posts/[param]/likes
export async function GET(
  request: NextRequest,
  // ⬇️ Next 15: params is a Promise you must await
  { params }: { params: Promise<{ param: string }> }
) {
  try {
    const { param } = await params;
    if (!param) return NextResponse.json({ error: 'Missing param' }, { status: 400 });

    const fingerprint = generateFingerprint(request);
    const post = await findByParam(param);

    if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    if (post.status !== 'APPROVED' || !post.published) {
      return NextResponse.json({ error: 'Post not available for likes' }, { status: 403 });
    }

    const userLike = await prisma.postLike.findUnique({
      where: { postId_fingerprint: { postId: post.id, fingerprint } },
    });

    return NextResponse.json({
      likesCount: post.likesCount,
      isLiked: !!userLike,
      postId: post.id,
    });
  } catch (err) {
    console.error('Error fetching likes:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/posts/[param]/likes
export async function POST(
  request: NextRequest,
  // ⬇️ Next 15: params is a Promise you must await
  { params }: { params: Promise<{ param: string }> }
) {
  try {
    const { param } = await params;
    if (!param) return NextResponse.json({ error: 'Missing param' }, { status: 400 });

    const fingerprint = generateFingerprint(request);
    const ipAddress =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';
    const userAgent = request.headers.get('user-agent') || '';

    const post = await findByParam(param);
    if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    if (post.status !== 'APPROVED' || !post.published) {
      return NextResponse.json({ error: 'Post not available for likes' }, { status: 403 });
    }

    const existingLike = await prisma.postLike.findUnique({
      where: { postId_fingerprint: { postId: post.id, fingerprint } },
    });

    let newLikesCount: number;
    let isLiked: boolean;

    if (existingLike) {
      await prisma.$transaction([
        prisma.postLike.delete({ where: { id: existingLike.id } }),
        prisma.post.update({ where: { id: post.id }, data: { likesCount: { decrement: 1 } } }),
      ]);
      newLikesCount = post.likesCount - 1;
      isLiked = false;
    } else {
      await prisma.$transaction([
        prisma.postLike.create({
          data: { postId: post.id, fingerprint, ipAddress, userAgent },
        }),
        prisma.post.update({ where: { id: post.id }, data: { likesCount: { increment: 1 } } }),
      ]);
      newLikesCount = post.likesCount + 1;
      isLiked = true;
    }

    return NextResponse.json({ likesCount: newLikesCount, isLiked, action: isLiked ? 'liked' : 'unliked' });
  } catch (err) {
    console.error('Error toggling like:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
