import { Metadata } from "next";
import { requireTeacher } from "@/lib/auth-guards";
import { getGlobalSettings } from "@/features/website-cms/actions/global-settings";
import GlobalSettingsAdmin from "./GlobalSettingsAdmin";

export const metadata: Metadata = {
  title: "Global Website Settings | Admin",
};

export default async function GlobalSettingsPage() {
  await requireTeacher();
  const settings = await getGlobalSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#08132E]">Global Website Settings</h1>
        <p className="text-gray-600 mt-1">Manage global site info such as contact numbers, social links, and teacher details.</p>
      </div>
      <GlobalSettingsAdmin initialSettings={settings} />
    </div>
  );
}
