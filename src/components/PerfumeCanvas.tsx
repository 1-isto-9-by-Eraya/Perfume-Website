// components/PerfumeCanvas.tsx
"use client";

import React, { Suspense, useLayoutEffect, useRef, useEffect } from "react";
import * as THREE from "three";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, Float, useTexture } from "@react-three/drei";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Bottle3D, { Bottle3DRef } from "@/components/Bottle";

gsap.registerPlugin(ScrollTrigger);

interface ScrollAnimationProps {
  bottleRef: React.RefObject<Bottle3DRef>;
  containerRef: React.RefObject<HTMLDivElement>;
}

interface PerfumeCanvasProps {
  containerRef: React.RefObject<HTMLDivElement>;
  config?: {
    position?: [number, number, number];
    rotation?: [number, number, number];
    scale?: number;
    enableAnimation?: boolean;
  };
}

// function ScrollAnimation({ bottleRef, containerRef }: ScrollAnimationProps) {
//   const { invalidate, camera, viewport, size } = useThree();
//   const tlRef = useRef<gsap.core.Timeline | null>(null);
//   const ctxRef = useRef<gsap.Context | null>(null);

//   useLayoutEffect(() => {
//     if (!bottleRef.current || !containerRef.current) return;

//     // Clean up any existing timeline and context
//     if (tlRef.current) {
//       tlRef.current.kill();
//       tlRef.current = null;
//     }
    
//     if (ctxRef.current) {
//       ctxRef.current.revert();
//       ctxRef.current = null;
//     }

//     // Kill all existing ScrollTriggers to prevent conflicts
//     ScrollTrigger.getAll().forEach(st => st.kill());
    
//     // Get references to bottle and cap groups
//     const bottleGroup = bottleRef.current.bottleGroup;
//     const capGroup = bottleRef.current.capGroup;
    
//     if (!bottleGroup || !capGroup) {
//       console.warn("Bottle or cap group not found");
//       return;
//     }

//     // Calculate responsive positions
//     const vp = viewport.getCurrentViewport(camera, new THREE.Vector3(0, 0, 0));
//     const isMobile = size.width < 1024;
    
//     // Initial position: bottom-center (only top half visible)
//     const initialY = -3; // Adjust this to show only top half
//     const initialX = 0; // Center
    
//     // Final position: right side of second section
//     const finalX = isMobile ? 0 : 4; 
//     const finalY = 0;

//     // Set initial positions
//     bottleGroup.position.set(initialX, initialY, 0);
//     bottleGroup.rotation.set(0, 0, 0);
//     bottleGroup.scale.set(1, 1, 1);
    
//     capGroup.position.set(0, 0, 0);
//     capGroup.rotation.set(0, 0, 0);
//     capGroup.scale.set(1, 1, 1);
//     capGroup.visible = true;
    
//     // Force a render update
//     invalidate();

//     // Create GSAP context for proper cleanup
//     const ctx = gsap.context(() => {
//       // Set initial positions using GSAP
//       gsap.set(bottleGroup.position, { x: initialX, y: initialY, z: 0 });
//       gsap.set(bottleGroup.rotation, { x: 0, y: 0, z: 0 });
//       gsap.set(bottleGroup.scale, { x: 1, y: 1, z: 1 });
      
//       gsap.set(capGroup.position, { x: 0, y: 0, z: 0 });
//       gsap.set(capGroup.rotation, { x: 0, y: 0, z: 0 });
//       gsap.set(capGroup.scale, { x: 1, y: 1, z: 1 });

//       // Create master timeline
//       const tl = gsap.timeline({
//         scrollTrigger: {
//           trigger: containerRef.current!,
//           start: "top top",
//           end: "bottom top",
//           scrub: 1.5,
//           invalidateOnRefresh: true,
//           onUpdate: () => invalidate(),
//           onRefresh: () => {
//             // Recalculate positions on refresh
//             const vp = viewport.getCurrentViewport(camera, new THREE.Vector3(0, 0, 0));
//             invalidate();
//           },
//         },
//       });

