import Reveal from "@/components/motion/Reveal";

/** Cabeçalho comum das seções: índice, título e regra fina. */
export default function SectionHead({
  index,
  kicker,
  title,
}: {
  index: string;
  kicker: string;
  title: string;
}) {
  return (
    <div className="mb-14 md:mb-20">
      <Reveal variant="fade" className="flex items-center gap-4">
        <span className="mono text-[11px] tracking-[0.3em] text-accent">
          {index}
        </span>
        <span className="mono text-[11px] tracking-[0.3em] text-fg-faint">
          {kicker}
        </span>
      </Reveal>

      <Reveal variant="mask" as="h2" delay={0.1} className="mt-5">
        <span className="text-[clamp(2rem,5vw,3.6rem)]">{title}</span>
      </Reveal>
    </div>
  );
}
