/**
 * Desenha a frente e o verso do crachá em <canvas>, para virar textura 3D.
 *
 * Por que canvas e não uma imagem pronta: o texto sai nítido em qualquer
 * resolução e sai direto de `content/cv.ts` — trocar cargo ou foto é editar
 * um arquivo de texto, não abrir editor de imagem.
 *
 * As cores são aproximações hex dos tokens OKLCH de globals.css. O canvas 2D
 * aceita oklch() só em navegadores recentes; hex funciona em todos.
 */

export const FACE = {
  /** 640×960 = 0.667, a mesma proporção do cartão 3D (1.6 × 2.4).
      Qualquer outra medida estica a textura. */
  width: 640,
  height: 960,
} as const;

const C = {
  sunken: "#08090c",
  surface: "#101319",
  raised: "#171b23",
  fg: "#f0f2f6",
  fgDim: "#9aa1ad",
  fgFaint: "#656b76",
  accent: "#26b6c7",
  accentDim: "#1a929f",
  line: "#262b34",
} as const;

export type BadgeFaceData = {
  mark: string;
  holder: string;
  role: string;
  specialty: string;
  location: string;
  serial: string;
};

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** Desenha a imagem cobrindo a área (object-fit: cover). */
function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
) {
  const scale = Math.max(w / img.width, h / img.height);
  const dw = img.width * scale;
  const dh = img.height * scale;
  ctx.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
}

/** Faixa de linhas verticais — leitura de credencial, puramente decorativa. */
function drawCodeStrip(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  seed: number,
) {
  let s = seed;
  const rnd = () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
  ctx.fillStyle = C.fgFaint;
  let cx = x;
  while (cx < x + w) {
    const bar = 2 + Math.round(rnd() * 5);
    const gap = 2 + Math.round(rnd() * 4);
    if (cx + bar > x + w) break;
    ctx.globalAlpha = 0.35 + rnd() * 0.5;
    ctx.fillRect(cx, y, bar, h);
    cx += bar + gap;
  }
  ctx.globalAlpha = 1;
}

/**
 * Frente do crachá. Se `photo` for uma imagem já carregada, ela entra na
 * janela do retrato; sem foto, entra um placeholder tipográfico honesto.
 */
