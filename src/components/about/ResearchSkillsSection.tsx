"use client";

import React, { useState } from "react";
import { BookOpen, Code, ArrowRight, X, ExternalLink } from "lucide-react";
import { ResearchThesis, PublicationItem, SkillCategory } from "@/data/about";

interface ResearchSkillsSectionProps {
  thesis: ResearchThesis;
  publications: PublicationItem[];
  skillCategories: SkillCategory[];
}

export const ResearchSkillsSection: React.FC<ResearchSkillsSectionProps> = ({
  thesis,
  publications,
  skillCategories,
}) => {
  const [showPubModal, setShowPubModal] = useState(false);

  return (
    <section className="py-8">
      <div className="brand-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* =========================================================================
              LEFT COLUMN: RESEARCH EXPERIENCE & PUBLICATIONS
              ========================================================================= */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-accent/15 text-primary">
                <BookOpen className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-extrabold text-primary tracking-tight uppercase font-display">
                RESEARCH EXPERIENCE
              </h3>
            </div>

            <div className="brand-card rounded-3xl p-6 sm:p-8 bg-white border border-[#E7E0D2] shadow-md space-y-5 h-full flex flex-col justify-between">
              <div className="space-y-4">
                {/* Thesis Header */}
                <div>
                  <span className="text-xs font-extrabold text-accent uppercase tracking-wider block mb-1">
                    {thesis.type}
                  </span>
                  <p className="text-xs text-muted font-bold">
                    Supervisor: <span className="text-primary font-extrabold">{thesis.supervisor}</span>
                  </p>
                  <p className="text-xs text-muted font-bold">
                    Co-supervisor: <span className="text-primary font-extrabold">{thesis.coSupervisors.join(", ")}</span>
                  </p>
                </div>

                {/* Thesis Title */}
                <div>
                  <h4 className="text-xs font-extrabold text-accent uppercase tracking-wider block mb-1">
                    Thesis Title
                  </h4>
                  <p className="text-sm font-extrabold text-primary leading-snug font-display">
                    &quot;{thesis.title}&quot;
                  </p>
                </div>

                {/* Key Findings Bullet Points */}
                <ul className="space-y-2 pt-1">
                  {thesis.keyFindings.map((finding, idx) => (
                    <li key={idx} className="flex items-start space-x-2.5 text-xs text-text/85 font-medium leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                      <span>{finding}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Publications CTA Button */}
              <div className="pt-4">
                <button
                  onClick={() => setShowPubModal(true)}
                  className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl border border-primary/20 text-primary text-xs font-extrabold hover:bg-primary/5 hover:border-primary transition-all duration-200 cursor-pointer"
                >
                  <span>View Publications</span>
                  <ArrowRight className="h-3.5 w-3.5 text-primary" />
                </button>
              </div>
            </div>
          </div>

          {/* =========================================================================
              RIGHT COLUMN: TECHNICAL SKILLS
              ========================================================================= */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-accent/15 text-primary">
                <Code className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-extrabold text-primary tracking-tight uppercase font-display">
                TECHNICAL SKILLS
              </h3>
            </div>

            <div className="brand-card rounded-3xl p-6 sm:p-8 bg-white border border-[#E7E0D2] shadow-md space-y-6 h-full flex flex-col justify-between">
              <div className="flex flex-wrap gap-2.5 items-center">
                {skillCategories.flatMap((cat) => cat.skills).map((skill) => (
                  <div
                    key={skill}
                    className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-bg-soft/80 border border-[#E7E0D2] hover:border-accent hover:bg-white transition-all duration-200 shadow-2xs group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-accent group-hover:scale-125 transition-transform shrink-0" />
                    <span className="text-xs sm:text-sm font-extrabold text-primary">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Publications Modal Lightbox */}
      {showPubModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="relative bg-white rounded-3xl border border-[#E7E0D2] shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200 text-left">
            <div className="flex items-center justify-between border-b border-[#E7E0D2] pb-4">
              <h4 className="text-lg font-extrabold text-primary font-display">
                Research Publications
              </h4>
              <button
                onClick={() => setShowPubModal(false)}
                className="p-2 rounded-full hover:bg-bg-soft text-primary transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              {publications.map((pub) => (
                <div key={pub.id} className="p-4 rounded-2xl bg-bg-soft/50 border border-[#E7E0D2] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-accent/20 text-primary text-[10px] font-extrabold uppercase">
                      {pub.type}
                    </span>
                    {pub.year && <span className="text-xs font-bold text-muted">{pub.year}</span>}
                  </div>
                  <h5 className="font-extrabold text-sm text-primary leading-snug">
                    {pub.title}
                  </h5>
                  {pub.venue && <p className="text-xs text-muted font-bold">{pub.venue}</p>}
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowPubModal(false)}
                className="primary-btn px-5 py-2 text-xs"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
