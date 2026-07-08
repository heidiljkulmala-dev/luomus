import { Sora, DM_Sans, Plus_Jakarta_Sans } from "next/font/google";

export const logoFont = Sora({
  variable: "--font-logo-face",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});

export const titleFont = DM_Sans({
  variable: "--font-title-face",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});

export const bodyFont = Plus_Jakarta_Sans({
  variable: "--font-body-face",
  subsets: ["latin"],
  display: "swap",
});
