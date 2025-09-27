// src/components/create-post/editors/VlogEditor.tsx - Updated with Keywords
import { useState, useCallback } from 'react';
import { VideoCameraIcon, CloudArrowUpIcon, LinkIcon, MinusIcon, PencilIcon } from '@heroicons/react/24/outline';
import { useUploadThing, UploadButton } from '@/lib/uploadthing';
import ImageEditor from './ImageEditor';
import VideoUploader from './VideoUploader';
import KeywordsInput from './KeywordsInput'; // ✅ NEW IMPORT
import type { CreatePostData, PostSection, CreatePostFormErrors } from '@/types/createPost';

interface VlogEditorProps {
  postData: CreatePostData;
  onUpdateData: (updates: Partial<CreatePostData>) => void;
  onAddSection: (section: Omit<PostSection, 'id'>) => void;
  onUpdateSection: (sectionId: string, updates: Partial<PostSection>) => void;
  onRemoveSection: (sectionId: string) => void;
  onMoveSection: (sectionId: string, direction: 'up' | 'down') => void;
  errors: CreatePostFormErrors;
}

interface ImageEditorState {
  isOpen: boolean;
  imageUrl: string;
  type: 'cover';
}

export default function VlogEditor({
  postData,
  onUpdateData,
  onAddSection,
  onUpdateSection,
  onRemoveSection,
  onMoveSection,
  errors,
}: VlogEditorProps) {
  const [videoSource, setVideoSource] = useState<'upload' | 'url'>('upload');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [imageEditor, setImageEditor] = useState<ImageEditorState>({
    isOpen: false,
    imageUrl: '',
    type: 'cover'
  });

  const isValidVideoUrl = (url: string) => {
    return url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com') || url.includes('wistia.com');
  };

  const handleEditImage = (imageUrl: string) => {
    setImageEditor({
      isOpen: true,
      imageUrl,
      type: 'cover'
    });
  };

  const handleImageSave = (editedImageUrl: string) => {
    onUpdateData({ heroImage: editedImageUrl });
    setImageEditor({ isOpen: false, imageUrl: '', type: 'cover' });
  };

  const handleImageCancel = () => {
    setImageEditor({ isOpen: false, imageUrl: '', type: 'cover' });
  };

  const handleVideoUploadComplete = (url: string) => {
    onUpdateData({ videoUrl: url });
    setIsUploading(false);
    setUploadProgress(0);
  };

  const handleVideoUploadProgress = (progress: number) => {
    setUploadProgress(progress);
  };

  const handleVideoUploadStart = () => {
    setIsUploading(true);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Basic Post Info */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#ffffff] mb-2">
              Vlog Title *
            </label>
            <input
              type="text"
              value={postData.title}
              onChange={(e) => onUpdateData({ title: e.target.value })}
              placeholder="Enter your vlog title..."
              className={`
                w-full px-4 py-3 bg-[#1a1a1a] border rounded-lg text-[#fffff2] placeholder-gray-400 focus:ring-2 focus:border-transparent transition-colors
                ${errors.title ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 focus:ring-blue-500'}
              `}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-400">{errors.title}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#ffffff] mb-2">
              Slug (URL)
            </label>
            <div className="flex items-center">
              <span className="text-gray-400 text-sm mr-2">/blog/</span>
              <input
                type="text"
                value={postData.slug}
                onChange={(e) => onUpdateData({ slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
                placeholder="auto-generated-from-title"
                className="flex-1 px-3 py-2 bg-[#1a1a1a] border border-gray-600 rounded-lg text-[#fffff2] placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          {/* ✅ NEW: Keywords/Tags Input */}
          <div>
            <label className="block text-sm font-medium text-[#ffffff] mb-2">
              Keywords & Tags
            </label>
            <KeywordsInput
              keywords={postData.keywords || []}
              onKeywordsChange={(keywords) => onUpdateData({ keywords })}
              error={errors.keywords}
              placeholder="Add keywords like 'vlog', 'video', 'lifestyle', 'tutorial'..."
            />
          </div>
        </div>

        {/* Cover Image */}
        <div>
          <label className="block text-sm font-medium text-[#ffffff] mb-2">
            Cover Image
          </label>
          {postData.heroImage ? (
            <div className="relative group">
              <img 
                src={postData.heroImage} 
                alt="Cover" 
                className="w-full h-48 object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
                <button
                  onClick={() => handleEditImage(postData.heroImage!)}
                  className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors"
                  title="Edit Image"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onUpdateData({ heroImage: undefined })}
                  className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors"
                  title="Remove Image"
                >
                  <MinusIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
              <UploadButton
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  if (res?.[0]) {
                    onUpdateData({ heroImage: res[0].url });
                  }
                }}
                onUploadError={(error) => {
                  console.error('Upload error:', error);
                  alert('Upload failed');
                }}
                appearance={{
                  button: "bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors",
                  allowedContent: "text-gray-400 text-sm mt-2"
                }}
              />
              <p className="text-gray-400 text-sm mt-2">
                Will use video thumbnail if not provided
              </p>
            </div>
          )}
        </div>

        {/* Video Content */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-[#ffffff] flex items-center">
            <VideoCameraIcon className="w-5 h-5 mr-2 text-purple-400" />
            Video Content *
          </h3>

          {/* Video Source Selection */}
          <div className="flex space-x-4">
            <button
              onClick={() => setVideoSource('upload')}
              disabled={isUploading}
              className={`
                flex-1 p-4 rounded-lg border-2 transition-colors
                ${videoSource === 'upload' 
                  ? 'border-purple-500 bg-purple-600/10' 
                  : 'border-gray-600 hover:border-gray-500'
                }
                ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <CloudArrowUpIcon className="w-8 h-8 mx-auto mb-2 text-purple-400" />
              <h4 className="font-medium text-[#ffffff]">Upload Video</h4>
              <p className="text-sm text-gray-400 mt-1">Upload from your device</p>
            </button>

            <button
              onClick={() => setVideoSource('url')}
              disabled={isUploading}
              className={`
                flex-1 p-4 rounded-lg border-2 transition-colors
                ${videoSource === 'url' 
                  ? 'border-purple-500 bg-purple-600/10' 
                  : 'border-gray-600 hover:border-gray-500'
                }
                ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <LinkIcon className="w-8 h-8 mx-auto mb-2 text-purple-400" />
              <h4 className="font-medium text-[#ffffff]">Video URL</h4>
              <p className="text-sm text-gray-400 mt-1">YouTube, Vimeo, etc.</p>
            </button>
          </div>

          {/* Video Upload/URL Input */}
          {videoSource === 'upload' ? (
            <div>
              {postData.videoUrl ? (
                <div className="relative">
                  <video 
                    src={postData.videoUrl} 
                    controls 
                    className="w-full h-64 object-cover rounded-lg bg-black"
                  >
                    Your browser does not support the video tag.
                  </video>
                  <button
                    onClick={() => onUpdateData({ videoUrl: undefined })}
                    className="absolute top-2 right-2 p-1 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors"
                  >
                    <MinusIcon className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <VideoUploader
                  onUploadComplete={handleVideoUploadComplete}
                  onUploadProgress={handleVideoUploadProgress}
                  onUploadStart={handleVideoUploadStart}
                  isUploading={isUploading}
                  uploadProgress={uploadProgress}
                />
              )}
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-[#ffffff] mb-2">
                Video URL
              </label>
              <input
                type="url"
                value={postData.videoUrl || ''}
                onChange={(e) => onUpdateData({ videoUrl: e.target.value })}
                placeholder="https://www.youtube.com/watch?v=..."
                className={`
                  w-full px-4 py-3 bg-[#1a1a1a] border rounded-lg text-[#fffff2] placeholder-gray-400 focus:ring-2 focus:border-transparent transition-colors
                  ${errors.videoUrl ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 focus:ring-blue-500'}
                `}
              />
              {errors.videoUrl && (
                <p className="mt-1 text-sm text-red-400">{errors.videoUrl}</p>
              )}
              
              {postData.videoUrl && !isValidVideoUrl(postData.videoUrl) && (
                <p className="mt-1 text-sm text-yellow-400">
                  ⚠ This doesn't look like a supported video URL. Try YouTube, Vimeo, or Wistia.
                </p>
              )}
              
              <p className="mt-2 text-sm text-gray-400">
                Supported platforms: YouTube, Vimeo, Wistia, and direct video links
              </p>

              {/* Video Preview */}
              {postData.videoUrl && isValidVideoUrl(postData.videoUrl) && (
                <div className="mt-4 p-4 bg-[#1a1a1a] rounded-lg">
                  <h4 className="text-[#ffffff] font-medium mb-2">Video Preview</h4>
                  <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <VideoCameraIcon className="w-12 h-12 mx-auto mb-2 text-gray-500" />
                      <p className="text-gray-400 text-sm">Video will be embedded here</p>
                      <p className="text-gray-500 text-xs mt-1">{postData.videoUrl}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Additional Description */}
        <div>
          <label className="block text-sm font-medium text-[#ffffff] mb-2">
            Additional Description (Optional)
          </label>
          <textarea
            value={postData.sections[0]?.content || ''}
            onChange={(e) => {
              const existingSection = postData.sections[0];
              if (existingSection) {
                // Update existing section
                onUpdateData({
                  sections: postData.sections.map((section, index) => 
                    index === 0 ? { ...section, content: e.target.value } : section
                  )
                });
              } else {
                // Add new section
                onUpdateData({
                  sections: [{
                    id: 'description-1',
                    type: 'paragraph' as const,
                    content: e.target.value,
                    heading: undefined,
                    images: function (images: any, arg1: string): import("react").ReactNode {
                      throw new Error('Function not implemented.');
                    },
                    paragraphs: undefined
                  }]
                });
              }
            }}
            placeholder="Add description, show notes, or additional context about your video..."
            rows={4}
            className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-600 rounded-lg text-[#fffff2] placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
          <p className="mt-1 text-sm text-gray-400">
            This will appear below the video on your blog.
          </p>
        </div>
      </div>

      {/* Image Editor Modal */}
      {imageEditor.isOpen && (
        <ImageEditor
          imageUrl={imageEditor.imageUrl}
          onSave={handleImageSave}
          onCancel={handleImageCancel}
        />
      )}
    </>
  );
}