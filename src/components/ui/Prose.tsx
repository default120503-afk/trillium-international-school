import type { ReactNode } from "react";

/**
 * Editorial body copy.
 *
 * Sets a single readable measure with consistent vertical rhythm, so long-form
 * pages do not each invent their own paragraph spacing.
 */
export function Prose({
  children,
  tone = "light",
  className = "",
}: {
  children: ReactNode;
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <div
      className={[
        "[&>p]:leading-relaxed",
        "[&>p]:mb-5",
        "[&>p:last-child]:mb-0",
        "[&_a]:link-prose",
        tone === "dark"
          ? "[&>p]:text-cream-300/78 [&>p.text-lg]:text-cream-200/90"
          : "[&>p]:text-warm-600",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}