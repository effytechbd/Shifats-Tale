import { getPageSection } from "@/features/website-cms/actions/content-actions";
import { SharedHeroForm } from "@/features/website-cms/components/SharedHeroForm";

export default async function GalleryHeroAdminPage() {
  const initialData = await getPageSection("GALLERY", "GALLERY_HERO");

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-primary">Gallery Hero Section</h1>
        <p className="text-muted text-sm mt-1">Manage the title, subtitle, description, and background image of the Photo Gallery page hero section.</p>
      </div>
      
      <SharedHeroForm 
        initialData={initialData} 
        pageKey="GALLERY" 
        sectionKey="GALLERY_HERO"
        folderKey="GALLERY"
      />
    </div>
  );
}
