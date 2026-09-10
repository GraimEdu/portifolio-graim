"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { badge } from "@/content/cv";
import { asset } from "@/lib/asset";
import BadgeFallback from "./BadgeFallback";

/**
 * Decide qual crachá servir. O bundle 3D (three + rapier ≈ 500KB) só é
 * baixado quando o ambiente realmente vai usá-lo — nunca em celular, nunca
 * sem WebGL, nunca com `prefers-reduced-motion`.
 *
 * Layout: a versão 3D cobre a hero inteira, para o crachá poder ser
 * arrastado por toda a tela. A versão 2D entra no fluxo normal, empilhada
 * abaixo do texto.
 */
const LanyardScene = dynamic(() => import("./LanyardScene"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-start justify-center pt-32">
      <div className="mono animate-pulse text-[10px] tracking-[0.3em] text-fg-faint">
        CARREGANDO CREDENCIAL
      </div>
    </div>
  ),
});

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

export default function Badge() {
  const [use3D, setUse3D] = useState<boolean | null>(null);
  const [gpuFailed, setGpuFailed] = useState(false);

  useEffect(() => {
    const decide = () => {
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const wide = window.matchMedia("(min-width: 768px)").matches;
      const pointerFine = window.matchMedia("(pointer: fine)").matches;
      setUse3D(!reduced && wide && pointerFine && supportsWebGL());
    };
    decide();

    const mq = window.matchMedia("(min-width: 768px)");
    mq.addEventListener("change", decide);
    return () => mq.removeEventListener("change", decide);
  }, []);

  /* Caminho cru, carregado por `new Image()` na textura e por <img> no
     fallback — nenhum dos dois passa pelo basePath do Next sozinho. */
  const photoSrc = badge.photo ? asset(badge.photo) : null;

  const label = (
    <span className="sr-only">
      Crachá de {badge.holder}, {badge.role}, {badge.specialty},{" "}
      {badge.location}.
    </span>
  );

  /* Antes de decidir não renderizamos nada, para não haver troca visual. */
  if (use3D === null) return null;

  if (!use3D || gpuFailed) {
    return (
      <div className="relative z-10 flex justify-center pb-16">
        <BadgeFallback photoSrc={photoSrc} />
        {label}
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-20">
      <LanyardScene
        photoSrc={photoSrc}
        className="h-full w-full"
        onContextLost={() => setGpuFailed(true)}
      />
      <p className="mono pointer-events-none absolute inset-x-0 bottom-8 text-center text-[10px] tracking-[0.3em] text-fg-faint">
        ARRASTE O CRACHÁ
      </p>
      {label}
    </div>
  );
}
