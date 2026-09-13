import SectionLabel from "@/components/SectionLabel";
import Reveal from "@/components/Reveal";
import SkillKey from "@/components/SkillKey";
import { skills } from "@/data/skills";

const langSkills = skills.filter((s) => s.group === "lang");
const toolSkills = skills.filter((s) => s.group === "tools");
const aiSkills = skills.filter((s) => s.group === "ai");

// slight organic vertical offsets per column so the grid doesn't look perfectly mechanical
const OFFSETS = [0, 10, -6, 14, -10, 6, -4, 12];

export default function Skills() {
  return (
    <section id="habilidades" className="relative py-28 lg:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <Reveal>
              <SectionLabel>Habilidades</SectionLabel>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-6 font-display text-4xl font-bold leading-[1.08] text-ink sm:text-5xl">
                Tecnologias que eu utilizo e estou{" "}
                <span className="bg-gradient-to-r from-blue-light to-violet bg-clip-text text-transparent">
                  aprendendo
                </span>
                .
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-ink-dim">
                Aqui estão as principais tecnologias, ferramentas e IAs que uso no dia a dia
                dos meus projetos. Sempre em evolução.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-8 font-mono text-[10px] tracking-[0.25em] text-ink-dimmer">
                PRESS A KEY
              </p>
            </Reveal>
          </div>

          <div className="space-y-10">
            <Reveal delay={0.1}>
              <div>
                <p className="mb-4 font-mono text-[10px] tracking-[0.2em] text-ink-dimmer">
                  LINGUAGENS & TECNOLOGIAS
                </p>
                <div className="flex flex-wrap gap-3 [perspective:1000px] sm:gap-4">
                  {langSkills.map((skill, i) => (
                    <SkillKey
                      key={skill.id}
                      skill={skill}
                      offsetY={OFFSETS[i % OFFSETS.length]}
                      scale={0.9}
                    />
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.18}>
              <div>
                <p className="mb-4 font-mono text-[10px] tracking-[0.2em] text-ink-dimmer">
                  FERRAMENTAS
                </p>
                <div className="flex flex-wrap gap-3 [perspective:1000px] sm:gap-4">
                  {toolSkills.map((skill, i) => (
                    <SkillKey
                      key={skill.id}
                      skill={skill}
                      offsetY={OFFSETS[(i + 3) % OFFSETS.length]}
                      scale={0.9}
                    />
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.26}>
              <div>
                <p className="mb-4 font-mono text-[10px] tracking-[0.2em] text-ink-dimmer">
                  INTELIGÊNCIA ARTIFICIAL
                </p>
                <div className="flex flex-wrap gap-3 [perspective:1000px] sm:gap-4">
                  {aiSkills.map((skill, i) => (
                    <SkillKey
                      key={skill.id}
                      skill={skill}
                      offsetY={OFFSETS[(i + 5) % OFFSETS.length]}
                      scale={0.9}
                    />
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}