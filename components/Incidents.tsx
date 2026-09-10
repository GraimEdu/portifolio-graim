import Reveal from "@/components/motion/Reveal";
import SectionHead from "@/components/SectionHead";
import { incidents } from "@/content/cv";

/**
 * Incidentes.
 *
 * A seção que diferencia este portfólio: quase nenhum currículo júnior de TI
 * mostra diagnóstico real, com código de erro e contexto. Os textos aqui são
 * a natureza técnica de cada problema; o relato pessoal de cada caso entra
 * pelo campo `note` em content/cv.ts quando o Eduardo escrever.
 */
export default function Incidents() {
  return (
    <section
      id="incidentes"
      className="border-t border-line px-6 py-24 md:px-12 md:py-36"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHead
          index="04"
          kicker="INCIDENTES"
          title="Coisas que quebraram — e por quê."
        />

        <Reveal variant="up" className="mb-14 max-w-2xl">
          <p className="leading-relaxed text-fg-dim">
            Casos que passaram pela minha mesa no Banpará. Registro cada um em
            laudo técnico porque diagnóstico que não é escrito vira folclore —
            e alguém vai gastar as mesmas horas de novo daqui a seis meses.
          </p>
        </Reveal>

        <div className="grid gap-px bg-line md:grid-cols-2">
          {incidents.map((inc, i) => (
            <Reveal
              key={inc.id}
              variant="up"
              delay={i * 0.05}
              className="group relative bg-surface p-8 transition-colors duration-500 hover:bg-surface-raised md:p-10"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="mono text-[10px] tracking-[0.2em] text-fg-faint">
                  {inc.area.toUpperCase()}
                </span>
                <span className="mono text-[10px] text-line-strong">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              <h3 className="font-display mt-5 text-xl leading-snug font-semibold">
                {inc.title}
              </h3>

              {inc.code && (
                <p className="mono mt-4 inline-block rounded border border-danger/30 bg-danger/10 px-2.5 py-1 text-[12px] text-danger">
                  {inc.code}
                </p>
              )}

              <p className="mt-5 text-sm leading-relaxed text-fg-dim">
                {inc.nature}
              </p>

              {inc.note && (
                <div className="mt-6">
                  <p className="mono text-[10px] tracking-[0.25em] text-accent">
                    COMO RESOLVI
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-fg">
                    {inc.note}
                  </p>
                </div>
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
