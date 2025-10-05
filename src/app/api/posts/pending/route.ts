// src/app/api/posts/pending/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth-utils';
import { isReviewer } from '@/lib/roles';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();

    // Check if user is authenticated and is a reviewer
    if (!session || !isReviewer(session.role)) {
      return NextResponse.json(
        { error: 'Unauthorized - Reviewer access required' },
        { status: 403 }
      );
    }

    // Fetch pending posts with author information
    const posts = await prisma.post.findMany({
      where: {
        status: 'PENDING',
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc', // Oldest first for FIFO review
      },
    });

    return NextResponse.json({
      success: true,
      posts,
      count: posts.length,
    });

  } catch (error) {
    console.error('Error fetching pending posts:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}