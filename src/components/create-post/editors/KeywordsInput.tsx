// components/create-post/KeywordsInput.tsx
import { useState, KeyboardEvent } from 'react';
import { XMarkIcon, HashtagIcon, PlusIcon } from '@heroicons/react/24/outline';

interface KeywordsInputProps {
  keywords: string[];
  onKeywordsChange: (keywords: string[]) => void;
  maxKeywords?: number;
  placeholder?: string;
  error?: string;
  className?: string;
}

export default function KeywordsInput({
  keywords = [],
  onKeywordsChange,
  maxKeywords = 10,
  placeholder = "Type a keyword and press Enter",
  error,
  className = ""
}: KeywordsInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);

  // Common predefined keywords for suggestions
  const suggestedKeywords = [
    'perfume', 'fragrance', 'scent', 'luxury', 'beauty', 'review',
    'lifestyle', 'fashion', 'skincare', 'wellness', 'travel', 'tips',
    'tutorial', 'guide', 'inspiration', 'trends', 'collection',
    'unboxing', 'haul', 'routine', 'favorites', 'recommendation',
    'instagram', 'social-media', 'video', 'vlog', 'content'
  ];

  // Filter out already selected keywords from suggestions
  const availableSuggestions = suggestedKeywords.filter(
    keyword => !keywords.includes(keyword.toLowerCase())
  );

  const addKeyword = (keyword: string) => {
    const trimmedKeyword = keyword.trim().toLowerCase();
    
    // Validation
    if (!trimmedKeyword) return;
    if (keywords.includes(trimmedKeyword)) return;
    if (keywords.length >= maxKeywords) return;
    if (trimmedKeyword.length > 30) return; // Max 30 chars per keyword
    if (!/^[a-zA-Z0-9\s-]+$/.test(trimmedKeyword)) return; // Only alphanumeric, spaces, hyphens

    onKeywordsChange([...keywords, trimmedKeyword]);
    setInputValue('');
  };

  const removeKeyword = (keywordToRemove: string) => {
    onKeywordsChange(keywords.filter(keyword => keyword !== keywordToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addKeyword(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && keywords.length > 0) {
      // Remove last keyword when backspace is pressed on empty input
      removeKeyword(keywords[keywords.length - 1]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    addKeyword(suggestion);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Input and Tags Container */}
      <div className={`
        min-h-[2.75rem] w-full px-3 py-2 bg-[#121212] border rounded-lg 
        transition-colors focus-within:ring-2 focus-within:border-transparent
        ${error ? 'border-red-500 focus-within:ring-red-500' : 'border-gray-700 focus-within:ring-blue-500'}
      `}>
        <div className="flex flex-wrap gap-2 items-center">
          {/* Existing Keywords */}
          {keywords.map((keyword, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-2 py-1 bg-blue-600/20 text-blue-300 rounded-md text-sm border border-blue-500/30"
            >
              <HashtagIcon className="w-3 h-3" />
              {keyword}
              <button
                type="button"
                onClick={() => removeKeyword(keyword)}
                className="ml-1 hover:text-red-400 transition-colors"
                title="Remove keyword"
              >
                <XMarkIcon className="w-3 h-3" />
              </button>
            </span>
          ))}

          {/* Input Field */}
          {keywords.length < maxKeywords && (
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setTimeout(() => setIsInputFocused(false), 200)}
              placeholder={keywords.length === 0 ? placeholder : "Add another..."}
              className="flex-1 min-w-[120px] bg-transparent text-gray-200 placeholder-gray-500 outline-none"
              maxLength={30}
            />
          )}

          {/* Add Button for Mobile */}
          {inputValue.trim() && (
            <button
              type="button"
              onClick={() => addKeyword(inputValue)}
              className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
              title="Add keyword"
            >
              <PlusIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Keyword Count */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-400">
          {keywords.length}/{maxKeywords} keywords
        </span>
        
        {keywords.length >= maxKeywords && (
          <span className="text-yellow-400 text-xs">
            Maximum keywords reached
          </span>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}

      {/* Suggestions */}
      {isInputFocused && availableSuggestions.length > 0 && keywords.length < maxKeywords && (
        <div className="p-3 bg-[#1a1a1a] border border-gray-600 rounded-lg">
          <h4 className="text-sm font-medium text-gray-300 mb-2">Suggested Keywords:</h4>
          <div className="flex flex-wrap gap-2">
            {availableSuggestions.slice(0, 8).map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
                className="inline-flex items-center gap-1 px-2 py-1 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 hover:text-white rounded text-xs transition-colors"
              >
                <HashtagIcon className="w-3 h-3" />
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="text-xs text-gray-500">
        <p>• Press Enter or click + to add keywords</p>
        <p>• Use keywords that describe your content for better discoverability</p>
        <p>• Keywords should be 2-30 characters, letters and numbers only</p>
      </div>
    </div>
  );
}