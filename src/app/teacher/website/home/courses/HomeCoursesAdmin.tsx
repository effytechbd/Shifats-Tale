"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Check, GripVertical, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { updatePageSection } from "@/features/website-cms/actions/content-actions";

export default function HomeCoursesAdmin({ 
  allCourses, 
  initialSelectedIds, 
  sectionId 
}: { 
  allCourses: any[], 
  initialSelectedIds: string[],
  sectionId: string 
}) {
  const [selectedIds, setSelectedIds] = useState<string[]>(initialSelectedIds || []);
  const [isSaving, setIsSaving] = useState(false);

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => 
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    if (!sectionId) return;

    try {
      setIsSaving(true);
      await updatePageSection("HOME", "HOME_FEATURED_COURSES", {
        status: "PUBLISHED",
        content: { selectedCourseIds: selectedIds }
      });
      toast.success("Home page courses updated successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to update home courses");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-border">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-bold">Select Courses</h2>
          <p className="text-sm text-gray-500">Click on a course to toggle its visibility on the Home page.</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={isSaving}
          className="primary-btn flex items-center space-x-2 text-sm px-6 py-2"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
          <span>Save Changes</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allCourses.map((course) => {
          const isSelected = selectedIds.includes(course.id);
          const meta = course.metadata || {};
          const image = course.mediaUrl || meta.fallbackImageUrl || "/placeholder.jpg";
          
          return (
            <div 
              key={course.id} 
              onClick={() => toggleSelection(course.id)}
              className={`relative cursor-pointer border rounded-xl overflow-hidden transition-all duration-200 ${
                isSelected 
                  ? "border-[#010E62] shadow-[0_0_0_2px_#010E62]" 
                  : "border-border hover:border-gray-400 hover:shadow-sm grayscale-[30%] opacity-70"
              }`}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 bg-[#010E62] text-white p-1 rounded-full z-10 shadow-md">
                  <Check className="w-4 h-4" />
                </div>
              )}
              
              <div className="relative h-40 w-full bg-gray-100">
                <Image src={image} alt={course.title} fill className="object-cover" />
              </div>
              <div className="p-4 bg-white">
                <h3 className="font-bold text-[#08132E] truncate">{course.title}</h3>
                <p className="text-xs text-gray-500 mt-1">{meta.targetClass}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
