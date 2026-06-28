import React from "react";
import { Metadata } from "next";
import {
  profileData,
  metricsData,
  educationData,
  researchThesisData,
  publicationsData,
  skillCategoriesData,
  projectsData,
  trainingData,
} from "@/data/about";

import { AboutHero } from "@/components/about/AboutHero";
import { AboutMetrics } from "@/components/about/AboutMetrics";
import { EducationTimeline } from "@/components/about/EducationTimeline";
import { ResearchSkillsSection } from "@/components/about/ResearchSkillsSection";
import { ProjectsGrid } from "@/components/about/ProjectsGrid";
import { IndustrialTrainingBanner } from "@/components/about/IndustrialTrainingBanner";
import { Info } from "lucide-react";

export const metadata: Metadata = {
  title: "About Md. Zia Uddin Azad Sifat | Academic & Professional Portfolio | Shifat's Tales",
  description: "Explore the academic portfolio, research publications, engineering projects, and teaching background of Md. Zia Uddin Azad Sifat (Shifat Sir), CEO at Shifat's Tales.",
};

export default function AboutPage() {
  return (
    <div className="pt-20 pb-16 bg-bg-soft text-text flex flex-col min-h-screen selection:bg-accent selection:text-primary">
      {/* 1. About Hero Section */}
      <AboutHero profile={profileData} />

      {/* 2. Summary Metrics Strip */}
      <AboutMetrics metrics={metricsData} />

      {/* 3. Education Timeline */}
      <EducationTimeline education={educationData} />

      {/* 4 & 5. Research Experience & Technical Skills Section */}
      <ResearchSkillsSection
        thesis={researchThesisData}
        publications={publicationsData}
        skillCategories={skillCategoriesData}
      />

      {/* 6. Projects Grid */}
      <ProjectsGrid projects={projectsData} />

      {/* 7. Industrial Training Banner */}
      <IndustrialTrainingBanner training={trainingData} />

      {/* Dynamic Data Notice Footer Bar */}
      <div className="pt-8 pb-4 flex items-center justify-center space-x-2 text-xs font-semibold text-muted/80">
        <Info className="h-4 w-4 text-accent shrink-0" />
        <span>
          All information is dynamic and managed from the admin panel. Content will be automatically updated from the database.
        </span>
      </div>
    </div>
  );
}
