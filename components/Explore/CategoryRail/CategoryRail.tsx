import Reveal from "@/components/Animation/Reveal";
import Container from "@/components/Common/Container";
import CoverflowCarousel from "@/components/Shared/CoverflowCarousel/CoverflowCarousel";
import type { RailVariant } from "@/constants/posters";
import { cn } from "@/lib/utils";

export default function CategoryRail({
  label,
  posters,
  variant,
  first = false,
  autoplayDelay,
  trackClass,
}: {
  label: string;
  posters: string[];
  variant: RailVariant;
  first?: boolean;
  autoplayDelay?: number;
  trackClass: string;
}) {
  return (
    <section aria-label={label} className={cn("relative", first ? "pt-8 md:pt-[50px]" : "pt-20 md:pt-[123px]")}>
      <Container>
        <Reveal x={-40} y={0}>
          <h2 className="border-gradient border-ocean-gold relative inline-flex h-[46px] items-center rounded-full bg-ink px-6 text-lg text-gold md:h-[53px] md:px-[18px] md:text-2xl">
            {label}
          </h2>
        </Reveal>
        <div className={trackClass}>
          <CoverflowCarousel posters={posters} variant={variant} label={label} autoplayDelay={autoplayDelay} />
        </div>
      </Container>
    </section>
  );
}
