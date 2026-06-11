"use client";

import React from "react";
import { Cpu, NotebookTabs, ClipboardList, MessageCircle, UserCheck, Users } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

interface Benefit {
  title: string;
  description: string;
  icon: React.ReactNode;
  colorClass: string;
}

const benefits: Benefit[] = [
  {
    title: "Personal Guidance",
    description: "Direct mentorship from Shifat Sir, including target goal planning, parent alignment feedback, and personalized tracking.",
    icon: <UserCheck className="h-6 w-6" />,
    colorClass: "text-primary bg-bg border-border",
  },
  {
    title: "Small Batch Environment",
    description: "Intentionally capped intake (max 30 candidates per batch) to make sure no student sits silently with unresolved doubts.",
    icon: <Users className="h-6 w-6" />,
    colorClass: "text-primary bg-bg border-border",
  },
  {
    title: "Weekly Exams",
    description: "Rigorous weekly quizzes, board-standard creative questions, and mock evaluations to build test-taking confidence.",
    icon: <ClipboardList className="h-6 w-6" />,
    colorClass: "text-primary bg-bg border-border",
  },
  {
    title: "Lecture Sheets",
    description: "Curated worksheets, handwritten concept books, and mathematical shortcut checklists compiled directly by Shifat Sir.",
    icon: <NotebookTabs className="h-6 w-6" />,
    colorClass: "text-primary bg-bg border-border",
  },
  {
    title: "Doubt Solving",
    description: "Designated solving classes and active online Q&A groups to answer every individual student query step-by-step.",
    icon: <MessageCircle className="h-6 w-6" />,
    colorClass: "text-primary bg-bg border-border",
  },
  {
    title: "Concept-Based Teaching",
    description: "We focus on the underlying physical laws and mathematical proofs, helping students visualize concepts instead of memorizing.",
    icon: <Cpu className="h-6 w-6" />,
    colorClass: "text-primary bg-bg border-border",
  }
];

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
              <div className={`p-3 rounded-xl border shrink-0 w-12 h-12 flex items-center justify-center transition-transform group-hover:scale-105 duration-300 ${benefit.colorClass}`}>
                {benefit.icon}
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
