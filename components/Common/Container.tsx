import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export default function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-[1280px] px-4 sm:px-6 md:px-10 lg:px-16", className)}>
      {children}
    </div>
  );
}
