import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { SectionHeading, Qualifier } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { Prose } from "@/components/ui/Prose";
import { learningPillars, statusQualifier } from "@/content/programmes";
import { buildMetadata } from "@/app/layout";

export const metadata: Metadata = buildMetadata({
  title: "Learning & Curriculum",
  description:
    "How Trillium International School System describes its approach to teaching: conceptual understanding, continuous evaluation, spoken English, computer education and Islamic education.",
  path: "/learning",
});

export default function LearningPage() {
  const primary = learningPillars.slice(0, 4);
  const secondary = learningPillars.slice(4);

  return (
    <>
      <PageHero
        eyebrow="Learning & curriculum"
        title="Concept first, and everything else built on it"
        lead="The school describes its teaching as concept-based: a child is expected to understand an idea, observe what happens, and reach a conclusion rather than accept one."
      />

      {/* Core method */}
      <section aria-labelledby="method-heading" className="bg-cream-50">
        <div className="container-page py-20 md:py-28">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <SectionHeading id="method-heading"
              eyebrow="The core method"
              title="Understanding before coverage"
              as="h2"
            />
            <div className="max-w-2xl">
              <Prose>
                <p className="text-lg leading-relaxed text-warm-700">
                  This is the load-bearing idea in the school&apos;s profile, and
                  it appears in more than one place in it: teaching is child-centred,
                  education is concept-based, and creativity, research, curiosity and
                  problem-solving are named as the results.
                </p>
                <p>
                  In practice, that means the classroom is organised around
                  understanding. Observation and analytical thinking are treated as
                  skills worth developing in their own right. Children are described
                  as wanting to test facts rather than accept them — and the school
                  gives them several avenues in which to do so.
                </p>
                <p>
                  It also shapes how children are assessed. The profile is unusually
                  clear on this point: evaluation should act as a positive input for
                  improving the teaching-learning process, not as a deterrent, and a
                  report should reflect life skills, personality, behaviour, interests,
                  attitudes and values alongside the scholastic side.
                </p>
              </Prose>
            </div>
          </div>
        </div>
      </section>

      {/* Four pillars, presented as an editorial set rather than equal cards */}
      <section aria-labelledby="pillars-heading" className="bg-cream-100">
        <div className="container-page py-20 md:py-28">
          <SectionHeading id="pillars-heading"
            eyebrow="The approach in practice"
            title="Four things that follow from concept-based teaching"
            as="h2"
          />
          <div className="mt-6 max-w-2xl">
            <Qualifier>
              {statusQualifier.aspiration} — taken from the school&apos;s published
              educational profile.
            </Qualifier>
          </div>

          <div className="mt-14 grid gap-x-12 gap-y-12 sm:grid-cols-2">
            {primary.map((pillar, index) => (
              <article key={pillar.id} className="border-t border-ink-900/15 pt-7">
                <span className="font-display text-sm text-gold-700">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-xl">{pillar.title}</h3>
                <p className="mt-3 leading-relaxed text-warm-600">{pillar.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* What is NOT claimed */}
      <section aria-labelledby="limits-heading" className="bg-ink-950 text-cream-200">
        <div className="container-page py-20 md:py-28">
          <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
            <div>
              <SectionHeading id="limits-heading"
                eyebrow="An important limit"
                title="What this page deliberately does not say"
                tone="dark"
                as="h2"
              />
              <div className="mt-8">
                <Prose tone="dark">
                  <p>
                    The school&apos;s profile records an attempt to affiliate the
                    school system with Cambridge O Level and A Level. That is a
                    recorded aim from the school&apos;s own material.
                  </p>
                  <p>
                    This website does not claim any Cambridge affiliation,
                    accreditation, authorisation or active O Level or A Level
                    offering, because none has been verified for the current session.
                    If and when that changes, it will be published here as a current,
                    verified fact.
                  </p>
                  <p>
                    For the same reason this page states no grade offerings, no
                    current syllabi, no examination boards and no teacher
                    qualifications. A parent reading a curriculum page needs those
                    facts to be accurate more than they need them to be present.
                  </p>
                </Prose>
              </div>
              <div className="mt-8">
                <Qualifier tone="dark">
                  Confirmed programme details for the current session are available
                  directly from the school on request.
                </Qualifier>
              </div>
              <div className="mt-8">
                <ButtonLink href="/admissions" variant="quiet">
                  Ask about current admissions
                </ButtonLink>
              </div>
            </div>

            <div className="lg:pt-14">
              <div className="rounded-[var(--radius-card)] border border-cream-100/15 bg-cream-100/[0.04] p-7">
                <h3 className="text-lg text-cream-50">
                  Also part of the educational profile
                </h3>
                <ul className="mt-6 flex flex-col gap-6">
                  {secondary.map((pillar) => (
                    <li key={pillar.id}>
                      <h4 className="text-[0.9375rem] font-medium text-gold-400">
                        {pillar.title}
                      </h4>
                      <p className="mt-2 text-[0.9375rem] leading-relaxed text-cream-300/72">
                        {pillar.body}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Environment */}
      <section aria-labelledby="environment-heading" className="bg-cream-50">
        <div className="container-page py-20 md:py-28">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
            <div>
              <SectionHeading
                              id="environment-heading"
                              eyebrow="Learning environment"
                title="The room is part of the method"
                as="h2"
              />
              <div className="mt-8 max-w-xl">
                <Prose>
                  <p>
                    The school&apos;s profile describes a safe, hygienic, ventilated
                    environment, with equal importance given to academics,
                    co-curricular and extra-curricular activity. It is worth stating
                    plainly: none of the conceptual teaching described above is
                    possible in a room that is not safe, clean and well aired.
                  </p>
                  <p>
                    The profile also names practical commitments — child protection,
                    handing children only to parents or authorised persons, security
                    and handling procedures. These are the conditions under which
                    the educational aims become real.
                  </p>
                </Prose>
              </div>
            </div>

            <div className="lg:pt-10">
              <div className="rounded-[var(--radius-card)] border border-ink-900/12 bg-cream-100 p-7">
                <h3 className="text-lg">Five things the school says it holds to</h3>
                <ul className="mt-6 flex flex-col gap-4">
                  {[
                    {
                      t: "Concept-based education",
                      d: "Understanding an idea, not just carrying a mark for it.",
                    },
                    {
                      t: "Continuous, comprehensive evaluation",
                      d: "Assessed across the year rather than in a single sitting.",
                    },
                    {
                      t: "Spoken English",
                      d: "To express an idea clearly and to listen with understanding.",
                    },
                    {
                      t: "Computer education",
                      d: "Practical grounding alongside academic work.",
                    },
                    {
                      t: "Islamic education and Nazra",
                      d: "Within an approach informed by the Quran and Sunnah.",
                    },
                  ].map((item) => (
                    <li key={item.t} className="flex gap-3">
                      <span
                        aria-hidden="true"
                        className="mt-2 size-1.5 shrink-0 rounded-full bg-gold-600/70"
                      />
                      <div>
                        <p className="text-[0.9375rem] font-medium text-ink-900">
                          {item.t}
                        </p>
                        <p className="mt-1 text-sm leading-relaxed text-warm-600">
                          {item.d}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <ButtonLink href="/co-curricular" variant="secondary">
                  Beyond the classroom
                </ButtonLink>
                <ButtonLink href="/why-trillium" variant="secondary">
                  Why Trillium
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}