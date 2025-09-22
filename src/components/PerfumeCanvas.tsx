// components/PerfumeCanvas.tsx
"use client";

import React, { Suspense, useEffect, useMemo, useRef, useState, memo } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { Environment, AdaptiveDpr, AdaptiveEvents } from "@react-three/drei";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Bottle3D, { Bottle3DRef } from "@/components/Bottle";

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */
type Device = "mobile" | "tablet" | "desktop";
type Vec3 = [number, number, number];
type Transform = { position: Vec3; rotation: Vec3; scale: number | Vec3 };
type Pose = { bottle: Transform; cap: Transform };
type Poses = Record<Device, Pose>;

export type PerfumeCanvasProps = {
  /** The tall sticky section element that ScrollTrigger should attach to */
  containerRef?: React.RefObject<HTMLDivElement>;
  config?: { enableAnimation?: boolean; scale?: number };
};

/* ------------------------------------------------------------------ */
/* Defaults & helpers                                                 */
/* ------------------------------------------------------------------ */
const detectDevice = (w: number): Device =>
  w < 768 ? "mobile" : w < 1200 ? "tablet" : "desktop";

const DEFAULT_POSES: Poses = {
  mobile: {
    bottle: { position: [0, -2.5, 0], rotation: [0.1, Math.PI * 0.85, 0.02], scale: 0.0056 },
    cap:    { position: [0, -2.5, 0],  rotation: [0.1, Math.PI * 0.85, 0.02], scale: 0.0056 },
  },
  tablet: {
    bottle: { position: [-0.1, -3, 0], rotation: [0.08, Math.PI * 1.05, 0.02], scale: 0.007 },
    cap:    { position: [-0.1, -3, 0], rotation: [0.08, Math.PI * 1.05, 0.02], scale: 0.007 },
  },
  desktop: {
    bottle: { position: [0, -4.4, 0], rotation: [0.05, Math.PI * 1.2, 0.02], scale: 0.0098 },
    cap:    { position: [0, -4.4, 0], rotation: [0.05, Math.PI * 1.2, 0.02], scale: 0.0098 },
  },
};

function applyTransform(g: THREE.Group | null | undefined, t: Transform) {
  if (!g) return;
  const [px, py, pz] = t.position;
  const [rx, ry, rz] = t.rotation;
  g.position.set(px, py, pz);
  g.rotation.set(rx, ry, rz);
  if (Array.isArray(t.scale)) {
    const [sx, sy, sz] = t.scale;
    g.scale.set(sx, sy, sz);
  } else {
    g.scale.setScalar(t.scale);
  }
}

/* ------------------------------------------------------------------ */
/* Scroll driver (separate component so it can mount after ready)     */
/* ------------------------------------------------------------------ */

type ScrollDriverProps = {
  bottleRef: React.RefObject<Bottle3DRef | null>;  // ← allow null
  containerRef?: React.RefObject<HTMLDivElement>;  // ← match parent prop
  device: Device;
  enabled: boolean;
};

