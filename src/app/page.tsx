"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

      // Smooth scroll to the teacher section
      const offsetTop = teacherSection.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth"
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
              duration: 1.1, // Aligns perfectly with standard smooth scrolling speed
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
              <img
                src="/images/sir_photo_clean.png"
                alt=""
                className="w-full h-full object-contain object-bottom filter drop-shadow-[0_15px_30px_rgba(1,14,98,0.22)]"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
