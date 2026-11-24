import { mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const FILE_KEY = process.env.FIGMA_FILE_KEY || "VLKz4IGevg4pQ3m1iQGQKC";
const TOKEN = process.env.FIGMA_TOKEN;
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const IMAGE_DIR = join(ROOT, "public", "images");

const IMAGES = {
  "809e4bbb37dc09049abede2f88d1c4c241f0585d": ["Common/globe-3d", 600],
  a949e10a5e8d3c4f1716eef1bcc692c6386c9579: ["Home/youtube-3d", 500],
  "2fe19750d24cc6834c5897a08a572761804b2072": ["Home/logo-3d", 900],
  af2a918d76547634f9ba7370fb36f089ef3a052f: ["Decor/magnifier-3d", 500],
  "3bc8d99704a535976f5188505c89c9f95c7e497f": ["Decor/script-3d", 400],
  "62b04904151a784670e18ec1e6198cd833240bff": ["Decor/film-strip-3d", 400],
  bbb4badfb610379fb25400daab9c7c67e085e4a9: ["Explore/hero", 2560],
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
}

async function main() {
  if (!TOKEN) {
    console.error("Missing FIGMA_TOKEN. Add it to .env.local and run: yarn figma:export");
    process.exit(1);
  }
  await exportImages();
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
