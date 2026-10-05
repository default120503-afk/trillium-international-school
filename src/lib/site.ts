/**
 * Site URL resolution.
 *
 * The school's own domain is not yet known, and rather than invent one, every
 * canonical URL, sitemap entry and absolute Open Graph URL is derived from a
 * single resolved host and OMITTED when no host can be resolved at all.
 *
 * Resolution order:
 *   1. NEXT_PUBLIC_SITE_URL — explicit, always wins. Set this when the school
 *      gets its own domain, or to pin the URL in any environment.
 *   2. VERCEL_PROJECT_PRODUCTION_URL — set by Vercel at build time to the
 *      project's production hostname (https://<project>.vercel.app). That is
 *      the real live URL rather than a guess, so canonical URLs, the sitemap
 *      and Open Graph images are correct on the deployed site with nobody
 *      hand-editing a variable.
 *   3. null — local development with neither set; metadata that needs a host
 *      is omitted rather than pointed at something invented, which is exactly
 *      how the site already behaved.
 *
 * The production hostname is used deliberately, never VERCEL_URL: the latter
 * is the per-deployment preview host and changes on every push, which would
 * make canonical URLs unstable.
 *
 * SCHEME NORMALISATION IS REQUIRED, NOT COSMETIC.
 * Vercel sets VERCEL_PROJECT_PRODUCTION_URL to a BARE HOSTNAME, with no
 * scheme: "my-project.vercel.app", not "https://my-project.vercel.app". Every
 * caller does `new URL(path, getSiteUrl())`, and the URL constructor rejects a
 * scheme-less base with ERR_INVALID_URL — which fails the production BUILD at
 * page-data collection rather than producing subtly wrong metadata. An
 * explicit NEXT_PUBLIC_SITE_URL is normally written with a scheme, so
 * normalising only when one is missing handles both shapes.
 */
export function getSiteUrl(): string | null {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (!raw) return null;
  const trimmed = raw.trim().replace(/\/+$/, "");
  if (!trimmed) return null;
  // Only supply a scheme when the value has none. An http:// value is left
  // alone rather than silently upgraded, so an explicit choice stays explicit.
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}