import Image from "next/image";
import { school, company } from "@/content/school";

/**
 * Decorative brand geometry for the hero and section transitions.
 *
 * WHY SVG AND NOT IMAGES:
 * The brochure contains no photography of the school, and stock imagery must
 * never stand in for it. What the school DOES have is a strong graphic
 * identity — deep violet, gold, cream, and the flowing organic curves of its
 * printed material. Vector geometry is the honest way to build an art-directed
 * composition out of that: it is original, it is light, it scales, and it
 * makes no claim about what the buildings look like.
 *
 * Everything here is aria-hidden and purely decorative. No information is
 * conveyed by these shapes alone.
 */

/**
 * The hero's layered backdrop: concentric arcs, a slow-rotating orbit ring,
 * and a petal constellation.
 *
 * Motion: `animate-rotate-slow` on the orbit (60s) and `animate-drift-slow` on
 * the washes (26s). Both are transform-only and both stop under reduced
 * motion. The rotation is deliberately slower than anyone can track, so it
 * reads as a living background rather than a spinning logo.
 */
export function HeroField() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Deep base wash. A linear gradient rather than a blurred blob: a gradient
          costs one paint, a large blurred element costs a filtered layer that
          the compositor has to keep alive for the whole scroll. */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_95%_at_78%_8%,var(--color-ink-800)_0%,var(--color-ink-900)_38%,var(--color-ink-950)_72%)]" />

      {/* Warm gold light entering from the upper right, echoing the brochure's
          gold wash. Opacity is low by design: this is atmosphere, not a focal
          point, and the headline must stay the brightest thing on screen. */}
      <div className="animate-drift-slow absolute -top-32 -right-24 size-[42rem] rounded-full bg-[radial-gradient(circle_at_center,var(--color-gold-500)_0%,transparent_66%)] opacity-[0.14]" />

      {/* Cool violet counterweight, lower left. */}
      <div
        className="animate-drift absolute -bottom-56 -left-40 size-[46rem] rounded-full bg-[radial-gradient(circle_at_center,var(--color-ink-600)_0%,transparent_64%)] opacity-25"
        style={{ animationDelay: "-9s" }}
      />

      {/* Architectural line work: the arcs. These give the hero depth without
          any photographic content, and they read as "designed" rather than
          "stock". */}
      <svg
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 size-full text-cream-100/[0.07]"
        fill="none"
      >
        {/* Vertical rhythm lines, echoing the profile's printed columns. */}
        {[180, 420, 660, 900, 1140, 1380].map((x) => (
          <line
            key={x}
            x1={x}
            y1="0"
            x2={x}
            y2="900"
            stroke="currentColor"
            strokeWidth="1"
          />
        ))}

        {/* Concentric arcs anchored off-canvas right, so only their sweep is
            visible. This is the "layered depth" of the composition: the reader
            sees the edge of something much larger. */}
        {[260, 400, 560, 740, 940, 1160].map((r) => (
          <circle
            key={r}
            cx="1290"
            cy="180"
            r={r}
            stroke="currentColor"
            strokeWidth="1"
          />
        ))}

        {/* One gold arc, weighted heavier than the rest, to give the eye a
            single warm line to follow. */}
        <circle
          cx="1290"
          cy="180"
          r="740"
          stroke="var(--color-gold-500)"
          strokeOpacity="0.22"
          strokeWidth="1.5"
        />
      </svg>

      {/* The slowly rotating orbit. Concentric dashed circles read as
          instrumentation; the trillium petals on it tie the geometry back to
          the school's name. */}
      <div className="animate-rotate-slow absolute top-[-18vh] right-[-14vw] size-[62rem] opacity-45 md:top-[-22vh] md:right-[-10vw] md:size-[78rem]">
        <svg viewBox="0 0 600 600" className="size-full text-gold-400/25" fill="none">
          <circle
            cx="300"
            cy="300"
            r="286"
            stroke="currentColor"
            strokeWidth="0.75"
            strokeDasharray="2 10"
          />
          <circle
            cx="300"
            cy="300"
            r="228"
            stroke="currentColor"
            strokeWidth="0.5"
            strokeOpacity="0.6"
          />
          {[0, 120, 240].map((angle) => (
            <g key={angle} transform={`rotate(${angle} 300 300)`}>
              <path
                d="M300 18c6.6 0 12 7.8 12 17s-5.4 18-12 18-12-8.8-12-18 5.4-17 12-17Z"
                fill="currentColor"
                fillOpacity="0.5"
                transform="translate(0 40)"
              />
            </g>
          ))}
        </svg>
      </div>

      {/* Fine grain. A single tiled SVG turbulence at very low opacity removes
          the flat, plastic quality of a pure gradient. It is a static
          background-image, so it costs one paint and nothing thereafter — an
          animated noise layer would repaint continuously, which is exactly the
          expense this avoids. */}
      <div
        className="absolute inset-0 opacity-[0.045] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Bottom fade into the next section, so the hard edge between the dark
          hero and the cream band below is softened into a transition rather
          than a cut. */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ink-950/70" />
    </div>
  );
}

