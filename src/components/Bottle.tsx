// components/Bottle.tsx - FBX with KTX2 leather textures (production-ready)
"use client";

import React, {
  useMemo,
  useLayoutEffect,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
  useEffect,
  memo,
} from "react";
import { useThree, useLoader } from "@react-three/fiber";
import {
  useFBX,
  useTexture,
  MeshTransmissionMaterial,
} from "@react-three/drei";
import * as THREE from "three";
import { KTX2Loader } from "three/examples/jsm/loaders/KTX2Loader.js";

/* ---- Constants ---- */
const CAP_BLACK_INDEX = 1;
const CAP_GOLD_INDEX = 0;
const CAP_LEATHER_INDEX = 2;
const GOLD_HEX = "#FFD54A";

/* ---- Optional caches ---- */
const textureCache = new Map<string, THREE.Texture>();
const geometryCache = new Map<string, THREE.BufferGeometry>();
const materialCache = new Map<string, THREE.Material>();

/* ---- Local types for initial pose ---- */
type Vec3 = [number, number, number];
type Transform = { position: Vec3; rotation: Vec3; scale: number | Vec3 };
type InitialPose = { bottle?: Transform; cap?: Transform };

/* ---- Helper: filter by normal ---- */
function filterGeometryByNormal(
  source: THREE.BufferGeometry,
  dir: THREE.Vector3,
  cosThreshold = Math.cos((28 * Math.PI) / 180)
) {
  const nonIndexed = source.index ? source.toNonIndexed() : source.clone();
  const pos = nonIndexed.getAttribute("position") as THREE.BufferAttribute;
  const nrm = nonIndexed.getAttribute("normal") as
    | THREE.BufferAttribute
    | undefined;

  const triCount = pos.count / 3;
  const kept: number[] = [];

  const a = new THREE.Vector3(),
    b = new THREE.Vector3(),
    c = new THREE.Vector3(),
    ab = new THREE.Vector3(),
    ac = new THREE.Vector3(),
    n = new THREE.Vector3();

  for (let i = 0; i < triCount; i++) {
    const i0 = i * 3 + 0;
    const i1 = i * 3 + 1;
    const i2 = i * 3 + 2;

    a.fromBufferAttribute(pos, i0);
    b.fromBufferAttribute(pos, i1);
    c.fromBufferAttribute(pos, i2);

    if (nrm) {
      n.set(0, 0, 0)
        .add(new THREE.Vector3().fromBufferAttribute(nrm, i0))
        .add(new THREE.Vector3().fromBufferAttribute(nrm, i1))
        .add(new THREE.Vector3().fromBufferAttribute(nrm, i2))
        .normalize();
    } else {
      ab.subVectors(b, a);
      ac.subVectors(c, a);
      n.copy(ab).cross(ac).normalize();
    }

    if (n.dot(dir) >= cosThreshold) kept.push(i0, i1, i2);
  }

  const out = new THREE.BufferGeometry();
  const copySubset = (name: string) => {
    const attr = nonIndexed.getAttribute(name) as
      | THREE.BufferAttribute
      | undefined;
    if (!attr) return;
    const itemSize = attr.itemSize;
    const array = new Float32Array(kept.length * itemSize);
    for (let i = 0; i < kept.length; i++) {
      const src = kept[i];
      for (let k = 0; k < itemSize; k++) {
        array[i * itemSize + k] = (attr.array as any)[src * itemSize + k];
      }
    }
    out.setAttribute(name, new THREE.BufferAttribute(array, itemSize));
  };
  copySubset("position");
  copySubset("normal");
  copySubset("uv");
  return out;
}

/* ---- KTX2 Leather Material ---- */
function useLeatherMatKTX2() {
  const { gl } = useThree();

  const [albedo, normal, roughness] = useLoader(
    KTX2Loader as any,
    [
      "/textures/leather_albedo1.ktx2",
      "/textures/leather_normal.ktx2",
      "/textures/leather-roughness.ktx2",
    ],
    (loader: KTX2Loader) => {
      loader.setTranscoderPath("/basis/").detectSupport(gl);
    }
  ) as [
    THREE.CompressedTexture,
    THREE.CompressedTexture,
    THREE.CompressedTexture
  ];

  if (albedo) albedo.colorSpace = THREE.SRGBColorSpace;
  if (normal) normal.colorSpace = THREE.LinearSRGBColorSpace;
  if (roughness) roughness.colorSpace = THREE.LinearSRGBColorSpace;

  const maxAniso = gl.capabilities.getMaxAnisotropy?.() ?? 16;
  [albedo, normal, roughness].forEach((t) => {
    if (!t) return;
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(0.22, 0.22);
    t.anisotropy = Math.min(16, maxAniso);
    t.needsUpdate = true;
  });

  return useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#1a1a1a",
        map: albedo ?? null,
        roughnessMap: roughness ?? null,
        bumpMap: normal ?? null,
        bumpScale: 2,
        metalness: 0.12,
        roughness: 0.55,
        clearcoat: 0.0,
        clearcoatRoughness: 0.0,
        envMapIntensity: 1.0,
        normalScale: new THREE.Vector2(1, 1),
        polygonOffset: true,
        polygonOffsetFactor: 1,
        polygonOffsetUnits: 1,
      }),
    [albedo, normal, roughness]
  );
}

