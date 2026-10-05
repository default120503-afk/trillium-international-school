"use client";

import Image from "next/image";
import { useState } from "react";
import { useActiveStep } from "@/components/motion/StickySequence";
import { uniformSequence, uniformNote } from "@/content/uniform";

/**
 * UNIFORM — a scroll-driven editorial sequence.
 *
 * WHY THIS IS A SEQUENCE AND NOT A GRID
 *
 * The four photographs are overhead flat-lays, not portraits: garments arranged
 * on a pale studio ground with 55-60% of every frame empty. A product grid would
 * do three things wrong at once. It would crop that empty ground away and
 * destroy the composition that makes each frame read as a considered object. It
 * would force all four images to one size, which is exactly wrong here because
 * the boys' summer frame is sparse and the girls' winter frame is dense. And it
 * would break the reading order the school asked for: Uniform, Boys, Boys
 * Summer, Boys Winter, Girls, Girls Summer, Girls Winter. A grid cannot hold a
 * sequence; it can only hold a set.
 *
 * So it reads as one continuous chapter, the way a school publication would set
 * it: an opening title, a group title, two looks, a group title, two looks.
 *
 * ART DIRECTION — WHY THE SECTION IS INK, NOT CREAM
 *
 * The photographs are high-key: measured mean luminance 173-196 out of 255, on
 * grounds of 220-246. Mounting four of those on the site's usual cream would
 * give the reader five consecutive pale rectangles and no focal point at all.
 *
 * Inverting the ground is the fix and it is a real photographic convention,
 * not a preference: a bright object reads as lit against a dark field, and the
 * near-white studio backgrounds stop competing with the page's cream sections
 * they would otherwise blend into. The section therefore sits on ink-950/900,
 * which also gives it the tonal weight of a chapter rather than a block, and
 * hands the next section (campuses, cream) a clean light change to land in.
 *
 * The images are NOT darkened. Each keeps its own exposure; the contrast comes
 * from the ground, which is the honest way to make a high-key photograph read on
 * a dark page. Only a hairline gold rule and the site's own grain sit over it.
 *
 * CHOREOGRAPHY, AND WHY IT IS THIS MUCH
 *
 * Desktop pins one panel for seven steps. Within it:
 *   - the stage word sets itself, large, in the display face
 *   - the plate cross-fades and scales from 1.06 to 1.0 across the step
 *   - a clip-path wipe reveals each plate from the bottom edge
 *   - the rail fills as you go, so position in the sequence is always legible
 *
 * The scale range is deliberately narrow (6%). A wider range reads as a zoom
 * effect rather than as a cross-fade, and it is the kind of motion that makes a
 * long page feel like an animation demo — which is the opposite of the brief.
 * The wipe is the load-bearing gesture: it gives each look the sense of being
 * laid down rather than switched on, which is what a flat-lay actually is.
 *
 * PERFORMANCE
 *
 * - Zero scroll listeners and zero per-frame React renders. The active step comes
 *   from the shared IntersectionObserver hook that already drives the learning
 *   sequence, so this section costs one observer, not one per image.
 * - Every plate is mounted ONCE and cross-faded with opacity/transform. No image
 *   is added or removed from the DOM as you scroll, so no image is re-decoded
 *   mid-sequence.
 * - Only the FIRST plate is eager. The other three are lazy: they are far below
 *   the fold, and a sequence that preloads four 1.5:1 photographs before the
 *   reader reaches it spends bandwidth on nothing.
 * - The parallax and scale transforms are transform-only, so they stay on the
 *   compositor.
 *
 * ACCESSIBILITY — the contract this component keeps
 *
 * This is the part that decides whether the section is usable rather than
 * merely pretty.
 *
 * - EVERY stage is in the accessibility tree at all times, in order. Nothing is
 *   removed because it is not currently visible.
 * - The pinned panel is `aria-hidden` and contains NO focusable elements. The
 *   canonical, always-correct rendering lives in a stacked list below it, which
 *   is what a screen reader and find-in-page actually read.
 * - Below `lg` the pinned panel is `display:none` entirely — not merely faded —
 *   so a mobile or reduced-motion reader is never served a scrubbed panel they
 *   cannot escape.
 * - The rail is a set of REAL BUTTONS that scroll to their step. Scroll-driven
 *   storytelling that can only be driven by scrolling is unusable with a
 *   keyboard, a switch device, or reduced motion.
 * - The sequence is exposed as an ordered list, which is the honest semantic for
 *   "an ordered sequence".
 * - Under reduced motion the sentinels collapse to zero height at EVERY width
 *   and the pinned panel is hidden, so the reader scrolls straight through the
 *   stacked list with no pinned element, no parallax, and no dead scroll
 *   distance. The content is all still there; only the choreography is removed.
 */

