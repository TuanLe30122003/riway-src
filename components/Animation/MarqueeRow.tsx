"use client";

import { cn } from "@/lib/utils";
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useRef, type ReactNode } from "react";

export default function MarqueeRow({
  children,
  speed = 40,
  direction = "left",
  pauseOnHover = false,
  reactToScroll = true,
  copies = 2,
  className,
}: {
  children: ReactNode;
  speed?: number;
  direction?: "left" | "right";
  pauseOnHover?: boolean;
  reactToScroll?: boolean;
  copies?: number;
  className?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      const track = trackRef.current;
      const first = track?.firstElementChild as HTMLElement | null;
      if (!root || !track || !first) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const sign = direction === "left" ? -1 : 1;
        let tween: gsap.core.Tween | null = null;
        let base = 1;

        const build = () => {
          const progress = tween?.progress() ?? 0;
          tween?.kill();
          const distance = first.offsetWidth;
          if (!distance) return;
          tween = gsap.fromTo(
            track,
            { x: sign < 0 ? 0 : -distance },
            { x: sign < 0 ? -distance : 0, duration: distance / speed, ease: "none", repeat: -1 },
          );
          tween.progress(progress).timeScale(base);
        };
        build();

        const observer = new ResizeObserver(() => build());
        observer.observe(first);

        const trigger = reactToScroll
          ? ScrollTrigger.create({
              trigger: root,
              start: "top bottom",
              end: "bottom top",
              onUpdate(self) {
                if (!tween) return;
                base = self.direction === 1 ? 1 : -1;
                const boost = gsap.utils.clamp(1, 6, 1 + Math.abs(self.getVelocity()) / 250);
                const current = tween;
                gsap.to(current, {
                  timeScale: boost * base,
                  duration: 0.2,
                  ease: "power2.out",
                  overwrite: true,
                  onComplete: () => {
                    gsap.to(current, { timeScale: base, duration: 1.2, ease: "power2.out" });
                  },
                });
              },
            })
          : null;

        const pause = () => {
          if (tween) gsap.to(tween, { timeScale: 0, duration: 0.5, ease: "power2.out", overwrite: true });
        };
        const resume = () => {
          if (tween) gsap.to(tween, { timeScale: base, duration: 0.5, ease: "power2.in", overwrite: true });
        };
        if (pauseOnHover) {
          root.addEventListener("mouseenter", pause);
          root.addEventListener("mouseleave", resume);
        }

        return () => {
          observer.disconnect();
          trigger?.kill();
          tween?.kill();
          root.removeEventListener("mouseenter", pause);
          root.removeEventListener("mouseleave", resume);
        };
      });
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} className={cn("overflow-hidden", className)}>
      <div ref={trackRef} className="flex w-max will-change-transform">
        {Array.from({ length: copies }, (_, index) => (
          <div key={index} aria-hidden={index > 0} className="flex shrink-0">
            {children}
          </div>
        ))}
      </div>
    </div>
  );
}
