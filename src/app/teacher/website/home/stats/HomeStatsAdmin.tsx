"use client";

import React, { useState } from "react";
import { Check, Loader2, Plus, Trash2, MoveUp, MoveDown } from "lucide-react";
import toast from "react-hot-toast";
import { updatePageSection } from "@/features/website-cms/actions/content-actions";
import { stats as defaultStats } from "@/data/site";

export default function HomeStatsAdmin({ initialSectionData }: { initialSectionData: any }) {
  const content = initialSectionData?.content || {};
  const [stats, setStats] = useState<any[]>(content.stats || defaultStats);
  const [isSaving, setIsSaving] = useState(false);

  const availableIcons = ["Award", "Users", "GraduationCap", "CheckCircle"];

  const handleStatChange = (index: number, field: string, value: string) => {
    const updatedStats = [...stats];
    updatedStats[index] = { ...updatedStats[index], [field]: value };
    setStats(updatedStats);
  };

  const addStat = () => {
    setStats([...stats, { iconName: "Award", number: "100+", label: "New Stat", description: "Stat description" }]);
  };

  const removeStat = (index: number) => {
    const updatedStats = stats.filter((_, i) => i !== index);
    setStats(updatedStats);
  };

  const moveStat = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index > 0) {
      const updatedStats = [...stats];
      const temp = updatedStats[index - 1];
      updatedStats[index - 1] = updatedStats[index];
      updatedStats[index] = temp;
      setStats(updatedStats);
    } else if (direction === "down" && index < stats.length - 1) {
      const updatedStats = [...stats];
      const temp = updatedStats[index + 1];
      updatedStats[index + 1] = updatedStats[index];
      updatedStats[index] = temp;
      setStats(updatedStats);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updatePageSection("HOME", "HOME_STATS", {
        status: "PUBLISHED",
        content: { stats }
      });
      toast.success("Home stats updated successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to update home stats");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-border">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <div>
          <h2 className="text-lg font-bold">Trust Statistics</h2>
          <p className="text-sm text-gray-500 mt-1">These 4 cards appear right below the hero section.</p>
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

      <div className="space-y-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="p-4 border border-border rounded-xl bg-gray-50/50 relative">
            <div className="absolute top-4 right-4 flex space-x-2">
              <button
                onClick={() => moveStat(idx, "up")}
                disabled={idx === 0}
                className="p-2 text-gray-500 hover:text-primary hover:bg-white rounded-lg border border-transparent hover:border-border transition-colors disabled:opacity-50"
              >
                <MoveUp className="w-4 h-4" />
              </button>
              <button
                onClick={() => moveStat(idx, "down")}
                disabled={idx === stats.length - 1}
                className="p-2 text-gray-500 hover:text-primary hover:bg-white rounded-lg border border-transparent hover:border-border transition-colors disabled:opacity-50"
              >
                <MoveDown className="w-4 h-4" />
              </button>
              <button
                onClick={() => removeStat(idx)}
                className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-100 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <h3 className="font-bold text-gray-700 mb-4">Stat #{idx + 1}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Number / Value</label>
                <input
                  type="text"
                  value={stat.number}
                  onChange={(e) => handleStatChange(idx, "number", e.target.value)}
                  placeholder="e.g. 10+"
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent font-bold"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Label</label>
                <input
                  type="text"
                  value={stat.label}
                  onChange={(e) => handleStatChange(idx, "label", e.target.value)}
                  placeholder="e.g. Years Experience"
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-1">Description</label>
                <input
                  type="text"
                  value={stat.description}
                  onChange={(e) => handleStatChange(idx, "description", e.target.value)}
                  placeholder="e.g. Teaching Physics & Mathematics"
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Icon</label>
                <select
                  value={stat.iconName}
                  onChange={(e) => handleStatChange(idx, "iconName", e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent"
                >
                  {availableIcons.map((icon) => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={addStat}
        className="flex items-center space-x-2 text-sm text-primary font-medium hover:text-accent transition-colors mt-6"
      >
        <Plus className="w-4 h-4" />
        <span>Add Stat</span>
      </button>
    </div>
  );
}
