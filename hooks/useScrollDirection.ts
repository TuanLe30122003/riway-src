"use client";

import { useMotionValueEvent, useScroll } from "framer-motion";
import { useState } from "react";

export function useScrollDirection(threshold = 80) {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (current) => {
    const previous = scrollY.getPrevious() ?? 0;
    const delta = current - previous;
    setScrolled(current > threshold);
    if (current < threshold) {
      setHidden(false);
    } else if (Math.abs(delta) > 4) {
      setHidden(delta > 0);
    }
  });

  return { hidden, scrolled };
}
