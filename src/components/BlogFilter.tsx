// src/components/BlogFilter.tsx
import { useState, useEffect } from 'react';
import { FunnelIcon, XMarkIcon, HashtagIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { PostType } from '@prisma/client';

interface FilterOptions {
  postType: PostType | 'ALL';
  keywords: string[];
  searchQuery: string;
  sortBy: 'newest' | 'oldest' | 'popular';
}

interface BlogFilterProps {
  onFilterChange: (filters: FilterOptions) => void;
  availableKeywords: string[];
  totalPosts: number;
  filteredPosts: number;
  className?: string;
}

export default function BlogFilter({
  onFilterChange,
  availableKeywords,
  totalPosts,
  filteredPosts,
  className = ""
}: BlogFilterProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    postType: 'ALL',
    keywords: [],
    searchQuery: '',
    sortBy: 'newest'
  });

  const [isExpanded, setIsExpanded] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters(prev => ({ ...prev, searchQuery: searchInput }));
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Notify parent of filter changes
  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const handlePostTypeChange = (postType: PostType | 'ALL') => {
    setFilters(prev => ({ ...prev, postType }));
  };

  const handleKeywordToggle = (keyword: string) => {
    setFilters(prev => ({
      ...prev,
      keywords: prev.keywords.includes(keyword)
        ? prev.keywords.filter(k => k !== keyword)
        : [...prev.keywords, keyword]
    }));
  };

  const handleSortChange = (sortBy: FilterOptions['sortBy']) => {
    setFilters(prev => ({ ...prev, sortBy }));
  };

  const clearAllFilters = () => {
    setFilters({
      postType: 'ALL',
      keywords: [],
      searchQuery: '',
      sortBy: 'newest'
    });
    setSearchInput('');
  };

  const hasActiveFilters = filters.postType !== 'ALL' || 
                          filters.keywords.length > 0 || 
                          filters.searchQuery.trim() !== '';

  // Get popular keywords (most used)
  const getPopularKeywords = () => {
    return availableKeywords.slice(0, 12); // Show top 12 most common keywords
  };

  const getPostTypeIcon = (type: PostType) => {
    switch (type) {
      case 'BLOG':
        return '📝';
      case 'INSTAGRAM':
        return '📷';
      case 'VLOG':
        return '🎥';
      default:
        return '📄';
    }
  };

  return (
    <div className={`bg-[#1a1a1a] border border-gray-700 rounded-lg ${className}`}>
      {/* Filter Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <FunnelIcon className="w-5 h-5 text-gray-400" />
          <h3 className="text-[#ffffff] font-medium">Filters</h3>
          
          {hasActiveFilters && (
            <span className="px-2 py-1 bg-blue-600/20 text-blue-400 text-xs rounded-full border border-blue-500/30">
              {filters.keywords.length + (filters.postType !== 'ALL' ? 1 : 0) + (filters.searchQuery.trim() ? 1 : 0)} active
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {/* Results count */}
          <span className="text-sm text-gray-400">
            {filteredPosts} of {totalPosts}
          </span>

          {/* Clear filters */}
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-red-400 hover:text-red-300 transition-colors"
            >
              Clear all
            </button>
          )}

          {/* Expand/Collapse */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-gray-400 hover:text-white transition-colors"
          >
            <svg
              className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Filter Content */}
      <div className={`transition-all duration-300 ${isExpanded ? 'max-h-none' : 'max-h-0 overflow-hidden'}`}>
        <div className="p-4 space-y-6">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Search Posts
            </label>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by title, content..."
                className="w-full pl-10 pr-4 py-2 bg-[#2a2a2a67] border border-gray-600 rounded-lg text-[#fffff2] placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          {/* Post Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Post Type
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handlePostTypeChange('ALL')}
                className={`
                  px-3 py-2 rounded-lg text-sm font-medium transition-colors
                  ${filters.postType === 'ALL'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }
                `}
              >
                All Types
              </button>
              
              {(['BLOG', 'INSTAGRAM', 'VLOG'] as PostType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => handlePostTypeChange(type)}
                  className={`
                    flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                    ${filters.postType === type
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }
                  `}
                >
                  <span>{getPostTypeIcon(type)}</span>
                  <span>{type}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sort Options */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Sort By
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) => handleSortChange(e.target.value as FilterOptions['sortBy'])}
              className="w-full px-3 py-2 bg-[#2a2a2a67] border border-gray-600 rounded-lg text-[#fffff2] focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>

          {/* Keywords Filter */}
          {availableKeywords.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Keywords & Tags
              </label>
              
              {/* Selected Keywords */}
              {filters.keywords.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-gray-400 mb-2">Selected:</p>
                  <div className="flex flex-wrap gap-2">
                    {filters.keywords.map((keyword) => (
                      <span
                        key={keyword}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-blue-600/20 text-blue-300 rounded text-sm border border-blue-500/30"
                      >
                        <HashtagIcon className="w-3 h-3" />
                        {keyword}
                        <button
                          onClick={() => handleKeywordToggle(keyword)}
                          className="ml-1 hover:text-red-400 transition-colors"
                          title="Remove filter"
                        >
                          <XMarkIcon className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Available Keywords */}
              <div>
                <p className="text-xs text-gray-400 mb-2">Popular tags:</p>
                <div className="flex flex-wrap gap-2">
                  {getPopularKeywords()
                    .filter(keyword => !filters.keywords.includes(keyword))
                    .map((keyword) => (
                      <button
                        key={keyword}
                        onClick={() => handleKeywordToggle(keyword)}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 hover:text-white rounded text-sm transition-colors"
                      >
                        <HashtagIcon className="w-3 h-3" />
                        {keyword}
                      </button>
                    ))
                  }
                </div>
                
                {availableKeywords.length > 12 && (
                  <p className="text-xs text-gray-500 mt-2">
                    + {availableKeywords.length - 12} more keywords available
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick filters (always visible) */}
      {!isExpanded && (
        <div className="p-4 border-t border-gray-700">
          <div className="flex flex-wrap gap-2">
            {/* Quick post type buttons */}
            {(['BLOG', 'INSTAGRAM', 'VLOG'] as PostType[]).map((type) => (
              <button
                key={type}
                onClick={() => handlePostTypeChange(filters.postType === type ? 'ALL' : type)}
                className={`
                  flex items-center space-x-1 px-2 py-1 rounded text-xs transition-colors
                  ${filters.postType === type
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                    : 'bg-gray-700/50 text-gray-400 hover:text-gray-300'
                  }
                `}
              >
                <span>{getPostTypeIcon(type)}</span>
                <span>{type}</span>
              </button>
            ))}

            {/* Popular keywords as quick filters */}
            {getPopularKeywords().slice(0, 6).map((keyword) => (
              <button
                key={keyword}
                onClick={() => handleKeywordToggle(keyword)}
                className={`
                  flex items-center space-x-1 px-2 py-1 rounded text-xs transition-colors
                  ${filters.keywords.includes(keyword)
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                    : 'bg-gray-700/50 text-gray-400 hover:text-gray-300'
                  }
                `}
              >
                <HashtagIcon className="w-3 h-3" />
                <span>{keyword}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}