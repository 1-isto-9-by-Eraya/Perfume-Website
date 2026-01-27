// src/app/api/posts/user/needs-update/route.ts
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth-utils';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const session = await getSession();
    
    if (!session?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's posts that need updates (status: DRAFT with reviewComments)
    const posts = await prisma.post.findMany({
      where: {
        authorId: session.id,
        status: 'DRAFT',
        reviewComments: {
          not: null,
        },
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        reviewedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        reviewedAt: 'desc',
      },
    });

    return NextResponse.json({ posts });

  } catch (error) {
    console.error('Error fetching posts needing updates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts needing updates' },
      { status: 500 }
    );
  }
}