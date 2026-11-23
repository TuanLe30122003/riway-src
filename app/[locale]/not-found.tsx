import GlowBlob from "@/components/Animation/GlowBlob";
import Container from "@/components/Common/Container";
import { ButtonLink } from "@/components/Common/CustomButton";
import { useTranslations } from "next-intl";

export default function NotFoundPage() {
  const t = useTranslations("NotFound");

  return (
    <section className="relative flex min-h-[80vh] items-center overflow-hidden pt-28">
      <GlowBlob color="ocean" className="top-1/4 left-1/4 h-[300px] w-[400px]" blur={200} opacity={0.4} />
      <GlowBlob color="gold" className="right-1/4 bottom-1/4 h-[260px] w-[300px]" blur={200} opacity={0.25} />
      <Container className="relative flex flex-col items-center text-center">
        <p className="font-heading text-[96px] leading-none font-semibold text-gold md:text-[140px]">404</p>
        <h1 className="mt-4 font-heading text-2xl text-white md:text-[32px]">{t("title")}</h1>
        <p className="mt-3 max-w-[460px] text-base leading-7 text-muted">{t("description")}</p>
        <ButtonLink href="/" className="mt-8">
          {t("back")}
        </ButtonLink>
      </Container>
    </section>
  );
}
