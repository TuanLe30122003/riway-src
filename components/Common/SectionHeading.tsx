import Reveal from "@/components/Animation/Reveal";
import TextReveal from "@/components/Animation/TextReveal";
import { cn } from "@/lib/utils";

export default function SectionHeading({
  title,
  description,
  className,
  as = "h2",
}: {
  title: string;
  description?: string;
  className?: string;
  as?: "h1" | "h2";
}) {
  return (
    <div className={cn("mx-auto flex max-w-[820px] flex-col items-center gap-3 text-center", className)}>
      <TextReveal
        as={as}
        text={title}
        className="font-heading text-[28px] font-semibold leading-tight text-white text-balance-safe sm:text-[34px] lg:text-[40px]"
      />
      {description && (
        <Reveal delay={0.15} y={20}>
          <p className="max-w-[660px] text-base leading-7 text-muted md:text-xl">{description}</p>
        </Reveal>
      )}
    </div>
  );
}
