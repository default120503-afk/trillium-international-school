import type { MetadataRoute } from "next";
import { primaryNav } from "@/content/navigation";
import { getSiteUrl } from "@/lib/site";

/**
 * Sitemap.
 *
 * The school's official domain is not yet known. Rather than publish a
 * sitemap under an invented host, this route returns an empty sitemap body when
 * NEXT_PUBLIC_SITE_URL is unset - search engines will simply find no sitemap at
 * /sitemap.xml until the domain is configured.
 */
/**
 * Content revision date. A fixed constant, deliberately not `new Date()`:
 * stamping every URL as modified on every request tells crawlers the whole site
 * changes continuously, which is misleading crawl signal. Update this when
 * content actually changes.
 */
const CONTENT_LAST_MODIFIED = new Date("2026-10-04T00:00:00.000Z");

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  if (!base) return [];

  return [
    {
      url: base,
      lastModified: CONTENT_LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 1,
    },
    ...primaryNav
      .filter((item) => item.href !== "/" && item.href !== "/admissions")
      .map((item) => ({
        url: `${base}${item.href}`,
        lastModified: CONTENT_LAST_MODIFIED,
        changeFrequency: "yearly" as const,
        priority: 0.6,
      })),
    {
      url: `${base}/admissions`,
      lastModified: CONTENT_LAST_MODIFIED,
      changeFrequency: "yearly",
      priority: 0.9,
    },
  ];
}