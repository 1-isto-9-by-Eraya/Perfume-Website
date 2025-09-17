"use client";

import React, { Suspense, useMemo, useLayoutEffect, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  Lightformer,
  useGLTF,
  useTexture,
  MeshTransmissionMaterial,
} from "@react-three/drei";
import * as THREE from "three";
import { JSX } from "react/jsx-runtime";

const CAP_BLACK_INDEX = 1;
const CAP_GOLD_INDEX  = 0;
const CAP_LEATHER_INDEX = 2;
const GOLD_HEX = "#FFD54A";

/* ---------- filter by face normal (expects geometry already in the space you compare) ---------- */
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
  const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3();
  const ab = new THREE.Vector3(), ac = new THREE.Vector3(), n = new THREE.Vector3();

  for (let i = 0; i < triCount; i++) {
    const i0 = i * 3, i1 = i * 3 + 1, i2 = i * 3 + 2;
    a.fromBufferAttribute(pos, i0);
    b.fromBufferAttribute(pos, i1);
    c.fromBufferAttribute(pos, i2);
    if (nrm) {
      n.set(0,0,0)
       .add(new THREE.Vector3().fromBufferAttribute(nrm, i0))
       .add(new THREE.Vector3().fromBufferAttribute(nrm, i1))
       .add(new THREE.Vector3().fromBufferAttribute(nrm, i2))
       .normalize();
    } else {
      ab.subVectors(b, a); ac.subVectors(c, a); n.copy(ab).cross(ac).normalize();
    }
    if (n.dot(dir) >= cosThreshold) kept.push(i0, i1, i2);
  }

  const out = new THREE.BufferGeometry();
  const copySubset = (name: string) => {
    const attr = nonIndexed.getAttribute(name) as THREE.BufferAttribute | undefined;
    if (!attr) return;
    const arr = new Float32Array(kept.length * attr.itemSize);
    for (let i = 0; i < kept.length; i++) {
      const src = kept[i];
      for (let k = 0; k < attr.itemSize; k++) {
        arr[i * attr.itemSize + k] = (attr.array as any)[src * attr.itemSize + k];
      }
    }
    out.setAttribute(name, new THREE.BufferAttribute(arr, attr.itemSize));
  };
  copySubset("position"); copySubset("normal"); copySubset("uv");
  return out;
}

/* ---------- leather (cap inlay) ---------- */
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
  [tex.map, tex.normalMap, tex.roughnessMap].forEach(t => {
    if (!t) return;
    t.flipY = false; t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(0.3, 0.3); t.anisotropy = Math.min(8, maxAniso); t.needsUpdate = true;
  });

  return useMemo(() => new THREE.MeshPhysicalMaterial({
    color: "#1a1a1a",
    map: tex.map ?? null,
    normalMap: tex.normalMap ?? null,
    roughnessMap: tex.roughnessMap ?? null,
    metalness: 0.2, roughness: 0.35,
    clearcoat: 0.15, clearcoatRoughness: 0.4,
    envMapIntensity: 1.2,
    normalScale: new THREE.Vector2(3,3),
  }), [tex.map, tex.normalMap, tex.roughnessMap]);
}

/* ---------- emboss textures & materials ---------- */
function useEmbossTextures() {
  const one = useTexture("/textures/one.png") as THREE.Texture;
  const colon = useTexture("/textures/colon.png") as THREE.Texture;
  const nine = useTexture("/textures/nine.png") as THREE.Texture;
  [one, colon, nine].forEach(t => { t.colorSpace = THREE.LinearSRGBColorSpace; t.flipY = false; });

  return useMemo(() => {
    const make = (src: THREE.Texture) => {
      const W = 512, H = 412;
      const cvs = document.createElement("canvas"); cvs.width=W; cvs.height=H;
      const ctx = cvs.getContext("2d")!; ctx.fillStyle = "black"; ctx.fillRect(0,0,W,H);
      const img = (src.image as HTMLImageElement) || (src.source?.data as any);
      if (img) {
        const s = Math.min(W,H)*0.3; ctx.drawImage(img, (W-s)/2, (H-s)/2, s, s);
      }
      const tex = new THREE.CanvasTexture(cvs);
      tex.colorSpace = THREE.LinearSRGBColorSpace;
      tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
      tex.minFilter = THREE.LinearFilter; tex.magFilter = THREE.LinearFilter;
      return tex;
    };
    return { oneTexture: make(one), colonTexture: make(colon), nineTexture: make(nine) };
  }, [one, colon, nine]);
}

