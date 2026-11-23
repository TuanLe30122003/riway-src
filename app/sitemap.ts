import { routing } from "@/i18n/routing";
import { pagePath, type PageKey } from "@/lib/metadata";
import { SITE_URL } from "@/lib/site";
import type { MetadataRoute } from "next";

const PAGES: { key: PageKey; priority: number }[] = [
  { key: "home", priority: 1 },
  { key: "explore", priority: 0.8 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return PAGES.flatMap(({ key, priority }) =>
    routing.locales.map((locale) => ({
      url: `${SITE_URL}/${locale}${pagePath(key)}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((item) => [item, `${SITE_URL}/${item}${pagePath(key)}`]),
        ),
      },
    })),
  );
}
