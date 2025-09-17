// src/components/create-post/StepIndicator.tsx
import { CheckIcon } from '@heroicons/react/24/solid';
import type { CreatePostStep } from '@/types/createPost';

interface StepIndicatorProps {
  steps: CreatePostStep[];
  currentStep: number;
  onStepClick?: (stepNumber: number) => void;
}

export default function StepIndicator({ steps, currentStep, onStepClick }: StepIndicatorProps) {
  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            {/* Step Circle */}
            <div className="flex items-center">
              <button
                onClick={() => onStepClick?.(step.id)}
                disabled={!onStepClick}
                className={`
                  flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium transition-all duration-200 
                  ${step.isCompleted 
                    ? 'bg-green-600 text-white' 
                    : step.isActive 
                    ? 'bg-blue-600 text-white ring-4 ring-blue-600/20' 
                    : 'bg-gray-600 text-gray-300'
                  }
                  ${onStepClick && !step.isActive ? 'hover:bg-gray-500 cursor-pointer' : ''}
                  ${!onStepClick || step.isActive ? 'cursor-default' : ''}
                `}
              >
                {step.isCompleted ? (
                  <CheckIcon className="w-5 h-5" />
                ) : (
                  <span>{step.id}</span>
                )}
              </button>
              
              {/* Step Label */}
              <div className="ml-3 min-w-0">
                <p className={`text-sm font-medium ${
                  step.isActive ? 'text-[#ffffff]' : step.isCompleted ? 'text-green-400' : 'text-gray-400'
                }`}>
                  {step.name}
                </p>
                <p className={`text-xs ${
                  step.isActive ? 'text-[#fffff2]' : 'text-gray-500'
                }`}>
                  {step.description}
                </p>
              </div>
            </div>
            
            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className={`
                w-16 h-0.5 mx-4 transition-colors duration-200
                ${step.isCompleted ? 'bg-green-600' : 'bg-gray-600'}
              `} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}