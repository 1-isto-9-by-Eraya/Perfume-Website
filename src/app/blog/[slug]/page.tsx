// src/app/blog/[slug]/page.tsx
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Toc from "@/components/Toc";
import { LikeButton } from "@/components/LikeButton";
import { BlogCard } from "@/components/BlogCard";
import * as React from 'react';
import { RelatedPostsSection } from "@/components/RelatedPostsSection";

// Pre-generate slugs
export async function generateStaticParams() {
  const posts = await prisma.post.findMany({
    where: {
      status: 'APPROVED',
      published: true
    },
    select: { slug: true }
  });
  return posts.map((p) => ({ slug: p.slug }));
}

type ImageSpec = {
  url: string;
  position: "above" | "below" | "between";
  betweenIndex?: number;
};

type Section = {
  heading: string;
  paragraphs: string[];
  images: ImageSpec[];
};

// Helper function to convert Instagram URL to embed URL
function getInstagramEmbedUrl(url: string): string | null {
  try {
    const regex = /instagram\.com\/(?:p|reel)\/([A-Za-z0-9_-]+)/;
    const match = url.match(regex);
    if (match && match[1]) {
      return `https://www.instagram.com/p/${match[1]}/embed/`;
    }
    return null;
  } catch {
    return null;
  }
}

