import { motion } from "framer-motion";
import type { Project } from "@/data/projects";

interface ProjectCardProps {
  project: Project;
  index: number;
}

const sizeClasses: Record<Project["size"], string> = {
  lg: "aspect-[16/10] md:aspect-[21/11]",
  md: "aspect-[4/3]",
  sm: "aspect-[4/3]",
};

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const Wrapper = project.link ? motion.a : motion.div;
  const linkProps = project.link
    ? { href: project.link, target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <Wrapper
      {...linkProps}
      data-cursor={project.link ? "project" : undefined}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: (index % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative block overflow-hidden rounded-2xl border border-line bg-panel ${sizeClasses[project.size]}`}
    >
      <motion.img
        src={project.image}
        alt={project.title}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
        initial={{ scale: 1 }}
        whileHover={{ scale: 1.045 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void via-void/40 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
        <h3 className={`font-display font-bold text-ink ${project.size === "lg" ? "text-2xl sm:text-3xl" : "text-lg"}`}>
          {project.title}
        </h3>

        <p
          className={`mt-2 max-w-lg text-[13px] leading-relaxed text-ink-dim opacity-0 transition-all duration-300 group-hover:opacity-100 ${
            project.size === "lg" ? "line-clamp-3 sm:line-clamp-none" : "line-clamp-2"
          }`}
        >
          {project.description}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-blue/15 px-2 py-1 font-mono text-[10px] font-medium text-blue-light"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {project.link && (
        <div className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-line-strong bg-void/40 text-ink opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100 group-hover:scale-105">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </div>
      )}
    </Wrapper>
  );
}
