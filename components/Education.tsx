import Reveal from "@/components/motion/Reveal";
import SectionHead from "@/components/SectionHead";
import { education } from "@/content/cv";

export default function Education() {
  return (
    <section className="border-t border-line px-6 py-24 md:px-12 md:py-36">
      <div className="mx-auto max-w-6xl">
        <SectionHead index="06" kicker="FORMAÇÃO" title="Em curso." />

        <div className="grid gap-12 md:grid-cols-[1fr_1.2fr] md:gap-20">
          <Reveal variant="up">
            <h3 className="font-display text-2xl leading-snug font-semibold">
              {education.degree}
            </h3>
            <p className="mt-3 text-fg-dim">
              {education.institution} · {education.place}
            </p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
              <span className="mono text-[11px] tracking-[0.15em] text-accent">
                {education.status.toUpperCase()}
              </span>
              <span className="mono text-[11px] tracking-[0.15em] text-fg-faint">
                {education.expected.toUpperCase()}
              </span>
            </div>
          </Reveal>

          <Reveal variant="stagger" className="space-y-px bg-line">
            {education.courses.map((c) => (
              <div key={c.name} className="bg-surface py-5 md:py-6">
                <h4 className="font-display font-semibold">{c.name}</h4>
                <p className="mono mt-1.5 text-[12px] text-fg-dim">
                  {c.detail}
                </p>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
