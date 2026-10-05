"use client";

import { useCallback, useRef, type ReactNode } from "react";
import { useMotionAllowed } from "@/lib/motion";

/**
 * Magnetic CTA.
 *
 * THE EFFECT, RESTRAINED
 *
 * The button is pulled slightly toward the cursor while it is nearby, and
 * settles back when the cursor leaves. `strength` is a FRACTION of the
 * distance from the button's centre to the pointer, and the default is 0.22 —
 * the button closes about a fifth of the gap. That is deliberately small: at
 * the "follows the cursor exactly" setting this becomes a toy, and a primary
 * admissions link that slides away from the pointer is an accessibility
 * problem, not a flourish.
 *
 * WHY THE TRANSFORM IS A CUSTOM PROPERTY
 *
 * `globals.css` applies `translate3d(var(--mag-x), var(--mag-y), 0)` to
 * `[data-magnetic]`, so the pull and the button's own hover lift compose
 * instead of overwriting each other. Writing `style.transform` directly from
 * JavaScript would clobber any transform the stylesheet wants to apply.
 *
 * WHY THE EFFECT IS LARGELY JS-FREE
 *
 * Only the ACTIVE phase needs pointer tracking. The release is a CSS
 * transition: the wrapper drops `data-magnetic` and resets the properties to
 * 0, and the stylesheet animates them back to rest. No animation loop runs on
 * release, and none runs at rest.
 *
 * REDUCED MOTION
 *
 * `useMotionAllowed()` returns false and the component attaches no listeners at
 * all, so the button is never displaced. There is a second guard in CSS too:
 * under `prefers-reduced-motion: reduce` the transform is forced to `none`. The
 * JS guard means the common case does no work; the CSS guard means a preference
 * that flips mid-session cannot leave a button stranded off-centre.
 *
 * POINTER TYPE MATTERS
 *
 * Only `pointer: fine` devices get this. On touch, `pointermove` fires as a
 * finger drags, which would make a button slide around under the user's thumb
 * during a tap. The effect is pointer-gated so touch devices never see it.
 */
export function Magnetic({
  children,
  strength = 0.22,
  radius = 90,
  className = "",
}: {
  children: ReactNode;
  /** Fraction of the pointer offset to apply. 0 disables movement. */
  strength?: number;
  /** px beyond the button's bounds within which it starts to respond. */
  radius?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionAllowed = useMotionAllowed();

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLSpanElement>) => {
      const element = ref.current;
      if (!element || strength <= 0) return;

      const rect = element.getBoundingClientRect();
      const centreX = rect.left + rect.width / 2;
      const centreY = rect.top + rect.height / 2;

      const dx = event.clientX - centreX;
      const dy = event.clientY - centreY;

      // Outside the pull radius, snap back to rest. Cheap early-out, and it
      // stops a button at the far end of a wide row from creeping while the
      // cursor is nowhere near it.
      if (
        Math.abs(dx) > rect.width / 2 + radius ||
        Math.abs(dy) > rect.height / 2 + radius
      ) {
        element.removeAttribute("data-magnetic");
        element.style.setProperty("--mag-x", "0px");
        element.style.setProperty("--mag-y", "0px");
        return;
      }

      element.setAttribute("data-magnetic", "");
      element.style.setProperty("--mag-x", `${(dx * strength).toFixed(2)}px`);
      element.style.setProperty("--mag-y", `${(dy * strength).toFixed(2)}px`);
    },
    [strength, radius],
  );

  const reset = useCallback(() => {
    const element = ref.current;
    if (!element) return;
    // "released" selects the slower return curve in the stylesheet.
    element.setAttribute("data-magnetic", "released");
    element.style.setProperty("--mag-x", "0px");
    element.style.setProperty("--mag-y", "0px");
  }, []);

  // A keyboard user tabbing to the button, or a focus arriving some other way,
  // must not leave it displaced. This fires on focus ARRIVE, not on focus
  // leave: if the pointer had been hovering and had already pulled the button
  // toward the cursor, releasing on blur would leave a visible offset for as
  // long as the keyboard focus sat there.
  const release = useCallback(() => {
    const element = ref.current;
    if (!element) return;
    element.style.setProperty("--mag-x", "0px");
    element.style.setProperty("--mag-y", "0px");
  }, []);

  return (
    <span
      ref={ref}
      className={["inline-flex", className].filter(Boolean).join(" ")}
      onPointerMove={motionAllowed ? onPointerMove : undefined}
      onPointerLeave={motionAllowed ? reset : undefined}
      onFocus={motionAllowed ? release : undefined}
      onBlur={release}
    >
      {children}
    </span>
  );
}

/**
 * Reading-progress hairline.
 *
 * Bound to document scroll through `animation-timeline: scroll()`, so the bar
 * is driven by the compositor with no scroll listener, no React state and no
 * re-render on scroll. The earlier instinct — a `useState` progress value
 * updated in a scroll handler — would re-render on every scroll event on a long
 * page, which is precisely the cost this avoids.
 *
 * `aria-hidden` because it carries no information a screen-reader user needs:
 * it reports how far through the document you are, which is information you
 * already have. It is decoration, and it is announced as such.
 *
 * Under reduced motion the stylesheet hides it entirely rather than freezing
 * it, because a progress indicator is a continuous-motion affordance and there
 * is no static version of one that means anything.
 */
export function ScrollProgress() {
  return (
    <span aria-hidden="true" className="scroll-progress-bar" data-scroll-progress="" />
  );
}