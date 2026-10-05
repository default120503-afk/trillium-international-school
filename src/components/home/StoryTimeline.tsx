"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useScrollProgress } from "@/components/motion/StickySequence";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { history, founder, school } from "@/content/school";

/**
 * Story timeline.
 *
 * A vertical spine with a fill that tracks scroll, and entries that arrive as
 * the fill reaches them. The alternative — four stacked rows with a rule
 * between them — is what the previous version did, and it read as a list. A
 * spine that visibly fills is a narrative: the reader can see how far through
 * the school's history they are.
 *
 * HONESTY CONSTRAINT
 * Every entry below is drawn from `history.timeline`, which is transcribed from
 * the school's own account. The years are what the source states — three
 * entries share 2014 because that is when they happened, not because a year
 * was invented to fill a gap. The reopening (October 2026) is a separate,
 * clearly-labelled terminus rather than being appended to the 2014 sequence as
 * if it were part of the same narrative run.
 *
 * The founder's page image is used as the visual anchor because the supplied
 * material is text-only and contains no photograph of the founder. It is
 * captioned as what it is.
 */
export function StoryTimeline() {
  const progressRef = useScrollProgress<HTMLDivElement>();

  return (
    <section
      aria-labelledby="timeline-heading"
      className="relative overflow-hidden bg-ink-950 text-cream-200"
    >
      {/* Background: a very slow vertical gradient plus one gold arc, so the
          dark band has depth without competing with the spine. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,var(--color-ink-950)_0%,var(--color-ink-900)_55%,var(--color-ink-950)_100%)]" />
        <svg
          viewBox="0 0 1440 800"
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 size-full text-cream-100/[0.05]"
          fill="none"
        >
          <circle cx="1240" cy="140" r="300" stroke="currentColor" strokeWidth="1" />
          <circle cx="1240" cy="140" r="440" stroke="currentColor" strokeWidth="1" />
          <circle cx="1240" cy="140" r="600" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>

      <div ref={progressRef} className="relative container-page py-20 md:py-28">
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          {/* -- Left: the founder, sticky so it stays with the timeline --- */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal as="p" variant="fade" size="sm">
              <span className="mb-4 flex items-center gap-3 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-gold-400">
                <span aria-hidden="true" className="inline-block h-px w-8 shrink-0 bg-current opacity-45" />
                Our story
              </span>
            </Reveal>

            <Reveal variant="rise" size="lg" delay={80}>
              <h2
                id="timeline-heading"
                className="text-display-lg font-display leading-[1.03] tracking-[-0.02em] text-cream-50"
              >
                Seven students, and a long walk to reach them
              </h2>
            </Reveal>

            <Reveal variant="soft" size="md" delay={220}>
              <div className="mt-8 border-l-2 border-gold-500/60 pl-5">
                <p className="text-lg leading-relaxed text-cream-100">
                  {history.premise}
                </p>
              </div>
            </Reveal>

            <Reveal variant="soft" size="md" delay={320}>
              <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2">
                <span className="font-display text-base text-cream-50">
                  {founder.name}
                </span>
                <span aria-hidden="true" className="h-px w-8 bg-gold-500" />
                <span className="text-sm text-cream-300/70">
                  {founder.role} · {founder.qualification}
                </span>
              </div>
            </Reveal>

            {/* The founder's page. Presented as a document in a mount, which is
                what it is — the provenance caption says so. */}
            <Reveal variant="plate" size="md" delay={380} className="mt-10">
              <figure className="relative">
                <div className="relative overflow-hidden rounded-[3px] border border-cream-100/12 bg-cream-50/95 p-2.5 shadow-[0_30px_70px_-40px_rgba(0,0,0,0.8)]">
                  <Image
                    src="/images/profile/page-2-thumb.webp"
                    alt="Scanned page from the school profile containing the founder's account of the school's beginnings, printed text on a plain page."
                    width={900}
                    height={1200}
                    sizes="(max-width: 1024px) 88vw, 400px"
                    className="h-auto w-full"
                  />
                </div>
                <figcaption className="mt-3 text-xs leading-relaxed text-cream-300/55">
                  Page 2 of the school&apos;s published profile, reproduced from
                  the document supplied by the school. The document contains no
                  photographs.
                </figcaption>
              </figure>
            </Reveal>
          </div>

          {/* -- Right: the spine ----------------------------------------- */}
          <div className="relative">
            {/* The spine. A hairline running the full height of the entries. */}
            <div
              aria-hidden="true"
              className="absolute top-2 bottom-2 left-[7px] w-px bg-cream-100/12 md:left-[9px]"
            >
              {/* The fill. Height is driven by --progress, which the shared
                  hook writes on scroll. scaleY on a 1px element is a pure
                  compositor transform — no layout, no repaint of the page. */}
              <div
                className="absolute inset-0 origin-top bg-gradient-to-b from-gold-400 to-gold-600"
                style={{
                  transform: "scaleY(var(--progress, 0))",
                  transition: "transform 80ms linear",
                }}
              />
            </div>

            <ol className="flex flex-col">
              {history.timeline.map((entry, index) => (
                <li key={`${entry.year}-${entry.title}`} className="relative">
                  <Reveal
                    variant="slide-right"
                    size="md"
                    delay={index * 60}
                    className="relative pb-14 pl-9 last:pb-4 md:pl-12"
                  >
                    {/* Node on the spine. */}
                    <span
                      aria-hidden="true"
                      className="absolute top-2 left-0 flex size-[15px] items-center justify-center md:size-[19px]"
                    >
                      <span className="absolute inset-0 rounded-full border border-gold-500/45" />
                      <span className="size-[5px] rounded-full bg-gold-400 md:size-[7px]" />
                    </span>

                    <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                      <span className="font-display text-base text-gold-400 md:text-lg">
                        {entry.year}
                      </span>
                      <span
                        aria-hidden="true"
                        className="hidden h-px flex-1 bg-cream-100/10 sm:block"
                      />
                    </div>

                    <h3 className="mt-3 text-xl leading-snug text-cream-50 md:text-2xl">
                      {entry.title}
                    </h3>
                    <p className="mt-3 max-w-xl leading-relaxed text-cream-300/78">
                      {entry.body}
                    </p>
                  </Reveal>
                </li>
              ))}

              {/* Terminus. The reopening is a verified, current fact and is
                  visually distinct from the historical run: gold, larger, and
                  clearly the end of the line rather than another entry in it. */}
              <li className="relative">
                <Reveal
                  variant="rise"
                  size="md"
                  delay={240}
                  className="relative pl-9 pt-12 md:pl-12"
                >
                  <span
                    aria-hidden="true"
                    className="absolute top-[3.1rem] left-0 size-[15px] rounded-full border border-gold-400 bg-ink-950 md:size-[19px]"
                  />
                  <span
                    aria-hidden="true"
                    className="mb-3 inline-flex items-center gap-2 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-gold-400"
                  >
                    Today
                  </span>
                  <h3 className="text-2xl leading-snug text-cream-50 md:text-3xl">
                    {school.shortName}, reopened {school.status.reopenedIn}
                  </h3>
                  <p className="mt-3 max-w-xl leading-relaxed text-cream-300/78">
                    {school.status.notice} Current arrangements for the session
                    are confirmed directly with the school.
                  </p>
                  <div className="mt-7 flex flex-wrap gap-3">
                    <ButtonLink href="/admissions" variant="accent">
                      Admissions inquiry
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </ButtonLink>
                    <ButtonLink href="/story" variant="quiet">
                      Read the full account
                    </ButtonLink>
                  </div>
                </Reveal>
              </li>
            </ol>

            {/* max-w-md: at 12px this ran to about 104 characters per line, past
                the readable band. A source-integrity note is not the place to
                ask the eye to work. */}
            <p className="mt-12 max-w-md border-t border-cream-100/10 pt-6 text-xs leading-relaxed text-cream-300/50">
              Dates and figures are exactly as stated in the school&apos;s
              account. Nothing has been interpolated or added for effect.{" "}
              <Link href="/gallery" className="line-link text-cream-200">
                See the source pages
                <span aria-hidden="true" className="line-link-underline" />
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
