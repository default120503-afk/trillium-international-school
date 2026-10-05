import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { SectionHeading, Qualifier } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { Prose } from "@/components/ui/Prose";
import { TrilliumPetal } from "@/components/brand/Marks";
import { history, founder, school } from "@/content/school";
import { buildMetadata } from "@/app/layout";

export const metadata: Metadata = buildMetadata({
  title: "Our Story",
  description:
    "The founding of Trillium International School System by Farzana Tabussum: educational work beginning in 2014, and a first session in 2014-2015 with seven students.",
  path: "/story",
});

/**
 * NO FOUNDER PHOTOGRAPH — read before adding one.
 *
 * The school supplied `Farzana_Tabussum.jpeg` and it was placed on this page
 * three ways: in the biography column, where it displaced the scanned
 * school-profile page; as a large circle in the hero; and as a tall editorial
 * plate in the hero. All three were reverted at the school's request, the last
 * because the photograph itself was judged not to look good.
 *
 * It is not replaced with anything — no stock, generated, placeholder or
 * substitute portrait, and no empty frame left standing in for one.
 * `public/images/founder/` still holds the supplied file but nothing references
 * it; that is deliberate. Deleting the asset as well would make a reinstated
 * photograph look like a fresh decision rather than a restored one.
 *
 * Consequences for the layout, all of them intentional:
 *
 *   - The hero passes no `aside`, so it uses `PageHero`'s stock
 *     single-column composition — identical to every other inner page. The
 *     concentric rings therefore read as the decoration they were drawn as,
 *     rather than framing a portrait.
 *   - The Founder section is still a two-column spread. Column one carries the
 *     role, name, qualification and the full biography; column two carries the
 *     school's own profile page. So the section is a designed pair rather than
 *     a column beside an empty slot.
 *   - Every founder NAME, TITLE and QUALIFICATION on this page is untouched, as
 *     is the "Founder & our story" heading and its introductory paragraph.
 *
 * If a photograph is ever reinstated, the biography and the profile page stay
 * exactly where they are and the portrait is ADDITIONAL to both — never a
 * substitute for either.
 */
