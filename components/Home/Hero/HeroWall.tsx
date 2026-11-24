"use client";

import MarqueeRow from "@/components/Animation/MarqueeRow";
import { HERO_WALL_ROWS } from "@/constants/posters";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import Image from "next/image";
import { useRef } from "react";

export default function HeroWall() {
  const rootRef = useRef<HTMLDivElement>(null);
  const wallRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      const wall = wallRef.current;
      if (!root || !wall) return;
      const rows = gsap.utils.toArray<HTMLElement>("[data-wall-row]", wall);
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap
          .timeline({ defaults: { ease: "expo.out" } })
          .fromTo(wall, { scale: 1.18, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 2.2 })
          .fromTo(
            rows,
            { xPercent: (index) => (index % 2 === 0 ? -14 : 14) },
            { xPercent: 0, duration: 2.2, stagger: 0.08 },
            0,
          );
        gsap.to(wall, {
          yPercent: 12,
          scale: 1.06,
          ease: "none",
          scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: 1 },
        });
      });
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} aria-hidden className="absolute inset-0 overflow-hidden">
      <div
        ref={wallRef}
        className="absolute top-1/2 left-1/2 flex w-[190vw] -translate-x-1/2 -translate-y-1/2 -rotate-[15deg] flex-col gap-[max(8px,0.8vw)] will-change-transform"
      >
        {HERO_WALL_ROWS.map((row, rowIndex) => (
          <div key={rowIndex} data-wall-row>
            <MarqueeRow direction={rowIndex % 2 === 0 ? "left" : "right"} speed={22 + rowIndex * 6}>
              {row.map((src, index) => (
                <div
                  key={`${src}-${index}`}
                  className="relative mr-[max(8px,0.8vw)] aspect-[794/422] h-[max(180px,33vw)] overflow-hidden rounded-[10px] bg-ink-deep"
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    loading={rowIndex < 2 ? "eager" : "lazy"}
                    sizes="(max-width: 768px) 360px, 66vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </MarqueeRow>
          </div>
        ))}
      </div>
      <div className="absolute inset-0 bg-ink/60" />
      <div className="absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-b from-transparent via-ink/80 to-ink" />
      <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-ink/80 to-transparent" />
    </div>
  );
}
