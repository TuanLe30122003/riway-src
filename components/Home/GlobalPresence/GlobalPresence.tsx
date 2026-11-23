"use client";

import GlowBlob from "@/components/Animation/GlowBlob";
import Container from "@/components/Common/Container";
import SectionHeading from "@/components/Common/SectionHeading";
import { motion, type Variants } from "framer-motion";
import { MapPin } from "lucide-react";
import { useTranslations } from "next-intl";

const group: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

const pill: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.85 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 260, damping: 22 },
  },
};

export default function GlobalPresence() {
  const t = useTranslations("HomePage.globalPresence");
  const countries = t.raw("countries") as string[];

  return (
    <section className="relative py-16 md:py-24">
      <GlowBlob color="ocean" className="top-0 left-[10%] h-[314px] w-[272px]" blur={220} opacity={0.3} />
      <GlowBlob color="gold" className="right-[10%] bottom-0 h-[314px] w-[272px]" blur={220} opacity={0.18} />
      <Container className="relative">
        <SectionHeading title={t("title")} />
        <motion.ul
          variants={group}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="mx-auto mt-8 flex max-w-[1000px] flex-wrap justify-center gap-x-2.5 gap-y-3 md:mt-[46px] md:gap-5"
        >
          {countries.map((country) => (
            <motion.li key={country} variants={pill}>
              <span className="glass group inline-flex h-[37px] cursor-default items-center gap-1.5 rounded-full px-[19px] text-sm text-white ring-1 ring-transparent transition-all duration-300 hover:-translate-y-0.5 hover:text-sky hover:ring-ocean hover:shadow-[0_0_24px_-6px_rgba(0,155,212,0.8)]">
                <MapPin
                  aria-hidden
                  className="-ml-1 size-0 text-sky opacity-0 transition-all duration-300 group-hover:size-3.5 group-hover:opacity-100"
                  strokeWidth={2}
                />
                {country}
              </span>
            </motion.li>
          ))}
        </motion.ul>
      </Container>
    </section>
  );
}
