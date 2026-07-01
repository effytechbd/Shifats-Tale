import { getGlobalSettings } from "@/features/website-cms/actions/global-settings";
import GlobalFooterAdmin from "./GlobalFooterAdmin";

export default async function GlobalFooterPage() {
  const settings = await getGlobalSettings();

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-border">
        <h1 className="text-2xl font-bold text-primary mb-2">Global Footer Settings</h1>
        <p className="text-gray-500">Manage the texts, notices, and quick links that appear in the footer of all public pages.</p>
      </div>

      <GlobalFooterAdmin initialSettings={settings} />
    </div>
  );
}
