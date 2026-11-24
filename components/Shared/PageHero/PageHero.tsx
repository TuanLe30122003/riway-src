"use client";

import GlowBlob from "@/components/Animation/GlowBlob";
import TextReveal from "@/components/Animation/TextReveal";
import Container from "@/components/Common/Container";
import { cn } from "@/lib/utils";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import Image from "next/image";
import { useRef, type ReactNode } from "react";

export default function PageHero({
  image,
  title,
  showTitle = true,
  children,
}: {
  image: string;
  title: string;
  showTitle?: boolean;
  children?: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          frameRef.current,
          { autoAlpha: 0, scale: 1.25, filter: "blur(12px)" },
          { autoAlpha: 1, scale: 1, filter: "blur(0px)", duration: 2, ease: "expo.out" },
        );
        gsap.fromTo(
          imageRef.current,
          { scale: 1.12, yPercent: 0, autoAlpha: 1 },
          {
            scale: 1,
            yPercent: 18,
            autoAlpha: 0.35,
            ease: "none",
            scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: 1 },
          },
        );
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="relative">
      <div ref={frameRef} aria-hidden className="absolute inset-x-0 top-0 h-[min(56vw,715px)] min-h-[380px] origin-top overflow-hidden">
        <div ref={imageRef} className="absolute inset-0 will-change-transform">
          <Image src={image} alt="" fill priority sizes="100vw" className="object-cover object-center" />
        </div>
        <div className="absolute inset-0 bg-ink/40" />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-b from-transparent via-ink/80 to-ink" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink/80 to-transparent" />
      </div>
      <GlowBlob
        color="ocean"
        drift={false}
        className="top-[calc(max(300px,min(40vw,540px))-10px)] left-1/2 h-[118px] w-[110%] -translate-x-1/2"
        blur={180}
        opacity={0.4}
      />
      <Container
        className={cn(
          "relative flex flex-col items-center",
          showTitle ? "pt-[max(300px,min(40vw,540px))]" : "pt-[max(380px,min(56vw,715px))]",
        )}
      >
        {showTitle ? (
          <TextReveal
            as="h1"
            animateOnMount
            delay={0.4}
            text={title}
            className="text-center font-heading text-[40px] leading-[1.15] font-semibold text-white sm:text-5xl lg:text-[60px]"
          />
        ) : (
          <h1 className="sr-only">{title.replace(/<\/?hl>/g, "")}</h1>
        )}
        {children && <div className="mt-8 w-full md:mt-7">{children}</div>}
      </Container>
    </section>
  );
}
