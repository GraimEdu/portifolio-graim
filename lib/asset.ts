/**
 * Prefixa o basePath em caminhos usados fora do Next.
 *
 * `<Image>` e `<Link>` recebem o basePath automaticamente. Uma URL montada
 * em JavaScript — `new Image().src`, por exemplo — não recebe, e quebra
 * silenciosamente quando o site é servido em um subcaminho como
 * /portifolio-graim no GitHub Pages.
 */
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function asset(path: string): string {
  return `${BASE}${path}`;
}
