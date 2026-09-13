import SectionLabel from "@/components/SectionLabel";
import Reveal from "@/components/Reveal";
import MagneticButton from "@/components/MagneticButton";
import { site } from "@/data/site";

export default function Contact() {
  return (
    <section id="contato" className="relative py-28 lg:py-36">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <Reveal className="flex justify-center">
          <SectionLabel>Contato</SectionLabel>
        </Reveal>

        <Reveal delay={0.06}>
          <h2 className="mt-6 font-display text-4xl font-bold leading-[1.08] text-ink sm:text-6xl">
            {site.contact.title}
          </h2>
        </Reveal>

        <Reveal delay={0.12}>
          <p className="mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-ink-dim">
            {site.contact.description}
          </p>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-9 flex justify-center">
            <MagneticButton href={site.social.whatsapp} target="_blank" rel="noopener noreferrer" variant="primary">
              Entrar em contato
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
            </MagneticButton>
          </div>
        </Reveal>

        <Reveal delay={0.28}>
          <div className="mt-10 flex justify-center gap-3">
            {[
              { href: site.social.github, label: "GitHub", icon: "M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" },
              { href: site.social.linkedin, label: "LinkedIn", icon: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4V8h4v2a5.5 5.5 0 0 1 2-1z" },
              { href: site.social.email, label: "Email", icon: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target={s.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                aria-label={s.label}
                data-cursor="button"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-line-strong text-ink-dim transition-colors hover:border-blue-light hover:text-blue-light"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d={s.icon} /></svg>
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
