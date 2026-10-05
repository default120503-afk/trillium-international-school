import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

/**
 * Buttons and button-links.
 *
 * The site's button weights. Deliberately only FOUR — an over-populated button
 * palette is the main reason a layout stops reading as designed.
 *
 * HOVER CHOREOGRAPHY
 * Every button moves on hover, but the movement is small, directional, and the
 * same everywhere:
 *  - the label shifts 2px toward the arrow, so the pair reads as one object
 *    travelling rather than two elements moving independently;
 *  - the accent variant gains a gold sheen, painted only while hovered;
 *  - the surface lifts on shadow, which is enough to feel physical and not
 *    enough to detach from the page.
 *
 * There is no bounce, no scale and no wobble. On an education site those read
 * as playful rather than composed.
 *
 * ACCESSIBILITY
 * - `:focus-visible` styling is global (globals.css) and is a two-tone ring,
 *    because a single-tone ring failed WCAG 1.4.11 against cream.
 * - `active:translate-y-px` gives a pressed state for pointer AND keyboard.
 * - Transitions touch only transform / background / border / shadow, so no
 *    hover causes a reflow.
 */
type Variant = "primary" | "secondary" | "quiet" | "accent";
type Size = "md" | "lg";

const base =
  "group/btn relative inline-flex items-center justify-center gap-2 font-medium tracking-tight " +
  "transition-[background-color,color,border-color,box-shadow,transform] duration-[var(--dur-base)] " +
  "ease-[var(--ease-out-soft)] active:translate-y-px " +
  "disabled:pointer-events-none disabled:opacity-55 motion-reduce:transition-none motion-reduce:active:translate-y-0";

const variants: Record<Variant, string> = {
  // Solid ink: the one high-emphasis action on a page.
  primary:
    "bg-ink-800 text-cream-50 border border-ink-800 shadow-[var(--shadow-lift)] hover:bg-ink-700 hover:border-ink-700 hover:shadow-[var(--shadow-raise)]",
  // Outlined: sits beside a primary without competing.
  secondary:
    "border border-ink-800/25 text-ink-800 hover:border-ink-800/55 hover:bg-ink-800/[0.04]",
  // For use on dark backgrounds.
  quiet:
    "border border-cream-100/35 text-cream-100 hover:border-cream-100/70 hover:bg-cream-100/10",
  // Gold CTA on a dark section. Declared as its own variant rather than as a
  // className override: two competing utility classes of equal specificity do
  // not resolve in class-attribute order under Tailwind v4, so an override
  // silently loses and produces dark text on a dark fill.
  accent:
    "border border-transparent bg-gold-500 text-ink-950 shadow-[var(--shadow-lift)] hover:bg-gold-400 hover:shadow-[var(--shadow-raise)]",
};

const sizes: Record<Size, string> = {
  md: "min-h-11 px-5 py-2.5 text-[0.9375rem]",
  lg: "min-h-12 px-7 py-3 text-base",
};

function classes(variant: Variant, size: Size, className?: string) {
  return [base, variants[variant], sizes[size], className].filter(Boolean).join(" ");
}

/**
 * Sheen for the accent variant.
 *
 * A linear gradient sized 200% wide, revealed on hover. Applied only to the
 * accent variant, and only where the device actually has a hover pointer — on
 * touch there is no hover state, so the element would be pure paint cost for
 * an effect nobody sees.
 */
function Sheen() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 hidden rounded-[inherit] opacity-0 transition-opacity duration-[var(--dur-base)] group-hover/btn:opacity-100 group-focus-visible/btn:opacity-100 [@media(hover:hover)]:block"
      style={{
        backgroundImage:
          "linear-gradient(100deg, transparent 20%, rgb(255 255 255 / 0.4) 50%, transparent 80%)",
        backgroundSize: "200% 100%",
        backgroundPosition: "100% 0",
      }}
    />
  );
}

/** The travelling label. The arrow and the text move as one unit. */
function Label({ children }: { children: ReactNode }) {
  return (
    <span className="relative inline-flex items-center gap-2 transition-transform duration-[var(--dur-base)] ease-[var(--ease-out-soft)] group-hover/btn:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover/btn:translate-x-0">
      {children}
    </span>
  );
}

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: CommonProps & { href: string } & Omit<ComponentProps<typeof Link>, "href" | "className">) {
  // tel:/mailto: are external to the router and must render as a plain anchor,
  // or Next's Link would try to client-navigate to them.
  const isExternal = /^(https?:|tel:|mailto:)/.test(href);

  if (isExternal) {
    return (
      <a
        href={href}
        className={classes(variant, size, className)}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
        {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {variant === "accent" ? <Sheen /> : null}
        <Label>{children}</Label>
        {href.startsWith("tel:") ? (
          <span className="sr-only">(opens your phone dialler)</span>
        ) : null}
      </a>
    );
  }

  return (
    <Link href={href} className={classes(variant, size, className)} {...rest}>
      {variant === "accent" ? <Sheen /> : null}
      <Label>{children}</Label>
    </Link>
  );
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: CommonProps & Omit<ComponentProps<"button">, "className">) {
  return (
    <button className={classes(variant, size, className)} {...rest}>
      {variant === "accent" ? <Sheen /> : null}
      <Label>{children}</Label>
    </button>
  );
}
