"use client";

import { badge } from "@/content/cv";

/**
 * Crachá 2D — versão servida em telas pequenas, sem WebGL ou com
 * `prefers-reduced-motion`. Mesmo desenho, sem three.js e sem física:
 * economiza ~500KB de JS onde o 3D não se paga.
 */
export default function BadgeFallback({
  photoSrc,
  className,
}: {
  photoSrc: string | null;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col items-center justify-start ${className ?? ""}`}
    >
      {/* Cordão */}
      <div className="relative flex h-24 w-11 justify-center overflow-hidden rounded-b-sm bg-surface-raised sm:h-32">
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-full opacity-70"
          style={{
            background:
              "linear-gradient(90deg, rgba(0,0,0,.45), rgba(255,255,255,.05) 50%, rgba(0,0,0,.45))",
          }}
        />
        <span className="mono absolute top-2 origin-center rotate-90 whitespace-nowrap text-[9px] tracking-[0.3em] text-fg-faint">
          {badge.role}
        </span>
        <div className="absolute inset-x-0 top-1 h-px bg-accent-dim" />
        <div className="absolute inset-x-0 bottom-1 h-px bg-accent-dim" />
      </div>

      {/* Presilha */}
      <div className="h-2 w-9 rounded-sm bg-fg-faint/70" />
      <div className="h-3 w-3 -mt-1 rounded-full border-2 border-fg-faint/70" />

      {/* Cartão */}
      <div className="badge-swing mt-1 w-[min(78vw,17rem)] origin-top rounded-2xl border border-line bg-gradient-to-br from-surface-raised via-surface to-surface-sunken p-4 shadow-[0_30px_60px_-20px_rgba(0,0,0,.8)]">
        <div className="flex items-start justify-between">
          <div>
            <div className="mb-2 h-[3px] w-7 bg-accent" />
            <span className="font-display text-xl font-bold">{badge.mark}</span>
          </div>
          <span className="mono text-[10px] text-fg-faint">{badge.serial}</span>
        </div>

        <div className="mt-3 aspect-[4/5] overflow-hidden rounded-lg border border-line bg-surface-sunken">
          {photoSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photoSrc}
              alt={`Retrato de ${badge.holder}`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2">
              <span className="font-display text-6xl font-bold text-line">
                {badge.mark}
              </span>
              <span className="mono text-[10px] tracking-widest text-fg-faint">
                SEM FOTO
              </span>
            </div>
          )}
        </div>

        <p className="mono mt-4 text-[10px] tracking-[0.25em] text-fg-faint">
          PORTADOR
        </p>
        <p className="font-display mt-1 text-lg font-semibold">
          {badge.holder}
        </p>
        <p className="mono mt-1 text-xs text-accent">{badge.role}</p>
        <p className="mt-0.5 text-xs text-fg-dim">{badge.specialty}</p>

        <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
          <span className="mono text-[10px] text-fg-faint">
            {badge.location}
          </span>
          <span
            aria-hidden
            className="h-4 w-16 opacity-50"
            style={{
              background:
                "repeating-linear-gradient(90deg, var(--on-surface-faint) 0 2px, transparent 2px 5px)",
            }}
          />
        </div>
      </div>

      <style>{`
        .badge-swing {
          animation: badge-swing 7s var(--ease) infinite;
        }
        @keyframes badge-swing {
          0%, 100% { transform: rotate(-1.4deg); }
          50%      { transform: rotate(1.4deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .badge-swing { animation: none; }
        }
      `}</style>
    </div>
  );
}
