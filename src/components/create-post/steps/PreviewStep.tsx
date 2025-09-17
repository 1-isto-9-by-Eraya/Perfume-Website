// src/components/create-post/steps/PreviewStep.tsx
import { EyeIcon, CalendarIcon, UserIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import type { CreatePostData } from '@/types/createPost';

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

interface PreviewStepProps {
  postData: CreatePostData & {
    sections?: Section[];
  };
}

export default function PreviewStep({ postData }: PreviewStepProps) {
  // Safety check - if postData is undefined, show loading state
  if (!postData) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-600 rounded w-1/4 mx-auto mb-4"></div>
            <div className="h-8 bg-gray-600 rounded w-1/2 mx-auto"></div>
          </div>
          <p className="text-gray-400 mt-4">Loading preview...</p>
        </div>
      </div>
    );
  }

  // Ensure sections is always an array
  const sections = postData.sections || [];

  // Function to extract description from sections
  const getDescription = () => {
    if (Array.isArray(postData.sections)) {
      const descriptionItem = postData.sections.find((item: any) => 
        item.id === "description-1" || (item.type === "paragraph" && item.content)
      );
      return descriptionItem?.content || null;
    }
    return null;
  };

  // Function to render images based on position
  const renderImagesAtPosition = (images: ImageSpec[], position: "above" | "below", paragraphIndex?: number) => {
    if (!Array.isArray(images)) return null;
    
    return images
      .filter(img => {
        if (position === "above") return img.position === "above";
        if (position === "below") return img.position === "below";
        return img.position === "between" && img.betweenIndex === paragraphIndex;
      })
      .map((img, index) => (
        img.url && (
          <div key={`${position}-${index}`} className="mb-4">
            <img 
              src={img.url} 
              alt="Section image" 
              className="w-full rounded-lg border border-gray-600 object-cover"
            />
          </div>
        )
      ));
  };

  // Function to render blog sections matching the post page structure
  const renderSections = () => {
    if (!sections || sections.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          <p>No content sections added</p>
        </div>
      );
    }

    return sections.map((section, sectionIndex) => (
      <div key={sectionIndex} className="mb-8">
        {/* Section Heading */}
        {section.heading && (
          <h2 className="text-2xl font-semibold text-[#ffffff] mb-6">
            {section.heading}
          </h2>
        )}

        {/* Images positioned "above" */}
        {renderImagesAtPosition(section.images || [], "above")}

        {/* Paragraphs with images "between" */}
        {Array.isArray(section.paragraphs) && section.paragraphs.map((paragraph, paragraphIndex) => (
          <div key={paragraphIndex}>
            {paragraph.trim() && (
              <p className="text-[#fffff2] leading-relaxed mb-4 whitespace-pre-wrap">
                {paragraph}
              </p>
            )}
            
            {/* Images positioned "between" paragraphs (after this paragraph) */}
            {renderImagesAtPosition(section.images || [], "between", paragraphIndex)}
          </div>
        ))}

        {/* Images positioned "below" */}
        {renderImagesAtPosition(section.images || [], "below")}
      </div>
    ));
  };

  const renderPostTypeSpecificContent = () => {
    const description = getDescription();

    switch (postData.postType) {
      case 'INSTAGRAM':
        return (
          <div className="mb-8">
            <div className="p-6 bg-gradient-to-r from-pink-900/20 to-purple-900/20 border border-pink-500/30 rounded-lg mb-6">
              <h3 className="text-pink-400 font-medium mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                Instagram Post Integration
              </h3>
              {postData.instagramUrl ? (
                <div className="space-y-2">
                  <p className="text-pink-300 text-sm">This post will embed the following Instagram content:</p>
                  <a 
                    href={postData.instagramUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 underline text-sm break-all"
                  >
                    {postData.instagramUrl}
                  </a>
                  <div className="mt-4 p-4 bg-black/20 rounded-lg">
                    <div className="text-center text-gray-400">
                      [Instagram Post Embed will appear here]
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-pink-300 text-sm">No Instagram URL provided</p>
              )}
            </div>

            {/* Show description preview if it exists */}
            {description && (
              <div className="p-4 bg-gray-800/40 rounded-lg border border-gray-600">
                <h4 className="text-gray-300 font-medium mb-2 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Description Preview
                </h4>
                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                  {description}
                </p>
              </div>
            )}
          </div>
        );
        
      case 'VLOG':
        return (
          <div className="mb-8">
            {postData.videoUrl ? (
              <div className="relative mb-6">
                {postData.videoUrl.includes('youtube.com') || postData.videoUrl.includes('youtu.be') ? (
                  <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
                    <div className="text-center text-gray-400">
                      <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                      <p>YouTube Video Embed</p>
                      <p className="text-sm mt-1">{postData.videoUrl}</p>
                    </div>
                  </div>
                ) : postData.videoUrl.includes('vimeo.com') ? (
                  <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
                    <div className="text-center text-gray-400">
                      <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.977 6.416c-.105 2.338-1.739 5.543-4.894 9.609-3.268 4.247-6.026 6.37-8.29 6.37-1.409 0-2.578-1.294-3.553-3.881L5.322 11.4C4.603 8.816 3.834 7.522 3.01 7.522c-.179 0-.806.378-1.881 1.132L0 7.197a315.065 315.065 0 0 0 3.501-3.128C5.08 2.701 6.266 1.984 7.055 1.91c1.867-.18 3.016.166 3.447 1.04.431.875.867 2.52 1.306 4.938.439 2.417.87 4.326 1.295 5.727.424 1.402.987 2.103 1.689 2.103.702 0 1.689-.819 2.961-2.456 1.271-1.637 1.947-2.886 2.029-3.746.166-1.378-.395-2.067-1.683-2.067-.6 0-1.219.143-1.857.429 1.233-4.044 3.592-6.01 7.078-5.898 2.583.082 3.801 1.754 3.655 5.015z"/>
                      </svg>
                      <p>Vimeo Video Embed</p>
                      <p className="text-sm mt-1">{postData.videoUrl}</p>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
                    <div className="text-center text-gray-400">
                      <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.01M15 10h1.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p>Video Content</p>
                      <p className="text-sm mt-1 break-all">{postData.videoUrl}</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center mb-6">
                <div className="text-center text-gray-400">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <p>No video provided</p>
                </div>
              </div>
            )}

            {/* Show description preview if it exists */}
            {description && (
              <div className="p-4 bg-gray-800/40 rounded-lg border border-gray-600">
                <h4 className="text-gray-300 font-medium mb-2 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Description Preview
                </h4>
                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                  {description}
                </p>
              </div>
            )}
          </div>
        );
        
      default:
        return null;
    }
  };

  // Calculate content statistics with safety checks
  const totalSections = sections?.length || 0;
  const totalParagraphs = sections?.reduce((acc, section) => {
    return acc + (Array.isArray(section.paragraphs) ? section.paragraphs.length : 0);
  }, 0) || 0;
  const totalImages = sections?.reduce((acc, section) => {
    return acc + (Array.isArray(section.images) ? section.images.filter(img => img.url).length : 0);
  }, 0) || 0;
  const hasMedia = !!(postData.heroImage || postData.coverImage || postData.videoUrl || postData.instagramUrl || totalImages > 0);

  return (
    <div className="space-y-6" style={{ backgroundColor: "", color: "#ffffff" }}>
      {/* Preview Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-2">
          <EyeIcon className="w-5 h-5 text-blue-400" />
          <span className="text-blue-400 font-medium">Post Preview</span>
        </div>
        <p className="text-[#fffff2] text-sm">
          This is how your post will appear to readers
        </p>
      </div>

      {/* Preview Container */}
      <div className="bg-[#2a2a2a67] rounded-lg overflow-hidden border border-gray-700">
        {/* Post Header */}
        <div className="p-6 border-b border-gray-700">
          {/* Hero Image */}
          {postData.heroImage && (
            <div className="mb-6">
              <img 
                src={postData.heroImage} 
                alt="Hero" 
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl font-bold text-[#ffffff] mb-4">
            {postData.title || 'Untitled Post'}
          </h1>

          {/* Cover Image Preview */}
          {postData.coverImage && (
            <div className="mb-4">
              <p className="text-sm text-gray-400 mb-2">
                {postData.coverImage === postData.heroImage ? 
                  'Cover Image (same as hero):' : 
                  'Cover Image (for blog cards):'
                }
              </p>
              <img 
                src={postData.coverImage} 
                alt="Cover" 
                className="w-48 h-32 object-cover rounded-lg border border-gray-600"
              />
            </div>
          )}

          {/* Post Meta */}
          <div className="flex items-center space-x-6 text-sm text-gray-400">
            <div className="flex items-center">
              <UserIcon className="w-4 h-4 mr-2" />
              <span>You</span>
            </div>
            <div className="flex items-center">
              <CalendarIcon className="w-4 h-4 mr-2" />
              <span>{new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex items-center">
              <GlobeAltIcon className="w-4 h-4 mr-2" />
              <span className="px-2 py-1 bg-blue-900/30 text-blue-400 rounded text-xs">
                {postData.postType || 'BLOG'}
              </span>
            </div>
          </div>

          {/* URL Preview */}
          <div className="mt-4 text-sm text-gray-500">
            <span>URL: </span>
            <span className="font-mono">/blog/{postData.slug || 'untitled-post'}</span>
          </div>
        </div>

        {/* Post Content */}
        <div className="p-6">
          {/* Post Type Specific Content */}
          {renderPostTypeSpecificContent()}

          {/* Blog Content */}
          <div className="prose prose-invert max-w-none">
            {renderSections()}
          </div>
        </div>
      </div>

      {/* Content Summary */}
      <div className="bg-[#2a2a2a67] border border-gray-700 rounded-lg p-4">
        <h3 className="text-[#ffffff] font-medium mb-3">Content Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-400">Title:</span>
            <p className="text-[#fffff2] font-medium">
              {postData.title ? 'Added' : 'Missing'}
            </p>
          </div>
          <div>
            <span className="text-gray-400">Type:</span>
            <p className="text-[#fffff2] font-medium">{postData.postType || 'BLOG'}</p>
          </div>
          <div>
            <span className="text-gray-400">Sections:</span>
            <p className="text-[#fffff2] font-medium">{totalSections}</p>
          </div>
          <div>
            <span className="text-gray-400">Media:</span>
            <p className="text-[#fffff2] font-medium">
              {hasMedia ? 'Yes' : 'None'}
            </p>
          </div>
        </div>
        
        {/* Detailed Stats */}
        <div className="mt-4 pt-4 border-t border-gray-600 grid grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-400">Hero Image:</span>
            <p className="text-[#fffff2] font-medium">{postData.heroImage ? 'Set' : 'None'}</p>
          </div>
          <div>
            <span className="text-gray-400">Cover Image:</span>
            <p className="text-[#fffff2] font-medium">{postData.coverImage ? 'Set' : 'None'}</p>
          </div>
          <div>
            <span className="text-gray-400">Paragraphs:</span>
            <p className="text-[#fffff2] font-medium">{totalParagraphs}</p>
          </div>
          <div>
            <span className="text-gray-400">Images:</span>
            <p className="text-[#fffff2] font-medium">{totalImages}</p>
          </div>
        </div>
      </div>

      {/* Publishing Info */}
      <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
        <h3 className="text-yellow-400 font-medium mb-2">Publishing Information</h3>
        <ul className="text-yellow-300 text-sm space-y-1">
          <li>• This post will be submitted for review before going live</li>
          <li>• You'll receive a notification when it's approved or needs changes</li>
          <li>• The post will be accessible at: <span className="font-mono">/blog/{postData?.slug || 'untitled-post'}</span></li>
          <li>• Post type: <strong>{postData?.postType || 'BLOG'}</strong></li>
        </ul>
      </div>

      
    </div>
  );
}