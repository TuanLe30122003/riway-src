"use client";

import { cn } from "@/lib/utils";
import { gsap, MOTION_OK, MOTION_REDUCED, useGSAP } from "@/lib/gsap";
import Image from "next/image";
import { useRef } from "react";

type FloatingImageProps = {
  src: string;
  alt?: string;
  width: number;
  height: number;
  className?: string;
  imageClassName?: string;
  from?: { x?: number; y?: number; rotate?: number };
  delay?: number;
  floatDelay?: number;
  mouse?: number;
  parallax?: number;
  rotate?: number;
  priority?: boolean;
  sizes?: string;
};

export default function FloatingImage({
  src,
  alt = "",
  width,
  height,
  className,
  imageClassName,
  from = { y: 60 },
  delay = 0,
  floatDelay = 0,
  mouse = 0,
  parallax = 40,
  rotate = 0,
  priority = false,
  sizes,
}: FloatingImageProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef<HTMLDivElement>(null);
  const floatRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          root,
          { autoAlpha: 0, x: from.x ?? 0, y: from.y ?? 0, rotate: from.rotate ?? rotate, scale: 0.85 },
          {
            autoAlpha: 1,
            x: 0,
            y: 0,
            rotate,
            scale: 1,
            duration: 1.6,
            delay,
            ease: "expo.out",
            scrollTrigger: { trigger: root, start: "top 92%", once: true },
          },
        );
        gsap.to(floatRef.current, {
          y: -16,
          rotate: 1.5,
          duration: 3.2,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: floatDelay,
        });
        if (parallax) {
          gsap.fromTo(
            parallaxRef.current,
            { y: parallax },
            {
              y: -parallax,
              ease: "none",
              scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: 1 },
            },
          );
        }
        if (!mouse) return;
        const xTo = gsap.quickTo(mouseRef.current, "x", { duration: 1, ease: "power3.out" });
        const yTo = gsap.quickTo(mouseRef.current, "y", { duration: 1, ease: "power3.out" });
        const onMove = (event: MouseEvent) => {
          xTo((event.clientX / window.innerWidth - 0.5) * mouse);
          yTo((event.clientY / window.innerHeight - 0.5) * mouse);
        };
        window.addEventListener("mousemove", onMove, { passive: true });
        return () => window.removeEventListener("mousemove", onMove);
      });
      mm.add(MOTION_REDUCED, () => {
        gsap.set(root, { autoAlpha: 1, rotate });
      });
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} data-reveal className={cn("pointer-events-none select-none", className)}>
      <div ref={parallaxRef}>
        <div ref={mouseRef}>
          <div ref={floatRef}>
            <Image
              src={src}
              alt={alt}
              width={width}
              height={height}
              priority={priority}
              sizes={sizes ?? `${width}px`}
              className={cn("h-auto w-full", imageClassName)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
