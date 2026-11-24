"use client";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";
import { gsap, useGSAP } from "@/lib/gsap";
import { useRef, type ReactNode } from "react";

const OFFSET = 22;

export default function ScrollStack({
  items,
  className,
}: {
  items: ReactNode[];
  className?: string;
}) {
  const reduceMotion = usePrefersReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const stage = stageRef.current;
      if (!stage || reduceMotion) return;
      const cards = gsap.utils.toArray<HTMLElement>("[data-stack-card]", stage);
      const dims = gsap.utils.toArray<HTMLElement>("[data-stack-dim]", stage);
      if (cards.length < 2) return;

      gsap.set(cards, { transformOrigin: "50% 0%" });

      const timeline = gsap.timeline({
        defaults: { ease: "none", duration: 1 },
        scrollTrigger: {
          trigger: stage,
          start: "top top+=140",
          end: () => `+=${(cards.length - 1) * window.innerHeight * 0.85}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      cards.forEach((card, index) => {
        if (index === 0) return;
        const at = index - 1;
        timeline.fromTo(card, { y: () => window.innerHeight }, { y: 0 }, at);
        for (let previous = 0; previous < index; previous += 1) {
          const depth = index - previous;
          timeline.to(cards[previous], { scale: 1 - depth * 0.045, filter: `blur(${Math.min(depth * 1.5, 4)}px)` }, at);
          timeline.to(dims[previous], { opacity: Math.min(depth * 0.25, 0.6) }, at);
        }
      });
    },
    { scope: stageRef, dependencies: [reduceMotion, items.length], revertOnUpdate: true },
  );

  if (reduceMotion) {
    return (
      <div className={cn("flex flex-col gap-6", className)}>
        {items.map((item, index) => (
          <div key={index}>{item}</div>
        ))}
      </div>
    );
  }

  return (
    <div ref={stageRef} className={cn("relative grid", className)}>
      {items.map((item, index) => (
        <div
          key={index}
          data-stack-card
          className="relative [grid-area:1/1] will-change-transform"
          style={{ marginTop: index * OFFSET, zIndex: index + 1 }}
        >
          {item}
          <div
            data-stack-dim
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[20px] bg-ink opacity-0"
          />
        </div>
      ))}
    </div>
  );
}
