import { Metadata } from "next";
import GalleryClient from "./GalleryClient";
import { getPageSection } from "@/features/website-cms/actions/content-actions";

export const metadata: Metadata = {
  title: "Photo Gallery | Shifat's Tales",
  description: "A glimpse into our classrooms, events, and the vibrant life at Shifat's Tales.",
};

export default async function GalleryPage() {
  const heroData = await getPageSection("GALLERY", "GALLERY_HERO");
  const albumsData = await getPageSection("GALLERY", "GALLERY_ALBUMS");

  return <GalleryClient heroData={heroData} albumsData={albumsData} />;
}
