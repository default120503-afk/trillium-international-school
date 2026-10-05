"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { CurtainReveal } from "@/components/motion/CurtainReveal";
import { Magnetic } from "@/components/motion/Magnetic";
import { ButtonLink } from "@/components/ui/Button";
import { campuses, campusStatusLabel } from "@/content/campuses";

/**
 * Campus selector.
 *
 * THE CONSTRAINT: there is no authentic photograph of either campus. The
 * brochure is a text document. So this component invents no imagery — no
 * stock campus, no "photo coming soon" placeholder shaped like a photo, no
 * AI-ish render. Instead it does the thing that is actually available and
 * more distinctive: it treats the campus NAME as the visual.
 *
 * Each campus gets an oversized, letter-spaced typographic panel whose word
 * marks are drawn in vector arcs — the same geometry the hero uses, at a
 * different scale. Selecting a campus cross-fades between the two panels with
 * a clip-path wipe, which is a real transition between two real states rather
 * than a fade of a list.
 *
 * INTERACTION MODEL
 * This is a tablist, because that is exactly what it is: one visible panel,
 * one of N selectable options.
 * - Real buttons with role="tab", aria-selected, and aria-controls.
 * - Arrow-key navigation moves between tabs, Home/End jump to the ends.
 * - Only the active tab is in the tab order (roving tabindex), which is the
 *   correct pattern and stops a keyboard user tabbing past four controls.
 * - The panel has role="tabpanel" and is labelled by its tab.
 * - All campus facts are visible in the panel text; the tabs do not gate any
 *   information that exists nowhere else.
 */

