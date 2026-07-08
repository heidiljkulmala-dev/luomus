export type CountryOption = {
  code: string;
  name: string;
  flag: string;
};

export const countryOptions: CountryOption[] = [
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "FI", name: "Finland", flag: "🇫🇮" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "JP", name: "Japan", flag: "🇯🇵" },
  { code: "AU", name: "Australia", flag: "🇦🇺" },
  { code: "IN", name: "India", flag: "🇮🇳" },
  { code: "BR", name: "Brazil", flag: "🇧🇷" },
  { code: "ZA", name: "South Africa", flag: "🇿🇦" },
  { code: "MX", name: "Mexico", flag: "🇲🇽" },
  { code: "SE", name: "Sweden", flag: "🇸🇪" },
  { code: "NL", name: "Netherlands", flag: "🇳🇱" },
  { code: "IT", name: "Italy", flag: "🇮🇹" },
  { code: "ES", name: "Spain", flag: "🇪🇸" },
  { code: "NZ", name: "New Zealand", flag: "🇳🇿" },
  { code: "KR", name: "South Korea", flag: "🇰🇷" },
];

const countryByCode = new Map(countryOptions.map((c) => [c.code, c]));

export function getCountryName(code: string): string {
  return countryByCode.get(code)?.name ?? code;
}

export function getCountryFlag(code: string): string {
  return countryByCode.get(code)?.flag ?? "🌐";
}

export function getCountryOptions(detectedCode?: string | null): CountryOption[] {
  if (!detectedCode || countryByCode.has(detectedCode)) return countryOptions;
  return [{ code: detectedCode, name: detectedCode, flag: "🌐" }, ...countryOptions];
}

export function countryFromLocale(): string {
  if (typeof navigator === "undefined") return "US";
  const lang = navigator.language ?? "en-US";
  const region = lang.split("-")[1];
  if (region && region.length === 2) return region.toUpperCase();
  const primary = lang.split("-")[0].toLowerCase();
  const localeMap: Record<string, string> = {
    en: "US",
    fi: "FI",
    sv: "SE",
    de: "DE",
    fr: "FR",
    ja: "JP",
    pt: "BR",
    es: "ES",
    it: "IT",
    nl: "NL",
    ko: "KR",
  };
  return localeMap[primary] ?? "US";
}

export async function countryFromIp(): Promise<string | null> {
  try {
    const res = await fetch("https://ipapi.co/country_code/", {
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return null;
    const code = (await res.text()).trim().toUpperCase();
    return code.length === 2 ? code : null;
  } catch {
    return null;
  }
}
