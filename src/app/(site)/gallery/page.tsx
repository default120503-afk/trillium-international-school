import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Gallery } from "@/components/gallery/Gallery";
import { buildMetadata } from "@/app/layout";

export const metadata: Metadata = buildMetadata({
  title: "Gallery",
  description:
    "Material published by Trillium International School System, reproduced from the school's own profile document.",
  path: "/gallery",
});

export default function GalleryPage() {
  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="Material published by the school"
        lead="Every image here comes from the school's own published profile, reproduced from the document supplied to us. Where an image is absent, we say so rather than substituting stock photography."
      />
      <section aria-label="School gallery" className="bg-cream-50">
        <div className="container-page py-16 md:py-20">
          <Gallery />
        </div>
      </section>
    </>
  );
}