// src/app/api/posts/edits/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth-utils';
import { prisma } from '@/lib/db';
import { isUploader, isReviewer } from '@/lib/roles';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    
    if (!session || !isUploader(session.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    const postId = resolvedParams.id;
    const body = await request.json();

    const existingPost = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!existingPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    if (existingPost.authorId !== session.id) {
      return NextResponse.json({ error: 'Not authorized to edit this post' }, { status: 403 });
    }

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
      status = 'PENDING'
    } = body;

    if (!title || !slug) {
      return NextResponse.json(
        { error: 'Title and slug are required' },
        { status: 400 }
      );
    }

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
        status,
        updatedAt: new Date(),
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
    
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    
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

    if (post.authorId !== session.id && !isReviewer(session.role)) {
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