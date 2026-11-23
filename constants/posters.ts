const poster = (index: number) =>
  `/images/Posters/poster-${String(index).padStart(2, "0")}.webp`;

const vertical = (index: number) =>
  `/images/Posters/vertical-${String(index).padStart(2, "0")}.webp`;

export const POSTERS = Array.from({ length: 25 }, (_, i) => poster(i + 1));

export const HERO_WALL_ROWS = [
  [1, 2, 3, 4, 5, 6, 7, 8],
  [9, 10, 11, 12, 13, 14, 15, 16],
  [17, 18, 19, 20, 21, 22, 23, 24],
  [5, 25, 13, 2, 21, 9, 17, 6],
].map((row) => row.map(poster));

export const POSTER_CATEGORIES = ["tvSeries", "music", "anime", "verticalDrama"] as const;

export type PosterCategory = (typeof POSTER_CATEGORIES)[number];

export const POSTERS_BY_CATEGORY: Record<PosterCategory, string[]> = {
  tvSeries: [21, 9, 6, 13, 18, 11, 23, 15, 2].map(poster),
  music: [1, 10, 22, 7, 14, 19, 5, 24, 12].map(poster),
  anime: [3, 16, 25, 4, 8, 17, 20, 13, 9].map(poster),
  verticalDrama: [6, 15, 2, 23, 11, 18, 21, 7, 14].map(poster),
};

export type RailVariant = "landscape" | "portrait";

export const EXPLORE_RAILS: { category: PosterCategory; variant: RailVariant; posters: string[] }[] = [
  { category: "tvSeries", variant: "landscape", posters: POSTERS_BY_CATEGORY.tvSeries },
  { category: "anime", variant: "landscape", posters: POSTERS_BY_CATEGORY.anime },
  {
    category: "verticalDrama",
    variant: "portrait",
    posters: [1, 2, 3, 4, 1, 2, 3, 4].map(vertical),
  },
];
