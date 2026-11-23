import About from "@/components/Home/About/About";
import GlobalPresence from "@/components/Home/GlobalPresence/GlobalPresence";
import Hero from "@/components/Home/Hero/Hero";
import Services from "@/components/Home/Services/Services";
import ContactSection from "@/components/Shared/ContactSection/ContactSection";
import Partners from "@/components/Shared/Partners/Partners";
import type { Locale } from "@/i18n/routing";
import { buildMetadata } from "@/lib/metadata";
import { setRequestLocale } from "next-intl/server";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return buildMetadata(locale, "home");
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <Services />
      <GlobalPresence />
      <About />
      <Partners />
      <ContactSection />
    </>
  );
}
