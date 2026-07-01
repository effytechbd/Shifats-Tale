import { Metadata } from "next";
import { requireTeacher } from "@/lib/auth-guards";
import { getPageSection } from "@/features/website-cms/actions/content-actions";
import HomeStatsAdmin from "./HomeStatsAdmin";

export const metadata: Metadata = {
  title: "Home Stats Section | Admin",
};

export default async function HomeStatsPage() {
  await requireTeacher();
  const section = await getPageSection("HOME", "HOME_STATS");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#08132E]">Home Stats Section</h1>
        <p className="text-gray-600 mt-1">Manage the trust statistics displayed below the hero section.</p>
      </div>
      <HomeStatsAdmin initialSectionData={section} />
    </div>
  );
}
