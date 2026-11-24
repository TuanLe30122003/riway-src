# riway-src

Website của RIWAY MEDIA GROUP, dựng theo thiết kế Figma `VLKz4IGevg4pQ3m1iQGQKC/Riway`. Hiệu ứng tham khảo theo phong cách https://www.bplusvn.com/en.

## Stack

- Next.js 15 (App Router), React 19, TypeScript
- Tailwind CSS 4: token khai báo bằng `@theme` trong `app/[locale]/globals.css`
- next-intl 4: hai ngôn ngữ `en` (mặc định) và `vi`, URL dạng `/[locale]/...`
- GSAP 3 (ScrollTrigger, SplitText) qua `@gsap/react`, khai báo trong `lib/gsap.ts`; lenis (smooth scroll, chạy theo `gsap.ticker`); embla-carousel
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
| `yarn figma:export` | Tải lại ảnh từ Figma (poster, ảnh 3D, banner) vào `public/images` |
| `yarn brand:assets <thư mục>` | Tạo logo header/footer, favicon, logo đối tác và ảnh OG từ bộ nhận diện |
| `yarn og:image` | Chỉ tạo lại ảnh preview khi chia sẻ link (`public/images/Common/og-image.jpg`) |

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
components/Shared/         CoverflowCarousel, PosterCarousel, Partners, ContactSection, PageHero
constants/                 menu, danh sách poster, logo đối tác
i18n/                      routing, request, navigation (next-intl)
messages/en.json, vi.json  toàn bộ nội dung chữ và metadata SEO
scripts/figma-export.mjs   tải ảnh từ Figma, nén sang webp
scripts/brand-assets.mjs   logo, favicon, logo đối tác từ bộ nhận diện
scripts/og-image.mjs       ảnh preview 1200×630 khi chia sẻ link
```

Mỗi section nằm trong thư mục riêng `components/<Trang>/<Section>/<Section>.tsx` và dùng default export, giống adwin-src.

## Animation

Toàn bộ animation dùng GSAP. Phần tử có `data-reveal` hoặc `data-reveal-item` bị ẩn bằng CSS (class `js` trên `<html>`) cho tới khi GSAP chạy, để tránh nháy khi tải trang. Mọi hiệu ứng đặt trong `gsap.matchMedia` nên khi người dùng bật giảm chuyển động (Reduce motion), nội dung hiện ngay mà không chạy animation. Mở `?debug=motion` để xem trạng thái này trên máy bất kỳ.

`CoverflowCarousel` là carousel dùng chung cho trang chủ và Explore. Thẻ chính có kích thước đầy đủ; thẻ phụ được thu nhỏ, kéo sát lại để giữ khoảng cách cố định, đồng thời làm tối và blur theo khoảng cách tới thẻ chính.

## Deploy

Project được deploy trên Vercel và nối với repo GitHub này: push lên `main` sẽ deploy production, push nhánh khác sẽ tạo bản preview.

## Ảnh từ Figma

`scripts/figma-export.mjs` có bảng `IMAGES` ánh xạ `imageRef` trên Figma sang đường dẫn trong `public/images`. Khi designer đổi ảnh:

1. Lấy `imageHash` mới của node cần đổi (Dev Mode, hoặc plugin API).
2. Cập nhật bảng `IMAGES`.
3. Chạy `yarn figma:export`.

Script tự nén ảnh sang webp.

## Logo, favicon và logo đối tác

Lấy từ bộ nhận diện gốc (zip "Bộ Nhận Diện RIWAY" và "Logo đối tác"), không lấy từ Figma. Giải nén vào một thư mục có cấu trúc như sau:

```
<thư mục>/logos/     Logo RIWAY MEDIA GROUP-01.png ... -10.png
<thư mục>/partners/  1.png ... 15.png (logo đối tác, sắp theo số)
```

Sau đó chạy `yarn brand:assets <thư mục>`. Script sẽ:
- Lấy logo trắng `-08` cho header và logo màu `-06` cho footer.
- Cắt biểu tượng R từ `-01` để tạo `public/favicon.ico` (16/32/48px), `icon-192.png`, `icon-512.png` và `apple-touch-icon.png`.
- Xén phần nền trắng thừa của logo đối tác, xuất ra `public/images/Partners/partner-XX.webp`, rồi tạo lại ảnh preview `og-image.jpg`.

Tên đối tác hiển thị (alt) khai báo trong `constants/partners.ts` theo đúng thứ tự file. Web manifest nằm ở `app/manifest.ts`.

## Font

- Tiêu đề dùng **ABC Solar Display** (Light, Regular, Medium, Semibold, Bold); nội dung dùng **Inter Variable**. Cả hai lấy từ bộ font thiết kế gửi.
- File woff2 nằm trong `app/fonts/`. Font đã được cắt (subset) chỉ giữ ký tự Latin và tiếng Việt bằng `pyftsubset` (fontTools), mỗi file khoảng 55–80KB.
- `lib/fonts.ts` nạp font bằng `next/font/local` và gán vào biến `--font-solar` / `--font-inter`; trong CSS dùng class `font-heading` / `font-body`.
- ABC Solar Display là font thương mại của Dinamo. Cần có license web hợp lệ trước khi public.

## Form liên hệ

`app/actions/contact.ts` validate dữ liệu bằng schema trong `lib/contact-schema.ts`. Hàm `deliverContact` hiện chưa gửi đi đâu. Cần nối kênh nhận tin (email, Telegram bot, CRM...) vào hàm này.
