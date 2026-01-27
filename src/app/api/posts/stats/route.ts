// src/app/api/posts/stats/route.ts
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

    // Get counts for each status
    const [pending, approved, rejected, needsUpdate] = await Promise.all([
      prisma.post.count({
        where: { status: 'PENDING' }
      }),
      prisma.post.count({
        where: { status: 'APPROVED' }
      }),
      prisma.post.count({
        where: { status: 'REJECTED' }
      }),
      prisma.post.count({
        where: { 
          status: 'DRAFT',
          reviewComments: {
            not: null
          }
        }
      })
    ]);

    return NextResponse.json({
      pending,
      approved,
      rejected,
      needsUpdate,
      total: pending + approved + rejected + needsUpdate,
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching post stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}