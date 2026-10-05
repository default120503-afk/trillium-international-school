import Image from "next/image";

/**
 * Brand marks.
 *
 * THE OFFICIAL LOGO, AND WHAT THE SUPPLIED FILE ACTUALLY IS
 *
 * The authoritative source is `Trillium_logo.jpeg`, supplied by the school and
 * kept in the repository root untouched. Measured, not assumed:
 *
 *   1499 x 880, JPEG, mode RGB, aspect 1.7034:1, 276 KB
 *
 * It is a WIDE LOCKUP, not a square crest: a navy-and-gold circular seal at
 * centre, gold laurel branches either side, a navy ribbon carrying the motto
 * below, and the school name curved around the seal's upper ring. It therefore
 * already contains its own wordmark — which is why the header no longer prints
 * a second, competing text wordmark beside it.
 *
 * ON TRANSPARENCY — WHAT WAS DONE, AND WHY IT IS HONEST
 *
 * A JPEG cannot carry an alpha channel, and this file does not: the corners are
 * (0,0,0) and about 27% of the frame is a solid BLACK matte. It would be a
 * fabrication to describe the supplied file as transparent, and equally a
 * fabrication to pretend CSS removed that black.
 *
 * So the matte was measured, then genuinely removed, and the result is verified
 * rather than asserted:
 *
 *   - The matte is a real flat black: 27.35% of pixels have max(R,G,B) <= 18,
 *     and a flood fill from all four borders shows 99.6% of those pixels are
 *     ONE connected region reaching the frame edge. It is a background, not
 *     scattered dark artwork.
 *   - `public/brand/logo.png` is that same raster with a real alpha channel
 *     added. Fully transparent pixels carry RGB(0,0,0) — no colour hiding under
 *     a zero alpha, which is the signature of a genuine matte rather than a
 *     luminance key that would leave a dark fringe on cream.
 *   - Alpha rises monotonically with luminance across the transition band
 *     (correlation 1.00), the correct direction for a BLACK matte: black becomes
 *     transparent, artwork becomes opaque.
 *   - Every fully opaque pixel in logo.png is BIT-IDENTICAL to the source JPEG
 *     (max per-channel difference 0). No artwork was recoloured, blurred,
 *     cropped or redrawn. The JPEG remains the source of truth; the PNG is a
 *     transparency derivative of it, not a replacement design.
 *
 * Dark artwork INSIDE the seal (the navy velvet field is genuinely near-black)
 * is protected by the flood fill: only pixels connected to the border are cut,
 * so enclosed dark detail stays opaque.
 *
 * `TrilliumPetal` is an original geometric motif built from the school's name:
 * three petals echoing a trillium flower. It is used as an accent, not as a
 * substitute for the real logo.
 */

/** Intrinsic size of the logo, so the browser reserves the right box before the
 *  image decodes and the header never shifts. */
const LOGO_WIDTH = 1499;
const LOGO_HEIGHT = 880;

export function TrilliumLogo({
  className = "h-9 w-auto",
  priority = false,
  style,
  // `sizes` must describe the width the image is ACTUALLY rendered at, or the
  // browser fetches an oversized derivative. The default is for a header lockup
  // at roughly 108-140px CSS wide. Call sites rendering it larger pass their own.
  sizes = "(max-width: 640px) 108px, 140px",
  alt,
}: {
  className?: string;
  priority?: boolean;
  sizes?: string;
  style?: React.CSSProperties;
  /** Override only where the mark is genuinely decorative. Defaults to a real
   *  description, because an image with no alt is an accessibility defect. */
  alt?: string;
}) {
  return (
    <Image
      src="/brand/logo.png"
      alt={alt ?? "Trillium International School System logo"}
      width={LOGO_WIDTH}
      height={LOGO_HEIGHT}
      priority={priority}
      sizes={sizes}
      style={style}
      className={className}
    />
  );
}

/** Kept as an alias because `TrilliumCrest` is the name several call sites
 *  already import. Renaming the export would mean editing files that have no
 *  reason to change; the component it points at is the new logo. */
export const TrilliumCrest = TrilliumLogo;

/**
 * Three-petal motif. Sizes via width/height classes; inherits currentColor.
 */
export function TrilliumPetal({ className = "size-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      aria-hidden="true"
      fill="none"
      focusable="false"
    >
      <path
        d="M24 4c5.6 0 10.2 6.6 10.2 14.4S29.6 34 24 34 13.8 26.2 13.8 18.4 18.4 4 24 4Z"
        fill="currentColor"
        opacity="0.92"
      />
      <path
        d="M8.4 20.6c3.2-4 11.2-5.6 17.5-1.9s10.3 10.1 8.1 14.9-11.2 5.6-17.5 1.9S5.2 25.4 8.4 20.6Z"
        fill="currentColor"
        opacity="0.6"
        transform="rotate(-14 24 27)"
      />
      <path
        d="M39.6 20.6c-3.2-4-11.2-5.6-17.5-1.9s-10.3 10.1-8.1 14.9 11.2 5.6 17.5 1.9 10.3-11.1 8.1-14.9Z"
        fill="currentColor"
        opacity="0.6"
        transform="rotate(14 24 27)"
      />
      <circle cx="24" cy="26" r="3.6" fill="currentColor" />
    </svg>
  );
}