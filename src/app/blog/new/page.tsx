// src/app/blog/new/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useCreatePost } from '@/hooks/useCreatePost';
import StepIndicator from '@/components/create-post/StepIndicator';
import StepContainer from '@/components/create-post/StepContainer';
import PostTypeStep from '@/components/create-post/steps/PostTypeStep';
import ContentStep from '@/components/create-post/steps/ContentStep';
import PreviewStep from '@/components/create-post/steps/PreviewStep';

export default function NewPostPage() {
  const router = useRouter();
  const {
    currentStep,
    steps,
    postData,
    errors,
    isSubmitting,
    updatePostData,
    addSection,
    updateSection,
    removeSection,
    moveSection,
    nextStep,
    previousStep,
    goToStep,
    submitPost,
  } = useCreatePost();

  const handleSubmit = async () => {
    const result = await submitPost();
    
    if (result.success && result.slug) {
      router.push(`/dashboard`);
    }
  };

  const getStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <PostTypeStep
            selectedType={postData.postType}
            onTypeSelect={(type) => updatePostData({ postType: type })}
            error={errors.postType}
          />
        );
        
      case 2:
        return (
          <ContentStep
            postData={postData}
            onUpdateData={updatePostData}
            onAddSection={addSection}
            onUpdateSection={updateSection}
            onRemoveSection={removeSection}
            onMoveSection={moveSection}
            errors={errors}
          />
        );
        
      case 3:
        return <PreviewStep postData={postData} />;
        
      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return 'Choose Post Type';
      case 2:
        return 'Create Content';
      case 3:
        return 'Review & Publish';
      default:
        return 'Create Post';
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 1:
        return 'Select the type of content you want to create';
      case 2:
        return 'Add your content, images, and media';
      case 3:
        return 'Review your post before publishing';
      default:
        return '';
    }
  };

  const getStepErrors = () => {
    return Object.values(errors).filter(Boolean);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return !!postData.postType;
      case 2:
        return !!postData.title.trim() && 
               (postData.postType !== 'INSTAGRAM' || !!postData.instagramUrl?.trim()) &&
               (postData.postType !== 'VLOG' || !!postData.videoUrl?.trim()) &&
               (postData.postType !== 'BLOG' || postData.sections.length > 0);
      case 3:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold text-[#fffff2]">
                Create New Post
              </h1>
              <p className="text-sm mt-2 text-[#cccccc]">
                Follow the steps below to create and publish your content
              </p>
            </div>
            <button
              onClick={() => router.push('/blog')}
              disabled={isSubmitting}
              className="inline-flex items-center space-x-2 px-4 py-2 border border-gray-600 rounded-lg text-sm hover:bg-gray-800 transition-colors text-[#ffffff] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              <span>Back to Blog</span>
            </button>
          </div>

          {/* Step Indicator */}
          <StepIndicator 
            steps={steps} 
            currentStep={currentStep}
            onStepClick={goToStep}
          />
        </div>

        {/* Step Content */}
        <StepContainer
          title={getStepTitle()}
          description={getStepDescription()}
          currentStep={currentStep}
          totalSteps={steps.length}
          onNext={currentStep < steps.length ? nextStep : handleSubmit}
          onPrevious={currentStep > 1 ? previousStep : undefined}
          nextLabel={currentStep === steps.length ? 'Publish Post' : 'Continue'}
          canProceed={canProceed()}
          isSubmitting={isSubmitting}
          errors={getStepErrors()}
        >
          {getStepContent()}
        </StepContainer>

        {/* Help Text */}
        {/* <div className="mt-8 text-center">
          <p className="text-sm text-gray-400">
            Need help? Your post will be reviewed before going live.
          </p>
        </div> */}
      </div>
    </div>
  );
}