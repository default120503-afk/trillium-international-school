/**
 * Contact and social configuration.
 *
 * EVERY field here is `null` until the school verifies it. Components read
 * these through the helpers below and render NOTHING for an unconfigured
 * value - no invented phone numbers, emails, addresses or map links are ever
 * displayed. To publish a contact detail, replace `null` with the real value.
 */

export interface SocialLink {
  id: string;
  /** Platform name, used as the accessible label. */
  label: string;
  href: string;
  /**
   * True when `href` is the account's permanent permalink. A `/share/`
   * redirect URL is NOT a permalink: it resolves to whichever page was last
   * shared, so it is not a stable identity for the school and must not be
   * emitted as `sameAs` structured data. Defaults to true.
   */
  isPermalink?: boolean;
}

export interface ContactSettings {
  /**
   * The school's official mobile number, as verified by the school.
   *
   * Stored in DISPLAY form, with spacing, exactly as the school supplied it.
   * Dial links are built from `telHref` below rather than by stripping spaces
   * at each call site, so the format is defined once and cannot drift.
   */
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  /** Full postal address - the school has not verified one. */
  postalAddress: string | null;
  /** Coordinates/map URL - deliberately absent; do not fabricate. */
  mapUrl: string | null;
  officeHours: string | null;
}

export const contact: ContactSettings = {
  /**
   * VERIFIED BY THE SCHOOL. This is an official mobile number for the school
   * system. It is NOT described anywhere on this site as a landline, an office
   * line, an admissions hotline or an emergency number, because none of those
   * have been verified — only that it is the school's number to call.
   */
  phone: "+92 310 5688358",
  /**
   * Same number, used for WhatsApp. Set because the school supplied the number
   * as a mobile. The wa.me URL uses the digits only, in international format
   * with no +, spaces or punctuation, which is what the endpoint requires.
   */
  whatsapp: "+92 310 5688358",
  email: null,
  postalAddress: null,
  mapUrl: null,
  officeHours: null,
};

/**
 * Dial string for a tel: link.
 *
 * Built in ONE place. Every tel link on the site goes through this, so the
 * +/space handling is correct everywhere and cannot be got wrong per-component.
 */
export function telHref(display: string): string {
  return `tel:${display.replace(/[^\d+]/g, "")}`;
}

/**
 * WhatsApp deep link for a verified number.
 *
 * wa.me expects the number in international format with no +, spaces or
 * punctuation. Returns null when no number has been verified, so a WhatsApp CTA
 * simply is not rendered rather than linking to a broken or invented number.
 */
export function whatsappHref(display: string): string | null {
  const digits = display.replace(/\D/g, "");
  if (!digits) return null;
  return `https://wa.me/${digits}`;
}

export const social: SocialLink[] = [
  {
    id: "facebook",
    label: "Facebook",
    href: "https://www.facebook.com/share/1aqBJtRdAW/",
    /**
     * This is a SHARE redirect URL, not a page permalink. It resolves to
     * whichever page was last shared and is not a stable identity for the
     * school, so it must not be presented as a permanent page address nor
     * emitted as `sameAs`. Ask the school for the permalink and flip this.
     */
    isPermalink: false,
  },
];

/** True when the school has given us at least one direct contact channel. */
export const hasVerifiedContact = Boolean(
  contact.phone || contact.whatsapp || contact.email || contact.postalAddress,
);

/**
 * Message shown where a visitor would expect contact details we do not yet
 * have. Honest and actionable rather than a fabricated placeholder.
 *
 * This now describes only what is genuinely still missing — the school has
 * verified a mobile number but not an email address or a postal address — so it
 * no longer claims that direct contact details are unavailable. It must not
 * overstate what the mobile number is either: it is the school's number, not a
 * confirmed admissions line.
 */
export const contactUnavailableNotice =
  "The school has published a mobile number you can call or message. A postal address, email address and office hours have not yet been published, so those are not listed here.";