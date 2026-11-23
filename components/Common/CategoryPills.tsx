"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function CategoryPills<T extends string>({
  items,
  active,
  onChange,
  layoutId,
  className,
}: {
  items: { key: T; label: string }[];
  active: T;
  onChange: (key: T) => void;
  layoutId: string;
  className?: string;
}) {
  return (
    <div
      role="tablist"
      className={cn(
        "no-scrollbar -mx-4 flex max-w-[calc(100%+2rem)] items-center justify-start gap-2 overflow-x-auto px-4 sm:mx-0 sm:max-w-full sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0 md:gap-5",
        className,
      )}
    >
      {items.map((item, index) => {
        const selected = item.key === active;
        return (
          <motion.button
            key={item.key}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(item.key)}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 * index, duration: 0.5 }}
            className={cn(
              "glass relative h-9 shrink-0 rounded-full px-4 text-xs whitespace-nowrap transition-colors duration-300 md:h-[39px] md:px-[31px] md:text-sm",
              selected ? "text-sky" : "text-muted hover:text-white",
            )}
          >
            {selected && (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 rounded-full border border-ocean bg-steel/10 shadow-[0_0_24px_-6px_rgba(0,155,212,0.8)]"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            <span className="relative">{item.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
