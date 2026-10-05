/**
 * Admissions inquiry: validation and submission types.
 * Shared between the client form and the server route so the two can never
 * disagree about what a valid submission is.
 */

export interface AdmissionInquiry {
  parentName: string;
  studentName: string;
  gradeOfInterest: string;
  preferredCampus: string;
  phone: string;
  email: string;
  message: string;
}

export type AdmissionField = keyof AdmissionInquiry;

export type FieldErrors = Partial<Record<AdmissionField, string>>;

export type SubmissionStatus =
  | { state: "idle" }
  | { state: "submitting" }
  | { state: "success"; reference: string }
  | { state: "error"; message: string; deliveryConfigured: boolean };

/** Grade options: free text entry is allowed, these are suggestions only.
 *  The school has not published a fixed grade list, so none is invented here. */
export const gradeSuggestions: string[] = [
  "Nursery / Pre-school",
  "KG",
  "Class 1",
  "Class 2",
  "Class 3",
  "Class 4",
  "Class 5",
  "Class 6",
  "Class 7",
  "Class 8",
  "Class 9",
  "Class 10",
];

/**
 * Validation.
 *
 * Rules are intentionally conservative and Pakistani-format friendly:
 * local mobile numbers are accepted as 03xxxxxxxxx as well as +92 / 0092 forms,
 * and landlines are accepted. Anything that is not plausibly a phone number is
 * rejected rather than silently sent.
 */
const PK_MOBILE = /^03\d{9}$/;

export function normalisePhone(input: string): string {
  return input.replace(/[\s()\-.]/g, "");
}

export function isValidPhone(input: string): boolean {
  const digits = normalisePhone(input);
  if (!/^\+?\d{7,15}$/.test(digits)) return false;
  if (PK_MOBILE.test(digits)) return true;
  // International formats: 92xxxxxxxxx / 0092xxxxxxxxx / +92...
  const stripped = digits.replace(/^\+/, "").replace(/^0092/, "92").replace(/^92/, "0");
  if (PK_MOBILE.test(stripped)) return true;
  // Any other 7-15 digit number is accepted; the school validates on receipt.
  return digits.replace(/\D/g, "").length >= 7;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateInquiry(values: AdmissionInquiry): FieldErrors {
  const errors: FieldErrors = {};

  if (!values.parentName.trim()) {
    errors.parentName = "Enter the parent or guardian's name.";
  } else if (values.parentName.trim().length < 2) {
    errors.parentName = "This name looks too short.";
  }

  if (!values.studentName.trim()) {
    errors.studentName = "Enter the student's name.";
  } else if (values.studentName.trim().length < 2) {
    errors.studentName = "This name looks too short.";
  }

  if (!values.gradeOfInterest.trim()) {
    errors.gradeOfInterest = "Tell us which class or grade you are asking about.";
  }

  if (!values.preferredCampus) {
    errors.preferredCampus = "Choose a preferred campus.";
  }

  const phone = normalisePhone(values.phone);
  if (!phone) {
    errors.phone = "Enter a phone number the school can reach you on.";
  } else if (!isValidPhone(values.phone)) {
    // A FORMAT description, not an example number.
    //
    // This message used to quote a pair of complete sample numbers so a parent
    // would recognise the shape of a valid entry. Those were invented examples
    // for the PARENT's number, not school contact details — but printing a
    // complete, dialable-looking number anywhere on a school website is a
    // liability: it is trivially mistaken for the school's own line by a
    // reader skimming, by a scraper, or by the next person editing this file.
    // Describing the shape of a valid number conveys the same guidance with no
    // digits that could be misread as a school number.
    errors.phone =
      "Enter a valid phone number. Pakistani mobile numbers begin 03 followed by nine digits; you can also use the +92 international form.";
  }

  const email = values.email.trim();
  if (!email) {
    errors.email = "Enter an email address.";
  } else if (!EMAIL_RE.test(email)) {
    errors.email = "Enter a valid email address, for example name@example.com.";
  }

  if (values.message.length > 1500) {
    errors.message = "Please keep your message under 1500 characters.";
  }

  return errors;
}

/** Unused guard: keeps the type exported and referenced. */
export type AdmissionValues = AdmissionInquiry;