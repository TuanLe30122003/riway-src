import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

type Variant = "outline" | "solid";

const base =
  "group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full font-body transition-all duration-300 ease-out-expo focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<Variant, string> = {
  outline:
    "pill-gold h-[47px] px-5 text-base text-gold hover:-translate-y-0.5 hover:bg-gold hover:text-ink hover:shadow-[0_10px_30px_-10px_rgba(251,186,63,0.7)] md:text-xl",
  solid:
    "h-10 bg-gold px-6 text-sm font-medium text-black hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-8px_rgba(251,186,63,0.8)]",
};

function Content({ children, variant }: { children: ReactNode; variant: Variant }) {
  const Icon = variant === "outline" ? ArrowUpRight : ChevronRight;
  return (
    <>
      <span
        aria-hidden
        className="absolute inset-y-0 -left-1/2 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:animate-shine group-hover:opacity-100"
      />
      <span className="relative">{children}</span>
      <Icon
        aria-hidden
        className={cn(
          "relative size-4 transition-transform duration-300",
          variant === "outline"
            ? "group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            : "group-hover:translate-x-1",
        )}
        strokeWidth={1.8}
      />
    </>
  );
}

export function ButtonLink({
  href,
  children,
  variant = "outline",
  className,
}: {
  href: ComponentProps<typeof Link>["href"];
  children: ReactNode;
  variant?: Variant;
  className?: string;
}) {
  return (
    <Link href={href} className={cn(base, variants[variant], className)}>
      <Content variant={variant}>{children}</Content>
    </Link>
  );
}

export default function CustomButton({
  children,
  variant = "outline",
  className,
  ...props
}: ComponentProps<"button"> & { variant?: Variant }) {
  return (
    <button className={cn(base, variants[variant], className)} {...props}>
      <Content variant={variant}>{children}</Content>
    </button>
  );
}
