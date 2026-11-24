"use client";

import { StaggerGroup, StaggerItem } from "@/components/Animation/Reveal";
import CarouselArrow from "@/components/Shared/PosterCarousel/CarouselArrow";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";
import type { EmblaCarouselType } from "embla-carousel";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, type CSSProperties } from "react";

export type CoverflowVariant = "home" | "homePortrait" | "landscape" | "portrait";

type VariantConfig = {
  visible: number;
  focus: "center" | "second";
  minScale: number;
  gap: number;
  mobileSlot: string;
  fixedSlot?: number;
  frame: string;
  radius: string;
  sizes: string;
  arrows: "outside" | "overlay";
};

const VARIANTS: Record<CoverflowVariant, VariantConfig> = {
  home: {
    visible: 3,
    focus: "center",
    minScale: 299 / 371,
    gap: 20,
    mobileSlot: "72%",
    frame: "aspect-[371/212]",
    radius: "rounded-[20px]",
    sizes: "(max-width: 768px) 72vw, 400px",
    arrows: "outside",
  },
  homePortrait: {
    visible: 3,
    focus: "center",
    minScale: 0.76,
    gap: 20,
    mobileSlot: "46%",
    fixedSlot: 220,
    frame: "aspect-[300/432]",
    radius: "rounded-[18px]",
    sizes: "(max-width: 768px) 46vw, 240px",
    arrows: "outside",
  },
  landscape: {
    visible: 4,
    focus: "second",
    minScale: 262 / 325,
    gap: 16,
    mobileSlot: "72%",
    frame: "aspect-[325/185]",
    radius: "rounded-[14px]",
    sizes: "(max-width: 768px) 72vw, 360px",
    arrows: "overlay",
  },
  portrait: {
    visible: 4,
    focus: "second",
    minScale: 263 / 300,
    gap: 20,
    mobileSlot: "58%",
    frame: "aspect-[300/432]",
    radius: "rounded-[18px]",
    sizes: "(max-width: 768px) 58vw, 320px",
    arrows: "overlay",
  },
};

const DESKTOP = "(min-width: 768px)";
const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
const smoothstep = (edge0: number, edge1: number, value: number) => {
  const x = clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return x * x * (3 - 2 * x);
};

