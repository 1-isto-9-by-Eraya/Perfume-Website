// types/auth.ts
import type { UserRole, PostStatus, PostType } from "@prisma/client";
import type { DefaultSession } from "next-auth";

// Extend the default session to include role
export interface ExtendedSession extends DefaultSession {
  user?: {
    id: string;
    role: UserRole;
  } & DefaultSession["user"];
}

// User with role information
export interface UserWithRole {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: UserRole;
}

// Post with full type information
export interface PostWithDetails {
  id: string;
  title: string;
  slug: string;
  heroImage?: string | null;
  coverImage?: string | null;
  sections: any; // JSON type
  status: PostStatus;
  postType: PostType;
  instagramUrl?: string | null;
  instagramPostId?: string | null;
  videoUrl?: string | null;
  embedCode?: string | null;
  reviewedAt?: Date | null;
  reviewedById?: string | null;
  reviewComments?: string | null;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  author: UserWithRole;
  reviewedBy?: UserWithRole | null;
}

// For API responses
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Role-based permissions
export interface UserPermissions {
  canCreatePosts: boolean;
  canReviewPosts: boolean;
  canApprovePosts: boolean;
  canDeletePosts: boolean;
}

// Dashboard data structure
export interface DashboardData {
  user: UserWithRole;
  permissions: UserPermissions;
  stats?: {
    totalPosts: number;
    pendingPosts: number;
    approvedPosts: number;
    rejectedPosts: number;
  };
}