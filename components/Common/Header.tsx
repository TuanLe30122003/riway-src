"use client";

import Container from "@/components/Common/Container";
import LocaleSwitcher from "@/components/Common/LocaleSwitcher";
import { NAV_ITEMS } from "@/constants/navigation";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useLenis } from "lenis/react";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState, type MouseEvent } from "react";

type NavItem = (typeof NAV_ITEMS)[number];

export default function Header() {
  const t = useTranslations("Common");
  const pathname = usePathname();
  const lenis = useLenis();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const underlineRef = useRef<HTMLSpanElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuTimeline = useRef<gsap.core.Timeline | null>(null);
  const menuOpenRef = useRef(false);

  useGSAP(
    () => {
      const header = headerRef.current;
      if (!header) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          header,
          { yPercent: -100, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, duration: 1.2, delay: 0.2, ease: "expo.out" },
        );
      });
      let hidden = false;
      const setHidden = (value: boolean) => {
        if (hidden === value) return;
        hidden = value;
        gsap.to(header, { yPercent: value ? -100 : 0, duration: 0.5, ease: "power3.out", overwrite: "auto" });
      };
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate(self) {
          const y = self.scroll();
          setScrolled(y > 80);
          if (menuOpenRef.current || y < 80) setHidden(false);
          else setHidden(self.direction === 1);
        },
      });

      const menu = menuRef.current;
      if (!menu) return;
      const links = menu.querySelectorAll<HTMLElement>("[data-menu-link]");
      menuTimeline.current = gsap
        .timeline({ paused: true })
        .set(menu, { visibility: "visible" })
        .fromTo(
          menu,
          { clipPath: "circle(0% at 100% 0%)" },
          { clipPath: "circle(150% at 100% 0%)", duration: 0.8, ease: "expo.inOut" },
        )
        .fromTo(
          links,
          { yPercent: 120, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, duration: 0.6, stagger: 0.08, ease: "expo.out" },
          "-=0.35",
        );
    },
    { scope: headerRef },
  );

  useEffect(() => {
    menuOpenRef.current = menuOpen;
    const timeline = menuTimeline.current;
    if (timeline) {
      if (menuOpen) timeline.timeScale(1).play();
      else timeline.timeScale(1.6).reverse();
    }
    if (menuOpen) {
      lenis?.stop();
      document.documentElement.style.overflow = "hidden";
    } else {
      lenis?.start();
      document.documentElement.style.overflow = "";
    }
  }, [menuOpen, lenis]);

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

  const isActive = (item: NavItem) =>
    !("hash" in item) && (pathname === item.href || pathname.startsWith(`${item.href}/`));

  useLayoutEffect(() => {
    const nav = navRef.current;
    const underline = underlineRef.current;
    if (!nav || !underline) return;
    const place = (instant: boolean) => {
      const active = nav.querySelector<HTMLElement>("[data-active='true']");
      const props = active ? { x: active.offsetLeft, width: active.offsetWidth, autoAlpha: 1 } : { autoAlpha: 0 };
      if (instant) gsap.set(underline, props);
      else gsap.to(underline, { ...props, duration: 0.6, ease: "expo.out", overwrite: true });
    };
    place(false);
    const observer = new ResizeObserver(() => place(true));
    observer.observe(nav);
    return () => observer.disconnect();
  }, [pathname]);

  const hrefOf = (item: NavItem) => ("hash" in item ? { pathname: item.href, hash: item.hash } : item.href);

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
      <header ref={headerRef} className="fixed inset-x-0 top-0 z-50">
        <div
          className={cn(
            "relative z-50 transition-[background-color,backdrop-filter,border-color] duration-500",
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
              <nav
                ref={navRef}
                aria-label="Main"
                className="relative hidden items-center gap-[clamp(2rem,6vw,6.5rem)] md:flex"
              >
                {NAV_ITEMS.map((item) => {
                  const active = isActive(item);
                  return (
                    <Link
                      key={item.key}
                      href={hrefOf(item)}
                      data-active={active}
                      onClick={(event) => onNavigate(event, item)}
                      className={cn(
                        "relative py-2 text-base transition-colors duration-300",
                        active ? "text-gold" : "text-soft hover:text-white",
                      )}
                    >
                      {t(`nav.${item.key}`)}
                    </Link>
                  );
                })}
                <span
                  ref={underlineRef}
                  aria-hidden
                  className="pointer-events-none invisible absolute bottom-1 left-0 h-px w-0 bg-gold"
                />
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
        </div>
      </header>

      <div
        ref={menuRef}
        inert={!menuOpen}
        className="invisible fixed inset-0 z-40 flex flex-col bg-ink/95 px-6 pt-28 backdrop-blur-xl [clip-path:circle(0%_at_100%_0%)] md:hidden"
      >
        <nav aria-label="Mobile" className="flex flex-col gap-2">
          {NAV_ITEMS.map((item) => (
            <div key={item.key} className="overflow-hidden">
              <Link
                href={hrefOf(item)}
                data-menu-link
                onClick={(event) => onNavigate(event, item)}
                className={cn(
                  "block border-b border-white/10 py-5 font-heading text-3xl font-semibold",
                  isActive(item) ? "text-gold" : "text-white",
                )}
              >
                {t(`nav.${item.key}`)}
              </Link>
            </div>
          ))}
        </nav>
      </div>
    </>
  );
}
