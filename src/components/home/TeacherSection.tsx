"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Award, GraduationCap, Users, Send } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

export default function TeacherSection() {
  const [imgSrc, setImgSrc] = useState("/images/media__1781164765908_transparent.png");
  const whatsappLink = "https://wa.me/8801879169446?text=Hello%20Shifat%20Sir%2C%20I%20would%20like%20to%20discuss%20admissions%20for%20myself%20/%20my%20child.";
  const shouldReduceMotion = useReducedMotion();

  const floatAnimation = shouldReduceMotion ? {} : {
    y: [0, -6, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut" as const
    }
  };

  const headerVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" as const }
    }
  };

  const gridContainerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.08,
      }
    }
  };

  const gridItemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" as const }
    }
  };

  return (
    <section id="teacher" className="brand-section-wrapper bg-bg relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-80 h-80 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="brand-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Teacher Image/Badge Column */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              animate={floatAnimation}
              className="relative w-full max-w-[340px] sm:max-w-[380px] aspect-[4/5] rounded-2xl overflow-hidden border border-border group bg-white shadow-sm flex flex-col justify-between p-6 hover:shadow-md hover:border-accent/30 transition-all duration-300"
            >
              {/* Photo Grid backdrop */}
              <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:16px_16px]" />

              <div className="flex-grow flex flex-col items-center justify-center py-4 relative z-10">
                <div className="relative w-44 h-44 rounded-2xl overflow-hidden border border-border shadow-sm bg-bg-soft flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                  <Image
                    src={imgSrc}
                    alt="Md. Zia Uddin Azad Sifat"
                    fill
                    sizes="176px"
                    className="object-cover object-top scale-105"
                    onError={() => setImgSrc("/images/shifat_sir.png")}
                  />
                </div>
              </div>

              {/* Float Tag */}
              <div className="bg-bg-soft border border-border p-3 rounded-xl flex items-center justify-between shadow-sm relative z-10 group-hover:border-accent/20 transition-all">
                <div>
                  <span className="block font-bold text-xs text-primary">Md. Zia Uddin Azad Sifat</span>
                  <span className="block text-[8px] text-muted font-bold uppercase tracking-wider leading-none mt-0.5">Shifat Sir</span>
                </div>
                <span className="bg-accent text-primary text-[9px] font-extrabold px-2.5 py-1 rounded shadow-sm">
                  Lead Mentor
                </span>
              </div>
            </motion.div>
          </div>

          {/* Teacher Info/Letter Column */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            <div className="space-y-3">
              <motion.h2
                variants={headerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="text-xs font-bold text-accent tracking-widest uppercase"
              >
                Meet Your Teacher
              </motion.h2>
              <motion.h3
                variants={headerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight"
              >
                Md. Zia Uddin Azad Sifat
              </motion.h3>
              <motion.p
                variants={headerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="text-primary-dark text-sm font-semibold flex items-center gap-1.5"
              >
                <GraduationCap className="h-4.5 w-4.5 text-accent animate-bounce" style={{ animationDuration: "3s" }} />
                <span>B.Sc. in Engineering | Physics & Mathematics Specialist</span>
              </motion.p>
            </div>

            {/* Short Bio */}
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-text text-sm sm:text-base leading-relaxed"
            >
              Hello, I am Md. Zia Uddin Azad Sifat (Shifat Sir). As a B.Sc. Engineer from CUET, I specialize in simplifying complex Physics and Higher Mathematics concepts. Through structured classes, weekly exams, and concept-first teaching, I guide SSC and HSC science students to excel in both board exams and engineering admission preparation.
            </motion.p>

            {/* Teaching Method Cards */}
            <div className="space-y-3">
              <span className="block text-xs font-bold text-primary-dark uppercase tracking-wider">
                Our Teaching Methodology:
              </span>
              <motion.div 
                variants={gridContainerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                {[
                  { title: "Concept-First Learning", desc: "Prioritizing complete visualization of scientific laws before solving formulas." },
                  { title: "Chapter-Wise Problem Solving", desc: "Systematic mastery of textbook exercises and math shortcuts chapter by chapter." },
                  { title: "Board Question Practice", desc: "Intensive drills using past test banks and creative question templates." },
                  { title: "Weak Student Support", desc: "Tailored doubt resolution slots and parent sync reports for student accountability." }
                ].map((method, i) => (
                  <motion.div
                    key={i}
                    variants={gridItemVariants}
                    className="brand-card p-4 bg-white border border-border rounded-xl space-y-1.5 shadow-sm hover:border-accent hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <span className="block font-extrabold text-primary text-sm">{method.title}</span>
                    <span className="block text-xs text-muted leading-relaxed font-semibold">{method.desc}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Call to Action */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center gap-4 pt-4"
            >
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="primary-btn flex items-center justify-center space-x-2 w-full sm:w-auto text-center hover:shadow-md hover:scale-[1.01] transition-all"
              >
                <Send className="h-4 w-4" />
                <span>Contact Sir</span>
              </a>
            </motion.div>

          </div>

        </div>
      </div>
    </section>
  );
}
