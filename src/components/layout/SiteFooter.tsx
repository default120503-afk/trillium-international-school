import Link from "next/link";
import { Facebook, MapPin } from "lucide-react";
import { TrilliumLogo, TrilliumPetal } from "@/components/brand/Marks";
import { primaryNav, admissionNav } from "@/content/navigation";
import { contact, social, contactUnavailableNotice, telHref } from "@/content/contact";
import { campuses } from "@/content/campuses";
import { school, founder } from "@/content/school";

export function SiteFooter() {
  const year = new Date().getFullYear();
  const explore = primaryNav.filter(
    (n) => n.href !== "/" && n.href !== "/news",
  );

  return (
    <footer className="relative mt-24 overflow-hidden bg-ink-950 text-cream-200">
      {/* Organic top edge, echoing the trillium curves. Decorative only. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 64"
        preserveAspectRatio="none"
        className="absolute inset-x-0 -top-px block h-10 w-full text-ink-950"
      >
        <path
          d="M0,64 L0,28 C240,4 480,60 720,32 C960,4 1200,56 1440,24 L1440,64 Z"
          fill="currentColor"
        />
      </svg>

      <div className="container-page relative pt-24 pb-10">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.1fr]">
          <div>
            {/* No chip behind the logo. The supplied JPEG had a real black matte
                baked into it; that matte was measured and removed at the asset
                level (see Marks.tsx), so the mark is genuinely transparent and
                sits directly on the footer's ink-950. A soft gold hairline ring
                is the only framing, and it is drawn OUTSIDE the mark's own bounds
                so it never reads as a background behind it. */}
            <span
              className="inline-flex items-center rounded-[6px] ring-1 ring-gold-400/25 ring-offset-4 ring-offset-ink-950 transition-[box-shadow,transform] duration-[var(--dur-base)] ease-[var(--ease-out-soft)] hover:ring-gold-400/45 motion-reduce:transition-none"
              style={{ boxShadow: "0 18px 44px -28px rgba(0,0,0,0.9)" }}
            >
              <TrilliumLogo
                className="h-11 w-auto"
                sizes="120px"
                // `h-11 w-auto` means Chrome cannot derive the rendered ratio
                // from CSS alone, so it flagged this lazy image as a layout-shift
                // risk. The logo is intrinsically 1499x880; stating that ratio
                // explicitly reserves the correct box before the bytes arrive.
                style={{ aspectRatio: "1499 / 880" }}
              />
            </span>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-cream-300/75">
              {school.location.area}, {school.location.region},{" "}
              {school.location.country}.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-cream-300/75">
              Founded by {founder.name}, {founder.qualification}.
            </p>
            <div className="mt-6 flex items-center gap-2 text-gold-400/80">
              <TrilliumPetal className="size-5" />
              <span className="text-[0.6875rem] uppercase tracking-[0.18em]">
                Reopened {school.status.reopenedIn}
              </span>
            </div>
          </div>

          <nav aria-label="Explore">
            <h2 className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-gold-400">
              Explore
            </h2>
            <ul className="mt-5 flex flex-col gap-3">
              {explore.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    /* `min-w-11` as well as `min-h-11`: the height floor alone
                       left the shortest label ("About") at 40.2px wide, which is
                       under the 44px of WCAG 2.5.5 Target Size (Enhanced). The
                       floor is on the hit box only — it adds trailing space past
                       the underline, not visible padding around the word. */
                    className="inline-flex min-h-11 min-w-11 items-center text-sm font-medium text-cream-50 underline decoration-gold-500/60 underline-offset-4 transition-colors hover:decoration-gold-500"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href={admissionNav.href}
                  className="inline-flex min-h-11 items-center text-sm font-medium text-cream-50 underline decoration-gold-500/60 underline-offset-4 transition-colors hover:decoration-gold-500"
                >
                  {admissionNav.label}
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <h2 className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-gold-400">
              Campuses
            </h2>
            <ul className="mt-5 flex flex-col gap-4">
              {campuses.map((campus) => (
                <li key={campus.id} className="text-sm">
                  <Link
                    href="/campuses"
                    className="flex min-h-11 items-start gap-2 py-1.5 text-cream-300/80 transition-colors hover:text-cream-50"
                  >
                    <MapPin
                      className="mt-1.5 size-4 shrink-0 text-gold-500/70"
                      aria-hidden="true"
                    />
                    <span>
                      {/* The nested `block` span produced a CSS-only line
                          break, so textContent - what screen readers,
                          copy-paste and search indexing get - read
                          "...BheraBhera, Near Jaulian". Join explicitly. */}
                      {campus.name} &mdash; {campus.locationNote}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-gold-400">
              Get in touch
            </h2>

            <ul className="mt-5 flex flex-col gap-3">
              {social.map((s) => (
                <li key={s.id}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-2 text-sm text-cream-300/80 transition-colors hover:text-cream-50"
                  >
                    <Facebook className="size-4 text-gold-500/70" aria-hidden="true" />
                    {s.label}
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>

            {/* Only verified contact details are printed. Unconfigured fields
                are omitted rather than filled with an invented placeholder.
                telHref() builds the dial string in one place so the +/space
                handling cannot drift between call sites. */}
            {contact.phone ? (
              <p className="mt-4 text-sm text-cream-300/80">
                {/*
                  min-h-11, not just a text link. WCAG 2.2 SC 2.5.8 requires a
                  24x24 CSS px minimum target size; a bare inline anchor is
                  ~20px tall and fails it. This is a standalone control in a
                  column, not a link inside a sentence, so the inline exemption
                  does not apply and the height has to be real.
                */}
                <a
                  href={telHref(contact.phone)}
                  className="line-link min-h-11 text-cream-50"
                >
                  {contact.phone}
                  <span aria-hidden="true" className="line-link-underline" />
                </a>
              </p>
            ) : null}
            {contact.email ? (
              <p className="mt-2 text-sm text-cream-300/80">
                <a href={`mailto:${contact.email}`} className="hover:text-cream-50">
                  {contact.email}
                </a>
              </p>
            ) : null}

            {contact.phone || contact.email ? null : (
              <p className="mt-4 text-sm leading-relaxed text-cream-300/60">
                {contactUnavailableNotice}
              </p>
            )}

            <Link
              href="/admissions"
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-[4px] bg-gold-500 px-5 text-sm font-medium text-ink-950 transition-colors hover:bg-gold-400"
            >
              Send an admissions inquiry
            </Link>
          </div>
        </div>

        {/* cream-300/55 composited to rgb(132,119,119) on the ink-950 footer =
           4.37:1 at 12px. WCAG 1.4.3 wants 4.5:1 for body text, and axe
           reported the whole row, not one line -- so this is set on the
           container rather than patched per child, which would leave the
           second paragraph inheriting the failing value. /70 = 6.45:1. */}
        <div className="mt-14 flex flex-col gap-4 border-t border-cream-100/12 pt-7 text-xs text-cream-300/70 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {school.name}. All rights reserved.</p>
          <p className="flex items-center gap-2">
            <TrilliumPetal className="size-4 text-gold-500/60" />
            {school.location.area}, {school.location.region}
          </p>
        </div>
      </div>
    </footer>
  );
}