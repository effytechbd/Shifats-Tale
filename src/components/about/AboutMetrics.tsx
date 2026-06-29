"use client";

import React from "react";
import { GraduationCap, UserCheck, BookOpen, Award, Code } from "lucide-react";
import { MetricItem } from "@/data/about";

interface AboutMetricsProps {
  metrics: MetricItem[];
}

const renderMetricIcon = (iconName: string, className: string = "h-6 w-6") => {
  switch (iconName) {
    case "GraduationCap":
      return <GraduationCap className={className} />;
    case "UserCheck":
      return <UserCheck className={className} />;
    case "BookOpen":
      return <BookOpen className={className} />;
    case "Award":
      return <Award className={className} />;
    case "Code":
      return <Code className={className} />;
    default:
      return <GraduationCap className={className} />;
  }
};

export const AboutMetrics: React.FC<AboutMetricsProps> = ({ metrics }) => {
  if (!metrics || metrics.length === 0) return null;

  return (
    <section className="py-6">
      <div className="brand-container">
        <div className="brand-card rounded-3xl p-6 sm:p-8 bg-white border border-[#E7E0D2] shadow-md">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 divide-y lg:divide-y-0 lg:divide-x divide-[#E7E0D2]/80">
            {metrics.map((item, idx) => (
              <div
                key={item.id}
                className={`flex items-center space-x-4 ${
                  idx > 0 ? "pt-6 lg:pt-0 lg:pl-8" : ""
                }`}
              >
                <div className="p-3.5 rounded-2xl bg-accent/15 text-primary shrink-0">
                  {renderMetricIcon(item.iconName, "h-6 w-6 sm:h-7 sm:w-7")}
                </div>
                <div className="min-w-0 flex-1">
                  <span className="block text-xs font-bold text-muted uppercase tracking-wider">
                    {item.label}
                  </span>
                  <h4 className="font-extrabold text-sm sm:text-base lg:text-lg text-primary truncate mt-0.5 font-display">
                    {item.value}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
