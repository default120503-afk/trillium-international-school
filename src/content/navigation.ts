/**
 * Site navigation.
 *
 * One nav definition, reused by the desktop bar, the mobile drawer and the
 * footer, so a route can never appear in one and be missing from another.
 */

export interface NavItem {
  href: string;
  label: string;
  /**
   * Compact label used in the horizontal desktop bar, where eleven full labels
   * overflowed the bar and wrapped. Falls back to `label` when unset.
   */
  shortLabel?: string;
  /** Short description shown in the footer's expanded columns. */
  description: string;
}

export const primaryNav: NavItem[] = [
  {
    href: "/",
    label: "Home",
    description: "An introduction to the school and how to reach us.",
  },
  {
    href: "/about",
    label: "About",
    description: "What the school is for and how it works.",
  },
  {
    href: "/story",
    label: "Our Story",
    description: "The founder's account and the school's beginnings.",
  },
  {
    href: "/mission-and-vision",
    label: "Mission & Vision",
    shortLabel: "Mission",
    description: "The statements that guide the school.",
  },
  {
    href: "/leadership",
    label: "Leadership",
    description: "A message from the school's leadership.",
  },
  {
    href: "/learning",
    label: "Learning",
    description: "The approach to teaching and curriculum.",
  },
  {
    href: "/co-curricular",
    label: "Beyond the Classroom",
    shortLabel: "Activities",
    description: "Activities, development and student life.",
  },
  {
    href: "/why-trillium",
    label: "Why Trillium",
    description: "Grounded reasons to consider the school.",
  },
  {
    href: "/campuses",
    label: "Campuses",
    description: "Where the school is located.",
  },
  {
    href: "/gallery",
    label: "Gallery",
    description: "Material published by the school.",
  },
  {
    href: "/news",
    label: "News",
    description: "Announcements from the school.",
  },
  {
    href: "/contact",
    label: "Contact",
    description: "How to reach the school.",
  },
];

export const admissionNav: NavItem = {
  href: "/admissions",
  label: "Admissions",
  description: "Send an admissions inquiry to the school.",
};