"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useScrollProgress } from "@/components/motion/StickySequence";
import { Reveal } from "@/components/motion/Reveal";
import { RevealWords } from "@/components/motion/RevealWords";
import { Magnetic } from "@/components/motion/Magnetic";
import { HeroField, LogoPlate } from "@/components/brand/BrandArt";
import { ButtonLink } from "@/components/ui/Button";
import { school } from "@/content/school";

/**
 * Homepage hero.
 *
 * ART DIRECTION
 *
 * The first viewport has one job: make someone who has never heard of this
 * school understand within about two seconds that it is a serious, established
 * educational institution. Three decisions carry that:
 *
 * 1. DARK, NOT LIGHT. The previous hero sat on cream, which is the same value
 *    as every other section on the site — so the top of the page read as
 *    "one more section" rather than as an opening. Starting in deep violet with
 *    the whole site unfolding downward into cream gives the page a direction and
 *    a beginning.
 *
 * 2. OVERSIZED, ASYMMETRIC TYPE. The headline is set large and ragged, sitting
 *    on a wide measure, with the word "Meets" italicised and inset so the eye
 *    has to travel rather than read straight across. Editorial composition, not
 *    a centred stack.
 *
 * 3. DEPTH IN LAYERS. Backdrop geometry, the drifting colour washes, the
 *    headline, the logo plate, and the scroll cue are five separate planes at
 *    different depths, each moving at a different rate on scroll. Flatness is
 *    what makes a site look like a template; parallax is what makes it feel
 *    built.
 *
 * SCROLL BEHAVIOUR
 * Layers translate by different multiples of `--progress`, written by the
 * shared scroll-progress hook. Backdrop drifts slowest (it is furthest away),
 * the logo plate drifts fastest (it is nearest). The effect is subtle by
 * design: enough to be felt, not enough to notice as an effect.
 *
 * ACCESSIBILITY
 * - The h1 is a real h1 and its full text is exposed once via aria-label on
 *   the word-reveal span.
 * - Every decorative plane is aria-hidden.
 * - Under reduced motion the hook does not run, so every layer sits at its
 *   authored position and nothing is scrubbed.
 * - The scroll cue is a real link to #approach, so the affordance works for
 *   keyboard users rather than only being a decorative animation.
 */
