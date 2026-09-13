import { useEffect, useState, type CSSProperties } from "react";
import { motion } from "framer-motion";
import type { Skill } from "@/data/skills";

/**
 * Lighten (positive) or darken (negative) a #rrggbb hex color by a percentage.
 */
function shade(hex: string, percent: number): string {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 0xff;
  const g = (n >> 8) & 0xff;
  const b = n & 0xff;
  const to = percent < 0 ? 0 : 255;
  const p = Math.abs(percent) / 100;
  const mix = (c: number) => Math.round((to - c) * p + c);
  const out = (mix(r) << 16) | (mix(g) << 8) | mix(b);
  return `#${out.toString(16).padStart(6, "0")}`;
}

const MOBILE_MQ = "(max-width: 640px)";

interface SkillKeyProps {
  skill: Skill;
  offsetY?: number;
  scale?: number;
}

export default function SkillKey({ skill, offsetY = 0, scale = 1 }: SkillKeyProps) {
  const [pressed, setPressed] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [compact, setCompact] = useState(() => window.matchMedia(MOBILE_MQ).matches);

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_MQ);
    const onChange = (e: MediaQueryListEvent) => setCompact(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const size = 92 * scale * (compact ? 0.75 : 1);
  const c = skill.color;
  const bevel = Math.max(6, Math.round(size * 0.1)); // side wall thickness (px)

  const wrapper: CSSProperties = {
    transform: `translateY(${compact ? 0 : offsetY}px)`,
    width: size,
    height: size,
  };

  // visible "skirt" that shows under the front edge when the cap is tilted
  const skirtFace: CSSProperties = {
    position: "absolute",
    left: "50%",
    top: "50%",
    width: size,
    height: bevel + 6,
    transform: `translate(-50%, -50%) rotateX(90deg) translateZ(${size / 2}px)`,
    borderRadius: 14,
    background: `linear-gradient(180deg, ${shade(c, -30)}, ${shade(c, -52)})`,
    boxShadow: "inset 0 -4px 10px rgba(0,0,0,0.45)",
    backfaceVisibility: "hidden",
  };

  const typingFace: CSSProperties = {
    position: "absolute",
    left: "50%",
    top: "50%",
    width: size,
    height: size,
    transform: `translate(-50%, -50%) translateZ(${bevel}px)`,
    borderRadius: 14,
    border: `${bevel}px solid transparent`,
    // three layers: top shine -> base color (padding box), side walls (border box)
    background: `
      radial-gradient(150% 170% at 50% -22%, rgba(255,255,255,0.55), rgba(255,255,255,0) 58%),
      linear-gradient(180deg, ${shade(c, 14)} 0%, ${c} 46%, ${shade(c, -12)} 100%),
      linear-gradient(180deg, ${shade(c, -8)} 0%, ${shade(c, -30)} 100%)
    `,
    backgroundClip: "padding-box, padding-box, border-box",
    backgroundOrigin: "padding-box, padding-box, border-box",
    boxShadow: `${
      hovered
        ? `0 16px 28px -10px ${c}59, 0 ${bevel + 1}px 0 ${shade(c, -32)}`
        : `0 ${bevel}px 0 ${shade(c, -30)}`
    }, inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -7px 12px -6px rgba(0,0,0,0.38)`,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: compact ? 3 : 6,
    backfaceVisibility: "hidden",
  };

  return (
    <motion.button
      type="button"
      style={wrapper}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false); }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      className="group relative shrink-0 select-none [perspective:600px]"
      aria-label={skill.name}
      data-cursor="button"
    >
      {/* soft grounded shadow */}
      <div
        aria-hidden="true"
        className="absolute inset-[6%] rounded-[50%] bg-black/55 blur-[9px] transition-opacity duration-300"
        style={{
          opacity: pressed ? 0.25 : hovered ? 0.35 : 0.5,
          transform: pressed || hovered ? "translateY(4%) scale(0.96)" : "translateY(10%) scale(0.92)",
        }}
      />

      <motion.div
        animate={{
          y: pressed ? 4 : hovered ? 2 : 0,
          rotateX: pressed ? 0 : hovered ? -16 : 0,
          scale: pressed ? 0.95 : hovered ? 0.97 : 1,
        }}
        transition={{ type: "spring", stiffness: 520, damping: 20 }}
        className="relative h-full w-full [transform-style:preserve-3d]"
      >
        <div style={skirtFace} />

        <div style={typingFace}>
          <img
            src={skill.icon}
            alt=""
            aria-hidden="true"
            className={compact ? "h-5 w-5 object-contain drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]" : "h-7 w-7 object-contain drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]"}
            style={{ filter: "brightness(0) invert(1)" }}
          />
          <span
            className="px-1 text-center font-mono text-[9px] font-medium leading-tight tracking-tight text-white"
            style={{ textShadow: "0 1px 2px rgba(0,0,0,0.45)" }}
          >
            {skill.name}
          </span>
        </div>
      </motion.div>
    </motion.button>
  );
}