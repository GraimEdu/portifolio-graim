import Badge from "@/components/badge/Badge";
import Reveal from "@/components/motion/Reveal";
import { identity } from "@/content/cv";

/**
 * Hero.
 *
 * O crachá cobre a seção inteira (z-20) para poder ser arrastado por toda a
 * tela. Em troca, o texto daqui é só leitura — não há link nem botão sob a
 * cena, então nada de interativo fica bloqueado.
 */
export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-dvh flex-col justify-center overflow-hidden px-6 pt-28 pb-20 md:px-12"
    >
      {/* Marca d'água tipográfica ao fundo */}
      <span
        aria-hidden
        className="font-display pointer-events-none absolute -bottom-10 -left-6 z-0 text-[26vw] leading-none font-bold text-surface-raised/60 select-none md:-bottom-20"
      >
        {identity.initials}
      </span>

      {/* z-30 fica ACIMA da cena do crachá (z-20): assim o texto continua
          selecionável e o link continua clicável. Arrastar segue funcionando
          por toda a tela — a captura de ponteiro mantém o arrasto vivo mesmo
          quando o crachá passa por baixo do título. */}
      <div className="pointer-events-none relative z-30 max-w-3xl [&>*]:pointer-events-auto">
        <Reveal variant="fade" as="p">
          <span className="mono text-[11px] tracking-[0.3em] text-fg-faint">
            {identity.city.toUpperCase()}
          </span>
        </Reveal>

        <Reveal variant="mask" as="h1" delay={0.1}>
          <span className="block text-[clamp(2.6rem,8vw,5.5rem)]">
            Eduardo
          </span>
          <span className="block text-[clamp(2.6rem,8vw,5.5rem)] text-fg-dim">
            Graim
          </span>
        </Reveal>

        <Reveal variant="up" delay={0.35} className="mt-7">
          <p className="mono text-sm tracking-[0.12em] text-accent md:text-base">
            SUPORTE N2 · INFRAESTRUTURA · SEGURANÇA DA INFORMAÇÃO
          </p>
        </Reveal>

        <Reveal variant="up" delay={0.5} className="mt-6 max-w-xl">
          <p className="text-[15px] leading-relaxed text-fg-dim md:text-base">
            Estagiário de TI no Banpará, em ambiente bancário. Trabalho com
            Active Directory, GPO, Microsoft 365, certificados ICP-Brasil e
            segurança de endpoint — e gosto principalmente da parte em que é
            preciso descobrir <em className="text-fg not-italic">por que</em>{" "}
            quebrou.
          </p>
        </Reveal>

        <Reveal variant="up" delay={0.65} className="mt-10">
          <a
            href="#experiencia"
            className="mono group inline-flex items-center gap-3 text-[11px] tracking-[0.25em] text-fg-faint transition-colors hover:text-fg"
          >
            VER EXPERIÊNCIA
            <span className="h-px w-10 bg-line-strong transition-all duration-500 group-hover:w-16 group-hover:bg-accent" />
          </a>
        </Reveal>
      </div>

      <Badge />
    </section>
  );
}
