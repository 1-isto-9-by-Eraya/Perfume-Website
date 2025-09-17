// // src/components/BlogCard.tsx
// 'use client';

// import Link from "next/link";
// import { useMemo, useState } from "react";
// import { LikeButton } from "@/components/LikeButton";

// type UserRole = "UPLOADER" | "REVIEWER";
// type PostType = "BLOG" | "INSTAGRAM" | "VLOG";

// type Author = {
//   id?: string;
//   name?: string | null;
//   image?: string | null;
//   role?: UserRole;
// };

// type CardPost = {
//   id: string;
//   slug: string;
//   title: string;
//   coverImage?: string | null;
//   heroImage?: string | null;
//   postType: PostType;
//   createdAt: string | Date;
//   likesCount?: number; // Add likes count to post type
//   author?: Author | null;
// };

// export function BlogCard({ post }: { post: CardPost }) {
//   const [imageError, setImageError] = useState(false);

//   // choose cover > hero if available
//   const imageUrl = useMemo(() => {
//     if (!imageError && post?.coverImage) return post.coverImage!;
//     if (!imageError && post?.heroImage) return post.heroImage!;
//     return null;
//   }, [post, imageError]);

//   // Author info
//   const author = post.author ?? undefined;
//   const authorName = (author?.name || "Unknown").trim();
//   const authorRoleRaw: UserRole | undefined = author?.role;
//   // Map DB roles to a reader-friendly label on the card
//   const authorRoleLabel = authorRoleRaw === "REVIEWER" ? "Reviewer" : "Author";

//   const initials = authorName
//     .split(/\s+/)
//     .map(s => s[0])
//     .filter(Boolean)
//     .slice(0, 2)
//     .join("")
//     .toUpperCase();

//   const dateStr = useMemo(
//     () =>
//       new Date(post.createdAt).toLocaleDateString("en-US", {
//         month: "short",
//         day: "numeric",
//         year: "numeric",
//       }),
//     [post.createdAt]
//   );

//   // --- badges ---
//   const getPostTypeStyle = (t: PostType) => {
//     switch (t) {
//       case "INSTAGRAM":
//         return "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-pink-400 border border-pink-500/30";
//       case "VLOG":
//         return "bg-gradient-to-r from-red-500/20 to-orange-500/20 text-red-400 border border-red-500/30";
//       case "BLOG":
//       default:
//         return "bg-blue-500/20 text-blue-400 border border-blue-500/30";
//     }
//   };
//   const getPostTypeIcon = (t: PostType) => {
//     switch (t) {
//       case "INSTAGRAM":
//         return (
//           <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="currentColor">
//             <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919zM12 5.838a6.162 6.162 0 100 12.324A6.162 6.162 0 0012 5.838zM18.406 6.98a1.44 1.44 0 110 2.88 1.44 1.44 0 010-2.88z" />
//           </svg>
//         );
//       case "VLOG":
//         return (
//           <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
//           </svg>
//         );
//       case "BLOG":
//       default:
//         return (
//           <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293L18.707 8.707A1 1 0 0119 9.414V19a2 2 0 01-2 2z" />
//           </svg>
//         );
//     }
//   };

//   return (
//     <Link
//       href={`/blog/${post.slug}`}
//       className="group block bg-[#1b1f24] border border-gray-700 rounded-xl overflow-hidden shadow-sm hover:border-gray-500 hover:shadow-xl hover:shadow-black/30 transition-all duration-300"
//     >
//       {/* Media */}
//       {imageUrl ? (
//         <div className="relative overflow-hidden">
//           <img
//             src={imageUrl}
//             alt={post.title || ""}
//             className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-500"
//             onError={() => setImageError(true)}
//             onLoad={() => setImageError(false)}
//           />
//           <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
//           <div className="absolute top-3 left-3">
//             <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full font-medium ${getPostTypeStyle(post.postType)}`}>
//               {getPostTypeIcon(post.postType)}
//               {post.postType}
//             </span>
//           </div>
//         </div>
//       ) : (
//         <div className="relative w-full h-36 bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
//           <div className="text-center">
//             <svg className="w-12 h-12 text-gray-500 mx-auto mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293L18.707 8.707A1 1 0 0119 9.414V19a2 2 0 01-2 2z" />
//             </svg>
//             <p className="text-xs text-gray-500 font-medium">{post.postType}</p>
//           </div>
//           <div className="absolute top-3 left-3">
//             <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full font-medium ${getPostTypeStyle(post.postType)}`}>
//               {getPostTypeIcon(post.postType)}
//               {post.postType}
//             </span>
//           </div>
//         </div>
//       )}

