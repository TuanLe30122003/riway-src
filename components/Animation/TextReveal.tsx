"use client";

import { cn } from "@/lib/utils";
import { motion, type Variants } from "framer-motion";
import { Fragment } from "react";

type Token = { word: string; highlight: boolean } | { lineBreak: true };

function tokenize(text: string): Token[] {
  const tokens: Token[] = [];
  const parts = text.split(/(<hl>[\s\S]*?<\/hl>)/g).filter(Boolean);

  for (const part of parts) {
    const highlight = part.startsWith("<hl>");
    const content = highlight ? part.slice(4, -5) : part;
    content.split(/(\n)/).forEach((segment) => {
      if (segment === "\n") {
        tokens.push({ lineBreak: true });
        return;
      }
      segment
        .split(/\s+/)
        .filter(Boolean)
        .forEach((word) => tokens.push({ word, highlight }));
    });
  }

  return tokens;
}

const container: Variants = {
  hidden: {},
  visible: ({ stagger, delay }: { stagger: number; delay: number }) => ({
    transition: { staggerChildren: stagger, delayChildren: delay },
  }),
};

const wordVariants: Variants = {
  hidden: { y: "110%", opacity: 0 },
  visible: {
    y: "0%",
    opacity: 1,
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
  },
};

type TextRevealProps = {
  text: string;
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  highlightClassName?: string;
  stagger?: number;
  delay?: number;
  amount?: number;
  animateOnMount?: boolean;
};

export default function TextReveal({
  text,
  as = "h2",
  className,
  highlightClassName = "text-gold",
  stagger = 0.06,
  delay = 0,
  amount = 0.5,
  animateOnMount = false,
}: TextRevealProps) {
  const Component = motion[as];
  const tokens = tokenize(text);
  const label = text.replace(/<\/?hl>/g, "").replace(/\n/g, " ");
  const trigger = animateOnMount
    ? { animate: "visible" as const }
    : { whileInView: "visible" as const, viewport: { once: true, amount } };

  return (
    <Component
      className={className}
      aria-label={label}
      variants={container}
      custom={{ stagger, delay }}
      initial="hidden"
      {...trigger}
    >
      {tokens.map((token, index) =>
        "lineBreak" in token ? (
          <br key={`br-${index}`} />
        ) : (
          <Fragment key={`${token.word}-${index}`}>
            <span aria-hidden className="inline-flex overflow-hidden pb-[0.12em] align-bottom">
              <motion.span
                variants={wordVariants}
                className={cn("inline-block", token.highlight && highlightClassName)}
              >
                {token.word}
              </motion.span>
            </span>{" "}
          </Fragment>
        ),
      )}
    </Component>
  );
}
