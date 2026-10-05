import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { SectionHeading, Qualifier } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { Prose } from "@/components/ui/Prose";
import { TrilliumPetal } from "@/components/brand/Marks";
import { coCurricularThemes } from "@/content/programmes";
import { buildMetadata } from "@/app/layout";

export const metadata: Metadata = buildMetadata({
  title: "Beyond the Classroom",
  description:
    "Student development at Trillium International School System: exhibitions, competitions, physical activity, leadership, environmental awareness and family involvement.",
  path: "/co-curricular",
});

export default function CoCurricularPage() {
  return (
    <>
      <PageHero
        eyebrow="Co-curricular & student development"
        title="A complete person is not defined by marks"
        lead="The school makes this point in its own profile, and then backs it with a list of activities. This page sets out those activities and is careful about which are documented aims and which are confirmed current arrangements."
      />

      {/* Principle */}
      <section aria-labelledby="principle-heading" className="bg-cream-50">
        <div className="container-page py-20 md:py-28">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <SectionHeading id="principle-heading"
              eyebrow="The principle"
              title="Development is a multifaceted process"
              as="h2"
            />
            <div className="max-w-2xl">
              <Prose>
                <p className="text-lg leading-relaxed text-warm-700">
                  The school&apos;s profile states that the development of a child
                  takes place through a multifaceted process, and that extra-
                  curricular activity forms a crucial part of it. Multifaceted
                  interests and talents, it says, are what form a complete person
                  and ensure success in the real world.
                </p>
                <p>
                  It puts it concretely: mathematicians who enjoy, businessmen who
                  play basketball, actuaries who may enjoy, engineers who love
                  elocution. Different interests are assets rather than distractions.
                </p>
                <p>
                  The stated outcome of activity is confidence — participation in
                  inter-school events, and the trophies that follow, described as
                  helping students become more confident and more passionate about
                  the area in which they are skilled.
                </p>
              </Prose>
              <div className="mt-8 max-w-2xl">
                <Qualifier>
                  These themes come from the school&apos;s published profile.
                  The specific activities running in the current session are
                  confirmed with the school.
                </Qualifier>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Themes */}
      <section aria-labelledby="themes-heading" className="bg-ink-900 text-cream-200">
        <div className="container-page py-20 md:py-28">
          <SectionHeading id="themes-heading"
            eyebrow="Activity themes"
            title="What the school describes"
            tone="dark"
            as="h2"
          />

          <ul className="mt-14 grid gap-x-12 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {coCurricularThemes.map((theme, index) => (
              <li key={theme.title} className="border-t border-cream-100/18 pt-7">
                <div className="flex items-center gap-3">
                  <TrilliumPetal className="size-5 shrink-0 text-gold-400/80" />
                  <span className="font-display text-sm text-gold-400">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-5 text-lg text-cream-50">{theme.title}</h3>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-cream-300/75">
                  {theme.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Documented vs current */}
      <section aria-labelledby="current-heading" className="bg-cream-100">
        <div className="container-page py-20 md:py-28">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <SectionHeading id="current-heading"
                eyebrow="Documented in the school profile"
                title="What we can attribute to the school's own material"
                as="h2"
              />
              <div className="mt-8">
                <Prose>
                  <p>
                    The profile describes exhibitions, annual celebrations and house
                    functions where students showcase their talent. It describes
                    inter-school participation and competition. It describes physical
                    activities, environmental and plantation activities, charitable
                    work, family participation, and motivation towards giving.
                  </p>
                  <p>
                    It also names social and cultural integration, and describes the
                    school as a learning community of high tolerance and empathy.
                  </p>
                  <p>
                    These are documented descriptions of the school&apos;s approach.
                    They are not a schedule.
                  </p>
                </Prose>
              </div>
            </div>

            <div>
              <SectionHeading
                eyebrow="Confirmed for the current session"
                title="What we do not claim until the school confirms it"
                as="h2"
              />
              <div className="mt-8">
                <Prose>
                  <p>
                    No current timetable of activities, no list of competitions
                    entered, no exhibition dates, no club or house names, no
                    photographs, and no results are published on this site — because
                    none have been verified.
                  </p>
                  <p>
                    That means the news section is currently empty. An empty,
                    honest news page is preferable to a populated one containing
                    invented events.
                  </p>
                  <p>
                    Families asking what runs in a given term should ask the school
                    directly; the profile describes the intent, and the school will
                    confirm the current arrangements.
                  </p>
                </Prose>
              </div>
              <div className="mt-8">
                <ButtonLink href="/news" variant="secondary">
                  See announcements
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Student protection / values */}
      <section aria-labelledby="character-heading" className="bg-cream-50">
        <div className="container-page py-20 md:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <TrilliumPetal className="mx-auto size-8 text-gold-500" />
            <h2 id="character-heading" className="mt-7 text-display-sm">
              Character, conduct and care
            </h2>
            <div className="mx-auto mt-6 max-w-2xl">
              <Prose>
                <p>
                  Alongside the activities, the school&apos;s profile lists conduct
                  and care as explicit aims: forbidding child abuse, protecting
                  children from abuse, self-protection and respect for others,
                  building leadership and personality, and handing children only to
                  parents or authorised persons.
                </p>
                <p>
                  Those commitments are less visible than an exhibition or a trophy,
                  and considerably more important. They are included here because a
                  school that means them should say them plainly.
                </p>
              </Prose>
            </div>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <ButtonLink href="/admissions" variant="primary">
                Admissions inquiry
              </ButtonLink>
              <ButtonLink href="/learning" variant="secondary">
                Learning &amp; curriculum
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}