function useGoldEmbossMaterials(textures: null | {
  oneTexture: THREE.Texture; colonTexture: THREE.Texture; nineTexture: THREE.Texture;
}) {
  return useMemo(() => {
    if (!textures) return null;
    const mk = (alpha: THREE.Texture) => {
      const m = new THREE.MeshPhysicalMaterial({
        color: GOLD_HEX, metalness: 0.9, roughness: 0.2,
        clearcoat: 0.5, clearcoatRoughness: 0.1, envMapIntensity: 1.5,
        alphaMap: alpha, transparent: true, alphaTest: 0.05,
        reflectivity: 0.005, side: THREE.DoubleSide,
      });
      m.bumpMap = alpha; m.bumpScale = 8;
      return m;
    };
    return {
      oneMaterial: mk(textures.oneTexture),
      colonMaterial: mk(textures.colonTexture),
      nineMaterial: mk(textures.nineTexture),
    };
  }, [textures]);
}

type FaceKey = "f1" | "f3" | "f6";

function GLBModel(props: JSX.IntrinsicElements["group"]) {
  const { scene } = useGLTF("/models/bottle1.glb") as unknown as { scene: THREE.Group };

  const leatherMat = useLeatherMat();
  const embossTextures = useEmbossTextures();
  const embossMaterials = useGoldEmbossMaterials(embossTextures);

  const { goldMat, blackMat } = useMemo(() => ({
    goldMat: new THREE.MeshPhysicalMaterial({
      color: GOLD_HEX, metalness: 1, roughness: 0.03, clearcoat: 1,
      clearcoatRoughness: 0.02, envMapIntensity: 2.0,
    }),
    blackMat: new THREE.MeshPhysicalMaterial({
      color: "#0a0a0a", metalness: 1, roughness: 0.05, clearcoat: 1,
      clearcoatRoughness: 0.02, envMapIntensity: 2.0,
    })
  }), []);

  const [bodyCopies, setBodyCopies] = useState<Array<{ geometry: THREE.BufferGeometry; matrix: THREE.Matrix4 }>>([]);
  const [embossWorld, setEmbossWorld] = useState<Array<{ faces: Partial<Record<FaceKey, THREE.BufferGeometry>> }>>([]);

  useLayoutEffect(() => {
    if (!scene) return;

    const meshes: THREE.Mesh[] = [];
    scene.traverse(o => { if ((o as any).isMesh) meshes.push(o as THREE.Mesh); });

    // Helpful log to see names/materials in your console:
    meshes.forEach(m => console.log("GLB mesh:", m.name, "mats:", Array.isArray(m.material) ? (m.material as THREE.Material[]).length : 1));

    const isCapLike    = (n: string) => /cap|lid|cover|top/i.test(n);
    const isNozzleLike = (n: string) => /spray|nozzle|pump/i.test(n);
    const isBodyLike   = (n: string) => /glass|bottle|body|shell|outer|cube|main/i.test(n);

    // 1) Apply cap materials (by slot if present, else fallback by name)
    for (const m of meshes) {
      const name = (m.name || "").toLowerCase();
      if (isCapLike(name)) {
        if (Array.isArray(m.material)) {
          m.material = (m.material as THREE.Material[]).map((slot, i) => {
            if (i === CAP_BLACK_INDEX)  return blackMat;
            if (i === CAP_GOLD_INDEX)   return goldMat;
            if (i === CAP_LEATHER_INDEX) return leatherMat;
            return slot;
          });
        } else {
          const matName = ((m.material as any)?.name || "").toLowerCase();
          if (/leather/.test(matName))      m.material = leatherMat;
          else if (/gold/.test(matName))    m.material = goldMat;
          else                               m.material = goldMat;
        }
      }
    }

    // 2) Choose body candidates robustly (ignore cap/nozzle; prefer biggest meshes)
    const candidates = meshes.filter(m => !isCapLike(m.name.toLowerCase()) && !isNozzleLike(m.name.toLowerCase()));
    const scored = candidates.map(m => {
      const bb = new THREE.Box3().setFromObject(m);
      const size = new THREE.Vector3(); bb.getSize(size);
      const vol = size.x * size.y * size.z;
      const tris = (m.geometry?.attributes?.position?.count ?? 0) / 3;
      return { m, vol, tris, name: m.name.toLowerCase(), isBodyName: isBodyLike(m.name.toLowerCase()) };
    });

    scored.sort((a,b) => (b.isBodyName ? 1 : 0) - (a.isBodyName ? 1 : 0) || b.tris - a.tris || b.vol - a.vol);
    const bodies = scored.slice(0, 2).map(s => s.m); // take top 1–2 meshes as the bottle shell(s)

    // hide originals (we'll render our transmission copies)
    bodies.forEach(b => { b.visible = false; });

    // 3) Save world-space copies + world-space face slices
    const copies: Array<{ geometry: THREE.BufferGeometry; matrix: THREE.Matrix4 }> = [];
    const worldFaces: Array<{ faces: Partial<Record<FaceKey, THREE.BufferGeometry>> }> = [];

    const y = new THREE.Vector3(0, 1, 0);
    const makeDir = (angleRad: number) =>
      new THREE.Vector3(0, 0, 1).applyAxisAngle(y, angleRad).normalize();

    for (const b of bodies) {
      b.updateWorldMatrix(true, false);

      // transmission copy (use world matrix when rendering)
      copies.push({ geometry: b.geometry, matrix: b.matrixWorld.clone() });

      // face extraction in WORLD space so parent transforms don’t matter
      const worldGeom = b.geometry.clone();
      worldGeom.applyMatrix4(b.matrixWorld);

      const faces: Partial<Record<FaceKey, THREE.BufferGeometry>> = {
        f1: filterGeometryByNormal(worldGeom, new THREE.Vector3(0, -1, 0)),
        f3: filterGeometryByNormal(worldGeom, new THREE.Vector3(-0.7, -0.7, 0)),
        f6: filterGeometryByNormal(worldGeom, makeDir((6 * Math.PI) / 4)),
      };
      worldFaces.push({ faces });
    }

    setBodyCopies(copies);
    setEmbossWorld(worldFaces);
  }, [scene, goldMat, blackMat, leatherMat]);

  return (
    <group {...props} /* GLB is in meters */ scale={1}>
      {/* Original GLB (with some parts hidden above) */}
      <primitive object={scene} />

      {/* Transmission shells: render with world matrices to match GLB hierarchy exactly */}
      {bodyCopies.map((c, i) => (
        <mesh key={`body-${i}`} geometry={c.geometry} matrixAutoUpdate={false} matrix={c.matrix}>
          <MeshTransmissionMaterial
            color="#ffffff" transmission={1} ior={1.5} thickness={7}
            roughness={0.0} clearcoat={0.7} clearcoatRoughness={0.5}
            envMapIntensity={1.5} reflectivity={0.0}
            distortion={0.0} distortionScale={0.0} chromaticAberration={0.0} temporalDistortion={0.0}
            side={THREE.DoubleSide} backside backsideThickness={1} backsideIOR={1.5}
            transparent opacity={0.95} depthWrite={false}
          />
        </mesh>
      ))}

      {/* Emboss meshes: world-space geometries so they align regardless of parents */}
      {embossMaterials && embossWorld.map(({ faces }, idx) => (
        <group key={`faces-${idx}`}>
          {faces.f1 && (
            <mesh geometry={faces.f1} matrixAutoUpdate={false} material={embossMaterials.nineMaterial} renderOrder={5} frustumCulled={false} />
          )}
          {faces.f3 && (
            <mesh geometry={faces.f3} matrixAutoUpdate={false} material={embossMaterials.colonMaterial} renderOrder={5} frustumCulled={false} />
          )}
          {faces.f6 && (
            <mesh geometry={faces.f6} matrixAutoUpdate={false} material={embossMaterials.oneMaterial} renderOrder={5} frustumCulled={false} />
          )}
        </group>
      ))}
    </group>
  );
}

