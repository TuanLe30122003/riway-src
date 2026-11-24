"use client";

import { cn } from "@/lib/utils";
import { gsap, MOTION_OK, MOTION_REDUCED, useGSAP } from "@/lib/gsap";
import { useLayoutEffect, useRef } from "react";

export default function CategoryPills<T extends string>({
  items,
  active,
  onChange,
  className,
}: {
  items: { key: T; label: string }[];
  active: T;
  onChange: (key: T) => void;
  className?: string;
}) {
  const listRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const placed = useRef(false);

  useGSAP(
    () => {
      const list = listRef.current;
      if (!list) return;
      const pills = list.querySelectorAll<HTMLElement>("[data-pill]");
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          pills,
          { autoAlpha: 0, y: 18, scale: 0.9 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: "back.out(1.6)",
            stagger: 0.06,
            scrollTrigger: { trigger: list, start: "top 92%", once: true },
          },
        );
      });
      mm.add(MOTION_REDUCED, () => {
        gsap.set(pills, { autoAlpha: 1 });
      });
    },
    { scope: listRef },
  );

  useLayoutEffect(() => {
    const list = listRef.current;
    const indicator = indicatorRef.current;
    if (!list || !indicator) return;
    const move = (instant: boolean) => {
      const target = list.querySelector<HTMLElement>(`[data-pill="${active}"]`);
      if (!target) return;
      const props = {
        x: target.offsetLeft,
        y: target.offsetTop,
        width: target.offsetWidth,
        height: target.offsetHeight,
      };
      if (instant) gsap.set(indicator, props);
      else gsap.to(indicator, { ...props, duration: 0.6, ease: "expo.out", overwrite: true });
    };
    move(!placed.current);
    placed.current = true;
    const observer = new ResizeObserver(() => move(true));
    observer.observe(list);
    return () => observer.disconnect();
  }, [active]);

  return (
    <div
      ref={listRef}
      role="tablist"
      className={cn(
        "no-scrollbar relative -mx-4 flex max-w-[calc(100%+2rem)] items-center justify-start gap-2 overflow-x-auto px-4 sm:mx-0 sm:max-w-full sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0 md:gap-5",
        className,
      )}
    >
      <span
        ref={indicatorRef}
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 rounded-full border border-ocean bg-steel/10 shadow-[0_0_24px_-6px_rgba(0,155,212,0.8)]"
      />
      {items.map((item) => {
        const selected = item.key === active;
        return (
          <button
            key={item.key}
            data-pill={item.key}
            data-reveal-item
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(item.key)}
            className={cn(
              "glass relative h-9 shrink-0 rounded-full px-4 text-xs whitespace-nowrap transition-colors duration-300 md:h-[39px] md:px-[31px] md:text-sm",
              selected ? "text-sky" : "text-muted hover:text-white",
            )}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
