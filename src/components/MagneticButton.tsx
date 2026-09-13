import { useRef, type ReactNode, type MouseEvent as ReactMouseEvent } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useIsFinePointer } from "@/hooks/useIsFinePointer";

interface MagneticButtonProps {
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  variant?: "primary" | "outline";
  target?: string;
  rel?: string;
  className?: string;
  download?: boolean;
}

export default function MagneticButton({
  href,
  onClick,
  children,
  variant = "primary",
  target,
  rel,
  className = "",
  download,
}: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement | HTMLButtonElement | null>(null);
  const isFinePointer = useIsFinePointer();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springCfg = { damping: 16, stiffness: 200, mass: 0.4 };
  const sx = useSpring(x, springCfg);
  const sy = useSpring(y, springCfg);

  function handleMouseMove(e: ReactMouseEvent) {
    if (!isFinePointer || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    x.set(relX * 0.25);
    y.set(relY * 0.4);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  const base =
    "group relative inline-flex items-center gap-2.5 rounded-full px-6 py-3 font-medium text-sm tracking-wide transition-colors duration-300";
  const styles =
    variant === "primary"
      ? "bg-ink text-void hover:bg-white"
      : "border border-line-strong text-ink hover:border-blue-light hover:text-blue-light";

  const content = (
    <motion.span
      style={{ x: sx, y: sy }}
      className="inline-flex items-center gap-2.5"
    >
      {children}
    </motion.span>
  );

  const sharedProps = {
    ref: ref as never,
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    className: `${base} ${styles} ${className}`,
    "data-cursor": "button",
  };

  if (href) {
    return (
      <a href={href} target={target} rel={rel} download={download} {...sharedProps}>
        {content}
      </a>
    );
  }

  return (
    <button onClick={onClick} type="button" {...sharedProps}>
      {content}
    </button>
  );
}
