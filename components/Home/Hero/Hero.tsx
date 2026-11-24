import GlowBlob from "@/components/Animation/GlowBlob";
import Reveal from "@/components/Animation/Reveal";
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
    <section className="relative pb-14 md:pb-20">
      <div className="relative h-[max(560px,min(72.3vw,926px))]">
        <HeroWall />
        <GlowBlob color="ocean" drift={false} className="-top-10 right-0 h-[99px] w-[67%]" blur={200} opacity={0.7} />
        <GlowBlob
          color="gold"
          drift={false}
          className="bottom-[110px] left-1/2 h-[99px] w-[77%] -translate-x-1/2"
          blur={200}
          opacity={0.45}
        />
        <Container className="absolute inset-x-0 bottom-[96px] flex flex-col items-center md:bottom-[123px]">
          <Reveal delay={0.9} y={-16}>
            <a
              href="#services"
              aria-label={t("scroll")}
              className="group flex size-[35px] items-center justify-center rounded-full border border-white/90 transition-colors hover:border-gold"
            >
              <Mouse className="size-4 text-white transition-colors group-hover:text-gold" strokeWidth={1.5} />
            </a>
          </Reveal>
          <TextReveal
            as="h1"
            by="chars"
            animateOnMount
            delay={0.45}
            text={t.raw("title") as string}
            className="mt-7 text-center font-heading text-[44px] leading-[1.15] font-semibold text-white sm:text-[60px] lg:text-[80px] lg:leading-[97px]"
          />
        </Container>
      </div>
      <Container className="relative -mt-[80px]">
        <PosterCarousel categories={[...POSTER_CATEGORIES]} defaultCategory="anime" />
      </Container>
    </section>
  );
}