/**
 * Petal constellation for dark sections.
 *
 * A small, cheap, static brand mark. Used where a section needs a quiet brand
 * presence but must not compete with its own content.
 */
export function PetalField({
  className = "",
  count = 5,
}: {
  className?: string;
  count?: number;
}) {
  return (
    <div aria-hidden="true" className={["pointer-events-none select-none", className].join(" ")}>
      <svg viewBox="0 0 400 400" className="size-full" fill="none">
        {Array.from({ length: count }, (_, i) => {
          const angle = (360 / count) * i;
          return (
            <g key={i} transform={`rotate(${angle} 200 200)`} opacity={0.5 - i * 0.06}>
              <path
                d="M200 40c9.4 0 17 11 17 24s-7.6 26-17 26-17-13-17-26 7.6-24 17-24Z"
                fill="currentColor"
              />
            </g>
          );
        })}
        <circle cx="200" cy="200" r="5" fill="currentColor" />
      </svg>
    </div>
  );
}

/**
 * Curved section boundary.
 *
 * `flip` mirrors it. The curve is drawn in the COLOUR OF THE SECTION ABOVE,
 * which is what makes it read as that section ending rather than the next one
 * beginning — the direction of the flow is the reader's cue for where they
 * are in the page.
 */
export function CurveEdge({
  color,
  flip = false,
  className = "",
  height = 72,
}: {
  /** A CSS colour value or a `var(--color-…)` reference. */
  color: string;
  flip?: boolean;
  className?: string;
  height?: number;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 80"
      preserveAspectRatio="none"
      className={["block w-full", className].filter(Boolean).join(" ")}
      style={{ height, color }}
    >
      <path
        d={
          flip
            ? "M0,80 L0,36 C260,4 520,68 760,40 C1000,12 1240,64 1440,28 L1440,80 Z"
            : "M0,0 L1440,0 L1440,44 C1180,76 940,20 700,48 C460,76 220,20 0,52 Z"
        }
        fill="currentColor"
      />
    </svg>
  );
}

/**
 * Founder plate: the real crest, treated as an object in a composition rather
 * than than a badge on a card.
 *
 * THE MOUNT IS GONE, AND THAT IS THE DESIGN DECISION.
 *
 * This was a cream paper plate with a gold hairline and the crest centred on
 * it. That plate is what produced the "white background behind the logo" the
 * owner reported: it is a literal filled rectangle of #fdfbf7 sitting behind
 * the mark, and it was hiding a third of the artwork.
 *
 * The measurement that settles it. Classifying the crest's opaque pixels by
 * hue gives gold/amber 41.9%, deep navy 26.8%, azure 16.8%, other 9.4%,
 * near-white 2.3%. The mark is therefore roughly 42% warm gold AND 27% dark
 * navy - it has no single tone, so no flat plate can serve it. Contrasting
 * every content pixel against each candidate surface:
 *
 *   on cream-50 #fdfbf7 : 18.1% of content below 1.3:1, 16.6% 1.3-2.0
 *                         -> 46.2% of the GOLD is below 1.5:1
 *                         -> 100% of the near-white is at zero contrast
 *   on ink-950  #170b2b : 6.7% below 1.3:1, 13.1% 1.3-2.0
 *                         -> 99.2% of the gold reads at 2:1 or better
 *                         -> 100% of the azure and near-white read
 *
 * So the cream plate was not "a subtle container for contrast" - it was
 * dissolving nearly half the crest's gold linework, which is precisely the
 * detail that makes it read as a crest rather than as a smudge. The hero is
 * already ink-950, and ink-950 is the best-reading surface available to this
 * asset, so the correct answer is to remove the plate and let the crest sit
 * directly on the hero it is already composited into.
 *
 * What replaces the plate is depth, not colour: a gold hairline INSET (drawn
 * on the plate's former footprint but as a border on transparent ink), the
 * existing arc geometry, and a soft directional glow beneath the mark so it
 * sits IN the hero rather than on top of it. Nothing opaque is placed behind
 * the artwork.
 */