//       tlRef.current = tl;

//       // Animation Sequence:
      
//       // Phase 1: Bottle rises and rotates 180° (0-30%)
//       tl.to(bottleGroup.position, {
//         y: 0, // Rise to center
//         duration: 0.3,
//         ease: "power2.out",
//       }, 0)
//       .to([bottleGroup.rotation, capGroup.rotation], {
//         y: Math.PI, // 180° rotation
//         duration: 0.3,
//         ease: "power2.inOut",
//       }, 0);

//       // Phase 2: Cap detaches spirally and exits from top (30-60%)
//       tl.to(capGroup.position, {
//         y: vp.height * 0.8, // Move cap up and out of screen
//         duration: 0.3,
//         ease: "power2.in",
//       }, 0.3)
//       .to(capGroup.rotation, {
//         y: Math.PI * 3, // Spiral rotation (540°)
//         z: Math.PI * 0.2, // Slight tilt for spiral effect
//         duration: 0.3,
//         ease: "power2.in",
//       }, 0.3)
//       .to(capGroup.scale, {
//         x: 0.7,
//         y: 0.7,
//         z: 0.7,
//         duration: 0.3,
//         ease: "power2.in",
//       }, 0.3);

//       // Phase 3: Bottle moves to right side (50-100%)
//       tl.to(bottleGroup.position, {
//         x: finalX,
//         y: finalY,
//         duration: 0.5,
//         ease: "power3.inOut",
//       }, 0.5)
//       .to(bottleGroup.rotation, {
//         y: Math.PI * 1.5, // Additional rotation for final position
//         duration: 0.5,
//         ease: "power2.out",
//       }, 0.5)
//       .to(bottleGroup.scale, {
//         x: 0.85,
//         y: 0.85,
//         z: 0.85,
//         duration: 0.5,
//         ease: "power2.out",
//       }, 0.5);

//       // Refresh ScrollTrigger after a short delay
//       setTimeout(() => {
//         ScrollTrigger.refresh();
//         invalidate();
//       }, 100);
//     });

//     ctxRef.current = ctx;

//     // Handle resize
//     const handleResize = () => {
//       ScrollTrigger.refresh();
//       invalidate();
//     };

//     window.addEventListener("resize", handleResize);

//     // Cleanup function
//     return () => {
//       window.removeEventListener("resize", handleResize);
      
//       // Kill all tweens
//       if (bottleGroup) {
//         gsap.killTweensOf(bottleGroup.position);
//         gsap.killTweensOf(bottleGroup.rotation);
//         gsap.killTweensOf(bottleGroup.scale);
//       }
      
//       if (capGroup) {
//         gsap.killTweensOf(capGroup.position);
//         gsap.killTweensOf(capGroup.rotation);
//         gsap.killTweensOf(capGroup.scale);
//       }
      
//       // Clean up timeline
//       if (tlRef.current) {
//         tlRef.current.kill();
//       }
      
//       // Revert context
//       if (ctxRef.current) {
//         ctxRef.current.revert();
//       }
      
//       // Kill all ScrollTriggers
//       ScrollTrigger.getAll().forEach(st => st.kill());
//     };
//   }, [bottleRef, containerRef, invalidate, camera, viewport, size]);

//   // Additional effect to handle visibility on mount
//   useEffect(() => {
//     if (bottleRef.current?.capGroup) {
//       bottleRef.current.capGroup.visible = true;
      
//       // Also check all children of capGroup
//       bottleRef.current.capGroup.traverse((child) => {
//         child.visible = true;
//       });
      
//       invalidate();
//     }
//   }, [bottleRef, invalidate]);

//   return null;
// }


// In PerfumeCanvas.tsx - Update the ScrollAnimation function