export function UniformSequence() {
  const { active, stepRefs } = useActiveStep(uniformSequence.length);
  const [railFocused, setRailFocused] = useState(false);

  const goToStep = (index: number) => {
    const element = stepRefs.current[index];
    if (!element) return;
    element.scrollIntoView({
      behavior: railFocused ? "auto" : "smooth",
      block: "center",
    });
  };

  const current = uniformSequence[active];

  return (
    <section
      id="uniform"
      aria-labelledby="uniform-heading"
      className="scroll-mt-20 bg-ink-950 text-cream-200"
    >
      {/* Heading, outside the pinned panel so it is read once rather than held
          for seven screens. */}
      <div className="container-page pt-20 pb-10 md:pt-28">
        <div className="max-w-3xl">
          <p className="mb-4 flex items-center gap-3 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-gold-400">
            <span aria-hidden="true" className="inline-block h-px w-8 shrink-0 bg-current opacity-45" />
            Uniform
          </p>
          <h2
            id="uniform-heading"
            className="text-display-lg font-display leading-[1.05] tracking-[-0.015em] text-cream-50"
          >
            Two sets for each group, photographed as the school wears them
          </h2>
          {/* max-w-2xl: at 13px across a full 1248px column this ran to roughly
              150 characters per line, far past the 45-85 band where the eye can
              find the next line. The measure is the fix; the words are not
              padded. */}
          <p className="mt-7 flex max-w-2xl items-start gap-2 text-[0.8125rem] leading-relaxed text-cream-300/70">
            <span aria-hidden="true" className="mt-1.5 size-1.5 shrink-0 rounded-full bg-gold-400/70" />
            <span>{uniformNote}</span>
          </p>
        </div>
      </div>

      <div className="relative">
        {/* Sentinels. Full-height markers the observer watches; no content, so
            they never affect layout or reading order.

            They come FIRST, before the pinned panel, so the panel's sticky
            top-0 position is measured against the very start of the track. With
            the rail ahead of them the first sentinel sat below the fold of the
            pinned panel and step 0 could not become active until the reader had
            already scrolled past the opening stage.

            ZERO HEIGHT BELOW lg IS LOAD-BEARING. The pinned panel is
            `hidden lg:flex`, so at 1023px and under there is nothing for these
            markers to drive, yet they were still reserving 7 x 78svh — measured
            at 3177px of empty scroll at 390x844. A mobile visitor would scroll
            through three and a half blank screens before reading a single
            label. Collapsing them below lg removes that dead distance entirely.

            Under reduced motion they collapse at EVERY width, because otherwise
            the reader scrolls through seven empty screens of nothing — the exact
            outcome reduced motion exists to prevent. `!h-0` is required rather
            than a plain variant: two Tailwind variants of equal specificity
            resolve by stylesheet order, not by class-attribute order. */}
        <div aria-hidden="true" className="pointer-events-none">
          {uniformSequence.map((look, index) => (
            <div
              key={look.label}
              ref={(node) => {
                stepRefs.current[index] = node;
              }}
              data-step-index={index}
              className="h-0 lg:h-[78svh] motion-reduce:!h-0"
            />
          ))}
        </div>

        {/* -- The pinned panel --------------------------------------------------
            Structure, and it is load-bearing in three places.

            1. THE WRAPPER IS `absolute inset-0`, NOT IN NORMAL FLOW.

            A `sticky` element is constrained by its PARENT's box: it can only
            travel while the parent is still in view. With the panel in normal
            flow as a sibling of the sentinels, the parent ended 100svh below
            the last sentinel, so the panel had almost no travel and unstuck
            immediately — measured at 1440x900: the rail was 2380px above the
            viewport at scrollY 13892, i.e. the rail fix had silently done
            nothing. Taking the panel out of flow with `absolute inset-0` makes
            the wrapper span the whole sentinel track, which is what gives the
            sticky child room to travel.

            2. THE RAIL IS NOT INSIDE THE aria-hidden REGION.

            A button inside an aria-hidden subtree stays in the tab order while
            being invisible to assistive technology, which is a real defect. So
            the rail remains real, focusable, labelled buttons — announced as
            "Uniform sequence" — and only the decorative composition beside it is
            hidden.

            3. THE RAIL IS PINNED, NOT SCROLLED AWAY.

            The rail was originally a sibling of the panel, above it in normal
            flow. Consequence: it scrolled off the top of the viewport within the
            first ~350px of the section and then stayed gone for the remaining
            ~4300px of pinned sequence — leaving a reader six screens deep in a
            seven-step narrative with no idea where they were. Pinning it with the
            composition fixes that for the whole sequence.

            The `pt` clears the sticky site header (measured 72px at the 1440
            band), so the rail is never tucked under it.

            `motion-reduce:!hidden` rather than a plain variant, and this is not
            decoration. `lg:block` and `motion-reduce:hidden` are two Tailwind
            variants of EQUAL specificity, so which one wins is decided by their
            order in the generated stylesheet, not by their order in this class
            attribute. Verified in Chrome with real reduced-motion emulation: the
            panel computed `display: block` at 1440x900 with the preference set,
            i.e. a pinned 100svh panel was still being rendered for a visitor who
            had asked for no motion at all. The `!` makes the reduced-motion rule
            win deterministically. The sentinels below already needed it for the
            same reason. */}
        <div className="absolute inset-0 hidden lg:block motion-reduce:!hidden">
          {/* The whole panel content (rail + stage) is centred as one block.
              `panel-sticky` centres its single child, but that child is a
              column holding BOTH the rail and the stage; the stage previously sat
              in a `flex-1` region that centred itself, so the rail's height was
              counted above the stage's centring line and the composition read
              62px low relative to the panel (282px air above the grid vs 220px
              below, measured at 1440x900). Centring the whole column instead
              balances the panel edge-to-edge.

              `pt-20 pb-20` is symmetric, and `shrink-0` on the rail wrapper keeps
              the rail from being squeezed as the stage grows. */}
          <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden pt-20 pb-20">
            {/* Rail. Pinned above the composition, so position is legible for
                the whole sequence. Real buttons: scroll-driven storytelling that
                can only be driven by scrolling is unusable with a keyboard, a
                switch device, or a screen reader. */}
            <div className="container-page shrink-0">
              <div
                className="flex items-center gap-1 overflow-x-auto border-y border-cream-100/12 py-2"
                role="group"
                aria-label="Uniform sequence"
                onFocus={() => setRailFocused(true)}
                onBlur={() => setRailFocused(false)}
              >
                {uniformSequence.map((look, index) => {
                  const isActive = index === active;
                  const isPast = index < active;
                  return (
                    <button
                      key={look.label}
                      type="button"
                      onClick={() => goToStep(index)}
                      aria-current={isActive ? "step" : undefined}
                      className="group flex min-h-11 shrink-0 items-center gap-2.5 px-2 text-left transition-colors duration-[var(--dur-base)] sm:gap-3 sm:px-3"
                    >
                      <span
                        aria-hidden="true"
                        className={[
                          /* Decorative only — the label carries the position,
                             and the number is in the stage heading. Measured:
                             all seven labels need 1044px. The `lg` band only
                             offers 944px at a 1024 viewport, so the 7th stage
                             sat off-screen inside a scroll container with no
                             cue that it did. Dropping the rules below `xl`
                             frees 294px (7 x 42px), which fits the run inside
                             944px. At `xl` there is 1168px, so the rules come
                             back — no width loses its affordance. */
                          "hidden h-px w-6 transition-colors duration-[var(--dur-slow)] ease-[var(--ease-out-soft)] sm:w-8 xl:block",
                          isPast
                            ? "bg-gold-500"
                            : isActive
                              ? "bg-gold-400"
                              : "bg-cream-100/20 group-hover:bg-cream-100/40",
                        ].join(" ")}
                      />
                      <span
                        className={[
                          "shrink-0 whitespace-nowrap text-[0.6875rem] font-semibold uppercase tracking-[0.16em] transition-colors duration-[var(--dur-base)]",
                          /* Both non-active states have to clear 4.5:1 at
                             11px, which is the WCAG 1.4.3 threshold for body
                             text and has nothing to do with how large it looks.
                             Measured on the panel ground (ink-950): the old
                             future state at /45 composited to rgb(113,100,106)
                             = 3.34:1, which axe also failed. /65 lands at
                             5.69:1. It stays a visible step below the /70
                             already-passed state, so the progress read survives
                             the contrast fix — but "already seen" was the
                             brighter state, which is backwards for the stages
                             the visitor still has to reach. */
                          isActive
                            ? "text-gold-400"
                            : isPast
                              ? "text-cream-300/70"
                              : "text-cream-300/65",
                        ].join(" ")}
                      >
                        {look.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Composition. aria-hidden and holding NO focusable elements.

                `shrink-0` (not `flex-1`): the panel centres the whole column, so
                this wrapper must take only the height it needs. `flex-1` made it
                absorb every spare pixel, and because the grid centres itself
                inside `h-full`, the stage drifted low while looking centred in a
                box that was itself off-centre. */}
            <div aria-hidden="true" className="pointer-events-none flex shrink-0 flex-col">
              {/* No `h-full` here. The wrapper is `shrink-0` now, so this inner
                  container has only the height the grid needs; `h-full` would
                  resolve against a shrink-0 parent and reintroduce the slack
                  that pushed the stage low. `items-center` still centres the
                  grid inside whatever this box turns out to be. */}
              <div className="container-page flex items-center">
              {/* `w-full` IS LOAD-BEARING. This grid is a flex child, and a flex
                  child sizes to its CONTENT by default. The right column holds
                  only absolutely-positioned plates, so it has no intrinsic
                  width — measured, the grid collapsed to 2px and the photograph
                  was rendered at 2x2 px, i.e. invisible, while the type column
                  took the whole track. `w-full` makes the grid fill the
                  container instead of asking its content how big it is. */}
              {/* `items-center` was already here, so the two columns are
                  optically centred against each other — but the type column is
                  only 304px against the plate's 399px, so the word sits in the
                  middle of a column that itself stops 95px short of its
                  neighbour. `items-stretch` makes both columns the same height
                  and the type block centres itself within it, so the word
                  lands on the plate's optical centre instead of floating in a
                  shorter box beside it. */}
              <div className="grid w-full grid-cols-[0.9fr_1.1fr] items-stretch gap-12 xl:gap-20">
                {/* Stage label. The word that changes is the whole point, so it
                    is the largest thing on the panel.

                    No fixed height here. This was `h-[19rem]` — 304px, hardcoded
                    to match nothing in particular — which is why the column sat
                    95px shorter than the 399px plate beside it. With the grid on
                    `items-stretch` the cell now takes the plate's height, and
                    `flex items-center` centres the word inside it. The plate is
                    `aspect-[3/2]` on a 1.1fr column, so this cell's height is
                    already a function of the viewport; a second hardcoded number
                    was a second thing that could drift out of agreement with it. */}
                <div className="relative flex items-center">
                  {uniformSequence.map((look, index) => (
                    <div
                      key={look.label}
                      className="absolute inset-0 flex flex-col justify-center transition-opacity duration-[var(--dur-slow)] ease-[var(--ease-in-out)] motion-reduce:transition-none"
                      style={{
                        opacity: index === active ? 1 : 0,
                        transform:
                          index === active
                            ? "translate3d(0,0,0)"
                            : index < active
                              ? "translate3d(0,-22px,0)"
                              : "translate3d(0,22px,0)",
                        visibility: index === active ? "visible" : "hidden",
                        transitionDelay: index === active ? "0ms" : "60ms",
                      }}
                    >
                      <span className="flex items-center gap-3 text-[0.6875rem] font-semibold tracking-[0.2em] text-gold-400 uppercase">
                        <span aria-hidden="true">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span aria-hidden="true" className="h-px w-10 bg-current opacity-40" />
                        <span>of {uniformSequence.length}</span>
                      </span>
                      {/* `text-balance` rather than a manual break: the word is
                          set as one element, so it wraps on its own terms at
                          every width instead of at a hand-placed one. */}
                      <p className="mt-6 font-display text-[clamp(3rem,6.5vw,6.5rem)] leading-[0.86] tracking-[-0.035em] text-balance text-cream-50">
                        {look.label}
                      </p>
                      {/* The caption exists so this column is a text column and
                          not a word floating in dead ink. On a desktop the
                          canonical list is `lg:sr-only`, so this line is the
                          only body copy a visitor reads for the look. Capped
                          at a measure so it reads as a paragraph rather than a
                          full-height column of type. */}
                      {/* `text-pretty` and the measure are both load-bearing
                          for the caption. At 34ch the browser was breaking
                          between "a blue" and "tie", splitting a noun phrase
                          across lines. `text-pretty` lets it avoid that class of
                          break where the measure allows an alternative. */}
                      {look.caption ? (
                        <p className="mt-7 max-w-[32ch] text-pretty text-base leading-relaxed text-cream-300/70">
                          {look.caption}
                        </p>
                      ) : null}
                    </div>
                  ))}

                  {/* A group marker used to sit here: a gold dot plus the words
                      "Winter and summer", on the two chapter stages. It is gone
                      for two reasons. Its two arms of the ternary that fed it
                      were the same string, so the conditional decided nothing
                      while looking like it did; and the stage caption now says
                      "Winter and summer." in the same place, one line up, in a
                      readable size. All the marker had left to offer was an
                      absolutely-positioned dot over dead ink — decoration with
                      nothing to decorate. */}
                </div>

                {/* The plate. */}
                <div className="relative aspect-[3/2] w-full">
                  {uniformSequence.map((look, index) => {
                    if (!look.image) return null;
                    const isActive = index === active;
                    return (
                      <div
                        key={look.label}
                        className="absolute inset-0 overflow-hidden rounded-[var(--radius-card)] border border-cream-100/12 bg-ink-900"
                        style={{
                          opacity: isActive ? 1 : 0,
                          // 6% is the whole scale range. Wider reads as a zoom
                          // effect rather than as a settle.
                          transform: `scale(${isActive ? 1 : 1.06})`,
                          // Wipe from the bottom edge: the garment appears to be
                          // laid down rather than switched on.
                          clipPath: isActive
                            ? "inset(0% 0% 0% 0%)"
                            : "inset(100% 0% 0% 0%)",
                          visibility: isActive ? "visible" : "hidden",
                          transition:
                            "opacity var(--dur-slow) var(--ease-in-out), transform var(--dur-cinematic) var(--ease-out-soft), clip-path var(--dur-slow) var(--ease-in-out)",
                          transitionDelay: isActive ? "0ms" : "0ms",
                        }}
                      >
                        <Image
                          src={look.image}
                          alt=""
                          fill
                          // The plate is 3:2 and every source is exactly 3:2,
                          // so `cover` is `contain` here — stated explicitly so
                          // a future crop of an asset does not silently change
                          // the composition.
                          className="object-cover"
                          sizes="(max-width: 1536px) 46vw, 620px"
                          // Only the first plate is eager. The rest are far below
                          // the fold; preloading four 1.5:1 photographs before
                          // the reader arrives spends bandwidth on nothing.
                          priority={index === 2}
                          loading={index === 2 ? undefined : "lazy"}
                        />
                        {/* A single hairline of brand light along the top edge.
                            Not a scrim: it does not darken the photograph, so
                            the garment keeps its own exposure. */}
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-400/45 to-transparent"
                        />
                      </div>
                    );
                  })}

                  {/* The three typographic stages have no photograph. Rather
                      than leave a hole in the composition, the plate area holds
                      the stage's own name, set as an object. That is what the
                      stage IS, so nothing is invented to fill it. */}
                  {!current.image ? (
                    <div
                      key={current.label}
                      className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-[var(--radius-card)] border border-cream-100/12 bg-[linear-gradient(150deg,var(--color-ink-800),var(--color-ink-950)_62%,var(--color-navy-900))]"
                      style={{
                        animation: "fade-rise var(--dur-slow) var(--ease-out-soft) both",
                      }}
                    >
                      {/* The same arc geometry the campus selector uses, so the
                          plate reads as this site's vocabulary rather than as a
                          generic placeholder. */}
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 400 400"
                        className="absolute -right-20 -bottom-24 size-[30rem] text-gold-400/18"
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
                      <span className="relative font-display text-[clamp(2.5rem,5vw,4.5rem)] leading-none tracking-[-0.03em] text-cream-100/90">
                        {current.label}
                      </span>
                    </div>
                  ) : null}
                </div>
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* -- Canonical content ---------------------------------------------
          The copy in the accessibility tree, and what you actually see on
          mobile. ALWAYS rendered.

          `lg:sr-only` at desktop. The reasoning is not simply "the panel is
          aria-hidden": the rail is deliberately OUTSIDE that hidden region
          precisely so it stays operable. So the tree carries both the seven
          rail buttons AND these seven stages — which is correct rather than
          duplicated, because the buttons are navigation and the stages are
          content. A screen-reader user gets a labelled navigation group and then
          the ordered list of what the sequence contains.

          Using `lg:hidden` here would instead leave a desktop screen-reader user
          with a section containing nothing but seven nav buttons and no content.
          Visually hidden but present is the only version that is correct at
          every width. */}
      <div className="container-page py-20 lg:sr-only motion-reduce:lg:not-sr-only">
        <ol className="flex flex-col">
          {uniformSequence.map((look, index) => (
            <li
              key={look.label}
              className="border-t border-cream-100/15 py-12 first:border-t-0 first:pt-0"
            >
              <span className="flex items-center gap-3 text-[0.6875rem] font-semibold tracking-[0.2em] text-gold-400 uppercase">
                <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <span aria-hidden="true" className="h-px w-10 bg-current opacity-40" />
                <span>of {uniformSequence.length}</span>
              </span>
              <h3 className="mt-5 font-display text-4xl leading-none tracking-[-0.02em] text-cream-50 lg:text-5xl">
                {look.label}
              </h3>
              {/* The canonical list is `lg:sr-only`, and on mobile and under
                  reduced motion it is the ONLY rendering. So the caption has to
                  live here too or those three paths lose the body copy. */}
              {look.caption ? (
                <p className="mt-4 max-w-[52ch] text-pretty text-base leading-relaxed text-cream-300/70">
                  {look.caption}
                </p>
              ) : null}
              {look.image ? (
                <figure className="mt-7 max-w-2xl">
                  <div className="relative aspect-[3/2] w-full overflow-hidden rounded-[var(--radius-card)] border border-cream-100/12 bg-ink-900">
                    <Image
                      src={look.image}
                      alt={
                        // Guaranteed whenever `image` is set — the two travel
                        // together in the content model — but the type cannot
                        // express that, and an `undefined` alt is a defect.
                        look.alt ?? `${look.label} uniform`
                      }
                      fill
                      className="object-cover"
                      /* Bounded so the DPR multiplier cannot walk this up the
                         srcset ladder. `92vw` on a 390px phone at DPR3 asks for
                         1076px of image; Next's largest rung is 3840, so a
                         mobile visitor reaching this list could be served ~80KB
                         per photograph for a box that is 390px wide. These four
                         images sit in a `max-w-2xl` (672px) figure, so 672px is
                         the true ceiling and the viewport term only needs to
                         describe the full-bleed case honestly.

                         The desktop branch is what the pinned panel uses and is
                         left exactly as it was. */
                      sizes="(max-width: 640px) 90vw, 672px"
                      // Lazy everywhere here: this block is below the fold on
                      // every viewport, including the desktop one where it is
                      // sr-only but still occupies a box.
                      loading="lazy"
                    />
                  </div>
                </figure>
              ) : null}
            </li>
          ))}
        </ol>
      </div>

      {/* Tall tail so the final stage can scroll clear of the pinned panel
          before the section ends. Without it the last look is unreachable on a
          track whose final sentinel sits under the panel. */}
      <div
        aria-hidden="true"
        className="hidden pb-20 lg:block motion-reduce:!hidden"
        style={{ height: "36svh" }}
      />
    </section>
  );
}