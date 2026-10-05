"use client";

import { useState } from "react";
import { Lightbulb, MessageCircleQuestion, Hammer, Sprout, type LucideIcon } from "lucide-react";
import { useActiveStep } from "@/components/motion/StickySequence";
import { ButtonLink } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";

/**
 * The learning sequence: DISCOVER → QUESTION → CREATE → GROW.
 *
 * WHY THIS IS A SEQUENCE AND NOT FOUR CARDS
 *
 * The four words are not four features. They are four stages of one process,
 * and the process is the actual educational claim the school makes: that a
 * child understands an idea, questions it, makes something with it, and grows
 * from having done so. Laid out as four equal cards, the progression
 * disappears — the reader sees a set, not a journey. Laid out as a scroll-driven
 * sequence, each stage arrives because you got to it, and the word that
 * follows is presented as the consequence of the word before it.
 *
 * Each stage's copy is drawn from the school's published profile. Nothing here
 * claims a programme, a board or a syllabus — the qualifier below the sequence
 * states that explicitly and has done since the QA passes.
 *
 * INTERACTION AND ACCESSIBILITY
 *
 * The sequence is driven by an IntersectionObserver over step sentinels, so it
 * costs nothing per frame and stays correct at any viewport height. Crucially:
 *
 * - EVERY stage is rendered in the DOM at all times. Only its opacity and
 *   vertical position change. Nothing is removed from the accessibility tree,
 *   so a screen reader hears all four stages in order, find-in-page still
 *   matches "CREATE", and the content is fully readable if the observer never
 *   fires.
 * - The four stages are also exposed as a real ordered list (<ol>), which is
 *   the honest semantic for "an ordered process".
 * - The stage names appear as a visible progress rail, so the reader always
 *   knows where they are and how much is left. This is what stops a
 *   scroll-driven section from feeling like something has gone wrong.
 * - Each stage is ALSO reachable by clicking the rail. Scroll-driven
 *   storytelling that can only be driven by scrolling is unusable with a
 *   keyboard, a switch device, or reduced motion, so the rail is a set of real
 *   buttons that scroll to the corresponding step. Under reduced motion the
 *   panel unsticks entirely and every stage simply renders in sequence, in
 *   order, with no interaction required at all.
 */

interface Stage {
  key: string;
  label: string;
  Icon: LucideIcon;
  /** The oversized word. */
  word: string;
  /** One sentence on the stage itself. */
  body: string;
  /** A short "what this looks like" line, kept plainly factual. */
  detail: string;
}

const stages: Stage[] = [
  {
    key: "discover",
    label: "Discover",
    Icon: Lightbulb,
    word: "Discover",
    body: "A child is introduced to an idea and asked to understand it for themselves, rather than to be handed the answer.",
    detail:
      "The school describes teaching as concept-based and child-centred: observation and analytical thinking are treated as skills in their own right.",
  },
  {
    key: "question",
    label: "Question",
    Icon: MessageCircleQuestion,
    word: "Question",
    body: "Understanding an idea produces the next question. Testing a fact is treated as something to be encouraged, not corrected away.",
    detail:
      "The profile names curiosity, research and problem-solving as the results of that approach, not as extras to it.",
  },
  {
    key: "create",
    label: "Create",
    Icon: Hammer,
    word: "Create",
    body: "The question is answered by doing something — building, testing, presenting — which is where understanding becomes real.",
    detail:
      "Exhibitions, annual celebrations and house functions are the school's documented setting for students to show what they can do.",
  },
  {
    key: "grow",
    label: "Grow",
    Icon: Sprout,
    word: "Grow",
    body: "What was made is assessed, reflected on and built on. The report describes a child's growth, not only their score.",
    detail:
      "The school describes evaluation as a positive input for improving teaching and learning, covering life skills, attitude and values alongside the scholastic side.",
  },
];