export function CampusSelector() {
  const [active, setActive] = useState(0);
  const campus = campuses[active];

  const onKeyDown = (event: React.KeyboardEvent) => {
    const last = campuses.length - 1;
    let next = active;

    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = active >= last ? 0 : active + 1;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = active <= 0 ? last : active - 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = last;
    else return;

    event.preventDefault();
    setActive(next);
    // Move focus with selection, per the tabs pattern.
    const tabs = event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    tabs[next]?.focus();
  };

  return (
    <section aria-labelledby="campuses-heading" className="relative bg-cream-50">
      <div className="container-page py-20 md:py-28">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <Reveal as="p" variant="fade" size="sm">
              <span className="mb-4 flex items-center gap-3 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-ink-700">
                <span aria-hidden="true" className="inline-block h-px w-8 shrink-0 bg-current opacity-45" />
                Campuses
              </span>
            </Reveal>
            <Reveal variant="rise" size="lg" delay={70}>
              <h2
                id="campuses-heading"
                className="text-display-lg font-display leading-[1.04] tracking-[-0.02em] text-ink-900"
              >
                Two locations recorded in the school&apos;s history, and one now
                open in Rawalpindi
              </h2>
            </Reveal>
          </div>

          {/* Tabs

            The tablist is a horizontal SCROLL container, and that is measured
            rather than assumed. At 375x812 the three campus tabs ("Rawalpindi
            Campus" 182px, "Bhera" 77px, "Khanpur" 99px, plus gaps) need 366px
            inside a 335px track, so the last tab ran 31px past the viewport edge
            and the document gained 11px of horizontal scroll — a real mobile
            defect, measured in Chrome.

            The alternative was to shrink the labels or the padding. Both are
            worse: this is a tablist, its targets are already at the 48px
            minimum, and the tab names are the campus names, which are facts
            rather than styling. Letting the strip scroll keeps every label
            intact and every target full size.

            `pb-1` gives the scrollbar somewhere to sit on platforms that show
            one, so it cannot overlap the tab text. */}
          <Reveal variant="rise" size="md" delay={160}>
            <div
              role="tablist"
              aria-label="Select a campus"
              onKeyDown={onKeyDown}
              className="flex gap-1 overflow-x-auto pb-1 border-b border-ink-900/12"
            >
              {campuses.map((item, index) => {
                const selected = index === active;
                return (
                  <button
                    key={item.id}
                    role="tab"
                    type="button"
                    id={`campus-tab-${item.id}`}
                    aria-selected={selected}
                    aria-controls={`campus-panel-${item.id}`}
                    // Roving tabindex: only the selected tab is reachable.
                    tabIndex={selected ? 0 : -1}
                    onClick={() => setActive(index)}
                    className="group relative min-h-12 px-4 text-left transition-colors duration-[var(--dur-base)] sm:px-6"
                  >
                    <span
                      className={[
                        "font-display text-base whitespace-nowrap transition-colors duration-[var(--dur-base)] sm:text-lg",
                        selected ? "text-ink-900" : "text-warm-500 group-hover:text-ink-700",
                      ].join(" ")}
                    >
                      {/* Strip the "Campus N — " prefix: the tab is already
                          inside a section called Campuses, so the prefix is
                          noise repeated three times over. The full name stays
                          in the panel heading. */}
                      {item.name.replace(/^Campus \d+ — /, "")}
                    </span>
                    {/* Active indicator. A 2px rule that grows from the
                        centre, rather than a pill background — quieter, and it
                        matches the site's editorial language. */}
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-2 -bottom-px h-0.5 origin-center bg-gold-500 transition-transform duration-[var(--dur-slow)] ease-[var(--ease-out-soft)] sm:inset-x-3"
                      style={{ transform: `scaleX(${selected ? 1 : 0})` }}
                    />
                  </button>
                );
              })}
            </div>
          </Reveal>
        </div>

        {/*
            Curtain reveal, not `Reveal`. Every other block on this page
            enters by rising and fading; this is the section a visitor is most
            likely to stop at — it is the campus record, and the panel is a
            large two-column object. Opening it with a mask that sweeps across
            the whole panel gives it weight that an 18px rise cannot, and the
            difference in gesture is what stops a long page from reading as one
            repeated motion.

            Reuses the shared observer via `useRevealedOnVisible`, so it
            triggers on exactly the same conditions as every other reveal and
            cannot drift out of step with them.
          */}
        <CurtainReveal className="mt-10" innerClassName="h-full">
          <div
            role="tabpanel"
            id={`campus-panel-${campus.id}`}
            aria-labelledby={`campus-tab-${campus.id}`}
            // No tabIndex here. The tabs pattern (WAI-ARIA APG) keeps a roving
            // tabindex on the TABS; the panel itself is not a tab stop and is
            // reached with arrow keys. An earlier `tabIndex={0}` here added a
            // redundant stop in the tab sequence — flagged in review.
            className="grid h-full overflow-hidden border border-ink-900/12 lg:grid-cols-[1.05fr_1fr]"
          >
            {/* Typographic plate. This is the campus "image": the name, set
                enormous, over brand geometry. Honest — it depicts nothing it
                cannot verify — and it gives each campus a distinct visual
                identity that a stock photograph could not. */}
            <div className="relative isolate min-h-72 overflow-hidden bg-[linear-gradient(150deg,var(--color-ink-800),var(--color-ink-950)_60%,var(--color-navy-900))] p-8 sm:min-h-96 sm:p-12">
              <svg
                aria-hidden="true"
                viewBox="0 0 400 400"
                className="absolute -right-16 -bottom-20 size-[26rem] text-gold-400/20"
                fill="none"
              >
                <circle cx="200" cy="200" r="150" stroke="currentColor" strokeWidth="0.75" />
                <circle cx="200" cy="200" r="112" stroke="currentColor" strokeWidth="0.75" />
                <circle cx="200" cy="200" r="72" stroke="currentColor" strokeWidth="0.75" />
                <path
                  d="M200 50 C280 90 350 150 350 200 C350 250 280 310 200 350 C120 310 50 250 50 200 C50 150 120 90 200 50 Z"
                  stroke="currentColor"
                  strokeWidth="0.75"
                />
              </svg>

              {/* Cross-fade between the two names on switch. Keyed on campus id
                  so React remounts the span and the transition replays. */}
              <span
                key={campus.id}
                className="relative flex h-full flex-col justify-end"
                style={{
                  animation: "campus-in var(--dur-slow) var(--ease-out-soft) both",
                }}
              >
                <span className="inline-flex items-center gap-2.5 text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-gold-400">
                  <MapPin className="size-3.5" aria-hidden="true" />
                  {campus.name}
                </span>
                <span
                  className="mt-4 block font-display text-[clamp(3.25rem,10vw,5.5rem)] leading-[0.85] tracking-[-0.03em] text-cream-50"
                  aria-hidden="true"
                >
                  {campus.name.replace(/^Campus \d+ — /, "")}
                </span>
              </span>
            </div>

            {/* Facts. */}
            <div className="bg-cream-100 p-8 sm:p-10 lg:p-12">
              <dl className="flex flex-col gap-7">
                <div>
                  <dt className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-warm-500">
                    Location
                  </dt>
                  <dd className="mt-2 text-[0.9375rem] text-ink-900">
                    {campus.locationNote}
                  </dd>
                </div>
                <div>
                  <dt className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-warm-500">
                    Region
                  </dt>
                  <dd className="mt-2 text-[0.9375rem] text-ink-900">
                    {campus.region}
                  </dd>
                </div>
                <div>
                  <dt className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-warm-500">
                    Status
                  </dt>
                  <dd className="mt-2">
                    <span className="inline-flex items-center gap-2 text-[0.9375rem] text-warm-700">
                      <span
                        aria-hidden="true"
                        className={[
                          "size-1.5 rounded-full",
                          campus.status === "operational"
                            ? "bg-success-600"
                            : "bg-warm-500/60",
                        ].join(" ")}
                      />
                      {campusStatusLabel[campus.status]}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-warm-500">
                    {campus.mapUrl ? "Address as given" : "Full postal address"}
                  </dt>
                  <dd
                    className={
                      campus.mapUrl
                        ? "mt-2 text-[0.9375rem] text-ink-900"
                        : "mt-2 text-[0.9375rem] text-warm-500"
                    }
                  >
                    {/*
                      Rawalpindi has a real owner-supplied landmark address, so
                      labelling it "Full postal address" above it while printing
                      "Not yet published" underneath was self-contradictory. The
                      two Haripur campuses are locality references only and keep
                      the original honest "not published" treatment.
                    */}
                    {campus.mapUrl
                      ? campus.locationNote
                      : "Not yet published by the school"}
                  </dd>
                </div>
              </dl>

              <p className="mt-8 border-t border-ink-900/12 pt-6 text-[0.9375rem] leading-relaxed text-warm-600">
                No campus photograph is published here, because none exists in
                the material the school supplied. Facilities, timings and
                services are confirmed directly with the school rather than
                guessed at here.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-5">
                <Magnetic>
                  <ButtonLink href="/admissions" variant="primary">
                    Inquire about this campus
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </ButtonLink>
                </Magnetic>
                {/* Shown only when the owner supplied a Google Maps link. It
                    opens their exact URL in a new tab; `noopener` is required
                    because target="_blank" without it hands the new page a live
                    reference to this one, and `noreferrer` additionally
                    suppresses the Referer header so nothing about the visitor's
                    navigation leaks to Google. The map is a convenience, not a
                    replacement for the full record, so the campuses link stays
                    alongside it. */}
                {campus.mapUrl ? (
                  <a
                    href={campus.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="line-link inline-flex min-h-11 items-center gap-2 text-sm font-medium text-ink-700"
                  >
                    <MapPin className="size-4 shrink-0 text-gold-600" aria-hidden="true" />
                    View on Google Maps
                    {/* Announced but not painted: the link text is identical for
                        every campus, so a screen-reader user tabbing the panel
                        would otherwise hear three indistinguishable
                        "View on Google Maps" links. */}
                    <span className="sr-only">
                      — {campus.name} (opens in a new tab)
                    </span>
                    <span aria-hidden="true" className="line-link-underline" />
                  </a>
                ) : null}
                <Link
                  href="/campuses"
                  className="group line-link min-h-11 text-sm font-medium text-ink-700"
                >
                  All campus detail
                  <span aria-hidden="true" className="line-link-underline" />
                </Link>
              </div>
            </div>
          </div>
        </CurtainReveal>
      </div>
    </section>
  );
}
