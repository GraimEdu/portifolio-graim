import Image from "next/image";
import Reveal from "@/components/motion/Reveal";
import SectionHead from "@/components/SectionHead";
import { identity, photos } from "@/content/cv";
import { asset } from "@/lib/asset";

export default function About() {
  return (
    <section id="sobre" className="border-t border-line px-6 py-24 md:px-12 md:py-36">
      <div className="mx-auto max-w-6xl">
        <SectionHead index="01" kicker="SOBRE" title="Quem atende o chamado." />

        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr] md:gap-20">
          <div className="space-y-7">
            {identity.summary.map((p, i) => (
              <Reveal key={i} variant="up" delay={i * 0.08}>
                <p className="text-lg leading-relaxed text-fg-dim md:text-xl">
                  {p}
                </p>
              </Reveal>
            ))}
          </div>

          <div className="space-y-8">
            <Reveal variant="mask" delay={0.15}>
              <div className="group relative aspect-[3/4] overflow-hidden rounded-sm border border-line">
                <Image
                  src={asset(photos.retrato.src)}
                  alt={photos.retrato.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 420px"
                  className="scale-[1.03] object-cover grayscale transition-all duration-700 group-hover:scale-100 group-hover:grayscale-0"
                />
              </div>
            </Reveal>

            <Reveal variant="up" delay={0.2}>
            <dl className="space-y-6 border-l border-line pl-6">
              <div>
                <dt className="mono text-[10px] tracking-[0.25em] text-fg-faint">
                  OBJETIVO
                </dt>
                <dd className="mt-2 text-sm leading-relaxed text-fg">
                  {identity.objective}
                </dd>
              </div>
              <div>
                <dt className="mono text-[10px] tracking-[0.25em] text-fg-faint">
                  LOCALIZAÇÃO
                </dt>
                <dd className="mt-2 text-sm text-fg">{identity.location}</dd>
              </div>
              <div>
                <dt className="mono text-[10px] tracking-[0.25em] text-fg-faint">
                  NOME COMPLETO
                </dt>
                <dd className="mt-2 text-sm text-fg">{identity.fullName}</dd>
              </div>
            </dl>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
