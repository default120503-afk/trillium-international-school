import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { Prose } from "@/components/ui/Prose";
import { TrilliumPetal } from "@/components/brand/Marks";
import { reasonsToJoin } from "@/content/programmes";
import { founder, history, school } from "@/content/school";
import { buildMetadata } from "@/app/layout";

export const metadata: Metadata = buildMetadata({
  title: "Why Trillium",
  description:
    "Grounded reasons to consider Trillium International School System: concept-based teaching, continuous evaluation, English and computer education, Islamic education, and a commitment to rural communities.",
  path: "/why-trillium",
});

export default function WhyTrilliumPage() {
  return (
    <>
      <PageHero
        eyebrow="Why Trillium"
        title="Reasons you can actually check"
        lead="Most school websites promise results. This one does not. What follows is drawn from the school's own published profile — each reason can be read back to the source it came from."
      />

      {/* The six reasons */}
      <section aria-labelledby="reasons-heading" className="bg-cream-50">
        <div className="container-page py-20 md:py-28">
          <h2 id="reasons-heading" className="sr-only">
            Reasons to consider the school
          </h2>

          <div className="grid gap-x-14 gap-y-14 lg:grid-cols-2">
            {reasonsToJoin.map((reason, index) => (
              <article key={reason.title} className="border-t border-ink-900/15 pt-8">
                <div className="flex items-center gap-3">
                  <TrilliumPetal className="size-5 shrink-0 text-gold-500" />
                  <span className="font-display text-sm text-gold-700">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                {/* text-xl, not text-display-sm: six cards at display size
                    rendered at 34px, identical to the section h2 and the page
                    h1, leaving three heading levels indistinguishable. */}
                <h3 className="mt-5 text-xl">{reason.title}</h3>
                <p className="mt-4 text-[1.0625rem] leading-relaxed text-warm-600">
                  {reason.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* What we refuse to claim */}
      <section aria-labelledby="refuse-heading" className="bg-ink-950 text-cream-200">
        <div className="container-page py-20 md:py-28">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
            <div>
              <SectionHeading id="refuse-heading"
                eyebrow="An absence worth noticing"
                title="Claims this page will not make"
                tone="dark"
                as="h2"
              />
              <div className="mt-8">
                <Prose tone="dark">
                  <p>
                    A page like this could easily carry a badge, a pass percentage,
                    a ranking or a testimonial. It would take about an hour to add,
                    and none of it would be true.
                  </p>
                  <p>
                    So here is the list of things you will not find on this site,
                    stated plainly rather than quietly omitted. If the school later
                    has verified figures it wants published, they will appear.
                  </p>
                </Prose>
              </div>
            </div>

            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {[
                "Best school, number one, or any ranking",
                "A pass rate, a success rate or a guaranteed result",
                "Board affiliation, accreditation or a certificate",
                "A testimonial from a named parent or student",
                "Student numbers, growth figures or enrolment statistics",
                "Social media follower counts or engagement metrics",
                "A fee structure, a scholarship or an admissions deadline",
                "Award badges of any kind",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 border-t border-cream-100/15 pt-4 text-[0.9375rem] leading-relaxed text-cream-300/80"
                >
                  <span
                    aria-hidden="true"
                    className="mt-2.5 size-1.5 shrink-0 rounded-full bg-gold-400/60"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Origin */}
      <section aria-labelledby="origin-heading" className="bg-cream-100">
        <div className="container-page py-20 md:py-28">
          <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
            <div>
              <SectionHeading id="origin-heading"
                eyebrow="Where this comes from"
                title="It began by going to the families"
                as="h2"
              />
              <div className="mt-8 max-w-xl">
                <Prose>
                  <p>{history.premise}</p>
                  <p>
                    In January 2014, {founder.name} — {founder.role} and {founder.descriptor}
                    — started educational work in the
                    Haripur area and walked door to door to explain what she intended
                    to do. The first session followed in March of the 2014-2015
                    school year with seven students.
                  </p>
                  <p>
                    Reaching them meant travelling ninety to a hundred kilometres
                    every day on local transport, in every season. Within a few
                    years the school was running two branches at once.
                  </p>
                  <p>
                    That history is the reason this page has six specific reasons on
                    it rather than a slogan. The school knows what it is trying to
                    do, and it has been trying to do it for over a decade.
                  </p>
                </Prose>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href="/story" variant="secondary">
                  Read the full story
                </ButtonLink>
                <ButtonLink href="/admissions" variant="primary">
                  Admissions inquiry
                </ButtonLink>
              </div>
            </div>

            <div className="lg:pt-4">
              <div className="rounded-[var(--radius-card)] border border-ink-900/12 bg-cream-50 p-7">
                <h3 className="text-lg">Where each reason comes from</h3>
                <dl className="mt-6 flex flex-col gap-4">
                  {[
                    ["Concept-based teaching", "Learning & Curriculum"],
                    ["Continuous evaluation", "Learning & Curriculum"],
                    ["English, computers, Nazra", "Learning & Curriculum"],
                    ["Safe, hygienic environment", "Learning & Curriculum"],
                    ["Rural community commitment", "Our Story"],
                    ["Talents beyond the syllabus", "Beyond the Classroom"],
                  ].map(([reason, page]) => (
                    <div
                      key={reason}
                      className="flex flex-col gap-1 border-t border-ink-900/10 pt-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
                    >
                      <dt className="text-[0.9375rem] text-ink-900">{reason}</dt>
                      <dd className="text-sm text-warm-500">{page}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-6 border-t border-ink-900/10 pt-5 text-xs leading-relaxed text-warm-500">
                  Every one of these is drawn from the school&apos;s published
                  profile. The school has not been asked to invent anything to fill
                  this page, and has not been asked to approve an unverified claim.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-cream-50">
        <div className="container-page py-16 text-center">
          <h2 className="mx-auto max-w-2xl text-display-sm">
            {school.shortName} is open for inquiries
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-warm-600">
            The school reopened in {school.status.reopenedIn}. Ask a question and
            the school will answer it directly.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/admissions" variant="primary" size="lg">
              Admissions inquiry
            </ButtonLink>
            <ButtonLink href="/contact" variant="secondary" size="lg">
              Contact the school
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}