"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Reveal from "@/components/motion/Reveal";
import SectionHead from "@/components/SectionHead";
import Gallery from "@/components/Gallery";
import { experience, photos } from "@/content/cv";

/**
 * Experiência.
 *
 * A linha vertical se desenha conforme a rolagem — é o único movimento
 * amarrado ao scroll (scrub) da página; o resto entra e fica. Isso dá a
 * sensação de estar percorrendo um período, não só lendo uma lista.
 */
export default function Timeline() {
  const lineRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const line = lineRef.current;
    const wrap = wrapRef.current;
    if (!line || !wrap) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(line, { scaleY: 1 });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        line,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: wrap,
            start: "top 70%",
            end: "bottom 80%",
            scrub: 0.6,
          },
        },
      );
    }, wrap);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="experiencia"
      className="border-t border-line px-6 py-24 md:px-12 md:py-36"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHead
          index="02"
          kicker="EXPERIÊNCIA"
          title="Onde a teoria encontra o chamado aberto."
        />

        {experience.map((job) => (
          <div key={job.company}>
            <Reveal variant="up" className="mb-12">
              <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-line pb-6">
                <div>
                  <h3 className="text-2xl md:text-3xl">{job.companyShort}</h3>
                  <p className="mt-2 text-sm text-fg-dim">{job.company}</p>
                </div>
                <div className="text-right">
                  <p className="mono text-xs tracking-[0.15em] text-accent">
                    {job.period.toUpperCase()}
                  </p>
                  <p className="mono mt-1 text-[11px] tracking-[0.15em] text-fg-faint">
                    {job.role.toUpperCase()} · {job.team}
                  </p>
                </div>
              </div>
            </Reveal>

            <div ref={wrapRef} className="relative pl-8 md:pl-12">
              {/* Trilho + linha que se desenha */}
              <div
                aria-hidden
                className="absolute top-2 bottom-2 left-0 w-px bg-line"
              />
              <div
                ref={lineRef}
                aria-hidden
                className="absolute top-2 bottom-2 left-0 w-px origin-top bg-accent"
              />

              <ol className="space-y-12 md:space-y-16">
                {job.fronts.map((front, i) => (
                  <li key={front.label} className="relative">
                    <span
                      aria-hidden
                      className="absolute top-2.5 -left-8 h-1.5 w-1.5 rounded-full bg-accent md:-left-12"
                    />
                    <Reveal variant="up" delay={i * 0.04}>
                      <h4 className="font-display text-lg font-semibold md:text-xl">
                        {front.label}
                      </h4>
                      <p className="mt-3 max-w-2xl leading-relaxed text-fg-dim">
                        {front.detail}
                      </p>
                      <ul className="mt-4 flex flex-wrap gap-2">
                        {front.tags.map((tag) => (
                          <li
                            key={tag}
                            className="mono rounded-full border border-line px-3 py-1 text-[10px] tracking-[0.1em] text-fg-faint"
                          >
                            {tag}
                          </li>
                        ))}
                      </ul>
                    </Reveal>
                  </li>
                ))}
              </ol>
            </div>

            {/* Registro visual: fora do escritório e na bancada */}
            <div className="mt-20 md:mt-28">
              <Reveal variant="fade" className="mb-7 flex items-center gap-4">
                <span className="mono text-[11px] tracking-[0.3em] text-accent">
                  EM CAMPO
                </span>
                <span className="hairline flex-1" />
              </Reveal>
              <Gallery
                items={[photos.feira, photos.feiraPiso, photos.feiraApoio]}
                columns={3}
              />
            </div>

            <div className="mt-16 md:mt-20">
              <Reveal variant="fade" className="mb-7 flex items-center gap-4">
                <span className="mono text-[11px] tracking-[0.3em] text-accent">
                  NA BANCADA
                </span>
                <span className="hairline flex-1" />
              </Reveal>
              <Gallery
                items={[
                  photos.salaTrabalho,
                  photos.postoBanpara,
                  photos.placa,
                  photos.wifi,
                ]}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
