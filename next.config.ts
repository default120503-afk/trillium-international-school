import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // The school's official domain is not yet known. Set this before deploying
  // so canonical URLs, sitemap entries and Open Graph images resolve correctly.
  // See .env.example and README.md ("Deployment prerequisites").
  //
  // `output: "standalone"` produces a self-contained server bundle for
  // container/Docker hosts. Vercel builds and runs Next.js itself and ignores
  // it, so it is deliberately disabled there — otherwise setting
  // NEXT_PUBLIC_SITE_URL on Vercel (which the site needs) would also switch on
  // an output mode that host does not use.
  ...(process.env.NEXT_PUBLIC_SITE_URL && !process.env.VERCEL
    ? { output: "standalone" as const }
    : {}),

  /**
   * Alias slugs for pages whose names vary in the wild.
   *
   * "Mission, Vision & Values" and "Beyond the Classroom" are both natural
   * names for these pages, and either is a plausible thing for a parent,
   * a printed brochure QR code, or an inbound link to point at. A hard 404 on
   * a page we actually have reads as a broken site, so send these to the real
   * pages permanently instead.
   */
  async redirects() {
    return [
      { source: "/mission-vision", destination: "/mission-and-vision", permanent: true },
      { source: "/mission-and-vision/", destination: "/mission-and-vision", permanent: true },
      { source: "/beyond-the-classroom", destination: "/co-curricular", permanent: true },
    ];
  },

  /**
   * Baseline security headers.
   *
   * The CSP is deliberately strict: this site loads no third-party scripts,
   * fonts, images or analytics, so 'self' is sufficient everywhere. The
   * Facebook link is a plain outbound anchor, never an embedded frame.
   *
   * script-src needs 'unsafe-inline' because Next emits its own inline
   * bootstrap/hydration scripts; the content is fully static and contains no
   * user-supplied markup, so that is the accepted trade-off.
   */
  async headers() {
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self' data:",
      "connect-src 'self'",
      "frame-src 'none'",
      "frame-ancestors 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests",
    ].join("; ");

    const security = [
      { key: "Content-Security-Policy", value: csp },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
      },
      { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
      // The site is served over TLS on Vercel, which is a real host with a
      // stable name, so HSTS is now enabled. Scoped to this host only.
      { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
    ];

    return [
      { source: "/:path*", headers: security },
      // Never let a search engine index the API surface.
      {
        source: "/api/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex" }],
      },
    ];
  },
};

export default nextConfig;