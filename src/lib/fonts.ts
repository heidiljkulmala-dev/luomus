import { Sora, Outfit, Plus_Jakarta_Sans } from "next/font/google";

export const logoFont = Sora({
  variable: "--font-logo-face",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});

export const headerFont = Outfit({
  variable: "--font-header-face",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

export const bodyFont = Plus_Jakarta_Sans({
  variable: "--font-body-face",
  subsets: ["latin"],
  display: "swap",
});
