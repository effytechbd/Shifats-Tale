"use client";

import React, { useState, useEffect } from "react";
import { testimonials } from "@/data/testimonials";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

export default function TestimonialsSection() {
  const shouldReduceMotion = useReducedMotion();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const [isHovered, setIsHovered] = useState(false);

  // Auto-play mechanism
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      handleNext();
    }, 6000); // Swap every 6 seconds
    return () => clearInterval(interval);
  }, [isHovered, currentIndex]);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleDotClick = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const handleDragEnd = (event: any, info: any) => {
    const swipeThreshold = 50;
    if (info.offset.x > swipeThreshold) {
      handlePrev();
    } else if (info.offset.x < -swipeThreshold) {
      handleNext();
    }
  };

  const activeTestimonial = testimonials[currentIndex];

  const slideVariants = {
    enter: (dir: number) => ({
      x: shouldReduceMotion ? 0 : dir > 0 ? 180 : -180,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: "spring" as const, stiffness: 120, damping: 20 },
        opacity: { duration: 0.3 },
      },
    },
    exit: (dir: number) => ({
      x: shouldReduceMotion ? 0 : dir > 0 ? -180 : 180,
      opacity: 0,
      transition: {
        x: { type: "spring" as const, stiffness: 120, damping: 20 },
        opacity: { duration: 0.3 },
      },
    }),
  };

  const headerVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" as const }
    }
  };

  return (
    <section id="testimonials" className="brand-section-wrapper bg-bg-soft relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-0 w-80 h-80 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="brand-container relative">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <motion.h2
            variants={headerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-xs font-bold text-accent tracking-widest uppercase"
          >
            Testimonials
          </motion.h2>
          <motion.p
            variants={headerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight"
          >
            What Parents & Students Say
          </motion.p>
          <motion.p
            variants={headerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-text text-sm sm:text-base"
          >
            Honest feedback from students who achieved Board A+ and cracked engineering university admissions under Shifat Sir's guidance.
          </motion.p>
        </div>

        {/* Carousel Container */}
        <div 
          className="relative max-w-5xl mx-auto w-full px-4 sm:px-16"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Carousel Track with drag gestures */}
          <div className="overflow-hidden w-full relative min-h-[350px] sm:min-h-[260px] flex items-center justify-center">
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.6}
                onDragEnd={handleDragEnd}
                className="w-full absolute cursor-grab active:cursor-grabbing flex justify-center"
              >
                <div className="brand-card rounded-3xl p-8 sm:p-10 md:p-12 flex flex-col justify-between relative bg-white border border-border group hover:shadow-md hover:border-accent/30 transition-all duration-300 w-full max-w-4xl select-none">
                  {/* Double quote background icon - scales and highlights on card hover */}
                  <Quote className="absolute right-8 top-8 h-16 w-16 text-bg/85 group-hover:text-accent/10 group-hover:scale-110 transition-all duration-300 pointer-events-none" />

                  <div className="space-y-5 relative z-10">
                    {/* Stars */}
                    <div className="flex items-center space-x-1.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-accent text-accent" />
                      ))}
                    </div>

                    {/* Quote Content */}
                    <p className="text-text text-base sm:text-lg md:text-xl font-medium leading-relaxed italic group-hover:text-primary-dark transition-colors">
                      "{activeTestimonial.quote}"
                    </p>
                  </div>

                  {/* User Identity Info */}
                  <div className="pt-6 border-t border-border mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-extrabold text-primary text-base sm:text-lg md:text-xl group-hover:text-primary transition-colors">
                        {activeTestimonial.name}
                      </h4>
                      <span className="text-xs sm:text-sm text-muted block mt-0.5 font-semibold">
                        {activeTestimonial.batch}
                      </span>
                    </div>
                    
                    {activeTestimonial.achievement && (
                      <span className="text-xs sm:text-sm font-bold text-primary bg-bg px-3.5 py-1.5 rounded-xl border border-border max-w-full sm:max-w-[280px] text-left sm:text-right truncate group-hover:border-accent/20 transition-all">
                        {activeTestimonial.achievement}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Arrows (Desktop) */}
          <button
            onClick={handlePrev}
            className="absolute left-0 md:left-[-16px] top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-border bg-white flex items-center justify-center text-primary hover:text-accent hover:border-accent/40 shadow-sm hover:shadow transition-all duration-200 z-20 cursor-pointer hidden sm:flex"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-0 md:right-[-16px] top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-border bg-white flex items-center justify-center text-primary hover:text-accent hover:border-accent/40 shadow-sm hover:shadow transition-all duration-200 z-20 cursor-pointer hidden sm:flex"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>

        {/* Mobile Navigation Controls & Indicator Dots */}
        <div className="flex flex-col items-center justify-center gap-4 mt-8">
          {/* Arrow Buttons (Mobile only) */}
          <div className="flex items-center space-x-4 sm:hidden">
            <button
              onClick={handlePrev}
              className="w-10 h-10 rounded-full border border-border bg-white flex items-center justify-center text-primary active:text-accent active:border-accent shadow-sm"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={handleNext}
              className="w-10 h-10 rounded-full border border-border bg-white flex items-center justify-center text-primary active:text-accent active:border-accent shadow-sm"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Dots */}
          <div className="flex items-center justify-center space-x-2.5">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${index === currentIndex ? "w-7 bg-accent" : "w-2.5 bg-border hover:bg-muted-dark"}`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
