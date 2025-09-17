// src/app/api/posts/approve/[id]/route.ts
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

    // Update post status to APPROVED and mark as published
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        status: 'APPROVED',
        reviewedAt: new Date(),
        reviewedById: session.user.id,
        reviewComments: null, // Clear any previous review comments
        published: true, // Make it live immediately after approval
      },
    });

    return NextResponse.json({ 
      message: 'Post approved and published successfully',
      post: updatedPost 
    });

  } catch (error) {
    console.error('Error approving post:', error);
    return NextResponse.json(
      { error: 'Failed to approve post' },
      { status: 500 }
    );
  }
}