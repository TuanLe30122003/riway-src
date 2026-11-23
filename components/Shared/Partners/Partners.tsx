import MarqueeRow from "@/components/Animation/MarqueeRow";
import Reveal from "@/components/Animation/Reveal";
import GlowBlob from "@/components/Animation/GlowBlob";
import SectionHeading from "@/components/Common/SectionHeading";
import { PARTNER_ROWS } from "@/constants/partners";
import { useTranslations } from "next-intl";
import Image from "next/image";

export default function Partners() {
  const t = useTranslations("Partners");

  return (
    <section className="relative py-16 md:py-24">
      <GlowBlob color="ocean" className="top-10 -left-24 h-[420px] w-[200px]" blur={180} opacity={0.4} />
      <GlowBlob color="ocean" className="top-10 -right-24 h-[420px] w-[200px]" blur={180} opacity={0.4} />
      <SectionHeading title={t("title")} className="px-4" />
      <Reveal y={30} className="mt-10 md:mt-12">
        <div className="relative flex flex-col gap-3 border-y border-line bg-ink-deep py-8 md:gap-[18px] md:py-[50px]">
          {PARTNER_ROWS.map((row, rowIndex) => (
            <MarqueeRow
              key={rowIndex}
              direction={rowIndex % 2 === 0 ? "left" : "right"}
              speed={rowIndex % 2 === 0 ? 38 : 32}
              pauseOnHover
            >
              {row.map((partner) => (
                <div
                  key={partner.name}
                  className="group mx-1.5 flex h-[82px] w-[150px] items-center justify-center rounded-[11px] bg-white px-3 transition-transform duration-300 hover:-translate-y-1 md:mx-2.5 md:h-[115px] md:w-[210px]"
                >
                  <Image
                    src={partner.src}
                    alt={partner.name}
                    width={188}
                    height={96}
                    sizes="190px"
                    className="max-h-[70%] w-auto max-w-[88%] object-contain grayscale-[30%] transition duration-300 group-hover:scale-105 group-hover:grayscale-0"
                  />
                </div>
              ))}
            </MarqueeRow>
          ))}
          <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-ink-deep to-transparent md:w-40" />
          <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-ink-deep to-transparent md:w-40" />
        </div>
      </Reveal>
    </section>
  );
}
