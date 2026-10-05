"use client";

import { useCallback, useRef, useSyncExternalStore, type ElementType, type ReactNode } from "react";

/**
 * Scroll reveal.
 *
 * ONE primitive for every entrance on the site. It exists so that entrances
 * cannot drift apart: same duration, same easing, same trigger point, same
 * reduced-motion behaviour everywhere. Sites usually feel "assembled" because
 * each section invented its own fade; centralising it is most of the fix.
 *
 * Design decisions, each with a reason:
 *
 * 1. ONE OBSERVER, MANY TARGETS. Each <Reveal> creates its own
 *    IntersectionObserver, and a page with 40 reveals creates 40 observers
 *    plus 40 separate callbacks. Instead the observer is created lazily on the
 *    first Reveal to mount, kept in a module-level registry, and every Reveal
 *    subscribes to it. Observing 40 elements with one observer is dramatically
 *    cheaper than 40 observers, and the callback does one batched pass.
 *
 * 2. `once` IS THE DEFAULT. An entrance should happen once. Re-animating on
 *    every scroll pass is what turns a site into an animation demo.
 *
 * 3. THE OBSERVER ONLY SETS A STATE FLAG. The actual movement is a CSS
 *    transition on `data-reveal="shown"`. That keeps the animation on the
 *    compositor (opacity + transform only) and means the browser owns the
 *    timing, not React. No per-frame JavaScript.
 *
 * 4. `rootMargin` bottoms out by 8% so an element animates slightly BEFORE it
 *    touches the viewport edge. Triggering exactly at the edge reads as a lag.
 *
 * 5. NO `will-change` IN THE DEFAULT. `will-change` promotes a layer for the
 *    lifetime of the element; on 40 elements that is 40 permanent GPU layers
 *    and a large memory cost for no gain, because the transition is short and
 *    the promotion is temporary in practice. It is opt-in via `lift` for the
 *    few cases that genuinely need it.
 *
 * Accessibility:
 * - Content is fully visible without JavaScript and without CSS support.
 * - Reduced motion: MotionRoot removes data-motion, these rules stop matching,
 *   and the element is simply present. Not "animated faster" - present.
 * - `as` lets the caller keep a correct heading outline, so a reveal never
 *   costs the document its structure.
 */

type RevealVariant =
  /** Translate up 18px + fade. The default entrance. */
  | "rise"
  /** Fade only. For text already in its final position. */
  | "fade"
  /** Translate up + slight scale down, for imagery and plates. */
  | "plate"
  /** Horizontal entrance from the left, for editorial asides. */
  | "slide-left"
  /** Horizontal entrance from the right. */
  | "slide-right"
  /** Fade + 6px rise, deliberately smaller. For dense lists. */
  | "soft";

type RevealSize = "sm" | "md" | "lg";

const durations: Record<RevealSize, string> = {
  sm: "var(--dur-base)",
  md: "var(--dur-slow)",
  lg: "var(--dur-cinematic)",
};

const from: Record<RevealVariant, string> = {
  rise: "translate3d(0, 18px, 0)",
  fade: "none",
  plate: "translate3d(0, 26px, 0) scale(0.985)",
  "slide-left": "translate3d(-24px, 0, 0)",
  "slide-right": "translate3d(24px, 0, 0)",
  soft: "translate3d(0, 6px, 0)",
};

/* ------------------------------------------------------------------ */
/* Shared observer: one instance, lazily created, reused forever.     */
/* ------------------------------------------------------------------ */

type ObserverRegistry = {
  observer: IntersectionObserver | null;
  callbacks: Map<Element, () => void>;
  /**
   * Per-element revealed flag.
   *
   * `useSyncExternalStore` requires getSnapshot to return a value that is
   * STABLE between changes — returning a fresh value each call causes React to
   * re-render in a loop. The flag therefore lives here, keyed by element, and
   * is written exactly once per element by the observer callback. That is also
   * what makes the reveal once-only: after the first entry the element is
   * unsubscribed, so nothing can set it again.
   */
  revealed: WeakMap<Element, boolean>;
};

