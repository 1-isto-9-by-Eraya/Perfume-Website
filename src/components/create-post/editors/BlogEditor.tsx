// src/components/create-post/editors/BlogEditor.tsx
import { useState } from 'react';
import { PlusIcon, MinusIcon, ArrowUpIcon, ArrowDownIcon, PencilIcon } from '@heroicons/react/24/outline';
import { UploadButton } from '@/lib/uploadthing';
import ImageEditor from './ImageEditor';
import KeywordsInput from './KeywordsInput'; // ✅ NEW IMPORT
import type { CreatePostData, CreatePostFormErrors, PostSection } from '@/types/createPost';

// Types matching the schema and post page
type ImageSpec = {
  url: string;
  position: "above" | "below" | "between";
  betweenIndex?: number;
};

// Define a working section type that matches what we actually need
type WorkingSection = {
  id: string;
  type: 'paragraph' | 'heading' | 'image' | 'divider';
  heading: string;
  paragraphs: string[];
  images: ImageSpec[];
  content?: string;
  url?: string;
  caption?: string;
  level?: number;
};

interface BlogEditorProps {
  postData: CreatePostData;
  onUpdateData: (updates: Partial<CreatePostData>) => void;
  errors: CreatePostFormErrors;
}

interface ImageEditorState {
  isOpen: boolean;
  imageUrl: string;
  type: 'hero' | 'cover' | 'section';
  sectionId?: number;
  imageIndex?: number;
}

