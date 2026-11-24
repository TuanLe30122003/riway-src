"use client";

import CategoryPills from "@/components/Common/CategoryPills";
import CoverflowCarousel from "@/components/Shared/CoverflowCarousel/CoverflowCarousel";
import { POSTERS_BY_CATEGORY, type PosterCategory } from "@/constants/posters";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";

export default function PosterCarousel({
  categories,
  defaultCategory,
}: {
  categories: PosterCategory[];
  defaultCategory?: PosterCategory;
}) {
  const t = useTranslations("Categories");
  const initial = defaultCategory ?? categories[0];
  const [active, setActive] = useState<PosterCategory>(initial);
  const [shown, setShown] = useState<PosterCategory>(initial);
  const stageRef = useRef<HTMLDivElement>(null);
  const items = categories.map((key) => ({ key, label: t(key) }));

  const fromHeight = useRef(0);

  const select = (key: PosterCategory) => {
    if (key === active) return;
    setActive(key);
    const stage = stageRef.current;
    if (!stage || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(key);
      return;
    }
    fromHeight.current = stage.offsetHeight;
    gsap.to(stage, {
      autoAlpha: 0,
      y: -14,
      filter: "blur(10px)",
      duration: 0.3,
      ease: "power2.in",
      overwrite: true,
      onComplete: () => setShown(key),
    });
  };

  useGSAP(
    () => {
      const stage = stageRef.current;
      if (!stage || shown === initial) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const target = stage.offsetHeight;
        if (fromHeight.current && fromHeight.current !== target) {
          gsap.fromTo(
            stage,
            { height: fromHeight.current },
            { height: target, duration: 0.6, ease: "expo.inOut", clearProps: "height" },
          );
        }
        gsap.fromTo(
          stage,
          { autoAlpha: 0, y: 24, filter: "blur(10px)" },
          { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.7, delay: 0.1, ease: "expo.out" },
        );
      });
    },
    { dependencies: [shown] },
  );

  return (
    <div className="flex w-full flex-col items-center gap-10 md:gap-12">
      <CategoryPills items={items} active={active} onChange={select} />
      <div ref={stageRef} className="w-full">
        <CoverflowCarousel
          key={shown}
          posters={POSTERS_BY_CATEGORY[shown]}
          variant={shown === "verticalDrama" ? "homePortrait" : "home"}
          label={t(shown)}
        />
      </div>
    </div>
  );
}
