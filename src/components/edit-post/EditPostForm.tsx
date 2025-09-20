// src/components/edit-post/EditPostForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BlogEditor from '@/components/create-post/editors/BlogEditor';
import InstagramEditor from '@/components/create-post/editors/InstagramEditor';
import VlogEditor from '@/components/create-post/editors/VlogEditor';
import PreviewStep from '@/components/create-post/steps/PreviewStep';
import type { CreatePostData, CreatePostFormErrors, PostSection } from '@/types/createPost';
import type { PostWithDetails } from '@/types/auth';

interface EditPostFormProps {
  post: PostWithDetails;
}

// Extended form errors interface to include slug
interface ExtendedCreatePostFormErrors extends CreatePostFormErrors {
  slug?: string;
}

export default function EditPostForm({ post }: EditPostFormProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<ExtendedCreatePostFormErrors>({});

  // Initialize form data from existing post
  const [postData, setPostData] = useState<CreatePostData>(() => ({
    title: post.title,
    slug: post.slug,
    postType: post.postType,
    heroImage: post.heroImage || undefined,
    coverImage: post.coverImage || undefined,
    instagramUrl: post.instagramUrl || undefined,
    videoUrl: post.videoUrl || undefined,
    sections: post.sections as any || [],
  }));

  const steps = [
    { 
      name: 'Edit Content', 
      description: 'Update your post content based on feedback'
    },
    { 
      name: 'Preview', 
      description: 'Review your changes before resubmitting'
    },
  ];

  const updatePostData = (updates: Partial<CreatePostData>) => {
    setPostData(prev => ({ ...prev, ...updates }));
    // Clear related errors when data changes
    setErrors(prev => {
      const newErrors = { ...prev };
      Object.keys(updates).forEach(key => {
        delete newErrors[key as keyof ExtendedCreatePostFormErrors];
      });
      return newErrors;
    });
  };

  // Auto-generate slug from title
  useEffect(() => {
    if (postData.title && postData.title !== post.title) {
      const newSlug = postData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      
      if (newSlug !== postData.slug) {
        updatePostData({ slug: newSlug });
      }
    }
  }, [postData.title, post.title, postData.slug]);

  // Placeholder functions for section management (VlogEditor compatibility)
  const handleAddSection = (section: Omit<PostSection, 'id'>) => {
    const newSection: PostSection = {
      ...section,
      id: `section-${Date.now()}`,
    };
    updatePostData({
      sections: [...(postData.sections || []), newSection]
    });
  };

  const handleUpdateSection = (sectionId: string, updates: Partial<PostSection>) => {
    updatePostData({
      sections: (postData.sections || []).map(section =>
        section.id === sectionId ? { ...section, ...updates } : section
      )
    });
  };

  const handleRemoveSection = (sectionId: string) => {
    updatePostData({
      sections: (postData.sections || []).filter(section => section.id !== sectionId)
    });
  };

  const handleMoveSection = (sectionId: string, direction: 'up' | 'down') => {
    const sections = [...(postData.sections || [])];
    const currentIndex = sections.findIndex(section => section.id === sectionId);
    
    if (currentIndex === -1) return;
    
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    if (newIndex < 0 || newIndex >= sections.length) return;
    
    [sections[currentIndex], sections[newIndex]] = [sections[newIndex], sections[currentIndex]];
    
    updatePostData({ sections });
  };

  const validateStep = (step: number): boolean => {
    const newErrors: ExtendedCreatePostFormErrors = {};

    if (step === 0) {
      // Validate basic fields
      if (!postData.title?.trim()) {
        newErrors.title = 'Title is required';
      }
      if (!postData.slug?.trim()) {
        newErrors.slug = 'Slug is required';
      }

      // Validate post type specific fields
      if (postData.postType === 'INSTAGRAM' && !postData.instagramUrl?.trim()) {
        newErrors.instagramUrl = 'Instagram URL is required for Instagram posts';
      }
      if (postData.postType === 'VLOG' && !postData.videoUrl?.trim()) {
        newErrors.videoUrl = 'Video URL is required for vlogs';
      }

      // Validate sections for blog posts
      if (postData.postType === 'BLOG') {
        if (!postData.sections || postData.sections.length === 0) {
          newErrors.sections = 'At least one content section is required';
        } else {
          const hasValidContent = postData.sections.some((section: any) => {
            return section.heading?.trim() || 
                   (section.paragraphs && section.paragraphs.some((p: string) => p.trim()));
          });
          if (!hasValidContent) {
            newErrors.sections = 'At least one section must have content';
          }
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    if (!validateStep(0)) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/posts/edits/${post.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...postData,
          status: 'PENDING', // Resubmit for review
        }),
      });

      if (response.ok) {
        router.push('/dashboard?success=post-updated');
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to update post');
      }
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Failed to update post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        // Edit step - show appropriate editor based on post type
        switch (postData.postType) {
          case 'INSTAGRAM':
            return (
              <InstagramEditor
                postData={postData}
                onUpdateData={updatePostData}
                errors={errors}
              />
            );
          case 'VLOG':
            return (
              <VlogEditor
                postData={postData}
                onUpdateData={updatePostData}
                onAddSection={handleAddSection}
                onUpdateSection={handleUpdateSection}
                onRemoveSection={handleRemoveSection}
                onMoveSection={handleMoveSection}
                errors={errors}
              />
            );
          default:
            return (
              <BlogEditor
                postData={postData}
                onUpdateData={updatePostData}
                errors={errors}
              />
            );
        }
      case 1:
        // Preview step
        return <PreviewStep postData={postData} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`flex items-center ${
              index < steps.length - 1 ? 'flex-1' : ''
            }`}
          >
            <div className="flex items-center">
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${
                    index <= currentStep
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-600 text-gray-300'
                  }
                `}
              >
                {index + 1}
              </div>
              <div className="ml-3">
                <div
                  className={`text-sm font-medium ${
                    index <= currentStep ? 'text-blue-400' : 'text-gray-400'
                  }`}
                >
                  {step.name}
                </div>
                <div className="text-xs text-gray-500">{step.description}</div>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-4 ${
                  index < currentStep ? 'bg-blue-600' : 'bg-gray-600'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="bg-[#2a2a2a67] rounded-lg p-6">
        {renderStepContent()}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <div>
          {currentStep > 0 && (
            <button
              onClick={handlePrevious}
              className="px-4 py-2 text-[#fffff2] hover:text-white transition-colors"
            >
              ← Previous
            </button>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 text-[#fffff2] hover:text-white transition-colors"
          >
            Cancel
          </button>

          {currentStep < steps.length - 1 ? (
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Updating...
                </>
              ) : (
                'Send to review'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}