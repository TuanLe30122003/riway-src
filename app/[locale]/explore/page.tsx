import GlowBlob from "@/components/Animation/GlowBlob";
import CategoryRail from "@/components/Explore/CategoryRail/CategoryRail";
import PageHero from "@/components/Shared/PageHero/PageHero";
import { EXPLORE_RAILS } from "@/constants/posters";
import type { Locale } from "@/i18n/routing";
import { buildMetadata } from "@/lib/metadata";
import { getTranslations, setRequestLocale } from "next-intl/server";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return buildMetadata(locale, "explore");
}

export default async function ExplorePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("ExplorePage");
  const categories = await getTranslations("Categories");

  return (
    <>
      <PageHero image="/images/Explore/hero.webp" title={t("title")} showTitle={false} />
      <div className="relative pb-16 md:pb-24">
        <GlowBlob color="ocean" className="top-1/3 -left-24 h-[420px] w-[240px]" blur={220} opacity={0.3} />
        <GlowBlob color="gold" className="-right-24 bottom-1/4 h-[420px] w-[240px]" blur={220} opacity={0.18} />
        {EXPLORE_RAILS.map((rail, index) => (
          <CategoryRail
            key={rail.category}
            label={categories(rail.category)}
            posters={rail.posters}
            variant={rail.variant}
            first={index === 0}
            trackClass={rail.trackClass}
            autoplayDelay={4200 + index * 700}
          />
        ))}
      </div>
    </>
  );
}
