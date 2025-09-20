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

// MOBILE ANIMATION CONFIGURATION - Customize these values
const MOBILE_ANIMATION_CONFIG = {
  initial: {
    bottleY: -20,              // Starting Y position
    bottleX: 0,                // Starting X position
    bottleRotationX: 0,        // Starting X rotation
    bottleRotationY: Math.PI/4, // Starting Y rotation
    bottleRotationZ: 0,        // Starting Z rotation
    bottleScale: 0.7,          // Starting scale
    capOffsetX: 0,             // Cap X offset from bottle
    capOffsetY: 0,             // Cap Y offset from bottle
    capOffsetZ: 0,             // Cap Z offset from bottle
    capRotationOffset: Math.PI/2, // Cap rotation offset
  },
  final: {
    bottleY: -2,               // Final Y position
    bottleX: 1,                // Final X position
    bottleRotationX: 0.1,      // Final X rotation
    bottleRotationY: Math.PI * 1.5, // Final Y rotation
    bottleRotationZ: 0,        // Final Z rotation
    bottleScale: 0.5,          // Final scale
    capOffsetX: 0,             // Cap X offset at end
    capOffsetY: 0.5,           // Cap Y offset at end
    capOffsetZ: 0,             // Cap Z offset at end
    capRotationOffset: Math.PI, // Cap rotation offset at end
  },
  smoothness: 0.1,            // Lerp factor (0.01 = very smooth, 0.2 = snappy)
  updateFrequency: 2,         // Update every N frames (higher = better performance)
};

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
  const lastScrollY = useRef(0);
  const scrollVelocity = useRef(0);

  // Mobile: Use RAF-based animation with manual config
  useFrame((state, delta) => {
    if (!enabled || !isMobile || !bottleRef.current) return;
    
    // Throttle updates on mobile
    frameCount.current++;
    if (frameCount.current % MOBILE_ANIMATION_CONFIG.updateFrequency !== 0) return;
    
    const scrollY = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const scrollProgress = Math.min(Math.max(scrollY / maxScroll, 0), 1);
    
    // Calculate velocity for adaptive smoothness
    scrollVelocity.current = Math.abs(scrollY - lastScrollY.current);
    lastScrollY.current = scrollY;
    
    // Adaptive smoothness based on scroll speed
    const smoothness = scrollVelocity.current > 50 
      ? MOBILE_ANIMATION_CONFIG.smoothness * 1.5  // Faster response when scrolling fast
      : MOBILE_ANIMATION_CONFIG.smoothness;
    
    const bottleGroup = bottleRef.current.bottleGroup;
    const capGroup = bottleRef.current.capGroup;
    
    if (!bottleGroup || !capGroup) return;
    
    const config = MOBILE_ANIMATION_CONFIG;
    
    // Interpolate bottle position
    const targetX = config.initial.bottleX + (config.final.bottleX - config.initial.bottleX) * scrollProgress;
    const targetY = config.initial.bottleY + (config.final.bottleY - config.initial.bottleY) * scrollProgress;
    
    // Interpolate bottle rotation
    const targetRotX = config.initial.bottleRotationX + (config.final.bottleRotationX - config.initial.bottleRotationX) * scrollProgress;
    const targetRotY = config.initial.bottleRotationY + (config.final.bottleRotationY - config.initial.bottleRotationY) * scrollProgress;
    const targetRotZ = config.initial.bottleRotationZ + (config.final.bottleRotationZ - config.initial.bottleRotationZ) * scrollProgress;
    
    // Interpolate scale
    const targetScale = config.initial.bottleScale + (config.final.bottleScale - config.initial.bottleScale) * scrollProgress;
    
    // Apply smooth lerping to bottle
    bottleGroup.position.x += (targetX - bottleGroup.position.x) * smoothness;
    bottleGroup.position.y += (targetY - bottleGroup.position.y) * smoothness;
    
    bottleGroup.rotation.x += (targetRotX - bottleGroup.rotation.x) * smoothness;
    bottleGroup.rotation.y += (targetRotY - bottleGroup.rotation.y) * smoothness;
    bottleGroup.rotation.z += (targetRotZ - bottleGroup.rotation.z) * smoothness;
    
    const currentScale = bottleGroup.scale.x;
    const newScale = currentScale + (targetScale - currentScale) * smoothness;
    bottleGroup.scale.setScalar(newScale);
    
    // Cap follows bottle with configurable offset
    const capOffsetX = config.initial.capOffsetX + (config.final.capOffsetX - config.initial.capOffsetX) * scrollProgress;
    const capOffsetY = config.initial.capOffsetY + (config.final.capOffsetY - config.initial.capOffsetY) * scrollProgress;
    const capOffsetZ = config.initial.capOffsetZ + (config.final.capOffsetZ - config.initial.capOffsetZ) * scrollProgress;
    const capRotationOffset = config.initial.capRotationOffset + (config.final.capRotationOffset - config.initial.capRotationOffset) * scrollProgress;
    
    capGroup.position.x = bottleGroup.position.x + capOffsetX;
    capGroup.position.y = bottleGroup.position.y + capOffsetY;
    capGroup.position.z = bottleGroup.position.z + capOffsetZ;
    capGroup.rotation.y = bottleGroup.rotation.y + capRotationOffset;
    capGroup.rotation.x = bottleGroup.rotation.x;
    capGroup.rotation.z = bottleGroup.rotation.z;
    capGroup.scale.copy(bottleGroup.scale);
  });

  useEffect(() => {
    if (!enabled || !bottleRef.current || !containerRef.current) return;

    const bottleGroup = bottleRef.current.bottleGroup;
    const capGroup = bottleRef.current.capGroup;
    
    if (!bottleGroup || !capGroup) return;

    // Mobile: Set initial positions from config
    if (isMobile) {
      const config = MOBILE_ANIMATION_CONFIG;
      
      bottleGroup.position.set(
        config.initial.bottleX, 
        config.initial.bottleY, 
        0
      );
      bottleGroup.rotation.set(
        config.initial.bottleRotationX,
        config.initial.bottleRotationY,
        config.initial.bottleRotationZ
      );
      bottleGroup.scale.setScalar(config.initial.bottleScale);
      
      capGroup.position.set(
        config.initial.bottleX + config.initial.capOffsetX,
        config.initial.bottleY + config.initial.capOffsetY,
        config.initial.capOffsetZ
      );
      capGroup.rotation.set(
        config.initial.bottleRotationX,
        config.initial.bottleRotationY + config.initial.capRotationOffset,
        config.initial.bottleRotationZ
      );
      capGroup.scale.setScalar(config.initial.bottleScale);
      capGroup.visible = true;
      
      return; // Skip GSAP setup for mobile
    }

    // Desktop animation setup (unchanged)
    // const bottleGroup = bottleRef.current.bottleGroup;
    // const capGroup = bottleRef.current.capGroup;
    
    if (!bottleGroup || !capGroup) return;

    // Initial setup
    const initialScale = 0.8;
    const initialY = -5.5*65;
    
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
      scrub: 1,
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
  const bottleRef = useRef<Bottle3DRef>(null!);
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
        dpr={[1,2]}
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
              enabled={config?.enableAnimation ?? true}
              isMobile={isMobile}
            />
          )}
        </Suspense>

        {/* Performance monitor for development */}
        {/* {process.env.NODE_ENV === 'development' && !isMobile && (
          <PerformanceMonitor
            onDecline={() => {
              console.warn('Performance declining');
              setQuality('medium');
            }}
            flipflops={3}
            averages={2}
            factor={0.5}
          />
        )} */}
      </Canvas>
    </div>
  );
}