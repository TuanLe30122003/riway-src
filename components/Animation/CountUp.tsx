"use client";

import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { useRef } from "react";

export default function CountUp({
  to,
  prefix = "",
  suffix = "",
  duration = 2,
  className,
}: {
  to: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const state = { value: 0 };
        const render = () => {
          el.textContent = `${prefix}${Math.round(state.value)}${suffix}`;
        };
        render();
        gsap.to(state, {
          value: to,
          duration,
          ease: "power3.out",
          onUpdate: render,
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        });
        return () => {
          el.textContent = `${prefix}${to}${suffix}`;
        };
      });
    },
    { scope: ref, dependencies: [to] },
  );

  return (
    <span ref={ref} className={className}>
      {prefix}
      {to}
      {suffix}
    </span>
  );
}
