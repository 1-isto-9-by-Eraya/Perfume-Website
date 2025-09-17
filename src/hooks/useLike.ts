// hooks/useLike.ts
'use client';

import { useState, useEffect, useCallback } from 'react';

interface LikeData {
  likesCount: number;
  isLiked: boolean;
  postId?: string;
}

interface UseLikeReturn {
  likesCount: number;
  isLiked: boolean;
  isLoading: boolean;
  error: string | null;
  toggleLike: () => Promise<void>;
}

export function useLike(postParam: string): UseLikeReturn {
  const [likeData, setLikeData] = useState<LikeData>({ likesCount: 0, isLiked: false });
  const [isLoading, setIsLoading] = useState(true);
  const [isToggling, setIsToggling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const storageKey = `like_${postParam}`;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          const parsed = JSON.parse(stored);
          setLikeData(prev => ({ ...prev, isLiked: !!parsed.isLiked }));
        }
      } catch {
        /* ignore */
      }
    }
  }, [storageKey]);

  const fetchLikeData = useCallback(async () => {
    if (!postParam) {
      setError('No post parameter provided');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const url = `/api/posts/${encodeURIComponent(postParam)}/likes`;
      const response = await fetch(url, { method: 'GET', headers: { Accept: 'application/json' } });

      if (!response.ok) {
        const body = await response.text();
        throw new Error(`Failed to fetch likes (${response.status}): ${body.slice(0, 200)}`);
      }

      const ct = response.headers.get('content-type') || '';
      if (!ct.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Expected JSON but received: ${text.slice(0, 200)}`);
      }

      const data: LikeData = await response.json();
      setLikeData(data);

      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(storageKey, JSON.stringify({ isLiked: data.isLiked, timestamp: Date.now() }));
        } catch {}
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch like data';
      console.error('Error loading likes:', msg);
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [postParam, storageKey]);

  const toggleLike = useCallback(async () => {
    if (isToggling || !postParam) return;

    try {
      setIsToggling(true);
      setError(null);

      const newIsLiked = !likeData.isLiked;
      const newLikesCount = likeData.likesCount + (newIsLiked ? 1 : -1);

      setLikeData(prev => ({ ...prev, isLiked: newIsLiked, likesCount: newLikesCount }));
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(storageKey, JSON.stringify({ isLiked: newIsLiked, timestamp: Date.now() }));
        } catch {}
      }

      const response = await fetch(`/api/posts/${encodeURIComponent(postParam)}/likes`, {
        method: 'POST',
        headers: { Accept: 'application/json' }
      });

      if (!response.ok) {
        const body = await response.text();
        throw new Error(`Failed to toggle like (${response.status}): ${body.slice(0, 200)}`);
      }

      const ct = response.headers.get('content-type') || '';
      if (!ct.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Expected JSON but received: ${text.slice(0, 200)}`);
      }

      const data = await response.json();
      setLikeData(prev => ({ ...prev, likesCount: data.likesCount, isLiked: data.isLiked }));

      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(storageKey, JSON.stringify({ isLiked: data.isLiked, timestamp: Date.now() }));
        } catch {}
      }
    } catch (err) {
      console.error('Error toggling like:', err);
      // revert optimistic update
      setLikeData(prev => ({
        ...prev,
        isLiked: !prev.isLiked,
        likesCount: prev.likesCount + (prev.isLiked ? 1 : -1)
      }));
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(storageKey, JSON.stringify({ isLiked: !likeData.isLiked, timestamp: Date.now() }));
        } catch {}
      }
      const msg = err instanceof Error ? err.message : 'Failed to toggle like';
      setError(msg);
    } finally {
      setIsToggling(false);
    }
  }, [isToggling, likeData, postParam, storageKey]);

  useEffect(() => {
    fetchLikeData();
  }, [fetchLikeData]);

  return {
    likesCount: likeData.likesCount,
    isLiked: likeData.isLiked,
    isLoading: isLoading || isToggling,
    error,
    toggleLike
  };
}
