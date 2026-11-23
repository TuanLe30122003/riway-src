"use client";

import Reveal from "@/components/Animation/Reveal";
import Container from "@/components/Common/Container";
import CarouselArrow from "@/components/Shared/PosterCarousel/CarouselArrow";
import type { RailVariant } from "@/constants/posters";
import { cn } from "@/lib/utils";
import type { EmblaCarouselType, EmblaEventType } from "embla-carousel";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";

const VARIANTS: Record<
  RailVariant,
  { slide: string; frame: string; minScale: number; sizes: string; radius: string }
> = {
  landscape: {
    slide: "basis-[72%] sm:basis-[46%] lg:basis-[31%]",
    frame: "aspect-[452/258]",
    minScale: 0.8,
    sizes: "(max-width: 640px) 72vw, (max-width: 1024px) 46vw, 460px",
    radius: "rounded-[20px]",
  },
  portrait: {
    slide: "basis-[60%] sm:basis-[36%] lg:basis-[24%]",
    frame: "aspect-[366/528]",
    minScale: 0.88,
    sizes: "(max-width: 640px) 60vw, (max-width: 1024px) 36vw, 380px",
    radius: "rounded-[20px]",
  },
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export default function CategoryRail({
  label,
  posters,
  variant,
  delay = 0,
}: {
  label: string;
  posters: string[];
  variant: RailVariant;
  delay?: number;
}) {
  const t = useTranslations("Common");
  const reduceMotion = useReducedMotion();
  const config = VARIANTS[variant];
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "center" },
    reduceMotion
      ? []
      : [Autoplay({ delay: 4200 + delay * 1000, stopOnInteraction: false, stopOnMouseEnter: true })],
  );
  const tweenFactor = useRef(0);
  const nodes = useRef<HTMLElement[]>([]);

  const setup = useCallback((api: EmblaCarouselType) => {
    nodes.current = api.slideNodes().map((slide) => slide.querySelector<HTMLElement>("[data-tween]")!);
    tweenFactor.current = 0.4 * api.scrollSnapList().length;
  }, []);

  const tween = useCallback(
    (api: EmblaCarouselType, eventName?: EmblaEventType) => {
      const engine = api.internalEngine();
      const scrollProgress = api.scrollProgress();
      const slidesInView = api.slidesInView();
      const isScrollEvent = eventName === "scroll";

      api.scrollSnapList().forEach((scrollSnap, snapIndex) => {
        let diffToTarget = scrollSnap - scrollProgress;
        engine.slideRegistry[snapIndex].forEach((slideIndex) => {
          if (isScrollEvent && !slidesInView.includes(slideIndex)) return;
          if (engine.options.loop) {
            engine.slideLooper.loopPoints.forEach((loopItem) => {
              const target = loopItem.target();
              if (slideIndex === loopItem.index && target !== 0) {
                const sign = Math.sign(target);
                if (sign === -1) diffToTarget = scrollSnap - (1 + scrollProgress);
                if (sign === 1) diffToTarget = scrollSnap + (1 - scrollProgress);
              }
            });
          }
          const value = clamp(1 - Math.abs(diffToTarget * tweenFactor.current), 0, 1);
          const node = nodes.current[slideIndex];
          if (!node) return;
          node.style.transform = `scale(${config.minScale + value * (1 - config.minScale)})`;
          node.style.setProperty("--shade", String((1 - value) * 0.55));
        });
      });
    },
    [config.minScale],
  );

  useEffect(() => {
    if (!emblaApi) return;
    setup(emblaApi);
    tween(emblaApi);
    emblaApi.on("reInit", setup).on("reInit", tween).on("scroll", tween).on("slideFocus", tween);
    return () => {
      emblaApi.off("reInit", setup).off("reInit", tween).off("scroll", tween).off("slideFocus", tween);
    };
  }, [emblaApi, setup, tween]);

  return (
    <section className="relative py-8 md:py-10" aria-label={label}>
      <Container>
        <Reveal x={-30} y={0} delay={delay}>
          <h2 className="border-gradient border-ocean-gold relative inline-flex h-[46px] items-center rounded-full bg-ink px-6 text-lg text-gold md:h-[53px] md:px-[18px] md:text-2xl">
            {label}
          </h2>
        </Reveal>
      </Container>
      <Reveal y={50} delay={delay + 0.1} className="relative mt-6 md:mt-[47px]">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex touch-pan-y">
            {posters.map((src, index) => (
              <div key={`${src}-${index}`} className={cn("min-w-0 shrink-0 grow-0 px-2 md:px-3", config.slide)}>
                <div
                  data-tween
                  className={cn(
                    "group relative overflow-hidden bg-ink-deep will-change-transform [--shade:0.5]",
                    config.frame,
                    config.radius,
                  )}
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes={config.sizes}
                    className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-105"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-black opacity-[var(--shade)]" />
                  <div className={cn("pointer-events-none absolute inset-0 ring-1 ring-white/10 ring-inset", config.radius)} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <Container className="pointer-events-none absolute inset-0 hidden items-center justify-between sm:flex">
          <CarouselArrow
            direction="prev"
            label={t("previous")}
            onClick={() => emblaApi?.scrollPrev()}
            className="pointer-events-auto -ml-2 lg:-ml-[22px]"
          />
          <CarouselArrow
            direction="next"
            label={t("next")}
            onClick={() => emblaApi?.scrollNext()}
            className="pointer-events-auto -mr-2 lg:-mr-[22px]"
          />
        </Container>
      </Reveal>
    </section>
  );
}
