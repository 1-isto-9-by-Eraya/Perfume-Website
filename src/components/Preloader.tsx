// 'use client';

// import { useEffect, useState, useRef } from 'react';

// export default function Preloader({ children }: { children: React.ReactNode }) {
//   const [loading, setLoading] = useState(true);
//   const [audioEnabled, setAudioEnabled] = useState(false);
//   const [showAudioPrompt, setShowAudioPrompt] = useState(false);
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const hasTriedAudio = useRef(false);

//   useEffect(() => {
//     const video = videoRef.current;
//     if (!video) return;

//     // Handle video end
//     const handleVideoEnd = () => {
//       setTimeout(() => setLoading(false), 100);
//     };

//     // Fallback timeout
//     const fallbackTimeout = setTimeout(() => {
//       setLoading(false);
//     }, 10000);

//     // Try to play with audio initially
//     const initializeVideo = async () => {
//       if (hasTriedAudio.current) return;
//       hasTriedAudio.current = true;

//       video.currentTime = 0;
//       video.muted = false;

//       try {
//         await video.play();
//         setAudioEnabled(true);
//       } catch (error) {
//         // Fallback to muted
//         video.muted = true;
//         try {
//           await video.play();
//           setTimeout(() => setShowAudioPrompt(true), 1000);
//         } catch (mutedError) {
//           console.error('Failed to play video even muted:', mutedError);
//           setLoading(false);
//         }
//       }
//     };

//     video.addEventListener('ended', handleVideoEnd);
//     initializeVideo();

//     return () => {
//       clearTimeout(fallbackTimeout);
//       video.removeEventListener('ended', handleVideoEnd);
//     };
//   }, []);

//   const handleEnableAudio = () => {
//     const video = videoRef.current;
//     if (!video || audioEnabled) return;

//     setAudioEnabled(true);
//     setShowAudioPrompt(false);
    
//     // Simply unmute - don't call play() again
//     video.muted = false;
//   };

//   if (loading) {
//     return (
//       <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
//         <video
//           ref={videoRef}
//           src="/videos/video.mp4"
//           autoPlay
//           muted={false}
//           playsInline
//           webkit-playsinline="true"
//           className="w-full h-full object-cover"
//           preload="auto"
//         />
        
//         {/* Simple audio prompt */}
//         {showAudioPrompt && !audioEnabled && (
//           <div className="absolute bottom-4 sm:bottom-8 md:left-[48%]  z-10">
//             <button
//               onClick={handleEnableAudio}
//               className="bg-black/70 backdrop-blur-sm rounded-full px-4 py-2 sm:px-6 sm:py-3 text-white text-xs sm:text-sm animate-pulse border border-white/30 whitespace-nowrap"
//             >
//               🔊 Tap for sound
//             </button>
//           </div>
//         )}
//       </div>
//     );
//   }

//   return <>{children}</>;
// }









'use client';

import { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function Preloader({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  
  const [loading, setLoading] = useState(isHomePage);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [showAudioPrompt, setShowAudioPrompt] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasTriedAudio = useRef(false);

  useEffect(() => {
    // Skip preloader logic if not on home page
    if (!isHomePage) {
      setLoading(false);
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    // Handle video end
    const handleVideoEnd = () => {
      setTimeout(() => setLoading(false), 100);
    };

    // Fallback timeout
    const fallbackTimeout = setTimeout(() => {
      setLoading(false);
    }, 10000);

    // Try to play with audio initially
    const initializeVideo = async () => {
      if (hasTriedAudio.current) return;
      hasTriedAudio.current = true;

      video.currentTime = 0;
      video.muted = false;

      try {
        await video.play();
        setAudioEnabled(true);
      } catch (error) {
        // Fallback to muted
        video.muted = true;
        try {
          await video.play();
          setTimeout(() => setShowAudioPrompt(true), 1000);
        } catch (mutedError) {
          console.error('Failed to play video even muted:', mutedError);
          setLoading(false);
        }
      }
    };

    video.addEventListener('ended', handleVideoEnd);
    initializeVideo();

    return () => {
      clearTimeout(fallbackTimeout);
      video.removeEventListener('ended', handleVideoEnd);
    };
  }, [isHomePage]);

  const handleEnableAudio = () => {
    const video = videoRef.current;
    if (!video || audioEnabled) return;

    setAudioEnabled(true);
    setShowAudioPrompt(false);
    
    // Simply unmute - don't call play() again
    video.muted = false;
  };

  // If not on home page, render children immediately
  if (!isHomePage) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
        <video
          ref={videoRef}
          // src="/videos/video.mp4"
          src={`${process.env.__NEXT_ROUTER_BASEPATH || ''}/videos/video.mp4`}
          autoPlay
          muted={false}
          playsInline
          webkit-playsinline="true"
          className="w-full h-full object-cover"
          preload="auto"
        />
        
        {/* Simple audio prompt */}
        {showAudioPrompt && !audioEnabled && (
          <div className="absolute bottom-4 sm:bottom-8 md:left-[48%]  z-10">
            <button
              onClick={handleEnableAudio}
              className="bg-black/70 backdrop-blur-sm rounded-full px-4 py-2 sm:px-6 sm:py-3 text-white text-xs sm:text-sm animate-pulse border border-white/30 whitespace-nowrap"
            >
              🔊 Tap for sound
            </button>
          </div>
        )}
      </div>
    );
  }

  return <>{children}</>;
}