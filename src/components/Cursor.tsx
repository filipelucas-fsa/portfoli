import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useIsFinePointer } from "@/hooks/useIsFinePointer";
import { usePrefersReducedMotion } from "@/hooks/useDeviceTier";

type CursorVariant = "default" | "button" | "project" | "badge";

export default function Cursor() {
  const isFinePointer = useIsFinePointer();
  const reducedMotion = usePrefersReducedMotion();
  const [variant, setVariant] = useState<CursorVariant>("default");
  const [visible, setVisible] = useState(false);
  const rafRef = useRef<number | null>(null);

  const mx = useMotionValue(-100);
  const my = useMotionValue(-100);
  const springCfg = { damping: 28, stiffness: 400, mass: 0.4 };
  const sx = useSpring(mx, springCfg);
  const sy = useSpring(my, springCfg);

  const active = isFinePointer && !reducedMotion;
  const badgeHover = useRef(false);

  useEffect(() => {
    if (!active) return;

    document.documentElement.classList.add("custom-cursor-active");

    function handleMove(e: MouseEvent) {
      mx.set(e.clientX);
      my.set(e.clientY);
      if (!visible) setVisible(true);

      if (badgeHover.current) {
        setVariant("badge");
        return;
      }

      const target = e.target as HTMLElement;
      const projectEl = target.closest<HTMLElement>("[data-cursor='project']");
      const buttonEl = target.closest<HTMLElement>("button, a, [data-cursor='button']");

      if (projectEl) setVariant("project");
      else if (buttonEl) setVariant("button");
      else setVariant("default");
    }

    function handleLeave() {
      setVisible(false);
    }

    function onBadgeEnter() {
      badgeHover.current = true;
      setVariant("badge");
    }
    function onBadgeLeave() {
      badgeHover.current = false;
      setVariant("default");
    }

    window.addEventListener("mousemove", handleMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", handleLeave);
    window.addEventListener("cursor:badge-enter", onBadgeEnter);
    window.addEventListener("cursor:badge-leave", onBadgeLeave);

    return () => {
      document.documentElement.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", handleMove);
      document.documentElement.removeEventListener("mouseleave", handleLeave);
      window.removeEventListener("cursor:badge-enter", onBadgeEnter);
      window.removeEventListener("cursor:badge-leave", onBadgeLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [active, mx, my, visible]);

  if (!active) return null;

  const ringScale = variant === "default" ? 1 : variant === "project" ? 2.2 : 1.6;
  const showLabel = variant === "project";

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[999] mix-blend-difference"
      style={{ x: sx, y: sy, translateX: "-50%", translateY: "-50%" }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="flex items-center justify-center rounded-full border border-white/70"
        animate={{
          width: 34 * ringScale,
          height: 34 * ringScale,
        }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
      >
        {showLabel && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-mono text-[9px] font-semibold tracking-[0.2em] text-white"
          >
            VER
          </motion.span>
        )}
        {!showLabel && (
          <span className="h-1.5 w-1.5 rounded-full bg-white" />
        )}
      </motion.div>
    </motion.div>
  );
}
