// hooks/useCreatePost.ts
'use client';

import { useState, useCallback } from 'react';
import { PostType } from '@prisma/client';
import type { CreatePostData, CreatePostStep, PostSection, CreatePostFormErrors } from '@/types/createPost';
import { slugify } from '@/lib/utils';

const INITIAL_STEPS: CreatePostStep[] = [
  {
    id: 1,
    name: 'Post Type',
    description: 'Choose the type of content',
    isCompleted: false,
    isActive: true,
  },
  {
    id: 2,
    name: 'Content',
    description: 'Create your post content',
    isCompleted: false,
    isActive: false,
  },
  {
    id: 3,
    name: 'Preview',
    description: 'Review and publish',
    isCompleted: false,
    isActive: false,
  },
];

const INITIAL_POST_DATA: CreatePostData = {
  title: '',
  slug: '',
  postType: 'BLOG' as PostType,
  keywords: [], // ✅ NEW: Initialize empty keywords array
  sections: [],
  heroImage: undefined,
  coverImage: undefined,
  instagramUrl: undefined,
  instagramPostId: undefined,
  videoUrl: undefined,
  embedCode: undefined,
};

// ✅ NEW: Keyword validation helper
const validateKeywords = (keywords: string[]): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (keywords.length > 10) {
    errors.push('Maximum 10 keywords allowed');
  }
  
  const invalidKeywords = keywords.filter(keyword => 
    keyword.length < 2 || 
    keyword.length > 30 || 
    !/^[a-zA-Z0-9\s-]+$/.test(keyword)
  );
  
  if (invalidKeywords.length > 0) {
    errors.push('Keywords must be 2-30 characters and contain only letters, numbers, spaces, and hyphens');
  }
  
  const duplicates = keywords.filter((keyword, index) => keywords.indexOf(keyword) !== index);
  if (duplicates.length > 0) {
    errors.push('Duplicate keywords are not allowed');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export function useCreatePost() {
  const [currentStep, setCurrentStep] = useState(1);
  const [steps, setSteps] = useState<CreatePostStep[]>(INITIAL_STEPS);
  const [postData, setPostData] = useState<CreatePostData>(INITIAL_POST_DATA);
  const [errors, setErrors] = useState<CreatePostFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update post data
  const updatePostData = useCallback((updates: Partial<CreatePostData>) => {
    setPostData(prev => ({
      ...prev,
      ...updates,
      // Auto-generate slug when title changes
      ...(updates.title && { slug: slugify(updates.title) }),
    }));
    
    // Clear related errors
    if (updates.title) setErrors(prev => ({ ...prev, title: undefined }));
    if (updates.postType) setErrors(prev => ({ ...prev, postType: undefined }));
    if (updates.keywords) setErrors(prev => ({ ...prev, keywords: undefined })); // ✅ NEW
  }, []);

  // Add section to post
  const addSection = useCallback((section: Omit<PostSection, 'id'>) => {
    const newSection: PostSection = {
      ...section,
      id: `section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    
    setPostData(prev => ({
      ...prev,
      sections: [...prev.sections, newSection],
    }));
  }, []);

  // Update section
  const updateSection = useCallback((sectionId: string, updates: Partial<PostSection>) => {
    setPostData(prev => ({
      ...prev,
      sections: prev.sections.map(section => 
        section.id === sectionId ? { ...section, ...updates } : section
      ),
    }));
  }, []);

  // Remove section
  const removeSection = useCallback((sectionId: string) => {
    setPostData(prev => ({
      ...prev,
      sections: prev.sections.filter(section => section.id !== sectionId),
    }));
  }, []);

  // Move section
  const moveSection = useCallback((sectionId: string, direction: 'up' | 'down') => {
    setPostData(prev => {
      const sections = [...prev.sections];
      const index = sections.findIndex(s => s.id === sectionId);
      
      if (index === -1) return prev;
      
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      
      if (newIndex < 0 || newIndex >= sections.length) return prev;
      
      // Swap sections
      [sections[index], sections[newIndex]] = [sections[newIndex], sections[index]];
      
      return { ...prev, sections };
    });
  }, []);

  // Validate current step
  const validateStep = useCallback((stepNumber: number): boolean => {
    const newErrors: CreatePostFormErrors = {};
    
    switch (stepNumber) {
      case 1:
        if (!postData.postType) {
          newErrors.postType = 'Please select a post type';
        }
        break;
        
      case 2:
        if (!postData.title.trim()) {
          newErrors.title = 'Title is required';
        }
        
        if (postData.postType === 'INSTAGRAM' && !postData.instagramUrl?.trim()) {
          newErrors.instagramUrl = 'Instagram URL is required for Instagram posts';
        }
        
        if (postData.postType === 'VLOG' && !postData.videoUrl?.trim()) {
          newErrors.videoUrl = 'Video URL is required for vlog posts';
        }
        
        if (postData.postType === 'BLOG' && postData.sections.length === 0) {
          newErrors.sections = 'Please add at least one content section';
        }

        // ✅ NEW: Validate keywords
        if (postData.keywords && postData.keywords.length > 0) {
          const keywordValidation = validateKeywords(postData.keywords);
          if (!keywordValidation.isValid) {
            newErrors.keywords = keywordValidation.errors.join('. ');
          }
        }
        break;
        
      case 3:
        // Final validation before submission
        if (!postData.title.trim()) {
          newErrors.title = 'Title is required';
        }
        
        // ✅ NEW: Final keywords validation
        if (postData.keywords && postData.keywords.length > 0) {
          const keywordValidation = validateKeywords(postData.keywords);
          if (!keywordValidation.isValid) {
            newErrors.keywords = keywordValidation.errors.join('. ');
          }
        }
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [postData]);

  // Go to next step
  const nextStep = useCallback(() => {
    if (currentStep >= steps.length) return;
    
    if (!validateStep(currentStep)) return;
    
    // Mark current step as completed
    setSteps(prev => prev.map(step => 
      step.id === currentStep 
        ? { ...step, isCompleted: true, isActive: false }
        : step.id === currentStep + 1
        ? { ...step, isActive: true }
        : step
    ));
    
    setCurrentStep(prev => prev + 1);
  }, [currentStep, steps.length, validateStep]);

  // Go to previous step
  const previousStep = useCallback(() => {
    if (currentStep <= 1) return;
    
    setSteps(prev => prev.map(step => 
      step.id === currentStep 
        ? { ...step, isActive: false }
        : step.id === currentStep - 1
        ? { ...step, isActive: true, isCompleted: false }
        : step
    ));
    
    setCurrentStep(prev => prev - 1);
  }, [currentStep]);

  // Go to specific step
  const goToStep = useCallback((stepNumber: number) => {
    if (stepNumber < 1 || stepNumber > steps.length) return;
    
    setSteps(prev => prev.map(step => ({
      ...step,
      isActive: step.id === stepNumber,
      isCompleted: step.id < stepNumber,
    })));
    
    setCurrentStep(stepNumber);
  }, [steps.length]);

  // Submit post
  const submitPost = useCallback(async (): Promise<{ success: boolean; slug?: string; error?: string }> => {
    if (!validateStep(3)) {
      return { success: false, error: 'Please fix validation errors' };
    }
    
    setIsSubmitting(true);
    
    try {
      // ✅ NEW: Clean and validate keywords before submission
      const cleanedKeywords = postData.keywords
        ? postData.keywords
            .map(keyword => keyword.trim().toLowerCase())
            .filter(keyword => keyword.length > 0)
            .filter((keyword, index, arr) => arr.indexOf(keyword) === index) // Remove duplicates
        : [];

      const dataToSubmit = {
        ...postData,
        keywords: cleanedKeywords,
      };

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSubmit),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to create post');
      }
      
      const result = await response.json();
      return { success: true, slug: result.slug };
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create post';
      setErrors({ general: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      setIsSubmitting(false);
    }
  }, [postData, validateStep]);

  // Reset form
  const resetForm = useCallback(() => {
    setCurrentStep(1);
    setSteps(INITIAL_STEPS);
    setPostData(INITIAL_POST_DATA);
    setErrors({});
    setIsSubmitting(false);
  }, []);

  return {
    // State
    currentStep,
    steps,
    postData,
    errors,
    isSubmitting,
    
    // Actions
    updatePostData,
    addSection,
    updateSection,
    removeSection,
    moveSection,
    nextStep,
    previousStep,
    goToStep,
    submitPost,
    resetForm,
    validateStep,
  };
}