export function drawBadgeFront(
  canvas: HTMLCanvasElement,
  data: BadgeFaceData,
  photo: HTMLImageElement | null,
) {
  const { width: W, height: H } = FACE;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.clearRect(0, 0, W, H);

  /* Fundo com leve verticalidade, para o crachá não parecer chapado */
  const bg = ctx.createLinearGradient(0, 0, W * 0.4, H);
  bg.addColorStop(0, C.raised);
  bg.addColorStop(0.55, C.surface);
  bg.addColorStop(1, C.sunken);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  /* Borda interna */
  ctx.strokeStyle = C.line;
  ctx.lineWidth = 3;
  roundRect(ctx, 10, 10, W - 20, H - 20, 26);
  ctx.stroke();

  const PAD = 52;

  /* ── Cabeçalho: marca + serial ─────────────────────────────── */
  ctx.fillStyle = C.accent;
  ctx.fillRect(PAD, 62, 46, 5);

  ctx.fillStyle = C.fg;
  ctx.font = "700 44px Sora, system-ui, sans-serif";
  ctx.textBaseline = "alphabetic";
  ctx.fillText(data.mark, PAD, 124);

  ctx.fillStyle = C.fgFaint;
  ctx.font = "500 20px 'JetBrains Mono', monospace";
  const serialW = ctx.measureText(data.serial).width;
  ctx.fillText(data.serial, W - PAD - serialW, 124);

  /* ── Janela do retrato ─────────────────────────────────────── */
  const px = PAD;
  const py = 156;
  const pw = W - PAD * 2;
  const ph = 540;

  ctx.save();
  roundRect(ctx, px, py, pw, ph, 14);
  ctx.clip();

  if (photo) {
    /* O retrato vem recortado do fundo, com transparência — então o que
       aparece atrás dele é este fundo, não a foto original. */
    const base = ctx.createLinearGradient(0, py, 0, py + ph);
    base.addColorStop(0, "#1c2029");
    base.addColorStop(1, "#0a0c10");
    ctx.fillStyle = base;
    ctx.fillRect(px, py, pw, ph);

    /* Halo do acento atrás da cabeça: separa o sujeito do fundo sem
       precisar de contorno desenhado. */
    const glow = ctx.createRadialGradient(
      px + pw / 2,
      py + ph * 0.36,
      8,
      px + pw / 2,
      py + ph * 0.36,
      pw * 0.66,
    );
    glow.addColorStop(0, "rgba(38,182,199,0.22)");
    glow.addColorStop(0.6, "rgba(38,182,199,0.06)");
    glow.addColorStop(1, "rgba(38,182,199,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(px, py, pw, ph);

    drawCover(ctx, photo, px, py, pw, ph);
    /* Escurecer o pé da foto para o texto abaixo respirar */
    const shade = ctx.createLinearGradient(0, py + ph * 0.6, 0, py + ph);
    shade.addColorStop(0, "rgba(8,9,12,0)");
    shade.addColorStop(1, "rgba(8,9,12,0.55)");
    ctx.fillStyle = shade;
    ctx.fillRect(px, py, pw, ph);
  } else {
    /* Placeholder: iniciais grandes, sem SVG quebrado nem cinza morto */
    ctx.fillStyle = C.sunken;
    ctx.fillRect(px, py, pw, ph);
    ctx.fillStyle = C.line;
    ctx.font = "700 240px Sora, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(data.mark, px + pw / 2, py + ph / 2 - 20);
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = C.fgFaint;
    ctx.font = "500 19px 'JetBrains Mono', monospace";
    const t = "SEM FOTO";
    const tw = ctx.measureText(t).width;
    ctx.fillText(t, px + pw / 2 - tw / 2, py + ph - 44);
  }
  ctx.restore();

  ctx.strokeStyle = C.line;
  ctx.lineWidth = 2;
  roundRect(ctx, px, py, pw, ph, 14);
  ctx.stroke();

  /* ── Identificação ─────────────────────────────────────────── */
  let y = py + ph + 60;

  ctx.fillStyle = C.fgFaint;
  ctx.font = "500 17px 'JetBrains Mono', monospace";
  ctx.letterSpacing = "3px";
  ctx.fillText("PORTADOR", PAD, y);
  ctx.letterSpacing = "0px";

  y += 50;
  ctx.fillStyle = C.fg;
  ctx.font = "600 45px Sora, system-ui, sans-serif";
  ctx.fillText(data.holder, PAD, y);

  y += 38;
  ctx.fillStyle = C.accent;
  ctx.font = "600 23px 'JetBrains Mono', monospace";
  ctx.letterSpacing = "1px";
  ctx.fillText(data.role, PAD, y);
  ctx.letterSpacing = "0px";

  y += 32;
  ctx.fillStyle = C.fgDim;
  ctx.font = "500 21px 'Plus Jakarta Sans', system-ui, sans-serif";
  ctx.fillText(data.specialty, PAD, y);

  /* ── Pé: local + faixa de código ───────────────────────────── */
  ctx.strokeStyle = C.line;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(PAD, H - 58);
  ctx.lineTo(W - PAD, H - 58);
  ctx.stroke();

  ctx.fillStyle = C.fgFaint;
  ctx.font = "500 18px 'JetBrains Mono', monospace";
  ctx.fillText(data.location, PAD, H - 24);

  drawCodeStrip(ctx, W - PAD - 160, H - 42, 160, 24, 20260909);
}

/** Verso: sóbrio, marca em negativo e um aviso de credencial pessoal. */
export function drawBadgeBack(canvas: HTMLCanvasElement, data: BadgeFaceData) {
  const { width: W, height: H } = FACE;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.fillStyle = C.sunken;
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = C.line;
  ctx.lineWidth = 3;
  roundRect(ctx, 10, 10, W - 20, H - 20, 26);
  ctx.stroke();

  ctx.save();
  ctx.translate(W / 2, H / 2);
  ctx.fillStyle = C.raised;
  ctx.font = "700 300px Sora, system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(data.mark, 0, 0);
  ctx.restore();

  ctx.fillStyle = C.fgFaint;
  ctx.font = "500 20px 'JetBrains Mono', monospace";
  ctx.textAlign = "center";
  ctx.fillText("CREDENCIAL PESSOAL DE PORTFÓLIO", W / 2, H - 150);
  ctx.fillStyle = C.line;
  ctx.fillText(data.serial, W / 2, H - 110);
  ctx.textAlign = "left";
}

/** Fita do cordão: texto repetido ao longo da tira. */
export function drawStrap(canvas: HTMLCanvasElement, text: string) {
  const W = 2048;
  const H = 128;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.fillStyle = C.raised;
  ctx.fillRect(0, 0, W, H);

  /* Vinco central, para a fita ter volume mesmo sem normal map */
  const crease = ctx.createLinearGradient(0, 0, 0, H);
  crease.addColorStop(0, "rgba(0,0,0,0.45)");
  crease.addColorStop(0.5, "rgba(255,255,255,0.05)");
  crease.addColorStop(1, "rgba(0,0,0,0.45)");
  ctx.fillStyle = crease;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = C.accentDim;
  ctx.fillRect(0, 8, W, 3);
  ctx.fillRect(0, H - 11, W, 3);

  ctx.fillStyle = C.fgDim;
  ctx.font = "600 42px 'JetBrains Mono', monospace";
  ctx.textBaseline = "middle";
  ctx.letterSpacing = "6px";

  const unit = ctx.measureText(text + " ").width;
  let x = 24;
  while (x < W) {
    ctx.fillText(text, x, H / 2 + 2);
    x += unit + 40;
  }
  ctx.letterSpacing = "0px";
}
