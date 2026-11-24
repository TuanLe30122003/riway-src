"use client";

import { cn } from "@/lib/utils";
import { gsap, MOTION_OK, MOTION_REDUCED, SplitText, useGSAP } from "@/lib/gsap";
import { Fragment, useRef, type ElementType, type ReactNode } from "react";

function renderText(text: string, highlightClassName: string) {
  const parts = text.split(/(<hl>[\s\S]*?<\/hl>)/g).filter(Boolean);
  const nodes: ReactNode[] = [];
  parts.forEach((part, partIndex) => {
    const highlight = part.startsWith("<hl>");
    const content = highlight ? part.slice(4, -5) : part;
    const lines = content.split("\n");
    lines.forEach((line, lineIndex) => {
      if (lineIndex > 0) nodes.push(<br key={`br-${partIndex}-${lineIndex}`} />);
      if (!line) return;
      nodes.push(
        highlight ? (
          <span key={`hl-${partIndex}-${lineIndex}`} className={highlightClassName}>
            {line}
          </span>
        ) : (
          <Fragment key={`tx-${partIndex}-${lineIndex}`}>{line}</Fragment>
        ),
      );
    });
  });
  return nodes;
}

type TextRevealProps = {
  text: string;
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  highlightClassName?: string;
  by?: "words" | "chars";
  stagger?: number;
  delay?: number;
  start?: string;
  animateOnMount?: boolean;
};

export default function TextReveal({
  text,
  as = "h2",
  className,
  highlightClassName = "text-gold",
  by = "words",
  stagger,
  delay = 0,
  start = "top 88%",
  animateOnMount = false,
}: TextRevealProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const Component: ElementType = as;

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const split = SplitText.create(el, {
          type: by === "chars" ? "words,chars" : "words",
          mask: "words",
          wordsClass: "split-word",
          charsClass: "split-char",
          autoSplit: true,
          onSplit(self) {
            gsap.set(el, { autoAlpha: 1 });
            const targets = by === "chars" ? self.chars : self.words;
            return gsap.from(targets, {
              yPercent: 115,
              rotate: by === "chars" ? 6 : 3,
              autoAlpha: 0,
              duration: by === "chars" ? 1.1 : 1,
              ease: "expo.out",
              stagger: stagger ?? (by === "chars" ? 0.025 : 0.06),
              delay,
              scrollTrigger: animateOnMount ? undefined : { trigger: el, start, once: true },
            });
          },
        });
        return () => split.revert();
      });
      mm.add(MOTION_REDUCED, () => {
        gsap.set(el, { autoAlpha: 1 });
      });
    },
    { scope: ref, dependencies: [text] },
  );

  return (
    <Component ref={ref} data-reveal className={cn(className)}>
      {renderText(text, highlightClassName)}
    </Component>
  );
}
