"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import {
  galleryCategories,
  galleryImages,
  photographyNotice,
  type GalleryCategory,
} from "@/content/gallery";

/**
 * Gallery + accessible lightbox.
 *
 * Accessibility contract:
 *  - Grid items are real <button>s, reachable and activatable by keyboard.
 *  - The lightbox is a modal dialog: role="dialog" aria-modal, labelled by its
 *    caption, focus moves in on open and returns to the trigger on close.
 *  - Escape closes; ArrowLeft / ArrowRight navigate; Tab is trapped inside.
 *  - A visible focus ring is applied by the global :focus-visible rule.
 *  - Touch targets are >= 44px.
 *
 * Provenance: every image here is a page of the school's own supplied
 * document. Nothing is stock photography. See src/content/gallery.ts.
 */
export function Gallery() {
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>(
    galleryCategories[0].id,
  );
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const visible = galleryImages.filter(
    (img) => img.category === activeCategory,
  );

  const close = useCallback(() => setOpenIndex(null), []);
  // With an empty category these modulo operations yield NaN, which silently
  // closed the dialog. Guard the length explicitly.
  const next = useCallback(
    () =>
      setOpenIndex((i) =>
        i === null || visible.length === 0 ? i : (i + 1) % visible.length,
      ),
    [visible.length],
  );
  const prev = useCallback(
    () =>
      setOpenIndex((i) =>
        i === null || visible.length === 0
          ? i
          : (i - 1 + visible.length) % visible.length,
      ),
    [visible.length],
  );

  // Modal behaviour: focus in, Escape, arrows, focus trap, scroll lock.
  useEffect(() => {
    if (openIndex === null) return;

    const previouslyFocused = triggerRef.current;
    // Focus the dialog once, on the transition from closed to open. This
    // effect also re-runs when the index changes, and focusing again there
    // would throw the user back to Close after every arrow keypress.
    if (closeButtonRef.current && document.activeElement !== closeButtonRef.current) {
      const insideDialog = closeButtonRef.current
        .closest("[role=dialog]")
        ?.contains(document.activeElement);
      if (!insideDialog) closeButtonRef.current.focus();
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        next();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        prev();
      } else if (event.key === "Tab" && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
    };
  }, [openIndex, close, next, prev]);

  const current = openIndex === null ? null : visible[openIndex];

  return (
    <div>
      {/* Category filter. Hidden while there is only one category - a filter
          with a single option is decoration, not a control. It appears
          automatically once the school adds a second category. */}
      {galleryCategories.length > 1 ? (
      <div
        role="group"
        aria-label="Filter gallery by category"
        className="flex flex-wrap gap-2"
      >
        {galleryCategories.map((category) => {
          const selected = activeCategory === category.id;
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => setActiveCategory(category.id)}
              aria-pressed={selected}
              className={[
                "min-h-11 rounded-[4px] border px-4 text-sm font-medium transition-colors",
                selected
                  ? "border-ink-800 bg-ink-800 text-cream-50"
                  : "border-ink-900/18 text-warm-600 hover:border-ink-900/40 hover:bg-ink-800/[0.04]",
              ].join(" ")}
            >
              {category.label}
            </button>
          );
        })}
      </div>
      ) : null}

      {/* Honest notice about the absence of photography. */}
      <div className="mt-8 rounded-[var(--radius-card)] border border-gold-600/28 bg-gold-300/15 p-6">
        <h2 className="text-xl text-ink-900">{photographyNotice.title}</h2>
        <p className="mt-2.5 max-w-3xl text-[0.9375rem] leading-relaxed text-warm-600">
          {photographyNotice.body}
        </p>
      </div>

      {/* Grid */}
      <ul className="mt-12 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
        {visible.map((image, index) => (
          <li key={image.id}>
            <button
              type="button"
              ref={(node) => {
                if (openIndex === index) triggerRef.current = node;
              }}
              onClick={() => setOpenIndex(index)}
              className="group relative block w-full overflow-hidden rounded-[var(--radius-frame)] border border-ink-900/12 bg-cream-100 transition-colors hover:border-gold-600/45"
            >
              <span className="relative block aspect-[3/4] w-full overflow-hidden">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 22vw"
                  className="object-contain transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:scale-[1.03]"
                />
              </span>
              <span className="sr-only">Open larger: {image.caption}</span>
            </button>
            <p className="mt-2.5 text-xs leading-relaxed text-warm-500">
              {image.caption}
            </p>
          </li>
        ))}
      </ul>

      {/* Lightbox */}
      {current ? (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-ink-950/95 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={current.caption}
            className="relative flex max-h-full w-full max-w-4xl flex-col"
          >
            <div className="flex items-start justify-between gap-4 pb-4">
              <div className="min-w-0">
                <p className="truncate font-display text-lg text-cream-50">
                  {current.caption}
                </p>
                <p className="mt-1 text-xs text-cream-300/60">
                  {current.provenance}
                </p>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={close}
                className="inline-flex size-11 shrink-0 items-center justify-center rounded-[4px] border border-cream-100/25 text-cream-100 transition-colors hover:bg-cream-100/10"
              >
                <X className="size-5" aria-hidden="true" />
                <span className="sr-only">Close image viewer</span>
              </button>
            </div>

            <div className="relative flex-1 overflow-hidden rounded-[var(--radius-frame)]">
              <Image
                key={current.id}
                src={current.fullSrc}
                alt={current.alt}
                width={current.width}
                height={current.height}
                className="mx-auto h-auto max-h-[65vh] w-auto object-contain"
              />
            </div>

            <div className="flex items-center justify-between gap-4 pt-4">
              <p className="text-sm text-cream-300/70">
                <span aria-live="polite" aria-atomic="true">
                  {(openIndex ?? 0) + 1} of {visible.length}
                </span>
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={prev}
                  className="inline-flex size-11 items-center justify-center rounded-[4px] border border-cream-100/25 text-cream-100 transition-colors hover:bg-cream-100/10"
                >
                  <ChevronLeft className="size-5" aria-hidden="true" />
                  <span className="sr-only">Previous image</span>
                </button>
                <button
                  type="button"
                  onClick={next}
                  className="inline-flex size-11 items-center justify-center rounded-[4px] border border-cream-100/25 text-cream-100 transition-colors hover:bg-cream-100/10"
                >
                  <ChevronRight className="size-5" aria-hidden="true" />
                  <span className="sr-only">Next image</span>
                </button>
              </div>
            </div>

            <p className="mt-3 text-center text-xs text-cream-300/50">
              Press Escape to close, or use the arrow keys to move between images.
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}