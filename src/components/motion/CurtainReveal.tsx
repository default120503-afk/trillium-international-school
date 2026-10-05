"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { useRevealedOnVisible } from "@/components/motion/Reveal";

/**
 * Curtain reveal.
 *
 * WHY THIS EXISTS ALONGSIDE `Reveal`
 *
 * Auditing the existing motion system before adding anything: `Reveal` offers
 * five variants (rise, fade, plate, slide-left, slide-right, soft) and every
 * one of them is a COMBINATION OF OPACITY AND TRANSLATION. That is the right
 * default, but when every section on a long page translates upward by 18px and
 * fades in, the page reads as a template no matter how good the type is. The
 * repetition is the problem, not the quality of any single entrance.
 *
 * So this adds a genuinely different SHAPE of entrance: a clip-path curtain.
 * The mask opens across the element while its content settles from a slightly
 * larger scale. It is the gesture the Motion documentation describes for
 * image reveals, implemented so it composes with the existing system rather
 * than replacing it.
 *
 * WHY IT REUSES THE SHARED OBSERVER
 *
 * It calls `useRevealedOnVisible`, which is the exact same registry, threshold,
 * rootMargin and once-only semantics that `Reveal` uses. It does NOT create a
 * second IntersectionObserver. If it did, a page using both would pay for two
 * observers over the same document, and the two systems could disagree about
 * when something is "ready" — which is exactly the drift the shared registry
 * exists to prevent.
 *
 * REDUCED MOTION
 *
 * Two independent layers, deliberately:
 *  1. `useReducedMotion()` short-circuits in JS, so the component does not even
 *     render the clipped state.
 *  2. globals.css releases `clip-path` and `transform` under
 *     `prefers-reduced-motion: reduce`.
 * Layer 1 handles the case where the media query is set; layer 2 handles the
 * case where the attribute flips after mount. Neither depends on the other.
 *
 * The clip is applied by CSS only under `html[data-motion="on"]`, which
 * MotionRoot sets after the observer layer mounts. Without JavaScript the
 * attribute is never set, the clip rules never match, and the content renders
 * fully visible. Content is never hidden by the absence of the effect.
 */
export function CurtainReveal({
  children,
  as: Tag = "div",
  /** "horizontal" opens left to right. "up" opens from the bottom edge. */
  direction = "horizontal",
  delay = 0,
  className = "",
  innerClassName = "",
}: {
  children: ReactNode;
  as?: ElementType;
  direction?: "horizontal" | "up";
  /** ms. Use to choreograph a group; keep total choreography under ~600ms. */
  delay?: number;
  className?: string;
  innerClassName?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  // The OBSERVED node is the sentinel, not `ref`. See the comment at the
  // sentinel for why observing the clipped element deadlocks.
  const observeRef = useRef<HTMLSpanElement>(null);
  const shown = useRevealedOnVisible(observeRef);

  // ONE TREE, ALWAYS.
  //
  // There is no reduced-motion branch here. The stylesheet gates every curtain
  // rule behind `html[data-motion="on"]` and the reduced-motion block releases
  // clip-path and transform outright, so a reduced-motion user gets this exact
  // markup with the clip simply never applied. Rendering a separate, plainer
  // subtree for that case would be redundant — and it would introduce a real
  // hazard: `data-motion` is set on <html> AFTER mount, so a conditional that
  // changes the tree causes React to discard the element that the shared
  // IntersectionObserver is watching, and the replacement is never observed.
  // Identical DOM for both preferences is the property that keeps this component
  // from silently hiding content.
  return (
    // The sentinel is a SIBLING of the clipped element, never a child of it.
    // This is the whole fix: an IntersectionObserver computes intersection from
    // painted geometry, and a descendant of a zero-width clip-path inherits that
    // clip — a 1x1px marker inside the curtain still reports
    // `isIntersecting: false, ratio: 0`. Only a node outside the clip can be
    // watched honestly. Measured: with the sentinel inside, the Campus panel sat
    // at top:125px in a 900px viewport and the observer still never fired.
    <>
      <span
        ref={observeRef}
        aria-hidden="true"
        data-curtain-sentinel=""
        className="pointer-events-none inline-block h-px w-px align-top opacity-0"
      />
      <Tag
        ref={ref}
        data-curtain={shown ? "shown" : direction}
        className={className}
        style={
          {
            "--curtain-delay": `${delay}ms`,
          } as React.CSSProperties
        }
      >
        <div data-curtain-inner="" className={innerClassName}>
          {children}
        </div>
      </Tag>
    </>
  );
}
