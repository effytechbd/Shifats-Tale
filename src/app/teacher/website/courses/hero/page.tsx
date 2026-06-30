import { getPageSection } from "@/features/website-cms/actions/content-actions";
import { SharedHeroForm } from "@/features/website-cms/components/SharedHeroForm";

export default async function CoursesHeroAdminPage() {
  const initialData = await getPageSection("COURSES", "COURSES_HERO");

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-primary">Courses Hero Section</h1>
        <p className="text-muted text-sm mt-1">Manage the title, subtitle, description, and background image of the Courses page hero section.</p>
      </div>
      
      <SharedHeroForm 
        initialData={initialData} 
        pageKey="COURSES" 
        sectionKey="COURSES_HERO"
        folderKey="COURSES"
      />
    </div>
  );
}
