import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface BadgeFallbackProps {
  photoUrl: string;
  name: string;
}

export default function BadgeFallback({ photoUrl, name }: BadgeFallbackProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [interactive] = useState(() => window.matchMedia("(pointer: fine)").matches);

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const springCfg = { damping: 18, stiffness: 140, mass: 0.6 };
  const srx = useSpring(rx, springCfg);
  const sry = useSpring(ry, springCfg);

  const rotateX = useTransform(srx, (v) => `${v}deg`);
  const rotateY = useTransform(sry, (v) => `${v}deg`);

  function handleMove(e: ReactPointerEvent) {
    if (!interactive || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    ry.set(px * 18);
    rx.set(-py * 14);
  }

  function handleLeave() {
    rx.set(0);
    ry.set(0);
  }

  return (
    <div className="relative flex items-center justify-center" style={{ perspective: 1200 }}>
      {/* cord */}
      <div className="absolute left-1/2 top-[-40px] h-[70px] w-px -translate-x-1/2 bg-gradient-to-b from-line-strong to-blue-light/40" />
      <div className="absolute left-1/2 top-[-46px] h-2 w-5 -translate-x-1/2 rounded-sm bg-panel-2 ring-1 ring-line-strong" />

      <motion.div
        ref={ref}
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        animate={interactive ? {} : { rotate: [0, 1.2, 0, -1.2, 0] }}
        transition={interactive ? {} : { duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative w-[220px] rounded-[22px] border border-line-strong bg-gradient-to-b from-panel-2 to-panel p-4 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]"
      >
        <div className="absolute left-1/2 top-3 h-1.5 w-8 -translate-x-1/2 rounded-full bg-black/60" />
        <div className="mt-4 overflow-hidden rounded-xl border border-line-strong">
          <img src={photoUrl} alt={name} className="aspect-[4/3.2] w-full object-cover grayscale" />
        </div>
        <p className="mt-4 text-center font-display text-sm font-bold tracking-wide text-ink">
          {name.toUpperCase()}
        </p>
        <p className="text-center font-mono text-[10px] tracking-[0.2em] text-blue-light">DEV</p>
        <span className="absolute bottom-3 left-4 font-display text-xs font-bold text-blue-light">
          FL.
        </span>
        <div className="pointer-events-none absolute inset-0 rounded-[22px] bg-gradient-to-br from-white/[0.06] via-transparent to-transparent" />
      </motion.div>
    </div>
  );
}
