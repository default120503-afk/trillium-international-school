import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AdmissionsForm } from "@/components/forms/AdmissionsForm";
import { isDeliveryConfigured } from "@/lib/admissions/delivery";
import { campuses, getOperationalCampuses } from "@/content/campuses";
import { school } from "@/content/school";
import { buildMetadata } from "@/app/layout";

export const metadata: Metadata = buildMetadata({
  title: "Admissions",
  description:
    "Send an admissions inquiry to Trillium International School System, with campuses in Khanpur / Haripur, Khyber Pakhtunkhwa and Rawalpindi, Punjab. Give your child's details and preferred campus.",
  path: "/admissions",
});

export default function AdmissionsPage() {
  // Evaluated server-side; only the boolean reaches the client. No secret or
  // address is exposed to the browser.
  const deliveryConfigured = isDeliveryConfigured();

  return (
    <>
      <PageHero
        eyebrow="Admissions"
        title="Ask about a place for your child"
        lead="Send the school your child's details and your preferred campus. Current arrangements for the session are confirmed by the school directly."
      />

      <section aria-labelledby="form-heading" className="bg-cream-50">
        <div className="container-page py-16 md:py-24">
          <SectionHeading id="form-heading"
            eyebrow="Admissions inquiry"
            title="Tell us about your child"
            as="h2"
          />

          <div className="mt-12">
            <AdmissionsForm deliveryConfigured={deliveryConfigured} />
          </div>
        </div>
      </section>

      {/* What happens next, stated honestly. */}
      <section aria-labelledby="next-heading" className="bg-ink-950 text-cream-200">
        <div className="container-page py-20 md:py-24">
          <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
            <div>
              <SectionHeading id="next-heading"
                eyebrow="What to expect"
                title="How an inquiry is handled"
                tone="dark"
                as="h2"
              />
              <div className="mt-8">
                <ol className="flex flex-col gap-6">
                  {[
                    "Send the inquiry with the child's details and your preferred campus.",
                    "The school reviews it and responds directly with the arrangements relevant to your child.",
                    "Campus availability, class availability and any fee discussion are confirmed at that point, by the school.",
                  ].map((step, index) => (
                    <li key={step} className="flex gap-4">
                      <span className="font-display text-sm text-gold-400">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="text-[0.9375rem] leading-relaxed text-cream-300/80">
                        {step}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <div>
              <SectionHeading
                eyebrow="Before you apply"
                title="What we will not tell you yet"
                tone="dark"
                as="h2"
              />
              <div className="mt-8">
                <ol className="flex flex-col gap-4">
                  {[
                    "Fees — the school has not published a fee structure.",
                    "Deadlines — no admissions deadline has been confirmed.",
                    "Class availability — not confirmed for the current session.",
                    "Scholarships — none is documented, so none is mentioned.",
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
                </ol>
                <p className="mt-8 border-t border-cream-100/12 pt-6 text-sm leading-relaxed text-cream-300/60">
                  All of these are answered directly by {school.name} when you
                  make an inquiry. {/*
                    Was "The school operates campuses at" followed by all
                    campus names joined by "and" - which, with the Rawalpindi
                    campus added, would have claimed the school runs three
                    campuses when two are historical records. The sentence is
                    now built from `status` so it can only ever describe the
                    campuses the owner has confirmed as open.
                  */}
                  The school currently operates at{" "}
                  {getOperationalCampuses()
                    .map((c) => c.name.replace(/^Campus \d+ — /, ""))
                    .join(" and ")}
                  , with earlier locations recorded in the school&apos;s history.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}