import { getPageSection } from "@/features/website-cms/actions/content-actions";
import GalleryAlbumsAdmin from "./GalleryAlbumsAdmin";

export default async function GalleryAlbumsAdminPage() {
  const sectionData = await getPageSection("GALLERY", "GALLERY_ALBUMS");

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-border">
        <h1 className="text-2xl font-bold text-primary mb-2">Gallery Albums</h1>
        <p className="text-gray-500">Manage your photo gallery albums, categories, and images.</p>
      </div>

      <GalleryAlbumsAdmin initialSectionData={sectionData} />
    </div>
  );
}
