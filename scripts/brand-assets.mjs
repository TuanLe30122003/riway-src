import { mkdir, readdir, rm, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { buildOgImage } from "./og-image.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC_DIR = join(ROOT, "public");
const IMAGE_DIR = join(PUBLIC_DIR, "images");
const INK = { r: 5, g: 13, b: 16, alpha: 1 };
const TRANSPARENT = { r: 0, g: 0, b: 0, alpha: 0 };

const LOGOS = {
  header: "Logo RIWAY MEDIA GROUP-08.png",
  footer: "Logo RIWAY MEDIA GROUP-06.png",
  emblem: "Logo RIWAY MEDIA GROUP-01.png",
};

async function cropEmblem(input) {
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const rowFilled = (y) => {
    for (let x = 0; x < width; x += 1) if (data[(y * width + x) * channels + 3] > 24) return true;
    return false;
  };
  let top = 0;
  while (top < height && !rowFilled(top)) top += 1;
  let bottom = top;
  while (bottom < height && rowFilled(bottom)) bottom += 1;
  let left = width;
  let right = 0;
  for (let y = top; y < bottom; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (data[(y * width + x) * channels + 3] > 24) {
        left = Math.min(left, x);
        right = Math.max(right, x);
      }
    }
  }
  return sharp(input).extract({ left, top, width: right - left + 1, height: bottom - top }).png().toBuffer();
}

async function squareIcon(emblem, size, padding, background) {
  const inner = Math.round(size * (1 - padding * 2));
  const content = await sharp(emblem).resize(inner, inner, { fit: "contain", background: TRANSPARENT }).toBuffer();
  return sharp({ create: { width: size, height: size, channels: 4, background } })
    .composite([{ input: content, gravity: "center" }])
    .png()
    .toBuffer();
}

function toIco(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  const directory = Buffer.alloc(16 * images.length);
  let offset = header.length + directory.length;
  images.forEach(({ size, buffer }, index) => {
    const entry = index * 16;
    directory.writeUInt8(size >= 256 ? 0 : size, entry);
    directory.writeUInt8(size >= 256 ? 0 : size, entry + 1);
    directory.writeUInt16LE(1, entry + 4);
    directory.writeUInt16LE(32, entry + 6);
    directory.writeUInt32LE(buffer.length, entry + 8);
    directory.writeUInt32LE(offset, entry + 12);
    offset += buffer.length;
  });
  return Buffer.concat([header, directory, ...images.map((image) => image.buffer)]);
}

async function buildLogos(logoDir) {
  await mkdir(join(IMAGE_DIR, "Common"), { recursive: true });
  await sharp(join(logoDir, LOGOS.header))
    .resize({ width: 690 })
    .webp({ quality: 90 })
    .toFile(join(IMAGE_DIR, "Common/logo-header.webp"));
  await sharp(join(logoDir, LOGOS.footer))
    .resize({ width: 1170 })
    .webp({ quality: 90 })
    .toFile(join(IMAGE_DIR, "Common/logo-footer.webp"));

  const emblem = await cropEmblem(join(logoDir, LOGOS.emblem));
  const icoImages = await Promise.all(
    [16, 32, 48].map(async (size) => ({ size, buffer: await squareIcon(emblem, size, 0.04, TRANSPARENT) })),
  );
  await writeFile(join(PUBLIC_DIR, "favicon.ico"), toIco(icoImages));
  const pngIcons = [
    ["icon-192.png", 192, 0.16],
    ["icon-512.png", 512, 0.16],
    ["apple-touch-icon.png", 180, 0.14],
  ];
  await Promise.all(
    pngIcons.map(async ([name, size, padding]) =>
      writeFile(join(PUBLIC_DIR, name), await squareIcon(emblem, size, padding, INK)),
    ),
  );
  console.log("logos: header, footer, favicon.ico, icon-192, icon-512, apple-touch-icon");
}

async function isLightCorner(input) {
  const { data, info } = await sharp(input).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const corners = [0, info.width - 1, (info.height - 1) * info.width, info.height * info.width - 1];
  return corners.every((index) => {
    const offset = index * info.channels;
    return data[offset] > 235 && data[offset + 1] > 235 && data[offset + 2] > 235;
  });
}

async function buildPartners(partnerDir) {
  const files = (await readdir(partnerDir))
    .filter((file) => file.toLowerCase().endsWith(".png"))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  const output = join(IMAGE_DIR, "Partners");
  await rm(output, { recursive: true, force: true });
  await mkdir(output, { recursive: true });
  await Promise.all(
    files.map(async (file, index) => {
      const input = join(partnerDir, file);
      const light = await isLightCorner(input);
      let pipeline = sharp(input);
      if (light) pipeline = pipeline.trim({ background: "#ffffff", threshold: 18 });
      const buffer = await pipeline.png().toBuffer();
      await sharp(buffer)
        .resize({ width: 420, height: 220, fit: "inside", withoutEnlargement: true })
        .webp({ quality: 90 })
        .toFile(join(output, `partner-${String(index + 1).padStart(2, "0")}.webp`));
    }),
  );
  console.log(`partners: ${files.length} logos saved to public/images/Partners`);
}

async function main() {
  const brandDir = process.argv[2] ?? process.env.BRAND_DIR;
  if (!brandDir) {
    console.error("Usage: yarn brand:assets <folder chứa logos/ và partners/>");
    process.exit(1);
  }
  const base = resolve(brandDir);
  await buildLogos(join(base, "logos"));
  await buildPartners(join(base, "partners"));
  await buildOgImage();
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
