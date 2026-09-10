"use client";

import { useEffect, useState } from "react";
import { identity, nav } from "@/content/cv";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-5 transition-colors duration-500 md:px-12 ${
        scrolled
          ? "border-b border-line bg-surface/80 backdrop-blur-md"
          : "border-b border-transparent"
      }`}
    >
      <a
        href="#top"
        className="font-display text-lg font-bold tracking-tight"
        aria-label={`${identity.shortName} — início`}
      >
        {identity.initials}
        <span className="text-accent">.</span>
      </a>

      <nav className="hidden items-center gap-7 md:flex">
        {nav.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="mono text-[11px] tracking-[0.15em] text-fg-dim transition-colors duration-200 hover:text-fg"
          >
            {item.label}
          </a>
        ))}
      </nav>

      <span className="mono flex items-center gap-2 text-[10px] tracking-[0.15em] text-fg-faint">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
        </span>
        ESTAGIÁRIO DE TI · BANPARÁ
      </span>
    </header>
  );
}
