// src/components/reviews/PostPreview.tsx
'use client';

import React from 'react';
import { XMarkIcon, UserIcon, CalendarIcon, ClockIcon, TagIcon, EyeIcon } from '@heroicons/react/24/outline';
import ApprovalActions from './ApprovalActions';
import type { PostWithDetails } from '@/types/auth';

interface PostPreviewProps {
  post: PostWithDetails;
  onClose: () => void;
  onStatusChange: (postId: string) => void;
}

// Types matching the schema and post page
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

export default function PostPreview({ post, onClose, onStatusChange }: PostPreviewProps) {
  // Handle ESC key to close
  React.useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [onClose]);

  // Prevent body scroll when modal is open
  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
    };
  }, []);

  // Function to render images based on position
  const renderImagesAtPosition = (images: ImageSpec[], position: "above" | "below", paragraphIndex?: number) => {
    return images
      .filter(img => {
        if (position === "above") return img.position === "above";
        if (position === "below") return img.position === "below";
        return img.position === "between" && img.betweenIndex === paragraphIndex;
      })
      .map((img, index) => (
        img.url && (
          <div key={`${position}-${index}`} className="relative mb-6">
            <img 
              src={img.url} 
              alt="Section image" 
              className="w-full max-h-[60vh] rounded-lg border border-gray-700 object-cover"
              style={{ minHeight: '200px' }}
              loading="lazy"
            />
          </div>
        )
      ));
  };

  // Render post sections matching the post page style
  const renderSections = () => {
    try {
      if (!post.sections || !Array.isArray(post.sections)) {
        return (
          <div className="text-center py-16">
            <div className="bg-gray-800/40 border border-gray-600 rounded-lg p-8 max-w-md mx-auto">
              <EyeIcon className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <p className="text-lg text-gray-400 font-medium">No content sections found</p>
              <p className="text-sm text-gray-500 mt-2">This post may be empty or have formatting issues.</p>
            </div>
          </div>
        );
      }

      if (post.sections.length === 0) {
        return (
          <div className="text-center py-16">
            <div className="bg-gray-800/40 border border-gray-600 rounded-lg p-8 max-w-md mx-auto">
              <EyeIcon className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <p className="text-lg text-gray-400 font-medium">No content sections added</p>
              <p className="text-sm text-gray-500 mt-2">The author hasn't added any content yet.</p>
            </div>
          </div>
        );
      }

      // Check if this is the new format (sections with heading, paragraphs, images)
      const firstSection = post.sections[0] as any;
      const isNewFormat = firstSection && 
                         typeof firstSection === 'object' && 
                         'heading' in firstSection && 
                         'paragraphs' in firstSection && 
                         'images' in firstSection;

      if (isNewFormat) {
        // New format: render sections like the post page
        const sections = post.sections as Section[];
        return sections.map((section, sectionIndex) => {
          const blocks: Array<{ type: "img" | "p"; value: any }> = [];

          // Build blocks array like in the post page
          section.images
            .filter((i) => i.position === "above")
            .forEach((img) => blocks.push({ type: "img", value: img }));

          section.paragraphs.forEach((p, pi) => {
            blocks.push({ type: "p", value: p });
            section.images
              .filter((i) => i.position === "between" && i.betweenIndex === pi)
              .forEach((img) => blocks.push({ type: "img", value: img }));
          });

          section.images
            .filter((i) => i.position === "below")
            .forEach((img) => blocks.push({ type: "img", value: img }));

          return (
            <section key={sectionIndex} id={`s-${sectionIndex}`} className="scroll-mt-24 mb-12">
              {section.heading && (
                <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-white">
                  {section.heading}
                </h2>
              )}
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
        });
      } else {
        // Old format: render sections with type, content, etc.
        return post.sections.map((section: any, index: number) => {
          switch (section.type) {
            case 'paragraph':
              return (
                <div key={index} className="mb-6">
                  <p className="leading-7 text-gray-300 text-lg">{section.content}</p>
                </div>
              );
            case 'heading':
              return (
                <div key={index} className="mb-6">
                  <h2 className="text-2xl md:text-3xl font-semibold text-white">{section.content}</h2>
                </div>
              );
            case 'image':
              return (
                <div key={index} className="mb-6">
                  {section.url && (
                    <div className="relative">
                      <img 
                        src={section.url} 
                        alt={section.caption || 'Post image'} 
                        className="w-full max-h-[60vh] rounded-lg border border-gray-700 object-cover"
                        style={{ minHeight: '200px' }}
                        loading="lazy"
                      />
                      {section.caption && (
                        <p className="text-sm text-gray-400 mt-3 italic text-center">{section.caption}</p>
                      )}
                    </div>
                  )}
                </div>
              );
            case 'divider':
              return (
                <div key={index} className="mb-8">
                  <hr className="border-gray-600 my-8" />
                </div>
              );
            default:
              return (
                <div key={index} className="mb-6">
                  <div className="bg-gray-800/40 border border-gray-600 rounded-lg p-4">
                    <p className="text-gray-400 text-sm mb-2">Unknown content type:</p>
                    <pre className="text-gray-300 whitespace-pre-wrap text-sm overflow-auto max-h-40">
                      {JSON.stringify(section, null, 2)}
                    </pre>
                  </div>
                </div>
              );
          }
        });
      }
    } catch (error) {
      console.error('Error rendering sections:', error);
      return (
        <div className="mb-6 p-6 bg-red-900/20 border border-red-500/30 rounded-lg">
          <p className="text-red-400 text-lg font-medium">Error rendering post content</p>
          <details className="mt-4">
            <summary className="text-red-300 cursor-pointer hover:text-red-200">Show debug info</summary>
            <pre className="text-red-200 text-xs mt-3 overflow-auto max-h-40 bg-red-900/10 p-3 rounded">
              {JSON.stringify(post.sections, null, 2)}
            </pre>
          </details>
        </div>
      );
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'APPROVED': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'REJECTED': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'NEEDS_UPDATE': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black">
      <div className="h-full flex flex-col">
        {/* Header with Close Button */}
        <div className="bg-gray-900/95 border-b border-gray-700 px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-white">Post Review</h1>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-md text-sm font-medium border ${getStatusColor(post.status)}`}>
                  {post.status}
                </span>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-md text-sm font-medium">
                  {post.postType}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400">Press ESC to close</span>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors group"
                title="Close Preview (ESC)"
              >
                <XMarkIcon className="h-6 w-6 text-gray-400 group-hover:text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Layout - Matching Post Page Style */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full grid grid-cols-1 lg:grid-cols-4 gap-0">
            
            {/* Main Content Area (3/4) - Matching Post Page */}
            <main className="lg:col-span-3 overflow-y-auto bg-black">
              <div className="container mx-auto px-4 py-8">
                
                {/* Close Button in Content Area */}
                <div className="flex justify-end mb-4">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-800/80 hover:bg-gray-700 rounded-lg transition-all duration-200 backdrop-blur-sm border border-gray-600 group text-sm text-gray-300 hover:text-white"
                    title="Close Preview (ESC)"
                  >
                    <XMarkIcon className="h-4 w-4 inline mr-2" />
                    Close Preview
                  </button>
                </div>

                {/* Article Header - Matching Post Page Style */}
                <header className="mb-8">
                  <h1 className="text-4xl md:text-6xl pb-2 font-semibold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                    {post.title}
                  </h1>

                  {/* Post Meta */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mt-4 mb-6">
                    <div className="flex items-center gap-2">
                      <UserIcon className="h-4 w-4" />
                      <span>By {post.author?.name || post.author?.email || 'Unknown'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      <span>{new Date(post.createdAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ClockIcon className="h-4 w-4" />
                      <span>{new Date(post.createdAt).toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}</span>
                    </div>
                  </div>

                  {/* URL Preview */}
                  <div className="flex items-center gap-2 text-sm bg-gray-800/40 border border-gray-600 rounded-lg p-3 mb-6">
                    <TagIcon className="h-4 w-4 text-gray-500 flex-shrink-0" />
                    <span className="text-gray-500">URL:</span>
                    <span className="font-mono text-blue-400">/blog/{post.slug}</span>
                  </div>

                  {/* Hero Image - Matching Post Page Style */}
                  {post.heroImage && (
                    <div className="mt-6 relative">
                      <img
                        src={post.heroImage}
                        alt=""
                        className="w-full max-h-[60vh] rounded-lg border border-gray-700 object-cover"
                        style={{ minHeight: '300px' }}
                        loading="eager"
                      />
                    </div>
                  )}
                </header>

                {/* Cover Image (if different from hero) */}
                {post.coverImage && post.coverImage !== post.heroImage && (
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm font-medium text-gray-300">Cover Image</span>
                      <span className="text-xs text-gray-500">(used for blog cards)</span>
                    </div>
                    <img 
                      src={post.coverImage} 
                      alt="Cover image" 
                      className="w-72 h-48 object-cover rounded-lg border-2 border-gray-600"
                    />
                  </div>
                )}

                {/* Post Type Specific Content */}
                {post.postType === 'INSTAGRAM' && post.instagramUrl && (
                  <div className="mb-10 p-6 bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/30 rounded-xl">
                    <h3 className="text-pink-400 font-semibold text-lg mb-3">
                      Instagram Post
                    </h3>
                    <a 
                      href={post.instagramUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 underline break-all"
                    >
                      {post.instagramUrl}
                    </a>
                  </div>
                )}

                {post.postType === 'VLOG' && post.videoUrl && (
                  <div className="mb-10">
                    <h3 className="text-purple-400 font-semibold text-lg mb-4">
                      Video Content
                    </h3>
                    {post.videoUrl.includes('youtube.com') || post.videoUrl.includes('youtu.be') ? (
                      <div className="aspect-video bg-black rounded-xl flex items-center justify-center border-2 border-gray-600">
                        <div className="text-center text-gray-400">
                          <p className="text-lg mb-2">YouTube Video</p>
                          <a 
                            href={post.videoUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 underline"
                          >
                            Watch on YouTube
                          </a>
                        </div>
                      </div>
                    ) : (
                      <video 
                        src={post.videoUrl} 
                        controls 
                        className="w-full rounded-xl shadow-lg"
                      >
                        Your browser does not support the video tag.
                      </video>
                    )}
                  </div>
                )}

                {/* Post Content - Matching Post Page Style */}
                <div className="space-y-12">
                  {renderSections()}
                </div>
              </div>
            </main>

            {/* Approval Actions Sidebar (1/4) - Matching Post Page Sidebar Style */}
            <aside className="lg:col-span-1 bg-gray-900/98 border-l border-gray-700 overflow-y-auto">
              <div className="sticky top-0">
                <ApprovalActions 
                  post={post} 
                  onStatusChange={onStatusChange}
                  onClose={onClose}
                />
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}