/* ---- Emboss textures ---- */
function useEmbossTextures() {
  const one = useTexture("/textures/one.png") as THREE.Texture;
  const colon = useTexture("/textures/colon.png") as THREE.Texture;
  const nine = useTexture("/textures/nine.png") as THREE.Texture;

  [one, colon, nine].forEach((t) => {
    t.colorSpace = THREE.LinearSRGBColorSpace;
    t.flipY = false;
  });

  const textures = useMemo(() => {
    const createSingleCharTexture = (charTex: THREE.Texture) => {
      const W = 512;
      const H = 412;
      const canvas = document.createElement("canvas");
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, W, H);

      const img =
        (charTex.image as HTMLImageElement) ||
        (charTex.source?.data as
          | HTMLImageElement
          | HTMLCanvasElement
          | ImageBitmap);
      if (img) {
        const charSize = Math.min(W, H) * 0.3;
        const x = (W - charSize) / 2;
        const y = (H - charSize) / 2;
        ctx.drawImage(img as any, x, y, charSize, charSize);
      }

      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.LinearSRGBColorSpace;
      tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.generateMipmaps = false;
      tex.needsUpdate = true;
      return tex;
    };

    return {
      oneTexture: createSingleCharTexture(one),
      colonTexture: createSingleCharTexture(colon),
      nineTexture: createSingleCharTexture(nine),
    };
  }, [one, colon, nine]);

  return textures;
}

/* ---- Gold emboss materials ---- */
function useGoldEmbossMaterials(
  textures: ReturnType<typeof useEmbossTextures> | null
) {
  return useMemo(() => {
    if (!textures) return null;

    const createEmbossMaterial = (texture: THREE.Texture) => {
      const material = new THREE.MeshPhysicalMaterial({
        color: GOLD_HEX,
        metalness: 0.9,
        roughness: 0.2,
        clearcoat: 0.5,
        clearcoatRoughness: 0.1,
        envMapIntensity: 1.5,
        alphaMap: texture,
        transparent: true,
        alphaTest: 0.05,
        side: THREE.DoubleSide,
      });
      material.bumpMap = texture;
      material.bumpScale = 8;
      return material;
    };

    return {
      oneMaterial: createEmbossMaterial(textures.oneTexture),
      colonMaterial: createEmbossMaterial(textures.colonTexture),
      nineMaterial: createEmbossMaterial(textures.nineTexture),
    };
  }, [textures]);
}

/* ---- Types ---- */
export interface Bottle3DRef {
  bottleGroup: THREE.Group | null;
  capGroup: THREE.Group | null;
  setBottleRotation: (rotation: THREE.Euler) => void;
  setCapRotation: (rotation: THREE.Euler) => void;
  setBottlePosition: (position: THREE.Vector3) => void;
  setCapPosition: (position: THREE.Vector3) => void;
}

interface Bottle3DProps {
  /** keep wrapper neutral — the rig controls inner groups */
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
  enableAnimation?: boolean;
  deviceType?: "mobile" | "tablet" | "desktop";
  adaptiveQuality?: boolean;
  /** apply before first paint to avoid flash */
  initialPose?: InitialPose;
  /** notify when FBX is processed and groups are ready (after initial pose applied) */
  onReady?: () => void;
}

type FaceKey = "f1" | "f3" | "f6";

