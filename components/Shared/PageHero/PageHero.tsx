"use client";

import GlowBlob from "@/components/Animation/GlowBlob";
import TextReveal from "@/components/Animation/TextReveal";
import Container from "@/components/Common/Container";
import { cn } from "@/lib/utils";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
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
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1.12, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.35]);

  return (
    <section ref={ref} className="relative overflow-hidden">
      <motion.div
        aria-hidden
        className="absolute inset-x-0 top-0 h-[min(56vw,715px)] min-h-[380px] origin-top"
        initial={{ opacity: 0, scale: 1.2 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div className="absolute inset-0" style={reduceMotion ? undefined : { scale, y, opacity }}>
          <Image src={image} alt="" fill priority sizes="100vw" className="object-cover object-center" />
        </motion.div>
        <div className="absolute inset-0 bg-ink/40" />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-b from-transparent via-ink/80 to-ink" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink/80 to-transparent" />
      </motion.div>
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
