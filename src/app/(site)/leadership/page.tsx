import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { SectionHeading, Qualifier } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { Prose } from "@/components/ui/Prose";
import { TrilliumPetal } from "@/components/brand/Marks";
import { founder, school } from "@/content/school";
import { buildMetadata } from "@/app/layout";

export const metadata: Metadata = buildMetadata({
  title: "School Leadership",
  description:
    "An introduction to the leadership of Trillium International School System, and what the school expects of the people teaching its children.",
  path: "/leadership",
});

/**
 * Leadership page.
 *
 * There is NO verified message from a named principal, and none is invented.
 * This page presents a school-level introduction in neutral editorial voice and
 * documents internally (see README) that the principal's message is awaiting
 * approval. The component below is designed so adding an approved message is a
 * single content edit, not a rebuild.
 */
export default function LeadershipPage() {
  return (
    <>
      <PageHero
        eyebrow="School leadership"
        title="An introduction from the school"
        lead="This section carries a message from the school's leadership. It is presented here at school level until an approved message from the school's principal is supplied."
      />

      {/* Message */}
      <section aria-labelledby="message-heading" className="bg-ink-950 text-cream-200">
        <div className="container-page py-20 md:py-28">
          <div className="mx-auto max-w-3xl">
            <div className="flex items-center gap-4">
              <TrilliumPetal className="size-7 shrink-0 text-gold-400" />
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-gold-400">
                Message from the school
              </p>
            </div>

            {/*
              text-display-sm, not md. This band is the only place in the
              codebase that reached for text-display-md, which made this h2
              render at 46px while the other h2 on this very page — and every
              other h2 on the site — renders at 34px. Two headings at the same
              level on one page at two sizes reads as an accident rather than
              a contrast treatment, so it now sits on the shared type scale.
            */}
            <h2 id="message-heading" className="mt-8 text-display-sm text-cream-50">
              A note for families
            </h2>

            <div className="mt-9">
              <Prose tone="dark">
                <p className="text-lg text-cream-200/90">
                  The school&apos;s profile describes a single idea running through
                  its work: that a child should understand what they are learning,
                  and that the adults around them — teachers, parents and the school
                  itself — share responsibility for making that possible.
                </p>
                <p>
                  That is a demanding standard. It means treating assessment as a
                  tool for improving teaching rather than as a threat, keeping
                  physical conditions in a classroom safe and hygienic, protecting
                  children, and working with families rather than around them. It
                  also means taking a child&apos;s confidence, character and
                  curiosity seriously as outcomes in their own right.
                </p>
                <p>
                  The school was founded by {founder.name}, who holds a{" "}
                  {founder.qualification}, and began by travelling door to door so
                  that children in rural communities could attend school at all.
                  That commitment — going to families rather than waiting for them
                  to arrive — remains the clearest thing the school has to say for
                  itself.
                </p>
                <p>
                  Families considering a place are invited to make an inquiry
                  through the admissions form, or to approach the school directly.
                  Current arrangements for the session are confirmed with the
                  school.
                </p>
              </Prose>
            </div>

            <div className="mt-10 border-t border-cream-100/12 pt-7">
              <p className="text-sm text-cream-300/60">
                {school.name} · {school.location.area},{" "}
                {school.location.region}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Approval status — visible, not hidden */}
      <section aria-labelledby="pending-heading" className="bg-cream-100">
        <div className="container-page py-20 md:py-24">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
            <div>
              <SectionHeading id="pending-heading"
                eyebrow="On this section"
                title="A message from the principal is being finalised"
                as="h2"
              />
              <div className="mt-8 max-w-2xl">
                <Prose>
                  <p>
                    School leadership sections normally carry a named principal and
                    their signature. The school has not yet supplied an approved
                    message, so this site does not publish one.
                  </p>
                  <p>
                    Writing a plausible message and attributing it to a real person
                    would be a fabrication — the kind that erodes a school&apos;s
                    credibility the first time it is noticed. The section above is
                    therefore written at school level, says so, and is ready to
                    receive the approved text.
                  </p>
                </Prose>
              </div>
              <div className="mt-8 max-w-2xl">
                <Qualifier>
                  Awaiting school approval: a signed message from the principal,
                  with name, role and photograph supplied by the school.
                </Qualifier>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href="/admissions" variant="primary">
                  Admissions inquiry
                </ButtonLink>
                <ButtonLink href="/contact" variant="secondary">
                  Contact the school
                </ButtonLink>
              </div>
            </div>

            <div className="lg:pt-2">
              <div className="rounded-[var(--radius-card)] border border-ink-900/12 bg-cream-50 p-7">
                <h3 className="text-lg">What the school expects of teachers</h3>
                <ul className="mt-5 flex flex-col gap-3">
                  {[
                    "Motivation and continuous development, including participation in teacher training programmes",
                    "Concept-based teaching rather than coverage",
                    "Assessment used to improve teaching, not to deter",
                    "Equal attention to academic, co-curricular and extra-curricular development",
                    "Care for physical, intellectual, emotional and social growth",
                    "Commitment to safety, hygiene and child protection",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-[0.9375rem] leading-relaxed text-warm-600"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-2 size-1.5 shrink-0 rounded-full bg-gold-600/70"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Qualifier>
                  Expectations drawn from the school&apos;s published profile.
                  Individual staff names and qualifications are not published until
                  the school supplies them.
                </Qualifier>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}