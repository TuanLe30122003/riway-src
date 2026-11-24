import FloatingImage from "@/components/Animation/FloatingImage";
import GlowBlob from "@/components/Animation/GlowBlob";
import ScrollStack from "@/components/Animation/ScrollStack";
import Container from "@/components/Common/Container";
import SectionHeading from "@/components/Common/SectionHeading";
import { useTranslations } from "next-intl";

type Service = { title: string; description: string };

export default function Services() {
  const t = useTranslations("HomePage.services");
  const items = t.raw("items") as Service[];

  return (
    <section id="services" className="relative scroll-mt-24 pt-16 md:pt-24">
      <GlowBlob color="gold" className="top-1/4 -left-24 h-[490px] w-[268px]" blur={240} opacity={0.22} />
      <GlowBlob color="ocean" className="top-1/2 -right-24 h-[490px] w-[267px]" blur={240} opacity={0.3} />
      <Container className="relative">
        <SectionHeading title={t("title")} />
        <div className="relative mx-auto mt-10 max-w-[826px] md:mt-[61px]">
          <FloatingImage
            src="/images/Decor/script-3d.webp"
            alt=""
            width={158}
            height={105}
            rotate={4}
            from={{ x: -80, rotate: -20 }}
            mouse={20}
            className="absolute top-[14vh] -left-[192px] hidden w-[158px] xl:block"
          />
          <FloatingImage
            src="/images/Decor/magnifier-3d.webp"
            alt=""
            width={216}
            height={144}
            from={{ x: 80, rotate: 20 }}
            floatDelay={1}
            mouse={-24}
            className="absolute top-[42%] -right-[250px] hidden w-[216px] xl:block"
          />
          <FloatingImage
            src="/images/Decor/film-strip-3d.webp"
            alt=""
            width={173}
            height={116}
            from={{ x: -80, rotate: -12 }}
            floatDelay={2}
            mouse={18}
            className="absolute bottom-[14%] -left-[208px] hidden w-[173px] xl:block"
          />
          <ScrollStack
            items={items.map((item, index) => (
              <article
                key={item.title}
                className="border-gradient border-ocean-gold relative flex flex-col gap-3 rounded-[20px] bg-ink px-6 py-8 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)] sm:flex-row sm:gap-[22px] md:min-h-[273px] md:px-5 md:py-[50px]"
              >
                <span className="font-heading text-4xl leading-none font-semibold text-muted md:text-5xl">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="sm:pt-2.5">
                  <h3 className="font-heading text-2xl leading-tight font-semibold text-gold md:text-[32px]">{item.title}</h3>
                  <p className="mt-4 max-w-[684px] text-base leading-7 text-muted md:text-xl">{item.description}</p>
                </div>
              </article>
            ))}
          />
        </div>
      </Container>
    </section>
  );
}
