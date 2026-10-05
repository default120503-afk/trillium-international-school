import type { Metadata } from "next";
import { Facebook, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { SectionHeading, Qualifier } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { Prose } from "@/components/ui/Prose";
import { TrilliumPetal } from "@/components/brand/Marks";
import {
  contact,
  social,
  contactUnavailableNotice,
  telHref,
  whatsappHref,
} from "@/content/contact";
import { campuses, campusStatusLabel, getOperationalCampuses } from "@/content/campuses";
import { school, founder } from "@/content/school";
import { buildMetadata } from "@/app/layout";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description:
    "How to reach Trillium International School System in Khanpur / Haripur, Khyber Pakhtunkhwa: call or message the school's published mobile number, or send an admissions inquiry.",
  path: "/contact",
});

export default function ContactPage() {
  const wa = contact.whatsapp ? whatsappHref(contact.whatsapp) : null;

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="How to reach the school"
        lead="Call or message the school's published mobile number, or send an admissions inquiry and the school will respond directly with the arrangements relevant to your child."
      />

      <section aria-labelledby="contact-heading" className="bg-cream-50">
        <div className="container-page py-20 md:py-28">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            {/* What we have */}
            <div>
              <SectionHeading id="contact-heading"
                eyebrow="Available now"
                title="Channels you can use today"
                as="h2"
              />

              <ul className="mt-10 flex flex-col">
                {/* The mobile number, presented first because it is the most
                    direct route a family has and the school chose to publish
                    it. Described only as the school's number — never as a
                    landline, office line, admissions hotline or emergency
                    number, none of which has been verified. */}
                {contact.phone ? (
                  <li className="flex gap-4 border-t border-ink-900/15 pt-6 pb-6">
                    <span
                      aria-hidden="true"
                      className="flex size-11 shrink-0 items-center justify-center rounded-[4px] bg-gold-300/30 text-gold-700"
                    >
                      <Phone className="size-5" />
                    </span>
                    <div>
                      <h3 className="text-base">Call the school</h3>
                      <a
                        href={telHref(contact.phone)}
                        className="link-prose mt-1 inline-flex min-h-11 items-center font-display text-lg text-ink-800"
                      >
                        {contact.phone}
                      </a>
                      <p className="text-[0.9375rem] leading-relaxed text-warm-600">
                        The mobile number published by the school for{" "}
                        {school.name}.
                      </p>
                    </div>
                  </li>
                ) : null}

                {wa ? (
                  <li className="flex gap-4 border-t border-ink-900/15 pt-6 pb-6">
                    <span
                      aria-hidden="true"
                      className="flex size-11 shrink-0 items-center justify-center rounded-[4px] bg-gold-300/30 text-gold-700"
                    >
                      <MessageCircle className="size-5" />
                    </span>
                    <div>
                      <h3 className="text-base">Message on WhatsApp</h3>
                      <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-warm-600">
                        The same mobile number, on WhatsApp.
                      </p>
                      <a
                        href={wa}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex min-h-11 items-center gap-2 text-[0.9375rem] font-medium text-ink-700 transition-colors hover:text-ink-600"
                      >
                        Open WhatsApp
                        <span className="sr-only">(opens in a new tab)</span>
                      </a>
                    </div>
                  </li>
                ) : null}

                <li className="flex gap-4 border-t border-ink-900/15 pt-6 pb-6">
                  <span
                    aria-hidden="true"
                    className="flex size-11 shrink-0 items-center justify-center rounded-[4px] bg-gold-300/30 text-gold-700"
                  >
                    <MessageCircle className="size-5" />
                  </span>
                  <div>
                    <h3 className="text-base">Admissions inquiry form</h3>
                    <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-warm-600">
                      The most direct route. Give your child&apos;s details and
                      preferred campus and the school can respond with current
                      arrangements.
                    </p>
                    <div className="mt-4">
                      <ButtonLink href="/admissions" variant="primary">
                        Open the form
                      </ButtonLink>
                    </div>
                  </div>
                </li>

                {social.map((s) => (
                  <li key={s.id} className="flex gap-4 border-t border-ink-900/15 pt-6 pb-6">
                    <span
                      aria-hidden="true"
                      className="flex size-11 shrink-0 items-center justify-center rounded-[4px] bg-gold-300/30 text-gold-700"
                    >
                      <Facebook className="size-5" />
                    </span>
                    <div>
                      <h3 className="text-base">{s.label}</h3>
                      <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-warm-600">
                        The school&apos;s official {s.label} page — the verified
                        social channel published by the school.
                      </p>
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-prose mt-1 inline-flex min-h-11 items-center break-all text-[0.9375rem] font-medium"
                      >
                        {s.href}
                      </a>
                      <p className="mt-1 text-xs text-warm-500">
                        Opens in a new tab.
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* What we do not have */}
            <div>
              <SectionHeading
                eyebrow="Not yet published"
                title="Details the school has not verified"
                as="h2"
              />
              <div className="mt-8">
                <Prose>
                  <p>{contactUnavailableNotice}</p>
                  <p>
                    We would rather leave a gap than fill it with something
                    plausible and wrong. A wrong phone number on a school website
                    costs a family real time.
                  </p>
                </Prose>
              </div>

              {/*
                Only genuinely-missing details are listed here. The mobile
                number is deliberately NOT in this table: it has been verified
                by the school and is published above, so listing it under a
                heading that says "awaiting verification" would state the
                opposite of the truth.
              */}
              <div className="mt-8 rounded-[var(--radius-card)] border border-ink-900/12 bg-cream-100 p-6">
                <h3 className="text-base">Still awaiting verification</h3>
                <ul className="mt-5 flex flex-col gap-3">
                  {[
                    { icon: Mail, label: "Email address", value: contact.email },
                    {
                      icon: MapPin,
                      label: "Full postal address",
                      value: contact.postalAddress,
                    },
                    {
                      icon: MapPin,
                      label: "Map / directions",
                      value: contact.mapUrl,
                    },
                  ].map((row) => {
                    const Icon = row.icon;
                    return (
                      <li
                        key={row.label}
                        className="flex items-center gap-3 border-t border-ink-900/10 pt-3"
                      >
                        <Icon
                          className="size-4 shrink-0 text-warm-500/70"
                          aria-hidden="true"
                        />
                        <span className="text-[0.9375rem] text-warm-700">
                          {row.label}
                        </span>
                        <span className="ml-auto text-sm text-warm-500">
                          {row.value ?? "Not published"}
                        </span>
                      </li>
                    );
                  })}
                </ul>
                <Qualifier>
                  Each of these is a single edit in{" "}
                  <code className="font-mono text-xs">src/content/contact.ts</code>.
                  Once the school confirms a value it appears here and in the
                  footer automatically.
                </Qualifier>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Location summary */}
      <section aria-labelledby="location-heading" className="bg-ink-950 text-cream-200">
        <div className="container-page py-20 md:py-24">
          <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
            <div>
              <SectionHeading id="location-heading"
                eyebrow="Where the school is"
                title={`${school.location.area}, ${school.location.region}`}
                tone="dark"
                as="h2"
              />
              <div className="mt-8">
                <Prose tone="dark">
                  <p>
                    {school.name} operates in {school.location.area},{" "}
                    {school.location.region}, {school.location.country}. Founded by{" "}
                    {founder.name}, {founder.role}.
                  </p>
                  <p>
                    The school&apos;s records list{" "}
                    {campuses.length} campus locations.{" "}
                    {getOperationalCampuses().length === campuses.length
                      ? "Full postal addresses and directions have not been verified by the school, so none are published here."
                      : "Where the school has not supplied a full postal address or directions, none are published here."}
                  </p>
                </Prose>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href="/campuses" variant="quiet">
                  See the campus records
                </ButtonLink>
                {contact.phone ? (
                  <ButtonLink href={telHref(contact.phone)} variant="accent">
                    Call the school
                  </ButtonLink>
                ) : null}
              </div>
            </div>

            <ul className="grid gap-6 sm:grid-cols-2">
              {campuses.map((campus) => (
                <li
                  key={campus.id}
                  className="rounded-[var(--radius-card)] border border-cream-100/15 bg-cream-100/[0.04] p-6"
                >
                  <TrilliumPetal className="size-5 text-gold-400" />
                  <h3 className="mt-4 text-base text-cream-50">{campus.name}</h3>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-cream-300/75">
                    {campus.locationNote}
                  </p>
                  <p className="mt-1 text-[0.9375rem] leading-relaxed text-cream-300/55">
                    {campus.region}
                  </p>
                  {/* Operating status is surfaced here too, because a visitor
                      reading this list has no other way to tell the open
                      campus from the historical ones. The campus model is the
                      single source, so this cannot drift from the campuses
                      page. */}
                  <p className="mt-3 inline-flex items-center gap-2 text-[0.8125rem] text-cream-300/65">
                    <span
                      aria-hidden="true"
                      className={[
                        "size-1.5 rounded-full",
                        campus.status === "operational"
                          ? "bg-success-600"
                          : "bg-warm-500/60",
                      ].join(" ")}
                    />
                    {campusStatusLabel[campus.status]}
                  </p>
                  {/* Only rendered when the owner supplied a map destination.
                      `noopener` is mandatory with target="_blank"; without it
                      the opened page retains a live reference to this one. */}
                  {campus.mapUrl ? (
                    <a
                      href={campus.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="line-link mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-gold-400"
                    >
                      <MapPin className="size-4 shrink-0" aria-hidden="true" />
                      View on Google Maps
                      <span className="sr-only">
                        — {campus.name} (opens in a new tab)
                      </span>
                      <span aria-hidden="true" className="line-link-underline" />
                    </a>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}