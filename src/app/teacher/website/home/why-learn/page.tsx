import { Metadata } from "next";
import { requireTeacher } from "@/lib/auth-guards";
import { getPageSection } from "@/features/website-cms/actions/content-actions";
import WhyLearnAdmin from "./WhyLearnAdmin";

export const metadata: Metadata = {
  title: "Why Learn Section | Admin",
};

export default async function WhyLearnPage() {
  await requireTeacher();
  const section = await getPageSection("HOME", "HOME_WHY_CHOOSE");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#08132E]">Why Learn Section</h1>
        <p className="text-gray-600 mt-1">Manage the benefits and unique points of why students should choose you.</p>
      </div>
      <WhyLearnAdmin initialSectionData={section} />
    </div>
  );
}
