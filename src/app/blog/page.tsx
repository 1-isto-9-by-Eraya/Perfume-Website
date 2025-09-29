// // src/app/blog/page.tsx
// import { prisma } from "@/lib/db";
// import BlogIndexClient from "@/components/BlogIndexClient";
// import { UnauthorizedPopup } from "@/components/UnauthorisedPopup";

// export const revalidate = 60;

// type SearchParams = Record<string, string | string[] | undefined>;

// export default async function BlogIndex({
//   searchParams,
// }: {
//   // In Next 15, searchParams is a Promise
//   searchParams?: Promise<SearchParams>;
// }) {
//   // Resolve the promise from Next
//   const sp = (await searchParams) ?? {};
//   const u = Array.isArray(sp.unauthorized) ? sp.unauthorized[0] : sp.unauthorized;
//   const unauthorized = u === "1";

//   const posts = await prisma.post.findMany({
//     where: { status: "APPROVED", published: true },
//     orderBy: { createdAt: "desc" },
//     include: {
//       author: { select: { id: true, name: true, image: true, role: true, email: true } },
//     },
//   });

//   return (
//     <div className="min-h-screen bg-black text-white">
//       {unauthorized && <UnauthorizedPopup />}
//       <BlogIndexClient posts={posts} />
//     </div>
//   );
// }














// src/app/blog/page.tsx
import { prisma } from "@/lib/db";
import BlogIndexClient from "@/components/BlogIndexClient";
import { UnauthorizedPopup } from "@/components/UnauthorisedPopup";
import { Suspense } from "react";

// Increase revalidation time if content doesn't change frequently
export const revalidate = 300; // 5 minutes instead of 1 minute

type SearchParams = Record<string, string | string[] | undefined>;

// Loading component for better UX
function BlogLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-white/5 h-52 rounded-2xl mb-4"></div>
              <div className="bg-white/5 h-4 rounded mb-2"></div>
              <div className="bg-white/5 h-4 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Separate the data fetching into its own async component
async function BlogContent({ unauthorized }: { unauthorized: boolean }) {
  const posts = await prisma.post.findMany({
    where: { 
      status: "APPROVED", 
      published: true 
    },
    orderBy: { createdAt: "desc" },
    // Limit initial load to improve performance
    take: 50,
    select: {
      id: true,
      title: true,
      // excerpt: true,
      coverImage: true,
      slug: true,
      createdAt: true,
      postType: true,
      keywords: true,
      // readTime: true,
      // Only select needed author fields
      author: {
        select: {
          id: true,
          name: true,
          image: true,
          role: true,
        }
      }
    }
  });

  return (
    <>
      {unauthorized && <UnauthorizedPopup />}
      <BlogIndexClient posts={posts} />
    </>
  );
}

export default async function BlogIndex({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) {
  const sp = (await searchParams) ?? {};
  const u = Array.isArray(sp.unauthorized) ? sp.unauthorized[0] : sp.unauthorized;
  const unauthorized = u === "1";

  return (
    <div className="min-h-screen bg-black text-white">
      <Suspense fallback={<BlogLoadingSkeleton />}>
        <BlogContent unauthorized={unauthorized} />
      </Suspense>
    </div>
  );
}