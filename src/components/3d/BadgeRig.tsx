import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import {
  BallCollider,
  CuboidCollider,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
  type RapierRigidBody,
  type RigidBodyProps,
} from "@react-three/rapier";
import * as THREE from "three";
import BadgeMesh, { BADGE_HEIGHT } from "./BadgeMesh";

const ANCHOR_POS: [number, number, number] = [0, 2.7, 0];
const ROPE_LINK = 0.34;
// anchor + 5 rope links, spaced ROPE_LINK apart vertically
const JOINT_Y = [ANCHOR_POS[1], 2.36, 2.02, 1.68, 1.34, 1.0];
const CARD_START: [number, number, number] = [0, 0.05, 0];
const MAX_ANGVEL = 3.2;
// the strap is a flat, screen-facing ribbon (billboard), half-width in world units
const STRAP_HALF_WIDTH = 0.085;
const STRAP_HALF_WIDTH_MOBILE = 0.1;
// how many times the strap texture tiles along the length
const STRAP_UV_REPEAT = 5;
const JOINT_COUNT = 6;

interface BadgeRigProps {
  photoUrl: string;
  name: string;
  role: string;
  isMobile: boolean;
}

/**
 * Physics lanyard rig: a fixed anchor, a five-link rope chain and a card
 * joined to the last link by a spherical joint. The card can be grabbed and
 * dragged anywhere; the chain follows through the rope constraints.
 *
 * The strap is drawn as a flat 2D ribbon that is always facing the camera
 * (billboarded): it is rebuilt as straight strips directly between the
 * physics bodies, so it matches the physics 1:1 and never bulges, spikes or
 * stretches like a polygon-meshed curve would.
 */
