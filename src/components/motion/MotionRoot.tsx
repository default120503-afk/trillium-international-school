"use client";

import { useEffect } from "react";

/**
 * Motion readiness flag.
 *
 * Reveal animations are implemented by hiding an element in CSS and revealing
 * it when an IntersectionObserver fires. That pattern has a failure mode: if
 * the observer never runs - no JavaScript, a blocked script, an old browser,
 * or a hydration error - the content stays hidden forever. That is the worst
 * possible outcome for a school website: content that exists but is invisible.
 *
 * So the hidden state is gated behind a `data-motion="on"` attribute on <html>
 * that this component sets only AFTER the observer layer has mounted. Every
 * reveal rule is written as:
 *
 *     html[data-motion="on"] [data-reveal] { opacity: 0; ... }
 *
 * Without that attribute the rules do not match and the content is simply
 * visible. Progressive enhancement in the correct direction: the enhanced
 * state is opt-in, never opt-out.
 *
 * Also removes the flag when the visitor prefers reduced motion, so the
 * reduced-motion path is a genuine "no hidden states" path rather than a
 * fast-fade that still depends on the observer.
 */
export function MotionRoot() {
  useEffect(() => {
    const root = document.documentElement;

    const prefersReduced = window.matchMedia
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

    if (prefersReduced) {
      root.removeAttribute("data-motion");
      return;
    }

    root.setAttribute("data-motion", "on");

    const mq = window.matchMedia
      ? window.matchMedia("(prefers-reduced-motion: reduce)")
      : null;
    const onChange = () => {
      if (mq?.matches) root.removeAttribute("data-motion");
      else root.setAttribute("data-motion", "on");
    };
    mq?.addEventListener("change", onChange);
    return () => mq?.removeEventListener("change", onChange);
  }, []);

  return null;
}
