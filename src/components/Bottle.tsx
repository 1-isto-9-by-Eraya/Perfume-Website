// components/Bottle.tsx - Final merged version with working textures
"use client";

import React, { 
  Suspense, 
  useMemo, 
  useLayoutEffect, 
  useState, 
  useRef, 
  forwardRef, 
  useImperativeHandle,
  useEffect,
  memo
} from "react";
import { useThree } from "@react-three/fiber";
import { useFBX, useTexture, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";

/* ---- Constants ---- */
const CAP_BLACK_INDEX = 1;
const CAP_GOLD_INDEX = 0;
const CAP_LEATHER_INDEX = 2;
const GOLD_HEX = "#FFD54A";

/* ---- Texture Cache ---- */
const textureCache = new Map<string, THREE.Texture>();
const geometryCache = new Map<string, THREE.BufferGeometry>();
const materialCache = new Map<string, THREE.Material>();

/* ---- Helper Functions - FROM WORKING VERSION ---- */
function filterGeometryByNormal(
  source: THREE.BufferGeometry,
  dir: THREE.Vector3,
  cosThreshold = Math.cos((28 * Math.PI) / 180)
) {
  const nonIndexed = source.index ? source.toNonIndexed() : source.clone();
  const pos = nonIndexed.getAttribute("position") as THREE.BufferAttribute;
  const nrm = nonIndexed.getAttribute("normal") as THREE.BufferAttribute | undefined;

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

    if (n.dot(dir) >= cosThreshold) {
      kept.push(i0, i1, i2);
    }
  }

  const out = new THREE.BufferGeometry();

  const copySubset = (name: string) => {
    const attr = nonIndexed.getAttribute(name) as THREE.BufferAttribute | undefined;
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

/* ---- LEATHER MATERIAL - FROM WORKING VERSION ---- */
function useLeatherMat() {
  const { gl } = useThree();
  const maxAniso = gl.capabilities.getMaxAnisotropy?.() ?? 8;

  const tex = useTexture({
    map: "/textures/leather_albedo1.png",
    normalMap: "/textures/leather_normal.jpg",
    roughnessMap: "/textures/leather-roughness.png",
  }) as Record<string, THREE.Texture | undefined>;

  if (tex.map) tex.map.colorSpace = THREE.SRGBColorSpace;
  if (tex.normalMap) tex.normalMap.colorSpace = THREE.LinearSRGBColorSpace;
  if (tex.roughnessMap) tex.roughnessMap.colorSpace = THREE.LinearSRGBColorSpace;

  [tex.map, tex.normalMap, tex.roughnessMap].forEach((t) => {
    if (!t) return;
    t.flipY = false;
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(0.3, 0.3);
    t.anisotropy = Math.min(8, maxAniso);
    t.needsUpdate = true;
  });

  return useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#1a1a1a",
        map: tex.map ?? null,
        normalMap: tex.normalMap ?? null,
        roughnessMap: tex.roughnessMap ?? null,
        metalness: 0.2,
        roughness: 0.35,
        clearcoat: 0.15,
        clearcoatRoughness: 0.4,
        envMapIntensity: 1.2,
        normalScale: new THREE.Vector2(3, 3),
      }),
    [tex.map, tex.normalMap, tex.roughnessMap]
  );
}

/* ---- EMBOSS TEXTURES - FROM WORKING VERSION ---- */
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

      const img = (charTex.image as HTMLImageElement) || 
                  (charTex.source?.data as HTMLImageElement | HTMLCanvasElement | ImageBitmap);
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

/* ---- GOLD EMBOSS MATERIALS - FROM WORKING VERSION ---- */
function useGoldEmbossMaterials(textures: ReturnType<typeof useEmbossTextures> | null) {
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
        reflectivity: 0.005,
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

/* ---- Bottle3D Component ---- */
export interface Bottle3DRef {
  bottleGroup: THREE.Group | null;
  capGroup: THREE.Group | null;
  setBottleRotation: (rotation: THREE.Euler) => void;
  setCapRotation: (rotation: THREE.Euler) => void;
  setBottlePosition: (position: THREE.Vector3) => void;
  setCapPosition: (position: THREE.Vector3) => void;
}

interface Bottle3DProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
  enableAnimation?: boolean;
  deviceType?: 'mobile' | 'tablet' | 'desktop';
  adaptiveQuality?: boolean;
}

type FaceKey = "f1" | "f3" | "f6";

