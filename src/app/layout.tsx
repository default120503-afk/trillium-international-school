import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { MotionRoot } from "@/components/motion/MotionRoot";
import { school } from "@/content/school";
import { contact, social } from "@/content/contact";
import { campuses } from "@/content/campuses";
import { getSiteUrl } from "@/lib/site";

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
  axes: ["SOFT", "WONK", "opsz"],
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

/**
 * Only verified facts appear here.
 *
 * The school has verified its official mobile number, so it is emitted as
 * `telephone` using the same display form the site shows to visitors —
 * schema.org accepts that form, and a search result renders it back to the
 * user as they would read it. It is built from the shared `contact` record
 * rather than written here, so the number has exactly one definition on the
 * site.
 *
 * Still absent, and absent deliberately: no postal address, no coordinates and
 * no opening hours. The school has not supplied them, and an empty placeholder
 * is worse than an absent field. `sameAs` carries the one social link the
 * school actually gave us.
 */
export function buildSchoolStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "School",
    name: school.name,
    alternateName: school.shortName,
    ...(getSiteUrl() ? { url: getSiteUrl() } : {}),
    // The school's verified mobile number. Omitted entirely when null, so an
    // unverified field can never appear as an empty string in the JSON-LD.
    ...(contact.phone ? { telephone: contact.phone } : {}),
    ...(contact.postalAddress
      ? {
          address: {
            "@type": "PostalAddress",
            streetAddress: contact.postalAddress,
            addressLocality: school.location.area,
            addressRegion: school.location.region,
            addressCountry: school.location.country,
          },
        }
      : {
          // No verified postal address: describe only what is actually known.
          areaServed: `${school.location.area}, ${school.location.region}, ${school.location.country}`,
        }),
    // Only genuine profile permalinks are valid identity URLs. A /share/
    // redirect is excluded so the structured data does not assert a page
    // identity the school has not actually supplied.
    ...(social.some((s) => s.isPermalink !== false)
      ? { sameAs: social.filter((s) => s.isPermalink !== false).map((s) => s.href) }
      : {}),
    // Campus locations as a `location` set. Schema.org's `School` inherits
    // `location` from `Organization`/`Place`, and search engines read it to
    // associate campuses with an institution.
    //
    // Provenance, which is the whole reason this is built from the campus model
    // rather than hand-written:
    //  - `address` is a `PostalAddress` whose streetAddress is the OWNER-SUPPLIED
    //    landmark wording verbatim. No street number, postal code or coordinate
    //    is inferred from it.
    //  - `hasMap` is emitted ONLY where the owner supplied that exact URL. It is
    //    absent for the two Haripur records rather than null, so nothing implies
    //    a verified map that does not exist.
    //  - Historical campuses are still listed. `location` describes where the
    //    institution is or has been; claiming the school operates three sites
    //    would be the fabrication, and that claim lives in the prose instead.
    location: campuses.map((campus) => ({
      "@type": "Place",
      name: campus.name,
      address: {
        "@type": "PostalAddress",
        streetAddress: campus.locationNote,
        addressLocality: campus.region,
        addressCountry: "PK",
      },
      ...(campus.mapUrl ? { hasMap: campus.mapUrl } : {}),
    })),
  };
}

/**
 * Per-page metadata factory.
 *
 * Canonical URLs and absolute Open Graph URLs are emitted ONLY when
 * NEXT_PUBLIC_SITE_URL is configured, so an unknown domain is never invented.
 */
export function buildMetadata(route: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const url = getSiteUrl();
  const canonical = url ? new URL(route.path, url).toString() : undefined;
  const title = `${route.title} | ${school.name}`;

  return {
    title,
    description: route.description,
    ...(canonical ? { alternates: { canonical } } : {}),
    openGraph: {
      title,
      description: route.description,
      type: "website",
      siteName: school.name,
      locale: "en_PK",
      ...(url
        ? {
            url: canonical,
            images: [
              {
                // The dedicated 1200x630 social card, not the bare logo. A
                // 1.7034:1 lockup in a large-image card is cropped
                // unpredictably by every platform. The card mounts the official
                // logo on the brand's own ink ground with a soft warm light —
                // the artwork itself is untouched, only placed.
                url: new URL("/brand/og-logo.png", url).toString(),
                width: 1200,
                height: 630,
                alt: `${school.name} logo`,
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: route.description,
      ...(url ? { images: [new URL("/brand/og-logo.png", url).toString()] } : {}),
    },
    robots: { index: true, follow: true },
  };
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const structuredData = buildSchoolStructuredData();

  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body>
        {/* Sets data-motion on <html> only once the observer layer is live.
            Everything that animates is gated behind that attribute, so with
            JavaScript unavailable the site renders complete and static. */}
        <MotionRoot />
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        {children}
        <script
          type="application/ld+json"
          // Static, developer-authored JSON built from verified content only.
          dangerouslySetInnerHTML={{
            // Escape '<' so a '<' inside any string value can never terminate
            // the script element early.
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
        />
      </body>
    </html>
  );
}