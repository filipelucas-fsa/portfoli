import { motion, useScroll, useTransform } from "framer-motion";
import { useDeviceTier, usePrefersReducedMotion } from "@/hooks/useDeviceTier";
import ColorBends from "@/components/ColorBends";
import LiquidEther from "@/components/LiquidEther";

/**
 * A single fixed, full-viewport background layer that lives behind every
 * section. Nothing here is boxed per-section — instead, glow "pools" fade
 * in and out of opacity as the user scrolls through the page, so the
 * lighting tone drifts blue -> violet -> cyan -> blue without any hard
 * transition between sections.
 */
export default function AmbientField() {
  const { scrollYProgress } = useScroll();
  const reducedMotion = usePrefersReducedMotion();
  const tier = useDeviceTier();

  // Section bands (approximate, tuned to page proportions):
  // hero 0 - .12 | about .10 - .30 | skills .28 - .55 | projects .50 - .85 | contact .82 - 1
  const heroGlow = useTransform(scrollYProgress, [0, 0.14, 0.24], [1, 0.55, 0]);
  const aboutGlow = useTransform(scrollYProgress, [0.08, 0.2, 0.34], [0, 1, 0]);
  const skillsGlow = useTransform(scrollYProgress, [0.26, 0.42, 0.58], [0, 1, 0]);
  const projectsGlow = useTransform(scrollYProgress, [0.5, 0.66, 0.86], [0, 1, 0.4]);
  const contactGlow = useTransform(scrollYProgress, [0.8, 0.92, 1], [0, 1, 1]);

  const driftY = useTransform(scrollYProgress, [0, 1], [0, reducedMotion ? 0 : -80]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-void">
      {/* base vertical gradient - deep black to near-black blue */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-10%,#0a0e1c_0%,#05060a_55%)]" />

      {/* soft color bends shader, barely-there backdrop */}
      {!reducedMotion && (
        <div className="absolute inset-0 opacity-[0.95]">
          <ColorBends
            speed={0.08}
            colors={["#3b6fed", "#7c5cff", "#4fd8ff", "#6c9bff"]}
            scale={2.5}
            frequency={0.5}
            warpStrength={0.35}
            mouseInfluence={0.6}
            parallax={0.7}
            noise={0.04}
            iterations={1}
            intensity={3}
            bandWidth={1.2}
          />
        </div>
      )}

      {/* glow pools, cross-fading by scroll position */}
      <motion.div
        style={{ opacity: heroGlow, y: driftY }}
        className="absolute left-[8%] top-[-10%] h-[60vh] w-[60vh] rounded-full bg-blue/25 blur-[140px]"
      />
      <motion.div
        style={{ opacity: heroGlow }}
        className="absolute right-[5%] top-[5%] h-[45vh] w-[45vh] rounded-full bg-cyan/15 blur-[130px]"
      />

      <motion.div
        style={{ opacity: aboutGlow, y: driftY }}
        className="absolute left-[-5%] top-[28%] h-[55vh] w-[55vh] rounded-full bg-blue-light/15 blur-[150px]"
      />

      <motion.div
        style={{ opacity: skillsGlow, y: driftY }}
        className="absolute right-[0%] top-[42%] h-[65vh] w-[65vh] rounded-full bg-violet/22 blur-[160px]"
      />
      <motion.div
        style={{ opacity: skillsGlow }}
        className="absolute left-[15%] top-[50%] h-[35vh] w-[35vh] rounded-full bg-blue/15 blur-[120px]"
      />

      <motion.div
        style={{ opacity: projectsGlow, y: driftY }}
        className="absolute left-[10%] top-[62%] h-[50vh] w-[50vh] rounded-full bg-cyan/12 blur-[150px]"
      />

      <motion.div
        style={{ opacity: contactGlow }}
        className="absolute right-[10%] top-[85%] h-[55vh] w-[55vh] rounded-full bg-blue/25 blur-[150px]"
      />

      {/* technological grid, extremely subtle, fading at edges */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(ellipse 90% 70% at 50% 30%, black 0%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 90% 70% at 50% 30%, black 0%, transparent 75%)",
        }}
      />

      {/* grain */}
      <div
        className={`absolute -inset-[10%] opacity-[0.035] ${reducedMotion ? "" : "animate-[grain-shift_1.2s_steps(4)_infinite]"}`}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          mixBlendMode: "overlay",
        }}
      />

      {/* vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_100%_at_50%_50%,transparent_40%,rgba(0,0,0,0.30)_100%)]" />

      {/* liquid ether — full-tier devices only, low cost: it is the heaviest
          pass on the page (fluid sim), so cap resolution + poisson iterations
          and skip entirely on reduced/minimal devices */}
      {!reducedMotion && tier === "full" && (
        <div className="absolute inset-0" style={{ opacity: 0.3 }}>
          <LiquidEther
            colors={["#3b6fed", "#7c5cff", "#4fd8ff"]}
            autoDemo
            autoSpeed={0.35}
            autoIntensity={1.4}
            resolution={0.32}
            iterationsPoisson={8}
            mouseForce={6}
          />
        </div>
      )}
    </div>
  );
}
