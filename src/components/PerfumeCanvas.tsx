// components/PerfumeCanvas.tsx - Mobile Optimized Version
"use client";

import React, { Suspense, useRef, useEffect, useState, useCallback, memo } from "react";
import * as THREE from "three";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, PerformanceMonitor, AdaptiveDpr, AdaptiveEvents } from "@react-three/drei";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Bottle3D, { Bottle3DRef } from "@/components/Bottle";

// Register plugins once at module level
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
  
  // Mobile-specific GSAP config
  gsap.config({
    force3D: true,
    nullTargetWarn: false,
  });
  
  // Mobile ScrollTrigger config
  ScrollTrigger.config({
    limitCallbacks: true,
    syncInterval: 40, // Reduced frequency for mobile
    ignoreMobileResize: true
  });
}

interface ScrollAnimationProps {
  bottleRef: React.RefObject<Bottle3DRef>;
  containerRef: React.RefObject<HTMLDivElement>;
  enabled: boolean;
  isMobile: boolean;
}

const ScrollAnimation = memo(({ bottleRef, containerRef, enabled, isMobile }: ScrollAnimationProps) => {
  const { invalidate, gl } = useThree();
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const stRef = useRef<ScrollTrigger | null>(null);
  const frameCount = useRef(0);

  // Mobile: Use RAF-based animation instead of GSAP for better performance
  useFrame((state, delta) => {
    if (!enabled || !isMobile || !bottleRef.current) return;
    
    // Throttle updates on mobile
    frameCount.current++;
    if (frameCount.current % 2 !== 0) return; // Update every other frame
    
    const scrollProgress = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    const bottleGroup = bottleRef.current.bottleGroup;
    const capGroup = bottleRef.current.capGroup;
    
    if (!bottleGroup || !capGroup) return;
    
    // Simple lerp for smooth animation
    const targetY = -35 + (scrollProgress * 34.5);
    const targetRotation = Math.PI/2 + (scrollProgress * Math.PI);
    const targetScale = 0.8 - (scrollProgress * 0.3);
    
    bottleGroup.position.y += (targetY - bottleGroup.position.y) * 0.1;
    bottleGroup.rotation.y += (targetRotation - bottleGroup.rotation.y) * 0.1;
    bottleGroup.scale.setScalar(bottleGroup.scale.x + (targetScale - bottleGroup.scale.x) * 0.1);
    
    capGroup.position.copy(bottleGroup.position);
    capGroup.rotation.y = bottleGroup.rotation.y + Math.PI/2;
    capGroup.scale.copy(bottleGroup.scale);
  });

  useEffect(() => {
    if (!enabled || !bottleRef.current || !containerRef.current || isMobile) return;

    // Desktop animation setup (unchanged)
    const bottleGroup = bottleRef.current.bottleGroup;
    const capGroup = bottleRef.current.capGroup;
    
    if (!bottleGroup || !capGroup) return;

    // Initial setup
    const initialScale = 0.8;
    const initialY = -5.5 * 65;
    
    gsap.set([bottleGroup, capGroup], {
      immediateRender: true,
      overwrite: 'auto'
    });
    
    bottleGroup.position.set(0, initialY, 0);
    bottleGroup.rotation.set(0, Math.PI/2, 0);
    bottleGroup.scale.setScalar(initialScale);
    
    capGroup.position.copy(bottleGroup.position);
    capGroup.rotation.set(0, Math.PI, 0);
    capGroup.scale.setScalar(initialScale);
    capGroup.visible = true;
    
    const tl = gsap.timeline({
      defaults: { 
        ease: "power2.inOut",
        overwrite: 'auto'
      }
    });

    tlRef.current = tl;

    stRef.current = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "50% top",
      scrub: 1.5,
      invalidateOnRefresh: true,
      animation: tl
    });

    // Desktop animation
    const finalX = 3;
    const finalY = -0.5;
    const finalScale = 0.7;

    tl.to([bottleGroup.position, capGroup.position], {
      y: initialY + 2,
      duration: 0.3,
    }, 0)
    .to([bottleGroup.rotation, capGroup.rotation], {
      y: Math.PI/6,
      duration: 0.3,
    }, 0)
    .to(capGroup.position, {
      y: initialY + 55,
      x: finalX * 0.3,
      duration: 0.3,
    }, 0.3)
    .to(capGroup.rotation, {
      y: Math.PI * 2,
      z: 0.2,
      duration: 0.3,
    }, 0.3)
    .to(bottleGroup.position, {
      x: finalX,
      y: finalY,
      duration: 0.4,
    }, 0.6)
    .to(bottleGroup.rotation, {
      x: 0.3,
      y: Math.PI * 2.1,
      z: 0.1,
      duration: 0.4,
    }, 0.6)
    .to(bottleGroup.scale, {
      x: finalScale,
      y: finalScale,
      z: finalScale,
      duration: 0.4,
    }, 0.6)
    .to(capGroup.position, {
      x: finalX,
      y: 100.5,
      duration: 0.4,
    }, 0.6)
    .to(capGroup.scale, {
      x: finalScale * 0.9,
      y: finalScale * 0.9,
      z: finalScale * 0.9,
      duration: 0.4,
    }, 0.6)
    .to(bottleGroup.position, {
      x: 35 * 5,
      y: -30 * 5,
      duration: 0.4,
    }, 1)
    .to(bottleGroup.rotation, {
      x: 0.05, 
      z: -0.2, 
      duration: 0.4,
    }, 1)

    invalidate();

    return () => {
      if (stRef.current) {
        stRef.current.kill();
        stRef.current = null;
      }
      if (tlRef.current) {
        tlRef.current.kill();
        tlRef.current = null;
      }
    };
  }, [enabled, bottleRef, containerRef, invalidate, isMobile]);

  return null;
});

