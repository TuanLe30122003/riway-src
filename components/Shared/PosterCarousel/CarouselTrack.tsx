"use client";

import CarouselArrow from "@/components/Shared/PosterCarousel/CarouselArrow";
import type { EmblaCarouselType, EmblaEventType } from "embla-carousel";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";

const TWEEN_FACTOR_BASE = 0.42;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export default function CarouselTrack({ posters, label }: { posters: string[]; label: string }) {
  const t = useTranslations("Common");
  const reduceMotion = useReducedMotion();
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "center", skipSnaps: false },
    reduceMotion ? [] : [Autoplay({ delay: 3600, stopOnInteraction: false, stopOnMouseEnter: true })],
  );
  const tweenFactor = useRef(0);
  const nodes = useRef<HTMLElement[]>([]);

  const setTweenNodes = useCallback((api: EmblaCarouselType) => {
    nodes.current = api.slideNodes().map((slide) => slide.querySelector<HTMLElement>("[data-tween]")!);
  }, []);

  const setTweenFactor = useCallback((api: EmblaCarouselType) => {
    tweenFactor.current = TWEEN_FACTOR_BASE * api.scrollSnapList().length;
  }, []);

  const tween = useCallback((api: EmblaCarouselType, eventName?: EmblaEventType) => {
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
        node.style.transform = `scale(${0.8 + value * 0.2})`;
        node.style.setProperty("--shade", String((1 - value) * 0.55));
      });
    });
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    setTweenNodes(emblaApi);
    setTweenFactor(emblaApi);
    tween(emblaApi);
    emblaApi
      .on("reInit", setTweenNodes)
      .on("reInit", setTweenFactor)
      .on("reInit", tween)
      .on("scroll", tween)
      .on("slideFocus", tween);
    return () => {
      emblaApi.off("reInit", setTweenNodes).off("reInit", setTweenFactor).off("reInit", tween).off("scroll", tween).off("slideFocus", tween);
    };
  }, [emblaApi, setTweenNodes, setTweenFactor, tween]);

  return (
    <div className="flex items-center gap-3 md:gap-6" aria-roledescription="carousel" aria-label={label}>
      <CarouselArrow direction="prev" label={t("previous")} onClick={() => emblaApi?.scrollPrev()} className="hidden sm:flex" />
      <div className="min-w-0 flex-1 overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y">
          {posters.map((src, index) => (
            <div key={`${src}-${index}`} className="min-w-0 shrink-0 grow-0 basis-[78%] px-1.5 sm:basis-[48%] lg:basis-[37%] lg:px-2.5">
              <div
                data-tween
                className="group relative aspect-[371/212] overflow-hidden rounded-[20px] bg-ink-deep will-change-transform [--shade:0.5]"
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 78vw, (max-width: 1024px) 48vw, 420px"
                  className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-black opacity-[var(--shade)]" />
                <div className="pointer-events-none absolute inset-0 rounded-[20px] ring-1 ring-white/10 ring-inset" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <CarouselArrow direction="next" label={t("next")} onClick={() => emblaApi?.scrollNext()} className="hidden sm:flex" />
    </div>
  );
}
