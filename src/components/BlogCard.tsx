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
//   likesCount?: number;
//   author?: Author | null;
// };

// export function BlogCard({ post }: { post: CardPost }) {
//   const [imageError, setImageError] = useState(false);

//   const imageUrl = useMemo(() => {
//     if (!imageError && post?.coverImage) return post.coverImage!;
//     if (!imageError && post?.heroImage) return post.heroImage!;
//     return null;
//   }, [post, imageError]);

//   const author = post.author ?? undefined;
//   const authorName = (author?.name || "Unknown").trim();
//   const authorRoleRaw: UserRole | undefined = author?.role;
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
//           <svg className="w-3 h-3 mr-1.5" viewBox="0 0 24 24" fill="currentColor">
//             <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919zM12 5.838a6.162 6.162 0 100 12.324A6.162 6.162 0 0012 5.838zM18.406 6.98a1.44 1.44 0 110 2.88 1.44 1.44 0 010-2.88z" />
//           </svg>
//         );
//       case "VLOG":
//         return (
//           <svg className="w-3 h-3 mr-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
//           </svg>
//         );
//       case "BLOG":
//       default:
//         return (
//           <svg className="w-3 h-3 mr-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293L18.707 8.707A1 1 0 0119 9.414V19a2 2 0 01-2 2z" />
//           </svg>
//         );
//     }
//   };


//           {/* Post type badge */}
//           <div className="absolute top-4 left-4">
//             <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full font-medium ${getPostTypeStyle(post.postType)}`}>
//               {getPostTypeIcon(post.postType)}
//               {post.postType}
//             </span>
//           </div>



// src/components/BlogCard.tsx
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { LikeButton } from "@/components/LikeButton";
import { UserIcon } from "@heroicons/react/24/solid";

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
  const authorRoleLabel = authorRoleRaw === "REVIEWER" ? "Owner" : "Employee";

  const initials =
    (authorName ?? "Anonymous")
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() || "")
      .join("") || "AN";

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
        return {
          bg: "bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30",
          text: "text-pink-300",
          icon: (
            <svg className="w-4 h-4 mr-2 text-pink-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          ),
        };
      case "VLOG":
        return {
          bg: "bg-gradient-to-r from-red-500/20 to-orange-500/20 text-red-400 border border-red-500/30",
          text: "text-red-100",
          icon: (
            <svg className="w-4 h-4 mr-2 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          ),
        };
      case "BLOG":
      default:
        return {
          bg: "bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/30",
          text: "text-blue-300",
          icon: (
            <svg
              className="w-3.5 h-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293L18.707 8.707A1 1 0 0119 9.414V19a2 2 0 01-2 2z"
              />
            </svg>
          ),
        };
    }
  };

  const typeStyle = getPostTypeStyle(post.postType);

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block relative bg-gradient-to-br from-neutral-900 via-neutral-900/95 to-black 
                 border border-neutral-800/50 rounded-2xl overflow-hidden 
                 hover:shadow-2xl hover:shadow-[#9A8E2B]/20 
                 transition-all duration-500 hover:-translate-y-2 backdrop-blur-sm"
    >
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#9A8E2B]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Media Section with Like Button */}
      <div className="relative">
        {imageUrl ? (
          <div className="relative overflow-hidden h-52">
            <img
              src={imageUrl}
              alt={post.title || ""}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              onError={() => setImageError(true)}
              onLoad={() => setImageError(false)}
            />
            {/* Gradient overlay for better text visibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/20" />
          </div>
        ) : (
          <div className="relative w-full h-52 bg-gradient-to-br from-neutral-800 via-neutral-900 to-black flex items-center justify-center">
            {/* Pattern background */}
            <div className="absolute inset-0 opacity-5">
              {/* <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3Cpattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse"%3E%3Cpath d="M 60 0 L 0 0 0 60" fill="none" stroke="white" stroke-width="1"/%3E%3C/pattern%3E%3C/defs%3E%3Crect width="100%25" height="100%25" fill="url(%23grid)" /%3E%3C/svg%3E')]" /> */}
              <div className="absolute inset-0 opacity-5 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:60px_60px]" />
            </div>

            <div className="text-center relative z-10">
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#9A8E2B]/20 to-[#F5F287]/20 flex items-center justify-center backdrop-blur-sm">
                <svg
                  className="w-10 h-10 text-[#F5F287]/60"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <p className="text-sm text-white/40 font-medium">
                No Preview Available
              </p>
            </div>
          </div>
        )}

        {/* Like Button - Top Right */}
        <div className="absolute top-4 right-4 z-20">
          <div
            className="backdrop-blur-md  rounded-full  hover:bg-black/70 transition-all duration-300"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <LikeButton
              postParam={post.slug}
              variant="compact"
              showCount={true}
              className="!bg-transparent hover:!bg-white/10"
            />
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 relative z-10">
        {/* Title */}
        <h3 className="text-xl font-bold text-white group-hover:text-[#F5F287] transition-colors duration-300 line-clamp-2 mb-4 leading-snug">
          {post.title}
        </h3>

        {/* Author Section */}
        <div className="flex items-center gap-3 mb-6">
          <div className="relative">
            {/* {author?.image ? (
              <img
                src={author.image}
                alt={authorName}
                className="w-11 h-11 rounded-full object-cover ring-2 ring-neutral-800 group-hover:ring-[#9A8E2B]/40 transition-all duration-300"
              />
            ) : (
              <div className="w-11 h-11 rounded-full grid place-items-center bg-gray-400 text-white ring-2 ring-neutral-800 group-hover:ring-[#9A8E2B]/40 transition-all duration-300">
                <UserIcon className="w-6 h-6 text-gray-600" />
              </div>
            )} */}
            <div className="w-11 h-11 rounded-full grid place-items-center bg-gray-400 text-white ring-2 ring-neutral-800 group-hover:ring-[#9A8E2B]/40 transition-all duration-300">
              <span className="text-sm font-semibold">{initials}</span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white/90 truncate">
              {authorName}
            </p>
            <p className="text-xs text-white/40">{authorRoleLabel}</p>
          </div>
          <div className="flex items-center gap-1 text-xs text-white/40 -mb-12">
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="">{dateStr}</span>
          </div>
        </div>

        {/* Bottom Metadata Row */}
        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          {/* Post Type Badge */}
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${typeStyle.bg} ${typeStyle.text}`}
          >
            {typeStyle.icon}
            <span>{post.postType}</span>
          </div>

          {/* Read More Link */}
          <div className="flex items-center gap-3 text-xs text-white/40">
            <div className="flex items-center text-[#F5F287]/80 group-hover:text-[#F5F287] transition-colors duration-300">
             <span className="text-sm font-medium">Read More</span>
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

        {/* Hover indicator - subtle arrow */}
        {/* <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
          <svg
            className="w-5 h-5 text-[#F5F287]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </div> */}
      </div>
    </Link>
  );
}
