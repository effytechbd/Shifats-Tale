"use client";

import React, { useState } from "react";
import { Check, Loader2, Plus, Trash2, ArrowUp, ArrowDown, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";
import { updatePageSection } from "@/features/website-cms/actions/content-actions";
import { youtubeClasses as defaultYoutubeClasses, YouTubeClass } from "@/data/youtubeClasses";
import { MediaSelector } from "@/features/website-cms/components/MediaSelector";

export default function YoutubeAdmin({ initialSectionData }: { initialSectionData: any }) {
  const content = initialSectionData?.content || {};
  const [classes, setClasses] = useState<YouTubeClass[]>(content.classes || defaultYoutubeClasses);
  const [headerData, setHeaderData] = useState(content.header || {
    badge: "Concept Lectures",
    title: "Concept Breakdown Theater",
    description: "Experience Shifat Sir's pedagogy. Select a lecture from the playlist below to load it directly into the theater screen.",
    moreTitle: "More free lectures",
    moreText: "Watch dozens of detailed concept breakdowns, board solutions, and shortcuts on Sir's official channel.",
    playlistTitle: "Playlist Classes"
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [mediaTarget, setMediaTarget] = useState<number | null>(null);

  const addClass = () => {
    const newClass: YouTubeClass = {
      id: `yt-${Date.now()}`,
      title: "New Video Title",
      subject: "Subject",
      chapter: "Chapter Name",
      teacher: "Md. Zia Uddin Azad Sifat",
      duration: "00:00:00",
      thumbnailUrl: "",
      youtubeUrl: "https://www.youtube.com/watch?v=...",
      topic: "Topic Name",
      embedId: "",
      views: "1K"
    };
    setClasses([...classes, newClass]);
  };

  const removeClass = (index: number) => {
    const updated = classes.filter((_, i) => i !== index);
    setClasses(updated);
  };

  const updateClass = (index: number, field: keyof YouTubeClass, value: string) => {
    const updated = [...classes];
    updated[index] = { ...updated[index], [field]: value };
    // Auto-extract embed ID if YouTube URL is updated
    if (field === 'youtubeUrl') {
      const match = value.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&]{11})/);
      if (match && match[1]) {
        updated[index].embedId = match[1];
      }
    }
    setClasses(updated);
  };

  const moveClass = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index > 0) {
      const updated = [...classes];
      [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
      setClasses(updated);
    } else if (direction === 'down' && index < classes.length - 1) {
      const updated = [...classes];
      [updated[index + 1], updated[index]] = [updated[index], updated[index + 1]];
      setClasses(updated);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updatePageSection("HOME", "HOME_YOUTUBE_CLASSES", {
        status: "PUBLISHED",
        content: { classes, header: headerData }
      });
      toast.success("YouTube Classes section saved successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to save YouTube Classes section");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end mb-4">
        <button 
          onClick={handleSave} 
          disabled={isSaving}
          className="primary-btn flex items-center space-x-2 text-sm px-6 py-2"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
          <span>Save Changes</span>
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-border space-y-6">
        <h3 className="text-lg font-bold text-[#08132E] border-b pb-2">Section Header & Texts</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">Badge Text</label>
            <input
              type="text"
              value={headerData.badge}
              onChange={(e) => setHeaderData({ ...headerData, badge: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">Main Title</label>
            <input
              type="text"
              value={headerData.title}
              onChange={(e) => setHeaderData({ ...headerData, title: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-1 text-gray-700">Description</label>
            <textarea
              value={headerData.description}
              onChange={(e) => setHeaderData({ ...headerData, description: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent"
              rows={2}
            />
          </div>
          
          <div className="md:col-span-2 mt-4">
            <h4 className="text-md font-semibold text-gray-800 border-b pb-2 mb-4">Sidebar & More Videos Card</h4>
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">Playlist Sidebar Title</label>
            <input
              type="text"
              value={headerData.playlistTitle}
              onChange={(e) => setHeaderData({ ...headerData, playlistTitle: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">More Lectures Title</label>
            <input
              type="text"
              value={headerData.moreTitle}
              onChange={(e) => setHeaderData({ ...headerData, moreTitle: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-1 text-gray-700">More Lectures Description</label>
            <input
              type="text"
              value={headerData.moreText}
              onChange={(e) => setHeaderData({ ...headerData, moreText: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent"
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-border space-y-6">
        <div className="flex justify-between items-center border-b pb-4">
          <h3 className="text-lg font-bold text-[#08132E]">YouTube Classes List</h3>
          <button 
            onClick={addClass}
            className="flex items-center space-x-1 text-sm text-primary hover:text-accent font-semibold"
          >
            <Plus className="w-4 h-4" />
            <span>Add Class</span>
          </button>
        </div>

        <div className="space-y-6">
          {classes.map((cls, idx) => (
            <div key={cls.id || idx} className="border border-border rounded-xl p-6 relative bg-gray-50/50">
              <div className="absolute top-4 right-4 flex space-x-2">
                <button
                  onClick={() => moveClass(idx, 'up')}
                  disabled={idx === 0}
                  className="p-1.5 bg-white border border-border rounded-md text-gray-500 hover:text-primary disabled:opacity-30 transition-colors"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => moveClass(idx, 'down')}
                  disabled={idx === classes.length - 1}
                  className="p-1.5 bg-white border border-border rounded-md text-gray-500 hover:text-primary disabled:opacity-30 transition-colors"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
                <button
                  onClick={() => removeClass(idx)}
                  className="p-1.5 bg-white border border-red-200 rounded-md text-red-500 hover:bg-red-50 transition-colors ml-2"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Thumbnail Column */}
                <div className="md:col-span-3 flex flex-col items-center justify-center space-y-3">
                  <div className="w-full aspect-video rounded-lg overflow-hidden border border-border bg-gray-100 flex items-center justify-center relative shadow-sm">
                    {cls.thumbnailUrl ? (
                      <Image 
                        src={cls.thumbnailUrl} 
                        alt="Thumbnail" 
                        fill 
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 300px"
                      />
                    ) : cls.embedId ? (
                      <Image 
                        src={`https://img.youtube.com/vi/${cls.embedId}/maxresdefault.jpg`} 
                        alt="YouTube Thumbnail" 
                        fill 
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 300px"
                      />
                    ) : (
                      <ImageIcon className="w-10 h-10 text-gray-300" />
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setMediaTarget(idx);
                      setIsMediaModalOpen(true);
                    }}
                    className="text-xs font-semibold text-primary hover:text-accent border border-primary/20 bg-white rounded-full px-3 py-1.5"
                  >
                    Custom Thumbnail (Optional)
                  </button>
                </div>

                {/* Form Fields Column */}
                <div className="md:col-span-9 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold mb-1 text-gray-700">Video Title</label>
                    <input
                      type="text"
                      value={cls.title}
                      onChange={(e) => updateClass(idx, 'title', e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-accent"
                    />
                  </div>
                  
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold mb-1 text-gray-700">YouTube URL</label>
                    <input
                      type="text"
                      value={cls.youtubeUrl}
                      onChange={(e) => updateClass(idx, 'youtubeUrl', e.target.value)}
                      placeholder="e.g. https://www.youtube.com/watch?v=..."
                      className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-accent bg-blue-50/30"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1 text-gray-700">Subject</label>
                    <input
                      type="text"
                      value={cls.subject}
                      onChange={(e) => updateClass(idx, 'subject', e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-gray-700">Chapter</label>
                    <input
                      type="text"
                      value={cls.chapter}
                      onChange={(e) => updateClass(idx, 'chapter', e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-accent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-gray-700">Topic</label>
                    <input
                      type="text"
                      value={cls.topic}
                      onChange={(e) => updateClass(idx, 'topic', e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-gray-700">Teacher</label>
                    <input
                      type="text"
                      value={cls.teacher}
                      onChange={(e) => updateClass(idx, 'teacher', e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1 text-gray-700">Duration (e.g. 45:00)</label>
                    <input
                      type="text"
                      value={cls.duration}
                      onChange={(e) => updateClass(idx, 'duration', e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-gray-700">Views (e.g. 1.5K)</label>
                    <input
                      type="text"
                      value={cls.views || ""}
                      onChange={(e) => updateClass(idx, 'views', e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {classes.length === 0 && (
            <div className="p-8 text-center text-gray-500 border-2 border-dashed border-border rounded-xl">
              No YouTube classes added yet.
            </div>
          )}
        </div>
      </div>

      {isMediaModalOpen && mediaTarget !== null && (
        <MediaSelector
          folderKey="youtube"
          onSelect={(url) => {
            updateClass(mediaTarget, 'thumbnailUrl', url);
            setIsMediaModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
