"use client";

import MarqueeRow from "@/components/Animation/MarqueeRow";
import { HERO_WALL_ROWS } from "@/constants/posters";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

export default function HeroWall() {
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 900], [0, 220]);
  const scale = useTransform(scrollY, [0, 900], [1, 1.08]);

  return (
    <motion.div
      aria-hidden
      className="absolute inset-0"
      initial={{ opacity: 0, scale: 1.15 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div className="absolute inset-0" style={reduceMotion ? undefined : { y, scale }}>
        <div className="absolute top-[40%] left-1/2 flex w-[260vw] -translate-x-1/2 -translate-y-1/2 -rotate-[15deg] flex-col gap-3 sm:w-[200vw] md:gap-4 lg:w-[170vw]">
          {HERO_WALL_ROWS.map((row, rowIndex) => (
            <MarqueeRow key={rowIndex} direction={rowIndex % 2 === 0 ? "left" : "right"} speed={16 + rowIndex * 5}>
              {row.map((src, index) => (
                <div
                  key={`${src}-${index}`}
                  className="relative mx-1.5 aspect-[794/422] h-[clamp(120px,19vw,300px)] overflow-hidden rounded-[10px] bg-ink-deep md:mx-2"
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    loading={rowIndex < 2 ? "eager" : "lazy"}
                    sizes="(max-width: 768px) 240px, 560px"
                    className="object-cover"
                  />
                </div>
              ))}
            </MarqueeRow>
          ))}
        </div>
      </motion.div>
      <div className="absolute inset-0 bg-ink/60" />
      <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-b from-transparent via-ink/85 to-ink" />
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ink/70 to-transparent" />
    </motion.div>
  );
}
