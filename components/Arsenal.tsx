import Reveal from "@/components/motion/Reveal";
import SectionHead from "@/components/SectionHead";
import { arsenal } from "@/content/cv";

export default function Arsenal() {
  return (
    <section
      id="arsenal"
      className="border-t border-line px-6 py-24 md:px-12 md:py-36"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHead
          index="03"
          kicker="ARSENAL"
          title="O que eu opero de verdade."
        />

        {/* Grid de 1px: as divisas são o próprio fundo aparecendo entre
            os cards, em vez de bordas desenhadas em cada um. */}
        <div className="grid gap-px bg-line md:grid-cols-2 lg:grid-cols-3">
          {arsenal.map((track, i) => (
            <Reveal
              key={track.id}
              variant="up"
              delay={i * 0.06}
              className="group bg-surface p-8 transition-colors duration-500 hover:bg-surface-raised md:p-10"
            >
              <div className="flex items-baseline justify-between">
                <h3 className="font-display text-xl font-semibold">
                  {track.label}
                </h3>
                <span className="mono text-[10px] text-fg-faint">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              <p className="mt-2 text-sm text-fg-faint">{track.kicker}</p>

              <div className="mt-6 h-px w-8 bg-line-strong transition-all duration-500 group-hover:w-16 group-hover:bg-accent" />

              <ul className="mt-6 space-y-2.5">
                {track.items.map((item) => (
                  <li
                    key={item}
                    className="mono flex items-start gap-2.5 text-[13px] text-fg-dim"
                  >
                    <span className="mt-2 h-px w-2 shrink-0 bg-accent-faint" />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