//       {/* Body */}
//       <div className="p-4">
//         <h3 className="text-[1.05rem] font-semibold text-white/95 group-hover:text-white line-clamp-2 mb-3">
//           {post.title}
//         </h3>

//         {/* Author strip */}
//         <div className="flex items-center justify-between mb-3">
//           <div className="flex items-center gap-3 min-w-0">
//             {author?.image ? (
//               <img
//                 src={author.image}
//                 alt={authorName}
//                 className="w-9 h-9 rounded-full object-cover ring-2 ring-gray-700"
//               />
//             ) : (
//               <div
//                 aria-hidden
//                 className="w-9 h-9 rounded-full grid place-items-center text-white font-semibold ring-2 ring-gray-700
//                            bg-[conic-gradient(at_30%_30%,#f97316_0deg,#ef4444_120deg,#8b5cf6_240deg,#f97316_360deg)]"
//               >
//                 {initials}
//               </div>
//             )}
//             <div className="leading-tight min-w-0">
//               <p className="text-sm text-white/90 font-medium truncate">{authorName}</p>
//               <p className="text-xs text-gray-400">{authorRoleLabel === "Reviewer" ? "Owner" : "Employee"}</p>
//             </div>
//           </div>

//           <p className="text-xs text-gray-400 ml-4 whitespace-nowrap">{dateStr}</p>
//         </div>

//         {/* Engagement row */}
//         <div className="flex items-center justify-between">
//           {/* Like button */}
//           <div 
//             className="pointer-events-none" 
//             onClick={(e) => e.preventDefault()}
//           >
//             <LikeButton 
//               postParam={post.slug} 
//               variant="compact" 
//               showCount={true} 
//               className="pointer-events-auto"
//             />
//           </div>

//           {/* Read more */}
//           <div className="flex items-center text-blue-400 group-hover:text-blue-300">
//             <span className="text-xs font-medium">Read more</span>
//             <svg
//               className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//             >
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
//             </svg>
//           </div>
//         </div>
//       </div>
//     </Link>
//   );
// }
























// src/components/BlogCard.tsx
'use client';

import Link from "next/link";
import { useMemo, useState } from "react";
import { LikeButton } from "@/components/LikeButton";

type UserRole = "UPLOADER" | "REVIEWER";
type PostType = "BLOG" | "INSTAGRAM" | "VLOG";

type Author = {
  id?: string;
  name?: string | null;
  image?: string | null;
  role?: UserRole;
};

type CardPost = {
  id: string;
  slug: string;
  title: string;
  coverImage?: string | null;
  heroImage?: string | null;
  postType: PostType;
  createdAt: string | Date;
  likesCount?: number;
  author?: Author | null;
};

