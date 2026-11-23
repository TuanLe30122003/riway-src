const logo = (index: number) =>
  `/images/Partners/partner-${String(index).padStart(2, "0")}.webp`;

export const PARTNER_ROWS = [
  [
    { name: "OSEM", src: logo(1) },
    { name: "SConnect", src: logo(4) },
    { name: "Ninova", src: logo(5) },
    { name: "VTC", src: logo(2) },
    { name: "TUBRR", src: logo(6) },
    { name: "Ohene Media", src: logo(3) },
  ],
  [
    { name: "Families", src: logo(7) },
    { name: "YouTube", src: logo(8) },
    { name: "HFL Media", src: logo(9) },
    { name: "TUBRR Studio", src: logo(10) },
    { name: "Đen Quân Media", src: logo(11) },
    { name: "Bzzz", src: logo(12) },
  ],
];
