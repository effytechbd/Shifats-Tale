import { getPageSection } from "@/features/website-cms/actions/content-actions";
import { SharedHeroForm } from "@/features/website-cms/components/SharedHeroForm";

export default async function ContactHeroAdminPage() {
  const initialData = await getPageSection("CONTACT", "CONTACT_HERO");

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-primary">Contact Hero Section</h1>
        <p className="text-muted text-sm mt-1">Manage the title, subtitle, description, and background image of the Contact page hero section.</p>
      </div>
      
      <SharedHeroForm 
        initialData={initialData} 
        pageKey="CONTACT" 
        sectionKey="CONTACT_HERO"
        folderKey="CONTACT"
      />
    </div>
  );
}
