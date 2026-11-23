import { cn } from "@/lib/utils";
import type { CSSProperties } from "react";

const COLORS = {
  gold: "#fbba3f",
  ocean: "#009bd4",
  sky: "#61d4ff",
} as const;

export default function GlowBlob({
  color = "ocean",
  className,
  blur = 160,
  opacity = 0.35,
  drift = true,
  style,
}: {
  color?: keyof typeof COLORS;
  className?: string;
  blur?: number;
  opacity?: number;
  drift?: boolean;
  style?: CSSProperties;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute rounded-full",
        drift && "animate-drift",
        className,
      )}
      style={{
        backgroundColor: COLORS[color],
        filter: `blur(${blur}px)`,
        opacity,
        ...style,
      }}
    />
  );
}
