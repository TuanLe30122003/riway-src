import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CarouselArrow({
  direction,
  onClick,
  label,
  className,
}: {
  direction: "prev" | "next";
  onClick: () => void;
  label: string;
  className?: string;
}) {
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        "flex size-10 shrink-0 items-center justify-center rounded-full bg-gold/80 text-white shadow-[0_8px_24px_-8px_rgba(251,186,63,0.8)] transition-all duration-300 hover:scale-110 hover:bg-gold active:scale-95 md:size-11",
        className,
      )}
    >
      <Icon className="size-5" strokeWidth={2} />
    </button>
  );
}
