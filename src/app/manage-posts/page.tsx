'use client';

import { useState, useEffect } from 'react';
import { 
  MagnifyingGlassIcon, 
  TrashIcon, 
  EyeIcon, 
  CalendarIcon,
  UserIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

interface Post {
  id: string;
  title: string;
  slug: string;
  postType: 'BLOG' | 'VLOG' | 'INSTAGRAM';
  status: 'APPROVED' | 'PENDING' | 'REJECTED' | 'DRAFT';
  published: boolean;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    name?: string;
    email: string;
    image?: string;
  };
}

export default function ManagePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('APPROVED');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<Post | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);

  const postsPerPage = 5;

  useEffect(() => {
    fetchApprovedPosts();
  }, []);

  useEffect(() => {
    filterPosts();
  }, [posts, searchTerm, filterType, filterStatus]);

  const fetchApprovedPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/posts/manage');
      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts || []);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterPosts = () => {
    let filtered = posts;

    // Filter by status
    if (filterStatus !== 'ALL') {
      filtered = filtered.filter(post => post.status === filterStatus);
    }

    // Filter by type
    if (filterType !== 'ALL') {
      filtered = filtered.filter(post => post.postType === filterType);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredPosts(filtered);
    setCurrentPage(1);
  };

  const deletePost = async (postId: string) => {
    try {
      setDeleteLoading(postId);
      const response = await fetch(`/api/posts/manage/${postId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPosts(posts.filter(post => post.id !== postId));
        setDeleteSuccess('Post deleted successfully!');
        setTimeout(() => setDeleteSuccess(null), 3000);
      } else {
        throw new Error('Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post. Please try again.');
    } finally {
      setDeleteLoading(null);
      setShowDeleteModal(null);
    }
  };

  const getPostTypeColor = (type: string) => {
    switch (type) {
      case 'BLOG':
        return 'bg-blue-900/30 text-blue-400 border-blue-500/30';
      case 'VLOG':
        return 'bg-red-900/30 text-red-400 border-red-500/30';
      case 'INSTAGRAM':
        return 'bg-pink-900/30 text-pink-400 border-pink-500/30';
      default:
        return 'bg-gray-900/30 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-900/30 text-green-400 border-green-500/30';
      case 'PENDING':
        return 'bg-yellow-900/30 text-yellow-400 border-yellow-500/30';
      case 'REJECTED':
        return 'bg-red-900/30 text-red-400 border-red-500/30';
      case 'DRAFT':
        return 'bg-gray-900/30 text-gray-400 border-gray-500/30';
      default:
        return 'bg-gray-900/30 text-gray-400 border-gray-500/30';
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = filteredPosts.slice(startIndex, endIndex);

  const goToPage = (page: number) => setCurrentPage(page);
  const goToPrevious = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const goToNext = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Manage Posts</h1>
              <p className="text-gray-400">Search, filter, and manage all published posts</p>
            </div>
            <Link
              href="/dashboard"
              className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              <ChevronLeftIcon className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </Link>
          </div>

          {/* Success Message */}
          {deleteSuccess && (
            <div className="mb-4 p-4 bg-green-900/20 border border-green-500/30 rounded-lg flex items-center space-x-2">
              <CheckCircleIcon className="h-5 w-5 text-green-400" />
              <span className="text-green-300">{deleteSuccess}</span>
            </div>
          )}
        </div>

        {/* Filters and Search */}
        <div className="bg-[#2a2a2a67] rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search Bar */}
            <div className="md:col-span-2 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title, author name, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#1a1a1a] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Post Type Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 bg-[#1a1a1a] border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ALL">All Types</option>
              <option value="BLOG">Blog Posts</option>
              <option value="VLOG">Video Logs</option>
              <option value="INSTAGRAM">Instagram Posts</option>
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 bg-[#1a1a1a] border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ALL">All Status</option>
              <option value="APPROVED">Approved</option>
              <option value="PENDING">Pending</option>
              <option value="REJECTED">Rejected</option>
              <option value="DRAFT">Draft</option>
            </select>
          </div>

          {/* Results Summary */}
          <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
            <span>
              Showing {startIndex + 1}-{Math.min(endIndex, filteredPosts.length)} of {filteredPosts.length} posts
            </span>
            {(searchTerm || filterType !== 'ALL' || filterStatus !== 'APPROVED') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterType('ALL');
                  setFilterStatus('APPROVED');
                }}
                className="text-blue-400 hover:text-blue-300 underline"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Posts Table */}
        <div className="bg-[#2a2a2a67] rounded-lg overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
              <span className="ml-3 text-gray-300">Loading posts...</span>
            </div>
          ) : currentPosts.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#1a1a1a]">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Post Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Author
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Type & Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-600">
                    {currentPosts.map((post) => (
                      <tr key={post.id} className="hover:bg-[#3a3a3a] transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <h3 className="text-white font-medium truncate max-w-xs" title={post.title}>
                              {post.title}
                            </h3>
                            <p className="text-gray-400 text-sm">/{post.slug}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            {post.author.image ? (
                              <img
                                src={post.author.image}
                                alt={post.author.name || 'Author'}
                                className="h-8 w-8 rounded-full"
                              />
                            ) : (
                              <div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center">
                                <UserIcon className="h-4 w-4 text-gray-400" />
                              </div>
                            )}
                            <div>
                              <p className="text-white text-sm font-medium">
                                {post.author.name || 'Unknown'}
                              </p>
                              <p className="text-gray-400 text-xs">{post.author.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col space-y-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPostTypeColor(post.postType)}`}>
                              {post.postType}
                            </span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(post.status)}`}>
                              {post.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center text-sm text-gray-300">
                            <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
                            {new Date(post.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center space-x-2">
                            {post.published && (
                              <Link
                                href={`/blog/${post.slug}`}
                                target="_blank"
                                className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                                title="View Post"
                              >
                                <EyeIcon className="h-4 w-4" />
                              </Link>
                            )}
                            <button
                              onClick={() => setShowDeleteModal(post)}
                              disabled={deleteLoading === post.id}
                              className="p-2 bg-red-600 hover:bg-red-700 disabled:bg-red-600/50 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
                              title="Delete Post"
                            >
                              {deleteLoading === post.id ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              ) : (
                                <TrashIcon className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 bg-[#1a1a1a] border-t border-gray-600">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={goToPrevious}
                        disabled={currentPage === 1}
                        className="flex items-center space-x-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-600/50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                      >
                        <ChevronLeftIcon className="h-4 w-4" />
                        <span>Previous</span>
                      </button>
                      
                      <button
                        onClick={goToNext}
                        disabled={currentPage === totalPages}
                        className="flex items-center space-x-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-600/50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                      >
                        <span>Next</span>
                        <ChevronRightIcon className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="flex items-center space-x-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let page = i + 1;
                        if (totalPages > 5 && currentPage > 3) {
                          page = currentPage - 2 + i;
                          if (page > totalPages) page = totalPages - 4 + i;
                        }
                        return (
                          <button
                            key={page}
                            onClick={() => goToPage(page)}
                            className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                              currentPage === page
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                    </div>

                    <div className="text-sm text-gray-400">
                      Page {currentPage} of {totalPages}
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <MagnifyingGlassIcon className="h-12 w-12 mx-auto mb-4 text-gray-500" />
              <h3 className="text-white font-medium text-lg">No posts found</h3>
              <p className="text-gray-400 mt-2">
                {searchTerm || filterType !== 'ALL' || filterStatus !== 'APPROVED'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No posts are available to manage.'}
              </p>
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-[#2a2a2a67] rounded-lg max-w-md w-full p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex-shrink-0">
                  <ExclamationTriangleIcon className="h-6 w-6 text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white">Delete Post</h3>
                  <p className="text-sm text-gray-400">
                    This action cannot be undone.
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <div className="bg-[#1a1a1a] rounded-lg p-4 border border-gray-600">
                  <h4 className="font-medium text-white mb-1">{showDeleteModal.title}</h4>
                  <p className="text-sm text-gray-400">
                    By {showDeleteModal.author.name || showDeleteModal.author.email}
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPostTypeColor(showDeleteModal.postType)}`}>
                      {showDeleteModal.postType}
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(showDeleteModal.status)}`}>
                      {showDeleteModal.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteModal(null)}
                  disabled={deleteLoading === showDeleteModal.id}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-600/50 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deletePost(showDeleteModal.id)}
                  disabled={deleteLoading === showDeleteModal.id}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-600/50 text-white rounded-lg transition-colors disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {deleteLoading === showDeleteModal.id ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <TrashIcon className="h-4 w-4" />
                      <span>Delete Post</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}