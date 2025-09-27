// src/components/create-post/editors/InstagramEditor.tsx - Updated with Keywords
import { useState } from 'react';
import { LinkIcon, PhotoIcon, ExclamationTriangleIcon, PencilIcon, MinusIcon } from '@heroicons/react/24/outline';
import { UploadButton } from '@/lib/uploadthing';
import { useUploadThing } from '@/lib/uploadthing';
import ImageEditor from './ImageEditor';
import KeywordsInput from './KeywordsInput'; // ✅ NEW IMPORT
import type { CreatePostData, CreatePostFormErrors, PostSection } from '@/types/createPost';

interface InstagramEditorProps {
  postData: CreatePostData;
  onUpdateData: (updates: Partial<CreatePostData>) => void;
  errors: CreatePostFormErrors;
}

interface ImageEditorState {
  isOpen: boolean;
  imageUrl: string;
  type: 'cover';
}

export default function InstagramEditor({
  postData,
  onUpdateData,
  errors,
}: InstagramEditorProps) {
  const [isValidating, setIsValidating] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [imageEditor, setImageEditor] = useState<ImageEditorState>({
    isOpen: false,
    imageUrl: '',
    type: 'cover'
  });

  // Use the hook for more control over upload
  const { startUpload } = useUploadThing("imageUploader", {
    onClientUploadComplete: (res) => {
      if (res?.[0]) {
        onUpdateData({ coverImage: res[0].url });
        setIsUploading(false);
        setUploadProgress(0);
      }
    },
    onUploadError: (error) => {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
      setIsUploading(false);
      setUploadProgress(0);
    },
    onUploadProgress: (progress) => {
      setUploadProgress(progress);
    }
  });

  const validateInstagramUrl = async (url: string) => {
    if (!url.includes('instagram.com')) {
      return false;
    }
    
    setIsValidating(true);
    try {
      // This would typically call Instagram's API or a service to validate the URL
      // For now, we'll simulate validation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock Instagram post data
      const mockImageUrl = "https://images.unsplash.com/photo-1611095973362-88e8e2557e58?w=400&h=400&fit=crop";
      setPreviewData({
        caption: "Sample Instagram caption from the post...",
        imageUrl: mockImageUrl,
        likes: 127,
        comments: 23,
        date: new Date().toISOString(),
      });
      
      return true;
    } catch (error) {
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  const handleUrlChange = (url: string) => {
    onUpdateData({ instagramUrl: url });
    
    if (url && url.includes('instagram.com')) {
      validateInstagramUrl(url);
    } else {
      setPreviewData(null);
    }
  };

  const handleEditImage = (imageUrl: string) => {
    setImageEditor({
      isOpen: true,
      imageUrl,
      type: 'cover'
    });
  };

  const handleImageSave = (editedImageUrl: string) => {
    onUpdateData({ coverImage: editedImageUrl });
    setImageEditor({ isOpen: false, imageUrl: '', type: 'cover' });
  };

  const handleImageCancel = () => {
    setImageEditor({ isOpen: false, imageUrl: '', type: 'cover' });
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Please select a valid image file (JPEG, PNG, WebP)');
      return;
    }

    // Validate file size (4MB limit for images)
    const maxSize = 4 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('Image size must be less than 4MB');
      return;
    }

    setIsUploading(true);
    await startUpload([file]);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Basic Post Info */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#ffffff] mb-2">
              Post Title *
            </label>
            <input
              type="text"
              value={postData.title}
              onChange={(e) => onUpdateData({ title: e.target.value })}
              placeholder="Give your Instagram showcase a title..."
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
              placeholder="Add keywords like 'instagram', 'social-media', 'lifestyle'..."
            />
          </div>
        </div>

        {/* Instagram URL */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#ffffff] mb-2">
              Instagram Post URL *
            </label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="url"
                value={postData.instagramUrl || ''}
                onChange={(e) => handleUrlChange(e.target.value)}
                placeholder="https://www.instagram.com/p/YOUR_POST_ID/"
                className={`
                  w-full pl-10 pr-4 py-3 bg-[#1a1a1a] border rounded-lg text-[#fffff2] placeholder-gray-400 focus:ring-2 focus:border-transparent transition-colors
                  ${errors.instagramUrl ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 focus:ring-blue-500'}
                `}
              />
              {isValidating && (
                <div className="absolute right-3 top-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-400"></div>
                </div>
              )}
            </div>
            {errors.instagramUrl && (
              <p className="mt-1 text-sm text-red-400">{errors.instagramUrl}</p>
            )}
            
            <div className="mt-2 text-sm text-gray-400">
              <p>Paste the URL of the Instagram post you want to showcase.</p>
              <p>Example: https://www.instagram.com/p/ABC123DEF456/</p>
            </div>
          </div>
        </div>

        {/* Cover Image */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-[#ffffff]">Cover Image</h3>
          
          <div>
            {postData.coverImage ? (
              <div className="relative group">
                <img 
                  src={postData.coverImage} 
                  alt="Cover" 
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
                  <button
                    onClick={() => handleEditImage(postData.coverImage!)}
                    className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors"
                    title="Edit Image"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onUpdateData({ coverImage: undefined })}
                    className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors"
                    title="Remove Image"
                  >
                    <MinusIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Upload Button using UploadButton component */}
                <UploadButton
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    if (res?.[0]) {
                      onUpdateData({ coverImage: res[0].url });
                    }
                  }}
                  onUploadError={(error) => {
                    console.error('Upload error:', error);
                    alert('Upload failed. Please try again.');
                  }}
                  appearance={{
                    button: "bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors",
                    allowedContent: "text-gray-400 text-sm mt-2"
                  }}
                />
                
                {/* Alternative: Manual file input with progress */}
                <div className="text-center text-gray-400 text-sm">OR</div>
                
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="manual-upload"
                    disabled={isUploading}
                  />
                  <label
                    htmlFor="manual-upload"
                    className={`
                      block w-full text-center px-4 py-3 border-2 border-dashed border-gray-600 rounded-lg
                      ${isUploading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:border-gray-500'}
                      transition-colors
                    `}
                  >
                    {isUploading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-400"></div>
                        <span className="text-green-400">Uploading... {uploadProgress > 0 && `${uploadProgress.toFixed(0)}%`}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400">Click to select an image</span>
                    )}
                  </label>
                </div>
                
                {uploadProgress > 0 && isUploading && (
                  <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-green-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
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
                // Add new section - properly handle the PostSection interface
                const newSection: PostSection = {
                  id: 'description-1',
                  type: 'paragraph' as const,
                  content: e.target.value,
                  heading: '',
                  images: (() => null) as any, // Function placeholder to satisfy interface
                  paragraphs: []
                };
                
                onUpdateData({
                  sections: [newSection]
                });
              }
            }}
            placeholder="Add additional context or description about this Instagram post..."
            rows={4}
            className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-600 rounded-lg text-[#fffff2] placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
          <p className="mt-1 text-sm text-gray-400">
            This will appear below the Instagram embed on your blog.
          </p>
        </div>

        {/* Instagram Integration Info */}
        <div className="bg-pink-900/20 border border-pink-500/30 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <ExclamationTriangleIcon className="h-5 w-5 text-pink-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-pink-400 font-medium text-sm">Instagram Integration</h4>
              <ul className="text-pink-300 text-xs mt-1 space-y-1">
                <li>• Instagram posts will be embedded and displayed with original formatting</li>
                <li>• We'll fetch the latest engagement data when the post is published</li>
                <li>• Make sure the Instagram post is public for proper embedding</li>
                <li>• The post will link back to the original Instagram URL</li>
                <li>• Images are optimized automatically for faster loading</li>
              </ul>
            </div>
          </div>
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