export function LearningSequence() {
  const { active, stepRefs } = useActiveStep(stages.length);
  const [railFocused, setRailFocused] = useState(false);

  const goToStep = (index: number) => {
    const element = stepRefs.current[index];
    if (!element) return;
    element.scrollIntoView({
      behavior: railFocused ? "auto" : "smooth",
      block: "center",
    });
  };

  return (
    <section
      id="approach"
      aria-labelledby="approach-heading"
      className="scroll-mt-20 bg-ink-900 text-cream-200"
    >
      {/* Heading block, above the sequence. Kept outside the sticky panel so it
          is read once rather than pinned for four screens. */}
      <div className="container-page pb-10 pt-20 md:pt-28">
        <div className="max-w-3xl">
          <p className="mb-4 flex items-center gap-3 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-gold-400">
            <span aria-hidden="true" className="inline-block h-px w-8 shrink-0 bg-current opacity-45" />
            The way we learn
          </p>
          <h2
            id="approach-heading"
            className="text-display-lg font-display leading-[1.05] tracking-[-0.015em] text-cream-50"
          >
            Curiosity becomes confidence when students are encouraged to explore
          </h2>
          {/* max-w-2xl, not full column width. At 13px across a 754px column this
              ran to roughly 116 characters per line, well past the 45-85 band
              where the eye can reliably find the next line. The measure is the
              fix; the text is unchanged. */}
          <p className="mt-7 flex max-w-lg items-start gap-2 text-[0.8125rem] leading-relaxed text-cream-300/70">
            <span aria-hidden="true" className="mt-1.5 size-1.5 shrink-0 rounded-full bg-gold-400/70" />
            <span>
              These four stages describe the approach set out in the
              school&apos;s own published profile. They describe intent and method
              — not a claim that a particular programme, board or syllabus is
              currently running.
            </span>
          </p>
        </div>
      </div>

      {/* -- The sequence ------------------------------------------------- */}
      <div className="relative">
        {/* Progress rail. Also the mobile presentation of the sequence: on
            narrow screens the sticky panel is dropped (see below) and the rail
            sits above a plain stacked list. */}
        <div className="container-page">
          <div
            className="flex items-center gap-1 border-y border-cream-100/12 py-2"
            role="group"
            aria-label="Learning stages"
            onFocus={() => setRailFocused(true)}
            onBlur={() => setRailFocused(false)}
          >
            {stages.map((stage, index) => {
              const isActive = index === active;
              const isPast = index < active;
              return (
                <button
                  key={stage.key}
                  type="button"
                  onClick={() => goToStep(index)}
                  aria-current={isActive ? "step" : undefined}
                  className="group flex min-h-11 flex-1 items-center gap-2.5 px-2 text-left transition-colors duration-[var(--dur-base)] sm:gap-3 sm:px-3"
                >
                  <span
                    aria-hidden="true"
                    className={[
                      "h-px flex-1 transition-colors duration-[var(--dur-slow)] ease-[var(--ease-out-soft)]",
                      isPast
                        ? "bg-gold-500"
                        : isActive
                          ? "bg-gold-400"
                          : "bg-cream-100/20 group-hover:bg-cream-100/40",
                    ].join(" ")}
                  />
                  <span
                    className={[
                      "shrink-0 whitespace-nowrap text-[0.6875rem] font-semibold uppercase tracking-[0.16em] transition-colors duration-[var(--dur-base)]",
                      isActive
                        ? "text-gold-400"
                        : isPast
                          ? "text-cream-300/70"
                          : "text-cream-300/45",
                    ].join(" ")}
                  >
                    <span className="hidden sm:inline">{stage.label}</span>
                    <span className="sm:hidden">{String(index + 1).padStart(2, "0")}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sentinels: full-height markers the observer watches. They carry no
            content, so they never affect layout or reading order.

            ZERO HEIGHT BELOW lg IS LOAD-BEARING, NOT COSMETIC. The sticky
            panel is `hidden lg:block`, so at 1023px and under there is no
            pinned panel for these markers to drive — they were still
            reserving `4 x 70svh`, which measured as 2363px at 390x844 and
            2867px at 768x1024: 2.8 full screens of blank scroll between the
            progress rail and the first word of actual content. A mobile
            visitor scrolled through two and a half empty screens before
            reading anything. Collapsing them to 0 below lg removes that dead
            distance entirely and leaves the stacked list to start right after
            the rail.

            Under reduced motion they collapse at EVERY width, because
            otherwise the reader would scroll through four empty screens of
            nothing — the exact outcome reduced motion exists to prevent. */}
        <div aria-hidden="true" className="pointer-events-none">
          {stages.map((stage, index) => (
            <div
              key={stage.key}
              ref={(node) => {
                stepRefs.current[index] = node;
              }}
              data-step-index={index}
              /* h-0 below lg because there is no pinned panel there to drive (see above).
                     lg:h-[80svh] preserves the authored desktop track height.
                     `motion-reduce:!h-0` rather than a plain variant: two
                     Tailwind variants of equal specificity resolve by their
                     order in the generated stylesheet, not by their order in
                     this class attribute, so the reduced-motion rule needs the
                     `!` to be certain of winning at desktop widths. */
              className="h-0 lg:h-[80svh] motion-reduce:!h-0"
            />
          ))}
        </div>

        {/* -- Desktop: sticky panel -------------------------------------- */}
        {/* The panel is `hidden` on small screens, where the stacked list
            below is used instead. Using display rather than opacity means a
            mobile reader is never served a pinned panel they cannot escape.

            It is also aria-hidden, and that is load-bearing rather than
            cosmetic. Both the panel and the stacked list below carry all four
            stages, because CSS alone cannot cross-fade content that sits in two
            different layout contexts. Left both exposed, a screen reader would
            hear Discover/Question/Create/Grow twice.

            So exactly ONE copy is in the accessibility tree: the stacked list,
            which is the canonical, always-correct rendering. The panel is the
            enhanced presentation of that same content, hidden from assistive
            technology. This holds at every viewport width and under reduced
            motion, because it is a static attribute rather than something
            recalculated as the breakpoint changes — a scroll- or
            resize-driven aria-hidden swap would leave the tree briefly wrong,
            and would be exactly the kind of state a screen reader could get
            stranded in. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden lg:block motion-reduce:hidden"
        >
          <div className="sticky top-0 flex h-[100svh] items-center">
            <div className="container-page w-full">
              <ol className="relative grid grid-cols-[1fr_1.1fr] items-center gap-16">
                {/* Stage index — the oversized word that changes. */}
                <li className="relative">
                  <div className="relative h-[22rem]">
                    {stages.map((stage, index) => (
                      <div
                        key={stage.key}
                        aria-hidden={index !== active}
                        className="absolute inset-0 flex flex-col justify-center transition-all duration-[var(--dur-slow)] ease-[var(--ease-in-out)] motion-reduce:transition-none"
                        style={{
                          opacity: index === active ? 1 : 0,
                          transform:
                            index === active
                              ? "translate3d(0,0,0)"
                              : index < active
                                ? "translate3d(0,-24px,0)"
                                : "translate3d(0,24px,0)",
                          // Visibility is switched at the midpoint of the
                          // transition so the outgoing stage is never
                          // focusable or read out of order.
                          visibility:
                            index === active ? "visible" : "hidden",
                          transitionDelay: index === active ? "0ms" : "60ms",
                        }}
                      >
                        <span className="flex items-center gap-3 text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-gold-400">
                          <span aria-hidden="true">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span aria-hidden="true" className="h-px w-10 bg-current opacity-40" />
                          {stage.label}
                        </span>
                        <p className="mt-6 font-display text-[5.5rem] leading-[0.88] tracking-[-0.03em] text-cream-50 xl:text-[7rem]">
                          {stage.word}
                        </p>
                      </div>
                    ))}
                  </div>
                </li>

                {/* Stage detail. */}
                <li className="relative">
                  <div className="relative min-h-[16rem]">
                    {stages.map((stage, index) => {
                      const Icon = stage.Icon;
                      return (
                        <div
                          key={stage.key}
                          aria-hidden={index !== active}
                          className="absolute inset-0 transition-all duration-[var(--dur-slow)] ease-[var(--ease-in-out)] motion-reduce:transition-none"
                          style={{
                            opacity: index === active ? 1 : 0,
                            transform:
                              index === active
                                ? "translate3d(0,0,0)"
                                : index < active
                                  ? "translate3d(-18px,0,0)"
                                  : "translate3d(18px,0,0)",
                            visibility: index === active ? "visible" : "hidden",
                            transitionDelay: index === active ? "80ms" : "0ms",
                          }}
                        >
                          <Icon
                            className="size-7 text-gold-400"
                            aria-hidden="true"
                          />
                          <p className="mt-6 max-w-lg text-xl leading-relaxed text-cream-100">
                            {stage.body}
                          </p>
                          <p className="mt-6 max-w-lg border-l-2 border-gold-500/50 pl-5 text-[0.9375rem] leading-relaxed text-cream-300/75">
                            {stage.detail}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  {/*
                    No CTAs inside this panel. It is aria-hidden, and a
                    focusable control inside an aria-hidden subtree is a real
                    defect: it stays in the tab order while being invisible to
                    assistive technology, so a keyboard user would land on a
                    button a screen reader never announced. The equivalent
                    links are in the canonical stacked list below, which is
                    where the accessible copy lives.
                  */}
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* -- Canonical content: the same four stages, stacked --------------
          This is the copy that lives in the accessibility tree, and it is
          ALWAYS rendered. On mobile it is what you see. At desktop widths it
          carries `lg:sr-only`, so it stays in the tree — reachable by a screen
          reader and by find-in-page — while the sticky panel provides the
          visual presentation.

          `lg:sr-only` rather than `lg:hidden` is the critical detail. Using
          display:none here would remove this content from the accessibility
          tree entirely at desktop widths, and because the sticky panel is
          aria-hidden, a screen-reader user on a desktop browser would then find
          the section contains nothing but four stage-name buttons. Visually
          hidden but present is the only version of this that is correct at
          every width. */}
      <div className="container-page py-20 lg:sr-only motion-reduce:lg:not-sr-only">
        <ol className="flex flex-col">
          {stages.map((stage, index) => {
            const Icon = stage.Icon;
            return (
              <li
                key={stage.key}
                className="border-t border-cream-100/15 py-10 first:border-t-0 first:pt-0"
              >
                <span className="flex items-center gap-3 text-[0.6875rem] font-semibold tracking-[0.2em] text-gold-400 uppercase">
                  <span aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span aria-hidden="true" className="h-px w-10 bg-current opacity-40" />
                  {stage.label}
                </span>
                <h3 className="mt-5 font-display text-4xl leading-none tracking-[-0.02em] text-cream-50">
                  {stage.word}
                </h3>
                <Icon className="mt-6 size-6 text-gold-400" aria-hidden="true" />
                <p className="mt-4 text-lg leading-relaxed text-cream-100">
                  {stage.body}
                </p>
                <p className="mt-4 border-l-2 border-gold-500/50 pl-5 text-[0.9375rem] leading-relaxed text-cream-300/75">
                  {stage.detail}
                </p>
              </li>
            );
          })}
        </ol>
        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href="/learning" variant="accent">
            How children learn here
            <ArrowRight className="size-4" aria-hidden="true" />
          </ButtonLink>
          <ButtonLink href="/co-curricular" variant="quiet">
            Beyond the classroom
          </ButtonLink>
        </div>
      </div>

      {/* Tall tail so the last stage can scroll past the sticky panel before
          the section ends. Without it the final stage is unreachable on a
          track whose last sentinel sits under the panel.

          The pb is real breathing room, not a gap. This is the longest section
          on the page, and it hands off to a dark full-bleed story band; the
          transition deserves white space rather than butting straight up
          against it. */}
      <div
        aria-hidden="true"
        className="hidden pb-20 lg:block motion-reduce:hidden"
        style={{ height: "40svh" }}
      />
    </section>
  );
}
