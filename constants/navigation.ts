export const NAV_ITEMS = [
  { key: "explore", href: "/explore" },
  { key: "contact", href: "/", hash: "contact" },
] as const;

export type NavKey = (typeof NAV_ITEMS)[number]["key"];

export const CONTACT_INFO = {
  email: "contact@riwaymedia.com",
  phone: "+84967825178",
  phoneDisplay: "(+84) 967-825-178",
  whatsapp: "https://wa.me/84967825178",
} as const;
