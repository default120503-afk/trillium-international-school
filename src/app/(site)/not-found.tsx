import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="bg-cream-50">
      <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
        <p className="font-display text-display-lg leading-none text-gold-500">
          404
        </p>
        <h1 className="mt-6 text-display-sm">This page could not be found</h1>
        <p className="mt-5 max-w-lg text-lg leading-relaxed text-warm-600">
          The page you were looking for does not exist, or has moved. The main
          sections of the site are listed below.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/" variant="primary">
            Back to the home page
          </ButtonLink>
          <ButtonLink href="/admissions" variant="secondary">
            Admissions inquiry
          </ButtonLink>
        </div>
        <nav aria-label="Site sections" className="mt-14 max-w-2xl">
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-3">
            {[
              ["/about", "About"],
              ["/story", "Our Story"],
              ["/learning", "Learning"],
              ["/campuses", "Campuses"],
              ["/gallery", "Gallery"],
              ["/contact", "Contact"],
            ].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="link-prose text-[0.9375rem]">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}