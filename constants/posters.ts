const poster = (index: number) =>
  `/images/Posters/poster-${String(index).padStart(2, "0")}.webp`;

const vertical = (index: number) =>
  `/images/Posters/vertical-${String(index).padStart(2, "0")}.webp`;

const music = (index: number) =>
  `/images/Music/music-${String(index).padStart(2, "0")}.webp`;

const MUSIC_COUNT = 12;

export const HERO_WALL_ROWS = [
  [1, 2, 3, 4, 5, 6, 7, 8],
  [9, 10, 11, 12, 13, 14, 15, 16],
  [17, 18, 19, 20, 21, 22, 23, 24],
  [5, 25, 13, 2, 21, 9, 17, 6],
].map((row) => row.map(poster));

const TV_SERIES = [26, 27, 28, 29, 6, 15, 10, 11, 12, 13, 8, 22, 24, 18, 20, 9, 2, 17, 21, 7, 23, 14].map(poster);
const ANIME = [3, 16, 25, 4, 1, 5, 19].map(poster);
const MUSIC = Array.from({ length: MUSIC_COUNT }, (_, index) => music(index + 1));
const VERTICAL = [1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4].map(vertical);

export const POSTER_CATEGORIES = ["tvSeries", "music", "anime", "verticalDrama"] as const;

export type PosterCategory = (typeof POSTER_CATEGORIES)[number];

export const POSTERS_BY_CATEGORY: Record<PosterCategory, string[]> = {
  tvSeries: TV_SERIES,
  music: MUSIC,
  anime: ANIME,
  verticalDrama: VERTICAL,
};

export type RailVariant = "landscape" | "portrait";

export const EXPLORE_RAILS: {
  category: PosterCategory;
  variant: RailVariant;
  posters: string[];
  trackClass: string;
}[] = [
  { category: "tvSeries", variant: "landscape", posters: TV_SERIES, trackClass: "mt-8 md:mt-20" },
  { category: "music", variant: "landscape", posters: MUSIC, trackClass: "mt-8 md:mt-16" },
  { category: "anime", variant: "landscape", posters: ANIME, trackClass: "mt-8 md:mt-16" },
  { category: "verticalDrama", variant: "portrait", posters: VERTICAL, trackClass: "mt-8 md:mt-14" },
];