const registry: ObserverRegistry = {
  observer: null,
  callbacks: new Map(),
  revealed: new WeakMap(),
};

function subscribe(element: Element, onEnter: () => void): () => void {
  if (!registry.observer) {
    // Thresholds are effectively binary at these values; keeping them low means
    // an element only needs a sliver visible to trigger, which is what we want
    // for tall images.
    registry.observer = new IntersectionObserver(
      (entries) => {
        // Batch: collect everything that entered in this callback, then run the
        // callbacks, so N reveals cost one style flush rather than N.
        const entered: Array<[Element, () => void]> = [];
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const cb = registry.callbacks.get(entry.target);
          if (!cb) continue;
          // Once-only: unsubscribe as soon as it has fired.
          registry.callbacks.delete(entry.target);
          registry.observer?.unobserve(entry.target);
          registry.revealed.set(entry.target, true);
          entered.push([entry.target, cb]);
        }
        for (const [, cb] of entered) cb();
      },
      { threshold: 0.08, rootMargin: "0px 0px -8% 0px" },
    );
  }

  registry.callbacks.set(element, onEnter);
  registry.observer.observe(element);

  return () => {
    registry.callbacks.delete(element);
    registry.observer?.unobserve(element);
  };
}

/** Read the stable revealed flag for an element. */
function isRevealed(element: Element | null): boolean {
  if (!element) return false;
  return registry.revealed.get(element) ?? false;
}

/**
 * Mark an element revealed without waiting for the observer.
 *
 * Used for the two cases where the element is legible immediately: it is
 * already within the viewport on load, or the motion layer never activated.
 * Writing the same flag the observer would have written keeps getSnapshot
 * honest, so React sees a value change rather than a stale one.
 */
function markRevealed(element: Element, notify: () => void) {
  if (registry.revealed.get(element) === true) return;
  registry.revealed.set(element, true);
  notify();
}

/**
 * Subscribe an element to the same shared reveal registry `Reveal` uses.
 *
 * WHY THIS EXISTS
 *
 * `Reveal` toggles `data-reveal="hidden"|"shown"` and the stylesheet has a
 * matching reset rule (`[data-reveal="shown"] { transform: none }`), so the
 * element always resolves to a visible state.
 *
 * The word-masked headings did NOT have that pairing. `RevealWords` emitted
 * `[data-word-mask] > [data-word]`, globals.css hid `[data-word]` with
 * `transform: translate3d(0, 105%, 0)` — and NO rule anywhere reset it to
 * `transform: none`. Nothing set state on those spans, because they are plain
 * spans rather than `Reveal` elements.
 *
 * Measured consequence: the homepage hero rendered a real 92px h1 whose words
 * sat at translateY(90.79px) inside a mask 99px tall. Only the top ~10% of
 * each line was inside the clip, so the hero headline — the single most
 * important text on the site — was visually an empty purple field. Every
 * word-masked heading in the site was affected the same way.
 *
 * So the words must join the same reveal lifecycle as everything else. This
 * hook IS that lifecycle, extracted so `Reveal` and `RevealWords` cannot drift
 * apart again. It returns true once the element has entered (or was already
 * inside) the viewport; the caller expresses that as a state ATTRIBUTE the
 * stylesheet can key on.
 */
export function useRevealedOnVisible(
  ref: React.RefObject<HTMLElement | null>,
): boolean {
  return useSyncExternalStore(
    useCallback(
      (onStoreChange: () => void) => {
        const element = ref.current;
        if (!element) return () => {};

        // Motion layer never activated (reduced motion, or MotionRoot has not
        // yet run): stay shown. Same belt-and-braces guard as `Reveal`.
        if (document.documentElement.getAttribute("data-motion") !== "on") {
          markRevealed(element, onStoreChange);
          return () => {};
        }

        // Already within the viewport on load: reveal without waiting for a
        // scroll, or a tall hero reads as a broken page.
        const rect = element.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
          markRevealed(element, onStoreChange);
          return () => {};
        }

        return subscribe(element, onStoreChange);
      },
      // `ref` is safe to list: a ref object is referentially stable for the
      // lifetime of the component, so including it can never cause a
      // re-subscribe. Declared rather than suppressed so the dependency is
      // stated, not argued away.
      [ref],
    ),
    () => isRevealed(ref.current),
    // Server render: never hidden.
    () => false,
  );
}

