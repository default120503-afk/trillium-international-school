"use client";

import { useId, useRef, useState } from "react";
import { AlertCircle, CheckCircle2, Info, Loader2, Send } from "lucide-react";
import { campuses } from "@/content/campuses";
import { social, contactUnavailableNotice, contact, telHref, whatsappHref } from "@/content/contact";
import {
  gradeSuggestions,
  validateInquiry,
  type AdmissionInquiry,
  type FieldErrors,
  type SubmissionStatus,
} from "@/lib/admissions/schema";

const EMPTY: AdmissionInquiry = {
  parentName: "",
  studentName: "",
  gradeOfInterest: "",
  preferredCampus: "",
  phone: "",
  email: "",
  message: "",
};

const ENDPOINT = process.env.NEXT_PUBLIC_ADMISSIONS_ENDPOINT_PATH || "/api/admissions";

/**
 * Admissions inquiry form.
 *
 * Behaviour contract:
 *  - Native + server-side validation; errors appear next to the field and are
 *    wired with aria-describedby / aria-invalid.
 *  - A single in-flight guard prevents duplicate submission (the button is
 *    disabled and the handler returns early).
 *  - Success is rendered ONLY when the server responds 201 with delivered:true.
 *    Any other outcome shows the honest failure state.
 */
export function AdmissionsForm({ deliveryConfigured }: { deliveryConfigured: boolean }) {
  const uid = useId();
  const [values, setValues] = useState<AdmissionInquiry>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<SubmissionStatus>({ state: "idle" });
  const inFlight = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);

  const field = (name: string) => `${uid}-${name}`;
  const errorId = (name: keyof AdmissionInquiry) => `${uid}-${name}-error`;

  function update(name: keyof AdmissionInquiry, value: string) {
    setValues((prev) => ({ ...prev, [name]: value }));
    // Clear a field's error as soon as the user edits it.
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
    if (status.state === "error") setStatus({ state: "idle" });
  }

  function handleBlur(name: keyof AdmissionInquiry) {
    // Validate a single field on blur, once it has been touched.
    if (!values[name]) return;
    const next = validateInquiry(values);
    setErrors((prev) => ({ ...prev, [name]: next[name] }));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
      event.preventDefault();
      if (inFlight.current) return; // duplicate-submission guard

      const focusFirstError = (fieldErrors: FieldErrors) => {
        const firstKey = Object.keys(fieldErrors)[0] as keyof AdmissionInquiry | undefined;
        if (!firstKey) return;
        formRef.current
          ?.querySelector<HTMLElement>(`#${CSS.escape(field(firstKey))}`)
          ?.focus();
      };

      const nextErrors = validateInquiry(values);
      setErrors(nextErrors);
      if (Object.keys(nextErrors).length > 0) {
        // Move focus to the first invalid field so keyboard users are not stranded.
        focusFirstError(nextErrors);
        return;
      }

    inFlight.current = true;
    setStatus({ state: "submitting" });

    try {
      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, website: "" }),
      });

      const data = (await response.json().catch(() => ({}))) as {
        delivered?: boolean;
        reference?: string;
        error?: string;
        fieldErrors?: FieldErrors;
        deliveryConfigured?: boolean;
      };

      if (response.status === 201 && data.delivered === true) {
        setStatus({ state: "success", reference: data.reference ?? "" });
        setValues(EMPTY);
        return;
      }

      if (data.fieldErrors) {
        setErrors(data.fieldErrors);
        // Server-side validation can fail on input that passed the client
        // check. Without this the errors appear above a still-focused submit
        // button, which strands keyboard and screen-reader users (WCAG 3.3.1).
        focusFirstError(data.fieldErrors);
      }

      // Not delivered. Say so plainly, and offer the route that does work.
      const notConfigured = response.status === 503 || data.deliveryConfigured === false;
      setStatus({
        state: "error",
        message:
          data.error ??
          "Your inquiry could not be sent. Please try again, or contact the school through another route below.",
        deliveryConfigured: !notConfigured,
      });
    } catch {
      setStatus({
        state: "error",
        message:
          "The inquiry could not be sent — the network request failed. Please check your connection and try again, or contact the school through another route below.",
        deliveryConfigured,
      });
    } finally {
      inFlight.current = false;
    }
  }

  const submitting = status.state === "submitting";
  const describedBy = (name: keyof AdmissionInquiry) => {
    // The hint is a genuine description of the control ("Mobile or
    // landline."). Without this reference it sits in the DOM unannounced.
    const parts = [
      errors[name] ? errorId(name) : undefined,
      `${field(name)}-hint`,
    ].filter(Boolean);
    return parts.length ? parts.join(" ") : undefined;
  };

  const inputClass = (name: keyof AdmissionInquiry) =>
    [
      "min-h-11 w-full rounded-[4px] border bg-cream-50 px-3.5 py-2.5 text-[0.9375rem] text-warm-800",
      "transition-colors placeholder:text-warm-500/60",
      errors[name]
        ? "border-danger-600 bg-danger-100/40"
        : "border-ink-900/18 hover:border-ink-900/35",
      "focus:border-ink-700",
    ].join(" ");

  return (
    <div className="grid gap-10 lg:grid-cols-[1.35fr_1fr] lg:gap-14">
      <div>
        <form ref={formRef} onSubmit={onSubmit} noValidate className="min-w-0">
          {/* Overall status region, announced to assistive tech. */}
          <div aria-live="polite" aria-atomic="true">
            {status.state === "error" ? (
              <div
                className="mb-8 flex gap-3 rounded-[var(--radius-card)] border border-danger-600/35 bg-danger-100/50 p-4"
              >
                <AlertCircle
                  className="mt-0.5 size-5 shrink-0 text-danger-600"
                  aria-hidden="true"
                />
                <div>
                  <p className="font-medium text-danger-600">
                    Your inquiry was not sent
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-warm-700">
                    {status.message}
                  </p>
                  {!status.deliveryConfigured ? (
                    <p className="mt-3 text-sm leading-relaxed text-warm-700">
                      <span className="font-medium">
                        How to reach the school instead:
                      </span>{" "}
                      {contact.phone ? (
                        <>
                          call{" "}
                          <a
                            href={telHref(contact.phone)}
                            className="link-prose font-medium"
                          >
                            {contact.phone}
                          </a>
                          , message on{" "}
                          <a
                            href={whatsappHref(contact.whatsapp ?? contact.phone) ?? "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="link-prose font-medium"
                          >
                            WhatsApp
                            <span className="sr-only"> (opens in a new tab)</span>
                          </a>
                          , or use{" "}
                        </>
                      ) : (
                        contactUnavailableNotice + " "
                      )}
                      {social
                        .filter((s) => s.id === "facebook")
                        .map((s) => (
                          <a
                            key={s.id}
                            href={s.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="link-prose font-medium"
                          >
                            the school&apos;s official Facebook page
                          </a>
                        ))}
                      , or ask at the campus.
                    </p>
                  ) : null}
                </div>
              </div>
            ) : null}

            {status.state === "success" ? (
              <div
                role="status"
                className="mb-8 flex gap-3 rounded-[var(--radius-card)] border border-success-600/35 bg-success-100/60 p-4"
              >
                <CheckCircle2
                  className="mt-0.5 size-5 shrink-0 text-success-600"
                  aria-hidden="true"
                />
                <div>
                  <p className="font-medium text-success-600">
                    Inquiry delivered to the school
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-warm-700">
                    The school has received your inquiry
                    {status.reference ? (
                      <>
                        {" "}
                        under reference{" "}
                        <span className="font-mono text-[0.8125rem]">
                          {status.reference}
                        </span>
                      </>
                    ) : null}
                    . Please expect a reply from the school directly.
                  </p>
                </div>
              </div>
            ) : null}
          </div>

          {!deliveryConfigured && status.state !== "success" ? (
            <p className="mb-8 flex gap-3 rounded-[var(--radius-card)] border border-gold-600/30 bg-gold-300/20 p-4 text-sm leading-relaxed text-warm-700">
              <Info className="mt-0.5 size-5 shrink-0 text-gold-700" aria-hidden="true" />
              <span>
                <span className="font-medium">
                  Delivery is not yet active on this site.
                </span>{" "}
                The form validates your details, but no inquiry channel has been
                connected to the school yet, so submitting will report honestly
                that it could not send. Please use the contact route alongside
                this form in the meantime.
              </span>
            </p>
          ) : null}

          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              id={field("parentName")}
              errorId={errorId("parentName")}
              label="Parent / Guardian name"
              error={errors.parentName}
              required
            >
              <input
                id={field("parentName")}
                name="parentName"
                type="text"
                autoComplete="name"
                value={values.parentName}
                onChange={(e) => update("parentName", e.target.value)}
                onBlur={() => handleBlur("parentName")}
                aria-required="true"
                aria-invalid={Boolean(errors.parentName)}
                aria-describedby={describedBy("parentName")}
                aria-disabled={submitting || undefined}
                className={inputClass("parentName")}
              />
            </Field>

            <Field
              id={field("studentName")}
              errorId={errorId("studentName")}
              label="Student name"
              error={errors.studentName}
              required
            >
              <input
                id={field("studentName")}
                name="studentName"
                type="text"
                autoComplete="off"
                value={values.studentName}
                onChange={(e) => update("studentName", e.target.value)}
                onBlur={() => handleBlur("studentName")}
                aria-required="true"
                aria-invalid={Boolean(errors.studentName)}
                aria-describedby={describedBy("studentName")}
                aria-disabled={submitting || undefined}
                className={inputClass("studentName")}
              />
            </Field>

            <Field
              id={field("gradeOfInterest")}
              errorId={errorId("gradeOfInterest")}
              label="Class / grade of interest"
              error={errors.gradeOfInterest}
              required
            >
              <input
                id={field("gradeOfInterest")}
                name="gradeOfInterest"
                type="text"
                list={field("grade-list")}
                autoComplete="off"
                value={values.gradeOfInterest}
                onChange={(e) => update("gradeOfInterest", e.target.value)}
                onBlur={() => handleBlur("gradeOfInterest")}
                aria-required="true"
                aria-invalid={Boolean(errors.gradeOfInterest)}
                aria-describedby={describedBy("gradeOfInterest")}
                aria-disabled={submitting || undefined}
                className={inputClass("gradeOfInterest")}
              />
              <datalist id={field("grade-list")}>
                {gradeSuggestions.map((g) => (
                  <option key={g} value={g} />
                ))}
              </datalist>
            </Field>

            <Field
              id={field("preferredCampus")}
              errorId={errorId("preferredCampus")}
              label="Preferred campus"
              error={errors.preferredCampus}
              required
            >
              <select
                id={field("preferredCampus")}
                name="preferredCampus"
                value={values.preferredCampus}
                onChange={(e) => update("preferredCampus", e.target.value)}
                onBlur={() => handleBlur("preferredCampus")}
                aria-required="true"
                aria-invalid={Boolean(errors.preferredCampus)}
                aria-describedby={describedBy("preferredCampus")}
                aria-disabled={submitting || undefined}
                className={[inputClass("preferredCampus"), "appearance-none"].join(" ")}
              >
                <option value="">Select a campus</option>
                {campuses.map((campus) => (
                  <option key={campus.id} value={campus.id}>
                    {campus.name} — {campus.locationNote}
                  </option>
                ))}
              </select>
            </Field>

            <Field
              id={field("phone")}
              errorId={errorId("phone")}
              label="Phone number"
              error={errors.phone}
              required
              hint="Your number, so the school can reach you."
            >
              <input
                id={field("phone")}
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="03XX XXXXXXX"
                value={values.phone}
                onChange={(e) => update("phone", e.target.value)}
                onBlur={() => handleBlur("phone")}
                aria-required="true"
                aria-invalid={Boolean(errors.phone)}
                aria-describedby={describedBy("phone")}
                aria-disabled={submitting || undefined}
                className={inputClass("phone")}
              />
            </Field>

            <Field
              id={field("email")}
              errorId={errorId("email")}
              label="Email address"
              error={errors.email}
              required
            >
              <input
                id={field("email")}
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="name@example.com"
                value={values.email}
                onChange={(e) => update("email", e.target.value)}
                onBlur={() => handleBlur("email")}
                aria-required="true"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={describedBy("email")}
                aria-disabled={submitting || undefined}
                className={inputClass("email")}
              />
            </Field>
          </div>

          <div className="mt-5">
            <Field
              id={field("message")}
              errorId={errorId("message")}
              label="Message"
              error={errors.message}
              hint="Optional. Anything the school should know."
            >
              <textarea
                id={field("message")}
                name="message"
                rows={5}
                value={values.message}
                onChange={(e) => update("message", e.target.value)}
                onBlur={() => handleBlur("message")}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={describedBy("message")}
                aria-disabled={submitting || undefined}
                className={[inputClass("message"), "resize-y"].join(" ")}
              />
            </Field>
          </div>

          {/*
            Honeypot. Visually hidden with sr-only rather than aria-hidden, and
            kept out of the tab order, so it is not a programmatically focusable
            node hiding inside an aria-hidden subtree where voice-control users
            could still reach it.
          */}
          <div className="sr-only">
            <label htmlFor={field("website")}>
              Leave this field empty
            </label>
            <input
              id={field("website")}
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              defaultValue=""
            />
          </div>

          <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center">
            <button
              type="submit"
              aria-disabled={submitting || undefined}
              className={[
                "inline-flex min-h-12 items-center justify-center gap-2 rounded-[4px] px-7",
                "bg-ink-800 text-cream-50 transition-colors hover:bg-ink-700",
                "disabled:cursor-not-allowed disabled:opacity-60",
              ].join(" ")}
            >
              {submitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  Sending…
                </>
              ) : (
                <>
                  <Send className="size-4" aria-hidden="true" />
                  Send inquiry
                </>
              )}
            </button>
            <p className="text-sm text-warm-500">
              {submitting
                ? "Submitting your inquiry…"
                : "The school will respond directly."}
            </p>
          </div>
        </form>
      </div>

      {/* Alternative routes, shown beside the form so a blocked delivery is
          never a dead end. */}
      <aside aria-labelledby="alt-contact-heading" className="lg:pt-2">
        <div className="rounded-[var(--radius-card)] border border-ink-900/12 bg-cream-100 p-6">
          <h3 id="alt-contact-heading" className="text-lg">
            Other ways to reach the school
          </h3>
          <ul className="mt-5 flex flex-col gap-4">
            {/* The verified mobile number, listed first and clickable. Shown
                here so a family whose inquiry could not be delivered has an
                immediate, actionable route that does not depend on the form
                working at all. */}
            {contact.phone ? (
              <li>
                <a
                  href={telHref(contact.phone)}
                  className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-ink-700 underline decoration-gold-500/60 underline-offset-4 hover:decoration-gold-500"
                >
                  Call {contact.phone}
                </a>
              </li>
            ) : null}

            {contact.whatsapp && whatsappHref(contact.whatsapp) ? (
              <li>
                <a
                  href={whatsappHref(contact.whatsapp) as string}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-ink-700 underline decoration-gold-500/60 underline-offset-4 hover:decoration-gold-500"
                >
                  Message on WhatsApp
                  <span className="font-normal text-warm-500">(opens in a new tab)</span>
                </a>
              </li>
            ) : null}

            {social.map((s) => (
              <li key={s.id}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-ink-700 underline decoration-gold-500/60 underline-offset-4 hover:decoration-gold-500"
                >
                  {s.label}
                  <span className="font-normal text-warm-500">(opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
          {/*
            Shown only when NOTHING is verified. Now that the school has
            supplied a mobile number, this block does not render — and it must
            not, because its wording says direct details are unavailable, which
            would no longer be true.
          */}
          {!contact.phone && !contact.email && !contact.whatsapp ? (
            <p className="mt-5 border-t border-ink-900/10 pt-5 text-sm leading-relaxed text-warm-600">
              {contactUnavailableNotice}
            </p>
          ) : null}
          <p className="mt-5 border-t border-ink-900/10 pt-5 text-xs leading-relaxed text-warm-500">
            We publish contact details only once the school has verified them.
            The mobile number above is the school&apos;s own. An email address,
            postal address and office hours have not been supplied, so none are
            shown. Nothing is invented to fill a gap.
          </p>
        </div>
      </aside>
    </div>
  );
}

function Field({
  id,
  errorId,
  label,
  error,
  hint,
  required,
  children,
}: {
  id: string;
  errorId: string;
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="block text-sm font-medium text-ink-900">
        {label}
        {required ? (
          <span className="ml-1 text-danger-600" aria-hidden="true">
            *
          </span>
        ) : null}
        {required ? <span className="sr-only"> (required)</span> : null}
      </label>
      {/*
        The hint slot is ALWAYS rendered, with a fixed height, even when there
        is no hint text. Fields sit in a two-column grid; without the reserved
        slot, the field carrying a hint pushed its input down and the control
        next to it in the same visual row ended up ~20px out of alignment.
        `aria-hidden` keeps an empty spacer out of the accessibility tree.
      */}
      <p
        id={`${id}-hint`}
        aria-hidden={hint ? undefined : "true"}
        className={[
          "mt-1 min-h-4 text-xs leading-4 text-warm-500",
          hint ? "" : "invisible",
        ].join(" ")}
      >
        {hint ?? "\u00A0"}
      </p>
      <div className="mt-1.5">{children}</div>
      {error ? (
        <p
          id={errorId}
          role="alert"
          className="mt-1.5 flex items-start gap-1.5 text-sm text-danger-600"
        >
          <AlertCircle className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </p>
      ) : null}
    </div>
  );
}