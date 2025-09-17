// src/components/create-post/StepContainer.tsx
import { ReactNode } from 'react';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

interface StepContainerProps {
  title: string;
  description?: string;
  children: ReactNode;
  currentStep: number;
  totalSteps: number;
  onNext?: () => void;
  onPrevious?: () => void;
  nextLabel?: string;
  previousLabel?: string;
  canProceed?: boolean;
  isSubmitting?: boolean;
  errors?: string[];
}

export default function StepContainer({
  title,
  description,
  children,
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  nextLabel = 'Continue',
  previousLabel = 'Back',
  canProceed = true,
  isSubmitting = false,
  errors = [],
}: StepContainerProps) {
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[#ffffff]">{title}</h2>
        {description && (
          <p className="mt-2 text-[#fffff2]">{description}</p>
        )}
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
          <h3 className="text-red-400 font-medium mb-2">Please fix the following errors:</h3>
          <ul className="space-y-1">
            {errors.map((error, index) => (
              <li key={index} className="text-red-300 text-sm">• {error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Navigation - Moved above content */}
      <div className="flex items-center justify-between">
        <div>
          {!isFirstStep && onPrevious && (
            <button
              onClick={onPrevious}
              disabled={isSubmitting}
              className="inline-flex items-center px-4 py-2 border border-gray-600 rounded-lg text-[#fffff2] hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              {previousLabel}
            </button>
          )}
        </div>

        {/* <div className="text-sm text-gray-400">
          Step {currentStep} of {totalSteps}
        </div> */}

        <div>
          {onNext && (
            <button
              onClick={onNext}
              disabled={!canProceed || isSubmitting}
              className="inline-flex items-center px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {isLastStep ? 'Publishing...' : 'Processing...'}
                </>
              ) : (
                <>
                  {isLastStep ? 'Send to review' : nextLabel}
                  {!isLastStep && <ArrowRightIcon className="w-4 h-4 ml-2" />}
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-[#2a2a2a67] rounded-lg p-6">
        {children}
      </div>
    </div>
  );
}