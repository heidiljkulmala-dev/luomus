"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Calendar,
  ChevronDown,
  ExternalLink,
  Globe,
  MapPin,
  Plus,
} from "lucide-react";
import {
  craftEvents,
  eventTypeLabels,
  eventTypes,
  filterEvents,
  formatEventDate,
  isLocalEvent,
  sortEventsByCountry,
} from "@/lib/data/events";
import { getCountryFlag, getCountryName, getCountryOptions } from "@/lib/geo/countries";
import { useUserCountry } from "@/lib/geo/use-user-country";
import { craftCategories } from "@/lib/site";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { CraftId, EventType } from "@/types";

const typeBadgeVariant: Record<EventType, "amber" | "purple" | "pink" | "accent"> = {
  market: "amber",
  fair: "purple",
  workshop: "pink",
  meetup: "accent",
};

export default function EventsPage() {
  const [eventType, setEventType] = useState<EventType | "all">("all");
  const [craft, setCraft] = useState<CraftId | "all">("all");
  const [showWorldwide, setShowWorldwide] = useState(false);
  const { country, detecting, setPreferredCountry } = useUserCountry();

  const filtered = useMemo(() => {
    const base = filterEvents(craftEvents, eventType, craft);
    if (!country) return base;
    const scoped = showWorldwide
      ? base
      : base.filter((event) => isLocalEvent(event, country));
    return sortEventsByCountry(scoped, country);
  }, [eventType, craft, country, showWorldwide]);

  const localCount = country
    ? filterEvents(craftEvents, eventType, craft).filter((event) =>
        isLocalEvent(event, country)
      ).length
    : 0;

  const worldwideCount = filterEvents(craftEvents, eventType, craft).length;

  return (
    <div className="min-h-screen craft-grid">
      <div className="bg-gradient-to-b from-pink/10 to-transparent py-12">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h1 className="font-display text-4xl font-bold text-purple-dark">Craft Events</h1>
          <p className="mt-2 max-w-xl text-muted">
            Discover local craft markets, maker fairs, workshops, and meetups — events near you
            first, then gatherings from makers around the world.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative shrink-0">
            <label htmlFor="events-country-select" className="sr-only">
              Your country
            </label>
            <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg">
              {country ? getCountryFlag(country) : "🌐"}
            </div>
            <select
              id="events-country-select"
              value={country ?? ""}
              disabled={detecting}
              onChange={(e) => setPreferredCountry(e.target.value)}
              className="w-full appearance-none rounded-2xl border border-purple/15 bg-white/90 py-4 pl-11 pr-10 text-sm font-medium text-purple-dark shadow-sm focus:outline-none focus:ring-2 focus:ring-pink/30 disabled:opacity-60 sm:w-56"
            >
              {detecting && <option value="">Detecting location…</option>}
              {getCountryOptions(country).map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.name}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          </div>
        </div>

        {country && !detecting && (
          <div className="mb-6 flex flex-wrap items-center gap-3 rounded-2xl bg-yellow-soft/50 px-4 py-3">
            <MapPin className="h-4 w-4 shrink-0 text-purple-dark" />
            <p className="text-sm text-purple-dark font-body">
              Showing events in{" "}
              <span className="font-semibold font-header">
                {getCountryFlag(country)} {getCountryName(country)}
              </span>
              {localCount > 0 && (
                <span className="text-muted">
                  {" "}
                  · {localCount} upcoming event{localCount !== 1 ? "s" : ""}
                </span>
              )}
            </p>
            <button
              onClick={() => setShowWorldwide((v) => !v)}
              className={`ml-auto rounded-full px-3 py-1.5 text-xs font-medium transition-colors font-header ${
                showWorldwide
                  ? "bg-purple-dark text-white"
                  : "bg-white/80 text-muted hover:text-purple-dark"
              }`}
            >
              <Globe className="-mt-0.5 mr-1 inline h-3.5 w-3.5" />
              {showWorldwide ? "Near me first" : "Show worldwide"}
            </button>
          </div>
        )}

        <div className="mb-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted font-header">
            Event type
          </p>
          <div className="flex flex-wrap gap-2">
            {eventTypes.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setEventType(id)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors font-header ${
                  eventType === id
                    ? "bg-purple-dark text-white"
                    : "bg-white/80 text-purple-dark hover:bg-pink-soft"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted font-header">
            Craft
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCraft("all")}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors font-header ${
                craft === "all"
                  ? "bg-purple-dark text-white"
                  : "bg-white/80 text-purple-dark hover:bg-yellow-soft"
              }`}
            >
              All crafts
            </button>
            {craftCategories.map((c) => (
              <button
                key={c.id}
                onClick={() => setCraft(c.id as CraftId)}
                className={`inline-flex items-center gap-1 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors font-header ${
                  craft === c.id
                    ? "bg-purple-dark text-white"
                    : "bg-white/80 text-purple-dark hover:bg-yellow-soft"
                }`}
              >
                <span>{c.emoji}</span>
                {c.label.split(" & ")[0]}
              </button>
            ))}
          </div>
        </div>

        <p className="mb-6 text-sm text-muted">
          {filtered.length} event{filtered.length !== 1 ? "s" : ""} found
          {country && !showWorldwide && localCount === 0 && worldwideCount > 0 && (
            <span> — try showing worldwide for more</span>
          )}
        </p>

        {filtered.length === 0 ? (
          <div className="rounded-2xl bg-white/60 px-6 py-16 text-center">
            <Calendar className="mx-auto h-10 w-10 text-purple/40" />
            <p className="mt-4 font-header text-lg font-semibold text-purple-dark">
              No events match your filters
            </p>
            <p className="mt-2 text-sm text-muted font-body">
              Try a different craft or event type, or browse events worldwide.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-5"
              onClick={() => {
                setEventType("all");
                setCraft("all");
                setShowWorldwide(true);
              }}
            >
              Reset filters
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {filtered.map((event) => {
              const craftLabels = event.craftTags
                .map((id) => craftCategories.find((c) => c.id === id))
                .filter(Boolean);

              return (
                <Card key={event.id} className="p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant={typeBadgeVariant[event.type]}>
                          {eventTypeLabels[event.type]}
                        </Badge>
                        {country && isLocalEvent(event, country) && (
                          <Badge variant="amber">Near you</Badge>
                        )}
                      </div>
                      <h3 className="mt-2 font-display text-xl font-semibold text-purple-dark">
                        {event.name}
                      </h3>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="flex items-center justify-end gap-1 text-sm font-semibold text-purple-dark font-header">
                        <Calendar className="h-3.5 w-3.5 text-pink" />
                        {formatEventDate(event.startDate, event.endDate)}
                      </p>
                    </div>
                  </div>

                  <p className="mt-2 flex items-center gap-1 text-sm text-muted">
                    <MapPin className="h-3.5 w-3.5" />
                    {event.city}, {getCountryName(event.countryCode)}{" "}
                    {getCountryFlag(event.countryCode)}
                  </p>

                  <p className="mt-3 text-sm text-muted font-body">{event.description}</p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {craftLabels.map(
                      (c) =>
                        c && (
                          <Badge key={c.id} variant="accent">
                            {c.emoji} {c.label.split(" & ")[0]}
                          </Badge>
                        )
                    )}
                  </div>

                  {event.link && (
                    <div className="mt-5">
                      <a href={event.link} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm">
                          Event details <ExternalLink className="h-3.5 w-3.5" />
                        </Button>
                      </a>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}

        <div className="mt-12 rounded-[2rem] bg-gradient-to-br from-purple-soft/80 via-pink-soft/60 to-yellow-soft/50 p-8 text-center shadow-[0_20px_50px_rgba(37,20,47,0.04)]">
          <Plus className="mx-auto h-8 w-8 text-purple-dark" />
          <h2 className="mt-3 font-header text-2xl font-bold text-purple-dark">
            Know a craft event?
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted font-body">
            Help fellow makers discover markets, fairs, and workshops in your area. Event
            submissions are coming soon.
          </p>
          <Link href="/about" className="mt-5 inline-block">
            <Button variant="secondary">
              Submit an event
              <ExternalLink className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
