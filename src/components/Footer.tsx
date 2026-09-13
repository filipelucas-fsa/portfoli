import { site } from "@/data/site";

const links = [
  { href: "#inicio", label: "Início" },
  { href: "#sobre", label: "Sobre" },
  { href: "#projetos", label: "Projetos" },
  { href: "#habilidades", label: "Habilidades" },
  { href: "#contato", label: "Contato" },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line pt-16 pb-10">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-wrap items-start justify-between gap-10">
          <div>
            <a href="#inicio" className="font-display text-xl font-bold text-ink">
              {site.initials}<span className="text-blue-light">.</span>
            </a>
            <p className="mt-2 max-w-xs text-sm text-ink-dim">{site.role}.</p>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            {links.map((l) => (
              <a key={l.href} href={l.href} className="text-sm text-ink-dim transition-colors hover:text-blue-light">
                {l.label}
              </a>
            ))}
          </nav>
        </div>
        <div className="mt-12 border-t border-line pt-6">
          <p className="text-xs text-ink-dimmer">
            © {new Date().getFullYear()} {site.name}. Todos os direitos reservados.
          </p>
        </div>
      </div>

      <p
        aria-hidden="true"
        className="pointer-events-none select-none font-display font-black leading-none text-transparent"
        style={{
          fontSize: "clamp(5rem, 16vw, 11rem)",
          WebkitTextStroke: "1px rgba(255,255,255,0.05)",
          marginTop: "-0.15em",
          textAlign: "right",
          paddingRight: "1rem",
        }}
      >
        {site.initials}.
      </p>
    </footer>
  );
}
