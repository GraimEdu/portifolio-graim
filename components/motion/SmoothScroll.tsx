"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Scroll suave (Lenis) amarrado ao ScrollTrigger.
 *
 * O ponto crítico é a ordem: o Lenis precisa rodar dentro do ticker do GSAP,
 * senão os dois mantêm relógios diferentes e as animações de scroll chegam
 * atrasadas em relação ao conteúdo — aquele efeito de elemento "escorregando"
 * depois da rolagem.
 */
export default function SmoothScroll() {
  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    gsap.registerPlugin(ScrollTrigger);
    document.documentElement.classList.add("motion-ready");

    if (reduced) {
      /* Sem scroll sintético: quem pediu menos movimento recebe o scroll
         nativo do navegador, e os reveals já aparecem prontos via CSS. */
      return () => {
        document.documentElement.classList.remove("motion-ready");
      };
    }

    const lenis = new Lenis({
      duration: 1.6,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      document.documentElement.classList.remove("motion-ready");
    };
  }, []);

  return null;
}
