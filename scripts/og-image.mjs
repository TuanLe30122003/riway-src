import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { ImageResponse } from "next/og.js";
import { createElement } from "react";
import sharp from "sharp";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const IMAGE_DIR = join(ROOT, "public/images");
const FONT = join(ROOT, "scripts/fonts/Inter-Medium.woff");
const WIDTH = 1200;
const HEIGHT = 630;
const LOGO_WIDTH = 700;
const TAGLINE = "MUSIC  ·  AI AUDIO  ·  CINEMATIC CONTENT";
const TAGLINE_HEIGHT = 48;

const backdrop = `
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">
  <defs>
    <radialGradient id="gold" cx="0.12" cy="0.1" r="0.62">
      <stop offset="0" stop-color="#fbba3f" stop-opacity="0.34"/>
      <stop offset="1" stop-color="#fbba3f" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="ocean" cx="0.9" cy="0.95" r="0.68">
      <stop offset="0" stop-color="#009bd4" stop-opacity="0.38"/>
      <stop offset="1" stop-color="#009bd4" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="halo" cx="0.5" cy="0.46" r="0.42">
      <stop offset="0" stop-color="#0d1c22" stop-opacity="1"/>
      <stop offset="1" stop-color="#050d10" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="line" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0" stop-color="#fbba3f"/>
      <stop offset="1" stop-color="#009bd4"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="#050d10"/>
  <rect width="100%" height="100%" fill="url(#gold)"/>
  <rect width="100%" height="100%" fill="url(#ocean)"/>
  <rect width="100%" height="100%" fill="url(#halo)"/>
  <rect x="40" y="40" width="${WIDTH - 80}" height="${HEIGHT - 80}" rx="28" fill="none" stroke="url(#line)" stroke-opacity="0.55" stroke-width="2"/>
</svg>`;

async function renderTagline() {
  const font = await readFile(FONT);
  const element = createElement(
    "div",
    {
      style: {
        display: "flex",
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        color: "#b3b3b3",
        fontFamily: "Inter",
        fontSize: 28,
        letterSpacing: 5,
        whiteSpace: "pre",
      },
    },
    TAGLINE,
  );
  const response = new ImageResponse(element, {
    width: WIDTH,
    height: TAGLINE_HEIGHT,
    fonts: [{ name: "Inter", data: font, weight: 500, style: "normal" }],
  });
  return Buffer.from(await response.arrayBuffer());
}

export async function buildOgImage() {
  const logo = await sharp(join(IMAGE_DIR, "Common/logo-footer.webp")).resize({ width: LOGO_WIDTH }).png().toBuffer();
  const { height: logoHeight = 0 } = await sharp(logo).metadata();
  const tagline = await renderTagline();

  const gap = 30;
  const top = Math.round((HEIGHT - (logoHeight + gap + TAGLINE_HEIGHT)) / 2) - 6;

  await sharp(Buffer.from(backdrop))
    .composite([
      { input: logo, left: Math.round((WIDTH - LOGO_WIDTH) / 2), top },
      { input: tagline, left: 0, top: top + logoHeight + gap },
    ])
    .jpeg({ quality: 90, mozjpeg: true })
    .toFile(join(IMAGE_DIR, "Common/og-image.jpg"));
  console.log("og: public/images/Common/og-image.jpg");
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  buildOgImage().catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}