export interface RevealProps {
  children: ReactNode;
  /** Rendered element. Defaults to a div; use the right tag for the outline. */
  as?: ElementType;
  /** Entrance style. */
  variant?: RevealVariant;
  /** Duration band. */
  size?: RevealSize;
  /**
   * Delay in ms, for orchestrating a group of siblings. Kept as an explicit
   * number rather than a CSS variable so it can also be composed with the
   * transition-delay the stylesheet applies.
   */
  delay?: number;
  /** Promote to its own compositor layer. Opt-in only. */
  lift?: boolean;
  className?: string;
  id?: string;
}

export function Reveal({
  children,
  as: Tag = "div",
  variant = "rise",
  size = "md",
  delay = 0,
  lift = false,
  className = "",
  id,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  // The observer is an external store: it reports whether this element has
  // entered the viewport. `subscribe` is called from inside an effect by React,
  // and the setState happens in the observer's own callback — i.e. in response
  // to an external event, not synchronously in the effect body. That is the
  // distinction the react-hooks/set-state-in-effect rule is drawing, and it is
  // the correct shape here: a manual useEffect + setState would both trip the
  // rule and cause a real cascading render on every element on the page.
  const shown = useSyncExternalStore(
    useCallback(
      (onStoreChange: () => void) => {
        const element = ref.current;
        if (!element) return () => {};

        // If the motion layer never activated (reduced motion, or the root
        // effect has not run), stay shown. This is the belt-and-braces guard
        // that makes the content-invisible failure mode impossible.
        if (document.documentElement.getAttribute("data-motion") !== "on") {
          markRevealed(element, onStoreChange);
          return () => {};
        }

        // Already within the viewport on load: reveal without waiting for a
        // scroll. Otherwise a tall hero would sit hidden until the first pixel
        // of movement, which reads as a broken page.
        const rect = element.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
          markRevealed(element, onStoreChange);
          return () => {};
        }

        return subscribe(element, onStoreChange);
      },
      [],
    ),
    () => isRevealed(ref.current),
    // Server render: never hidden. The hidden state is applied by CSS only
    // after MotionRoot has confirmed the observer layer is live, so the
    // server-rendered markup is the complete, visible document.
    () => false,
  );

  return (
    <Tag
      ref={ref}
      id={id}
      data-reveal={shown ? "shown" : "hidden"}
      data-variant={variant}
      style={{
        // Custom properties rather than inline transitions: the stylesheet owns
        // the timing and the reduced-motion override, so a single rule can
        // neutralise every reveal at once.
        "--reveal-duration": durations[size],
        "--reveal-delay": `${delay}ms`,
        "--reveal-from": from[variant],
        ...(lift ? { willChange: "transform, opacity" } : {}),
      } as React.CSSProperties}
      className={className}
    >
      {children}
    </Tag>
  );
}

/**
 * Reveal a group of children with an automatic stagger.
 *
 * The stagger is bounded on purpose. Beyond roughly 6 items an increasing
 * delay means the last item waits long enough that the group stops feeling
 * choreographed and starts feeling queued, and the whole group finishes later
 * than it needs to.
 */
export function RevealGroup({
  children,
  step = 70,
  max = 6,
  variant = "rise",
  size = "md",
  className = "",
  itemClassName = "",
  as: Tag = "div",
  itemAs: ItemTag = "div",
}: {
  children: ReactNode[];
  step?: number;
  max?: number;
  variant?: RevealVariant;
  size?: RevealSize;
  className?: string;
  itemClassName?: string;
  as?: ElementType;
  itemAs?: ElementType;
}) {
  return (
    <Tag className={className}>
      {children.map((child, index) => (
        <Reveal
          key={index}
          as={ItemTag}
          variant={variant}
          size={size}
          delay={index < max ? index * step : 0}
          className={itemClassName}
        >
          {child}
        </Reveal>
      ))}
    </Tag>
  );
}