useGLTF.preload("/models/bottle1.glb");

/* ---------- Scene ---------- */
export default function Bottle() {
  return (
    <div className="relative w-full h-[93.2vh] overflow-hidden border bg-black">
      <Canvas
        shadows
        camera={{ position: [2, 1.6, 3], fov: 50 }}
        gl={{ antialias: true, logarithmicDepthBuffer: true }}
        onCreated={({ gl, scene, camera }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.outputColorSpace = THREE.SRGBColorSpace; // sRGB output for proper PBR
          // @ts-expect-error
          gl.physicallyCorrectLights = true;
          scene.background = new THREE.Color("#191919");
          camera.layers.enable(0); camera.layers.enable(1);
        }}
      >
        <ambientLight intensity={0.3} />
        <spotLight position={[-3, 3, 3]} angle={0.4} penumbra={0.7} intensity={1.2} castShadow color="#ffffff" />
        <spotLight position={[3, 3, 3]} angle={0.4} penumbra={0.7} intensity={1.2} castShadow color="#ffffff" />
        <directionalLight position={[0, 4, 2]} intensity={0.8} castShadow color="#ffffff" />

        <Suspense fallback={null}>
          <GLBModel />
          <Environment preset="studio" resolution={1024}>
            <group>
              <Lightformer form="rect" intensity={12} scale={[6, 3, 1]} position={[-6, 3, 2]} rotation={[0, Math.PI * 0.15, 0]} />
              <Lightformer form="rect" intensity={12} scale={[6, 3, 1]} position={[6, 3, 2]} rotation={[0, -Math.PI * 0.15, 0]} />
              <Lightformer form="rect" intensity={4} scale={[5, 1, 1]} position={[0, 7, 0]} rotation={[Math.PI / 2, 0, 0]} />
              <Lightformer form="circle" intensity={4} scale={2} position={[0, 0, 5]} color={GOLD_HEX} />
            </group>
          </Environment>
        </Suspense>

        <OrbitControls enableDamping />
      </Canvas>
    </div>
  );
}
