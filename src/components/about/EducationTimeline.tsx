"use client";

import React from "react";
import { EducationItem } from "@/data/about";

interface EducationTimelineProps {
  education: EducationItem[];
}

export const EducationTimeline: React.FC<EducationTimelineProps> = ({ education }) => {
  if (!education || education.length === 0) return null;

  // Sort by display order
  const sortedEdu = [...education].sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <section className="py-10">
      <div className="brand-container space-y-8">
        {/* Section Header */}
        <div className="flex items-center space-x-3 text-left">
          <div className="w-1.5 h-6 bg-accent rounded-full shrink-0" />
          <h3 className="text-xl sm:text-2xl font-extrabold text-primary tracking-tight uppercase font-display">
            EDUCATION
          </h3>
        </div>

        {/* Timeline Container */}
        <div className="brand-card rounded-3xl p-6 sm:p-10 bg-white border border-[#E7E0D2] shadow-md relative overflow-hidden">
          {/* Horizontal Desktop Timeline Track */}
          <div className="hidden lg:block relative py-6">
            {/* Connecting Track Line */}
            <div className="absolute top-1/2 left-12 right-12 h-0.5 bg-[#E7E0D2] -translate-y-1/2 z-0" />

            <div className="grid grid-cols-4 gap-6 relative z-10">
              {sortedEdu.map((item) => (
                <div key={item.id} className="flex flex-col items-center text-center group">
                  {/* Year Node */}
                  <div className="px-3.5 py-1 rounded-full bg-accent/20 border border-accent text-primary text-xs font-extrabold shadow-xs mb-6 group-hover:bg-accent group-hover:scale-110 transition-all duration-300">
                    {item.year}
                  </div>

                  {/* Degree & Institution Details */}
                  <div className="space-y-1.5 w-full px-2">
                    <h4 className="font-extrabold text-base text-primary group-hover:text-primary-dark transition-colors font-display">
                      {item.degree}
                    </h4>
                    <p className="text-xs text-muted font-bold truncate">
                      {item.institution}
                    </p>
                    {item.gpa && (
                      <span className="inline-block text-xs font-extrabold text-primary/80 pt-1">
                        {item.gpa}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Vertical Mobile / Tablet Timeline Track */}
          <div className="lg:hidden space-y-8 relative pl-6 border-l-2 border-[#E7E0D2] ml-2 py-2">
            {sortedEdu.map((item) => (
              <div key={item.id} className="relative group pl-4 text-left">
                {/* Node Dot */}
                <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-white border-3 border-accent group-hover:scale-125 transition-transform" />

                <div className="inline-block px-3 py-0.5 rounded-full bg-accent/20 text-primary text-xs font-extrabold mb-1.5">
                  {item.year}
                </div>
                <h4 className="font-extrabold text-base text-primary font-display">
                  {item.degree}
                </h4>
                <p className="text-xs text-muted font-bold">
                  {item.institution}
                </p>
                {item.gpa && (
                  <span className="block text-xs font-extrabold text-primary/80 mt-1">
                    {item.gpa}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
