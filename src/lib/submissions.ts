import type { BeadShop, CraftEvent, EventType } from "@/types";
import { getCountryName } from "@/lib/geo/countries";

export type SupplierSubmissionInput = {
  name: string;
  city: string;
  countryCode: string;
  website: string;
  tags: string;
  description: string;
};

export type EventSubmissionInput = {
  title: string;
  type: EventType;
  date: string;
  city: string;
  countryCode: string;
  link: string;
  description: string;
};

const SUPPLIER_KEY = "luomus-supplier-submissions";
const EVENT_KEY = "luomus-event-submissions";

function safeParseArray<T>(value: string | null): T[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

export function loadSupplierSubmissions(): BeadShop[] {
  if (typeof window === "undefined") return [];
  return safeParseArray<BeadShop>(window.localStorage.getItem(SUPPLIER_KEY));
}

export function saveSupplierSubmission(input: SupplierSubmissionInput): BeadShop {
  if (typeof window === "undefined") {
    throw new Error("Supplier submissions can only be saved in the browser.");
  }

  const tags = input.tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  const record: BeadShop = {
    id: `usr-shop-${Date.now()}`,
    name: input.name.trim(),
    website: input.website.trim(),
    location: `${input.city.trim()} · ${getCountryName(input.countryCode)}`,
    countryCodes: [input.countryCode],
    beadTypes: tags.length > 0 ? tags : ["General crafts"],
    priceRange: "$$",
    rating: 5,
    shipping: "Contact store",
    specialty: input.description.trim(),
  };

  const current = loadSupplierSubmissions();
  const next = [record, ...current];
  window.localStorage.setItem(SUPPLIER_KEY, JSON.stringify(next));
  return record;
}

export function loadEventSubmissions(): CraftEvent[] {
  if (typeof window === "undefined") return [];
  return safeParseArray<CraftEvent>(window.localStorage.getItem(EVENT_KEY));
}

export function saveEventSubmission(input: EventSubmissionInput): CraftEvent {
  if (typeof window === "undefined") {
    throw new Error("Event submissions can only be saved in the browser.");
  }

  const record: CraftEvent = {
    id: `usr-event-${Date.now()}`,
    name: input.title.trim(),
    type: input.type,
    startDate: input.date,
    city: input.city.trim(),
    countryCode: input.countryCode,
    description: input.description.trim(),
    link: input.link.trim() || undefined,
    craftTags: [],
  };

  const current = loadEventSubmissions();
  const next = [record, ...current];
  window.localStorage.setItem(EVENT_KEY, JSON.stringify(next));
  return record;
}
