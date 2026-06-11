"use client";

import React from "react";
import { Cpu, NotebookTabs, ClipboardList, MessageCircle, UserCheck, Users } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { benefits } from "@/data/site";

const getIcon = (iconName: string) => {
  switch (iconName) {
    case "UserCheck": return <UserCheck className="h-6 w-6" />;
    case "Users": return <Users className="h-6 w-6" />;
    case "ClipboardList": return <ClipboardList className="h-6 w-6" />;
    case "NotebookTabs": return <NotebookTabs className="h-6 w-6" />;
    case "MessageCircle": return <MessageCircle className="h-6 w-6" />;
    case "Cpu": return <Cpu className="h-6 w-6" />;
    default: return <UserCheck className="h-6 w-6" />;
  }
};


export default function WhyChooseSection() {
  const shouldReduceMotion = useReducedMotion();

  const headerVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" as const }
    }
  };

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
      y: shouldReduceMotion ? 0 : 20 
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
    <section id="why-choose" className="brand-section-wrapper bg-bg-soft relative">
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="brand-container">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <motion.h2
            variants={headerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-xs font-bold text-accent tracking-widest uppercase"
          >
            Our Methodology
          </motion.h2>
          <motion.p
            variants={headerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight"
          >
            Why Learn with Shifat Sir?
          </motion.p>
          <motion.p
            variants={headerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-text text-sm sm:text-base"
          >
            We go beyond standard classroom setups. Our ecosystem focuses on core conceptual depth, solving techniques, and keeping students highly accountable.
          </motion.p>
        </div>

        {/* Benefits Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {benefits.map((benefit, idx) => (
            <motion.div
              key={idx}
              variants={cardVariants}
              className="brand-card rounded-2xl p-6 flex flex-col space-y-4 relative group hover:bg-white hover:-translate-y-1 hover:scale-[1.01] hover:shadow-md hover:border-accent/40 transition-all duration-300 ease-out border border-border"
            >
              {/* Top border highlight on hover */}
              <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Icon Container */}
              <div className="p-3 rounded-xl border shrink-0 w-12 h-12 flex items-center justify-center transition-transform group-hover:scale-105 duration-300 text-primary bg-bg border-border">
                {getIcon(benefit.iconName)}
              </div>

              {/* Content */}
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-primary group-hover:text-primary-dark transition-colors">
                  {benefit.title}
                </h3>
                <p className="text-sm text-text leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