const ScrollDriver = memo(function ScrollDriver({
  bottleRef,
  containerRef,
  device,
  enabled,
}: ScrollDriverProps) {
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const stRef = useRef<ScrollTrigger | null>(null);

  useEffect(() => {
    // cleanup any previous instance
    stRef.current?.kill();
    tlRef.current?.kill();
    stRef.current = null;
    tlRef.current = null;

    if (!enabled) return;
    const rig = bottleRef.current;
    if (!rig?.bottleGroup || !rig?.capGroup) return;

    const bottle = rig.bottleGroup;
    const cap = rig.capGroup;

    // Use the provided container as trigger or fallback to document body
    const triggerEl = containerRef?.current ?? document.body;

    if (device === "desktop") {
      // Keep your EXACT desktop sequence (targets are absolute, starting from DEFAULT_POSES)
      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut", overwrite: "auto" },
      });

      const initialY = -4.4;
      const finalX = 0.8;
      const finalY = -0.5;
      const finalScale = 0.006;

      stRef.current = ScrollTrigger.create({
        trigger: triggerEl,
        start: "top top",
        end: "50% top",
        scrub: 1.5,
        invalidateOnRefresh: true,
        animation: tl,
      });

      tl.to([bottle.position, cap.position], { y: initialY + 1, duration: 0.3 }, 0)
        .to([bottle.rotation, cap.rotation], { y: Math.PI / 6, duration: 0.3 }, 0)
        .to(cap.position, { y: initialY + 1.5, x: 0.23, duration: 0.3 }, 0.3)
        .to(cap.rotation, { y: Math.PI * 2, z: 0.35, duration: 0.3 }, 0.3)
        .to(bottle.position, { x: 0, y: 0.3, duration: 0.4 }, 0.6)
        .to(bottle.rotation, { x: 0.3, y: Math.PI * 2.1, z: 0.1, duration: 0.4 }, 0.6)
        .to(bottle.scale, { x: finalScale, y: finalScale, z: finalScale, duration: 0.4 }, 0.6)
        .to(cap.position, { x: finalX, y: 100.5, duration: 0.4 }, 0.6)
        .to(cap.scale, { x: finalScale * 0.9, y: finalScale * 0.9, z: finalScale * 0.9, duration: 0.4 }, 0.6)
        .to(bottle.position, { x: 1.5, y: -1, duration: 0.4 }, 1)
        .to(bottle.rotation, { x: 0.05, z: -0.2, duration: 0.4 }, 1);

      tlRef.current = tl;
    } else if (device === "tablet") {
      // Light scroll tween, relative deltas from DEFAULT_POSES
      const tl = gsap.timeline({
        defaults: { ease: "power1.inOut", overwrite: "auto" },
      });

      stRef.current = ScrollTrigger.create({
        trigger: triggerEl,
        start: "top top",
        end: "40% top",
        scrub: 1.0,
        invalidateOnRefresh: true,
        animation: tl,
      });

      tl.to([bottle.position, cap.position], { y: -2, duration: 0.1 }, 0)
        .to([bottle.rotation, cap.rotation], { y: 0.75, duration: 0.1 }, 0)
        .to(cap.position, { y: 10, x: "+=0.15", duration: 0.1 }, 0.1)
        .to(cap.rotation, { y: Math.PI * 2, z: 0.35, duration: 0.1 }, 0.1)
        .to(bottle.position, { x: 0.5, y: -1, duration: 0.05 }, 0.2)
        .to(bottle.rotation, { y: 0.55, z: -0.24, duration: 0.05 }, 0.2)
        .to(bottle.scale, { x: 0.004, y: 0.004, z: 0.004, duration: 0.05 }, 0.2);

      tlRef.current = tl;
    } else {
      // Mobile: subtle, via ScrollTrigger
      const tl = gsap.timeline({
        defaults: { ease: "power2.out", overwrite: "auto" },
      });

      stRef.current = ScrollTrigger.create({
        trigger: triggerEl,
        start: "top top",
        end: "60% top",
        scrub: 0.8,
        invalidateOnRefresh: true,
        animation: tl,
      });

      tl.to([bottle.position, cap.position], { y: -1.8, duration: 0.1 }, 0)
        .to([bottle.rotation, cap.rotation], { y: Math.PI / 12, duration: 0.1 }, 0)
        .to(cap.position, { y: 10, x: 0.1, duration: 0.1 }, 0.1)
        .to(bottle.position, { x: 0.35, y: -2, duration: 0.05 }, 0.1)
        .to(bottle.rotation, { y: 0.6, z: -0.14, duration: 0.05 }, 0.1)
        .to(bottle.scale, { x: 0.004, y: 0.004, z: 0.004, duration: 0.05 }, 0.1);

      tlRef.current = tl;
    }

    return () => {
      stRef.current?.kill();
      tlRef.current?.kill();
      stRef.current = null;
      tlRef.current = null;
    };
  }, [bottleRef, containerRef, device, enabled]);

  return null;
});

/* ------------------------------------------------------------------ */
/* Canvas host                                                         */
/* ------------------------------------------------------------------ */

