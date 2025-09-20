// src/app/blog/page.tsx
import { prisma } from "@/lib/db";
import BlogIndexClient from "@/components/BlogIndexClient";
import { UnauthorizedPopup } from "@/components/UnauthorisedPopup";

export const revalidate = 60;

type SearchParams = Record<string, string | string[] | undefined>;

export default async function BlogIndex({
  searchParams,
}: {
  // In Next 15, searchParams is a Promise
  searchParams?: Promise<SearchParams>;
}) {
  // Resolve the promise from Next
  const sp = (await searchParams) ?? {};
  const u = Array.isArray(sp.unauthorized) ? sp.unauthorized[0] : sp.unauthorized;
  const unauthorized = u === "1";

  const posts = await prisma.post.findMany({
    where: { status: "APPROVED", published: true },
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { id: true, name: true, image: true, role: true, email: true } },
    },
  });

  return (
    <div className="min-h-screen bg-black text-white">
      {unauthorized && <UnauthorizedPopup />}
      <BlogIndexClient posts={posts} />
    </div>
  );
}