export function LogoPlate({
  className = "",
  caption,
}: {
  className?: string;
  caption?: string;
}) {
  return (
    <div className={["relative", className].filter(Boolean).join(" ")}>
      {/* Arc geometry behind the plate. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 400 400"
        className="absolute -inset-10 size-[calc(100%+5rem)] text-gold-400/20"
        fill="none"
      >
        <circle cx="200" cy="200" r="186" stroke="currentColor" strokeWidth="0.75" />
        <circle cx="200" cy="200" r="160" stroke="currentColor" strokeWidth="0.75" />
        <path
          d="M200 14 C296 62 386 138 386 200 C386 262 296 338 200 386 C104 338 14 262 14 200 C14 138 104 62 200 14 Z"
          stroke="currentColor"
          strokeWidth="0.75"
        />
      </svg>

      {/*
        Depth without opacity. No opaque plate: the logo's own black matte was
        measured and removed at the asset level (see Marks.tsx), so the artwork
        is genuinely transparent here and can sit directly on ink-950. What is
        left is depth — a gold hairline, a faint inner lift, and a warm glow
        pooled UNDER the mark rather than a box behind it.

        The frame hugs the mark. The supplied lockup is 1.7034:1 and fills the
        frame edge to edge (measured bbox covers the whole raster), so any fixed
        padding would either crop the branches or leave dead air. Inset instead:
        the hairline reads as a mount around the whole lockup, which is the
        honest description of what it is.
      */}
      <div className="relative overflow-hidden rounded-[3px] border border-gold-400/30 bg-ink-950/25 p-5 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.75)] sm:p-7">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-8 top-1/2 -z-0 h-56 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,var(--color-gold-500)_0%,transparent_70%)] opacity-[0.13] blur-2xl"
        />
        <Image
          src="/brand/logo.png"
          /* "Logo", not "crest". The supplied source is a WIDE wordmark lockup
             (1499x880, 1.7034:1) that carries the school name, so calling it a
             crest tells a screen reader the wrong shape of thing. This is the
             only description that element ever had and it outlived the asset it
             was written for. */
          alt={`${school.name} logo`}
          width={1499}
          height={880}
          // Above the fold on every page, so it must not be lazy.
          priority
          sizes="(max-width: 1024px) 70vw, 380px"
          // `object-contain` with an explicit aspect box: the logo is 1.7034:1,
          // so pinning the ratio means the browser reserves the correct space
          // and the artwork is never cropped by a `fill` default.
          className="relative h-auto w-full object-contain"
        />
        <span aria-hidden="true" className="mt-5 block h-px w-full bg-gold-500/35" />
        {caption ? (
          <p className="mt-4 text-center text-[0.6875rem] tracking-[0.2em] text-cream-300/70 uppercase">
            {caption}
          </p>
        ) : (
          /* THE INSTITUTIONAL CREDIT LINE.
             This is the primary placement of the Quick Done Corporation
             attribution: it sits directly beneath the school's own lockup,
             separated by the gold hairline above, so the reading order is
             unambiguous — the school is the subject, the company is the
             project's parent.

             Scale is the whole design. At 11px in a wide-tracked sans it reads
             as a credit line set by a typesetter; at display size it would
             read as a second logo and split the identity in two. It is never
             larger than the smallest type on the plate.

             Colour is the existing brand gold (gold-400 #e3bd63) on the hero's
             ink-950, which measures ~9:1 — comfortably readable at this size
             without becoming the brightest thing in the frame. Weight is
             medium, tracking 0.2em, uppercased: the conventions that make an
             institutional attribution look settled rather than shouted.

             Nothing animates, and nothing wraps into an oversized block on
             mobile — it is a single centred line that is allowed to sit on two
             at the narrowest widths. */
          <p className="mt-4 text-center text-[0.6875rem] font-medium tracking-[0.2em] text-gold-400 uppercase">
            {company.attribution}
          </p>
        )}
      </div>
    </div>
  );
}
