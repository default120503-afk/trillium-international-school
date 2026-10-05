import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/layout/PageHero";
import { SectionHeading, Qualifier } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { Prose } from "@/components/ui/Prose";
import { TrilliumPetal } from "@/components/brand/Marks";
import { missionVision, school } from "@/content/school";
import { buildMetadata } from "@/app/layout";

export const metadata: Metadata = buildMetadata({
  title: "Mission & Vision",
  description:
    "The mission and vision that guide Trillium International School System: knowledge leading towards Allah according to the Quran and Sunnah, and excellence for students of every age and culture.",
  path: "/mission-and-vision",
});

export default function MissionVisionPage() {
  return (
    <>
      <PageHero
        eyebrow="Mission & vision"
        title="What the school is aiming at"
        lead="Two statements, drawn from the educational philosophy in the school's own published profile — and reproduced here with the qualification they deserve."
      />

      {/* Mission */}
      <section aria-labelledby="mission-heading" className="bg-ink-950 text-cream-200">
        <div className="container-page py-20 md:py-28">
          <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
            <div>
              <SectionHeading id="mission-heading"
                eyebrow="Mission"
                title={missionVision.mission.title}
                tone="dark"
                as="h2"
              />
              <div className="mt-8">
                <p className="font-display text-display-sm leading-snug text-cream-50 italic">
                  {missionVision.mission.lead}
                </p>
              </div>
            </div>
            <div className="lg:pt-16">
              <Prose tone="dark">
                {missionVision.mission.body.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                ))}
              </Prose>
              <div className="mt-10 flex items-center gap-4 border-t border-cream-100/12 pt-7">
                <TrilliumPetal className="size-6 shrink-0 text-gold-400" />
                <p className="text-sm leading-relaxed text-cream-300/70">
                  In short: knowledge, character and the freedom to think — held
                  together as one purpose rather than three separate ones.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision */}
      <section aria-labelledby="vision-heading" className="bg-cream-50">
        <div className="container-page py-20 md:py-28">
          <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
            <div>
              <SectionHeading id="vision-heading"
                eyebrow="Vision"
                title={missionVision.vision.title}
                as="h2"
              />
              <div className="mt-8">
                <p className="font-display text-display-sm leading-snug text-ink-800 italic">
                  {missionVision.vision.lead}
                </p>
              </div>
            </div>
            <div className="lg:pt-16">
              <Prose>
                {missionVision.vision.body.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                ))}
              </Prose>
              <div className="mt-10 border-t border-ink-900/12 pt-7">
                <p className="text-sm leading-relaxed text-warm-600">
                  The profile puts it plainly: every child has been blessed with
                  extraordinary qualities that need to be explored. Teaching, in
                  this view, is the work of finding them.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Provenance — the honesty section */}
      <section aria-labelledby="provenance-heading" className="bg-cream-100">
        <div className="container-page py-20 md:py-28">
          <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
            <div>
              <SectionHeading id="provenance-heading"
                eyebrow="A note on these statements"
                title="What this page is, precisely"
                as="h2"
              />
              <div className="mt-8 max-w-xl">
                <Prose>
                  <p>{missionVision.provenance}</p>
                  <p>
                    The underlying philosophy is the school&apos;s. The wording is
                    the website&apos;s. Where the school has not approved a formal
                    statement for publication, we say so rather than presenting it
                    as official.
                  </p>
                  <p>
                    When the school approves its own mission and vision wording,
                    replacing the text on this page is a single content edit — see
                    the README.
                  </p>
                </Prose>
              </div>
              <div className="mt-8 max-w-xl">
                <Qualifier>
                  Nothing on this page should be read as a claim of academic
                  accreditation, board affiliation or external endorsement.
                </Qualifier>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href="/admissions" variant="primary">
                  Admissions inquiry
                </ButtonLink>
                <ButtonLink href="/leadership" variant="secondary">
                  School leadership
                </ButtonLink>
              </div>
            </div>

            <figure className="lg:pt-2">
              <div className="overflow-hidden rounded-[var(--radius-card)] border border-ink-900/12 bg-cream-50 p-3 shadow-[var(--shadow-lift)]">
                <Image
                  src="/images/profile/page-4-thumb.webp"
                  alt="Scanned page from the school profile setting out the school's mission and vision statements."
                  width={900}
                  height={1200}
                  sizes="(max-width: 1024px) 92vw, 460px"
                  className="h-auto w-full"
                />
              </div>
              <figcaption className="mt-4 text-xs leading-relaxed text-warm-500">
                Page 4 of the school&apos;s published profile — the page these
                statements are drawn from.
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="bg-cream-50">
        <div className="container-page py-16 text-center">
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-warm-600">
            {school.name} reopened in {school.status.reopenedIn}.
          </p>
          <div className="mt-7">
            <ButtonLink href="/about" variant="secondary">
              About the school
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}