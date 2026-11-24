"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import { localeLabels, routing, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { gsap } from "@/lib/gsap";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState, useTransition } from "react";

export default function LocaleSwitcher({ className }: { className?: string }) {
  const t = useTranslations("Common");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const ref = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    if (open) {
      gsap.fromTo(
        list,
        { autoAlpha: 0, y: -10, scale: 0.96 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.35, ease: "expo.out", overwrite: true },
      );
      gsap.fromTo(
        list.querySelectorAll("li"),
        { autoAlpha: 0, x: -8 },
        { autoAlpha: 1, x: 0, duration: 0.3, stagger: 0.05, delay: 0.05, ease: "power2.out" },
      );
    } else {
      gsap.to(list, { autoAlpha: 0, y: -10, scale: 0.96, duration: 0.2, ease: "power2.in", overwrite: true });
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onClick = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const select = (next: Locale) => {
    setOpen(false);
    if (next === locale) return;
    startTransition(() => router.replace(pathname, { locale: next, scroll: false }));
  };

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        aria-label={t("language")}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "flex size-[41px] items-center justify-center border border-white text-xs text-white transition-colors duration-300 hover:border-gold hover:text-gold",
          pending && "opacity-60",
        )}
      >
        {localeLabels[locale]}
      </button>
      <ul
        ref={listRef}
        role="listbox"
        inert={!open}
        className="glass invisible absolute top-full right-0 mt-2 min-w-[110px] origin-top-right overflow-hidden rounded-lg border border-white/10 py-1 opacity-0"
      >
        {routing.locales.map((item) => (
          <li key={item}>
            <button
              type="button"
              role="option"
              aria-selected={item === locale}
              onClick={() => select(item)}
              className={cn(
                "flex w-full items-center justify-between px-4 py-2 text-left text-sm transition-colors hover:bg-white/10",
                item === locale ? "text-gold" : "text-white",
              )}
            >
              <span>{localeLabels[item]}</span>
              <span className="text-xs text-muted">{t(`locales.${item}`)}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
