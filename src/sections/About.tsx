import { useEffect, useRef, useState } from "react";
import { useInView, motion } from "framer-motion";
import SectionLabel from "@/components/SectionLabel";
import Reveal from "@/components/Reveal";
import { site } from "@/data/site";

function AnimatedNumber({ target, suffix }: { target: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1300;
    const start = performance.now();
    let raf: number;
    function tick(now: number) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.floor(eased * target));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setValue(target);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target]);

  return (
    <span ref={ref}>
      {value}
      {suffix}
    </span>
  );
}

const infoItems = [
  {
    label: "Formação",
    value: site.education.title,
    sub: `${site.education.place} · ${site.education.date}`,
    icon: "M22 10L12 5 2 10l10 5 10-5z M6 12v5c0 1.66 2.69 3 6 3s6-1.34 6-3v-5",
  },
  {
    label: "Experiência",
    value: site.experience.title,
    sub: site.experience.place,
    icon: "M2 7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7z M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16",
  },
  {
    label: "Localização",
    value: site.location,
    sub: site.status,
    icon: "M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0z M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  },
  {
    label: "Disponibilidade",
    value: site.availability,
    sub: "Aberto a propostas e parcerias",
    icon: "M22 11.08V12a10 10 0 1 1-5.93-9.14 M22 4L12 14.01l-3-3",
  },
];

export default function About() {
  return (
    <section id="sobre" className="relative py-28 lg:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[0.95fr_1.05fr] lg:gap-10">
          <div>
            <Reveal>
              <SectionLabel>Sobre mim</SectionLabel>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-6 font-display text-4xl font-bold leading-[1.08] text-ink sm:text-5xl">
                Transformando ideias em{" "}
                <span className="bg-gradient-to-r from-blue-light to-violet bg-clip-text text-transparent">
                  soluções reais
                </span>
                .
              </h2>
            </Reveal>
            <div className="mt-7 space-y-4 max-w-md">
              {site.about.slice(0, 2).map((p, i) => (
                <Reveal key={i} delay={0.1 + i * 0.06}>
                  <p className="text-[15px] leading-relaxed text-ink-dim">{p}</p>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.3}>
              <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:max-w-md">
                {site.stats.map((stat, i) => (
                  <div key={i}>
                    <p className="font-display text-2xl font-bold text-ink">
                      {stat.staticText ?? <AnimatedNumber target={stat.value} suffix={stat.suffix} />}
                    </p>
                    <p className="mt-1 text-[11px] leading-snug text-ink-dimmer">{stat.label}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* floating info items - not a dashboard, an editorial column */}
          <div className="relative">
            <div className="space-y-3">
              {infoItems.map((item, i) => (
                <Reveal key={item.label} delay={0.12 + i * 0.08} y={16}>
                  <motion.div
                    whileHover={{ x: 6 }}
                    transition={{ type: "spring", stiffness: 300, damping: 24 }}
                    className="group flex items-start gap-4 border-b border-line py-5 last:border-none"
                  >
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line-strong text-blue-light transition-colors group-hover:border-blue-light">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                        <path d={item.icon} />
                      </svg>
                    </span>
                    <div>
                      <p className="font-mono text-[10px] tracking-[0.2em] text-ink-dimmer">
                        {item.label.toUpperCase()}
                      </p>
                      <p className="mt-1.5 font-display text-base font-semibold text-ink">
                        {item.value}
                      </p>
                      <p className="mt-1 text-[13px] text-ink-dim">{item.sub}</p>
                    </div>
                  </motion.div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.5}>
              <div className="mt-8 border-l-2 border-blue-light/40 pl-5">
                <p className="font-mono text-[10px] tracking-[0.2em] text-ink-dimmer">_ABORDAGEM</p>
                <p className="mt-2 font-display text-xl font-semibold italic text-ink">
                  Do conceito à entrega, cada projeto recebe atenção individual — sem templates, sem soluções genéricas.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
