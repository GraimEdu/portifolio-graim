import type { Metadata, Viewport } from "next";
import { Sora, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { identity } from "@/content/cv";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: `${identity.shortName} — ${identity.roleShort}`,
  description: `${identity.fullName}. ${identity.objective} Estagiário de TI no Banpará, com atuação em Suporte N2 e Helpdesk: Active Directory, GPO, Microsoft 365, ICP-Brasil e segurança de endpoint.`,
  authors: [{ name: identity.fullName }],
  keywords: [
    "Suporte Técnico N2",
    "Infraestrutura de TI",
    "Segurança da Informação",
    "Active Directory",
    "ICP-Brasil",
    "Belém",
    "Pará",
  ],
  openGraph: {
    title: `${identity.shortName} — ${identity.roleShort}`,
    description: identity.objective,
    locale: "pt_BR",
    type: "profile",
  },
};

export const viewport: Viewport = {
  themeColor: "#101319",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className={`${sora.variable} ${jakarta.variable} ${jetbrains.variable} antialiased`}
    >
      <body>
        <div className="grain" aria-hidden />
        {children}
      </body>
    </html>
  );
}
