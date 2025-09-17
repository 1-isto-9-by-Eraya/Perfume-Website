// components/LikeButton.tsx
'use client';

import { useLike } from '@/hooks/useLike';
import { useState } from 'react';

interface LikeButtonProps {
  postParam: string;
  variant?: 'default' | 'compact' | 'large';
  showCount?: boolean;
  className?: string;
}

export function LikeButton({
  postParam,
  variant = 'default',
  showCount = true,
  className = ''
}: LikeButtonProps) {
  const { likesCount, isLiked, isLoading, error, toggleLike } = useLike(postParam);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAnimating(true);
    await toggleLike();
    setTimeout(() => setIsAnimating(false), 600);
  };

  const styles =
    variant === 'compact'
      ? { container: 'inline-flex items-center space-x-1', button: 'p-1.5', icon: 'w-4 h-4', text: 'text-xs' }
      : variant === 'large'
      ? { container: 'inline-flex items-center space-x-3', button: 'p-4', icon: 'w-7 h-7', text: 'text-lg' }
      : { container: 'inline-flex items-center space-x-2', button: 'p-2.5', icon: 'w-5 h-5', text: 'text-sm' };

  if (error) {
    return (
      <div className={`${styles.container} ${className}`}>
        <div className="text-red-400 text-xs">Failed to load likes</div>
      </div>
    );
  }

  return (
    <div className={`${styles.container} ${className}`}>
      <button
        onClick={handleClick}
        disabled={isLoading}
        type="button"
        className={`
          ${styles.button}
          relative group rounded-full transition-all duration-300
          ${isLiked
            ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/40'
            : 'bg-gray-700/50 text-gray-400 hover:bg-red-500/20 hover:text-red-400 border border-gray-600/50 hover:border-red-500/40'}
          ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
          active:scale-95
        `}
        aria-label={isLiked ? 'Unlike post' : 'Like post'}
      >
        <svg
          className={`${styles.icon} transition-all duration-300 ${isAnimating ? 'animate-pulse scale-125' : ''} ${
            isLiked ? 'fill-current' : 'fill-none stroke-current stroke-2'
          }`}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
          />
        </svg>

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {isAnimating && isLiked && (
          <>
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-red-400 rounded-full animate-ping"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `translate(-50%, -50%) rotate(${i * 60}deg) translateY(-20px)`,
                  animationDelay: `${i * 100}ms`,
                  animationDuration: '600ms'
                }}
              />
            ))}
          </>
        )}
      </button>

      {showCount && (
        <span
          className={`${styles.text} font-medium transition-colors duration-300 ${
            isLiked ? 'text-red-400' : 'text-gray-400'
          } ${isAnimating ? 'animate-pulse' : ''}`}
        >
          {isLoading ? '...' : likesCount.toLocaleString()}
        </span>
      )}
    </div>
  );
}
