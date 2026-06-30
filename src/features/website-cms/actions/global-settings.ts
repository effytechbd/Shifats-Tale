import { getPageSection } from "./content-actions";
import { siteInfo as defaultSiteInfo } from "@/data/site";

export async function getGlobalSettings() {
  const section = await getPageSection("GLOBAL", "GLOBAL_SETTINGS");
  
  if (section && section.content) {
    return { ...defaultSiteInfo, ...section.content };
  }
  
  return defaultSiteInfo;
}
