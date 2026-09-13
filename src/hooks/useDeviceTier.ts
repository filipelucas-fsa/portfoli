import { useEffect, useState } from "react";

export type DeviceTier = "full" | "reduced" | "minimal";

const FPS_WARMUP_MS = 400;
const FPS_WINDOW_MS = 1500;
const FPS_DOWNGRADE_THRESHOLD = 45;

function computeStaticTier(): DeviceTier {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return "minimal";

  const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const isSmallViewport = window.innerWidth < 820;
  const cores = navigator.hardwareConcurrency || 4;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory || 4;

  if ((isCoarsePointer && isSmallViewport) || cores <= 2 || memory <= 2) {
    return "reduced";
  }
  if (isCoarsePointer || isSmallViewport) {
    return "reduced";
  }
  return "full";
}

/**
 * Samples real rendering throughput shortly after mount (while the 3D and
 * shader work is already live) and downgrades the tier if the device can't
 * hold near 60fps. This adapts to actual GPU headroom instead of guessing.
 */
function measureFps(onResult: (avgFps: number) => void): () => void {
  const t0 = performance.now();
  let raf = 0;
  let startTime = 0;
  let frames = 0;
  let finished = false;
  const tick = (now: number) => {
    if (finished) return;
    if (now - t0 < FPS_WARMUP_MS) {
      raf = requestAnimationFrame(tick);
      return;
    }
    if (!startTime) startTime = now;
    frames += 1;
    const elapsed = now - startTime;
    if (elapsed >= FPS_WINDOW_MS) {
      const avg = (frames * 1000) / elapsed;
      finished = true;
      onResult(avg);
      return;
    }
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
  return () => {
    finished = true;
    cancelAnimationFrame(raf);
  };
}

/**
 * Estimates a rough device capability tier so we can scale down
 * 3D / particle complexity on mobile and low-power devices, and
 * eliminate it entirely when the user prefers reduced motion.
 *
 * After the initial estimate, the tier is re-checked against real
 * rendering throughput and stepped down if the machine is struggling.
 */
export function useDeviceTier(): DeviceTier {
  const [tier, setTier] = useState<DeviceTier>("full");

  useEffect(() => {
    const staticTier = computeStaticTier();
    setTier(staticTier);

    // No WebGL/ambient GPU work to monitor on minimal; nothing to adapt.
    if (staticTier === "minimal") return;

    const cancel = measureFps((avg) => {
      if (avg < FPS_DOWNGRADE_THRESHOLD) {
        setTier((prev) =>
          prev === "full" ? "reduced" : prev === "reduced" ? "minimal" : prev,
        );
      }
    });
    return cancel;
  }, []);

  return tier;
}

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}