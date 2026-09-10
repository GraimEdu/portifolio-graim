# Portfólio — Eduardo Graim

Portfólio pessoal de **Eduardo Melo Graim de Matos** — Suporte Técnico N2,
Infraestrutura e Segurança da Informação. Belém/PA.

O elemento central é um **crachá 3D pendurado num cordão**, com física real:
dá para arrastá-lo por toda a área do hero, e ele balança e assenta sozinho.

## Stack

| Camada | Escolha |
|---|---|
| Framework | Next.js 16 (App Router) + React 19 + TypeScript |
| Estilo | Tailwind CSS 4, tokens em OKLCH |
| 3D e física | three.js · @react-three/fiber · @react-three/drei · @react-three/rapier · meshline |
| Movimento | GSAP + ScrollTrigger · Lenis (scroll suave) |
| Tipografia | Sora (display) · Plus Jakarta Sans (texto) · JetBrains Mono (técnico) |

Versões das dependências 3D estão **fixadas** (sem `^`): a combinação
three / R3F / rapier é sensível e uma atualização automática quebra a cena.

## Rodando

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de produção
npm start        # serve o build
```

## Estrutura

```
app/                  layout, página e tokens de estilo
components/
  badge/              o crachá 3D
    LanyardScene.tsx  cena R3F: corda, juntas, arrasto
    badgeFace.ts      a face do cartão, desenhada em canvas 2D
    useBadgeTextures  canvas -> textura do three.js
    BadgeFallback     versão 2D, sem WebGL
  motion/             SmoothScroll (Lenis) e Reveal (ScrollTrigger)
  ...                 uma seção por arquivo
content/cv.ts         TODO o conteúdo do site, tipado
public/images/        fotos
```

### Onde editar o conteúdo

Tudo vive em [`content/cv.ts`](content/cv.ts) — currículo, projetos,
incidentes, fotos e os dados impressos no crachá. Nenhuma seção tem texto
escrito direto no componente, então atualizar o currículo é mexer num arquivo
só.

## Como o crachá funciona

```
âncora fixa ──corda──> j1 ──corda──> j2 ──corda──> j3 ──esférica──> cartão
```

Quatro corpos rígidos do Rapier ligados por três `useRopeJoint` e uma
`useSphericalJoint`. A fita é uma `MeshLineGeometry` redesenhada a cada frame
a partir de uma `CatmullRomCurve3` — com parametrização **centripetal**, não
chordal: com pontos de controle mal espaçados a chordal gera tangentes enormes
e a fita dispara para fora da cena.

Ao arrastar, o corpo do cartão vira cinemático e persegue o cursor; ao soltar,
a física assume. O comprimento da corda é proporcional à área visível, para o
alcance acompanhar o tamanho da tela.

A face do cartão não é uma imagem pronta: é desenhada em `<canvas>` a partir de
`content/cv.ts` e virada em textura. Texto sai nítido em qualquer resolução e
trocar cargo ou foto é editar texto.

**Degradação:** em telas pequenas, sem WebGL ou com `prefers-reduced-motion`,
entra um crachá 2D em CSS — os ~500KB do bundle 3D nem chegam a ser baixados.

## Privacidade nas fotos

As fotos de trabalho passam por revisão antes de virar asset. Fotos com tela
ligada têm a área do monitor desfocada quando havia chamado, e-mail ou dado de
usuário visível. Isso é regra, não exceção — está anotado em `content/cv.ts`.

---

© 2026 Eduardo Graim