const Bottle3D = forwardRef<Bottle3DRef, Bottle3DProps>(
  ({ 
    position = [0, -2, 0], 
    rotation = [0, Math.PI / 6, 0], 
    scale = 0.01, 
    enableAnimation = false,
    deviceType = 'desktop',
    adaptiveQuality = true
  }, ref) => {
    const fbx = useFBX("/models/bottle.fbx");
    const leatherMat = useLeatherMat();
    const embossTextures = useEmbossTextures();
    const embossMaterials = useGoldEmbossMaterials(embossTextures);

    const bottleGroupRef = useRef<THREE.Group>(null);
    const capGroupRef = useRef<THREE.Group>(null);

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
        color: "#0a0a0a",
        metalness: 1,
        roughness: 0.05,
        clearcoat: 1,
        clearcoatRoughness: 0.02,
        envMapIntensity: 2.0,
      });
      return { goldMat, blackMat };
    }, []);

    const [bottleMeshes, setBottleMeshes] = useState<{
      mesh: THREE.Mesh;
      faces: Partial<Record<FaceKey, THREE.BufferGeometry>>;
    }[]>();

    const [capMeshData, setCapMeshData] = useState<Array<{
      geometry: THREE.BufferGeometry;
      material: THREE.Material | THREE.Material[];
      position: THREE.Vector3;
      rotation: THREE.Euler;
      scale: THREE.Vector3;
      name: string;
    }>>([]);

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
        const m = o as THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]>;
        m.castShadow = m.receiveShadow = true;

        const name = (m.name || "").toLowerCase();

        // Spray parts - stays with bottle body, not cap
        if (name.includes("spray")) {
          m.material = blackMat;
          m.visible = true;
          return;
        }

        // Main glass/body
        if (name.includes("glass") || name.includes("bottle") || name.includes("body")) {
          bodies.push(m);
          m.visible = false;
          return;
        }

        // Cap materials - only actual cap parts
        if (name.includes("cap") || name.includes("lid")) {
          if (Array.isArray(m.material)) {
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
          
          // Store cap data for separate rendering
          capData.push({
            geometry: m.geometry.clone(),
            material: m.material,
            position: m.position.clone(),
            rotation: m.rotation.clone(),
            scale: m.scale.clone(),
            name: m.name
          });
          
          // Hide original cap in FBX
          m.visible = false;
          return;
        }
      });

      // Process bottle meshes for embossing - EXACT FROM WORKING VERSION
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

    // Expose refs and control methods
    useImperativeHandle(ref, () => ({
      bottleGroup: bottleGroupRef.current,
      capGroup: capGroupRef.current,
      setBottleRotation: (rotation: THREE.Euler) => {
        if (bottleGroupRef.current) {
          bottleGroupRef.current.rotation.copy(rotation);
        }
      },
      setCapRotation: (rotation: THREE.Euler) => {
        if (capGroupRef.current) {
          capGroupRef.current.rotation.copy(rotation);
        }
      },
      setBottlePosition: (position: THREE.Vector3) => {
        if (bottleGroupRef.current) {
          bottleGroupRef.current.position.copy(position);
        }
      },
      setCapPosition: (position: THREE.Vector3) => {
        if (capGroupRef.current) {
          capGroupRef.current.position.copy(position);
        }
      },
    }));

    // Cleanup on unmount
    useEffect(() => {
      return () => {
        // Clear caches on unmount for optimization
        bottleMeshes?.forEach(({ faces }) => {
          Object.values(faces).forEach(geom => {
            if (geom && !geometryCache.has(geom.uuid)) {
              geom.dispose();
            }
          });
        });
        
        capMeshData.forEach(cap => {
          if (!geometryCache.has(cap.geometry.uuid)) {
            cap.geometry.dispose();
          }
        });
      };
    }, [bottleMeshes, capMeshData]);

    return (
      <group position={position} rotation={rotation} scale={scale}>
        {/* Bottle Group */}
        <group ref={bottleGroupRef}>
          {/* Original FBX (includes spray nozzle and other non-cap parts) */}
          <primitive object={fbx} />
          
          {/* Transmission body - FIXED: No chromatic aberration */}
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
                distortion={0.0}
                distortionScale={0.0}
                chromaticAberration={0.0}  // FIXED: No rainbow effect
                temporalDistortion={0.0}
                side={THREE.DoubleSide}
                backside={true}
                backsideThickness={1}
                // backsideIOR={1.5}
                transparent={true}
                opacity={0.95}
                depthWrite={false}
              />
            </mesh>
          ))}

          {/* Emboss per-face - EXACT FROM WORKING VERSION */}
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

        {/* Cap Group - Only actual cap parts for independent animation */}
        <group ref={capGroupRef}>
          {capMeshData.map((cap, i) => (
            <mesh
              key={`cap-${i}-${cap.name}`}
              geometry={cap.geometry}
              material={cap.material}
              position={cap.position}
              rotation={cap.rotation}
              scale={cap.scale}
              visible={true}
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

// Cleanup function for module unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    // Clear caches
    textureCache.forEach(texture => texture.dispose());
    textureCache.clear();
    
    geometryCache.forEach(geometry => geometry.dispose());
    geometryCache.clear();
    
    materialCache.forEach(material => material.dispose());
    materialCache.clear();
  });
}