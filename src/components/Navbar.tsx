import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { site } from "@/data/site";

const links = [
  { href: "#inicio", label: "Início" },
  { href: "#sobre", label: "Sobre" },
  { href: "#projetos", label: "Projetos" },
  { href: "#habilidades", label: "Habilidades" },
  { href: "#contato", label: "Contato" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("#inicio");

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 32);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = links
      .map((l) => document.querySelector(l.href))
      .filter(Boolean) as Element[];
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive("#" + entry.target.id);
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  function handleNavClick(href: string) {
    setOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background,border-color,padding] duration-300 ${
          scrolled
            ? "border-b border-line bg-void/75 py-3 backdrop-blur-xl"
            : "border-b border-transparent py-5"
        }`}
      >
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6">
          <a href="#inicio" onClick={(e) => { e.preventDefault(); handleNavClick("#inicio"); }} className="font-display text-lg font-bold tracking-tight text-ink" data-cursor="button">
            {site.initials}<span className="text-blue-light">.</span>
          </a>

          <ul className="hidden items-center gap-8 md:flex">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                  data-cursor="button"
                  className={`relative text-[13px] font-medium tracking-wide transition-colors duration-200 ${
                    active === link.href ? "text-ink" : "text-ink-dim hover:text-ink"
                  }`}
                >
                  {link.label}
                  {active === link.href && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute -bottom-1.5 left-0 h-px w-full bg-blue-light"
                    />
                  )}
                </a>
              </li>
            ))}
          </ul>

          <a
            href={site.social.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="button"
            className="hidden items-center gap-2 rounded-full border border-line-strong px-4 py-2 text-[13px] font-medium text-ink transition-colors hover:border-blue-light hover:text-blue-light md:inline-flex"
          >
            Entrar em contato
          </a>

          <button
            type="button"
            aria-label="Abrir menu"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="relative z-50 flex h-9 w-9 flex-col items-center justify-center gap-1.5 md:hidden"
          >
            <motion.span
              animate={open ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              className="h-px w-5 bg-ink"
            />
            <motion.span
              animate={open ? { opacity: 0 } : { opacity: 1 }}
              className="h-px w-5 bg-ink"
            />
            <motion.span
              animate={open ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
              className="h-px w-5 bg-ink"
            />
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex flex-col items-start justify-center gap-8 bg-void/98 px-10 backdrop-blur-xl md:hidden"
          >
            {links.map((link, i) => (
              <motion.a
                key={link.href}
                href={link.href}
                onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="font-display text-3xl font-semibold text-ink"
              >
                {link.label}
              </motion.a>
            ))}
            <motion.a
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: links.length * 0.05 }}
              href={site.social.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 rounded-full border border-line-strong px-6 py-3 text-sm font-medium text-ink"
            >
              Entrar em contato
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
