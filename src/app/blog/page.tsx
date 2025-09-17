// src/app/blog/page.tsx
import { prisma } from "@/lib/db";
import BlogIndexClient from "@/components/BlogIndexClient";
import { UnauthorizedPopup } from "@/components/UnauthorisedPopup";

export const revalidate = 60; // keep ISR

export default async function BlogIndex({
  searchParams,
}: {
  searchParams?: { unauthorized?: string };
}) {
  // Fetch posts on the server
  const posts = await prisma.post.findMany({
    where: { status: "APPROVED", published: true },
    orderBy: { createdAt: "desc" },
    include: {
      author: {
        select: { id: true, name: true, image: true, role: true, email: true },
      },
    },
  });

  const resolvedSearchParams = await searchParams;
  const unauthorized = resolvedSearchParams?.unauthorized === "1";

  return (
    <div className="min-h-screen bg-black text-white">
      {unauthorized && <UnauthorizedPopup />}
      {/* All interactive UI lives in the client child */}
      <BlogIndexClient posts={posts} />
    </div>
  );
}