export default function CoverflowCarousel({
  posters,
  variant,
  label,
  autoplayDelay = 3800,
  className,
}: {
  posters: string[];
  variant: CoverflowVariant;
  label: string;
  autoplayDelay?: number;
  className?: string;
}) {
  const t = useTranslations("Common");
  const config = VARIANTS[variant];
  const shrink = 1 - config.minScale;
  const reduceMotion = usePrefersReducedMotion();

  const align = useCallback(
    (viewSize: number, snapSize: number) => {
      const slot = snapSize - config.gap;
      const desktop = window.matchMedia(DESKTOP).matches;
      if (config.focus === "second" && desktop) return slot * config.minScale + config.gap;
      return (viewSize - slot) / 2;
    },
    [config],
  );

  const plugins = useMemo(
    () =>
      reduceMotion
        ? []
        : [Autoplay({ delay: autoplayDelay, stopOnInteraction: false, stopOnMouseEnter: true })],
    [reduceMotion, autoplayDelay],
  );

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align, skipSnaps: false }, plugins);
  const cards = useRef<HTMLElement[]>([]);
  const slides = useRef<HTMLElement[]>([]);
  const slot = useRef(0);

  const measure = useCallback((api: EmblaCarouselType) => {
    slides.current = api.slideNodes();
    cards.current = slides.current.map((slide) => slide.querySelector<HTMLElement>("[data-coverflow-card]")!);
    slot.current = cards.current[0]?.offsetWidth ?? 0;
  }, []);

  const render = useCallback(
    (api: EmblaCarouselType) => {
      const engine = api.internalEngine();
      const progress = api.scrollProgress();
      const snaps = api.scrollSnapList();
      const count = snaps.length;

      snaps.forEach((snap, snapIndex) => {
        engine.slideRegistry[snapIndex].forEach((slideIndex) => {
          let diff = snap - progress;
          if (engine.options.loop) {
            engine.slideLooper.loopPoints.forEach((loopItem) => {
              const target = loopItem.target();
              if (slideIndex === loopItem.index && target !== 0) {
                if (Math.sign(target) === -1) diff = snap - (1 + progress);
                if (Math.sign(target) === 1) diff = snap + (1 - progress);
              }
            });
          }
          const card = cards.current[slideIndex];
          if (!card) return;
          const distance = diff * count;
          const away = Math.abs(distance);
          const near = Math.min(away, 1);
          const far = clamp(away - 1, 0, 1);
          const pull = away <= 1 ? (away * away) / 2 : away - 0.5;
          const shift = -Math.sign(distance) * slot.current * shrink * pull;
          const soft = smoothstep(0.3, 1, away);
          card.style.transform = `translate(${shift.toFixed(2)}px,0) scale(${(1 - shrink * near).toFixed(4)})`;
          card.style.setProperty("--dim", (0.6 * smoothstep(0.15, 1, away) + 0.1 * far).toFixed(3));
          card.style.setProperty("--blur", `${(4 * soft + far).toFixed(2)}px`);
          const slide = slides.current[slideIndex];
          if (slide) slide.style.zIndex = String(100 - Math.round(away * 10));
        });
      });
    },
    [shrink],
  );

  useEffect(() => {
    if (!emblaApi) return;
    const refresh = (api: EmblaCarouselType) => {
      measure(api);
      render(api);
    };
    refresh(emblaApi);
    emblaApi.on("reInit", refresh).on("resize", refresh).on("scroll", render).on("slideFocus", render);
    return () => {
      emblaApi.off("reInit", refresh).off("resize", refresh).off("scroll", render).off("slideFocus", render);
    };
  }, [emblaApi, measure, render]);

  const desktopSlot = config.fixedSlot
    ? `${config.fixedSlot}px`
    : `calc((100% - ${(config.visible - 1) * config.gap}px) / ${(config.visible - (config.visible - 1) * shrink).toFixed(4)})`;

  const viewportStyle = {
    "--gap": `${config.gap}px`,
    "--slot-mobile": config.mobileSlot,
    "--slot-desktop": desktopSlot,
    "--window": config.fixedSlot
      ? `${Math.round(config.fixedSlot * (1 + (config.visible - 1) * config.minScale) + (config.visible - 1) * config.gap)}px`
      : "100%",
  } as CSSProperties;

  const prev = (
    <CarouselArrow
      direction="prev"
      label={t("previous")}
      onClick={() => emblaApi?.scrollPrev()}
      className={cn(
        "hidden sm:flex",
        config.arrows === "overlay" && "pointer-events-auto absolute top-1/2 -left-[13px] z-[200] -translate-y-1/2",
      )}
    />
  );
  const next = (
    <CarouselArrow
      direction="next"
      label={t("next")}
      onClick={() => emblaApi?.scrollNext()}
      className={cn(
        "hidden sm:flex",
        config.arrows === "overlay" && "pointer-events-auto absolute top-1/2 -right-[13px] z-[200] -translate-y-1/2",
      )}
    />
  );

  return (
    <div
      className={cn("relative flex items-center", config.arrows === "outside" && "gap-3 lg:gap-[27px]", className)}
      aria-roledescription="carousel"
      aria-label={label}
    >
      {prev}
      <StaggerGroup className="relative min-w-0 flex-1" stagger={0.08} y={50} order="visual">
        <div
          ref={emblaRef}
          style={viewportStyle}
          className="mx-auto overflow-hidden [--slot:var(--slot-mobile)] md:max-w-[var(--window)] md:[--slot:var(--slot-desktop)]"
        >
          <div className="flex touch-pan-y items-center">
            {posters.map((src, index) => (
              <div
                key={`${src}-${index}`}
                className="min-w-0 shrink-0 grow-0 basis-[calc(var(--slot)+var(--gap))] pr-[var(--gap)]"
              >
                <StaggerItem>
                  <div
                    data-coverflow-card
                    className={cn(
                      "group relative overflow-hidden bg-ink-deep [--blur:0px] [--dim:0.6]",
                      config.frame,
                      config.radius,
                    )}
                  >
                    <Image
                      src={src}
                      alt=""
                      fill
                      sizes={config.sizes}
                      className="scale-[1.06] object-cover transition-[scale] duration-700 ease-out-expo [filter:blur(var(--blur))] group-hover:scale-[1.12]"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-black opacity-[var(--dim)]" />
                    <div className={cn("pointer-events-none absolute inset-0 ring-1 ring-white/10 ring-inset", config.radius)} />
                  </div>
                </StaggerItem>
              </div>
            ))}
          </div>
        </div>
      </StaggerGroup>
      {next}
    </div>
  );
}
