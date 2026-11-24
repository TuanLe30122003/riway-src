"use client";

import { cn } from "@/lib/utils";
import { useRef, type PointerEvent, type ReactNode } from "react";

export default function StatCard({
  value,
  label,
  icon,
  className,
}: {
  value: ReactNode;
  label: string;
  icon: ReactNode;
  className?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const trackPointer = (event: PointerEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card || event.pointerType !== "mouse") return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
    card.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
  };

  return (
    <div data-reveal-item onPointerMove={trackPointer} className={cn("group relative", className)}>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-6 top-6 -bottom-2 rounded-[14px] bg-gradient-to-br from-gold/60 to-ocean/60 opacity-0 blur-2xl transition-opacity duration-700 ease-out-expo group-hover:opacity-70"
      />
      <div
        ref={cardRef}
        className="card-stat relative flex h-full flex-col items-center justify-center overflow-hidden rounded-[14px] px-3 text-center transition-[translate] duration-700 ease-out-expo will-change-[translate] group-hover:-translate-y-1.5"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(240px circle at var(--spot-x, 50%) var(--spot-y, 50%), rgb(251 186 63 / 0.22), transparent 70%)",
          }}
        />
        <span
          aria-hidden
          className="border-gradient pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100 [--border-image:linear-gradient(135deg,#fbba3f,rgb(251_186_63/0.1)_40%,rgb(0_155_212/0.1)_60%,#009bd4)]"
        />
        <div className="relative font-heading leading-none font-semibold text-gold transition-[scale] duration-700 ease-out-expo group-hover:scale-[1.04]">
          {value}
        </div>
        <p className="relative mt-3 max-w-[260px] text-sm leading-snug font-semibold text-balance text-white md:mt-4 md:text-xl">
          <span className="mr-2 inline-flex translate-y-[3px] text-white/90 transition-colors duration-500 group-hover:text-gold [&>svg]:size-5 md:[&>svg]:size-[22px]">
            {icon}
          </span>
          {label}
        </p>
      </div>
    </div>
  );
}
