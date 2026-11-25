const logo = (index: number) =>
  `/images/Partners/partner-${String(index).padStart(2, "0")}.webp`;

const PARTNERS = [
  "VTC",
  "Ninova",
  "iZO Network",
  "KUKAN",
  "Ohene Media",
  "BPLUS",
  "Familyes",
  "YouTube",
  "HFL Media",
  "TUBRR",
  "KOSEM",
  "Đen Quân Media & Entertainment",
  "bzzz!",
  "SConnect",
  "SoundCloud",
  "CostMusik Group",
].map((name, index) => ({ name, src: logo(index + 1) }));

export const PARTNER_ROWS = [PARTNERS.slice(0, 8), PARTNERS.slice(8)];
