"use client";

import { useEffect, useState } from "react";

export default function Preloader({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Auto-hide preloader once video finishes
    const video = document.getElementById("preloader-video") as HTMLVideoElement;
    if (video) {
      video.onended = () => setLoading(false);
    }

    // Fallback: hide after 6s if video doesn’t fire `onended`
    const timeout = setTimeout(() => setLoading(false), 6000);

    return () => clearTimeout(timeout);
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
        <video
          id="preloader-video"
          src="/videos/video.mp4"
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return <>{children}</>;
}
