// src/app/api/posts/approve/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { isReviewer } from "@/lib/roles";
import type { ExtendedSession } from "@/types/auth";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = (await getServerSession(authOptions)) as ExtendedSession | null;

    // Narrow both session and user before using user.id
    if (!session || !session.user || !isReviewer(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: postId } = await params;
    if (!postId) {
      return NextResponse.json({ error: "Missing post id" }, { status: 400 });
    }

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        status: "APPROVED",
        reviewedAt: new Date(),
        reviewedById: session.user.id, // now safe
        reviewComments: null,
        published: true,
      },
    });

    return NextResponse.json({
      message: "Post approved and published successfully",
      post: updatedPost,
    });
  } catch (error) {
    console.error("Error approving post:", error);
    return NextResponse.json(
      { error: "Failed to approve post" },
      { status: 500 }
    );
  }
}
