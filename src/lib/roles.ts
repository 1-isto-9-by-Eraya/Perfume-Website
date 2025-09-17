// lib/roles.ts
import { UserRole, PostStatus } from "@prisma/client";
import type { Session } from "next-auth";

export const ROLES = {
  UPLOADER: "UPLOADER" as const,
  REVIEWER: "REVIEWER" as const,
} as const;

export const POST_STATUSES = {
  DRAFT: "DRAFT" as const,
  PENDING: "PENDING" as const,
  APPROVED: "APPROVED" as const,
  REJECTED: "REJECTED" as const,
} as const;

export const POST_TYPES = {
  BLOG: "BLOG" as const,
  INSTAGRAM: "INSTAGRAM" as const,
  VLOG: "VLOG" as const,
} as const;

// Role checking functions
export function isUploader(role?: UserRole | null): boolean {
  return role === ROLES.UPLOADER || role === ROLES.REVIEWER;
}

export function isReviewer(role?: UserRole | null): boolean {
  return role === ROLES.REVIEWER;
}

// Check if user can create posts
export function canCreatePosts(role?: UserRole | null): boolean {
  return isUploader(role);
}

// Check if user can review posts
export function canReviewPosts(role?: UserRole | null): boolean {
  return isReviewer(role);
}

// Check if user can approve/reject posts
export function canApprovePost(userRole?: UserRole | null, postAuthorId?: string, userId?: string): boolean {
  // Reviewers can approve posts from other users
  return isReviewer(userRole) && postAuthorId !== userId;
}

// Get reviewer emails from environment
export function getReviewerEmails(): string[] {
  return (process.env.REVIEWER_EMAILS || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

// Determine role based on email
export function getRoleByEmail(email?: string | null): UserRole {
  if (!email) return ROLES.UPLOADER;
  
  const reviewerEmails = getReviewerEmails();
  return reviewerEmails.includes(email.toLowerCase()) 
    ? ROLES.REVIEWER 
    : ROLES.UPLOADER;
}

// Get user role from session
export function getUserRole(session: Session | null): UserRole | null {
  if (!session?.user?.email) return null;
  return getRoleByEmail(session.user.email);
}

// Post status helpers
export function isPublicPost(status: PostStatus): boolean {
  return status === POST_STATUSES.APPROVED;
}

export function isPendingPost(status: PostStatus): boolean {
  return status === POST_STATUSES.PENDING;
}

export function isDraftPost(status: PostStatus): boolean {
  return status === POST_STATUSES.DRAFT;
}

export function isRejectedPost(status: PostStatus): boolean {
  return status === POST_STATUSES.REJECTED;
}

// Role display names
export const ROLE_DISPLAY_NAMES = {
  [ROLES.UPLOADER]: "Content Creator",
  [ROLES.REVIEWER]: "Content Reviewer",
} as const;

// Status display names
export const STATUS_DISPLAY_NAMES = {
  [POST_STATUSES.DRAFT]: "Draft",
  [POST_STATUSES.PENDING]: "Pending Review",
  [POST_STATUSES.APPROVED]: "Published",
  [POST_STATUSES.REJECTED]: "Rejected",
} as const;

// Default role for new users (you can change this based on your needs)
export const DEFAULT_USER_ROLE = ROLES.UPLOADER;