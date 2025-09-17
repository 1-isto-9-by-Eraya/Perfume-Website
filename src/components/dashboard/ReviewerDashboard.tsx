// src/components/dashboard/ReviewerDashboard.tsx
'use client';

import { useState, useEffect } from 'react';
import { PlusIcon, EyeIcon, ClockIcon, CheckCircleIcon, XCircleIcon, PencilIcon, UserGroupIcon, ChevronLeftIcon, ChevronRightIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import type { ExtendedSession, PostWithDetails } from '@/types/auth';
import DashboardStats from './DashboardStats';

interface ReviewerDashboardProps {
  session: ExtendedSession;
}

export default function ReviewerDashboard({ session }: ReviewerDashboardProps) {
  const [pendingPosts, setPendingPosts] = useState<PostWithDetails[]>([]);
  const [recentPosts, setRecentPosts] = useState<PostWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 3;

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [pendingResponse, recentResponse] = await Promise.all([
        fetch('/api/posts/pending'),
        fetch('/api/posts/user/recent')
      ]);

      if (pendingResponse.ok) {
        const pendingData = await pendingResponse.json();
        setPendingPosts(pendingData.posts || []);
      }

      if (recentResponse.ok) {
        const recentData = await recentResponse.json();
        setRecentPosts(recentData.posts || []);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircleIcon className="h-5 w-5 text-green-400" />;
      case 'PENDING':
        return <ClockIcon className="h-5 w-5 text-yellow-400" />;
      case 'REJECTED':
        return <XCircleIcon className="h-5 w-5 text-red-400" />;
      case 'DRAFT':
        return <PencilIcon className="h-5 w-5 text-gray-400" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-900/30 text-green-400';
      case 'PENDING':
        return 'bg-yellow-900/30 text-yellow-400';
      case 'REJECTED':
        return 'bg-red-900/30 text-red-400';
      case 'DRAFT':
        return 'bg-gray-900/30 text-gray-400';
      default:
        return 'bg-gray-900/30 text-gray-400';
    }
  };

  // Pagination logic for recent posts
  const totalPages = Math.ceil(recentPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = recentPosts.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const goToPrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="space-y-8">
      {/* Quick Actions */}
      <div className="bg-[#2a2a2a67] rounded-lg p-6">
        <h2 className="text-xl font-semibold text-[#ffffff] mb-4">Quick Actions</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/blog/new"
            className="flex items-center justify-center space-x-2 p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Create Post</span>
          </Link>
          
          <Link
            href="/reviews"
            className="flex items-center justify-center space-x-2 p-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            <EyeIcon className="h-5 w-5" />
            <span>Review Posts</span>
          </Link>

          <Link
            href="/manage-posts"
            className="flex items-center justify-center space-x-2 p-4 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            <TrashIcon className="h-5 w-5" />
            <span>Manage Posts</span>
          </Link>

          <Link
            href="/blog"
            className="flex items-center justify-center space-x-2 p-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            <UserGroupIcon className="h-5 w-5" />
            <span>View Published</span>
          </Link>
        </div>
      </div>

      {/* Review Statistics */}
      <DashboardStats />

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Pending Posts for Review */}
        <div className="bg-[#2a2a2a67] rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-[#ffffff]">Posts Awaiting Review</h2>
            {pendingPosts.length > 0 && (
              <Link
                href="/reviews"
                className="text-blue-400 hover:text-blue-300 text-sm"
              >
                View All →
              </Link>
            )}
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
              <span className="ml-3 text-[#fffff2]">Loading pending posts...</span>
            </div>
          ) : pendingPosts.length > 0 ? (
            <div className="space-y-3">
              {pendingPosts.slice(0, 5).map((post) => (
                <div
                  key={post.id}
                  className="border border-gray-600 rounded-lg p-3 hover:border-gray-500 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-[#ffffff] truncate">{post.title}</h3>
                      <div className="flex items-center space-x-3 mt-1 text-sm text-[#fffff2]">
                        <span>By {post.author.name || post.author.email}</span>
                        <span className="px-2 py-1 bg-yellow-900/30 text-yellow-400 rounded text-xs">
                          {post.postType}
                        </span>
                      </div>
                    </div>
                    <Link
                      href="/reviews"
                      className="flex items-center space-x-1 px-2 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm transition-colors"
                    >
                      <EyeIcon className="h-4 w-4" />
                      <span>Review</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <CheckCircleIcon className="h-12 w-12 mx-auto mb-4 text-gray-500" />
              <h3 className="text-[#ffffff] font-medium">All caught up!</h3>
              <p className="text-[#fffff2] mt-2">No posts are currently pending review.</p>
            </div>
          )}
        </div>

        {/* Reviewer's Recent Posts with Pagination */}
        <div className="bg-[#2a2a2a67] rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-[#ffffff]">Your Recent Posts</h2>
            {recentPosts.length > 0 && (
              <div className="text-sm text-[#fffff2]">
                Showing {startIndex + 1}-{Math.min(endIndex, recentPosts.length)} of {recentPosts.length}
              </div>
            )}
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
              <span className="ml-3 text-[#fffff2]">Loading your posts...</span>
            </div>
          ) : recentPosts.length > 0 ? (
            <>
              {/* Posts Grid */}
              <div className="space-y-3 min-h-[240px]">
                {currentPosts.map((post) => (
                  <div
                    key={post.id}
                    className="border border-gray-600 rounded-lg p-3 hover:border-gray-500 transition-colors min-h-auto max-h-[92px]"
                  >
                    <div className="flex items-start justify-between ">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-[#ffffff] truncate">{post.title}</h3>
                        <div className="flex items-center space-x-3 mt-1 text-sm text-[#fffff2]">
                          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                          <span className="px-2 py-1 bg-blue-900/30 text-blue-400 rounded text-xs">
                            {post.postType}
                          </span>
                          <div className={`flex items-center space-x-1 px-2 py-1 rounded text-xs ${getStatusColor(post.status)}`}>
                            {getStatusIcon(post.status)}
                            <span>{post.status}</span>
                          </div>
                        </div>
                      </div>
                      
                      {post.status === 'DRAFT' && (
                        <Link
                          href={`/blog/edit/${post.id}`}
                          className="flex items-center space-x-1 px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
                        >
                          <PencilIcon className="h-4 w-4" />
                          <span>Edit</span>
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-600">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={goToPrevious}
                      disabled={currentPage === 1}
                      className="flex items-center space-x-1 px-2 py-1 bg-gray-800 hover:bg-gray-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded text-sm transition-colors"
                    >
                      <ChevronLeftIcon className="h-4 w-4" />
                      <span>Prev</span>
                    </button>
                    
                    <button
                      onClick={goToNext}
                      disabled={currentPage === totalPages}
                      className="flex items-center space-x-1 px-2 py-1 bg-gray-800 hover:bg-gray-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded text-sm transition-colors"
                    >
                      <span>Next</span>
                      <ChevronRightIcon className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex items-center space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`w-8 h-8 rounded text-sm font-medium transition-colors ${
                          currentPage === page
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <div className="text-sm text-[#fffff2]">
                    Page {currentPage} of {totalPages}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <PencilIcon className="h-12 w-12 mx-auto mb-4 text-gray-500" />
              <h3 className="text-[#ffffff] font-medium">No posts yet</h3>
              <p className="text-[#fffff2] mt-2 mb-4">
                Create your first journal post to get started.
              </p>
              <Link
                href="/blog/new"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <PlusIcon className="h-4 w-4" />
                <span>Create Your First Post</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}