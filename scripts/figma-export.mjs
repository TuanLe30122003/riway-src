import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const FILE_KEY = process.env.FIGMA_FILE_KEY || "VLKz4IGevg4pQ3m1iQGQKC";
const TOKEN = process.env.FIGMA_TOKEN;
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC_DIR = join(ROOT, "public");
const IMAGE_DIR = join(PUBLIC_DIR, "images");
const FAVICON_SOURCE = "da2985dc023f258c463eadc354d72816b57779b4";
const INK = { r: 5, g: 13, b: 16, alpha: 1 };
const TRANSPARENT = { r: 0, g: 0, b: 0, alpha: 0 };

const IMAGES = {
  dd463802a9c83079bd5dd413440eeffde3989118: ["Common/logo-header", 600],
  ea0ca0b399b3e52de48e8466baca9fabd9bf893e: ["Common/logo-footer", 800],
  "809e4bbb37dc09049abede2f88d1c4c241f0585d": ["Common/globe-3d", 600],
  a949e10a5e8d3c4f1716eef1bcc692c6386c9579: ["Home/youtube-3d", 500],
  "2fe19750d24cc6834c5897a08a572761804b2072": ["Home/logo-3d", 900],
  af2a918d76547634f9ba7370fb36f089ef3a052f: ["Decor/magnifier-3d", 500],
  "3bc8d99704a535976f5188505c89c9f95c7e497f": ["Decor/script-3d", 400],
  "62b04904151a784670e18ec1e6198cd833240bff": ["Decor/film-strip-3d", 400],
  "78f0a66cd578244c64e58a52e81b579a0450bd65": ["Explore/hero", 2560],
  "3f4c738b88adaa615339f6648b841482402c58af": ["Posters/vertical-01", 900],
  "0ea52a37dc485770533f4733058db18cc2cd5cdf": ["Posters/vertical-02", 900],
  "79213ea1173be9d25818bc4922141cb7b3e68f98": ["Posters/vertical-03", 900],
  e931fbfd49e77f97a4d80e93f207151a7ed2f108: ["Posters/vertical-04", 900],
  cbf3713fa97134f001d41fd46165d87e4d919b9c: ["Posters/poster-01", 1200],
  "3b8f70a890624a4d36e28c5fb2a3ee9d0e89e5fd": ["Posters/poster-02", 1200],
  "526b77046d1e31cb6846c36d9a150bdbe2f30f8d": ["Posters/poster-03", 1200],
  "1d6af1780a645c07f6bda15a92e7864e1ba4468c": ["Posters/poster-04", 1200],
  "3bdfc64160cb4a9225814880a974ac658349bd67": ["Posters/poster-05", 1200],
  "087cc4272a3506f4fab0c63d66b66ad07d893f89": ["Posters/poster-06", 1200],
  abc883a403c63ebb925b885e5a9f9ad97e3b01d5: ["Posters/poster-07", 1200],
  effd2df92e993e6882693e7205b942d3b94282e5: ["Posters/poster-08", 1200],
  "07dc997e2c7e11c9718317119b91bd33dc417265": ["Posters/poster-09", 1200],
  "10d92ef72d2cac71194564a9f745781eb190d2cd": ["Posters/poster-10", 1200],
  d9070000ffa30fd297deafb5fa378283c13bf4f3: ["Posters/poster-11", 1200],
  baa05ab1d76c909b9cdb95591e759391b5a111c0: ["Posters/poster-12", 1200],
  "94f267bef77313e5444f3ac8a552b94dafdfbc30": ["Posters/poster-13", 1200],
  bd368c87f37a731fa8ae077d3cc8a5410aac6b61: ["Posters/poster-14", 1200],
  "1b055d72fa604011182fdfe94fa134bcdbf55af5": ["Posters/poster-15", 1200],
  "3c71ceb87b3c5e3a8710dd9d74d8acd76f43681b": ["Posters/poster-16", 1200],
  "33447441244adf36ecaeded46c4e306c26436bf4": ["Posters/poster-17", 1200],
  "6ecf58b6fd683f7d13acd2a66238b96244b9c17b": ["Posters/poster-18", 1200],
  "112b23def2714f274aa1ddee04ce5063cde5faf3": ["Posters/poster-19", 1200],
  "497f27ca99283e6dcc6ec044c66d0f4e619467dd": ["Posters/poster-20", 1200],
  fd8dd82092cb95580fe76c8e6303dd00f2255b24: ["Posters/poster-21", 1200],
  "85948551a11136024b6611e95558b924c927d9f3": ["Posters/poster-22", 1200],
  c510a3cf2969732a9e42280fac651216bdb70133: ["Posters/poster-23", 1200],
  "647515238da60758f360dbc689f9ad00118b8bba": ["Posters/poster-24", 1200],
  b799044504ddebfc096436c80548c9eae40eb2f8: ["Posters/poster-25", 1200],
  "9bc733a2103d64e50c009b8d1a98bc9e1c6bf779": ["Partners/partner-01", 480],
  e4634f6f8225bcefafc6996fdfb5a16ba546af2e: ["Partners/partner-02", 480],
  a32a7798ce390662d99f8f96fc6ecb87ca14e783: ["Partners/partner-03", 480],
  "1a8526a41933b7dcc49100b3e4023f627190f59c": ["Partners/partner-04", 480],
  "6ef053cbcffa4fb77168331dda5a57eb51d22413": ["Partners/partner-05", 480],
  c2cf8b7cf2768f18b805a7a2b428b357cc88448c: ["Partners/partner-06", 480],
  "9b67412e3c52f463970df1a5820651a68ddfd806": ["Partners/partner-07", 480],
  "8853d708ad166ec09e5de5a597185a5e9b7feb38": ["Partners/partner-08", 480],
  e28c5f5882dbd1afcbf4192efe8e38bbd6d1c1ef: ["Partners/partner-09", 480],
  "2b0f5380daa25ce6da24b03908d2a0700db8758b": ["Partners/partner-10", 480],
  eab59f4387b1efd7a4f381c25e83defc0ffbf287: ["Partners/partner-11", 480],
  f1394ed1fb6673b0910db89507c85b3692a02dc5: ["Partners/partner-12", 480],
};

