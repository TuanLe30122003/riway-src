import localFont from "next/font/local";

export const fontBody = localFont({
  src: [{ path: "../app/fonts/InterVariable.woff2", weight: "100 900", style: "normal" }],
  variable: "--font-inter",
  display: "swap",
});

export const fontHeading = localFont({
  src: [
    { path: "../app/fonts/ABCSolarDisplay-Light.woff2", weight: "300", style: "normal" },
    { path: "../app/fonts/ABCSolarDisplay-Regular.woff2", weight: "400", style: "normal" },
    { path: "../app/fonts/ABCSolarDisplay-Medium.woff2", weight: "500", style: "normal" },
    { path: "../app/fonts/ABCSolarDisplay-Semibold.woff2", weight: "600", style: "normal" },
    { path: "../app/fonts/ABCSolarDisplay-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-solar",
  display: "swap",
});
