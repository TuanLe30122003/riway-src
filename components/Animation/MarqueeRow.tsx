"use client";

import { useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import Marquee from "react-fast-marquee";

export default function MarqueeRow({
  children,
  speed = 40,
  direction = "left",
  pauseOnHover = false,
  className,
  autoFill = true,
}: {
  children: ReactNode;
  speed?: number;
  direction?: "left" | "right";
  pauseOnHover?: boolean;
  className?: string;
  autoFill?: boolean;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <Marquee
      speed={speed}
      direction={direction}
      pauseOnHover={pauseOnHover}
      play={!reduceMotion}
      autoFill={autoFill}
      className={className}
    >
      {children}
    </Marquee>
  );
}
