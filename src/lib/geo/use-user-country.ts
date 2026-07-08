"use client";

import { useCallback, useEffect, useState } from "react";
import { countryFromIp, countryFromLocale } from "./countries";

const STORAGE_KEY = "luomus-preferred-country";

export type CountrySource = "saved" | "ip" | "locale" | "manual";

export function useUserCountry() {
  const [country, setCountry] = useState<string | null>(null);
  const [detecting, setDetecting] = useState(true);
  const [source, setSource] = useState<CountrySource>("locale");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setCountry(saved);
      setSource("saved");
      setDetecting(false);
      return;
    }

    let cancelled = false;

    (async () => {
      const ipCountry = await countryFromIp();
      if (cancelled) return;
      if (ipCountry) {
        setCountry(ipCountry);
        setSource("ip");
      } else {
        setCountry(countryFromLocale());
        setSource("locale");
      }
      setDetecting(false);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const setPreferredCountry = useCallback((code: string) => {
    localStorage.setItem(STORAGE_KEY, code);
    setCountry(code);
    setSource("manual");
  }, []);

  return { country, detecting, source, setPreferredCountry };
}
