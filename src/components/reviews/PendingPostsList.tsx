// src/components/reviews/PendingPostsList.tsx
'use client';

import { useState, useEffect } from 'react';
import PostPreview from './PostPreview';
import type { PostWithDetails } from '@/types/auth';

interface PendingPostsListProps {
  onModalStateChange?: (isOpen: boolean) => void;
}

export default function PendingPostsList({ onModalStateChange }: PendingPostsListProps) {
  const [posts, setPosts] = useState<PostWithDetails[]>([]);
  const [selectedPost, setSelectedPost] = useState<PostWithDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Notify parent when modal state changes
  useEffect(() => {
    if (onModalStateChange) {
      onModalStateChange(!!selectedPost);
    }
  }, [selectedPost, onModalStateChange]);

  useEffect(() => {
    fetchPendingPosts();
  }, []);

  const fetchPendingPosts = async () => {
    try {
      setErrorMessage(null);
      const response = await fetch('/api/posts/pending');
      
      if (response.ok) {
        const data = await response.json();
        
        // Handle your API response format: { success: true, posts, count }
        if (data.success && Array.isArray(data.posts)) {
          setPosts(data.posts);
        } else if (Array.isArray(data)) {
          // Fallback for direct array response
          setPosts(data);
        } else {
          console.error('API returned unexpected format:', data);
          setPosts([]);
          setErrorMessage('Invalid data format received from server');
        }
      } else {
        console.error('Failed to fetch posts:', response.status);
        setPosts([]);
        setErrorMessage(`Failed to fetch posts: ${response.status}`);
      }
    } catch (fetchError) {
      console.error('Error fetching pending posts:', fetchError);
      setPosts([]);
      setErrorMessage('Failed to load pending posts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = (postId: string) => {
    // Refresh the list
    fetchPendingPosts();
    setSelectedPost(null);
  };

  const closePreview = () => {
    setSelectedPost(null);
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="text-[#fffff2]">Loading pending posts...</div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="text-center py-8">
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6">
          <p className="text-red-400 text-lg font-medium">Error Loading Posts</p>
          <p className="text-red-300 mt-2">{errorMessage}</p>
          <button
            onClick={fetchPendingPosts}
            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-[#ffffff] mb-4">
          Pending Posts ({posts.length})
        </h2>
        
        {posts.length === 0 ? (
          <div className="text-center py-12 bg-[#2a2a2a67] rounded-lg">
            <p className="text-[#fffff2] text-lg">No pending posts to review</p>
            <p className="text-gray-400 mt-2">All posts have been reviewed!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div 
                key={post.id} 
                className="bg-[#2a2a2a67] border border-gray-600 rounded-lg p-6 hover:bg-[#333333] transition-colors cursor-pointer"
                onClick={() => setSelectedPost(post)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#ffffff] mb-2">
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-[#fffff2] mb-3">
                      <span>By {post.author?.name || post.author?.email || 'Unknown'}</span>
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs">
                        {post.postType}
                      </span>
                    </div>
                    <div className="text-sm text-gray-400">
                      Post URL: /blog/{post.slug}
                    </div>
                  </div>
                  <button 
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPost(post);
                    }}
                  >
                    Review
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Post Preview Modal */}
      {selectedPost && (
        <PostPreview
          post={selectedPost}
          onClose={closePreview}
          onStatusChange={handleStatusChange}
        />
      )}
    </>
  );
}