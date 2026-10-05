import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { RevealWords } from "@/components/motion/RevealWords";

/**
 * Inner page hero.
 *
 * The inner pages previously opened on a flat cream band with a blurred gold
 * blob in the corner and a two-column heading — the same shape as every cream
 * section on the site, which meant a page transition gave the reader no signal
 * that they had arrived somewhere new.
 *
 * This is darker and asymmetric: an eyebrow with a gold rule, an oversized
 * masked-reveal headline on a narrow measure, and an optional aside that
 * overlaps the headline's baseline. The left column sits over a soft violet
 * wash and a single arc, so the page opens with depth rather than with a
 * heading floating in space.
 *
 * It stays LIGHT in value. The homepage owns the dark hero; if every page also
 * opened dark, the homepage would stop being an opening. What changes here is
 * composition and type scale, not tonal range.
 *
 * `aside` is rendered outside the heading column and allowed to overlap, which
 * is what stops this from reading as another two-column grid.
 */
export function PageHero({
  eyebrow,
  title,
  lead,
  aside,
}: {
  eyebrow: string;
  title: string;
  lead: string;
  aside?: ReactNode;
}) {
  return (
    <section aria-labelledby="page-heading" className="relative overflow-hidden bg-cream-50">
      {/* Background: one violet wash and one arc. Deliberately NOT a blurred
          gradient blob — a large blurred element stays alive as a filtered
          compositor layer for the whole scroll, and this page has no need to
          pay for that. A gradient plus a hairline arc costs one paint. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(160deg,var(--color-cream-50)_38%,var(--color-cream-100)_100%)]" />
        <svg
          viewBox="0 0 1440 600"
          preserveAspectRatio="xMidYMid slice"
          className="absolute -top-24 -right-40 size-[46rem] text-ink-700/[0.07]"
          fill="none"
        >
          <circle cx="700" cy="300" r="180" stroke="currentColor" strokeWidth="1" />
          <circle cx="700" cy="300" r="250" stroke="currentColor" strokeWidth="1" />
          <circle cx="700" cy="300" r="330" stroke="currentColor" strokeWidth="1" />
          <circle
            cx="700"
            cy="300"
            r="250"
            stroke="var(--color-gold-600)"
            strokeOpacity="0.5"
            strokeWidth="1.25"
          />
        </svg>
      </div>

      <div className="container-page relative pb-16 md:pb-24 lg:pb-28">
        <div className="pt-14 md:pt-20 lg:pt-24">
          <Reveal as="p" variant="fade" size="sm">
            <span className="flex items-center gap-3 text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-ink-700">
              <span aria-hidden="true" className="h-px w-10 bg-gold-600" />
              {eyebrow}
            </span>
          </Reveal>

          {/*
            Narrow measure on purpose. `max-w-4xl` on a display heading keeps the
            line length readable; letting it run the full container width made
            long titles set as one enormous line with no rag.
          */}
          <RevealWords
            as="h1"
            id="page-heading"
            text={title}
            delay={90}
            step={48}
            maxWords={10}
            className="mt-7 block max-w-4xl text-display-lg font-display leading-[1.04] tracking-[-0.02em] text-ink-900"
          />

          <Reveal
            as="p"
            variant="soft"
            size="md"
            delay={280}
            className="mt-8 max-w-2xl text-lg leading-relaxed text-warm-600"
          >
            {lead}
          </Reveal>

          {aside ? (
            <Reveal
              variant="slide-right"
              size="md"
              delay={380}
              className="mt-10 max-w-2xl lg:-mt-16 lg:ml-auto lg:max-w-md"
            >
              {aside}
            </Reveal>
          ) : null}
        </div>
      </div>

      {/* Curved boundary into the page body. Drawn in the cream-50 tone so it
          reads as this section handing over. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 70"
        preserveAspectRatio="none"
        className="relative block h-12 w-full text-cream-100 sm:h-16"
      >
        <path
          d="M0,0 L1440,0 L1440,40 C1180,68 940,18 700,44 C460,70 220,18 0,46 Z"
          fill="currentColor"
        />
      </svg>
    </section>
  );
}

/**
 * Breadcrumb.
 *
 * Present on every inner page. It exists for orientation rather than as
 * decoration: a visitor who arrived from a shared admissions link has no other
 * way to orient themselves on a 13-page site.
 *
 * The current page is marked aria-current, and the separator is aria-hidden so
 * it is not announced as punctuation between every crumb.
 */
export function Breadcrumb({
  trail,
}: {
  trail: { href?: string; label: string }[];
}) {
  return (
    <nav aria-label="Breadcrumb" className="container-page pt-6">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.75rem] text-warm-500">
        {trail.map((crumb, index) => (
          <li key={crumb.label} className="flex items-center gap-2">
            {index > 0 ? (
              <ChevronRight className="size-3 text-warm-500/50" aria-hidden="true" />
            ) : null}
            {crumb.href ? (
              <Link
                href={crumb.href}
                className="line-link min-h-8 items-center text-warm-600 transition-colors hover:text-ink-700"
              >
                {crumb.label}
                <span aria-hidden="true" className="line-link-underline" />
              </Link>
            ) : (
              <span aria-current="page" className="text-ink-800">
                {crumb.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
