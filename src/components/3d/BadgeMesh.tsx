import { useMemo } from "react";
import { useTexture, RoundedBox } from "@react-three/drei";
import { useCanvasTextTexture } from "./textTexture";

interface BadgeMeshProps {
  photoUrl: string;
  name: string;
  role: string;
  hovered: boolean;
}

const W = 1.3;
const H = 1.8;
const D = 0.04;

export default function BadgeMesh({ photoUrl, name, hovered }: BadgeMeshProps) {
  const photo = useTexture(photoUrl);

  const photoAspectFix = useMemo(() => ({ w: W * 0.82, h: H * 0.52 }), []);

  // name + "DEV" role, stacked - mirrors the original layout at y ~ -0.22H / -0.31H
  const nameTexture = useCanvasTextTexture({
    width: 640,
    height: 220,
    lines: [
      { text: name, y: 0.36, size: 0.34, color: "#eef1f8", weight: 700 },
      { text: "DEV", y: 0.74, size: 0.16, color: "#6c9bff", weight: 600, letterSpaced: true },
    ],
  });

  // "FL." branding, bottom-left corner
  const brandTexture = useCanvasTextTexture({
    width: 200,
    height: 100,
    lines: [{ text: "FL.", y: 0.5, size: 0.6, color: "#3b6fed", weight: 800, align: "left", x: 0.05 }],
  });

  const emissiveIntensity = hovered ? 0.55 : 0.18;

  return (
    <group>
      {/* body */}
      <RoundedBox args={[W, H, D]} radius={0.02} smoothness={4} castShadow receiveShadow>
        <meshPhysicalMaterial
          color="#3a3a42"
          roughness={0.22}
          metalness={0.05}
          clearcoat={1}
          clearcoatRoughness={0.15}
          transmission={0.08}
          thickness={0.4}
          ior={1.4}
          reflectivity={0.5}
        />
      </RoundedBox>

      {/* top hole (lanyard hole) */}
      <mesh position={[0, H / 2 - 0.16, D / 2 + 0.001]}>
        <ringGeometry args={[0.036, 0.056, 24]} />
        <meshBasicMaterial color="#000" toneMapped={false} />
      </mesh>

      {/* photo panel */}
      <mesh position={[0, H * 0.12, D / 2 + 0.006]}>
        <planeGeometry args={[photoAspectFix.w, photoAspectFix.h]} />
        <meshStandardMaterial map={photo} roughness={0.5} metalness={0} />
      </mesh>
      {/* photo frame line */}
      <mesh position={[0, H * 0.12, D / 2 + 0.005]}>
        <planeGeometry args={[photoAspectFix.w + 0.03, photoAspectFix.h + 0.03]} />
        <meshBasicMaterial color="#33333b" toneMapped={false} />
      </mesh>

      {/* name + role */}
      <mesh position={[0, -H * 0.26, D / 2 + 0.007]}>
        <planeGeometry args={[W * 0.85, H * 0.15]} />
        <meshBasicMaterial map={nameTexture} transparent toneMapped={false} />
      </mesh>

      {/* branding corner */}
      <mesh position={[-W / 2 + 0.28, -H / 2 + 0.16, D / 2 + 0.007]}>
        <planeGeometry args={[0.28, 0.14]} />
        <meshBasicMaterial map={brandTexture} transparent toneMapped={false} />
      </mesh>

      {/* subtle rim glow */}
      <mesh position={[0, 0, -D / 2 - 0.002]}>
        <planeGeometry args={[W + 0.02, H + 0.02]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={emissiveIntensity * 0.25}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

export { W as BADGE_WIDTH, H as BADGE_HEIGHT, D as BADGE_DEPTH };
