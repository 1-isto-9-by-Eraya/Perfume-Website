// src/components/reviews/ApprovalActions.tsx
'use client';

import { useState } from 'react';
import { CheckIcon, PencilIcon, XMarkIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import type { PostWithDetails } from '@/types/auth';

interface ApprovalActionsProps {
  post: PostWithDetails;
  onStatusChange: (postId: string) => void;
  onClose: () => void;
}

export default function ApprovalActions({ post, onStatusChange, onClose }: ApprovalActionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleApprove = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/posts/approve/${post.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        onStatusChange(post.id);
        onClose();
      } else {
        setError(data.error || 'Failed to approve post');
        console.error('Failed to approve post:', data);
      }
    } catch (err) {
      setError('Network error - please try again');
      console.error('Error approving post:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNeedsUpdate = async () => {
    if (!feedback.trim()) {
      setError('Feedback is required when requesting updates');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/posts/needs-update/${post.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          feedback: feedback.trim()
        }),
      });

      const data = await response.json();

      if (response.ok) {
        onStatusChange(post.id);
        onClose();
      } else {
        setError(data.error || 'Failed to send post for updates');
        console.error('Failed to send post for updates:', data);
      }
    } catch (err) {
      setError('Network error - please try again');
      console.error('Error sending post for updates:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    if (!feedback.trim()) {
      setError('Rejection reason is required');
      return;
    }

    const confirmReject = window.confirm(
      'Are you sure you want to reject this post? This action will permanently delete the post.'
    );

    if (!confirmReject) return;

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/posts/reject/${post.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          reason: feedback.trim()
        }),
      });

      const data = await response.json();

      if (response.ok) {
        onStatusChange(post.id);
        onClose();
      } else {
        setError(data.error || 'Failed to reject post');
        console.error('Failed to reject post:', data);
      }
    } catch (err) {
      setError('Network error - please try again');
      console.error('Error rejecting post:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-2">Review Actions</h2>
        {/* <p className="text-sm text-gray-400">Review the post content and decide the appropriate action.</p> */}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Post Details */}
      <div className="bg-gray-800/50 rounded-lg p-4 space-y-3">
        <h3 className="text-sm font-semibold text-white mb-3">Post Details</h3>
        
        <div className="space-y-2 text-sm">
          <div>
            <span className="text-gray-400">Author:</span>
            <span className="text-gray-200 ml-2">{post.author?.name || post.author?.email || 'Unknown'}</span>
          </div>
          <div>
            <span className="text-gray-400">Type:</span>
            <span className="text-gray-200 ml-2">{post.postType}</span>
          </div>
          <div>
            <span className="text-gray-400">Created:</span>
            <span className="text-gray-200 ml-2">
              {new Date(post.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div>
            <span className="text-gray-400">Status:</span>
            <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
              post.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400' :
              post.status === 'APPROVED' ? 'bg-green-500/20 text-green-400' :
              post.status === 'REJECTED' ? 'bg-red-500/20 text-red-400' :
              'bg-orange-500/20 text-orange-400'
            }`}>
              {post.status}
            </span>
          </div>
        </div>
      </div>

      {/* Feedback Section */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-300">
          Feedback/Reason <span className="text-red-400">*</span>
        </label>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Add feedback for updates or rejection reason..."
          className="w-full h-24 px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          disabled={isLoading}
        />
        <p className="text-xs text-gray-500">
          Required for "Needs Update" and "Reject" actions
        </p>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={handleApprove}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-600/50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
        >
          <CheckIcon className="h-4 w-4" />
          {isLoading ? 'Processing...' : 'Approve & Publish'}
        </button>

        <button
          onClick={handleNeedsUpdate}
          disabled={isLoading || !feedback.trim()}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-600/50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
        >
          <PencilIcon className="h-4 w-4" />
          {isLoading ? 'Processing...' : 'Needs Update'}
        </button>

        <button
          onClick={handleReject}
          disabled={isLoading || !feedback.trim()}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-600/50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
        >
          <XMarkIcon className="h-4 w-4" />
          {isLoading ? 'Processing...' : 'Reject & Delete'}
        </button>
      </div>

      {/* Review Guidelines */}
      {/* <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
        <h4 className="flex items-center gap-2 text-blue-400 font-medium text-sm mb-3">
          <InformationCircleIcon className="h-4 w-4" />
          Review Guidelines
        </h4>
        <ul className="space-y-1 text-xs text-blue-200">
          <li><strong>Approve:</strong> Post meets quality standards and will be published immediately</li>
          <li><strong>Needs Update:</strong> Post has potential but needs improvements (requires feedback)</li>
          <li><strong>Reject:</strong> Post doesn't meet standards and will be permanently deleted (requires reason)</li>
          <li>Always provide constructive feedback for rejections and updates</li>
        </ul>
      </div> */}
    </div>
  );
}