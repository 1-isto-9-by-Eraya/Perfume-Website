// src/components/Editor/PostDetailsSection.tsx
import React from 'react';
// Import from the correct path - assuming ImageUploader is in the uploadthing library or create-post directory
import { UploadButton } from '@/lib/uploadthing';

interface PostDetailsSectionProps {
  title: string;
  setTitle: (title: string) => void;
  heroImage: string;
  setHeroImage: (url: string) => void;
  coverImage: string;
  setCoverImage: (url: string) => void;
  invalidTitle: boolean;
  onTitleBlur: () => void;
}

// Simple ImageUploader component replacement
interface ImageUploaderProps {
  label: string;
  onUploaded: (url: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ label, onUploaded }) => {
  return (
    <UploadButton
      endpoint="imageUploader"
      onClientUploadComplete={(res) => {
        if (res?.[0]) {
          onUploaded(res[0].url);
        }
      }}
      onUploadError={(error) => {
        console.error('Upload error:', error);
        alert('Upload failed. Please try again.');
      }}
      appearance={{
        button: "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium",
        allowedContent: "text-gray-400 text-xs mt-1"
      }}
    />
  );
};

export function PostDetailsSection({
  title,
  setTitle,
  heroImage,
  setHeroImage,
  coverImage,
  setCoverImage,
  invalidTitle,
  onTitleBlur,
}: PostDetailsSectionProps) {
  return (
    <section className="border-b border-gray-700 pb-8">
      <h2 className="text-2xl font-semibold mb-6 flex items-center space-x-2" style={{ color: '#fffff2' }}>
        <div className="w-1 h-8 bg-blue-500 rounded-full"></div>
        <span>Post Details</span>
      </h2>
      
      <div className="space-y-6">
        <div className="space-y-3">
          <label className="flex items-center space-x-2 text-sm font-medium" style={{ color: '#fffff2' }}>
            <span>Post Title</span>
            <span className="text-red-400">*</span>
          </label>
          <input
            className={`w-full text-xl font-medium px-6 py-4 rounded-xl border outline-none transition-all duration-200 ${
              invalidTitle 
                ? "border-red-500 focus:border-red-400 focus:ring-4 focus:ring-red-500/20" 
                : "border-gray-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
            }`}
            style={{ 
              backgroundColor: '#2a2a2a67', 
              color: '#ffffff',
            }}
            placeholder="Enter your post title..."
            value={title}
            onBlur={onTitleBlur}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          {invalidTitle && (
            <p className="text-sm text-red-400 flex items-center space-x-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>Please add a title for your post</span>
            </p>
          )}
        </div>

        <div className="grid md:grid-cols-[1fr_auto] gap-4 items-end">
          <div className="space-y-3">
            <label className="text-sm font-medium" style={{ color: '#fffff2' }}>
              Hero Image
            </label>
            <input
              className="w-full px-4 py-3 rounded-lg border border-gray-600 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
              style={{ backgroundColor: '#2a2a2a67', color: '#ffffff' }}
              placeholder="Paste image URL or upload below..."
              value={heroImage}
              onChange={(e) => setHeroImage(e.target.value)}
            />
          </div>
          <ImageUploader
            label="Upload Hero"
            onUploaded={(url: string) => setHeroImage(url)}
          />
        </div>

        {heroImage && (
          <div className="group relative">
            <img
              src={heroImage}
              alt="Hero preview"
              className="w-full h-64 object-cover rounded-xl border border-gray-600"
            />
            <button
              type="button"
              onClick={() => setHeroImage("")}
              className="absolute top-3 right-3 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        <div className="grid md:grid-cols-[1fr_auto] gap-4 items-end">
          <div className="space-y-3">
            <label className="text-sm font-medium" style={{ color: '#fffff2' }}>
              Cover Image <span className="text-gray-500 text-xs">(for blog card previews)</span>
            </label>
            <input
              className="w-full px-4 py-3 rounded-lg border border-gray-600 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
              style={{ backgroundColor: '#2a2a2a67', color: '#ffffff' }}
              placeholder="Paste cover image URL or upload below..."
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
            />
          </div>
          <ImageUploader
            label="Upload Cover"
            onUploaded={(url: string) => setCoverImage(url)}
          />
        </div>

        {coverImage && (
          <div className="group relative">
            <img
              src={coverImage}
              alt="Cover preview"
              className="w-full h-48 object-cover rounded-xl border border-gray-600"
            />
            <button
              type="button"
              onClick={() => setCoverImage("")}
              className="absolute top-3 right-3 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}