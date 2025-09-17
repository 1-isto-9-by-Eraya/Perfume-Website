// src/components/create-post/steps/PostTypeStep.tsx
import { PostType } from '@prisma/client';
import { DocumentTextIcon, CameraIcon, VideoCameraIcon } from '@heroicons/react/24/outline';
import type { PostTypeOption } from '@/types/createPost';

interface PostTypeStepProps {
  selectedType: PostType;
  onTypeSelect: (type: PostType) => void;
  error?: string;
}

const POST_TYPE_OPTIONS: PostTypeOption[] = [
  {
    type: 'BLOG',
    name: 'Blog Post',
    description: 'Traditional long-form content with rich text and images',
    icon: 'document',
    features: ['Rich text editor', 'Multiple sections', 'Image support', 'SEO optimized'],
  },
  {
    type: 'INSTAGRAM',
    name: 'Instagram Feed',
    description: 'Import and showcase content from your Instagram posts',
    icon: 'camera',
    features: ['Instagram integration', 'Auto-import posts', 'Visual galleries', 'Social engagement'],
  },
  {
    type: 'VLOG',
    name: 'Vlog Post',
    description: 'Video-centered content with multimedia elements',
    icon: 'video',
    features: ['Video embedding', 'Multimedia support', 'Interactive elements', 'Streaming ready'],
  },
];

export default function PostTypeStep({ selectedType, onTypeSelect, error }: PostTypeStepProps) {
  const getIcon = (iconType: string) => {
    switch (iconType) {
      case 'document':
        return <DocumentTextIcon className="w-8 h-8" />;
      case 'camera':
        return <CameraIcon className="w-8 h-8" />;
      case 'video':
        return <VideoCameraIcon className="w-8 h-8" />;
      default:
        return <DocumentTextIcon className="w-8 h-8" />;
    }
  };

  return (
    <div className="space-y-6 ">
      <div className="text-center">
        <p className="text-[#fffff2]">
          Choose the type of content you want to create. Each type has different features and capabilities.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {POST_TYPE_OPTIONS.map((option) => (
          <button
            key={option.type}
            onClick={() => onTypeSelect(option.type)}
            className={`
              relative p-6 rounded-lg border-2 transition-all duration-200 text-left
              ${selectedType === option.type
                ? 'border-blue-500 bg-blue-600/10 ring-2 ring-blue-500/20'
                : 'border-gray-600 hover:border-gray-500 hover:bg-gray-800/50'
              }
            `}
          >
            {/* Selected Indicator */}
            {selectedType === option.type && (
              <div className="absolute top-3 right-3 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}

            {/* Icon */}
            <div className={`
              inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4
              ${selectedType === option.type ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}
            `}>
              {getIcon(option.icon)}
            </div>

            {/* Content */}
            <div className="space-y-3">
              <h3 className={`font-semibold ${selectedType === option.type ? 'text-blue-400' : 'text-[#ffffff]'}`}>
                {option.name}
              </h3>
              
              <p className="text-sm text-[#fffff2]">
                {option.description}
              </p>

              {/* Features */}
              <ul className="space-y-1">
                {option.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-xs text-gray-400">
                    <div className="w-1 h-1 bg-gray-500 rounded-full mr-2 flex-shrink-0"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </button>
        ))}
      </div>

      {error && (
        <div className="text-red-400 text-sm text-center">
          {error}
        </div>
      )}

      {/* Additional Info */}
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
        <h4 className="text-blue-400 font-medium mb-2">Need help deciding?</h4>
        <ul className="text-blue-300 text-sm space-y-1">
          <li>• <strong>Blog Post:</strong> Best for articles, tutorials, and detailed content</li>
          <li>• <strong>Instagram Feed:</strong> Perfect for visual storytelling and social content</li>
          <li>• <strong>Vlog Post:</strong> Ideal for video content, tutorials, and multimedia posts</li>
        </ul>
      </div>
    </div>
  );
}