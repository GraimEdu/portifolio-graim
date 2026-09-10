"use client";

import { useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import {
  drawBadgeBack,
  drawBadgeFront,
  drawStrap,
  type BadgeFaceData,
} from "./badgeFace";

/**
 * Transforma o desenho 2D do crachá em texturas do three.js.
 *
 * A foto entra de forma assíncrona: a textura nasce com o placeholder
 * tipográfico e é redesenhada quando a imagem termina de carregar. Assim o
 * crachá nunca aparece vazio nem espera a rede para existir.
 */
export function useBadgeTextures(
  data: BadgeFaceData & { strapText: string },
  photoSrc: string | null,
) {
  /* Guardamos o par (src, img) e derivamos a foto válida no render. Sem isso
     seria preciso um setState síncrono dentro do efeito só para zerar a foto
     quando o src muda — cascata de render desnecessária. */
  const [loaded, setLoaded] = useState<{
    src: string;
    img: HTMLImageElement;
  } | null>(null);

  useEffect(() => {
    if (!photoSrc) return;
    let alive = true;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (alive) setLoaded({ src: photoSrc, img });
    };
    img.src = photoSrc;
    return () => {
      alive = false;
    };
  }, [photoSrc]);

  const photo = loaded && loaded.src === photoSrc ? loaded.img : null;

  const textures = useMemo(() => {
    const make = () => {
      const t = new THREE.CanvasTexture(document.createElement("canvas"));
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 8;
      return t;
    };
    const front = make();
    const back = make();
    const strap = make();
    strap.wrapS = strap.wrapT = THREE.RepeatWrapping;
    return { front, back, strap };
  }, []);

  /* ─────────────────────────────────────────────────────────────
     Fronteira imperativa: daqui para baixo mexemos em objetos de GPU.
     `needsUpdate` é exatamente o "atualizar sistema externo com o estado
     mais recente do React" descrito na doc de efeitos — o React Compiler
     lê isso como mutação de valor vindo de hook e acusa falso positivo.
     ───────────────────────────────────────────────────────────── */

  useEffect(() => {
    drawBadgeFront(textures.front.image as HTMLCanvasElement, data, photo);
    // eslint-disable-next-line react-hooks/immutability
    textures.front.needsUpdate = true;
  }, [textures, data, photo]);

  useEffect(() => {
    drawBadgeBack(textures.back.image as HTMLCanvasElement, data);
    // eslint-disable-next-line react-hooks/immutability
    textures.back.needsUpdate = true;
  }, [textures, data]);

  useEffect(() => {
    drawStrap(textures.strap.image as HTMLCanvasElement, data.strapText);
    // eslint-disable-next-line react-hooks/immutability
    textures.strap.needsUpdate = true;
  }, [textures, data.strapText]);

  /* Liberar memória de GPU ao desmontar */
  useEffect(() => {
    return () => {
      textures.front.dispose();
      textures.back.dispose();
      textures.strap.dispose();
    };
  }, [textures]);

  return textures;
}
