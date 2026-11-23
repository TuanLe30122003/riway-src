# riway-src

Website của RIWAY MEDIA GROUP, dựng theo thiết kế Figma `VLKz4IGevg4pQ3m1iQGQKC/Riway`. Hiệu ứng tham khảo theo phong cách https://www.bplusvn.com/en.

## Stack

- Next.js 15 (App Router), React 19, TypeScript
- Tailwind CSS 4: token khai báo bằng `@theme` trong `app/[locale]/globals.css`
- next-intl 4: hai ngôn ngữ `en` (mặc định) và `vi`, URL dạng `/[locale]/...`
- framer-motion, lenis (smooth scroll), embla-carousel, react-fast-marquee
- react-hook-form + zod cho form liên hệ

## Bắt đầu

Cần Node 20.12 trở lên (xem `.nvmrc`).

```bash
yarn install
cp .env.example .env.local
yarn dev
```

Mở http://localhost:3000. Trang gốc sẽ tự chuyển sang `/en`.

| Lệnh | Mô tả |
| --- | --- |
| `yarn dev` | Chạy dev server (Turbopack) |
| `yarn build` / `yarn start` | Build và chạy bản production (các trang được render tĩnh) |
| `yarn lint` | ESLint |
| `yarn typecheck` | Kiểm tra TypeScript |
| `yarn figma:export` | Tải lại ảnh từ Figma vào `public/images` |

## Biến môi trường

| Biến | Ý nghĩa |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Domain chính thức, dùng cho canonical, hreflang, Open Graph, sitemap và robots. Để trống thì trên Vercel tự dùng domain production của project (`VERCEL_PROJECT_PRODUCTION_URL`) |
| `FIGMA_TOKEN` | Personal access token của Figma (scope `file_content:read`). Chỉ cần khi chạy `yarn figma:export` |
| `FIGMA_FILE_KEY` | Mặc định là file Riway |

## Cấu trúc

```
app/[locale]/              layout, trang chủ, /explore, not-found, globals.css
app/actions/contact.ts     server action của form liên hệ
app/sitemap.ts, robots.ts
components/Animation/      Reveal, TextReveal, FloatingImage, CountUp, ScrollStack, GlowBlob, MarqueeRow, SmoothScroll
components/Common/         Header, Footer, Container, LocaleSwitcher, CategoryPills, CustomButton, SectionHeading, ScrollToTop
components/Home/           Hero, Services, GlobalPresence, About
components/Explore/        CategoryRail
components/Shared/         PosterCarousel, Partners, ContactSection, PageHero
constants/                 menu, danh sách poster, logo đối tác
i18n/                      routing, request, navigation (next-intl)
messages/en.json, vi.json  toàn bộ nội dung chữ và metadata SEO
scripts/figma-export.mjs   tải ảnh từ Figma, nén sang webp, tạo og.jpg và icon
```

Mỗi section nằm trong thư mục riêng `components/<Trang>/<Section>/<Section>.tsx` và dùng default export, giống adwin-src.

## Deploy

Project được deploy trên Vercel và nối với repo GitHub này: push lên `main` sẽ deploy production, push nhánh khác sẽ tạo bản preview.

## Ảnh từ Figma

`scripts/figma-export.mjs` có bảng `IMAGES` ánh xạ `imageRef` trên Figma sang đường dẫn trong `public/images`. Khi designer đổi ảnh:

1. Lấy `imageHash` mới của node cần đổi (Dev Mode, hoặc plugin API).
2. Cập nhật bảng `IMAGES`.
3. Chạy `yarn figma:export`.

Script tự nén ảnh sang webp và tạo lại `public/images/Common/og.jpg`.

Favicon được tạo từ biểu tượng R trong logo vuông "Logo RIWAY MEDIA GROUP-01" trên Figma (hằng `FAVICON_SOURCE` trong script). Script cắt lấy phần biểu tượng rồi xuất ra `public/favicon.ico` (16/32/48px), `icon-192.png`, `icon-512.png` và `apple-touch-icon.png`. Web manifest nằm ở `app/manifest.ts`.

## Font

Thiết kế dùng **ABC Solar Display** cho tiêu đề và **Inter** cho nội dung. Hiện tại Lexend đang tạm thay cho ABC Solar Display. Khi có file font bản quyền:

1. Chép file `.woff2` vào `app/fonts/`.
2. Trong `lib/fonts.ts`, đổi `Lexend` thành `localFont({ src: [...], variable: "--font-lexend" })`.

Mọi chỗ dùng class `font-heading` sẽ tự nhận font mới.

## Form liên hệ

`app/actions/contact.ts` validate dữ liệu bằng schema trong `lib/contact-schema.ts`. Hàm `deliverContact` hiện chưa gửi đi đâu. Cần nối kênh nhận tin (email, Telegram bot, CRM...) vào hàm này.
