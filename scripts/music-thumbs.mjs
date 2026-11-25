import { mkdir, readdir, rm } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = join(ROOT, "public/images/Music");
const WIDTH = 1200;
const HEIGHT = 675;
const IMAGE = /\.(png|jpe?g|webp)$/i;

const source = process.argv[2];
if (!source) {
  console.error("Usage: yarn music:thumbs <folder>");
  process.exit(1);
}

const files = (await readdir(source))
  .filter((file) => IMAGE.test(file))
  .sort((a, b) => a.localeCompare(b, "en", { numeric: true }));

if (files.length === 0) {
  console.error(`No images found in ${source}`);
  process.exit(1);
}

await rm(OUT_DIR, { recursive: true, force: true });
await mkdir(OUT_DIR, { recursive: true });

for (const [index, file] of files.entries()) {
  const name = `music-${String(index + 1).padStart(2, "0")}.webp`;
  await sharp(join(source, file))
    .resize(WIDTH, HEIGHT, { fit: "cover" })
    .webp({ quality: 82 })
    .toFile(join(OUT_DIR, name));
  console.log(`${name}  <-  ${file}`);
}

console.log(`\nMUSIC_COUNT in constants/posters.ts should be ${files.length}`);