// Helper function to extract YouTube video ID
function getYouTubeVideoId(url: string): string | null {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

// Helper function to extract Vimeo video ID
function getVimeoVideoId(url: string): string | null {
  const regex = /(?:vimeo\.com\/)(\d+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

// Component for Instagram embed
function InstagramEmbed({ url, post }: { url: string; post: any }) {
  const embedUrl = getInstagramEmbedUrl(url);

  const getDescription = () => {
    if (Array.isArray(post.sections)) {
      const descriptionItem = post.sections.find((item: any) =>
        item.id === "description-1" || (item.type === "paragraph" && item.content)
      );
      return descriptionItem?.content || null;
    }
    return null;
  };

  const description = getDescription();

  return (
    <div className="max-w-2xl mx-auto">
      {embedUrl ? (
        // Successfully embedded Instagram post
        <div className="overflow-hidden shadow-2xl flex flex-col items-center">
          <iframe
            src={embedUrl}
            width="100%"
            height="700"
            frameBorder={0}
            scrolling="no"
            className="md:w-[73%] rounded-2xl"
          />
        </div>
      ) : (
        // Fallback design when embed fails
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl overflow-hidden shadow-xl border border-purple-100 dark:border-gray-700">
          {/* Header */}
          <div className="px-6 py-4 border-b border-purple-100 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Instagram Post</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">From {post.author?.name || 'Author'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                  External Link
                </span>
              </div>
            </div>
          </div>

          {/* Hero Image if available */}
          {post.heroImage && (
            <div className="relative">
              <img
                src={post.heroImage}
                alt="Instagram post preview"
                className="w-full h-96 object-cover"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          )}

          {/* Content */}
          <div className="p-8">
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>
                  {/* Pulse effect */}
                  <div className="absolute inset-0 w-20 h-20 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-2xl animate-ping opacity-20"></div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  View Original Instagram Post
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed max-w-md mx-auto">
                  This post is best viewed on Instagram. Click below to see the full content, comments, and interactions.
                </p>
              </div>

              <div className="pt-2">
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center px-8 py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 hover:from-purple-700 hover:via-pink-700 hover:to-orange-700 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                >
                  <svg className="w-5 h-5 mr-3 transition-transform group-hover:rotate-12" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                  </svg>
                  Open in Instagram
                  <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    ✨
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Description Section - Redesigned */}
      {description && (
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden md:w-[73%] mx-auto">
          <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-800 border-b border-gray-200 dark:border-gray-600">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white">About this post</h4>
            </div>
          </div>
          <div className="p-6">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
              {description}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Component for Video embed (inline, 90vh container)
function VideoEmbed({ url, post }: { url: string; post: any }) {
  const youtubeId = getYouTubeVideoId(url);
  const vimeoId = getVimeoVideoId(url);

  const getDescription = () => {
    if (Array.isArray(post.sections)) {
      const descriptionItem = post.sections.find((item: any) =>
        item.id === "description-1" || (item.type === "paragraph" && item.content)
      );
      return descriptionItem?.content || null;
    }
    return null;
  };

  const description = getDescription();

  return (
    <div className="mb-8">
      {youtubeId ? (
        <div className="mb-6 relative w-full h-[90vh]">
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}`}
            title="YouTube video player"
            className="absolute inset-0 w-full h-full rounded-lg"
            frameBorder={0}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      ) : vimeoId ? (
        <div className="mb-6 relative w-full h-[90vh]">
          <iframe
            src={`https://player.vimeo.com/video/${vimeoId}`}
            title="Vimeo video player"
            className="absolute inset-0 w-full h-full rounded-lg"
            frameBorder={0}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        // Default: assume a direct file (e.g., UploadThing/utfs.io) and play inline
        <div className="mb-6 relative w-full h-[90vh] bg-black rounded-lg border border-gray-700">
          <video
            src={url}
            controls
            playsInline
            preload="metadata"
            poster={post.heroImage || undefined}
            className="absolute inset-0 w-full h-full object-contain rounded-lg"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      )}

      {description && (
        <div className="mb-6 p-4 bg-gray-800/40 rounded-lg border border-gray-600">
          <h4 className="text-gray-300 font-medium mb-2 flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            About this video
          </h4>
          <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{description}</p>
        </div>
      )}
    </div>
  );
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  });

  if (!post || post.status !== 'APPROVED' || !post.published) {
    return notFound();
  }

  // Fetch related posts (latest posts excluding current)
  const relatedPosts = await prisma.post.findMany({
    where: {
      status: 'APPROVED',
      published: true,
      NOT: {
        slug: slug // Exclude current post
      }
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 5, // Limit to 5 related posts for carousel
  });

  const raw = post.sections as unknown;
  const sections: Section[] = Array.isArray(raw)
    ? (raw as Section[])
    : Array.isArray((raw as any)?.sections)
    ? ((raw as any).sections as Section[])
    : [];

  const renderPostTypeContent = () => {
    switch (post.postType) {
      case 'INSTAGRAM':
        return post.instagramUrl ? (
          <InstagramEmbed url={post.instagramUrl} post={post} />
        ) : null;

      case 'VLOG':
        return post.videoUrl ? (
          <VideoEmbed url={post.videoUrl} post={post} />
        ) : null;

      default:
        return null;
    }
  };

  const getPostTypeIndicator = () => {
    switch (post.postType) {
      case 'INSTAGRAM':
        return (
          <div className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-full text-sm">
            <svg className="w-4 h-4 mr-2 text-pink-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            <span className="text-pink-300">Instagram Post</span>
          </div>
        );
      case 'VLOG':
        return (
          <div className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-red-600/20 to-orange-600/20 border border-red-500/30 rounded-full text-sm">
            <svg className="w-4 h-4 mr-2 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span className="text-red-300">Vlog Post</span>
          </div>
        );
      default:
        return (
          <div className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-full text-sm">
            <svg className="w-4 h-4 mr-2 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-blue-300">Blog Post</span>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <article className="container mx-auto px-4 py-8">
        <header className="mb-8">
          {/* Post Type Indicator */}
          <div className="mb-6">
            {getPostTypeIndicator()}
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl pb-2 font-semibold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-6">
            {post.title}
          </h1>

          {/* Likes Button and Published Details - Above Hero Image */}
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-700/30">
            {/* Like Button */}
            <div className="flex items-center">
              <LikeButton postParam={post.slug} variant="default" showCount={true} />
            </div>

            {/* Published Details */}
            <div className="flex items-center space-x-4 text-gray-400">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-medium">
                  {new Date(post.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric"
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Hero Image - Now appears after likes and published date */}
          {post.heroImage && post.postType !== 'VLOG' ? (
            <div className="relative">
              <img
                src={post.heroImage}
                alt=""
                className="w-full max-h-[60vh] rounded-lg border border-gray-700 object-cover"
                style={{ minHeight: '300px' }}
                loading="eager"
              />
            </div>
          ) : null}
        </header>

        <div className={`grid gap-8 ${post.postType === 'INSTAGRAM' || post.postType === 'VLOG' ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-4'}`}>
          {/* MAIN CONTENT */}
          <main className={`order-2 lg:order-1 ${post.postType === 'INSTAGRAM' || post.postType === 'VLOG' ? 'col-span-1' : 'lg:col-span-3'}`}>
            <div className="space-y-12">
              {/* Post Type Specific Content */}
              {renderPostTypeContent()}

              {/* Regular Blog Sections */}
              {sections.length > 0 && sections.some(sec => sec.heading && sec.paragraphs.length > 0) && sections.map((sec, sIdx) => (
                <div key={sIdx}>
                  <SectionBlock section={sec} index={sIdx} />
                  {sIdx < sections.length - 1 && (
                    <div className="mt-12 mb-12">
                      <hr className="border-gray-700 border-t-2" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </main>

          {/* TOC SIDEBAR - only for BLOG posts */}
          {post.postType === 'BLOG' && sections.length > 0 && sections.some(sec => sec.heading) && (
            <aside className="jptbtoc lg:col-span-1 order-1 lg:order-2">
              <div className="lg:sticky lg:top-8">
                <Toc
                  className="bg-gray-800/40 border border-gray-600 rounded-lg p-4"
                  headings={sections.map((s, i) => ({
                    id: `s-${i}`,
                    text: s.heading,
                  }))}
                />
              </div>
            </aside>
          )}
        </div>
      </article>

      {/* Related Posts Section */}
      <RelatedPostsSection posts={relatedPosts} />
    </div>
  );
}

/** Server-safe renderer with improved image handling */
function SectionBlock({ section, index }: { section: Section; index: number }) {
  const id = `s-${index}`;
  const blocks: Array<{ type: "img" | "p"; value: any }> = [];

  const images = Array.isArray(section.images) ? section.images : [];
  const paragraphs = Array.isArray(section.paragraphs) ? section.paragraphs : [];

  images
    .filter((i) => i.position === "above")
    .forEach((img) => blocks.push({ type: "img", value: img }));

  paragraphs.forEach((p, pi) => {
    blocks.push({ type: "p", value: p });
    images
      .filter((i) => i.position === "between" && i.betweenIndex === pi)
      .forEach((img) => blocks.push({ type: "img", value: img }));
  });

  images
    .filter((i) => i.position === "below")
    .forEach((img) => blocks.push({ type: "img", value: img }));

  return (
    <section id={id} className="scroll-mt-24 mb-12">
      <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-white">
        {section.heading}
      </h2>
      <div className="space-y-6">
        {blocks.map((b, i) =>
          b.type === "p" ? (
            <p key={i} className="leading-7 text-gray-300 text-lg">
              {b.value}
            </p>
          ) : (
            <div key={i} className="relative">
              <img
                src={b.value.url}
                className="w-full max-h-[60vh] rounded-lg border border-gray-700 object-cover"
                alt=""
                style={{ minHeight: '200px' }}
                loading="lazy"
              />
            </div>
          )
        )}
      </div>
    </section>
  );
}