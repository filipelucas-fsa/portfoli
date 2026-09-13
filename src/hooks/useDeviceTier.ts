import { useEffect, useState } from "react";

export type DeviceTier = "full" | "reduced" | "minimal";

/**
 * Estimates a rough device capability tier so we can scale down
 * 3D / particle complexity on mobile and low-power devices, and
 * eliminate it entirely when the user prefers reduced motion.
 */
export function useDeviceTier(): DeviceTier {
  const [tier, setTier] = useState<DeviceTier>("full");

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setTier("minimal");
      return;
    }

    const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const isSmallViewport = window.innerWidth < 820;
    const cores = navigator.hardwareConcurrency || 4;
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory || 4;

    if ((isCoarsePointer && isSmallViewport) || cores <= 2 || memory <= 2) {
      setTier("reduced");
    } else if (isCoarsePointer || isSmallViewport) {
      setTier("reduced");
    } else {
      setTier("full");
    }
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
