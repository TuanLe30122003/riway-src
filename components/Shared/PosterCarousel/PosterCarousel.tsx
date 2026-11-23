"use client";

import CategoryPills from "@/components/Common/CategoryPills";
import CarouselTrack from "@/components/Shared/PosterCarousel/CarouselTrack";
import { POSTERS_BY_CATEGORY, type PosterCategory } from "@/constants/posters";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function PosterCarousel({
  categories,
  defaultCategory,
  layoutId,
}: {
  categories: PosterCategory[];
  defaultCategory?: PosterCategory;
  layoutId: string;
}) {
  const t = useTranslations("Categories");
  const [active, setActive] = useState<PosterCategory>(defaultCategory ?? categories[0]);
  const items = categories.map((key) => ({ key, label: t(key) }));

  return (
    <div className="flex w-full flex-col items-center gap-8 md:gap-12">
      <CategoryPills items={items} active={active} onChange={setActive} layoutId={layoutId} />
      <div className="w-full">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -16, filter: "blur(6px)" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <CarouselTrack posters={POSTERS_BY_CATEGORY[active]} label={t(active)} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
