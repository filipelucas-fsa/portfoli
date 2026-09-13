import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { preloaderStore } from "@/lib/preloaderStore";

const HOLD_MS = 450;
const EXIT_MS = 1250;
const SAFETY_MS = 10000;

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  const displayRef = useRef(0);
  const targetRef = useRef(preloaderStore.getProgress());
  const doneRef = useRef(preloaderStore.isDone());

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const unsubscribe = preloaderStore.subscribe((state) => {
      if (state.progress > targetRef.current) targetRef.current = state.progress;
      if (state.done) doneRef.current = true;
    });

    // Never hold the page longer than this if some asset never reports back.
    const safety = window.setTimeout(() => {
      targetRef.current = 100;
      doneRef.current = true;
    }, SAFETY_MS);

    let raf = 0;
    const rafStart = performance.now();
    const tick = () => {
      const elapsed = performance.now() - rafStart;
      // Perceptive floor while real signals haven't arrived yet (capped),
      // so the counter never appears frozen waiting for the 3D chunks.
      const idleFloor = 40 * (1 - Math.exp(-elapsed / 1800));
      const effectiveTarget = Math.max(targetRef.current, idleFloor);

      if (reduce) {
        displayRef.current = effectiveTarget;
      } else {
        const diff = effectiveTarget - displayRef.current;
        if (diff > 0) displayRef.current += Math.max(diff * 0.12, 0.4);
        if (displayRef.current > effectiveTarget) displayRef.current = effectiveTarget;
      }
      setProgress(Math.round(displayRef.current));

      if (doneRef.current && displayRef.current >= 100) {
        setDone(true);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      unsubscribe();
      clearTimeout(safety);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    if (!done) return;
    const timer = window.setTimeout(onComplete, HOLD_MS + EXIT_MS);
    return () => clearTimeout(timer);
  }, [done, onComplete]);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: done ? 0 : 1 }}
      transition={{ duration: 0.4, ease: "easeOut", delay: done ? 0.75 : 0 }}
      style={done ? { pointerEvents: "none" } : undefined}
      className="fixed inset-0 z-[100] flex items-end bg-void px-6 pb-12 sm:px-10 sm:pb-20"
    >
      <div className="w-full max-w-6xl">
        <div className="overflow-hidden">
          <motion.p
            animate={{ y: done ? "120%" : 0 }}
            transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
            className="font-mono text-[clamp(20px,3.2vw,42px)] font-medium tracking-tight text-ink-dim"
          >
            {progress}
            <span className="text-blue-light">%</span>
          </motion.p>
        </div>

        <div className="overflow-hidden">
          <motion.p
            initial={{ y: "110%" }}
            animate={{ y: done ? "120%" : 0 }}
            transition={{
              duration: 0.7,
              ease: [0.33, 1, 0.68, 1],
              delay: done ? 0.1 : 0.25,
            }}
            className="font-hero text-[clamp(48px,9vw,120px)] font-extrabold leading-none tracking-tight text-ink"
          >
            loadinq
          </motion.p>
        </div>

        <div className="mt-6 overflow-hidden">
          <motion.div
            initial={{ y: "110%" }}
            animate={{ y: done ? "120%" : 0 }}
            transition={{
              duration: 0.7,
              ease: [0.33, 1, 0.68, 1],
              delay: done ? 0.1 : 0.45,
            }}
            className="flex w-[min(22rem,72vw)] flex-col gap-2"
          >
            {[0, 1].map((i) => (
              <div
                key={i}
                className="h-[3px] w-full overflow-hidden rounded-full bg-line"
              >
                <motion.div
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.09, ease: "linear" }}
                  className="h-full rounded-full bg-gradient-to-r from-blue-light via-blue to-violet"
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}