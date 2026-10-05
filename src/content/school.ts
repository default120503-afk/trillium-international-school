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
  /**
   * THE FOUNDING LOCATION — NOT the school's full present-day footprint.
   *
   * This record names Khanpur / Haripur because that is where the school
   * began and where the documented history comes from. It is the correct value
   * for ORIGIN copy: the story page, the timeline, the founding narrative. It
   * is the WRONG value for a general "where is the school" statement, because
   * the school also operates in Rawalpindi — printing this alone made the
   * whole site read as if Khanpur / Haripur were the only place it existed.
   *
   * For any statement about where the school is NOW, use `presence` below.
   * Nothing about this record has changed; only its use has been narrowed.
   */
  location: {
    area: "Khanpur / Haripur",
    region: "Khyber Pakhtunkhwa",
    country: "Pakistan",
  },
  /**
   * THE SCHOOL'S PRESENT-DAY GEOGRAPHIC PRESENCE.
   *
   * Two locations. They are separate cities in separate provinces, roughly
   * 150km apart — Rawalpindi is NOT a neighbourhood or an alternative spelling
   * of Khanpur, and the site must never let a visitor infer that it is.
   *
   * This is deliberately a list of REGIONS rather than a list of addresses.
   * Each campus's own address already flows from `campuses`, one source of
   * truth per record; repeating full addresses in a general location line is
   * what turns a school site into a directory listing. What belongs at this
   * level is only "these are the places we are".
   */
  presence: {
    /** Short region names, in the order they are shown to visitors. */
    regions: [
      { area: "Khanpur / Haripur", region: "Khyber Pakhtunkhwa" },
      { area: "Rawalpindi", region: "Punjab" },
    ],
    /**
     * Inline list for a running sentence or a compact line:
     * "Khanpur / Haripur, Khyber Pakhtunkhwa • Rawalpindi, Punjab", where the
     * space is a NO-BREAK space. Two measured defects forced this, both only
     * visible at 360px:
     *   1. With ordinary spaces the line broke "Khyber Pakhtunkhwa" as
     *      "KHYBER | PAKHTUNKHWA" — a place name cut in half.
     *   2. Fixing only the spaces after each comma moved the break onto the
     *      ordinary space INSIDE "Khyber Pakhtunkhwa", which then broke again.
     *   3. With each province joined but "Khanpur / Haripur" still spaced, the
     *      line broke again after "KHANPUR /". That unit measures 260px in a
     *      320px column, so it never needed to break at all.
     * Every space within a place name is therefore non-breaking, the slash in
     * "Khanpur / Haripur" is included, and the bullet is bound to the location
     * that follows it.
     *
     * The result, verified: the ONLY remaining break opportunity is the single
     * ordinary space before the bullet, because the measured natural width of
     * the whole string is 514px inside a 320px column and so it must wrap
     * somewhere. That one break point is the boundary between the two
     * locations, which means the wrap states the two-location fact visually
     * instead of damaging a place name.
     */
    list: "Khanpur / Haripur, Khyber Pakhtunkhwa • Rawalpindi, Punjab",
    /**
     * Sentence form for prose that needs a subject and a verb, so no call site
     * has to hand-assemble one and get the preposition wrong:
     * "a presence in Khanpur / Haripur, Khyber Pakhtunkhwa and Rawalpindi, Punjab"
     *
     * Non-breaking spaces here too, for the same reason as `list`: verified on
     * the live mobile homepage, where the plain-space version wrapped as
     * "Khyber | Pakhtunkhwa" inside a paragraph. The space before "and" is the
     * ONLY ordinary space left, so that is where this variant may wrap — which
     * is again the boundary between the two locations.
     */
    prose: "a presence in Khanpur / Haripur, Khyber Pakhtunkhwa and Rawalpindi, Punjab",
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