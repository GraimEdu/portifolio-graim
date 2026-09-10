import Reveal from "@/components/motion/Reveal";
import { identity } from "@/content/cv";

export default function Contact() {
  const whatsapp = `https://wa.me/55${identity.phone.replace(/\D/g, "")}`;

  return (
    <section
      id="contato"
      className="relative overflow-hidden border-t border-line px-6 py-24 md:px-12 md:py-40"
    >
      <span
        aria-hidden
        className="font-display pointer-events-none absolute -right-6 -bottom-16 text-[24vw] leading-none font-bold text-surface-raised/50 select-none"
      >
        {identity.initials}
      </span>

      <div className="relative mx-auto max-w-6xl">
        <Reveal variant="fade">
          <span className="mono text-[11px] tracking-[0.3em] text-accent">
            07 — CONTATO
          </span>
        </Reveal>

        <Reveal variant="mask" as="h2" delay={0.1} className="mt-6 max-w-3xl">
          <span className="text-[clamp(2rem,6vw,4.4rem)]">
            Disponível para vagas de suporte, infraestrutura e segurança.
          </span>
        </Reveal>

        <Reveal variant="up" delay={0.3} className="mt-14">
          <a
            href={`mailto:${identity.email}`}
            className="group inline-flex items-center gap-4 text-xl transition-colors duration-300 hover:text-accent md:text-3xl"
          >
            {identity.email}
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </a>
        </Reveal>

        <Reveal
          variant="stagger"
          delay={0.35}
          className="mt-14 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4"
        >
          <ContactItem label="TELEFONE" value={identity.phone} href={whatsapp} />
          <ContactItem
            label="LINKEDIN"
            value="/in/eduardo-graim"
            href={identity.linkedinUrl}
          />
          <ContactItem
            label="GITHUB"
            value="/GraimEdu"
            href={identity.githubUrl}
          />
          <ContactItem label="LOCALIZAÇÃO" value={identity.location} />
        </Reveal>

        <footer className="mt-24 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-8">
          <span className="mono text-[10px] tracking-[0.2em] text-fg-faint">
            © {new Date().getFullYear()} {identity.fullName.toUpperCase()}
          </span>
          <span className="mono text-[10px] tracking-[0.2em] text-fg-faint">
            BELÉM · PARÁ
          </span>
        </footer>
      </div>
    </section>
  );
}

function ContactItem({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  const body = (
    <>
      <span className="mono block text-[10px] tracking-[0.25em] text-fg-faint">
        {label}
      </span>
      <span className="mt-2 block text-sm text-fg">{value}</span>
    </>
  );

  return href ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-surface p-6 transition-colors duration-300 hover:bg-surface-raised"
    >
      {body}
    </a>
  ) : (
    <div className="bg-surface p-6">{body}</div>
  );
}
