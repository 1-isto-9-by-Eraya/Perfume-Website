// src/components/dashboard/UploaderDashboard.tsx
'use client';

import { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, ClockIcon, CheckCircleIcon, XCircleIcon, ChatBubbleLeftEllipsisIcon, ChevronLeftIcon, ChevronRightIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import type { ExtendedSession, PostWithDetails } from '@/types/auth';

interface UploaderDashboardProps {
  session: ExtendedSession;
}

export default function UploaderDashboard({ session }: UploaderDashboardProps) {
  const [recentPosts, setRecentPosts] = useState<PostWithDetails[]>([]);
  const [needsUpdatePosts, setNeedsUpdatePosts] = useState<PostWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<PostWithDetails | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 3;

  useEffect(() => {
    fetchUserPosts();
  }, []);

  const fetchUserPosts = async () => {
    try {
      setLoading(true);
      const [recentResponse, needsUpdateResponse] = await Promise.all([
        fetch('/api/posts/user/recent'),
        fetch('/api/posts/user/needs-update')
      ]);

      if (recentResponse.ok) {
        const recentData = await recentResponse.json();
        setRecentPosts(recentData.posts || []);
      }

      if (needsUpdateResponse.ok) {
        const needsUpdateData = await needsUpdateResponse.json();
        setNeedsUpdatePosts(needsUpdateData.posts || []);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
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

  // Pagination logic
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
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            href="/blog/new"
            className="flex items-center justify-center space-x-2 p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Create New Post</span>
          </Link>
          
          <button
            onClick={fetchUserPosts}
            className="flex items-center justify-center space-x-2 p-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            <ClockIcon className="h-5 w-5" />
            <span>Refresh Posts</span>
          </button>

          <Link
            href="/blog"
            className="flex items-center justify-center space-x-2 p-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            <UserGroupIcon className="h-5 w-5" />
            <span>View Published</span>
          </Link>
        </div>
      </div>

      {/* Posts Needing Updates */}
      {needsUpdatePosts.length > 0 && (
        <div className="bg-[#2a2a2a67] rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <ChatBubbleLeftEllipsisIcon className="h-6 w-6 text-yellow-400" />
            <h2 className="text-xl font-semibold text-[#ffffff]">Posts Needing Updates</h2>
            <span className="px-2 py-1 bg-yellow-900/30 text-yellow-400 rounded text-sm">
              {needsUpdatePosts.length}
            </span>
          </div>
          
          <div className="grid gap-4">
            {needsUpdatePosts.map((post) => (
              <div
                key={post.id}
                className="border border-yellow-500/30 rounded-lg p-4 bg-yellow-900/10 hover:bg-yellow-900/20 transition-colors cursor-pointer"
                onClick={() => setSelectedPost(post)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-[#ffffff] mb-2">{post.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-[#fffff2] mb-2">
                      <span>Updated: {new Date(post.updatedAt).toLocaleDateString()}</span>
                      <span className="px-2 py-1 bg-yellow-900/30 text-yellow-400 rounded text-xs">
                        {post.postType}
                      </span>
                    </div>
                    {post.reviewComments && (
                      <p className="text-sm text-yellow-300 italic">
                        "Click to view reviewer feedback"
                      </p>
                    )}
                  </div>
                  <ChatBubbleLeftEllipsisIcon className="h-5 w-5 text-yellow-400 flex-shrink-0" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Posts with Pagination */}
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
            <span className="ml-3 text-[#fffff2]">Loading posts...</span>
          </div>
        ) : recentPosts.length > 0 ? (
          <>
            {/* Posts Grid */}
            <div className="grid gap-4 min-h-[240px]">
              {currentPosts.map((post) => (
                <div
                  key={post.id}
                  className="border border-gray-600 rounded-lg p-4 hover:border-gray-500 transition-colors min-h-auto max-h-[92px]"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-[#ffffff] mb-2">{post.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-[#fffff2]">
                        <span>Created: {new Date(post.createdAt).toLocaleDateString()}</span>
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
                        className="flex items-center space-x-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
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
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-600">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={goToPrevious}
                    disabled={currentPage === 1}
                    className="flex items-center space-x-1 px-3 py-2 bg-gray-800 hover:bg-gray-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded text-sm transition-colors"
                  >
                    <ChevronLeftIcon className="h-4 w-4" />
                    <span>Previous</span>
                  </button>
                  
                  <button
                    onClick={goToNext}
                    disabled={currentPage === totalPages}
                    className="flex items-center space-x-1 px-3 py-2 bg-gray-800 hover:bg-gray-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded text-sm transition-colors"
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

      {/* Feedback Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-[#2a2a2a67] rounded-lg shadow-xl max-w-2xl w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[#ffffff]">Reviewer Feedback</h3>
                <button
                  onClick={() => setSelectedPost(null)}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <XCircleIcon className="h-5 w-5 text-gray-400" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-[#ffffff] mb-2">Post Details</h4>
                  <div className="bg-[#1a1a1a] rounded-lg p-4 space-y-2">
                    <p className="text-[#fffff2]"><span className="font-medium">Title:</span> {selectedPost.title}</p>
                    <p className="text-[#fffff2]"><span className="font-medium">Type:</span> {selectedPost.postType}</p>
                    <p className="text-[#fffff2]"><span className="font-medium">Last Updated:</span> {new Date(selectedPost.updatedAt).toLocaleString()}</p>
                    {selectedPost.reviewedBy && (
                      <p className="text-[#fffff2]"><span className="font-medium">Reviewed by:</span> {selectedPost.reviewedBy.name || selectedPost.reviewedBy.email}</p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-[#ffffff] mb-2">Feedback from Reviewer</h4>
                  <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                    <p className="text-yellow-200 whitespace-pre-wrap">
                      {selectedPost.reviewComments || 'No specific feedback provided.'}
                    </p>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <Link
                    href={`/blog/edit/${selectedPost.id}`}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    <PencilIcon className="h-4 w-4" />
                    <span>Edit Post</span>
                  </Link>
                  <button
                    onClick={() => setSelectedPost(null)}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}