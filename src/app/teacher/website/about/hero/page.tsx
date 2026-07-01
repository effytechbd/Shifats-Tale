import { Metadata } from "next";
import { requireTeacher } from "@/lib/auth-guards";
import { getPageSection } from "@/features/website-cms/actions/content-actions";
import AboutHeroAdmin from "./AboutHeroAdmin";

export const metadata: Metadata = {
  title: "About Hero | Admin",
};

export default async function AboutHeroPage() {
  await requireTeacher();
  const section = await getPageSection("ABOUT", "ABOUT_HERO");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#08132E]">About Page Hero</h1>
        <p className="text-gray-600 mt-1">Manage the hero section profile details on the About page.</p>
      </div>
      <AboutHeroAdmin initialSectionData={section} />
    </div>
  );
}
