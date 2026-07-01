"use client";

import React from "react";
import { Award, Users, GraduationCap, CheckCircle } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { stats } from "@/data/site";
import { getIconComponent } from "./stats-icons";

const getIcon = (iconName: string) => {
  let colorClass = "text-accent";
  if (iconName === "Users" || iconName === "BookOpen") colorClass = "text-primary";
  else if (iconName === "GraduationCap" || iconName === "Globe") colorClass = "text-primary-dark";
  else if (iconName === "CheckCircle" || iconName === "CheckSquare") colorClass = "text-emerald-600";
  
  return getIconComponent(iconName, `h-6 w-6 ${colorClass}`);
};

export default function TrustStats({ statsData }: { statsData?: any }) {
  const shouldReduceMotion = useReducedMotion();
  
  const displayStats = statsData?.content?.stats || stats;

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.08,
      },
    },
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: shouldReduceMotion ? 0 : 15 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5, 
        ease: "easeOut" as const
      } 
    },
  };

  return (
    <section className="relative z-10 px-4 sm:px-6 lg:px-8 mt-8">
      <div className="brand-container">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          {displayStats.map((stat: any, i: number) => (
            <motion.div
              key={i}
              variants={cardVariants}
              className="brand-card rounded-2xl p-5 sm:p-6 flex flex-col items-center text-center space-y-2 relative overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg hover:border-accent/30 group bg-white border border-border"
            >
              {/* Top border highlight on hover */}
              <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Icon wrapper */}
              <div className="bg-bg-soft p-3 rounded-xl border border-border group-hover:scale-105 transition-transform duration-300">
                {getIcon(stat.iconName)}
              </div>

              {/* Number */}
              <span className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight pt-1">
                {stat.number}
              </span>

              {/* Label */}
              <span className="text-xs sm:text-sm font-bold text-primary-dark">
                {stat.label}
              </span>

              {/* Description */}
              <span className="text-[11px] sm:text-xs text-muted font-medium">
                {stat.description}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
