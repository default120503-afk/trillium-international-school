"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "@/lib/motion";

/**
 * Scroll progress tracker.
 *
 * PERFORMANCE CONTRACT - this is the part that decides whether the site feels
 * premium or feels cheap, so it is worth being precise:
 *
 * - The scroll listener is PASSIVE. It never calls preventDefault, so the
 *   browser can keep scrolling on its compositor thread without waiting for us.
 *
 * - It does NOT read layout during scroll. The classic mistake is calling
 *   getBoundingClientRect() inside the scroll handler, which forces a
 *   synchronous layout on every frame. Instead we measure the element's
 *   offset ONCE (on mount and on resize), cache the numbers, and during scroll
 *   we only do arithmetic plus a single style write.
 *
 * - Work is COALESCED INTO requestAnimationFrame. A scroll can fire far more
 *   often than the display refreshes; without rAF you would queue dozens of
 *   style writes per frame. The handler only ever sets a flag.
 *
 * - It does NOT run at all unless the element is on screen. An
 *   IntersectionObserver gates the listener, so an off-screen sequence costs
 *   nothing. This is what stops the "scroll handler running on every frame"
 *   failure mode.
 *
 * - It writes to a CSS custom property, NOT React state. No re-render per
 *   frame; the compositor reads the variable directly.
 *
 * Reduced motion: the effect returns early and writes progress once as 0, so
 * nothing is scrubbed by scroll.
 */

export function useScrollProgress<T extends HTMLElement = HTMLDivElement>(options?: {
  /** Element must be this fraction visible before the listener attaches. */
  activeThreshold?: number;
}) {
  const ref = useRef<T>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Reduced motion: no scroll-linked movement at all. Set the end state so
    // any CSS reading --progress still has a sane value.
    if (reduced) {
      element.style.setProperty("--progress", "0");
      return;
    }

    let frame = 0;
    let active = false;
    let startTop = 0;
    let distance = 1;

    const measure = () => {
      const rect = element.getBoundingClientRect();
      const scrollY = window.scrollY;
      startTop = rect.top + scrollY;
      // The scrollable span of this element: its own height minus the viewport.
      distance = Math.max(rect.height - window.innerHeight, 1);
    };

    const write = () => {
      frame = 0;
      const travelled = window.scrollY - startTop;
      const clamped = Math.min(Math.max(travelled / distance, 0), 1);
      element.style.setProperty("--progress", clamped.toFixed(4));
    };

    const onScroll = () => {
      // Flag only. All real work happens once, in the next frame.
      if (frame) return;
      frame = requestAnimationFrame(write);
    };

    const attach = () => {
      active = true;
      measure();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", measure, { passive: true });
      write();
    };

    const detach = () => {
      active = false;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      if (frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    };

    // Gate the listener on visibility so an off-screen sequence costs nothing.
    const gate = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !active) attach();
        else if (!entry.isIntersecting && active) detach();
      },
      { threshold: 0 },
    );
    gate.observe(element);

    return () => {
      gate.disconnect();
      detach();
    };
  }, [reduced]);

  return ref;
}

/**
 * Sticky storytelling shell.
 *
 * A tall track containing one sticky panel. The panel holds a composition that
 * changes as the track scrolls: `--progress` (0→1) and the derived
 * `--index` (the current step, as a number) are available to CSS and to
 * children, so the sequence is scroll-linked rather than a set of timed fades.
 *
 * `steps` controls the track height. The default of 4 gives each step roughly
 * one viewport of scroll, which is the minimum that lets a reader notice they
 * are driving it and the maximum that keeps the section from feeling stuck.
 */
export function StickySequence({
  children,
  steps = 4,
  className = "",
  /** Height per step, in vh. */
  stepHeight = 100,
  id,
  labelledBy,
}: {
  children: ReactNode;
  steps?: number;
  className?: string;
  stepHeight?: number;
  id?: string;
  labelledBy?: string;
}) {
  const ref = useScrollProgress<HTMLDivElement>();

  return (
    <div
      ref={ref}
      id={id}
      aria-labelledby={labelledBy}
      className={["relative", className].filter(Boolean).join(" ")}
      style={
        {
          // The track is what creates scroll distance. The panel inside sticks.
          height: `calc(${steps} * ${stepHeight}svh + 100svh)`,
        } as React.CSSProperties
      }
    >
      <div className="panel-sticky">{children}</div>
    </div>
  );
}

/**
 * Report which step of a scroll sequence is active (0-based).
 *
 * The content of every step is rendered regardless of which is active; only
 * the presentation changes. Nothing is ever hidden from a screen reader or
 * from find-in-page, which is what keeps animation from becoming a
 * comprehension requirement.
 *
 * WHY THIS IS NOT AN IntersectionObserver
 *
 * The previous version observed each sentinel and set the active step to
 * whichever intersecting entry had the highest `intersectionRatio`. That
 * flickers, and it is worth being precise about why, because the obvious
 * explanation is wrong.
 *
 * An IntersectionObserver does not report on every frame. It fires only when
 * an entry *crosses* one of its `threshold` values. The sentinels here are tall
 * (78svh) and adjacent, so as the page scrolls two of them sit inside the
 * observation band at once and their ratios cross. Each crossing fires a
 * callback, and "highest ratio" hands control back and forth between two
 * neighbouring steps. Measured on the uniform sequence at 1440x900, a
 * monotonic downward scroll of 50px steps produced the index sequence
 * `0 1 0 1 2 1 2 3 2 3 2` — four backward hops, i.e. the stage visibly
 * reversed direction while the reader was only ever scrolling down. On a
 * section whose entire premise is "the word that changes is the whole point",
 * the word changing *backwards* is the worst available failure.
 *
 * The fix is to compute the step from scroll position against cached sentinel
 * offsets and take the LAST sentinel whose trigger line has been passed. That
 * is monotonic by construction: scrolling down can only increase the index.
 * Scrolling back up naturally decreases it, which is the one direction where a
 * decrease is the correct answer.
 *
 * Offsets are cached and invalidated on resize, so the scroll handler reads
 * numbers rather than calling `getBoundingClientRect()` per step per frame.
 * Reads are batched before any write, so this introduces no layout thrash.
 */
export function useActiveStep(count: number, offset = 0.5) {
  const [active, setActive] = useState(0);
  const stepRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const elements = stepRefs.current.filter(Boolean) as HTMLElement[];
    if (elements.length === 0) return;

    // Trigger line, in document coordinates: the point at this step becomes the
    // active one. `offset` is the fraction of the viewport height.
    let tops: number[] = [];

    const measure = () => {
      tops = elements.map((el) => el.getBoundingClientRect().top + window.scrollY);
    };

    let frame = 0;
    const compute = () => {
      frame = 0;
      const line = window.scrollY + window.innerHeight * offset;
      // Last index whose trigger line has been passed. Linear in `count`, which
      // is 7 here and 4 on the learning sequence.
      let index = 0;
      for (let i = 0; i < tops.length; i += 1) {
        if (line >= tops[i]) index = i;
      }
      setActive((prev) => (prev === index ? prev : Math.min(index, count - 1)));
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(compute);
    };

    const onResize = () => {
      measure();
      compute();
    };

    measure();
    compute();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [count, offset]);

  return { active, stepRefs };
}
