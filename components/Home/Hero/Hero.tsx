import GlowBlob from "@/components/Animation/GlowBlob";
import TextReveal from "@/components/Animation/TextReveal";
import Container from "@/components/Common/Container";
import HeroWall from "@/components/Home/Hero/HeroWall";
import PosterCarousel from "@/components/Shared/PosterCarousel/PosterCarousel";
import { POSTER_CATEGORIES } from "@/constants/posters";
import { Mouse } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Hero() {
  const t = useTranslations("HomePage.hero");

  return (
    <section className="relative overflow-hidden pb-14 md:pb-20">
      <div className="absolute inset-x-0 top-0 h-[calc(max(58vh,380px)+200px)] overflow-hidden">
        <HeroWall />
      </div>
      <GlowBlob color="ocean" drift={false} className="-top-10 right-0 h-[99px] w-[67%]" blur={200} opacity={0.7} />
      <GlowBlob color="gold" drift={false} className="top-[calc(max(58vh,380px)+40px)] left-1/2 h-[99px] w-[77%] -translate-x-1/2" blur={200} opacity={0.45} />
      <Container className="relative flex flex-col items-center pt-[max(58vh,380px)]">
        <a
          href="#services"
          aria-label={t("scroll")}
          className="group flex size-[35px] items-center justify-center rounded-full border border-white/90 transition-colors hover:border-gold"
        >
          <Mouse className="size-4 text-white transition-colors group-hover:text-gold" strokeWidth={1.5} />
          <span className="sr-only">{t("scroll")}</span>
        </a>
        <span aria-hidden className="mt-2 block h-6 w-px animate-scroll-dot bg-gradient-to-b from-white to-transparent" />
        <TextReveal
          as="h1"
          animateOnMount
          delay={0.5}
          stagger={0.08}
          text={t.raw("title") as string}
          className="mt-4 text-center font-heading text-[44px] leading-[1.15] font-semibold text-white sm:text-[60px] lg:text-[80px]"
        />
        <div className="mt-8 w-full md:mt-10">
          <PosterCarousel categories={[...POSTER_CATEGORIES]} defaultCategory="anime" layoutId="home-categories" />
        </div>
      </Container>
    </section>
  );
}
