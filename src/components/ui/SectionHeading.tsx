import type { ReactNode } from "react";

interface SectionHeadingProps {
  /** Small label above the title. Sets the section's rhythm. */
  eyebrow?: string;
  title: string;
  /** Short editorial standfirst under the title. */
  lead?: string;
  /** Optional qualifier chip, e.g. "An educational aim of the school". */
  note?: string;
  align?: "left" | "center";
  /** Heading level for a correct document outline. */
  as?: "h1" | "h2" | "h3";
  /**
   * Id applied to the heading element. Required whenever the surrounding
   * <section> uses aria-labelledby - otherwise the reference dangles and the
   * section loses its accessible name.
   */
  id?: string;
  tone?: "light" | "dark";
  className?: string;
}

/**
 * One heading component for the whole site. Enforces a single type scale and
 * keeps the eyebrow / title / lead pattern consistent across every page, which
 * is most of what stops a multi-page site looking assembled.
 */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  note,
  align = "left",
  as: Tag = "h2",
  id,
  tone = "light",
  className = "",
}: SectionHeadingProps) {
  const centered = align === "center";
  return (
    <div
      className={[
        centered ? "mx-auto max-w-2xl text-center" : "max-w-2xl",
        className,
      ].join(" ")}
    >
      {eyebrow ? (
        <p
          className={[
            "mb-4 flex items-center gap-3 text-[0.6875rem] font-semibold uppercase tracking-[0.18em]",
            centered ? "justify-center" : "",
            tone === "dark" ? "text-gold-400" : "text-ink-700",
          ].join(" ")}
        >
          {!centered && (
            <span
              aria-hidden="true"
              className="inline-block h-px w-8 shrink-0 bg-current opacity-45"
            />
          )}
          {eyebrow}
        </p>
      ) : null}

      <Tag
        id={id}
        className={[
          // Type size must scale with heading LEVEL, not sit on one value for
          // every level. Sizing purely by level means an h3 nested inside a
          // section h2 is visually subordinate rather than the same size.
          Tag === "h1"
            ? "text-display-lg"
            : Tag === "h2"
              ? "text-display-sm"
              : "text-xl",
          tone === "dark" ? "text-cream-50" : "text-ink-900",
        ].join(" ")}
      >
        {title}
      </Tag>

      {lead ? (
        <p
          className={[
            "mt-5 text-lg leading-relaxed",
            centered && "mx-auto",
            tone === "dark" ? "text-cream-200/85" : "text-warm-600",
          ].join(" ")}
        >
          {lead}
        </p>
      ) : null}

      {note ? (
        <p
          className={[
            "mt-4 inline-flex items-center gap-2 text-xs font-medium",
            tone === "dark" ? "text-cream-300/70" : "text-warm-500",
          ].join(" ")}
        >
          <span
            aria-hidden="true"
            className={[
              "size-1.5 rounded-full",
              tone === "dark" ? "bg-gold-400/70" : "bg-gold-600/70",
            ].join(" ")}
          />
          {note}
        </p>
      ) : null}
    </div>
  );
}

/**
 * Small editorial label used to qualify a claim in place — e.g. distinguishing
 * a documented aim from a confirmed current programme.
 */
export function Qualifier({
  children,
  tone = "light",
}: {
  children: ReactNode;
  tone?: "light" | "dark";
}) {
  return (
    <p
      className={[
        "mt-3 flex items-start gap-2 text-[0.8125rem] leading-relaxed",
        tone === "dark" ? "text-cream-300/70" : "text-warm-500",
      ].join(" ")}
    >
      <span
        aria-hidden="true"
        className={[
          "mt-1.5 size-1.5 shrink-0 rounded-full",
          tone === "dark" ? "bg-gold-400/70" : "bg-gold-600/70",
        ].join(" ")}
      />
      <span>{children}</span>
    </p>
  );
}