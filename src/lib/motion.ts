"use client";

import { useSyncExternalStore } from "react";

/**
 * Reduced-motion preference, shared across the site.
 *
 * WHY THIS IS A HOOK AND NOT ONLY CSS
 * `prefers-reduced-motion` is honoured globally in globals.css, which correctly
 * neutralises CSS transitions and animations. But several components here do
 * REAL work on scroll — transforming a sticky panel from one state to another,
 * writing a parallax offset. That work is not a CSS transition, so it needs the
 * preference in JavaScript too. Otherwise a visitor who has asked for reduced
 * motion still gets a pinned, scrubbed panel.
 *
 * WHY useSyncExternalStore
 * A media query is a genuine external store: it changes outside React and has
 * to be subscribed to. `useSyncExternalStore` is the API built for exactly
 * that. It avoids the setState-inside-an-effect pattern — which would cause a
 * cascading second render on every page — and it means the first client render
 * already carries the correct value instead of a default that has to be
 * corrected a frame later.
 *
 * The server snapshot is `false`. That is deliberate: with no preference
 * readable there is no reason to suppress motion, so the enhanced path is taken,
 * and the CSS media query neutralises it if the user does have the preference
 * set. Because both layers resolve the same outcome, hydration cannot produce a
 * visible mismatch.
 */

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void): () => void {
  if (typeof window === "undefined" || !window.matchMedia) return () => {};
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function getSnapshot(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia(QUERY).matches;
}

/** Server snapshot. Must return a stable primitive, not a fresh object. */
function getServerSnapshot(): boolean {
  return false;
}

export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** True only when the user has NOT asked for reduced motion. */
export function useMotionAllowed(): boolean {
  return !useReducedMotion();
}