export function Hero() {
  const progressRef = useScrollProgress<HTMLDivElement>();

  return (
    <section
      aria-labelledby="hero-heading"
      // THE HEADER OVERLAY LIVES ON TOP OF THIS BLOCK.
      //
      // `SiteHeader` is `sticky`, so it occupies real layout height. That pushed
      // this dark hero down to y=81, which left an 81px band of cream body
      // showing through the bar's transparent overlay state — while the bar's own
      // wordmark and nav links are cream (`rgb(253,251,247)`) in that state.
      // Cream on cream: measured 1.00:1 contrast, so the school name and the
      // whole primary nav were invisible until the visitor scrolled ~24px.
      // Verified in Chrome DevTools against the production build.
      //
      // `-mt-20` pulls the hero up under the bar so the bar's background is the
      // dark hero, exactly as the header's own docs intend ("links are cream",
      // which only works if the dark hero extends *under* the bar). The
      // `pt-*` on the content row below is raised by the same 5rem so the hero
      // copy keeps the clearance the bar previously gave it — the composition
      // is unchanged, only the surface behind the bar is corrected.
      className="relative isolate -mt-20 overflow-hidden bg-ink-950 pt-20 text-cream-100"
    >
      {/* Layer 0 — backdrop. Sits furthest back, drifts slowest. */}
      <div ref={progressRef} className="absolute inset-0">
        <div
          className="absolute inset-0 origin-top will-change-transform"
          style={{
            transform: "translate3d(0, calc(var(--progress, 0) * 6%), 0) scale(1.06)",
            transition: "transform 60ms linear",
          }}
        >
          <HeroField />
        </div>
      </div>

      {/* Layer 1 — content. */}
      <div className="container-page relative">
        <div className="grid items-center gap-14 pt-16 pb-24 sm:pt-20 md:pb-32 lg:grid-cols-[1.35fr_1fr] lg:gap-20 lg:pt-28 lg:pb-40">
          {/* -- Left: the editorial stack ---------------------------------- */}
          <div>
            {/* Eyebrow. Two facts, both verified: it reopened, and where it is.
                Presented as a quiet label rather than a badge, because a badge
                at the top of a hero reads as a notification. */}
            <Reveal variant="fade" size="sm">
              <p className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-cream-300/70">
                <span className="inline-flex items-center gap-2.5 text-gold-400">
                  <span aria-hidden="true" className="relative flex size-1.5">
                    <span className="absolute inline-flex size-1.5 animate-status-breathe rounded-full bg-gold-400" />
                    <span className="relative inline-flex size-1.5 rounded-full bg-gold-400" />
                  </span>
                  Reopened {school.status.reopenedIn}
                </span>
                <span aria-hidden="true" className="hidden h-px w-6 bg-cream-100/25 sm:block" />
                <span>
                  {school.location.area}, {school.location.region}
                </span>
              </p>
            </Reveal>

            {/* The headline. Revealed word by word, each rising out of a mask.
                The stagger runs 58ms per word, capped at 9 words, so the whole
                line lands inside the 1200ms cinematic band.

                The h1 carries the COMPLETE text as its accessible name. That is
                load-bearing: the second line's wrapper is aria-hidden (it
                exists only to inset the italic line), so without this the
                heading would be announced as "Where Curiosity" only. */}
            <h1
              id="hero-heading"
              aria-label="Where Curiosity Meets Character"
              /* 0.94 leading is an editorial display setting and it is right on
                 desktop. At 390px the same 0.94 on a 44px face means each line
                 is only ~41px tall against ~48px of glyph height, so the
                 italic second line crowds the first on a narrow wrap. Loosen
                 to 1.0 below sm and keep the tight display leading above it. */
              className="mt-8 text-display-xl font-display leading-[1] tracking-[-0.02em] text-cream-50 sm:leading-[0.94]"
            >
              <RevealWords
                as="span"
                text="Where Curiosity"
                delay={80}
                step={58}
                maxWords={9}
                className="block"
              />
              <span
                aria-hidden="true"
                className="block"
                style={{ paddingLeft: "clamp(0rem, 6vw, 5rem)" }}
              >
                <RevealWords
                  as="span"
                  text="Meets Character"
                  delay={480}
                  step={58}
                  maxWords={9}
                  className="block italic text-gold-400"
                  wordClassName="pr-[0.22em]"
                />
              </span>
            </h1>

            {/* The standfirst. Large, because on a page with this much
                typography the body copy is what a parent actually reads. */}
            <Reveal
              as="p"
              variant="soft"
              size="md"
              delay={780}
              className="mt-9 max-w-xl text-xl leading-[1.5] text-cream-200/90 sm:text-2xl"
            >
              Learning, character, creativity and confidence for a changing
              world.
            </Reveal>

            <Reveal
              as="p"
              variant="soft"
              size="md"
              delay={900}
              className="mt-6 max-w-xl text-[0.9375rem] leading-relaxed text-cream-300/75"
            >
              {school.name} began with a simple conviction: that children in
              rural communities deserve access to quality education. That idea —
              going to families, teaching concept rather than memorisation, and
              treating character as a real outcome of schooling — still shapes
              how the school describes its work.
            </Reveal>

            {/* CTAs. Three actions, one primary. The secondary pair use the
                quiet variant with a hairline border, so the eye lands on
                "Explore our school" first. */}
            <Reveal
              variant="rise"
              size="md"
              delay={1050}
              className="mt-11 flex flex-wrap items-center gap-3"
            >
              {/* Magnetic pull on the primary action only. `strength` is 0.22
                  of the pointer offset, so the button closes roughly a fifth
                  of the gap to the cursor — enough to feel responsive, far
                  enough that the link never appears to have slipped away from
                  where the user is aiming. The secondary CTAs are left still:
                  if everything pulled, nothing would read as the primary
                  action, and the emphasis would be inverted. */}
              <Magnetic>
                <ButtonLink href="/about" size="lg" variant="accent">
                  Explore our school
                  <ArrowRight className="size-4" aria-hidden="true" />
                </ButtonLink>
              </Magnetic>
              <ButtonLink href="/admissions" size="lg" variant="quiet">
                Admissions inquiry
              </ButtonLink>
              <ButtonLink href="/campuses" size="lg" variant="quiet">
                Discover our campuses
              </ButtonLink>
            </Reveal>
          </div>

          {/* -- Right: the logo plate ------------------------------------ */}
          <div
            className="relative flex flex-col gap-8"
            style={{
              // Nearest plane, so it moves most. The rotation is tiny and
              // deliberate — it reads as the page turning, not as the logo
              // spinning.
              transform:
                "translate3d(0, calc(var(--progress, 0) * -42px), 0) rotate(calc(var(--progress, 0) * 2deg))",
              transition: "transform 60ms linear",
            }}
          >
            <Reveal variant="plate" size="lg" delay={420}>
              {/* No caption: the plate's default line is the Quick Done
                  Corporation attribution, which is the identity this slot
                  exists to establish — the school lockup first, the credit
                  line beneath it. The founder is named once on this page by
                  StoryTimeline further down, with the site's single founder
                  identity, which is why the credit no longer sits here. */}
              <LogoPlate />
            </Reveal>

            {/*
              THE OVERLAP FIX.

              Defect this replaces (measured, not assumed): this card carried
              `-mt-10` and sat INSIDE the logo-plate column, directly on top of
              the plate's caption. The plate's caption is
              a credit line under the school's lockup, so the card was painted
              over it — and it won the paint order every time, because
              both are inside the same stacking context and this one comes later
              in the markup. At narrower widths the card's `w-[min(21rem,90%)]`
              also pushed it sideways into the plate's border.

              That is why the wording appeared "in front of" the credit: it was
              not a z-index accident to be patched with a higher z-index. The
              card was simply occupying space that belonged to something else.

              The fix is to stop them overlapping at all. The card is now a
              SIBLING of the plate inside a column flow with real `gap`, so
              there is no negative margin, no absolute positioning and no paint
              contest to win. Consequences that follow for free:

              - Both are always fully visible at every width, because neither
                can be pushed off the other's box.
              - The plate keeps its caption; the card keeps its exact wording.
                Neither text was changed.
              - No `z-index` was raised, so nothing else in the hero had to be
                re-stacked to compensate.

              `w-full` rather than a fixed max-width: the column now sizes both
              children identically, which is what keeps the plate and the card
              visually related instead of one being a narrower orphan. */}
            <Reveal
              variant="fade"
              size="md"
              delay={900}
              className="w-full border border-cream-100/12 bg-ink-900/92 p-5 backdrop-blur-sm"
            >
              <p className="font-display text-[0.9375rem] text-cream-50">
                Educational work began in {school.location.region} in January
                2014.
              </p>
              <p className="mt-2 text-[0.8125rem] leading-relaxed text-cream-300/70">
                Seven students in the first session, reached over ninety
                kilometres a day.
              </p>
            </Reveal>
          </div>
        </div>
      </div>

      {/* Layer 2 — scroll cue. A real link, so it is an affordance rather than
          an ornament, and it is the first thing a keyboard user can reach
          after the hero CTAs. */}
      <div className="relative pb-10">
        <div className="container-page">
          <Link
            href="#approach"
            className="group inline-flex min-h-11 items-center gap-3 text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-cream-300/60 transition-colors duration-[var(--dur-fast)] hover:text-gold-400"
          >
            <span className="relative flex h-9 w-6 items-start justify-center overflow-hidden rounded-full border border-current pt-2">
              {/* The travelling dot. A 9s cycle, translate-only. */}
              <span
                aria-hidden="true"
                className="size-1 rounded-full bg-current"
                style={{ animation: "drift-slow 9s var(--ease-in-out) infinite" }}
              />
            </span>
            Scroll to explore
          </Link>
        </div>
      </div>

      {/* Curved boundary into the cream section below. Drawn in the hero's own
          colour, so it reads as the hero ending. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 90"
        preserveAspectRatio="none"
        className="relative block h-14 w-full text-ink-950 sm:h-20"
      >
        <path
          d="M0,0 L1440,0 L1440,52 C1180,86 940,26 700,56 C460,86 220,26 0,58 Z"
          fill="currentColor"
        />
      </svg>
    </section>
  );
}

/**
 * The transition line between hero and the first content section.
 *
 * A full-bleed statement on cream, oversized, that hands the page from the
 * dark hero into the content. It exists because "hero → immediately a section
 * with a heading" is a cut, whereas "hero → a line the reader reads → content"
 * is a breath.
 */
export function ScrollTransition() {
  return (
    <section
      aria-labelledby="transition-heading"
      className="relative bg-cream-50 pb-4 pt-10 sm:pt-14"
    >
      <div className="container-page">
        <div className="mx-auto max-w-4xl text-center">
          <Reveal as="p" variant="fade" size="sm">
            <span
              aria-hidden="true"
              className="mb-6 inline-block h-px w-16 bg-gradient-to-r from-transparent via-gold-500 to-transparent"
            />
          </Reveal>
          <RevealWords
            as="h2"
            id="transition-heading"
            text="Learning begins with a question."
            delay={100}
            step={52}
            className="block text-display-lg font-display leading-[1.05] tracking-[-0.015em] text-ink-900"
          />
        </div>
      </div>
    </section>
  );
}