export default function PerfumeCanvas({ config, containerRef }: PerfumeCanvasProps) {
  const bottleRef = useRef<Bottle3DRef | null>(null); // ← explicit union with null

  const [device, setDevice] = useState<Device>(
    typeof window === "undefined" ? "desktop" : detectDevice(window.innerWidth)
  );
  const isMobile = device === "mobile";

  // Model lifecycle gating:
  // - ready: Bottle has reported meshes/refs created
  // - shown: becomes true only AFTER we apply DEFAULT_POSES to the rig (prevents first-frame flash)
  const [ready, setReady] = useState(false);
  const [shown, setShown] = useState(false);

  // poses ref so you can tweak later with GSAP without re-renders
  const posesRef = useRef<Poses>({ ...DEFAULT_POSES });

  // Optional runtime uniform scale override
  useEffect(() => {
    if (!config?.scale) return;
    (Object.keys(posesRef.current) as Device[]).forEach((d) => {
      posesRef.current[d].bottle.scale = config.scale!;
      posesRef.current[d].cap.scale = config.scale!;
    });
  }, [config?.scale]);

  // Device watcher
  useEffect(() => {
    let raf = 0;
    const onResize = () => {
      const next = detectDevice(window.innerWidth);
      if (next !== device) setDevice(next);
    };
    const handler = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(onResize);
    };
    window.addEventListener("resize", handler);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", handler);
    };
  }, [device]);

  // First frame: apply DEFAULT_POSES to rig BEFORE showing the model
  const applyDefaultPoseAndShow = () => {
    const rig = bottleRef.current;
    if (!rig?.bottleGroup || !rig?.capGroup) return;
    const p = posesRef.current[device];
    applyTransform(rig.bottleGroup, p.bottle);
    applyTransform(rig.capGroup, p.cap);
    setShown(true); // Reveal only after posing
  };

  // When Bottle notifies it's ready, pose then show
  const handleReady = () => {
    setReady(true);
    applyDefaultPoseAndShow();
  };

  // If device changes later, re-apply the default pose
  useEffect(() => {
    if (!ready) return;
    const rig = bottleRef.current;
    if (!rig?.bottleGroup || !rig?.capGroup) return;
    const p = posesRef.current[device];
    applyTransform(rig.bottleGroup, p.bottle);
    applyTransform(rig.capGroup, p.cap);
  }, [device, ready]);

  /* -------------------- Canvas -------------------- */
  const dpr = useMemo<[number, number]>(() => (isMobile ? [0.9, 1.2] : [1, 2]), [isMobile]);

  return (
    <Canvas
      dpr={dpr}
      shadows={!isMobile}
      frameloop="always" // GSAP/ScrollTrigger-driven; continuous frames
      style={{ background: "transparent" }}
      camera={{ position: [0, 0, 5], fov: isMobile ? 50 : 45, near: 0.1, far: isMobile ? 30 : 50 }}
      gl={{
        alpha: true,
        antialias: !isMobile,
        powerPreference: isMobile ? "default" : "high-performance",
        toneMapping: THREE.NoToneMapping,
        outputColorSpace: THREE.SRGBColorSpace,
        preserveDrawingBuffer: false,
      }}
      onCreated={({ gl, scene }) => {
        scene.background = null;
        gl.setClearAlpha(0);
        if (isMobile) gl.shadowMap.enabled = false;
      }}
    >
      {isMobile && (
        <>
          <AdaptiveDpr pixelated />
          <AdaptiveEvents />
        </>
      )}

      {/* Simple/cheap lighting; env does most of the look */}
      <ambientLight intensity={isMobile ? 0.9 : 0.55} />
      {!isMobile && (
        <>
          <directionalLight position={[0, 5, 3]} intensity={0.7} castShadow />
          <spotLight position={[-4, 4, 4]} angle={0.3} penumbra={0.8} intensity={0.9} castShadow />
          <spotLight position={[4, 4, 4]} angle={0.3} penumbra={0.8} intensity={0.9} castShadow />
        </>
      )}

      <Suspense
        fallback={
          <mesh>
            <boxGeometry args={[0.4, 0.4, 0.4]} />
            <meshBasicMaterial color="#666" />
          </mesh>
        }
      >
        {/* Neutral wrapper — all posing is on Bottle's inner groups */}
        <group visible={shown}>
          <Bottle3D
            ref={bottleRef}
            position={[0, 0, 0]}
            rotation={[0, 0, 0]}
            scale={1}
            onReady={handleReady}
          />
        </group>

        <Environment
          preset={isMobile ? "city" : "studio"}
          background={false}
          resolution={isMobile ? 128 : 256}
        />

        {/* ScrollTrigger animations on top of DEFAULT_POSES */}
        {ready && (
          <ScrollDriver
            bottleRef={bottleRef}
            containerRef={containerRef}
            device={device}
            enabled={Boolean(config?.enableAnimation)}
          />
        )}
      </Suspense>
    </Canvas>
  );
}
