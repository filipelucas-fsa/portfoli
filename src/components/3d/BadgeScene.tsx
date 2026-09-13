import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Environment, Lightformer, useProgress } from "@react-three/drei";
import { preloaderStore } from "@/lib/preloaderStore";
import BadgeRig from "./BadgeRig";

interface BadgeSceneProps {
  photoUrl: string;
  name: string;
  role: string;
}

/**
 * Bridges the R3F asset loader (photo texture, etc.) into the global
 * preloader progress. The 3D engine itself is already up when this mounts,
 * so we start the remaining portion from 45%.
 */
function LoadProgressBridge() {
  const { progress } = useProgress();
  useEffect(() => {
    if (progress > 0) preloaderStore.setProgress(45 + progress * 0.55);
  }, [progress]);
  return null;
}

/**
 * Lives inside the inner Suspense boundary, so it only mounts after the
 * texture, physics (rapier WASM) and environment have all resolved.
 */
function SceneReady() {
  useEffect(() => {
    const waitFonts =
      "fonts" in document
        ? document.fonts.ready.then(
            () => new Promise<void>((r) => window.setTimeout(r, 120)),
          )
        : Promise.resolve();
    waitFonts.then(() => {
      preloaderStore.setProgress(100);
      preloaderStore.finish();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

export default function BadgeScene({ photoUrl, name, role }: BadgeSceneProps) {
  const [isMobile, setIsMobile] = useState<boolean>(() => window.innerWidth < 768);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    preloaderStore.setProgress(45);
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 0.75, 7.6], fov: 30 }}
      dpr={[1, isMobile ? 1.5 : 1.75]}
      gl={{ antialias: true, alpha: true }}
      style={{ position: "absolute", inset: 0 }}
    >
      <ambientLight intensity={0.9} />
      <directionalLight position={[2.5, 3, 2]} intensity={2} color="#ffffff" />
      <pointLight position={[-2, -1, 2]} intensity={0.8} color="#ffffff" />
      <pointLight position={[1.5, 1.5, -2]} intensity={0.6} color="#ffffff" />

      <LoadProgressBridge />

      <Suspense fallback={null}>
        {/* Full render signal — fires only when everything needed by the badge
            has loaded */}
        <SceneReady />

        {/* Fully synthetic, self-contained environment (no external HDR fetch) -
            gives the clearcoat material soft reflections without a network dependency. */}
        <Environment resolution={64}>
          <Lightformer intensity={3} color="#ffffff" position={[0, 2, -4]} scale={[8, 4, 1]} />
          <Lightformer intensity={1.5} color="#e6e6ee" position={[-4, 0, 2]} scale={[4, 3, 1]} rotation-y={Math.PI / 3} />
          <Lightformer intensity={1.2} color="#ffffff" position={[4, 1, 3]} scale={[3, 3, 1]} rotation-y={-Math.PI / 3} />
        </Environment>
        <Physics gravity={[0, -13, 0]} timeStep={isMobile ? 1 / 30 : 1 / 60}>
          <BadgeRig photoUrl={photoUrl} name={name} role={role} isMobile={isMobile} />
        </Physics>
      </Suspense>
    </Canvas>
  );
}
