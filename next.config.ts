import type { NextConfig } from "next";

/**
 * O GitHub Pages serve arquivo estático, e o site mora em um subcaminho
 * (/portifolio-graim), não na raiz do domínio. Então a build de publicação
 * precisa de três coisas que a build local não precisa: export estático,
 * `basePath` e imagens sem o otimizador (que exige servidor).
 *
 * Tudo fica atrás de GITHUB_PAGES=true para o `npm run dev` continuar
 * rodando na raiz, como sempre.
 */
const isPages = process.env.GITHUB_PAGES === "true";
const basePath = isPages ? "/portifolio-graim" : "";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  ...(isPages
    ? {
        output: "export" as const,
        basePath,
        images: { unoptimized: true },
      }
    : {}),

  /* O Next prefixa o basePath sozinho em <Image> e <Link>, mas não em URL
     montada à mão em JavaScript — que é o caso da foto do crachá, carregada
     via `new Image()` para virar textura. Por isso o valor é exposto. */
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
