// src/app/api/posts/manage/route.ts
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth-utils';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const session = await getSession();
    
    if (!session || session.role !== 'REVIEWER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Error fetching posts for management:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}