export default function BlogEditor({
  postData,
  onUpdateData,
  errors,
}: BlogEditorProps) {
  const [activeSection, setActiveSection] = useState<number | null>(null);
  const [imageEditor, setImageEditor] = useState<ImageEditorState>({
    isOpen: false,
    imageUrl: '',
    type: 'hero'
  });

  // Convert PostSection to WorkingSection for internal use
  const convertToWorkingSections = (sections: PostSection[]): WorkingSection[] => {
    return sections.map((section, index) => ({
      id: section.id || `section-${index}`,
      type: section.type || 'paragraph',
      heading: typeof section.heading === 'string' ? section.heading : '',
      paragraphs: Array.isArray(section.paragraphs) ? section.paragraphs : [],
      // Safe conversion of images - handle both array and function types
      images: Array.isArray(section.images) ? section.images as unknown as ImageSpec[] : [],
      content: section.content,
      url: section.url,
      caption: section.caption,
      level: section.level,
    }));
  };

  // Convert WorkingSection back to PostSection for saving
  const convertToPostSections = (sections: WorkingSection[]): PostSection[] => {
    return sections.map((section) => ({
      id: section.id,
      type: section.type,
      heading: section.heading,
      paragraphs: section.paragraphs,
      images: section.images as any, // Type assertion needed due to PostSection interface issues
      content: section.content,
      url: section.url,
      caption: section.caption,
      level: section.level,
    }));
  };

  const workingSections = convertToWorkingSections(postData.sections || []);

  const updateSections = (newSections: WorkingSection[]) => {
    onUpdateData({ sections: convertToPostSections(newSections) });
  };

  const addSection = () => {
    const newSection: WorkingSection = {
      id: `section-${Date.now()}`,
      type: 'paragraph',
      heading: '',
      paragraphs: [''],
      images: []
    };
    
    updateSections([...workingSections, newSection]);
  };

  const removeSection = (index: number) => {
    const newSections = workingSections.filter((_, i) => i !== index);
    updateSections(newSections);
  };

  const updateSection = (index: number, updates: Partial<WorkingSection>) => {
    const newSections = workingSections.map((section, i) => 
      i === index ? { ...section, ...updates } : section
    );
    updateSections(newSections);
  };

  const addParagraph = (sectionIndex: number) => {
    const newSections = [...workingSections];
    newSections[sectionIndex].paragraphs.push('');
    updateSections(newSections);
  };

  const removeParagraph = (sectionIndex: number, paragraphIndex: number) => {
    const newSections = [...workingSections];
    newSections[sectionIndex].paragraphs = newSections[sectionIndex].paragraphs.filter((_, i: number) => i !== paragraphIndex);
    updateSections(newSections);
  };

  const updateParagraph = (sectionIndex: number, paragraphIndex: number, content: string) => {
    const newSections = [...workingSections];
    newSections[sectionIndex].paragraphs[paragraphIndex] = content;
    updateSections(newSections);
  };

  const addImage = (sectionIndex: number) => {
    const newImage: ImageSpec = {
      url: '',
      position: 'below'
    };
    
    const newSections = [...workingSections];
    newSections[sectionIndex].images.push(newImage);
    updateSections(newSections);
  };

  const removeImage = (sectionIndex: number, imageIndex: number) => {
    const newSections = [...workingSections];
    newSections[sectionIndex].images = newSections[sectionIndex].images.filter((_, i: number) => i !== imageIndex);
    updateSections(newSections);
  };

  const updateImage = (sectionIndex: number, imageIndex: number, updates: Partial<ImageSpec>) => {
    const newSections = [...workingSections];
    newSections[sectionIndex].images[imageIndex] = { ...newSections[sectionIndex].images[imageIndex], ...updates };
    updateSections(newSections);
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= workingSections.length) return;

    const newSections = [...workingSections];
    [newSections[index], newSections[newIndex]] = [newSections[newIndex], newSections[index]];
    updateSections(newSections);
  };

  const handleEditImage = (imageUrl: string, type: 'hero' | 'cover' | 'section', sectionId?: number, imageIndex?: number) => {
    setImageEditor({
      isOpen: true,
      imageUrl,
      type,
      sectionId,
      imageIndex
    });
  };

  const handleImageSave = (editedImageUrl: string) => {
    if (imageEditor.type === 'hero') {
      onUpdateData({ heroImage: editedImageUrl });
    } else if (imageEditor.type === 'cover') {
      onUpdateData({ coverImage: editedImageUrl });
    } else if (imageEditor.type === 'section' && typeof imageEditor.sectionId === 'number' && typeof imageEditor.imageIndex === 'number') {
      updateImage(imageEditor.sectionId, imageEditor.imageIndex, { url: editedImageUrl });
    }
    
    setImageEditor({ isOpen: false, imageUrl: '', type: 'hero' });
  };

  const handleImageCancel = () => {
    setImageEditor({ isOpen: false, imageUrl: '', type: 'hero' });
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
              value={postData.title || ''}
              onChange={(e) => onUpdateData({ title: e.target.value })}
              placeholder="Enter your post title..."
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
                value={postData.slug || ''}
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
              placeholder="Add keywords to help readers find your content..."
            />
          </div>

          {/* Hero Image */}
          <div>
            <label className="block text-sm font-medium text-[#ffffff] mb-2">
              Hero Image
            </label>
            {postData.heroImage ? (
              <div className="relative group">
                <img 
                  src={postData.heroImage} 
                  alt="Hero" 
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
                  <button
                    onClick={() => handleEditImage(postData.heroImage!, 'hero')}
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
                  button: "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors",
                  allowedContent: "text-gray-400 text-sm mt-2"
                }}
              />
            )}
          </div>

          {/* Cover Image */}
          <div>
            <label className="block text-sm font-medium text-[#ffffff] mb-2">
              Cover Image
            </label>
            <p className="text-xs text-gray-400 mb-2">Used for blog cards and previews</p>
            {postData.coverImage ? (
              <div className="relative group">
                <img 
                  src={postData.coverImage} 
                  alt="Cover" 
                  className="w-full h-32 object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
                  <button
                    onClick={() => handleEditImage(postData.coverImage!, 'cover')}
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
              <UploadButton
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  if (res?.[0]) {
                    onUpdateData({ coverImage: res[0].url });
                  }
                }}
                onUploadError={(error) => {
                  console.error('Upload error:', error);
                  alert('Upload failed');
                }}
                appearance={{
                  button: "bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors",
                  allowedContent: "text-gray-400 text-sm mt-2"
                }}
              />
            )}
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-[#ffffff]">Content Sections</h3>
            
            <button
              onClick={addSection}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
            >
              + Add Section
            </button>
          </div>

          {/* Sections List */}
          {workingSections.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-gray-600 rounded-lg">
              <PlusIcon className="w-8 h-8 mx-auto mb-2 text-gray-500" />
              <p className="text-gray-400">No content sections yet. Add your first section above.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {workingSections.map((section, sectionIndex) => (
                <div
                  key={section.id}
                  className={`
                    border border-gray-600 rounded-lg transition-colors
                    ${activeSection === sectionIndex ? 'ring-2 ring-blue-500 border-blue-500' : 'hover:border-gray-500'}
                  `}
                >
                  {/* Section Header */}
                  <div className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-t-lg border-b border-gray-600">
                    <span className="text-sm font-medium text-gray-300">
                      Section {sectionIndex + 1}
                    </span>
                    
                    <div className="flex items-center space-x-1">
                      {/* Move buttons */}
                      <button
                        onClick={() => moveSection(sectionIndex, 'up')}
                        disabled={sectionIndex === 0}
                        className="p-1 hover:bg-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ArrowUpIcon className="w-4 h-4 text-gray-400" />
                      </button>
                      <button
                        onClick={() => moveSection(sectionIndex, 'down')}
                        disabled={sectionIndex === workingSections.length - 1}
                        className="p-1 hover:bg-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ArrowDownIcon className="w-4 h-4 text-gray-400" />
                      </button>
                      
                      {/* Remove button */}
                      <button
                        onClick={() => removeSection(sectionIndex)}
                        className="p-1 hover:bg-red-600 rounded text-red-400"
                      >
                        <MinusIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Section Content */}
                  <div className="p-4 space-y-4">
                    {/* Section Heading */}
                    <div>
                      <label className="block text-sm font-medium text-[#ffffff] mb-2">
                        Section Heading *
                      </label>
                      <input
                        type="text"
                        value={section.heading}
                        onChange={(e) => updateSection(sectionIndex, { heading: e.target.value })}
                        placeholder="Enter section heading..."
                        className="w-full px-3 py-2 bg-[#2a2a2a67] border border-gray-600 rounded-lg text-[#fffff2] placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    {/* Paragraphs */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-[#ffffff]">
                          Paragraphs
                        </label>
                        <button
                          onClick={() => addParagraph(sectionIndex)}
                          className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm transition-colors"
                        >
                          + Add Paragraph
                        </button>
                      </div>
                      
                      <div className="space-y-3">
                        {section.paragraphs.map((paragraph: string, paragraphIndex: number) => (
                          <div key={paragraphIndex} className="flex gap-2">
                            <textarea
                              value={paragraph}
                              onChange={(e) => updateParagraph(sectionIndex, paragraphIndex, e.target.value)}
                              placeholder={`Paragraph ${paragraphIndex + 1}`}
                              rows={3}
                              className="flex-1 px-3 py-2 bg-[#2a2a2a67] border border-gray-600 rounded-lg text-[#fffff2] placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                            />
                            <button
                              onClick={() => removeParagraph(sectionIndex, paragraphIndex)}
                              disabled={section.paragraphs.length === 1}
                              className="p-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded transition-colors"
                              title={section.paragraphs.length === 1 ? "Keep at least one paragraph" : "Remove paragraph"}
                            >
                              <MinusIcon className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Images */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-[#ffffff]">
                          Images
                        </label>
                        <button
                          onClick={() => addImage(sectionIndex)}
                          className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm transition-colors"
                        >
                          + Add Image
                        </button>
                      </div>
                      
                      <div className="space-y-3">
                        {section.images.map((image: ImageSpec, imageIndex: number) => (
                          <div key={imageIndex} className="p-3 bg-[#2a2a2a67] rounded-lg border border-gray-600">
                            <div className="grid gap-3 md:grid-cols-[1fr_auto_auto_auto] items-end">
                              {/* Image URL / Upload */}
                              <div>
                                {image.url ? (
                                  <div className="relative group">
                                    <img 
                                      src={image.url} 
                                      alt="Section image" 
                                      className="w-full h-32 object-cover rounded border border-gray-600"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center space-x-2">
                                      <button
                                        onClick={() => handleEditImage(image.url, 'section', sectionIndex, imageIndex)}
                                        className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors"
                                        title="Edit Image"
                                      >
                                        <PencilIcon className="w-4 h-4" />
                                      </button>
                                      <button
                                        onClick={() => updateImage(sectionIndex, imageIndex, { url: '' })}
                                        className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors"
                                        title="Remove Image"
                                      >
                                        <MinusIcon className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <UploadButton
                                    endpoint="imageUploader"
                                    onClientUploadComplete={(res) => {
                                      if (res?.[0]) {
                                        updateImage(sectionIndex, imageIndex, { url: res[0].url });
                                      }
                                    }}
                                    onUploadError={(error) => {
                                      console.error('Upload error:', error);
                                      alert('Upload failed');
                                    }}
                                    appearance={{
                                      button: "bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded transition-colors text-sm",
                                      allowedContent: "text-gray-400 text-xs mt-1"
                                    }}
                                  />
                                )}
                              </div>

                              {/* Position */}
                              <select
                                value={image.position}
                                onChange={(e) => updateImage(sectionIndex, imageIndex, { 
                                  position: e.target.value as ImageSpec['position'],
                                  ...(e.target.value !== 'between' && { betweenIndex: undefined })
                                })}
                                className="px-3 py-2 bg-[#1a1a1a] border border-gray-600 rounded text-[#fffff2] text-sm focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="above">Above paragraphs</option>
                                <option value="between">Between paragraphs</option>
                                <option value="below">Below paragraphs</option>
                              </select>

                              {/* Between Index */}
                              {image.position === 'between' && (
                                <select
                                  value={image.betweenIndex ?? ''}
                                  onChange={(e) => updateImage(sectionIndex, imageIndex, { 
                                    betweenIndex: e.target.value === '' ? undefined : Number(e.target.value)
                                  })}
                                  className="px-3 py-2 bg-[#1a1a1a] border border-gray-600 rounded text-[#fffff2] text-sm focus:ring-2 focus:ring-blue-500"
                                >
                                  <option value="">Select position</option>
                                  {section.paragraphs.map((_: string, pIndex: number) => (
                                    <option key={pIndex} value={pIndex}>
                                      After paragraph {pIndex + 1}
                                    </option>
                                  ))}
                                </select>
                              )}

                              {/* Remove Image */}
                              <button
                                onClick={() => removeImage(sectionIndex, imageIndex)}
                                className="p-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                                title="Remove Image"
                              >
                                <MinusIcon className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {errors.sections && (
            <p className="text-sm text-red-400">{errors.sections}</p>
          )}
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