function ScrollAnimation({ bottleRef, containerRef }: ScrollAnimationProps) {
  const { invalidate, camera, viewport, size } = useThree();
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const ctxRef = useRef<gsap.Context | null>(null);

  useLayoutEffect(() => {
    if (!bottleRef.current || !containerRef.current) return;

    // Clean up any existing timeline and context
    if (tlRef.current) {
      tlRef.current.kill();
      tlRef.current = null;
    }
    
    if (ctxRef.current) {
      ctxRef.current.revert();
      ctxRef.current = null;
    }

    ScrollTrigger.getAll().forEach(st => st.kill());
    
    const bottleGroup = bottleRef.current.bottleGroup;
    const capGroup = bottleRef.current.capGroup;
    
    if (!bottleGroup || !capGroup) {
      console.warn("Bottle or cap group not found");
      return;
    }

    // Make sure cap is visible
    capGroup.visible = true;
    capGroup.traverse((child) => {
      child.visible = true;
    });
    
    // Force a render update
    invalidate();

    // Create GSAP context for proper cleanup
    const ctx = gsap.context(() => {
      // Set initial positions INSIDE the context to prevent teleporting
      gsap.set(bottleGroup.position, { x: 0, y: -4, z: 0 });
      gsap.set(bottleGroup.rotation, { x: 0, y: 0, z: 0 });
      gsap.set(bottleGroup.scale, { x: 0.01, y: 0.01, z: 0.01 });
      
      // Cap starts with bottle
      gsap.set(capGroup.position, { x: 0, y: -4, z: 0 });
      gsap.set(capGroup.rotation, { x: 0, y: 0, z: 0 });
      gsap.set(capGroup.scale, { x: 0.01, y: 0.01, z: 0.01 });

      // Create master timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current!,
          start: "top top",
          end: "center top",
          scrub: 1,
          markers: false, // Set to true to debug positions
          invalidateOnRefresh: true,
          onUpdate: () => invalidate(),
        },
      });

      tlRef.current = tl;

      const isMobile = size.width < 1024;
      const targetX = isMobile ? 0 : 3;

      // Phase 1: Bottle rises and rotates (0-30%)
      tl.to([bottleGroup.position, capGroup.position], {
        y: -2.5,
        duration: 0.3,
        ease: "power2.out",
      }, 0)
      .to([bottleGroup.rotation, capGroup.rotation], {
        y: Math.PI,
        duration: 0.3,
        ease: "power2.inOut",
      }, 0);

      // Phase 2: Cap separates and spirals up (30-60%)
      // tl.to(capGroup.position, {
      //   y: 0.5,
      //   // y: 5,
      //   // x: 0.5,
      //   duration: 0.3,
      //   ease: "power2.inOut",
      // }, 0.3)
      // .to(capGroup.rotation, {
      //   y: Math.PI * 0.5,
      //   // y: Math.PI * 3,
      //   z: Math.PI * 0.1,
      //   // z: Math.PI * 0.2,
      //   duration: 0.3,
      //   ease: "power2.inOut",
      // }, 0.3)
      // .to(capGroup.scale, {
      //   x: 0.7,
      //   y: 0.7,
      //   z: 0.7,
      //   duration: 0.3,
      //   ease: "power2.in",
      // }, 0.3);

      tl.to(capGroup.position, {
        y: 3.5,
        duration: 0.4,
        ease: "power3.inOut",
      }, 0.4)
      .to(capGroup.rotation, {
        y: Math.PI * 0.7,
        z: Math.PI * 0.3,
        duration: 0.4,
        ease: "power2.inOut",
      }, 0.4);


      // Phase 3: Bottle moves to right (60-100%)
      tl.to(bottleGroup.position, {
        y:0.2,
        x: targetX,
        duration: 0.4,
        ease: "power3.inOut",
      }, 0.6)
      .to(bottleGroup.rotation, {
        // x: Math.PI * -0.2,
        // y: Math.PI * 2.2,
        // z: Math.PI * 0.18,
        x: 2.5,
        y: 2.3,
        z: 3.45,
        duration: 0.4,
        ease: "power2.out",
      }, 0.6)
      .to(bottleGroup.scale, {
        x: 0.007,
        y: 0.007,
        z: 0.007,
        duration: 0.4,
        ease: "power2.out",
      }, 0.6);

      // Refresh after setup
      setTimeout(() => {
        ScrollTrigger.refresh();
        invalidate();
      }, 100);
    });

    ctxRef.current = ctx;

    // Handle resize
    const handleResize = () => {
      ScrollTrigger.refresh();
      invalidate();
    };

    window.addEventListener("resize", handleResize);

    // Cleanup function
    return () => {
      window.removeEventListener("resize", handleResize);
      
      if (bottleGroup) {
        gsap.killTweensOf(bottleGroup.position);
        gsap.killTweensOf(bottleGroup.rotation);
        gsap.killTweensOf(bottleGroup.scale);
      }
      
      if (capGroup) {
        gsap.killTweensOf(capGroup.position);
        gsap.killTweensOf(capGroup.rotation);
        gsap.killTweensOf(capGroup.scale);
      }
      
      if (tlRef.current) {
        tlRef.current.kill();
      }
      
      if (ctxRef.current) {
        ctxRef.current.revert();
      }
      
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, [bottleRef, containerRef, invalidate, camera, viewport, size]);

  // Debug: Log cap visibility
  useEffect(() => {
    if (bottleRef.current?.capGroup) {
      console.log("Cap group exists:", bottleRef.current.capGroup);
      console.log("Cap visible:", bottleRef.current.capGroup.visible);
      console.log("Cap children:", bottleRef.current.capGroup.children.length);
    }
  }, [bottleRef]);

  return null;
}