async function figma(path) {
  const res = await fetch(`https://api.figma.com/v1${path}`, {
    headers: { "X-Figma-Token": TOKEN },
  });
  if (!res.ok) {
    throw new Error(`Figma API ${res.status} ${res.statusText} for ${path.split("?")[0]}`);
  }
  return res.json();
}

async function download(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

async function exportImages() {
  const { meta } = await figma(`/files/${FILE_KEY}/images`);
  const urls = meta?.images ?? {};
  let done = 0;
  const missing = [];
  await Promise.all(
    Object.entries(IMAGES).map(async ([ref, [name, maxWidth]]) => {
      const url = urls[ref];
      if (!url) {
        missing.push(name);
        return;
      }
      const input = await download(url);
      const output = join(IMAGE_DIR, `${name}.webp`);
      await mkdir(dirname(output), { recursive: true });
      await sharp(input)
        .resize({ width: maxWidth, withoutEnlargement: true })
        .webp({ quality: 82 })
        .toFile(output);
      done += 1;
    }),
  );
  console.log(`images: ${done}/${Object.keys(IMAGES).length} saved to public/images`);
  if (missing.length) console.warn(`images missing in file: ${missing.join(", ")}`);
  return urls;
}

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
  return sharp(input)
    .extract({ left, top, width: right - left + 1, height: bottom - top })
    .png()
    .toBuffer();
}

async function squareIcon(emblem, size, padding, background) {
  const inner = Math.round(size * (1 - padding * 2));
  const content = await sharp(emblem)
    .resize(inner, inner, { fit: "contain", background: TRANSPARENT })
    .toBuffer();
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

async function buildIcons(urls) {
  const url = urls[FAVICON_SOURCE];
  if (!url) {
    console.warn("favicon source missing in file, icons not updated");
    return;
  }
  const emblem = await cropEmblem(await download(url));

  const icoSizes = [16, 32, 48];
  const icoImages = await Promise.all(
    icoSizes.map(async (size) => ({ size, buffer: await squareIcon(emblem, size, 0.04, TRANSPARENT) })),
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

  console.log("icons: favicon.ico, icon-192.png, icon-512.png, apple-touch-icon.png");
}

async function buildOgImage() {
  const logo = join(IMAGE_DIR, "Common/logo-footer.webp");
  const hero = join(IMAGE_DIR, "Posters/poster-07.webp");
  const background = await sharp(hero)
    .resize(1200, 630, { fit: "cover" })
    .modulate({ brightness: 0.35 })
    .blur(2)
    .toBuffer();
  const logoLayer = await sharp(logo).resize({ width: 620 }).toBuffer();
  await sharp(background)
    .composite([{ input: logoLayer, gravity: "center" }])
    .jpeg({ quality: 85 })
    .toFile(join(IMAGE_DIR, "Common/og.jpg"));
  console.log("derived: og.jpg");
}

async function main() {
  if (!TOKEN) {
    console.error("Missing FIGMA_TOKEN. Add it to .env.local and run: yarn figma:export");
    process.exit(1);
  }
  const urls = await exportImages();
  await buildIcons(urls);
  await buildOgImage();
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
