"use client";

import { gsap, MOTION_OK, MOTION_REDUCED, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useRef, type ElementType, type ReactNode } from "react";

type Tag = "div" | "section" | "li" | "p" | "span" | "article" | "ul" | "ol";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  scale?: number;
  start?: string;
  as?: Tag;
};

export default function Reveal({
  children,
  className,
  delay = 0,
  duration = 1.1,
  x = 0,
  y = 40,
  scale = 1,
  start = "top 88%",
  as = "div",
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const Component = as as "div";

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, x, y, scale },
          {
            autoAlpha: 1,
            x: 0,
            y: 0,
            scale: 1,
            duration,
            delay,
            ease: "expo.out",
            scrollTrigger: { trigger: el, start, once: true },
          },
        );
      });
      mm.add(MOTION_REDUCED, () => {
        gsap.set(el, { autoAlpha: 1 });
      });
    },
    { scope: ref },
  );

  return (
    <Component ref={ref} data-reveal className={className}>
      {children}
    </Component>
  );
}

export function StaggerGroup({
  children,
  className,
  stagger = 0.12,
  x = 0,
  y = 36,
  start = "top 85%",
  order = "dom",
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  x?: number;
  y?: number;
  start?: string;
  order?: "dom" | "visual";
  as?: Tag;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const Component = as as "div";

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const items = el.querySelectorAll<HTMLElement>("[data-reveal-item]");
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        if (order === "visual") {
          gsap.set(items, { autoAlpha: 0, x, y });
          let frame = 0;
          const show = () => {
            frame = requestAnimationFrame(() => {
              const box = el.getBoundingClientRect();
              const placed = Array.from(items, (item) => ({ item, rect: item.getBoundingClientRect() }));
              const inView = placed
                .filter(({ rect }) => rect.right > box.left && rect.left < box.right)
                .sort((a, b) => a.rect.left - b.rect.left)
                .map(({ item }) => item);
              const offView = placed.map(({ item }) => item).filter((item) => !inView.includes(item));
              gsap.set(offView, { autoAlpha: 1, x: 0, y: 0 });
              gsap.to(inView, { autoAlpha: 1, x: 0, y: 0, duration: 0.9, ease: "expo.out", stagger });
            });
          };
          ScrollTrigger.create({ trigger: el, start, once: true, onEnter: show });
          return () => cancelAnimationFrame(frame);
        }
        gsap.fromTo(
          items,
          { autoAlpha: 0, x, y },
          {
            autoAlpha: 1,
            x: 0,
            y: 0,
            duration: 0.9,
            ease: "expo.out",
            stagger,
            scrollTrigger: { trigger: el, start, once: true },
          },
        );
      });
      mm.add(MOTION_REDUCED, () => {
        gsap.set(items, { autoAlpha: 1 });
      });
    },
    { scope: ref },
  );

  return (
    <Component ref={ref} className={className}>
      {children}
    </Component>
  );
}

export function StaggerItem({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: Tag;
}) {
  const Component: ElementType = as;
  return (
    <Component data-reveal-item className={className}>
      {children}
    </Component>
  );
}
