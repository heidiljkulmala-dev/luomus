"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Calendar,
  ChevronDown,
  ExternalLink,
  Globe,
  MapPin,
  Plus,
  X,
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
import { useAuth } from "@/components/auth/AuthProvider";
import { Badge } from "@/components/ui/Badge";
import { Button, SMALL_CHIP_ACTIVE_PATTERN, SMALL_CHIP_PATTERN } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { loadEventSubmissions, saveEventSubmission } from "@/lib/submissions";
import type { CraftEvent, CraftId, EventType } from "@/types";

const typeBadgeVariant: Record<EventType, "amber" | "purple" | "pink" | "accent"> = {
  market: "amber",
  fair: "purple",
  workshop: "pink",
  meetup: "accent",
};

export default function EventsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const [eventType, setEventType] = useState<EventType | "all">("all");
  const [craft, setCraft] = useState<CraftId | "all">("all");
  const [showWorldwide, setShowWorldwide] = useState(false);
  const [submittedEvents, setSubmittedEvents] = useState<CraftEvent[]>([]);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [form, setForm] = useState({
    title: "",
    type: "market" as EventType,
    date: "",
    city: "",
    countryCode: "",
    link: "",
    description: "",
  });
  const { country, detecting, setPreferredCountry } = useUserCountry();
  const allEvents = useMemo(() => [...submittedEvents, ...craftEvents], [submittedEvents]);

  useEffect(() => {
    setSubmittedEvents(loadEventSubmissions());
  }, []);

  useEffect(() => {
    if (country && !form.countryCode) {
      setForm((prev) => ({ ...prev, countryCode: country }));
    }
  }, [country, form.countryCode]);

  useEffect(() => {
    if (searchParams.get("openSubmission") !== "event" || authLoading || !user) return;
    setShowSubmissionModal(true);
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.delete("openSubmission");
    const next = nextParams.toString();
    router.replace(next ? `${pathname}?${next}` : pathname);
  }, [authLoading, pathname, router, searchParams, user]);

  const filtered = useMemo(() => {
    const base = filterEvents(allEvents, eventType, craft);
    if (!country) return base;
    const scoped = showWorldwide
      ? base
      : base.filter((event) => isLocalEvent(event, country));
    return sortEventsByCountry(scoped, country);
  }, [allEvents, eventType, craft, country, showWorldwide]);

  const localCount = country
    ? filterEvents(allEvents, eventType, craft).filter((event) =>
        isLocalEvent(event, country)
      ).length
    : 0;

  const worldwideCount = filterEvents(allEvents, eventType, craft).length;

  function submissionReturnUrl() {
    const params = new URLSearchParams(searchParams.toString());
    params.set("openSubmission", "event");
    return `${pathname}?${params.toString()}`;
  }

  function handleOpenSubmission() {
    if (authLoading) return;
    if (!user) {
      router.push(`/auth/sign-in?redirect=${encodeURIComponent(submissionReturnUrl())}`);
      return;
    }
    setSubmitMessage("");
    setShowSubmissionModal(true);
  }

  function handleSubmitEvent(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const saved = saveEventSubmission(form);
    setSubmittedEvents((prev) => [saved, ...prev]);
    setSubmitMessage(`Added ${saved.name} to events.`);
    setShowSubmissionModal(false);
    setForm((prev) => ({
      ...prev,
      title: "",
      date: "",
      city: "",
      link: "",
      description: "",
    }));
  }

  return (
    <div className="min-h-screen craft-grid">
      <div className="bg-gradient-to-b from-pink/10 to-transparent py-12">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h1 className="font-header text-4xl font-bold tracking-[-0.035em] text-purple-dark">Craft Events</h1>
          <p className="mt-3 max-w-xl text-muted font-body">
            Discover local craft markets, maker fairs, workshops, and meetups — events near you
            first, then gatherings from makers around the world.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <div className="mb-6 rounded-2xl border border-purple/15 bg-white/70 p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-header text-lg font-semibold text-purple-dark">Organizing an event?</h2>
              <p className="text-sm text-muted font-body">
                Share your market, workshop, or meetup with makers nearby.
              </p>
            </div>
            <Button size="lg" onClick={handleOpenSubmission}>
              <Plus className="h-4 w-4" />
              Add your event
            </Button>
          </div>
          {!user && !authLoading && (
            <p className="mt-3 text-xs text-muted">
              Sign in or create an account to submit your event.
            </p>
          )}
          {submitMessage && <p className="mt-3 text-sm text-accent font-medium">{submitMessage}</p>}
        </div>

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
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
              className={`ml-auto ${SMALL_CHIP_PATTERN} ${showWorldwide ? SMALL_CHIP_ACTIVE_PATTERN : ""}`}
            >
              <Globe className="-mt-0.5 mr-1 inline h-3.5 w-3.5" />
              {showWorldwide ? "Near me first" : "Show worldwide"}
            </button>
          </div>
        )}

          <div className="mb-5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted font-header">
            Event type
          </p>
          <div className="flex flex-wrap gap-2">
            {eventTypes.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setEventType(id)}
                className={`${SMALL_CHIP_PATTERN} ${eventType === id ? SMALL_CHIP_ACTIVE_PATTERN : ""}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

          <div className="mb-10">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted font-header">
            Craft
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCraft("all")}
              className={`${SMALL_CHIP_PATTERN} ${craft === "all" ? SMALL_CHIP_ACTIVE_PATTERN : ""}`}
            >
              All crafts
            </button>
            {craftCategories.map((c) => (
              <button
                key={c.id}
                onClick={() => setCraft(c.id as CraftId)}
                className={`${SMALL_CHIP_PATTERN} ${craft === c.id ? SMALL_CHIP_ACTIVE_PATTERN : ""}`}
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
                      <h3 className="mt-2 font-header text-xl font-semibold text-purple-dark">
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
            Help fellow makers discover markets, fairs, and workshops in your area.
          </p>
          <div className="mt-5">
            <Button variant="secondary" size="lg" onClick={handleOpenSubmission}>
              Submit an event
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {showSubmissionModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
          <button
            type="button"
            className="absolute inset-0 bg-purple-dark/40 backdrop-blur-sm"
            aria-label="Close add event dialog"
            onClick={() => setShowSubmissionModal(false)}
          />
          <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-surface shadow-xl">
            <div className="flex items-center justify-between border-b border-border bg-pink-soft/50 px-5 py-4">
              <h3 className="font-header text-lg font-semibold text-purple-dark">Add your event</h3>
              <button
                type="button"
                className="rounded-md p-1.5 text-muted transition-colors hover:bg-white hover:text-purple-dark"
                onClick={() => setShowSubmissionModal(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmitEvent} className="space-y-4 p-5">
              <div>
                <label htmlFor="event-title" className="mb-1.5 block text-sm font-medium text-purple-dark">
                  Event title
                </label>
                <input
                  id="event-title"
                  required
                  value={form.title}
                  onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-purple-dark focus:outline-none focus:ring-2 focus:ring-accent/40"
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="event-type" className="mb-1.5 block text-sm font-medium text-purple-dark">
                    Type
                  </label>
                  <select
                    id="event-type"
                    required
                    value={form.type}
                    onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value as EventType }))}
                    className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-purple-dark focus:outline-none focus:ring-2 focus:ring-accent/40"
                  >
                    <option value="market">Market</option>
                    <option value="fair">Fair</option>
                    <option value="workshop">Workshop</option>
                    <option value="meetup">Meetup</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="event-date" className="mb-1.5 block text-sm font-medium text-purple-dark">
                    Date
                  </label>
                  <input
                    id="event-date"
                    type="date"
                    required
                    value={form.date}
                    onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
                    className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-purple-dark focus:outline-none focus:ring-2 focus:ring-accent/40"
                  />
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="event-location" className="mb-1.5 block text-sm font-medium text-purple-dark">
                    Location
                  </label>
                  <input
                    id="event-location"
                    required
                    value={form.city}
                    onChange={(e) => setForm((prev) => ({ ...prev, city: e.target.value }))}
                    className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-purple-dark focus:outline-none focus:ring-2 focus:ring-accent/40"
                  />
                </div>
                <div>
                  <label htmlFor="event-country" className="mb-1.5 block text-sm font-medium text-purple-dark">
                    Country
                  </label>
                  <select
                    id="event-country"
                    required
                    value={form.countryCode}
                    onChange={(e) => setForm((prev) => ({ ...prev, countryCode: e.target.value }))}
                    className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-purple-dark focus:outline-none focus:ring-2 focus:ring-accent/40"
                  >
                    {getCountryOptions(form.countryCode || country || undefined).map((opt) => (
                      <option key={opt.code} value={opt.code}>
                        {opt.flag} {opt.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="event-link" className="mb-1.5 block text-sm font-medium text-purple-dark">
                  Link
                </label>
                <input
                  id="event-link"
                  type="url"
                  placeholder="https://event-site.example"
                  value={form.link}
                  onChange={(e) => setForm((prev) => ({ ...prev, link: e.target.value }))}
                  className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-purple-dark focus:outline-none focus:ring-2 focus:ring-accent/40"
                />
              </div>
              <div>
                <label htmlFor="event-description" className="mb-1.5 block text-sm font-medium text-purple-dark">
                  Description
                </label>
                <textarea
                  id="event-description"
                  required
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                  className="w-full resize-none rounded-md border border-border bg-white px-3 py-2 text-sm text-purple-dark focus:outline-none focus:ring-2 focus:ring-accent/40"
                />
              </div>
              <div className="flex justify-end gap-3 border-t border-border pt-4">
                <Button type="button" variant="ghost" onClick={() => setShowSubmissionModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="secondary">
                  Save event
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
