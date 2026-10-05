import type { VerificationStatus } from "@/content/school";

/**
 * Educational approach, drawn from the school profile document.
 *
 * `status` is rendered as a visible qualifier on the site. Items marked
 * "aspiration" are the school's documented aims; "historical" items describe
 * what the profile says the school has done. Nothing here asserts that a
 * specific programme, board or syllabus is currently running.
 */

export interface Pillar {
  id: string;
  /** Lucide icon name, resolved in the component that renders it. */
  icon: string;
  title: string;
  body: string;
  status: VerificationStatus;
}

export const learningPillars: Pillar[] = [
  {
    id: "conceptual",
    icon: "Lightbulb",
    title: "Conceptual understanding",
    body: "Children are encouraged to discover and understand ideas for themselves rather than memorise them. Observation and analytical thinking sit at the centre of teaching.",
    status: "aspiration",
  },
  {
    id: "assessment",
    icon: "ClipboardCheck",
    title: "Continuous evaluation",
    body: "Assessment is treated as an integral part of teaching and learning rather than a single examination at the end. Evaluation should be a positive input that improves the process, not a deterrent.",
    status: "aspiration",
  },
  {
    id: "english",
    icon: "MessageCircle",
    title: "Spoken English",
    body: "Focus on English helps a child express an idea clearly and listen with understanding — a skill that carries far beyond the classroom.",
    status: "aspiration",
  },
  {
    id: "computer",
    icon: "Monitor",
    title: "Computer education",
    body: "Computer skills are part of the profile's educational aims, giving students a practical grounding alongside their academic work.",
    status: "aspiration",
  },
  {
    id: "islamic",
    icon: "BookOpen",
    title: "Islamic education and Nazra",
    body: "Nazra and Islamic education sit within an approach informed by the Quran and Sunnah, alongside respect for cultural values.",
    status: "aspiration",
  },
  {
    id: "character",
    icon: "Sprout",
    title: "Character and personality",
    body: "Life skills, confidence, personality development and leadership are treated as real outcomes of schooling, not as extras.",
    status: "aspiration",
  },
  {
    id: "teachers",
    icon: "HeartHandshake",
    title: "Teacher development",
    body: "The profile places teacher motivation and training at the centre of school improvement, including participation in teacher training programmes.",
    status: "aspiration",
  },
  {
    id: "family",
    icon: "Users",
    title: "Family partnership",
    body: "Cooperation with mothers and families is named in the profile as part of how a child is supported, extending beyond the classroom gate.",
    status: "aspiration",
  },
];

export const statusQualifier: Record<VerificationStatus, string> = {
  current: "",
  historical: "Described in the school profile",
  aspiration: "An educational aim of the school",
};

/** Co-curricular themes from the profile, labelled to avoid over-claiming. */
export const coCurricularThemes: { title: string; body: string }[] = [
  {
    title: "Showcasing talent",
    body: "The profile describes exhibitions, annual celebrations and house functions through which students show what they can do.",
  },
  {
    title: "Healthy competition",
    body: "Inter-school activities and competitions are described as a way for students to test themselves and grow more confident in their strengths.",
  },
  {
    title: "Physical activity",
    body: "Physical activities are part of the profile's plan for students to develop their talents rather than spend all their time on books.",
  },
  {
    title: "Environment and giving",
    body: "Environmental and plantation activities and charitable work appear in the profile as ways of raising awareness beyond the classroom.",
  },
  {
    title: "Social and cultural awareness",
    body: "The school describes itself as a learning community of tolerance and empathy, and places value on respect and self-protection.",
  },
  {
    title: "Many talents welcome",
    body: "The profile's line is a plain one: mathematicians, athletes, businesspeople and engineers all belong here. Different interests are treated as assets.",
  },
];

export interface Reason {
  title: string;
  body: string;
}

export const reasonsToJoin: Reason[] = [
  {
    title: "Teaching that asks children to think",
    body: "The approach described in the school profile is concept-based: children are expected to understand an idea, test it, and reach their own conclusion rather than accept what they are told.",
  },
  {
    title: "Assessment that helps, not punishes",
    body: "Evaluation runs through the year and is meant to improve teaching and learning. A report is meant to show a child's growth, including life skills and attitude — not just a score.",
  },
  {
    title: "English, computers and Islamic education together",
    body: "Spoken English, computer education and Nazra are all named in the profile, so a child builds communication, practical and moral ground at the same time.",
  },
  {
    title: "A safe, hygienic learning environment",
    body: "The profile describes the school environment as ventilated, hygienic and secure — the plain conditions that make good teaching possible.",
  },
  {
    title: "Reach into the community",
    body: "The school's origin is in serving rural communities, including families who travelled ninety to a hundred kilometres a day to reach a class. That commitment shaped the institution.",
  },
  {
    title: "Talents beyond the syllabus",
    body: "The profile is explicit that a complete person is not defined by marks. Students are encouraged to compete, perform, lead and contribute.",
  },
];

/**
 * News and announcements.
 *
 * DELIBERATELY EMPTY. No announcements have been verified, and inventing a
 * reopening celebration, admission deadline or future event would be
 * fabrication. The news page renders an honest empty state from this array;
 * add entries here (and nothing needs to change in the page component).
 */

export interface Announcement {
  id: string;
  /** ISO date. Do not invent dates. */
  date: string;
  title: string;
  summary: string;
  status: "current";
}

export const announcements: Announcement[] = [];