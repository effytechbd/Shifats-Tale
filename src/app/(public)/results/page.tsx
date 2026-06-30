import { Metadata } from "next";
import ResultsClient from "./ResultsClient";
import { getPageSection } from "@/features/website-cms/actions/content-actions";

export const metadata: Metadata = {
  title: "Success Stories & Alumni | Shifat's Tales",
  description: "Explore the brilliant minds who have achieved top ranks in board exams and university admissions with Shifat's Tales.",
};

export default async function ResultsPage() {
  const heroData = await getPageSection("RESULTS", "RESULTS_HERO");

  return <ResultsClient heroData={heroData} />;
}
