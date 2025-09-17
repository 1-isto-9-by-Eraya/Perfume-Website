"use client";

import React, { useMemo, useLayoutEffect, useRef } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function BackgroundPlane({
  url = "/images/landing-background.png",
  containerRef,
  depthZ = -120,
  rotationX = -0.5,
  rotationY = 0.55,
  rotationZ = 0.27,
}: {
  url?: string;
  containerRef: React.RefObject<HTMLDivElement>;
  depthZ?: number;
  rotationX?: number;
  rotationY?: number;
  rotationZ?: number;
}) {
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const { camera, viewport } = useThree();

  const texture = useTexture(url);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

  // Use fixed size instead of viewport-dependent size
  const { planeW, planeH } = useMemo(() => {
    // Fixed size that looks good at your specific depth and rotation
    return { planeW: 300, planeH: 200 }; // Adjust these values as needed
  }, []);

  // Move plane up and out of screen
  useLayoutEffect(() => {
    if (!containerRef.current || !meshRef.current) return;

    const st = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "+=100%",
      scrub: true,
      onUpdate: (self) => {
        if (meshRef.current) {
          // Move straight up - adjust the multiplier to control how far it goes
          meshRef.current.position.y = -70 + self.progress * 300; // Increased to 300 to go further up
        }
      },
    });

    return () => st.kill();
  }, [containerRef]);

  return (
    <mesh 
      ref={meshRef}
      position={[-80, -70, depthZ]} 
      rotation={[rotationX, rotationY, rotationZ]}
      renderOrder={-10}
    >
      <planeGeometry args={[planeW, planeH]} />
      <meshBasicMaterial
        ref={materialRef}
        map={texture}
        transparent
        opacity={1}
        toneMapped={false}
        depthWrite={true}
      />
    </mesh>
  );
}
