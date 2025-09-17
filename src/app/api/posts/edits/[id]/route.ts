// src/app/api/posts/edits/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { isUploader, isReviewer } from '@/lib/roles';
import type { ExtendedSession } from '@/types/auth';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions) as ExtendedSession;
    
    if (!session || !isUploader(session.user?.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    const postId = resolvedParams.id;
    const body = await request.json();

    // Check if post exists and user owns it
    const existingPost = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!existingPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    if (existingPost.authorId !== session.user.id) {
      return NextResponse.json({ error: 'Not authorized to edit this post' }, { status: 403 });
    }

    // Only allow editing if post is in DRAFT status with review comments
    if (existingPost.status !== 'DRAFT' || !existingPost.reviewComments) {
      return NextResponse.json({ 
        error: 'Post cannot be edited. Only draft posts with review feedback can be edited.' 
      }, { status: 400 });
    }

    const {
      title,
      slug,
      postType,
      heroImage,
      coverImage,
      instagramUrl,
      videoUrl,
      sections,
      status = 'PENDING' // Default to PENDING for re-review
    } = body;

    // Validation
    if (!title || !slug) {
      return NextResponse.json(
        { error: 'Title and slug are required' },
        { status: 400 }
      );
    }

    // Check for slug conflicts (excluding current post)
    const slugConflict = await prisma.post.findFirst({
      where: {
        slug,
        id: { not: postId }
      }
    });

    if (slugConflict) {
      return NextResponse.json(
        { error: 'A post with this slug already exists' },
        { status: 409 }
      );
    }

    // Update the post
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        title,
        slug,
        postType: postType || existingPost.postType,
        heroImage: heroImage || null,
        coverImage: coverImage || null,
        instagramUrl: instagramUrl || null,
        videoUrl: videoUrl || null,
        sections: sections || existingPost.sections,
        status, // Usually PENDING for re-review
        updatedAt: new Date(),
        // Clear review fields since this is a new version
        reviewComments: null,
        reviewedAt: null,
        reviewedById: null,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      post: updatedPost,
      message: 'Post updated successfully and resubmitted for review',
    });

  } catch (error) {
    console.error('Error updating post:', error);
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A post with this slug already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    );
  }
}

// Optional: Also handle GET for fetching single post details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions) as ExtendedSession;
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    const postId = resolvedParams.id;

    const post = await prisma.post.findUnique({
      where: { id: postId },
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
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Users can only see their own posts unless they're reviewers
    if (post.authorId !== session.user.id && !isReviewer(session.user?.role)) {
      return NextResponse.json({ error: 'Not authorized to view this post' }, { status: 403 });
    }

    return NextResponse.json({ post });

  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}