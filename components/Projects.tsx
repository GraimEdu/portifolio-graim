import Reveal from "@/components/motion/Reveal";
import SectionHead from "@/components/SectionHead";
import { identity, projects, repos } from "@/content/cv";

export default function Projects() {
  return (
    <section
      id="projetos"
      className="border-t border-line px-6 py-24 md:px-12 md:py-36"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHead
          index="05"
          kicker="PROJETOS"
          title="Também construo o que resolve."
        />

        <ul>
          {projects.map((p, i) => (
            <li key={p.id}>
              <Reveal
                variant="up"
                delay={i * 0.06}
                className="group border-t border-line py-10 last:border-b md:py-14"
              >
                {p.url ? (
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <ProjectRow project={p} linked />
                  </a>
                ) : (
                  <ProjectRow project={p} />
                )}
              </Reveal>
            </li>
          ))}
        </ul>

        {/* Código público — o que dá para abrir e ler agora */}
        <div className="mt-20 md:mt-28">
          <Reveal variant="fade" className="mb-7 flex items-center gap-4">
            <span className="mono text-[11px] tracking-[0.3em] text-accent">
              NO GITHUB
            </span>
            <span className="hairline flex-1" />
            <a
              href={identity.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mono text-[11px] tracking-[0.15em] text-fg-faint transition-colors hover:text-fg"
            >
              {identity.github} ↗
            </a>
          </Reveal>

          <div className="grid gap-px bg-line sm:grid-cols-2">
            {repos.map((repo, i) => (
              <Reveal key={repo.name} variant="up" delay={i * 0.05}>
                <a
                  href={`${identity.githubUrl}/${repo.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-full flex-col bg-surface p-6 transition-colors duration-300 hover:bg-surface-raised md:p-7"
                >
                  <span className="mono text-sm text-fg transition-colors group-hover:text-accent">
                    {repo.name}
                  </span>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-fg-dim">
                    {repo.description}
                  </p>
                  <span className="mono mt-5 text-[10px] tracking-[0.15em] text-fg-faint">
                    {repo.lang.toUpperCase()}
                  </span>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectRow({
  project: p,
  linked = false,
}: {
  project: (typeof projects)[number];
  linked?: boolean;
}) {
  return (
    <div className="grid gap-6 md:grid-cols-[auto_1fr_auto] md:items-baseline md:gap-10">
      <span className="mono text-[11px] text-fg-faint">{p.index}</span>

      <div>
        <h3 className="font-display text-2xl leading-tight font-semibold transition-colors duration-300 group-hover:text-accent md:text-3xl">
          {p.name}
        </h3>
        <p className="mono mt-2 text-[11px] tracking-[0.15em] text-fg-faint">
          {p.subtitle.toUpperCase()}
        </p>
        <p className="mt-4 max-w-2xl leading-relaxed text-fg-dim">
          {p.description}
        </p>
        <ul className="mt-5 flex flex-wrap gap-2">
          {p.tags.map((tag) => (
            <li
              key={tag}
              className="mono rounded-full border border-line px-3 py-1 text-[10px] tracking-[0.1em] text-fg-faint"
            >
              {tag}
            </li>
          ))}
        </ul>
      </div>

      <span className="mono flex items-center gap-2 text-[11px] tracking-[0.2em] text-fg-faint">
        {linked ? (
          <>
            VER
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
              ↗
            </span>
          </>
        ) : (
          "PRIVADO"
        )}
      </span>
    </div>
  );
}
