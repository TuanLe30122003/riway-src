import Reveal from "@/components/Animation/Reveal";
import { WhatsAppIcon } from "@/components/Common/BrandIcons";
import Container from "@/components/Common/Container";
import ScrollToTop from "@/components/Common/ScrollToTop";
import GlowBlob from "@/components/Animation/GlowBlob";
import { CONTACT_INFO } from "@/constants/navigation";
import { Mail, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import type { ReactNode } from "react";

function ContactRow({ href, icon, children }: { href?: string; icon: ReactNode; children: ReactNode }) {
  const content = (
    <>
      <span className="text-xs leading-[1.4] font-medium text-white">{children}</span>
      <span className="shrink-0 text-white/40 transition-colors duration-300 group-hover:text-gold">{icon}</span>
    </>
  );
  return (
    <li className="border-t border-white/20">
      {href ? (
        <a
          href={href}
          target={href.startsWith("http") ? "_blank" : undefined}
          rel="noreferrer"
          className="group flex items-center justify-between gap-6 py-[30px] transition-colors hover:text-gold"
        >
          {content}
        </a>
      ) : (
        <div className="group flex items-center justify-between gap-6 py-[30px]">{content}</div>
      )}
    </li>
  );
}

export default function Footer() {
  const t = useTranslations("Footer");

  return (
    <footer className="relative overflow-hidden bg-black">
      <GlowBlob color="ocean" className="-bottom-24 -left-24 h-[324px] w-[177px]" blur={120} opacity={0.35} />
      <Container className="relative pt-12 pb-7 md:pt-12">
        <div className="grid gap-12 md:grid-cols-2 md:gap-10">
          <Reveal className="flex flex-col gap-4">
            <Image
              src="/images/Common/logo-footer.webp"
              alt="RIWAY MEDIA GROUP"
              width={387}
              height={140}
              className="-ml-[3%] h-auto w-[260px] md:w-[387px]"
            />
            <p className="max-w-[308px] text-xs leading-[1.4] text-muted">{t("description")}</p>
          </Reveal>
          <Reveal delay={0.1} className="md:pt-9">
            <h2 className="mb-6 font-heading text-2xl leading-8 font-light text-gold">{t("contactTitle")}</h2>
            <ul className="border-b border-white/20">
              <ContactRow href={`mailto:${CONTACT_INFO.email}`} icon={<Mail className="size-4" />}>
                {t("email", { email: CONTACT_INFO.email })}
              </ContactRow>
              <ContactRow href={CONTACT_INFO.whatsapp} icon={<WhatsAppIcon className="size-4" />}>
                {t("whatsapp", { phone: CONTACT_INFO.phoneDisplay })}
              </ContactRow>
              <ContactRow icon={<MapPin className="size-[18px]" />}>{t("address")}</ContactRow>
            </ul>
          </Reveal>
        </div>
        <div className="mt-10 flex items-end justify-between">
          <p className="text-[10px] leading-[1.4] font-light text-white">{t("copyright", { year: new Date().getFullYear() })}</p>
          <ScrollToTop />
        </div>
      </Container>
    </footer>
  );
}
