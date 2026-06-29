"use client";

import React from "react";
import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { ProfileInfo } from "@/data/about";

interface AboutHeroProps {
  profile: ProfileInfo;
}

export const AboutHero: React.FC<AboutHeroProps> = ({ profile }) => {
  return (
    <section className="relative pt-6 pb-12 lg:pt-10 lg:pb-16 overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-accent/8 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="brand-container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* =========================================================================
              LEFT COLUMN: TEXT CONTENT & CONTACT CHIPS
              ========================================================================= */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-7 flex flex-col justify-center space-y-6 text-left"
          >
            {/* Eyebrow Pill */}
            <div className="flex items-center space-x-2 text-xs font-extrabold uppercase tracking-widest text-accent">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span>ABOUT ME</span>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-primary tracking-tight leading-[1.1] font-display">
              {profile.name}
            </h1>

            {/* Sub-titles */}
            <div className="space-y-1">
              <p className="text-xs sm:text-sm font-extrabold text-accent uppercase tracking-widest">
                {profile.role}
              </p>
              <p className="text-sm sm:text-base font-extrabold text-primary tracking-wide uppercase">
                {profile.organization}
              </p>
            </div>

            {/* Professional Summary */}
            <p className="text-sm sm:text-base text-text/85 leading-relaxed max-w-xl font-medium">
              {profile.summary}
            </p>

            {/* Contact Chips Grid */}
            <div className="pt-2 flex flex-wrap gap-3.5 items-center">
              {/* Email Chip */}
              {profile.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="inline-flex items-center space-x-2.5 px-4 py-2.5 rounded-2xl bg-white border border-[#E7E0D2] shadow-xs hover:border-accent/60 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group"
                >
                  <div className="p-1.5 rounded-lg bg-accent/15 text-primary group-hover:bg-accent group-hover:text-primary transition-colors">
                    <Mail className="h-4 w-4" />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-primary truncate">{profile.email}</span>
                </a>
              )}

              {/* Phone Chip */}
              {profile.phone && (
                <a
                  href={`tel:${profile.phone.replace(/[\s-]/g, "")}`}
                  className="inline-flex items-center space-x-2.5 px-4 py-2.5 rounded-2xl bg-white border border-[#E7E0D2] shadow-xs hover:border-accent/60 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group"
                >
                  <div className="p-1.5 rounded-lg bg-accent/15 text-primary group-hover:bg-accent group-hover:text-primary transition-colors">
                    <Phone className="h-4 w-4" />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-primary shrink-0">{profile.phone}</span>
                </a>
              )}

              {/* Location Chip */}
              {profile.location && (
                <div className="inline-flex items-center space-x-2.5 px-4 py-2.5 rounded-2xl bg-white border border-[#E7E0D2] shadow-xs">
                  <div className="p-1.5 rounded-lg bg-accent/15 text-primary">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-primary shrink-0">{profile.location}</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* =========================================================================
              RIGHT COLUMN: PORTRAIT PHOTO & GEOMETRIC DECORATIVE ARTWORK
              ========================================================================= */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="lg:col-span-5 flex items-center justify-center relative min-h-[400px] sm:min-h-[480px]"
          >
            {/* Background Circular Gold Arcs Artwork */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <svg className="w-[380px] h-[380px] sm:w-[460px] sm:h-[460px] text-accent/30" viewBox="0 0 400 400" fill="none">
                <circle cx="200" cy="200" r="170" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 6" />
                <circle cx="200" cy="200" r="130" stroke="#FBB503" strokeWidth="1" strokeOpacity="0.4" />
              </svg>
            </div>

            {/* Floating Polyhedron & Spheres Decorative Elements */}
            <div className="absolute top-6 left-4 sm:left-8 w-8 h-8 rounded-full bg-gradient-to-tr from-[#010E62] to-[#08132E] shadow-lg animate-bounce" style={{ animationDuration: "6s" }} />
            <div className="absolute bottom-12 right-2 sm:right-6 w-10 h-10 rounded-full bg-gradient-to-br from-[#FBB503] to-[#d49802] shadow-lg animate-pulse" />

            {/* Main Portrait Container */}
            <div className="relative w-full max-w-[320px] sm:max-w-[380px] aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-gradient-to-b from-white to-bg-soft flex items-end justify-center z-10">
              <Image
                src={profile.imageUrl}
                alt={profile.name}
                fill
                priority
                className="object-cover object-top filter drop-shadow-md transition-transform duration-700 hover:scale-105"
                sizes="(max-width: 768px) 100vw, 400px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent pointer-events-none" />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
