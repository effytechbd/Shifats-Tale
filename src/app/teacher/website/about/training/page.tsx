import { requireTeacher } from "@/lib/auth-guards";
import { getPageSection } from "@/features/website-cms/actions/content-actions";
import AboutTrainingAdmin from "./AboutTrainingAdmin";

export const metadata = {
  title: "Industrial Training | Teacher CMS",
};

export default async function AboutTrainingPage() {
  await requireTeacher();

  // Fetch initial data for the About Training section
  const sectionData = await getPageSection("ABOUT", "ABOUT_TRAINING");

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-border">
        <h1 className="text-2xl font-bold text-primary mb-2">Industrial Training Setup</h1>
        <p className="text-sm text-gray-500">
          Manage your industrial training banner and feature details.
        </p>
      </div>

      <AboutTrainingAdmin initialSectionData={sectionData} />
    </div>
  );
}
