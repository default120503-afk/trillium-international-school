/**
 * Campus records.
 *
 * Each campus is a separate, reusable data record. This is the single source of
 * truth for every campus reference on the site: the campuses page, the campus
 * selector on the home page, the footer, the contact page, the admissions
 * campus select and the structured data all read from `campuses`.
 *
 * PROVENANCE RULE - enforced by review, not by tooling.
 *
 * `locationNote` is verbatim OWNER-SUPPLIED wording and nothing else. The two
 * Haripur campuses are locality references from school material, not complete
 * postal addresses. The Rawalpindi campus is a full owner-supplied landmark
 * description ("Beside Snober City", "The Awami Shopping Center") which is
 * more
 * specific, and is recorded exactly as given.
 *
 * Nothing may be filled in from inference or from what a map shows. No street
 * numbers, postal codes, coordinates, phone numbers, emails, principals,
 * timings, fees, facilities, enrolment figures or accreditations have been
 * added for any campus. If the owner supplies a fact, add it here and it flows
 * to every surface; if they have not, the field stays absent.
 *
 * `status` gates what the site claims:
 *  - "operational" : the owner confirms this campus is currently running
 *  - "historical"  : documented in school material, not confirmed as running
 *
 * `image` is intentionally null for all three campuses: no authentic campus
 * photograph exists in the supplied materials, and stock photography must never
 * be presented as this school's own campus. Add a real file under
 * public/images/campuses/ and reference it here to make it appear.
 *
 * `mapUrl` is present ONLY for Rawalpindi, and only because the owner supplied
 * that exact URL themselves. It is the destination of the "View on Google Maps"
 * link. No map is scraped, embedded, or read for facts - the business name that
 * appears in the owner's URL (a bakery) is a geocoding artefact of that link
 * and is deliberately NOT surfaced anywhere on the site, because the school has
 * not stated any relationship with it.
 */

export type CampusStatus = "operational" | "historical";

export interface Campus {
  /** Stable id, used for links and the admissions campus select. */
  id: string;
  /** Display name. */
  name: string;
  /** The school's own location wording, shown verbatim. */
  locationNote: string;
  /** Region the campus sits in. */
  region: string;
  status: CampusStatus;
  /** Relative path under /public, or null when no authentic photo exists. */
  image: string | null;
  /**
   * Owner-supplied Google Maps destination, or null when none was supplied.
   * Never inferred, never resolved from a search result, never scraped.
   */
  mapUrl: string | null;
  /**
   * What we can honestly say about the campus. Deliberately empty until the
   * school supplies facilities, hours or services - no invented amenities.
   */
  notes: string | null;
}

export const campuses: Campus[] = [
  {
    id: "rawalpindi",
    name: "Rawalpindi Campus",
    locationNote:
      "Adayala Road, The Awami Shopping Center, Beside Snober City, Rawalpindi, Punjab, Pakistan",
    region: "Rawalpindi, Punjab, Pakistan",
    status: "operational",
    image: null,
    mapUrl:
      "https://www.google.com/maps/place/The+Bakers+Adyala+Road/@33.5190199,73.0475197,20z/data=!4m6!3m5!1s0x38df9300265fca65:0xaf01552a9e999479!8m2!3d33.5192534!4d73.0474201!16s%2Fg%2F11xl2hy5gx?entry=ttu&g_ep=EgoyMDI2MDkzMC4wIKXMDSoASAFQAw%3D%3D",
    notes: null,
  },
  {
    id: "bhera",
    name: "Campus 1 — Bhera",
    locationNote: "Bhera, Near Jaulian",
    region: "Haripur District, Khyber Pakhtunkhwa",
    status: "historical",
    image: null,
    mapUrl: null,
    notes: null,
  },
  {
    id: "khanpur",
    name: "Campus 2 — Khanpur",
    locationNote: "Khanpur, Near NBP Bank",
    region: "Haripur District, Khyber Pakhtunkhwa",
    status: "historical",
    image: null,
    mapUrl: null,
    notes: null,
  },
];

export function getCampus(id: string): Campus | undefined {
  return campuses.find((c) => c.id === id);
}

/** Status labels surfaced in the UI so the site never overstates operations. */
export const campusStatusLabel: Record<CampusStatus, string> = {
  operational: "Currently operating",
  historical: "Listed in school records",
};

/** The campus the owner has confirmed is running, for use in summaries. */
export function getOperationalCampuses(): Campus[] {
  return campuses.filter((c) => c.status === "operational");
}