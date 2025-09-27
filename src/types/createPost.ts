// types/createPost.ts
import { PostType } from "@prisma/client";

export interface CreatePostData {
  // Basic post info
  title: string;
  slug: string;
  postType: PostType;
  
  // ✅ NEW: Keywords/Tags field
  keywords: string[];
  
  // Content
  heroImage?: string;
  coverImage?: string;
  sections: PostSection[];
  
  // Type-specific fields
  instagramUrl?: string;
  instagramPostId?: string;
  videoUrl?: string;
  embedCode?: string;
}

export interface PostSection {
  id: string;
  type: 'paragraph' | 'heading' | 'image' | 'divider';
  heading: any;
  images(images: any, arg1: string): import("react").ReactNode;
  paragraphs: any;
  content?: string;
  url?: string;
  caption?: string;
  level?: number; // for headings (h1, h2, h3, etc.)
}

export interface CreatePostStep {
  id: number;
  name: string;
  description: string;
  isCompleted: boolean;
  isActive: boolean;
}

export interface PostTypeOption {
  type: PostType;
  name: string;
  description: string;
  icon: string;
  features: string[];
}

export interface CreatePostFormErrors {
  title?: string;
  postType?: string;
  sections?: string;
  instagramUrl?: string;
  videoUrl?: string;
  keywords?: string; // ✅ NEW: Keywords validation errors
  general?: string;
}

// ✅ NEW: Keyword validation helpers
export interface KeywordValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateKeywords = (keywords: string[]): KeywordValidationResult => {
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