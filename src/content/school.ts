/**
 * Central school information.
 *
 * SINGLE SOURCE OF TRUTH for school identity and navigation.
 *
 * EDITING RULES
 * - Never publish a phone number, email address or address here unless the
 *   school has verified it. Contact fields default to `null` and the UI hides
 *   them entirely rather than rendering a fabricated placeholder.
 * - `verificationStatus` distinguishes documented historical material from
 *   currently-confirmed operational facts. Pages use it to label content
 *   honestly instead of implying everything is currently running.
 */

/** How confidently we can present a claim as current fact. */
export type VerificationStatus =
  /** Confirmed by the school for the present day. */
  | "current"
  /** Appears in historical brochure material - true of the past, not asserted as running today. */
  | "historical"
  /** A plan or aim, not a claim that it currently happens. */
  | "aspiration";

export const school = {
  name: "Trillium International School System",
  /** Short form used where space is tight (nav, metadata). */
  shortName: "TISS",
  location: {
    area: "Khanpur / Haripur",
    region: "Khyber Pakhtunkhwa",
    country: "Pakistan",
  },
  /** The school reopened in October 2026 per the client. */
  status: {
    operating: true,
    reopenedIn: "October 2026",
    /** Short, factual notice rendered on the home page. */
    notice:
      "Trillium International School System reopened in October 2026 and is welcoming admissions inquiries.",
  },
} as const;

/**
 * The company behind the school.
 *
 * WHY THIS IS ITS OWN RECORD AND NOT A STRING ON `school`: the attribution has
 * to read as an institutional credit line UNDER the school name on every
 * surface that shows it, and there are only a few of those. Keeping the phrase
 * in one place is what stops it drifting into a corporate banner, and keeps the
 * order fixed — the school is named first, the company after it, never above.
 *
 * There is deliberately nothing else here: no logo, no URL, no registration
 * detail, no office. Nothing about the company has been supplied beyond its
 * name, so nothing else may be stated.
 */
export const company = {
  name: "Quick Done Corporation",
  shortName: "QDC",
  /**
   * The one credit line. Phrased so the school always leads and the company
   * follows as its project — never the reverse.
   */
  attribution: "A Project of Quick Done Corporation (QDC)",
} as const;

/**
 * The school's founder and current leader.
 *
 * IDENTITY RULE — WHY THERE IS NO `qualification` FIELD ANY MORE.
 *
 * The school previously carried "Master's degree in Education" as a repeated
 * badge: nine separate call sites printed it, so the same credential appeared on
 * the hero plate, the footer, the story hero, the about overview, the contact
 * page, the leadership page, why-trillium, the story founder section and the
 * home timeline. Read across the site it read as a marketing badge repeated for
 * emphasis, not as a credential, and it competed with the founder's actual
 * role.
 *
 * The site now states ONE identity — {role} and {descriptor} — and says nothing
 * about academic qualifications at all. That is a presentation decision, not a
 * claim: no qualification has been invented, removed from the school's record
 * or contradicted, only stopped being reprinted as decoration. Nothing here may
 * be added without the school supplying it.
 */
export const founder = {
  name: "Farzana Tabussum",
  /** The leadership title used on this website. */
  role: "Founder & Director",
  /** The professional descriptor used on this website. */
  descriptor: "Educationist",
  /**
   * Compact single-line form for credits and cards, where a stacked
   * name-then-title pair would cost vertical space the layout does not have.
   * Reads as "Founder & Director | Educationist".
   */
  line: "Founder & Director | Educationist",
} as const;

/**
 * History drawn from the school's own account. Dates and figures are exactly
 * what the source states - nothing has been embellished or interpolated.
 */
export const history = {
  timeline: [
    {
      year: "2014",
      title: "Educational work begins",
      body: "Farzana Tabussum began working in the field of education in the Haripur area, choosing Khanpur as the place to start.",
      status: "historical" as const,
    },
    {
      year: "2014",
      title: "Meeting families at the door",
      body: "She went door to door to introduce her aims and ambitions to the people of the area, driven by a belief that local children deserved access to quality education.",
      status: "historical" as const,
    },
    {
      year: "2014-2015",
      title: "The first session",
      body: "The first school session began in March of the 2014-2015 academic year, with seven students.",
      status: "historical" as const,
    },
    {
      year: "Years that followed",
      title: "Two branches, one purpose",
      body: "Travelling 90 to 100 km daily using local transport, in all seasons, the school ran two branches with the same commitment to quality education.",
      status: "historical" as const,
    },
  ],
  /** The rural-access commitment is the through-line worth stating plainly. */
  premise:
    "The school began with the conviction that children in rural communities deserved access to quality education - and that meant going to them, not waiting for them to arrive.",
} as const;

/**
 * Mission and vision. Composed for this website from the philosophy documented
 * in the school brochure. Presented as the school's website statement, not as
 * a verbatim historical or board-approved quotation.
 */
export const missionVision = {
  provenance:
    "Composed for this website from the educational philosophy documented in the school's own profile. Not a verbatim quotation from an earlier publication.",
  mission: {
    title: "Our Mission",
    lead: "To elaborate every aspect of a child's development by providing knowledge and experiences that lead towards Allah, guided by the Quran and Sunnah.",
    body: [
      "We provide a teaching and learning environment enriched with purposeful, deliberate experiences designed to bring out the best in each student.",
      "Our aim is excellence in both scholastic and non-scholastic activity, moulding students into wholesome personalities with morals, compassion and self-efficacy, so each can become a better social being.",
      "We cultivate appreciation for cultural values and traditions alongside genuine tolerance for other cultures and beliefs, and develop the sound academic base, analytical skill, civic responsibility and cultural values that let a student contribute fully.",
    ],
  },
  vision: {
    title: "Our Vision",
    lead: "A school flying with wings towards excellence, offering a high-quality international experience to students of every age and culture.",
    body: [
      "We envisage an environment where every individual in the school has the freedom to think, to express, and to redefine the boundaries set for them - for the better cause of humanity, and to become a world-class citizen.",
      "We believe every child has been blessed with extraordinary qualities that need to be explored.",
    ],
  },
} as const;