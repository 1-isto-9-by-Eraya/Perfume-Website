// src/app/api/posts/needs-update/[id]/route.ts
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
    const { feedback } = await request.json();

    if (!feedback?.trim()) {
      return NextResponse.json({ error: 'Feedback is required' }, { status: 400 });
    }

    // Update post status to DRAFT and add reviewer feedback
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        status: 'DRAFT', // Send back to draft for updates
        reviewedAt: new Date(),
        reviewedById: session.user?.id,
        reviewComments: feedback.trim(),
        published: false,
      },
    });

    return NextResponse.json({ 
      message: 'Post sent back for updates',
      post: updatedPost 
    });

  } catch (error) {
    console.error('Error sending post for updates:', error);
    return NextResponse.json(
      { error: 'Failed to send post for updates' },
      { status: 500 }
    );
  }
}