export default function BadgeRig({ photoUrl, name, role, isMobile }: BadgeRigProps) {
  const cord = useRef<THREE.Mesh>(null!);
  const strapBuf = useRef<{ pos: Float32Array; uv: Float32Array; geo: THREE.BufferGeometry } | null>(null);
  const fixed = useRef<RapierRigidBody>(null!);
  const j1 = useRef<RapierRigidBody>(null!);
  const j2 = useRef<RapierRigidBody>(null!);
  const j3 = useRef<RapierRigidBody>(null!);
  const j4 = useRef<RapierRigidBody>(null!);
  const j5 = useRef<RapierRigidBody>(null!);
  const card = useRef<RapierRigidBody>(null!);

  const [dragged, drag] = useState<false | THREE.Vector3>(false);
  const [hovered, hover] = useState(false);

  const vec = useMemo(() => new THREE.Vector3(), []);
  const dir = useMemo(() => new THREE.Vector3(), []);
  const tangent = useMemo(() => new THREE.Vector3(), []);
  const perp = useMemo(() => new THREE.Vector3(), []);
  const viewDir = useMemo(() => new THREE.Vector3(), []);
  const camRight = useMemo(() => new THREE.Vector3(), []);
  const camUp = useMemo(() => new THREE.Vector3(), []);
  const p = useMemo(() => Array.from({ length: JOINT_COUNT }, () => new THREE.Vector3()), []);

  const segmentProps: RigidBodyProps = {
    type: "dynamic",
    canSleep: true,
    colliders: false,
    angularDamping: 4,
    linearDamping: 4,
  };

  // Procedural strap texture: flat matte black base with a solid blue stripe
  // (faixa) running down the middle. No gradients or sheen so it reads as a
  // flat 2D band, not a rounded tube.
  const strapMap = getStrapMap();

  useRopeJoint(fixed, j1, [
    [0, 0, 0],
    [0, 0, 0],
    ROPE_LINK,
  ]);
  useRopeJoint(j1, j2, [
    [0, 0, 0],
    [0, 0, 0],
    ROPE_LINK,
  ]);
  useRopeJoint(j2, j3, [
    [0, 0, 0],
    [0, 0, 0],
    ROPE_LINK,
  ]);
  useRopeJoint(j3, j4, [
    [0, 0, 0],
    [0, 0, 0],
    ROPE_LINK,
  ]);
  useRopeJoint(j4, j5, [
    [0, 0, 0],
    [0, 0, 0],
    ROPE_LINK,
  ]);
  useSphericalJoint(j5, card, [
    [0, 0, 0],
    [0, BADGE_HEIGHT / 2 - 0.16, 0],
  ]);

  // Rebuild the flat strap directly between the chain bodies. The lanyard is
  // flattened into the camera-facing plane through the anchor, so the strap is
  // always a flat 2D band facing the camera (it never tilts or folds in
  // depth while the physics sway the chain).
  function updateStrap(camera: THREE.Camera) {
    if (!strapBuf.current) strapBuf.current = createStrapBuffers();
    const { pos, uv, geo } = strapBuf.current;

    const bodies = [fixed.current, j1.current, j2.current, j3.current, j4.current, j5.current];

    // project the joints onto the camera plane (screen x/y + constant depth)
    camera.getWorldDirection(viewDir);
    camRight.setFromMatrixColumn(camera.matrixWorld, 0);
    camUp.setFromMatrixColumn(camera.matrixWorld, 1);
    const depth = ANCHOR_POS[2];
    for (let i = 0; i < JOINT_COUNT; i++) {
      const t = bodies[i].translation();
      p[i].set(
        t.x * camRight.x + t.y * camRight.y + t.z * camRight.z,
        t.x * camUp.x + t.y * camUp.y + t.z * camUp.z,
        depth,
      );
    }

    // in-plane tangent for the ribbon width (kept pointing up for stability)
    tangent.copy(p[3]).sub(p[2]);
    if (tangent.lengthSq() < 1e-8) tangent.set(0, 1, 0);
    tangent.normalize();
    perp.set(-tangent.y, tangent.x, 0);
    if (perp.y < 0) perp.negate();
    perp.multiplyScalar(isMobile ? STRAP_HALF_WIDTH_MOBILE : STRAP_HALF_WIDTH);

    // segment lengths for even UV tiling along the strap
    let total = 0;
    const segLen = [];
    for (let i = 0; i < JOINT_COUNT - 1; i++) {
      const len = p[i].distanceTo(p[i + 1]);
      segLen.push(len);
      total += len;
    }
    if (total < 0.05) return; // keep the previous frame during degenerate states

    // lift the 2D polyline back into the world at the anchor's depth
    let run = 0;
    for (let i = 0; i < JOINT_COUNT; i++) {
      const u = (run / total) * STRAP_UV_REPEAT;
      const idx = i * 2;
      const b3 = idx * 3;
      const b2 = idx * 2;
      dir.copy(camRight).multiplyScalar(p[i].x + perp.x).addScaledVector(camUp, p[i].y + perp.y).addScaledVector(viewDir, depth);
      pos[b3] = dir.x;
      pos[b3 + 1] = dir.y;
      pos[b3 + 2] = dir.z;
      dir.copy(camRight).multiplyScalar(p[i].x - perp.x).addScaledVector(camUp, p[i].y - perp.y).addScaledVector(viewDir, depth);
      pos[b3 + 3] = dir.x;
      pos[b3 + 4] = dir.y;
      pos[b3 + 5] = dir.z;
      uv[b2] = u;
      uv[b2 + 1] = 0;
      uv[b2 + 2] = u;
      uv[b2 + 3] = 1;
      if (i < JOINT_COUNT - 1) run += segLen[i];
    }

    geo.attributes.position.needsUpdate = true;
    geo.attributes.uv.needsUpdate = true;
    geo.computeBoundingSphere();
    if (cord.current) cord.current.geometry = geo;
  }

  // normalized pointer velocity across the whole window, so the badge sways
  // gently with the cursor even before it reaches the canvas
  const pointer = useRef({ x: 0, y: 0, px: 0, py: 0 });
  useEffect(() => {
    function onMove(e: PointerEvent) {
      pointer.current.px = pointer.current.x;
      pointer.current.py = pointer.current.y;
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    }
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((state) => {
    if (dragged) {
      // drag the card with the pointer through the camera ray
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, j4, j5, fixed].forEach((ref) => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z,
      });
    } else {
      // gentle mouse-driven sway on the free-hanging card
      const dx = pointer.current.x - pointer.current.px;
      const dy = pointer.current.y - pointer.current.py;
      const speed = Math.min(Math.hypot(dx, dy), 0.12);
      if (speed > 0.0006) {
        const strength = hovered ? 0.02 : 0.012;
        card.current?.applyTorqueImpulse({ x: -dy * strength, y: dx * strength, z: dx * strength * 0.5 }, true);
      }
      // safety clamp: never let angular velocity run away (prevents jitter/spin)
      const av = card.current?.angvel();
      if (av) {
        const avLen = Math.hypot(av.x, av.y, av.z);
        if (avLen > MAX_ANGVEL) {
          const scale = MAX_ANGVEL / avLen;
          card.current?.setAngvel({ x: av.x * scale, y: av.y * scale, z: av.z * scale }, true);
        }
      }
    }

    if (fixed.current) {
      updateStrap(state.camera);

      // keep the card upright relative to the lanyard
      const ang = card.current.angvel();
      const rot = card.current.rotation();
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z }, true);
    }
  });

  return (
    <group>
      {/* fixed anchor + clip */}
      <RigidBody ref={fixed} position={ANCHOR_POS} type="fixed" colliders={false} />
      <mesh position={ANCHOR_POS}>
        <boxGeometry args={[0.14, 0.05, 0.05]} />
        <meshStandardMaterial color="#2e2e36" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* rope chain links */}
      <RigidBody position={[0, JOINT_Y[1], 0]} ref={j1} {...segmentProps}>
        <BallCollider args={[0.07]} />
      </RigidBody>
      <RigidBody position={[0, JOINT_Y[2], 0]} ref={j2} {...segmentProps}>
        <BallCollider args={[0.07]} />
      </RigidBody>
      <RigidBody position={[0, JOINT_Y[3], 0]} ref={j3} {...segmentProps}>
        <BallCollider args={[0.07]} />
      </RigidBody>
      <RigidBody position={[0, JOINT_Y[4], 0]} ref={j4} {...segmentProps}>
        <BallCollider args={[0.07]} />
      </RigidBody>
      <RigidBody position={[0, JOINT_Y[5], 0]} ref={j5} {...segmentProps}>
        <BallCollider args={[0.07]} />
      </RigidBody>

      {/* draggable card */}
      <RigidBody position={CARD_START} ref={card} {...segmentProps} type={dragged ? "kinematicPosition" : "dynamic"}>
        <CuboidCollider args={[0.64, 0.88, 0.03]} />
        <group
          onPointerOver={() => {
            hover(true);
            window.dispatchEvent(new CustomEvent("cursor:badge-enter"));
          }}
          onPointerOut={() => {
            hover(false);
            window.dispatchEvent(new CustomEvent("cursor:badge-leave"));
          }}
          onPointerUp={(e: ThreeEvent<PointerEvent>) => {
            (e.target as Element).releasePointerCapture(e.pointerId);
            drag(false);
          }}
          onPointerDown={(e: ThreeEvent<PointerEvent>) => {
            (e.target as Element).setPointerCapture(e.pointerId);
            drag(new THREE.Vector3().copy(e.point).sub(card.current.translation()));
          }}
        >
          <BadgeMesh photoUrl={photoUrl} name={name} role={role} hovered={hovered} />
        </group>
      </RigidBody>

      {/* black strap with a blue stripe */}
      <mesh ref={cord}>
        <meshBasicMaterial map={strapMap} side={THREE.FrontSide} depthWrite={false} />
      </mesh>
    </group>
  );
}