/* ---- Small helper ---- */
function applyTransformImmediate(
  g: THREE.Group | null | undefined,
  t?: Transform
) {
  if (!g || !t) return;
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

/* ---- Component ---- */
const Bottle3D = forwardRef<Bottle3DRef, Bottle3DProps>(
  (
    {
      position,
      rotation,
      scale,
      enableAnimation = false,
      deviceType = "desktop",
      adaptiveQuality = true,
      initialPose,
      onReady,
    },
    ref
  ) => {
    const fbx = useFBX("/models/bottle.fbx");
    const leatherMat = useLeatherMatKTX2();
    const embossTextures = useEmbossTextures();
    const embossMaterials = useGoldEmbossMaterials(embossTextures);

    const bottleGroupRef = useRef<THREE.Group>(null);
    const capGroupRef = useRef<THREE.Group>(null);

    // Hide groups until initial pose is applied to prevent any flash
    const [posed, setPosed] = useState(false);

    const { goldMat, blackMat } = useMemo(() => {
      const goldMat = new THREE.MeshPhysicalMaterial({
        color: GOLD_HEX,
        metalness: 1,
        roughness: 0.03,
        clearcoat: 1,
        clearcoatRoughness: 0.02,
        envMapIntensity: 2.0,
      });
      const blackMat = new THREE.MeshPhysicalMaterial({
        color: "#000000",
        metalness: 1,
        roughness: 0.05,
        clearcoat: 1,
        clearcoatRoughness: 0.02,
        envMapIntensity: 2.0,
      });
      return { goldMat, blackMat };
    }, []);

    const [bottleMeshes, setBottleMeshes] =
      useState<
        {
          mesh: THREE.Mesh;
          faces: Partial<Record<FaceKey, THREE.BufferGeometry>>;
        }[]
      >();
    const [capMeshData, setCapMeshData] = useState<
      Array<{
        geometry: THREE.BufferGeometry;
        material: THREE.Material | THREE.Material[];
        position: THREE.Vector3;
        rotation: THREE.Euler;
        scale: THREE.Vector3;
        name: string;
      }>
    >([]);

    // Process FBX (materials split etc.)
    useLayoutEffect(() => {
      const bodies: THREE.Mesh[] = [];
      const capData: Array<{
        geometry: THREE.BufferGeometry;
        material: THREE.Material | THREE.Material[];
        position: THREE.Vector3;
        rotation: THREE.Euler;
        scale: THREE.Vector3;
        name: string;
      }> = [];

      fbx.traverse((o) => {
        if (!(o as any).isMesh) return;
        const m = o as THREE.Mesh<
          THREE.BufferGeometry,
          THREE.Material | THREE.Material[]
        >;
        m.castShadow = m.receiveShadow = true;

        const name = (m.name || "").toLowerCase();

        if (name.includes("spray")) {
          m.material = blackMat;
          m.visible = true;
          return;
        }

        if (
          name.includes("glass") ||
          name.includes("bottle") ||
          name.includes("body")
        ) {
          bodies.push(m);
          m.visible = false;
          return;
        }

        if (name.includes("cap") || name.includes("lid")) {
          const isLeatherOval = /(oval|circle_2|leather)/i.test(name);
          if (isLeatherOval) {
            m.material = leatherMat;
          } else if (Array.isArray(m.material)) {
            const slots = m.material as THREE.Material[];
            m.material = slots.map((slot, i) => {
              if (i === CAP_BLACK_INDEX) return blackMat;
              if (i === CAP_GOLD_INDEX) return goldMat;
              if (i === CAP_LEATHER_INDEX) return leatherMat;
              return slot;
            });
          } else {
            m.material = goldMat;
          }

          // capData.push({
          //   geometry: m.geometry.clone(),
          //   material: m.material,
          //   position: m.position.clone(),
          //   rotation: m.rotation.clone(),
          //   scale: m.scale.clone(),
          //   name: m.name,
          // });

          // m.visible = false;
          // return;
          // 1) Ensure world matrices are up to date
          m.updateWorldMatrix(true, false);
          fbx.updateWorldMatrix(true, false);

          // 2) Bake the mesh's full transform relative to the FBX root into the geometry
          const baked = m.geometry.clone();
          const rootInv = new THREE.Matrix4().copy(fbx.matrixWorld).invert();
          const meshToRoot = new THREE.Matrix4()
            .copy(m.matrixWorld)
            .premultiply(rootInv);
          baked.applyMatrix4(meshToRoot);

          // 3) After baking, the mesh itself can be identity TRS (all zeros / ones)
          capData.push({
            geometry: baked,
            material: m.material,
            position: new THREE.Vector3(0, 0, 0),
            rotation: new THREE.Euler(0, 0, 0),
            scale: new THREE.Vector3(1, 1, 1),
            name: m.name,
          });

          // Hide the original cap mesh in the FBX
          m.visible = false;
          return;
        }
      });

      const y = new THREE.Vector3(0, 1, 0);
      const makeDir = (angleRad: number) =>
        new THREE.Vector3(0, 0, 1).applyAxisAngle(y, angleRad).normalize();

      const built = bodies.map((mesh) => {
        const g = mesh.geometry;
        const faces: Partial<Record<FaceKey, THREE.BufferGeometry>> = {
          f1: filterGeometryByNormal(g, new THREE.Vector3(0, -1, 0)),
          f3: filterGeometryByNormal(g, new THREE.Vector3(-0.7, -0.7, 0)),
          f6: filterGeometryByNormal(g, makeDir((6 * Math.PI) / 4)),
        };
        return { mesh, faces };
      });

      setBottleMeshes(built);
      setCapMeshData(capData);
    }, [fbx, blackMat, goldMat, leatherMat]);

    // Apply initial pose BEFORE first paint & then reveal
    useLayoutEffect(() => {
      if (posed) return;
      const bottle = bottleGroupRef.current;
      const cap = capGroupRef.current;
      if (!bottle || !cap) return;

      // apply synchronously to avoid any flash of default FBX transforms
      applyTransformImmediate(bottle, initialPose?.bottle);
      applyTransformImmediate(cap, initialPose?.cap);

      setPosed(true); // reveal on next commit
    }, [initialPose, posed]);

    // Let parent control the groups
    useImperativeHandle(ref, () => ({
      bottleGroup: bottleGroupRef.current,
      capGroup: capGroupRef.current,
      setBottleRotation: (r: THREE.Euler) =>
        bottleGroupRef.current?.rotation.copy(r),
      setCapRotation: (r: THREE.Euler) => capGroupRef.current?.rotation.copy(r),
      setBottlePosition: (p: THREE.Vector3) =>
        bottleGroupRef.current?.position.copy(p),
      setCapPosition: (p: THREE.Vector3) =>
        capGroupRef.current?.position.copy(p),
    }));

    // Notify when ready AFTER initial pose was applied & groups exist
    const notified = useRef(false);
    useEffect(() => {
      if (notified.current) return;
      if (posed && bottleGroupRef.current && capGroupRef.current) {
        notified.current = true;
        onReady?.();
      }
    }, [posed, onReady]);

    // Cleanup on unmount
    useEffect(() => {
      return () => {
        bottleMeshes?.forEach(({ faces }) => {
          Object.values(faces).forEach((geom) => {
            if (geom && !geometryCache.has(geom.uuid)) geom.dispose();
          });
        });
        capMeshData.forEach((cap) => {
          if (!geometryCache.has(cap.geometry.uuid)) cap.geometry.dispose();
        });
      };
    }, [bottleMeshes, capMeshData]);

    return (
      <group position={position} rotation={rotation} scale={scale}>
        {/* Bottle Group (hidden until posed) */}
        <group ref={bottleGroupRef} visible={posed}>
          <primitive object={fbx} />
          {bottleMeshes?.map(({ mesh }, i) => (
            <mesh
              key={`body-${i}`}
              geometry={mesh.geometry}
              position={mesh.position}
              rotation={mesh.rotation}
              scale={mesh.scale}
              castShadow
              receiveShadow
            >
              <MeshTransmissionMaterial
                color="#ffffff"
                transmission={1}
                ior={1.5}
                thickness={7}
                roughness={0.0}
                clearcoat={0.7}
                clearcoatRoughness={0.5}
                envMapIntensity={1.5}
                reflectivity={0.0}
                side={THREE.DoubleSide}
                transparent
                opacity={0.95}
                backside
                backsideThickness={1}
                distortion={0.0}
                distortionScale={0.0}
                chromaticAberration={0.0}
                temporalDistortion={0.0}
                depthWrite={false}
              />
            </mesh>
          ))}

          {bottleMeshes &&
            embossMaterials &&
            bottleMeshes.map(({ mesh, faces }, idx) => (
              <group
                key={`faces-${idx}`}
                position={mesh.position}
                rotation={mesh.rotation}
                scale={mesh.scale}
              >
                {faces.f1 && (
                  <mesh
                    geometry={faces.f1}
                    material={embossMaterials.nineMaterial}
                    renderOrder={5}
                    frustumCulled={false}
                  />
                )}
                {faces.f3 && (
                  <mesh
                    geometry={faces.f3}
                    material={embossMaterials.colonMaterial}
                    renderOrder={5}
                    frustumCulled={false}
                  />
                )}
                {faces.f6 && (
                  <mesh
                    geometry={faces.f6}
                    material={embossMaterials.oneMaterial}
                    renderOrder={5}
                    frustumCulled={false}
                  />
                )}
              </group>
            ))}
        </group>

        {/* Cap Group (hidden until posed) */}
        <group ref={capGroupRef} visible={posed}>
          {capMeshData.map((cap, i) => (
            <mesh
              key={`cap-${i}-${cap.name}`}
              geometry={cap.geometry}
              material={cap.material}
              position={cap.position}
              rotation={cap.rotation}
              scale={cap.scale}
              visible
              castShadow
              receiveShadow
            />
          ))}
        </group>
      </group>
    );
  }
);

Bottle3D.displayName = "Bottle3D";
export default memo(Bottle3D);

// Preload the FBX
useFBX.preload("/models/bottle.fbx");

// Optional: cleanup caches on tab close
if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    textureCache.forEach((t) => t.dispose());
    textureCache.clear();
    geometryCache.forEach((g) => g.dispose());
    geometryCache.clear();
    materialCache.forEach((m) => m.dispose());
    materialCache.clear();
  });
}
