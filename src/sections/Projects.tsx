import SectionLabel from "@/components/SectionLabel";
import Reveal from "@/components/Reveal";
import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/data/projects";
import { site } from "@/data/site";

const featured = projects.filter((p) => p.featured);
const rest = projects.filter((p) => !p.featured);
const [mainProject, ...secondaryFeatured] = featured;

export default function Projects() {
  return (
    <section id="projetos" className="relative py-28 lg:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <div>
            <Reveal>
              <SectionLabel>Projetos</SectionLabel>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-6 font-display text-4xl font-bold leading-[1.08] text-ink sm:text-5xl">
                Meus projetos
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <a
              href={site.social.github}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="button"
              className="inline-flex items-center gap-2 text-sm font-medium text-blue-light transition-all hover:gap-3"
            >
              Ver todos no GitHub
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
            </a>
          </Reveal>
        </div>

        {/* main featured project, full width */}
        <div className="mb-6">
          <ProjectCard project={mainProject} index={0} />
        </div>

        {/* two secondary featured, side by side */}
        <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {secondaryFeatured.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i + 1} />
          ))}
        </div>

        {/* remaining projects - asymmetric small grid */}
        <div className="grid grid-cols-2 gap-5 lg:grid-cols-3">
          {rest.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i + 3} />
          ))}
        </div>
      </div>
    </section>
  );
}
