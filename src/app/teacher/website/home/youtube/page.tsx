import { Metadata } from "next";
import { requireTeacher } from "@/lib/auth-guards";
import { getPageSection } from "@/features/website-cms/actions/content-actions";
import YoutubeAdmin from "./YoutubeAdmin";

export const metadata: Metadata = {
  title: "Concept Breakdown Theater | Admin",
};

export default async function YoutubePage() {
  await requireTeacher();
  const section = await getPageSection("HOME", "HOME_YOUTUBE_CLASSES");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#08132E]">Concept Breakdown Theater</h1>
        <p className="text-gray-600 mt-1">Manage the YouTube concept classes shown on the home page.</p>
      </div>
      <YoutubeAdmin initialSectionData={section} />
    </div>
  );
}
