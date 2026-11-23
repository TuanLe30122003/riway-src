"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useRef, type ReactNode } from "react";

function StackCard({
  children,
  index,
  total,
  progress,
}: {
  children: ReactNode;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const start = index / total;
  const targetScale = 1 - (total - 1 - index) * 0.05;
  const scale = useTransform(progress, [start, 1], [1, targetScale]);
  const dim = useTransform(progress, [start, Math.min(start + 1 / total, 1), 1], [0, 0.25, 0.45]);

  return (
    <div className="sticky top-0 flex h-[58vh] items-start justify-center pt-[16vh] md:h-[62vh] md:pt-[18vh]">
      <motion.div
        style={{ scale, top: index * 26 }}
        className="relative w-full origin-top rounded-3xl will-change-transform"
      >
        {children}
        {index < total - 1 && (
          <motion.div
            aria-hidden
            style={{ opacity: dim }}
            className="pointer-events-none absolute inset-0 rounded-[inherit] bg-ink"
          />
        )}
      </motion.div>
    </div>
  );
}

export default function ScrollStack({
  items,
  className,
}: {
  items: ReactNode[];
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  if (reduceMotion) {
    return <div className={className}>{items.map((item, i) => <div key={i} className="mb-6">{item}</div>)}</div>;
  }

  return (
    <div ref={ref} className={className}>
      {items.map((item, index) => (
        <StackCard key={index} index={index} total={items.length} progress={scrollYProgress}>
          {item}
        </StackCard>
      ))}
    </div>
  );
}
