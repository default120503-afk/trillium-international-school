import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { Prose } from "@/components/ui/Prose";
import { TrilliumPetal } from "@/components/brand/Marks";
import { announcements, statusQualifier } from "@/content/programmes";
import { school } from "@/content/school";
import { buildMetadata } from "@/app/layout";

export const metadata: Metadata = buildMetadata({
  title: "News & Events",
  description:
    "Announcements from Trillium International School System. Only verified announcements are published here.",
  path: "/news",
});

/**
 * News page.
 *
 * The announcements array is empty because no announcement has been verified.
 * Rather than inventing a reopening celebration, admission deadlines or future
 * events, this page renders an honest empty state and explains how content is
 * added. Adding an entry to src/content/programmes.ts is all that is required.
 */
export default function NewsPage() {
  const hasAnnouncements = announcements.length > 0;

  return (
    <>
      <PageHero
        eyebrow="News & events"
        title="Announcements from the school"
        lead="This section publishes announcements the school has confirmed. Where nothing has been confirmed, it says so rather than filling the space."
      />

      <section aria-labelledby="announcements-heading" className="bg-cream-50">
        <div className="container-page py-20 md:py-28">
          <h2 id="announcements-heading" className="sr-only">
            Announcements
          </h2>

          {hasAnnouncements ? (
            <ul className="max-w-3xl space-y-0">
              {announcements.map((item) => (
                <li key={item.id} className="border-t border-ink-900/15 py-8 first:border-t-0 first:pt-0">
                  <p className="text-sm text-warm-500">
                    <time dateTime={item.date}>{item.date}</time>
                  </p>
                  <h3 className="mt-3 text-xl">{item.title}</h3>
                  <p className="mt-3 leading-relaxed text-warm-600">
                    {item.summary}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <div className="max-w-2xl rounded-[var(--radius-card)] border border-dashed border-ink-900/20 bg-cream-100 p-8 md:p-10">
              <TrilliumPetal className="size-7 text-gold-500" />
              <h3 className="mt-6 text-xl">No announcements yet</h3>
              <div className="mt-4">
                <Prose>
                  <p>
                    There is nothing published here, because the school has not yet
                    confirmed an announcement. Inventing a reopening celebration, an
                    admissions deadline or an upcoming event would be worse than an
                    empty page — a school notices when its own website makes things
                    up.
                  </p>
                  <p>
                    This section is built and ready. When the school confirms an
                    announcement, it appears here with its date and a short summary.
                  </p>
                </Prose>
              </div>
              <div className="mt-7">
                <ButtonLink href="/admissions" variant="primary">
                  Ask the school a question instead
                </ButtonLink>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* What the school has confirmed, stated as fact rather than event. */}
      <section aria-labelledby="confirmed-heading" className="bg-ink-900 text-cream-200">
        <div className="container-page py-20 md:py-24">
          <div className="mx-auto max-w-3xl">
            <SectionHeading id="confirmed-heading"
              eyebrow="Confirmed"
              title="The one dated fact we can state"
              tone="dark"
              as="h2"
            />
            <div className="mt-8">
              <Prose tone="dark">
                <p className="text-lg text-cream-200/90">
                  {school.name} reopened in {school.status.reopenedIn} and is
                                    operating. That is a statement of fact, not an event. No
                                    reopening ceremony, celebration or announcement has been
                                    confirmed, and none has been written about here.
                                    {" "}
                                    {/* The school reopening is client-confirmed. WHICH
                                        locations currently run is not: our own campus records
                                        carry status "historical" pending verification, so the
                                        reopening must not be read as confirming both sites. */}
                                    Individual campus operating status is confirmed with the
                                    school.
                </p>
                <p>
                  For anything specific to the current session — dates, deadlines,
                  activities, class availability — please ask the school directly.
                  It will give you an accurate answer.
                </p>
              </Prose>
            </div>
            <p className="mt-8 border-t border-cream-100/12 pt-6 text-sm leading-relaxed text-cream-300/60">
              Throughout this site, material drawn from the school profile is
              labelled as {statusQualifier.aspiration.toLowerCase()}. The
              difference between an aim and a confirmed current arrangement is the
              difference between an honest website and an impressive one.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink
                href="/admissions"
                variant="accent"
              >
                Admissions inquiry
              </ButtonLink>
              <ButtonLink href="/contact" variant="quiet">
                Contact the school
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}