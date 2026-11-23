import FloatingImage from "@/components/Animation/FloatingImage";
import GlowBlob from "@/components/Animation/GlowBlob";
import Reveal from "@/components/Animation/Reveal";
import TextReveal from "@/components/Animation/TextReveal";
import Container from "@/components/Common/Container";
import ContactForm from "@/components/Shared/ContactSection/ContactForm";
import { useTranslations } from "next-intl";

export default function ContactSection() {
  const t = useTranslations("ContactSection");

  return (
    <section
      id="contact"
      className="relative scroll-mt-24 py-16 md:py-24"
    >
      <GlowBlob color="ocean" className="top-1/3 -right-20 h-[380px] w-[260px]" blur={200} opacity={0.35} />
      <GlowBlob color="gold" className="bottom-0 -left-24 h-[300px] w-[220px]" blur={200} opacity={0.18} />
      <Container className="relative grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_650px] lg:gap-[60px]">
        <div className="relative flex flex-col items-start">
          <FloatingImage
            src="/images/Common/globe-3d.webp"
            alt=""
            width={198}
            height={198}
            from={{ y: 40, rotate: -60 }}
            rotate={-30}
            mouse={24}
            className="mb-4 w-[130px] self-center md:w-[198px] lg:mb-10 lg:ml-[180px] lg:self-start"
          />
          <TextReveal
            as="h2"
            text={t.raw("title") as string}
            highlightClassName="text-gold"
            className="font-heading text-[56px] leading-[1.05] font-semibold text-white sm:text-[72px] lg:text-[90px] lg:leading-[107px]"
          />
        </div>
        <Reveal y={50} className="card-gold border-gradient relative rounded-[25px] p-4 backdrop-blur-sm sm:p-6">
          <ContactForm />
        </Reveal>
      </Container>
    </section>
  );
}
