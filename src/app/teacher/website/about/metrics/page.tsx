import { requireTeacher } from "@/lib/auth-guards";
import { getPageSection } from "@/features/website-cms/actions/content-actions";
import AboutMetricsAdmin from "./AboutMetricsAdmin";

export const metadata = {
  title: "Summary Metrics | Teacher CMS",
};

export default async function AboutMetricsPage() {
  await requireTeacher();

  // Fetch initial data for the About Metrics section
  const sectionData = await getPageSection("ABOUT", "ABOUT_METRICS");

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-border">
        <h1 className="text-2xl font-bold text-primary mb-2">Summary Metrics Setup</h1>
        <p className="text-sm text-gray-500">
          Manage the key statistics and metrics displayed on your About page.
        </p>
      </div>

      <AboutMetricsAdmin initialSectionData={sectionData} />
    </div>
  );
}
