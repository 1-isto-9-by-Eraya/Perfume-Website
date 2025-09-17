// src/app/api/auth/error/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { UnauthorizedPopup } from '@/components/UnauthorisedPopup';

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  // Show your custom popup for AccessDenied errors
  if (error === 'AccessDenied') {
    return (
      <div className="min-h-screen bg-black">
        <UnauthorizedPopup />
      </div>
    );
  }

  // For other errors, show a generic error page
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-[#ffffff]">
        <h1 className="text-2xl font-bold mb-4">Authentication Error</h1>
        <p>An error occurred during sign-in: {error}</p>
      </div>
    </div>
  );
}