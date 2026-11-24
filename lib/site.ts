const vercelProductionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : undefined;

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  vercelProductionUrl ||
  "https://riwaymedia.com"
).replace(/\/$/, "");

export const SITE_NAME = "RIWAY MEDIA GROUP";
export const OG_IMAGE = "/images/Common/og-image.jpg";
