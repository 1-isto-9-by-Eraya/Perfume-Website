// src/components/ui/DashboardButton.tsx
import { ReactNode } from 'react';

interface DashboardButtonProps {
  onClick: () => void;
  icon: ReactNode;
  title: string;
  description: string;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export default function DashboardButton({
  onClick,
  icon,
  title,
  description,
  variant = 'primary',
  disabled = false,
}: DashboardButtonProps) {
  const baseClasses = "w-full text-left p-6 rounded-lg border transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#191919]";
  
  const variantClasses = {
    primary: "bg-[#1e3a5f] border-blue-700 hover:bg-[#2a4d6b] focus:ring-blue-400 text-[#ffffff]",
    secondary: "bg-[#2a2a2a67] border-gray-600 hover:bg-[#353535] focus:ring-gray-400 text-[#ffffff]",
  };

  const disabledClasses = "opacity-50 cursor-not-allowed hover:shadow-none";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${disabled ? disabledClasses : 'cursor-pointer'}
      `}
    >
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-base mb-1">
            {title}
          </h3>
          <p className="text-sm opacity-80">
            {description}
          </p>
        </div>
      </div>
    </button>
  );
}