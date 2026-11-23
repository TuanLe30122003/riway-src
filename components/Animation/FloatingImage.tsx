"use client";

import { cn } from "@/lib/utils";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import { useEffect } from "react";

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
  rotate = 0,
  priority = false,
  sizes,
}: FloatingImageProps) {
  const reduceMotion = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 20 });
  const sy = useSpring(my, { stiffness: 60, damping: 20 });
  const tx = useTransform(sx, (v) => v * mouse);
  const ty = useTransform(sy, (v) => v * mouse);

  useEffect(() => {
    if (!mouse || reduceMotion) return;
    const onMove = (event: MouseEvent) => {
      mx.set(event.clientX / window.innerWidth - 0.5);
      my.set(event.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [mouse, reduceMotion, mx, my]);

  return (
    <motion.div
      className={cn("pointer-events-none select-none", className)}
      initial={{ opacity: 0, x: from.x ?? 0, y: from.y ?? 0, rotate: from.rotate ?? rotate }}
      whileInView={{ opacity: 1, x: 0, y: 0, rotate }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div style={mouse && !reduceMotion ? { x: tx, y: ty } : undefined}>
        <div
          className="animate-float"
          style={{ animationDelay: `${floatDelay}s` }}
        >
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
      </motion.div>
    </motion.div>
  );
}