ScrollAnimation.displayName = 'ScrollAnimation';

// Simplified loading fallback for mobile
const LoadingFallback = () => (
  <mesh>
    <boxGeometry args={[0.5, 0.5, 0.5]} />
    <meshBasicMaterial color="#666" />
  </mesh>
);

interface PerfumeCanvasProps {
  containerRef: React.RefObject<HTMLDivElement>;
  config?: {
    enableAnimation?: boolean;
  };
}

export default function PerfumeCanvas({ containerRef, config }: PerfumeCanvasProps) {
  const bottleRef = useRef<Bottle3DRef>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [quality, setQuality] = useState<'low' | 'medium' | 'high'>('high');

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      const mobile = width < 768;
      setIsMobile(mobile);
      
      // Auto-detect quality based on device
      if (mobile) {
        // Check device performance hints
        const connection = (navigator as any).connection;
        const memory = (navigator as any).deviceMemory;
        
        if (connection?.saveData || connection?.effectiveType === '2g') {
          setQuality('low');
        } else if (memory && memory < 4) {
          setQuality('medium');
        } else {
          setQuality('medium'); // Default medium for most mobiles
        }
      } else {
        setQuality('high');
      }
    };
    
    checkDevice();
    window.addEventListener('resize', checkDevice);
    
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // Quality-based settings
  const getQualitySettings = useCallback(() => {
    switch (quality) {
      case 'low':
        return {
          dpr: [0.5, 0.75],
          shadows: false,
          antialias: false,
          frameloop: 'demand' as const,
          envResolution: 64,
          lightCount: 1,
          powerPreference: 'low-power' as WebGLPowerPreference,
        };
      case 'medium':
        return {
          dpr: [0.75, 1],
          shadows: false,
          antialias: false,
          frameloop: 'always' as const,
          envResolution: 128,
          lightCount: 2,
          powerPreference: 'default' as WebGLPowerPreference,
        };
      default:
        return {
          dpr: [1, 2],
          shadows: true,
          antialias: true,
          frameloop: 'always' as const,
          envResolution: 256,
          lightCount: 3,
          powerPreference: 'high-performance' as WebGLPowerPreference,
        };
    }
  }, [quality]);

  const settings = getQualitySettings();

  return (
    <div className="w-full h-full relative" style={{ pointerEvents: 'none', zIndex: 1 }}>
      <Canvas
        className="w-full h-full"
        shadows={settings.shadows}
        style={{ background: 'transparent' }}
        dpr={[1, 2]}
        frameloop={settings.frameloop}
        camera={{ 
          position: [0, 0, 5],
          fov: isMobile ? 50 : 45,
          near: 0.1,
          far: isMobile ? 30 : 50
        }}
        gl={{ 
          antialias: settings.antialias,
          alpha: true,
          premultipliedAlpha: false,
          powerPreference: settings.powerPreference,
          toneMapping: THREE.NoToneMapping,
          outputColorSpace: THREE.SRGBColorSpace,
          preserveDrawingBuffer: false,
        }}
        onCreated={({ gl, scene }) => {
          scene.background = null;
          gl.setClearAlpha(0);
          
          // Mobile-specific optimizations
          if (isMobile) {
            gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
            gl.shadowMap.enabled = false;
          }
        }}
      >
        {/* Adaptive performance components */}
        {isMobile && (
          <>
            <AdaptiveDpr pixelated />
            <AdaptiveEvents />
          </>
        )}

        {/* Minimal lighting for mobile */}
        <ambientLight intensity={isMobile ? 0.8 : 0.4} />
        
        {!isMobile && settings.lightCount > 1 && (
          <>
            <spotLight
              position={[-4, 4, 4]}
              angle={0.3}
              penumbra={0.8}
              intensity={1.0}
              castShadow={settings.shadows}
              shadow-mapSize={[512, 512]}
            />
            <spotLight
              position={[4, 4, 4]}
              angle={0.3}
              penumbra={0.8}
              intensity={1.0}
              castShadow={settings.shadows}
              shadow-mapSize={[512, 512]}
            />
          </>
        )}
        
        {settings.lightCount > 0 && (
          <directionalLight 
            position={[0, 5, 3]} 
            intensity={0.6} 
            castShadow={!isMobile && settings.shadows}
          />
        )}

        <Suspense fallback={<LoadingFallback />}>
          <Bottle3D
            ref={bottleRef}
            position={[0, 0, 0]}
            rotation={[0, 0, 0]}
            scale={0.01}
            enableAnimation={config?.enableAnimation !== false}
            deviceType={isMobile ? 'mobile' : 'desktop'}
            adaptiveQuality={quality !== 'low'}
          />

          {/* Simplified environment for mobile */}
          {quality !== 'low' && (
            <Environment 
              preset={isMobile ? "city" : "studio"}
              resolution={settings.envResolution as 64 | 128 | 256}
              background={false}
            >
              {!isMobile && (
                <group>
                  <Lightformer
                    form="rect"
                    intensity={4}
                    scale={[4, 2, 1]}
                    position={[-5, 3, 2]}
                    rotation={[0, Math.PI * 0.1, 0]}
                  />
                  <Lightformer
                    form="rect"
                    intensity={4}
                    scale={[4, 2, 1]}
                    position={[5, 3, 2]}
                    rotation={[0, -Math.PI * 0.1, 0]}
                  />
                </group>
              )}
            </Environment>
          )}

          {config?.enableAnimation !== false && (
            <ScrollAnimation 
              bottleRef={bottleRef} 
              containerRef={containerRef}
              enabled={config?.enableAnimation !== false}
              isMobile={isMobile}
            />
          )}
        </Suspense>

        {/* Performance monitor for development */}
        {process.env.NODE_ENV === 'development' && !isMobile && (
          <PerformanceMonitor
            onDecline={() => {
              console.warn('Performance declining');
              setQuality('medium');
            }}
            flipflops={3}
            averages={2}
            factor={0.5}
          />
        )}
      </Canvas>
    </div>
  );
}