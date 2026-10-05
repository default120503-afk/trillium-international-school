import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { SectionHeading, Qualifier } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { Prose } from "@/components/ui/Prose";
import { school, founder, history } from "@/content/school";
import { learningPillars, coCurricularThemes } from "@/content/programmes";
import { buildMetadata } from "@/app/layout";

export const metadata: Metadata = buildMetadata({
  title: "About the School",
  description:
    "Trillium International School System in Khanpur / Haripur, Khyber Pakhtunkhwa: its purpose, its educational philosophy, and the distinction between its aims and its confirmed programmes.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Trillium"
        title="A school that treats character as a real outcome"
        lead={`${school.name} describes itself in terms of how children learn and how they grow — not in terms of rankings. This page sets out that description, and is careful to separate what the school aims for from what it currently delivers.`}
      />

      {/* Overview */}
      <section aria-labelledby="overview-heading" className="bg-cream-50">
        <div className="container-page py-20 md:py-28">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <SectionHeading id="overview-heading"
              eyebrow="Overview"
              title="What the school is"
              as="h2"
            />
            <Prose>
              <p className="text-lg leading-relaxed text-warm-700">
                {school.name} is a school system in {school.location.area},{" "}
                {school.location.region}, {school.location.country}. It was founded
                by {founder.name}, {founder.role} and {founder.descriptor}.
              </p>
              <p>
                The school&apos;s own profile describes its work in unusually plain
                terms. Teaching is child-centred and concept-based. Assessment runs
                throughout the year rather than arriving as a single examination.
                Spoken English, computer education and Islamic education sit
                alongside the core subjects. Physical activity, exhibitions,
                competitions and environmental work are planned deliberately rather
                than left to chance.
              </p>
              <p>
                Underneath all of it is a commitment to character, manners, moral
                values, tolerance, civic responsibility and global citizenship —
                taught alongside respect for the cultural values the school holds
                itself to, in an approach informed by the Quran and Sunnah.
              </p>
              <p>
                The school reopened in {school.status.reopenedIn}.
              </p>
            </Prose>
          </div>
        </div>
      </section>

      {/* Aims vs current */}
      <section aria-labelledby="honesty-heading" className="bg-cream-100">
        <div className="container-page py-20 md:py-28">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
            <div>
              <SectionHeading id="honesty-heading"
                eyebrow="Reading this page carefully"
                title="Educational aims, and what is confirmed today"
                as="h2"
              />
              <div className="mt-8 max-w-2xl">
                <Prose>
                  <p>
                    A school website that does not distinguish between its aims
                    and its current programmes is not telling you much. So this page
                    does distinguish them.
                  </p>
                  <p>
                    Everything in the &ldquo;educational approach&rdquo; column
                    below is taken from the school&apos;s own published profile. It
                    describes what the school sets out to do. It is not a guarantee
                    about a specific syllabus, examination board, timetable or
                    facility in the current session.
                  </p>
                  <p>
                    Where something needs confirming for the present day — a grade
                    offering, a facility, a campus&apos;s operating status — the
                    school says so rather than the site filling the gap.
                  </p>
                </Prose>
              </div>
            </div>

            <div className="lg:pt-2">
              <div className="rounded-[var(--radius-card)] border border-ink-900/12 bg-cream-50 p-6">
                <h3 className="text-lg">What this page will not claim</h3>
                <ul className="mt-5 flex flex-col gap-3">
                  {[
                    "Any affiliation, accreditation or authorisation",
                    "Any examination board or grades currently offered",
                    "Any ranking, result, success rate or testimonial",
                    "Any staff member's name or qualifications",
                    "Any fee, scholarship or admissions deadline",
                    "Any campus facility, service or opening hours",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-[0.9375rem] leading-relaxed text-warm-600"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-2 size-1.5 shrink-0 rounded-full bg-warm-500/50"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Qualifier>
                  These are not things the site forgot to include. They are things
                  the school has not verified, so publishing them would mean
                  inventing them.
                </Qualifier>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section aria-labelledby="values-heading" className="bg-cream-50">
        <div className="container-page py-20 md:py-28">
          <SectionHeading id="values-heading"
            eyebrow="Values"
            title="What the school says it holds to"
            as="h2"
          />
          <div className="mt-6 max-w-2xl">
            <Qualifier>
              Drawn from the educational philosophy in the school&apos;s published
              profile.
            </Qualifier>
          </div>

          {/* lg:grid-cols-12 so the alternating col-span-7 / col-span-5 items
              below compose asymmetrically. With a plain 3-column grid the spans
              would have nowhere to land. */}
          <div className="mt-14 grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-12">
            {[
              {
                title: "Concept before coverage",
                body: "A child who understands why something works learns it for good. The profile is explicit that education should give conceptual understanding, and that teaching must be based on concept.",
              },
              {
                title: "Assessment that helps",
                body: "Evaluation should act as a positive input for improving teaching and learning, not as a deterrent — and a report should show life skills and attitude, not only marks.",
              },
              {
                title: "Character and manners",
                body: "Manners, morals, tolerance, civic responsibility and global citizenship are treated as outcomes to be developed, alongside respect for the school's own cultural values.",
              },
              {
                title: "Every talent counts",
                body: "The profile names mathematicians, businesspeople, athletes, actuaries and engineers in the same breath. Different interests are assets, not distractions.",
              },
              {
                title: "The teacher matters",
                body: "Teacher motivation and teacher training programmes are part of the school's own account of how it improves, not a footnote.",
              },
              {
                title: "Parents as partners",
                body: "Cooperation with mothers and families is named as part of how a child is supported, extending well past the school gate.",
              },
            ].map((value, index) => (
              /* Asymmetric, not six equal tiles.

                 This was a 3x2 grid of identical cards - the last surviving
                 instance of the template pattern the rest of the site was
                 rebuilt to remove. It is now a numbered editorial list: an
                 oversized ordinal, a wider first column, and a deliberate
                 vertical stagger so the six items read as a composed set with
                 a visual rhythm rather than a matrix. The stagger is applied
                 from the index rather than hard-coded per item, so the content
                 stays an ordinary array.

                 Alternating `sm:col-span-7` / `sm:col-span-5` rather than a
                 fixed 2-column split is what produces the asymmetry; the spans
                 still sum cleanly to 12 at every breakpoint. */
              <article
                key={value.title}
                className={[
                  "border-t border-ink-900/15 pt-6 lg:col-span-7",
                  index % 2 === 1 ? "lg:col-span-5 lg:mt-14" : "",
                ].join(" ")}
              >
                <span
                  aria-hidden="true"
                  className="block font-display text-[2.75rem] leading-none tracking-[-0.03em] text-ink-900/12"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 text-lg">{value.title}</h3>
                <p className="mt-3 max-w-prose text-[0.9375rem] leading-relaxed text-warm-600">
                  {value.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Student development + community */}
      <section aria-labelledby="community-heading" className="bg-ink-900 text-cream-200">
        <div className="container-page py-20 md:py-28">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <SectionHeading id="community-heading"
                eyebrow="Student development"
                title="Academic and human excellence together"
                tone="dark"
                as="h2"
              />
              <div className="mt-8">
                <Prose tone="dark">
                  <p>
                    The school&apos;s profile gives equal importance to academics,
                    co-curricular and extra-curricular activity, and describes these
                    as strategically implemented for overall development rather than
                    left to chance.
                  </p>
                  <p>
                    Physical, intellectual, emotional and social growth are all named.
                    So are life skills, confidence, personality and leadership. The
                    stated intention is to prepare each individual for a career and
                    to equip them with adequate life skills to live it.
                  </p>
                </Prose>
              </div>
            </div>

            <div>
              <SectionHeading
                eyebrow="Community"
                title="A learning community, not just a school"
                tone="dark"
                as="h2"
              />
              <div className="mt-8">
                <Prose tone="dark">
                  <p>
                    The profile describes a community of high tolerance and empathy,
                    and places value on appreciating the host country&apos;s culture
                    while remaining part of a global community.
                  </p>
                  <p>
                    It also names practical commitments: a safe environment, hygiene,
                    child protection, handing children only to parents or authorised
                    persons, respect for others, and motivation towards giving and
                    plantation. These read as intentions the school holds itself to.
                  </p>
                </Prose>
              </div>
            </div>
          </div>

          <div className="mt-14 flex flex-wrap gap-3">
            <ButtonLink href="/admissions" variant="accent">
              Admissions inquiry
            </ButtonLink>
            <ButtonLink href="/learning" variant="quiet">
              How children learn here
            </ButtonLink>
            <ButtonLink href="/story" variant="quiet">
              {history.premise ? "Read the school's story" : "Our story"}
            </ButtonLink>
          </div>

          <p className="mt-10 max-w-3xl text-sm leading-relaxed text-cream-300/60">
            The {coCurricularThemes.length} activity themes and{" "}
            {learningPillars.length} learning aims described across this site come
            from the school&apos;s published profile.{" "}
            {founder.name} founded the school in {history.timeline[0].year}.
          </p>
        </div>
      </section>
    </>
  );
}