import { useEffect, useState } from "react";

export type DeviceTier = "full" | "reduced" | "minimal";
export type AdaptiveQuality = "high" | "low";

const FPS_DELAY_MS = 3500;
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
 * Samples real rendering throughput a few seconds after load, once the heavy
 * WASM/3D startup is over, and reports the steady-state framerate.
 */
function measureFps(onResult: (avgFps: number) => void): () => void {
  const t0 = performance.now();
  let raf = 0;
  let startTime = 0;
  let frames = 0;
  let finished = false;
  const tick = (now: number) => {
    if (finished) return;
    if (now - t0 < FPS_DELAY_MS + FPS_WARMUP_MS) {
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
 * 3D complexity on mobile and low-power devices, and eliminate it
 * entirely when the user prefers reduced motion.
 *
 * IMPORTANT: this is static/hardware-based and never changes at runtime,
 * because the 3D badge render path depends on it. Ambient effects use
 * useAdaptiveQuality() instead, so a slow GPU never removes the badge.
 */
export function useDeviceTier(): DeviceTier {
  const [tier, setTier] = useState<DeviceTier>("full");

  useEffect(() => {
    setTier(computeStaticTier());
  }, []);

  return tier;
}

/**
 * Adaptive ambient quality, separate from the 3D badge decision. Starts at
 * "high", then after load measures steady-state FPS and drops to "low" on
 * weak GPUs. Only the background effects (fluid sim, etc.) react to this.
 */
export function useAdaptiveQuality(): AdaptiveQuality {
  const [quality, setQuality] = useState<AdaptiveQuality>(() =>
    computeStaticTier() === "full" ? "high" : "low",
  );

  useEffect(() => {
    if (computeStaticTier() !== "full") return;
    const cancel = measureFps((avg) => {
      if (avg < FPS_DOWNGRADE_THRESHOLD) setQuality("low");
    });
    return cancel;
  }, []);

  return quality;
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