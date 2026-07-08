import type { CraftEvent, CraftId, EventType } from "@/types";

export const eventTypes: { id: EventType | "all"; label: string }[] = [
  { id: "all", label: "All types" },
  { id: "market", label: "Markets" },
  { id: "fair", label: "Fairs" },
  { id: "workshop", label: "Workshops" },
  { id: "meetup", label: "Meetups" },
];

export const craftEvents: CraftEvent[] = [
  {
    id: "e1",
    name: "Helsinki Handmade Market",
    type: "market",
    city: "Helsinki",
    countryCode: "FI",
    startDate: "2026-07-12",
    endDate: "2026-07-13",
    description:
      "A weekend market celebrating Finnish makers — jewelry, textiles, ceramics, and seasonal craft stalls in the Old Market Hall courtyard.",
    link: "https://example.com/helsinki-handmade",
    craftTags: ["beading", "fiber", "pottery"],
  },
  {
    id: "e2",
    name: "Brooklyn Indie Craft Fair",
    type: "fair",
    city: "Brooklyn",
    countryCode: "US",
    startDate: "2026-08-22",
    endDate: "2026-08-23",
    description:
      "Independent makers showcase handmade jewelry, fiber art, candles, and paper goods at this beloved summer fair.",
    link: "https://example.com/brooklyn-craft-fair",
    craftTags: ["beading", "fiber", "candle", "paper"],
  },
  {
    id: "e3",
    name: "London Craft Week Pop-up",
    type: "market",
    city: "London",
    countryCode: "GB",
    startDate: "2026-05-08",
    endDate: "2026-05-11",
    description:
      "Pop-up stalls and open studios across Shoreditch — meet makers, watch demos, and shop one-of-a-kind handmade pieces.",
    craftTags: ["sewing", "silversmithing", "drawing"],
  },
  {
    id: "e4",
    name: "Berlin Pottery Workshop Weekend",
    type: "workshop",
    city: "Berlin",
    countryCode: "DE",
    startDate: "2026-06-14",
    endDate: "2026-06-15",
    description:
      "Two days of wheel-throwing and hand-building sessions for beginners and intermediate potters, with glaze demos each afternoon.",
    link: "https://example.com/berlin-pottery",
    craftTags: ["pottery"],
  },
  {
    id: "e5",
    name: "Tokyo Fiber Arts Meetup",
    type: "meetup",
    city: "Tokyo",
    countryCode: "JP",
    startDate: "2026-07-19",
    description:
      "Monthly gathering for knitters, crocheters, and weavers — bring your WIP, swap patterns, and connect over tea.",
    craftTags: ["fiber", "macrame"],
  },
  {
    id: "e6",
    name: "Melbourne Makers Market",
    type: "market",
    city: "Melbourne",
    countryCode: "AU",
    startDate: "2026-09-06",
    endDate: "2026-09-07",
    description:
      "Outdoor market featuring local artisans — macramé, wood carving, candles, and hand-stitched textiles under the Fitzroy sun.",
    link: "https://example.com/melbourne-makers",
    craftTags: ["macrame", "wood", "candle", "sewing"],
  },
  {
    id: "e7",
    name: "Stockholm Christmas Craft Market",
    type: "market",
    city: "Stockholm",
    countryCode: "SE",
    startDate: "2026-11-28",
    endDate: "2026-11-30",
    description:
      "Seasonal stalls with Nordic knitwear, woven ornaments, and handmade gifts in the heart of Gamla Stan.",
    craftTags: ["fiber", "macrame", "wood"],
  },
  {
    id: "e8",
    name: "Toronto Beaders Society Meetup",
    type: "meetup",
    city: "Toronto",
    countryCode: "CA",
    startDate: "2026-07-26",
    description:
      "Friendly evening for beaders of all levels — share techniques, trade supplies, and work on peyote and brick stitch projects together.",
    craftTags: ["beading"],
  },
  {
    id: "e9",
    name: "Paris Atelier Embroidery Workshop",
    type: "workshop",
    city: "Paris",
    countryCode: "FR",
    startDate: "2026-08-09",
    description:
      "A full-day introduction to French knot embroidery and sashiko-inspired stitching, led by a textile artist in Le Marais.",
    link: "https://example.com/paris-embroidery",
    craftTags: ["sewing"],
  },
  {
    id: "e10",
    name: "Amsterdam DIY Craft Night",
    type: "meetup",
    city: "Amsterdam",
    countryCode: "NL",
    startDate: "2026-07-05",
    description:
      "Open studio night for any craft — bring beads, clay, or yarn and craft alongside other makers in a relaxed canal-side space.",
    craftTags: ["beading", "pottery", "fiber"],
  },
  {
    id: "e11",
    name: "Portland Maker Market",
    type: "fair",
    city: "Portland",
    countryCode: "US",
    startDate: "2026-10-03",
    endDate: "2026-10-04",
    description:
      "Pacific Northwest makers fair with live demos — silversmithing, leather tooling, and hand-poured candles across two days.",
    link: "https://example.com/portland-maker",
    craftTags: ["silversmithing", "candle", "wood"],
  },
  {
    id: "e12",
    name: "Sydney Paper & Print Fair",
    type: "fair",
    city: "Sydney",
    countryCode: "AU",
    startDate: "2026-08-16",
    description:
      "Bookbinding, linocut printing, and scrapbooking vendors gather for a one-day celebration of paper crafts.",
    craftTags: ["paper", "drawing"],
  },
];

export function isLocalEvent(event: CraftEvent, countryCode: string): boolean {
  return event.countryCode === countryCode;
}

export function sortEventsByCountry(events: CraftEvent[], countryCode: string): CraftEvent[] {
  return [...events].sort((a, b) => {
    const rank = (event: CraftEvent) => (isLocalEvent(event, countryCode) ? 0 : 1);
    const diff = rank(a) - rank(b);
    if (diff !== 0) return diff;
    return a.startDate.localeCompare(b.startDate);
  });
}

export function filterEvents(
  events: CraftEvent[],
  type: EventType | "all",
  craft: CraftId | "all"
): CraftEvent[] {
  return events.filter((event) => {
    if (type !== "all" && event.type !== type) return false;
    if (craft !== "all" && !event.craftTags.includes(craft)) return false;
    return true;
  });
}

export function formatEventDate(startDate: string, endDate?: string): string {
  const start = new Date(`${startDate}T12:00:00`);
  const startFmt = start.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  if (!endDate || endDate === startDate) return startFmt;

  const end = new Date(`${endDate}T12:00:00`);
  const sameMonth =
    start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();

  if (sameMonth) {
    const endDay = end.toLocaleDateString("en-GB", { day: "numeric" });
    const monthYear = start.toLocaleDateString("en-GB", { month: "short", year: "numeric" });
    return `${start.getDate()}–${endDay} ${monthYear}`;
  }

  const endFmt = end.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  return `${startFmt} – ${endFmt}`;
}

export const eventTypeLabels: Record<EventType, string> = {
  market: "Market",
  fair: "Fair",
  workshop: "Workshop",
  meetup: "Meetup",
};
