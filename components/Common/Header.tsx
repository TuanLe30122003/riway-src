"use client";

import Container from "@/components/Common/Container";
import LocaleSwitcher from "@/components/Common/LocaleSwitcher";
import { NAV_ITEMS } from "@/constants/navigation";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useLenis } from "lenis/react";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useState, type MouseEvent } from "react";

type NavItem = (typeof NAV_ITEMS)[number];

export default function Header() {
  const t = useTranslations("Common");
  const pathname = usePathname();
  const { hidden, scrolled } = useScrollDirection();
  const [menuOpen, setMenuOpen] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    const timer = window.setTimeout(() => {
      const target = document.getElementById(hash);
      if (!target) return;
      lenis?.resize();
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80 });
    }, 300);
    return () => window.clearTimeout(timer);
  }, [pathname, lenis]);

  useEffect(() => {
    if (menuOpen) {
      lenis?.stop();
      document.documentElement.style.overflow = "hidden";
    } else {
      lenis?.start();
      document.documentElement.style.overflow = "";
    }
  }, [menuOpen, lenis]);

  const isActive = (item: NavItem) =>
    !("hash" in item) && (pathname === item.href || pathname.startsWith(`${item.href}/`));

  const hrefOf = (item: NavItem) =>
    "hash" in item ? { pathname: item.href, hash: item.hash } : item.href;

  const onNavigate = (event: MouseEvent<HTMLAnchorElement>, item: NavItem) => {
    if (!("hash" in item) || pathname !== item.href) return;
    event.preventDefault();
    setMenuOpen(false);
    const target = document.getElementById(item.hash);
    if (!target) return;
    if (lenis) lenis.scrollTo(target, { offset: -80, duration: 1.4 });
    else target.scrollIntoView({ behavior: "smooth" });
    window.history.replaceState(null, "", `#${item.hash}`);
  };

  return (
    <>
      <motion.header
        initial={{ y: -120, opacity: 0 }}
        animate={{ y: hidden && !menuOpen ? -120 : 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-500",
          scrolled && !menuOpen
            ? "border-b border-white/5 bg-ink/75 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <Container className="flex h-[72px] items-center justify-between md:h-[96px]">
          <Link href="/" aria-label="RIWAY MEDIA GROUP" className="relative z-10 shrink-0">
            <Image
              src="/images/Common/logo-header.webp"
              alt="RIWAY MEDIA GROUP"
              width={227}
              height={82}
              priority
              className="h-12 w-auto md:h-[70px] lg:h-[82px]"
            />
          </Link>

          <div className="flex items-center gap-6 lg:gap-[clamp(2.5rem,7vw,6.5rem)]">
            <nav aria-label="Main" className="hidden items-center gap-[clamp(2rem,6vw,6.5rem)] md:flex">
              {NAV_ITEMS.map((item) => {
                const active = isActive(item);
                return (
                  <Link
                    key={item.key}
                    href={hrefOf(item)}
                    onClick={(event) => onNavigate(event, item)}
                    className={cn(
                      "relative py-2 text-base transition-colors duration-300",
                      active ? "text-gold" : "text-soft hover:text-white",
                    )}
                  >
                    {t(`nav.${item.key}`)}
                    {active && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute inset-x-0 -bottom-0.5 h-px bg-gold"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>
            <LocaleSwitcher className="relative z-10" />
            <button
              type="button"
              aria-label={menuOpen ? t("close") : t("menu")}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((value) => !value)}
              className="relative z-10 flex size-[41px] items-center justify-center text-white md:hidden"
            >
              {menuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
          </div>
        </Container>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ clipPath: "circle(0% at 100% 0%)" }}
            animate={{ clipPath: "circle(150% at 100% 0%)" }}
            exit={{ clipPath: "circle(0% at 100% 0%)" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 flex flex-col bg-ink/95 px-6 pt-28 backdrop-blur-xl md:hidden"
          >
            <nav aria-label="Mobile" className="flex flex-col gap-2">
              {NAV_ITEMS.map((item, index) => (
                <motion.div
                  key={item.key}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + index * 0.08, duration: 0.5 }}
                >
                  <Link
                    href={hrefOf(item)}
                    onClick={(event) => onNavigate(event, item)}
                    className={cn(
                      "block border-b border-white/10 py-5 font-heading text-3xl font-semibold",
                      isActive(item) ? "text-gold" : "text-white",
                    )}
                  >
                    {t(`nav.${item.key}`)}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
