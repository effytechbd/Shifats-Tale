"use client";

import React, { useState } from "react";
import { Loader2, Plus, Trash2, Save } from "lucide-react";
import toast from "react-hot-toast";
import { updatePageSection } from "@/features/website-cms/actions/content-actions";
import { useSiteSettings } from "@/lib/providers/SiteSettingsProvider";

export default function HomeHeroAdmin({ initialSectionData }: { initialSectionData: any }) {
  const siteInfo = useSiteSettings();
  const content = initialSectionData?.content || {};

  const [tagline, setTagline] = useState(content.tagline || "");
  const [headline, setHeadline] = useState(content.headline || "");
  const [description, setDescription] = useState(content.description || "");
  
  const [teacherName, setTeacherName] = useState(content.teacherName || "");
  const [teacherTitle, setTeacherTitle] = useState(content.teacherTitle || "");
  const [teacherSubtitle, setTeacherSubtitle] = useState(content.teacherSubtitle || "");
  const [teacherImage, setTeacherImage] = useState(content.teacherImage || "");

  const [features, setFeatures] = useState<string[]>(
    content.features || ["Offline classes", "Weekly exams", "Personal guidance", "Lecture sheets"]
  );

  const [isSaving, setIsSaving] = useState(false);

  const handleFeatureChange = (index: number, value: string) => {
    const updatedFeatures = [...features];
    updatedFeatures[index] = value;
    setFeatures(updatedFeatures);
  };

  const addFeature = () => {
    setFeatures([...features, ""]);
  };

  const removeFeature = (index: number) => {
    const updatedFeatures = features.filter((_, i) => i !== index);
    setFeatures(updatedFeatures);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updatePageSection("HOME", "HOME_HERO", {
        status: "PUBLISHED",
        content: {
          tagline,
          headline,
          description,
          teacherName,
          teacherTitle,
          teacherSubtitle,
          teacherImage,
          features: features.filter(f => f.trim() !== "")
        }
      });
      toast.success("Home hero section saved successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to save home hero section");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-border space-y-4">
        <h2 className="text-lg font-bold border-b pb-2">Hero Text</h2>
        
        <div>
          <label className="block text-sm font-semibold mb-1">
            Tagline (e.g. Admissions Open...) 
            <span className="text-xs text-gray-500 font-normal ml-2">Leave blank to use Global Setting</span>
          </label>
          <input
            type="text"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            placeholder={`Global: ${siteInfo.tagline}`}
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold mb-1">
            Headline
            <span className="text-xs text-gray-500 font-normal ml-2">Leave blank to use Global Setting</span>
          </label>
          <input
            type="text"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            placeholder={`Global: ${siteInfo.heroHeadline}`}
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent font-bold text-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">
            Description
            <span className="text-xs text-gray-500 font-normal ml-2">Leave blank to use Global Setting</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={`Global: ${siteInfo.heroDescription}`}
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent min-h-[100px]"
          />
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-border space-y-4">
        <h2 className="text-lg font-bold border-b pb-2">Features List</h2>
        <p className="text-sm text-gray-500">These appear as bullet points under the CTA buttons.</p>
        
        <div className="space-y-3">
          {features.map((feature, idx) => (
            <div key={idx} className="flex gap-2">
              <input
                type="text"
                value={feature}
                onChange={(e) => handleFeatureChange(idx, e.target.value)}
                placeholder="e.g. Offline classes"
                className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent"
              />
              <button
                onClick={() => removeFeature(idx)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                title="Remove Feature"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
        
        <button
          onClick={addFeature}
          className="flex items-center space-x-2 text-sm text-primary font-medium hover:text-accent transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Feature</span>
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-border space-y-4">
        <h2 className="text-lg font-bold border-b pb-2">Teacher Badge & Photo</h2>
        <p className="text-sm text-gray-500">The 3D Scene will remain exactly the same. Only the text inside the teacher badge can be edited.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">
              Teacher Name
              <span className="block text-xs text-gray-500 font-normal">Leave blank to use Global Setting</span>
            </label>
            <input
              type="text"
              value={teacherName}
              onChange={(e) => setTeacherName(e.target.value)}
              placeholder={`Global: ${siteInfo.teacherName}`}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">
              Photo URL
              <span className="block text-xs text-gray-500 font-normal">Leave blank for default photo</span>
            </label>
            <input
              type="text"
              value={teacherImage}
              onChange={(e) => setTeacherImage(e.target.value)}
              placeholder="/images/sir_photo_clean.png"
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Badge Title (Small Text)</label>
            <input
              type="text"
              value={teacherTitle}
              onChange={(e) => setTeacherTitle(e.target.value)}
              placeholder="e.g. Instructor & CEO"
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Badge Subtitle (Small Text)</label>
            <input
              type="text"
              value={teacherSubtitle}
              onChange={(e) => setTeacherSubtitle(e.target.value)}
              placeholder="e.g. EEE, CUET"
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent"
            />
          </div>
        </div>
      </div>

      {/* Save Footer - Moved to bottom like in Global Settings */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-border flex justify-between items-center">
        <p className="text-sm text-gray-500">Save changes to reflect on the Home Page Hero.</p>
        <button 
          onClick={handleSave} 
          disabled={isSaving}
          className="primary-btn flex items-center space-x-2 text-sm px-6 py-2"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Save Changes</span>
        </button>
      </div>
    </div>
  );
}
