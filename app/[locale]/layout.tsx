import SmoothScroll from "@/components/Animation/SmoothScroll";
import Footer from "@/components/Common/Footer";
import Header from "@/components/Common/Header";
import { CONTACT_INFO } from "@/constants/navigation";
import { routing } from "@/i18n/routing";
import { fontBody, fontHeading } from "@/lib/fonts";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import type { Metadata, Viewport } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import "./globals.css";

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Omit<Props, "children">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t("home.title"), template: `%s | ${SITE_NAME}` },
    description: t("home.description"),
    applicationName: SITE_NAME,
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "16x16 32x32 48x48" },
        { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
        { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
      ],
      apple: { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#050d10",
  colorScheme: "dark",
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "Footer" });
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: `${SITE_URL}/${locale}`,
    logo: `${SITE_URL}/images/Common/logo-footer.webp`,
    email: CONTACT_INFO.email,
    telephone: CONTACT_INFO.phone,
    description: t("description"),
    address: {
      "@type": "PostalAddress",
      streetAddress: "LK4-03 Doc Bun 1, Ha Dong",
      addressLocality: "Hanoi",
      addressCountry: "VN",
    },
  };

  return (
    <html lang={locale} className={`${fontBody.variable} ${fontHeading.variable}`} suppressHydrationWarning>
      <body className="min-h-dvh bg-ink font-body text-white antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
        />
        <NextIntlClientProvider>
          <SmoothScroll>
            <Header />
            <main className="relative overflow-x-clip">{children}</main>
            <Footer />
          </SmoothScroll>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
