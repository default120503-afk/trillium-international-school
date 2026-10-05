/**
 * Uniform sequence.
 *
 * CONTENT INTEGRITY — read before editing
 *
 * Everything in this file is either a LABEL SUPPLIED BY THE SCHOOL or a
 * description of something visible in the four photographs the school supplied.
 * Nothing else appears here, and nothing may be added without the school's own
 * confirmation.
 *
 * Specifically ABSENT, deliberately:
 *   - no fabric, weave, weight or composition ("cotton", "poly-cotton", "khaki")
 *   - no sizes, measurements or fit
 *   - no prices, vendors or suppliers
 *   - no uniform policy (when to wear what, when it is washed, who supplies it)
 *   - no PE, house, winter/summer dates, or term dates
 *
 * An empty field is better than an invented one. If the school publishes a
 * policy later it belongs here, in one place, with the same verification rules
 * the rest of the site's content model uses.
 *
 * THE SUPPLIED ASSETS
 *
 * Four photographs, each an overhead flat-lay of the uniform on a pale studio
 * ground. Measured, not assumed:
 *
 *   file                        intrinsic   aspect   size
 *   Trillium_Summer_Boy.jpeg    1599x1066   1.500:1   76 KB
 *   Trillium_Winter_Boy.jpeg    1599x1066   1.500:1   72 KB
 *   Trillium_Summer_Girl.jpeg   1599x1066   1.500:1   91 KB
 *   Triilium_Winter_Girl.jpeg   1599x1066   1.500:1   74 KB
 *
 * Note the filename `Triilium_Winter_Girl.jpeg`: it carries THREE consecutive
 * i's where every other file carries two. That is how the school named it. The
 * file was copied into `public/uniform/` under a corrected, consistent slug
 * (`girls-winter.jpg`) because a public asset path is a URL, and shipping a
 * double-i typo into every page's markup and the browser cache is a defect
 * rather than fidelity. The original is untouched in the repository root; the
 * slug is where the correction lives. No other file was renamed.
 *
 * Alt text describes only what is visible in each frame. Each was read from the
 * actual image, not inferred from the label: the winter garments both include a
 * blue blazer with gold piping and an embroidered crest, the summer garments do
 * not, and the two girls' sets differ in the sleeve length of the blouse.
 */

export interface UniformLook {
  /** Short stage label, exactly as the school supplied it. */
  label: string;
  /**
   * The photograph. Absent on the three typographic stages (UNIFORM, BOYS,
   * GIRLS), which are chapters rather than looks.
   */
  image?: string;
  /** Intrinsic dimensions, so the browser reserves the correct box. */
  width?: number;
  height?: number;
  /**
   * Description of what the photograph actually shows, for the image alt and
   * for the canonical (non-animated) rendering.
   */
  alt?: string;
  /**
   * A visible figure number. Set only on stages that introduce a group.
   */
  group?: "boys" | "girls";
  /**
   * Short line of visible body copy for the stage.
   *
   * This is the ONLY thing the pinned desktop panel has room to say beyond the
   * label, and the panel is where the section actually lives: the canonical
   * list is `lg:sr-only`, so on a desktop this caption is the entire textual
   * content a visitor reads for each look.
   *
   * Every caption below is a restatement of something already asserted in that
   * stage's `alt`, which was itself read off the photograph rather than
   * inferred from the label. So a caption can never say more than the image
   * already says, and it introduces no fabric, sizing, price, supplier or
   * policy claim. If a look gains an image, its caption must stay inside that
   * image's `alt`.
   */
  caption?: string;
}

export const uniformSequence: UniformLook[] = [
  {
    label: "Uniform",
    group: undefined,
    caption: "Four sets, each photographed by the school.",
  },
  {
    label: "Boys",
    group: "boys",
    caption: "Winter and summer.",
  },
  {
    label: "Boys Summer",
    image: "/uniform/boys-summer.jpg",
    width: 1599,
    height: 1066,
    alt: "Boys' summer uniform laid out flat: a white short-sleeved shirt with blue trim and an embroidered crest, blue trousers, a blue tie and a black belt with a gold buckle.",
    caption: "A short-sleeved shirt with blue trim, blue trousers, a blue tie and a black belt.",
  },
  {
    label: "Boys Winter",
    image: "/uniform/boys-winter.jpg",
    width: 1599,
    height: 1066,
    alt: "Boys' winter uniform laid out flat: a royal-blue blazer with gold piping and an embroidered crest, a folded white shirt, a blue tie, blue trousers and a black belt with a gold buckle.",
    caption: "The blazer is the difference: royal blue, gold piping, and the same shirt, tie and trousers beneath.",
  },
  {
    label: "Girls",
    group: "girls",
    caption: "Winter and summer.",
  },
  {
    label: "Girls Summer",
    image: "/uniform/girls-summer.jpg",
    width: 1599,
    height: 1066,
    alt: "Girls' summer uniform laid out flat: a white long-sleeved blouse with blue trim and an embroidered crest, a blue tie, and a pleated royal-blue skirt.",
    caption: "A long-sleeved blouse with blue trim, a blue tie and a pleated royal-blue skirt.",
  },
  {
    label: "Girls Winter",
    image: "/uniform/girls-winter.jpg",
    width: 1599,
    height: 1066,
    alt: "Girls' winter uniform laid out flat: a royal-blue blazer with gold piping and an embroidered crest, a white shirt, a blue tie, a pleated royal-blue skirt and a folded pair of white socks.",
    caption: "The blazer returns, with white socks to the pleated skirt.",
  },
];

/**
 * The one line of honest context the section carries.
 *
 * It states what the photographs ARE and, by omission of everything else, what
 * they are not. The school has published no fabric, sizing, price or policy
 * information, so the site does not imply any.
 */
export const uniformNote =
  "Photographed by the school. Sizing, suppliers and uniform arrangements are confirmed directly with the school rather than published here.";