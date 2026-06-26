// src/app/blog/page.tsx
import { prisma } from "@/lib/db";
import BlogIndexClient from "@/components/BlogIndexClient";
import { UnauthorizedPopup } from "@/components/UnauthorisedPopup";
export const revalidate = 60;
type SearchParams = Record<string, string | string[] | undefined>;
export default async function BlogIndex({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) {
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
    <div className="min-h-screen bg-white text-gray-900">
      {unauthorized && <UnauthorizedPopup />}
      <BlogIndexClient posts={posts} />
    </div>
  );
}
