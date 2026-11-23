"use client";

import { useLenis } from "lenis/react";
import { ChevronUp } from "lucide-react";
import { useTranslations } from "next-intl";

export default function ScrollToTop() {
  const t = useTranslations("Common");
  const lenis = useLenis();

  const toTop = () => {
    if (lenis) lenis.scrollTo(0, { duration: 1.6 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label={t("backToTop")}
      className="group flex size-[60px] items-center justify-center rounded-full border border-white/20 text-white transition-all duration-300 hover:-translate-y-1 hover:border-gold hover:text-gold"
    >
      <ChevronUp className="size-5 transition-transform duration-300 group-hover:-translate-y-0.5" strokeWidth={1.5} />
    </button>
  );
}
