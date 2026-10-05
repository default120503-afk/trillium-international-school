/**
 * Gallery entries.
 *
 * PROVENANCE IS THE RULE HERE.
 *
 * The supplied brochure (CamScanner 10-03-2026 22.57.pdf) is a scanned,
 * text-only document: every page is a single flat page image containing running
 * text and decorative colour. It contains NO photographs of students, staff,
 * classrooms or campuses. We verified this by OCR-ing all 8 pages and by
 * colour-variance analysis across every page.
 *
 * So this gallery does not pretend. It presents the authentic source material
 * we actually hold - the school profile pages and the official logo - under a
 * clearly labelled "School profile" category, and it surfaces an explicit
 * prompt for the school to supply real photography.
 *
 * Each entry carries a `provenance` string that MUST describe where the image
 * genuinely came from. Never write a caption asserting a person, place, event
 * or date that the source does not support.
 */

export type GalleryCategory = "school-profile";

export interface GalleryImage {
  id: string;
  src: string;
  /** Full-size asset for the lightbox. */
  fullSrc: string;
  /** Alt text: describe the image, do not invent meaning. */
  alt: string;
  /** Neutral caption describing what the file IS, not a story about it. */
  caption: string;
  category: GalleryCategory;
  provenance: string;
  width: number;
  height: number;
}

export const galleryCategories: { id: GalleryCategory; label: string }[] = [
  { id: "school-profile", label: "School Profile" },
];

export const galleryImages: GalleryImage[] = [
  {
    id: "profile-cover",
    src: "/images/profile/page-1-thumb.webp",
    fullSrc: "/images/profile/page-1.webp",
    alt: "Scanned cover page of the Trillium International School System school profile, showing the school name and the locations of its two campuses.",
    caption: "School profile — cover page",
    category: "school-profile",
    provenance: "Page 1 of the school's own scanned profile document.",
    width: 900,
    height: 1200,
  },
  {
    id: "profile-founder",
    src: "/images/profile/page-2-thumb.webp",
    fullSrc: "/images/profile/page-2.webp",
    alt: "Scanned page of the school profile containing the founder's account of the school's beginnings, printed text on a plain page.",
    caption: "School profile — the founder's account",
    category: "school-profile",
    provenance: "Page 2 of the school's own scanned profile document.",
    width: 900,
    height: 1200,
  },
  {
    id: "profile-approach",
    src: "/images/profile/page-3-thumb.webp",
    fullSrc: "/images/profile/page-3.webp",
    alt: "Scanned page of the school profile describing a child-centred, activity-planned approach to teaching.",
    caption: "School profile — approach to teaching",
    category: "school-profile",
    provenance: "Page 3 of the school's own scanned profile document.",
    width: 900,
    height: 1200,
  },
  {
    id: "profile-mission",
    src: "/images/profile/page-4-thumb.webp",
    fullSrc: "/images/profile/page-4.webp",
    alt: "Scanned page of the school profile setting out the school's mission and vision statements.",
    caption: "School profile — mission and vision",
    category: "school-profile",
    provenance: "Page 4 of the school's own scanned profile document.",
    width: 900,
    height: 1200,
  },
  {
    id: "profile-assessment",
    src: "/images/profile/page-5-thumb.webp",
    fullSrc: "/images/profile/page-5.webp",
    alt: "Scanned page of the school profile describing the school's approach to curriculum and continuous evaluation.",
    caption: "School profile — curriculum and evaluation",
    category: "school-profile",
    provenance: "Page 5 of the school's own scanned profile document.",
    width: 900,
    height: 1200,
  },
  {
    id: "profile-activities",
    src: "/images/profile/page-6-thumb.webp",
    fullSrc: "/images/profile/page-6.webp",
    alt: "Scanned page of the school profile describing activities that build student confidence and social and cultural awareness.",
    caption: "School profile — activities and confidence",
    category: "school-profile",
    provenance: "Page 6 of the school's own scanned profile document.",
    width: 900,
    height: 1200,
  },
  {
    id: "profile-objectives",
    src: "/images/profile/page-7-thumb.webp",
    fullSrc: "/images/profile/page-7.webp",
    alt: "Scanned page of the school profile listing the school's educational objectives.",
    caption: "School profile — educational objectives",
    category: "school-profile",
    provenance: "Page 7 of the school's own scanned profile document.",
    width: 900,
    height: 1200,
  },
  {
    id: "profile-reasons",
    src: "/images/profile/page-8-thumb.webp",
    fullSrc: "/images/profile/page-8.webp",
    alt: "Scanned page of the school profile summarising reasons to join the school system.",
    caption: "School profile — reasons to join",
    category: "school-profile",
    provenance: "Page 8 of the school's own scanned profile document.",
    width: 900,
    height: 1200,
  },
];

/**
 * Shown in place of inventing photography. Tells the school exactly what to
 * do, and states plainly why the gallery looks as it does.
 */
export const photographyNotice = {
  title: "Photographs are on their way",
  body: "The school's published profile is a text document and does not contain photographs of students, classrooms or campuses. Rather than show stock images that are not our own, we are presenting the profile itself here. When the school supplies authentic photographs of its campuses, classrooms, activities and students, they will be published here with accurate descriptions.",
};