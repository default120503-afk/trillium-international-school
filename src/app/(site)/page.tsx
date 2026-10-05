import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { Hero, ScrollTransition } from "@/components/home/HomeHero";
import { LearningSequence } from "@/components/home/LearningSequence";
import { StoryTimeline } from "@/components/home/StoryTimeline";
import { UniformSequence } from "@/components/home/UniformSequence";
import { CampusSelector } from "@/components/home/CampusSelector";
import { Reveal } from "@/components/motion/Reveal";
import { RevealWords } from "@/components/motion/RevealWords";
import { ButtonLink } from "@/components/ui/Button";
import { TrilliumPetal } from "@/components/brand/Marks";
import { PetalField } from "@/components/brand/BrandArt";
import { school } from "@/content/school";
import { coCurricularThemes, reasonsToJoin } from "@/content/programmes";
import { contact, telHref } from "@/content/contact";
import { buildMetadata } from "@/app/layout";

export const metadata: Metadata = buildMetadata({
  title: "Where Curiosity Meets Character",
  description:
    "Trillium International School System, Khanpur / Haripur, Khyber Pakhtunkhwa: a school founded on concept-based learning, character and access to quality education for rural communities.",
  path: "/",
});

/**
 * Homepage.
 *
 * NARRATIVE RHYTHM — the section order is the design.
 *
 * The previous version ran: heading+prose, dark card grid, image+text, dark
 * grid, numbered grid, card grid, CTA card. Every section was the same
 * rectangle with different words in it, so the page had rhythm in the sense of
 * a metronome and no rhythm in the sense of a story.
 *
 * The order now is:
 *   1. Cinematic dark hero        — arrival. Dark, oversized, deep.
 *   2. "Learning begins with a question." — the hand-off, and a breath.
 *   3. The school, in prose        — light, calm, the first place a parent
 *                                    actually reads.
 *   4. DISCOVER → GROW (sequence)  — the dark scroll-driven centrepiece.
 *   5. Story, 2014 → today        — the spine fills as you read.
 *   6. Why Trillium                — evidence, not adjectives.
 *   7. Beyond the classroom        — sticky label against a moving list.
 *   8. Campuses                    — the typographic selector.
 *   9. Admissions                  — full-bleed close.
 *
 * The tonal alternation is deliberate and is the main anti-"card grid" device:
 * dark → light → dark → dark → light → light → light → dark. Two adjacent dark
 * sections (4 and 5) are separated by the curved boundary so they read as two
 * chapters rather than one long block.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <ScrollTransition />

      {/* -- The school, in prose ----------------------------------------
          The first light section after the hero. It gets MORE air than the
          sections that follow (md:py-32 rather than md:py-28) because it is the
          page's entry into the body, not just another block. Three consecutive
          sections previously shared an identical py-20/md:py-28, which read as
          a metronome rather than as composition. */}
      <section aria-labelledby="intro-heading" className="bg-cream-50">
        <div className="container-page py-24 md:py-32">
          <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <Reveal as="p" variant="fade" size="sm">
                <span className="mb-4 flex items-center gap-3 text-[0.6875rem] font-semibold tracking-[0.18em] text-ink-700 uppercase">
                  <span aria-hidden="true" className="inline-block h-px w-8 shrink-0 bg-current opacity-45" />
                  The school
                </span>
              </Reveal>
              <RevealWords
                as="h2"
                id="intro-heading"
                text="A school built around how children actually learn"
                delay={70}
                className="block text-display-sm font-display leading-[1.08] tracking-[-0.015em] text-ink-900"
              />
              <Reveal variant="fade" size="md" delay={240}>
                <div className="mt-8 rule-gold" aria-hidden="true" />
              </Reveal>
            </div>

            <div className="max-w-2xl">
              <Reveal as="p" variant="soft" size="md">
                <span className="text-lg leading-relaxed text-warm-700 sm:text-xl">
                  {school.name} is a school system in {school.location.area},{" "}
                  {school.location.region}. Its published profile describes
                  teaching that is child-centred and concept-based: children are
                  asked to understand an idea, observe what happens, and think it
                  through — rather than simply memorise an answer.
                </span>
              </Reveal>
              <Reveal as="p" variant="soft" size="md" delay={80}>
                <span className="mt-6 block leading-relaxed text-warm-600">
                  Alongside that academic grounding, the profile places equal
                  weight on life skills, confidence, personality and leadership.
                  It places weight on spoken English, computer education and
                  Islamic education. And it places weight on the teacher, on the
                  family, and on the simple physical conditions — a safe,
                  hygienic, ventilated room — that make any of this possible.
                </span>
              </Reveal>
              <Reveal as="p" variant="soft" size="md" delay={140}>
                <span className="mt-6 block leading-relaxed text-warm-600">
                  That combination is the school&apos;s own description of itself,
                  taken from its published material rather than assembled from a
                  template.
                </span>
              </Reveal>
              <Reveal variant="rise" size="md" delay={200} className="mt-9 flex flex-wrap gap-3">
                <ButtonLink href="/about" variant="primary">
                  About the school
                  <ArrowRight className="size-4" aria-hidden="true" />
                </ButtonLink>
                <ButtonLink href="/mission-and-vision" variant="secondary">
                  Mission &amp; vision
                </ButtonLink>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* -- The learning sequence --------------------------------------- */}
      <LearningSequence />

      {/* -- Story --------------------------------------------------------- */}
      <StoryTimeline />

      {/* -- Uniform ---------------------------------------------------------
           Inserted here, immediately after the story band and before "Why
           Trillium". The position is tonal, not arbitrary:

           The story section is ink-950, and so is the uniform section, so they
           read as two chapters of one dark movement separated by the curved
           boundary rather than as one long block. Placing uniform after the
           cream "Beyond the classroom" section instead would have produced
           dark -> light -> dark within three sections and read as a strobe.

           It also puts the uniforms between "how the school began" and "why
           choose it": the chapter that shows the school's everyday practice is
           the natural bridge from history to argument.

           The next section (Why Trillium, cream-50) is untouched and follows
           immediately. */}
      <UniformSequence />

      {/* -- Why Trillium --------------------------------------------------
           Evidence, not adjectives. An asymmetric three-item set with a large
           ordinal, rather than six equal cards: three claims stated well
           outrank six stated faintly, and this section's job is credibility,
           not coverage. The full six live on /why-trillium. */}
      <section aria-labelledby="why-heading" className="bg-cream-50">
        <div className="container-page py-20 md:py-28">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <RevealWords
              as="h2"
              id="why-heading"
              text="Reasons that are actually grounded"
              delay={60}
              className="block max-w-xl text-display-sm font-display leading-[1.08] tracking-[-0.015em] text-ink-900"
            />
            <Reveal variant="rise" size="md" delay={160}>
              <ButtonLink href="/why-trillium" variant="secondary" className="shrink-0 self-start md:self-auto">
                Read the full account
                <ArrowRight className="size-4" aria-hidden="true" />
              </ButtonLink>
            </Reveal>
          </div>

          <div className="mt-14 flex flex-col gap-12 md:flex-row md:gap-10">
            {reasonsToJoin.slice(0, 3).map((reason, index) => (
              <Reveal
                key={reason.title}
                variant="rise"
                size="md"
                delay={index * 90}
                className="flex-1 border-t border-ink-900/15 pt-7"
              >
                {/* Oversized ordinal. It reads as an index into the school's
                    own account, which is what these are. */}
                <span
                  aria-hidden="true"
                  className="block font-display text-[3.5rem] leading-none tracking-[-0.03em] text-gold-600/70"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-5 text-xl leading-snug text-ink-900">
                  {reason.title}
                </h3>
                <p className="mt-4 text-[0.9375rem] leading-relaxed text-warm-600">
                  {reason.body}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* -- Beyond the classroom ------------------------------------------
           Sticky label on the left, a numbered list that moves past it on the
           right. The stickiness is the point: the heading stays put while the
           content travels, so the reader is never lost about what section they
           are in. Six items, but they are a single list, not a grid. */}
      <section aria-labelledby="beyond-heading" className="bg-cream-100">
        {/* Extra exit room: the next chapter is a dark full-bleed band, and the
            tonal change needs white space to land in. */}
        <div className="container-page py-24 md:py-36">
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <Reveal as="p" variant="fade" size="sm">
                <span className="mb-4 flex items-center gap-3 text-[0.6875rem] font-semibold tracking-[0.18em] text-ink-700 uppercase">
                  <span aria-hidden="true" className="inline-block h-px w-8 shrink-0 bg-current opacity-45" />
                  Beyond the classroom
                </span>
              </Reveal>
              <RevealWords
                as="h2"
                id="beyond-heading"
                text="What children do as well as what they learn"
                delay={70}
                className="block text-display-sm font-display leading-[1.08] tracking-[-0.015em] text-ink-900"
              />
              <Reveal variant="soft" size="md" delay={200}>
                <p className="mt-7 flex items-start gap-2 text-[0.8125rem] leading-relaxed text-warm-500">
                  <span aria-hidden="true" className="mt-1.5 size-1.5 shrink-0 rounded-full bg-gold-600/70" />
                  <span>
                    Drawn from the school&apos;s published profile. Day-to-day
                    activities are confirmed with the school for the current
                    session.
                  </span>
                </p>
              </Reveal>
              <Reveal variant="rise" size="md" delay={280} className="mt-8">
                <ButtonLink href="/co-curricular" variant="secondary">
                  Explore further
                  <ArrowRight className="size-4" aria-hidden="true" />
                </ButtonLink>
              </Reveal>
            </div>

            <ol className="flex flex-col">
              {coCurricularThemes.map((theme, index) => (
                <li key={theme.title}>
                  <Reveal
                    variant="slide-left"
                    size="md"
                    delay={index * 55}
                    className="group flex gap-6 border-t border-ink-900/12 py-8 first:border-t-0 first:pt-0"
                  >
                    <span
                      aria-hidden="true"
                      className="font-display text-sm text-gold-700"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="text-xl leading-snug text-ink-900">
                        {theme.title}
                      </h3>
                      <p className="mt-3 max-w-xl text-[0.9375rem] leading-relaxed text-warm-600">
                        {theme.body}
                      </p>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* -- Campuses ------------------------------------------------------- */}
      <CampusSelector />

      {/* -- Admissions ------------------------------------------------------
           Full-bleed dark close. NOT a card floating on cream — the section
           runs to the very edges of the viewport, which is what makes the end
           of the page feel like an ending rather than another block. */}
      <section aria-labelledby="cta-heading" className="relative overflow-hidden bg-ink-950">
        {/* Background: the same arc geometry as the hero, mirrored, so the
            page visually closes the loop it opened with. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <PetalField className="absolute -top-24 -left-24 size-[34rem] text-cream-100/[0.05]" count={7} />
          <div className="absolute inset-0 bg-[radial-gradient(90%_70%_at_50%_100%,var(--color-ink-800)_0%,transparent_70%)]" />
        </div>

        <div className="container-page relative py-24 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <Reveal variant="fade" size="md">
              <TrilliumPetal className="mx-auto size-9 text-gold-400" />
            </Reveal>

            <RevealWords
              as="h2"
              id="cta-heading"
              text="Ask us about a place for your child"
              delay={100}
              className="mt-8 block text-display-md font-display leading-[1.06] tracking-[-0.015em] text-cream-50"
            />

            <Reveal as="p" variant="soft" size="md" delay={300}>
              <span className="mx-auto mt-7 block max-w-xl text-lg leading-relaxed text-cream-300/80">
                Send an admissions inquiry with the details of the child you are
                asking about and your preferred campus. The school will respond
                directly.
              </span>
            </Reveal>

            <Reveal variant="rise" size="md" delay={400} className="mt-10 flex flex-wrap justify-center gap-3">
              <ButtonLink href="/admissions" variant="accent" size="lg">
                Begin the conversation
                <ArrowRight className="size-4" aria-hidden="true" />
              </ButtonLink>
              {contact.phone ? (
                <ButtonLink href={telHref(contact.phone)} variant="quiet" size="lg">
                  <Phone className="size-4" aria-hidden="true" />
                  {contact.phone}
                </ButtonLink>
              ) : null}
            </Reveal>

            <Reveal variant="fade" size="md" delay={500}>
              <p className="mt-8 text-sm text-cream-300/55">
                Or read{" "}
                <Link href="/story" className="line-link text-cream-200">
                  how the school began
                  <span aria-hidden="true" className="line-link-underline" />
                </Link>
                .
              </p>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
