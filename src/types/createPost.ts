// types/createPost.ts
import { PostType } from "@prisma/client";

export interface CreatePostData {
  // Basic post info
  title: string;
  slug: string;
  postType: PostType;
  
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
  heading: any;
  images(images: any, arg1: string): import("react").ReactNode;
  paragraphs: any;
  id: string;
  type: 'paragraph' | 'heading' | 'image' | 'divider';
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
  general?: string;
}