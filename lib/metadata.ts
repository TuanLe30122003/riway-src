import { routing, type Locale } from "@/i18n/routing";
import { OG_IMAGE, SITE_NAME } from "@/lib/site";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export type PageKey = "home" | "explore";

const PATHS: Record<PageKey, string> = {
  home: "",
  explore: "/explore",
};

const OG_LOCALES: Record<Locale, string> = { en: "en_US", vi: "vi_VN" };

export async function buildMetadata(locale: Locale, page: PageKey): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "Metadata" });
  const path = PATHS[page];
  const title = t(`${page}.title`);
  const description = t(`${page}.description`);
  const shareTitle = page === "home" ? title : `${title} | ${SITE_NAME}`;
  const languages = Object.fromEntries(
    routing.locales.map((item) => [item, `/${item}${path}`]),
  );
  const image = { url: OG_IMAGE, width: 1200, height: 630, type: "image/jpeg", alt: t("home.title") };

  return {
    title: page === "home" ? { absolute: title } : title,
    description,
    alternates: {
      canonical: `/${locale}${path}`,
      languages: { ...languages, "x-default": `/${routing.defaultLocale}${path}` },
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title: shareTitle,
      description,
      url: `/${locale}${path}`,
      locale: OG_LOCALES[locale],
      alternateLocale: routing.locales.filter((item) => item !== locale).map((item) => OG_LOCALES[item]),
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: shareTitle,
      description,
      images: [image],
    },
  };
}

export function pagePath(page: PageKey) {
  return PATHS[page];
}
