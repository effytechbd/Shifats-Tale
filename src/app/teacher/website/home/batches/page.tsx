import { Metadata } from "next";
import { requireTeacher } from "@/lib/auth-guards";
import { getPageSection, getSectionItems } from "@/features/website-cms/actions/content-actions";
import HomeCoursesAdmin from "./HomeCoursesAdmin";

export const metadata: Metadata = {
  title: "Featured Courses | Home Admin",
};

export default async function HomeCoursesPage() {
  await requireTeacher();

  // Fetch all available courses from the Courses page
  const allCourses = await getSectionItems("COURSES_CARDS");

  // Fetch the current featured courses settings for the Home page
  const section = await getPageSection("HOME", "HOME_FEATURED_COURSES");

  // The selected course IDs are stored in the section's content JSON
  const selectedCourseIds: string[] = section?.content?.selectedCourseIds || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#08132E]">Home Page Featured Courses</h1>
        <p className="text-gray-600 mt-1">Select which courses from your catalog should appear in the 3D carousel on the Home Page.</p>
      </div>

      <HomeCoursesAdmin 
        allCourses={allCourses} 
        initialSelectedIds={selectedCourseIds} 
        sectionId={section?.id} 
      />
    </div>
  );
}
