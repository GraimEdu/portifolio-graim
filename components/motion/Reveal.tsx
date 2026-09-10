"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Variant = "up" | "mask" | "fade" | "stagger";

type Props = {
  children: ReactNode;
  as?: ElementType;
  variant?: Variant;
  delay?: number;
  className?: string;
  /** Seletor dos filhos a escalonar quando variant="stagger". */
  stagger?: string;
};

/**
 * Entrada de elementos na rolagem.
 *
 * Regra de ritmo: nada entra junto. Cada bloco tem seu próprio gatilho e um
 * `delay` opcional — é o escalonamento que separa um site com ritmo de um
 * site onde tudo pisca ao mesmo tempo.
 *
 * Se o GSAP não carregar, o CSS já deixa tudo visível (`html:not(.motion-ready)`),
 * então o conteúdo nunca fica preso invisível.
 */
export default function Reveal({
  children,
  as: Tag = "div",
  variant = "up",
  delay = 0,
  className,
  stagger = ":scope > *",
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(el, { opacity: 1, clearProps: "all" });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const common = {
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
        delay,
        ease: "power3.out",
      };

      if (variant === "stagger") {
        const kids = el.querySelectorAll(stagger);
        gsap.set(el, { opacity: 1 });
        gsap.fromTo(
          kids,
          { opacity: 0, y: 28 },
          { ...common, opacity: 1, y: 0, duration: 0.9, stagger: 0.07 },
        );
        return;
      }

      if (variant === "mask") {
        /* Revela por baixo de uma "cortina": o conteúdo sobe enquanto a
           máscara abre. Mais interessante que um fade e continua legível
           se a animação for cortada no meio. */
        gsap.fromTo(
          el,
          { opacity: 1, clipPath: "inset(0 0 100% 0)", y: 20 },
          {
            ...common,
            clipPath: "inset(0 0 0% 0)",
            y: 0,
            duration: 1.1,
          },
        );
        return;
      }

      gsap.fromTo(
        el,
        { opacity: 0, y: variant === "fade" ? 0 : 34 },
        { ...common, opacity: 1, y: 0, duration: 1 },
      );
    }, el);

    return () => ctx.revert();
  }, [variant, delay, stagger]);

  /* O tipo polimórfico de ElementType colapsa as props para `never`.
     Estreitar para "div" mantém o elemento real em runtime e devolve
     props checáveis. */
  const Component = Tag as "div";

  return (
    <Component
      ref={ref as React.Ref<HTMLDivElement>}
      data-reveal=""
      className={className}
    >
      {children}
    </Component>
  );
}
