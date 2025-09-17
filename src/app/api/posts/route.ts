// src/app/api/posts/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import { isAllowedEmail } from "@/lib/acl";

// List posts (published and approved)
export async function GET() {
  const posts = await prisma.post.findMany({
    where: { 
      published: true,
      status: 'APPROVED' 
    },
    orderBy: { createdAt: "desc" },
    include: { author: true },
  });
  return NextResponse.json(posts);
}

// Create post (supports BLOG, INSTAGRAM, VLOG types)
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email || null;

  if (!session || !isAllowedEmail(email)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const body = await req.json();

  // Validate basic required fields
  const title = String(body?.title || "").trim();
  if (!title) {
    return new NextResponse("Missing title", { status: 400 });
  }

  const postType = body?.postType || 'BLOG';
  if (!['BLOG', 'INSTAGRAM', 'VLOG'].includes(postType)) {
    return new NextResponse("Invalid post type", { status: 400 });
  }

  // Validate based on post type
  if (postType === 'BLOG') {
    const sections = body?.sections;
    if (!Array.isArray(sections) || sections.length === 0) {
      return new NextResponse("Blog posts require sections", { status: 400 });
    }

    // Validate each section for blog posts
    for (const s of sections) {
      if (typeof s?.heading !== "string") {
        return new NextResponse("Invalid section.heading", { status: 400 });
      }
      if (!Array.isArray(s?.paragraphs)) {
        return new NextResponse("Invalid section.paragraphs", { status: 400 });
      }
      if (!Array.isArray(s?.images)) {
        return new NextResponse("Invalid section.images", { status: 400 });
      }
      
      // Validate images in section
      for (const img of s.images) {
        if (typeof img?.url !== "string") {
          return new NextResponse("Invalid image.url", { status: 400 });
        }
        if (!["above", "below", "between"].includes(img?.position)) {
          return new NextResponse("Invalid image.position", { status: 400 });
        }
        if (img.position === "between" && typeof img.betweenIndex !== "number") {
          return new NextResponse("betweenIndex required when position='between'", { status: 400 });
        }
      }
    }
  } else if (postType === 'INSTAGRAM') {
    const instagramUrl = body?.instagramUrl;
    if (!instagramUrl || typeof instagramUrl !== "string") {
      return new NextResponse("Instagram posts require instagramUrl", { status: 400 });
    }
    if (!instagramUrl.includes('instagram.com')) {
      return new NextResponse("Invalid Instagram URL", { status: 400 });
    }
  } else if (postType === 'VLOG') {
    const videoUrl = body?.videoUrl;
    if (!videoUrl || typeof videoUrl !== "string") {
      return new NextResponse("Vlog posts require videoUrl", { status: 400 });
    }
  }

  // Extract optional fields
  const heroImage = typeof body?.heroImage === "string" ? body.heroImage : null;
  const coverImage = typeof body?.coverImage === "string" ? body.coverImage : null;
  const instagramUrl = typeof body?.instagramUrl === "string" ? body.instagramUrl : null;
  const videoUrl = typeof body?.videoUrl === "string" ? body.videoUrl : null;
  const description = typeof body?.description === "string" ? body.description : null;
  const sections = Array.isArray(body?.sections) ? body.sections : [];

  // Generate unique slug
  const base = slugify(title);
  let slug = base;
  for (let i = 1; await prisma.post.findUnique({ where: { slug } }); i++) {
    slug = `${base}-${i}`;
  }

  try {
    const post = await prisma.post.create({
      data: {
        title,
        slug,
        postType,
        heroImage,
        coverImage,
        instagramUrl,
        videoUrl,
        // description,
        sections,
        authorId: session.user?.id as string,
        status: 'PENDING', // All new posts start as pending review
        published: false,   // Will be set to true when approved
      },
    });

    return NextResponse.json({ 
      id: post.id, 
      slug: post.slug,
      status: post.status,
      message: "Post submitted for review"
    });
  } catch (error) {
    console.error('Error creating post:', error);
    return new NextResponse("Failed to create post", { status: 500 });
  }
}

// Update post status (for reviewers)
export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email || null;

  if (!session || !isAllowedEmail(email)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const body = await req.json();
  const { postId, status, feedback } = body;

  if (!postId || !status) {
    return new NextResponse("Missing postId or status", { status: 400 });
  }

  if (!['PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
    return new NextResponse("Invalid status", { status: 400 });
  }

  try {
    const updateData: any = { 
      status,
      reviewedAt: new Date(),
      reviewedBy: session.user?.id as string,
    };

    // If approved, publish the post
    if (status === 'APPROVED') {
      updateData.published = true;
    }

    // If rejected, add feedback
    if (status === 'REJECTED' && feedback) {
      updateData.reviewFeedback = feedback;
    }

    const post = await prisma.post.update({
      where: { id: postId },
      data: updateData,
    });

    return NextResponse.json({ 
      success: true, 
      message: `Post ${status.toLowerCase()}`,
      post 
    });
  } catch (error) {
    console.error('Error updating post status:', error);
    return new NextResponse("Failed to update post", { status: 500 });
  }
}