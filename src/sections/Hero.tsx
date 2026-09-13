import { motion } from "framer-motion";
import SectionLabel from "@/components/SectionLabel";
import MagneticButton from "@/components/MagneticButton";
import Badge from "@/components/3d/Badge";
import { site } from "@/data/site";

export default function Hero() {
  return (
    <section id="inicio" className="relative flex min-h-[100svh] items-center overflow-x-clip pt-24">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8">
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <SectionLabel>Portfólio</SectionLabel>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 font-hero text-[13vw] font-bold leading-[0.95] tracking-tight text-ink sm:text-[8vw] lg:text-[4.6vw]"
          >
            {site.firstName}
            <br />
            <span className="bg-gradient-to-r from-blue-light via-blue to-violet bg-clip-text text-transparent">
              {site.lastName}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.16 }}
            className="mt-5 max-w-md font-hero text-xl font-semibold text-ink-dim sm:text-2xl"
          >
            {site.role}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.24 }}
            className="mt-5 max-w-md text-[clamp(14px,4.2vw,18px)] leading-relaxed text-ink-dim sm:max-w-lg"
          >
            {site.heroDescription}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.32 }}
            className="mt-9 flex flex-wrap items-center justify-center gap-4 lg:justify-start"
          >
            <MagneticButton href="#projetos" variant="primary">
              Ver projetos
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
            </MagneticButton>
            <MagneticButton href={site.social.whatsapp} target="_blank" rel="noopener noreferrer" variant="outline">
              Entrar em contato
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
            </MagneticButton>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-16"
          >
            <p className="mb-4 font-mono text-[10px] tracking-[0.25em] text-ink-dimmer">ME ENCONTRE</p>
            <div className="flex gap-3">
              {[
                { href: site.social.linkedin, label: "LinkedIn", icon: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4V8h4v2a5.5 5.5 0 0 1 2-1z" },
                { href: site.social.github, label: "GitHub", icon: "M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" },
                { href: site.social.whatsapp, label: "WhatsApp", icon: "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" },
                { href: site.social.email, label: "Email", icon: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  data-cursor="button"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-line-strong text-ink-dim transition-colors hover:border-blue-light hover:text-blue-light"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d={s.icon} /></svg>
                </a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Badge 3D column */}
        <div className="relative order-first z-[60] -mt-24 h-[420px] sm:-mt-28 sm:h-[480px] lg:order-none lg:-mt-32 lg:h-[560px]">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute -inset-x-16 -inset-y-48 flex items-center justify-center"
          >
            <Badge photoUrl="/img/perfil.jpeg" name={site.name} role={site.role} />
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute inset-x-0 bottom-8 hidden justify-center md:flex"
      >
        <div className="flex flex-col items-center gap-2 text-ink-dimmer">
          <span className="font-mono text-[10px] tracking-[0.2em]">SCROLL</span>
          <motion.span
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="h-8 w-px bg-gradient-to-b from-ink-dimmer to-transparent"
          />
        </div>
      </motion.div>
    </section>
  );
}