export default function StoryPage() {
  return (
    <>
      <PageHero
        eyebrow="Founder & our story"
        title="Seven students, and a long walk to reach them"
        lead={`The school began with one person carrying a Master's degree in education into the communities of ${school.location.region}. This is the account the school gives of how that happened.`}
      />

      {/* Founder */}
      <section aria-labelledby="founder-heading" className="bg-cream-50">
        <div className="container-page py-20 md:py-28">
          <div className="grid items-start gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <div>
              <SectionHeading id="founder-heading"
                eyebrow={founder.role}
                title={founder.name}
                as="h2"
              />
              <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2">
                <span aria-hidden="true" className="h-px w-10 bg-gold-500" />
                <span className="text-sm text-warm-500">{founder.qualification}</span>
              </div>

              <div className="mt-9 max-w-2xl">
                <Prose>
                  <p className="text-lg leading-relaxed text-warm-700">
                    {founder.name} holds a {founder.qualification}. Her account of
                    why she began is straightforward: she saw that people in the
                    area badly needed access to the kind of education that would
                    let their children stand among the best in their society.
                  </p>
                  <p>
                    So she began educational work in January 2014, choosing Khanpur
                    as the place to start. She went door to door to introduce her
                    aims and ambitions to the people of the area.
                  </p>
                  <p>
                    The first school session began in March of the 2014-2015
                    academic year, with seven students.
                  </p>
                  <p>
                    Getting there meant travelling ninety to a hundred kilometres
                    every day, using local transport, in all seasons. The work was
                    not limited to pupils — it extended to mothers, to teacher
                    motivation, and to broader education in the area.
                  </p>
                  <p>
                    What followed was the school running two branches at the same
                    time, held together by the same perception: that a name
                    standing for quality education is built on teaching methods and
                    serious testing of how students are actually learning.
                  </p>
                </Prose>
              </div>

              <Qualifier>
                This account is drawn from the founder&apos;s own words as recorded
                in the school&apos;s published profile. No quotations, personal
                details or biographical claims have been added to it.
              </Qualifier>
            </div>

            {/*
                THE SCHOOL PROFILE PAGE.

                This is a scanned page of the school's own published profile —
                page 2, the one carrying the founder's account, which is the
                account transcribed in the prose opposite. It is reproduced here
                as a document in a mount, the same treatment
                `StoryTimeline` gives it on the homepage, because that is what
                it is: a page of a school-produced document, not a photograph.

                It was briefly replaced by the founder portrait, which was the
                wrong picture in the wrong place. The portrait belongs in the
                hero's circular area beside the "Founder & our story"
                introduction, where this now sits beneath it in the page flow.

                Full resolution (`page-2.webp`) rather than the homepage's
                `page-2-thumb.webp`: this is the one place on the site where the
                document is the subject, so it gets the readable file. The
                caption states the provenance, as it does everywhere else the
                profile is reproduced.
            */}
            <figure className="flex flex-col items-center lg:sticky lg:top-28">
              <div className="w-full max-w-sm overflow-hidden rounded-[3px] border border-ink-900/12 bg-cream-50 p-2.5 shadow-[var(--shadow-lift)]">
                <Image
                  src="/images/profile/page-2.webp"
                  alt="Scanned page from the school profile containing the founder's account of the school's beginnings, printed text on a plain page."
                  /* The file's real dimensions, so the pre-CSS layout box
                     matches what loads. `StoryTimeline` declares this same
                     asset as 900x1200; the file is actually 1400x1825
                     (0.7671:1, not 0.75:1). With `h-auto w-full` the rendered
                     ratio follows the file either way, so nothing was visibly
                     stretched — but the declared box was off by 2%, which is
                     exactly the small layout shift these props exist to
                     prevent. Corrected here rather than propagated. */
                  width={1400}
                  height={1825}
                  sizes="(max-width: 640px) 90vw, (max-width: 1024px) 60vw, 384px"
                  className="h-auto w-full"
                />
              </div>
              <figcaption className="mt-5 max-w-sm text-center text-xs leading-relaxed text-warm-500">
                Page 2 of the school&apos;s published profile, reproduced from the
                document supplied by the school. The document contains no
                photographs.
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section aria-labelledby="timeline-heading" className="bg-ink-950 text-cream-200">
        <div className="container-page py-20 md:py-28">
          <SectionHeading id="timeline-heading"
            eyebrow="Timeline"
            title="How the school began"
            tone="dark"
            as="h2"
          />
          <div className="mt-6 max-w-2xl">
            <Qualifier tone="dark">
              Dates and figures are exactly as stated in the school&apos;s account.
              Nothing has been interpolated.
            </Qualifier>
          </div>

          <ol className="mt-14 max-w-3xl">
            {history.timeline.map((entry, index) => (
              <li key={`${entry.year}-${entry.title}`} className="relative">
                <div className="grid gap-4 pb-12 sm:grid-cols-[9rem_1fr] sm:gap-8">
                  <div className="flex items-center gap-3 sm:block">
                    <span className="font-display text-base text-gold-400">
                      {entry.year}
                    </span>
                  </div>
                  <div className="relative border-l border-cream-100/15 pb-2 pl-7">
                    <span
                      aria-hidden="true"
                      className="absolute -left-[5px] top-2 size-2.5 rounded-full bg-gold-500"
                    />
                    <h3 className="text-xl text-cream-50">{entry.title}</h3>
                    <p className="mt-3 leading-relaxed text-cream-300/78">
                      {entry.body}
                    </p>
                  </div>
                </div>
                {index === history.timeline.length - 1 ? null : (
                  <span aria-hidden="true" className="hidden sm:block" />
                )}
              </li>
            ))}
          </ol>

          <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-cream-100/12 pt-8">
            <TrilliumPetal className="size-7 text-gold-400" />
            <p className="text-lg text-cream-100">
              The school is now {school.shortName}, reopened in{" "}
              {school.status.reopenedIn}.
            </p>
          </div>
        </div>
      </section>

      {/* Rural context */}
      <section aria-labelledby="rural-heading" className="bg-cream-100">
        <div className="container-page py-20 md:py-28">
          <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
            <div>
              <SectionHeading id="rural-heading"
                eyebrow="The rural commitment"
                title="Going to the families, not waiting for them to arrive"
                as="h2"
              />
              <div className="mt-8 max-w-xl">
                <Prose>
                  <p>{history.premise}</p>
                  <p>
                    Ninety to a hundred kilometres a day, on local transport, in
                    every season — that is what it took to reach the first seven
                    students and the families who would follow. The school&apos;s
                    later years did not come from a business plan or a building.
                    They came from proximity.
                  </p>
                  <p>
                    That origin still explains a good deal about how the school
                    talks about itself: emphasis on spoken English and computer
                    literacy, on confidence and leadership, and on a home community
                    that includes families the school was built to serve.
                  </p>
                </Prose>
              </div>
            </div>

            <div className="lg:pt-2">
              <div className="rounded-[var(--radius-card)] border border-ink-900/12 bg-cream-50 p-7">
                <h3 className="text-lg">Two branches were recorded</h3>
                <p className="mt-4 leading-relaxed text-warm-600">
                  The school&apos;s account states that it ran two branches at the
                  same time. Those locations are recorded on the campuses page.
                </p>
                <p className="mt-4 leading-relaxed text-warm-600">
                  Current operating status for each location is confirmed directly
                  with the school.
                </p>
                <div className="mt-7">
                  <ButtonLink href="/campuses" variant="secondary">
                    See the campus records
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </ButtonLink>
                </div>
              </div>

              <div className="mt-6 rounded-[var(--radius-card)] border border-gold-600/25 bg-gold-300/15 p-7">
                <h3 className="text-lg">Looking for the school?</h3>
                <p className="mt-3 leading-relaxed text-warm-700">
                  {school.name} reopened in {school.status.reopenedIn} and is
                  welcoming admissions inquiries.
                </p>
                <div className="mt-6">
                  <ButtonLink href="/admissions" variant="primary">
                    Make an inquiry
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </ButtonLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-cream-50">
        <div className="container-page py-16 text-center">
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-warm-600">
            Read what the school says about how children learn, or go straight to
            making an inquiry.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/learning" variant="secondary">
              Learning &amp; curriculum
            </ButtonLink>
            <ButtonLink href="/admissions" variant="primary">
              Admissions inquiry
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}