export default function PerfumeCanvas({ containerRef, config }: PerfumeCanvasProps) {
  const bottleRef = useRef<Bottle3DRef>(null);

  return (
    <div className="w-full h-full relative" style={{ pointerEvents: 'none', zIndex: 1 }}>
      <Canvas
        className="w-full h-full"
        shadows
        style={{ background: 'transparent' }}
        dpr={[1, 2]}
        frameloop="demand"
        camera={{ position: [2, 1.6, 3], fov: 50 }}
        gl={{ 
          antialias: true, 
          logarithmicDepthBuffer: true,
          alpha: true,
          premultipliedAlpha: false,
          powerPreference: "high-performance",
        }}
        onCreated={({ gl, scene }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.outputColorSpace = THREE.SRGBColorSpace;
          scene.background = null;
          gl.setClearAlpha(0);
        }}
      >
        {/* Optimized lighting */}
        <ambientLight intensity={0.4} />
        <spotLight
          position={[-4, 4, 4]}
          angle={0.3}
          penumbra={0.8}
          intensity={1.0}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <spotLight
          position={[4, 4, 4]}
          angle={0.3}
          penumbra={0.8}
          intensity={1.0}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <directionalLight 
          position={[0, 5, 3]} 
          intensity={0.6} 
          castShadow 
        />

        <Suspense fallback={null}>
          <Bottle3D
            ref={bottleRef}
            position={config?.position || [0, -0.6, 0]}
            rotation={config?.rotation || [0, 0, 0]}
            scale={config?.scale || 0.7}
            enableAnimation={config?.enableAnimation !== false}
          />

          <Environment preset="studio" resolution={512}>
            <group>
              <Lightformer
                form="rect"
                intensity={8}
                scale={[4, 2, 1]}
                position={[-5, 3, 2]}
                rotation={[0, Math.PI * 0.1, 0]}
              />
              <Lightformer
                form="rect"
                intensity={8}
                scale={[4, 2, 1]}
                position={[5, 3, 2]}
                rotation={[0, -Math.PI * 0.1, 0]}
              />
              <Lightformer
                form="rect"
                intensity={3}
                scale={[3, 1, 1]}
                position={[0, 6, 0]}
                rotation={[Math.PI / 2, 0, 0]}
              />
              <Lightformer
                form="circle"
                intensity={4}
                scale={2}
                position={[0, 0, 5]}
                color="#FFD54A"
              />
            </group>
          </Environment>

          {config?.enableAnimation !== false && (
            <ScrollAnimation bottleRef={bottleRef} containerRef={containerRef} />
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}