export function BlogCard({ post }: { post: CardPost }) {
  const [imageError, setImageError] = useState(false);

  const imageUrl = useMemo(() => {
    if (!imageError && post?.coverImage) return post.coverImage!;
    if (!imageError && post?.heroImage) return post.heroImage!;
    return null;
  }, [post, imageError]);

  const author = post.author ?? undefined;
  const authorName = (author?.name || "Unknown").trim();
  const authorRoleRaw: UserRole | undefined = author?.role;
  const authorRoleLabel = authorRoleRaw === "REVIEWER" ? "Reviewer" : "Author";

  const initials = authorName
    .split(/\s+/)
    .map(s => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const dateStr = useMemo(
    () =>
      new Date(post.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    [post.createdAt]
  );

  const getPostTypeStyle = (t: PostType) => {
    switch (t) {
      case "INSTAGRAM":
        return "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-pink-400 border border-pink-500/30";
      case "VLOG":
        return "bg-gradient-to-r from-red-500/20 to-orange-500/20 text-red-400 border border-red-500/30";
      case "BLOG":
      default:
        return "bg-blue-500/20 text-blue-400 border border-blue-500/30";
    }
  };

  const getPostTypeIcon = (t: PostType) => {
    switch (t) {
      case "INSTAGRAM":
        return (
          <svg className="w-3 h-3 mr-1.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919zM12 5.838a6.162 6.162 0 100 12.324A6.162 6.162 0 0012 5.838zM18.406 6.98a1.44 1.44 0 110 2.88 1.44 1.44 0 010-2.88z" />
          </svg>
        );
      case "VLOG":
        return (
          <svg className="w-3 h-3 mr-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        );
      case "BLOG":
      default:
        return (
          <svg className="w-3 h-3 mr-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293L18.707 8.707A1 1 0 0119 9.414V19a2 2 0 01-2 2z" />
          </svg>
        );
    }
  };

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block relative bg-gradient-to-b from-neutral-900/90 to-black/95 
                 border border-neutral-800/50 rounded-2xl overflow-hidden 
                 hover:shadow-2xl hover:shadow-[#9A8E2B]/10 
                 transition-all duration-500 hover:-translate-y-1 backdrop-blur-sm"
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#9A8E2B]/5 via-transparent to-transparent opacity-0  transition-opacity duration-500" />
      
      {/* Media Section */}
      {imageUrl ? (
        <div className="relative overflow-hidden h-48">
          <img
            src={imageUrl}
            alt={post.title || ""}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            onError={() => setImageError(true)}
            onLoad={() => setImageError(false)}
          />
          {/* Enhanced gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#9A8E2B]/10" />
          
          {/* Post type badge */}
          <div className="absolute top-4 left-4">
            <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full font-medium ${getPostTypeStyle(post.postType)}`}>
              {getPostTypeIcon(post.postType)}
              {post.postType}
            </span>
          </div>

          {/* Date in corner */}
          <div className="absolute top-4 right-4">
            <div className="px-3 py-2.5 flex items-center justify-center rounded-full bg-black/60 backdrop-blur-sm border border-white/10">
              <span className="text-xs text-white/90 font-medium">{dateStr}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative w-full h-48 bg-gradient-to-br from-neutral-800 via-neutral-900 to-black flex items-center justify-center">
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:20px_20px] animate-pulse" />
          </div>
          
          <div className="text-center relative z-10">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-[#9A8E2B]/20 to-[#F5F287]/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-[#F5F287]/70" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293L18.707 8.707A1 1 0 0119 9.414V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-sm text-white/60 font-medium">{post.postType}</p>
          </div>
          
          {/* Badges for no-image state */}
          <div className="absolute top-4 left-4">
            <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full font-medium ${getPostTypeStyle(post.postType)}`}>
              {getPostTypeIcon(post.postType)}
              {post.postType}
            </span>
          </div>
          <div className="absolute top-4 right-4">
            <div className="px-3 py-2.5 flex items-center justify-center rounded-full bg-black/60 backdrop-blur-sm border border-white/10">
              <span className="text-xs text-white/90 font-medium">{dateStr}</span>
            </div>
          </div>
        </div>
      )}

      {/* Content Section */}
      <div className="p-6 relative z-10">
        {/* Title */}
        <h3 className="text-lg font-semibold text-white/95 group-hover:text-white line-clamp-2 mb-4 leading-relaxed">
          {post.title}
        </h3>

        {/* Author Section */}
        <div className="flex items-center gap-4 mb-5">
          {author?.image ? (
            <img
              src={author.image}
              alt={authorName}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-[#9A8E2B]/30 group-hover:ring-[#9A8E2B]/50 transition-all duration-300"
            />
          ) : (
            <div className="w-10 h-10 rounded-full grid place-items-center text-white font-bold text-sm ring-2 ring-[#9A8E2B]/30 group-hover:ring-[#9A8E2B]/50 transition-all duration-300 bg-gradient-to-br from-[#9A8E2B] to-[#F5F287]">
              {initials}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white/90 truncate">{authorName}</p>
            <p className="text-xs text-white/50 mt-0.5">{authorRoleLabel === "Reviewer" ? "Owner" : "Employee"}</p>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          {/* Like Button */}
          <div 
            className="pointer-events-none" 
            onClick={(e) => e.preventDefault()}
          >
            <LikeButton 
              postParam={post.slug} 
              variant="compact" 
              showCount={true} 
              className="pointer-events-auto"
            />
          </div>

          {/* Read More */}
          <div className="flex items-center text-[#F5F287]/80 group-hover:text-[#F5F287] transition-colors duration-300">
            <span className="text-sm font-medium">Read Article</span>
            <svg
              className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}