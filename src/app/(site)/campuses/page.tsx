import type { Metadata } from "next";
import Image from "next/image";
import { MapPin, ArrowRight } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { SectionHeading, Qualifier } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { campuses, campusStatusLabel } from "@/content/campuses";
import { school } from "@/content/school";
import { buildMetadata } from "@/app/layout";

export const metadata: Metadata = buildMetadata({
  title: "Campuses",
  description:
    "Campus locations of Trillium International School System: the operating Rawalpindi campus on Adayala Road, D Awami Shopping Center, beside Snober City, plus the Bhera and Khanpur locations recorded in the school's history.",
  path: "/campuses",
});

export default function CampusesPage() {
  return (
    <>
      <PageHero
        eyebrow="Campuses"
        title="Where the school is, and where it has been"
        lead="The Rawalpindi campus is now open. Two earlier locations are recorded below in the school's own material. Current operating status is shown per campus, and confirmed with the school."
      />

      <section aria-labelledby="campus-heading" className="bg-cream-50">
        <div className="container-page py-20 md:py-28">
          <h2 id="campus-heading" className="sr-only">
            Campus locations
          </h2>

          <ul className="space-y-10">
            {campuses.map((campus, index) => (
              <li key={campus.id}>
                <article className="grid gap-8 border border-ink-900/12 bg-cream-100 lg:grid-cols-[1fr_1.2fr]">
                  {/* Left: identity panel. Designed, not a fake photograph. */}
                  <div className="relative flex min-h-56 flex-col justify-between overflow-hidden bg-[linear-gradient(140deg,var(--color-ink-800),var(--color-navy-800))] p-7">
                    <span
                      aria-hidden="true"
                      className="absolute -top-14 -right-8 size-40 rounded-full bg-gold-500/15 blur-2xl"
                    />
                    <div className="relative">
                      <span className="font-display text-sm text-gold-400">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      {/*
                        text-xl, not text-2xl. At 24px these two campus names
                        were 4px larger than every other card title on the
                        site (/learning uses 20px for the same role), so the
                        same kind of content read at two sizes depending on
                        which page you landed on. The serif face is unchanged:
                        h1-h4 are already Fraunces via the globals.css base
                        rule, so the old font-display class was redundant
                        rather than a different typeface.
                      */}
                      <h3 className="mt-4 text-xl text-cream-50">
                        {campus.name}
                      </h3>
                    </div>
                    <div className="relative">
                      {campus.image ? (
                        <Image
                          src={campus.image}
                          alt={campus.name}
                          width={900}
                          height={600}
                          className="h-auto w-full rounded-[4px] object-cover"
                        />
                      ) : (
                        <p className="flex items-start gap-2.5 text-sm leading-relaxed text-cream-300/70">
                          <MapPin
                            className="mt-0.5 size-4 shrink-0 text-gold-400"
                            aria-hidden="true"
                          />
                          {campus.locationNote}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right: the facts we actually have. */}
                  <div className="p-7 lg:p-9">
                    <dl className="grid gap-6 sm:grid-cols-2">
                      <div>
                        <dt className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-warm-500">
                          Location
                        </dt>
                        <dd className="mt-2 text-[0.9375rem] text-ink-900">
                          {campus.locationNote}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-warm-500">
                          Region
                        </dt>
                        <dd className="mt-2 text-[0.9375rem] text-ink-900">
                          {campus.region}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-warm-500">
                          Status
                        </dt>
                        <dd className="mt-2">
                          <span className="inline-flex items-center gap-2 rounded-[3px] border border-ink-900/15 px-2.5 py-1 text-sm text-warm-700">
                            <span
                              aria-hidden="true"
                              className={[
                                "size-1.5 rounded-full",
                                campus.status === "operational"
                                  ? "bg-success-600"
                                  : "bg-warm-500/60",
                              ].join(" ")}
                            />
                            {campusStatusLabel[campus.status]}
                          </span>
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-warm-500">
                          {campus.mapUrl ? "Address as given" : "Full postal address"}
                        </dt>
                        <dd
                          className={
                            campus.mapUrl
                              ? "mt-2 text-[0.9375rem] text-ink-900"
                              : "mt-2 text-[0.9375rem] text-warm-500"
                          }
                        >
                          {/* Rawalpindi has a real owner-supplied landmark
                              address, so the old unconditional "Full postal
                              address / Not yet published" pair printed a
                              contradiction on that card. */}
                          {campus.mapUrl
                            ? campus.locationNote
                            : "Not yet published by the school"}
                        </dd>
                      </div>
                    </dl>

                    {campus.notes ? (
                      <p className="mt-7 text-[0.9375rem] leading-relaxed text-warm-600">
                        {campus.notes}
                      </p>
                    ) : (
                      <p className="mt-7 text-[0.9375rem] leading-relaxed text-warm-600">
                        Facilities, transport, timings and services at this location
                        are confirmed directly with the school. They are not listed
                        here until the school verifies them.
                      </p>
                    )}

                    <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-ink-900/12 pt-6">
                      <ButtonLink href="/admissions" variant="primary">
                        Inquire about this campus
                        <ArrowRight className="size-4" aria-hidden="true" />
                      </ButtonLink>
                      {/* Owner-supplied Google Maps destination. Rendered only
                          when the model has one, so no campus can ever show a
                          map link pointing somewhere unverified. `noopener` is
                          required with target="_blank" or the new page gets a
                          live handle on this one; `noreferrer` additionally
                          keeps the visitor's navigation out of the Referer
                          header sent to Google. */}
                      {campus.mapUrl ? (
                        <a
                          href={campus.mapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="line-link inline-flex min-h-11 items-center gap-2 text-sm font-medium text-ink-700"
                        >
                          <MapPin className="size-4 shrink-0 text-gold-600" aria-hidden="true" />
                          View on Google Maps
                          {/* Screen-reader-only: the visible label is the same
                              on every card, so without the campus name three
                              identical links would be indistinguishable. */}
                          <span className="sr-only">
                            — {campus.name} (opens in a new tab)
                          </span>
                          <span aria-hidden="true" className="line-link-underline" />
                        </a>
                      ) : null}
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ul>

          <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
            <div>
              <SectionHeading
                eyebrow="On these locations"
                title="What is and is not shown"
                as="h2"
              />
              <div className="mt-7">
                <Qualifier>
                  The location descriptions above are the school&apos;s own. They
                  are locality references — not complete postal addresses.
                </Qualifier>
              </div>
            </div>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {[
                // Reworded, not deleted. The Rawalpindi campus has an
                // owner-supplied Google Maps link, so the old blanket claim
                // "No map, coordinates or directions are published, because none
                // have been verified" became false the moment that link was
                // added. The statement now distinguishes the two cases honestly:
                // one campus has a map because the school gave us that link, and
                // the others do not because nothing has been supplied.
                "A Google Maps link is shown for Rawalpindi because the school supplied that exact destination. The other campuses have no map link, because none has been verified.",
                "No campus photograph is published, because none exists in the material supplied. A designed panel is shown instead of stock photography.",
                "No facilities, opening hours, fees, transport services or enrolment figures are listed for any campus, because the school has not verified them.",
                "Operating status is shown per campus so the site never implies a location is running when that is unconfirmed.",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 border-t border-ink-900/12 pt-4 text-[0.9375rem] leading-relaxed text-warm-600"
                >
                  <span
                    aria-hidden="true"
                    className="mt-2 size-1.5 shrink-0 rounded-full bg-gold-600/70"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-14 rounded-[var(--radius-card)] bg-ink-900 px-7 py-10 text-center md:px-14">
            <h2 className="text-display-sm text-cream-50">
              Which campus are you asking about?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[0.9375rem] leading-relaxed text-cream-300/75">
              Tell us your preferred campus in an admissions inquiry and the school
              will confirm current arrangements for {school.shortName}.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <ButtonLink
                href="/admissions"
                variant="accent"
              >
                Admissions inquiry
              </ButtonLink>
              <ButtonLink href="/contact" variant="quiet">
                Contact details
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}