// src/components/UnauthorizedPopup.tsx
"use client";

export function UnauthorizedPopup() {
  const handleClose = () => {
    if (typeof window !== "undefined") {
      window.location.assign("/"); // always go home
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative bg-gray-800 border border-red-500/30 rounded-lg p-6 max-w-md mx-4 shadow-2xl">
        <div className="flex items-center gap-3">
          <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 9v2m0 4h.01M4.062 19h15.876c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.962-.833-2.732 0L2.33 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <div>
            <h3 className="text-lg font-medium text-red-400">Access Denied</h3>
            <p className="mt-1 text-sm text-gray-300">
              You don’t have permission to view this page.
            </p>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}
