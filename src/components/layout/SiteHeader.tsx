"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import { TrilliumLogo } from "@/components/brand/Marks";
import { ScrollProgress } from "@/components/motion/Magnetic";
import { primaryNav, admissionNav } from "@/content/navigation";
import { school } from "@/content/school";

/**
 * Site header.
 *
 * THREE STATES
 *
 * 1. `overlay` — over the homepage hero only, at the top of the page. The bar
 *    is transparent, so the dark hero shows through behind it and the links are
 *    cream. This is what lets the hero read as a full-bleed opening rather than
 *    as content sitting underneath a navigation strip.
 *
 *    The bar is `sticky`, so it occupies real layout height. `Hero` therefore
 *    carries `-mt-20` to slide up under the bar and `pt-20` to give its content
 *    the same clearance back. Without that the hero began below the bar, an81px
 *    band of cream body showed through this transparent state, and cream links
 *    sat cream-on-cream at 1.00:1 — invisible at first paint until 24px of
 *    scroll. Any change to the bar's height must change those two values
 *    together.
 * 2. `solid` — everywhere else, and on the homepage once scrolled. Cream,
 *    translucent, blurred, hairline border.
 * 3. `open` — the mobile drawer: a full-height panel with a scrim.
 *
 * Only the homepage has a dark hero, so only the homepage can overlay. On every
 * other route the first thing under the bar is a light page hero, and an
 * overlay header there would be unreadable — so the state derives from BOTH the
 * route and the scroll position, not from scroll position alone.
 *
 * PERFORMANCE
 * Scroll is tracked by a passive listener coalesced into one
 * requestAnimationFrame, writing a single boolean that is only re-set when it
 * actually flips. After the first 24px, scrolling a full page costs nothing.
 *
 * ACCESSIBILITY CONTRACT (carried over from the version that passed its audit):
 * - The toggle is a real <button> with aria-expanded / aria-controls.
 * - Escape closes the drawer; focus returns to the toggle on close.
 * - Tab is trapped inside the drawer while it is open.
 * - Background scroll is locked while open and restored on close.
 * - Focus moves into the drawer only when it is actually rendered.
 */
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const panelId = useId();
  // Separate id for the drawer's accessible name. Not derived from panelId by
  // concatenation, so the two cannot collide if useId's format ever changes.
  const panelLabelId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on route change, compared during render rather than in an effect, to
  // avoid the cascading-render warning React raises for synchronous setState
  // inside an effect body.
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    if (open) setOpen(false);
  }

  const isHome = pathname === "/";
  const overlay = isHome && !scrolled && !open;

  /* -- Scroll tracking: one rAF, one boolean flip ---------------------- */
  useEffect(() => {
    // Only the homepage has a dark hero to overlay, so only the homepage needs
    // to know where the scroll position is. On every other route `scrolled` is
    // irrelevant — `overlay` is already false because of the route check — so
    // the listener is not attached at all rather than being attached and then
    // having its state reset.
    if (!isHome) return;

    let frame = 0;
    let current = window.scrollY > 24;

    const evaluate = () => {
      frame = 0;
      const next = window.scrollY > 24;
      if (next !== current) {
        current = next;
        setScrolled(next);
      }
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(evaluate);
    };

    evaluate();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [isHome]);

  // Drawer: Escape, focus trap, scroll lock, focus return.
  useEffect(() => {
    if (!open) return;

    const previouslyFocused =
      document.activeElement instanceof HTMLElement &&
      document.activeElement !== document.body
        ? document.activeElement
        : toggleRef.current;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Only move focus if the panel is actually rendered. At desktop widths the
    // drawer is display:none, and focusing into it would hide the focus ring.
    const panel = panelRef.current;
    if (panel && panel.offsetParent !== null) {
      panel.querySelector<HTMLElement>("a[href]")?.focus();
    }

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header
        className={[
          "sticky top-0 z-50 transition-[background-color,border-color] duration-[var(--dur-slow)] ease-[var(--ease-out-soft)] motion-reduce:transition-none",
          overlay
            ? "border-b border-transparent bg-transparent"
            : "border-b border-ink-900/10 bg-cream-50/85 backdrop-blur-xl",
        ].join(" ")}
      >
        <div className="container-page">
          <div
            className={[
              "flex items-center justify-between gap-3 transition-[height] duration-[var(--dur-slow)] ease-[var(--ease-out-soft)] 2xl:gap-4 motion-reduce:transition-none",
              // Slightly taller in overlay state, which reads as the header
              // settling down onto the page once scrolling begins.
              overlay ? "h-20" : "h-18",
            ].join(" ")}
          >
            <Link
              href="/"
              className="group flex shrink-0 items-center"
              aria-label={`${school.name} — home`}
            >
              {/*
                THE LOGO IS ITS OWN WORDMARK NOW.

                The previous mark was a bare 1.776:1 crest with no lettering, so
                a two-line text lockup ("Trillium / International School") sat
                beside it to make the school name legible. The supplied logo is a
                1.7034:1 LOCKUP that already carries the school name curved
                around its seal, so keeping that text would print the same name
                twice in the bar — at a size, no less, chosen to compensate for
                lettering the mark now supplies itself.

                The mark therefore takes the full lockup width and the text stack
                is gone. `sr-only` keeps the accessible name exact: a screen
                reader still hears "Trillium International School System" rather
                than "crest".

                NO MOUNT. There is no background plate here. The supplied JPEG had
                a real black matte baked into it (27% of the frame, measured, one
                border-connected region); that matte was removed at the asset level
                and verified, so the artwork is genuinely transparent and needs no
                box behind it. See Marks.tsx for the measurement and the proof
                that no opaque pixel was altered.

                Removing the text stack also returns the width it occupied to the
                nav row, which is where the Contact/Admissions overlap documented
                below originally came from. */}
              <span
                className={[
                  "flex shrink-0 items-center transition-[height] duration-[var(--dur-slow)] ease-[var(--ease-out-soft)] motion-reduce:transition-none",
                  overlay ? "h-12" : "h-11",
                ].join(" ")}
              >
                <TrilliumLogo
                  className={[
                    "w-auto transition-[height] duration-[var(--dur-slow)] ease-[var(--ease-out-soft)] motion-reduce:transition-none",
                    overlay ? "h-9" : "h-8",
                  ].join(" ")}
                  priority
                  sizes="(max-width: 640px) 108px, 122px"
                />
              </span>
              <span className="sr-only">{school.name}</span>
            </Link>

            {/* ---------------------------------------------------------------
                WHY THIS BAR IS BUILT THE WAY IT IS

                Defect this replaces (measured, not assumed): at every viewport
                from 1280px upward the last nav item overlapped the Admissions
                CTA by 11px, and the CTA's left edge was unclickable.

                  1440px: Contact 1111..1176  Admissions 1165..1304  overlap 11px
                  1366px: Contact 1074..1139  Admissions 1128..1267  overlap 11px
                  1280px: Contact 1031..1096  Admissions 1085..1224  overlap 11px

                Three things combined to cause it:

                1. `min-w-0` on this nav let flex shrink the nav box *below* its
                   content width. The <ul> inside is nowrap, so it could not
                   shrink to match and simply overflowed the box it was given.
                2. The nav box was handed 770px (measured) while its content
                   needed 793px — a 23px deficit, identical at every width above
                   1280px because `--container-page` caps the column at 1248px.
                3. Each nav link is `position: relative` (it anchors the active
                   underline). Positioned boxes paint above static ones, so the
                   overflowing Contact link covered the CTA and won the hit
                   test. `elementFromPoint` over the CTA's left edge returned
                   Contact, not Admissions — which is exactly what the owner
                   reported as "Admissions hidden behind News and Contact".

                The fix is to make the row genuinely fit, so there is no overlap
                to defend against:

                - The link padding drops from px-2 to px-1.5 across the eleven
                  items, recovering 44px against a 23px deficit. Measured slack
                  after the change is 21px at 1280px, and the container is the
                  same 1168px at 1920px, so the bar fits at every width.
                - `min-w-0` is REMOVED. It was what permitted the silent
                  overflow. Without it the nav cannot be compressed under its
                  content, so any future label change surfaces as an obvious
                  layout break instead of an invisible click trap.
                - Labels are untouched: 13px at the xl band, 14px at 2xl, with
                  a 44px-tall min-h-11 target. Nothing was shrunk to make room.

                The compact `shortLabel`s already exist for exactly this band, so
                the full labels stay readable on desktop rather than being
                abbreviated into illegibility.
                ---------------------------------------------------------------- */}
            <nav aria-label="Primary" className="hidden xl:block">
              {/* gap-0.5 at the xl band, opening to gap-1 at 2xl. */}
              <ul className="flex items-center gap-0.5 2xl:gap-1">
                {primaryNav
                  .filter((item) => item.href !== "/")
                  .map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={isActive(item.href) ? "page" : undefined}
                        className="group relative inline-flex min-h-11 items-center whitespace-nowrap px-1.5 text-[0.8125rem] font-medium 2xl:px-3 2xl:text-[0.875rem]"
                      >
                        <span
                          className={[
                            "transition-colors duration-[var(--dur-fast)]",
                            isActive(item.href)
                              ? overlay
                                ? "text-cream-50"
                                : "text-ink-800"
                              : overlay
                                ? "text-cream-200/80 group-hover:text-cream-50"
                                : "text-warm-600 group-hover:text-ink-800",
                          ].join(" ")}
                        >
                          <span aria-hidden="true">{item.shortLabel ?? item.label}</span>
                          <span className="sr-only">{item.label}</span>
                        </span>
                        {/*
                          Active-section indicator: a rule that grows from the
                          centre under the active item only, so the bar has one
                          point of orientation rather than several competing
                          underlines.
                        */}
                        <span
                          aria-hidden="true"
                          className={[
                            "absolute inset-x-2.5 bottom-2 h-px origin-center transition-transform duration-[var(--dur-base)] ease-[var(--ease-out-soft)] motion-reduce:transition-none",
                            isActive(item.href) ? "scale-x-100" : "scale-x-0",
                            overlay ? "bg-gold-400" : "bg-gold-600",
                          ].join(" ")}
                        />
                      </Link>
                    </li>
                  ))}
              </ul>
            </nav>

            {/* The CTA and the toggle share a wrapper that is allowed to keep
                its intrinsic width. Without `shrink-0` this group could be
                squeezed by the nav, which is how the CTA came to sit under a
                neighbouring link in the first place. */}
            <div className="flex shrink-0 items-center gap-2">
              <Link
                href={admissionNav.href}
                className={[
                  "group hidden min-h-11 items-center gap-2 rounded-[3px] px-5 text-[0.875rem] font-medium transition-all duration-[var(--dur-base)] ease-[var(--ease-out-soft)] sm:inline-flex motion-reduce:transition-none",
                  overlay
                    ? "bg-cream-50 text-ink-900 hover:bg-cream-100"
                    : "bg-ink-800 text-cream-50 hover:bg-ink-700",
                ].join(" ")}
              >
                {admissionNav.label}
                <ArrowRight
                  className="size-3.5 transition-transform duration-[var(--dur-base)] group-hover:translate-x-0.5 motion-reduce:transition-none"
                  aria-hidden="true"
                />
              </Link>

              <button
                ref={toggleRef}
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls={panelId}
                /* xl:hidden, matching the `xl:block` on the primary nav exactly.

                   This was `lg:hidden`, which left the whole 1024-1279px band
                   with NO way to reach eleven destinations: the nav was hidden
                   because it was below xl, and the toggle was hidden because it
                   was at or above lg. Measured before the fix:

                     1279px  nav hidden   toggle HIDDEN   -> only the CTA
                     1200px  nav hidden   toggle HIDDEN   -> only the CTA
                     1024px  nav hidden   toggle HIDDEN   -> only the CTA

                   So on a 1024x768 laptop — a width the brief explicitly asks
                   to verify — every page except Admissions was unreachable. The
                   two breakpoints must be complements of each other: whenever
                   the bar is not shown, the drawer must be. */
                className={[
                  "inline-flex size-11 items-center justify-center rounded-[3px] border transition-colors duration-[var(--dur-fast)] xl:hidden",
                  overlay
                    ? "border-cream-100/30 text-cream-50 hover:bg-cream-100/10"
                    : "border-ink-900/15 text-ink-800 hover:bg-ink-800/5",
                ].join(" ")}
              >
                <span className="sr-only">
                  {open ? "Close main menu" : "Open main menu"}
                </span>
                {open ? (
                  <X className="size-5" aria-hidden="true" />
                ) : (
                  <Menu className="size-5" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/*
          Reading-progress hairline, sitting on the bar's bottom border.

          It is driven by `animation-timeline: scroll(root block)`, so the
          compositor scales it in step with the document scroll. There is no
          scroll listener, no state and no re-render — which matters because the
          header already runs one scroll listener of its own for `scrolled`, and
          a second one purely to drive a 2px line would not be a good trade.

          `aria-hidden`: how far through the page you are is something the
          visitor already knows. Announcing it would be noise.

          Under reduced motion the stylesheet removes it entirely rather than
          freezing it, because a progress indicator is a continuous-motion
          affordance and a static one communicates nothing.
        */}
        <ScrollProgress />
      </header>

      {/* -- Mobile drawer -------------------------------------------------
          A fixed overlay rather than a disclosure hanging off the bar: a
          full-height panel with a scrim reads as a considered mobile menu, and
          the links can be set large enough to be comfortable one-handed.

          The scrim is a SIBLING of the element carrying panelRef, not a
          descendant. That is load-bearing: the focus-trap query selects
          `button:not([disabled])`, so a scrim button inside the trapped element
          would become the first tab stop, and Shift+Tab would bounce off an
          invisible backdrop instead of reaching the last real link. */}
      <div hidden={!open} className="fixed inset-0 z-70 xl:hidden">
        <button
          type="button"
          tabIndex={-1}
          aria-hidden="true"
          onClick={() => setOpen(false)}
          className="absolute inset-0 h-full w-full cursor-default bg-ink-950/45 backdrop-blur-sm"
        />

        <div
          id={panelId}
          ref={panelRef}
          /*
           * Dialog semantics, and they are load-bearing rather than
           * decorative. This panel does three things that together make it
           * modal: it locks background scroll, it traps Tab, and it closes on
           * Escape. A screen-reader user needs to be told that, or they have no
           * way to know the page behind is inert. `aria-modal="true"` plus a
           * real accessible name is what supplies that, and without a label a
           * dialog is announced only as "dialog".
           *
           * The name comes from the visible "Menu" word already in the header
           * row below, wired up with aria-labelledby rather than duplicated as
           * an aria-label string that could drift out of sync.
           */
          role="dialog"
          aria-modal="true"
          aria-labelledby={panelLabelId}
          className="absolute inset-y-0 right-0 flex w-[min(23rem,88vw)] flex-col bg-cream-50 shadow-[-20px_0_60px_-20px_rgba(0,0,0,0.4)]"
          style={{ animation: "drawer-in var(--dur-slow) var(--ease-out-soft) both" }}
        >
          <div className="flex items-center justify-between border-b border-ink-900/10 px-5 py-3">
            <span
              id={panelLabelId}
              className="text-[0.6875rem] font-semibold tracking-[0.18em] text-warm-500 uppercase"
            >
              Menu
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex size-11 items-center justify-center rounded-[3px] border border-ink-900/15 text-ink-800 transition-colors hover:bg-ink-800/5"
            >
              <X className="size-5" aria-hidden="true" />
              <span className="sr-only">Close main menu</span>
            </button>
          </div>

          <nav
            aria-label="Mobile"
            className="flex-1 overflow-y-auto overscroll-contain px-5 py-2"
          >
            <ul className="flex flex-col">
              {primaryNav.map((item, index) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className="group flex min-h-14 items-center justify-between gap-3 border-b border-ink-900/8"
                    style={{
                      // Staggered entrance, capped so the last item is not
                      // waiting half a second to appear.
                      animation: "drawer-item-in var(--dur-slow) var(--ease-out-soft) both",
                      animationDelay: `${Math.min(index, 7) * 45}ms`,
                    }}
                  >
                    <span
                      className={[
                        "text-[1.0625rem] font-medium transition-colors",
                        isActive(item.href) ? "text-ink-800" : "text-warm-700",
                      ].join(" ")}
                    >
                      {item.label}
                    </span>
                    <ArrowRight
                      className={[
                        "size-4 shrink-0 transition-transform duration-[var(--dur-base)] group-hover:translate-x-1 motion-reduce:transition-none",
                        isActive(item.href) ? "text-gold-600" : "text-warm-500/50",
                      ].join(" ")}
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="border-t border-ink-900/10 p-5">
            <Link
              href={admissionNav.href}
              className="flex min-h-13 w-full items-center justify-center gap-2 rounded-[3px] bg-ink-800 px-5 font-medium text-cream-50 transition-colors hover:bg-ink-700"
            >
              {admissionNav.label}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
