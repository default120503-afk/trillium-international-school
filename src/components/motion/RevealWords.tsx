"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { Reveal, useRevealedOnVisible } from "@/components/motion/Reveal";

/**
 * Masked, staggered word reveal for display typography.
 *
 * This is the one place the site deliberately fragments a heading into
 * per-word spans, because it is the one place the effect earns its cost: a
 * hero headline arriving as a sequence, each word rising out of an invisible
 * mask, reads as choreography. Applied to every heading it would be noise.
 *
 * ACCESSIBILITY - the important part of this component:
 *
 * Splitting a heading into spans is normally an accessibility bug. The
 * fragmented DOM produces a screen-reader announcement full of separate
 * words, breaks find-in-page for a multi-word heading, and makes the heading
 * text unsearchable as a phrase.
 *
 * The fix here is that the split is presentational ONLY:
 *  - The real heading element carries `aria-label` with the complete, correct
 *    text, so assistive technology reads one coherent phrase.
 *  - The visual spans are marked `aria-hidden="true"`.
 *  - The rendered DOM therefore exposes the heading exactly once, as text,
 *    with no duplication between aria-label and content.
 *
 * A no-JS visitor gets the same complete text, since the spans are server
 * rendered with their content intact.
 *
 * MASKING TECHNIQUE: each word is wrapped in an `overflow: hidden` block, and
 * the inner span is translated down out of view, then translated to 0. This is
 * a real mask (the parent clips), which is why the words appear to emerge from
 * behind a line rather than simply fading in place.
 */

export function RevealWords({
  text,
  as: Tag = "span",
  /** Delay before the first word starts, in ms. */
  delay = 0,
  /** Gap between words, ms. */
  step = 55,
  /** Cap so a long headline does not take seconds to finish. */
  maxWords = 9,
  /** Classes for the wrapping heading element. */
  className = "",
  /** Classes for each word. */
  wordClassName = "",
  /** Render words in the display serif or the sans face. */
  face = "display",
  /** Id on the heading, for aria-labelledby on a wrapping <section>. */
  id,
}: {
  text: string;
  as?: ElementType;
  delay?: number;
  step?: number;
  maxWords?: number;
  className?: string;
  wordClassName?: string;
  face?: "display" | "sans";
  id?: string;
}) {
  const words = text.split(" ").filter(Boolean);
  const ref = useRef<HTMLElement>(null);
  // The heading joins the shared reveal lifecycle. This attribute is what the
  // stylesheet keys on to reset each word from its masked position back to
  // `transform: none` — without it the words stay translated 105% down inside
  // an overflow:hidden mask and the heading is invisible.
  const revealed = useRevealedOnVisible(ref);

  return (
    <Tag
      id={id}
      ref={ref}
      aria-label={text}
      data-words-revealed={revealed ? "shown" : "hidden"}
      className={className}
    >
      {words.map((word, index) => {
        const effectiveIndex = Math.min(index, maxWords);
        return (
          <span
            key={`${word}-${index}`}
            aria-hidden="true"
            data-word-mask=""
            className={[
              "inline-flex overflow-hidden align-bottom",
              // A descender (g, y, p) is clipped by overflow:hidden unless we
              // give the mask a little room underneath. 0.14em covers the
              // descenders in Fraunces at these sizes without letting the
              // neighbouring line bleed in.
              "pb-[0.14em]",
              face === "sans" ? "" : "font-display",
              wordClassName,
            ]
              .filter(Boolean)
              .join(" ")}
            style={{
              // Vertical padding compensates for the descender room so the
              // baseline still aligns with surrounding text.
              marginBottom: "-0.14em",
              marginRight: "0.24em",
            }}
          >
            <span
              data-word=""
              style={{
                display: "inline-block",
                // Delay is written as a custom property so the stylesheet owns
                // the transform and the reduced-motion override.
                ["--word-delay" as string]: `${delay + effectiveIndex * step}ms`,
              }}
            >
              {word}
            </span>
          </span>
        );
      })}
    </Tag>
  );
}

/**
 * Reveal an editorial block: eyebrow, headline, and supporting line, entering in
 * a deliberate order rather than all at once.
 *
 * Order is: eyebrow, then headline words, then the lead. That sequence reads
 * as "here is the subject, here is the thought, here is the detail", which is
 * the order a reader wants them in. Firing them simultaneously loses that.
 */
export function EditorialReveal({
  eyebrow,
  title,
  titleAs: TitleTag = "h2",
  lead,
  className = "",
  titleClassName = "",
  leadClassName = "",
  delay = 0,
}: {
  eyebrow?: ReactNode;
  title: string;
  titleAs?: ElementType;
  lead?: ReactNode;
  className?: string;
  titleClassName?: string;
  leadClassName?: string;
  delay?: number;
}) {
  return (
    <div className={className}>
      {eyebrow ? (
        <Reveal as="p" variant="fade" size="sm" delay={delay} className="mb-4">
          {eyebrow}
        </Reveal>
      ) : null}

      <RevealWords
        as={TitleTag}
        text={title}
        delay={delay + 90}
        className={["block", titleClassName].filter(Boolean).join(" ")}
      />

      {lead ? (
        <Reveal as="p" variant="soft" size="md" delay={delay + 260} className={leadClassName}>
          {lead}
        </Reveal>
      ) : null}
    </div>
  );
}