// Lazily build the strap geometry (fixed topology, buffers updated in place).
function createStrapBuffers(): { pos: Float32Array; uv: Float32Array; geo: THREE.BufferGeometry } {
  const pos = new Float32Array(JOINT_COUNT * 2 * 3);
  const uv = new Float32Array(JOINT_COUNT * 2 * 2);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
  const indices: number[] = [];
  for (let s = 0; s < JOINT_COUNT - 1; s++) {
    const b = s * 2;
    indices.push(b, b + 1, b + 2, b + 1, b + 3, b + 2);
  }
  geo.setIndex(indices);
  return { pos, uv, geo };
}

// Procedural strap texture: matte black base with a blue stripe (faixa)
// running along the length, thin edge rails and a faint diagonal weave.
let strapMapInstance: THREE.CanvasTexture | null = null;
function getStrapMap(): THREE.CanvasTexture {
  if (!strapMapInstance) strapMapInstance = createStrapMap();
  return strapMapInstance;
}

function createStrapMap(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 128;
  c.height = 128;
  const ctx = c.getContext("2d");
  if (ctx) {
    // neutral light-black (charcoal) base, no color cast, so the ribbon reads
    // as flat fabric rather than a rounded tube
    ctx.fillStyle = "#3a3a42";
    ctx.fillRect(0, 0, 128, 128);
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = THREE.RepeatWrapping;
  t.wrapT = THREE.ClampToEdgeWrapping;
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}