import Image from "next/image";
import Reveal from "@/components/motion/Reveal";
import { asset } from "@/lib/asset";
import type { Photo } from "@/content/cv";

/**
 * Tira de fotos do trabalho.
 *
 * Preto e branco por padrão, cor no hover: mantém a seção coesa mesmo com
 * fotos de origens e iluminações muito diferentes — que é exatamente o caso
 * de foto de celular tirada em evento, em sala e no colo.
 */
export default function Gallery({
  items,
  columns = 2,
}: {
  items: Photo[];
  columns?: 2 | 3;
}) {
  return (
    <div
      className={`grid gap-4 md:gap-6 ${
        columns === 3 ? "md:grid-cols-3" : "md:grid-cols-2"
      }`}
    >
      {items.map((photo, i) => (
        <Reveal key={photo.src} variant="mask" delay={i * 0.06}>
          <div
            className={`group relative overflow-hidden rounded-sm border border-line ${
              photo.ratio === "tall" ? "aspect-[3/4]" : "aspect-[4/3]"
            }`}
          >
            <Image
              src={asset(photo.src)}
              alt={photo.alt}
              fill
              sizes="(max-width: 768px) 100vw, 540px"
              className="scale-[1.03] object-cover grayscale transition-all duration-700 group-hover:scale-100 group-hover:grayscale-0"
            />
          </div>
        </Reveal>
      ))}
    </div>
  );
}
