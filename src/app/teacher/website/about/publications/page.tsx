import { requireTeacher } from "@/lib/auth-guards";
import { getPageSection } from "@/features/website-cms/actions/content-actions";
import AboutPublicationsAdmin from "./AboutPublicationsAdmin";

export const metadata = {
  title: "Research Publications | Teacher CMS",
};

export default async function AboutPublicationsPage() {
  await requireTeacher();

  // Fetch initial data for the About Publications section
  const sectionData = await getPageSection("ABOUT", "ABOUT_PUBLICATIONS");

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-border">
        <h1 className="text-2xl font-bold text-primary mb-2">Research Publications Setup</h1>
        <p className="text-sm text-gray-500">
          Manage your journal articles, conference papers, and publication links.
        </p>
      </div>

      <AboutPublicationsAdmin initialSectionData={sectionData} />
    </div>
  );
}
