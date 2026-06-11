"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, animate } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/home/HeroSection";
import TrustStats from "@/components/home/TrustStats";
import CoursesSection from "@/components/home/CoursesSection";
import WhyChooseSection from "@/components/home/WhyChooseSection";
import TeacherSection from "@/components/home/TeacherSection";
import ResultsSection from "@/components/home/ResultsSection";
import YouTubeClassesSection from "@/components/home/YouTubeClassesSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import GallerySection from "@/components/home/GallerySection";
import FAQSection from "@/components/home/FAQSection";
import LocationSection from "@/components/home/LocationSection";
import ContactSection from "@/components/home/ContactSection";
import Footer from "@/components/layout/Footer";

export default function Home() {
  const [flyingState, setFlyingState] = useState<{
    startX: number;
    startY: number;
    startWidth: number;
    startHeight: number;
    endX: number;
    endY: number;
    endWidth: number;
    endHeight: number;
  } | null>(null);

  const handleTeacherPhotoClick = () => {
    const heroEl = document.getElementById("hero-section-photo");
    const teacherEl = document.getElementById("teacher-section-photo");
    const teacherSection = document.getElementById("teacher");

    if (heroEl && teacherEl && teacherSection) {
      const heroRect = heroEl.getBoundingClientRect();
      const teacherRect = teacherEl.getBoundingClientRect();

      // Get absolute coordinates relative to the document
      const startX = heroRect.left + window.scrollX;
      const startY = heroRect.top + window.scrollY;
      const startWidth = heroRect.width;
      const startHeight = heroRect.height;

      const endX = teacherRect.left + window.scrollX;
      const endY = teacherRect.top + window.scrollY;
      const endWidth = teacherRect.width;
      const endHeight = teacherRect.height;

      setFlyingState({
        startX,
        startY,
        startWidth,
        startHeight,
        endX,
        endY,
        endWidth,
        endHeight
      });

      // Synchronized smooth scroll to the teacher section
      const offsetTop = teacherSection.offsetTop - 80;
      const startScroll = window.scrollY;

      // Temporarily disable CSS-based smooth scroll to avoid conflicts with JS animation loop
      const originalScrollBehavior = document.documentElement.style.scrollBehavior;
      document.documentElement.style.scrollBehavior = "auto";

      animate(startScroll, offsetTop, {
        duration: 1.2,
        ease: [0.25, 1, 0.5, 1], // Perfect matching custom cubic bezier curve
        onUpdate: (latest) => {
          window.scrollTo(0, latest);
        },
        onComplete: () => {
          // Restore CSS scroll behavior once transition completes
          document.documentElement.style.scrollBehavior = originalScrollBehavior;
        }
      });
    }
  };

  const isFlying = flyingState !== null;

  return (
    <div className="min-h-screen bg-bg-soft text-text flex flex-col selection:bg-accent selection:text-primary relative">
      {/* Dynamic Header Navbar */}
      <Navbar />

      {/* Main Sections Body */}
      <main className="flex-grow">
        <HeroSection isTeacherFlying={isFlying} onImageClick={handleTeacherPhotoClick} />
        <TrustStats />
        <CoursesSection />
        <WhyChooseSection />
        <TeacherSection isTeacherFlying={isFlying} />
        <ResultsSection />
        <YouTubeClassesSection />
        <TestimonialsSection />
        <LocationSection />
        <GallerySection />
        <FAQSection />
        <ContactSection />
      </main>

      {/* Page Layout Footer */}
      <Footer />

      {/* Flying 3D Teacher Portrait Animation Overlay */}
      <AnimatePresence>
        {flyingState && (
          <motion.div
            initial={{
              left: flyingState.startX,
              top: flyingState.startY,
              width: flyingState.startWidth,
              height: flyingState.startHeight,
              opacity: 1,
              rotateY: 0,
              rotateX: 0,
              rotateZ: 0,
              scale: 1,
            }}
            animate={{
              left: flyingState.endX,
              top: flyingState.endY,
              width: flyingState.endWidth,
              height: flyingState.endHeight,
              opacity: [1, 1, 1, 0.9, 1], // Subtle flash of light
              rotateY: [0, 45, -25, 0], // Gorgeous 3D rotations during flight
              rotateX: [0, 15, -10, 0],
              rotateZ: [0, -12, 6, 0],
              scale: [1, 1.10, 0.95, 1], // Grows slightly on takeoff, lands firmly
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 1.2, // Perfect matched duration for flight and scroll
              ease: [0.25, 1, 0.5, 1], // Smooth custom cubic bezier easing
            }}
            onAnimationComplete={() => {
              setFlyingState(null);
            }}
            style={{
              position: "absolute",
              pointerEvents: "none",
              zIndex: 9999,
              transformStyle: "preserve-3d",
              backfaceVisibility: "hidden",
            }}
          >
            <div className="w-full h-full relative" style={{ perspective: 1000 }}>
              {/* Premium gold glow trail following the flight */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{
                  opacity: [0, 0.6, 0.6, 0],
                  scale: [0.5, 1.25, 1.1, 0.5],
                }}
                transition={{
                  duration: 1.2,
                  ease: [0.25, 1, 0.5, 1],
                }}
                className="absolute inset-0 bg-accent/20 rounded-full blur-3xl -z-10"
              />
              <img
                src="/images/sir_photo_clean.png"
                alt=""
                className="w-full h-full object-contain object-bottom filter drop-shadow-[0_20px_40px_rgba(1,14,98,0.25)]"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
