// src/app/api/posts/reject/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { isReviewer } from '@/lib/roles';
import type { ExtendedSession } from '@/types/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions) as ExtendedSession;
    
    if (!session || !isReviewer(session.user?.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    const postId = resolvedParams.id;
    const { reason } = await request.json();

    if (!reason?.trim()) {
      return NextResponse.json({ error: 'Rejection reason is required' }, { status: 400 });
    }

    // Get post details before deletion for logging
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: { author: true }
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Log the rejection (optional - you might want to keep a record)
    console.log(`Post "${post.title}" by ${post.author.email} rejected by ${session.user.email}. Reason: ${reason}`);

    // Delete the post completely
    await prisma.post.delete({
      where: { id: postId }
    });

    return NextResponse.json({ 
      message: 'Post rejected and deleted successfully',
      deletedPostId: postId
    });

  } catch (error) {
    console.error('Error rejecting post:', error);
    return NextResponse.json(
      { error: 'Failed to reject post' },
      { status: 500 }
    );
  }
}