"use client";

import React, { useState } from "react";
import { Sun, Zap, Lock, Wind, Bot, Cpu, ArrowRight, X, Layers, CheckCircle } from "lucide-react";
import { ProjectItem } from "@/data/about";

interface ProjectsGridProps {
  projects: ProjectItem[];
}

const renderProjectIcon = (iconName: string, className: string = "h-6 w-6") => {
  switch (iconName) {
    case "Sun":
      return <Sun className={className} />;
    case "Zap":
      return <Zap className={className} />;
    case "Lock":
      return <Lock className={className} />;
    case "Fan":
    case "Wind":
      return <Wind className={className} />;
    case "Bot":
      return <Bot className={className} />;
    case "Cpu":
      return <Cpu className={className} />;
    default:
      return <Layers className={className} />;
  }
};

export const ProjectsGrid: React.FC<ProjectsGridProps> = ({ projects }) => {
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  if (!projects || projects.length === 0) return null;

  // Sort projects by displayOrder
  const sortedProjects = [...projects].sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <section className="py-10">
      <div className="brand-container space-y-8 text-left">
        {/* Section Header */}
        <div className="flex items-center space-x-3">
          <div className="w-1.5 h-6 bg-accent rounded-full shrink-0" />
          <h3 className="text-xl sm:text-2xl font-extrabold text-primary tracking-tight uppercase font-display">
            PROJECTS
          </h3>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 items-stretch">
          {sortedProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className="group brand-card rounded-3xl p-5 sm:p-6 bg-white border border-[#E7E0D2] shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer flex flex-col justify-between text-center items-center h-full"
            >
              <div className="space-y-4 flex flex-col items-center w-full">
                {/* Icon Box */}
                <div className="p-3.5 rounded-2xl bg-accent/15 text-primary group-hover:bg-accent group-hover:scale-110 transition-all duration-300 shrink-0">
                  {renderProjectIcon(project.iconName, "h-6 w-6")}
                </div>

                {/* Title & Short Description */}
                <div className="space-y-1.5 w-full">
                  <h4 className="font-extrabold text-sm sm:text-base text-primary group-hover:text-primary-dark transition-colors line-clamp-1 font-display">
                    {project.title}
                  </h4>
                  <p className="text-xs text-text/80 line-clamp-3 leading-relaxed font-medium">
                    {project.shortDescription}
                  </p>
                </div>
              </div>

              {/* View Details Link */}
              <div className="pt-4 flex items-center justify-center space-x-1.5 text-xs font-extrabold text-primary group-hover:text-accent transition-colors">
                <span>View Details</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Project Details Lightbox Modal */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="relative bg-white rounded-3xl border border-[#E7E0D2] shadow-2xl max-w-xl w-full p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between border-b border-[#E7E0D2] pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-2xl bg-accent/20 text-primary">
                  {renderProjectIcon(selectedProject.iconName, "h-6 w-6")}
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-accent block">
                    {selectedProject.category || "Engineering Project"}
                  </span>
                  <h4 className="text-lg font-extrabold text-primary font-display mt-0.5">
                    {selectedProject.title}
                  </h4>
                </div>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="p-2 rounded-full hover:bg-bg-soft text-primary transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <h5 className="text-xs font-extrabold text-primary uppercase tracking-wider">
                Project Overview & Scope
              </h5>
              <p className="text-xs sm:text-sm text-text/90 leading-relaxed font-medium">
                {selectedProject.fullDescription || selectedProject.shortDescription}
              </p>
            </div>

            {/* Tech Stack Chips */}
            {selectedProject.technologies && selectedProject.technologies.length > 0 && (
              <div className="space-y-2 pt-2">
                <h5 className="text-xs font-extrabold text-primary uppercase tracking-wider">
                  Tools & Technologies Used
                </h5>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-bg-soft border border-[#E7E0D2] text-xs font-extrabold text-primary"
                    >
                      <CheckCircle className="h-3 w-3 text-accent" />
                      <span>{tech}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Footer Close Button */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedProject(null)}
                className="primary-btn px-5 py-2 text-xs"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
