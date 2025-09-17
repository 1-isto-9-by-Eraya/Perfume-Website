// src/components/create-post/steps/ContentStep.tsx
import { PostType } from '@prisma/client';
import BlogEditor from '../editors/BlogEditor';
import InstagramEditor from '../editors/InstagramEditor';
import VlogEditor from '../editors/VlogEditor';
import type { CreatePostData, PostSection, CreatePostFormErrors } from '@/types/createPost';

interface ContentStepProps {
  postData: CreatePostData;
  onUpdateData: (updates: Partial<CreatePostData>) => void;
  onAddSection: (section: Omit<PostSection, 'id'>) => void;
  onUpdateSection: (sectionId: string, updates: Partial<PostSection>) => void;
  onRemoveSection: (sectionId: string) => void;
  onMoveSection: (sectionId: string, direction: 'up' | 'down') => void;
  errors: CreatePostFormErrors;
}

export default function ContentStep({
  postData,
  onUpdateData,
  onAddSection,
  onUpdateSection,
  onRemoveSection,
  onMoveSection,
  errors,
}: ContentStepProps) {
  
  const renderEditor = () => {
    switch (postData.postType) {
      case 'BLOG':
        return (
          <BlogEditor
            postData={postData}
            onUpdateData={onUpdateData}
            onAddSection={onAddSection}
            onUpdateSection={onUpdateSection}
            onRemoveSection={onRemoveSection}
            onMoveSection={onMoveSection}
            errors={errors}
          />
        );
        
      case 'INSTAGRAM':
        return (
          <InstagramEditor
            postData={postData}
            onUpdateData={onUpdateData}
            errors={errors}
          />
        );
        
      case 'VLOG':
        return (
          <VlogEditor
            postData={postData}
            onUpdateData={onUpdateData}
            onAddSection={onAddSection}
            onUpdateSection={onUpdateSection}
            onRemoveSection={onRemoveSection}
            onMoveSection={onMoveSection}
            errors={errors}
          />
        );
        
      default:
        return (
          <div className="text-center py-8">
            <p className="text-red-400">Unknown post type: {postData.postType}</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Post Type Badge */}
      <div className="flex items-center justify-center">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-900/30 text-blue-400 border border-blue-500/30">
          {postData.postType} POST
        </span>
      </div>

      {/* Editor */}
      {renderEditor()}
    </div>
  );
}