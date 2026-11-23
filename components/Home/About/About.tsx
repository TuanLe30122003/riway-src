import CountUp from "@/components/Animation/CountUp";
import FloatingImage from "@/components/Animation/FloatingImage";
import GlowBlob from "@/components/Animation/GlowBlob";
import Reveal, { StaggerGroup, StaggerItem } from "@/components/Animation/Reveal";
import TextReveal from "@/components/Animation/TextReveal";
import { YoutubeIcon } from "@/components/Common/BrandIcons";
import Container from "@/components/Common/Container";
import SectionHeading from "@/components/Common/SectionHeading";
import { cn } from "@/lib/utils";
import { Calendar, Eye } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

const STATS = { channels: 30, years: 3, views: 100 };

function StatCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <StaggerItem
      className={cn(
        "card-stat group flex flex-col items-center justify-center rounded-[14px] px-4 text-center transition-[transform,box-shadow] duration-500 hover:-translate-y-1.5 hover:shadow-[0_20px_50px_-20px_rgba(251,186,63,0.55)]",
        className,
      )}
    >
      {children}
    </StaggerItem>
  );
}

export default function About() {
  const t = useTranslations("HomePage.about");

  return (
    <section id="about" className="relative scroll-mt-24 py-16 md:py-24">
      <GlowBlob color="ocean" className="top-1/3 -left-24 h-[490px] w-[267px]" blur={220} opacity={0.4} />
      <GlowBlob color="gold" className="-right-24 bottom-0 h-[490px] w-[268px]" blur={220} opacity={0.18} />
      <Container className="relative">
        <SectionHeading title={t("title")} />
        <div className="mt-10 grid items-center gap-6 md:mt-14 lg:grid-cols-[minmax(0,1fr)_664px] lg:gap-10">
          <FloatingImage
            src="/images/Home/logo-3d.webp"
            alt="RIWAY MEDIA GROUP"
            width={421}
            height={421}
            rotate={6}
            from={{ x: -140, y: 20, rotate: -18 }}
            mouse={36}
            sizes="(max-width: 1024px) 60vw, 421px"
            className="mx-auto w-[220px] sm:w-[300px] lg:mx-0 lg:-ml-[58px] lg:w-[421px] lg:translate-y-14"
          />
          <div className="relative">
            <FloatingImage
              src="/images/Home/youtube-3d.webp"
              alt=""
              width={208}
              height={138}
              rotate={7}
              from={{ x: 80, y: -40, rotate: 30 }}
              delay={0.3}
              floatDelay={1.2}
              mouse={-28}
              className="absolute -top-[84px] right-1 z-10 w-[88px] sm:-top-20 sm:w-[120px] md:w-[160px] lg:-top-[110px] lg:-right-[60px] lg:w-[208px]"
            />
            <TextReveal
              text="<hl>RIWAY MEDIA GROUP</hl>"
              className="font-heading text-[28px] leading-[1.3] font-semibold sm:text-[34px] lg:text-[40px]"
            />
            <Reveal delay={0.15} y={16} className="mt-3">
              <span className="glass inline-flex min-h-[47px] items-center rounded-full px-5 py-2 text-sm text-white md:text-xl">
                {t("tagline")}
              </span>
            </Reveal>
            <StaggerGroup className="mt-6 grid grid-cols-2 gap-3 md:mt-[31px] md:gap-6" stagger={0.15}>
              <StatCard className="h-[150px] md:h-[182px]">
                <CountUp to={STATS.channels} suffix="+" className="font-heading text-[42px] leading-none font-semibold text-gold md:text-[60px]" />
                <span className="mt-3 flex items-center gap-2 text-sm font-semibold text-white md:mt-4 md:text-xl">
                  <YoutubeIcon className="size-5 shrink-0 md:size-[23px]" />
                  {t("channels")}
                </span>
              </StatCard>
              <StatCard className="h-[150px] md:h-[182px]">
                <CountUp to={STATS.years} suffix="+" className="font-heading text-[42px] leading-none font-semibold text-gold md:text-[60px]" />
                <span className="mt-3 flex items-center gap-2 text-sm font-semibold text-white md:mt-4 md:text-xl">
                  <Calendar className="size-5 shrink-0 md:size-[22px]" strokeWidth={1.6} />
                  {t("years")}
                </span>
              </StatCard>
              <StatCard className="col-span-2 h-[140px] md:h-[169px]">
                <p className="font-heading text-[28px] leading-tight font-semibold text-gold sm:text-[36px] md:text-[48px]">
                  {t.rich("views", { count: () => <CountUp to={STATS.views} /> })}
                </p>
                <span className="mt-3 flex items-center gap-2 text-sm font-semibold text-white md:text-xl">
                  <Eye className="size-5 shrink-0 md:size-6" strokeWidth={1.6} />
                  {t("viewsLabel")}
                </span>
              </StatCard>
            </StaggerGroup>
          </div>
        </div>
      </Container>
    </section>
  );
}
